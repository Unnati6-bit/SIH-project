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
import { ROUTES } from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";
import Chip from "../ui/Chip.jsx";
import { Zap, TrendingUp, ArrowDownRight } from "lucide-react";

const HOURLY_TIMES = [
  "06:00","07:00","08:00","09:00","10:00","11:00",
  "12:00","13:00","14:00","15:00","16:00","17:00",
  "18:00","19:00","20:00","21:00","22:00","23:00",
];

const PROFILE_META = {
  weekday: { label: "Weekday Business", color: "#38BDF8", gradient: ["#38BDF8", "#818CF8"] },
  weekend: { label: "Weekend Leisure", color: "#10B981", gradient: ["#10B981", "#34D399"] },
  festival: { label: "Festive Rush", color: "#818CF8", gradient: ["#818CF8", "#A78BFA"] },
};

function SurgeTooltip({ active, payload, label, C, themeKey }) {
  if (!active || !payload || !payload.length) return null;
  const isDark = themeKey === "dark";
  const item = payload[0]?.payload;
  const val = payload[0]?.value;
  return (
    <div
      style={{
        background: isDark ? "rgba(6,9,20,0.96)" : "rgba(255,255,255,0.97)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: 12,
        padding: "12px 16px",
        boxShadow: isDark
          ? "0 10px 40px rgba(0,0,0,0.8)"
          : "0 8px 30px rgba(0,0,0,0.12)",
        fontFamily: FONT_MONO,
        minWidth: 200,
      }}
    >
      <div style={{ fontSize: 10, color: C.textFaint, marginBottom: 6, letterSpacing: "0.04em" }}>
        DEPARTURE ·{" "}
        <strong style={{ color: C.text }}>{label}</strong>
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          fontFamily: FONT_DISPLAY,
          color: C.text,
          letterSpacing: "-0.02em",
          marginBottom: 4,
        }}
      >
        ₹{val?.toLocaleString("en-IN")}
      </div>
      <div
        style={{
          display: "inline-block",
          fontSize: 10,
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: 100,
          background: item?.isPeak
            ? "rgba(245,158,11,0.15)"
            : "rgba(16,185,129,0.12)",
          color: item?.isPeak ? "#818CF8" : "#10B981",
        }}
      >
        {item?.surgeLabel}
      </div>
      {item?.multiplier && (
        <div style={{ fontSize: 10, color: C.textFaint, marginTop: 6 }}>
          Surge multiplier: ×{item.multiplier}
        </div>
      )}
    </div>
  );
}

export default function IntradaySurgeChart() {
  const { C, themeKey } = useTheme();
  const isDark = themeKey === "dark";
  const [dayType, setDayType] = useState("weekday");
  const [selectedRoute, setSelectedRoute] = useState("DEL-BOM");
  const [timeFilter, setTimeFilter] = useState("ALL");

  const activeRouteObj = ROUTES.find((r) => r.code === selectedRoute) || ROUTES[0];
  const meta = PROFILE_META[dayType];

  const chartData = useMemo(() => {
    return HOURLY_TIMES.map((timeStr, idx) => {
      const hour = 6 + idx;
      let multiplier = 1.0;

      if (dayType === "weekday") {
        if (hour >= 7 && hour <= 9) multiplier = 2.4 + (hour === 8 ? 0.6 : 0);
        else if (hour >= 18 && hour <= 21) multiplier = 3.1 + (hour === 19 ? 0.7 : 0);
        else if (hour >= 11 && hour <= 16) multiplier = 0.92;
      } else if (dayType === "weekend") {
        if (hour >= 16 && hour <= 22) multiplier = 3.8;
        else if (hour >= 10 && hour <= 15) multiplier = 1.4;
        else multiplier = 1.1;
      } else if (dayType === "festival") {
        if (hour >= 8 && hour <= 21) multiplier = 3.2 + Math.sin(idx * 0.5) * 1.2;
        else multiplier = 2.0;
      }

      const baseFare = activeRouteObj.base;
      const fare = Math.round(baseFare * multiplier);
      const isPeak = multiplier > 2.0;

      let surgeLabel = "Base Fare";
      if (multiplier >= 3.5) surgeLabel = "Extreme Surge (+280%)";
      else if (multiplier >= 2.5) surgeLabel = "Peak Rush (+170%)";
      else if (multiplier >= 1.5) surgeLabel = "Elevated Demand (+60%)";
      else if (multiplier < 1.0) surgeLabel = "Off-Peak Discount (-8%)";

      return { time: timeStr, hour, fare, multiplier: Math.round(multiplier * 10) / 10, isPeak, surgeLabel };
    }).filter((item) => {
      if (timeFilter === "MORNING") return item.hour >= 6 && item.hour <= 12;
      if (timeFilter === "EVENING") return item.hour >= 16 && item.hour <= 23;
      return true;
    });
  }, [dayType, selectedRoute, timeFilter, activeRouteObj]);

  const fares = chartData.map((d) => d.fare);
  const minFare = Math.min(...fares);
  const maxFare = Math.max(...fares);
  const surgeRatio = (maxFare / minFare).toFixed(1);

  const strokeColor = meta.color;
  const gradId = `surge-${dayType}`;

  return (
    <div style={{ marginBottom: 44 }}>
      <SectionHeader
        eyebrow="Intra-Day High-Frequency Pricing"
        title="Intra-Day Demand Surge Volatility"
        note="Live hourly dynamic price fluctuations across morning business rush, evening return rush, and holiday surge windows."
        refCode="LIVE-TELEMETRY"
      />

      <Panel skeuo={true}>
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            background: isDark
              ? "linear-gradient(150deg, #060910 0%, #0A0F1E 60%, #050710 100%)"
              : "linear-gradient(150deg, #F5F8FF 0%, #EEFAF6 50%, #F5F8FF 100%)",
            border: `1px solid ${isDark ? `${strokeColor}14` : `${strokeColor}18`}`,
            boxShadow: isDark
              ? `0 4px 30px rgba(0,0,0,0.7), 0 0 60px ${strokeColor}08`
              : "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              top: "5%",
              right: "15%",
              width: 300,
              height: 200,
              background: `radial-gradient(ellipse, ${strokeColor}08 0%, transparent 70%)`,
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
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint, letterSpacing: "0.04em" }}>
                PROFILE:
              </span>
              {Object.entries(PROFILE_META).map(([key, m]) => (
                <button
                  key={key}
                  onClick={() => setDayType(key)}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: 9999,
                    border: `1px solid ${dayType === key ? m.color : C.border}`,
                    background: dayType === key
                      ? isDark ? `${m.color}15` : `${m.color}12`
                      : "transparent",
                    color: dayType === key ? m.color : C.textMuted,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: dayType === key && isDark ? `0 0 10px ${m.color}25` : "none",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint }}>SECTOR:</span>
              {ROUTES.slice(0, 4).map((r) => (
                <Chip key={r.code} active={selectedRoute === r.code} onClick={() => setSelectedRoute(r.code)}>
                  {r.code}
                </Chip>
              ))}
            </div>
          </div>

          {/* ── SURGE KPI BAR ── */}
          <div
            style={{
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${strokeColor}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isDark ? `0 0 14px ${strokeColor}25` : "none",
                }}
              >
                <Zap size={18} color={strokeColor} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.textFaint, letterSpacing: "0.04em" }}>
                  SURGE RATIO · {selectedRoute}
                </div>
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 26,
                    fontWeight: 800,
                    color: strokeColor,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    textShadow: isDark ? `0 0 16px ${strokeColor}55` : "none",
                  }}
                >
                  {surgeRatio}× <span style={{ fontSize: 13, fontWeight: 500, color: C.textMuted }}>({Math.round((surgeRatio - 1) * 100)}% swing)</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 20 }}>
              {[
                { icon: ArrowDownRight, label: "Off-Peak Floor", val: `₹${minFare.toLocaleString("en-IN")}`, color: "#10B981" },
                { icon: TrendingUp, label: "Peak Surge Ceiling", val: `₹${maxFare.toLocaleString("en-IN")}`, color: strokeColor },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, color: C.textFaint, letterSpacing: "0.03em" }}>{label}</div>
                  <div
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: 18,
                      fontWeight: 800,
                      color,
                      letterSpacing: "-0.02em",
                      textShadow: isDark ? `0 0 12px ${color}44` : "none",
                    }}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CHART ── */}
          <div style={{ padding: "4px 0 0" }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                key={`${dayType}-${selectedRoute}-${timeFilter}`}
                data={chartData}
                margin={{ top: 20, right: 18, left: 4, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={meta.gradient[0]} stopOpacity={isDark ? 0.55 : 0.35} />
                    <stop offset="35%" stopColor={meta.gradient[0]} stopOpacity={isDark ? 0.25 : 0.15} />
                    <stop offset="100%" stopColor={meta.gradient[1]} stopOpacity={0} />
                  </linearGradient>
                  <filter id={`glow-${dayType}`}>
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
                  dataKey="time"
                  tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10 }}
                  axisLine={{ stroke: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[Math.floor(minFare * 0.82), Math.ceil(maxFare * 1.1)]}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
                  width={46}
                />

                <Tooltip
                  content={<SurgeTooltip C={C} themeKey={themeKey} />}
                  cursor={{
                    stroke: `${strokeColor}30`,
                    strokeWidth: 1.5,
                    strokeDasharray: "3 3",
                  }}
                />

                {dayType === "weekday" && (
                  <>
                    <ReferenceArea
                      x1="07:00"
                      x2="09:00"
                      fill={`${strokeColor}08`}
                      label={{ value: "Morning Rush", fill: strokeColor, fontSize: 9, fontFamily: FONT_MONO, position: "insideTop" }}
                    />
                    <ReferenceArea
                      x1="18:00"
                      x2="21:00"
                      fill={`${strokeColor}10`}
                      label={{ value: "Evening Rush", fill: strokeColor, fontSize: 9, fontFamily: FONT_MONO, position: "insideTop" }}
                    />
                  </>
                )}
                {dayType === "weekend" && (
                  <ReferenceArea
                    x1="16:00"
                    x2="22:00"
                    fill={`${strokeColor}10`}
                    label={{ value: "Sunday Surge", fill: strokeColor, fontSize: 9, fontFamily: FONT_MONO, position: "insideTop" }}
                  />
                )}
                {dayType === "festival" && (
                  <ReferenceArea
                    x1="08:00"
                    x2="21:00"
                    fill={`${strokeColor}08`}
                    label={{ value: "Festive Rush Zone", fill: strokeColor, fontSize: 9, fontFamily: FONT_MONO, position: "insideTop" }}
                  />
                )}

                <ReferenceLine
                  y={minFare}
                  stroke={isDark ? "rgba(16,185,129,0.25)" : "rgba(16,185,129,0.4)"}
                  strokeDasharray="4 4"
                  label={{
                    value: `Floor ₹${minFare}`,
                    fill: "#10B981",
                    fontSize: 9.5,
                    fontFamily: FONT_MONO,
                    position: "insideBottomRight",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="fare"
                  stroke={strokeColor}
                  strokeWidth={2.8}
                  fill={`url(#${gradId})`}
                  name={`Intra-Day Fare (${selectedRoute})`}
                  filter={isDark ? `url(#glow-${dayType})` : undefined}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (!payload.isPeak) return null;
                    return (
                      <g key={cx}>
                        <circle cx={cx} cy={cy} r={8} fill={strokeColor} opacity={0.12} />
                        <circle cx={cx} cy={cy} r={4.5} fill={strokeColor} stroke="#fff" strokeWidth={1.5} />
                      </g>
                    );
                  }}
                  activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: strokeColor }}
                  isAnimationActive={true}
                  animationDuration={600}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Panel>
    </div>
  );
}
