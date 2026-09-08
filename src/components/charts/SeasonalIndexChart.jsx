import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { useTheme, FONT_MONO, FONT_UI, FONT_DISPLAY } from "../../theme.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";
import Chip from "../ui/Chip.jsx";

const MONTHLY_SEASONAL_DATA = [
  { month: "Jan", rawIndex: 104.2, deseasonalized: 100.5, note: "Winter Post-Holiday Base" },
  { month: "Feb", rawIndex: 98.6, deseasonalized: 99.8, note: "Low Demand Slump" },
  { month: "Mar", rawIndex: 97.4, deseasonalized: 99.2, note: "School Exams Slump" },
  { month: "Apr", rawIndex: 101.5, deseasonalized: 100.1, note: "Spring Travel" },
  { month: "May", rawIndex: 114.8, deseasonalized: 101.2, note: "Summer Vacations (+15%)" },
  { month: "Jun", rawIndex: 121.4, deseasonalized: 101.8, note: "Peak Summer Holiday (+21%)" },
  { month: "Jul", rawIndex: 92.2, deseasonalized: 98.9, note: "Monsoon Slump (-8%)" },
  { month: "Aug", rawIndex: 91.1, deseasonalized: 98.5, note: "Monsoon Floor (-9%)" },
  { month: "Sep", rawIndex: 96.5, deseasonalized: 99.4, note: "Pre-Festive Recovering" },
  { month: "Oct", rawIndex: 118.3, deseasonalized: 101.5, note: "Navratri/Durga Puja (+18%)" },
  { month: "Nov", rawIndex: 128.9, deseasonalized: 102.1, note: "Diwali Peak Rush (+29%)" },
  { month: "Dec", rawIndex: 123.5, deseasonalized: 101.9, note: "Year-End Holiday (+23%)" },
];

const FOCUS_META = {
  ALL: { color: null, label: "Full Year" },
  FESTIVAL: { color: "#818CF8", label: "Festive Peak", months: ["Oct", "Nov", "Dec"], badge: "+29%" },
  SUMMER: { color: "#38BDF8", label: "Summer Rush", months: ["May", "Jun"], badge: "+21%" },
  MONSOON: { color: "#10B981", label: "Monsoon Low", months: ["Jul", "Aug"], badge: "-9%" },
};

function SeasonTooltip({ active, payload, label, C, themeKey }) {
  if (!active || !payload || !payload.length) return null;
  const isDark = themeKey === "dark";
  const note = payload[0]?.payload?.note;
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
        minWidth: 200,
      }}
    >
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint, marginBottom: 6 }}>
        {label} · <span style={{ color: C.textMuted }}>SEASONAL INDEX</span>
      </div>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 14, margin: "4px 0" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, color: C.textMuted, fontSize: 11 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color, boxShadow: `0 0 5px ${entry.color}` }} />
            {entry.name === "rawIndex" ? "Raw CPI" : "X-13 Deseasonalized"}
          </span>
          <strong style={{ color: C.text, fontSize: 13 }}>{entry.value} pts</strong>
        </div>
      ))}
      {note && (
        <div style={{ marginTop: 7, fontSize: 10.5, color: C.textFaint, paddingTop: 6, borderTop: `1px dashed ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
          {note}
        </div>
      )}
    </div>
  );
}

export default function SeasonalIndexChart() {
  const { C, themeKey } = useTheme();
  const isDark = themeKey === "dark";
  const [showAdjusted, setShowAdjusted] = useState(true);
  const [seasonFocus, setSeasonFocus] = useState("ALL");

  const focusMeta = FOCUS_META[seasonFocus];
  const accentColor = focusMeta.color || (isDark ? "#38BDF8" : "#113C68");
  const emerald = "#10B981";
  const violet = "#A78BFA";

  const chartData = useMemo(
    () => MONTHLY_SEASONAL_DATA,
    [seasonFocus]
  );

  return (
    <div style={{ marginTop: 24 }}>
      <SectionHeader
        eyebrow="Econometric Seasonality"
        title="MoSPI Seasonal Adjustment & Festival Surge Index"
        note="Isolates genuine underlying price momentum from festive and holiday volatility using X-13-ARIMA deseasonalization."
        refCode="NSO-CPI-SA"
      />

      <Panel skeuo={true}>
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            background: isDark
              ? "linear-gradient(150deg, #060910 0%, #09101C 60%, #050810 100%)"
              : "linear-gradient(150deg, #F6F9FF 0%, #F0F9F6 50%, #F6F9FF 100%)",
            border: `1px solid ${isDark ? `${accentColor}12` : `${accentColor}16`}`,
            boxShadow: isDark
              ? `0 4px 30px rgba(0,0,0,0.65), 0 0 50px ${accentColor}06`
              : "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "40%",
              width: 300,
              height: 180,
              background: `radial-gradient(ellipse, ${accentColor}07 0%, transparent 70%)`,
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
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint, letterSpacing: "0.04em" }}>
                SEASON FOCUS:
              </span>
              {Object.entries(FOCUS_META).map(([key, m]) => (
                <button
                  key={key}
                  onClick={() => setSeasonFocus(key)}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: 9999,
                    border: `1px solid ${seasonFocus === key ? (m.color || accentColor) : C.border}`,
                    background: seasonFocus === key
                      ? isDark
                        ? `${m.color || accentColor}14`
                        : `${m.color || accentColor}10`
                      : "transparent",
                    color: seasonFocus === key ? (m.color || accentColor) : C.textMuted,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: seasonFocus === key && isDark ? `0 0 10px ${(m.color || accentColor)}22` : "none",
                  }}
                >
                  {m.label}
                  {m.badge && seasonFocus === key && (
                    <span
                      style={{
                        marginLeft: 6,
                        background: `${m.color}22`,
                        color: m.color,
                        borderRadius: 4,
                        padding: "1px 5px",
                        fontSize: 9,
                      }}
                    >
                      {m.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAdjusted(!showAdjusted)}
              style={{
                padding: "6px 14px",
                borderRadius: 9999,
                background: showAdjusted
                  ? isDark ? "rgba(167,139,250,0.14)" : "rgba(167,139,250,0.10)"
                  : "transparent",
                color: showAdjusted ? violet : C.textMuted,
                border: `1px solid ${showAdjusted ? violet : C.border}`,
                fontFamily: FONT_MONO,
                fontSize: 10.5,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: showAdjusted && isDark ? `0 0 10px ${violet}22` : "none",
                letterSpacing: "0.03em",
              }}
            >
              {showAdjusted ? "✓ X-13-ARIMA ON" : "+ DESEASONALIZED"}
            </button>
          </div>

          {/* ── CHART ── */}
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              key={`${seasonFocus}-${showAdjusted}`}
              data={chartData}
              margin={{ top: 20, right: 20, left: -4, bottom: 0 }}
            >
              <defs>
                <linearGradient id="seasonRaw" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={isDark ? 0.5 : 0.3} />
                  <stop offset="40%" stopColor={accentColor} stopOpacity={isDark ? 0.2 : 0.1} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="seasonAdj" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={violet} stopOpacity={isDark ? 0.35 : 0.2} />
                  <stop offset="100%" stopColor={violet} stopOpacity={0} />
                </linearGradient>
                <filter id="seasonGlow">
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
                dataKey="month"
                tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10.5 }}
                axisLine={{ stroke: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
                tickLine={false}
              />
              <YAxis
                domain={[83, 135]}
                tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={44}
              />

              <Tooltip
                content={<SeasonTooltip C={C} themeKey={themeKey} />}
                cursor={{
                  stroke: `${accentColor}25`,
                  strokeWidth: 1.5,
                  strokeDasharray: "3 3",
                }}
              />

              {/* Highlight zones */}
              {seasonFocus === "FESTIVAL" && (
                <ReferenceArea
                  x1="Oct"
                  x2="Dec"
                  fill={`${FOCUS_META.FESTIVAL.color}0E`}
                  label={{
                    value: "DIWALI / YEAR-END  +29%",
                    fill: FOCUS_META.FESTIVAL.color,
                    fontSize: 9.5,
                    fontFamily: FONT_MONO,
                    fontWeight: 700,
                  }}
                />
              )}
              {seasonFocus === "SUMMER" && (
                <ReferenceArea
                  x1="May"
                  x2="Jun"
                  fill={`${FOCUS_META.SUMMER.color}0E`}
                  label={{
                    value: "SUMMER VACATION  +21%",
                    fill: FOCUS_META.SUMMER.color,
                    fontSize: 9.5,
                    fontFamily: FONT_MONO,
                    fontWeight: 700,
                  }}
                />
              )}
              {seasonFocus === "MONSOON" && (
                <ReferenceArea
                  x1="Jul"
                  x2="Aug"
                  fill={`${FOCUS_META.MONSOON.color}0E`}
                  label={{
                    value: "MONSOON SLUMP  −9%",
                    fill: FOCUS_META.MONSOON.color,
                    fontSize: 9.5,
                    fontFamily: FONT_MONO,
                    fontWeight: 700,
                  }}
                />
              )}

              <ReferenceLine
                y={100}
                stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}
                strokeDasharray="4 4"
                label={{
                  value: "Base 100",
                  fill: C.textFaint,
                  fontSize: 9.5,
                  fontFamily: FONT_MONO,
                  position: "insideTopRight",
                }}
              />

              {/* Raw unadjusted */}
              <Area
                type="monotone"
                dataKey="rawIndex"
                name="rawIndex"
                stroke={accentColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#seasonRaw)"
                dot={false}
                activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2, fill: accentColor }}
                isAnimationActive={true}
                animationDuration={600}
                filter={isDark ? "url(#seasonGlow)" : undefined}
              />

              {/* Deseasonalized */}
              {showAdjusted && (
                <Area
                  type="monotone"
                  dataKey="deseasonalized"
                  name="deseasonalized"
                  stroke={violet}
                  strokeWidth={2.2}
                  strokeDasharray="5 3"
                  fillOpacity={1}
                  fill="url(#seasonAdj)"
                  dot={false}
                  activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2, fill: violet }}
                  isAnimationActive={true}
                  animationDuration={600}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>

          {/* Legend footer */}
          <div
            style={{
              padding: "10px 18px 14px",
              display: "flex",
              alignItems: "center",
              gap: 20,
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Raw Unadjusted Airfare CPI", color: accentColor },
              showAdjusted && { label: "Deseasonalized CPI (X-13-ARIMA)", color: violet },
            ]
              .filter(Boolean)
              .map(({ label, color }) => (
                <span
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    color: C.textMuted,
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 3,
                      background: color,
                      borderRadius: 3,
                      boxShadow: `0 0 6px ${color}`,
                    }}
                  />
                  {label}
                </span>
              ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}
