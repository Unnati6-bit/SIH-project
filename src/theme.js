import React, { createContext, useContext, useState, useEffect } from "react";

/* ================================================================== */
/*  GOVERNMENT OF INDIA & SKEUOMORPHIC COLOR THEMES                   */
/*  - classic: MoSPI Official Portal (Ashoka Blue & Ivory) [DEFAULT]  */
/*  - dark: Pure Pitch Black AMOLED & Electric Emerald / Blue         */
/*  - light: Alias pointing to classic                                */
/* ================================================================== */
const classicTheme = {
  id: "classic",
  name: "MoSPI Institutional (Ivory & Navy)",
  icon: "Building2",
  bg: "#F4F6F9",
  bgAlt: "#E9EFF6",
  panel: "#FFFFFF",
  panelAlt: "#F7F9FC",
  sidebarBg: "#FFFFFF",
  sidebarBorder: "#CAD7E6",
  border: "#CAD7E6",
  hairline: "#DBE5F0",
  text: "#0F2847",
  textMuted: "#365172",
  textFaint: "#728AA6",
  
  // National Portal of India Navy & Electric Indigo
  blue: "#113C68",
  blueLight: "#1D5C9B",
  blueSoft: "rgba(17, 60, 104, 0.12)",
  amber: "#6366F1", // Electric Indigo — premium secondary accent
  amberSoft: "rgba(99, 102, 241, 0.12)",
  teal: "#0D7A68",
  tealSoft: "rgba(13, 122, 104, 0.12)",
  rust: "#B91C1C",
  rustSoft: "rgba(185, 28, 28, 0.12)",
  primaryGlow: "rgba(17, 60, 104, 0.25)",
  
  skeuoRaised: "5px 5px 12px rgba(17, 60, 104, 0.09), -4px -4px 10px #FFFFFF, inset 0 1px 0 rgba(255, 255, 255, 0.95)",
  skeuoSunken: "inset 3px 3px 6px rgba(17, 60, 104, 0.12), inset -2px -2px 5px #FFFFFF",
  skeuoButton: "3px 3px 7px rgba(17, 60, 104, 0.11), -2px -2px 6px #FFFFFF, inset 0 1px 0 rgba(255, 255, 255, 0.95)",
  skeuoActive: "inset 2px 2px 5px rgba(17, 60, 104, 0.22), inset -1px -1px 3px rgba(255, 255, 255, 0.6)",
  cardShadow: "5px 5px 14px rgba(17, 60, 104, 0.08), -3px -3px 8px #FFFFFF",
  cardBorder: "#CAD7E6",
  flap: "#0B223D",
  flapEdge: "#15365E",
  glassPanel: "rgba(255, 255, 255, 0.92)",
  glassBorder: "#CAD7E6",
};

const darkTheme = {
  id: "dark",
  name: "Dark mode",
  icon: "Moon",
  bg: "#000000",
  bgAlt: "#000000",
  panel: "#000000",
  panelAlt: "#000000",
  sidebarBg: "#000000",
  sidebarBorder: "rgba(255, 255, 255, 0.12)",
  border: "rgba(255, 255, 255, 0.12)",
  hairline: "rgba(255, 255, 255, 0.08)",
  text: "#FFFFFF",
  textMuted: "#94A3B8",
  textFaint: "#64748B",
  
  // Sleek Dark Mode with Indigo Accents & Subtle Slate Contrast
  blue: "#38BDF8",
  blueLight: "#7DD3FC",
  blueSoft: "rgba(56, 189, 248, 0.12)",
  amber: "#818CF8", // Electric Indigo — premium secondary accent
  amberSoft: "rgba(129, 140, 248, 0.18)",
  teal: "#14B8A6",
  tealSoft: "rgba(20, 184, 166, 0.18)",
  rust: "#F43F5E",
  rustSoft: "rgba(244, 63, 94, 0.18)",
  primaryGlow: "rgba(129, 140, 248, 0.35)",
  
  // Skeuomorphic tactile tokens (Pure Pitch Black with Slate Borders)
  skeuoRaised: "0 0 0 1px rgba(255, 255, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.10)",
  skeuoSunken: "inset 0 0 12px #000000, 0 0 0 1px rgba(255, 255, 255, 0.10)",
  skeuoButton: "0 0 0 1px rgba(255, 255, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.10)",
  skeuoActive: "inset 0 0 10px #000000, 0 0 0 1px rgba(255, 255, 255, 0.25)",
  cardShadow: "0 8px 30px rgba(0, 0, 0, 0.95)",
  cardBorder: "rgba(255, 255, 255, 0.12)",
  flap: "#000000",
  flapEdge: "rgba(255, 255, 255, 0.20)",
  glassPanel: "rgba(0, 0, 0, 0.95)",
  glassBorder: "rgba(255, 255, 255, 0.15)",
};

export const THEMES = {
  classic: classicTheme,
  light: classicTheme,
  dark: darkTheme,
};

/* Default static theme points to Classic MoSPI Ivory */
export const C = classicTheme;

export const FONT_DISPLAY = "'Outfit', 'Space Grotesk', 'Plus Jakarta Sans', sans-serif";
export const FONT_UI = "'Plus Jakarta Sans', 'Outfit', system-ui, sans-serif";
export const FONT_MONO = "'Fira Code', 'JetBrains Mono', monospace";
export const FONT_SERIF = "'Source Serif 4', Georgia, serif";

export function getTooltipStyle(theme = C) {
  return {
    contentStyle: {
      background: theme.panel,
      border: `1px solid ${theme.border}`,
      borderRadius: 10,
      boxShadow: theme.cardShadow,
      fontFamily: FONT_MONO,
      fontSize: 12,
      color: theme.text,
      padding: "10px 14px",
    },
    labelStyle: { color: theme.textMuted, fontWeight: 600, marginBottom: 4 },
    itemStyle: { color: theme.text },
  };
}

export const tooltipStyle = getTooltipStyle(classicTheme);

/* ================================================================== */
/*  REACT CONTEXT & HOOK FOR THEME SWITCHING                          */
/* ================================================================== */
const ThemeContext = createContext({
  themeKey: "classic",
  theme: classicTheme,
  C: classicTheme,
  setThemeKey: () => {},
});

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = localStorage.getItem("apix_theme");
        if (saved && THEMES[saved]) return saved;
      }
    } catch {
      // ignore
    }
    return "classic";
  });

  const activeTheme = THEMES[themeKey] || classicTheme;

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("apix_theme", themeKey);
      }
    } catch {
      // ignore
    }
    if (typeof document !== "undefined" && document.body) {
      document.body.style.backgroundColor = activeTheme.bg;
      document.body.style.color = activeTheme.text;
      document.documentElement.setAttribute("data-theme", themeKey);
    }
  }, [themeKey, activeTheme]);

  return React.createElement(
    ThemeContext.Provider,
    {
      value: {
        themeKey,
        theme: activeTheme,
        C: activeTheme,
        setThemeKey,
      },
    },
    children
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}