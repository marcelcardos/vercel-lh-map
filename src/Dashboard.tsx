import React, { useState } from "react";
import { BQ_QUERY_LH_ROUTES } from "./data_query";
import { runBigQuery } from "./bq_client";

interface RotaRow {
  SHP_LG_ROUTE_ID: string;
  SHP_LG_ROUTE_CODE: string;
  SHP_LG_ROUTE_STATUS: string;
  SHP_LG_CARRIER_NAME: string;
  SHP_ORIGIN_FACILITY_ID: string;
  SHP_ORIGIN_REGIONAL_L1: string;
  SHP_DESTINATION_FACILITY_ID: string;
  SHP_DESTINATION_REGIONAL_L1: string;
  SHP_DESTINATION_ETA_DTTM: string;
  ETA_RECALC_DTTM: string | null;
  INCIDENT_TYPE: string | null;
  DELAY_MINUTES: number | null;
  ROUTE_PROGRESS_PERC: number;
  SHP_TOTAL_PACKAGES_DROPOFF_AMT: number;
  DISTANCE_KM: number;
}

function getRecalcStatus(r: RotaRow): 'EM_RISCO' | 'NO_PRAZO' | 'SEM_RECALC' {
  if (!r.ETA_RECALC_DTTM || !r.SHP_DESTINATION_ETA_DTTM) return 'SEM_RECALC';
  const recalc  = new Date(String(r.ETA_RECALC_DTTM).replace(' ', 'T') + '-03:00');
  const planned = new Date(String(r.SHP_DESTINATION_ETA_DTTM).replace(' ', 'T') + '-03:00');
  return recalc > planned ? 'EM_RISCO' : 'NO_PRAZO';
}

const STATUS_COLOR: Record<string, string> = {
  EM_RISCO:   '#ef4444',
  NO_PRAZO:   '#22c55e',
  SEM_RECALC: '#f59e0b',
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const [dateFrom, setDateFrom] = useState(today());
  const [dateTo,   setDateTo]   = useState(today());
  const [data,     setData]     = useState<RotaRow[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData([]);
    try {
      const sql  = BQ_QUERY_LH_ROUTES(dateFrom, dateTo);
      const rows = await runBigQuery<RotaRow>(sql);
      setData(rows);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao executar a query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Consulta BigQuery — Rotas LH</h1>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-4 mb-8 bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">Data ETA De</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">Até</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-end">
          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 whitespace-pre-wrap shadow-sm">
          <p className="font-bold">Erro na execução</p>
          <p>{error}</p>
        </div>
      )}

      <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Route ID','Código','Status','Transportadora','Origem','Regional Ori','Destino','Regional Dst','ETA Planejado','ETA Recalc','Atraso (min)','Progresso','Pkgs','Dist (km)','Incidente'].map(h => (
                <th key={h} className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 && !loading && !error && (
              <tr><td colSpan={15} className="py-8 px-4 text-center text-gray-500">Nenhum dado encontrado ou busca não realizada.</td></tr>
            )}
            {data.map((row, idx) => {
              const rs    = row.SHP_LG_ROUTE_STATUS === 'IN_PROGRESS' ? getRecalcStatus(row) : null;
              const color = rs ? STATUS_COLOR[rs] : '#64748b';
              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-2 px-3 font-mono">{row.SHP_LG_ROUTE_ID}</td>
                  <td className="py-2 px-3">{row.SHP_LG_ROUTE_CODE}</td>
                  <td className="py-2 px-3">
                    <span style={{ color, fontWeight: 600 }}>{rs ?? row.SHP_LG_ROUTE_STATUS}</span>
                  </td>
                  <td className="py-2 px-3 text-xs">{row.SHP_LG_CARRIER_NAME}</td>
                  <td className="py-2 px-3 font-mono text-xs">{row.SHP_ORIGIN_FACILITY_ID}</td>
                  <td className="py-2 px-3 text-xs">{row.SHP_ORIGIN_REGIONAL_L1}</td>
                  <td className="py-2 px-3 font-mono text-xs">{row.SHP_DESTINATION_FACILITY_ID}</td>
                  <td className="py-2 px-3 text-xs">{row.SHP_DESTINATION_REGIONAL_L1}</td>
                  <td className="py-2 px-3 text-xs">{String(row.SHP_DESTINATION_ETA_DTTM || '').slice(0,16)}</td>
                  <td className="py-2 px-3 text-xs" style={{ color: row.ETA_RECALC_DTTM ? color : '#94a3b8' }}>
                    {row.ETA_RECALC_DTTM ? String(row.ETA_RECALC_DTTM).slice(0,16) : '—'}
                  </td>
                  <td className="py-2 px-3 text-right font-mono" style={{ color: Number(row.DELAY_MINUTES) > 0 ? '#ef4444' : '#22c55e' }}>
                    {row.DELAY_MINUTES != null ? (Number(row.DELAY_MINUTES) > 0 ? '+' : '') + row.DELAY_MINUTES : '—'}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">{Math.round(Number(row.ROUTE_PROGRESS_PERC) * 100)}%</td>
                  <td className="py-2 px-3 text-right font-mono">{row.SHP_TOTAL_PACKAGES_DROPOFF_AMT ?? '—'}</td>
                  <td className="py-2 px-3 text-right font-mono">{row.DISTANCE_KM ? Math.round(Number(row.DISTANCE_KM)) : '—'}</td>
                  <td className="py-2 px-3 text-xs" style={{ color: '#f59e0b' }}>{row.INCIDENT_TYPE || ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {data.length > 0 && <p className="text-xs text-gray-400 mt-2">{data.length} rotas</p>}
    </div>
  );
}
