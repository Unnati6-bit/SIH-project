import { C as defaultC } from "../theme.js";

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export function mix(hexA, hexB, t) {
  try {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    const r = Math.round(a[0] + (b[0] - a[0]) * t);
    const g = Math.round(a[1] + (b[1] - a[1]) * t);
    const bl = Math.round(a[2] + (b[2] - a[2]) * t);
    return `rgb(${r},${g},${bl})`;
  } catch {
    return hexA;
  }
}

// Positive values (fare above trend) shade toward amber, negative toward teal.
export function heatColor(v, theme = defaultC) {
  const bg = theme.panelAlt || defaultC.panelAlt;
  const amber = theme.amber || defaultC.amber;
  const teal = theme.teal || defaultC.teal;

  if (v >= 0) return mix(bg, amber, Math.min(v / 26, 1));
  return mix(bg, teal, Math.min(-v / 20, 1));
}
