import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Play, Pause, Activity, Sliders, TrendingUp } from "lucide-react";
import { useTheme, FONT_MONO, FONT_DISPLAY, FONT_UI } from "../../theme.js";
import { DAILY_SERIES, WEEKLY_SERIES, MONTHLY_SERIES, rng } from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";
import Chip from "../ui/Chip.jsx";

/* ── Glassmorphic Tooltip ───────────────────────────────────────────── */
function GlowTooltip({ active, payload, label, C, themeKey }) {
  if (!active || !payload || !payload.length) return null;
  const isDark = themeKey === "dark";
  const bg = isDark
    ? "rgba(10,10,20,0.92)"
    : "rgba(255,255,255,0.96)";
  const mainVal = payload[0]?.value;
  const diff = (mainVal - 100).toFixed(1);

  return (
    <div
      style={{
        background: bg,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${isDark ? "rgba(56,189,248,0.25)" : "rgba(17,60,104,0.18)"}`,
        borderRadius: 14,
        padding: "14px 18px",
        boxShadow: isDark
          ? "0 8px 32px rgba(56,189,248,0.18), 0 2px 8px rgba(0,0,0,0.8)"
          : "0 8px 32px rgba(17,60,104,0.15), 0 2px 8px rgba(0,0,0,0.08)",
        fontFamily: FONT_MONO,
        fontSize: 12,
        color: C.text,
        minWidth: 220,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          paddingBottom: 8,
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
        }}
      >
        <span style={{ color: C.textMuted, fontWeight: 700, fontSize: 11 }}>{label}</span>
        <span
          style={{
            background: isDark ? "rgba(56,189,248,0.15)" : "rgba(17,60,104,0.10)",
            color: C.blue,
            fontSize: 9,
            padding: "2px 8px",
            borderRadius: 100,
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
        >
          ◉ LIVE TELEMETRY
        </span>
      </div>

      {payload.map((entry, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            margin: "5px 0",
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
          <strong style={{ color: C.text, fontFamily: FONT_MONO }}>{entry.value} pts</strong>
        </div>
      ))}

      <div
        style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: `1px dashed ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
          fontSize: 10.5,
          color: C.textFaint,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Δ vs Base 2012=100:</span>
        <strong style={{ color: Number(diff) >= 0 ? "#10B981" : "#F43F5E" }}>
          {Number(diff) >= 0 ? `+${diff}` : diff} pts
        </strong>
      </div>
    </div>
  );
}

/* ── Custom Glowing Active Dot ──────────────────────────────────────── */
function GlowDot(props) {
  const { cx, cy, fill } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={fill} opacity={0.12} />
      <circle cx={cx} cy={cy} r={6} fill={fill} opacity={0.25} />
      <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#fff" strokeWidth={1.5} />
    </g>
  );
}

export default function TrendChart() {
  const { C, themeKey } = useTheme();
  const isDark = themeKey === "dark";

  const [freq, setFreq] = useState("Daily");
  const [windowHorizon, setWindowHorizon] = useState(15);
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamSpeed, setStreamSpeed] = useState(1);
  const [streamTicks, setStreamTicks] = useState(0);
  const [showDelBom, setShowDelBom] = useState(true);
  const [showDelBlr, setShowDelBlr] = useState(false);

  const [liveData, setLiveData] = useState(() =>
    DAILY_SERIES.map((d, idx) => ({
      ...d,
      delBom: Math.round((d.value * 1.05 + Math.sin(idx * 0.4) * 2.2) * 10) / 10,
      delBlr: Math.round((d.value * 0.96 + Math.cos(idx * 0.3) * 1.8) * 10) / 10,
    }))
  );

  useEffect(() => {
    if (!isStreaming) return;
    const intervalTime = Math.max(400, 1600 / streamSpeed);
    const interval = setInterval(() => {
      setLiveData((prev) => {
        if (!prev || prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const nextNoise = (rng() - 0.48) * 1.8;
        const nextVal = Math.round((last.value + nextNoise * 0.4) * 10) / 10;
        const nextDelBom = Math.round((nextVal * 1.05 + (rng() - 0.5) * 2.1) * 10) / 10;
        const nextDelBlr = Math.round((nextVal * 0.96 + (rng() - 0.5) * 1.9) * 10) / 10;
        const updated = [...prev.slice(1)];
        const nextIndex = last.i + 1;
        updated.push({
          i: nextIndex,
          dayOffset: last.dayOffset + 1,
          date: "Live " + (nextIndex % 60 + "s"),
          value: nextVal,
          delBom: nextDelBom,
          delBlr: nextDelBlr,
        });
        return updated;
      });
      setStreamTicks((t) => t + 1);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isStreaming, streamSpeed, windowHorizon]);

  const baseData =
    freq === "Weekly"
      ? WEEKLY_SERIES.map((d) => ({
          ...d,
          delBom: Math.round(d.value * 1.05 * 10) / 10,
          delBlr: Math.round(d.value * 0.96 * 10) / 10,
        }))
      : freq === "Monthly"
      ? MONTHLY_SERIES.map((d) => ({
          ...d,
          delBom: Math.round(d.value * 1.05 * 10) / 10,
          delBlr: Math.round(d.value * 0.96 * 10) / 10,
        }))
      : liveData;

  const displayData = baseData.map((d) => {
    const em = 1 + ((30 - windowHorizon) / 30) * 0.12;
    return {
      ...d,
      value: Math.round(d.value * em * 10) / 10,
      delBom: Math.round(d.delBom * em * 10) / 10,
      delBlr: Math.round(d.delBlr * em * 10) / 10,
    };
  });

  const latestVal = displayData[displayData.length - 1]?.value || 142.4;
  const prevVal = displayData[displayData.length - 2]?.value || 141.8;
  const tickDelta = (latestVal - prevVal).toFixed(1);
  const isUp = Number(tickDelta) >= 0;

  // Theme-aware accent palette
  const ACCENT = isDark ? "#38BDF8" : "#113C68";
  const ACCENT2 = "#10B981";
  const ACCENT3 = "#A78BFA";

  return (
    <div style={{ marginBottom: 44 }}>
      <SectionHeader
        eyebrow="Government of India · Real-time Econometric Index"
        title="National APIx Over Time (Live Moving Telemetry)"
        note="Jevons geometric aggregates chained with DGCA route-level passenger weights and high-frequency scraper ticks."
      />

      <Panel skeuo={true}>
        {/* ── Chart container with glow backdrop ── */}
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            background: isDark
              ? "linear-gradient(160deg, #050810 0%, #080C18 50%, #040710 100%)"
              : "linear-gradient(160deg, #F4F8FF 0%, #EFF5FF 50%, #F0F9F5 100%)",
            border: `1px solid ${isDark ? "rgba(56,189,248,0.10)" : "rgba(17,60,104,0.08)"}`,
            boxShadow: isDark
              ? "0 0 60px rgba(56,189,248,0.05) inset, 0 4px 24px rgba(0,0,0,0.5)"
              : "0 0 40px rgba(17,60,104,0.04) inset, 0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          {/* Ambient radial glow behind chart */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "30%",
              width: 340,
              height: 200,
              background: isDark
                ? "radial-gradient(ellipse, rgba(56,189,248,0.06) 0%, transparent 70%)"
                : "radial-gradient(ellipse, rgba(17,60,104,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* ── CONTROL BAR ── */}
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
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {["Daily", "Weekly", "Monthly"].map((f) => (
                  <Chip key={f} active={freq === f} onClick={() => setFreq(f)}>
                    {f.toUpperCase()}
                  </Chip>
                ))}
              </div>

              <button
                onClick={() => setIsStreaming(!isStreaming)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "5px 13px",
                  borderRadius: 9999,
                  border: `1px solid ${isStreaming ? "rgba(16,185,129,0.5)" : C.border}`,
                  background: isStreaming
                    ? isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)"
                    : "transparent",
                  color: isStreaming ? ACCENT2 : C.textMuted,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  letterSpacing: "0.03em",
                }}
              >
                {isStreaming ? <><Pause size={11} /><span>PAUSE</span></> : <><Play size={11} /><span>STREAM</span></>}
                {isStreaming && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: ACCENT2,
                      boxShadow: `0 0 6px ${ACCENT2}`,
                      animation: "pulse 1.2s ease infinite",
                    }}
                  />
                )}
              </button>

              {isStreaming && (
                <div style={{ display: "flex", gap: 2 }}>
                  {[1, 2, 4].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setStreamSpeed(spd)}
                      style={{
                        border: "none",
                        background: streamSpeed === spd
                          ? isDark ? "rgba(56,189,248,0.2)" : "rgba(17,60,104,0.12)"
                          : "transparent",
                        color: streamSpeed === spd ? ACCENT : C.textFaint,
                        fontFamily: FONT_MONO,
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 6,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {spd}×
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Live Oracle Ticker */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                padding: "6px 14px",
                borderRadius: 10,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              }}
            >
              <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.textFaint }}>LATEST TICK</span>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontWeight: 800,
                  color: ACCENT,
                  fontSize: 16,
                  letterSpacing: "-0.02em",
                  textShadow: isDark ? `0 0 12px ${ACCENT}55` : "none",
                }}
              >
                {latestVal}
              </span>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 10.5,
                  fontWeight: 800,
                  padding: "2px 7px",
                  borderRadius: 100,
                  background: isUp ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)",
                  color: isUp ? "#10B981" : "#F43F5E",
                }}
              >
                {isUp ? `+${tickDelta}` : tickDelta}
              </span>
            </div>
          </div>

          {/* ── SLIDERS / TOGGLES ── */}
          <div
            style={{
              padding: "12px 18px",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr",
              gap: 14,
              alignItems: "center",
            }}
            className="apix-two-col"
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.textMuted,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Sliders size={12} color={ACCENT} /> Advance Booking Horizon
                </span>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: ACCENT,
                    background: isDark ? "rgba(56,189,248,0.1)" : "rgba(17,60,104,0.08)",
                    padding: "2px 9px",
                    borderRadius: 7,
                    letterSpacing: "-0.01em",
                  }}
                >
                  T+{windowHorizon}d
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="45"
                step="1"
                value={windowHorizon}
                onChange={(e) => setWindowHorizon(Number(e.target.value))}
                className="apix-slider"
                style={{ width: "100%" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: FONT_MONO,
                  fontSize: 9,
                  color: C.textFaint,
                  marginTop: 3,
                  letterSpacing: "0.02em",
                }}
              >
                <span>T+1 Surge</span>
                <span>T+15 Median</span>
                <span>T+45 Base</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: C.textFaint, letterSpacing: "0.04em" }}>
                SUPERIMPOSE ROUTES:
              </span>
              {[
                { key: "showDelBom", label: "DEL-BOM", color: ACCENT2, val: showDelBom, set: setShowDelBom },
                { key: "showDelBlr", label: "DEL-BLR", color: ACCENT3, val: showDelBlr, set: setShowDelBlr },
              ].map(({ label, color, val, set }) => (
                <label
                  key={label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: FONT_MONO,
                    fontSize: 11.5,
                    color: val ? color : C.textFaint,
                    cursor: "pointer",
                    fontWeight: val ? 700 : 400,
                    transition: "color 0.2s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) => set(e.target.checked)}
                    style={{ accentColor: color, cursor: "pointer", width: 14, height: 14 }}
                  />
                  <span
                    style={{
                      width: 20,
                      height: 3,
                      background: val ? color : C.hairline,
                      borderRadius: 3,
                      boxShadow: val ? `0 0 6px ${color}` : "none",
                      transition: "all 0.2s",
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* ── CHART ── */}
          <div style={{ padding: "4px 0 0 0" }}>
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart
                key={`${freq}-${windowHorizon}-${showDelBom}-${showDelBlr}`}
                data={displayData}
                margin={{ top: 20, right: 20, left: -8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="trendMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={isDark ? 0.5 : 0.3} />
                    <stop offset="40%" stopColor={ACCENT} stopOpacity={isDark ? 0.2 : 0.12} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="trendBom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT2} stopOpacity={isDark ? 0.4 : 0.22} />
                    <stop offset="100%" stopColor={ACCENT2} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="trendBlr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT3} stopOpacity={isDark ? 0.35 : 0.18} />
                    <stop offset="100%" stopColor={ACCENT3} stopOpacity={0} />
                  </linearGradient>
                  <filter id="trendGlow">
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
                  dataKey="date"
                  tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10 }}
                  axisLine={{ stroke: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
                  tickLine={false}
                  minTickGap={30}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={42}
                />

                <Tooltip
                  content={<GlowTooltip C={C} themeKey={themeKey} />}
                  cursor={{
                    stroke: isDark ? "rgba(56,189,248,0.2)" : "rgba(17,60,104,0.15)",
                    strokeWidth: 1.5,
                    strokeDasharray: "4 3",
                  }}
                />

                <ReferenceLine
                  y={DAILY_SERIES[0]?.value || 100}
                  stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}
                  strokeDasharray="4 4"
                  label={{
                    value: "Base 2012=100",
                    fill: C.textFaint,
                    fontSize: 9.5,
                    fontFamily: FONT_MONO,
                    position: "insideTopRight",
                  }}
                />

                {/* Primary: National APIx */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={ACCENT}
                  strokeWidth={2.5}
                  fill="url(#trendMain)"
                  name="National APIx Basket"
                  dot={false}
                  activeDot={<GlowDot fill={ACCENT} />}
                  isAnimationActive={true}
                  animationDuration={500}
                  filter={isDark ? "url(#trendGlow)" : undefined}
                />

                {showDelBom && (
                  <Area
                    type="monotone"
                    dataKey="delBom"
                    stroke={ACCENT2}
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    fill="url(#trendBom)"
                    name="DEL-BOM Sector"
                    dot={false}
                    activeDot={<GlowDot fill={ACCENT2} />}
                    isAnimationActive={true}
                    animationDuration={500}
                  />
                )}

                {showDelBlr && (
                  <Area
                    type="monotone"
                    dataKey="delBlr"
                    stroke={ACCENT3}
                    strokeWidth={2}
                    strokeDasharray="2 3"
                    fill="url(#trendBlr)"
                    name="DEL-BLR Sector"
                    dot={false}
                    activeDot={<GlowDot fill={ACCENT3} />}
                    isAnimationActive={true}
                    animationDuration={500}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* ── LEGEND FOOTER ── */}
          <div
            style={{
              padding: "12px 18px",
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              {[
                { label: "National APIx", color: ACCENT, show: true },
                { label: "DEL-BOM", color: ACCENT2, show: showDelBom },
                { label: "DEL-BLR", color: ACCENT3, show: showDelBlr },
              ]
                .filter((l) => l.show)
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: C.textFaint,
              }}
            >
              <Activity size={11} color={ACCENT} />
              Ticks: {streamTicks} · Econometric Engine Active
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
