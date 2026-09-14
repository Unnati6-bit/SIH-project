import React, { useState } from "react";
import { Terminal, Download, Copy, Check, ShieldCheck } from "lucide-react";
import { useTheme, FONT_DISPLAY, FONT_UI, FONT_MONO } from "../../theme.js";
import {
  DAILY_SERIES,
  ROUTES,
  QUOTES,
  BACKTEST_SERIES,
  APIX_LATEST,
} from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";
import Chip from "../ui/Chip.jsx";

const ENDPOINTS = [
  {
    id: "national",
    method: "GET",
    path: "/v1/index/national?freq=daily&base=2012",
    label: "National APIx Series",
    desc: "Returns high-frequency daily, weekly, or monthly chained Jevons index for CPI Transport & Communication augmentation.",
    getData: () => ({
      status: "success",
      frequency: "daily",
      base_year: "2012=100",
      latest_index: APIX_LATEST,
      series_count: DAILY_SERIES.length,
      timestamp: new Date().toISOString(),
      data: DAILY_SERIES.slice(-7),
    }),
  },
  {
    id: "routes",
    method: "GET",
    path: "/v1/index/routes",
    label: "Route-Level Basket & Weights",
    desc: "Returns DGCA passenger-traffic weighted route components and current sector index levels.",
    getData: () => ({
      status: "success",
      total_routes: ROUTES.length,
      psd_total_weight: 1.0,
      timestamp: new Date().toISOString(),
      routes: ROUTES.map((r) => ({
        code: r.code,
        name: r.name,
        psd_weight: r.weight,
        dgca_pax_share_pct: r.paxShare,
        monthly_pax_lakhs: r.paxMonthly,
        base_reference_fare: r.base,
      })),
    }),
  },
  {
    id: "quotes",
    method: "GET",
    path: "/v1/quotes?limit=10",
    label: "Raw Scraped Quotes Feed",
    desc: "Granular micro-data with base fare, airport taxes, UDF, convenience fee, and availability flags.",
    getData: () => ({
      status: "success",
      returned_quotes: QUOTES.length,
      timestamp: new Date().toISOString(),
      quotes: QUOTES.map((q) => ({
        flight_no: q.flightNo,
        route: q.route,
        carrier: q.carrier,
        window_days: `T+${q.window}`,
        source: q.source,
        fare_class: q.fareClass,
        base_fare: q.base,
        udf_fee: q.udf,
        taxes: q.taxes,
        convenience_fee: q.fee,
        total_fare: q.total,
        is_sold_out: q.isSoldOut,
        seats_available: q.avail,
        cleaned_status: q.cleaned,
      })),
    }),
  },
  {
    id: "backtest",
    method: "GET",
    path: "/v1/analytics/backtest?period=30d",
    label: "DGCA 30-Day Benchmark Dataset",
    desc: "Backtested daily APIx series juxtaposed against official DGCA domestic average airfare benchmarks.",
    getData: () => ({
      status: "success",
      period: "30_days",
      econometric_metrics: {
        r_squared: 0.938,
        mean_absolute_delta: 1.42,
        volatility_multiplier: "3.4x",
      },
      series: BACKTEST_SERIES.slice(0, 10),
    }),
  },
];

export default function ApiPanel() {
  const { C } = useTheme();
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [copied, setCopied] = useState(false);

  const activeData = selectedEndpoint.getData();
  const jsonString = JSON.stringify(activeData, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`curl -H "Authorization: Bearer rbi_nso_live_token" "https://apix.mospi.gov.in${selectedEndpoint.path}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `apix_${selectedEndpoint.id}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCsv = () => {
    let csvContent = "";
    if (selectedEndpoint.id === "national") {
      csvContent = "Date,DayOffset,APIx_Index\n" + DAILY_SERIES.map((d) => `${d.date},${d.dayOffset},${d.value}`).join("\n");
    } else if (selectedEndpoint.id === "routes") {
      csvContent = "Code,Name,DistanceKm,MonthlyPaxLakhs,PaxSharePct,PSDWeight,BaseFare\n" +
        ROUTES.map((r) => `"${r.code}","${r.name}",${r.distanceKm},${r.paxMonthly},${r.paxShare},${r.weight},${r.base}`).join("\n");
    } else if (selectedEndpoint.id === "quotes") {
      csvContent = "FlightNo,Route,Carrier,Window,Source,FareClass,BaseFare,UDF,Taxes,ConvenienceFee,TotalFare,SeatsAvailable,IsSoldOut\n" +
        QUOTES.map((q) => `"${q.flightNo}","${q.route}","${q.carrier}","T+${q.window}","${q.source}","${q.fareClass}",${q.base},${q.udf},${q.taxes},${q.fee},${q.total},${q.avail},${q.isSoldOut}`).join("\n");
    } else {
      csvContent = "Day,Date,APIxDaily,APIxSmooth,DGCABenchmark,TrackingDelta\n" +
        BACKTEST_SERIES.map((b) => `${b.day},${b.date},${b.apixDaily},${b.apixSmooth},${b.dgcaBenchmark},${b.trackingDelta}`).join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `apix_${selectedEndpoint.id}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ marginBottom: 44 }}>
      <SectionHeader
        eyebrow="Government Research Gateway"
        title="REST API & Data Exporter for NSO / RBI"
        note="Machine-readable high-frequency airfare price series and micro-quotes feed. Standardized for macroeconomic inflation forecasting and monetary policy deliberation."
      />

      <Panel>
        {/* Top Endpoint Pill Selector */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {ENDPOINTS.map((ep) => (
            <Chip
              key={ep.id}
              active={selectedEndpoint.id === ep.id}
              onClick={() => setSelectedEndpoint(ep)}
            >
              <span style={{ color: selectedEndpoint.id === ep.id ? "#FFFFFF" : C.teal, fontWeight: 700, marginRight: 6 }}>
                {ep.method}
              </span>
              {ep.label}
            </Chip>
          ))}
        </div>

        {/* Endpoint Bar with Rounded Box */}
        <div
          style={{
            background: C.bgAlt,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "14px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                fontWeight: 700,
                background: C.teal,
                color: "#FFFFFF",
                padding: "4px 9px",
                borderRadius: 9999, // Pill badge
              }}
            >
              {selectedEndpoint.method}
            </span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.text, fontWeight: 600 }}>
              https://apix.mospi.gov.in{selectedEndpoint.path}
            </span>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: C.teal,
                border: `1px solid ${C.tealSoft}`,
                padding: "3px 9px",
                borderRadius: 9999,
                background: C.panel,
              }}
            >
              200 OK &middot; 14ms
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={copyToClipboard}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 8, // Rounded button
                padding: "7px 12px",
                fontFamily: FONT_MONO,
                fontSize: 11.5,
                fontWeight: 500,
                cursor: "pointer",
                color: C.text,
                transition: "all 0.15s ease",
              }}
            >
              {copied ? <Check size={13} color={C.teal} strokeWidth={1.8} /> : <Copy size={13} strokeWidth={1.75} />}
              {copied ? "COPIED cURL" : "COPY cURL"}
            </button>

            <button
              onClick={downloadJson}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 8, // Rounded button
                padding: "7px 12px",
                fontFamily: FONT_MONO,
                fontSize: 11.5,
                fontWeight: 500,
                cursor: "pointer",
                color: C.text,
                transition: "all 0.15s ease",
              }}
            >
              <Download size={13} color={C.amber} strokeWidth={1.75} /> EXPORT JSON
            </button>

            <button
              onClick={downloadCsv}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 8, // Rounded button
                padding: "7px 12px",
                fontFamily: FONT_MONO,
                fontSize: 11.5,
                fontWeight: 500,
                cursor: "pointer",
                color: C.text,
                transition: "all 0.15s ease",
              }}
            >
              <Download size={13} color={C.teal} strokeWidth={1.75} /> EXPORT CSV
            </button>
          </div>
        </div>

        {/* Description */}
        <div style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted, marginBottom: 14 }}>
          {selectedEndpoint.desc}
        </div>

        {/* Live Response Code Block with Rounded Card */}
        <div
          style={{
            background: "#0B1120",
            border: `1px solid ${C.border}`,
            padding: 18,
            borderRadius: 12, // Smooth rounded code container
            maxHeight: 280,
            overflowY: "auto",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, borderBottom: "1px solid #1E293B", paddingBottom: 6 }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#94A3B8" }}>
              HTTP/1.1 200 OK &middot; Content-Type: application/json
            </span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#2DD4BF" }}>
              X-RateLimit-Remaining: 994/1000
            </span>
          </div>
          <pre
            style={{
              margin: 0,
              fontFamily: FONT_MONO,
              fontSize: 12,
              color: "#E2E8F0",
              lineHeight: 1.65,
              whiteSpace: "pre-wrap",
            }}
          >
            {jsonString}
          </pre>
        </div>

        {/* Auth & Security Notice with Rounded Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 16,
            padding: "12px 16px",
            borderRadius: 10,
            background: C.bgAlt,
            border: `1px solid ${C.border}`,
            fontFamily: FONT_UI,
            fontSize: 12.5,
            color: C.textMuted,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: C.tealSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={16} color={C.teal} strokeWidth={1.75} style={{ strokeLinecap: "round", strokeLinejoin: "round" }} />
          </div>
          <div>
            <strong style={{ color: C.text }}>Institutional Authentication:</strong> Endpoints are secured via mTLS and token authorization for registered IP ranges of MoSPI (National Statistical Office) and RBI Monetary Policy Department. Supports automated ingestion scripts in R, Python, and Stata.
          </div>
        </div>
      </Panel>
    </div>
  );
}
