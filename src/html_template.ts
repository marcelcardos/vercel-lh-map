export const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>LH Map — Rotas Line Haul</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { height: 100%; overflow: hidden; }
  body { font-family: 'Nunito Sans', sans-serif; background: #EDEDED; color: #2D3236; height: 100vh; display: flex; flex-direction: row; overflow: hidden; }

  /* ── Sidebar CCO ──────────────────────────────────────────────────────── */
  #sidebar { width: 220px; background: #FFE600; display: flex; flex-direction: column; flex-shrink: 0; overflow: hidden; border-right: 2px solid #E6CF00; }
  #sidebar-filters-scroll { flex: 1; overflow-y: auto; overflow-x: hidden; scrollbar-gutter: stable both-edges; }
  #sidebar-filters-scroll::-webkit-scrollbar { width: 4px; }
  #sidebar-filters-scroll::-webkit-scrollbar-track { background: transparent; }
  #sidebar-filters-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.25); border-radius: 2px; }
  #app-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
  .sb-section-label { display:block; width:100%; font-size: 8px; font-weight: 900; color: #2D3236; text-transform: uppercase; letter-spacing: .12em; text-align: center; margin-bottom:3px; }
  .sb-label { display:block; width:100%; font-size: 8px; font-weight: 700; color: #2D3236; margin-bottom: 1px; text-transform: uppercase; letter-spacing: .06em; text-align: center; }
  /* ── altura unificada de todos os controles da sidebar: 22px ── */
  .sb-input, .sb-select, .sb-nav-btn, .sb-nav-home, .sb-tab-item, .sb-apply-btn, .sb-clear-btn { height: 22px; box-sizing: border-box; font-family: inherit; }
  .sb-input  { width:100%; background:rgba(255,255,255,0.6); border:1.5px solid rgba(0,0,0,0.22); border-radius:4px; padding:0 6px; font-size:10px; color:#2D3236; outline:none; }
  .sb-input:focus { border-color:rgba(0,0,0,0.45); background:rgba(255,255,255,0.9); }
  .sb-select { width:100%; background:rgba(255,255,255,0.6); border:1.5px solid rgba(0,0,0,0.22); border-radius:4px; padding:0 4px; font-size:10px; color:#2D3236; outline:none; }
  .sb-apply-btn { width:100%; background:#2D3236; color:#FFE600; border:none; border-radius:4px; font-size:10px; font-weight:700; cursor:pointer; margin-top:4px; text-transform:uppercase; letter-spacing:.04em; display:flex; align-items:center; justify-content:center; }
  .sb-apply-btn:hover { background:#1a1f22; }
  .sb-clear-btn { width:100%; background:transparent; color:#2D3236; border:1.5px solid rgba(0,0,0,0.3); border-radius:4px; font-size:10px; font-weight:700; cursor:pointer; margin-top:2px; display:flex; align-items:center; justify-content:center; }
  .sb-clear-btn:hover { background:rgba(0,0,0,0.1); }
  .sb-nav-btn { background:rgba(0,0,0,0.08); border:1.5px solid rgba(0,0,0,0.15); border-radius:4px; width:24px; min-width:24px; padding:0; font-size:12px; cursor:pointer; color:#2D3236; font-weight:700; line-height:1; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sb-nav-btn:hover { background:rgba(0,0,0,0.18); }
  /* indent = largura da seta (24px) + gap (4px) = 28px em cada lado */
  .sb-col { margin-left:28px !important; margin-right:28px !important; }
  .sb-nav-home { background:#2D3236; border:1.5px solid #2D3236; border-radius:4px; padding:0 8px; font-size:12px; cursor:pointer; color:#FFE600; font-weight:700; line-height:1; display:flex; align-items:center; justify-content:center; }
  .sb-nav-home:hover { background:#1a1f22; }
  .sb-tab-item { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:rgba(0,0,0,0.6); padding:0 8px; border-radius:4px; cursor:pointer; transition:background .12s; display:flex; align-items:center; justify-content:center; gap:4px; }
  .sb-tab-item:hover { background:rgba(0,0,0,0.1); color:#2D3236; }
  .sb-tab-item.active { background:#2D3236; color:#FFE600; font-weight:700; }

  /* Header */
  #header { background: #2D3236; padding: 12px 20px; display: flex; align-items: center; gap: 16px; border-bottom: 4px solid #FFE600; flex-shrink: 0; flex-wrap: wrap; box-shadow: 0 3px 10px rgba(0,0,0,.3); }
  #header h1 { font-size: 20px; font-weight: 800; color: #fff; white-space: nowrap; letter-spacing: .02em; }
  #header .ts { font-size: 11px; color: #adb5bd; }
  .update-info { display:flex; gap:10px; align-items:center; margin-left:auto; }
  .update-badge { font-size:11px; font-weight:600; padding:3px 10px; border-radius:4px; white-space:nowrap; }
  .update-last { background:rgba(255,255,255,0.1); color:#d0d3d6; border:1px solid rgba(255,255,255,0.18); }
  .update-next { background:#FFE600; color:#2D3236; font-weight:700; }
  /* Stats bar */
  #stats-bar { background: #fff; border-bottom: 1px solid #E0E0E0; flex-shrink: 0; }
  #kpi-row { display: flex; align-items: center; justify-content: center; padding: 8px 16px; gap: 16px; }
  #kpi-total { display: flex; flex-direction: column; justify-content: center; padding-right: 16px; margin-right: 16px; border-right: 2px solid #E0E0E0; min-width: 56px; }
  #kpi-total-n { font-size: 28px; font-weight: 900; color: #2D3236; line-height: 1; }
  #kpi-total-l { font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: .12em; color: #9CA3AF; margin-top: 2px; }

  /* Pills de status */
  .stats { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .stat { background: #F9FAFB; border: 1.5px solid #E5E7EB; border-radius: 8px; padding: 5px 14px; text-align: center; cursor: pointer; transition: box-shadow .12s, border-color .12s; }
  .stat:hover { box-shadow: 0 2px 8px rgba(0,0,0,.1); border-color: #bbbfc2; }
  .stat .n { font-size: 20px; font-weight: 900; color: #2D3236; line-height: 1; }
  .stat .l { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #9CA3AF; margin-top: 2px; white-space: nowrap; }
  .stat.green  { border-color: #00A650; background: #F0FDF4; } .stat.green  .n { color: #00A650; }
  .stat.red    { border-color: #FF3333; background: #FEF2F2; } .stat.red    .n { color: #FF3333; }
  .stat.yellow { border-color: #F59E0B; background: #FFFBEB; } .stat.yellow .n { color: #C97F00; }
  .stat.orange { border-color: #F97316; background: #FFF7ED; } .stat.orange .n { color: #F97316; }
  .stat.blue   { border-color: #3483FA; background: #EFF6FF; } .stat.blue   .n { color: #3483FA; }
  .stat.gray   { border-color: #9ca3af; }                      .stat.gray   .n { color: #4B5563; }
  .stat.crisis .n { color: #FF7A00; }

  /* Frota panel redesenhado */
  #capacity-panel { background: #F5F5F5; border-bottom: 2px solid #E0E0E0; padding: 5px 16px 7px; display: none; flex-direction: column; gap: 3px; box-shadow: 0 2px 6px rgba(0,0,0,.08); }
  .frota-title { font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: .12em; color: #9CA3AF; text-align: center; width: 100%; }
  .frota-grid { display: flex; flex-wrap: wrap; gap: 0; align-items: center; justify-content: center; }
  .frota-kpi { display: flex; flex-direction: column; padding: 0 14px 0 0; margin-right: 14px; border-right: 1px solid #E0E0E0; }
  .frota-kpi:last-child { border-right: none; margin-right: 0; padding-right: 0; }
  .frota-kpi .fk-l { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #9CA3AF; }
  .frota-kpi .fk-v { font-size: 17px; font-weight: 900; color: #2D3236; line-height: 1.1; }
  .frota-kpi .fk-v span { font-size: 12px; font-weight: 600; color: #9CA3AF; }
  .frota-bar-wrap { width: 80px; height: 5px; background: #E0E0E0; border-radius: 3px; overflow: hidden; margin-top: 2px; }
  .frota-bar-fill { height: 100%; border-radius: 3px; }

  /* Controls */
  #controls { background: #F5F5F5; padding: 6px 16px; display: flex; gap: 10px; align-items: center; flex-shrink: 0; flex-wrap: wrap; border-bottom: 1px solid #E0E0E0; }
  #controls label { font-size: 12px; color: #4B5563; font-weight: 500; }
  #controls select, #controls input[type=text] { background: #fff; border: 1px solid #E0E0E0; color: #2D3236; border-radius: 5px; padding: 3px 7px; font-size: 12px; }
  #controls select:focus, #controls input[type=text]:focus { outline: none; border-color: #9ca3af; }
  .btn { border: none; border-radius: 5px; padding: 4px 12px; font-size: 12px; cursor: pointer; font-weight: 600; }
  .btn-blue  { background: #FFE600; color: #1C1C1E; }
  .btn-blue:hover { background: #f0d800; }
  .btn-gray  { background: #e2e8f0; color: #475569; }
  .btn-gray:hover { background: #cbd5e1; }
  .btn-crisis { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; position:relative; }
  .btn-crisis:hover { background: #fde68a; }
  .btn-crisis.active { background: #f59e0b; color: #fff; border-color: #f59e0b; }
  .crisis-badge { position:absolute; top:-6px; right:-6px; background:#ef4444; color:#fff; border-radius:50%; width:16px; height:16px; font-size:9px; display:flex; align-items:center; justify-content:center; font-weight:700; }

  /* Layout */
  #main { display: flex; flex: 1; overflow: hidden; background: #EDEDED; }
  #map { flex: 1; }

  /* Crisis Panel */
  #crisis-panel { background: #F5F5F5; width: 320px; display: flex; flex-direction: column; border-left: 1px solid #E0E0E0; flex-shrink: 0; overflow: hidden; transition: width .2s; box-shadow: -2px 0 8px rgba(0,0,0,.06); }
  #crisis-panel.hidden { width: 0; border: none; box-shadow: none; }
  #crisis-header { padding: 10px 12px 6px; border-bottom: 1px solid #E0E0E0; flex-shrink:0; background: #fff8e1; }
  #crisis-header h2 { font-size: 13px; font-weight: 700; color: #92400e; display:flex; align-items:center; gap:6px; }
  #crisis-subheader { padding: 6px 12px; border-bottom: 1px solid #E0E0E0; display:flex; align-items:center; gap:8px; flex-shrink:0; font-size:11px; color:#6b7280; }
  #crisis-subheader input[type=number] { width:40px; background:#fff; border:1px solid #E0E0E0; color:#2D3236; border-radius:4px; padding:2px 5px; font-size:11px; text-align:center; }
  #crisis-list { overflow-y: auto; flex:1; padding: 8px 0; }
  .crisis-item { padding: 8px 12px; border-bottom: 1px solid #EDEDED; cursor: pointer; transition: background .15s; }
  .crisis-item:hover, .crisis-item.selected { background: #fffde7; }
  .crisis-item.selected { border-left: 3px solid #FFE600; }
  .crisis-corridor { font-size: 12px; font-weight: 600; color: #2D3236; margin-bottom: 3px; }
  .crisis-corridor span { color: #6b7280; font-weight: 400; }
  .crisis-incident { font-size: 11px; color: #d97706; margin-bottom: 4px; }
  .crisis-meta { display:flex; gap:6px; flex-wrap:wrap; }
  .chip { font-size: 10px; padding: 1px 6px; border-radius: 10px; font-weight: 600; }
  .chip-count  { background: #dbeafe; color: #1d4ed8; }
  .chip-delay  { background: #fee2e2; color: #dc2626; }
  .ping-tip { background:#1e293b !important; border:1px solid #475569 !important; color:#e2e8f0 !important; font-size:10px !important; padding:2px 7px !important; border-radius:4px !important; white-space:nowrap; box-shadow:none !important; }
  .ping-tip::before { display:none !important; }
  .chip-pkg    { background: #dcfce7; color: #16a34a; }
  .chip-status { background: #ede9fe; color: #7c3aed; }
  .crisis-empty { padding: 24px 12px; text-align:center; color:#94a3b8; font-size:12px; }
  .crisis-routes-detail { background:#f8fafc; padding: 6px 12px; font-size:10px; color:#64748b; display:none; border-top: 1px solid #e2e8f0; }
  .crisis-routes-detail.open { display:block; }

  /* ── Propagação / Crise visual ─────────────────────────────────────────── */
  @keyframes crisisPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(1.5)} }
  @keyframes propagationPulse { 0%,100%{opacity:.9;filter:drop-shadow(0 0 3px #FF2D2D)} 50%{opacity:.25;filter:drop-shadow(0 0 1px #FF2D2D)} }
  .pulse-ring { animation: propagationPulse 1.8s ease-in-out infinite; }
  @keyframes lastPingPulse { 0%{transform:scale(1);opacity:1} 60%{transform:scale(2.4);opacity:0} 100%{transform:scale(1);opacity:0} }
  .last-ping-ring { animation: lastPingPulse 1.4s ease-out infinite; transform-origin: center; }
  /* Summary metrics grid */
  .crisis-summary { padding:8px 12px; border-bottom:1px solid #E0E0E0; display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:4px; flex-shrink:0; }
  .cs-metric { background:#fff; border:1px solid #E0E0E0; border-radius:5px; padding:4px 5px; text-align:center; }
  .cs-metric .n { font-size:13px; font-weight:700; color:#FF3333; }
  .cs-metric .l { font-size:8px; color:#6b7280; text-transform:uppercase; letter-spacing:.06em; margin-top:1px; font-weight:700; }
  .cs-metric.amber .n { color:#FF7A00; }
  .cs-metric.blue  .n { color:#3483FA; }
  .cs-metric.purple .n { color:#7c3aed; }
  /* Top 5 section */
  .top5-section { padding:8px 12px; border-top:2px solid #E0E0E0; flex-shrink:0; background:#F5F5F5; }
  .top5-section h3 { font-size:9px; color:#6b7280; text-transform:uppercase; letter-spacing:.1em; margin-bottom:5px; display:flex; justify-content:space-between; font-weight:900; }
  .top5-item { display:flex; align-items:center; gap:5px; padding:3px 0; border-bottom:1px solid #E0E0E0; }
  .top5-badge { background:#ffe5e5; color:#FF3333; border-radius:3px; padding:1px 5px; font-weight:700; font-size:9px; min-width:22px; text-align:center; }
  /* Propagation route indicator */
  .prop-indicator { height:2px; background:linear-gradient(90deg,#FF2D2D,#FF2D2D66,transparent); margin:-1px -1px 4px; border-radius:1px 1px 0 0; }
  /* Leg propagation */
  .leg-prop-line { width:22px; height:3px; background:#FF2D2D; border-radius:2px; flex-shrink:0; box-shadow:0 0 5px #FF2D2D90; }
  .crisis-routes-detail div { padding:2px 0; border-bottom:1px solid #f1f5f9; }

  /* Legend */
  #legend { background: #F5F5F5; width: 190px; padding: 12px; font-size: 12px; overflow-y: auto; border-left: 1px solid #E0E0E0; flex-shrink: 0; }
  #legend h3 { font-size: 9px; color: #6b7280; margin-bottom: 7px; text-transform: uppercase; letter-spacing: .1em; font-weight: 900; }
  .leg-item { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; }
  .leg-dot { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; }
  .leg-line { width: 22px; height: 3px; border-radius: 2px; flex-shrink: 0; }
  .leg-label { color: #4B5563; font-size:11px; }
  .sep { border-top: 1px solid #E0E0E0; margin: 8px 0; }

  /* Popup */
  .lh-popup { font-size: 12px; min-width: 240px; font-family: 'Nunito Sans', sans-serif; }
  .lh-popup h4 { font-size: 13px; font-weight: 700; margin-bottom: 6px; color: #2D3236; }
  .lh-popup table { width: 100%; border-collapse: collapse; }
  .lh-popup td { padding: 2px 4px; vertical-align: top; }
  .lh-popup td:first-child { color: #6b7280; white-space: nowrap; width: 44%; }
  .badge { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; color: #fff; }
  .badge-green { background: #00A650; }
  .badge-yellow { background: #FFE600; color: #2D3236; }
  .badge-orange { background: #FF7A00; }
  .badge-red { background: #FF3333; }
  .badge-darkred { background: #cc0000; }
  .badge-gray { background: #6b7280; }
  .badge-blue { background: #3483FA; }
  .progress-bar { height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; margin-top: 2px; }
  .progress-fill { height: 100%; border-radius: 3px; background: #3b82f6; }

  /* ── Tab bar ──────────────────────────────────────────────────────────── */
  #tab-bar { display:flex; gap:4px; padding:6px 16px 0; background:#F5F5F5; border-bottom:1px solid #E0E0E0; flex-shrink:0; }
  .tab-btn { background:transparent; border:none; border-bottom:3px solid transparent; color:#6b7280; font-size:13px; font-weight:600; padding:6px 18px; cursor:pointer; border-radius:4px 4px 0 0; transition:all .15s; font-family:inherit; }
  .tab-btn:hover { color:#2D3236; background:#EDEDED; }
  .tab-btn.active { color:#3483FA; border-bottom-color:#3483FA; }

  /* ── List view ────────────────────────────────────────────────────────── */
  #list-view { display:none; flex:1; flex-direction:column; overflow-y:auto; padding:20px 14px 10px; background:#EDEDED; }
  .route-card { background:#F5F5F5; border-radius:8px; padding:12px 16px; margin-bottom:6px; border-left:4px solid #E0E0E0; transition: box-shadow .15s; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
  .route-card:hover { box-shadow: 0 3px 10px rgba(0,0,0,.1); border-left-color: #FFE600; }

  /* ── Timeline ─────────────────────────────────────────────────────────── */
  @keyframes tlPulse { 0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,.6)} 60%{box-shadow:0 0 0 7px rgba(37,99,235,0)} }

  /* ── DIT Popup ────────────────────────────────────────────────────────── */
  #dit-modal { display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,.45); align-items:center; justify-content:center; }
  #dit-modal.open { display:flex; }
  #dit-modal-box { background:#fff; border-radius:10px; box-shadow:0 8px 32px rgba(0,0,0,.25); width:480px; max-width:94vw; max-height:80vh; display:flex; flex-direction:column; overflow:hidden; }
  #dit-modal-header { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; background:#fef2f2; border-bottom:1px solid #fecaca; }
  #dit-modal-title { font-size:14px; font-weight:700; color:#991b1b; }
  #dit-modal-close { background:none; border:none; font-size:20px; cursor:pointer; color:#64748b; line-height:1; padding:2px 6px; }
  #dit-modal-close:hover { color:#0f172a; }
  #dit-modal-body { overflow-y:auto; padding:12px 18px; }
  .dit-row { display:flex; align-items:center; gap:10px; padding:7px 0; border-bottom:1px solid #f1f5f9; font-size:12px; }
  .dit-row:last-child { border-bottom:none; }
  .dit-row-shp { font-weight:600; color:#1e293b; font-family:monospace; flex:0 0 auto; }
  .dit-row-cause { color:#dc2626; background:#fee2e2; border-radius:4px; padding:2px 7px; font-size:11px; font-weight:600; }

  /* ── Checkpoint Tooltip (JS-driven, position:fixed para não ficar atrás) ── */
  #ck-tooltip {
    position:fixed; z-index:9998; pointer-events:none;
    background:#1e293b; color:#f8fafc;
    padding:7px 11px; border-radius:7px;
    font-size:11px; line-height:1.5; white-space:pre-wrap;
    max-width:220px; min-width:130px; text-align:center;
    box-shadow:0 4px 16px rgba(0,0,0,.3);
    opacity:0; transition:opacity .15s;
    font-family:inherit;
  }
  #ck-tooltip.show { opacity:1; }
  @keyframes spin-refresh { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  #btnRefreshIcon { display: inline-block; transform-origin: center; transition: color 0.2s; }
</style>
</head>
<body>

<!-- Fixed overlays (position:fixed — outside layout flow) -->
<div id="hotspot-panel" style="display:none;position:fixed;bottom:0;left:220px;right:0;z-index:9500;
  background:#fff;border-top:2px solid #ef4444;box-shadow:0 -4px 20px rgba(0,0,0,0.15);
  font-family:Segoe UI,sans-serif;max-height:42vh;flex-direction:column">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 14px;
    background:#fff7f7;border-bottom:1px solid #fee2e2;flex-shrink:0">
    <span id="hotspot-title" style="font-size:13px;font-weight:700;color:#dc2626">🌡️ Hotspot</span>
    <button onclick="closeHotspotPanel()" style="background:none;border:none;font-size:16px;
      cursor:pointer;color:#64748b;padding:0 4px;line-height:1">&times;</button>
  </div>
  <div id="hotspot-list" style="overflow-y:auto;flex:1;padding:4px 0"></div>
</div>

<div id="routeToast" style="display:none;position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#fff;color:#1e293b;border:1px solid #e2e8f0;border-radius:8px;padding:8px 16px;font-size:12px;z-index:9000;pointer-events:none;transition:opacity .3s;box-shadow:0 4px 12px rgba(0,0,0,.12)"></div>

<!-- Legenda de cores do caminhão (position:fixed, canto inferior esquerdo da área do mapa) -->
<div id="truck-legend" style="position:fixed;bottom:28px;left:232px;z-index:8000;background:rgba(255,255,255,0.93);border:1px solid #e2e8f0;border-radius:8px;padding:7px 10px;font-size:11px;font-family:Segoe UI,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.12);line-height:1.8">
  <div style="font-weight:700;color:#475569;margin-bottom:3px;font-size:10px;text-transform:uppercase;letter-spacing:.5px">🚛 Status</div>
  <div class="legend-item" onclick="filterByStatus('EM_RISCO')" style="display:flex;align-items:center;gap:6px;cursor:pointer;border-radius:4px;padding:1px 3px" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background=''"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ef4444;flex-shrink:0"></span><span style="color:#1e293b">Em Risco</span></div>
  <div class="legend-item" onclick="filterByStatus('NO_PRAZO')" style="display:flex;align-items:center;gap:6px;cursor:pointer;border-radius:4px;padding:1px 3px" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background=''"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#22c55e;flex-shrink:0"></span><span style="color:#1e293b">No Prazo</span></div>
  <div class="legend-item" onclick="filterByStatus('SEM_RECALC')" style="display:flex;align-items:center;gap:6px;cursor:pointer;border-radius:4px;padding:1px 3px" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background=''"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#f59e0b;flex-shrink:0"></span><span style="color:#1e293b">Sem Recalc</span></div>
  <div id="legend-clear" onclick="resetFilters()" style="display:none;margin-top:4px;text-align:center;cursor:pointer;color:#64748b;font-size:10px;border-top:1px solid #e2e8f0;padding-top:3px" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#64748b'">✕ limpar filtro</div>
</div>

<!-- ── Sidebar CCO ──────────────────────────────────────────────────────────── -->
<div id="sidebar">

  <!-- Logo / Header CCO -->
  <div style="padding:10px 14px 8px;border-bottom:2px solid rgba(0,0,0,0.18);flex-shrink:0;text-align:center">
    <div style="font-size:32px;font-weight:900;color:#2D3236;letter-spacing:-.5px;line-height:1">CCO</div>
    <div style="font-size:9px;font-weight:900;color:#2D3236;letter-spacing:.1em;text-transform:uppercase;margin-top:2px;line-height:1.4">CONTROLES OPERACIONAIS</div>
    <div style="margin-top:8px;height:2px;background:#2D3236;border-radius:1px;opacity:0.2"></div>
    <div style="margin-top:6px;font-size:10px;font-weight:700;color:#2D3236;letter-spacing:.05em">🗺 LH MAP</div>
  </div>

  <!-- Navegação — FIXO (fora do scroll) -->
  <div style="padding:6px 10px 8px;border-bottom:1px solid rgba(0,0,0,0.12);flex-shrink:0">
    <div class="sb-section-label">NAVEGAÇÃO</div>
    <div style="margin-top:3px;display:flex;flex-direction:column;gap:3px">
      <!-- Home com setas de navegação -->
      <button class="sb-nav-home" title="Início (Mapa)" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:0 8px">
        <span onclick="event.stopPropagation();navigateTab(-1)" style="cursor:pointer;font-size:13px;line-height:1;opacity:.8;padding:0 2px">‹</span>
        <span onclick="switchTab('map')">⌂</span>
        <span onclick="event.stopPropagation();navigateTab(1)" style="cursor:pointer;font-size:13px;line-height:1;opacity:.8;padding:0 2px">›</span>
      </button>
      <!-- Abas simples (sem setas) -->
      <div class="sb-tab-item active" id="sb-tab-map" onclick="switchTab('map')">MAPA</div>
      <div class="sb-tab-item" id="sb-tab-list" onclick="switchTab('list')">E2E</div>
    </div>
  </div>

  <!-- Data ETA Destino — FIXO (fora do scroll) -->
  <div style="padding:6px 10px 8px;border-bottom:1px solid rgba(0,0,0,0.12);flex-shrink:0">
    <div class="sb-section-label">DATA ETA DESTINO</div>
    <div style="display:flex;flex-direction:column;gap:3px;margin-top:3px">
      <div>
        <div class="sb-label">DE</div>
        <input id="fDateFrom" type="date" class="sb-input" onchange="applyFilters()"/>
      </div>
      <div>
        <div class="sb-label">ATÉ</div>
        <input id="fDateTo" type="date" class="sb-input" onchange="applyFilters()"/>
      </div>
      <button onclick="applyFilters()" class="sb-apply-btn">APLICAR FILTRO</button>
    </div>
  </div>

  <!-- Apenas FILTROS + FERRAMENTAS scrollam -->
  <div id="sidebar-filters-scroll">

    <!-- Filtros -->
    <div style="padding:6px 10px 6px;border-bottom:1px solid rgba(0,0,0,0.12)">
      <div class="sb-section-label">FILTROS</div>
      <div style="margin-top:3px;display:flex;flex-direction:column;gap:2px">
        <div>
          <div class="sb-label">GRANULARIDADE</div>
          <select id="fGranularidade" class="sb-select" onchange="applyFilters()">
            <option value="">(Tudo)</option>
            <option value="dia">Dia</option>
            <option value="semana">Semana</option>
            <option value="mes">Mês</option>
            <option value="trimestre">Trimestre</option>
            <option value="ano">Ano</option>
          </select>
        </div>
        <div>
          <div class="sb-label">ANO</div>
          <select id="fAno" class="sb-select" onchange="applyFilters()">
            <option value="">(Tudo)</option>
          </select>
        </div>
        <div>
          <div class="sb-label">TRIMESTRE</div>
          <select id="fTrimestre" class="sb-select" onchange="applyFilters()">
            <option value="">(Tudo)</option>
            <option value="1">Q1 (Jan–Mar)</option>
            <option value="2">Q2 (Abr–Jun)</option>
            <option value="3">Q3 (Jul–Set)</option>
            <option value="4">Q4 (Out–Dez)</option>
          </select>
        </div>
        <div>
          <div class="sb-label">MÊS</div>
          <select id="fMes" class="sb-select" onchange="applyFilters()">
            <option value="">(Tudo)</option>
            <option value="1">Janeiro</option>
            <option value="2">Fevereiro</option>
            <option value="3">Março</option>
            <option value="4">Abril</option>
            <option value="5">Maio</option>
            <option value="6">Junho</option>
            <option value="7">Julho</option>
            <option value="8">Agosto</option>
            <option value="9">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
          </select>
        </div>
        <div>
          <div class="sb-label">SEMANA</div>
          <select id="fSemana" class="sb-select" onchange="applyFilters()">
            <option value="">(Tudo)</option>
          </select>
        </div>
        <div>
          <div class="sb-label">DIA SEMANA</div>
          <select id="fDiaSemana" class="sb-select" onchange="applyFilters()">
            <option value="">(Tudo)</option>
            <option value="0">Domingo</option>
            <option value="1">Segunda</option>
            <option value="2">Terça</option>
            <option value="3">Quarta</option>
            <option value="4">Quinta</option>
            <option value="5">Sexta</option>
            <option value="6">Sábado</option>
          </select>
        </div>
        <div>
          <div class="sb-label">REGIONAL ORIGEM</div>
          <select id="fRegOrigem" class="sb-select" onchange="applyFilters()">
            <option value="">(Tudo)</option>
          </select>
        </div>
        <div>
          <div class="sb-label">FACILITY ORIGEM</div>
          <select id="fOrigem" class="sb-select" onchange="applyFilters()">
            <option value="">(Tudo)</option>
          </select>
        </div>
        <div>
          <div class="sb-label">REGIONAL DESTINO</div>
          <select id="fRegDestino" class="sb-select" onchange="applyFilters()">
            <option value="">(Tudo)</option>
          </select>
        </div>
        <div>
          <div class="sb-label">FACILITY DESTINO</div>
          <select id="fDestino" class="sb-select" onchange="applyFilters()">
            <option value="">(Tudo)</option>
          </select>
        </div>
        <div>
          <div class="sb-label">TRANSPORTADORA</div>
          <select id="fCarrier" class="sb-select" onchange="applyFilters()">
            <option value="">(Tudo)</option>
          </select>
        </div>
        <div>
          <div class="sb-label">STATUS ROTA</div>
          <select id="fStatusRota" class="sb-select" onchange="applyFilters()">
            <option value="">(Tudo)</option>
            <option value="IN_PROGRESS">🔵 Em Andamento</option>
            <option value="PENDING">🟡 Pendente</option>
            <option value="FINISHED">🟢 Finalizado</option>
            <option value="CANCELLED">🔴 Cancelado</option>
          </select>
        </div>
        <div>
          <div class="sb-label">TRAVEL ID</div>
          <input id="fRoute" type="text" class="sb-input" placeholder="ID da rota" onkeydown="if(event.key==='Enter')applyFilters()"/>
        </div>
        <button onclick="resetFilters()" class="sb-clear-btn">LIMPAR FILTROS</button>
      </div>
    </div>

    <!-- Ferramentas do Mapa (oculto na aba Lista) -->
    <div id="sb-map-tools" style="padding:6px 10px 10px">
      <div class="sb-section-label">FERRAMENTAS</div>
      <div style="margin-top:3px;display:flex;flex-direction:column;gap:2px">
        <button class="btn btn-gray" id="btnRiskZones" onclick="toggleRiskZones()" style="border:1.5px solid #f97316;color:#f97316;opacity:0.4;width:100%;text-align:left;padding:4px 8px">⚠️ Zonas</button>
        <button class="btn btn-gray" id="btnHeatmap" onclick="toggleHeatmap()" style="border:1.5px solid #ef4444;color:#ef4444;opacity:0.4;width:100%;text-align:left;padding:4px 8px">🌡️ Heatmap</button>
        <button class="btn" id="btnTile" onclick="toggleTileLayer()" style="background:#374151;color:#d1d5db;width:100%;text-align:left;padding:4px 8px">🗺 Ruas</button>
        <button class="btn btn-gray" onclick="recenterMap()" style="width:100%;text-align:left;padding:4px 8px;margin-top:1px">⊙ Centro</button>
      </div>
    </div>

  </div><!-- /sidebar-filters-scroll -->

  <!-- Hidden inputs para estado JS (tipo filter) -->
  <input id="fTipo" type="hidden" value=""/>

</div><!-- /sidebar -->

<!-- ── App Content (tudo à direita da sidebar) ─────────────────────────────── -->
<div id="app-content">

  <div id="ui-panel">
    <div id="header">
      <h1>🗺 LH Map — Rotas Line Haul</h1>
      <div class="update-info">
        <span class="update-badge update-last" id="ts"></span>
        <span class="update-badge update-next" id="next-update"></span>
        <span id="refresh-badge" style="display:none;align-items:center;gap:4px;background:#22c55e;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:99px;">🔄 Atualizado</span>
      </div>
    </div>
  </div>

  <!-- Stats bar -->
  <div id="stats-bar">
    <div id="kpi-row">
      <div id="kpi-total">
        <div id="kpi-total-n">—</div>
        <div id="kpi-total-l">ROTAS</div>
      </div>
      <div class="stats" id="stats"></div>
    </div>
  </div>
  <span id="count" style="display:none"></span>

  <div id="tab-bar" style="display:none">
    <button class="tab-btn active" onclick="switchTab('map')" id="tab-map">🗺️ Mapa</button>
    <button class="tab-btn" onclick="switchTab('list')" id="tab-list">📋 E2E</button>
  </div>
  <div id="capacity-panel"></div>
  <div id="e2e-subtitle" style="display:none;background:#2D3236;padding:10px 18px;align-items:center;gap:8px;border-bottom:3px solid #FFE600;flex-shrink:0"><span style="font-size:15px">📋</span><span id="e2e-subtitle-text" style="font-size:14px;font-weight:800;color:#fff;letter-spacing:.06em;text-transform:uppercase">E2E</span><span id="e2e-subtitle-count" style="font-size:11px;font-weight:400;color:#9CA3AF;margin-left:2px"></span></div>
  <div id="e2e-gap" style="display:none;height:12px;background:#EDEDED;flex-shrink:0"></div>

  <div id="main">
    <div id="map"></div>
    <div id="list-view"></div>

    <!-- PAINEL DE CRISE -->
    <div id="crisis-panel" class="hidden">
      <div id="crisis-header">
        <h2>🚨 Gestão de Crise</h2>
      </div>
      <div id="crisis-summary" class="crisis-summary"></div>
      <div id="crisis-subheader">
        <input type="text" id="criseSearch" placeholder="buscar rota / placa / carrier…" oninput="renderCrisisList()" style="flex:1;background:#f8fafc;border:1px solid #e2e8f0;color:#1e293b;border-radius:4px;padding:3px 8px;font-size:11px"/>
        <span id="criseTotal" style="white-space:nowrap;color:#f59e0b;font-weight:700;font-size:11px"></span>
      </div>
      <div id="crisis-list"></div>
      <div id="top5-section" class="top5-section" style="display:none"></div>
    </div>

  </div>

</div><!-- /app-content -->

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>
<script>
// ── Dados ─────────────────────────────────────────────────────────────────────
let RAW_DATA      = __DATA_JSON__;
const INMET_ALERTS  = __INMET_JSON__;
let TRACKING_DATA = __TRACKING_JSON__;   // { "routeId": [{lat,lng,ts,spd},...] }
let GENERATED_AT  = "__GENERATED_AT__";

// ── Mapa ──────────────────────────────────────────────────────────────────────
const BRAZIL_BOUNDS = L.latLngBounds(L.latLng(-38, -78), L.latLng(12, -24));
// Vista padrão: Boa Vista (norte) → Montevidéu (sul) | Cruzeiro do Sul (oeste) → costa leste
const DEFAULT_BOUNDS = [[-36, -75], [5, -33]];
const map = L.map('map', { zoomControl: true, maxBounds: BRAZIL_BOUNDS, maxBoundsViscosity: 0.5 })
              .fitBounds(DEFAULT_BOUNDS);

// Controle de timestamps + toggle painel (topright, sempre visível)
L.Control.InfoBar = L.Control.extend({
  options: { position: 'topright' },
  onAdd: function() {
    var div = L.DomUtil.create('div', '');
    div.style.cssText = 'background:rgba(255,255,255,0.92);border:1px solid #e2e8f0;border-radius:8px;'
      + 'padding:5px 10px;font-family:Segoe UI,sans-serif;font-size:11px;color:#475569;'
      + 'box-shadow:0 2px 8px rgba(0,0,0,0.12);display:flex;align-items:center;gap:10px;cursor:default';
    div.innerHTML = '<span id="ts-ctrl" style="white-space:nowrap">--</span>'
      + '<span id="next-ctrl" style="white-space:nowrap;color:#f59e0b;font-weight:600">--</span>'
      + '<button onclick="requestRefresh()" id="btnRefresh" title="Atualizar dados" '
      + 'style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:4px;padding:2px 7px;'
      + 'cursor:pointer;font-size:13px;color:#475569;line-height:1"><span id="btnRefreshIcon" style="display:inline-block">↻</span></button>'
      + '<button onclick="togglePanel()" id="btnPanel" title="Mostrar/ocultar painel" '
      + 'style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:4px;padding:2px 8px;'
      + 'cursor:pointer;font-size:12px;color:#475569;white-space:nowrap">⌃ Painel</button>';
    L.DomEvent.disableClickPropagation(div);
    return div;
  }
});
new L.Control.InfoBar().addTo(map);

// Botão "home" — restaura visão padrão do Brasil
L.Control.HomeButton = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function() {
    var btn = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    btn.innerHTML = '<a href="#" title="Restaurar visão padrão" style="font-size:16px;display:flex;align-items:center;justify-content:center;width:30px;height:30px;text-decoration:none;color:#333">⌂</a>';
    L.DomEvent.on(btn, 'click', function(e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      recenterMap();
    });
    return btn;
  }
});
new L.Control.HomeButton().addTo(map);

// Botão "full map" — esconde header+tabs, mapa ocupa 100vh
L.Control.FullMapButton = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function() {
    var btn = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    btn.innerHTML = '<a href="#" id="aFullMap" title="Modo mapa completo" '
      + 'style="font-size:15px;display:flex;align-items:center;justify-content:center;'
      + 'width:30px;height:30px;text-decoration:none;color:#333">⛶</a>';
    L.DomEvent.on(btn, 'click', function(e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      toggleFullMap();
    });
    return btn;
  }
});
new L.Control.FullMapButton().addTo(map);

const TILE_DARK = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '©OpenStreetMap ©CartoDB', subdomains: 'abcd', maxZoom: 19
});
const TILE_ROAD = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '©OpenStreetMap ©CartoDB', subdomains: 'abcd', maxZoom: 19
});
let currentTileMode = 'road';
TILE_ROAD.addTo(map);

var _panelVisible = true;
function togglePanel() {
  _panelVisible = !_panelVisible;
  document.getElementById('sidebar').style.display = _panelVisible ? '' : 'none';
  var btn = document.getElementById('btnPanel');
  if (btn) btn.textContent = _panelVisible ? '⌃ Painel' : '⌄ Painel';
}

var _fullMap = false;
function toggleFullMap() {
  _fullMap = !_fullMap;
  document.getElementById('sidebar').style.display  = _fullMap ? 'none' : (_panelVisible ? '' : 'none');
  document.getElementById('tab-bar').style.display  = _fullMap ? 'none' : '';
  var a = document.getElementById('aFullMap');
  if (a) { a.textContent = _fullMap ? '⊡' : '⛶'; a.title = _fullMap ? 'Sair do modo mapa completo' : 'Modo mapa completo'; }
  setTimeout(function(){ map.invalidateSize(); map.fitBounds(DEFAULT_BOUNDS); }, 80);
}

function recenterMap() {
  var hasFilter = ['fRoute','fOrigem','fRegOrigem','fDestino','fRegDestino','fCarrier','fStatusRota','fAno','fTrimestre','fMes','fSemana','fDiaSemana'].some(function(id) {
    var el = document.getElementById(id); return el && el.value.trim() !== '';
  }) || (document.getElementById('fRecalc') && document.getElementById('fRecalc').value !== '');
  if (hasFilter || _statusFilterActive) {
    resetFilters();
  } else {
    map.fitBounds(DEFAULT_BOUNDS);
  }
}

function toggleTileLayer() {
  const btn = document.getElementById('btnTile');
  if (currentTileMode === 'dark') {
    map.removeLayer(TILE_DARK);
    TILE_ROAD.addTo(map);
    currentTileMode = 'road';
    btn.style.background = '#0f766e';
    btn.style.color = '#ccfbf1';
    btn.textContent = '🌑 Dark';
  } else {
    map.removeLayer(TILE_ROAD);
    TILE_DARK.addTo(map);
    currentTileMode = 'dark';
    btn.style.background = '#374151';
    btn.style.color = '#d1d5db';
    btn.textContent = '🗺 Ruas';
  }
}

// ── Cores ─────────────────────────────────────────────────────────────────────
const DELAY_COLOR = { ON_TIME:'#22c55e', DELAY_ATE_1H:'#eab308', DELAY_1H_3H:'#f97316', DELAY_3H_6H:'#ef4444', DELAY_6H_PLUS:'#991b1b', SEM_ATA:'#6b7280' };
const DELAY_BADGE = { ON_TIME:'badge-green', DELAY_ATE_1H:'badge-yellow', DELAY_1H_3H:'badge-orange', DELAY_3H_6H:'badge-red', DELAY_6H_PLUS:'badge-darkred', SEM_ATA:'badge-gray' };
const STATUS_COLOR = { IN_PROGRESS:'#3b82f6', PENDING:'#a78bfa', FINISHED:'#64748b' };
const DELAY_RANK  = { ON_TIME:0, SEM_ATA:1, DELAY_ATE_1H:2, DELAY_1H_3H:3, DELAY_3H_6H:4, DELAY_6H_PLUS:5 };

function delayColor(r) { return DELAY_COLOR[r.DELAY_BUCKET] || '#6b7280'; }
function fmt(v)  { return v == null ? '—' : v; }
function fmtDt(s){ return s ? s.replace('T',' ').slice(0,16) : '—'; }
function fmtMin(m) {
  if (m == null) return '—';
  const h = Math.floor(Math.abs(m)/60), min = Math.abs(m)%60;
  return (m<0?'-':'+')+( h>0 ? \`\${h}h\${String(min).padStart(2,'0')}min\` : \`\${min}min\`);
}

// ── Previsão de chegada baseada em GPS ────────────────────────────────────────
function gpsArrivalPrediction(r) {
  if (r.SHP_LG_ROUTE_STATUS !== 'IN_PROGRESS') return '';
  var pings = TRACKING_DATA[String(r.SHP_LG_ROUTE_ID)] || [];
  if (pings.length < 3) return '';
  var dLat = +r.DEST_LAT, dLng = +r.DEST_LNG;
  if (!dLat || !dLng) return '';

  var gpsMinsAgo = +r.GPS_MINUTES_AGO || 0;

  // GPS muito antigo → previsão não confiável
  if (gpsMinsAgo > 300) {
    return '<tr><td>🔮 ETA Calculado</td><td style="color:#94a3b8;font-size:11px">GPS desatualizado ('
      + gpsMinsAgo + ' min) — previsão indisponível</td></tr>';
  }

  // Velocidade média dos últimos 20 pings EM MOVIMENTO (> 15 km/h)
  // Exclui paradas, engarrafamentos e outliers para refletir velocidade de cruzeiro real
  var recent = pings.slice(-20);
  var speeds = recent.map(function(p){ return +p.spd || 0; }).filter(function(s){ return s > 15; });
  var avgSpd, usedDefault = false;
  if (speeds.length < 3) {
    avgSpd = 65; usedDefault = true;  // velocidade padrão LH quando sem dados suficientes
  } else {
    avgSpd = speeds.reduce(function(a,b){ return a+b; }, 0) / speeds.length;
    avgSpd = Math.max(40, Math.min(110, avgSpd));  // clamp razoável para caminhão
  }

  // Distância linha reta do último ping ao destino
  var lastP = pings[pings.length - 1];
  var distKm = haversineKm(lastP.lat, lastP.lng, dLat, dLng);

  // Desconta distância percorrida desde o último ping (GPS pode estar defasado)
  var distTraveled = avgSpd * (gpsMinsAgo / 60);
  var effectiveDist = Math.max(0, distKm - distTraveled);

  // ETA calculado
  var etaMins = (effectiveDist / avgSpd) * 60;
  var estimatedArrival = new Date(Date.now() + etaMins * 60 * 1000);

  // Formata como "HH:MM (hoje/amanhã/DD/MM)"
  var now = new Date();
  var isToday    = estimatedArrival.toDateString() === now.toDateString();
  var tmrw = new Date(now); tmrw.setDate(now.getDate() + 1);
  var isTomorrow = estimatedArrival.toDateString() === tmrw.toDateString();
  var dayTag = isToday ? 'hoje' : (isTomorrow ? 'amanhã'
    : estimatedArrival.getDate() + '/' + String(estimatedArrival.getMonth()+1).padStart(2,'0'));
  var hh = String(estimatedArrival.getHours()).padStart(2,'0');
  var mm = String(estimatedArrival.getMinutes()).padStart(2,'0');
  var etaStr = hh + ':' + mm + ' (' + dayTag + ')';

  // Comparação com ETA planejado
  var diffBadge = '';
  if (r.SHP_DESTINATION_ETA_DTTM) {
    var planned = new Date(String(r.SHP_DESTINATION_ETA_DTTM).replace(' ','T') + '-03:00');
    var diffMin = Math.round((estimatedArrival - planned) / 60000);
    if (diffMin > 5) {
      diffBadge = ' <span style="color:#ef4444;font-weight:700">+' + diffMin + ' min de atraso</span>';
    } else if (diffMin < -5) {
      diffBadge = ' <span style="color:#22c55e;font-weight:700">' + Math.abs(diffMin) + ' min de folga</span>';
    } else {
      diffBadge = ' <span style="color:#22c55e;font-weight:700">no prazo</span>';
    }
  }

  var infoLine = effectiveDist.toFixed(0) + ' km (linha reta) · ' + avgSpd.toFixed(0) + ' km/h média';
  if (usedDefault) infoLine += ' · vel. padrão LH';
  if (gpsMinsAgo > 20) infoLine += ' · GPS há ' + gpsMinsAgo + ' min';

  return '<tr><td>🔮 ETA Calculado</td><td><strong>' + etaStr + '</strong>'
       + diffBadge
       + '<br><span style="color:#94a3b8;font-size:10px">' + infoLine + '</span></td></tr>';
}

// ── Popup ─────────────────────────────────────────────────────────────────────
function popup(r) {
  const prog    = Math.round((+r.ROUTE_PROGRESS_PERC || 0) * 100);
  const gpsIcon = r.GPS_IS_ACTIVE ? '🟢' : (r.GPS_SOURCE_TYPE === 'SEM_GPS' ? '⚫' : '🟡');
  const plates  = [r.PLATE_TRACTOR, r.PLATE_TRAILER_1, r.PLATE_TRAILER_2].filter(Boolean).join(' / ');

  // Badge único baseado no ETA recalculado
  let statusBadge = '';
  let diffRow = '';
  if (r.SHP_LG_ROUTE_STATUS === 'IN_PROGRESS' && r.ETA_RECALC_DTTM && r.SHP_DESTINATION_ETA_DTTM) {
    const recalc  = new Date(String(r.ETA_RECALC_DTTM).replace(' ','T') + '-03:00');
    const planned = new Date(String(r.SHP_DESTINATION_ETA_DTTM).replace(' ','T') + '-03:00');
    const diffMin = Math.round((recalc - planned) / 60000);
    if (diffMin > 0) {
      statusBadge = \`<span class="badge badge-red">🔴 EM RISCO</span>\`;
      diffRow = \`<tr><td>⏱️ Atraso</td><td style="color:#ef4444;font-weight:700">+\${diffMin} min</td></tr>\`;
    } else {
      statusBadge = \`<span class="badge badge-green">🟢 NO PRAZO</span>\`;
      if (diffMin < -5) diffRow = \`<tr><td>⏱️ Antecipa</td><td style="color:#22c55e;font-weight:700">\${Math.abs(diffMin)} min</td></tr>\`;
    }
  } else if (r.SHP_LG_ROUTE_STATUS === 'FINISHED') {
    const db = DELAY_BADGE[r.DELAY_BUCKET] || 'badge-gray';
    statusBadge = \`<span class="badge \${db}">\${r.DELAY_BUCKET}</span>\`;
  } else {
    const sc = STATUS_COLOR[r.SHP_LG_ROUTE_STATUS] || '#64748b';
    statusBadge = \`<span class="badge" style="background:\${sc}">\${r.SHP_LG_ROUTE_STATUS}</span>\`;
  }

  return \`<div class="lh-popup">
  <h4>\${r.SHP_LG_ROUTE_CODE || r.SHP_LG_ROUTE_ID}</h4>
  <div style="color:#94a3b8;font-size:10px;margin:-6px 0 6px">ID: \${r.SHP_LG_ROUTE_ID}</div>
  <table>
    <tr><td>Status</td><td>\${statusBadge}</td></tr>
    <tr><td>📊 Progresso</td><td><div class="progress-bar" style="position:relative;margin-top:8px"><div class="progress-fill" style="width:\${prog}%"></div><div style="position:absolute;top:-14px;left:clamp(10%,\${prog}%,90%);transform:translateX(-50%);font-size:10px;font-weight:700;color:#1e293b;white-space:nowrap">\${prog}%</div></div></td></tr>
    <tr><td>📍 Origem</td><td>\${fmt(r.SHP_ORIGIN_FACILITY_ID)} (\${fmt(r.SHP_ORIGIN_REGIONAL_L1)})</td></tr>
    <tr><td>🏁 Destino</td><td>\${fmt(r.SHP_DESTINATION_FACILITY_ID)} (\${fmt(r.SHP_DESTINATION_REGIONAL_L1)})</td></tr>
    <tr><td>📏 Restante</td><td style="white-space:nowrap">\${r.MMRTT_REMAINING ? '🛣️ '+r.MMRTT_REMAINING : (r.DISTANCE_KM ? (+r.DISTANCE_KM).toFixed(0)+' km' : '—')}</td></tr>
    <tr><td>🕐 ETA</td><td>\${fmtDt(r.SHP_DESTINATION_ETA_DTTM)}</td></tr>
    \${r.ETA_RECALC_DTTM ? \`<tr><td>🔄 ETA Recalculado</td><td style="white-space:nowrap">\${fmtDt(r.ETA_RECALC_DTTM)}</td></tr>\` : ''}
    \${diffRow}
    <tr><td>🚛 Carrier</td><td>\${fmt(r.SHP_LG_CARRIER_NAME)}</td></tr>
    <tr><td>🔑 Placas</td><td>\${plates || '—'}</td></tr>
    <tr><td>📦 Pacotes</td><td style="white-space:nowrap">\${(+r.SHP_TOTAL_PACKAGES_PICKUP_AMT || 0).toLocaleString('pt-BR')}</td></tr>
    <tr><td>📡 GPS \${gpsIcon}</td><td style="white-space:nowrap">\${(r.GPS_IS_ACTIVE && (!r.GPS_SOURCE_TYPE || r.GPS_SOURCE_TYPE==='SEM_GPS')) ? 'RTT_LIVE' : (r.GPS_SOURCE_TYPE||'SEM_GPS')} — \${fmt(r.GPS_COUNT)} pings</td></tr>
    \${r.GPS_COUNT ? \`<tr><td>🕒 Último GPS</td><td style="white-space:nowrap">\${fmtDt(r.GPS_LAST_DTTM)} (\${fmt(r.GPS_MINUTES_AGO)} min atrás)</td></tr>\` : ''}
    \${gpsArrivalPrediction(r)}
    \${r.INCIDENT_TYPE ? \`<tr><td>⚠️ Ocorrência</td><td>\${r.INCIDENT_TYPE}</td></tr>\` : ''}
  </table></div>\`;
}

// ── Layers ────────────────────────────────────────────────────────────────────
let arcLayer      = L.layerGroup().addTo(map);
let markerLayer   = L.layerGroup().addTo(map);
let hlLayer       = L.layerGroup().addTo(map);  // highlight layer para crise
let riskZoneLayer = L.layerGroup();  // zonas de risco — adicionada ao mapa só quando ativa
// Mapa routeId → leaflet objects para highlight
let routeObjects     = {};
let propagationLayer = L.layerGroup().addTo(map);
let crisisNodeLayer  = L.layerGroup();
let crisisChains     = [];
let routingLayer     = L.layerGroup().addTo(map);
let routingCache     = {};   // routeId → [[lng,lat],...] coords OSRM
let activeRouteData  = null; // rota atualmente exibida no routingLayer

// ── Road routing via OSRM (gratuito, sem API key) ─────────────────────────
function showToast(msg, ms) {
  const t = document.getElementById('routeToast');
  t.textContent = msg;
  t.style.display = 'block';
  t.style.opacity = '1';
  clearTimeout(t._tid);
  t._tid = setTimeout(function() {
    t.style.opacity = '0';
    setTimeout(function(){ t.style.display='none'; }, 300);
  }, ms || 2500);
}

async function fetchRoadRoute(oLat, oLng, dLat, dLng) {
  const url = 'https://router.project-osrm.org/route/v1/driving/'
    + oLng.toFixed(6) + ',' + oLat.toFixed(6) + ';'
    + dLng.toFixed(6) + ',' + dLat.toFixed(6)
    + '?overview=full&geometries=geojson';
  const resp = await fetch(url);
  const data = await resp.json();
  if (data.code === 'Ok' && data.routes && data.routes[0]) {
    return data.routes[0].geometry.coordinates; // [[lng,lat],...]
  }
  throw new Error(data.code || 'OSRM sem rota');
}

// Divide coordenadas OSRM em percorrido / restante pelo progress (0..1)
function splitByProgress(coords, progress) {
  if (!coords || coords.length < 2) return { traveled: coords || [], remaining: [] };
  const n   = coords.length;
  const idx = Math.max(1, Math.min(n - 1, Math.round(n * Math.min(1, Math.max(0, progress)))));
  return {
    traveled:  coords.slice(0, idx + 1),
    remaining: coords.slice(idx)
  };
}

// OSRM retorna [lng,lat]; Leaflet precisa de [lat,lng]
function osrmToLeaflet(coords) {
  return coords.map(function(c) { return [c[1], c[0]]; });
}

async function showRoadRoute(r) {
  if (!r || !r.ORIGIN_LAT || !r.DEST_LAT) return;

  // Prioridade 1: pings GPS reais (BT_SHP_RTT_LOCATIONS via Python)
  const gpsTrack = TRACKING_DATA[String(r.SHP_LG_ROUTE_ID)];
  if (gpsTrack && gpsTrack.length >= 3) {
    drawGPSTrack(r, gpsTrack);
    return;
  }

  // Prioridade 2: OSRM routing (sem GPS disponível)
  routingLayer.clearLayers();
  activeRouteData = r;
  const _bcr = document.getElementById('btnClearRoute'); if (_bcr) _bcr.style.display = '';

  const cacheKey = r.SHP_LG_ROUTE_ID;
  const color    = delayColor(r);
  const prog     = +r.ROUTE_PROGRESS_PERC || 0;
  const status   = r.SHP_LG_ROUTE_STATUS;

  // Loading toast
  showToast('⏳ Buscando rota por estradas (OSRM)…', 8000);

  let coords = routingCache[cacheKey];
  if (!coords) {
    try {
      coords = await fetchRoadRoute(+r.ORIGIN_LAT, +r.ORIGIN_LNG, +r.DEST_LAT, +r.DEST_LNG);
      routingCache[cacheKey] = coords;
    } catch(e) {
      showToast('⚠️ OSRM indisponível — usando linha reta', 3000);
      // Fallback: linha reta com 2 pontos
      coords = [[+r.ORIGIN_LNG, +r.ORIGIN_LAT], [+r.DEST_LNG, +r.DEST_LAT]];
    }
  }

  const split = splitByProgress(coords, prog);

  // Sombra/halo por trás da rota completa
  L.polyline(osrmToLeaflet(coords), {
    color: color, weight: 14, opacity: 0.12
  }).addTo(routingLayer);

  if (status === 'IN_PROGRESS' && prog > 0.02) {
    // Trecho percorrido — sólido e brilhante
    if (split.traveled.length > 1) {
      L.polyline(osrmToLeaflet(split.traveled), {
        color: color, weight: 5, opacity: 0.95
      }).bindPopup(popup(r), {maxWidth:320}).addTo(routingLayer);
    }
    // Trecho restante — tracejado e discreto
    if (split.remaining.length > 1) {
      L.polyline(osrmToLeaflet(split.remaining), {
        color: color, weight: 2.5, opacity: 0.35, dashArray: '6,9'
      }).bindPopup(popup(r), {maxWidth:320}).addTo(routingLayer);
    }
    // Ponto de partida
    L.circleMarker([+r.ORIGIN_LAT, +r.ORIGIN_LNG], {
      radius: 5, color: color, weight: 2, fillColor: '#0f172a', fillOpacity: 1
    }).addTo(routingLayer);
    // Veículo na posição atual
    if (r.CURRENT_LAT && r.CURRENT_LNG) {
      L.circleMarker([+r.CURRENT_LAT, +r.CURRENT_LNG], {
        radius: 10, color: '#fff', weight: 2.5, fillColor: markerColor(r), fillOpacity: 0.97
      }).bindPopup(popup(r), {maxWidth:320}).addTo(routingLayer);
    }
    // Destino
    L.circleMarker([+r.DEST_LAT, +r.DEST_LNG], {
      radius: 6, color: color, weight: 2, fillColor: '#1e293b', fillOpacity: 1
    }).addTo(routingLayer);

    const km = coords.length > 2 ? '~' + Math.round(coords.length * 0.12) + ' km via rodovias' : '';
    showToast('✅ Rota por estradas carregada  ' + Math.round(prog*100) + '% percorrido  ' + km, 3500);
  } else {
    // PENDING: rota completa tracejada
    L.polyline(osrmToLeaflet(coords), {
      color: color, weight: 3, opacity: 0.70, dashArray: '5,8'
    }).bindPopup(popup(r), {maxWidth:320}).addTo(routingLayer);
    L.circleMarker([+r.ORIGIN_LAT, +r.ORIGIN_LNG], {
      radius: 5, color: color, weight: 2, fillColor: '#0f172a', fillOpacity: 1
    }).addTo(routingLayer);
    L.circleMarker([+r.DEST_LAT, +r.DEST_LNG], {
      radius: 6, color: color, weight: 2, fillColor: '#1e293b', fillOpacity: 1
    }).addTo(routingLayer);
    showToast('✅ Rota por estradas carregada (PENDING)', 3000);
  }

  // ── Label com Route ID no meio do trecho percorrido ──────────────────────
  const labelCoords = split.traveled.length > 1 ? split.traveled : coords;
  const midIdx  = Math.floor(labelCoords.length / 2);
  const midPt   = labelCoords[midIdx];   // [lng, lat]
  const routeCode = r.SHP_LG_ROUTE_CODE || String(r.SHP_LG_ROUTE_ID);
  const delayTxt  = r.DELAY_MINUTES > 0 ? ' ⏱+' + Math.round(r.DELAY_MINUTES/60*10)/10 + 'h' : '';
  const progTxt   = Math.round(prog * 100) + '%';

  L.marker([midPt[1], midPt[0]], {
    icon: L.divIcon({
      className: '',
      html: '<div style="'
        + 'background:#0f172a;'
        + 'border:2px solid ' + color + ';'
        + 'color:#f8fafc;'
        + 'padding:5px 10px;'
        + 'border-radius:6px;'
        + 'font-size:12px;'
        + 'font-weight:700;'
        + 'white-space:nowrap;'
        + 'box-shadow:0 0 12px ' + color + '66,0 2px 8px #000a;'
        + 'line-height:1.4;'
        + '">'
        + '<span style="color:' + color + ';font-size:10px;font-weight:400;display:block;margin-bottom:1px">🛣 Rota via OSRM</span>'
        + routeCode
        + '<span style="color:#94a3b8;font-weight:400;font-size:10px;margin-left:6px">' + progTxt + delayTxt + '</span>'
        + '</div>',
      iconAnchor: [0, 0]
    }),
    zIndexOffset: 1000,
    interactive: false
  }).addTo(routingLayer);

  // Ajusta zoom para englobar a rota
  const lls = osrmToLeaflet(coords);
  map.fitBounds(L.latLngBounds(lls), { padding: [50, 50], maxZoom: 12 });
}

function clearRoadRoute() {
  routingLayer.clearLayers();
  activeRouteData = null;
  const _bcr2 = document.getElementById('btnClearRoute'); if (_bcr2) _bcr2.style.display = 'none';
}

// ── Desenha path GPS real (pings de BT_SHP_RTT_LOCATIONS) ─────────────────
function speedColor(spd) {
  if (spd == null || spd < 0) return '#64748b';
  if (spd <  5)  return '#ef4444';   // parado / muito lento
  if (spd < 40)  return '#f97316';   // urbano / lento
  if (spd < 80)  return '#eab308';   // rodovia moderada
  return '#22c55e';                   // autoestrada
}

function drawGPSTrack(r, pings) {
  routingLayer.clearLayers();
  activeRouteData = r;
  const _bcr = document.getElementById('btnClearRoute'); if (_bcr) _bcr.style.display = '';

  const color  = delayColor(r);
  const routeCode = r.SHP_LG_ROUTE_CODE || String(r.SHP_LG_ROUTE_ID);

  // Filtrar pings com coords válidas
  const valid = pings.filter(function(p) {
    return p.lat && p.lng && Math.abs(p.lat) > 0.01 && Math.abs(p.lng) > 0.01;
  });
  if (valid.length < 2) {
    showToast('⚠️ Pings GPS inválidos — usando OSRM', 3000);
    showRoadRoute(r);
    return;
  }

  // Sombra do trajeto completo
  const allPts = valid.map(function(p) { return [p.lat, p.lng]; });
  L.polyline(allPts, { color: color, weight: 12, opacity: 0.10 }).addTo(routingLayer);

  // Segmentos coloridos por velocidade
  for (let i = 0; i < valid.length - 1; i++) {
    const p1 = valid[i], p2 = valid[i+1];
    const sc = speedColor(p1.spd);
    L.polyline([[p1.lat, p1.lng], [p2.lat, p2.lng]], {
      color: sc, weight: 4.5, opacity: 0.90
    }).addTo(routingLayer);
  }

  // Dots a cada 10 pings para mostrar passagem de tempo
  valid.forEach(function(p, i) {
    if (i % 10 !== 0 || i === 0) return;
    L.circleMarker([p.lat, p.lng], {
      radius: 2.5, color: speedColor(p.spd), weight: 0, fillColor: speedColor(p.spd), fillOpacity: 0.85
    }).bindPopup(
      '<div style="font-size:11px"><b>' + routeCode + '</b><br>' +
      '🕐 ' + (p.ts || '') + '<br>' +
      '⚡ ' + (p.spd != null ? p.spd.toFixed(0) + ' km/h' : '—') + '</div>'
    ).addTo(routingLayer);
  });

  // Marcador de partida
  L.circleMarker([valid[0].lat, valid[0].lng], {
    radius: 5, color: color, weight: 2, fillColor: '#0f172a', fillOpacity: 1
  }).bindPopup('<div style="font-size:11px"><b>Partida</b> ' + routeCode + '<br>🕐 ' + (valid[0].ts || '') + '</div>')
    .addTo(routingLayer);

  // Último ping (posição mais recente com GPS real)
  const last = valid[valid.length - 1];
  L.circleMarker([last.lat, last.lng], {
    radius: 11, color: '#fff', weight: 2.5, fillColor: markerColor(r), fillOpacity: 0.97
  }).bindPopup(popup(r), { maxWidth: 320 }).addTo(routingLayer);

  // Linha pontilhada do último ping ao destino (trecho ainda a percorrer)
  if (r.DEST_LAT && r.DEST_LNG) {
    L.polyline([[last.lat, last.lng], [+r.DEST_LAT, +r.DEST_LNG]], {
      color: color, weight: 2, opacity: 0.30, dashArray: '5,9'
    }).addTo(routingLayer);
    L.circleMarker([+r.DEST_LAT, +r.DEST_LNG], {
      radius: 6, color: color, weight: 2, fillColor: '#1e293b', fillOpacity: 1
    }).addTo(routingLayer);
  }

  // Label com route ID no meio do caminho
  const midIdx = Math.floor(valid.length / 2);
  const mid    = valid[midIdx];
  const avgSpd = Math.round(valid.reduce(function(a, p) { return a + (p.spd||0); }, 0) / valid.length);
  L.marker([mid.lat, mid.lng], {
    icon: L.divIcon({
      className: '',
      html: '<div style="background:#0f172a;border:2px solid ' + color + ';color:#f8fafc;padding:5px 10px;border-radius:6px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 0 12px ' + color + '66,0 2px 8px #000a;line-height:1.4">'
        + '<span style="color:#22c55e;font-size:10px;font-weight:400;display:block;margin-bottom:1px">📡 GPS Real — ' + valid.length + ' pings</span>'
        + routeCode
        + '<span style="color:#94a3b8;font-weight:400;font-size:10px;margin-left:6px">⚡' + avgSpd + 'km/h médio</span>'
        + '</div>',
      iconAnchor: [0, 0]
    }),
    zIndexOffset: 1000,
    interactive: false
  }).addTo(routingLayer);

  // Legenda de velocidade
  L.marker([valid[0].lat, valid[0].lng], {
    icon: L.divIcon({
      className: '',
      html: '<div style="background:#0f172a88;border:1px solid #334155;border-radius:5px;padding:4px 7px;font-size:9px;white-space:nowrap;color:#e2e8f0">'
        + '<span style="color:#ef4444">■</span> Parado &nbsp;'
        + '<span style="color:#f97316">■</span> &lt;40 &nbsp;'
        + '<span style="color:#eab308">■</span> &lt;80 &nbsp;'
        + '<span style="color:#22c55e">■</span> &gt;80 km/h'
        + '</div>',
      iconAnchor: [0, -30]
    }),
    zIndexOffset: 900,
    interactive: false
  }).addTo(routingLayer);

  const bounds = L.latLngBounds(allPts);
  map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });

  showToast('📡 GPS real — ' + valid.length + ' pings  |  ' + routeCode, 4000);
}

// ── Sparkline inline SVG ──────────────────────────────────────────────────
function sparklineSVG(points, color, w, h) {
  w = w || 52; h = h || 16;
  if (!points || points.length < 2) return '';
  var mn = Math.min.apply(null, points), mx = Math.max.apply(null, points);
  var rng = mx - mn || 1;
  var pts = points.map(function(v, i) {
    var x = (i / (points.length - 1)) * w;
    var y = h - ((v - mn) / rng) * (h - 3) - 1;
    return x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ');
  var lx = w.toFixed(1);
  var ly = (h - ((points[points.length-1] - mn) / rng) * (h - 3) - 1).toFixed(1);
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" style="display:inline-block;vertical-align:middle;margin-left:4px;opacity:.75" xmlns="http://www.w3.org/2000/svg"><polyline points="' + pts + '" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="' + lx + '" cy="' + ly + '" r="2" fill="' + color + '"/></svg>';
}

function genSparkData(r) {
  var sev = DELAY_RANK[r.DELAY_BUCKET] || 0;
  var seed = (r.SHP_LG_ROUTE_ID || 0) % 997;
  var pts = [];
  for (var i = 0; i < 8; i++) {
    var noise = Math.sin(seed * 0.11 + i * 1.73) * 0.9;
    var base  = i >= 6 ? sev : Math.max(0, sev - 1 + noise * 0.6);
    pts.push(Math.max(0, Math.min(5, base + noise * 0.25)));
  }
  pts[pts.length - 1] = sev;
  return pts;
}

// ── Cycle-time arc DivIcon ────────────────────────────────────────────────
function cycleArcIcon(pct, col) {
  var r = 10, sz = 30, cx = 15, cy = 15;
  var circ = 2 * Math.PI * r;
  var dash = (circ * Math.min(1, Math.max(0.08, pct))).toFixed(2);
  col = col || '#FF2D2D';
  return L.divIcon({
    className: '',
    html: '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 ' + sz + ' ' + sz + '" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r+4) + '" fill="none" stroke="#FF2D2D" stroke-width="1.5" opacity="0.3" class="pulse-ring"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#FF2D2D22" stroke-width="3.5"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="3.5" stroke-dasharray="' + dash + ' ' + circ.toFixed(2) + '" stroke-linecap="round" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="' + col + '"/>' +
      '<text x="' + cx + '" y="' + (cy+3.5) + '" text-anchor="middle" font-size="6" fill="white" font-family="monospace">!</text>' +
      '</svg>',
    iconSize: [sz, sz],
    iconAnchor: [cx, cy]
  });
}

// ── Find propagation chains ───────────────────────────────────────────────
function findPropagationChains(routes) {
  var origMap = {};
  routes.forEach(function(r) {
    var o = r.SHP_ORIGIN_FACILITY_ID;
    if (o) { if (!origMap[o]) origMap[o] = []; origMap[o].push(r); }
  });
  var chains = [];
  routes.forEach(function(r) {
    var d = r.SHP_DESTINATION_FACILITY_ID;
    if (d && origMap[d] && origMap[d].length) {
      chains.push([r].concat(origMap[d].slice(0, 2)));
    }
  });
  return chains;
}

function drawCrisisPropagation(routes) {
  propagationLayer.clearLayers();
  crisisNodeLayer.clearLayers();

  var chains = findPropagationChains(routes);
  crisisChains = chains;

  var propFacIds = {};
  chains.forEach(function(chain) {
    chain.forEach(function(r) {
      if (r.SHP_ORIGIN_FACILITY_ID)      propFacIds[r.SHP_ORIGIN_FACILITY_ID]      = true;
      if (r.SHP_DESTINATION_FACILITY_ID) propFacIds[r.SHP_DESTINATION_FACILITY_ID] = true;
    });
  });

  // Linhas e nós de propagação removidos (poluem o mapa)
}

function markerColor(r) {
  if (r.GPS_IS_ACTIVE) return '#22d3ee';
  if (!r.GPS_SOURCE_TYPE || r.GPS_SOURCE_TYPE === 'SEM_GPS') return '#94a3b8';
  return STATUS_COLOR[r.SHP_LG_ROUTE_STATUS] || '#3b82f6';
}

// Avalia risco de atraso usando o ETA recalculado oficialmente pelo sistema
// (SHP_MMRTT_EXPECTED_ARRIVAL_DATE_DTTM — baseado em GPS real + roteiro planejado)
// Retorna null se sem dados, ou { atRisk, delayMin }
function etaRisk(r) {
  if (!r.ETA_RECALC_DTTM || !r.SHP_DESTINATION_ETA_DTTM) return null;
  // Datetimes vêm como "2026-03-20 18:30:00" (São Paulo, UTC-3)
  const recalc  = new Date(String(r.ETA_RECALC_DTTM).replace(' ', 'T') + '-03:00');
  const planned = new Date(String(r.SHP_DESTINATION_ETA_DTTM).replace(' ', 'T') + '-03:00');
  if (isNaN(recalc) || isNaN(planned)) return null;
  const delayMin = (recalc - planned) / 60000;
  return { atRisk: delayMin > 0, delayMin };
}

function drawRoutes(data) {
  arcLayer.clearLayers();
  markerLayer.clearLayers();
  hlLayer.clearLayers();
  routeObjects = {};

  // EM_RISCO por último → renderiza no topo das polylines SVG
  const sorted = data.slice().sort((a, b) => {
    const ra = getRecalcStatus(a) === 'EM_RISCO' ? 1 : 0;
    const rb = getRecalcStatus(b) === 'EM_RISCO' ? 1 : 0;
    return ra - rb;
  });

  sorted.forEach(r => {
    const oLat = r.ORIGIN_LAT, oLng = r.ORIGIN_LNG;
    const dLat = r.DEST_LAT,   dLng = r.DEST_LNG;
    if (!oLat || !oLng || !dLat || !dLng) return;

    const color  = delayColor(r);
    const status = r.SHP_LG_ROUTE_STATUS;
    const objs   = [];
    const routeCode = r.SHP_LG_ROUTE_CODE || String(r.SHP_LG_ROUTE_ID);

    const onRouteClick = (function(row){ return function(){ showRoadRoute(row); }; })(r);

    // singleRoute: detalhe (1 rota filtrada) vs visão full (múltiplas rotas)
    const singleRoute = (data.length === 1);

    // ── FINISHED: só aparece no modo detalhe ────────────────────────────────
    if (status === 'FINISHED') {
      if (singleRoute) {
        const arc = L.polyline([[oLat, oLng], [dLat, dLng]], {
          color, weight: 1, opacity: 0.35, dashArray: '3,8'
        }).bindPopup(popup(r), { maxWidth: 320 });
        arcLayer.addLayer(arc);
        objs.push(arc);
      }
      routeObjects[r.SHP_LG_ROUTE_ID] = objs;
      return;
    }

    // ── Pré-calcular GPS e risco ETA (antes de desenhar, para definir cores) ──
    const gpsTrack   = TRACKING_DATA[String(r.SHP_LG_ROUTE_ID)];
    // Pings válidos — outliers já removidos no SQL (velocidade implícita > 160 km/h)
    // Em visão full só precisamos dos últimos pings para posição/direção do caminhão
    // (evita processar 14k pings em memória quando apenas o último é usado)
    const pingsSlice = singleRoute ? gpsTrack : (gpsTrack ? gpsTrack.slice(-50) : null);
    const validPings = pingsSlice ? pingsSlice.filter(function(p) {
      return p.lat && p.lng && Math.abs(p.lat) > 0.01 && Math.abs(p.lng) > 0.01;
    }) : [];
    const risk       = (status === 'IN_PROGRESS') ? etaRisk(r) : null;
    const atRisk     = !!(risk && risk.atRisk);
    // Cor da trilha: para IN_PROGRESS usa recalc status (verde/vermelho/amarelo)
    // Para FINISHED usa delay bucket color (cinza/amarelo/vermelho)
    const _rsTrack   = getRecalcStatus(r);
    const activeColor = status === 'IN_PROGRESS'
      ? (_rsTrack === 'EM_RISCO'  ? '#ef4444'
       : _rsTrack === 'NO_PRAZO'  ? '#22c55e'
       :                            '#f59e0b')  // SEM_RECALC = amarelo
      : (atRisk ? '#ef4444' : color);

    // ── ATIVAS (apenas IN_PROGRESS no mapa) ─────────────────────────────────
    // PENDING fica só na aba E2E — não plota no mapa
    if (status === 'PENDING' && !singleRoute) { routeObjects[r.SHP_LG_ROUTE_ID] = objs; return; }
    // Visão full (múltiplas rotas): só marcadores, sem trajetos — evita poluição visual
    // Trajeto aparece apenas no modo detalhe (rota filtrada individualmente)

    // 1. Corredor planejado: só no modo detalhe OU quando não há GPS
    if (!validPings || validPings.length < 2) {
      if (singleRoute) {
        const corridor = L.polyline([[oLat, oLng], [dLat, dLng]], {
          color: activeColor, weight: atRisk ? 2 : 1, opacity: atRisk ? 0.50 : 0.40, dashArray: '6,10'
        }).on('click', function(e) { L.DomEvent.stopPropagation(e); filterToRoute(r.SHP_LG_ROUTE_ID, e.latlng, popup(r)); });
        arcLayer.addLayer(corridor);
        objs.push(corridor);
      }
    }

    // ── Pins A/B: só no modo detalhe (singleRoute) para evitar sobreposição ──
    if (singleRoute) {
      const origFac = r.SHP_ORIGIN_FACILITY_ID || '';
      const pinOpacity = 1.0;
      function makePinSvg(pinColor, label) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="28" viewBox="0 0 32 44">'
          + '<path d="M16 2 C8.268 2 2 8.268 2 16 C2 24 16 42 16 42 C16 42 30 24 30 16 C30 8.268 23.732 2 16 2z" '
          + 'fill="#fff" stroke="' + pinColor + '" stroke-width="3"/>'
          + '<circle cx="16" cy="16" r="7" fill="' + pinColor + '"/>'
          + '<text x="16" y="20" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="9" font-weight="800" fill="#fff">' + label + '</text>'
          + '</svg>';
      }
      const PIN_LABEL = 'font-family:Segoe UI,sans-serif;font-size:10px;font-weight:600;color:#475569';
      const origPinHtml = '<div style="display:flex;flex-direction:column;align-items:center;pointer-events:none;opacity:' + pinOpacity + '">'
        + makePinSvg(color, '1')
        + '<div style="margin-top:1px;background:rgba(255,255,255,0.9);border:1px solid ' + color + ';border-radius:4px;padding:1px 6px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.15)">'
        + '<span style="' + PIN_LABEL + '">' + origFac + '</span>'
        + '</div></div>';
      const originPin = L.marker([oLat, oLng], {
        icon: L.divIcon({ className: '', html: origPinHtml, iconAnchor: [10, 28] }),
        zIndexOffset: atRisk ? 1800 : 600
      }).on('click', function(e) { L.DomEvent.stopPropagation(e); filterToRoute(r.SHP_LG_ROUTE_ID, e.latlng, popup(r)); });
      markerLayer.addLayer(originPin);
      objs.push(originPin);

      const destFac  = r.SHP_DESTINATION_FACILITY_ID || '';
      const vehType  = (r.SHP_LG_VEHICLE_TYPE || r.SHP_LG_VEHICLE_TYPE_PLANNED || '').toUpperCase();
      const isXD     = vehType.includes('XD') || destFac.toUpperCase().includes('XD');
      const isFull   = vehType.includes('FULL') || vehType.includes('TRUCK') || vehType.includes('CARRETA');
      const typeTag  = isXD ? 'XD' : (isFull ? 'FULL' : '');
      const typeColor= isXD ? '#f59e0b' : '#22c55e';
      const destPinHtml = '<div style="display:flex;flex-direction:column;align-items:center;pointer-events:none;opacity:' + pinOpacity + '">'
        + makePinSvg(color, '2')
        + '<div style="margin-top:1px;background:rgba(255,255,255,0.9);border:1px solid ' + color + ';border-radius:4px;padding:1px 6px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.15)">'
        + '<span style="' + PIN_LABEL + '">' + destFac + '</span>'
        + '</div></div>';
      const destPin = L.marker([dLat, dLng], {
        icon: L.divIcon({ className: '', html: destPinHtml, iconAnchor: [10, 28] }),
        zIndexOffset: atRisk ? 1800 : 600
      }).on('click', function(e) { L.DomEvent.stopPropagation(e); filterToRoute(r.SHP_LG_ROUTE_ID, e.latlng, popup(r)); });
      markerLayer.addLayer(destPin);
      objs.push(destPin);
    }

    // 2. GPS track: só no modo detalhe (rota filtrada individualmente)
    if (singleRoute && status === 'IN_PROGRESS' && validPings.length >= 2) {
      var segMap = {};
      validPings.forEach(function(p) {
        var k = p.seg || 1;
        if (!segMap[k]) segMap[k] = [];
        segMap[k].push(p);
      });
      var segments = Object.values(segMap).filter(function(s) { return s.length >= 2; });
      // Budget global de dots: máx 80 no total, distribuídos uniformemente pela rota inteira
      var totalPings = validPings.length;
      var globalDotStep = Math.max(1, Math.ceil(totalPings / 80));
      // Índice global para o step (garante distribuição uniforme entre segmentos)
      var globalPingIdx = 0;

      segments.forEach(function(s) {
        var pts = s.map(function(p) { return [p.lat, p.lng]; });
        // Sombra
        var shadow = L.polyline(pts, { color: activeColor, weight: 8, opacity: atRisk ? 0.10 : 0.03 }).addTo(arcLayer);
        objs.push(shadow);
        // Trajeto sólido
        var traveled = L.polyline(pts, { color: activeColor, weight: 3.5, opacity: atRisk ? 0.92 : 0.28 })
          .on('click', function(e) { L.DomEvent.stopPropagation(e); filterToRoute(r.SHP_LG_ROUTE_ID, e.latlng, popup(r)); });
        arcLayer.addLayer(traveled);
        objs.push(traveled);

        // Pontinhos — step baseado em índice global para distribuir pela rota toda
        for (var di = 0; di < s.length; di++) {
          if (globalPingIdx % globalDotStep === 0) {
            var p = s[di];
            var dot = L.circleMarker([p.lat, p.lng], {
              radius: 5, color: '#fff', weight: 2,
              fillColor: activeColor, fillOpacity: 1,
              pane: 'markerPane'
            });
            var spd = p.spd ? p.spd + ' km/h' : '—';
            dot.bindTooltip(
              '<b>' + (p.ts || '') + '</b><br>Vel: ' + spd,
              { direction: 'top', offset: [0, -6], opacity: 0.95 }
            );
            arcLayer.addLayer(dot);
            objs.push(dot);
          }
          globalPingIdx++;
        }
      });

    } else {
      // sem GPS ainda — nada extra
    }

    // 3. Marcador do veículo — última posição pulsante (GPS real) ou estimada (interpolada)
    const lastPing = validPings.length > 0 ? validPings[validPings.length - 1] : null;
    const mLat = lastPing ? lastPing.lat : +r.CURRENT_LAT;
    const mLng = lastPing ? lastPing.lng : +r.CURRENT_LNG;
    if (mLat && mLng && Math.abs(mLat) > 0.01) {
      // Cor do marcador pelo status recalculado
      const _rs = getRecalcStatus(r);
      const mc = status === 'IN_PROGRESS'
        ? (_rs === 'EM_RISCO'   ? '#ef4444'   // vermelho
         : _rs === 'NO_PRAZO'   ? '#22c55e'   // verde
         : _rs === 'ADIANTADO'  ? '#06b6d4'   // ciano
         :                        '#f59e0b')  // amarelo = sem recalc
        : (STATUS_COLOR[status] || '#64748b');
      if (status === 'IN_PROGRESS') {
        // Ícone pulsante + Route ID abaixo
        // Quando sem GPS: anel tracejado para indicar posição estimada
        const isEstimated = !lastPing;
        const routeLabel = String(r.SHP_LG_ROUTE_ID);
        // Direção do caminhão: só esquerda ou direita no mapa
        // Se bearing > 180 (componente oeste) → espelha horizontalmente (scaleX(-1))
        var truckFlip = '';
        if (validPings.length >= 2) {
          const p1 = validPings[validPings.length - 2];
          const p2 = validPings[validPings.length - 1];
          const dLngR = (p2.lng - p1.lng) * Math.PI / 180;
          const lat1r = p1.lat * Math.PI / 180;
          const lat2r = p2.lat * Math.PI / 180;
          const y = Math.sin(dLngR) * Math.cos(lat2r);
          const x = Math.cos(lat1r) * Math.sin(lat2r) - Math.sin(lat1r) * Math.cos(lat2r) * Math.cos(dLngR);
          const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
          if (bearing > 180) truckFlip = 'scaleX(-1)';
        }
        const vehicleIcon = '<span style="display:inline-block;transform:' + (truckFlip || 'scaleX(1)') + ';line-height:1">🚛</span>';
        const labelBg  = atRisk ? 'background:#ef4444;color:#fff;' : 'background:rgba(255,255,255,0.92);color:#1e293b;';
        // Anel só aparece quando há problema (atRisk) ou posição estimada — senão invisível
        const ringColor = '#ef4444';
        const ringStyle = atRisk ? 'border:2px solid #ef4444;' : 'border:none;';
        const iconOpacity = isEstimated ? 'opacity:0.55;' : (atRisk ? '' : 'opacity:0.35;');
        // Ring pulsante: só para EM_RISCO
        const ringHtml = (atRisk)
          ? '<div style="position:absolute;top:50%;left:50%;margin-left:-15px;margin-top:-15px;'
            + 'width:30px;height:30px;pointer-events:none">'
            + '<div class="last-ping-ring" style="width:30px;height:30px;border-radius:50%;'
            + ringStyle + 'box-sizing:border-box"></div>'
            + '</div>'
          : '';
        const truckSvg = '<div style="position:relative;width:36px;height:36px;overflow:visible">'
          + ringHtml
          // Vehicle icon circle
          + '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);'
          + 'width:26px;height:26px;border-radius:50%;background:' + mc + ';border:2.5px solid #fff;'
          + 'display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,0.35);'
          + iconOpacity + '">'
          + vehicleIcon
          + '</div>'
          // Route ID label — só o código, cor muda se em risco
          + '<div style="position:absolute;top:38px;left:50%;transform:translateX(-50%);'
          + 'white-space:nowrap;font-family:Segoe UI,sans-serif;font-size:11px;font-weight:700;'
          + labelBg
          + 'border-radius:3px;padding:1px 5px;box-shadow:0 1px 4px rgba(0,0,0,0.22);pointer-events:none">'
          + routeLabel
          + '</div>'
          + '</div>';
        // Clique no caminhão → abre popup balão (sem painel lateral — adequado para TV)
        const pingMarker = L.marker([mLat, mLng], {
          icon: L.divIcon({ className: '', html: truckSvg, iconAnchor: [18, 18] }),
          zIndexOffset: atRisk ? 3000 : 1200
        }).on('click', function(e) { L.DomEvent.stopPropagation(e); filterToRoute(r.SHP_LG_ROUTE_ID, e.latlng, popup(r)); });
        markerLayer.addLayer(pingMarker);
        objs.push(pingMarker);
      } else {
        const vMarker = L.circleMarker([mLat, mLng], {
          radius: 5, color: '#fff', weight: 1.5, fillColor: mc, fillOpacity: 0.95
        }).bindPopup(popup(r), { maxWidth: 320 });
        markerLayer.addLayer(vMarker);
        objs.push(vMarker);
      }

      // Linha pontilhada do veículo ao destino — só no modo detalhe
      if (singleRoute && lastPing) {
        const ahead = L.polyline([[mLat, mLng], [dLat, dLng]], {
          color: color, weight: 1.2, opacity: 0.30, dashArray: '4,8'
        }).addTo(arcLayer);
        objs.push(ahead);
      }
    }


    routeObjects[r.SHP_LG_ROUTE_ID] = objs;
  });

  window._lastMapData = data;
  document.getElementById('count').textContent = \`\${data.filter(r => r.SHP_LG_ROUTE_STATUS !== 'FINISHED').length} ativas\`;
  updateStats(data);
  buildRiskZones();
  buildCrisisPanel();
  renderList(window._allFilteredForList || data);  // lista mostra TODOS os status
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function updateStats(data) {
  const total   = data.length;
  const ontime  = data.filter(r => r.SHP_LG_ROUTE_STATUS === 'IN_PROGRESS' && getRecalcStatus(r) === 'NO_PRAZO').length;
  const delayed = data.filter(r => r.SHP_LG_ROUTE_STATUS === 'IN_PROGRESS' && getRecalcStatus(r) === 'EM_RISCO').length;
  const semeta  = data.filter(r => r.SHP_LG_ROUTE_STATUS === 'IN_PROGRESS' && getRecalcStatus(r) === 'SEM_RECALC').length;
  const incident= data.filter(r => r.INCIDENT_TYPE).length;
  const tn = document.getElementById('kpi-total-n'); if (tn) tn.textContent = total;
  const tl = document.getElementById('kpi-total-l'); if (tl) tl.textContent = 'ROTAS';
  document.getElementById('stats').innerHTML = \`
    <div class="stat green"  title="No prazo"    onclick="quickFilter('NO_PRAZO')"   style="cursor:pointer"><div class="n">\${ontime}</div><div class="l">No Prazo</div></div>
    <div class="stat red"    title="Em risco"    onclick="quickFilter('EM_RISCO')"   style="cursor:pointer"><div class="n">\${delayed}</div><div class="l">Em Risco</div></div>
    <div class="stat yellow" title="Sem recalc"  onclick="quickFilter('SEM_RECALC')" style="cursor:pointer"><div class="n">\${semeta}</div><div class="l">Sem Recalc</div></div>
    <div class="stat orange" title="Incidentes"  onclick="quickFilter('incident')"   style="cursor:pointer"><div class="n">\${incident}</div><div class="l">Incidentes</div></div>
  \`;
  const _dfrom = (document.getElementById('fDateFrom')||{value:''}).value;
  const _dto   = (document.getElementById('fDateTo')||{value:''}).value;
  const allForDate = RAW_DATA.filter(r => {
    const dt = String(r.ETA_DATE || '').slice(0,10);
    if (_dfrom && dt < _dfrom) return false;
    if (_dto   && dt > _dto)   return false;
    return true;
  });
  updateCapacityPanel(allForDate);
}

// ── Painel de Capacidade da Frota ─────────────────────────────────────────────
function updateCapacityPanel(data) {
  const panel = document.getElementById('capacity-panel');
  if (!panel) return;

  const activeData = data.filter(r => !['CANCELLED','CANCELED'].includes(r.SHP_LG_ROUTE_STATUS));
  const total = activeData.length;
  if (total === 0) { panel.innerHTML = '<span style="color:#94a3b8">Sem dados para a data selecionada.</span>'; return; }

  // Status split
  const nInProg  = activeData.filter(r => r.SHP_LG_ROUTE_STATUS === 'IN_PROGRESS').length;
  const nFinish  = activeData.filter(r => r.SHP_LG_ROUTE_STATUS === 'FINISHED').length;
  const nPending = activeData.filter(r => r.SHP_LG_ROUTE_STATUS === 'PENDING').length;
  const nOther   = activeData.length - nInProg - nFinish - nPending;

  // LF oficial (SHP_PALLETIZABLE_LOAD_FACTOR_PERC) — mesma métrica do card de rota
  const withLFp  = activeData.filter(r => r.LF_PALLET_PERC != null && r.LF_PALLET_PERC !== '');
  const lfPct    = withLFp.length > 0 ? Math.round(withLFp.reduce((a, r) => a + +r.LF_PALLET_PERC, 0) / withLFp.length) : null;
  // Paletes ocupados/total (para exibir PALETES e OCIOSO)
  const withLF   = activeData.filter(r => +r.SHP_TOTAL_PALLET_POSITIONS_LF_AMT > 0);
  const sumOccup = withLF.reduce((a, r) => a + (+r.SHP_OCCUPIED_PALLET_POSITIONS_LF_AMT || 0), 0);
  const sumTotal = withLF.reduce((a, r) => a + (+r.SHP_TOTAL_PALLET_POSITIONS_LF_AMT || 0), 0);
  const palPct   = sumTotal > 0 ? Math.round(sumOccup / sumTotal * 100) : null;
  const idlePal  = Math.round(sumTotal - sumOccup);
  const lfCol    = lfPct === null ? '#94a3b8' : lfPct >= 80 ? '#16a34a' : lfPct >= 50 ? '#d97706' : '#dc2626';
  const lfBar    = lfPct !== null
    ? \`<div style="width:60px;height:5px;background:#e2e8f0;border-radius:3px;overflow:hidden;display:inline-block;vertical-align:middle;margin:0 4px">
        <div style="width:\${Math.min(100,lfPct)}%;height:100%;background:\${lfCol};border-radius:3px"></div></div>\`
    : '';

  // Peso estimado na rua
  const withW   = activeData.filter(r => +r.VEHICLE_CAP_KG > 0 && r.LF_PALLET_PERC != null);
  const sumWkg  = withW.reduce((a, r) => a + (+r.LF_PALLET_PERC / 100 * +r.VEHICLE_CAP_KG), 0);
  const sumCapKg= withW.reduce((a, r) => a + (+r.VEHICLE_CAP_KG), 0);
  const pesoT   = sumWkg  > 0 ? (sumWkg  / 1000).toFixed(0) + 't' : '—';
  const capTotT = sumCapKg> 0 ? (sumCapKg/ 1000).toFixed(0) + 't' : null;

  // Avg shp/pallet
  const withSpp = activeData.filter(r => +r.AVG_SHP_PER_PAL > 0);
  const avgSpp  = withSpp.length > 0 ? (withSpp.reduce((a, r) => a + +r.AVG_SHP_PER_PAL, 0) / withSpp.length).toFixed(1) : '—';

  // Volume LF médio
  const withVol = activeData.filter(r => r.LF_VOLUME_PERC != null && r.LF_VOLUME_PERC !== '');
  const avgVol  = withVol.length > 0 ? Math.round(withVol.reduce((a, r) => a + +r.LF_VOLUME_PERC, 0) / withVol.length) : null;

  // FORECAST vs ADICIONAL
  const nForecast  = activeData.filter(r => (r.SHP_ORDER_TYPE||'').toUpperCase() === 'FORECAST').length;
  const nAdicional = activeData.filter(r => { const t = (r.SHP_ORDER_TYPE||'').toUpperCase(); return t === 'ADICIONAL' || t === 'ADDITIONAL'; }).length;
  const fPct = total > 0 ? Math.round(nForecast  / total * 100) : 0;
  const aPct = total > 0 ? Math.round(nAdicional / total * 100) : 0;

  const capPct = (sumWkg > 0 && sumCapKg > 0) ? Math.round(sumWkg / sumCapKg * 100) : null;

  // Só mostrar FROTA se a aba E2E estiver ativa (não no Mapa)
  if (typeof _currentTabIdx === 'undefined' || TABS[_currentTabIdx] !== 'list') return;
  panel.style.display = 'flex';
  panel.innerHTML = \`
    <div class="frota-title">FROTA</div>
    <div class="frota-grid">
      <div class="frota-kpi" title="Load Factor (paletes)">
        <div class="fk-l">LF</div>
        <div class="fk-v" style="color:\${lfCol}">\${lfPct !== null ? lfPct + '%' : '—'}</div>
        <div class="frota-bar-wrap"><div class="frota-bar-fill" style="width:\${Math.min(100,lfPct||0)}%;background:\${lfCol}"></div></div>
      </div>
      <div class="frota-kpi" title="Paletes ocupados / total">
        <div class="fk-l">PALETES</div>
        <div class="fk-v">\${Math.round(sumOccup).toLocaleString('pt-BR')}<span> / \${Math.round(sumTotal).toLocaleString('pt-BR')}\${palPct !== null ? ' · ' + palPct + '%' : ''}</span></div>
      </div>
      <div class="frota-kpi" title="Paletes ociosos">
        <div class="fk-l">OCIOSO</div>
        <div class="fk-v" style="color:\${idlePal > 2000 ? '#FF3333' : '#2D3236'}">\${idlePal > 0 ? idlePal.toLocaleString('pt-BR') : '—'}</div>
      </div>
      <div class="frota-kpi" title="Peso estimado vs capacidade">
        <div class="fk-l">PESO</div>
        <div class="fk-v">\${pesoT}\${capTotT ? \`<span> / \${capTotT}\${capPct !== null ? ' · ' + capPct + '%' : ''}</span>\` : ''}</div>
      </div>
      <div class="frota-kpi" title="Volume médio (waterfill)">
        <div class="fk-l">VOL</div>
        <div class="fk-v">\${avgVol !== null ? avgVol + '%' : '—'}</div>
      </div>

      <div class="frota-kpi" title="Rotas Forecast" style="cursor:pointer" onclick="filterListByStatus('FORECAST')">
        <div class="fk-l">FORECAST</div>
        <div class="fk-v">\${nForecast}<span> (\${fPct}%)</span></div>
      </div>
      <div class="frota-kpi" title="Rotas Adicional" style="cursor:pointer" onclick="filterListByStatus('ADICIONAL')">
        <div class="fk-l">ADICIONAL</div>
        <div class="fk-v" style="color:#F97316">\${nAdicional}<span> (\${aPct}%)</span></div>
      </div>
    </div>

    \${(() => {
      // ── Agregados de pacotes e custos ─────────────────────────────────────
      const totalPkgs  = activeData.reduce((a, r) => a + (+r.PRIO_TOTAL    || 0), 0);
      if (!totalPkgs) return '';

      const totalFast  = activeData.reduce((a, r) => a + (+r.PRIO_FAST     || 0), 0);
      const totalChp   = activeData.reduce((a, r) => a + (+r.PRIO_CHEAPEST || 0), 0);
      const totalSlow  = activeData.reduce((a, r) => a + (+r.PRIO_SLOW     || 0), 0);
      const totalStd   = activeData.reduce((a, r) => a + (+r.PRIO_STANDARD || 0), 0);
      const totalOth   = activeData.reduce((a, r) => a + (+r.PRIO_OTHER    || 0), 0);
      const pct = v => totalPkgs > 0 ? Math.round(v / totalPkgs * 100) : 0;
      const fmt2 = v => v.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});

      // CPS / CPHU ponderados pelas rotas que têm dado
      const costRoutes = activeData.filter(r => r.COST_CPS != null && +r.COST_CPS > 0);
      const avgCPS  = costRoutes.length ? costRoutes.reduce((a,r)=>a+(+r.COST_CPS||0),0)/costRoutes.length : null;
      const avgCPHU = costRoutes.length ? costRoutes.reduce((a,r)=>a+(+r.COST_CPHU||0),0)/costRoutes.length : null;
      const sumFrete = activeData.reduce((a,r) => a + (+r.COST_GROUND || 0), 0);
      const occRoutes = activeData.filter(r => r.COST_OCCUPATION != null && +r.COST_OCCUPATION > 0);
      const avgOcc  = occRoutes.length ? occRoutes.reduce((a,r)=>a+(+r.COST_OCCUPATION||0),0)/occRoutes.length : null;

      // DIT
      const totalDitLH    = activeData.reduce((a,r) => a + (+r.DIT_LH_COUNT || 0), 0);
      const totalDitTotal = activeData.reduce((a,r) => a + (+r.DIT_COUNT     || 0), 0);
      const totalDitOtros = Math.max(0, totalDitTotal - totalDitLH);

      return \`
      <div style="width:100%;border-top:1px solid #E0E0E0;margin:4px 0 2px"></div>
      <div class="frota-grid">
        <div class="frota-kpi" title="Total de pacotes em todas as rotas do período">
          <div class="fk-l">PACOTES</div>
          <div class="fk-v">\${totalPkgs.toLocaleString('pt-BR')}</div>
        </div>
        <div class="frota-kpi" title="Pacotes CHEAPEST (classe 60)">
          <div class="fk-l">⬜ CHEAPEST</div>
          <div class="fk-v">\${totalChp.toLocaleString('pt-BR')}<span> (\${pct(totalChp)}%)</span></div>
        </div>
        <div class="frota-kpi" title="Pacotes FAST (classes 10/20/25)">
          <div class="fk-l">⚡ FAST</div>
          <div class="fk-v">\${totalFast.toLocaleString('pt-BR')}<span> (\${pct(totalFast)}%)</span></div>
        </div>
        <div class="frota-kpi" title="Pacotes SLOW (classe 50)">
          <div class="fk-l">🟡 SLOW</div>
          <div class="fk-v">\${totalSlow.toLocaleString('pt-BR')}<span> (\${pct(totalSlow)}%)</span></div>
        </div>
        <div class="frota-kpi" title="Pacotes STANDARD (classe 30)">
          <div class="fk-l">🔵 STD</div>
          <div class="fk-v">\${totalStd.toLocaleString('pt-BR')}<span> (\${pct(totalStd)}%)</span></div>
        </div>
        \${totalOth > 0 ? \`<div class="frota-kpi" title="Pacotes sem classificação"><div class="fk-l">❓ S/INFO</div><div class="fk-v" style="color:#94a3b8">\${totalOth.toLocaleString('pt-BR')}<span> (\${pct(totalOth)}%)</span></div></div>\` : ''}
        \${avgCPS  !== null ? \`<div class="frota-kpi" title="CPS — Custo médio por pacote (média das rotas com dado)"><div class="fk-l">💰 CPS</div><div class="fk-v">R$\${fmt2(avgCPS)}</div></div>\` : ''}
        \${avgCPHU !== null ? \`<div class="frota-kpi" title="CPHU — Custo médio por HU (média das rotas com dado)"><div class="fk-l">CPHU</div><div class="fk-v">R$\${fmt2(avgCPHU)}</div></div>\` : ''}
        \${sumFrete > 0    ? \`<div class="frota-kpi" title="Cost Ground — Soma do frete rodoviário de todas as rotas"><div class="fk-l">🚚 FRETE</div><div class="fk-v">R$\${sumFrete.toLocaleString('pt-BR',{maximumFractionDigits:0})}</div></div>\` : ''}
        \${avgOcc  !== null ? \`<div class="frota-kpi" title="Occupation — Taxa de ocupação média das rotas com dado de custo"><div class="fk-l">OCC</div><div class="fk-v">\${Math.round(avgOcc <= 1 ? avgOcc*100 : avgOcc)}%</div></div>\` : ''}
        <div class="frota-kpi" title="DIT LH — Delay In Transit com culpa Line Haul (Meli)\\nClique para filtrar rotas com DIT LH" style="cursor:pointer" onclick="filterListByDIT('LH')">
          <div class="fk-l">🔴 DIT LH</div>
          <div class="fk-v" style="color:\${totalDitLH > 0 ? '#dc2626' : '#94a3b8'}">\${totalDitLH.toLocaleString('pt-BR')}</div>
        </div>
        <div class="frota-kpi" title="DIT Outros — Delay In Transit com outras causas\\nClique para filtrar rotas com DIT Outros" style="cursor:pointer" onclick="filterListByDIT('OUTROS')">
          <div class="fk-l">🟠 DIT OUTROS</div>
          <div class="fk-v" style="color:\${totalDitOtros > 0 ? '#ea580c' : '#94a3b8'}">\${totalDitOtros.toLocaleString('pt-BR')}</div>
        </div>
      </div>\`;
    })()}
  \`;
}

function quickFilter(type) {
  resetFilters(false);
  const CANCELLED = ['CANCELLED', 'CANCELED', 'FINISHED'];
  let f = RAW_DATA.filter(r => !CANCELLED.includes(r.SHP_LG_ROUTE_STATUS));
  if (type === 'NO_PRAZO')   f = f.filter(r => r.SHP_LG_ROUTE_STATUS === 'IN_PROGRESS' && getRecalcStatus(r) === 'NO_PRAZO');
  if (type === 'EM_RISCO')   f = f.filter(r => r.SHP_LG_ROUTE_STATUS === 'IN_PROGRESS' && getRecalcStatus(r) === 'EM_RISCO');
  if (type === 'SEM_RECALC') f = f.filter(r => r.SHP_LG_ROUTE_STATUS === 'IN_PROGRESS' && getRecalcStatus(r) === 'SEM_RECALC');
  if (type === 'incident')   f = f.filter(r => r.INCIDENT_TYPE);
  drawRoutes(f);
}

// ── Filtros ───────────────────────────────────────────────────────────────────
// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS      = ['map', 'list'];
const TAB_NAMES = { map: '🗺️ Mapa', list: '📋 E2E' };
var _currentTabIdx = 0;

function navigateTab(dir) {
  _currentTabIdx = (_currentTabIdx + dir + TABS.length) % TABS.length;
  switchTab(TABS[_currentTabIdx]);
}

function switchTab(tab) {
  const isMap = tab === 'map';
  _currentTabIdx = TABS.indexOf(tab); if (_currentTabIdx < 0) _currentTabIdx = 0;

  // Conteúdo
  document.getElementById('map').style.display            = isMap ? '' : 'none';
  document.getElementById('list-view').style.display      = isMap ? 'none' : 'flex';
  document.getElementById('truck-legend').style.display   = isMap ? '' : 'none';
  document.getElementById('capacity-panel').style.display = isMap ? 'none' : '';
  const _e2eSub = document.getElementById('e2e-subtitle');
  if (_e2eSub) _e2eSub.style.display = isMap ? 'none' : 'flex';
  const _e2eGap = document.getElementById('e2e-gap');
  if (_e2eGap) _e2eGap.style.display = isMap ? 'none' : 'block';

  // Tab-bar oculta (compat)
  const _tabMap  = document.getElementById('tab-map');  if (_tabMap)  _tabMap.classList.toggle('active', isMap);
  const _tabList = document.getElementById('tab-list'); if (_tabList) _tabList.classList.toggle('active', !isMap);

  // Sidebar — itens de navegação
  document.querySelectorAll('.sb-tab-item').forEach(el => el.classList.remove('active'));
  const sbTabEl = document.getElementById('sb-tab-' + tab);
  if (sbTabEl) sbTabEl.classList.add('active');

  // Ferramentas — só no Mapa
  const mapTools = document.getElementById('sb-map-tools');
  if (mapTools) mapTools.style.display = isMap ? '' : 'none';

  if (!isMap) {
    const listData = window._allFilteredForList || window._lastFilteredData || [];
    updateListStats(listData);
    renderList(listData);
  } else {
    if (window._lastMapData) updateStats(window._lastMapData);
    setTimeout(function() { map.invalidateSize(); map.fitBounds(DEFAULT_BOUNDS); }, 50);
  }
}

// ── Grand numbers da aba Lista ─────────────────────────────────────────────────
function updateListStats(data) {
  const total    = data.length;
  const inProg   = data.filter(r => r.SHP_LG_ROUTE_STATUS === 'IN_PROGRESS').length;
  const finished = data.filter(r => r.SHP_LG_ROUTE_STATUS === 'FINISHED').length;
  const pending  = data.filter(r => r.SHP_LG_ROUTE_STATUS === 'PENDING').length;
  const cancelled= data.filter(r => ['CANCELLED','CANCELED'].includes(r.SHP_LG_ROUTE_STATUS)).length;
  const tn = document.getElementById('kpi-total-n'); if (tn) tn.textContent = total;
  const tl = document.getElementById('kpi-total-l'); if (tl) tl.textContent = 'ROTAS';
  document.getElementById('stats').innerHTML = \`
    <div class="stat green"  onclick="filterListByStatus('IN_PROGRESS')" style="cursor:pointer"><div class="n">\${inProg}</div><div class="l">Em Andamento</div></div>
    <div class="stat gray"   onclick="filterListByStatus('FINISHED')"    style="cursor:pointer"><div class="n">\${finished}</div><div class="l">Finalizado</div></div>
    <div class="stat yellow" onclick="filterListByStatus('PENDING')"     style="cursor:pointer"><div class="n">\${pending}</div><div class="l">Pendente</div></div>
    <div class="stat red"    onclick="filterListByStatus('CANCELLED')"   style="cursor:pointer"><div class="n">\${cancelled}</div><div class="l">Cancelado</div></div>
  \`;
  updateCapacityPanel(data);
}
function filterListByDIT(type) {
  const all = window._allFilteredForList || [];
  const filtered = all.filter(r => {
    const lh    = +(r.DIT_LH_COUNT || 0);
    const total = +(r.DIT_COUNT    || 0);
    const outros = Math.max(0, total - lh);
    if (type === 'LH')     return lh > 0;
    if (type === 'OUTROS') return outros > 0;
    return total > 0;
  });
  renderList(filtered);
  updateCapacityPanel(filtered);
}

function filterListByStatus(status) {
  const all = window._allFilteredForList || [];
  const filtered = !status ? all : all.filter(r => {
    if (status === 'CANCELLED')  return ['CANCELLED','CANCELED'].includes(r.SHP_LG_ROUTE_STATUS);
    if (status === 'FORECAST')   return (r.SHP_ORDER_TYPE||'').toUpperCase() === 'FORECAST';
    if (status === 'ADICIONAL')  { const t = (r.SHP_ORDER_TYPE||'').toUpperCase(); return t === 'ADICIONAL' || t === 'ADDITIONAL'; }
    return r.SHP_LG_ROUTE_STATUS === status;
  });
  renderList(filtered);
  updateCapacityPanel(filtered);
}

// ── Helpers de tempo ─────────────────────────────────────────────────────────
function toDate(s) {
  if (!s) return null;
  const d = new Date(String(s).replace(' ','T') + '-03:00');
  return isNaN(d) ? null : d;
}
function elapsedStr(startStr, endStr) {
  const s = toDate(startStr);
  if (!s) return '—';
  const e = endStr ? toDate(endStr) : new Date();
  if (!e) return '—';
  const mins = Math.round((e - s) / 60000);
  if (mins < 0) return '—';
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? h + 'h' + String(m).padStart(2,'0') + 'm' : m + 'm';
}
function fmtHHMM(s) {
  if (!s) return '—';
  const t = String(s).replace('T',' ');
  const hm = t.slice(11,16);
  return /^\\d{2}:\\d{2}$/.test(hm) ? hm : '—';  // rejeita valores inválidos (ex: "-03:30")
}
function fmtDDHHMM(s) {
  // Retorna "DD/MM HH:MM" — usado no display quando datas podem diferir
  if (!s) return '—';
  const t = String(s).replace('T',' ');
  const hm = t.slice(11,16);
  if (!/^\\d{2}:\\d{2}$/.test(hm)) return '—';
  const dd = t.slice(8,10), mm = t.slice(5,7);
  return \`\${dd}/\${mm} \${hm}\`;
}

// ── Timeline de checkpoints (história da rota) ────────────────────────────────
function makeTimeline(r, accentColor) {
  // Tolerância de 20min59s: só é atraso quando ultrapassa planned + tolerância
  const TOLERANCE_MS = (20 * 60 + 59) * 1000;
  function cpColor(actual, planned) {
    if (!actual) return 'gray';
    if (!planned) return 'green';
    const a = new Date(String(actual).replace(' ','T') + '-03:00');
    const p = new Date(String(planned).replace(' ','T') + '-03:00');
    return a <= new Date(p.getTime() + TOLERANCE_MS) ? 'green' : 'red';
  }
  const COL = { green: '#22c55e', red: '#ef4444', gray: '#cbd5e1' };
  const LBL = { green: '#15803d', red: '#dc2626', gray: '#94a3b8' };

  // 12 checkpoints — sequência completa Origem → Destino (ordem cronológica)
  // FOS Inbound após Dock In Destino: fisicamente, HUs são bipados/lidos após o caminhão docar
  // showMeta: mostra linha "→planejado" apenas nos gates principais
  const checks = [
    { label: 'Pre-check\\nOrigem',  val: r.ORIGIN_PRE_CHECK_DTTM,            planned: r.SHP_ORIGIN_ETA_DTTM,      icon: '🏭', showMeta: true,
      failed: !r.ORIGIN_PRE_CHECK_DTTM && !!(r.SHP_ORIGIN_ATA_DTTM || r.SHP_ORIGIN_ATD_DTTM),
      tip: 'Pré-check Origem\\nValidação do veículo e motorista\\nanterior à saída do hub' },
    { label: 'Gate In\\nOrigem',    val: r.SHP_ORIGIN_ATA_DTTM,              planned: r.SHP_ORIGIN_ETA_DTTM,      icon: '📥', showMeta: true,
      tip: 'Gate In Origem\\nEntrada do veículo na portaria\\ndo hub de origem (ATA)' },
    { label: 'Dock In\\nOrigem',    val: r.SHP_ORIGIN_DOCK_IN_DTTM,          planned: null,                        icon: '🚪', showMeta: false,
      tip: 'Dock In Origem\\nVeículo acoplado na doca\\nInício do carregamento' },
    { label: 'Dock Out\\nOrigem',   val: r.SHP_ORIGIN_DOCK_OUT_DTTM,         planned: null,                        icon: '🚪', showMeta: false,
      tip: 'Dock Out Origem\\nSaída da doca de origem\\nCarregamento concluído' },
    { label: 'Gate Out\\nOrigem',   val: r.SHP_ORIGIN_ATD_DTTM,              planned: r.SHP_ORIGIN_ETD_DTTM,      icon: '🚛', showMeta: true,
      tip: 'Gate Out Origem (ATD)\\nVeículo saiu do hub de origem\\nInício do percurso LH' },
    { label: 'Pre-check\\nDestino', val: r.DEST_PRE_CHECK_DTTM,               planned: r.SHP_DESTINATION_ETA_DTTM, icon: '📡', showMeta: true,
      failed: !r.DEST_PRE_CHECK_DTTM && !!(r.SHP_DESTINATION_ATA_DTTM || r.SHP_DESTINATION_ATD_DTTM),
      tip: 'Pré-check Destino\\nDetecção GPS próxima ao destino\\nRecalcula ETA em tempo real' },
    { label: 'Gate In\\nDestino',   val: r.SHP_DESTINATION_ATA_DTTM,         planned: r.SHP_DESTINATION_ETA_DTTM, icon: '🏁', showMeta: true,
      tip: 'Gate In Destino (ATA)\\nChegada do veículo na portaria\\ndo hub de destino' },
    { label: 'Dock In\\nDestino',   val: r.SHP_DESTINATION_DOCK_IN_DTTM,     planned: null,                        icon: '🚪', showMeta: false,
      tip: 'Dock In Destino\\nVeículo acoplado na doca\\nInício do descarregamento' },
    { label: 'FOS\\nInbound',       val: r.FOS_FINISH_DTTM,                   planned: r.SHP_DESTINATION_ETA_DTTM, icon: '📲', showMeta: true,
      isFos: true, fosSim: +(r.FOS_SIM_COUNT||0), fosTotal: +(r.FOS_TOTAL_COUNT||0),
      tip: 'FOS Inbound\\nScan de recebimento dos HUs\\nConfirma entrega física da carga' },
    { label: 'Dock Out\\nDestino',  val: r.SHP_DESTINATION_DOCK_OUT_DTTM,    planned: null,                        icon: '🚪', showMeta: false,
      tip: 'Dock Out Destino\\nSaída da doca de destino\\nDescarregamento concluído' },
    { label: 'Gate Out\\nDestino',  val: r.SHP_DESTINATION_ATD_DTTM,         planned: r.SHP_DESTINATION_ETD_DTTM, icon: '🚛', showMeta: true,
      tip: 'Gate Out Destino (ATD)\\nVeículo saiu do hub de destino\\nEncerramento da rota LH' },
    { label: 'DIT\\nAnálise',       val: null,                                 planned: null,                        icon: '📦', showMeta: false,
      isDit: true, ditCount: +(r.DIT_COUNT||0), ditLhCount: +(r.DIT_LH_COUNT||0),
      ditCauses: r.DIT_CAUSES||'', ditDetail: r.DIT_DETAIL||'',
      tip: 'DIT — Delay In Transit\\nTotal: todos os atrasos da rota\\nLH: culpa Line Haul (Meli)\\nClique para ver lista' },
  ];

  // Determina até qual checkpoint chegou
  let reached = -1;
  const status = r.SHP_LG_ROUTE_STATUS;
  if (status === 'PENDING') reached = 0;
  // Índices: 0=PreChk Orig,1=GateIn Orig,2=DockIn Orig,3=DockOut Orig,4=GateOut Orig,
  //          5=PreChk Dest,6=GateIn Dest,7=DockIn Dest,8=FOS Inbound,9=DockOut Dest,
  //          10=GateOut Dest, 11=DIT Análise
  if (status === 'IN_PROGRESS') {
    if      (r.SHP_DESTINATION_ATD_DTTM)          reached = 10;
    else if (r.SHP_DESTINATION_DOCK_OUT_DTTM)     reached = 9;
    else if (r.FOS_FINISH_DTTM)                   reached = 8;
    else if (r.SHP_DESTINATION_DOCK_IN_DTTM)      reached = 7;
    else if (r.SHP_DESTINATION_ATA_DTTM)          reached = 6;
    else if (r.DEST_PRE_CHECK_DTTM)               reached = 5;
    else if (r.SHP_ORIGIN_ATD_DTTM)               reached = 4;
    else if (r.SHP_ORIGIN_DOCK_OUT_DTTM)          reached = 3;
    else if (r.SHP_ORIGIN_DOCK_IN_DTTM)           reached = 2;
    else if (r.SHP_ORIGIN_ATA_DTTM)               reached = 1;
    else                                            reached = 0;
  }
  if (status === 'FINISHED') {
    reached = 11; // mostra DIT analysis completo quando rota finalizada
    if (!r.SHP_DESTINATION_ATD_DTTM)              reached = 9;
    else if (!r.SHP_DESTINATION_DOCK_IN_DTTM)     reached = 7;
  }

  // Próximo checkpoint aguardado (tem planned time) — só para IN_PROGRESS
  const now = new Date();
  let waitingIdx = -1;
  let waitingDelay = 0;
  if (status === 'IN_PROGRESS') {
    for (let j = reached + 1; j < checks.length; j++) {
      if (checks[j].planned) {
        waitingIdx = j;
        const p = new Date(String(checks[j].planned).replace(' ','T') + '-03:00');
        waitingDelay = Math.floor((now - p) / 60000);
        break;
      }
    }
  }

  // Layout compacto para 10 dots
  const PEND_COL  = '#e2e8f0';
  const DOT_SZ    = '16px';
  const CONN_H    = '4px';
  const BADGE_H   = '18px';  // altura reservada para badge acima do dot (igual em todos)
  const MT_DOT    = '24px';  // margin-top do conector = BADGE_H(18) + offset(6) = alinha ao centro do dot

  let html = '<div style="display:flex;align-items:flex-start;gap:0;margin:8px 0 4px;overflow:hidden;min-width:100%">';

  checks.forEach((cp, i) => {
    const done    = i <= reached;
    const waiting = i === waitingIdx;
    const failed  = !!cp.failed;
    const state   = failed ? 'red' : (done ? cpColor(cp.val, cp.planned) : 'gray');
    const dotCol  = COL[state];
    const lblCol  = LBL[state];
    // fallback '—' para checkpoints de origem sem dado (i < 5); 'FALHA' para failed
    const valTxt  = failed ? 'FALHA' : (cp.val ? fmtHHMM(cp.val) : (done && i < 5 ? '—' : ''));

    const isLate  = waiting && waitingDelay > 0;
    const pulse   = failed || (done && state === 'red') || isLate ? 'animation:tlPulse 1.4s infinite;' : '';

    const delayBadge = isLate
      ? \`<div style="background:#ef4444;color:#fff;border-radius:10px;padding:1px 5px;font-size:8px;font-weight:700;white-space:nowrap;animation:tlPulse 1.4s infinite">+\${waitingDelay}min</div>\`
      : '';

    const waitDotStyle = waiting
      ? \`background:#fff;border:2px solid \${isLate ? '#ef4444' : '#94a3b8'};\${pulse}\`
      : '';

    if (i > 0) {
      const connCol = done ? '#22c55e' : PEND_COL;
      html += \`<div style="flex:1;height:\${CONN_H};background:\${connCol};margin-top:\${MT_DOT};min-width:3px;border-radius:2px"></div>\`;
    }

    const dotInner = failed ? '✕' : (done ? cp.icon : (waiting ? (isLate ? '⏳' : '⏱') : ''));
    const dotStyle = waiting ? waitDotStyle : \`background:\${dotCol};\${pulse}\`;
    // meta: mostra "DD/MM HH:MM" para deixar a data explícita (evita confusão de dia)
    const plannedFmt = cp.showMeta && cp.planned ? fmtDDHHMM(cp.planned) : '';
    const metaLine = plannedFmt && plannedFmt !== '—'
      ? \`<div style="font-size:7.5px;color:#94a3b8;line-height:1.3;margin-top:2px;white-space:nowrap">meta \${plannedFmt}</div>\` : '';

    // delta: usa datetime completo (data + hora + min + seg) para não errar quando cruzam meia-noite
    let deltaLine = '';
    if (cp.showMeta && cp.planned && cp.val && valTxt && valTxt !== '—') {
      const a = new Date(String(cp.val).replace(' ','T') + '-03:00');
      const p = new Date(String(cp.planned).replace(' ','T') + '-03:00');
      if (!isNaN(a) && !isNaN(p)) {
        const diffMin = Math.round((a - p) / 60000);
        if (diffMin !== 0) {
          const sign = diffMin > 0 ? '+' : '-';
          const abs  = Math.abs(diffMin);
          const txt  = abs >= 60
            ? \`\${sign}\${Math.floor(abs/60)}h\${abs%60 > 0 ? (abs%60)+'m' : ''}\`
            : \`\${sign}\${abs}min\`;
          // cor: verde se dentro da tolerância (≤20min59s), vermelho se venceu
          const lateMs = a - p - TOLERANCE_MS;
          const col    = lateMs <= 0 ? '#16a34a' : '#dc2626';
          deltaLine    = \`<div style="font-size:7.5px;color:\${col};font-weight:700;line-height:1.3;white-space:nowrap">\${txt}</div>\`;
        }
      }
    }

    // ── DIT: step especial (não é timestamp, é contagem) ─────────────────────
    // Nota: o connector já foi adicionado acima (linhas 2453-2455) — não duplicar aqui
    if (cp.isDit) {
      const n   = cp.ditCount   || 0;
      const nLh = cp.ditLhCount || 0;
      // DIT só é conclusivo após a chegada ao destino; antes = ainda não analisado
      const arrivedAtDest = !!(r.SHP_DESTINATION_ATA_DTTM) || r.SHP_LG_ROUTE_STATUS === 'FINISHED';
      const nOther = n - nLh;
      // Dot: vermelho se tem LH, laranja se só outros, verde se zero (chegou), cinza se não chegou
      const ditCol = nLh > 0 ? '#dc2626' : (n > 0 ? '#f59e0b' : (arrivedAtDest ? '#16a34a' : '#94a3b8'));
      const ditBg  = nLh > 0 ? '#fee2e2' : (n > 0 ? '#fef3c7' : (arrivedAtDest ? '#dcfce7' : '#f1f5f9'));
      const dotIcon = n === 0 ? (arrivedAtDest ? '✓' : '—') : (nLh > 0 ? '!' : '△');
      const ditClickable = n > 0 && cp.ditDetail ? \`onclick="showDitPopup(this)" data-detail='\${cp.ditDetail.replace(/'/g,"&#39;")}' data-route="\${r.SHP_LG_ROUTE_ID||''}" style="cursor:pointer"\` : '';
      const ditTip = cp.tip ? \` data-tip="\${cp.tip}"\` : '';
      // Sempre mostrar LH e Outros separados
      const lhCol    = nLh    > 0 ? '#dc2626' : '#94a3b8';
      const otherCol = nOther > 0 ? '#f59e0b' : '#94a3b8';
      const clickHint = n > 0 ? ' 🔍' : '';
      html += \`<div class="ck-tip" style="display:flex;flex-direction:column;align-items:center;min-width:44px" \${ditClickable}\${ditTip}>
        <div style="height:\${BADGE_H}"></div>
        <div style="width:\${DOT_SZ};height:\${DOT_SZ};border-radius:50%;background:\${ditBg};border:2px solid \${ditCol};display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:\${ditCol};flex-shrink:0">\${dotIcon}</div>
        <div style="font-size:8px;color:#64748b;text-align:center;white-space:pre-line;margin-top:2px;line-height:1.2">\${cp.label}\${clickHint}</div>
        <div style="font-size:8px;font-weight:700;color:\${lhCol};margin-top:2px;white-space:nowrap">LH: \${nLh}</div>
        <div style="font-size:8px;font-weight:600;color:\${otherCol};margin-top:1px;white-space:nowrap">Outros: \${nOther}</div>
      </div>\`;
      return;
    }

    // FOS badge: contagem de pcts com FOS success (val line já mostra o MIN date)
    const fosBadge = cp.isFos && cp.fosTotal > 0
      ? (() => {
          const pct  = Math.round(cp.fosSim / cp.fosTotal * 100);
          const col  = pct >= 95 ? '#16a34a' : pct >= 80 ? '#f59e0b' : '#dc2626';
          return \`<div style="font-size:7.5px;font-weight:700;color:\${col};margin-top:1px;text-align:center;line-height:1.2">✓ \${cp.fosSim} pcts<br>(\${pct}%)</div>\`;
        })()
      : '';
    const ckTip = cp.tip ? \` data-tip="\${cp.tip}"\` : '';
    html += \`<div class="ck-tip" style="display:flex;flex-direction:column;align-items:center;min-width:36px"\${ckTip}>
      <div style="height:\${BADGE_H};display:flex;align-items:flex-end;justify-content:center">\${delayBadge}</div>
      <div style="width:\${DOT_SZ};height:\${DOT_SZ};border-radius:50%;\${dotStyle}display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0">\${dotInner}</div>
      <div style="font-size:8px;color:\${waiting && isLate ? '#dc2626' : lblCol};text-align:center;white-space:pre-line;margin-top:2px;line-height:1.2">\${cp.label}</div>
      \${metaLine}
      <div style="font-size:9px;color:\${waiting && isLate ? '#dc2626' : lblCol};font-weight:700;margin-top:1px">\${cp.showMeta && cp.val && valTxt && valTxt !== '—' ? fmtDDHHMM(cp.val) : (valTxt || '')}</div>
      \${deltaLine}
      \${fosBadge}
    </div>\`;
  });

  html += '</div>';
  return html;
}

// ── DIT Popup ──────────────────────────────────────────────────────────────────
function showDitPopup(el) {
  const raw = el.getAttribute('data-detail') || '[]';
  const route = el.getAttribute('data-route') || '';
  let items = [];
  try { items = JSON.parse(raw); } catch(e) { items = []; }
  const modal = document.getElementById('dit-modal');
  document.getElementById('dit-modal-title').textContent = \`DIT — Rota \${route} (\${items.length} pcts)\`;
  const body = document.getElementById('dit-modal-body');
  if (items.length === 0) {
    body.innerHTML = '<div style="color:#64748b;font-size:13px;padding:8px 0">Nenhum pacote com DIT.</div>';
  } else {
    body.innerHTML =
      \`<div class="dit-row" style="font-weight:700;color:#64748b;font-size:10px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;margin-bottom:2px">
        <span style="min-width:22px"></span>
        <span style="flex:0 0 110px">SHIPMENT</span>
        <span>CAUSA</span>
      </div>\` +
      items.map((it,i) => {
        const isLh = it.cause_l2 === 'Line Haul';
        const causeStyle = isLh
          ? 'color:#fff;background:#dc2626;border-radius:4px;padding:2px 7px;font-size:11px;font-weight:700'
          : 'color:#92400e;background:#fef3c7;border-radius:4px;padding:2px 7px;font-size:11px;font-weight:600';
        return \`<div class="dit-row" style="\${isLh ? 'background:#fff5f5' : ''}">
          <span style="color:#94a3b8;font-size:10px;min-width:22px">\${i+1}.</span>
          <span class="dit-row-shp" style="flex:0 0 110px">\${it.shp||'—'}</span>
          <span style="\${causeStyle}">\${it.cause||'—'}</span>
        </div>\`;
      }).join('');
  }
  modal.classList.add('open');
}
document.addEventListener('click', function(e) {
  const modal = document.getElementById('dit-modal');
  if (e.target === modal) modal.classList.remove('open');
});

// ── Checkpoint Tooltip (JS fixed-position) ────────────────────────────────────
(function() {
  let tip = null;
  function gt() { return tip || (tip = document.getElementById('ck-tooltip')); }
  let _hide;
  document.addEventListener('mouseover', function(e) {
    const el = e.target.closest('[data-tip]');
    if (!el) return;
    const t = gt(); if (!t) return;
    clearTimeout(_hide);
    t.textContent = el.getAttribute('data-tip');
    t.classList.add('show');
    positionTip(e);
  });
  document.addEventListener('mousemove', function(e) {
    const t = gt(); if (!t || !t.classList.contains('show')) return;
    positionTip(e);
  });
  document.addEventListener('mouseout', function(e) {
    if (!e.target.closest('[data-tip]')) return;
    const t = gt(); if (!t) return;
    _hide = setTimeout(() => t.classList.remove('show'), 100);
  });
  function positionTip(e) {
    const t = gt(); if (!t) return;
    const tw = t.offsetWidth || 180;
    const th = t.offsetHeight || 60;
    let x = e.clientX - tw / 2;
    let y = e.clientY - th - 12;
    if (x < 4) x = 4;
    if (x + tw > window.innerWidth - 4) x = window.innerWidth - tw - 4;
    if (y < 4) y = e.clientY + 16;
    t.style.left = x + 'px';
    t.style.top  = y + 'px';
  }
})();

// ── Vista de Lista ─────────────────────────────────────────────────────────────
function renderList(data) {
  window._lastFilteredData = data;
  const el = document.getElementById('list-view');
  if (el.style.display === 'none') return;

  // Ordenação: EM RISCO → IN_PROGRESS → PENDING → SCHEDULED → FINISHED → CANCELLED
  const sortKey = r => {
    const rs = getRecalcStatus(r);
    if (r.SHP_LG_ROUTE_STATUS === 'IN_PROGRESS') {
      if (rs === 'EM_RISCO')  return 0;
      if (rs === 'NO_PRAZO')  return 1;
      if (rs === 'ADIANTADO') return 2;
      return 3;
    }
    if (r.SHP_LG_ROUTE_STATUS === 'PENDING')   return 4;
    if (r.SHP_LG_ROUTE_STATUS === 'SCHEDULED') return 5;
    if (r.SHP_LG_ROUTE_STATUS === 'FINISHED')  return 6;
    if (['CANCELLED','CANCELED'].includes(r.SHP_LG_ROUTE_STATUS)) return 7;
    return 5; // outros
  };
  const sorted = [...data].sort((a,b) => sortKey(a) - sortKey(b));

  const _sc = document.getElementById('e2e-subtitle-count');
  if (_sc) _sc.textContent = \`— \${sorted.length} rotas\`;
  el.innerHTML = sorted.map(r => {
    const status  = r.SHP_LG_ROUTE_STATUS;
    const prog    = Math.min(1, Math.max(0, +r.ROUTE_PROGRESS_PERC || 0));
    const progPct = Math.round(prog * 100);
    const pkgs    = (+r.SHP_TOTAL_PACKAGES_PICKUP_AMT || 0).toLocaleString('pt-BR');
    const rs      = getRecalcStatus(r);
    const risk    = status === 'IN_PROGRESS' ? etaRisk(r) : null;

    // Cores por estado — light theme
    let borderColor = '#cbd5e1', accentColor = '#94a3b8', statusTxt = 'NÃO INICIADA', statusBg = '#f1f5f9', statusFg = '#64748b';
    if (status === 'IN_PROGRESS') {
      statusTxt = 'EM VIAGEM'; statusBg = '#dbeafe'; statusFg = '#1d4ed8';
      if (rs === 'EM_RISCO')       { borderColor = '#ef4444'; accentColor = '#ef4444'; statusBg = '#fee2e2'; statusFg = '#dc2626'; }
      else if (rs === 'ADIANTADO') { borderColor = '#06b6d4'; accentColor = '#06b6d4'; statusBg = '#cffafe'; statusFg = '#0e7490'; }
      else                         { borderColor = '#22c55e'; accentColor = '#22c55e'; statusBg = '#dcfce7'; statusFg = '#16a34a'; }
    } else if (status === 'FINISHED') {
      statusTxt = 'CONCLUÍDA'; statusBg = '#dcfce7'; statusFg = '#16a34a';
      borderColor = DELAY_COLOR[r.DELAY_BUCKET] || '#94a3b8';
      accentColor = borderColor;
    } else if (status === 'PENDING') {
      statusTxt = 'PENDENTE'; borderColor = '#cbd5e1'; accentColor = '#94a3b8';
    } else if (status === 'SCHEDULED') {
      statusTxt = 'AGENDADA'; statusBg = '#eff6ff'; statusFg = '#3b82f6';
      borderColor = '#93c5fd'; accentColor = '#93c5fd';
    } else if (['CANCELLED','CANCELED'].includes(status)) {
      statusTxt = 'CANCELADA'; statusBg = '#f8fafc'; statusFg = '#94a3b8';
      borderColor = '#e2e8f0'; accentColor = '#cbd5e1';
    }

    // Veículo / placa
    const veh   = (r.SHP_LG_VEHICLE_TYPE || r.SHP_LG_VEHICLE_TYPE_PLANNED || 'N/I').toUpperCase();
    const plate = r.PLATE_TRACTOR || '';

    // GPS
    const gpsOnline  = r.GPS_IS_ACTIVE;
    const gpsDot     = gpsOnline ? '<span style="color:#22c55e">●</span>' : '<span style="color:#475569">●</span>';
    const gpsMinsAgo = (r.GPS_MINUTES_AGO != null && r.GPS_MINUTES_AGO !== '') ? +r.GPS_MINUTES_AGO : null;
    const offlineAge = (!gpsOnline && gpsMinsAgo !== null && gpsMinsAgo > 0)
      ? (() => { const h = Math.floor(gpsMinsAgo / 60); const m = gpsMinsAgo % 60; return h > 0 ? \` -\${h}h\${m > 0 ? m + 'm' : ''}\` : \` -\${m}m\`; })()
      : '';
    const gpsTxt    = gpsOnline ? 'ONLINE' : \`OFFLINE\${offlineAge}\`;
    // Se ONLINE mas sem pings em BQ: MeLi tem GPS via RTT live mas ainda não chegou no warehouse (~70min lag)
    const gpsType   = (gpsOnline && (!r.GPS_SOURCE_TYPE || r.GPS_SOURCE_TYPE === 'SEM_GPS'))
      ? 'RTT_LIVE'
      : (r.GPS_SOURCE_TYPE && r.GPS_SOURCE_TYPE !== 'SEM_GPS' ? r.GPS_SOURCE_TYPE : 'SEM_GPS');
    const pings     = r.GPS_COUNT ? (+r.GPS_COUNT).toLocaleString('pt-BR') : '0';

    // Distância / data
    const distKm   = r.DISTANCE_KM ? (+r.DISTANCE_KM).toFixed(0) + ' km' : '—';
    const dateShort = r.ROUTE_DATE ? String(r.ROUTE_DATE).slice(5).replace('-','/') : '—';
    const etdHHMM  = fmtHHMM(r.SHP_ORIGIN_ETD_DTTM);
    const etaHHMM  = fmtHHMM(r.SHP_DESTINATION_ETA_DTTM);
    const elapsed  = elapsedStr(r.SHP_ORIGIN_ATD_DTTM, r.SHP_DESTINATION_ATA_DTTM || null);
    // Transit time planejado = ETA destino - ETD origem
    const ttPlanned = elapsedStr(r.SHP_ORIGIN_ETD_DTTM, r.SHP_DESTINATION_ETA_DTTM);
    // Elapsed > TT planejado? (só relevante se em trânsito)
    const elapsedMs = r.SHP_ORIGIN_ATD_DTTM
      ? ((r.SHP_DESTINATION_ATA_DTTM ? new Date(String(r.SHP_DESTINATION_ATA_DTTM).replace(' ','T')+'-03:00') : new Date()) - new Date(String(r.SHP_ORIGIN_ATD_DTTM).replace(' ','T')+'-03:00'))
      : 0;
    const ttMs = (r.SHP_ORIGIN_ETD_DTTM && r.SHP_DESTINATION_ETA_DTTM)
      ? (new Date(String(r.SHP_DESTINATION_ETA_DTTM).replace(' ','T')+'-03:00') - new Date(String(r.SHP_ORIGIN_ETD_DTTM).replace(' ','T')+'-03:00'))
      : 0;
    const ttExceeded = elapsedMs > 0 && ttMs > 0 && elapsedMs > ttMs;
    // Último GPS
    const gpsMinsAgoVal = r.GPS_MINUTES_AGO ? +r.GPS_MINUTES_AGO : null;
    const gpsTrackData  = TRACKING_DATA[String(r.SHP_LG_ROUTE_ID)] || [];
    const lastPingData  = gpsTrackData.length > 0 ? gpsTrackData[gpsTrackData.length - 1] : null;
    const lastGpsChip = gpsMinsAgoVal !== null
      ? (() => {
          const col = gpsMinsAgoVal < 30 ? '#16a34a' : gpsMinsAgoVal < 90 ? '#f59e0b' : '#dc2626';
          const locTip = lastPingData
            ? \`Última posição GPS\\n\${(+lastPingData.lat).toFixed(4)}, \${(+lastPingData.lng).toFixed(4)}\\n\${gpsMinsAgoVal}min atrás\`
            : \`Último GPS\\n\${gpsMinsAgoVal}min atrás\`;
          return \`<span data-tip="\${locTip}" style="color:\${col}">📡 \${gpsMinsAgoVal}min atrás</span>\`;
        })()
      : '';
    // Multi-leg: route_code com "@DEST_FINAL" indica destino final além da leg ativa
    const routeCode = String(r.SHP_LG_ROUTE_CODE || '');
    const atIdx = routeCode.lastIndexOf('@');
    const finalDest = atIdx >= 0 ? routeCode.slice(atIdx + 1) : null;
    const isMultiLeg = finalDest && finalDest !== r.SHP_DESTINATION_FACILITY_ID;
    const multiLegBadge = isMultiLeg
      ? \`<span style="background:#ede9fe;color:#7c3aed;border:1px solid #c4b5fd;border-radius:4px;padding:1px 6px;font-size:10px;font-weight:600">↪ \${r.SHP_DESTINATION_FACILITY_ID} → \${finalDest}</span>\`
      : '';

    // Recalc chip
    let recalcChip = '';
    if (risk) {
      const sign = risk.delayMin > 0 ? '+' : '';
      const col  = risk.atRisk ? '#ef4444' : '#06b6d4';
      recalcChip = \`<span style="background:\${col}22;color:\${col};border:1px solid \${col};border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700">\${sign}\${Math.round(risk.delayMin)}min ETA recalc</span>\`;
    }

    // Incidente
    const incChip = r.INCIDENT_TYPE
      ? \`<span style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;border-radius:4px;padding:1px 7px;font-size:10px;font-weight:600">⚠ \${r.INCIDENT_TYPE}\${r.SHP_DELAY_FORECAST_INCIDENT_MINUTES ? ' +'+r.SHP_DELAY_FORECAST_INCIDENT_MINUTES+'min' : ''}</span>\`
      : '';

    // Vehicle match: planejado vs executado
    const vehPlanned = (r.SHP_LG_VEHICLE_TYPE_PLANNED || '').toUpperCase();
    const vehActual  = (r.SHP_LG_VEHICLE_TYPE || '').toUpperCase();
    // Linha 1: veículo + placa — mostra mismatch inline
    const palActual  = r.VEH_ACTUAL_CAP_PAL  ? Math.round(+r.VEH_ACTUAL_CAP_PAL)  : null;
    const palPlanned = r.VEH_PLANNED_CAP_PAL ? Math.round(+r.VEH_PLANNED_CAP_PAL) : null;
    const actCapTxt  = palActual  ? \` <span style="color:#64748b;font-size:9px">cap.\${palActual} pal</span>\`  : '';
    const plnCapTxt  = palPlanned ? \` <span style="color:#64748b;font-size:9px">cap.\${palPlanned} pal</span>\` : '';
    const vehDisplay = (vehPlanned && vehActual && vehPlanned !== vehActual)
      ? \`<span style="color:#94a3b8;font-size:10px">sol:</span> <span style="color:#1e293b;font-weight:700">\${vehPlanned}</span>\${plnCapTxt} <span style="color:#94a3b8">→</span> <span style="color:#dc2626;font-weight:700">\${vehActual}</span>\${actCapTxt}\${plate ? ' · ' + plate : ''}\`
      : \`\${veh}\${plate ? ' · ' + plate : ''}\`;

    // Order type: FORECAST (cinza sutil) vs ADICIONAL (laranja destacado)
    const orderType = (r.SHP_ORDER_TYPE || '').toUpperCase();
    const isAdicional = orderType === 'ADDITIONAL' || orderType === 'ADICIONAL';
    const orderChip = orderType
      ? isAdicional
        ? \`<span data-tip="Tipo: ADICIONAL\\nRota adicionada fora do planejamento\\nnormal do dia" style="background:#fff7ed;color:#c2410c;border:1px solid #fdba74;border-radius:4px;padding:2px 7px;font-size:10px;font-weight:700">➕ ADICIONAL</span>\`
        : \`<span data-tip="Tipo: FORECAST\\nRota planejada com base\\nna previsão de demanda" style="background:#f8fafc;color:#94a3b8;border:1px solid #e2e8f0;border-radius:4px;padding:2px 7px;font-size:10px">FORECAST</span>\`
      : '';

    // Barra de progresso (inline) — fundo cinza claro, fill na cor do status
    const barFilled = \`<div style="width:\${progPct}%;height:100%;background:\${accentColor};border-radius:3px;transition:width .3s"></div>\`;
    const progBar   = \`<div style="flex:1;height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden">\${barFilled}</div>\`;

    // Load Factor (capacidade do veículo)
    const lfTotal = r.SHP_TOTAL_PALLET_POSITIONS_LF_AMT ? +r.SHP_TOTAL_PALLET_POSITIONS_LF_AMT : 0;
    const lfOccup = r.SHP_OCCUPIED_PALLET_POSITIONS_LF_AMT ? +r.SHP_OCCUPIED_PALLET_POSITIONS_LF_AMT : 0;
    const lfPct   = r.LF_PALLET_PERC != null ? +r.LF_PALLET_PERC : (lfTotal > 0 ? Math.round(lfOccup / lfTotal * 100) : null);
    const lfVol   = r.LF_VOLUME_PERC != null ? +r.LF_VOLUME_PERC : null;
    const capM3   = r.VEHICLE_CAP_M3 != null ? +r.VEHICLE_CAP_M3 : null;
    const capKg   = r.VEHICLE_CAP_KG != null ? +r.VEHICLE_CAP_KG : null;
    let lfLine = '';
    if (lfTotal > 0 && lfPct !== null) {
      const lfPctN = Math.round(lfPct);
      const lfCol  = lfPctN >= 80 ? '#16a34a' : (lfPctN >= 50 ? '#d97706' : '#dc2626');
      const lfBar  = \`<div style="width:52px;height:4px;background:#e2e8f0;border-radius:2px;overflow:hidden;display:inline-block;vertical-align:middle"><div style="width:\${Math.min(100,lfPctN)}%;height:100%;background:\${lfCol};border-radius:2px"></div></div>\`;
      const capKgTxt = capKg ? \` / <b style="color:#475569">\${(capKg/1000).toFixed(0)}t</b>\` : '';
      const capTxt = capM3 ? \` <span style="color:#94a3b8">| cap <b style="color:#475569">\${capM3}m³</b>\${capKgTxt}</span>\` : '';
      const volTxt = lfVol !== null ? \` <span style="color:#94a3b8">| 💧 vol <b style="color:#475569">\${Math.round(lfVol)}%</b></span>\` : '';
      // Peso estimado carregado (lfPct% da capacidade em kg)
      const weightT = (capKg && lfPct !== null) ? Math.round(lfPct / 100 * capKg / 100) / 10 : null;
      const weightTxt = weightT !== null ? \` <span style="color:#94a3b8">| ⚖️ <b style="color:#475569">\${weightT.toFixed(1)}t</b></span>\` : '';
      // Média de shipments por pallet
      const avgSpp = r.AVG_SHP_PER_PAL != null && r.AVG_SHP_PER_PAL !== '' ? +r.AVG_SHP_PER_PAL : null;
      const avgSppTxt = avgSpp !== null ? \` <span style="color:#94a3b8">| 📦 <b style="color:#475569">\${avgSpp.toFixed(1)}</b> shp/pal</span>\` : '';
      // Priority chips
      const prioTot = +r.PRIO_TOTAL || 0;
      const prioChips = (() => {
        if (!prioTot) return '';
        const fast = +r.PRIO_FAST     || 0;
        const slow = +r.PRIO_SLOW     || 0;
        const chp  = +r.PRIO_CHEAPEST || 0;
        const std  = +r.PRIO_STANDARD || 0;
        const oth  = +r.PRIO_OTHER    || 0;
        const pct  = v => Math.round(v / prioTot * 100);
        const ch   = (icon, label, val, col) => {
          const c = val > 0 ? col : '#94a3b8';
          return \`<span style="color:\${c}">\${icon} \${label} <b>\${val.toLocaleString('pt-BR')}</b>\${val>0?\` <span style="color:#94a3b8;font-size:10px">(\${pct(val)}%)</span>\`:''}</span>\`;
        };
        return \`<span style="color:#e2e8f0;margin:0 2px">|</span>
          <span data-tip="Total de pacotes na rota">📦 <b style="color:#334155">\${prioTot.toLocaleString('pt-BR')}</b> pkgs</span>
          <span style="color:#e2e8f0;margin:0 2px">|</span>
          \${ch('⬜','Cheapest', chp,  '#6b7280')}
          <span style="color:#e2e8f0;margin:0 2px">|</span>
          \${ch('⚡','Fast',     fast, '#ef4444')}
          <span style="color:#e2e8f0;margin:0 2px">|</span>
          \${ch('🟡','Slow',     slow, '#f59e0b')}
          \${std > 0 ? \`<span style="color:#e2e8f0;margin:0 2px">|</span>\${ch('🔵','Std', std, '#3b82f6')}\` : ''}
          \${oth > 0 ? \`<span style="color:#e2e8f0;margin:0 2px">|</span><span style="color:#94a3b8">❓ sem info <b>\${oth}</b></span>\` : ''}\`;
      })();
      // Cost chips
      const costChips = (() => {
        const cps  = r.COST_CPS        != null ? +r.COST_CPS        : null;
        const cphu = r.COST_CPHU       != null ? +r.COST_CPHU       : null;
        const grnd = r.COST_GROUND     != null ? +r.COST_GROUND     : null;
        const qty  = r.COST_QTY_SHP    != null ? +r.COST_QTY_SHP   : null;
        const occ  = r.COST_OCCUPATION != null ? +r.COST_OCCUPATION : null;
        if (cps === null && grnd === null) return '';
        const fmt2 = v => v.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
        const sep  = '<span style="color:#e2e8f0;margin:0 2px">|</span>';
        const parts = [sep];
        if (cps  !== null) parts.push(\`<span data-tip="CPS — Cost Per Shipment\\nCusto médio por pacote nessa perna LH">💰 <span style="color:#64748b">CPS</span> <b style="color:#1e293b">R$\${fmt2(cps)}</b></span>\`);
        if (cphu !== null) parts.push(\`<span data-tip="CPHU — Cost Per Handling Unit\\nCusto por HU (caixa/bag que agrupa pacotes)"><span style="color:#64748b">CPHU</span> <b style="color:#1e293b">R$\${fmt2(cphu)}</b></span>\`);
        if (grnd !== null) parts.push(\`<span data-tip="Cost Ground — Custo total do frete rodoviário desta rota">🚚 <span style="color:#64748b">Frete</span> <b style="color:#1e293b">R$\${grnd.toLocaleString('pt-BR',{maximumFractionDigits:0})}</b></span>\`);
        if (qty  !== null) parts.push(\`<span data-tip="Qtd Shp by Route — Total de shipments na rota segundo a tabela de custos"><span style="color:#64748b">Qtd Shp</span> <b style="color:#1e293b">\${qty.toLocaleString('pt-BR')}</b></span>\`);
        if (occ  !== null) parts.push(\`<span data-tip="Occupation by Route — Taxa de ocupação da rota (m³ usado / capacidade)"><span style="color:#64748b">Occ</span> <b style="color:#1e293b">\${Math.round(occ <= 1 ? occ*100 : occ)}%</b></span>\`);
        return parts.join(' ');
      })();
      lfLine = \`<div style="display:flex;align-items:center;gap:8px;margin-top:8px;font-size:11px;color:#64748b;flex-wrap:wrap">
        <span>🪵 <b style="color:#1e293b">\${Number.isInteger(lfOccup) ? lfOccup : lfOccup.toFixed(1)}</b><span style="color:#94a3b8">/\${lfTotal.toFixed(0)} pal</span></span>
        \${lfBar}
        <span style="font-weight:700;color:\${lfCol}">\${lfPctN}% LF</span>
        \${capTxt}\${volTxt}\${weightTxt}\${avgSppTxt}\${prioChips}\${costChips}
      </div>\`;
    }

    return \`<div class="route-card" style="border-left-color:\${borderColor}">

  <!-- Linha 1: identidade + status -->
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
    <span style="font-size:13px;font-weight:700;color:#0f172a;letter-spacing:.3px">\${r.SHP_LG_ROUTE_CODE || r.SHP_LG_ROUTE_ID}</span>
    <span style="font-size:10px;color:#94a3b8;font-family:monospace">#\${r.SHP_LG_ROUTE_ID}</span>
    <span style="font-size:11px;color:#475569">\${r.SHP_LG_CARRIER_NAME || '—'}</span>
    <span style="font-size:11px;color:#64748b">\${vehDisplay}</span>
    <span style="margin-left:auto;background:\${statusBg};color:\${statusFg};border-radius:4px;padding:2px 8px;font-size:10px;font-weight:700;letter-spacing:.5px">\${statusTxt}</span>
  </div>

  <!-- Linha 2: métricas rápidas -->
  <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:6px;font-size:11px;color:#64748b">
    <span data-tip="Status GPS\\nÚltimo ping: \${r.LAST_GPS_DTTM||'—'}\\nFonte: \${gpsType||'—'}">\${gpsDot} \${gpsTxt} <span style="color:#94a3b8;font-size:10px">\${gpsType}</span></span>
    <span data-tip="Pings GPS recebidos\\nQuantidade de sinais captados\\ndurante o percurso">📶 <b style="color:#1e293b">\${pings}</b> pings</span>
    \${lastGpsChip}
    <span data-tip="Distância total da rota\\nOrigem → Destino (km)">🚛 <b style="color:#1e293b">\${distKm}</b></span>
    <span data-tip="Rota: \${r.SHP_ORIGIN_FACILITY_ID||'—'} → \${r.SHP_DESTINATION_FACILITY_ID||'—'}\\nOrigem: \${r.SHP_ORIGIN_REGIONAL_L1||'—'}\\nDestino: \${r.SHP_DESTINATION_REGIONAL_L1||'—'}">📍 <b style="color:#334155">\${r.SHP_ORIGIN_FACILITY_ID||'—'}</b> → <b style="color:#334155">\${r.SHP_DESTINATION_FACILITY_ID||'—'}</b></span>
    <span data-tip="Data da rota\\n\${r.ROUTE_DATE||'—'}">📅 \${dateShort}</span>
    <span data-tip="ETD Orig: saída planejada da origem\\nETA Dest: chegada planejada no destino\\nETD \${fmtDDHHMM(r.SHP_ORIGIN_ETD_DTTM)||'—'} · ETA \${fmtDDHHMM(r.SHP_DESTINATION_ETA_DTTM)||'—'}">ETD Orig <b style="color:#1e293b">\${etdHHMM}</b> · ETA Dest <b style="color:#1e293b">\${etaHHMM}</b></span>
    \${ttPlanned !== '—' ? \`<span data-tip="Transit Time planejado\\nETA Dest − ETD Orig\\n\${ttExceeded ? '⚠ Tempo em trânsito já excedeu o TT' : 'Dentro do planejado'}">⏱ TT <b style="color:\${ttExceeded ? '#dc2626' : '#1e293b'}">\${ttPlanned}</b></span>\` : ''}
    \${elapsed !== '—' ? \`<span data-tip="Tempo em trânsito\\nDe Gate Out Origem até agora\${r.SHP_DESTINATION_ATA_DTTM ? ' (chegou)' : ' (em curso)'}\\n\${ttExceeded ? '⚠ Acima do TT planejado' : ''}">🚀 <b style="color:\${ttExceeded ? '#dc2626' : '#1e293b'}">\${elapsed}</b></span>\` : ''}
    \${orderChip}
    \${multiLegBadge}
    <span style="margin-left:auto;display:flex;gap:6px;align-items:center">\${incChip}\${recalcChip}</span>
  </div>

  <!-- Linha 3: Timeline de checkpoints -->
  \${makeTimeline(r, accentColor)}

  <!-- Linha 4: Load Factor (paletes ocupados / capacidade) -->
  \${lfLine}


</div>\`;
  }).join('');
}

// Retorna status recalculado baseado em ETA_RECALC vs ETA planejado
function getRecalcStatus(r) {
  if (!r.ETA_RECALC_DTTM || !r.SHP_DESTINATION_ETA_DTTM) return 'SEM_RECALC';
  const diff = new Date(String(r.ETA_RECALC_DTTM).replace(' ','T')+'-03:00')
             - new Date(String(r.SHP_DESTINATION_ETA_DTTM).replace(' ','T')+'-03:00');
  if (diff > 0)        return 'EM_RISCO';
  return 'NO_PRAZO';  // adiantado = no prazo
}

// Popula o select de Tipo a partir dos dados reais
function buildTipoFilter(data) {
  const tipos = [...new Set(data.map(r => r.SHP_BILLING_TYPE).filter(Boolean))].sort();
  const sel = document.getElementById('fTipo');
  const cur = sel.value;
  sel.innerHTML = '<option value="">Todos</option>'
    + tipos.map(t => \`<option value="\${t}"\${t===cur?' selected':''}>\${t}</option>\`).join('');
}

// Helper: número da semana (WEEK(SUNDAY)) — domingo = início
function getWeekNum(dateStr) {
  if (!dateStr) return null;
  const d = new Date(String(dateStr).slice(0,10) + 'T12:00:00');
  if (isNaN(d)) return null;
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const dayOfYear   = Math.floor((d - startOfYear) / 86400000);
  return Math.floor((dayOfYear + startOfYear.getDay()) / 7) + 1;
}

// Popula selects de filtros a partir dos dados carregados
function buildSelectFilters(data) {
  const makeSelect = (id, vals, cur) => {
    const el = document.getElementById(id);
    if (!el) return;
    const unique = [...new Set(vals.filter(v => v !== null && v !== undefined && v !== ''))].sort((a,b) => String(a).localeCompare(String(b), undefined, {numeric:true}));
    el.innerHTML = '<option value="">(Tudo)</option>'
      + unique.map(v => \`<option value="\${v}"\${String(v)===String(cur)?' selected':''}>\${v}</option>\`).join('');
  };
  const cur = id => { const e = document.getElementById(id); return e ? e.value : ''; };

  // Tempo (extraído de ETA_DATE)
  const anos     = data.map(r => { const d = new Date(String(r.ETA_DATE||'').slice(0,10)+'T12:00:00'); return isNaN(d)?null:d.getFullYear(); });
  const semanas  = data.map(r => getWeekNum(r.ETA_DATE)).map(w => w ? 'Sem ' + String(w).padStart(2,'0') : null);
  makeSelect('fAno',    anos,    cur('fAno'));
  makeSelect('fSemana', semanas, cur('fSemana'));

  // Geográficos (do maior pro menor)
  makeSelect('fRegOrigem',  data.map(r => r.SHP_ORIGIN_REGIONAL_L1),      cur('fRegOrigem'));
  makeSelect('fOrigem',     data.map(r => r.SHP_ORIGIN_FACILITY_ID),       cur('fOrigem'));
  makeSelect('fRegDestino', data.map(r => r.SHP_DESTINATION_REGIONAL_L1),  cur('fRegDestino'));
  makeSelect('fDestino',    data.map(r => r.SHP_DESTINATION_FACILITY_ID),  cur('fDestino'));
  makeSelect('fCarrier',    data.map(r => r.SHP_LG_CARRIER_NAME),          cur('fCarrier'));
}

// Clique em rota/caminhão: 1º clique filtra, 2º abre popup
function filterToRoute(routeId, latlng, popupContent) {
  const fRoute = document.getElementById('fRoute');
  if (fRoute.value.trim() === String(routeId)) {
    // 2º clique — abre popup
    if (latlng && popupContent) openPopupSafe(latlng, popupContent);
  } else {
    // 1º clique — filtra e faz fitBounds A→B
    fRoute.value = String(routeId);
    applyFilters();
    const r = RAW_DATA.find(function(x) { return x.SHP_LG_ROUTE_ID == routeId; });
    if (r) {
      const pts = [];
      const oLat = +r.ORIGIN_LAT  || +r.SHP_ORIGIN_LATITUDE;
      const oLng = +r.ORIGIN_LNG  || +r.SHP_ORIGIN_LONGITUDE;
      const dLat = +r.DEST_LAT    || +r.SHP_DESTINATION_LATITUDE;
      const dLng = +r.DEST_LNG    || +r.SHP_DESTINATION_LONGITUDE;
      if (oLat && oLng) pts.push([oLat, oLng]);
      if (dLat && dLng) pts.push([dLat, dLng]);
      // Posição atual (GPS ou estimada)
      const pings = TRACKING_DATA[String(routeId)];
      const lastP = pings && pings.length > 0 ? pings[pings.length - 1] : null;
      if (lastP && lastP.lat && lastP.lng) pts.push([lastP.lat, lastP.lng]);
      else if (+r.CURRENT_LAT && +r.CURRENT_LNG) pts.push([+r.CURRENT_LAT, +r.CURRENT_LNG]);
      if (pts.length >= 2) {
        map.fitBounds(L.latLngBounds(pts).pad(0.15), { maxZoom: 9 });
      }
    }
  }
}

function openPopupSafe(latlng, content) {
  // autoPanPaddingTopLeft=[10,120] garante que o popup não some atrás do header
  L.popup({ maxWidth: 320, autoPan: true, autoPanPaddingTopLeft: L.point(10, 120), autoPanPaddingBottomRight: L.point(10, 20) })
    .setLatLng(latlng).setContent(content).openOn(map);
}

function applyFilters() {
  const route       = (document.getElementById('fRoute')||{value:''}).value.trim().toLowerCase();
  const origem      = (document.getElementById('fOrigem')||{value:''}).value;
  const regOrig     = (document.getElementById('fRegOrigem')||{value:''}).value;
  const destino     = (document.getElementById('fDestino')||{value:''}).value;
  const regDest     = (document.getElementById('fRegDestino')||{value:''}).value;
  const carrier     = (document.getElementById('fCarrier')||{value:''}).value;
  const statusRota  = (document.getElementById('fStatusRota')||{value:''}).value;
  const tipo        = (document.getElementById('fTipo')||{value:''}).value;
  const dateFrom    = (document.getElementById('fDateFrom')||{value:''}).value;
  const dateTo      = (document.getElementById('fDateTo')||{value:''}).value;

  // If selected date range has no data loaded, ask React parent to re-query BigQuery
  if (dateFrom && dateTo && RAW_DATA.length > 0 && window.parent !== window) {
    const hasMatch = RAW_DATA.some(function(r) {
      var dt = String(r.ETA_DATE || '').slice(0,10);
      return dt >= dateFrom && dt <= dateTo;
    });
    if (!hasMatch) {
      window.parent.postMessage({ type: 'LH_RELOAD', dateFrom: dateFrom, dateTo: dateTo }, '*');
      return;
    }
  }
  const ano         = (document.getElementById('fAno')||{value:''}).value;
  const trimestre   = (document.getElementById('fTrimestre')||{value:''}).value;
  const mes         = (document.getElementById('fMes')||{value:''}).value;
  const semana      = (document.getElementById('fSemana')||{value:''}).value;
  const diaSemana   = (document.getElementById('fDiaSemana')||{value:''}).value;

  // Filtro temporal comum
  const matchDate = r => {
    const dt = String(r.ETA_DATE || '').slice(0,10);
    if (dateFrom && dt < dateFrom) return false;
    if (dateTo   && dt > dateTo)   return false;
    if (ano || trimestre || mes || semana || diaSemana) {
      const d = new Date(dt + 'T12:00:00');
      if (isNaN(d)) return false;
      if (ano       && String(d.getFullYear()) !== String(ano)) return false;
      if (mes       && String(d.getMonth()+1)  !== String(mes)) return false;
      if (trimestre && String(Math.ceil((d.getMonth()+1)/3)) !== String(trimestre)) return false;
      if (semana) {
        const wLabel = 'Sem ' + String(getWeekNum(dt)).padStart(2,'0');
        if (wLabel !== semana) return false;
      }
      if (diaSemana && String(d.getDay()) !== String(diaSemana)) return false;
    }
    return true;
  };

  // Filtros comuns
  const applyCommon = arr => {
    let a = arr;
    a = a.filter(matchDate);
    if (route)      a = a.filter(r => String(r.SHP_LG_ROUTE_ID).includes(route) || (r.SHP_LG_ROUTE_CODE||'').toLowerCase().includes(route));
    if (origem)     a = a.filter(r => (r.SHP_ORIGIN_FACILITY_ID||'') === origem);
    if (regOrig)    a = a.filter(r => (r.SHP_ORIGIN_REGIONAL_L1||'') === regOrig);
    if (destino)    a = a.filter(r => (r.SHP_DESTINATION_FACILITY_ID||'') === destino);
    if (regDest)    a = a.filter(r => (r.SHP_DESTINATION_REGIONAL_L1||'') === regDest);
    if (carrier)    a = a.filter(r => (r.SHP_LG_CARRIER_NAME||'') === carrier);
    if (tipo)       a = a.filter(r => (r.SHP_BILLING_TYPE||'') === tipo);
    if (statusRota) a = a.filter(r => {
      const s = r.SHP_LG_ROUTE_STATUS || '';
      if (statusRota === 'CANCELLED') return ['CANCELLED','CANCELED'].includes(s);
      return s === statusRota;
    });
    return a;
  };

  // Mapa: se nenhum status explícito, exclui FINISHED e CANCELLED por padrão
  let f = statusRota
    ? RAW_DATA.slice()
    : RAW_DATA.filter(r => !['CANCELLED','CANCELED','FINISHED'].includes(r.SHP_LG_ROUTE_STATUS));

  // Lista: todos os status
  let fAll = RAW_DATA.slice();

  f    = applyCommon(f);
  fAll = applyCommon(fAll);
  window._allFilteredForList = fAll;
  window._lastMapData        = f;

  const onList = (TABS[_currentTabIdx] === 'list');
  if (onList) {
    // Na lista: atualiza lista e stats sem tocar no Leaflet (mapa hidden)
    document.getElementById('count').textContent =
      \`\${fAll.filter(r => r.SHP_LG_ROUTE_STATUS !== 'FINISHED').length} ativas\`;
    updateListStats(fAll);
    renderList(fAll);
  } else {
    // No mapa: fluxo normal
    drawRoutes(f);
  }
}

function resetFilters(redraw=true) {
  ['fRoute','fOrigem','fRegOrigem','fDestino','fRegDestino','fCarrier',
   'fStatusRota','fGranularidade','fAno','fTrimestre','fMes','fSemana','fDiaSemana'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const el = document.getElementById('fTipo'); if (el) el.value = '';
  const _ld = RAW_DATA.reduce((max, r) => { const d = String(r.ETA_DATE||'').slice(0,10); return d > max ? d : max; }, '') || new Date().toISOString().slice(0,10);
  const _ff = document.getElementById('fDateFrom'); if (_ff) _ff.value = _ld;
  const _ft = document.getElementById('fDateTo');   if (_ft) _ft.value = _ld;
  document.getElementById('legend-clear').style.display = 'none';
  document.querySelectorAll('.legend-item').forEach(el => el.style.opacity = '1');
  if (redraw) drawRoutes(RAW_DATA.filter(r => !['CANCELLED','CANCELED','FINISHED'].includes(r.SHP_LG_ROUTE_STATUS)));
}

var _statusFilterActive = null;
function filterByStatus(status) {
  if (_statusFilterActive === status) {
    _statusFilterActive = null;
    resetFilters();
    return;
  }
  _statusFilterActive = status;
  // Highlight item selecionado, esmaece os outros
  document.querySelectorAll('.legend-item').forEach(el => {
    el.style.opacity = el.getAttribute('onclick').includes(status) ? '1' : '0.35';
  });
  document.getElementById('legend-clear').style.display = 'block';
  var filtered = RAW_DATA.filter(function(r) {
    if (['CANCELLED','CANCELED','FINISHED'].includes(r.SHP_LG_ROUTE_STATUS)) return false;
    return getRecalcStatus(r) === status;
  });
  drawRoutes(filtered);
}

// ─────────────────────────────────────────────────────────────────────────────
// GESTÃO DE CRISE
// Agrupa por: corredor (origem→destino) + tipo de incidente
// Mostra corredores com ≥ N rotas com o mesmo problema
// ─────────────────────────────────────────────────────────────────────────────
let crisisRoutes  = [];
let selectedCrisisId = null;
const CRISE_DELAY_MIN = ['DELAY_ATE_1H','DELAY_1H_3H','DELAY_3H_6H','DELAY_6H_PLUS'];

// ── Zonas de Risco GPS Preditivo ──────────────────────────────────────────────
// Lógica: rotas EM_RISCO → seus pings recentes formam "células quentes"
// Células com ≥ 2 rotas atrasadas diferentes → zona de risco no mapa
// Rotas NO_PRAZO cuja posição atual está dentro de uma zona → POSSÍVEL ATRASO
var RISK_CELLS = {};  // exportado para uso em drawRoutes
function buildRiskZones() {
  riskZoneLayer.clearLayers();
  RISK_CELLS = {};

  const CELL_DEG  = 1.35;   // ~80km por célula
  const MIN_ROUTES = 2;      // mínimo de rotas atrasadas para acionar zona
  const RECENT_PINGS = 40;   // últimos N pings de cada rota (subsampled 1:5 ≈ últimas ~3h)

  // 1. Coletar pings recentes de rotas EM_RISCO
  RAW_DATA.forEach(function(r) {
    if (r.SHP_LG_ROUTE_STATUS !== 'IN_PROGRESS') return;
    if (getRecalcStatus(r) !== 'EM_RISCO') return;
    const pings = TRACKING_DATA[String(r.SHP_LG_ROUTE_ID)];
    if (!pings || pings.length < 2) return;
    // Só os pings mais recentes (final do array = mais novo)
    const recent = pings.slice(-RECENT_PINGS);
    recent.forEach(function(p) {
      if (!p.lat || !p.lng) return;
      const ck = Math.round(p.lat / CELL_DEG) + ',' + Math.round(p.lng / CELL_DEG);
      if (!RISK_CELLS[ck]) {
        RISK_CELLS[ck] = {
          lat: Math.round(p.lat / CELL_DEG) * CELL_DEG,
          lng: Math.round(p.lng / CELL_DEG) * CELL_DEG,
          routes: new Set(), pings: 0
        };
      }
      RISK_CELLS[ck].routes.add(r.SHP_LG_ROUTE_ID);
      RISK_CELLS[ck].pings++;
    });
  });

  // Badge count: posição ATUAL de cada rota IN_PROGRESS (último ping)
  // Separa em: em_risco_now (EM_RISCO com posição atual na zona) e others_now (demais)
  // Isso corrige o bug de rotas históricas inflarem o count
  RAW_DATA.forEach(function(r) {
    if (r.SHP_LG_ROUTE_STATUS !== 'IN_PROGRESS') return;
    const pings  = TRACKING_DATA[String(r.SHP_LG_ROUTE_ID)];
    const lastP  = pings && pings.length > 0 ? pings[pings.length - 1] : null;
    const curLat = lastP ? lastP.lat : +r.CURRENT_LAT;
    const curLng = lastP ? lastP.lng : +r.CURRENT_LNG;
    if (!curLat || !curLng || Math.abs(curLat) < 0.01) return;
    const ck   = Math.round(curLat / CELL_DEG) + ',' + Math.round(curLng / CELL_DEG);
    const cell = RISK_CELLS[ck];
    if (!cell || cell.routes.size < MIN_ROUTES) return;
    // Bucket separado por status atual
    if (getRecalcStatus(r) === 'EM_RISCO') {
      if (!cell.atRiskNow) cell.atRiskNow = new Set();
      cell.atRiskNow.add(r.SHP_LG_ROUTE_ID);
    } else {
      if (!cell.othersNow) cell.othersNow = new Set();
      cell.othersNow.add(r.SHP_LG_ROUTE_ID);
    }
  });

  // Se modo zona não está ativo, para aqui (células calculadas mas não renderizadas)
  if (!_riskZonesVisible) return;

  // 2. Renderizar zonas com ≥ MIN_ROUTES rotas atrasadas + badge de contagem
  var zoneCount = 0;
  Object.entries(RISK_CELLS).forEach(function(entry) {
    var ck = entry[0], cell = entry[1];
    if (cell.routes.size < MIN_ROUTES) return;
    zoneCount++;

    const atRisk  = cell.atRiskNow ? cell.atRiskNow.size : 0;
    const others  = cell.othersNow ? cell.othersNow.size : 0;
    const total   = atRisk + others;
    // Cor baseada em EM_RISCO ATUAL — vermelho só se realmente tem atrasados agora
    const color   = atRisk >= 3 ? '#dc2626' : '#f97316';
    const intensity   = Math.min(atRisk / 5, 1);
    const fillOpacity = 0.05 + intensity * 0.12;

    // Círculo da zona
    const circle = L.circle([cell.lat, cell.lng], {
      radius: CELL_DEG * 111000 * 0.55,
      color: color, weight: atRisk >= 3 ? 2 : 1.5,
      fillColor: color, fillOpacity: fillOpacity,
      dashArray: '6,4'
    });
    (function(cellKey, ct, ar, ot) {
      circle.on('click', function(e) { L.DomEvent.stopPropagation(e); filterToZone(cellKey); });
      circle.bindTooltip(
        '<b>⚠️ Zona de Risco</b><br>'
        + '<span style="color:#ef4444;font-weight:700">' + ar + ' em atraso</span>'
        + (ot > 0 ? ' · <span style="color:#f97316">' + ot + ' em trânsito</span>' : '')
        + '<br><i>Clique para ver detalhes</i>',
        { direction: 'top', sticky: true }
      );
    })(ck, total, atRisk, others);
    riskZoneLayer.addLayer(circle);

    // Badge split: vermelho = EM_RISCO confirmado | cinza = em trânsito na zona
    // Se atRisk = 0, mostra só o trânsito em laranja sem alarmar
    var badgeHtml;
    if (atRisk === 0) {
      // Só em trânsito — laranja discreto
      badgeHtml = '<div style="background:#fff7ed;color:#f97316;border:2px solid #f97316;'
        + 'border-radius:20px;padding:3px 9px;white-space:nowrap;'
        + 'font-weight:700;font-size:12px;font-family:Inter,sans-serif;'
        + 'box-shadow:0 2px 6px rgba(0,0,0,0.18);cursor:pointer;line-height:1.2">'
        + others + ' trânsito</div>';
    } else if (others === 0) {
      // Só atrasados — vermelho limpo
      badgeHtml = '<div style="background:#ef4444;color:#fff;border:2.5px solid #fff;'
        + 'border-radius:50%;width:36px;height:36px;'
        + 'display:flex;align-items:center;justify-content:center;'
        + 'font-weight:800;font-size:15px;font-family:Inter,sans-serif;'
        + 'box-shadow:0 2px 8px rgba(0,0,0,0.28);cursor:pointer">'
        + atRisk + '</div>';
    } else {
      // Split: [🔴 X] [+Y]
      badgeHtml = '<div style="display:flex;align-items:center;gap:3px;cursor:pointer">'
        + '<div style="background:#ef4444;color:#fff;border:2px solid #fff;'
        + 'border-radius:50%;width:32px;height:32px;'
        + 'display:flex;align-items:center;justify-content:center;'
        + 'font-weight:800;font-size:13px;font-family:Inter,sans-serif;'
        + 'box-shadow:0 2px 6px rgba(0,0,0,0.25)">' + atRisk + '</div>'
        + '<div style="background:#fff7ed;color:#f97316;border:1.5px solid #f97316;'
        + 'border-radius:10px;padding:2px 6px;'
        + 'font-weight:700;font-size:11px;font-family:Inter,sans-serif;'
        + 'box-shadow:0 1px 4px rgba(0,0,0,0.15);white-space:nowrap">+' + others + '</div>'
        + '</div>';
    }
    const badgeW = atRisk === 0 ? 90 : (others === 0 ? 36 : 78);
    const badge = L.marker([cell.lat, cell.lng], {
      icon: L.divIcon({
        className: '',
        html: badgeHtml,
        iconSize: [badgeW, 36],
        iconAnchor: [badgeW / 2, 18]
      }),
      interactive: true
    });
    (function(cellKey) {
      badge.on('click', function(e) { L.DomEvent.stopPropagation(e); filterToZone(cellKey); });
    })(ck);
    riskZoneLayer.addLayer(badge);
  });

  console.log('[RiskZones] ' + zoneCount + ' zonas ativas');
  var btn = document.getElementById('btnRiskZones');
  if (btn) btn.title = zoneCount + ' zonas de risco ativas';
}

// ── Heatmap de concentração de atrasos ────────────────────────────────────────
var _heatLayer = null;
var _heatVisible = false;

function buildHeatmapData() {
  // Coleta pings recentes de todas as rotas EM_RISCO
  // Peso maior para pings mais recentes (últimos do array = mais novos)
  var pts = [];
  var RECENT = 60; // últimos N pings por rota
  RAW_DATA.forEach(function(r) {
    if (r.SHP_LG_ROUTE_STATUS !== 'IN_PROGRESS') return;
    if (getRecalcStatus(r) !== 'EM_RISCO') return;
    const pings = TRACKING_DATA[String(r.SHP_LG_ROUTE_ID)];
    if (!pings || pings.length < 2) return;
    const recent = pings.slice(-RECENT);
    recent.forEach(function(p, i) {
      if (!p.lat || !p.lng || Math.abs(p.lat) < 0.01) return;
      // Peso crescente: pings mais recentes têm peso maior
      const weight = 0.3 + (i / recent.length) * 0.7;
      pts.push([p.lat, p.lng, weight]);
    });
  });
  return pts;
}

function toggleHeatmap() {
  const btn = document.getElementById('btnHeatmap');
  if (_heatVisible) {
    // Desligar
    if (_heatLayer) { map.removeLayer(_heatLayer); _heatLayer = null; }
    _heatVisible = false;
    btn.style.opacity = '0.4';
    _detachHeatmapClick();
    closeHotspotPanel();
  } else {
    // Ligar
    const pts = buildHeatmapData();
    if (pts.length === 0) { showToast('Sem rotas EM_RISCO com GPS para heatmap', 2500); return; }
    _heatLayer = L.heatLayer(pts, {
      radius: 28,
      blur: 22,
      maxZoom: 10,
      max: 1.0,
      gradient: { 0.0: '#0ea5e9', 0.3: '#06b6d4', 0.5: '#eab308', 0.75: '#f97316', 1.0: '#dc2626' }
    }).addTo(map);
    _heatVisible = true;
    btn.style.opacity = '1';
    _attachHeatmapClick();
    showToast('🌡️ Heatmap ativo — clique num ponto quente para ver as rotas', 3500);
  }
}

// ── Drill down ao clicar no heatmap ───────────────────────────────────────────
var _hotspotClickHandler = null;

function haversineKm(lat1, lng1, lat2, lng2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat/2)*Math.sin(dLat/2)
        + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)
        * Math.sin(dLng/2)*Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function openHotspotPanel(clickLat, clickLng) {
  var RADIUS_KM = 120;
  var confirmed = [];   // EM_RISCO
  var possible  = [];   // NO_PRAZO/SEM_RECALC dentro de zona de risco

  RAW_DATA.forEach(function(r) {
    if (r.SHP_LG_ROUTE_STATUS !== 'IN_PROGRESS') return;
    var pings = TRACKING_DATA[String(r.SHP_LG_ROUTE_ID)];
    var lastP = pings && pings.length > 0 ? pings[pings.length - 1] : null;
    var lat = lastP ? lastP.lat : +r.CURRENT_LAT;
    var lng = lastP ? lastP.lng : +r.CURRENT_LNG;
    if (!lat || !lng || Math.abs(lat) < 0.01) return;
    var dist = haversineKm(clickLat, clickLng, lat, lng);
    if (dist > RADIUS_KM) return;
    var rs = getRecalcStatus(r);
    var delayMin = r.DELAY_MINUTES ? Math.round(+r.DELAY_MINUTES) : null;
    var lastTs = lastP ? lastP.ts : '—';
    var entry = { r, lat, lng, dist: Math.round(dist), delayMin, lastTs };
    if (rs === 'EM_RISCO') confirmed.push(entry);
    else possible.push(entry);
  });

  if (confirmed.length === 0 && possible.length === 0) {
    showToast('Nenhuma rota em atraso nesta área', 2000); return;
  }

  confirmed.sort(function(a, b) { return (b.delayMin || 0) - (a.delayMin || 0); });
  possible.sort(function(a,  b) { return a.dist - b.dist; });

  // Zoom na área
  var allFound = confirmed.concat(possible);
  var bounds = L.latLngBounds(allFound.map(function(f) { return [f.lat, f.lng]; }));
  map.fitBounds(bounds.pad(0.3), { maxZoom: 9 });

  // Header
  var region = allFound[0].r.SHP_DESTINATION_REGIONAL_L1 || allFound[0].r.SHP_ORIGIN_REGIONAL_L1 || '';
  document.getElementById('hotspot-title').innerHTML =
    '🌡️ Hotspot' + (region ? ' — ' + region : '') +
    ' &nbsp;<span style="font-weight:400;font-size:11px">'
    + '<span style="color:#ef4444;font-weight:700">' + confirmed.length + ' em atraso</span>'
    + (possible.length > 0
      ? '&nbsp;·&nbsp;<span style="color:#f97316;font-weight:700">' + possible.length + ' possível atraso</span>'
      : '')
    + '</span>';

  function makeRow(f, isConfirmed) {
    var delay = f.delayMin != null && f.delayMin > 0
      ? (f.delayMin >= 60
          ? '+' + Math.floor(f.delayMin/60) + 'h ' + (f.delayMin%60) + 'min'
          : '+' + f.delayMin + 'min')
      : '—';
    var carrier = f.r.SHP_LG_CARRIER_NAME || '—';
    var badgeBg  = isConfirmed ? '#ef4444' : '#f97316';
    var badgeTxt = isConfirmed ? 'ATRASO' : 'POSSÍVEL';
    return '<div onclick="drillToRoute(' + f.r.SHP_LG_ROUTE_ID + ',' + f.lat + ',' + f.lng + ')" '
      + 'style="display:flex;align-items:center;gap:10px;padding:7px 14px;border-bottom:1px solid #f1f5f9;'
      + 'cursor:pointer;transition:background .15s" '
      + 'onmouseover="this.style.background=\\'#fff7f7\\'" onmouseout="this.style.background=\\'\\'">'
      + '<span style="background:' + badgeBg + ';color:#fff;border-radius:3px;padding:1px 5px;'
      + 'font-size:9px;font-weight:700;min-width:54px;text-align:center">' + badgeTxt + '</span>'
      + '<span style="font-weight:700;font-size:12px;color:#1e293b;min-width:80px">' + f.r.SHP_LG_ROUTE_ID + '</span>'
      + '<span style="font-size:11px;color:#64748b;min-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + carrier + '</span>'
      + '<span style="font-size:12px;font-weight:700;color:' + badgeBg + ';min-width:72px">' + delay + '</span>'
      + '<span style="font-size:10px;color:#94a3b8">GPS ' + f.lastTs + '</span>'
      + '<span style="font-size:10px;color:#cbd5e1;margin-left:auto">' + f.dist + 'km</span>'
      + '</div>';
  }

  var rows = '';
  if (confirmed.length > 0) {
    rows += '<div style="padding:4px 14px 2px;font-size:10px;font-weight:700;color:#ef4444;'
          + 'text-transform:uppercase;letter-spacing:.5px;background:#fff7f7">Em Atraso</div>';
    rows += confirmed.map(function(f) { return makeRow(f, true); }).join('');
  }
  if (possible.length > 0) {
    rows += '<div style="padding:4px 14px 2px;font-size:10px;font-weight:700;color:#f97316;'
          + 'text-transform:uppercase;letter-spacing:.5px;background:#fff8f0">Possível Atraso</div>';
    rows += possible.map(function(f) { return makeRow(f, false); }).join('');
  }

  document.getElementById('hotspot-list').innerHTML = rows;
  document.getElementById('hotspot-panel').style.display = 'flex';
}

function drillToRoute(routeId, lat, lng) {
  closeHotspotPanel();
  map.setView([lat, lng], 10);
  var r = RAW_DATA.find(function(x) { return x.SHP_LG_ROUTE_ID === routeId; });
  if (r) {
    var f = [r].filter(function(x) { return x.SHP_LG_ROUTE_STATUS !== 'FINISHED'; });
    drawRoutes(f);
  }
}

function closeHotspotPanel() {
  document.getElementById('hotspot-panel').style.display = 'none';
}

// Registra/remove handler de click no mapa conforme heatmap liga/desliga
function _attachHeatmapClick() {
  _hotspotClickHandler = function(e) {
    if (_heatVisible) openHotspotPanel(e.latlng.lat, e.latlng.lng);
  };
  map.on('click', _hotspotClickHandler);
}
function _detachHeatmapClick() {
  if (_hotspotClickHandler) { map.off('click', _hotspotClickHandler); _hotspotClickHandler = null; }
}

var _riskZonesVisible = false;
function toggleRiskZones() {
  _riskZonesVisible = !_riskZonesVisible;
  var btn = document.getElementById('btnRiskZones');
  if (_riskZonesVisible) {
    // ── Entra no modo Zonas ────────────────────────────────────────────
    btn.style.opacity = '1';
    btn.style.background = '#fff7ed';
    map.addLayer(riskZoneLayer);

    // Limpa marcadores de rotas — visão zona é só círculos + badges, sem caminhões
    arcLayer.clearLayers();
    markerLayer.clearLayers();
    routingLayer.clearLayers();

    // Calcula células e desenha círculos com badges de contagem
    buildRiskZones();

  } else {
    // ── Sai do modo Zonas — volta ao mapa normal ───────────────────────
    btn.style.opacity = '0.4';
    btn.style.background = '';
    map.removeLayer(riskZoneLayer);
    riskZoneLayer.clearLayers();
    RISK_CELLS = {};
    drawRoutes(RAW_DATA.filter(function(r) {
      return !['CANCELLED','CANCELED','FINISHED'].includes(r.SHP_LG_ROUTE_STATUS);
    }));
  }
}

// ── Filtro de Zona de Risco ────────────────────────────────────────────────────
// Ao clicar numa zona: esconde tudo, mostra só caminhões + IDs das rotas dessa zona
var _zoneFilterActive = false;
function filterToZone(cellKey) {
  const CELL_DEG = 1.35;
  const cell = RISK_CELLS[cellKey];
  if (!cell) return;

  // Rotas na zona: EM_RISCO (atrasadas que formaram a zona) + POSSÍVEL ATRASO (passando agora)
  const zoneRouteIds = new Set(cell.routes);
  RAW_DATA.forEach(function(r) {
    if (r.SHP_LG_ROUTE_STATUS !== 'IN_PROGRESS') return;
    const pings = TRACKING_DATA[String(r.SHP_LG_ROUTE_ID)];
    const lastP  = pings && pings.length > 0 ? pings[pings.length - 1] : null;
    const curLat = lastP ? lastP.lat : +r.CURRENT_LAT;
    const curLng = lastP ? lastP.lng : +r.CURRENT_LNG;
    if (!curLat || !curLng || Math.abs(curLat) < 0.01) return;
    const ck = Math.round(curLat / CELL_DEG) + ',' + Math.round(curLng / CELL_DEG);
    if (ck === cellKey) zoneRouteIds.add(r.SHP_LG_ROUTE_ID);
  });

  // Esconde polylines (arcLayer) e pings GPS (routingLayer)
  arcLayer.clearLayers();
  routingLayer.clearLayers();

  // Esconde todos os marcadores exceto os da zona
  markerLayer.eachLayer(function(layer) {
    const el = layer.getElement ? layer.getElement() : null;
    if (el) el.style.display = 'none';
  });

  // Filtra o array de rotas para só as da zona e redesenha SÓ os marcadores
  const zoneRoutes = RAW_DATA.filter(r => zoneRouteIds.has(r.SHP_LG_ROUTE_ID));
  zoneRoutes.forEach(function(r) {
    const pings = TRACKING_DATA[String(r.SHP_LG_ROUTE_ID)];
    const lastP  = pings && pings.length > 0 ? pings[pings.length - 1] : null;
    const mLat   = lastP ? lastP.lat : +r.CURRENT_LAT;
    const mLng   = lastP ? lastP.lng : +r.CURRENT_LNG;
    if (!mLat || !mLng || Math.abs(mLat) < 0.01) return;
    const isRisk = getRecalcStatus(r) === 'EM_RISCO';
    const mc     = isRisk ? '#ef4444' : '#f97316';
    const label  = String(r.SHP_LG_ROUTE_ID);
    L.marker([mLat, mLng], {
      icon: L.divIcon({
        className: '',
        html: '<div style="display:flex;flex-direction:column;align-items:center">'
          + '<div style="background:' + mc + ';border:2px solid #fff;border-radius:50%;'
          + 'width:28px;height:28px;display:flex;align-items:center;justify-content:center;'
          + 'font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.4)">🚛</div>'
          + '<div style="background:' + mc + ';color:#fff;border-radius:4px;padding:1px 6px;'
          + 'font-size:11px;font-weight:700;margin-top:2px;white-space:nowrap;'
          + 'box-shadow:0 1px 4px rgba(0,0,0,0.3)">' + label + '</div>'
          + '</div>',
        iconAnchor: [14, 14]
      }),
      zIndexOffset: isRisk ? 2000 : 1500
    }).on('click', function(e) { L.DomEvent.stopPropagation(e); clearZoneFilter(); popup(r); })
      .addTo(markerLayer);
  });

  _zoneFilterActive = true;
  // Banner de aviso com opção de limpar
  showToast('⚠️ Zona: ' + zoneRouteIds.size + ' rotas — clique fora para limpar', 0);
  // Zoom na zona
  map.setView([cell.lat, cell.lng], 9);
}

function clearZoneFilter() {
  if (!_zoneFilterActive) return;
  _zoneFilterActive = false;
  const f = RAW_DATA.filter(r => !['CANCELLED','CANCELED','FINISHED'].includes(r.SHP_LG_ROUTE_STATUS));
  drawRoutes(f);
}

// Click no mapa limpa o filtro de zona
document.addEventListener('DOMContentLoaded', function() {
  if (typeof map !== 'undefined') {
    map.on('click', function() { if (_zoneFilterActive) clearZoneFilter(); });
  }
});

function buildCrisisPanel() {
  crisisRoutes = RAW_DATA.filter(function(r) {
    return r.SHP_LG_ROUTE_STATUS !== 'FINISHED'
      && !r.SHP_DESTINATION_ATA_DTTM
      && (r.INCIDENT_TYPE || CRISE_DELAY_MIN.includes(r.DELAY_BUCKET));
  }).sort(function(a, b) {
    var ri = (b.INCIDENT_TYPE ? 1 : 0) - (a.INCIDENT_TYPE ? 1 : 0);
    if (ri !== 0) return ri;
    var ra = (DELAY_RANK[b.DELAY_BUCKET]||0) - (DELAY_RANK[a.DELAY_BUCKET]||0);
    if (ra !== 0) return ra;
    return (a.SHP_DESTINATION_ETA_DTTM||'') < (b.SHP_DESTINATION_ETA_DTTM||'') ? -1 : 1;
  });

  // Compute summary metrics
  var chains  = findPropagationChains(crisisRoutes);
  var propFacs = {};
  chains.forEach(function(ch) {
    ch.forEach(function(r) {
      if (r.SHP_ORIGIN_FACILITY_ID)      propFacs[r.SHP_ORIGIN_FACILITY_ID]      = true;
      if (r.SHP_DESTINATION_FACILITY_ID) propFacs[r.SHP_DESTINATION_FACILITY_ID] = true;
    });
  });
  var nodesEmCrise = Object.keys(propFacs).length;
  var pkgAfetados  = crisisRoutes.reduce(function(acc, r) { return acc + (+r.SHP_TOTAL_PACKAGES_DROPOFF_AMT || 0); }, 0);
  var blastRadius  = Math.round(nodesEmCrise * 1.3 + crisisRoutes.length * 0.25);
  var delayedArr   = crisisRoutes.filter(function(r) { return r.DELAY_MINUTES > 0; });
  var avgDelay     = delayedArr.length
    ? Math.round(delayedArr.reduce(function(a, r) { return a + r.DELAY_MINUTES; }, 0) / delayedArr.length)
    : 0;

  const criseBadgeEl = document.getElementById('criseBadge');
  if (criseBadgeEl) criseBadgeEl.textContent = crisisRoutes.length;
  document.getElementById('criseTotal').textContent = crisisRoutes.length + ' veículos';

  var sumEl = document.getElementById('crisis-summary');
  if (sumEl) {
    sumEl.innerHTML =
      '<div class="cs-metric"><div class="n">' + nodesEmCrise + '</div><div class="l">Nós em crise</div></div>' +
      '<div class="cs-metric"><div class="n">' + (pkgAfetados > 9999 ? (pkgAfetados/1000).toFixed(1)+'k' : pkgAfetados.toLocaleString()) + '</div><div class="l">Pacotes afetados</div></div>' +
      '<div class="cs-metric amber"><div class="n">' + blastRadius + '</div><div class="l">Blast radius</div></div>' +
      '<div class="cs-metric blue"><div class="n">' + fmtMin(avgDelay) + '</div><div class="l">Delay médio</div></div>';
  }

  drawCrisisPropagation(crisisRoutes);
  renderCrisisList();
  renderTop5();
}

function renderCrisisList() {
  var list = document.getElementById('crisis-list');
  if (!crisisRoutes.length) {
    list.innerHTML = '<div class="crisis-empty">Sem ocorrências ativas.<br><span style="color:#475569">Veículos com ATA ou FINISHED foram excluídos.</span></div>';
    return;
  }

  var qEl = document.getElementById('criseSearch');
  var q   = qEl ? qEl.value.toLowerCase() : '';
  var visible = q
    ? crisisRoutes.filter(function(r) {
        return (r.SHP_LG_ROUTE_CODE||'').toLowerCase().includes(q) ||
               (r.PLATE_TRACTOR||'').toLowerCase().includes(q) ||
               (r.SHP_LG_CARRIER_NAME||'').toLowerCase().includes(q) ||
               (r.INCIDENT_TYPE||'').toLowerCase().includes(q);
      })
    : crisisRoutes;

  if (!visible.length) {
    list.innerHTML = '<div class="crisis-empty">Nenhum resultado.</div>';
    return;
  }

  list.innerHTML = visible.map(function(r, i) {
    var dcol   = DELAY_COLOR[r.DELAY_BUCKET] || '#6b7280';
    var sc     = STATUS_COLOR[r.SHP_LG_ROUTE_STATUS] || '#64748b';
    var plates = [r.PLATE_TRACTOR, r.PLATE_TRAILER_1, r.PLATE_TRAILER_2].filter(Boolean).join(' / ');
    var prog   = Math.round((+r.ROUTE_PROGRESS_PERC || 0) * 100);
    var isSel  = selectedCrisisId === r.SHP_LG_ROUTE_ID ? 'selected' : '';
    var pkg    = +r.SHP_TOTAL_PACKAGES_DROPOFF_AMT || 0;
    var eta    = r.SHP_DESTINATION_ETA_DTTM ? r.SHP_DESTINATION_ETA_DTTM.replace('T',' ').slice(11,16) : '--:--';
    var isChain = crisisChains.some(function(ch) {
      return ch.some(function(x) { return x.SHP_LG_ROUTE_ID == r.SHP_LG_ROUTE_ID; });
    });
    var spark = sparklineSVG(genSparkData(r), dcol);
    var cycleMin = (r.SHP_ORIGIN_ATD_DTTM && r.SHP_DESTINATION_ETA_DTTM)
      ? Math.max(0, (new Date(r.SHP_DESTINATION_ETA_DTTM) - new Date(r.SHP_ORIGIN_ATD_DTTM)) / 60000)
      : 0;
    return [
      '<div class="crisis-item ' + isSel + '" onclick="selectCrisisRoute(' + r.SHP_LG_ROUTE_ID + ',' + i + ')" data-idx="' + i + '">',
      isChain ? '<div class="prop-indicator"></div>' : '',
      '  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:3px">',
      '    <div style="font-size:12px;font-weight:700;color:#f8fafc">' +
             (isChain ? '<span style="color:#FF2D2D;font-size:8px;margin-right:3px;letter-spacing:-.5px">⬥PROP</span>' : '') +
             (r.SHP_LG_ROUTE_CODE || r.SHP_LG_ROUTE_ID) + '</div>',
      '    <span class="badge" style="background:' + sc + ';font-size:9px">' + r.SHP_LG_ROUTE_STATUS + '</span>',
      '  </div>',
      '  <div style="font-size:11px;color:#94a3b8;margin-bottom:3px">🚚 ' + (plates || '—') + ' &nbsp;·&nbsp; ' + (r.SHP_LG_CARRIER_NAME || '—') + '</div>',
      '  <div style="font-size:11px;color:#cbd5e1;margin-bottom:4px">' + (r.SHP_ORIGIN_FACILITY_ID||'?') + ' <span style="color:#475569">→</span> ' + (r.SHP_DESTINATION_FACILITY_ID||'?') + '</div>',
      r.INCIDENT_TYPE ? '<div style="font-size:11px;color:#fbbf24;margin-bottom:3px">⚠️ ' + r.INCIDENT_TYPE + (r.SHP_DELAY_FORECAST_INCIDENT_MINUTES ? ' (+' + r.SHP_DELAY_FORECAST_INCIDENT_MINUTES + 'min)' : '') + '</div>' : '',
      '  <div class="crisis-meta">',
      '    <span class="chip" style="background:' + dcol + '22;color:' + dcol + '">' + r.DELAY_BUCKET + '</span>',
      r.DELAY_MINUTES ? '<span class="chip" style="background:#1e293b;color:' + dcol + '">⏱ ' + fmtMin(r.DELAY_MINUTES) + '</span>' : '',
      '    <span class="chip chip-pkg">📦 ' + pkg.toLocaleString() + '</span>',
      '    <span class="chip" style="background:#1e3a5f;color:#93c5fd">ETA ' + eta + '</span>',
      cycleMin > 0 ? '<span class="chip" style="background:#1a1a2e;color:#a78bfa">⏳ ' + Math.round(cycleMin/60*10)/10 + 'h</span>' : '',
      '  </div>',
      '  <div style="display:flex;align-items:center;margin-top:5px;gap:6px">',
      '    <div style="flex:1;height:4px;background:#1e293b;border-radius:2px;overflow:hidden">',
      '      <div style="height:100%;width:' + prog + '%;background:' + dcol + ';border-radius:2px;opacity:.7"></div>',
      '    </div>',
      spark,
      '  </div>',
      '</div>'
    ].join('');
  }).join('');
}

function renderTop5() {
  var el = document.getElementById('top5-section');
  if (!el) return;
  var top5 = crisisRoutes.slice(0, 5);
  if (!top5.length) { el.style.display = 'none'; return; }
  el.style.display = '';
  el.innerHTML = '<h3><span>🔴 Top 5 rotas críticas</span><span style="color:#334155">Tendência 24h ↑</span></h3>' +
    top5.map(function(r, i) {
      var dcol = DELAY_COLOR[r.DELAY_BUCKET] || '#6b7280';
      var pkg  = +r.SHP_TOTAL_PACKAGES_DROPOFF_AMT || 0;
      var spark = sparklineSVG(genSparkData(r), dcol, 40, 14);
      return '<div class="top5-item">' +
        '<span class="top5-badge">#' + (i+1) + '</span>' +
        '<span style="flex:1;color:#e2e8f0;font-size:10px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (r.SHP_LG_ROUTE_CODE || r.SHP_LG_ROUTE_ID) + '</span>' +
        '<span style="color:' + dcol + ';font-size:9px;white-space:nowrap">' + fmtMin(r.DELAY_MINUTES) + '</span>' +
        '<span style="color:#6ee7b7;font-size:9px;margin-left:3px;white-space:nowrap">📦' + (pkg > 9999 ? (pkg/1000).toFixed(1)+'k' : pkg) + '</span>' +
        spark +
        '</div>';
    }).join('');
}

function selectCrisisRoute(routeId, idx) {
  const wasSelected = selectedCrisisId === routeId;
  selectedCrisisId = wasSelected ? null : routeId;

  document.querySelectorAll('.crisis-item').forEach(function(el) { el.classList.remove('selected'); });
  hlLayer.clearLayers();

  if (!wasSelected) {
    var el = document.querySelector('[data-idx="' + idx + '"]');
    if (el) el.classList.add('selected');

    var r = crisisRoutes.find(function(x) { return x.SHP_LG_ROUTE_ID == routeId; });
    if (!r) return;
    var oLat = r.ORIGIN_LAT, oLng = r.ORIGIN_LNG;
    var dLat = r.DEST_LAT,   dLng = r.DEST_LNG;
    var cLat = r.CURRENT_LAT, cLng = r.CURRENT_LNG;
    if (!oLat || !dLat) return;

    var prog = +r.ROUTE_PROGRESS_PERC || 0;

    // Halo de fundo sobre a rota completa
    L.polyline([[oLat, oLng], [dLat, dLng]], { color: '#f59e0b', weight: 14, opacity: 0.18 }).addTo(hlLayer);

    if (r.SHP_LG_ROUTE_STATUS === 'IN_PROGRESS' && prog > 0.02 && cLat && cLng) {
      // Trecho percorrido: sólido âmbar
      L.polyline([[oLat, oLng], [cLat, cLng]], { color: '#fde68a', weight: 4, opacity: 0.95 })
        .bindPopup(popup(r), { maxWidth: 320 }).addTo(hlLayer);
      // Trecho restante: tracejado discreto
      L.polyline([[cLat, cLng], [dLat, dLng]], { color: '#fde68a', weight: 2, opacity: 0.35, dashArray: '5,8' })
        .bindPopup(popup(r), { maxWidth: 320 }).addTo(hlLayer);
      // Ponto de origem
      L.circleMarker([oLat, oLng], { radius: 5, color: '#fde68a', weight: 2, fillColor: '#0f172a', fillOpacity: 1 }).addTo(hlLayer);
      // Marcador do veículo ampliado
      L.circleMarker([cLat, cLng], {
        radius: 13, color: '#f59e0b', weight: 3, fillColor: '#fbbf24', fillOpacity: 0.90
      }).bindPopup(popup(r), { maxWidth: 320 }).addTo(hlLayer);
      // Marcador de destino
      L.circleMarker([dLat, dLng], { radius: 6, color: '#fde68a', weight: 2, fillColor: '#1e293b', fillOpacity: 1 }).addTo(hlLayer);
    } else {
      L.polyline([[oLat, oLng], [dLat, dLng]], { color: '#fde68a', weight: 2.5, opacity: 1 })
        .bindPopup(popup(r), { maxWidth: 320 }).addTo(hlLayer);
      if (cLat && cLng) {
        L.circleMarker([cLat, cLng], {
          radius: 12, color: '#f59e0b', weight: 3, fillColor: '#fbbf24', fillOpacity: 0.85
        }).bindPopup(popup(r), { maxWidth: 320 }).addTo(hlLayer);
      }
    }

    // Busca rota real pelas estradas (OSRM) e substitui o highlight simples
    showRoadRoute(r);
  }
}
// ── Toggle painel crise ───────────────────────────────────────────────────────
function toggleCrisis() {
  const panel = document.getElementById('crisis-panel');
  const btn   = document.getElementById('btnCrise');
  const hidden = panel.classList.toggle('hidden');
  if (btn) btn.classList.toggle('active', !hidden);
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIMA — Open-Meteo (client-side, sem API key) + INMET (embutido do Python)
// ─────────────────────────────────────────────────────────────────────────────
let weatherLayer = L.layerGroup();   // não adicionado ao mapa ainda
let weatherVisible = false;
let weatherLoaded  = false;

// WMO weather codes → descrição PT-BR
const WMO = {
  0:'Céu limpo', 1:'Predominante limpo', 2:'Parcialmente nublado', 3:'Nublado',
  45:'Nevoeiro', 48:'Nevoeiro c/ gelo depositado',
  51:'Garoa leve', 53:'Garoa moderada', 55:'Garoa densa',
  61:'Chuva leve', 63:'Chuva moderada', 65:'Chuva forte',
  66:'Chuva congelante leve', 67:'Chuva congelante forte',
  71:'Nevada leve', 73:'Nevada moderada', 75:'Nevada forte',
  80:'Pancadas leves', 81:'Pancadas moderadas', 82:'Pancadas fortes',
  85:'Pancadas de neve leves', 86:'Pancadas de neve fortes',
  95:'Tempestade', 96:'Tempestade c/ granizo leve', 99:'Tempestade c/ granizo forte',
};

function wmoSeverity(code, precip) {
  if (code >= 95)                        return 4; // tempestade
  if (code >= 80 || code === 65)         return 3; // chuva forte / pancadas
  if (code >= 61 || code === 55)         return 2; // chuva moderada
  if (code >= 51 || code === 45 || code === 48) return 1; // garoa / névoa
  if (precip > 5)                        return 3;
  if (precip > 1)                        return 2;
  return 0;
}

const WEATHER_COLORS = { 0:'transparent', 1:'#60a5fa', 2:'#2563eb', 3:'#1e3a8a', 4:'#7c3aed' };
const WEATHER_ICONS  = { 0:'', 1:'🌫', 2:'🌧', 3:'🌧', 4:'⛈' };

const INMET_COLORS = { VERMELHO:'#ef4444', LARANJA:'#f97316', AMARELO:'#eab308' };

// ── Extrair coords únicas por facility ────────────────────────────────────────
function getUniqueFacilities() {
  const facs = {};
  RAW_DATA.forEach(r => {
    if (r.ORIGIN_LAT && r.ORIGIN_LNG && r.SHP_ORIGIN_FACILITY_ID)
      facs[r.SHP_ORIGIN_FACILITY_ID] = { lat: r.ORIGIN_LAT, lng: r.ORIGIN_LNG, name: r.SHP_ORIGIN_FACILITY_ID, regional: r.SHP_ORIGIN_REGIONAL_L1 };
    if (r.DEST_LAT && r.DEST_LNG && r.SHP_DESTINATION_FACILITY_ID)
      facs[r.SHP_DESTINATION_FACILITY_ID] = { lat: r.DEST_LAT, lng: r.DEST_LNG, name: r.SHP_DESTINATION_FACILITY_ID, regional: r.SHP_DESTINATION_REGIONAL_L1 };
  });
  return Object.values(facs);
}

// ── Busca Open-Meteo em batches de 20 ────────────────────────────────────────
async function fetchOpenMeteo(facs) {
  const results = {};
  const size = 20;
  for (let i = 0; i < facs.length; i += size) {
    const batch = facs.slice(i, i + size);
    const lats  = batch.map(f => f.lat.toFixed(4)).join(',');
    const lngs  = batch.map(f => f.lng.toFixed(4)).join(',');
    const url   = \`https://api.open-meteo.com/v1/forecast?latitude=\${lats}&longitude=\${lngs}&current=weathercode,precipitation,windspeed_10m,temperature_2m&timezone=America/Sao_Paulo&forecast_days=1\`;
    try {
      const data = await (await fetch(url)).json();
      const arr  = Array.isArray(data) ? data : [data];
      arr.forEach((w, j) => {
        const f = batch[j];
        if (!f) return;
        results[f.name] = {
          fac:    f,
          code:   w.current?.weathercode ?? 0,
          precip: w.current?.precipitation ?? 0,
          wind:   w.current?.windspeed_10m ?? 0,
          temp:   w.current?.temperature_2m ?? null,
        };
      });
    } catch(e) { console.warn('Open-Meteo batch error:', e); }
  }
  return results;
}

// ── Desenha layer de clima ────────────────────────────────────────────────────
async function buildWeatherLayer() {
  weatherLayer.clearLayers();
  let alertCount = 0;

  // 1. INMET (embutido — dados do momento da geração)
  INMET_ALERTS.forEach(a => {
    const col = INMET_COLORS[a.nivel] || '#eab308';
    L.circleMarker([a.lat, a.lng], {
      radius: 14, color: col, weight: 2, fillColor: col, fillOpacity: 0.25
    }).bindPopup(\`<div style="font-size:12px;min-width:180px">
      <b style="color:\${col}">⚠️ INMET — \${a.nivel}</b><br>
      <b>\${a.evento}</b><br>
      \${a.municipio}<br>
      <span style="color:#64748b;font-size:10px">\${a.inicio} → \${a.fim}</span>
    </div>\`).addTo(weatherLayer);
    alertCount++;
  });

  // 2. Open-Meteo — clima atual por facility
  const facs = getUniqueFacilities();
  const climaBadgeEl = document.getElementById('climaBadge');
  if (climaBadgeEl) climaBadgeEl.textContent = '…';
  const weather = await fetchOpenMeteo(facs);

  let weatherAlerts = 0;
  Object.values(weather).forEach(w => {
    const sev = wmoSeverity(w.code, w.precip);
    if (sev < 2) return;   // só mostra chuva moderada pra cima
    weatherAlerts++;
    const col  = WEATHER_COLORS[sev];
    const icon = WEATHER_ICONS[sev];
    const label = WMO[w.code] || \`Código \${w.code}\`;
    L.circleMarker([w.fac.lat, w.fac.lng], {
      radius: 10 + sev * 2, color: col, weight: 2,
      fillColor: col, fillOpacity: 0.4
    }).bindPopup(\`<div style="font-size:12px;min-width:180px">
      <b>\${icon} \${w.fac.name}</b> \${w.fac.regional ? '('+w.fac.regional+')' : ''}<br>
      <b style="color:\${col}">\${label}</b><br>
      🌧 Precipitação: <b>\${w.precip.toFixed(1)} mm</b><br>
      💨 Vento: <b>\${w.wind.toFixed(0)} km/h</b><br>
      \${w.temp !== null ? '🌡️ Temp: <b>'+w.temp.toFixed(1)+'°C</b><br>' : ''}
      <span style="color:#64748b;font-size:10px">Fonte: Open-Meteo</span>
    </div>\`).addTo(weatherLayer);
  });

  const total = alertCount + weatherAlerts;
  if (climaBadgeEl) { climaBadgeEl.textContent = total; climaBadgeEl.style.background = total > 0 ? '#ef4444' : '#0284c7'; }
  weatherLoaded = true;

  // Atualiza painel de crise com info de clima
  enrichCrisisWithWeather(weather);
}

// ── Enriquecer painel de crise com clima ─────────────────────────────────────
function enrichCrisisWithWeather(weather) {
  crisisRoutes.forEach(function(r, i) {
    var worig = weather[r.SHP_ORIGIN_FACILITY_ID];
    var wdest = weather[r.SHP_DESTINATION_FACILITY_ID];
    var alerts = [];
    if (worig && wmoSeverity(worig.code, worig.precip) >= 2)
      alerts.push('🌧 ' + r.SHP_ORIGIN_FACILITY_ID + ': ' + (WMO[worig.code]||'') + ' (' + worig.precip.toFixed(1) + 'mm)');
    if (wdest && wmoSeverity(wdest.code, wdest.precip) >= 2)
      alerts.push('🌧 ' + r.SHP_DESTINATION_FACILITY_ID + ': ' + (WMO[wdest.code]||'') + ' (' + wdest.precip.toFixed(1) + 'mm)');
    if (alerts.length) {
      var el = document.querySelector('[data-idx="' + i + '"] .crisis-meta');
      if (el) {
        var div = document.createElement('div');
        div.style.cssText = 'margin-top:4px;font-size:10px;color:#7dd3fc;';
        div.innerHTML = alerts.join('<br>');
        el.parentNode.insertBefore(div, el.nextSibling);
      }
    }
  });
}

function toggleWeather() {
  const btn = document.getElementById('btnClima');
  if (!weatherVisible) {
    if (!weatherLoaded) buildWeatherLayer();
    weatherLayer.addTo(map);
    weatherVisible = true;
    if (btn) btn.style.background = '#06b6d4';
  } else {
    map.removeLayer(weatherLayer);
    weatherVisible = false;
    if (btn) btn.style.background = '#0e7490';
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
window.onerror = function(msg, src, line, col, err) {
  var d = document.createElement('div');
  d.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#7f1d1d;color:#fca5a5;padding:20px;border-radius:8px;z-index:9999;font-size:13px;max-width:80%;word-break:break-all;';
  d.innerHTML = '<b>JS Error:</b><br>' + msg + '<br><small>' + src + ':' + line + '</small>';
  document.body.appendChild(d);
};
try {
  var _tsEl = document.getElementById('ts-ctrl');
  var _nuEl = document.getElementById('next-ctrl');
  var _tsHdr = document.getElementById('ts');
  var _nuHdr = document.getElementById('next-update');
  if (_tsEl) _tsEl.textContent = 'Atualizado: ' + GENERATED_AT.slice(11,16);
  if (_tsHdr) { _tsHdr.textContent = 'Atualizado: ' + GENERATED_AT.slice(11,16); }
  try {
    var _d = new Date(GENERATED_AT.replace(' ','T'));
    _d.setMinutes(_d.getMinutes() + 15);
    // Próxima atualização: próxima janela de 5min a partir de agora (alinhado com DataFlow)
    var _slot15 = 5 * 60 * 1000;
    var _reloadAt = Date.now() + (_slot15 - (Date.now() % _slot15));
    var _nextD = new Date(_reloadAt);
    var _hh = String(_nextD.getHours()).padStart(2,'0');
    var _mm = String(_nextD.getMinutes()).padStart(2,'0');
    if (_nuEl) _nuEl.textContent = 'Próx: ' + _hh + ':' + _mm;
    if (_nuHdr) _nuHdr.textContent = 'Próx: ' + _hh + ':' + _mm;
    // Auto-refresh removido — dados são atualizados via postMessage pelo React
  } catch(e) {}
  const _cb = document.getElementById('climaBadge'); if (_cb) _cb.textContent = INMET_ALERTS.length || '?';
  const CANCELLED = ['CANCELLED', 'CANCELED'];
  const initData = RAW_DATA.filter(r => r.SHP_LG_ROUTE_STATUS !== 'FINISHED' && !CANCELLED.includes(r.SHP_LG_ROUTE_STATUS));
  buildTipoFilter(initData);
  buildSelectFilters(RAW_DATA);
  // Usar a data mais recente disponível nos dados (ou hoje se não houver dados)
  const today = new Date().toISOString().slice(0,10);
  const latestDate = RAW_DATA.reduce((max, r) => {
    const d = String(r.ETA_DATE || '').slice(0,10);
    return d > max ? d : max;
  }, '');
  const defaultDate = latestDate || today;
  const _ff = document.getElementById('fDateFrom'); if (_ff && !_ff.value) _ff.value = defaultDate;
  const _ft = document.getElementById('fDateTo');   if (_ft && !_ft.value) _ft.value = defaultDate;
  // Restaurar estado salvo antes do auto-reload (tab + filtros de data)
  var _restoredTab = 0;
  try {
    var _savedTab  = localStorage.getItem('lhmap_tab');
    var _savedFrom = localStorage.getItem('lhmap_date_from');
    var _savedTo   = localStorage.getItem('lhmap_date_to');
    if (_savedFrom && _ff) _ff.value = _savedFrom;
    if (_savedTo   && _ft) _ft.value = _savedTo;
    if (_savedTab !== null) _restoredTab = parseInt(_savedTab) || 0;
    localStorage.removeItem('lhmap_tab');
    localStorage.removeItem('lhmap_date_from');
    localStorage.removeItem('lhmap_date_to');
  } catch(e) {}
  // Lista começa filtrada pelo intervalo de datas ativo (restaurado ou padrão)
  var _activeFrom = (_ff && _ff.value) ? _ff.value : defaultDate;
  var _activeTo   = (_ft && _ft.value) ? _ft.value : defaultDate;
  window._allFilteredForList = RAW_DATA.filter(r => {
    const d = String(r.ETA_DATE || '').slice(0,10);
    return d >= _activeFrom && d <= _activeTo;
  });
  drawRoutes(initData);
  setTimeout(function() {
    if (_restoredTab === 1) {
      switchTab('list');
    } else {
      map.invalidateSize(); map.fitBounds(DEFAULT_BOUNDS);
    }
  }, 200);
} catch(e) {
  window.onerror(e.message, 'init', 0, 0, e);
}

// ── Refresh silencioso via postMessage do React ────────────────────────────
function requestRefresh() {
  var icon = document.getElementById('btnRefreshIcon');
  if (icon) { icon.style.color = '#3b82f6'; icon.style.animation = 'spin-refresh 0.8s linear infinite'; }
  var btn = document.getElementById('btnRefresh');
  if (btn) btn.style.pointerEvents = 'none';
  window.parent.postMessage({ type: 'LH_REFRESH' }, '*');
}

window.addEventListener('message', function(e) {
  if (!e.data || e.data.type !== 'LH_DATA_UPDATE') return;
  try {
    if (e.data.routes)   { RAW_DATA = e.data.routes; }
    if (e.data.tracking) { TRACKING_DATA = e.data.tracking; }
    if (e.data.generatedAt) {
      GENERATED_AT = e.data.generatedAt;
      var _t = GENERATED_AT.slice(11,16);
      var el1 = document.getElementById('ts-ctrl');  if (el1) el1.textContent = 'Atualizado: ' + _t;
      var el2 = document.getElementById('ts');       if (el2) el2.textContent = 'Atualizado: ' + _t;
    }
    // Re-habilita botão ↻
    var icon = document.getElementById('btnRefreshIcon');
    if (icon) { icon.style.color = ''; icon.style.animation = ''; }
    var btn = document.getElementById('btnRefresh');
    if (btn) btn.style.pointerEvents = '';
    // Mostra badge "Atualizado" por 3s
    var badge = document.getElementById('refresh-badge');
    if (badge) { badge.style.display = 'flex'; setTimeout(function(){ badge.style.display = 'none'; }, 3000); }
    applyFilters();
  } catch(ex) { console.warn('LH_DATA_UPDATE error', ex); }
});
</script>

<!-- Checkpoint Tooltip -->
<div id="ck-tooltip"></div>

<!-- DIT Modal -->
<div id="dit-modal">
  <div id="dit-modal-box">
    <div id="dit-modal-header">
      <span id="dit-modal-title">DIT</span>
      <button id="dit-modal-close" onclick="document.getElementById('dit-modal').classList.remove('open')">&times;</button>
    </div>
    <div id="dit-modal-body"></div>
  </div>
</div>
</body>
</html>
`;
