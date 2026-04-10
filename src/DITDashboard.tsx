import { useState, useEffect, useRef } from "react";
import { HTML_TEMPLATE_DIT } from "./html_template_dit";
import { BQ_QUERY_DIT_ROUTES, BQ_QUERY_DIT_SHIPMENTS, BQ_QUERY_DIT_STEPS } from "./lib/queries_dit";
import { runBigQuery } from "./lib/bq_client";

const DIT_META_PERC = 0.43;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function LoadingScreen({ step, dots }: { step: 1 | 2 | 3; dots: number }) {
  const dotStr = ".".repeat(dots % 4);
  const steps = [
    { label: "Buscando rotas LH DIT", n: 1 },
    { label: "Buscando shipments DIT", n: 2 },
    { label: "Buscando steps LH", n: 3 },
  ];
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "#0f0f1a", color: "white", fontFamily: "Segoe UI, sans-serif", gap: 24,
    }}>
      <div style={{ fontSize: 44 }}>🔻</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>Carregando LH DIT</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 340 }}>
        {steps.map(({ label, n }) => {
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
                  <div style={{ marginTop: 6, height: 4, background: "#1e293b", borderRadius: 99, overflow: "hidden" }}>
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
        Consultando BigQuery — pode levar até 1 min
      </div>
    </div>
  );
}

export default function DITDashboard() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dots, setDots] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setDots((d) => d + 1), 800);
    return () => clearInterval(id);
  }, [loading]);

  const loadDIT = async (dateFrom: string, dateTo: string) => {
    setLoading(true);
    setStep(1);
    setDots(0);
    setError(null);
    try {
      const routes = await runBigQuery<Record<string, unknown>>(BQ_QUERY_DIT_ROUTES(dateFrom, dateTo));

      setStep(2);
      const shipments = await runBigQuery<{ ROUTE_ID: string; SHIPMENT_ID: string; HU_ID: string; CAUSA_L1: string; PROMISE_DATE: string }>(
        BQ_QUERY_DIT_SHIPMENTS(dateFrom, dateTo)
      ).catch(() => []);

      setStep(3);
      const steps = await runBigQuery<{ SHP_SHIPMENT_ID: string; PLAN_INIT: string; PLAN_END: string; REAL_INIT: string; REAL_END: string; STEP_DELAY_MIN: string; SOURCE_END: string }>(
        BQ_QUERY_DIT_STEPS(dateFrom, dateTo)
      ).catch(() => []);

      // Build shp_by_route
      const shpByRoute: Record<string, unknown[]> = {};
      for (const s of shipments) {
        const rid = String(s.ROUTE_ID);
        if (!shpByRoute[rid]) shpByRoute[rid] = [];
        shpByRoute[rid].push({ id: s.SHIPMENT_ID, hu: s.HU_ID, l1: s.CAUSA_L1, prom: s.PROMISE_DATE });
      }

      // Build steps_by_shp
      const stepsByShp: Record<string, unknown> = {};
      for (const st of steps) {
        stepsByShp[String(st.SHP_SHIPMENT_ID)] = {
          lhDelay: st.STEP_DELAY_MIN !== null ? parseFloat(String(st.STEP_DELAY_MIN)) : null,
          pi: st.PLAN_INIT, pe: st.PLAN_END, ri: st.REAL_INIT, re: st.REAL_END, src: st.SOURCE_END,
        };
      }

      // Compute AVG_DIT_DELAY_MIN per route
      const sidToRid: Record<string, string> = {};
      for (const [rid, shps] of Object.entries(shpByRoute)) {
        for (const s of shps as Array<{ id: string }>) sidToRid[String(s.id)] = rid;
      }
      const delaysByRoute: Record<string, number[]> = {};
      for (const [sid, st] of Object.entries(stepsByShp)) {
        const rid = sidToRid[sid];
        if (!rid) continue;
        const lhd = (st as { lhDelay: number | null }).lhDelay;
        if (lhd !== null && lhd !== undefined) {
          if (!delaysByRoute[rid]) delaysByRoute[rid] = [];
          delaysByRoute[rid].push(lhd);
        }
      }
      for (const r of routes) {
        const rid = String((r as Record<string, unknown>).ROUTE_ID);
        const delays = delaysByRoute[rid] || [];
        (r as Record<string, unknown>).AVG_DIT_DELAY_MIN = delays.length > 0
          ? Math.round(delays.reduce((a, b) => a + b, 0) / delays.length * 10) / 10
          : null;
      }

      const generatedAt = new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });

      const parts = dateFrom.split("-");
      const dateLabel = dateFrom === dateTo
        ? `ETA ${parts[2]}/${parts[1]}/${parts[0]}`
        : `${parts[2]}/${parts[1]} → ${dateTo.split("-")[2]}/${dateTo.split("-")[1]}`;

      const html = HTML_TEMPLATE_DIT
        .replace("__ROUTES_JSON__", JSON.stringify(routes))
        .replace("__SHP_JSON__", JSON.stringify(shpByRoute))
        .replace("__STEPS_JSON__", JSON.stringify(stepsByShp))
        .replace("__D1_JSON__", "{}")
        .replace("__META_JSON__", String(DIT_META_PERC))
        .replace("__DATE_LABEL__", dateLabel)
        .replace("__GENERATED_AT__", generatedAt)
        .replace("__DATE_LABEL__", dateLabel)
        .replace("__GENERATED_AT__", generatedAt);

      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      const blob = new Blob([html], { type: "text/html; charset=utf-8" });
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      if (iframeRef.current) iframeRef.current.src = url;
    } catch (err: unknown) {
      setError((err as Error).message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDIT(today(), today());
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#ef4444", marginBottom: 8 }}>Erro ao carregar dados</div>
          <div style={{ fontSize: 12, color: "#94a3b8", maxWidth: 500, textAlign: "center", wordBreak: "break-all" }}>{error}</div>
          <button onClick={() => loadDIT(today(), today())} style={{
            marginTop: 20, background: "#FFE600", color: "#1e1e2e", border: "none",
            borderRadius: 6, padding: "8px 24px", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>Tentar novamente</button>
        </div>
      )}
      <iframe
        ref={iframeRef}
        style={{ width: "100%", height: "100%", border: "none", display: loading ? "none" : "block" }}
        title="LH DIT"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
