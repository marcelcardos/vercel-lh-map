export const HTML_TEMPLATE_DIT = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>LH DIT \u2014 CCO</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;font-family:'Segoe UI',system-ui,sans-serif;background:#f1f5f9;color:#1e293b}
#wrapper{display:flex;height:100vh;width:100vw;overflow:hidden}
#sidebar{width:210px;min-width:210px;background:#FFE600;display:flex;flex-direction:column;border-right:2px solid #E6CF00;overflow:hidden}
#sb-scroll{flex:1;overflow-y:auto;overflow-x:hidden}
#sb-scroll::-webkit-scrollbar{width:4px}
#sb-scroll::-webkit-scrollbar-thumb{background:rgba(0,0,0,.2);border-radius:2px}
.sb-lbl{font-size:9px;font-weight:900;color:rgba(0,0,0,.5);letter-spacing:.08em;text-transform:uppercase;margin-bottom:2px}
.sb-select,.sb-input{width:100%;background:rgba(255,255,255,.6);border:1.5px solid rgba(0,0,0,.2);border-radius:4px;padding:0 5px;font-size:10px;color:#2D3236;outline:none;height:22px}
input[type=date].sb-input{font-size:10px;padding:0 4px}
.sb-btn{width:100%;height:22px;border:none;border-radius:4px;font-size:10px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;text-transform:uppercase;letter-spacing:.04em}
.sb-btn-outline{background:transparent;color:#2D3236;border:1.5px solid rgba(0,0,0,.25)}
.sb-btn-outline:hover{background:rgba(0,0,0,.08)}
#app{display:flex;flex-direction:column;flex:1;overflow:hidden;min-width:0}
#header{background:#2D3236;padding:10px 20px;display:flex;align-items:center;gap:12px;border-bottom:4px solid #FFE600;flex-shrink:0}
#header h1{font-size:16px;font-weight:800;color:#fff}
#header .ts{font-size:11px;color:#adb5bd;margin-left:auto}
#tabs{background:#fff;border-bottom:2px solid #e2e8f0;padding:0 20px;display:flex;flex-shrink:0}
.tab-btn{padding:10px 20px;font-size:12px;font-weight:700;color:#64748b;border:none;background:none;cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-2px;letter-spacing:.04em;text-transform:uppercase}
.tab-btn:hover{color:#1e293b}
.tab-btn.active{color:#2D3236;border-bottom-color:#FFE600}
.tab-pane{display:none;flex:1;overflow:hidden;flex-direction:column}
.tab-pane.active{display:flex}
#brief-scroll{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px}
.brief-hero{border-radius:12px;padding:20px 24px;display:flex;align-items:center;gap:20px;border:1.5px solid #e5e7eb}
.hero-badge{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0}
.hero-info h2{font-size:19px;font-weight:800;color:#1e293b;margin-bottom:3px}
.hero-info p{font-size:12px;color:#64748b}
.hero-status-label{display:inline-block;margin-top:6px;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:3px 10px;border-radius:20px}
.narrative{background:#fff;border-radius:10px;padding:16px 20px;border-left:4px solid #FFE600;box-shadow:0 1px 4px rgba(0,0,0,.07);font-size:13px;line-height:1.75;color:#374151}
.metrics-row{display:flex;gap:12px}
.mc{flex:1;background:#fff;border-radius:10px;padding:14px 16px;box-shadow:0 1px 4px rgba(0,0,0,.07);border:1.5px solid #e5e7eb}
.mc .mc-lbl{font-size:9px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px}
.mc .mc-num{font-size:30px;font-weight:900;line-height:1;margin-bottom:4px}
.mc .mc-sub{font-size:11px;color:#94a3b8;margin-top:2px}
.mc.red .mc-num{color:#ef4444}.mc.red{border-color:#fca5a5}
.mc.yellow .mc-num{color:#d97706}.mc.yellow{border-color:#fcd34d}
.mc.green .mc-num{color:#16a34a}.mc.green{border-color:#86efac}
.mc.blue .mc-num{color:#3483FA}.mc.blue{border-color:#93c5fd}
.meta-bar-track{height:6px;background:#e5e7eb;border-radius:3px;overflow:hidden;margin-top:8px}
.meta-bar-fill{height:100%;border-radius:3px}
.meta-bar-lbl{font-size:10px;color:#94a3b8;margin-top:3px}
.ranking-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.carrier-card{background:#fff;border-radius:10px;padding:14px 16px;box-shadow:0 1px 4px rgba(0,0,0,.07)}
.carrier-card h3{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:12px}
.cb-row{display:flex;align-items:center;gap:8px;margin-bottom:7px;cursor:pointer;border-radius:4px;padding:2px 4px;transition:background .1s}
.cb-row:hover{background:#f1f5f9}
.cb-name{font-size:11px;color:#374151;min-width:110px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cb-track{flex:1;height:8px;background:#f1f5f9;border-radius:4px;overflow:hidden}
.cb-fill{height:100%;border-radius:4px;background:#ef4444}
.cb-val{font-size:10px;font-weight:700;color:#64748b;min-width:50px;text-align:right}
.gloss-card-wrap{background:#fff;border-radius:10px;padding:14px 16px;box-shadow:0 1px 4px rgba(0,0,0,.07)}
.gloss-card-wrap h3{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:12px}
.gloss-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.gc{border:1.5px solid #e5e7eb;border-radius:8px;padding:12px;cursor:pointer;transition:box-shadow .12s}
.gc:hover{box-shadow:0 2px 8px rgba(0,0,0,.09)}
.gc-title{font-size:12px;font-weight:700;color:#1e293b;margin-bottom:4px;display:flex;align-items:center;gap:6px}
.gc-badge{font-size:9px;padding:2px 7px;border-radius:8px;font-weight:800}
.gc-body{font-size:11px;color:#64748b;line-height:1.55;display:none;margin-top:6px;border-top:1px solid #f1f5f9;padding-top:6px}
.gc.open .gc-body{display:block}
.cta-row{display:flex;justify-content:flex-end;padding-bottom:4px}
.cta-btn{background:#2D3236;color:#FFE600;border:none;border-radius:8px;padding:11px 26px;font-size:12px;font-weight:800;cursor:pointer;letter-spacing:.05em;text-transform:uppercase}
.cta-btn:hover{background:#1a1f22}
#statsbar{background:#fff;border-bottom:1px solid #E0E0E0;padding:9px 20px;display:flex;gap:12px;flex-shrink:0;align-items:center}
.stat{background:#f9fafb;border:1.5px solid #e5e7eb;border-radius:8px;padding:6px 18px;text-align:center;cursor:pointer;transition:box-shadow .12s;min-width:90px}
.stat:hover{box-shadow:0 2px 8px rgba(0,0,0,.1)}
.stat.active{box-shadow:0 0 0 2.5px #2D3236}
.stat .n{font-size:22px;font-weight:800;line-height:1.1}
.stat .l{font-size:9px;color:#64748b;margin-top:2px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
.stat.blue{border-color:#3483FA;background:#EFF6FF}.stat.blue .n{color:#3483FA}
.stat.red{border-color:#FF3333;background:#FEF2F2}.stat.red .n{color:#FF3333}
.stat.yellow{border-color:#F59E0B;background:#FFFBEB}.stat.yellow .n{color:#C97F00}
.stat.purple{border-color:#8b5cf6;background:#f5f3ff}.stat.purple .n{color:#7c3aed}
#rotas-main{display:flex;flex:1;overflow:hidden}
#rotas-scroll{flex:1;overflow-y:auto;padding:14px 20px}
.section{background:#fff;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,.07);overflow:hidden;margin-bottom:12px}
.section-title{padding:10px 14px;font-size:12px;font-weight:700;color:#475569;border-bottom:1px solid #f1f5f9;text-transform:uppercase;letter-spacing:.05em}
table{width:100%;border-collapse:collapse;font-size:12px}
th{background:#f8fafc;padding:7px 8px;text-align:left;font-weight:600;color:#64748b;font-size:11px;border-bottom:1px solid #e2e8f0;white-space:nowrap;cursor:pointer;user-select:none;position:relative}
th:hover{background:#f1f5f9}
th.sorted-asc::after{content:' \u25b2';font-size:9px;color:#64748b}
th.sorted-desc::after{content:' \u25bc';font-size:9px;color:#64748b}
td{padding:6px 8px;border-bottom:1px solid #f8fafc;vertical-align:middle;font-size:11px}
tr:last-child td{border-bottom:none}
tr.route-row{cursor:pointer;transition:background .1s}
tr.route-row:hover td{background:#fffde7}
tr.route-row.selected td{background:#fff9c4;border-left:3px solid #FFE600}
#drill{width:0;background:#fff;border-left:1px solid #E0E0E0;display:flex;flex-direction:column;flex-shrink:0;overflow:hidden;transition:width .2s;box-shadow:-2px 0 8px rgba(0,0,0,.06)}
#drill.open{width:370px}
#drill-header{padding:10px 12px 8px;border-bottom:1px solid #E0E0E0;flex-shrink:0;background:#fff8e1}
#drill-header h2{font-size:13px;font-weight:700;color:#92400e}
#drill-header .sub{font-size:11px;color:#6b7280;margin-top:2px}
#drill-body{flex:1;overflow-y:auto;padding:8px 12px}
.shp-row{padding:8px 10px;border-radius:6px;border:1px solid #e5e7eb;margin-bottom:6px}
.shp-row:hover{background:#fafafa}
.cause-lhgr{background:#dbeafe;color:#1d4ed8;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:700}
.cause-missing{background:#fde68a;color:#92400e;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:700}
.cause-other{background:#f3f4f6;color:#374151;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:700}
.drill-empty{color:#94a3b8;font-size:12px;text-align:center;padding:24px 0}
.close-btn{float:right;background:none;border:none;font-size:16px;cursor:pointer;color:#6b7280;line-height:1}
.close-btn:hover{color:#1e293b}
.lh-timeline{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;font-size:10px}
.lh-col{background:#f8fafc;border-radius:4px;padding:6px 8px}
.lh-col .lh-col-lbl{font-weight:700;color:#64748b;margin-bottom:3px;font-size:9px;text-transform:uppercase;letter-spacing:.05em}
.lh-col .lh-col-val{color:#1e293b}
.breakdown-row{display:flex;gap:12px}
.bk-card{flex:1;background:#fff;border-radius:10px;padding:14px 16px;box-shadow:0 1px 4px rgba(0,0,0,.07);border:1.5px solid #e5e7eb;cursor:pointer;transition:box-shadow .12s}
.bk-card:hover{box-shadow:0 2px 10px rgba(0,0,0,.12)}
.bk-card .bk-lbl{font-size:9px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px}
.bk-card .bk-num{font-size:26px;font-weight:900;line-height:1;margin-bottom:2px}
.bk-card .bk-pct{font-size:12px;font-weight:700}
.bk-card .bk-sub{font-size:10px;color:#94a3b8;margin-top:3px}
.bk-card.orange{border-color:#fdba74;background:#fff7ed}.bk-card.orange .bk-num,.bk-card.orange .bk-pct{color:#ea580c}
.bk-card.slate{border-color:#cbd5e1;background:#f8fafc}.bk-card.slate .bk-num,.bk-card.slate .bk-pct{color:#475569}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:3px}
</style>
</head>
<body>
<div id="wrapper">

<div id="sidebar">
  <div style="padding:10px 14px 8px;border-bottom:2px solid rgba(0,0,0,.18);flex-shrink:0;text-align:center">
    <div style="font-size:30px;font-weight:900;color:#2D3236;letter-spacing:-.5px;line-height:1">CCO</div>
    <div style="font-size:8px;font-weight:900;color:#2D3236;letter-spacing:.1em;text-transform:uppercase;margin-top:2px">CONTROLES OPERACIONAIS</div>
    <div style="margin-top:6px;height:2px;background:#2D3236;border-radius:1px;opacity:.2"></div>
    <div style="margin-top:5px;font-size:10px;font-weight:700;color:#2D3236;letter-spacing:.05em">&#9660; LH DIT</div>
  </div>
  <div style="padding:6px 10px 8px;border-bottom:1px solid rgba(0,0,0,.12);flex-shrink:0">
    <div class="sb-lbl">FILTROS (aba Rotas)</div>
    <div id="date-range-lbl" style="font-size:9px;color:rgba(0,0,0,.45);margin-top:2px;font-weight:600"></div>
  </div>
  <div id="sb-scroll" style="padding:8px 10px">
    <div style="display:flex;flex-direction:column;gap:6px">
      <div><div class="sb-lbl">DATA IN\u00cdCIO</div>
        <input id="fDateFrom" type="date" class="sb-input" onchange="applyFilters()"/></div>
      <div><div class="sb-lbl">DATA FIM</div>
        <input id="fDateTo" type="date" class="sb-input" onchange="applyFilters()"/></div>
      <div><div class="sb-lbl">CARRIER</div>
        <select id="fCarrier" class="sb-select" onchange="applyFilters()"><option value="">(Tudo)</option></select></div>
      <div><div class="sb-lbl">REGIONAL ORIGEM</div>
        <select id="fRegOrigem" class="sb-select" onchange="applyFilters()"><option value="">(Tudo)</option></select></div>
      <div><div class="sb-lbl">FACILITY ORIGEM</div>
        <select id="fOrigem" class="sb-select" onchange="applyFilters()"><option value="">(Tudo)</option></select></div>
      <div><div class="sb-lbl">REGIONAL DESTINO</div>
        <select id="fRegDestino" class="sb-select" onchange="applyFilters()"><option value="">(Tudo)</option></select></div>
      <div><div class="sb-lbl">FACILITY DESTINO</div>
        <select id="fDestino" class="sb-select" onchange="applyFilters()"><option value="">(Tudo)</option></select></div>
      <div><div class="sb-lbl">STATUS ROTA</div>
        <select id="fStatus" class="sb-select" onchange="applyFilters()">
          <option value="">(Tudo)</option>
          <option value="IN_PROGRESS">Em Andamento</option>
          <option value="FINISHED">Finalizado</option>
          <option value="PENDING">Pendente</option>
        </select></div>
      <div><div class="sb-lbl">ROUTE ID</div>
        <input id="fRoute" type="text" class="sb-input" placeholder="Ex: 44931431"
               onkeydown="if(event.key==='Enter')applyFilters()"/></div>
      <button onclick="resetFilters()" class="sb-btn sb-btn-outline" style="margin-top:4px">LIMPAR FILTROS</button>
    </div>
  </div>
</div>

<div id="app">
  <div id="header">
    <span style="font-size:18px">&#9660;</span>
    <h1>LH DIT \u2014 Line Haul Delay in Transit</h1>
    <span class="ts">MLB &bull; __DATE_LABEL__ &bull; __GENERATED_AT__</span>
  </div>
  <div id="tabs">
    <button class="tab-btn active" onclick="switchTab('briefing')">&#128203; BRIEFING</button>
    <button class="tab-btn"        onclick="switchTab('rotas')">&#128202; ROTAS</button>
  </div>

  <div id="pane-briefing" class="tab-pane active">
    <div id="brief-scroll">
      <div class="brief-hero" id="brief-hero">
        <div class="hero-badge" id="hero-badge"></div>
        <div class="hero-info">
          <h2>DIT Line Haul \u2014 Situa\u00e7\u00e3o Atual</h2>
          <p>MLB &bull; __DATE_LABEL__ &bull; __GENERATED_AT__</p>
          <span class="hero-status-label" id="hero-status-label"></span>
        </div>
      </div>
      <div class="narrative" id="narrative">Carregando...</div>
      <div class="metrics-row">
        <div class="mc" id="mc-dit">
          <div class="mc-lbl">DIT LH REGIONAL</div>
          <div class="mc-num" id="mc-dit-num">\u2013</div>
          <div class="mc-sub">pacotes sem entrega</div>
        </div>
        <div class="mc" id="mc-pct">
          <div class="mc-lbl">% DIT LH</div>
          <div class="mc-num" id="mc-pct-num">\u2013</div>
          <div class="meta-bar-track"><div class="meta-bar-fill" id="meta-fill"></div></div>
          <div class="meta-bar-lbl">Meta: __META_JSON__%</div>
        </div>
        <div class="mc blue" id="mc-rotas">
          <div class="mc-lbl">ROTAS COM DIT LH</div>
          <div class="mc-num" id="mc-rotas-num">\u2013</div>
          <div class="mc-sub" id="mc-rotas-sub"></div>
        </div>
        <div class="mc" id="mc-d1">
          <div class="mc-lbl">TEND\u00caNCIA vs D-1</div>
          <div class="mc-num" id="mc-d1-num" style="font-size:22px">\u2013</div>
          <div class="mc-sub" id="mc-d1-sub"></div>
        </div>
      </div>
      <div class="breakdown-row">
        <div class="bk-card orange" onclick="filterLateDep(true)" title="Clique para ver rotas com sa\u00edda atrasada">
          <div class="bk-lbl">&#9652; DIT em rotas que sa\u00edram atrasadas (&gt;30 min)</div>
          <div class="bk-num" id="bk-late-num">\u2013</div>
          <div class="bk-pct" id="bk-late-pct"></div>
          <div class="bk-sub" id="bk-late-sub">clique para filtrar</div>
        </div>
        <div class="bk-card slate" onclick="filterLateDep(false)" title="Clique para ver rotas pontuais">
          <div class="bk-lbl">&#10003; DIT em rotas pontuais na sa\u00edda</div>
          <div class="bk-num" id="bk-ontime-num">\u2013</div>
          <div class="bk-pct" id="bk-ontime-pct"></div>
          <div class="bk-sub" id="bk-ontime-sub">clique para filtrar</div>
        </div>
      </div>
      <div class="ranking-row">
        <div class="carrier-card">
          <h3>Top Carriers (DIT LH) \u2014 clique para filtrar</h3>
          <div id="carrier-bars"></div>
        </div>
        <div class="carrier-card">
          <h3>Regional Destino (DIT LH) \u2014 clique para filtrar</h3>
          <div id="regional-bars"></div>
        </div>
      </div>
      <div class="gloss-card-wrap">
        <h3>Gloss\u00e1rio r\u00e1pido \u2014 clique para expandir</h3>
        <div class="gloss-grid">
          <div class="gc" onclick="this.classList.toggle('open')">
            <div class="gc-title"><span class="gc-badge" style="background:#FEE2E2;color:#DC2626">DIT</span>Delay in Transit</div>
            <div class="gc-body">Pacote <b>sem tentativa de entrega</b> com promessa j\u00e1 vencida. Diferente do Delay (que tem entrega, mas atrasada), o DIT significa que o pacote nem chegou ainda.</div>
          </div>
          <div class="gc" onclick="this.classList.toggle('open')">
            <div class="gc-title"><span class="gc-badge" style="background:#DBEAFE;color:#1D4ED8">LH_GR</span>Chegou com atraso</div>
            <div class="gc-body">O pacote <b>entrou no grid do destino</b> (YMS Gate In), mas depois do cutoff. A rota atrasou e o pacote perdeu o prazo de entrega.</div>
          </div>
          <div class="gc" onclick="this.classList.toggle('open')">
            <div class="gc-title"><span class="gc-badge" style="background:#FDE68A;color:#92400E">Missing LH_GR</span>Nunca entrou no grid</div>
            <div class="gc-body">O pacote <b>n\u00e3o tem registro de Gate In</b> no destino. Pode estar em tr\u00e2nsito, com scan pendente ou fora da rota planejada.</div>
          </div>
        </div>
      </div>
      <div class="cta-row">
        <button class="cta-btn" onclick="switchTab('rotas')">VER DETALHES POR ROTA &#8594;</button>
      </div>
    </div>
  </div>

  <div id="pane-rotas" class="tab-pane">
    <div id="statsbar">
      <div class="stat blue" onclick="filterStat('')" id="stat-all">
        <div class="n" id="cnt-all">\u2013</div><div class="l">ROTAS</div>
      </div>
      <div class="stat red" onclick="filterStat('dit')" id="stat-dit">
        <div class="n" id="cnt-dit">\u2013</div><div class="l">COM DIT LH</div>
      </div>
      <div class="stat yellow" onclick="filterStat('lhgr')" id="stat-lhgr">
        <div class="n" id="cnt-lhgr">\u2013</div><div class="l">LH_GR</div>
      </div>
      <div class="stat purple" onclick="filterStat('missing')" id="stat-missing">
        <div class="n" id="cnt-missing">\u2013</div><div class="l">MISSING</div>
      </div>
    </div>
    <div id="rotas-main">
      <div id="rotas-scroll">
        <div class="section">
          <div class="section-title" id="table-title">Rotas</div>
          <div style="overflow-x:auto">
            <table>
              <thead><tr id="thead-tr">
                <th onclick="sortTable(0)">Route ID</th>
                <th onclick="sortTable(1)">Rota</th>
                <th>Tipo</th>
                <th onclick="sortTable(3)">Carrier</th>
                <th onclick="sortTable(4)">Origem \u2192 Destino</th>
                <th onclick="sortTable(5)">Gate Out</th>
                <th onclick="sortTable(6)">Gate In</th>
                <th onclick="sortTable(7)" title="Atraso m\u00e9dio LINE_HAUL dos pacotes em DIT">\u0394 DIT m\u00e9dio \u2139</th>
                <th onclick="sortTable(8)" style="text-align:right">Shp</th>
                <th onclick="sortTable(9)" style="text-align:right">DIT</th>
                <th onclick="sortTable(10)">% DIT</th>
                <th onclick="sortTable(11)">Causa L1</th>
                <th>Causa L2</th>
              </tr></thead>
              <tbody id="tbody"></tbody>
            </table>
          </div>
        </div>
      </div>
      <div id="drill">
        <div id="drill-header">
          <button class="close-btn" onclick="closeDrill()">&#10005;</button>
          <h2 id="drill-title">Shipments DIT LH</h2>
          <div class="sub" id="drill-sub"></div>
        </div>
        <div id="drill-body"></div>
      </div>
    </div>
  </div>
</div>
</div>

<script>
const ROUTES       = __ROUTES_JSON__;
const SHP_BY_ROUTE = __SHP_JSON__;
const STEPS_BY_SHP = __STEPS_JSON__;
const D1_DATA      = __D1_JSON__;
const META         = __META_JSON__;

function switchTab(name) {
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('pane-'+name).classList.add('active');
  document.querySelectorAll('.tab-btn')[name==='briefing'?0:1].classList.add('active');
  if(name==='rotas') applyFilters();
}

function filterCarrier(name) {
  const sel=document.getElementById('fCarrier');
  if(sel.value===name) { sel.value=''; }
  else { sel.value=name; }
  switchTab('rotas');
}
function filterRegional(name) {
  if(document.getElementById('fRegDestino').value===name) {
    document.getElementById('fRegDestino').value='';
  } else {
    document.getElementById('fRegDestino').value=name;
  }
  switchTab('rotas');
}

function initBriefing(routes) {
  if(!routes) routes=ROUTES;
  const totalRoutes=routes.length;
  const totalShp=routes.reduce((a,r)=>a+(r.TOTAL_SHIPMENTS||0),0);
  const totalDit=routes.reduce((a,r)=>a+(r.DIT_LH_REGIONAL||0),0);
  const routesWithDit=routes.filter(r=>(r.DIT_LH_REGIONAL||0)>0).length;
  const pctDit=totalShp>0?totalDit/totalShp*100:0;
  const status=pctDit>META*3?'CRITICO':pctDit>META?'ATENCAO':'OK';
  const cfg={
    CRITICO:{heroBg:'#FFF0F0',badgeBg:'#FEE2E2',icon:'&#128308;',label:'CR\u00cdTICO',labelBg:'#FEE2E2',labelColor:'#DC2626'},
    ATENCAO:{heroBg:'#FFFBEB',badgeBg:'#FEF3C7',icon:'&#128993;',label:'ATEN\u00c7\u00c3O',labelBg:'#FEF3C7',labelColor:'#D97706'},
    OK:     {heroBg:'#F0FDF4',badgeBg:'#DCFCE7',icon:'&#128994;',label:'NORMAL',labelBg:'#DCFCE7',labelColor:'#16A34A'},
  }[status];
  const hero=document.getElementById('brief-hero');
  hero.style.background=cfg.heroBg;
  document.getElementById('hero-badge').innerHTML=cfg.icon;
  document.getElementById('hero-badge').style.background=cfg.badgeBg;
  const lbl=document.getElementById('hero-status-label');
  lbl.textContent=cfg.label; lbl.style.background=cfg.labelBg; lbl.style.color=cfg.labelColor;

  const cmap={};
  routes.forEach(r=>{ const c=r.CARRIER||'Desconhecido'; cmap[c]=(cmap[c]||0)+(r.DIT_LH_REGIONAL||0); });
  const topC=Object.entries(cmap).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxC=topC[0]?.[1]||1;
  const rmap={};
  routes.forEach(r=>{ const reg=r.DEST_REGIONAL||'N/A'; rmap[reg]=(rmap[reg]||0)+(r.DIT_LH_REGIONAL||0); });
  const topR=Object.entries(rmap).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxR=topR[0]?.[1]||1;
  const topName=topC[0]?.[0]||'\u2013', topDit=topC[0]?.[1]||0, topPct=totalDit>0?Math.round(topDit/totalDit*100):0;

  document.getElementById('narrative').innerHTML = totalDit===0
    ? \`Chegam <b>\${totalRoutes}</b> rotas LH com <b>\${totalShp.toLocaleString('pt-BR')}</b> shipments. Nenhum pacote em DIT LH. &#127881;\`
    : \`Chegam <b>\${totalRoutes}</b> rotas LH com <b>\${totalShp.toLocaleString('pt-BR')}</b> shipments. \`
      +\`<b>\${totalDit.toLocaleString('pt-BR')}</b> pacotes em DIT LH (\${pctDit.toFixed(1)}%) em <b>\${routesWithDit}</b> rotas. \`
      +(topPct>0?\`Principal ofensor: <b>\${topName}</b> com \${topPct}% do DIT LH.\`:'');

  document.getElementById('mc-dit').classList.add(totalDit>0?(pctDit>META*3?'red':'yellow'):'green');
  document.getElementById('mc-dit-num').textContent=totalDit.toLocaleString('pt-BR');
  document.getElementById('mc-pct').classList.add(pctDit>META*3?'red':pctDit>META?'yellow':'green');
  document.getElementById('mc-pct-num').textContent=pctDit.toFixed(2)+'%';
  const fill=document.getElementById('meta-fill');
  fill.style.width=Math.min(pctDit/(META*5)*100,100)+'%';
  fill.style.background=pctDit>META*3?'#EF4444':pctDit>META?'#F59E0B':'#22C55E';
  document.getElementById('mc-rotas-num').textContent=routesWithDit;
  document.getElementById('mc-rotas-sub').textContent=\`de \${totalRoutes} total\`;
  const dateFrom=document.getElementById('fDateFrom').value;
  const dateTo=document.getElementById('fDateTo').value;
  // D-1: dia anterior ao dateFrom filtrado, calculado a partir dos dados em ROUTES
  let d1Pct=null;
  if(dateFrom) {
    const d=new Date(dateFrom+'T00:00:00');
    d.setDate(d.getDate()-1);
    const d1Str=d.toLocaleDateString('sv-SE');
    const d1Routes=ROUTES.filter(r=>r.ETA_DATE===d1Str);
    if(d1Routes.length>0) {
      const d1Shp=d1Routes.reduce((a,r)=>a+(r.TOTAL_SHIPMENTS||0),0);
      const d1Dit=d1Routes.reduce((a,r)=>a+(r.DIT_LH_REGIONAL||0),0);
      d1Pct=d1Shp>0?d1Dit/d1Shp*100:0;
    }
  }
  const hasTrend=d1Pct!==null;
  const delta=hasTrend?pctDit-d1Pct:0;
  const isWorse=hasTrend&&delta>0.05, isBetter=hasTrend&&delta<-0.05;
  document.getElementById('mc-d1').classList.add(isWorse?'red':isBetter?'green':'blue');
  document.getElementById('mc-d1-num').innerHTML=!hasTrend?'<span style="color:#94a3b8;font-size:14px">sem dado</span>':isWorse?'&#8593; Piorou':isBetter?'&#8595; Melhorou':'&#8596; Est\u00e1vel';
  document.getElementById('mc-d1-sub').textContent=hasTrend?\`D-1: \${d1Pct.toFixed(1)}% \u2192 hoje: \${pctDit.toFixed(1)}%\`:'';

  const mkBar=(name,val,maxVal,fn)=>{
    const pct=Math.round(val/maxVal*100), share=totalDit>0?Math.round(val/totalDit*100):0;
    const esc=name.replace(/'/g,"\\'");
    return \`<div class="cb-row" onclick="\${fn}('\${esc}')" title="Clique para filtrar">
      <div class="cb-name" title="\${name}">\${name}</div>
      <div class="cb-track"><div class="cb-fill" style="width:\${pct}%"></div></div>
      <div class="cb-val">\${val.toLocaleString('pt-BR')} <span style="color:#94a3b8;font-weight:400">\${share}%</span></div>
    </div>\`;
  };
  document.getElementById('carrier-bars').innerHTML=topC.length===0
    ?'<div style="color:#94a3b8;font-size:12px">Sem DIT LH no momento</div>'
    :topC.map(([n,v])=>mkBar(n,v,maxC,'filterCarrier')).join('');
  document.getElementById('regional-bars').innerHTML=topR.length===0
    ?'<div style="color:#94a3b8;font-size:12px">Sem DIT LH no momento</div>'
    :topR.map(([n,v])=>mkBar(n,v,maxR,'filterRegional')).join('');

  // Breakdown: DIT em rotas que saíram atrasadas vs pontuais
  const LATE_THR=30;
  const ditLate=routes.filter(r=>(r.GATE_OUT_DELAY_MIN||0)>LATE_THR).reduce((a,r)=>a+(r.DIT_LH_REGIONAL||0),0);
  const ditOt=totalDit-ditLate;
  const pctL=totalDit>0?Math.round(ditLate/totalDit*100):0;
  const pctO=totalDit>0?Math.round(ditOt/totalDit*100):0;
  const nLateRoutes=routes.filter(r=>(r.GATE_OUT_DELAY_MIN||0)>LATE_THR&&(r.DIT_LH_REGIONAL||0)>0).length;
  const nOtRoutes=routes.filter(r=>(r.GATE_OUT_DELAY_MIN||0)<=LATE_THR&&(r.DIT_LH_REGIONAL||0)>0).length;
  document.getElementById('bk-late-num').textContent=ditLate.toLocaleString('pt-BR');
  document.getElementById('bk-late-pct').textContent=pctL+'% do DIT LH';
  document.getElementById('bk-late-sub').textContent=nLateRoutes+' rotas com sa\u00edda atrasada';
  document.getElementById('bk-ontime-num').textContent=ditOt.toLocaleString('pt-BR');
  document.getElementById('bk-ontime-pct').textContent=pctO+'% do DIT LH';
  document.getElementById('bk-ontime-sub').textContent=nOtRoutes+' rotas pontuais';
}

let _statFilter='', _lateDepFilter=null, _sortCol=9, _sortAsc=false, _selectedRoute=null;

function filterLateDep(late) {
  _lateDepFilter=(_lateDepFilter===late)?null:late;
  switchTab('rotas');
}

function unique(arr) { return [...new Set(arr.filter(Boolean))].sort(); }
function populateSelect(id,vals) {
  const s=document.getElementById(id), cur=s.value;
  s.innerHTML='<option value="">(Tudo)</option>';
  vals.forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent=v; s.appendChild(o); });
  if(vals.includes(cur)) s.value=cur;
}
function initFilters() {
  populateSelect('fCarrier',    unique(ROUTES.map(r=>r.CARRIER)));
  populateSelect('fRegOrigem',  unique(ROUTES.map(r=>r.ORIGIN_REGIONAL)));
  populateSelect('fOrigem',     unique(ROUTES.map(r=>r.ORIGIN_FACILITY)));
  populateSelect('fRegDestino', unique(ROUTES.map(r=>r.DEST_REGIONAL)));
  populateSelect('fDestino',    unique(ROUTES.map(r=>r.DEST_FACILITY)));
  const dates=ROUTES.map(r=>r.ETA_DATE).filter(Boolean).sort();
  if(dates.length) {
    const dMin=dates[0], dMax=dates[dates.length-1];
    const df=document.getElementById('fDateFrom'), dt=document.getElementById('fDateTo');
    const todayStr=new Date().toLocaleDateString('sv-SE');
    const defDate=dates.includes(todayStr)?todayStr:dMax;
    df.value=defDate; df.min=dMin; df.max=dMax;
    dt.value=defDate; dt.min=dMin; dt.max=dMax;
    // label de aviso
    const lbl=document.getElementById('date-range-lbl');
    if(lbl) lbl.textContent=dMin===dMax
      ? 'Painel de ETA '+dMin.split('-').reverse().join('/')
      : 'ETA: '+dMin.split('-').reverse().slice(0,2).join('/')+' \u2192 '+dMax.split('-').reverse().slice(0,2).join('/');
  }
}

function getFiltered() {
  const carrier=document.getElementById('fCarrier').value,
        regOrig=document.getElementById('fRegOrigem').value,
        orig=document.getElementById('fOrigem').value,
        regDest=document.getElementById('fRegDestino').value,
        dest=document.getElementById('fDestino').value,
        status=document.getElementById('fStatus').value,
        comDit='1',
        routeId=document.getElementById('fRoute').value.trim(),
        dateFrom=document.getElementById('fDateFrom').value,
        dateTo=document.getElementById('fDateTo').value;
  return ROUTES.filter(r=>{
    if(carrier && r.CARRIER!==carrier) return false;
    if(regOrig && r.ORIGIN_REGIONAL!==regOrig) return false;
    if(orig    && r.ORIGIN_FACILITY!==orig) return false;
    if(regDest && r.DEST_REGIONAL!==regDest) return false;
    if(dest    && r.DEST_FACILITY!==dest) return false;
    if(status  && r.STATUS!==status) return false;
    if(comDit  && (r.DIT_LH_REGIONAL||0)===0) return false;
    if(routeId && !String(r.ROUTE_ID).includes(routeId) && !String(r.ROUTE_CODE).includes(routeId)) return false;
    if(dateFrom && r.ETA_DATE && r.ETA_DATE<dateFrom) return false;
    if(dateTo   && r.ETA_DATE && r.ETA_DATE>dateTo)   return false;
    if(_statFilter==='dit'     && (r.DIT_LH_REGIONAL||0)===0) return false;
    if(_statFilter==='lhgr'    && (r.DIT_LH_GR||0)===0) return false;
    if(_statFilter==='missing' && (r.DIT_MISSING_LH_GR||0)===0) return false;
    if(_lateDepFilter===true   && (r.GATE_OUT_DELAY_MIN||0)<=30) return false;
    if(_lateDepFilter===false  && (r.GATE_OUT_DELAY_MIN||0)>30)  return false;
    return true;
  });
}

function applyFilters() {
  const filtered=getFiltered();
  const rows=sorted(filtered);
  // Atualiza briefing com dados filtrados (limpa classes antes de re-renderizar)
  ['mc-dit','mc-pct','mc-rotas','mc-d1'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.classList.remove('red','yellow','green','blue');
  });
  initBriefing(filtered);
  renderTable(rows);
  updateStats(rows);
  updateSortHeaders();
  if(_selectedRoute && !rows.find(r=>String(r.ROUTE_ID)===_selectedRoute)) closeDrill();
}
function resetFilters() {
  ['fCarrier','fRegOrigem','fOrigem','fRegDestino','fDestino','fStatus'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('fRoute').value='';
  _statFilter=''; _lateDepFilter=null; document.querySelectorAll('.stat').forEach(s=>s.classList.remove('active'));
  initFilters(); applyFilters();
}
function filterStat(type) {
  _statFilter=_statFilter===type?'':type;
  document.querySelectorAll('.stat').forEach(s=>s.classList.remove('active'));
  const m={dit:'stat-dit',lhgr:'stat-lhgr',missing:'stat-missing'};
  if(_statFilter&&m[_statFilter]) document.getElementById(m[_statFilter]).classList.add('active');
  applyFilters();
}
function updateStats(rows) {
  document.getElementById('cnt-all').textContent    =rows.length;
  document.getElementById('cnt-dit').textContent    =rows.filter(r=>(r.DIT_LH_REGIONAL||0)>0).length;
  document.getElementById('cnt-lhgr').textContent   =rows.reduce((a,r)=>a+(r.DIT_LH_GR||0),0);
  document.getElementById('cnt-missing').textContent=rows.reduce((a,r)=>a+(r.DIT_MISSING_LH_GR||0),0);
  document.getElementById('table-title').textContent=\`\${rows.length} rotas\`;
}

// col: 0=ROUTE_ID,1=ROUTE_CODE,2=tipo(fixed),3=CARRIER,4=orig/dest(fixed),5=ATD,6=ATA,7=AVG_DIT_DELAY_MIN,8=TOTAL_SHIPMENTS,9=DIT_LH_REGIONAL,10=DIT_LH_PERC,11=DIT_LH_GR,12=L2(fixed)
const COL_KEYS=['ROUTE_ID','ROUTE_CODE',null,'CARRIER',null,'ATD','ATA','AVG_DIT_DELAY_MIN',
                'TOTAL_SHIPMENTS','DIT_LH_REGIONAL','DIT_LH_PERC','DIT_LH_GR',null];
function sorted(rows) {
  const key=COL_KEYS[_sortCol];
  if(!key) return rows;
  return [...rows].sort((a,b)=>{
    let av=a[key]??'', bv=b[key]??'';
    if(typeof av==='number'&&typeof bv==='number') return _sortAsc?av-bv:bv-av;
    return _sortAsc?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av));
  });
}
function sortTable(col) {
  if(COL_KEYS[col]===null) return;
  if(_sortCol===col) _sortAsc=!_sortAsc; else {_sortCol=col; _sortAsc=false;}
  applyFilters();
}
function updateSortHeaders() {
  document.querySelectorAll('#thead-tr th').forEach((th,i)=>{
    th.classList.remove('sorted-asc','sorted-desc');
    if(i===_sortCol) th.classList.add(_sortAsc?'sorted-asc':'sorted-desc');
  });
}

function avgDelayCell(val) {
  if(val===null||val===undefined) return '<span style="color:#94a3b8">\u2013</span>';
  if(val<=0) return '<span style="color:#16a34a;font-weight:700">\u2713</span>';
  const h=Math.floor(val/60), m=Math.round(val%60);
  const label=h>0?\`+\${h}h\${m>0?m+'min':''}\`:\`+\${Math.round(val)}min\`;
  const col=val<120?'#d97706':'#dc2626';
  return \`<span style="color:\${col};font-weight:700">\${label}</span>\`;
}
function pctBar(pct) {
  if(!pct) return '<span style="color:#94a3b8">0%</span>';
  const c=pct>=10?'#ef4444':pct>=5?'#f59e0b':'#22c55e';
  return \`<div style="display:flex;align-items:center;gap:5px">
    <div style="width:40px;height:5px;background:#e5e7eb;border-radius:3px">
      <div style="width:\${Math.min(pct,100)}%;height:100%;background:\${c};border-radius:3px"></div>
    </div><span style="color:\${c};font-weight:700;font-size:10px">\${pct}%</span></div>\`;
}
function l1Cell(gr,missing) {
  if(!gr&&!missing) return '<span style="color:#94a3b8">\u2013</span>';
  let p=[];
  if(gr)      p.push(\`<span class="cause-lhgr">LH_GR:\${gr}</span>\`);
  if(missing) p.push(\`<span class="cause-missing">Miss:\${missing}</span>\`);
  return p.join(' ');
}

function renderTable(rows) {
  document.getElementById('tbody').innerHTML=rows.map(r=>{
    const rid=String(r.ROUTE_ID), sel=rid===_selectedRoute?'selected':'';
    const dit=(r.DIT_LH_REGIONAL||0)>0?\`<b style="color:#ef4444">\${r.DIT_LH_REGIONAL}</b>\`:'0';
    return \`<tr class="route-row \${sel}" onclick="openDrill('\${rid}')" data-id="\${rid}">
      <td style="color:#94a3b8;font-size:10px">\${r.ROUTE_ID}</td>
      <td style="font-weight:600">\${r.ROUTE_CODE||rid}</td>
      <td><span style="background:#dbeafe;color:#1d4ed8;padding:1px 6px;border-radius:8px;font-size:9px;font-weight:700">LH</span></td>
      <td>\${r.CARRIER||''}</td>
      <td style="font-size:10px"><b>\${r.ORIGIN_REGIONAL||''}</b>/\${r.ORIGIN_FACILITY||''} \u2192 <b>\${r.DEST_REGIONAL||''}</b>/\${r.DEST_FACILITY||''}</td>
      <td style="font-size:10px;line-height:1.5">
        <div style="color:#94a3b8;font-size:9px">&#9200; \${r.ETD||'\u2013'}</div>
        <div style="color:\${(r.GATE_OUT_DELAY_MIN||0)>5?'#ef4444':'#16a34a'};font-weight:600">&#10003; \${r.ATD||'\u2013'}</div>
        \${(r.GATE_OUT_DELAY_MIN||0)>30?\`<span style="background:#ffedd5;color:#c2410c;padding:0px 5px;border-radius:6px;font-size:8px;font-weight:800;letter-spacing:.04em">SAIU TARDE</span>\`:''}
      </td>
      <td style="font-size:10px;line-height:1.5">
        <div style="color:#94a3b8;font-size:9px">&#9200; \${r.ETA||'\u2013'}</div>
        <div style="color:\${(r.DELAY_MINUTES||0)>5?'#ef4444':'#16a34a'};font-weight:600">&#10003; \${r.ATA||'\u2013'}</div>
      </td>
      <td>\${avgDelayCell(r.AVG_DIT_DELAY_MIN)}</td>
      <td style="text-align:right">\${(r.TOTAL_SHIPMENTS||0).toLocaleString('pt-BR')}</td>
      <td style="text-align:right">\${dit}</td>
      <td>\${pctBar(r.DIT_LH_PERC)}</td>
      <td>\${l1Cell(r.DIT_LH_GR,r.DIT_MISSING_LH_GR)}</td>
      <td>\${(r.DIT_LH_REGIONAL||0)>0?'<span style="background:#dcfce7;color:#16a34a;padding:1px 6px;border-radius:8px;font-size:9px;font-weight:700">Line Haul</span>':'<span style="color:#94a3b8">\u2013</span>'}</td>
    </tr>\`;
  }).join('');
}

function lhDelayLabel(min) {
  if(min===null||min===undefined||min==='None') return {html:'<span style="color:#94a3b8;font-size:16px">\u2013</span>',color:'#94a3b8'};
  const m=Number(min);
  if(m<=0) return {html:'<span style="color:#16a34a;font-size:18px;font-weight:700">No prazo \u2713</span>',color:'#16a34a'};
  const h=Math.floor(m/60), rem=Math.round(m%60);
  const label=h>0?\`+\${h}h\${rem>0?rem+'min':''}\`:\`+\${m}min\`;
  const col=m<120?'#d97706':'#dc2626';
  return {html:\`<span style="color:\${col};font-size:22px;font-weight:800">\${label}</span>\`,color:col};
}

function openDrill(routeId) {
  document.querySelectorAll('.route-row').forEach(tr=>tr.classList.remove('selected'));
  const tr=document.querySelector(\`tr[data-id="\${routeId}"]\`);
  if(tr) tr.classList.add('selected');
  _selectedRoute=routeId;
  const route=ROUTES.find(r=>String(r.ROUTE_ID)===routeId);
  const shps=SHP_BY_ROUTE[routeId]||[];
  document.getElementById('drill-title').textContent=route?.ROUTE_CODE||routeId;
  document.getElementById('drill-sub').textContent=
    route?\`\${route.CARRIER||''}  \${route.ORIGIN_FACILITY||''} \u2192 \${route.DEST_FACILITY||''}  |  \${shps.length} DIT LH\`:'';
  const body=document.getElementById('drill-body');
  if(shps.length===0) {
    body.innerHTML='<div class="drill-empty">Sem shipments DIT LH nesta rota</div>';
  } else {
    body.innerHTML=shps.map(s=>{
      const st=STEPS_BY_SHP[String(s.id)]||{};
      const lhd=lhDelayLabel(st.lhDelay);
      const cc=s.l1==='LH_GR'?'cause-lhgr':s.l1==='Missing LH_GR'?'cause-missing':'cause-other';
      const hasDelay=st.lhDelay!==null&&st.lhDelay!==undefined&&st.lhDelay!=='None'&&st.lhDelay!=='';
      const delMin=hasDelay?Number(st.lhDelay):null;
      const hh=delMin!==null?Math.floor(delMin/60):0,mm=delMin!==null?Math.round(delMin%60):0;
      const delLabel=delMin!==null&&delMin>0?(hh>0?\`+\${hh}h\${mm>0?mm+'min':''}\`:\`+\${delMin}min\`):null;
      const delColor=delMin!==null?(delMin>120?'#dc2626':delMin>0?'#d97706':'#16a34a'):'#94a3b8';
      const realColor=delMin!==null&&delMin>0?'#dc2626':'#16a34a';
      return \`<div class="shp-row">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span style="font-weight:700;font-size:12px">#\${s.id}</span>
          \${delMin===null?'<span style="color:#94a3b8;font-size:11px">sem dado</span>':delLabel?\`<span style="color:\${delColor};font-weight:700;font-size:12px">\${delLabel}</span>\`:'<span style="color:#16a34a;font-weight:700;font-size:12px">\u2713</span>'}
          <span style="color:#94a3b8;font-size:10px">atraso Line Haul</span>
        </div>
        <div style="margin-top:3px;font-size:10px;color:#94a3b8">HU: \${s.hu||'\u2013'}</div>
        <div style="margin-top:4px;display:flex;gap:6px;align-items:center">
          <span class="\${cc}">\${s.l1||'\u2013'}</span>
          <span style="font-size:10px;color:#64748b">DIT: \${s.prom||'\u2013'}</span>
        </div>
        <div class="lh-timeline" style="margin-top:8px">
          <div class="lh-col">
            <div class="lh-col-lbl">Planejado</div>
            <div class="lh-col-val">Sa\u00edda: \${st.pi||'\u2013'}<br>Chegada: \${st.pe||'\u2013'}</div>
          </div>
          <div class="lh-col" style="background:#fff9c4">
            <div class="lh-col-lbl" style="color:#92400e">Realizado</div>
            <div class="lh-col-val" style="color:\${realColor}">Sa\u00edda: \${st.ri||'\u2013'}<br>Chegada: \${st.re||'\u2013'}</div>
          </div>
        </div>
        <div style="margin-top:5px;font-size:10px">
          <a href="https://shipping.adminml.com/shipments/\${s.id}/steps" target="_blank"
             style="color:#3483fa;text-decoration:none;font-weight:600">shipping_steps \u2197</a>
        </div>
      </div>\`;
    }).join('');
  }
  document.getElementById('drill').classList.add('open');
}
function closeDrill() {
  document.getElementById('drill').classList.remove('open');
  document.querySelectorAll('.route-row').forEach(tr=>tr.classList.remove('selected'));
  _selectedRoute=null;
}

initBriefing();
initFilters();
applyFilters();
</script>
</body>
</html>`;
