import React from "react";
import { useTheme, FONT_MONO } from "../../theme.js";

export default function FlapDigit({ char }) {
  const { C, themeKey } = useTheme();

  return (
    <div
      style={{
        width: 36,
        height: 50,
        background: themeKey === "dark" ? "#060A14" : "#0F2648",
        border: `1px solid ${C.flapEdge || "#1E3A8A"}`,
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_MONO,
        fontSize: 30,
        fontWeight: 700,
        color: themeKey === "dark" ? "#60A5FA" : "#F8FAFC",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -14px 18px -12px rgba(0,0,0,0.8)",
        animation: "flapIn 480ms ease-out",
      }}
    >
      {char}
      {/* Center mechanical split hinge */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: 1.5,
          background: "rgba(0, 0, 0, 0.7)",
          boxShadow: "0 1px 0 rgba(255, 255, 255, 0.15)",
        }}
      />
      {/* Side hinge pin notches */}
      <div style={{ position: "absolute", left: 0, top: "calc(50% - 2px)", width: 2, height: 4, background: "#000" }} />
      <div style={{ position: "absolute", right: 0, top: "calc(50% - 2px)", width: 2, height: 4, background: "#000" }} />
    </div>
  );
}
