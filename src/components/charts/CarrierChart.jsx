import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { useTheme, FONT_UI, FONT_MONO, FONT_DISPLAY } from "../../theme.js";
import { CARRIER_DATA } from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";
import Chip from "../ui/Chip.jsx";

/* Carrier color palette — each airline gets a unique vibrant color */
const CARRIER_COLORS = {
  IndiGo: { stroke: "#38BDF8", grad: ["#38BDF8", "#818CF8"] },
  "Air India": { stroke: "#818CF8", grad: ["#818CF8", "#A78BFA"] },
  "Akasa Air": { stroke: "#10B981", grad: ["#10B981", "#34D399"] },
  SpiceJet: { stroke: "#F43F5E", grad: ["#F43F5E", "#FB7185"] },
  Vistara: { stroke: "#A78BFA", grad: ["#A78BFA", "#C4B5FD"] },
};

function getCarrierColor(name) {
  for (const [key, val] of Object.entries(CARRIER_COLORS)) {
    if (name.includes(key)) return val;
  }
  return { stroke: "#64748B", grad: ["#64748B", "#94A3B8"] };
}

function CarrierTooltip({ active, payload, label, C, themeKey }) {
  if (!active || !payload || !payload.length) return null;
  const isDark = themeKey === "dark";
  const entry = payload[0];
  const cc = getCarrierColor(entry?.payload?.name || "");
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
        minWidth: 190,
      }}
    >
      <div style={{ fontSize: 10, color: C.textFaint, marginBottom: 6 }}>
        {entry?.payload?.code || "All Routes"}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          fontFamily: FONT_DISPLAY,
          color: cc.stroke,
          letterSpacing: "-0.03em",
          textShadow: isDark ? `0 0 16px ${cc.stroke}55` : "none",
          marginBottom: 3,
        }}
      >
        ₹{entry.value?.toLocaleString("en-IN")}
      </div>
      <div style={{ fontSize: 10.5, color: C.textMuted }}>Average Basket Yield</div>
    </div>
  );
}

/* Custom bar shape with rounded right edge and glow */
function GlowBar(props) {
  const { x, y, width, height, fill, stroke } = props;
  const r = 6;
  if (!height || height <= 0) return null;
  return (
    <g>
      {/* Glow behind */}
      <rect x={x} y={y + 4} width={width} height={height - 4} rx={r} ry={r} fill={fill} opacity={0.15} filter="url(#barGlow)" />
      {/* Main bar */}
      <rect x={x} y={y} width={width} height={height} rx={r} ry={r} fill={fill} />
    </g>
  );
}

export default function CarrierChart() {
  const { C, themeKey } = useTheme();
  const isDark = themeKey === "dark";
  const [carrierType, setCarrierType] = useState("ALL");
  const [sortBy, setSortBy] = useState("fare-desc");

  const filteredData = useMemo(() => {
    let data = [...CARRIER_DATA];
    if (carrierType === "FSC") {
      data = data.filter((c) => c.name.includes("Air India") && !c.name.includes("Express"));
    } else if (carrierType === "LCC") {
      data = data.filter((c) => !c.name.includes("Air India") || c.name.includes("Express"));
    }
    if (sortBy === "fare-desc") data.sort((a, b) => b.fare - a.fare);
    else if (sortBy === "fare-asc") data.sort((a, b) => a.fare - b.fare);
    else data.sort((a, b) => a.name.localeCompare(b.name));
    return data;
  }, [carrierType, sortBy]);

  return (
    <div>
      <SectionHeader
        eyebrow="Carrier Volatility Index"
        title="Average Fare by Carrier — Price Spread Analysis"
        note="Basket average across all tracked routes. Compares yield across FSC and LCC carriers in the DGCA domestic network."
      />
      <Panel skeuo={true}>
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            background: isDark
              ? "linear-gradient(150deg, #060910 0%, #09101E 60%, #050810 100%)"
              : "linear-gradient(150deg, #F5F8FF 0%, #F0F9F5 60%, #F5F8FF 100%)",
            border: `1px solid ${isDark ? "rgba(56,189,248,0.08)" : "rgba(17,60,104,0.07)"}`,
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
            <div style={{ display: "flex", gap: 6 }}>
              {["ALL", "LCC", "FSC"].map((type) => (
                <Chip key={type} active={carrierType === type} onClick={() => setCarrierType(type)}>
                  {type === "ALL" ? "All Carriers" : type === "LCC" ? "Low-Cost" : "Full-Service"}
                </Chip>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint, letterSpacing: "0.04em" }}>SORT:</span>
              {[
                { val: "fare-desc", label: "Highest First" },
                { val: "fare-asc", label: "Lowest First" },
                { val: "name", label: "Name" },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setSortBy(val)}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 9999,
                    border: `1px solid ${sortBy === val ? (isDark ? "#38BDF8" : "#113C68") : C.border}`,
                    background: sortBy === val
                      ? isDark ? "rgba(56,189,248,0.12)" : "rgba(17,60,104,0.08)"
                      : "transparent",
                    color: sortBy === val ? (isDark ? "#38BDF8" : "#113C68") : C.textMuted,
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
          <div style={{ padding: "8px 0 4px" }}>
            <ResponsiveContainer width="100%" height={Math.max(240, filteredData.length * 54 + 60)}>
              <BarChart
                key={`${carrierType}-${sortBy}`}
                data={filteredData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 6, bottom: 0 }}
                barCategoryGap="30%"
              >
                <defs>
                  {filteredData.map((entry) => {
                    const cc = getCarrierColor(entry.name);
                    return (
                      <linearGradient
                        key={entry.name}
                        id={`bar-${entry.name.replace(/\s+/g, "")}`}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor={cc.grad[0]} stopOpacity={isDark ? 0.7 : 0.6} />
                        <stop offset="100%" stopColor={cc.grad[1]} stopOpacity={1} />
                      </linearGradient>
                    );
                  })}
                  <filter id="barGlow" x="-20%" y="-40%" width="140%" height="180%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMergeNode in="blur" />
                  </filter>
                </defs>

                <CartesianGrid
                  stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}
                  strokeDasharray="3 5"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={({ x, y, payload }) => {
                    const cc = getCarrierColor(payload.value);
                    return (
                      <text
                        x={x - 4}
                        y={y + 4}
                        textAnchor="end"
                        fontFamily={FONT_UI}
                        fontSize={11.5}
                        fontWeight={600}
                        fill={cc.stroke}
                      >
                        {payload.value}
                      </text>
                    );
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={120}
                />

                <Tooltip
                  content={<CarrierTooltip C={C} themeKey={themeKey} />}
                  cursor={{
                    fill: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)",
                    radius: 8,
                  }}
                />

                <Bar dataKey="fare" radius={[0, 8, 8, 0]} barSize={22} shape={GlowBar}>
                  {filteredData.map((entry) => {
                    const cc = getCarrierColor(entry.name);
                    return (
                      <Cell
                        key={entry.name}
                        fill={`url(#bar-${entry.name.replace(/\s+/g, "")})`}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Carrier color legend */}
          <div
            style={{
              padding: "10px 18px 14px",
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
            }}
          >
            {filteredData.map((entry) => {
              const cc = getCarrierColor(entry.name);
              return (
                <span
                  key={entry.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: FONT_MONO,
                    fontSize: 10.5,
                    color: C.textMuted,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: cc.stroke,
                      boxShadow: isDark ? `0 0 6px ${cc.stroke}` : "none",
                    }}
                  />
                  {entry.name}
                </span>
              );
            })}
          </div>
        </div>
      </Panel>
    </div>
  );
}
