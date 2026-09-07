import React from "react";
import { C } from "../../theme.js";
import FlapDigit from "./FlapDigit.jsx";

export default function FlapBoard({ value }) {
  const chars = value.toFixed(1).split("");
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {chars.map((ch, i) =>
        ch === "." ? (
          <div key={i} style={{ width: 14, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6 }}>
            <div style={{ width: 6, height: 6, background: C.amber, borderRadius: 1 }} />
          </div>
        ) : (
          <FlapDigit key={i} char={ch} />
        )
      )}
    </div>
  );
}
