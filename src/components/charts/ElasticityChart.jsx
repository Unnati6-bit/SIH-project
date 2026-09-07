import React, { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { C, FONT_MONO, tooltipStyle } from "../../theme.js";
import { ROUTES, ELASTICITY, WINDOWS } from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";
import Chip from "../ui/Chip.jsx";

const ROUTE_LINE_COLORS = [C.amber, C.teal, C.rust, "#7C93C9", "#C99B4A"];

export default function ElasticityChart() {
  const [selectedRoutes, setSelectedRoutes] = useState(["DEL-BOM", "DEL-BLR", "BOM-BLR"]);

  function toggleRoute(code) {
    setSelectedRoutes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : prev.length < 5 ? [...prev, code] : prev
    );
  }

  const chartData = useMemo(() => {
    return WINDOWS.map((w) => {
      const row = { window: `T+${w}` };
      ELASTICITY.filter((e) => selectedRoutes.includes(e.code)).forEach((e) => {
        row[e.code] = e.points.find((p) => p.window === w).fare;
      });
      return row;
    });
  }, [selectedRoutes]);

  return (
    <div>
      <SectionHeader eyebrow="Booking behaviour" title="Lead-time elasticity" note="Total fare by advance-purchase window, selected routes." />
      <Panel>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {ROUTES.map((r) => (
            <Chip key={r.code} active={selectedRoutes.includes(r.code)} onClick={() => toggleRoute(r.code)}>
              {r.code}
            </Chip>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={C.hairline} strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="window" tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10.5 }} axisLine={{ stroke: C.hairline }} tickLine={false} />
            <YAxis tick={{ fill: C.textFaint, fontFamily: FONT_MONO, fontSize: 10.5 }} axisLine={false} tickLine={false} width={44} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textMuted }} />
            {selectedRoutes.map((code, idx) => (
              <Line key={code} type="monotone" dataKey={code} stroke={ROUTE_LINE_COLORS[idx % ROUTE_LINE_COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}
