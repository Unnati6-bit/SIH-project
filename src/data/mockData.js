/* ------------------------------------------------------------------ */
/*  Seeded RNG — keeps mock numbers stable across re-renders           */
/* ------------------------------------------------------------------ */
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(1729);

/* ------------------------------------------------------------------ */
/*  Reference dimensions                                               */
/* ------------------------------------------------------------------ */
export const ROUTES = [
  { code: "DEL-BOM", name: "Delhi \u2192 Mumbai", base: 5400, vol: 0.16, weight: 0.19 },
  { code: "DEL-BLR", name: "Delhi \u2192 Bengaluru", base: 6200, vol: 0.14, weight: 0.15 },
  { code: "BOM-BLR", name: "Mumbai \u2192 Bengaluru", base: 4300, vol: 0.12, weight: 0.13 },
  { code: "DEL-CCU", name: "Delhi \u2192 Kolkata", base: 5800, vol: 0.18, weight: 0.10 },
  { code: "BLR-HYD", name: "Bengaluru \u2192 Hyderabad", base: 3200, vol: 0.11, weight: 0.09 },
  { code: "MAA-DEL", name: "Chennai \u2192 Delhi", base: 6600, vol: 0.15, weight: 0.12 },
  { code: "DEL-HYD", name: "Delhi \u2192 Hyderabad", base: 5600, vol: 0.13, weight: 0.11 },
  { code: "BOM-CCU", name: "Mumbai \u2192 Kolkata", base: 6900, vol: 0.17, weight: 0.11 },
];

export const CARRIERS = ["IndiGo", "Air India", "Akasa Air", "SpiceJet", "Air India Express"];
export const CARRIER_SHARE = [0.38, 0.24, 0.11, 0.16, 0.11];
export const WINDOWS = [1, 7, 15, 30, 45];
export const OTAS = ["Airline Direct", "MakeMyTrip", "Yatra", "Cleartrip", "EaseMyTrip", "Ixigo", "Goibibo"];

export const N_DAYS = 90;
export const TODAY = new Date(2026, 7, 29); // 29 Aug 2026

export function dateLabel(offsetFromToday, opts = { day: "2-digit", month: "short" }) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + offsetFromToday);
  return d.toLocaleDateString("en-IN", opts);
}

/* ------------------------------------------------------------------ */
/*  National index series (daily, with weekly + festival aggregation)  */
/* ------------------------------------------------------------------ */
export const DAILY_SERIES = Array.from({ length: N_DAYS }, (_, i) => {
  const dayOffset = -(N_DAYS - 1) + i;
  const trend = 138 + dayOffset * 0.045;
  const weekly = Math.sin((dayOffset / 7) * Math.PI * 2) * 1.8;
  const festivalDistance = Math.abs(dayOffset - 8);
  const festival = festivalDistance < 6 ? (6 - festivalDistance) * 2.4 : 0;
  const noise = (rng() - 0.5) * 2.2;
  const value = trend + weekly + festival + noise;
  return { i, dayOffset, date: dateLabel(dayOffset), value: Math.round(value * 10) / 10 };
});

export function aggregate(series, groupSize) {
  const out = [];
  for (let i = series.length; i > 0; i -= groupSize) {
    const chunk = series.slice(Math.max(0, i - groupSize), i);
    const avg = chunk.reduce((s, d) => s + d.value, 0) / chunk.length;
    out.push({ date: chunk[chunk.length - 1].date, value: Math.round(avg * 10) / 10 });
  }
  return out.reverse();
}

export const WEEKLY_SERIES = aggregate(DAILY_SERIES, 7);
export const MONTHLY_SERIES = aggregate(DAILY_SERIES, 30);

/* ------------------------------------------------------------------ */
/*  Route x last-14-days heatmap                                       */
/* ------------------------------------------------------------------ */
export const HEAT_DAYS = 14;

export const HEATMAP = ROUTES.map((r) => {
  const cells = Array.from({ length: HEAT_DAYS }, (_, d) => {
    const dayOffset = -(HEAT_DAYS - 1) + d;
    const swing = Math.sin(dayOffset / 3.3 + r.base) * 14 * r.vol * 10;
    const drift = (rng() - 0.5) * 18 * r.vol * 10;
    return Math.round(swing + drift);
  });
  return { ...r, cells };
});

/* ------------------------------------------------------------------ */
/*  Lead-time elasticity: fare by booking window, per route            */
/* ------------------------------------------------------------------ */
export const ELASTICITY = ROUTES.map((r) => {
  const points = WINDOWS.map((w) => {
    const shape = w <= 15 ? (15 - w) / 15 : -((w - 15) / 30) * 0.35;
    const premium = 1 + shape * 0.9 * (0.6 + r.vol);
    const noise = 1 + (rng() - 0.5) * 0.05;
    return { window: w, fare: Math.round(r.base * premium * noise) };
  });
  return { code: r.code, points };
});

/* ------------------------------------------------------------------ */
/*  Carrier comparison                                                 */
/* ------------------------------------------------------------------ */
export const CARRIER_DATA = CARRIERS.map((name, idx) => {
  const skew = [0.94, 1.08, 0.9, 0.88, 1.02][idx];
  const avg = ROUTES.reduce((s, r) => s + r.base, 0) / ROUTES.length;
  return { name, fare: Math.round(avg * skew * (1 + (rng() - 0.5) * 0.06)) };
});

/* ------------------------------------------------------------------ */
/*  Latest raw quotes feed                                             */
/* ------------------------------------------------------------------ */
export const QUOTES = Array.from({ length: 12 }, (_, k) => {
  const r = ROUTES[Math.floor(rng() * ROUTES.length)];
  const carrier = CARRIERS[Math.floor(rng() * CARRIERS.length)];
  const w = WINDOWS[Math.floor(rng() * WINDOWS.length)];
  const source = OTAS[Math.floor(rng() * OTAS.length)];
  const base = Math.round(r.base * (0.85 + rng() * 0.4));
  const taxes = Math.round(base * 0.12);
  const fee = Math.round(150 + rng() * 250);
  const minsAgo = Math.floor(3 + k * 11 + rng() * 6);
  return {
    id: k,
    route: r.code,
    carrier,
    window: w,
    source,
    base,
    taxes,
    fee,
    total: base + taxes + fee,
    avail: Math.random() > 0.15 ? Math.ceil(rng() * 9) : 0,
    minsAgo,
  };
});

/* ------------------------------------------------------------------ */
/*  Headline stats                                                     */
/* ------------------------------------------------------------------ */
export const APIX_LATEST = DAILY_SERIES[DAILY_SERIES.length - 1].value;
export const APIX_PREV_DAY = DAILY_SERIES[DAILY_SERIES.length - 2].value;
export const APIX_MOM =
  MONTHLY_SERIES.length >= 2
    ? (MONTHLY_SERIES[MONTHLY_SERIES.length - 1].value / MONTHLY_SERIES[MONTHLY_SERIES.length - 2].value - 1) * 100
    : 0;
export const APIX_YOY = 6.4; // illustrative — prototype currently has < 1yr of backtest history

export { rng };
