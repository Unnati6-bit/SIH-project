import React, { useState } from "react";
import { Layers, Calculator, Scale, AlertCircle, CheckCircle2, FileSpreadsheet, Landmark, Globe } from "lucide-react";
import { useTheme, FONT_DISPLAY, FONT_UI, FONT_MONO } from "../../theme.js";
import { ROUTES } from "../../data/mockData.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";
import Chip from "../ui/Chip.jsx";

export default function MethodologyPanel() {
  const { C } = useTheme();
  const [activeTab, setActiveTab] = useState("weights");

  const totalWeight = ROUTES.reduce((sum, r) => sum + r.weight, 0).toFixed(2);
  const totalPax = ROUTES.reduce((sum, r) => sum + r.paxMonthly, 0).toFixed(2);

  const thStyle = {
    textAlign: "left",
    padding: "12px 14px",
    fontFamily: FONT_MONO,
    fontSize: 11,
    letterSpacing: "0.03em",
    color: C.textMuted,
    fontWeight: 600,
  };

  const tdStyle = {
    padding: "11px 14px",
    fontSize: 12,
  };

  return (
    <div style={{ marginBottom: 44 }}>
      <SectionHeader
        eyebrow="Index Construction & Mandate"
        title="MoSPI PSD Weights & Policy Methodology"
        note="Rigorous index construction based on Price Statistics Division (PSD) routes, DGCA passenger traffic volume, and RBI Flexible Inflation-Targeting framework."
      />

      <Panel skeuo={true}>
        {/* Navigation Pill Chips */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", borderBottom: `1px solid ${C.hairline}`, paddingBottom: 14 }}>
          <Chip active={activeTab === "weights"} onClick={() => setActiveTab("weights")}>
            <FileSpreadsheet size={13} style={{ marginRight: 6, strokeWidth: 1.75 }} />
            PSD BASKET &amp; DGCA WEIGHTS
          </Chip>
          <Chip active={activeTab === "policy"} onClick={() => setActiveTab("policy")}>
            <Landmark size={13} style={{ marginRight: 6, strokeWidth: 1.75 }} />
            MOSPI / RBI POLICY MANDATE
          </Chip>
          <Chip active={activeTab === "formula"} onClick={() => setActiveTab("formula")}>
            <Calculator size={13} style={{ marginRight: 6, strokeWidth: 1.75 }} />
            JEVONS ELEMENTARY FORMULATION
          </Chip>
          <Chip active={activeTab === "etl"} onClick={() => setActiveTab("etl")}>
            <Scale size={13} style={{ marginRight: 6, strokeWidth: 1.75 }} />
            DATA CLEANING &amp; SOLD-OUT RULES
          </Chip>
        </div>

        {/* TAB 1: PSD BASKET & ROUTE WEIGHTS TABLE */}
        {activeTab === "weights" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted }}>
                Representative city-pairs selected according to <strong>DGCA Domestic Scheduled Passenger Traffic Data</strong> and approved under MoSPI CPI specifications.
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11.5, background: C.bgAlt, padding: "5px 12px", borderRadius: 9999, border: `1px solid ${C.border}`, color: C.blue, fontWeight: 700 }}>
                Total Basket Weight: <strong>{totalWeight} (100%)</strong>
              </div>
            </div>

            <div className="apix-scroll" style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}`, background: C.bgAlt }}>
                    <th style={thStyle}>Route Code</th>
                    <th style={thStyle}>Sector Name</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Distance</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Monthly Traffic (Pax)</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Traffic Share</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>MoSPI PSD Weight</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Avg. Load Factor</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Base Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {ROUTES.map((r, idx) => (
                    <tr
                      key={r.code}
                      style={{
                        borderBottom: `1px solid ${C.hairline}`,
                        background: idx % 2 === 1 ? C.panelAlt : "transparent",
                      }}
                    >
                      <td style={{ ...tdStyle, fontFamily: FONT_MONO, fontWeight: 600, color: C.text }}>
                        {r.code}
                      </td>
                      <td style={{ ...tdStyle, fontFamily: FONT_UI, color: C.text }}>
                        {r.name}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right", fontFamily: FONT_MONO, color: C.textMuted }}>
                        {r.distanceKm} km
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right", fontFamily: FONT_MONO, color: C.text }}>
                        {r.paxMonthly} Lakh
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right", fontFamily: FONT_MONO, color: C.text }}>
                        {r.paxShare}%
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right", fontFamily: FONT_MONO, fontWeight: 700, color: C.blue }}>
                        {r.weight.toFixed(2)}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right", fontFamily: FONT_MONO, color: C.teal }}>
                        {r.loadFactor}%
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right", fontFamily: FONT_MONO, color: C.textMuted }}>
                        &#8377;{r.base.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MOSPI / RBI POLICY MANDATE */}
        {activeTab === "policy" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, boxShadow: C.skeuoRaised }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Landmark size={20} color={C.blue} />
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: C.text, margin: 0 }}>
                  Flexible Inflation-Targeting Framework Context
                </h3>
              </div>
              <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted, lineHeight: 1.75, margin: 0 }}>
                The Consumer Price Index (CPI) compiled by the Price Statistics Division (PSD) at the <strong>National Statistical Office (NSO), MoSPI</strong> is the primary anchor for retail inflation measurement in India, directly informing the <strong>Reserve Bank of India (RBI) Monetary Policy Committee</strong>. Under modern dynamic air travel pricing, manual outlet pricing fails to capture intra-day 200-400% price swings. Over 90% of Indian ticket purchases occur digitally across OTAs and airline direct portals.
              </p>
            </div>

            {/* Coverage Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="apix-two-col">
              {/* Airlines */}
              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, boxShadow: C.skeuoRaised }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.blue, marginBottom: 12, fontWeight: 700, fontFamily: FONT_MONO, fontSize: 12 }}>
                  <Globe size={16} /> DIRECT AIRLINE PORTALS COVERED (100%)
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["IndiGo", "Air India", "Air India Express", "Akasa Air", "SpiceJet"].map((carrier) => (
                    <span
                      key={carrier}
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 11,
                        padding: "5px 12px",
                        borderRadius: 6,
                        background: C.bgAlt,
                        border: `1px solid ${C.border}`,
                        color: C.text,
                        fontWeight: 600,
                        boxShadow: C.skeuoButton,
                      }}
                    >
                      {carrier}
                    </span>
                  ))}
                </div>
              </div>

              {/* OTAs */}
              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, boxShadow: C.skeuoRaised }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.amber, marginBottom: 12, fontWeight: 700, fontFamily: FONT_MONO, fontSize: 12 }}>
                  <Globe size={16} /> ONLINE TRAVEL AGGREGATORS (OTAs) COVERED
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["MakeMyTrip", "Yatra.com", "EaseMyTrip", "Cleartrip", "Ixigo", "Goibibo"].map((ota) => (
                    <span
                      key={ota}
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 11,
                        padding: "5px 12px",
                        borderRadius: 6,
                        background: C.bgAlt,
                        border: `1px solid ${C.border}`,
                        color: C.text,
                        fontWeight: 600,
                        boxShadow: C.skeuoButton,
                      }}
                    >
                      {ota}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: JEVONS ELEMENTARY FORMULATION */}
        {activeTab === "formula" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            <div style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: C.blueSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Calculator size={16} color={C.blue} strokeWidth={1.75} />
                </div>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.text }}>
                  1. Elementary Unweighted Index (Jevons)
                </span>
              </div>
              <div
                style={{
                  background: C.panel,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "16px 20px",
                  fontFamily: FONT_MONO,
                  fontSize: 15,
                  color: C.text,
                  marginBottom: 14,
                  lineHeight: 1.8,
                  textAlign: "center",
                  boxShadow: C.skeuoRaised,
                }}
              >
                I<sub>t,0</sub><sup>J</sup> = &prod;<sub>i=1</sub><sup>n</sup> ( p<sub>t,i</sub> / p<sub>0,i</sub> )<sup>1/n</sup>
              </div>
              <ul style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted, lineHeight: 1.7, margin: 0, paddingLeft: 18 }}>
                <li><strong>Geometric Mean Property</strong>: Satisfies the time-reversibility and transitivity axioms; recommended by the ILO/IMF Consumer Price Index Manual for elementary aggregates.</li>
                <li><strong>Substitution Neutrality</strong>: Handles dynamic fare shifting across advance booking windows without upward plutocratic bias.</li>
              </ul>
            </div>

            <div style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: C.tealSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Layers size={16} color={C.teal} strokeWidth={1.75} />
                </div>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.text }}>
                  2. Chained Upper-Level Aggregation
                </span>
              </div>
              <div
                style={{
                  background: C.panel,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "16px 20px",
                  fontFamily: FONT_MONO,
                  fontSize: 14,
                  color: C.text,
                  marginBottom: 14,
                  lineHeight: 1.8,
                  textAlign: "center",
                  boxShadow: C.skeuoRaised,
                }}
              >
                APIx<sub>t</sub> = &sum;<sub>r</sub> W<sub>r</sub> &middot; [ &sum;<sub>c</sub> S<sub>c</sub> &middot; I<sub>t</sub><sup>r,c</sup> ]
              </div>
              <ul style={{ fontFamily: FONT_UI, fontSize: 13, color: C.textMuted, lineHeight: 1.7, margin: 0, paddingLeft: 18 }}>
                <li><strong>Advance Purchase Windows</strong>: Fixed at T+1, T+7, T+15, T+30, and T+45 days.</li>
                <li><strong>Monthly Chaining</strong>: Chained on a 30-day cycle to absorb route additions without step discontinuities.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: DATA CLEANING & EPL RULES */}
        {activeTab === "etl" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            <div style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.amber, marginBottom: 12 }}>
                <CheckCircle2 size={18} color={C.amber} />
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: C.text }}>
                  Component Decomposition
                </span>
              </div>
              <ul style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.textMuted, lineHeight: 1.7, paddingLeft: 16, margin: 0 }}>
                <li><strong>Base Fare</strong>: Pure airline seat revenue (primary CPI driver).</li>
                <li><strong>Statutory Fees &amp; Taxes</strong>: Airport User Development Fee (UDF), Passenger Service Fee (PSF), GST (5%).</li>
                <li><strong>Ancillary Fees</strong>: Platform convenience fee deducted to avoid OTA-induced price distortion.</li>
              </ul>
            </div>

            <div style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.rust, marginBottom: 12 }}>
                <AlertCircle size={18} color={C.rust} />
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: C.text }}>
                  Sold-Out &amp; Cancellation Rules
                </span>
              </div>
              <ul style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.textMuted, lineHeight: 1.7, paddingLeft: 16, margin: 0 }}>
                <li><strong>Availability Tracking</strong>: Tagged with <code>isSoldOut = true</code> to record market load-factor pressure.</li>
                <li><strong>Price Exclusion</strong>: Omitted from day's geometric price relative computation to prevent pseudo price drops.</li>
              </ul>
            </div>

            <div style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.teal, marginBottom: 12 }}>
                <Scale size={18} color={C.teal} />
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: C.text }}>
                  Outlier Rejection (EPL)
                </span>
              </div>
              <ul style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.textMuted, lineHeight: 1.7, paddingLeft: 16, margin: 0 }}>
                <li><strong>Rolling IQR Filtering</strong>: Quotes deviating beyond 2.5 &times; IQR from 14-day sector median are isolated for audit.</li>
                <li><strong>Scraper Glitch Protection</strong>: Web extraction anomalies quarantined before DB commit.</li>
              </ul>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
