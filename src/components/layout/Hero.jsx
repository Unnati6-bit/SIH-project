import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTheme, FONT_MONO } from "../../theme.js";
import { APIX_LATEST, APIX_PREV_DAY, APIX_MOM, APIX_YOY, ROUTES, CARRIERS, rng } from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import Eyebrow from "../ui/Eyebrow.jsx";
import StatCard from "../ui/StatCard.jsx";
import FlapBoard from "../flapboard/FlapBoard.jsx";

export default function Hero() {
  const { C } = useTheme();
  const dayUp = APIX_LATEST >= APIX_PREV_DAY;
  const DayIcon = dayUp ? ArrowUpRight : ArrowDownRight;

  return (
    <div
      className="apix-hero"
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 24,
        marginBottom: 36,
        alignItems: "stretch",
      }}
    >
      <Panel
        skeuo={true}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 12,
          minWidth: 300,
        }}
      >
        <Eyebrow>National APIx &middot; Base 2012=100</Eyebrow>
        <FlapBoard value={APIX_LATEST} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontFamily: FONT_MONO,
              fontSize: 12,
              fontWeight: 700,
              color: dayUp ? C.blue : C.teal,
              background: dayUp ? C.blueSoft : C.tealSoft,
              padding: "4px 10px",
              borderRadius: 9999,
              boxShadow: C.skeuoButton,
            }}
          >
            <DayIcon size={13} strokeWidth={2} style={{ strokeLinecap: "round", strokeLinejoin: "round" }} />
            {Math.abs(APIX_LATEST - APIX_PREV_DAY).toFixed(1)} pts
          </span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: C.textMuted }}>
            vs previous day
          </span>
        </div>
      </Panel>

      <div className="apix-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <StatCard label="Month-on-month" value={`${APIX_MOM >= 0 ? "+" : ""}${APIX_MOM.toFixed(1)}%`} delta={APIX_MOM} positiveIsBad />
        <StatCard label="Year-on-year (indicative)" value={`+${APIX_YOY.toFixed(1)}%`} delta={APIX_YOY} positiveIsBad />
        <StatCard
          label="Quotes captured today"
          value={(2140 + Math.floor(rng() * 300)).toLocaleString("en-IN")}
          deltaLabel={`Across ${ROUTES.length} routes \u00b7 ${CARRIERS.length} carriers`}
        />
      </div>
    </div>
  );
}
