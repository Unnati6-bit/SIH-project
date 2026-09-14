import asyncio
import logging

from camoufox.async_api import AsyncCamoufox

logger = logging.getLogger(__name__)


class BrowserManager:
    def __init__(
        self,
        headless="virtual",
        humanize=True,
        humanize_max_time=None,
        geoip=False,
        proxy=None,
        max_contexts=1,
        rotation_config=None,
    ):
        self.headless = headless
        self.humanize = humanize
        self.humanize_max_time = humanize_max_time
        self.geoip = geoip
        self.proxy = proxy
        self.max_contexts = max_contexts
        self.rotation_config = rotation_config or {}

        self.camoufox = None
        self.browser = None
        self.context_semaphore = asyncio.Semaphore(max_contexts)

        self.jobs_since_rotation = {}
        self.rotation_requested = False

    async def start(self):
        if self.browser is not None:
            return

        logger.info("Starting Camoufox browser")

        options = {"headless": self.headless}

        options["humanize"] = (
            self.humanize_max_time
            if self.humanize_max_time is not None
            else self.humanize
        )

        if self.geoip:
            options["geoip"] = True

        if self.proxy is not None:
            options["proxy"] = self.proxy

        self.camoufox = AsyncCamoufox(**options)
        self.browser = await self.camoufox.start()

        logger.info("Camoufox browser started")

    async def create_context(self, source=None):
        if self.browser is None:
            raise RuntimeError("BrowserManager has not been started")

        source_name = self.get_source_name(source)

        if self.should_rotate(source_name):
            await self.rotate(source_name)

        await self.context_semaphore.acquire()

        try:
            context = await self.browser.new_context()
        except Exception:
            self.context_semaphore.release()
            raise

        self.jobs_since_rotation[source_name] = (
            self.jobs_since_rotation.get(source_name, 0) + 1
        )

        logger.info(
            "Created context | source=%s | jobs_since_rotation=%d",
            source_name,
            self.jobs_since_rotation[source_name],
        )

        return context

    async def close_context(self, context):
        if context is None:
            return

        try:
            await context.close()
            logger.info("Browser context closed")
        except Exception:
            logger.exception("Failed to close browser context")
        finally:
            self.context_semaphore.release()

    async def report_failure(self, context, reason):
        logger.warning(
            "Browser failure reported | reason=%s",
            reason,
        )

        # The worker still owns context cleanup.
        # This method only reports the failure to the manager.
        self.rotation_requested = True

    def should_rotate(self, source_name):
        rotate_after = self.rotation_config.get(source_name)

        if rotate_after is None:
            return False

        return (
            self.jobs_since_rotation.get(source_name, 0)
            >= rotate_after
        )

    async def rotate(self, source_name=None):
        logger.warning(
            "Browser rotation requested | source=%s",
            source_name,
        )

        # Real rotation is intentionally not implemented yet.
        #
        # Camoufox proxy configuration belongs to the browser
        # launch, so changing the proxy requires replacing the
        # browser rather than simply creating a new context.
        #
        # Future flow:
        #
        # 1. Select new proxy.
        # 2. Wait for active contexts to finish.
        # 3. Close current Camoufox browser.
        # 4. Launch Camoufox with the new proxy.
        # 5. Reset the relevant source rotation counter.
        #
        # Do NOT pretend that resetting this counter changes IP.

        if source_name is not None:
            self.jobs_since_rotation[source_name] = 0

        self.rotation_requested = False

    def get_source_name(self, source):
        if source is None:
            return "unknown"

        if isinstance(source, str):
            return source

        return getattr(source, "name", source.__class__.__name__)

    async def close(self):
        if self.browser is None:
            return

        logger.info("Closing Camoufox browser")

        try:
            await self.browser.close()
        except Exception:
            logger.exception("Failed to close Camoufox browser")
        finally:
            self.browser = None
            self.camoufox = None

        logger.info("Camoufox browser closed")