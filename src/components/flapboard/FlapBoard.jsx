import React from "react";
import { useTheme, FONT_MONO } from "../../theme.js";
import FlapDigit from "./FlapDigit.jsx";

export default function FlapBoard({ value }) {
  const { C, themeKey } = useTheme();
  const chars = value.toFixed(1).split("");

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 6,
        padding: "10px 14px",
        background: themeKey === "dark" ? "#060A14" : "#E2EAF4",
        borderRadius: 12,
        boxShadow: C.skeuoSunken || "inset 2px 2px 6px rgba(0,0,0,0.2)",
        border: `1px solid ${C.border}`,
        position: "relative",
      }}
    >
      {/* Corner metallic rivets for physical skeuomorphic instrument look */}
      <div style={{ position: "absolute", top: 4, left: 4, width: 4, height: 4, borderRadius: "50%", background: C.textFaint, opacity: 0.6 }} />
      <div style={{ position: "absolute", top: 4, right: 4, width: 4, height: 4, borderRadius: "50%", background: C.textFaint, opacity: 0.6 }} />
      <div style={{ position: "absolute", bottom: 4, left: 4, width: 4, height: 4, borderRadius: "50%", background: C.textFaint, opacity: 0.6 }} />
      <div style={{ position: "absolute", bottom: 4, right: 4, width: 4, height: 4, borderRadius: "50%", background: C.textFaint, opacity: 0.6 }} />

      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        {chars.map((ch, i) =>
          ch === "." ? (
            <div
              key={i}
              style={{
                width: 14,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: 8,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  background: C.blue || C.amber,
                  borderRadius: "50%",
                  boxShadow: `0 0 8px ${C.primaryGlow}`,
                }}
              />
            </div>
          ) : (
            <FlapDigit key={i} char={ch} />
          )
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: FONT_MONO,
          fontSize: 9.5,
          color: C.textFaint,
          letterSpacing: "0.05em",
          paddingTop: 2,
        }}
      >
        <span>CALIBRATED 2012=100</span>
        <span style={{ color: C.teal, fontWeight: 600 }}>● SYNCED</span>
      </div>
    </div>
  );
}
