import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  Play,
  Pause,
  RotateCcw,
  Calendar,
  Zap,
} from "lucide-react";
import { useTheme, FONT_MONO, FONT_DISPLAY, FONT_UI } from "../../theme.js";
import { BACKTEST_SERIES, BACKTEST_STATS } from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";
import Chip from "../ui/Chip.jsx";

/* ── Premium Tooltip ────────────────────────────────────────────────── */
function BacktestTooltip({ active, payload, label, C, themeKey }) {
  if (!active || !payload || !payload.length) return null;
  const isDark = themeKey === "dark";
  const dataItem = payload[0]?.payload;

  return (
    <div
      style={{
        background: isDark ? "rgba(8,12,24,0.96)" : "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${isDark ? "rgba(56,189,248,0.2)" : "rgba(17,60,104,0.15)"}`,
        borderRadius: 14,
        padding: "14px 18px",
        boxShadow: isDark
          ? "0 12px 40px rgba(0,0,0,0.85), 0 0 30px rgba(56,189,248,0.08)"
          : "0 8px 32px rgba(0,0,0,0.12)",
        fontFamily: FONT_MONO,
        fontSize: 12,
        color: C.text,
        minWidth: 230,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
          paddingBottom: 8,
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        }}
      >
        <span style={{ color: C.textMuted, fontWeight: 700 }}>{label}</span>
        <span
          style={{
            background: isDark ? "rgba(56,189,248,0.12)" : "rgba(17,60,104,0.08)",
            color: isDark ? "#38BDF8" : "#113C68",
            fontSize: 9,
            padding: "2px 8px",
            borderRadius: 100,
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
        >
          DAY {dataItem?.day}
        </span>
      </div>
      {payload.map((entry, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            margin: "5px 0",
            alignItems: "center",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 7, color: C.textMuted }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: entry.color,
                boxShadow: `0 0 6px ${entry.color}`,
              }}
            />
            {entry.name}
          </span>
          <strong style={{ color: C.text }}>{entry.value} pts</strong>
        </div>
      ))}
      {dataItem?.eventNote && (
        <div
          style={{
            marginTop: 8,
            paddingTop: 7,
            borderTop: `1px dashed ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            fontSize: 10.5,
            color: "#10B981",
            fontWeight: 700,
          }}
        >
          ◈ {dataItem.eventNote}
        </div>
      )}
    </div>
  );
}

/* ── Stat Tile ───────────────────────────────────────────────────────── */
function StatTile({ icon: Icon, label, value, unit, accent, C, isDark }) {
  return (
    <div
      style={{
        position: "relative",
        background: isDark
          ? "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,250,255,0.9) 100%)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(17,60,104,0.08)"}`,
        borderRadius: 14,
        padding: "16px 18px",
        overflow: "hidden",
      }}
    >
      {/* Top accent glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: isDark ? `${accent}18` : `${accent}14`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isDark ? `0 0 12px ${accent}22` : "none",
          }}
        >
          <Icon size={15} color={accent} strokeWidth={1.75} />
        </div>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 10,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: C.textFaint,
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 28,
          fontWeight: 800,
          color: C.text,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          marginBottom: 4,
          textShadow: isDark ? `0 0 20px ${accent}22` : "none",
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted, marginLeft: 3 }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function BacktestChart() {
  const { C, themeKey } = useTheme();
  const isDark = themeKey === "dark";

  const [viewMode, setViewMode] = useState("all");
  const [activeDayIdx, setActiveDayIdx] = useState(29);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveDayIdx((prev) => (prev >= BACKTEST_SERIES.length - 1 ? 0 : prev + 1));
    }, 600);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeDayData = BACKTEST_SERIES[activeDayIdx] || BACKTEST_SERIES[0];
  const activeDelta = Math.abs(activeDayData.apixDaily - activeDayData.dgcaBenchmark).toFixed(2);

  const BLUE = isDark ? "#38BDF8" : "#113C68";
  const EMERALD = "#10B981";
  const VIOLET = "#A78BFA";

  return (
    <div style={{ marginBottom: 44 }}>
      <SectionHeader
        eyebrow="DGCA & MoSPI Empirical Validation"
        title="30-Day Backtest Replay vs. DGCA Benchmark"
        note="Comparison of daily high-frequency APIx against official DGCA monthly average-fare reports across 8 top domestic sectors."
      />

      <Panel skeuo={true}>
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            background: isDark
              ? "linear-gradient(160deg, #060910 0%, #09101E 60%, #050810 100%)"
              : "linear-gradient(160deg, #F5F8FF 0%, #EEF4FF 60%, #F4F9F6 100%)",
            border: `1px solid ${isDark ? "rgba(56,189,248,0.08)" : "rgba(17,60,104,0.07)"}`,
            boxShadow: isDark
              ? "0 4px 30px rgba(0,0,0,0.6)"
              : "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "20%",
              width: 400,
              height: 200,
              background: isDark
                ? "radial-gradient(ellipse, rgba(56,189,248,0.05) 0%, transparent 70%)"
                : "radial-gradient(ellipse, rgba(17,60,104,0.04) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* ── REPLAY CONTROLS ── */}
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
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  fontFamily: FONT_MONO,
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: "7px 16px",
                  borderRadius: 9999,
                  border: `1px solid ${isPlaying ? "rgba(16,185,129,0.5)" : C.border}`,
                  background: isPlaying
                    ? "rgba(16,185,129,0.12)"
                    : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                  color: isPlaying ? EMERALD : C.text,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  letterSpacing: "0.03em",
                }}
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                {isPlaying ? "PAUSE REPLAY" : "▶ PLAY 30D REPLAY"}
              </button>

              <button
                onClick={() => { setIsPlaying(false); setActiveDayIdx(0); }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                  border: `1px solid ${C.border}`,
                  color: C.textMuted,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                <RotateCcw size={13} />
              </button>

              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11.5,
                  color: C.textMuted,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Calendar size={12} color={BLUE} />
                Day {activeDayIdx + 1}/30 · <strong style={{ color: C.text }}>{activeDayData.date}</strong>
              </span>
            </div>

            {/* Live HUD */}
            <div
              style={{
                display: "flex",
                gap: 16,
                fontFamily: FONT_MONO,
                fontSize: 11.5,
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                padding: "7px 14px",
                borderRadius: 10,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
              }}
            >
              <span>
                APIx:{" "}
                <strong style={{ color: BLUE, textShadow: isDark ? `0 0 10px ${BLUE}44` : "none" }}>
                  {activeDayData.apixDaily} pts
                </strong>
              </span>
              <span style={{ color: C.hairline }}>|</span>
              <span>
                DGCA:{" "}
                <strong style={{ color: EMERALD, textShadow: isDark ? `0 0 10px ${EMERALD}44` : "none" }}>
                  {activeDayData.dgcaBenchmark} pts
                </strong>
              </span>
              <span style={{ color: C.hairline }}>|</span>
              <span>
                Δ:{" "}
                <strong style={{ color: Number(activeDelta) < 1.5 ? EMERALD : VIOLET }}>
                  {activeDelta} pts
                </strong>
              </span>
            </div>
          </div>

          {/* Scrubber */}
          <div style={{ padding: "10px 18px" }}>
            <input
              type="range"
              min="0"
              max="29"
              step="1"
              value={activeDayIdx}
              onChange={(e) => { setIsPlaying(false); setActiveDayIdx(Number(e.target.value)); }}
              className="apix-slider"
              style={{ width: "100%" }}
            />
          </div>

          {/* ── KPI STATS GRID ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
              padding: "8px 18px 16px",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
            }}
          >
            <StatTile icon={CheckCircle2} label="Correlation (R²)" value={BACKTEST_STATS.correlationR2} accent={EMERALD} C={C} isDark={isDark} />
            <StatTile icon={Activity} label="Tracking Delta MAD" value={BACKTEST_STATS.meanAbsoluteDelta} unit="pts" accent={BLUE} C={C} isDark={isDark} />
            <StatTile icon={TrendingUp} label="Dynamic Sensitivity" value={BACKTEST_STATS.volatilityRatio} accent={VIOLET} C={C} isDark={isDark} />
            <StatTile icon={Layers} label="Quotes Audited" value={BACKTEST_STATS.sampleQuotesTested.toLocaleString("en-IN")} accent="#818CF8" C={C} isDark={isDark} />
          </div>

          {/* ── VIEW MODE TOGGLE ── */}
          <div
            style={{
              padding: "12px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { key: "all", label: "COMBINED" },
                { key: "daily", label: "DAILY VOLATILITY" },
                { key: "smoothed", label: "7D SMOOTHED" },
              ].map(({ key, label }) => (
                <Chip key={key} active={viewMode === key} onClick={() => setViewMode(key)}>
                  {label}
                </Chip>
              ))}
            </div>

            <div style={{ display: "flex", gap: 16, fontFamily: FONT_MONO, fontSize: 10.5, color: C.textFaint }}>
              {[
                { label: "Daily APIx", color: BLUE },
                { label: "7D Smooth", color: "#14B8A6" },
                { label: "DGCA Benchmark", color: EMERALD },
              ].map(({ label, color }) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 16, height: 2.5, background: color, borderRadius: 3, boxShadow: `0 0 5px ${color}` }} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* ── CHART ── */}
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={BACKTEST_SERIES} margin={{ top: 10, right: 18, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="backtestFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BLUE} stopOpacity={isDark ? 0.45 : 0.28} />
                  <stop offset="50%" stopColor={BLUE} stopOpacity={isDark ? 0.15 : 0.08} />
                  <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                </linearGradient>
                <filter id="backtestGlow">
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
                dataKey="date"
                tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10 }}
                axisLine={{ stroke: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
                tickLine={false}
                minTickGap={20}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />

              <Tooltip
                content={<BacktestTooltip C={C} themeKey={themeKey} />}
                cursor={{
                  stroke: isDark ? "rgba(56,189,248,0.2)" : "rgba(17,60,104,0.12)",
                  strokeWidth: 1.5,
                  strokeDasharray: "3 3",
                }}
              />

              {/* Moving vertical needle */}
              <ReferenceLine
                x={activeDayData.date}
                stroke={BLUE}
                strokeWidth={1.5}
                strokeDasharray="3 3"
                label={{
                  value: `Day ${activeDayIdx + 1}`,
                  fill: BLUE,
                  fontSize: 9.5,
                  fontFamily: FONT_MONO,
                  position: "insideTopLeft",
                }}
              />

              {(viewMode === "all" || viewMode === "daily") && (
                <Area
                  type="monotone"
                  dataKey="apixDaily"
                  name="Daily Real-Time APIx"
                  stroke={BLUE}
                  strokeWidth={2.5}
                  fill="url(#backtestFill)"
                  dot={false}
                  activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2, fill: BLUE, filter: isDark ? "url(#backtestGlow)" : undefined }}
                  isAnimationActive={true}
                  animationDuration={500}
                  filter={isDark ? "url(#backtestGlow)" : undefined}
                />
              )}

              {(viewMode === "all" || viewMode === "smoothed") && (
                <Line
                  type="monotone"
                  dataKey="apixSmooth"
                  name="7-Day Smoothed APIx"
                  stroke="#14B8A6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2, fill: "#14B8A6" }}
                  isAnimationActive={true}
                  animationDuration={500}
                />
              )}

              <Line
                type="stepAfter"
                dataKey="dgcaBenchmark"
                name="DGCA Monthly Benchmark"
                stroke={EMERALD}
                strokeWidth={2.2}
                strokeDasharray="6 3"
                dot={{ r: 3, fill: EMERALD, stroke: "#fff", strokeWidth: 1.5 }}
                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: EMERALD }}
                isAnimationActive={true}
                animationDuration={500}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
