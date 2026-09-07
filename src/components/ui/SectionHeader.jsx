import React from "react";
import { C, FONT_DISPLAY, FONT_UI } from "../../theme.js";
import Eyebrow from "./Eyebrow.jsx";

export default function SectionHeader({ eyebrow, title, note }) {
  return (
    <div
      style={{
        marginBottom: 18,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, color: C.text, margin: 0 }}>
          {title}
        </h2>
      </div>
      {note && (
        <div style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.textMuted, maxWidth: 360 }}>{note}</div>
      )}
    </div>
  );
}
