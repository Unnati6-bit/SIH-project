import React from "react";
import { Terminal, Info } from "lucide-react";
import { FONT_DISPLAY, FONT_UI, FONT_MONO, C } from "../../theme.js";
import Panel from "../ui/Panel.jsx";

const SAMPLE_ENDPOINTS = `GET /v1/index/national?freq=daily
GET /v1/index/route/DEL/BOM
GET /v1/quotes?route=DEL-BLR&window=7`;

export default function ApiPanel() {
  return (
    <Panel>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Terminal size={16} color={C.teal} />
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 600, color: C.text }}>API access</span>
      </div>
      <div
        style={{
          background: C.bgAlt,
          border: `1px solid ${C.hairline}`,
          padding: 14,
          fontFamily: FONT_MONO,
          fontSize: 12,
          color: C.teal,
          marginBottom: 12,
          whiteSpace: "pre-wrap",
        }}
      >
        {SAMPLE_ENDPOINTS}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontFamily: FONT_UI, fontSize: 12, color: C.textFaint }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        For consumption by NSO / RBI research desks. Rate-limited, versioned, documented in the accompanying OpenAPI spec.
      </div>
    </Panel>
  );
}
