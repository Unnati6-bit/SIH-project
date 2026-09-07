# APIx — Airfare Price Index Dashboard (Frontend)

A Vite + React frontend module for the Real-time Airfare Price Index (APIx)
prototype. Currently wired to deterministic mock data in `src/data/mockData.js`
so the UI can be reviewed and iterated on before the scraping / index-construction
backend is ready — swap that one file for real API calls and every component
downstream keeps working unchanged.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build      # production build
npm run preview   # preview the production build
```

## Folder structure

```
apix-dashboard/
├── index.html                 Vite entry HTML
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                React root, mounts <App />
    ├── App.jsx                 Assembles all sections into the page
    ├── index.css               Font imports, keyframes, responsive overrides
    ├── theme.js                Design tokens: colors, fonts, shared chart styles
    │
    ├── data/
    │   └── mockData.js         Seeded mock dataset — replace with real API calls
    │
    ├── utils/
    │   └── colorUtils.js       Hex interpolation for the heatmap color scale
    │
    └── components/
        ├── ui/                 Generic primitives reused across the dashboard
        │   ├── Panel.jsx
        │   ├── SectionHeader.jsx
        │   ├── Eyebrow.jsx
        │   ├── Chip.jsx
        │   └── StatCard.jsx
        │
        ├── flapboard/          The split-flap signature element
        │   ├── FlapDigit.jsx
        │   └── FlapBoard.jsx
        │
        ├── layout/              Page chrome
        │   ├── Masthead.jsx
        │   ├── Ticker.jsx
        │   ├── Hero.jsx
        │   └── Footer.jsx
        │
        ├── charts/              Recharts-based visualisations
        │   ├── TrendChart.jsx        Daily/Weekly/Monthly APIx line
        │   ├── Heatmap.jsx           Route × day fare-deviation grid
        │   ├── ElasticityChart.jsx   Fare vs. booking-window curves
        │   └── CarrierChart.jsx      Average fare by carrier
        │
        ├── quotes/
        │   └── QuotesTable.jsx       Raw scraped-quote feed
        │
        └── methodology/
            ├── MethodologyPanel.jsx  Jevons index / weighting summary
            └── ApiPanel.jsx          Sample REST endpoints for NSO/RBI consumers
```

## Wiring up the real backend

`src/data/mockData.js` is the single seam between UI and data. Replace its
exports with `fetch`/React Query calls against the index-construction service
(matching the `fare_quotes` schema: route, carrier, booking window, base fare,
taxes, fees, total, availability) and no other file needs to change.

## Dependencies

- `react`, `react-dom` — UI
- `recharts` — trend, elasticity, and carrier charts
- `lucide-react` — icons
- `vite`, `@vitejs/plugin-react` — dev server / build
