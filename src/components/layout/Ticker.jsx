import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { C, FONT_MONO } from "../../theme.js";
import { ROUTES, rng } from "../../data/mockData.js";

export default function Ticker() {
  return (
    <div style={{ borderBottom: `1px solid ${C.hairline}`, background: C.panel, overflow: "hidden", whiteSpace: "nowrap" }}>
      <div className="apix-ticker-track" style={{ display: "inline-flex" }}>
        {[0, 1].map((dup) => (
          <div key={dup} style={{ display: "inline-flex" }}>
            {ROUTES.concat(ROUTES).map((r, i) => {
              const chg = rng() * 2 - 0.6;
              const up = chg >= 0;
              return (
                <div
                  key={dup + "-" + i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 18px",
                    borderRight: `1px solid ${C.hairline}`,
                    fontFamily: FONT_MONO,
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ color: C.textMuted }}>{r.code}</span>
                  <span style={{ color: C.text }}>&#8377;{r.base.toLocaleString("en-IN")}</span>
                  <span style={{ color: up ? C.amber : C.teal, display: "inline-flex", alignItems: "center" }}>
                    {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(chg).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
