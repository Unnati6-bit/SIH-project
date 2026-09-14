import React from "react";
import { useTheme, FONT_DISPLAY, FONT_MONO, FONT_UI } from "../../theme.js";
import Eyebrow from "./Eyebrow.jsx";

export default function SectionHeader({ eyebrow, title, note, refCode }) {
  const { C } = useTheme();

  return (
    <div
      style={{
        marginBottom: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: 12,
        paddingBottom: 8,
        borderBottom: `1px solid ${C.hairline}`,
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {refCode && (
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 9,
                fontWeight: 700,
                color: C.textFaint,
                background: C.bgAlt,
                padding: "1px 6px",
                borderRadius: 4,
                border: `1px solid ${C.hairline}`,
              }}
            >
              {refCode}
            </span>
          )}
        </div>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 800, color: C.text, margin: "2px 0 0", letterSpacing: "-0.02em" }}>
          {title}
        </h2>
      </div>
      {note && (
        <div style={{ fontFamily: FONT_UI, fontSize: 12, fontWeight: 500, color: C.textMuted, maxWidth: 380, textAlign: "right" }}>
          {note}
        </div>
      )}
    </div>
  );
}
