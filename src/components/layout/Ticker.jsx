import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTheme, FONT_MONO } from "../../theme.js";
import { ROUTES, rng } from "../../data/mockData.js";

export default function Ticker() {
  const { C } = useTheme();

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
                    gap: 8,
                    padding: "8px 18px",
                    borderRight: `1px solid ${C.hairline}`,
                    fontFamily: FONT_MONO,
                    fontSize: 12,
                  }}
                >
                  <span style={{ background: C.bgAlt, padding: "2px 7px", borderRadius: 9999, color: C.textMuted, fontSize: 11, fontWeight: 600 }}>
                    {r.code}
                  </span>
                  <span style={{ color: C.text, fontWeight: 600 }}>&#8377;{r.base.toLocaleString("en-IN")}</span>
                  <span
                    style={{
                      color: up ? C.amber : C.teal,
                      background: up ? C.amberSoft : C.tealSoft,
                      padding: "2px 6px",
                      borderRadius: 9999,
                      fontSize: 11,
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    {up ? (
                      <TrendingUp size={12} strokeWidth={1.8} style={{ strokeLinecap: "round", strokeLinejoin: "round" }} />
                    ) : (
                      <TrendingDown size={12} strokeWidth={1.8} style={{ strokeLinecap: "round", strokeLinejoin: "round" }} />
                    )}
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
