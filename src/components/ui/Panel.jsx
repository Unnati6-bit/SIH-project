import React from "react";
import { C } from "../../theme.js";

export default function Panel({ children, style }) {
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.hairline}`,
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
