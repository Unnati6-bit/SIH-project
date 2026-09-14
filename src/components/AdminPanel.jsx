import React, { useMemo, useState } from "react";

import {
  ArrowLeft,
  BarChart3,
  Database,
  Download,
  FileText,
  Gauge,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";

import { useTheme, C, FONT_DISPLAY, FONT_MONO, FONT_UI } from "../theme.js";

import {
  CARRIERS,
  QUOTES,
  ROUTES,
} from "../data/mockData.js";

import Panel from "./ui/Panel.jsx";
import Eyebrow from "./ui/Eyebrow.jsx";


/* =========================
   INITIAL ROUTES
========================= */

const initialRoutes = ROUTES.map((route) => ({
  ...route,
}));


/* =========================
   ADMIN PANEL
========================= */

export default function AdminPanel({ onBack }) {
  const { C } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  const [routes, setRoutes] = useState(initialRoutes);

  const [status, setStatus] = useState("System healthy");

  const [showAdd, setShowAdd] = useState(false);

  const [newRoute, setNewRoute] = useState({
    code: "",
    name: "",
    base: "",
  });


  /* =========================
     TOTAL BASE FARE
  ========================= */

  const totalBase = useMemo(() => {

    return routes.reduce(
      (sum, route) => sum + Number(route.base || 0),
      0
    );

  }, [routes]);


  /* =========================
     ADMIN TABS
  ========================= */

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: Gauge,
    },

    {
      id: "routes",
      label: "Routes",
      icon: BarChart3,
    },

    {
      id: "quotes",
      label: "Quote Feed",
      icon: Database,
    },

    {
      id: "users",
      label: "Users",
      icon: Users,
    },

    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];


  /* =========================
     ADD ROUTE
  ========================= */

  const addRoute = () => {

    if (
      !newRoute.code ||
      !newRoute.name ||
      !newRoute.base
    ) {
      return;
    }

    const routeToAdd = {
      code: newRoute.code.toUpperCase(),
      name: newRoute.name,
      base: Number(newRoute.base),
      vol: 0.12,
      weight: 0.05,
    };

    setRoutes((previousRoutes) => [
      ...previousRoutes,
      routeToAdd,
    ]);

    setNewRoute({
      code: "",
      name: "",
      base: "",
    });

    setShowAdd(false);

    setStatus("Route added successfully");
  };


  /* =========================
     DELETE ROUTE
  ========================= */

  const deleteRoute = (code) => {

    setRoutes((previousRoutes) =>
      previousRoutes.filter(
        (route) => route.code !== code
      )
    );

    setStatus(`Removed ${code}`);
  };


  /* =========================
     REFRESH FEED
  ========================= */

  const refreshFeed = () => {

    setStatus("Quote feed refreshed just now");

    setTimeout(() => {
      setStatus("System healthy");
    }, 1800);
  };


  /* =========================
     BACK TO MAIN WEBSITE
  ========================= */

  const goBackToWebsite = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = "/";
    }
  };


  /* =========================
     MAIN UI
  ========================= */

  return (

    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: FONT_UI,
      }}
    >

      {/* =========================
          HEADER
      ========================= */}

      <div
        style={{
          borderBottom: `1px solid ${C.hairline}`,
          background: C.bgAlt,
        }}
      >

        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "18px 24px",
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >

            {/* LEFT SIDE */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >

              {/* BACK BUTTON */}

              <button
                onClick={goBackToWebsite}
                style={iconButton()}
                title="Back to website"
              >
                <ArrowLeft size={17} />
              </button>


              {/* TITLE */}

              <div>

                <Eyebrow>
                  Restricted workspace
                </Eyebrow>

                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  APIx Admin Panel
                </div>

              </div>

            </div>


            {/* ADMIN STATUS */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: C.teal,
              }}
            >

              <ShieldCheck size={15} />

              ADMIN SESSION ·{" "}
              {status.toUpperCase()}

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          CONTENT
      ========================= */}

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "24px",
        }}
      >

        <div
          className="apix-admin-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: 24,
          }}
        >


          {/* =========================
              SIDEBAR
          ========================= */}

          <Panel
            style={{
              padding: 10,
              alignSelf: "start",
            }}
          >

            {tabs.map(
              ({ id, label, icon: Icon }) => (

                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "11px 12px",
                    marginBottom: 4,

                    border: "none",

                    borderLeft:
                      activeTab === id
                        ? `2px solid ${C.amber}`
                        : "2px solid transparent",

                    background:
                      activeTab === id
                        ? C.panelAlt
                        : "transparent",

                    color:
                      activeTab === id
                        ? C.text
                        : C.textMuted,

                    fontFamily: FONT_UI,
                    fontSize: 13,

                    cursor: "pointer",

                    textAlign: "left",
                  }}
                >

                  <Icon size={16} />

                  {label}

                </button>

              )
            )}

          </Panel>


          {/* =========================
              RIGHT CONTENT
          ========================= */}

          <div>


            {/* =========================
                OVERVIEW
            ========================= */}

            {activeTab === "overview" && (

              <>

                <SectionTitle
                  eyebrow="Control room"
                  title="Dashboard overview"
                  note="Monitor the index pipeline and the latest fare collection activity."
                />


                {/* STATS */}

                <div
                  className="apix-admin-stats"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(4, 1fr)",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >

                  <AdminStat
                    label="Routes"
                    value={routes.length}
                  />

                  <AdminStat
                    label="Carriers"
                    value={CARRIERS.length}
                  />

                  <AdminStat
                    label="Quotes / batch"
                    value={QUOTES.length}
                  />

                  <AdminStat
                    label="Pipeline"
                    value="LIVE"
                    good
                  />

                </div>


                {/* PIPELINE + QUICK ACTIONS */}

                <div
                  className="apix-two-col"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1.3fr 1fr",
                    gap: 16,
                  }}
                >

                  {/* PIPELINE */}

                  <Panel>

                    <SectionTitle
                      eyebrow="Pipeline"
                      title="Data collection"
                    />

                    <PipelineRow
                      label="Fare collectors"
                      value="7 / 7 online"
                      progress={100}
                    />

                    <PipelineRow
                      label="Quote validation"
                      value="98.7%"
                      progress={98.7}
                    />

                    <PipelineRow
                      label="Index calculation"
                      value="Ready"
                      progress={100}
                    />

                    <PipelineRow
                      label="API publication"
                      value="Healthy"
                      progress={100}
                    />

                    <button
                      onClick={refreshFeed}
                      style={primaryButton()}
                    >

                      <RefreshCw size={15} />

                      Refresh feed

                    </button>

                  </Panel>


                  {/* QUICK ACTIONS */}

                  <Panel>

                    <SectionTitle
                      eyebrow="Quick actions"
                      title="Administration"
                    />

                    <QuickAction
                      icon={Download}
                      label="Export latest quotes"
                      onClick={() =>
                        setStatus(
                          "CSV export prepared"
                        )
                      }
                    />

                    <QuickAction
                      icon={FileText}
                      label="Generate methodology report"
                      onClick={() =>
                        setStatus(
                          "Report generation started"
                        )
                      }
                    />

                    <QuickAction
                      icon={RefreshCw}
                      label="Run index pipeline"
                      onClick={() =>
                        setStatus(
                          "Index pipeline queued"
                        )
                      }
                    />

                  </Panel>

                </div>

              </>

            )}


            {/* =========================
                ROUTES
            ========================= */}

            {activeTab === "routes" && (

              <>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    gap: 12,
                    marginBottom: 18,
                    flexWrap: "wrap",
                  }}
                >

                  <SectionTitle
                    eyebrow="Reference data"
                    title="Route management"
                    note={`${routes.length} routes · average base ₹${Math.round(
                      totalBase /
                        Math.max(
                          routes.length,
                          1
                        )
                    ).toLocaleString("en-IN")}`}
                  />


                  <button
                    onClick={() =>
                      setShowAdd(true)
                    }
                    style={primaryButton()}
                  >

                    <Plus size={15} />

                    Add route

                  </button>

                </div>


                <Panel
                  style={{
                    padding: 0,
                  }}
                >

                  <div
                    className="apix-scroll"
                    style={{
                      overflowX: "auto",
                    }}
                  >

                    <table
                      style={{
                        width: "100%",
                        borderCollapse:
                          "collapse",
                        minWidth: 650,
                      }}
                    >

                      <thead>

                        <tr
                          style={{
                            borderBottom:
                              `1px solid ${C.hairline}`,
                          }}
                        >

                          {[
                            "Route",
                            "Name",
                            "Base fare",
                            "Volatility",
                            "Weight",
                            "",
                          ].map((heading) => (

                            <th
                              key={heading}
                              style={thStyle()}
                            >
                              {heading}
                            </th>

                          ))}

                        </tr>

                      </thead>


                      <tbody>

                        {routes.map((route) => (

                          <tr
                            key={route.code}
                            style={{
                              borderBottom:
                                `1px solid ${C.hairline}`,
                            }}
                          >

                            <td
                              style={tdStyle(true)}
                            >
                              {route.code}
                            </td>

                            <td
                              style={tdStyle()}
                            >
                              {route.name}
                            </td>

                            <td
                              style={tdStyle(true)}
                            >
                              ₹
                              {Number(
                                route.base
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            <td
                              style={tdStyle(true)}
                            >
                              {route.vol}
                            </td>

                            <td
                              style={tdStyle(true)}
                            >
                              {route.weight}
                            </td>

                            <td
                              style={{
                                padding:
                                  "10px 16px",
                                textAlign:
                                  "right",
                              }}
                            >

                              <button
                                onClick={() =>
                                  deleteRoute(
                                    route.code
                                  )
                                }
                                style={dangerButton()}
                                title="Delete route"
                              >

                                <Trash2
                                  size={14}
                                />

                              </button>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                </Panel>

              </>

            )}


            {/* =========================
                QUOTES
            ========================= */}

            {activeTab === "quotes" && (

              <>

                <SectionTitle
                  eyebrow="Monitoring"
                  title="Quote feed"
                  note="Latest captured records available to the index pipeline."
                />


                <Panel
                  style={{
                    padding: 0,
                  }}
                >

                  <div
                    className="apix-scroll"
                    style={{
                      overflowX: "auto",
                    }}
                  >

                    <table
                      style={{
                        width: "100%",
                        borderCollapse:
                          "collapse",
                        minWidth: 780,
                      }}
                    >

                      <thead>

                        <tr
                          style={{
                            borderBottom:
                              `1px solid ${C.hairline}`,
                          }}
                        >

                          {[
                            "Captured",
                            "Route",
                            "Carrier",
                            "Source",
                            "Total",
                            "Seats",
                          ].map((heading) => (

                            <th
                              key={heading}
                              style={thStyle()}
                            >
                              {heading}
                            </th>

                          ))}

                        </tr>

                      </thead>


                      <tbody>

                        {QUOTES.map((quote) => (

                          <tr
                            key={quote.id}
                            style={{
                              borderBottom:
                                `1px solid ${C.hairline}`,
                            }}
                          >

                            <td
                              style={tdStyle(true)}
                            >
                              {quote.minsAgo}m ago
                            </td>

                            <td
                              style={tdStyle(true)}
                            >
                              {quote.route}
                            </td>

                            <td
                              style={tdStyle()}
                            >
                              {quote.carrier}
                            </td>

                            <td
                              style={tdStyle()}
                            >
                              {quote.source}
                            </td>

                            <td
                              style={{
                                ...tdStyle(true),
                                color: C.amber,
                              }}
                            >
                              ₹
                              {quote.total.toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            <td
                              style={{
                                ...tdStyle(true),
                                color:
                                  quote.avail === 0
                                    ? C.rust
                                    : C.teal,
                              }}
                            >

                              {quote.avail === 0
                                ? "SOLD OUT"
                                : quote.avail}

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                </Panel>

              </>

            )}


            {/* =========================
                USERS
            ========================= */}

            {activeTab === "users" && (

              <>

                <SectionTitle
                  eyebrow="Access control"
                  title="Admin users"
                />

                <Panel>

                  {[
                    [
                      "Admin",
                      "Super administrator",
                      "Active",
                    ],

                    [
                      "Data Analyst",
                      "Index & quote monitoring",
                      "Active",
                    ],

                    [
                      "Research Desk",
                      "Read-only access",
                      "Active",
                    ],
                  ].map(
                    ([name, role, state]) => (

                      <div
                        key={name}
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          padding: "15px 0",
                          borderBottom:
                            `1px solid ${C.hairline}`,
                          gap: 16,
                        }}
                      >

                        <div>

                          <div
                            style={{
                              color: C.text,
                              fontWeight: 600,
                            }}
                          >
                            {name}
                          </div>

                          <div
                            style={{
                              color:
                                C.textFaint,
                              fontSize: 12,
                            }}
                          >
                            {role}
                          </div>

                        </div>


                        <span
                          style={{
                            fontFamily:
                              FONT_MONO,
                            fontSize: 11,
                            color: C.teal,
                          }}
                        >
                          {state}
                        </span>

                      </div>

                    )
                  )}

                </Panel>

              </>

            )}


            {/* =========================
                SETTINGS
            ========================= */}

            {activeTab === "settings" && (

              <>

                <SectionTitle
                  eyebrow="System configuration"
                  title="Settings"
                />

                <Panel>

                  <Setting
                    label="Automatic quote refresh"
                    value="Every 15 minutes"
                  />

                  <Setting
                    label="Index publication"
                    value="Daily at 18:00 IST"
                  />

                  <Setting
                    label="API rate limit"
                    value="120 requests / minute"
                  />

                  <Setting
                    label="Environment"
                    value="Prototype / Mock data"
                  />

                </Panel>

              </>

            )}

          </div>

        </div>

      </div>


      {/* =========================
          ADD ROUTE MODAL
      ========================= */}

      {showAdd && (

        <div style={modalBackdrop()}>

          <Panel
            style={{
              width:
                "min(460px, calc(100vw - 32px))",
              padding: 24,
              boxShadow:
                "0 20px 70px rgba(0,0,0,.45)",
            }}
          >

            <SectionTitle
              eyebrow="Reference data"
              title="Add new route"
            />


            {[
              [
                "code",
                "Route code",
                "DEL-GOI",
              ],

              [
                "name",
                "Route name",
                "Delhi → Goa",
              ],

              [
                "base",
                "Base fare",
                "5200",
              ],

            ].map(
              ([key, label, placeholder]) => (

                <label
                  key={key}
                  style={{
                    display: "block",
                    marginBottom: 14,
                    fontSize: 12,
                    color: C.textMuted,
                  }}
                >

                  {label}

                  <input
                    value={newRoute[key]}
                    placeholder={placeholder}
                    onChange={(event) =>
                      setNewRoute({
                        ...newRoute,
                        [key]:
                          event.target.value,
                      })
                    }
                    style={inputStyle()}
                  />

                </label>

              )
            )}


            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >

              <button
                onClick={() =>
                  setShowAdd(false)
                }
                style={secondaryButton()}
              >
                Cancel
              </button>

              <button
                onClick={addRoute}
                style={primaryButton()}
              >
                Add route
              </button>

            </div>

          </Panel>

        </div>

      )}

    </div>

  );
}


/* =========================
   SECTION TITLE
========================= */

function SectionTitle({
  eyebrow,
  title,
  note,
}) {

  return (

    <div
      style={{
        marginBottom: 18,
      }}
    >

      <Eyebrow>
        {eyebrow}
      </Eyebrow>

      <div
        style={{
          fontFamily:
            FONT_DISPLAY,
          fontSize: 22,
          fontWeight: 600,
        }}
      >
        {title}
      </div>

      {note && (

        <div
          style={{
            marginTop: 5,
            color: C.textMuted,
            fontSize: 12,
          }}
        >
          {note}
        </div>

      )}

    </div>

  );
}


/* =========================
   ADMIN STAT
========================= */

function AdminStat({
  label,
  value,
  good,
}) {

  return (

    <Panel
      style={{
        padding: 16,
      }}
    >

      <Eyebrow>
        {label}
      </Eyebrow>

      <div
        style={{
          marginTop: 4,
          fontFamily: FONT_MONO,
          fontSize: 23,
          fontWeight: 600,
          color: good
            ? C.teal
            : C.text,
        }}
      >
        {value}
      </div>

    </Panel>

  );
}


/* =========================
   PIPELINE ROW
========================= */

function PipelineRow({
  label,
  value,
  progress,
}) {

  return (

    <div
      style={{
        marginBottom: 16,
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          fontSize: 12,
          marginBottom: 6,
        }}
      >

        <span
          style={{
            color: C.textMuted,
          }}
        >
          {label}
        </span>

        <span
          style={{
            fontFamily: FONT_MONO,
            color: C.text,
          }}
        >
          {value}
        </span>

      </div>


      <div
        style={{
          height: 5,
          background: C.bgAlt,
        }}
      >

        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background:
              progress < 100
                ? C.amber
                : C.teal,
          }}
        />

      </div>

    </div>

  );
}


/* =========================
   QUICK ACTION
========================= */

function QuickAction({
  icon: Icon,
  label,
  onClick,
}) {

  return (

    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "13px 0",
        border: "none",
        borderBottom:
          `1px solid ${C.hairline}`,
        background: "transparent",
        color: C.textMuted,
        fontFamily: FONT_UI,
        textAlign: "left",
        cursor: "pointer",
      }}
    >

      <Icon
        size={16}
        color={C.amber}
      />

      {label}

    </button>

  );

}


/* =========================
   SETTINGS
========================= */

function Setting({
  label,
  value,
}) {

  return (

    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        padding: "15px 0",
        borderBottom:
          `1px solid ${C.hairline}`,
        gap: 16,
      }}
    >

      <span
        style={{
          color: C.textMuted,
          fontSize: 13,
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 12,
          color: C.text,
        }}
      >
        {value}
      </span>

    </div>

  );

}


/* =========================
   TABLE STYLES
========================= */

const thStyle = () => ({

  textAlign: "left",

  padding: "11px 16px",

  fontFamily: FONT_MONO,

  fontSize: 10.5,

  color: C.textFaint,

  fontWeight: 500,

});


const tdStyle = (mono = false) => ({

  padding: "11px 16px",

  fontFamily:
    mono
      ? FONT_MONO
      : FONT_UI,

  fontSize: 12.5,

  color: C.textMuted,

});


/* =========================
   BUTTON STYLES
========================= */

const iconButton = (theme = C) => ({
  width: 38,
  height: 38,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: `1px solid ${theme.border}`,
  borderRadius: 10, // Smooth rounded icon button
  background: theme.panel,
  color: theme.text,
  cursor: "pointer",
  transition: "all 0.15s ease",
});

const primaryButton = (theme = C) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  border: `1px solid ${theme.amber}`,
  borderRadius: 8, // Smooth rounded button
  background: theme.amber,
  color: "#FFFFFF",
  padding: "9px 15px",
  fontFamily: FONT_MONO,
  fontSize: 11.5,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.15s ease",
});

const secondaryButton = (theme = C) => ({
  border: `1px solid ${theme.border}`,
  borderRadius: 8, // Smooth rounded button
  background: "transparent",
  color: theme.textMuted,
  padding: "9px 15px",
  fontFamily: FONT_MONO,
  fontSize: 11.5,
  cursor: "pointer",
  transition: "all 0.15s ease",
});

const dangerButton = (theme = C) => ({
  border: `1px solid ${theme.rust}`,
  borderRadius: 8, // Smooth rounded button
  background: "transparent",
  color: theme.rust,
  padding: 7,
  cursor: "pointer",
  transition: "all 0.15s ease",
});

const inputStyle = (theme = C) => ({
  width: "100%",
  marginTop: 6,
  padding: "10px 12px",
  border: `1px solid ${theme.border}`,
  borderRadius: 8, // Smooth rounded inputs
  background: theme.bgAlt,
  color: theme.text,
  outline: "none",
  fontFamily: FONT_MONO,
  fontSize: 12,
});


/* =========================
   MODAL BACKDROP
========================= */

function modalBackdrop() {

  return {

    position: "fixed",

    inset: 0,

    background:
      "rgba(0,0,0,.62)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    zIndex: 100,

  };

}