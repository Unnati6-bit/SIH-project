import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { useTheme, FONT_MONO, FONT_UI, FONT_DISPLAY } from "../../theme.js";
import { FARE_COMPONENTS_SERIES, ROUTES } from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";
import Chip from "../ui/Chip.jsx";

/* Layer palette */
const LAYER = {
  base: { color: "#38BDF8", label: "Base Fare (Airline Yield)", grad: ["#38BDF8", "#818CF8"] },
  udf: { color: "#10B981", label: "Airport UDF / PSF & Taxes", grad: ["#10B981", "#34D399"] },
  convenience: { color: "#818CF8", label: "OTA Convenience Charge", grad: ["#818CF8", "#A78BFA"] },
};

function FareTooltip({ active, payload, label, C, themeKey, viewMode }) {
  if (!active || !payload || !payload.length) return null;
  const isDark = themeKey === "dark";
  return (
    <div
      style={{
        background: isDark ? "rgba(6,9,20,0.96)" : "rgba(255,255,255,0.97)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: 12,
        padding: "12px 16px",
        boxShadow: isDark ? "0 10px 40px rgba(0,0,0,0.8)" : "0 8px 30px rgba(0,0,0,0.1)",
        fontFamily: FONT_MONO,
        minWidth: 210,
      }}
    >
      <div style={{ fontSize: 10, color: C.textFaint, marginBottom: 8, letterSpacing: "0.04em" }}>
        {label} · ADVANCE PURCHASE WINDOW
      </div>
      {payload.map((entry, i) => {
        const layerKey = Object.keys(LAYER).find((k) =>
          entry.dataKey?.includes(k.charAt(0).toUpperCase() + k.slice(1)) ||
          entry.dataKey?.toLowerCase().includes(k)
        );
        const lc = layerKey ? LAYER[layerKey].color : entry.fill;
        return (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 14, margin: "5px 0" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: C.textMuted, fontSize: 11 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: lc || entry.fill, boxShadow: `0 0 5px ${lc || entry.fill}` }} />
              {entry.name}
            </span>
            <strong style={{ color: C.text }}>
              {viewMode === "percentage" ? `${entry.value}%` : `₹${entry.value?.toLocaleString("en-IN")}`}
            </strong>
          </div>
        );
      })}
    </div>
  );
}

export default function FareComponentsChart() {
  const { C, themeKey } = useTheme();
  const isDark = themeKey === "dark";
  const [selectedRoute, setSelectedRoute] = useState("DEL-BOM");
  const [viewMode, setViewMode] = useState("absolute");

  const activeRouteObj = ROUTES.find((r) => r.code === selectedRoute) || ROUTES[0];

  const chartData = FARE_COMPONENTS_SERIES.map((d) => {
    const routeMult = activeRouteObj.base / 5200;
    const baseFare = Math.round(d.baseFare * routeMult);
    const udfTaxes = Math.round(d.udfTaxes * (0.9 + routeMult * 0.1));
    const convenienceFee = d.convenienceFee;
    const total = baseFare + udfTaxes + convenienceFee;

    if (viewMode === "percentage") {
      return {
        window: d.window,
        baseFarePct: Math.round((baseFare / total) * 100),
        udfTaxesPct: Math.round((udfTaxes / total) * 100),
        convenienceFeePct: Math.round((convenienceFee / total) * 100),
        total,
      };
    }
    return { window: d.window, baseFare, udfTaxes, convenienceFee, total };
  });

  return (
    <div style={{ marginBottom: 44 }}>
      <SectionHeader
        eyebrow="EPL Data Cleaning & Unbundling"
        title="Fare Component Separation — Base vs. UDF vs. Taxes"
        note="Decouples pure airline seat yield from statutory airport User Development Fees (UDF) and platform convenience charges."
      />

      <Panel skeuo={true}>
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            background: isDark
              ? "linear-gradient(150deg, #060910 0%, #09101E 60%, #050810 100%)"
              : "linear-gradient(150deg, #F5F8FF 0%, #F0FDFB 60%, #F5F8FF 100%)",
            border: `1px solid ${isDark ? "rgba(56,189,248,0.08)" : "rgba(16,185,129,0.10)"}`,
            boxShadow: isDark ? "0 4px 30px rgba(0,0,0,0.6)" : "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          {/* ── CONTROLS ── */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint, letterSpacing: "0.04em" }}>ROUTE:</span>
              {ROUTES.slice(0, 5).map((r) => (
                <Chip key={r.code} active={selectedRoute === r.code} onClick={() => setSelectedRoute(r.code)}>
                  {r.code}
                </Chip>
              ))}
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              {[
                { key: "absolute", label: "₹ RUPEE" },
                { key: "percentage", label: "% SHARE" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key)}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: "5px 13px",
                    borderRadius: 9999,
                    border: `1px solid ${viewMode === key ? "#10B981" : C.border}`,
                    background: viewMode === key
                      ? isDark ? "rgba(16,185,129,0.14)" : "rgba(16,185,129,0.10)"
                      : "transparent",
                    color: viewMode === key ? "#10B981" : C.textMuted,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── CHART ── */}
          <div style={{ padding: "8px 0 0" }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                key={`${selectedRoute}-${viewMode}`}
                data={chartData}
                margin={{ top: 16, right: 18, left: -6, bottom: 0 }}
                barCategoryGap="28%"
              >
                <defs>
                  {["base", "udf", "convenience"].map((k) => (
                    <linearGradient key={k} id={`fc-${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={LAYER[k]?.color || "#888"} stopOpacity={isDark ? 0.95 : 0.85} />
                      <stop offset="100%" stopColor={LAYER[k]?.grad?.[1] || "#888"} stopOpacity={isDark ? 0.7 : 0.6} />
                    </linearGradient>
                  ))}
                  <filter id="stackGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <CartesianGrid
                  stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}
                  strokeDasharray="3 5"
                  vertical={false}
                />
                <XAxis
                  dataKey="window"
                  tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 11 }}
                  axisLine={{ stroke: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  unit={viewMode === "percentage" ? "%" : ""}
                  width={46}
                />

                <Tooltip
                  content={<FareTooltip C={C} themeKey={themeKey} viewMode={viewMode} />}
                  cursor={{
                    fill: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                    radius: 8,
                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontFamily: FONT_MONO,
                    fontSize: 10.5,
                    paddingTop: 10,
                    color: C.textMuted,
                  }}
                />

                <Bar
                  dataKey={viewMode === "percentage" ? "baseFarePct" : "baseFare"}
                  name="Base Fare (Airline Yield)"
                  stackId="a"
                  fill="url(#fc-base)"
                  radius={[0, 0, 6, 6]}
                />
                <Bar
                  dataKey={viewMode === "percentage" ? "udfTaxesPct" : "udfTaxes"}
                  name="Airport UDF / Taxes"
                  stackId="a"
                  fill="url(#fc-udf)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey={viewMode === "percentage" ? "convenienceFeePct" : "convenienceFee"}
                  name="OTA Convenience Fee"
                  stackId="a"
                  fill="url(#fc-convenience)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Panel>
    </div>
  );
}
