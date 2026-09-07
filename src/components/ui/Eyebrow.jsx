import React from "react";
import { C, FONT_MONO } from "../../theme.js";

export default function Eyebrow({ children }) {
  return (
    <div
      style={{
        fontFamily: FONT_MONO,
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: C.textFaint,
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}
