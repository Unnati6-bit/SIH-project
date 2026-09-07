import React from "react";
import { C, FONT_MONO, FONT_UI } from "../../theme.js";
import { QUOTES } from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";

const COLUMNS = ["Captured", "Route", "Carrier", "Window", "Source", "Base", "Taxes+Fees", "Total", "Seats"];

export default function QuotesTable() {
  return (
    <div style={{ marginBottom: 44 }}>
      <SectionHeader eyebrow="Raw feed" title="Latest captured quotes" note="Sample of the most recent scraped fare records feeding the index." />
      <Panel style={{ padding: 0 }}>
        <div className="apix-scroll" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 780 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.hairline}` }}>
                {COLUMNS.map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      fontFamily: FONT_MONO,
                      fontSize: 10.5,
                      letterSpacing: "0.06em",
                      color: C.textFaint,
                      fontWeight: 500,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {QUOTES.map((q) => (
                <tr key={q.id} style={{ borderBottom: `1px solid ${C.hairline}` }}>
                  <td style={{ padding: "11px 16px", fontFamily: FONT_MONO, fontSize: 12, color: C.textFaint }}>{q.minsAgo}m ago</td>
                  <td style={{ padding: "11px 16px", fontFamily: FONT_MONO, fontSize: 12.5, color: C.text }}>{q.route}</td>
                  <td style={{ padding: "11px 16px", fontFamily: FONT_UI, fontSize: 12.5, color: C.textMuted }}>{q.carrier}</td>
                  <td style={{ padding: "11px 16px", fontFamily: FONT_MONO, fontSize: 12, color: C.textMuted }}>T+{q.window}</td>
                  <td style={{ padding: "11px 16px", fontFamily: FONT_UI, fontSize: 12, color: C.textMuted }}>{q.source}</td>
                  <td style={{ padding: "11px 16px", fontFamily: FONT_MONO, fontSize: 12.5, color: C.text }}>&#8377;{q.base.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "11px 16px", fontFamily: FONT_MONO, fontSize: 12.5, color: C.textMuted }}>
                    &#8377;{(q.taxes + q.fee).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "11px 16px", fontFamily: FONT_MONO, fontSize: 12.5, color: C.amber, fontWeight: 600 }}>
                    &#8377;{q.total.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "11px 16px", fontFamily: FONT_MONO, fontSize: 12, color: q.avail === 0 ? C.rust : C.teal }}>
                    {q.avail === 0 ? "SOLD OUT" : q.avail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
