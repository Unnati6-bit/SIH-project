import React from "react";
import { C, FONT_MONO } from "../../theme.js";

export default function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: FONT_MONO,
        fontSize: 11.5,
        letterSpacing: "0.04em",
        padding: "6px 12px",
        cursor: "pointer",
        background: active ? C.amber : "transparent",
        color: active ? C.bg : C.textMuted,
        border: `1px solid ${active ? C.amber : C.border}`,
        transition: "all 150ms ease",
      }}
    >
      {children}
    </button>
  );
}
