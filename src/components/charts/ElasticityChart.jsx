import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme, FONT_MONO, FONT_DISPLAY, FONT_UI } from "../../theme.js";
import { ROUTES, ELASTICITY, WINDOWS } from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";
import Chip from "../ui/Chip.jsx";

/* Vibrant palette per route */
const ROUTE_PALETTE = [
  { stroke: "#38BDF8", glow: "#38BDF8" },   // sky blue
  { stroke: "#10B981", glow: "#10B981" },   // emerald
  { stroke: "#818CF8", glow: "#818CF8" },   // amber
  { stroke: "#A78BFA", glow: "#A78BFA" },   // violet
  { stroke: "#F43F5E", glow: "#F43F5E" },   // rose
];

function ElasticityTooltip({ active, payload, label, C, themeKey }) {
  if (!active || !payload || !payload.length) return null;
  const isDark = themeKey === "dark";
  return (
    <div
      style={{
        background: isDark ? "rgba(6,9,20,0.97)" : "rgba(255,255,255,0.97)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: 12,
        padding: "12px 16px",
        boxShadow: isDark ? "0 10px 40px rgba(0,0,0,0.8)" : "0 8px 30px rgba(0,0,0,0.1)",
        fontFamily: FONT_MONO,
        minWidth: 210,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: C.textFaint,
          marginBottom: 8,
          letterSpacing: "0.04em",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>ADVANCE PURCHASE WINDOW</span>
        <span
          style={{
            background: isDark ? "rgba(56,189,248,0.12)" : "rgba(17,60,104,0.08)",
            color: isDark ? "#38BDF8" : "#113C68",
            fontSize: 9,
            padding: "2px 7px",
            borderRadius: 100,
            fontWeight: 800,
          }}
        >
          {label}
        </span>
      </div>
      {payload.map((entry, i) => {
        const pal = ROUTE_PALETTE[i % ROUTE_PALETTE.length];
        return (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, margin: "5px 0" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7, color: C.textMuted, fontSize: 11 }}>
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: entry.stroke || pal.stroke,
                  boxShadow: `0 0 6px ${entry.stroke || pal.stroke}`,
                }}
              />
              {entry.name}
            </span>
            <strong style={{ color: C.text, fontFamily: FONT_DISPLAY, fontSize: 13 }}>
              ₹{entry.value?.toLocaleString("en-IN")}
            </strong>
          </div>
        );
      })}
    </div>
  );
}

/* Custom glowing dot */
function RouteActiveDot(props) {
  const { cx, cy, stroke } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={stroke} opacity={0.12} />
      <circle cx={cx} cy={cy} r={5.5} fill={stroke} opacity={0.3} />
      <circle cx={cx} cy={cy} r={4} fill={stroke} stroke="#fff" strokeWidth={1.5} />
    </g>
  );
}

export default function ElasticityChart() {
  const { C, themeKey } = useTheme();
  const isDark = themeKey === "dark";
  const [selectedRoutes, setSelectedRoutes] = useState(["DEL-BOM", "DEL-BLR", "BOM-BLR"]);

  function toggleRoute(code) {
    setSelectedRoutes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : prev.length < 5 ? [...prev, code] : prev
    );
  }

  const chartData = useMemo(() => {
    return WINDOWS.map((w) => {
      const row = { window: `T+${w}` };
      ELASTICITY.filter((e) => selectedRoutes.includes(e.code)).forEach((e) => {
        row[e.code] = e.points.find((p) => p.window === w).fare;
      });
      return row;
    });
  }, [selectedRoutes]);

  return (
    <div>
      <SectionHeader
        eyebrow="Booking Behaviour"
        title="Lead-Time Elasticity — Advance Purchase Window"
        note="Total fare by advance-purchase window across selected routes. Demonstrates non-linear elasticity as departure approaches."
      />
      <Panel skeuo={true}>
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            background: isDark
              ? "linear-gradient(150deg, #060910 0%, #09101E 60%, #050810 100%)"
              : "linear-gradient(150deg, #F5F8FF 0%, #F0F5FF 50%, #F5F8FF 100%)",
            border: `1px solid ${isDark ? "rgba(167,139,250,0.10)" : "rgba(17,60,104,0.08)"}`,
            boxShadow: isDark ? "0 4px 30px rgba(0,0,0,0.6)" : "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              top: "5%",
              left: "50%",
              width: 280,
              height: 160,
              background: "radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* ── ROUTE SELECTOR ── */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint, letterSpacing: "0.04em" }}>
              ROUTES (max 5):
            </span>
            {ROUTES.map((r, idx) => {
              const pal = ROUTE_PALETTE[idx % ROUTE_PALETTE.length];
              const active = selectedRoutes.includes(r.code);
              return (
                <button
                  key={r.code}
                  onClick={() => toggleRoute(r.code)}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: 9999,
                    border: `1px solid ${active ? pal.stroke : C.border}`,
                    background: active
                      ? isDark ? `${pal.stroke}14` : `${pal.stroke}10`
                      : "transparent",
                    color: active ? pal.stroke : C.textMuted,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: active && isDark ? `0 0 10px ${pal.stroke}22` : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {active && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: pal.stroke,
                        boxShadow: isDark ? `0 0 6px ${pal.stroke}` : "none",
                      }}
                    />
                  )}
                  {r.code}
                </button>
              );
            })}
          </div>

          {/* ── CHART ── */}
          <div style={{ padding: "4px 0 0" }}>
            <ResponsiveContainer width="100%" height={290}>
              <LineChart
                key={selectedRoutes.join("-")}
                data={chartData}
                margin={{ top: 20, right: 20, left: -8, bottom: 0 }}
              >
                <defs>
                  <filter id="lineGlowE">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
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
                  tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10.5 }}
                  axisLine={{ stroke: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
                />

                <Tooltip
                  content={<ElasticityTooltip C={C} themeKey={themeKey} />}
                  cursor={{
                    stroke: isDark ? "rgba(167,139,250,0.2)" : "rgba(17,60,104,0.12)",
                    strokeWidth: 1.5,
                    strokeDasharray: "3 3",
                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    paddingTop: 8,
                    color: C.textMuted,
                  }}
                />

                {selectedRoutes.map((code, idx) => {
                  const pal = ROUTE_PALETTE[idx % ROUTE_PALETTE.length];
                  return (
                    <Line
                      key={code}
                      type="monotone"
                      dataKey={code}
                      stroke={pal.stroke}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: pal.stroke, stroke: "#fff", strokeWidth: 1.5 }}
                      activeDot={<RouteActiveDot stroke={pal.stroke} />}
                      isAnimationActive={true}
                      animationDuration={500}
                      filter={isDark ? "url(#lineGlowE)" : undefined}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Panel>
    </div>
  );
}
