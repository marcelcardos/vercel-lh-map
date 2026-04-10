import { useState, useEffect, useRef } from "react";
import { HTML_TEMPLATE } from "./html_template";
import { BQ_QUERY_LH_ROUTES, BQ_QUERY_LH_TRACKING } from "./lib/queries_lh";
import { runBigQuery } from "./lib/bq_client";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function LoadingScreen({ step, dots, progress }: { step: 1 | 2; dots: number; progress: number }) {
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
              <div style={{
                fontSize: 13, fontWeight: active ? 700 : 400,
                color: done ? "#64748b" : active ? "#FFE600" : "#475569",
              }}>
                {label}{active ? dotStr : ""}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar global */}
      <div style={{ width: 340, height: 4, background: "#1e293b", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: progress >= 100 ? "#22c55e" : "#FFE600",
          width: `${progress}%`,
          transition: progress >= 100 ? "width 0.3s ease-in, background 0.3s" : "width 0.25s ease-out",
        }} />
      </div>

      <div style={{ fontSize: 11, color: "#334155", marginTop: -8 }}>
        Consultando BigQuery — pode levar alguns minutos
      </div>
    </div>
  );
}

export default function LHMap() {
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep]         = useState<1 | 2>(1);
  const [dots, setDots]         = useState(0);
  const [error, setError]       = useState<string | null>(null);
  const iframeRef      = useRef<HTMLIFrameElement>(null);
  const blobUrlRef     = useRef<string | null>(null);
  const lastDatesRef   = useRef<{ dateFrom: string; dateTo: string }>({ dateFrom: today(), dateTo: today() });
  const refreshingRef  = useRef(false);
  const cacheRef       = useRef<Map<string, { rows: Record<string, unknown>[]; tracking: Record<string, unknown[]>; generatedAt: string }>>(new Map());

  // Animate dots while loading
  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setDots((d) => d + 1), 800);
    return () => clearInterval(id);
  }, [loading]);

  // Fake progress: crawls asymptotically toward 88%, then jumps to 100% on complete
  useEffect(() => {
    if (!loading) { setProgress(0); return; }
    setProgress(0);
    const id = setInterval(() => setProgress((p) => p < 88 ? p + (88 - p) * 0.025 : p), 200);
    return () => clearInterval(id);
  }, [loading]);

  const buildTrackingMap = (trackingRows: { SHP_LG_ROUTE_ID: string; LAT: string; LNG: string; TS_HM: string; SPD: string; SEG: string }[]) => {
    const m: Record<string, unknown[]> = {};
    for (const p of trackingRows) {
      const rid = String(p.SHP_LG_ROUTE_ID);
      if (!m[rid]) m[rid] = [];
      m[rid].push({ lat: parseFloat(p.LAT), lng: parseFloat(p.LNG), ts: p.TS_HM, spd: parseFloat(p.SPD ?? "0"), seg: parseInt(p.SEG ?? "1") });
    }
    return m;
  };

  const prefetchPastDays = async () => {
    const base = new Date();
    for (let i = 1; i <= 5; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      if (cacheRef.current.has(dateStr)) continue;
      try {
        const rows = await runBigQuery<Record<string, unknown>>(BQ_QUERY_LH_ROUTES(dateStr, dateStr));
        const trackingRows = await runBigQuery<{ SHP_LG_ROUTE_ID: string; LAT: string; LNG: string; TS_HM: string; SPD: string; SEG: string }>(
          BQ_QUERY_LH_TRACKING(dateStr, dateStr)
        ).catch(() => []);
        const generatedAt = new Date().toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" }).slice(0, 16);
        cacheRef.current.set(dateStr, { rows, tracking: buildTrackingMap(trackingRows), generatedAt });
      } catch { /* prefetch silencioso */ }
    }
  };

  const refreshData = async () => {
    if (refreshingRef.current || loading || !iframeRef.current?.contentWindow) return;
    refreshingRef.current = true;
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

      const tableUpd2 = rows.length > 0 ? String((rows[0] as Record<string, unknown>).TABLE_LAST_UPD ?? "") : "";
      const generatedAt = tableUpd2.length >= 16
        ? tableUpd2.slice(0, 16)
        : new Date().toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" }).slice(0, 16);
      iframeRef.current?.contentWindow?.postMessage(
        { type: "LH_DATA_UPDATE", routes: rows, tracking: trackingData, generatedAt,
          loadedFrom: dateFrom, loadedTo: dateTo },
        "*"
      );
    } catch {
      // silent — don't disrupt UI on background refresh failure
      // Re-enable the template button even on failure
      iframeRef.current?.contentWindow?.postMessage({ type: "LH_DATA_UPDATE" }, "*");
    } finally {
      refreshingRef.current = false;
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

      const trackingData = buildTrackingMap(trackingRows);

      // Use MAX(AUD_UPD_DTTM) from the table — shows when the pipeline last ran, not when browser fetched
      const tableUpd = rows.length > 0 ? String((rows[0] as Record<string, unknown>).TABLE_LAST_UPD ?? "") : "";
      const generatedAt = tableUpd.length >= 16
        ? tableUpd.slice(0, 16)   // BQ returns "YYYY-MM-DD HH:MM:SS"
        : new Date().toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" }).slice(0, 16);

      // Cache this result for instant date switching
      if (dateFrom === dateTo) cacheRef.current.set(dateFrom, { rows, tracking: trackingData, generatedAt });

      const html = HTML_TEMPLATE
        .replace("__DATA_JSON__",     JSON.stringify(rows))
        .replace("__INMET_JSON__",    "[]")
        .replace("__TRACKING_JSON__", JSON.stringify(trackingData))
        .replace("__GENERATED_AT__",  generatedAt)
        .replace("__LOADED_FROM__",   dateFrom)
        .replace("__LOADED_TO__",     dateTo);
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
      setProgress(100);
      await new Promise((r) => setTimeout(r, 380));
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMap(today(), today()).then(() => prefetchPastDays());
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle messages from the template iframe
  useEffect(() => {
    const handle = (e: MessageEvent) => {
      if (e.data?.type === "LH_RELOAD" && e.data.dateFrom && e.data.dateTo) {
        const { dateFrom, dateTo } = e.data as { dateFrom: string; dateTo: string };
        // Single-day: try cache first → instant, no loading screen
        if (dateFrom === dateTo && cacheRef.current.has(dateFrom) && iframeRef.current?.contentWindow) {
          const cached = cacheRef.current.get(dateFrom)!;
          lastDatesRef.current = { dateFrom, dateTo };
          iframeRef.current.contentWindow.postMessage(
            { type: "LH_DATA_UPDATE", routes: cached.rows, tracking: cached.tracking, generatedAt: cached.generatedAt },
            "*"
          );
        } else {
          loadMap(dateFrom, dateTo);
        }
      } else if (e.data?.type === "LH_REFRESH") {
        refreshData();
      }
    };
    window.addEventListener("message", handle);
    return () => window.removeEventListener("message", handle);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#0f0f1a" }}>
      {loading && <LoadingScreen step={step} dots={dots} progress={progress} />}
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
      <iframe
        ref={iframeRef}
        style={{ width: "100%", height: "100%", border: "none", display: loading ? "none" : "block" }}
        title="LH Map"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
