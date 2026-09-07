import React from "react";
import { Plane, Radio, ShieldCheck } from "lucide-react";
import { C, FONT_DISPLAY, FONT_MONO } from "../../theme.js";
import { dateLabel } from "../../data/mockData.js";

export default function Masthead({ onAdmin }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.hairline}`, background: C.bgAlt }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "22px 24px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                width: 42,
                height: 42,
                border: `1px solid ${C.amber}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "rotate(-6deg)",
              }}
            >
              <Plane size={20} color={C.amber} strokeWidth={1.6} />
            </div>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, letterSpacing: "0.01em", color: C.text }}>
                Airfare Price Index <span style={{ color: C.amber }}>&middot; APIx</span>
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: C.textMuted, letterSpacing: "0.03em", marginTop: 2 }}>
                EXPERIMENTAL SERIES &mdash; PROTOTYPE FOR CPI TRANSPORT &amp; COMMUNICATION AUGMENTATION
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONT_MONO,
                fontSize: 11.5,
                color: C.teal,
                border: `1px solid ${C.tealSoft}`,
                padding: "6px 10px",
              }}
            >
              <Radio size={13} className="apix-pulse-dot" />
              LIVE &middot; UPDATED {dateLabel(0, { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
            </div>
            <button
              onClick={onAdmin}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontFamily: FONT_MONO,
                fontSize: 11.5,
                color: C.text,
                border: `1px solid ${C.border}`,
                background: C.panel,
                padding: "7px 10px",
                cursor: "pointer",
              }}
            >
              <ShieldCheck size={14} color={C.amber} /> ADMIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
