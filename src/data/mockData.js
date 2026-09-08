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
/*  MoSPI PSD Basket of Routes & DGCA Passenger Traffic Weights        */
/* ------------------------------------------------------------------ */
export const ROUTES = [
  {
    code: "DEL-BOM",
    name: "Delhi \u2192 Mumbai",
    base: 5400,
    vol: 0.16,
    weight: 0.19,
    paxMonthly: 8.42, // Lakh passengers
    paxShare: 19.2, // %
    distanceKm: 1148,
    loadFactor: 88.4,
  },
  {
    code: "DEL-BLR",
    name: "Delhi \u2192 Bengaluru",
    base: 6200,
    vol: 0.14,
    weight: 0.15,
    paxMonthly: 6.55,
    paxShare: 15.0,
    distanceKm: 1740,
    loadFactor: 86.8,
  },
  {
    code: "BOM-BLR",
    name: "Mumbai \u2192 Bengaluru",
    base: 4300,
    vol: 0.12,
    weight: 0.13,
    paxMonthly: 5.68,
    paxShare: 13.0,
    distanceKm: 842,
    loadFactor: 85.2,
  },
  {
    code: "DEL-CCU",
    name: "Delhi \u2192 Kolkata",
    base: 5800,
    vol: 0.18,
    weight: 0.10,
    paxMonthly: 4.38,
    paxShare: 10.0,
    distanceKm: 1305,
    loadFactor: 87.1,
  },
  {
    code: "BLR-HYD",
    name: "Bengaluru \u2192 Hyderabad",
    base: 3200,
    vol: 0.11,
    weight: 0.09,
    paxMonthly: 3.94,
    paxShare: 9.0,
    distanceKm: 500,
    loadFactor: 84.6,
  },
  {
    code: "MAA-DEL",
    name: "Chennai \u2192 Delhi",
    base: 6600,
    vol: 0.15,
    weight: 0.12,
    paxMonthly: 5.25,
    paxShare: 12.0,
    distanceKm: 1760,
    loadFactor: 86.0,
  },
  {
    code: "DEL-HYD",
    name: "Delhi \u2192 Hyderabad",
    base: 5600,
    vol: 0.13,
    weight: 0.11,
    paxMonthly: 4.81,
    paxShare: 11.0,
    distanceKm: 1253,
    loadFactor: 87.4,
  },
  {
    code: "BOM-CCU",
    name: "Mumbai \u2192 Kolkata",
    base: 6900,
    vol: 0.17,
    weight: 0.11,
    paxMonthly: 4.80,
    paxShare: 10.8,
    distanceKm: 1658,
    loadFactor: 85.9,
  },
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
/*  30-Day Backtest vs DGCA Monthly Published Average Benchmark        */
/* ------------------------------------------------------------------ */
export const BACKTEST_DAYS = 30;
export const BACKTEST_SERIES = Array.from({ length: BACKTEST_DAYS }, (_, i) => {
  const dayOffset = -(BACKTEST_DAYS - 1) + i;
  const d = new Date(TODAY);
  d.setDate(d.getDate() + dayOffset);
  const dateStr = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

  const dailyBase = 140.8 + (i * 0.06);
  const weekendEffect = (i % 7 === 5 || i % 7 === 6) ? 3.4 : 0;
  const surgeShift = (i >= 12 && i <= 16) ? 4.8 : 0;
  const noise = (rng() - 0.5) * 1.4;
  const apixDaily = Math.round((dailyBase + weekendEffect + surgeShift + noise) * 10) / 10;
  const apixSmooth = Math.round((dailyBase + (surgeShift * 0.6) + 0.9) * 10) / 10;
  const dgcaBenchmark = i < 15 ? 141.2 : 142.4;
  const trackingDelta = Math.round((apixDaily - dgcaBenchmark) * 10) / 10;

  let eventNote = null;
  if (i === 5 || i === 12 || i === 19 || i === 26) eventNote = "Weekend surge (+2.3%)";
  if (i === 14) eventNote = "Holiday travel peak";
  if (i === 22) eventNote = "Fuel surcharge repricing";

  return {
    day: i + 1,
    date: dateStr,
    apixDaily,
    apixSmooth,
    dgcaBenchmark,
    trackingDelta,
    eventNote,
  };
});

export const BACKTEST_STATS = {
  correlationR2: 0.938,
  meanAbsoluteDelta: 1.42,
  sampleQuotesTested: 48620,
  volatilityRatio: "3.4x",
  dgcaCoveragePeriod: "30 Days Backtest (Aug 2026)",
};

/* ------------------------------------------------------------------ */
/*  NEW: Fare Components Stacked Breakdown Series                     */
/* ------------------------------------------------------------------ */
export const FARE_COMPONENTS_SERIES = WINDOWS.map((w) => {
  const baseAvg = 5200 * (1 + (15 - w) / 30 * 0.45);
  const udfTaxes = 650;
  const convenienceFee = 250;
  return {
    window: `T+${w}`,
    baseFare: Math.round(baseAvg),
    udfTaxes: Math.round(udfTaxes),
    convenienceFee: Math.round(convenienceFee),
    totalFare: Math.round(baseAvg + udfTaxes + convenienceFee),
  };
});

/* ------------------------------------------------------------------ */
/*  NEW: Intra-day 24-Hour Volatility Swings (200-400% surge)         */
/* ------------------------------------------------------------------ */
export const INTRADAY_VOLATILITY = Array.from({ length: 18 }, (_, k) => {
  const hour = 6 + k; // 06:00 to 23:00
  const timeStr = `${hour < 10 ? "0" + hour : hour}:00`;
  const isMorningPeak = hour >= 7 && hour <= 9;
  const isEveningPeak = hour >= 18 && hour <= 21;
  const multiplier = isMorningPeak ? 2.4 : isEveningPeak ? 3.1 : 1.0;
  const fare = Math.round(4800 * multiplier + (rng() - 0.5) * 350);
  return {
    time: timeStr,
    fare,
    isPeak: isMorningPeak || isEveningPeak,
    surgeLabel: isMorningPeak ? "Morning Rush (+140%)" : isEveningPeak ? "Evening Rush (+210%)" : "Standard",
  };
});

/* ------------------------------------------------------------------ */
/*  NEW: OTA vs Airline Direct Price Spread                            */
/* ------------------------------------------------------------------ */
export const OTA_DIRECT_COMPARISON = OTAS.map((source) => {
  const isDirect = source === "Airline Direct";
  const baseAvg = 5400;
  const fee = isDirect ? 0 : 299;
  const otaDiscount = isDirect ? 0 : Math.round((rng() - 0.3) * 180);
  return {
    source,
    baseFare: baseAvg - otaDiscount,
    fee,
    netPrice: baseAvg - otaDiscount + fee,
    type: isDirect ? "Direct Airline Portal" : "Online Travel Aggregator",
  };
});

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
  return {
    name,
    fare: Math.round(avg * skew * (1 + (rng() - 0.5) * 0.06)),
    marketShare: CARRIER_SHARE[idx],
  };
});

/* ------------------------------------------------------------------ */
/*  Latest raw quotes feed (with Base vs Taxes vs UDF Separation)      */
/* ------------------------------------------------------------------ */
const FLIGHT_PREFIXES = {
  "IndiGo": "6E",
  "Air India": "AI",
  "Akasa Air": "QP",
  "SpiceJet": "SG",
  "Air India Express": "IX",
};

export const QUOTES = Array.from({ length: 16 }, (_, k) => {
  const r = ROUTES[Math.floor(rng() * ROUTES.length)];
  const carrier = CARRIERS[Math.floor(rng() * CARRIERS.length)];
  const w = WINDOWS[Math.floor(rng() * WINDOWS.length)];
  const source = OTAS[Math.floor(rng() * OTAS.length)];
  const prefix = FLIGHT_PREFIXES[carrier] || "FL";
  const flightNo = `${prefix}-${Math.floor(100 + rng() * 899)}`;

  const base = Math.round(r.base * (0.85 + rng() * 0.45));
  const udf = Math.round(280 + rng() * 320);
  const psfTaxes = Math.round(base * 0.06);
  const convenienceFee = source === "Airline Direct" ? 0 : Math.round(199 + rng() * 100);
  const total = base + udf + psfTaxes + convenienceFee;

  const minsAgo = Math.floor(2 + k * 8 + rng() * 5);
  const isSoldOut = k === 7 || (k === 13 && rng() > 0.4);
  const seatsAvail = isSoldOut ? 0 : Math.ceil(1 + rng() * 8);

  return {
    id: k,
    flightNo,
    route: r.code,
    routeName: r.name,
    carrier,
    window: w,
    source,
    fareClass: w <= 7 ? "Dynamic Standard" : "Saver Economy",
    base,
    udf,
    taxes: psfTaxes,
    fee: convenienceFee,
    total,
    avail: seatsAvail,
    isSoldOut,
    status: isSoldOut ? "SOLD OUT" : `${seatsAvail} seats`,
    cleaned: true,
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
export const APIX_YOY = 6.4;

export { rng };
