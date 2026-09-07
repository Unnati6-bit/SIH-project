import React from "react";
import { Database } from "lucide-react";
import { C, FONT_MONO } from "../../theme.js";

export default function Footer() {
  return (
    <div style={{ maxWidth: 1180, margin: "40px auto 0", padding: "18px 24px 0", borderTop: `1px solid ${C.hairline}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_MONO, fontSize: 11, color: C.textFaint }}>
        <Database size={13} />
        Prototype output for research and demonstration purposes only &mdash; not an official MoSPI statistic. All figures on
        this screen are illustrative sample data.
      </div>
    </div>
  );
}
