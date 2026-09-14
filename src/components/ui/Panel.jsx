import React from "react";
import { useTheme, FONT_MONO } from "../../theme.js";

export default function Panel({
  children,
  style,
  className = "",
  skeuo = true,
  accentColor,
  refTag,
  badge,
}) {
  const { C, themeKey } = useTheme();

  return (
    <div
      className={`apix-card-hover ${className}`}
      style={{
        background: C.panel,
        border: `1px solid ${C.cardBorder || C.border}`,
        borderRadius: 14,
        boxShadow:
          themeKey === "dark"
            ? "0 10px 36px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.14)"
            : "0 8px 24px rgba(30, 64, 175, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.85)",
        padding: "24px 26px",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Top Accent Strip with Gradient Specular Highlight */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: accentColor
            ? accentColor
            : themeKey === "dark"
            ? "linear-gradient(90deg, #3B82F6 0%, #60A5FA 50%, #1E40AF 100%)"
            : "linear-gradient(90deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)",
          opacity: 0.95,
        }}
      />

      {/* Sleek Corner Accent Dot */}
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: accentColor || C.blue,
          opacity: 0.5,
        }}
      />

      {/* Top Institutional Metadata Tag / Status LED if specified */}
      {(refTag || badge) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
            paddingBottom: 10,
            borderBottom: `1px solid ${C.hairline}`,
          }}
        >
          {refTag ? (
            <span style={{ fontFamily: FONT_MONO, fontSize: 9.5, fontWeight: 700, color: C.textFaint, letterSpacing: "0.07em" }}>
              {refTag}
            </span>
          ) : (
            <span />
          )}

          {badge && (
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 9,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 5,
                background: C.blueSoft,
                color: C.blue,
                border: `1px solid ${C.border}`,
              }}
            >
              {badge}
            </span>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
