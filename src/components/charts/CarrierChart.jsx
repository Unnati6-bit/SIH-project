import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { C, FONT_UI, FONT_MONO, tooltipStyle } from "../../theme.js";
import { CARRIER_DATA } from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";

export default function CarrierChart() {
  return (
    <div>
      <SectionHeader eyebrow="Carrier view" title="Average fare by carrier" note="Basket average across all tracked routes." />
      <Panel>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={CARRIER_DATA} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
            <CartesianGrid stroke={C.hairline} strokeDasharray="2 4" horizontal={false} />
            <XAxis type="number" tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: C.textMuted, fontFamily: FONT_UI, fontSize: 11.5 }} axisLine={false} tickLine={false} width={110} />
            <Tooltip {...tooltipStyle} formatter={(v) => [`\u20B9${v.toLocaleString("en-IN")}`, "Avg. fare"]} />
            <Bar dataKey="fare" fill={C.teal} radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}
