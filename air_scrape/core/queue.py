import logging
import redis.asyncio as redis

from core.models import SearchJob

logger = logging.getLogger(__name__)


class JobQueue:
    def __init__(self, redis_url="redis://localhost:6379", queue_name="flight_search", max_retries=3):
        self.redis = redis.from_url(redis_url, decode_responses=True)
        self.queue_name = queue_name
        self.processing_queue = f"{queue_name}:processing"
        self.dead_queue = f"{queue_name}:dead"
        self.jobs_hash = f"{queue_name}:jobs"
        self.retry_hash = f"{queue_name}:retries"
        self.max_retries = max_retries

    async def enqueue(self, job: SearchJob):
        added = await self.redis.hsetnx(self.jobs_hash, job.id, job.model_dump_json())
        if not added:
            logger.info("Job already exists: %s", job.id)
            return False

        # Known limitation: a crash between hsetnx() and rpush()
        # can leave an orphaned job in jobs_hash.
        await self.redis.rpush(self.queue_name, job.id)
        logger.info("Job queued: %s", job.id)
        return True

    async def get(self):
        job_id = await self.redis.blmove(self.queue_name, self.processing_queue, 0, timeout=5)
        if job_id is None:
            return None

        job_data = await self.redis.hget(self.jobs_hash, job_id)
        if job_data is None:
            logger.error("Job data missing: %s", job_id)
            await self.redis.lrem(self.processing_queue, 1, job_id)
            return None

        return SearchJob.model_validate_json(job_data)

    async def ack(self, job: SearchJob):
        await self.redis.lrem(self.processing_queue, 1, job.id)
        await self.redis.hdel(self.jobs_hash, job.id)
        await self.redis.hdel(self.retry_hash, job.id)
        logger.info("Job acknowledged: %s", job.id)

    async def fail(self, job: SearchJob, category, reason):
        retry_count = await self.redis.hincrby(self.retry_hash, job.id, 1)
        logger.warning("Job failed | id=%s | category=%s | retry=%d | reason=%s", job.id, category, retry_count, reason)

        await self.redis.lrem(self.processing_queue, 1, job.id)

        if category in {"retryable", "timeout", "block_signal"} and retry_count <= self.max_retries:
            await self.redis.rpush(self.queue_name, job.id)
            logger.info("Job requeued | id=%s | retry=%d/%d", job.id, retry_count, self.max_retries)
            return

        await self.redis.rpush(self.dead_queue, job.id)
        await self.redis.hdel(self.jobs_hash, job.id)
        await self.redis.hdel(self.retry_hash, job.id)
        logger.error("Job moved to dead queue | id=%s | retries=%d", job.id, retry_count)

    async def close(self):
        await self.redis.aclose()