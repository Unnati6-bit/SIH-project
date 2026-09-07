import React from "react";
import { Layers } from "lucide-react";
import { FONT_DISPLAY, FONT_UI, C } from "../../theme.js";
import Panel from "../ui/Panel.jsx";

export default function MethodologyPanel() {
  return (
    <Panel>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Layers size={16} color={C.amber} />
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 600, color: C.text }}>Methodology, in brief</span>
      </div>
      <ul style={{ margin: 0, paddingLeft: 18, fontFamily: FONT_UI, fontSize: 13, color: C.textMuted, lineHeight: 1.75 }}>
        <li>Elementary aggregate = (route &times; carrier &times; booking window). Median of same-day quotes per cell.</li>
        <li>Elementary index uses the Jevons formula (geometric mean of price relatives) between periods.</li>
        <li>Aggregation weighted by DGCA route-level passenger-traffic share; chained monthly.</li>
        <li>Sold-out flights are tracked for availability but excluded from price imputation.</li>
        <li>Booking windows (T+1 to T+45) are fixed per cell to avoid conflating index growth with time-to-departure.</li>
      </ul>
    </Panel>
  );
}
