import React, { useState } from "react";
import { Download, FileText, FileJson, Printer, CheckCircle, Loader } from "lucide-react";
import { useTheme, FONT_DISPLAY, FONT_MONO, FONT_UI } from "../../theme.js";
import { ROUTES, CARRIERS } from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import Eyebrow from "../ui/Eyebrow.jsx";

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(9999);

// Helpers
function generateIndexCSV() {
  const header = "Date,National_APIx,MoM_Change_pct,YoY_Change_pct,DEL_BOM,DEL_BLR,BOM_BLR,DEL_CCU\n";
  const rows = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    const base = 187 + rng() * 10 - 5;
    return `${d.toISOString().slice(0, 10)},${base.toFixed(2)},${(rng() * 2 - 0.8).toFixed(2)},${(rng() * 6 + 2).toFixed(2)},${(base * 1.05).toFixed(2)},${(base * 0.98).toFixed(2)},${(base * 0.92).toFixed(2)},${(base * 1.01).toFixed(2)}`;
  });
  return header + rows.join("\n");
}

function generateQuotesCSV() {
  const header = "Date,Route,Carrier,BookingWindow,BaseFare,Taxes,ConvenienceFee,TotalFare,Availability\n";
  const rows = Array.from({ length: 50 }, (_, i) => {
    const route = ROUTES[i % ROUTES.length];
    const carrier = CARRIERS[i % CARRIERS.length];
    const windows = ["T+1", "T+7", "T+15", "T+30", "T+45"];
    const win = windows[i % 5];
    const base = Math.round(route.base * (0.9 + rng() * 0.3));
    const tax = Math.round(base * 0.18);
    const conv = 299;
    const d = new Date(); d.setDate(d.getDate() - Math.floor(i / 10));
    return `${d.toISOString().slice(0, 10)},${route.code},${carrier},${win},${base},${tax},${conv},${base + tax + conv},1`;
  });
  return header + rows.join("\n");
}

function generateIndexJSON() {
  return JSON.stringify({
    meta: {
      source: "SkyMetric — India Aviation Price Intelligence",
      generated: new Date().toISOString(),
      base_year: 2012,
      unit: "Index Points (Base 2012=100)",
      coverage: "National basket, DGCA high-traffic routes",
    },
    series: Array.from({ length: 30 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (29 - i));
      const val = 187 + rng() * 10 - 5;
      return { date: d.toISOString().slice(0, 10), national_apix: parseFloat(val.toFixed(2)), mom: parseFloat((rng() * 2 - 0.8).toFixed(2)) };
    }),
  }, null, 2);
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

const REPORT_TYPES = [
  {
    id: "index_csv",
    title: "National Index Series (CSV)",
    desc: "30-day daily SkyMetric national airfare index with MoM/YoY changes and route-level breakdown.",
    icon: FileText,
    color: "#3B82F6",
    badge: "DAILY · 30D",
    action: () => downloadFile(generateIndexCSV(), `skymetric_index_${new Date().toISOString().slice(0, 10)}.csv`, "text/csv"),
  },
  {
    id: "quotes_csv",
    title: "Raw Quotes Snapshot (CSV)",
    desc: "Granular micro-quote records with base fare, taxes, convenience fees, and availability flags.",
    icon: FileText,
    color: "#10B981",
    badge: "MICRO-DATA",
    action: () => downloadFile(generateQuotesCSV(), `skymetric_quotes_${new Date().toISOString().slice(0, 10)}.csv`, "text/csv"),
  },
  {
    id: "index_json",
    title: "Index Series JSON (API Format)",
    desc: "Machine-readable JSON in the same format as the NSO/RBI API endpoint for programmatic consumption.",
    icon: FileJson,
    color: "#F59E0B",
    badge: "API-COMPATIBLE",
    action: () => downloadFile(generateIndexJSON(), `skymetric_index_${new Date().toISOString().slice(0, 10)}.json`, "application/json"),
  },
  {
    id: "print",
    title: "Print Summary Report",
    desc: "Print or export as PDF a formatted one-page summary report with headline index, KPIs, and route table.",
    icon: Printer,
    color: "#8B5CF6",
    badge: "PDF / PRINT",
    action: () => window.print(),
  },
];

export default function ReportsPanel() {
  const { C, themeKey } = useTheme();
  const [downloading, setDownloading] = useState(null);
  const [done, setDone] = useState({});

  const handleDownload = (report) => {
    setDownloading(report.id);
    setTimeout(() => {
      report.action();
      setDownloading(null);
      setDone((prev) => ({ ...prev, [report.id]: true }));
      setTimeout(() => setDone((prev) => { const n = { ...prev }; delete n[report.id]; return n; }), 3000);
    }, 800);
  };

  return (
    <Panel skeuo style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ padding: "22px 24px 18px", borderBottom: `1px solid ${C.hairline}` }}>
        <Eyebrow>Data Exports &middot; Research Downloads &middot; SkyMetric</Eyebrow>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 800, color: C.text, margin: "6px 0 4px", letterSpacing: "-0.02em" }}>
          Download Reports
        </h2>
        <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted, margin: 0 }}>
          Export airfare index data, raw quotes, and formatted reports for institutional research and econometric analysis.
        </p>

        {/* Info badges */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          {[
            { label: "30 Days of Data", color: "#3B82F6" },
            { label: "8 Routes Covered", color: "#10B981" },
            { label: `${CARRIERS?.length || 3} Carriers`, color: "#F59E0B" },
            { label: "Base Year 2012=100", color: "#8B5CF6" },
          ].map((b) => (
            <span key={b.label} style={{ fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 9999, background: `${b.color}18`, border: `1px solid ${b.color}40`, color: b.color }}>
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* Report Cards */}
      <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {REPORT_TYPES.map((report) => {
          const Icon = report.icon;
          const isLoading = downloading === report.id;
          const isDone = done[report.id];
          return (
            <div
              key={report.id}
              className="apix-card-hover"
              style={{
                padding: "20px",
                borderRadius: 14,
                border: `1px solid ${report.color}35`,
                background: `${report.color}08`,
                boxShadow: C.cardShadow,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Icon + Badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${report.color}20`, border: `1px solid ${report.color}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={22} color={report.color} strokeWidth={1.75} />
                </div>
                <span style={{ fontFamily: FONT_MONO, fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 9999, background: `${report.color}20`, border: `1px solid ${report.color}40`, color: report.color, letterSpacing: "0.06em" }}>
                  {report.badge}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <div style={{ fontFamily: FONT_UI, fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>{report.title}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 12, color: C.textMuted, lineHeight: 1.55 }}>{report.desc}</div>
              </div>

              {/* Download Button */}
              <button
                onClick={() => handleDownload(report)}
                disabled={isLoading}
                className="apix-skeuo-btn"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", padding: "10px 16px", borderRadius: 9,
                  border: `1.5px solid ${isDone ? "#10B981" : report.color}`,
                  background: isDone ? "rgba(16,185,129,0.15)" : `${report.color}18`,
                  color: isDone ? "#10B981" : report.color,
                  fontFamily: FONT_UI, fontSize: 13, fontWeight: 700,
                  cursor: isLoading ? "wait" : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader size={14} style={{ animation: "spin 1s linear infinite" }} />
                    Preparing...
                  </>
                ) : isDone ? (
                  <>
                    <CheckCircle size={14} />
                    Downloaded!
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    {report.id === "print" ? "Print / Export PDF" : "Download"}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Data Disclaimer */}
      <div style={{ margin: "0 24px 24px", padding: "14px 16px", borderRadius: 10, background: C.bgAlt, border: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
        <FileText size={16} color={C.textFaint} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontFamily: FONT_UI, fontSize: 11.5, color: C.textFaint, margin: 0, lineHeight: 1.6 }}>
          All exported data contains <strong style={{ color: C.textMuted }}>illustrative sample figures</strong> for demonstration purposes only.
          In production, exports would reflect live scraper output from Akasa Air, SpiceJet, and Yatra.com. Not for official statistical reporting.
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </Panel>
  );
}
