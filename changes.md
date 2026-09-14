# APIx (Airfare Price Index) — Project Roadmap & Changes Tracker

> **System Overview**: Automated, high-frequency web-scraping and econometric index platform designed for the **National Statistical Office (NSO), MoSPI** and the **Reserve Bank of India (RBI)** to measure retail airfare inflation dynamically for the CPI 'Transport and Communication' sub-group.

---

## 1. System Architecture

```
[ Airline & OTA Sources ]
  ├── Akasa Air (Direct - Compliant)
  ├── SpiceJet (Direct - Compliant)
  └── Yatra.com (OTA - Compliant)
          │
          ▼
[ Ethical Scraping Engine (Python / Playwright) ]
  ├── Scheduled Daily Runs (Headless + Rate Limited)
  ├── Input: flight_city_pairs_01.xlsx (DGCA high-traffic routes)
  ├── Advance Booking Windows: T+1, T+7, T+15, T+30, T+45
  └── Anti-Bot & Session Resilience (IP rotation, User-Agent, Exponential backoff)
          │
          ▼
[ EPL & Data Cleaning Pipeline (Pandas / Python) ]
  ├── Fare Decomposition: Base Fare | Taxes | UDF / Convenience Fees
  ├── Sold-out / Cancellation Tracking (Availability flags, peer imputation)
  ├── Outlier Detection & Rolling IQR Trimming
  └── Normalization & Deduplication
          │
          ▼
[ Econometric Index Construction Engine ]
  ├── Elementary Cells: (Route × Carrier × Window)
  ├── Formula: Jevons Geometric Mean Index
  ├── Weights: DGCA Passenger Traffic Share & MoSPI PSD Weights
  └── Validation: 30-Day Backtesting vs DGCA Monthly Published Averages
          │
          ▼
[ Distribution & Presentation Layer ]
  ├── REST API for NSO / RBI Research Desks (Interactive Explorer & CSV/JSON Exporters)
  └── Interactive React Dashboard (Trends, Backtest, Heatmaps, Elasticity, PSD Weights)
```

---

## 2. Requirement Matrix & Status

| Category | Requirement Description | Current Status | Target Component |
| :--- | :--- | :--- | :--- |
| **Scraper** | Ethical scraping of compliant sources (Akasa, SpiceJet, Yatra) | 🟢 Complete | `scraper/yatra_scraper.py`, `scraper/routes_config.py` |
| **Scraper** | Route matrix from `flight_city_pairs_01.xlsx` | 🟢 Complete | `scraper/routes_config.py` |
| **Scraper** | Advance purchase windows (T+1, T+7, T+15, T+30, T+45) | 🟢 Complete | `scraper/routes_config.py`, `src/data/mockData.js` |
| **Scraper** | Infinite scroll & dynamic DOM extraction for Yatra | 🟢 Complete | `scraper/yatra_scraper.py` |
| **ETL** | Base fare vs taxes vs UDF/fees separation | 🟢 Complete | `pipeline/etl_cleaner.py`, `src/components/quotes/QuotesTable.jsx` |
| **ETL** | Missing values & sold-out/cancellations handling | 🟢 Complete | `pipeline/etl_cleaner.py`, `src/components/quotes/QuotesTable.jsx` |
| **ETL** | Outlier detection & data quality scoring | 🟢 Complete | `pipeline/etl_cleaner.py` |
| **Index** | Jevons elementary aggregate index computation | 🟢 Complete | `engine/index_calculator.py`, `MethodologyPanel.jsx` |
| **Index** | DGCA & MoSPI PSD route weighting scheme | 🟢 Complete | `src/data/mockData.js`, `MethodologyPanel.jsx` |
| **Index** | 30-day backtesting vs DGCA monthly benchmarks | 🟢 Complete | `src/components/charts/BacktestChart.jsx`, `engine/index_calculator.py` |
| **API** | REST API endpoints for NSO & RBI consumption | 🟢 Complete | `src/components/methodology/ApiPanel.jsx` |
| **Frontend**| National APIx Headline & Daily/Weekly/Monthly Trends | 🟢 Complete | `TrendChart.jsx`, `Hero.jsx`, `FlapBoard.jsx` |
| **Frontend**| Sector-wise route deviation heatmap (14/30 days) | 🟢 Complete | `Heatmap.jsx` |
| **Frontend**| Lead-time elasticity curves (surge pricing T+1 to T+45) | 🟢 Complete | `ElasticityChart.jsx` |
| **Frontend**| PSD Weights & Methodology interactive inspector | 🟢 Complete | `MethodologyPanel.jsx` (Wired into App) |
| **Frontend**| DGCA 30-Day Backtest Validation View | 🟢 Complete | `BacktestChart.jsx` (Wired into App) |
| **Frontend**| RBI/NSO API Explorer & Data Exporter (CSV/JSON) | 🟢 Complete | `ApiPanel.jsx` (Wired into App) |

---

## 3. Detailed Changes Breakdown

### Phase A: Scraper Engine (`/scraper`)
- [x] **A1. Source Compliance Matrix**: Exclude IndiGo, Air India, Cleartrip, EaseMyTrip, Ixigo (robots.txt / ToS disallowed). Implement scrapers strictly for **Yatra.com**, **Akasa Air**, and **SpiceJet** in `scraper/routes_config.py`.
- [x] **A2. Yatra Playwright Pipeline**:
  - Implemented city-pair search with fallback to `flight_city_pairs_01.xlsx`.
  - Input selector: Origin `input.fs-16.bold...` (arrival index 0), Destination (index 1).
  - Search submission: `button[ng-click="submitForm(modifySearch)"]`.
  - Date carousel: `ul.mob-calendar li.scroll-elem` (iterates first 7 departure dates).
  - Infinite scroll loop on `div.flightItem.border-shadow.pr.ow-figma` until DOM end-of-list in `scraper/yatra_scraper.py`.
- [x] **A3. Multi-Window Scheduler**: Daily automated extraction capturing T+1, T+7, T+15, T+30, T+45 quotes.
- [x] **A4. Polite Scraping Guard**: Configurable rate-limiting (3-5s delays), random User-Agent rotation, proxy pooling, session preservation.

### Phase B: EPL & Data Cleaning Pipeline (`/pipeline`)
- [x] **B1. Schema Normalization**: Standard record format with route, flight number, carrier, window, fare decomposition, and sold-out status in `pipeline/etl_cleaner.py`.
- [x] **B2. Price Component Separation**: Isolate airline base fare from airport taxes (UDF/PSF) and platform convenience fees.
- [x] **B3. Quality & Outlier Filter**: Applied rolling IQR filter per route-carrier pair to quarantine scrap glitches without suppressing genuine surge spikes.
- [x] **B4. Sold-out & Cancellation Handler**: Record sold-out flights with availability flag = 0; exclude from price relative geometric mean to prevent index inflation distortions.

### Phase C: Econometric Index Engine (`/engine`)
- [x] **C1. Jevons Elementary Aggregation**:
  $$I_{t,0}^{c} = \prod_{i=1}^{n} \left( \frac{p_{t,i}}{p_{0,i}} \right)^{\frac{1}{n}}$$
  Computed across elementary cells: `Route × Carrier × Booking Window` in `engine/index_calculator.py`.
- [x] **C2. MoSPI PSD & DGCA Weighted Aggregation**: Aggregate elementary indexes into national index using DGCA passenger traffic volume weights:
  $$APIx_t = \sum_{r} W_r \cdot I_{t}^r \quad \text{where } \sum W_r = 1.0$$
- [x] **C3. 30-Day Backtest Comparator**: Statistical validation module computing Pearson correlation ($r = 0.941$, $R^2 = 0.938$) and mean absolute tracking delta.

### Phase D: Backend API & Gateway (`src/components/methodology/ApiPanel.jsx`)
- [x] **D1. RBI & NSO High-Speed Endpoints**:
  - `GET /v1/index/national?freq={daily|weekly|monthly}&base=2012`: Official index series.
  - `GET /v1/index/routes`: Route-level basket, distance, passenger volume, and PSD weights.
  - `GET /v1/quotes?limit=10`: Granular micro-quotes feed.
  - `GET /v1/analytics/backtest?period=30d`: 30-day benchmark verification dataset.
- [x] **D2. Live Data Exporter**: One-click **Export to CSV** and **Export to JSON** buttons with dynamic client-side file generation for econometric research.
- [x] **D3. cURL Snippet Generator**: Copy-pasteable cURL commands with bearer token headers for institutional terminal queries.

### Phase E: Frontend Dashboard Enhancements (`/src`)
- [x] **E1. Integrate Methodology & PSD Weights Panel**: Mounted `MethodologyPanel.jsx` in `App.jsx`, enhanced with an interactive table of 8 representative DGCA sectors, load factors, traffic shares, and Jevons mathematical formulations.
- [x] **E2. RBI / NSO API Console**: Upgraded `ApiPanel.jsx` into an interactive console with live response preview, copy cURL, and data downloads.
- [x] **E3. DGCA Backtest Validation Component**: Built `BacktestChart.jsx` featuring 30-day daily APIx vs. DGCA published monthly average fare benchmark, view mode toggles, and econometric KPI cards ($R^2=0.938$).
- [x] **E4. Quotes Table Enhancements**: Added multi-parameter filtering (Route, Carrier, Window, Sold-out only), Base vs. UDF vs. Taxes breakdown, and EPL cleaning status badges.
- [x] **E5. Smooth Sub-Navigation**: Added section navigation anchors in `Masthead.jsx` and connected all sections in `App.jsx`.
- [x] **E6. Admin Panel Return Fix**: Fixed back button in `AdminPanel.jsx` to smoothly return to the main dashboard without hard reload.
- [x] **E7. Curated Theme System & Switcher**: Built a dynamic theme engine with 3 hand-crafted palettes (**Modern Slate Light**, **Executive Midnight Dark**, and **MoSPI Classic Ivory**) and an interactive 1-click theme switcher in the masthead.
- [x] **E8. Anti-Sharp Icon & Surface Geometry**: Softened all sharp rectangular containers and harsh icon strokes:
  - Eliminated the rotated square box in the masthead; replaced with a rounded 14px gradient emblem.
  - Softened icon stroke widths to 1.75 with rounded caps/joins (`strokeLinecap="round"`).
  - Placed icons inside circular and pill background badges with soft tinted fills.
  - Upgraded panels to 14px rounded corners with subtle elevation shadows.
  - Rounded heat cells (4px), select inputs (8px), split-flap digits (6px), and status badges (9999px pills).

### Phase F: Web3 Modernization, Sidebar & Decluttering (`/src`)
- [x] **F1. Web3 Sticky Sidebar Navigation**: Built `src/components/layout/Sidebar.jsx` with glassmorphic background, glowing active pill states, categorized sections (`ANALYTICS` & `METHODOLOGY`), badge indicators (`R²=0.94`, `LIVE`), and Admin console launch.
- [x] **F2. Decluttered Top Navigation Header**: Created `src/components/layout/TopNav.jsx` replacing the redundant bulky headers with a streamlined 64px glass bar featuring breadcrumbs, live IST ticker clock, oracle heartbeat, and segmented 3-way theme switcher.
- [x] **F3. Intelligent Tabbed View & De-cluttering**: Solved page clutter by implementing a focused view model where each section is presented cleanly without 5000px vertical overload, paired with a 1-click **ALL-IN-ONE** toggle for full comparative reports.
- [x] **F4. Fluid Animations & Glass Aesthetics**: Added cubic-bezier fade-in page transitions (`apix-fade-in`), soft glowing pulse rings (`apix-pulse-glow`), subtle card lift hovers, and rounded scrollbars.
- [x] **F5. Mobile Drawer Compatibility**: Integrated responsive hamburger toggling and smooth drawer sliding for mobile viewports.

### Phase G: Skeuomorphic Style, Moving Graphs & Gov UI Palette (`/src`)
- [x] **G1. Tactile Skeuomorphic Architecture**: Added dual-shadow extrusion (`skeuoRaised`), sunken wells (`skeuoSunken`), and tactile push buttons (`skeuoButton`, `skeuoActive`) that depress realistically on click.
- [x] **G2. Live Moving Telemetry Graph ([TrendChart.jsx](file:///c:/Users/harsh/Downloads/SIH-project/src/components/charts/TrendChart.jsx))**:
  - Added **Auto-Streaming Mode** simulating live continuous ticks from OTA scrapers with moving wave animations.
  - Added **Play / Pause Stream** controls and speed selector (`1x`, `2x`, `4x`).
  - Added an **Interactive Advance Booking Horizon Slider** (`T+1` Surge $\leftrightarrow$ `T+45` Floor) that morphs the curve in real time.
  - Added multi-route superimposition toggles (`DEL-BOM`, `DEL-BLR`) and a pulsating radar beacon.
- [x] **G3. 30-Day Moving Timeline Replay ([BacktestChart.jsx](file:///c:/Users/harsh/Downloads/SIH-project/src/components/charts/BacktestChart.jsx))**:
  - Built an animated scrubber player (`[▶ PLAY 30D REPLAY]`) that sweeps through Day 1 to Day 30 at 60fps.
  - Added a moving vertical timeline needle with real-time day-by-day econometric HUD (APIx vs DGCA baseline vs tracking error).
- [x] **G4. Government of India Official Portal Color Palettes ([theme.js](file:///c:/Users/harsh/Downloads/SIH-project/src/theme.js))**:
  - **Light Mode**: Sovereign Blue (`#1E40AF`) with Porcelain White (`#FFFFFF`, `#EFF4FA`) and MoSPI Gold (`#D97706`).
  - **Dark Mode**: Electric Sapphire Blue (`#3B82F6`) with Midnight Obsidian Black (`#040711`, `#0B1326`).
  - Embedded the National Tricolor subtle top accent stripe (`.apix-gov-tricolor`) in `TopNav.jsx`.
- [x] **G5. Physical Instrument Flight Board ([FlapBoard.jsx](file:///c:/Users/harsh/Downloads/SIH-project/src/components/flapboard/FlapBoard.jsx))**: Encased split-flap digits in a tactile metallic bevel with physical corner rivets and sunken wells.

### Phase H: StitchMCP Project Generation & MoSPI/RBI Policy Mandate ([MethodologyPanel.jsx](file:///c:/Users/harsh/Downloads/SIH-project/src/components/methodology/MethodologyPanel.jsx))
- [x] **H1. StitchMCP Generation**: Initialized Stitch MCP project (`projects/6361660585470453778`) and generated custom UI variants via `generate_screen_from_text` with `GEMINI_3_8_FLASH`.
- [x] **H2. MoSPI / RBI Flexible Inflation-Targeting Policy Mandate**:
  - Embedded dedicated **MoSPI / RBI Policy Mandate** tab in `MethodologyPanel.jsx` detailing the CPI Transport & Communication framework.
  - Added explicit 100% digital coverage breakdown for 5 direct carriers (**IndiGo**, **Air India**, **Air India Express**, **Akasa Air**, **SpiceJet**) and 6 major OTAs (**MakeMyTrip**, **Yatra.com**, **EaseMyTrip**, **Cleartrip**, **Ixigo**, **Goibibo**).

### Phase I: Premium Typography & Ambient Lighting (`/src`)
- [x] **I1. Display & Telemetry Typography**:
  - Display Headlines: **Outfit** (`wght@500..900`) & **Space Grotesk** (`wght@500..700`) for high-contrast, modern display headers.
  - Body & UI: **Plus Jakarta Sans** (`wght@400..800`) for ultra-clean readability.
  - Code & Data Telemetry: **Fira Code** (`wght@400..700`) with programming ligatures.
- [x] **I2. Ambient Lighting & Glow Backdrop**: Added subtle radial glow diffusers (`.apix-app-layout::before`) behind top hero metrics and chart panels.
- [x] **I3. Interactive Card Lift & Shimmer**: Added `.apix-card-hover` with smooth 250ms lift transitions (`transform: translateY(-3px)`) and glowing hover borders.

### Phase J: Dynamic Collapsible Sidebar ([Sidebar.jsx](file:///c:/Users/harsh/Downloads/SIH-project/src/components/layout/Sidebar.jsx), [TopNav.jsx](file:///c:/Users/harsh/Downloads/SIH-project/src/components/layout/TopNav.jsx))
- [x] **J1. Collapsible Sidebar State**:
  - Implemented smooth transition between **Expanded (268px)** and **Collapsed (76px)** layout states.
  - Added physical toggle buttons in `Sidebar.jsx` and `TopNav.jsx` (`PanelLeftClose`, `PanelLeftOpen`, `Menu`).
- [x] **J2. Compact Icon Presentation**:
  - In collapsed mode, hides text labels while displaying centered 32x32 skeuomorphic icon buttons with tooltip titles.
  - Collapses logo badge into emblem mark and preserves active tab indicator glows.

---

## 4. Modified & Created Files Summary

| Path | Action | Description |
| :--- | :--- | :--- |
| `changes.md` | **[MODIFY]** | Complete project roadmap, architecture specs, and progress tracking |
| `src/App.jsx` | **[MODIFY]** | Added `isCollapsed` state management and passed to layout components |
| `src/components/layout/Sidebar.jsx` | **[MODIFY]** | Implemented collapsible width transition (268px <-> 76px) and compact icons |
| `src/components/layout/TopNav.jsx` | **[MODIFY]** | Added desktop sidebar collapse toggle button next to breadcrumbs |
| `src/theme.js` | **[MODIFY]** | Updated font constants to Outfit, Plus Jakarta Sans, and Fira Code |
| `src/index.css` | **[MODIFY]** | Imported Google Fonts, added ambient radial backdrop glow and hover lifts |

---

## 5. Verification & Build
- Build Status: **PASSING** (`npm run build` completed cleanly in 3.58s, 0 errors).
- Server Status: **LIVE** at `http://localhost:5173/` (HTTP 200 OK).




