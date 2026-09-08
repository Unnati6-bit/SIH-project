import React from "react";
import { useTheme, FONT_MONO } from "../../theme.js";

export default function Eyebrow({ children }) {
  const { C } = useTheme();

  return (
    <div
      style={{
        fontFamily: FONT_MONO,
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: C.blue || "#1E40AF",
        marginBottom: 6,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.blue || "#1E40AF" }} />
      {children}
    </div>
  );
}
