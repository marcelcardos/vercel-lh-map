import { useState, useEffect, useRef } from "react";
import { HTML_TEMPLATE } from "./html_template";
import { BQ_QUERY_LH_ROUTES, BQ_QUERY_LH_TRACKING } from "./lib/queries_lh";
import { runBigQuery } from "./lib/bq_client";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function LoadingScreen({ step, dots }: { step: 1 | 2; dots: number }) {
  const dotStr = ".".repeat(dots % 4);
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "#0f0f1a", color: "white", fontFamily: "Segoe UI, sans-serif", gap: 24,
    }}>
      <div style={{ fontSize: 44 }}>🗺️</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>Carregando mapa LH</div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 340 }}>
        {[
          { label: "Buscando rotas Line Haul", n: 1 },
          { label: "Buscando GPS tracking", n: 2 },
        ].map(({ label, n }) => {
          const done = n < step;
          const active = n === step;
          return (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: done ? "#22c55e" : active ? "#FFE600" : "#334155",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: done ? "white" : "#0f0f1a",
                transition: "background 0.3s",
              }}>
                {done ? "✓" : n}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 13, fontWeight: active ? 700 : 400,
                  color: done ? "#64748b" : active ? "#FFE600" : "#475569",
                }}>
                  {label}{active ? dotStr : ""}
                </div>
                {active && (
                  <div style={{
                    marginTop: 6, height: 4, background: "#1e293b", borderRadius: 99, overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", borderRadius: 99, background: "#FFE600",
                      width: "40%",
                      animation: "slide 1.4s ease-in-out infinite",
                    }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 11, color: "#334155", marginTop: 8 }}>
        Consultando BigQuery — pode levar alguns minutos
      </div>
    </div>
  );
}

export default function LHMap() {
  const [loading, setLoading]       = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [step, setStep]             = useState<1 | 2>(1);
  const [dots, setDots]             = useState(0);
  const [error, setError]           = useState<string | null>(null);
  const iframeRef      = useRef<HTMLIFrameElement>(null);
  const blobUrlRef     = useRef<string | null>(null);
  const lastDatesRef   = useRef<{ dateFrom: string; dateTo: string }>({ dateFrom: today(), dateTo: today() });

  // Animate dots while loading
  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setDots((d) => d + 1), 800);
    return () => clearInterval(id);
  }, [loading]);

  const refreshData = async () => {
    if (refreshing || loading || !iframeRef.current?.contentWindow) return;
    setRefreshing(true);
    try {
      const { dateFrom, dateTo } = lastDatesRef.current;
      const rows = await runBigQuery<Record<string, unknown>>(BQ_QUERY_LH_ROUTES(dateFrom, dateTo));
      const trackingRows = await runBigQuery<{ SHP_LG_ROUTE_ID: string; LAT: string; LNG: string; TS_HM: string; SPD: string; SEG: string }>(
        BQ_QUERY_LH_TRACKING(dateFrom, dateTo)
      ).catch(() => []);

      const trackingData: Record<string, unknown[]> = {};
      for (const p of trackingRows) {
        const rid = String(p.SHP_LG_ROUTE_ID);
        if (!trackingData[rid]) trackingData[rid] = [];
        trackingData[rid].push({
          lat: parseFloat(p.LAT), lng: parseFloat(p.LNG),
          ts: p.TS_HM, spd: parseFloat(p.SPD ?? "0"), seg: parseInt(p.SEG ?? "1"),
        });
      }

      const generatedAt = new Date().toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" }).slice(0, 16);
      iframeRef.current?.contentWindow?.postMessage(
        { type: "LH_DATA_UPDATE", routes: rows, tracking: trackingData, generatedAt },
        "*"
      );
    } catch {
      // silent — don't disrupt the UI on background refresh failure
    } finally {
      setRefreshing(false);
    }
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const id = setInterval(() => { refreshData(); }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMap = async (dateFrom: string, dateTo: string) => {
    lastDatesRef.current = { dateFrom, dateTo };
    setLoading(true);
    setStep(1);
    setDots(0);
    setError(null);
    try {
      const rows = await runBigQuery<Record<string, unknown>>(BQ_QUERY_LH_ROUTES(dateFrom, dateTo));

      setStep(2);
      const trackingRows = await runBigQuery<{ SHP_LG_ROUTE_ID: string; LAT: string; LNG: string; TS_HM: string; SPD: string; SEG: string }>(
        BQ_QUERY_LH_TRACKING(dateFrom, dateTo)
      ).catch(() => []); // tracking é opcional

      const trackingData: Record<string, unknown[]> = {};
      for (const p of trackingRows) {
        const rid = String(p.SHP_LG_ROUTE_ID);
        if (!trackingData[rid]) trackingData[rid] = [];
        trackingData[rid].push({
          lat: parseFloat(p.LAT),
          lng: parseFloat(p.LNG),
          ts:  p.TS_HM,
          spd: parseFloat(p.SPD ?? "0"),
          seg: parseInt(p.SEG ?? "1"),
        });
      }

      // sv-SE gives "YYYY-MM-DD HH:MM:SS" — .slice(11,16) in template extracts "HH:MM" correctly
      const generatedAt = new Date().toLocaleString("sv-SE", {
        timeZone: "America/Sao_Paulo",
      }).slice(0, 16);
      const html = HTML_TEMPLATE
        .replace("__DATA_JSON__",     JSON.stringify(rows))
        .replace("__INMET_JSON__",    "[]")
        .replace("__TRACKING_JSON__", JSON.stringify(trackingData))
        .replace("__GENERATED_AT__",  generatedAt);
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      const blob = new Blob([html], { type: "text/html; charset=utf-8" });
      const url  = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      if (iframeRef.current) iframeRef.current.src = url;
    } catch (err: any) {
      const msg: string = err.message || "";
      setError(
        msg.includes("VPC Service Controls") || msg.includes("403")
          ? "VPN_REQUIRED"
          : msg || "Erro ao carregar dados."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMap(today(), today());
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  // Reload when template requests different date range
  useEffect(() => {
    const handle = (e: MessageEvent) => {
      if (e.data?.type === "LH_RELOAD" && e.data.dateFrom && e.data.dateTo) {
        loadMap(e.data.dateFrom as string, e.data.dateTo as string);
      }
    };
    window.addEventListener("message", handle);
    return () => window.removeEventListener("message", handle);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#0f0f1a" }}>
      {loading && <LoadingScreen step={step} dots={dots} />}
      {error && !loading && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 9999,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: "rgba(30,30,46,0.95)", color: "white", fontFamily: "Segoe UI, sans-serif", padding: 32,
        }}>
          {error === "VPN_REQUIRED" ? (
            <>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#FFE600", marginBottom: 8 }}>VPN necessária</div>
              <div style={{ fontSize: 13, color: "#94a3b8", maxWidth: 400, textAlign: "center", lineHeight: 1.6 }}>
                Este dashboard consulta o BigQuery diretamente pelo browser.<br />
                Conecte a <strong style={{ color: "white" }}>VPN Meli</strong> e tente novamente.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#ef4444", marginBottom: 8 }}>Erro ao carregar dados</div>
              <div style={{ fontSize: 12, color: "#94a3b8", maxWidth: 500, textAlign: "center", wordBreak: "break-all" }}>{error}</div>
            </>
          )}
          <button onClick={() => loadMap(today(), today())} style={{
            marginTop: 20, background: "#FFE600", color: "#1e1e2e", border: "none",
            borderRadius: 6, padding: "8px 24px", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>Tentar novamente</button>
        </div>
      )}
      {/* Manual refresh button — always visible when map is loaded */}
      {!loading && !error && (
        <button
          onClick={refreshData}
          disabled={refreshing}
          title="Atualizar dados sem resetar filtros"
          style={{
            position: "absolute", top: 12, right: 12, zIndex: 1000,
            background: refreshing ? "#1e293b" : "#1e293b",
            border: "1px solid #334155", borderRadius: 8,
            color: refreshing ? "#64748b" : "#94a3b8",
            cursor: refreshing ? "default" : "pointer",
            padding: "6px 12px", fontSize: 12, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.2s",
          }}
        >
          <span style={{ display: "inline-block", animation: refreshing ? "spin 1s linear infinite" : "none" }}>🔄</span>
          {refreshing ? "Atualizando..." : "Atualizar dados"}
        </button>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <iframe
        ref={iframeRef}
        style={{ width: "100%", height: "100%", border: "none", display: loading ? "none" : "block" }}
        title="LH Map"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
