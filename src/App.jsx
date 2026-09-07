import React, { useState } from "react";
import { C, FONT_UI } from "./theme.js";

import Masthead from "./components/layout/Masthead.jsx";
import Ticker from "./components/layout/Ticker.jsx";
import Hero from "./components/layout/Hero.jsx";
import Footer from "./components/layout/Footer.jsx";

import TrendChart from "./components/charts/TrendChart.jsx";
import Heatmap from "./components/charts/Heatmap.jsx";
import ElasticityChart from "./components/charts/ElasticityChart.jsx";
import CarrierChart from "./components/charts/CarrierChart.jsx";

import QuotesTable from "./components/quotes/QuotesTable.jsx";
import AdminPanel from "./components/AdminPanel.jsx";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  // Open Admin Panel
  if (isAdmin) {
    return (
      <AdminPanel
        onBack={() => setIsAdmin(false)}
      />
    );
  }

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        color: C.text,
        fontFamily: FONT_UI,
        padding: "0 0 40px 0",
      }}
    >

      {/* HEADER */}
      <Masthead
        onAdmin={() => setIsAdmin(true)}
      />

      {/* TOP TICKER */}
      <Ticker />

      {/* MAIN CONTENT */}
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "32px 24px 0",
        }}
      >

        {/* HERO */}
        <Hero />

        {/* PRICE TREND */}
        <TrendChart />

        {/* ROUTE HEATMAP */}
        <Heatmap />

        {/* ELASTICITY + CARRIER */}
        <div
          className="apix-two-col"
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: 24,
            marginBottom: 44,
          }}
        >
          <ElasticityChart />
          <CarrierChart />
        </div>

        {/* QUOTES */}
        <QuotesTable />

      </div>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}