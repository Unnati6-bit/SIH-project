import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  RefreshCw,
  Radio,
  Menu,
  X,
  Clock,
  Wifi,
  ChevronDown,
} from "lucide-react";
import { useTheme, FONT_DISPLAY, FONT_MONO, FONT_UI } from "../../theme.js";
import { NAV_ITEMS } from "./Sidebar.jsx";

// Data sources freshness mock (would be real in production)
const DATA_SOURCES = [
  { name: "Akasa Air", type: "Direct", minAgo: 2 },
  { name: "SpiceJet", type: "Direct", minAgo: 8 },
  { name: "Yatra.com", type: "OTA", minAgo: 14 },
];

export default function TopNav({
  activeTab,
  setActiveTab,
  onAdmin,
  isSidebarOpen,
  setIsSidebarOpen,
  isCollapsed,
  setIsCollapsed,
}) {
  const { themeKey, setThemeKey, C } = useTheme();
  const [timeStr, setTimeStr] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFreshness, setShowFreshness] = useState(false);

  // Real-time IST clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const currentItem = NAV_ITEMS.find((item) => item.id === activeTab) || {
    label: "Dashboard",
  };

  const getFreshnessColor = (min) => {
    if (min <= 5) return "#10B981"; // fresh green
    if (min <= 20) return "#F59E0B"; // amber
    return "#EF4444"; // stale red
  };

  return (
    <>
      {/* 1. Subtle Government of India National Tricolor Accent */}
      <div className="apix-gov-tricolor" />

      {/* 2. Skeuomorphic Header */}
      <header
        className="apix-glass"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background:
            themeKey === "dark"
              ? "rgba(11, 19, 38, 0.88)"
              : "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid ${C.hairline}`,
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          boxShadow: C.skeuoRaised,
          transition: "background 0.25s ease, border-color 0.25s ease",
        }}
      >
        {/* LEFT: Mobile & Desktop Navigation Toggles & Ministerial Breadcrumbs */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Desktop Sidebar Collapse Toggle */}
          {setIsCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="apix-skeuo-btn"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: C.panel,
                color: C.blue,
                cursor: "pointer",
                boxShadow: C.skeuoButton,
              }}
            >
              <Menu size={16} />
            </button>
          )}

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setIsSidebarOpen && setIsSidebarOpen(!isSidebarOpen)}
            className="apix-mobile-toggle apix-skeuo-btn"
            aria-label="Toggle Navigation Sidebar"
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              background: C.panel,
              color: C.text,
              cursor: "pointer",
              boxShadow: C.skeuoButton,
            }}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Ministerial Breadcrumb Navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                fontWeight: 700,
                color: C.textMuted,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {/* Inline SkyMetric mini logo in breadcrumb */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 19 Q8 6 21 4" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <circle cx="21" cy="4" r="2.5" fill={C.blue} />
                <polyline points="2,17 6,12 10,14 14,8" stroke={C.blue} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
              </svg>
              <span style={{ color: C.blue, fontWeight: 800 }}>SkyMetric</span>
              <span style={{ color: C.textFaint }}>/</span>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background:
                  themeKey === "dark"
                    ? "rgba(59, 130, 246, 0.15)"
                    : "#EFF6FF",
                border: `1px solid ${
                  themeKey === "dark"
                    ? "rgba(59, 130, 246, 0.35)"
                    : "#BFDBFE"
                }`,
                boxShadow: C.skeuoSunken || "inset 1px 1px 3px rgba(30,64,175,0.1)",
                padding: "4px 14px",
                borderRadius: 9999,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_UI,
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.blue,
                  letterSpacing: "-0.01em",
                }}
              >
                {currentItem.label}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Heartbeat, Ticker Time, Theme Switcher & Admin */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Data Sources Freshness Chip */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowFreshness(!showFreshness)}
              className="apix-skeuo-btn"
              title="Data source freshness status"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: FONT_MONO,
                fontSize: 10.5,
                fontWeight: 700,
                color: "#10B981",
                background: themeKey === "dark" ? "rgba(16, 185, 129, 0.12)" : "#ECFDF5",
                border: `1px solid ${themeKey === "dark" ? "rgba(16,185,129,0.3)" : "#A7F3D0"}`,
                boxShadow: C.skeuoButton,
                padding: "5px 11px",
                borderRadius: 9999,
                cursor: "pointer",
              }}
            >
              <span
                className="apix-radar-pulse"
                style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", flexShrink: 0 }}
              />
              <Wifi size={11} />
              DATA LIVE
              <ChevronDown size={10} style={{ opacity: 0.6, transform: showFreshness ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
            </button>

            {/* Freshness dropdown */}
            {showFreshness && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: themeKey === "dark" ? "#050A16" : "#FFFFFF",
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  boxShadow: themeKey === "dark" ? "0 16px 40px rgba(0,0,0,0.8)" : "0 16px 40px rgba(17,60,104,0.18)",
                  padding: "14px 16px",
                  minWidth: 220,
                  zIndex: 100,
                }}
              >
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, fontWeight: 800, color: C.textFaint, letterSpacing: "0.1em", marginBottom: 10 }}>
                  SCRAPER DATA FRESHNESS
                </div>
                {DATA_SOURCES.map((src) => (
                  <div
                    key={src.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "7px 0",
                      borderBottom: `1px solid ${C.hairline}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: getFreshnessColor(src.minAgo), boxShadow: `0 0 6px ${getFreshnessColor(src.minAgo)}` }} />
                      <div>
                        <div style={{ fontFamily: FONT_UI, fontSize: 12, fontWeight: 600, color: C.text }}>{src.name}</div>
                        <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.textFaint }}>{src.type}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, color: getFreshnessColor(src.minAgo) }}>
                      {src.minAgo}m ago
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 10, fontFamily: FONT_MONO, fontSize: 9, color: C.textFaint, textAlign: "center" }}>
                  Auto-refresh every 15 minutes
                </div>
              </div>
            )}
          </div>

          {/* Live Skeuomorphic Sunken Clock Box */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: FONT_MONO,
              fontSize: 11.5,
              fontWeight: 600,
              color: C.text,
              background: themeKey === "dark" ? "#060A14" : "#EAF0F8",
              border: `1px solid ${C.border}`,
              boxShadow: C.skeuoSunken || "inset 1px 1px 3px rgba(0,0,0,0.15)",
              padding: "5px 11px",
              borderRadius: 8,
            }}
          >
            <Clock size={12} color={C.blue} />
            <span>{timeStr || "--:--:--"} IST</span>
          </div>

          {/* Tactile Refresh Feed Button */}
          <button
            onClick={handleRefresh}
            className="apix-skeuo-btn"
            title="Refresh real-time fare oracle cache"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.panel,
              color: C.textMuted,
              cursor: "pointer",
              boxShadow: C.skeuoButton,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = C.blue;
              e.currentTarget.style.borderColor = C.blue;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = C.textMuted;
              e.currentTarget.style.borderColor = C.border;
            }}
          >
            <RefreshCw
              size={13}
              style={{
                transition: "transform 0.5s ease",
                transform: isRefreshing ? "rotate(360deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {/* Tactile Skeuomorphic Theme Switcher */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: themeKey === "dark" ? "#000000" : "#E5EDF7",
              border: `1px solid ${C.border}`,
              boxShadow: C.skeuoSunken || "inset 2px 2px 4px rgba(0,0,0,0.1)",
              borderRadius: 9999,
              padding: "3px",
              gap: 2,
            }}
          >
            <button
              onClick={() => setThemeKey("classic")}
              title="MoSPI Official Institutional (Ivory & Navy)"
              className="apix-skeuo-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                border: "none",
                background: themeKey === "classic" ? C.panel : "transparent",
                color: themeKey === "classic" ? C.blue : C.textMuted,
                boxShadow: themeKey === "classic" ? C.skeuoButton : "none",
                borderRadius: 9999,
                padding: "4px 11px",
                fontSize: 11,
                fontFamily: FONT_MONO,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <Sun size={12} strokeWidth={2} />
              Classic
            </button>

            <button
              onClick={() => setThemeKey("dark")}
              title="Dark Mode"
              className="apix-skeuo-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                border: "none",
                background: themeKey === "dark" ? C.blue : "transparent",
                color: themeKey === "dark" ? "#FFFFFF" : C.textMuted,
                boxShadow: themeKey === "dark" ? `0 2px 8px ${C.primaryGlow}` : "none",
                borderRadius: 9999,
                padding: "4px 11px",
                fontSize: 11,
                fontFamily: FONT_MONO,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <Moon size={12} strokeWidth={2} />
              Dark
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
