import React from "react";
import { Database } from "lucide-react";
import { useTheme, FONT_MONO } from "../../theme.js";

export default function Footer() {
  const { C } = useTheme();

  return (
    <div style={{ maxWidth: 1180, margin: "40px auto 0", padding: "20px 24px 0", borderTop: `1px solid ${C.hairline}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT_MONO, fontSize: 11.5, color: C.textFaint }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: C.bgAlt,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Database size={13} color={C.textMuted} strokeWidth={1.75} style={{ strokeLinecap: "round", strokeLinejoin: "round" }} />
        </div>
        <span>
          <strong style={{ color: C.textMuted }}>SkyMetric</strong> &mdash; Prototype output for research and demonstration purposes only.
          Not an official MoSPI or RBI statistic. All figures shown are illustrative sample data.
          &copy; {new Date().getFullYear()} India Aviation Price Intelligence Platform.
        </span>
      </div>
    </div>
  );
}

