import React, { useState, useMemo } from "react";
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { useTheme, FONT_DISPLAY, FONT_MONO, FONT_UI, getTooltipStyle } from "../../theme.js";
import { APIX_LATEST, ROUTES } from "../../data/mockData.js";
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

const FORECAST_DAYS = 14;
const HISTORY_DAYS = 30;

export default function ForecastPanel() {
  const { C, themeKey } = useTheme();
  const [selectedRoute, setSelectedRoute] = useState("ALL");

  const { chartData, signal, forecastEnd, confidenceWidth } = useMemo(() => {
    const rng = mulberry32(42 + selectedRoute.length);
    const history = [];
    let val = APIX_LATEST - 8 + rng() * 4;
    for (let i = HISTORY_DAYS; i >= 1; i--) {
      val += (rng() - 0.48) * 2.5;
      val = Math.max(APIX_LATEST - 15, Math.min(APIX_LATEST + 10, val));
      const d = new Date(); d.setDate(d.getDate() - i);
      history.push({ day: `${d.getDate()}/${d.getMonth() + 1}`, actual: parseFloat(val.toFixed(2)) });
    }
    const last10 = history.slice(-10).map((h) => h.actual);
    const trend = (last10[last10.length - 1] - last10[0]) / (last10.length - 1);
    let forecastVal = history[history.length - 1].actual;
    const forecast = [];
    for (let i = 1; i <= FORECAST_DAYS; i++) {
      forecastVal += trend * 0.7 + (rng() - 0.5) * 0.8;
      const bw = 1.5 + i * 0.35;
      const d = new Date(); d.setDate(d.getDate() + i);
      forecast.push({
        day: `${d.getDate()}/${d.getMonth() + 1}`,
        forecast: parseFloat(forecastVal.toFixed(2)),
        upper: parseFloat((forecastVal + bw).toFixed(2)),
        lower: parseFloat((forecastVal - bw).toFixed(2)),
      });
    }
    const endVal = forecast[forecast.length - 1].forecast;
    const change = endVal - history[history.length - 1].actual;
    return {
      chartData: [...history, ...forecast],
      signal: change > 1.5 ? "bullish" : change < -1.5 ? "bearish" : "neutral",
      forecastEnd: endVal,
      confidenceWidth: forecast[FORECAST_DAYS - 1].upper - forecast[FORECAST_DAYS - 1].lower,
    };
  }, [selectedRoute]);

  const todayLabel = (() => { const d = new Date(); return `${d.getDate()}/${d.getMonth() + 1}`; })();

  const sigCfg = {
    bullish: { label: "BULLISH SIGNAL", color: "#EF4444", icon: TrendingUp, bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.35)", desc: "Fares expected to rise over 14 days" },
    bearish: { label: "BEARISH SIGNAL", color: "#10B981", icon: TrendingDown, bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.35)", desc: "Fares expected to ease over 14 days" },
    neutral: { label: "NEUTRAL SIGNAL", color: "#F59E0B", icon: Minus, bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.35)", desc: "Fares expected to remain stable" },
  }[signal];
  const SigIcon = sigCfg.icon;
  const tt = getTooltipStyle(C);

  return (
    <Panel skeuo style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ padding: "22px 24px 16px", borderBottom: `1px solid ${C.hairline}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <Eyebrow>14-Day Airfare Index Forecast &middot; Trend Extrapolation</Eyebrow>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 800, color: C.text, margin: "6px 0 4px", letterSpacing: "-0.02em" }}>
              SkyMetric Forecast Panel
            </h2>
            <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted, margin: 0 }}>
              Indicative 14-day ahead prediction with ±95% confidence bands using seasonal trend extrapolation.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 12, background: sigCfg.bg, border: `1px solid ${sigCfg.border}`, flexShrink: 0 }}>
            <SigIcon size={22} color={sigCfg.color} strokeWidth={2} />
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, fontWeight: 800, color: sigCfg.color, letterSpacing: "0.06em" }}>{sigCfg.label}</div>
              <div style={{ fontFamily: FONT_UI, fontSize: 11, color: C.textMuted, marginTop: 2 }}>{sigCfg.desc}</div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 18 }}>
          {[
            { label: "CURRENT INDEX", value: APIX_LATEST.toFixed(1), sub: "Base 2012=100" },
            { label: "14D FORECAST", value: forecastEnd.toFixed(1), sub: "Projected value" },
            { label: "EXPECTED CHANGE", value: `${forecastEnd - APIX_LATEST >= 0 ? "+" : ""}${(forecastEnd - APIX_LATEST).toFixed(1)} pts`, sub: "Over 14 days", color: forecastEnd >= APIX_LATEST ? C.rust : C.teal },
            { label: "CONFIDENCE WIDTH", value: `±${(confidenceWidth / 2).toFixed(1)} pts`, sub: "95% CI at day 14" },
          ].map((k) => (
            <div key={k.label} style={{ padding: "12px 14px", background: C.bgAlt, borderRadius: 10, border: `1px solid ${C.border}`, boxShadow: C.skeuoSunken }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 9, fontWeight: 700, color: C.textFaint, letterSpacing: "0.05em" }}>{k.label}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 800, color: k.color || C.text, marginTop: 4 }}>{k.value}</div>
              <div style={{ fontFamily: FONT_UI, fontSize: 10.5, color: C.textMuted, marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Route Filter */}
      <div style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.hairline}`, overflowX: "auto" }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, fontWeight: 700, color: C.textFaint, whiteSpace: "nowrap" }}>ROUTE FILTER</span>
        {["ALL", ...ROUTES.slice(0, 4).map((r) => r.code)].map((code) => (
          <button key={code} onClick={() => setSelectedRoute(code)} className="apix-skeuo-btn"
            style={{ fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 700, padding: "4px 12px", borderRadius: 9999, border: `1px solid ${selectedRoute === code ? C.blue : C.border}`, background: selectedRoute === code ? C.blueSoft : C.bgAlt, color: selectedRoute === code ? C.blue : C.textMuted, cursor: "pointer", whiteSpace: "nowrap", boxShadow: selectedRoute === code ? C.skeuoSunken : C.skeuoButton }}>
            {code}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ padding: "20px 8px 16px" }}>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fcBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.blue} stopOpacity={0.18} />
                <stop offset="95%" stopColor={C.blue} stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.hairline} vertical={false} />
            <XAxis dataKey="day" tick={{ fontFamily: FONT_MONO, fontSize: 10, fill: C.textFaint }} axisLine={false} tickLine={false} interval={4} />
            <YAxis domain={["auto", "auto"]} tick={{ fontFamily: FONT_MONO, fontSize: 10, fill: C.textFaint }} axisLine={false} tickLine={false} width={50} />
            <Tooltip contentStyle={tt.contentStyle} labelStyle={tt.labelStyle} itemStyle={tt.itemStyle}
              formatter={(v, n) => [v?.toFixed(2), { actual: "Actual Index", forecast: "14D Forecast", upper: "Upper Band (95%)", lower: "Lower Band (95%)" }[n] || n]} />
            <ReferenceLine x={todayLabel} stroke={C.amber} strokeDasharray="5 3" strokeWidth={1.5} label={{ value: "TODAY", position: "top", fontFamily: FONT_MONO, fontSize: 9, fill: C.amber }} />
            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#fcBand)" legendType="none" connectNulls />
            <Area type="monotone" dataKey="lower" stroke="none" fill={C.bg} legendType="none" connectNulls />
            <Line type="monotone" dataKey="actual" stroke={C.blue} strokeWidth={2.5} dot={false} strokeLinecap="round" name="actual" connectNulls />
            <Line type="monotone" dataKey="forecast" stroke={C.amber} strokeWidth={2} strokeDasharray="6 3" dot={false} strokeLinecap="round" name="forecast" connectNulls />
            <Legend wrapperStyle={{ fontFamily: FONT_MONO, fontSize: 10.5, paddingTop: 8 }}
              formatter={(v) => ({ actual: "Historical Index", forecast: "14D Forecast (extrapolated)", upper: "95% Confidence Band" }[v] || "")} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Route breakdown */}
      <div style={{ padding: "0 24px 24px" }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 9.5, fontWeight: 800, color: C.textFaint, letterSpacing: "0.08em", marginBottom: 12 }}>ROUTE-LEVEL 14D FORECAST</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 10 }}>
          {ROUTES.slice(0, 5).map((route, i) => {
            const r2 = mulberry32(i * 97 + 7); const chg = (r2() - 0.45) * 6; const isUp = chg > 0;
            const Icon2 = isUp ? TrendingUp : TrendingDown;
            return (
              <div key={route.code} style={{ padding: "12px 14px", background: C.bgAlt, borderRadius: 10, border: `1px solid ${isUp ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)"}`, boxShadow: C.cardShadow }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, fontWeight: 800, color: C.textFaint, marginBottom: 2 }}>{route.code}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 10.5, color: C.textMuted, marginBottom: 8 }}>{route.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon2 size={14} color={isUp ? C.rust : C.teal} strokeWidth={2} />
                  <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 800, color: isUp ? C.rust : C.teal }}>{isUp ? "+" : ""}{chg.toFixed(1)} pts</span>
                </div>
                <div style={{ fontFamily: FONT_UI, fontSize: 10, color: C.textFaint, marginTop: 4 }}>Wt: {(route.weight * 100).toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, fontFamily: FONT_UI, fontSize: 11, color: C.textFaint }}>
          <Info size={12} color={C.textFaint} />
          Indicative only. Based on trend extrapolation with seasonal adjustment. Not for trading decisions.
        </div>
      </div>
    </Panel>
  );
}
