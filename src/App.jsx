import React, { useState } from "react";
import { useTheme, FONT_UI } from "./theme.js";

import Sidebar from "./components/layout/Sidebar.jsx";
import TopNav from "./components/layout/TopNav.jsx";
import Ticker from "./components/layout/Ticker.jsx";
import Hero from "./components/layout/Hero.jsx";
import Footer from "./components/layout/Footer.jsx";

import TrendChart from "./components/charts/TrendChart.jsx";
import BacktestChart from "./components/charts/BacktestChart.jsx";
import Heatmap from "./components/charts/Heatmap.jsx";
import ElasticityChart from "./components/charts/ElasticityChart.jsx";
import CarrierChart from "./components/charts/CarrierChart.jsx";
import FareComponentsChart from "./components/charts/FareComponentsChart.jsx";
import IntradaySurgeChart from "./components/charts/IntradaySurgeChart.jsx";
import OtaMarkupChart from "./components/charts/OtaMarkupChart.jsx";
import SeasonalIndexChart from "./components/charts/SeasonalIndexChart.jsx";

import MethodologyPanel from "./components/methodology/MethodologyPanel.jsx";
import QuotesTable from "./components/quotes/QuotesTable.jsx";
import ApiPanel from "./components/methodology/ApiPanel.jsx";
import ReportsPanel from "./components/methodology/ReportsPanel.jsx";
import AdminPanel from "./components/AdminPanel.jsx";

import ForecastPanel from "./components/charts/ForecastPanel.jsx";
import RouteComparison from "./components/charts/RouteComparison.jsx";

export default function App() {
  const { C } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("tab"); // "tab" or "all"
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If Admin panel is open
  if (isAdmin) {
    return (
      <AdminPanel
        onBack={() => setIsAdmin(false)}
      />
    );
  }

  return (
    <div
      className="apix-app-layout"
      style={{
        display: "flex",
        background: C.bg,
        minHeight: "100vh",
        color: C.text,
        fontFamily: FONT_UI,
        position: "relative",
      }}
    >
      {/* 1. WEB3 SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAdmin={() => setIsAdmin(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: C.bg,
        }}
      >
        {/* Sleek Glassmorphic Top Navigation */}
        <TopNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onAdmin={() => setIsAdmin(true)}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Real-time Ticker Tape */}
        <Ticker />

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            padding: "24px 28px 48px",
            maxWidth: 1280,
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {viewMode === "tab" ? (
            /* FOCUSED WEB3 TABBED VIEW: DECLUTTERED & FLUID */
            <div key={activeTab} className="apix-fade-in">
              {activeTab === "overview" && (
                <>
                  <Hero />
                  <section id="trend" style={{ marginTop: 24 }}>
                    <TrendChart />
                  </section>
                  <section id="intraday" style={{ marginTop: 24 }}>
                    <IntradaySurgeChart />
                  </section>
                  <section id="seasonal" style={{ marginTop: 24 }}>
                    <SeasonalIndexChart />
                  </section>
                </>
              )}

              {activeTab === "backtest" && (
                <section id="backtest">
                  <BacktestChart />
                  <div style={{ marginTop: 28 }}>
                    <SeasonalIndexChart />
                  </div>
                </section>
              )}

              {activeTab === "heatmap" && (
                <section id="heatmap">
                  <Heatmap />
                </section>
              )}

              {activeTab === "elasticity" && (
                <section id="elasticity" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                  <div
                    className="apix-two-col"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.3fr 1fr",
                      gap: 24,
                    }}
                  >
                    <ElasticityChart />
                    <CarrierChart />
                  </div>
                  <FareComponentsChart />
                  <OtaMarkupChart />
                </section>
              )}

              {activeTab === "forecast" && (
                <section id="forecast">
                  <ForecastPanel />
                </section>
              )}

              {activeTab === "compare" && (
                <section id="compare">
                  <RouteComparison />
                </section>
              )}

              {activeTab === "reports" && (
                <section id="reports">
                  <ReportsPanel />
                </section>
              )}

              {activeTab === "methodology" && (
                <section id="methodology">
                  <MethodologyPanel />
                </section>
              )}

              {activeTab === "quotes" && (
                <section id="quotes">
                  <QuotesTable />
                </section>
              )}

              {activeTab === "api" && (
                <section id="api">
                  <ApiPanel />
                </section>
              )}
            </div>
          ) : (
            /* ALL-IN-ONE REPORT VIEW: SMOOTH SEQUENTIAL SCROLL */
            <div className="apix-fade-in" style={{ display: "flex", flexDirection: "column", gap: 36 }}>
              <Hero />

              <section id="trend">
                <TrendChart />
              </section>

              <section id="intraday">
                <IntradaySurgeChart />
              </section>

              <section id="seasonal">
                <SeasonalIndexChart />
              </section>

              <section id="backtest">
                <BacktestChart />
              </section>

              <section id="heatmap">
                <Heatmap />
              </section>

              <section id="elasticity">
                <div
                  className="apix-two-col"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.3fr 1fr",
                    gap: 24,
                    marginBottom: 24,
                  }}
                >
                  <ElasticityChart />
                  <CarrierChart />
                </div>
                <FareComponentsChart />
                <OtaMarkupChart />
              </section>

              <section id="methodology">
                <MethodologyPanel />
              </section>

              <section id="quotes">
                <QuotesTable />
              </section>

              <section id="api">
                <ApiPanel />
              </section>

              <section id="forecast">
                <ForecastPanel />
              </section>

              <section id="compare">
                <RouteComparison />
              </section>

              <section id="reports">
                <ReportsPanel />
              </section>
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}