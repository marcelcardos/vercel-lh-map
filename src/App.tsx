import { useState } from "react";
import LHMap from "./LHMap";
import DITDashboard from "./DITDashboard";

type Page = "lh-map" | "dit";

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: "lh-map", label: "LH Map", icon: "🗺️" },
  { id: "dit",    label: "LH DIT",  icon: "🔻" },
];

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    const hash = window.location.hash.replace("#", "") as Page;
    return NAV_ITEMS.find((n) => n.id === hash) ? hash : "lh-map";
  });

  const navigate = (p: Page) => {
    window.location.hash = p;
    setPage(p);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", background: "#0f0f1a" }}>
      {/* Top nav */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        background: "#1e1e2e", borderBottom: "2px solid #FFE600",
        padding: "0 16px", height: 40, flexShrink: 0, zIndex: 10000,
      }}>
        <span style={{ fontSize: 13, fontWeight: 900, color: "#FFE600", marginRight: 12, letterSpacing: ".05em" }}>CCO</span>
        {NAV_ITEMS.map((n) => (
          <button key={n.id} onClick={() => navigate(n.id)} style={{
            background: page === n.id ? "#FFE600" : "transparent",
            color: page === n.id ? "#1e1e2e" : "#94a3b8",
            border: "none", borderRadius: 4, padding: "4px 14px",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            letterSpacing: ".04em", display: "flex", alignItems: "center", gap: 6,
          }}>
            {n.icon} {n.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {page === "lh-map" && <LHMap />}
        {page === "dit"    && <DITDashboard />}
      </div>
    </div>
  );
}
