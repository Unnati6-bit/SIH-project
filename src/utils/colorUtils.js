import { C } from "../theme.js";

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export function mix(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

// Positive values (fare above trend) shade toward amber, negative toward teal.
export function heatColor(v) {
  if (v >= 0) return mix(C.panelAlt, C.amber, Math.min(v / 26, 1));
  return mix(C.panelAlt, C.teal, Math.min(-v / 20, 1));
}
