import React from "react";
import { useTheme, FONT_MONO } from "../../theme.js";

export default function Chip({ active, onClick, children, icon: Icon }) {
  const { C } = useTheme();

  return (
    <button
      onClick={onClick}
      className="apix-skeuo-btn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: FONT_MONO,
        fontSize: 11.5,
        fontWeight: active ? 600 : 500,
        letterSpacing: "0.03em",
        padding: "6px 14px",
        borderRadius: 9999, // Smooth rounded pill
        cursor: "pointer",
        background: active
          ? (C.blue || C.amber)
          : C.panel,
        color: active
          ? "#FFFFFF"
          : C.text,
        border: `1px solid ${active ? (C.blue || C.amber) : C.border}`,
        boxShadow: active
          ? (C.skeuoActive || `inset 2px 2px 5px rgba(0,0,0,0.2)`)
          : (C.skeuoButton || `0 2px 5px rgba(0,0,0,0.06)`),
        transition: "all 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        outline: "none",
      }}
    >
      {Icon && <Icon size={13} style={{ strokeWidth: 1.75 }} />}
      {children}
    </button>
  );
}
