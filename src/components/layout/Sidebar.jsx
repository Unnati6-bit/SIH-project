import React from "react";
import {
  LayoutDashboard,
  LineChart,
  Grid,
  Zap,
  Layers,
  Database,
  Terminal,
  ShieldCheck,
  TrendingUp,
  GitCompare,
  Download,
  Eye,
} from "lucide-react";
import { useTheme, FONT_DISPLAY, FONT_MONO, FONT_UI } from "../../theme.js";

export const NAV_ITEMS = [
  { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard, category: "ANALYTICS" },
  { id: "backtest", label: "30D DGCA Backtest", icon: LineChart, category: "ANALYTICS", badge: "R²=0.94" },
  { id: "heatmap", label: "Route Heatmap", icon: Grid, category: "ANALYTICS" },
  { id: "elasticity", label: "Lead-Time Elasticity", icon: Zap, category: "ANALYTICS" },

  { id: "forecast", label: "14D Forecast", icon: TrendingUp, category: "INTELLIGENCE", badge: "NEW" },
  { id: "compare", label: "Route Comparison", icon: GitCompare, category: "INTELLIGENCE" },
  { id: "reports", label: "Download Reports", icon: Download, category: "INTELLIGENCE" },

  { id: "methodology", label: "PSD Weights & Formula", icon: Layers, category: "METHODOLOGY" },
  { id: "quotes", label: "Captured Quotes Feed", icon: Database, category: "METHODOLOGY", badge: "LIVE" },
  { id: "api", label: "NSO / RBI API Gateway", icon: Terminal, category: "METHODOLOGY" },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  onAdmin,
  isOpen = true,
  onClose,
  isCollapsed = false,
  setIsCollapsed,
}) {
  const { C, themeKey } = useTheme();
  const width = isCollapsed ? 72 : 268;

  return (
    <aside
      className={`apix-sidebar apix-glass ${isOpen ? "apix-sidebar-open" : "apix-sidebar-closed"}`}
      style={{
        width: width,
        minWidth: width,
        height: "100vh",
        position: "sticky",
        top: 0,
        background: C.sidebarBg,
        borderRight: `1px solid ${C.sidebarBorder}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 40,
        boxShadow: C.skeuoRaised,
        transition: "width 0.25s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease",
        overflow: "hidden",
      }}
    >      {/* 1. TOP BRANDING EMBLEM */}
      <div
        style={{
          padding: isCollapsed ? "16px 10px" : "18px 16px",
          borderBottom: `1px solid ${C.hairline}`,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: 10,
        }}
      >
        {/* Logo Badge */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background:
              themeKey === "dark"
                ? "linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)"
                : "linear-gradient(135deg, #1E40AF 0%, #0F2A57 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: C.skeuoRaised || "0 4px 12px rgba(30,64,175,0.3)",
            border: `1px solid ${themeKey === "dark" ? "#3B82F6" : "#60A5FA"}`,
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* SkyMetric Logo: Aviation arc + data graph line fusion */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="2,17 6,12 10,14 14,8 18,10 22,5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M3 19 Q8 6 21 4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="21" cy="4" r="2" fill="#60A5FA" />
            <line x1="2" y1="19" x2="5" y2="18" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="2" y1="21" x2="6" y2="20" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <div
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#34D399",
              border: "1.5px solid rgba(255,255,255,0.8)",
              boxShadow: "0 0 6px rgba(52, 211, 153, 0.8)",
            }}
          />
        </div>

        {!isCollapsed && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 17,
                  fontWeight: 800,
                  color: C.text,
                  letterSpacing: "-0.02em",
                }}
              >
                Sky<span style={{ color: C.blue }}>Metric</span>
              </span>
            </div>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 9.5,
                fontWeight: 600,
                color: C.textMuted,
                letterSpacing: "0.03em",
                marginTop: 1,
              }}
            >
              INDIA AVIATION &middot; PRICE INTELLIGENCE
            </div>
          </div>
        )}
      </div>

      {/* 2. NAVIGATION MENU */}
      <div className="apix-scroll" style={{ flex: 1, overflowY: "auto", padding: isCollapsed ? "14px 8px" : "16px 12px" }}>
        {["ANALYTICS", "INTELLIGENCE", "METHODOLOGY"].map((cat) => {
          const items = NAV_ITEMS.filter((i) => i.category === cat);
          return (
            <div key={cat} style={{ marginBottom: 18 }}>
              {!isCollapsed ? (
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 9.5,
                    fontWeight: 800,
                    color: C.textFaint,
                    letterSpacing: "0.08em",
                    padding: "0 10px 6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{cat}</span>
                  <span style={{ height: 1, flex: 1, marginLeft: 8, background: C.hairline }} />
                </div>
              ) : (
                <div style={{ height: 1, background: C.hairline, margin: "6px 2px 10px" }} />
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (onClose) onClose();
                      }}
                      className="apix-skeuo-btn apix-sidebar-btn"
                      title={isCollapsed ? item.label : undefined}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isCollapsed ? "center" : "space-between",
                        padding: isCollapsed ? "6px 0" : "9px 12px",
                        height: 44,
                        borderRadius: 10,
                        border: `1px solid ${
                          isActive
                            ? themeKey === "dark"
                              ? "rgba(59, 130, 246, 0.4)"
                              : "#BFDBFE"
                            : "transparent"
                        }`,
                        background: isActive
                          ? themeKey === "dark"
                            ? "rgba(59, 130, 246, 0.16)"
                            : "#EFF6FF"
                          : "transparent",
                        color: isActive ? C.blue : C.textMuted,
                        fontFamily: FONT_UI,
                        fontSize: 13,
                        fontWeight: isActive ? 700 : 500,
                        cursor: "pointer",
                        outline: "none",
                        width: "100%",
                        boxShadow: isActive ? (C.skeuoActive || "inset 2px 2px 4px rgba(0,0,0,0.1)") : "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", width: isCollapsed ? "100%" : "auto" }}>
                        <div
                          className="apix-sidebar-icon-box"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: `1px solid ${isActive ? (themeKey === "dark" ? "#3B82F6" : "#60A5FA") : C.border}`,
                            background: isActive
                              ? themeKey === "dark"
                                ? "rgba(59, 130, 246, 0.25)"
                                : "#DBEAFE"
                              : C.bgAlt,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: isActive ? C.blue : C.textMuted,
                            boxShadow: isActive ? C.skeuoSunken : C.skeuoButton,
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={16} strokeWidth={1.9} />
                        </div>
                        {!isCollapsed && <span>{item.label}</span>}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span
                          style={{
                            fontFamily: FONT_MONO,
                            fontSize: 9.5,
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: 9999,
                            background: isActive ? C.blue : C.bgAlt,
                            color: isActive ? "#FFFFFF" : C.textFaint,
                            boxShadow: isActive ? `0 2px 6px ${C.primaryGlow}` : "none",
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ADMIN MANAGEMENT */}
        <div style={{ marginTop: 8 }}>
          {!isCollapsed ? (
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 9.5,
                fontWeight: 800,
                color: C.textFaint,
                letterSpacing: "0.08em",
                padding: "0 10px 6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>MINISTRY SYSTEM</span>
              <span style={{ height: 1, flex: 1, marginLeft: 8, background: C.hairline }} />
            </div>
          ) : (
            <div style={{ height: 1, background: C.hairline, margin: "6px 2px 10px" }} />
          )}

          <button
            onClick={() => {
              onAdmin();
              if (onClose) onClose();
            }}
            className="apix-skeuo-btn apix-sidebar-btn"
            title="Ministry Admin Console"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "flex-start",
              gap: 10,
              padding: isCollapsed ? "6px 0" : "9px 12px",
              height: 44,
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              background: C.bgAlt,
              color: C.text,
              fontFamily: FONT_UI,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              outline: "none",
              width: "100%",
              boxShadow: C.skeuoButton,
            }}
          >
            <div
              className="apix-sidebar-icon-box"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: C.blueSoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: C.skeuoButton,
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={16} color={C.blue} strokeWidth={1.9} />
            </div>
            {!isCollapsed && <span>Ministry Admin</span>}
          </button>
        </div>
      </div>

      {/* 3. BOTTOM FOOTER TELEMETRY & VIEW TOGGLE */}
      <div
        style={{
          padding: isCollapsed ? "12px 6px" : "14px 16px",
          borderTop: `1px solid ${C.hairline}`,
          background: C.panelAlt,
          boxShadow: C.skeuoRaised,
          textAlign: isCollapsed ? "center" : "left",
        }}
      >
        <div style={{ display: "flex", justifyContent: isCollapsed ? "center" : "space-between", alignItems: "center" }}>
          {!isCollapsed && (
            <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 600, color: C.textFaint }}>
              VIEW MODE
            </span>
          )}
          <button
            onClick={() => setViewMode(viewMode === "tab" ? "all" : "tab")}
            className="apix-skeuo-btn"
            title="Toggle between focused single tab and all-in-one report"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              fontFamily: FONT_MONO,
              fontSize: 10.5,
              padding: isCollapsed ? "8px" : "4px 9px",
              borderRadius: 6,
              background: C.panel,
              border: `1px solid ${C.border}`,
              color: C.blue,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: C.skeuoButton,
              width: isCollapsed ? 36 : "auto",
              height: isCollapsed ? 36 : "auto",
            }}
          >
            <Eye size={15} /> {!isCollapsed && (viewMode === "tab" ? "FOCUSED" : "ALL-IN-ONE")}
          </button>
        </div>
      </div>
    </aside>
  );
}
