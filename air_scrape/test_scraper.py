import asyncio
import logging
from pathlib import Path
import json
import pandas as pd

from workers.browser_manager import BrowserManager

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

YATRA_URL = "https://www.yatra.com/flights"
INITIAL_BUTTON_SELECTOR = (
    "button.MuiButton-root.MuiButton-buttonPrimary.MuiButton-sizeMedium"
)
ORIGIN_SELECTOR = (
    "input.fs-16.bold.ng-touched.ng-dirty.ng-valid-parse."
    "ng-invalid.ng-invalid-required.ellipsis.full-width."
    "ng-pristine.ng-valid.ng-not-empty.ng-valid-required"
)

DESTINATION_SELECTOR = (
    "input.fs-16.bold.ng-touched.ng-dirty.ng-invalid."
    "ng-invalid-required.ellipsis.full-width."
    "ng-pristine.ng-untouched.ng-valid.ng-not-empty.ng-valid-required"
)

SEARCH_SELECTOR = 'button[ng-click="submitForm(modifySearch)"]'
DATE_SELECTOR = "ul.mob-calendar li.scroll-elem"
FLIGHT_SELECTOR = "div.flightItem.border-shadow.pr.ow-figma"

EXCEL_FILE = "flight_city_pairs_01.xlsx"
OUTPUT_FILE = Path("data/yatra_test.json")
TEST_LIMIT = 10
DATE_LIMIT = 7


async def scrape_flights(page, origin, destination, date_text):
    await page.wait_for_selector(FLIGHT_SELECTOR, timeout=60000)
    cards = page.locator(FLIGHT_SELECTOR)
    last_count = await cards.count()
    stable_rounds = 0

    while stable_rounds < 3:
        await cards.last.scroll_into_view_if_needed()
        await page.wait_for_timeout(2500)

        new_count = await cards.count()
        logging.info("[%s → %s] %s | cards: %d → %d", origin, destination, date_text, last_count, new_count)

        if new_count == last_count:
            stable_rounds += 1
            logging.info("No new flight cards: %d/3", stable_rounds)
        else:
            stable_rounds = 0

        last_count = new_count

    results = []
    count = await cards.count()
    logging.info("[%s → %s] %s | Finished scrolling | total cards: %d", origin, destination, date_text, count)
    for index in range(count):
        try:
            text = (await cards.nth(index).inner_text()).strip()
            results.append({"date": date_text, "origin": origin, "destination": destination, "raw_text": text})
        except Exception:
            logging.exception("Failed to read flight card %d", index + 1)

    return results


async def search_route(page, origin, destination):
    await open_flight_search(page)

    inputs = page.locator(ORIGIN_SELECTOR)

    count = await inputs.count()
    logging.info("Origin selector matched %d elements", count)

    if count < 1:
        raise RuntimeError("Origin input not found")

    origin_input = inputs.nth(0)

    await origin_input.fill(origin)
    await page.keyboard.press("Enter")

    await page.wait_for_timeout(1000)

    destination_input = page.locator(DESTINATION_SELECTOR)

    if await destination_input.count() == 0:
        raise RuntimeError("Destination input not found")

    await destination_input.fill(destination)
    await page.keyboard.press("Enter")

    await page.wait_for_timeout(1000)

    search_button = page.locator(SEARCH_SELECTOR)

    if await search_button.count() == 0:
        raise RuntimeError("Search button not found")

    await search_button.click()

    logging.info(
        "Search submitted: %s → %s",
        origin,
        destination,
    )

    await page.wait_for_timeout(5000)


async def open_flight_search(page):
    await page.goto(
        YATRA_URL,
        wait_until="domcontentloaded",
        timeout=60000,
    )

    await page.wait_for_timeout(3000)

    button = page.locator(INITIAL_BUTTON_SELECTOR).first

    if await button.count() == 0:
        raise RuntimeError("Initial flight-page button not found")

    logging.info("Clicking initial flight-page button")

    await button.click()

    await page.wait_for_selector(
        ORIGIN_SELECTOR,
        timeout=30000,
    )

    logging.info("Flight search UI opened")

async def scrape_dates(page, origin, destination):
    await page.wait_for_selector(DATE_SELECTOR, timeout=60000)
    dates = page.locator(DATE_SELECTOR)
    date_count = await dates.count()
    logging.info("Date elements found: %d", date_count)

    if date_count == 0:
        raise RuntimeError("No date elements found")

    limit = min(DATE_LIMIT, date_count)
    all_results = []

    for index in range(limit):
        dates = page.locator(DATE_SELECTOR)
        date_element = dates.nth(index)
        date_text = (await date_element.inner_text()).strip()
        logging.info("[%s → %s] Date %d/%d: %s", origin, destination, index + 1, limit, date_text)

        await date_element.scroll_into_view_if_needed()
        await date_element.click()
        await page.wait_for_timeout(2500)

        results = await scrape_flights(page, origin, destination, date_text)
        all_results.extend(results)

        logging.info("[%s → %s] %s: %d flight cards", origin, destination, date_text, len(results))

    return all_results

async def main():
    df = pd.read_excel(EXCEL_FILE)
    required_columns = {"CITY1", "CITY2"}
    missing = required_columns - set(df.columns)

    if missing:
        raise ValueError(f"Missing columns: {', '.join(sorted(missing))}")

    df = df[["CITY1", "CITY2"]].dropna().head(TEST_LIMIT)
    logging.info("Testing first %d city pairs", len(df))

    manager = BrowserManager(headless=False, humanize=True)
    await manager.start()
    context = None

    try:
        context = await manager.create_context("yatra")
        page = await context.new_page()

        for index, row in df.iterrows():
            origin = str(row["CITY1"]).strip()
            destination = str(row["CITY2"]).strip()
            logging.info("========== CITY PAIR %d/%d ==========", index + 1, len(df))
            logging.info("Testing: %s → %s", origin, destination)

            try:
                await search_route(page, origin, destination)
                await page.screenshot(path=f"yatra_pair_{index + 1}.png")
                results = await scrape_dates(page, origin, destination)

                OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
                with OUTPUT_FILE.open("a", encoding="utf-8") as f:
                    for result in results:
                        f.write(json.dumps(result, ensure_ascii=False) + "\n")

                logging.info("Saved %d records for %s → %s", len(results), origin, destination)

            except Exception:
                logging.exception("Failed city pair: %s → %s", origin, destination)

    finally:
        if context is not None:
            await manager.close_context(context)
        await manager.close()


if __name__ == "__main__":
    asyncio.run(main())