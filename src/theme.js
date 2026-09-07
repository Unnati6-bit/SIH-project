export const C = {
  bg: "#F7F5F0",
  bgAlt: "#EFEBE2",
  panel: "#FFFFFF",
  panelAlt: "#F3F0E9",
  border: "#DDD6C7",
  hairline: "#E6E0D3",
  text: "#1B2430",
  textMuted: "#5C6B80",
  textFaint: "#8C97AB",
  amber: "#B8860B",
  amberSoft: "#F3E4C0",
  teal: "#2F8683",
  tealSoft: "#D9EDEC",
  rust: "#A34430",
  flap: "#1B2A40",
  flapEdge: "#0A121F",
};

export const FONT_DISPLAY = "'Source Serif 4', Georgia, serif";
export const FONT_UI = "'IBM Plex Sans', system-ui, sans-serif";
export const FONT_MONO = "'IBM Plex Mono', 'Courier New', monospace";

export const tooltipStyle = {
  contentStyle: { background: C.bgAlt, border: `1px solid ${C.hairline}`, fontFamily: FONT_MONO, fontSize: 12, color: C.text },
  labelStyle: { color: C.textMuted },
  itemStyle: { color: C.text },
};