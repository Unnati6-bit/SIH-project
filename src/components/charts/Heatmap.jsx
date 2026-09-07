import React, { useMemo, useState } from "react";
import { C, FONT_MONO } from "../../theme.js";
import { HEATMAP, HEAT_DAYS, dateLabel } from "../../data/mockData.js";
import { heatColor } from "../../utils/colorUtils.js";
import Panel from "../ui/Panel.jsx";
import SectionHeader from "../ui/SectionHeader.jsx";

export default function Heatmap() {
  const [routeFilter, setRouteFilter] = useState("ALL");
  const [trendFilter, setTrendFilter] = useState("ALL");
  const [daysFilter, setDaysFilter] = useState(14);

  const filteredRoutes = useMemo(() => {
    return HEATMAP.filter((route) => {
      // Route filter
      if (
        routeFilter !== "ALL" &&
        route.code !== routeFilter
      ) {
        return false;
      }

      // Trend filter
      if (trendFilter !== "ALL") {
        const values = route.cells;

        if (trendFilter === "ABOVE") {
          return values.some((value) => value > 0);
        }

        if (trendFilter === "BELOW") {
          return values.some((value) => value < 0);
        }

        if (trendFilter === "AT") {
          return values.some((value) => value === 0);
        }
      }

      return true;
    });
  }, [routeFilter, trendFilter]);

  const visibleDays = Math.min(daysFilter, HEAT_DAYS);

  return (
    <div style={{ marginBottom: 44 }}>

      <SectionHeader
        eyebrow="Sector view"
        title="Route heatmap — last 14 days"
        note="Deviation from each route's 90-day mean fare. Amber = above trend, teal = below trend."
      />

      <Panel>

        {/* =========================
            FILTER BAR
        ========================= */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: `1px solid ${C.hairline}`,
          }}
        >

          {/* ROUTE FILTER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >

            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: C.textFaint,
              }}
            >
              ROUTE
            </span>

            <select
              value={routeFilter}
              onChange={(event) =>
                setRouteFilter(event.target.value)
              }
              style={selectStyle()}
            >

              <option value="ALL">
                All Routes
              </option>

              {HEATMAP.map((route) => (
                <option
                  key={route.code}
                  value={route.code}
                >
                  {route.code}
                </option>
              ))}

            </select>

          </div>


          {/* TREND FILTER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >

            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: C.textFaint,
              }}
            >
              TREND
            </span>

            <select
              value={trendFilter}
              onChange={(event) =>
                setTrendFilter(event.target.value)
              }
              style={selectStyle()}
            >

              <option value="ALL">
                All
              </option>

              <option value="ABOVE">
                Above Trend
              </option>

              <option value="BELOW">
                Below Trend
              </option>

              <option value="AT">
                At Trend
              </option>

            </select>

          </div>


          {/* DAYS FILTER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >

            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: C.textFaint,
              }}
            >
              PERIOD
            </span>

            <select
              value={daysFilter}
              onChange={(event) =>
                setDaysFilter(
                  Number(event.target.value)
                )
              }
              style={selectStyle()}
            >

              <option value={7}>
                Last 7 Days
              </option>

              <option value={14}>
                Last 14 Days
              </option>

            </select>

          </div>


          {/* RESET */}

          <button
            onClick={() => {
              setRouteFilter("ALL");
              setTrendFilter("ALL");
              setDaysFilter(14);
            }}
            style={resetButton()}
          >
            RESET
          </button>

        </div>


        {/* =========================
            HEATMAP
        ========================= */}

        <div
          className="apix-scroll"
          style={{
            overflowX: "auto",
          }}
        >

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                `140px repeat(${visibleDays}, 40px)`,

              gap: 4,

              minWidth:
                visibleDays === 14
                  ? 700
                  : 400,
            }}
          >

            {/* EMPTY TOP LEFT */}

            <div />


            {/* DATE HEADERS */}

            {Array.from(
              { length: visibleDays },
              (_, d) => (

                <div
                  key={d}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 9.5,
                    color: C.textFaint,
                    textAlign: "center",
                  }}
                >

                  {dateLabel(
                    -(visibleDays - 1) + d,
                    {
                      day: "2-digit",
                    }
                  )}

                </div>

              )
            )}


            {/* ROUTES */}

            {filteredRoutes.map((route) => (

              <React.Fragment
                key={route.code}
              >

                {/* ROUTE NAME */}

                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 12,
                    color: C.textMuted,

                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {route.code}
                </div>


                {/* HEAT CELLS */}

                {route.cells
                  .slice(-visibleDays)
                  .map((value, index) => (

                    <div
                      key={index}

                      title={`${route.code} · ${
                        value > 0 ? "+" : ""
                      }${value}%`}

                      style={{
                        height: 26,

                        background:
                          heatColor(value),

                        display: "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        fontFamily:
                          FONT_MONO,

                        fontSize: 9,

                        color:
                          Math.abs(value) > 14
                            ? C.bg
                            : C.textFaint,

                        cursor: "default",
                      }}
                    >

                      {value > 0
                        ? "+"
                        : ""}

                      {value}

                    </div>

                  ))}

              </React.Fragment>

            ))}

          </div>

        </div>


        {/* NO RESULT */}

        {filteredRoutes.length === 0 && (

          <div
            style={{
              padding: 30,
              textAlign: "center",
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: C.textFaint,
            }}
          >
            NO ROUTES MATCH THE SELECTED FILTER
          </div>

        )}


        {/* =========================
            LEGEND
        ========================= */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 16,

            fontFamily: FONT_MONO,
            fontSize: 10.5,
            color: C.textFaint,

            flexWrap: "wrap",
          }}
        >

          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >

            <span
              style={{
                width: 12,
                height: 12,
                background: C.teal,
                display: "inline-block",
              }}
            />

            BELOW TREND

          </span>


          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >

            <span
              style={{
                width: 12,
                height: 12,
                background: C.panelAlt,
                border:
                  `1px solid ${C.hairline}`,

                display: "inline-block",
              }}
            />

            AT TREND

          </span>


          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >

            <span
              style={{
                width: 12,
                height: 12,
                background: C.amber,
                display: "inline-block",
              }}
            />

            ABOVE TREND

          </span>

        </div>

      </Panel>

    </div>
  );
}


/* =========================
   SELECT STYLE
========================= */

const selectStyle = () => ({
  padding: "7px 10px",

  border:
    `1px solid ${C.border}`,

  background: C.bgAlt,

  color: C.text,

  fontFamily: FONT_MONO,

  fontSize: 10.5,

  outline: "none",

  cursor: "pointer",
});


/* =========================
   RESET BUTTON
========================= */

const resetButton = () => ({
  padding: "7px 10px",

  border:
    `1px solid ${C.border}`,

  background: "transparent",

  color: C.textMuted,

  fontFamily: FONT_MONO,

  fontSize: 10.5,

  cursor: "pointer",
});