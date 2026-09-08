import React, { useState, useMemo } from "react";
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
  ReferenceLine,
} from "recharts";
import { useTheme, FONT_UI, FONT_MONO, FONT_DISPLAY } from "../../theme.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";
import Chip from "../ui/Chip.jsx";
import { ExternalLink } from "lucide-react";

const OTA_DATA = [
  { ota: "MakeMyTrip", direct: 350, convenience: 399, seatAddon: 250, total: 999 },
  { ota: "Yatra.com", direct: 350, convenience: 375, seatAddon: 200, total: 925 },
  { ota: "EaseMyTrip", direct: 350, convenience: 0, seatAddon: 200, total: 550 },
  { ota: "Cleartrip", direct: 350, convenience: 350, seatAddon: 220, total: 920 },
  { ota: "Ixigo", direct: 350, convenience: 299, seatAddon: 199, total: 848 },
  { ota: "Goibibo", direct: 350, convenience: 399, seatAddon: 240, total: 989 },
];

const OTA_COLORS = {
  MakeMyTrip: "#F43F5E",
  "Yatra.com": "#818CF8",
  EaseMyTrip: "#10B981",
  Cleartrip: "#38BDF8",
  Ixigo: "#A78BFA",
  Goibibo: "#A78BFA",
};

const STACK_COLORS = {
  convenience: "#818CF8",
  seatAddon: "#A78BFA",
  direct: "#38BDF8",
};

function OtaTooltip({ active, payload, label, C, themeKey }) {
  if (!active || !payload || !payload.length) return null;
  const isDark = themeKey === "dark";
  const total = payload.reduce((s, e) => s + (e.value || 0), 0);
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
        minWidth: 220,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: OTA_COLORS[label] || C.text, marginBottom: 8 }}>
        {label}
      </div>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 14, margin: "4px 0" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, color: C.textMuted, fontSize: 10.5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: entry.fill, boxShadow: `0 0 5px ${entry.fill}` }} />
            {entry.name}
          </span>
          <strong style={{ color: C.text }}>₹{entry.value?.toLocaleString("en-IN")}</strong>
        </div>
      ))}
      <div
        style={{
          marginTop: 8,
          paddingTop: 7,
          borderTop: `1px dashed ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
        }}
      >
        <span style={{ color: C.textMuted }}>Total Markup</span>
        <strong style={{ color: C.text }}>₹{total.toLocaleString("en-IN")}</strong>
      </div>
    </div>
  );
}

export default function OtaMarkupChart() {
  const { C, themeKey } = useTheme();
  const isDark = themeKey === "dark";
  const [paxClass, setPaxClass] = useState("economy");
  const [feeTypeFilter, setFeeTypeFilter] = useState("all");

  const chartData = useMemo(() => {
    const multiplier = paxClass === "business" ? 1.8 : 1.0;
    let data = OTA_DATA.map((item) => ({
      ...item,
      convenience: Math.round(item.convenience * multiplier),
      seatAddon: Math.round(item.seatAddon * multiplier),
      total: Math.round((item.direct + item.convenience + item.seatAddon) * multiplier),
    }));
    if (feeTypeFilter === "zero-fee") data = data.filter((d) => d.convenience === 0);
    else if (feeTypeFilter === "convenience") data = data.filter((d) => d.convenience > 0);
    return data;
  }, [paxClass, feeTypeFilter]);

  return (
    <div style={{ marginTop: 24 }}>
      <SectionHeader
        eyebrow="OTA Transparency"
        title="OTA Convenience Fee & Ancillary Markup Comparison"
        note="Empirical breakdown of platform convenience charges and seat/meal ancillary markups across top Indian OTAs vs Direct Airline API."
      />
      <Panel skeuo={true}>
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            background: isDark
              ? "linear-gradient(150deg, #060910 0%, #0B0F1C 60%, #060810 100%)"
              : "linear-gradient(150deg, #F5F8FF 0%, #FFF7F0 50%, #F5F8FF 100%)",
            border: `1px solid ${isDark ? "rgba(245,158,11,0.10)" : "rgba(245,158,11,0.12)"}`,
            boxShadow: isDark ? "0 4px 30px rgba(0,0,0,0.6)" : "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              top: "8%",
              right: "10%",
              width: 250,
              height: 150,
              background: "radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

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
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint, letterSpacing: "0.04em" }}>CABIN:</span>
              {[
                { key: "economy", label: "Economy" },
                { key: "business", label: "Business / Premium" },
              ].map(({ key, label }) => (
                <Chip key={key} active={paxClass === key} onClick={() => setPaxClass(key)}>
                  {label}
                </Chip>
              ))}
            </div>

            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint, letterSpacing: "0.04em" }}>FILTER:</span>
              {[
                { key: "all", label: "All 6 OTAs" },
                { key: "convenience", label: "With Fee" },
                { key: "zero-fee", label: "Zero Fee" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFeeTypeFilter(key)}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 11px",
                    borderRadius: 9999,
                    border: `1px solid ${feeTypeFilter === key ? "#818CF8" : C.border}`,
                    background: feeTypeFilter === key
                      ? isDark ? "rgba(245,158,11,0.14)" : "rgba(245,158,11,0.10)"
                      : "transparent",
                    color: feeTypeFilter === key ? "#818CF8" : C.textMuted,
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
                key={`${paxClass}-${feeTypeFilter}`}
                data={chartData}
                margin={{ top: 16, right: 18, left: -4, bottom: 0 }}
                barCategoryGap="28%"
              >
                <defs>
                  {Object.entries(STACK_COLORS).map(([key, color]) => (
                    <linearGradient key={key} id={`ota-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={isDark ? 0.95 : 0.85} />
                      <stop offset="100%" stopColor={color} stopOpacity={isDark ? 0.6 : 0.5} />
                    </linearGradient>
                  ))}
                </defs>

                <CartesianGrid
                  stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}
                  strokeDasharray="3 5"
                  vertical={false}
                />
                <XAxis
                  dataKey="ota"
                  tick={({ x, y, payload }) => (
                    <text
                      x={x}
                      y={y + 12}
                      textAnchor="middle"
                      fontFamily={FONT_UI}
                      fontSize={11}
                      fontWeight={600}
                      fill={OTA_COLORS[payload.value] || C.textMuted}
                    >
                      {payload.value}
                    </text>
                  )}
                  axisLine={{ stroke: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={46}
                  tickFormatter={(v) => `₹${v}`}
                />

                <Tooltip
                  content={<OtaTooltip C={C} themeKey={themeKey} />}
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

                <Bar dataKey="convenience" name="OTA Convenience Fee" stackId="fee" fill="url(#ota-convenience)" radius={[0, 0, 6, 6]} />
                <Bar dataKey="seatAddon" name="Seat / Baggage Markup" stackId="fee" fill="url(#ota-seatAddon)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="direct" name="Direct Statutory Fee" stackId="fee" fill="url(#ota-direct)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend color bar */}
          <div
            style={{
              padding: "10px 18px 14px",
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
            }}
          >
            {Object.entries(STACK_COLORS).map(([key, color]) => (
              <span key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_MONO, fontSize: 10.5, color: C.textMuted }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: isDark ? `0 0 6px ${color}` : "none" }} />
                {key === "convenience" ? "Convenience Fee" : key === "seatAddon" ? "Seat/Baggage Markup" : "Statutory Fee"}
              </span>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}
