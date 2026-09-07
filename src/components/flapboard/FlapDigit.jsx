import React from "react";
import { C, FONT_MONO } from "../../theme.js";

export default function FlapDigit({ char }) {
  return (
    <div
      style={{
        width: 34,
        height: 46,
        background: C.flap,
        border: `1px solid ${C.flapEdge}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_MONO,
        fontSize: 28,
        fontWeight: 600,
        color: C.amber,
        position: "relative",
        boxShadow: "inset 0 -14px 18px -12px rgba(0,0,0,0.55)",
        animation: "flapIn 480ms ease-out",
      }}
    >
      {char}
      <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: C.flapEdge }} />
    </div>
  );
}
