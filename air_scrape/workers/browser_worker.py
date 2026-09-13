import asyncio
import logging
import os
from pathlib import Path
from workers.browser_manager import BrowserManager

logger = logging.getLogger(__name__)

SCRAPE_TIMEOUT = 120
QUEUE_ERROR_BACKOFF = 5
MAX_QUEUE_ERRORS = 5
OUTPUT_PATH = Path("data/flight_data.jsonl")
write_lock = asyncio.Lock()

async def save_results(results):
    lines = [record.model_dump_json() for record in results]
    if not lines:
        return

    async with write_lock:
        def _write():
            OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
            with OUTPUT_PATH.open("a", encoding="utf-8") as f:
                for line in lines:
                    f.write(line + "\n")
                f.flush()
                os.fsync(f.fileno())

        await asyncio.to_thread(_write)

class RetryableJobError(Exception):
    pass


class PermanentJobError(Exception):
    pass


class BlockDetectedError(Exception):
    pass


class BrowserWorker:
    def __init__(self, browser_manager, job_queue, source_resolver):
        self.browser_manager = browser_manager
        self.job_queue = job_queue
        self.source_resolver = source_resolver
        self.running = False
        self.queue_errors = 0

    async def start(self):
        self.running = True
        await self.browser_manager.start()
        logger.info("Browser worker started")

        try:
            while self.running:
                job = await self.get_job()
                if job is not None:
                    await self.process_job(job)
        except asyncio.CancelledError:
            logger.info("Browser worker cancelled")
            raise
        finally:
            await self.stop()

    async def get_job(self):
        try:
            job = await self.job_queue.get()
            self.queue_errors = 0
            return job
        except Exception:
            self.queue_errors += 1

            if self.queue_errors >= MAX_QUEUE_ERRORS:
                logger.exception(
                    "Queue unavailable: %d consecutive failures",
                    self.queue_errors
                )
            else:
                logger.error(
                    "Failed to retrieve job (%d/%d)",
                    self.queue_errors,
                    MAX_QUEUE_ERRORS
                )

            await asyncio.sleep(QUEUE_ERROR_BACKOFF)
            return None

    async def process_job(self, job):
        context = None
        page = None
        job_id = getattr(job, "id", "unknown")
        source_name = getattr(job, "source", "unknown")

        try:
            logger.info("Processing job %s | source=%s", job_id, source_name)

            if not source_name:
                raise PermanentJobError("Job has no source")

            source = self.source_resolver(source_name)

            if source is None:
                raise PermanentJobError(f"Unknown source: {source_name}")

            context = await self.browser_manager.create_context(source_name)

            page = await context.new_page()

            results = await asyncio.wait_for(
                source.scrape(job=job, page=page),
                timeout=SCRAPE_TIMEOUT
            )

            result_count = self.get_result_count(results)
            logger.info("Job %s returned %d results", job_id, result_count)


            await save_results(results)
            await self.mark_success(job)

            logger.info("Job completed successfully: %s", job_id)

        except asyncio.TimeoutError:
            logger.error("Job %s timed out after %ss", job_id, SCRAPE_TIMEOUT)

            if context is not None:
                await self.browser_manager.report_failure(
                    context,
                    reason="timeout"
                )

            await self.mark_failure(
                job,
                category="timeout",
                reason="scrape_timeout"
            )

        except BlockDetectedError as exc:
            logger.warning("Block detected for job %s: %s", job_id, exc)

            if context is not None:
                await self.browser_manager.report_failure(
                    context,
                    reason="block"
                )

            await self.mark_failure(
                job,
                category="block_signal",
                reason=str(exc)
            )

        except RetryableJobError as exc:
            logger.warning("Retryable failure for job %s: %s", job_id, exc)
            await self.mark_failure(
                job,
                category="retryable",
                reason=str(exc)
            )

        except PermanentJobError as exc:
            logger.error("Permanent failure for job %s: %s", job_id, exc)
            await self.mark_failure(
                job,
                category="permanent",
                reason=str(exc)
            )

        except Exception as exc:
            logger.exception("Unexpected failure for job %s", job_id)
            await self.mark_failure(
                job,
                category="unknown",
                reason=str(exc)
            )

        finally:
            if page is not None:
                try:
                    await page.close()
                except Exception:
                    logger.exception("Failed to close page for job %s", job_id)

            if context is not None:
                try:
                    await self.browser_manager.close_context(context)
                except Exception:
                    logger.exception(
                        "Failed to close context for job %s",
                        job_id
                    )

    async def mark_success(self, job):
        await self.job_queue.ack(job)

    async def mark_failure(self, job, category, reason):
        await self.job_queue.fail(
            job,
            category=category,
            reason=reason
        )

    async def stop(self):
        if not self.running:
            return

        self.running = False
        logger.info("Stopping browser worker")

        await self.browser_manager.close()

        logger.info("Browser worker stopped")

    @staticmethod
    def get_result_count(results):
        if results is None:
            return 0
        if isinstance(results, (list, tuple, set)):
            return len(results)
        return 1

    @staticmethod
    def is_suspicious_result(results):
        if results is None:
            return True
        if isinstance(results, (list, tuple, set)):
            return len(results) == 0
        return False