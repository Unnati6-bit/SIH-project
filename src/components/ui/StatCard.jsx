import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { C, FONT_MONO, FONT_UI } from "../../theme.js";
import Panel from "./Panel.jsx";
import Eyebrow from "./Eyebrow.jsx";

export default function StatCard({ label, value, delta, deltaLabel, positiveIsBad }) {
  const isUp = delta >= 0;
  const badColor = positiveIsBad ? isUp : !isUp;
  const color = delta === 0 || delta === undefined ? C.textMuted : badColor ? C.amber : C.teal;
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <Panel style={{ padding: "18px 20px" }}>
      <Eyebrow>{label}</Eyebrow>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 30, fontWeight: 600, color: C.text }}>{value}</span>
        {delta !== undefined && (
          <span style={{ display: "flex", alignItems: "center", gap: 2, color, fontFamily: FONT_MONO, fontSize: 13 }}>
            <Icon size={14} strokeWidth={2.5} />
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      {deltaLabel && (
        <div style={{ fontFamily: FONT_UI, fontSize: 11.5, color: C.textFaint, marginTop: 4 }}>{deltaLabel}</div>
      )}
    </Panel>
  );
}
