import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";
import { GitCompare, Plus, X, TrendingUp, Zap } from "lucide-react";
import { useTheme, FONT_DISPLAY, FONT_MONO, FONT_UI, getTooltipStyle } from "../../theme.js";
import { ROUTES } from "../../data/mockData.js";
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

const WINDOWS = ["T+1", "T+7", "T+15", "T+30", "T+45"];
const ROUTE_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function RouteComparison() {
  const { C, themeKey } = useTheme();
  const [selectedRoutes, setSelectedRoutes] = useState(["DEL-BOM", "DEL-BLR", "BOM-BLR"]);
  const [windowIdx, setWindowIdx] = useState(0);

  const toggleRoute = (code) => {
    setSelectedRoutes((prev) => {
      if (prev.includes(code)) {
        if (prev.length === 1) return prev;
        return prev.filter((r) => r !== code);
      }
      if (prev.length >= 3) return prev;
      return [...prev, code];
    });
  };

  const activeRoutes = ROUTES.filter((r) => selectedRoutes.includes(r.code));

  // Generate per-route, per-window fares
  const routeFares = useMemo(() =>
    ROUTES.reduce((acc, route) => {
      const rng = mulberry32(route.code.charCodeAt(0) * 31 + route.base);
      const windowFares = WINDOWS.map((w, wi) => {
        const surge = wi === 0 ? 1.45 : wi === 1 ? 1.22 : wi === 2 ? 1.08 : wi === 3 ? 1.0 : 0.9;
        return Math.round(route.base * surge * (0.92 + rng() * 0.16));
      });
      acc[route.code] = windowFares;
      return acc;
    }, {}),
    []
  );

  // Bar chart data for current window
  const barData = WINDOWS.map((w, wi) => {
    const obj = { window: w };
    activeRoutes.forEach((r) => { obj[r.code] = routeFares[r.code]?.[wi]; });
    return obj;
  });

  // Trend line: 30-day price trend per route
  const trendData = Array.from({ length: 30 }, (_, i) => {
    const obj = { day: i + 1 };
    activeRoutes.forEach((route) => {
      const rng2 = mulberry32(route.code.charCodeAt(0) * 17 + i * 7);
      const base = routeFares[route.code]?.[windowIdx] || route.base;
      obj[route.code] = Math.round(base * (0.93 + rng2() * 0.14));
    });
    return obj;
  });

  const tt = getTooltipStyle(C);

  return (
    <Panel skeuo style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ padding: "22px 24px 16px", borderBottom: `1px solid ${C.hairline}` }}>
        <Eyebrow>Side-by-Side Fare Intelligence &middot; Up to 3 Routes</Eyebrow>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 800, color: C.text, margin: "6px 0 4px", letterSpacing: "-0.02em" }}>
          Route Comparison Tool
        </h2>
        <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted, margin: 0 }}>
          Select up to 3 routes to compare fares, elasticity, load factors, and 30-day price trends side by side.
        </p>
      </div>

      {/* Route Selector */}
      <div style={{ padding: "14px 24px", borderBottom: `1px solid ${C.hairline}`, background: C.panelAlt }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, fontWeight: 800, color: C.textFaint, letterSpacing: "0.08em", marginBottom: 10 }}>
          SELECT ROUTES (MAX 3)
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ROUTES.map((route, ri) => {
            const isSelected = selectedRoutes.includes(route.code);
            const color = isSelected ? ROUTE_COLORS[selectedRoutes.indexOf(route.code)] : undefined;
            return (
              <button
                key={route.code}
                onClick={() => toggleRoute(route.code)}
                className="apix-skeuo-btn"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontFamily: FONT_UI, fontSize: 12, fontWeight: 600,
                  padding: "6px 14px", borderRadius: 9999,
                  border: `1.5px solid ${isSelected ? color : C.border}`,
                  background: isSelected ? `${color}22` : C.bgAlt,
                  color: isSelected ? color : C.textMuted,
                  cursor: selectedRoutes.length >= 3 && !isSelected ? "not-allowed" : "pointer",
                  opacity: selectedRoutes.length >= 3 && !isSelected ? 0.4 : 1,
                  boxShadow: isSelected ? C.skeuoSunken : C.skeuoButton,
                }}
                disabled={selectedRoutes.length >= 3 && !isSelected}
              >
                {isSelected ? <X size={11} /> : <Plus size={11} />}
                {route.code}
                <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, opacity: 0.7 }}>
                  {(route.weight * 100).toFixed(0)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking Window Slider */}
      <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${C.hairline}` }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, fontWeight: 700, color: C.textFaint, whiteSpace: "nowrap" }}>BOOKING WINDOW</span>
        <div style={{ display: "flex", gap: 6 }}>
          {WINDOWS.map((w, wi) => (
            <button key={w} onClick={() => setWindowIdx(wi)} className="apix-skeuo-btn"
              style={{ fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 700, padding: "4px 12px", borderRadius: 8, border: `1px solid ${windowIdx === wi ? C.blue : C.border}`, background: windowIdx === wi ? C.blueSoft : C.bgAlt, color: windowIdx === wi ? C.blue : C.textMuted, cursor: "pointer", boxShadow: windowIdx === wi ? C.skeuoSunken : C.skeuoButton }}>
              {w}
            </button>
          ))}
        </div>
        <span style={{ fontFamily: FONT_UI, fontSize: 11, color: C.textFaint }}>Showing fares for {WINDOWS[windowIdx]} advance booking</span>
      </div>

      <div style={{ padding: "20px 24px 0" }}>
        {/* Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${activeRoutes.length}, 1fr)`, gap: 14, marginBottom: 24 }}>
          {activeRoutes.map((route, ri) => {
            const color = ROUTE_COLORS[ri];
            const fare = routeFares[route.code]?.[windowIdx] || 0;
            const peakFare = routeFares[route.code]?.[0] || 0;
            return (
              <div key={route.code} style={{ padding: "16px", borderRadius: 12, border: `2px solid ${color}55`, background: `${color}0D`, boxShadow: C.cardShadow }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
                  <span style={{ fontFamily: FONT_MONO, fontSize: 11, fontWeight: 800, color }}>{route.code}</span>
                </div>
                <div style={{ fontFamily: FONT_UI, fontSize: 11, color: C.textMuted, marginBottom: 8 }}>{route.name}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Avg Fare", value: `₹${fare.toLocaleString("en-IN")}` },
                    { label: "Peak Fare", value: `₹${peakFare.toLocaleString("en-IN")}`, color: C.rust },
                    { label: "Load Factor", value: `${route.loadFactor}%` },
                    { label: "Route Wt.", value: `${(route.weight * 100).toFixed(0)}%` },
                  ].map((m) => (
                    <div key={m.label} style={{ padding: "8px 10px", background: C.bgAlt, borderRadius: 8, border: `1px solid ${C.border}` }}>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 8.5, fontWeight: 700, color: C.textFaint }}>{m.label}</div>
                      <div style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 800, color: m.color || color, marginTop: 2 }}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, padding: "6px 10px", background: C.bgAlt, borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 8.5, fontWeight: 700, color: C.textFaint }}>PRICE ELASTICITY</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <Zap size={12} color={color} />
                    <span style={{ fontFamily: FONT_MONO, fontSize: 12, fontWeight: 800, color }}>{(((routeFares[route.code]?.[0] || 0) / (routeFares[route.code]?.[4] || 1)) - 1).toFixed(2)}x surge (T+1/T+45)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bar Chart: Cross-window comparison */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, fontWeight: 800, color: C.textFaint, letterSpacing: "0.08em", marginBottom: 12 }}>
            FARE BY BOOKING WINDOW (ALL ROUTES)
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.hairline} vertical={false} />
              <XAxis dataKey="window" tick={{ fontFamily: FONT_MONO, fontSize: 10, fill: C.textFaint }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: FONT_MONO, fontSize: 10, fill: C.textFaint }} axisLine={false} tickLine={false} width={60} tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`} />
              <Tooltip contentStyle={tt.contentStyle} labelStyle={tt.labelStyle} itemStyle={tt.itemStyle} formatter={(v) => [`₹${v?.toLocaleString("en-IN")}`, ""]} />
              <Legend wrapperStyle={{ fontFamily: FONT_MONO, fontSize: 10.5, paddingTop: 8 }} />
              {activeRoutes.map((route, ri) => (
                <Bar key={route.code} dataKey={route.code} fill={ROUTE_COLORS[ri]} radius={[4, 4, 0, 0]} maxBarSize={42} name={route.code} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart: 30-day trend */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, fontWeight: 800, color: C.textFaint, letterSpacing: "0.08em", marginBottom: 12 }}>
            30-DAY PRICE TREND ({WINDOWS[windowIdx]} WINDOW)
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.hairline} vertical={false} />
              <XAxis dataKey="day" tick={{ fontFamily: FONT_MONO, fontSize: 10, fill: C.textFaint }} axisLine={false} tickLine={false} interval={4} label={{ value: "Day", position: "insideBottomRight", offset: 0, fontFamily: FONT_MONO, fontSize: 9, fill: C.textFaint }} />
              <YAxis tick={{ fontFamily: FONT_MONO, fontSize: 10, fill: C.textFaint }} axisLine={false} tickLine={false} width={60} tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`} />
              <Tooltip contentStyle={tt.contentStyle} labelStyle={tt.labelStyle} itemStyle={tt.itemStyle} formatter={(v) => [`₹${v?.toLocaleString("en-IN")}`, ""]} />
              <Legend wrapperStyle={{ fontFamily: FONT_MONO, fontSize: 10.5, paddingTop: 8 }} />
              {activeRoutes.map((route, ri) => (
                <Line key={route.code} type="monotone" dataKey={route.code} stroke={ROUTE_COLORS[ri]} strokeWidth={2.5} dot={false} strokeLinecap="round" name={route.code} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Panel>
  );
}
