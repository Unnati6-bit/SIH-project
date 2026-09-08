import React from "react";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { useTheme, FONT_DISPLAY, FONT_MONO, FONT_UI } from "../../theme.js";
import Panel from "./Panel.jsx";

export default function StatCard({ label, value, delta, deltaLabel, positiveIsBad, refCode = "NSO-LIVE" }) {
  const { C, themeKey } = useTheme();
  const isUp = delta >= 0;
  const badColor = positiveIsBad ? isUp : !isUp;
  const badgeColor = delta === 0 || delta === undefined ? C.textMuted : badColor ? C.amber : C.teal;
  const badgeBg = delta === 0 || delta === undefined ? C.bgAlt : badColor ? C.amberSoft : C.tealSoft;
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;

  // Generate sleek mini sparkline points
  const sparkPoints = isUp
    ? "0,28 15,22 30,25 45,14 60,18 75,8 90,12 105,4 120,2"
    : "0,4 15,10 30,8 45,18 60,14 75,22 90,20 105,26 120,28";

  return (
    <Panel
      accentColor={badColor ? C.amber : C.blue}
      style={{
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 138,
        position: "relative",
      }}
    >
      {/* Sleek Ambient Radial Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          background: `radial-gradient(circle, ${badColor ? "rgba(245, 158, 11, 0.08)" : "rgba(37, 99, 235, 0.08)"} 0%, transparent 70%)`,
          pointerEvents: "none",
          borderRadius: "50%",
        }}
      />

      <div>
        {/* Sleek Header & Reference Stamp */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10.5,
              fontWeight: 700,
              color: C.textFaint,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: FONT_MONO,
              fontSize: 9.5,
              fontWeight: 600,
              color: C.blue,
              background: C.blueSoft,
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            <Activity size={10} className="apix-radar-pulse" />
            {refCode}
          </span>
        </div>

        {/* Primary Stat Value & Delta Badge */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 29, fontWeight: 800, color: C.text, letterSpacing: "-0.03em" }}>
            {value}
          </span>

          {delta !== undefined && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                color: badgeColor,
                background: badgeBg,
                padding: "4px 10px",
                borderRadius: 8,
                border: `1px solid ${badColor ? "rgba(245, 158, 11, 0.35)" : "rgba(16, 185, 129, 0.35)"}`,
                fontFamily: FONT_MONO,
                fontSize: 12,
                fontWeight: 700,
                boxShadow: C.skeuoButton,
              }}
            >
              <Icon size={14} strokeWidth={2.4} style={{ strokeLinecap: "round", strokeLinejoin: "round" }} />
              {Math.abs(delta).toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* Sleek Sparkline & Sub-Label */}
      <div style={{ marginTop: 14 }}>
        <div style={{ height: 24, width: "100%", opacity: 0.75, marginBottom: 6 }}>
          <svg width="100%" height="24" viewBox="0 0 120 30" preserveAspectRatio="none" style={{ overflow: "visible" }}>
            <polyline
              fill="none"
              stroke={badColor ? C.amber : C.blue}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparkPoints}
            />
          </svg>
        </div>

        {deltaLabel && (
          <div
            style={{
              fontFamily: FONT_UI,
              fontSize: 11,
              fontWeight: 500,
              color: C.textMuted,
              paddingTop: 6,
              borderTop: `1px dashed ${C.hairline}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>{deltaLabel}</span>
          </div>
        )}
      </div>
    </Panel>
  );
}
