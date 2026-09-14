import React, { useState, useMemo } from "react";
import { Filter, CheckCircle2 } from "lucide-react";
import { useTheme, FONT_MONO, FONT_UI } from "../../theme.js";
import { QUOTES, ROUTES, CARRIERS, WINDOWS } from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";

const COLUMNS = [
  "Captured",
  "Flight No",
  "Route",
  "Carrier",
  "Window",
  "Fare Class",
  "Source",
  "Base Fare",
  "Airport UDF",
  "Taxes & Fees",
  "Total Fare",
  "Availability",
  "EPL Status",
];

export default function QuotesTable() {
  const { C } = useTheme();
  const [routeFilter, setRouteFilter] = useState("ALL");
  const [carrierFilter, setCarrierFilter] = useState("ALL");
  const [windowFilter, setWindowFilter] = useState("ALL");
  const [soldOutOnly, setSoldOutOnly] = useState(false);

  const filteredQuotes = useMemo(() => {
    return QUOTES.filter((q) => {
      if (routeFilter !== "ALL" && q.route !== routeFilter) return false;
      if (carrierFilter !== "ALL" && q.carrier !== carrierFilter) return false;
      if (windowFilter !== "ALL" && q.window !== Number(windowFilter)) return false;
      if (soldOutOnly && !q.isSoldOut) return false;
      return true;
    });
  }, [routeFilter, carrierFilter, windowFilter, soldOutOnly]);

  const avgBase = useMemo(() => {
    if (!filteredQuotes.length) return 0;
    return Math.round(filteredQuotes.reduce((acc, q) => acc + q.base, 0) / filteredQuotes.length);
  }, [filteredQuotes]);

  const avgUdf = useMemo(() => {
    if (!filteredQuotes.length) return 0;
    return Math.round(filteredQuotes.reduce((acc, q) => acc + q.udf, 0) / filteredQuotes.length);
  }, [filteredQuotes]);

  const soldOutCount = useMemo(() => {
    return filteredQuotes.filter((q) => q.isSoldOut).length;
  }, [filteredQuotes]);

  const selectStyle = {
    background: C.panel,
    border: `1px solid ${C.border}`,
    borderRadius: 8, // Rounded select inputs
    padding: "6px 12px",
    fontFamily: FONT_MONO,
    fontSize: 11.5,
    color: C.text,
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ marginBottom: 44 }}>
      <SectionHeader
        eyebrow="EPL Micro-Data Pipeline"
        title="Captured Airfare Quotes Feed"
        note="Live feed of cleaned, deduplicated quotes. Disaggregates pure airline base yield from airport UDF, statutory taxes, and OTA convenience charges."
      />

      <Panel style={{ padding: 0, overflow: "hidden" }}>
        {/* Filter Toolbar */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.hairline}`,
            background: C.bgAlt,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_MONO, fontSize: 11, color: C.textMuted }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: C.amberSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Filter size={12} color={C.amber} strokeWidth={1.75} />
              </div>
              FILTERS:
            </div>

            {/* Route filter */}
            <select
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="ALL">All Routes ({ROUTES.length})</option>
              {ROUTES.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.code} ({r.name})
                </option>
              ))}
            </select>

            {/* Carrier filter */}
            <select
              value={carrierFilter}
              onChange={(e) => setCarrierFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="ALL">All Carriers ({CARRIERS.length})</option>
              {CARRIERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Window filter */}
            <select
              value={windowFilter}
              onChange={(e) => setWindowFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="ALL">All Advance Windows</option>
              {WINDOWS.map((w) => (
                <option key={w} value={w}>
                  T+{w} Days
                </option>
              ))}
            </select>

            {/* Sold out toggle */}
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: FONT_MONO, fontSize: 11.5, color: C.text, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={soldOutOnly}
                onChange={(e) => setSoldOutOnly(e.target.checked)}
                style={{ accentColor: C.rust }}
              />
              Sold-out only
            </label>
          </div>

          {/* Aggregate metrics with rounded pills */}
          <div style={{ display: "flex", gap: 12, fontFamily: FONT_MONO, fontSize: 11.5, color: C.textMuted, flexWrap: "wrap" }}>
            <span style={{ background: C.panel, padding: "4px 10px", borderRadius: 9999, border: `1px solid ${C.border}` }}>
              Matches: <strong style={{ color: C.text }}>{filteredQuotes.length}</strong>
            </span>
            <span style={{ background: C.panel, padding: "4px 10px", borderRadius: 9999, border: `1px solid ${C.border}` }}>
              Avg Base: <strong style={{ color: C.text }}>&#8377;{avgBase.toLocaleString("en-IN")}</strong>
            </span>
            <span style={{ background: C.panel, padding: "4px 10px", borderRadius: 9999, border: `1px solid ${C.border}` }}>
              Avg UDF: <strong style={{ color: C.text }}>&#8377;{avgUdf.toLocaleString("en-IN")}</strong>
            </span>
            <span style={{ background: C.panel, padding: "4px 10px", borderRadius: 9999, border: `1px solid ${C.border}` }}>
              Sold-Out: <strong style={{ color: soldOutCount > 0 ? C.rust : C.teal }}>{soldOutCount}</strong>
            </span>
          </div>
        </div>

        {/* Quotes Table */}
        <div className="apix-scroll" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 960 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.hairline}`, background: C.panel }}>
                {COLUMNS.map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      fontFamily: FONT_MONO,
                      fontSize: 10.5,
                      letterSpacing: "0.05em",
                      color: C.textFaint,
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} style={{ padding: "32px", textAlign: "center", fontFamily: FONT_UI, color: C.textMuted }}>
                    No quotes found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => (
                  <tr
                    key={q.id}
                    style={{
                      borderBottom: `1px solid ${C.hairline}`,
                      background: q.isSoldOut ? (C.rustSoft || "rgba(225, 29, 72, 0.06)") : "transparent",
                    }}
                  >
                    <td style={{ padding: "11px 14px", fontFamily: FONT_MONO, fontSize: 11.5, color: C.textFaint }}>
                      {q.minsAgo}m ago
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT_MONO, fontSize: 12, fontWeight: 600, color: C.text }}>
                      {q.flightNo}
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT_MONO, fontSize: 12, color: C.text }}>
                      {q.route}
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT_UI, fontSize: 12.5, color: C.text }}>
                      {q.carrier}
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT_MONO, fontSize: 11.5, color: C.teal }}>
                      <span style={{ background: C.tealSoft, padding: "2px 8px", borderRadius: 9999 }}>
                        T+{q.window}
                      </span>
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT_UI, fontSize: 11.5, color: C.textMuted }}>
                      {q.fareClass}
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT_UI, fontSize: 12, color: C.textMuted }}>
                      {q.source}
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT_MONO, fontSize: 12.5, color: C.text, fontWeight: 500 }}>
                      &#8377;{q.base.toLocaleString("en-IN")}
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT_MONO, fontSize: 12, color: C.textMuted }}>
                      &#8377;{q.udf.toLocaleString("en-IN")}
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT_MONO, fontSize: 12, color: C.textMuted }}>
                      &#8377;{(q.taxes + q.fee).toLocaleString("en-IN")}
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT_MONO, fontSize: 13, color: C.amber, fontWeight: 700 }}>
                      &#8377;{q.total.toLocaleString("en-IN")}
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT_MONO, fontSize: 11.5 }}>
                      {q.isSoldOut ? (
                        <span style={{ color: C.rust, fontWeight: 700, background: C.rustSoft, padding: "3px 8px", borderRadius: 9999 }}>
                          SOLD OUT
                        </span>
                      ) : (
                        <span style={{ color: C.teal, background: C.tealSoft, padding: "3px 8px", borderRadius: 9999 }}>
                          {q.avail} left
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT_MONO, fontSize: 11, color: C.teal }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: C.tealSoft, padding: "3px 8px", borderRadius: 9999 }}>
                        <CheckCircle2 size={12} strokeWidth={1.8} /> Cleaned
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
