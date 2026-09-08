import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./theme.js";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
    try {
      localStorage.removeItem("apix_theme");
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: "sans-serif", background: "#F8FAFC", color: "#0F172A", minHeight: "100vh" }}>
          <h2 style={{ color: "#E11D48" }}>Something went wrong while rendering the dashboard</h2>
          <pre style={{ background: "#F1F5F9", padding: 16, borderRadius: 8, overflowX: "auto" }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => {
              try { localStorage.clear(); } catch {}
              window.location.reload();
            }}
            style={{
              marginTop: 16,
              padding: "10px 18px",
              borderRadius: 8,
              background: "#1E40AF",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reset Settings &amp; Reload Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
