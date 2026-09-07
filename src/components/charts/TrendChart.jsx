import React, { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { C, FONT_MONO, tooltipStyle } from "../../theme.js";
import { DAILY_SERIES, WEEKLY_SERIES, MONTHLY_SERIES } from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";
import Chip from "../ui/Chip.jsx";

export default function TrendChart() {
  const [freq, setFreq] = useState("Daily");
  const series = freq === "Daily" ? DAILY_SERIES : freq === "Weekly" ? WEEKLY_SERIES : MONTHLY_SERIES;

  return (
    <div style={{ marginBottom: 44 }}>
      <SectionHeader
        eyebrow="Index trend"
        title="APIx over time"
        note="Jevons elementary aggregates, chained and weighted by DGCA route-level passenger share."
      />
      <Panel>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {["Daily", "Weekly", "Monthly"].map((f) => (
            <Chip key={f} active={freq === f} onClick={() => setFreq(f)}>
              {f.toUpperCase()}
            </Chip>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={series} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="apixFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.amber} stopOpacity={0.35} />
                <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={C.hairline} strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10.5 }}
              axisLine={{ stroke: C.hairline }}
              tickLine={false}
              minTickGap={28}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10.5 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip {...tooltipStyle} />
            <ReferenceLine y={DAILY_SERIES[0].value} stroke={C.textFaint} strokeDasharray="3 3" />
            <Area type="monotone" dataKey="value" stroke={C.amber} strokeWidth={2} fill="url(#apixFill)" name="APIx" />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}
