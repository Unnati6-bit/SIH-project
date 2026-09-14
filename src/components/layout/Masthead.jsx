import React from "react";
import { Plane, Radio, ShieldCheck, Sun, Moon, Building2 } from "lucide-react";
import { useTheme, THEMES, FONT_DISPLAY, FONT_MONO } from "../../theme.js";
import { dateLabel } from "../../data/mockData.js";

export default function Masthead({ onAdmin }) {
  const { themeKey, setThemeKey, C } = useTheme();

  const navItems = [
    { label: "INDEX TREND", href: "#trend" },
    { label: "30D BACKTEST", href: "#backtest" },
    { label: "ROUTE HEATMAP", href: "#heatmap" },
    { label: "LEAD-TIME ELASTICITY", href: "#elasticity" },
    { label: "PSD METHODOLOGY", href: "#methodology" },
    { label: "CAPTURED QUOTES", href: "#quotes" },
    { label: "NSO / RBI API", href: "#api" },
  ];

  return (
    <div style={{ borderBottom: `1px solid ${C.hairline}`, background: C.bgAlt, transition: "background 0.2s ease" }}>
      {/* Top Header */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 24px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          {/* Logo & Ministerial Branding */}
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14, // Smooth rounded icon container, no sharp corners
                background: `linear-gradient(135deg, ${C.amberSoft}, ${C.tealSoft})`,
                border: `1px solid ${C.amberSoft}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 14px ${C.amberSoft}`,
              }}
            >
              <Plane
                size={24}
                color={C.amber}
                strokeWidth={1.75}
                style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
              />
            </div>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: C.text }}>
                Airfare Price Index <span style={{ color: C.amber, fontWeight: 700 }}>&middot; APIx</span>
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textMuted, letterSpacing: "0.02em", marginTop: 2 }}>
                NATIONAL STATISTICAL OFFICE (MoSPI) &amp; RESERVE BANK OF INDIA (RBI) &mdash; CPI AUGMENTATION
              </div>
            </div>
          </div>

          {/* Right Header Actions: Live Badge, Theme Switcher & Admin */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {/* Live Indicator */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: C.teal,
                border: `1px solid ${C.tealSoft}`,
                background: C.panel,
                padding: "6px 12px",
                borderRadius: 9999, // Smooth rounded pill
              }}
            >
              <Radio size={12} className="apix-pulse-dot" style={{ strokeWidth: 1.75 }} />
              LIVE &middot; {dateLabel(0, { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
            </div>

            {/* Curated Theme Switcher */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 9999,
                padding: "3px",
                gap: 2,
              }}
            >
              <button
                onClick={() => setThemeKey("classic")}
                title="MoSPI Institutional Ivory & Navy"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  border: "none",
                  background: themeKey === "classic" ? C.amber : "transparent",
                  color: themeKey === "classic" ? "#FFFFFF" : C.textMuted,
                  borderRadius: 9999,
                  padding: "4px 11px",
                  fontSize: 11,
                  fontFamily: FONT_MONO,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <Sun size={12} strokeWidth={1.75} />
                Classic
              </button>

              <button
                onClick={() => setThemeKey("dark")}
                title="Dark Mode"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  border: "none",
                  background: themeKey === "dark" ? C.amber : "transparent",
                  color: themeKey === "dark" ? "#FFFFFF" : C.textMuted,
                  borderRadius: 9999,
                  padding: "4px 11px",
                  fontSize: 11,
                  fontFamily: FONT_MONO,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <Moon size={12} strokeWidth={1.75} />
                Dark Mode
              </button>
            </div>

            {/* Admin Portal Button */}
            <button
              onClick={onAdmin}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontFamily: FONT_MONO,
                fontSize: 11.5,
                fontWeight: 600,
                color: C.text,
                border: `1px solid ${C.border}`,
                background: C.panel,
                padding: "6px 14px",
                borderRadius: 9999, // Smooth rounded pill
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.amber;
                e.currentTarget.style.color = C.amber;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.text;
              }}
            >
              <ShieldCheck size={14} color={C.amber} strokeWidth={1.75} /> ADMIN
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Strip with Rounded Hover Pills */}
      <div style={{ borderTop: `1px solid ${C.hairline}`, background: C.panel }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, overflowX: "auto", padding: "8px 0" }}>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  textDecoration: "none",
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.textMuted,
                  padding: "6px 14px",
                  borderRadius: 9999, // Smooth rounded pill link
                  whiteSpace: "nowrap",
                  transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.amber;
                  e.currentTarget.style.background = C.amberSoft;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.textMuted;
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
