(function () {
  'use strict';

  /* ── Simulated incident feed ── */
  const INCIDENTS = [
    { id:'SS-A1F3',  type:'fire',     icon:'🔥', title:'Fire / Smoke Reported',    zone:'East Wing – Floor 2',  severity:'critical', time:'2 min ago',  status:'active',   guests:12 },
    { id:'SS-B2E9',  type:'medical',  icon:'🏥', title:'Medical Emergency',         zone:'Room 412',             severity:'high',     time:'8 min ago',  status:'active',   guests:1  },
    { id:'SS-C3D7',  type:'security', icon:'🚨', title:'Security Threat',           zone:'Lobby – Ground Floor', severity:'high',     time:'15 min ago', status:'resolved', guests:0  },
    { id:'SS-D4C5',  type:'hazard',   icon:'⚠️', title:'Gas Leak Warning',          zone:'Parking Level B1',     severity:'medium',   time:'22 min ago', status:'resolved', guests:0  },
    { id:'SS-E5B2',  type:'distress', icon:'💙', title:'Personal Distress Call',    zone:'Room 308',             severity:'medium',   time:'31 min ago', status:'active',   guests:1  },
  ];

  const ALERTS = [
    { id:1, type:'fire',     icon:'🔥', title:'Fire Reported – East Wing',        body:'Smoke detected on Floor 2. Guests on floors 1–3 advised to use west stairwell. Evacuate calmly.',  zone:'50m radius',  time:'2 min ago',  severity:'critical' },
    { id:2, type:'medical',  icon:'🚑', title:'Medical Emergency in Progress',    body:'Paramedics en route to Room 412. Please avoid the 4th floor corridor until further notice.',         zone:'Floor 4',     time:'8 min ago',  severity:'high'     },
    { id:3, type:'security', icon:'🚨', title:'Security Alert – Lobby',           body:'Plain-clothes security officers are present in the lobby. Report anything suspicious to front desk.', zone:'Lobby area',  time:'15 min ago', severity:'high'     },
    { id:4, type:'weather',  icon:'⛈️', title:'Severe Weather Warning',           body:'Storm warning issued for this area until 11 PM. Avoid outdoor areas. Swimming pool closed.',         zone:'City-wide',   time:'1 hr ago',   severity:'medium'   },
    { id:5, type:'info',     icon:'ℹ️', title:'All-Clear: Gas Leak Resolved',     body:'The gas leak in Parking Level B1 has been resolved. Normal access restored. No injuries reported.',  zone:'Parking B1',  time:'45 min ago', severity:'info'     },
  ];

  const SEV_STYLE = {
    critical:{ bg:'rgba(239,68,68,0.12)',   color:'#ef4444', border:'rgba(239,68,68,0.4)',   label:'CRITICAL' },
    high:    { bg:'rgba(249,115,22,0.12)',  color:'#f97316', border:'rgba(249,115,22,0.4)',  label:'HIGH' },
    medium:  { bg:'rgba(245,158,11,0.12)', color:'#f59e0b', border:'rgba(245,158,11,0.4)',  label:'MEDIUM' },
    info:    { bg:'rgba(14,165,233,0.12)',  color:'#0ea5e9', border:'rgba(14,165,233,0.4)',  label:'INFO' },
  };

  /* ── Heat-map data (SVG grid) ── */
  const HEATMAP_CELLS = [
    { x:1, y:1, v:0.2 }, { x:2, y:1, v:0.4 }, { x:3, y:1, v:0.1 }, { x:4, y:1, v:0.3 },
    { x:1, y:2, v:0.6 }, { x:2, y:2, v:0.9 }, { x:3, y:2, v:0.7 }, { x:4, y:2, v:0.2 },
    { x:1, y:3, v:0.3 }, { x:2, y:3, v:0.5 }, { x:3, y:3, v:0.4 }, { x:4, y:3, v:0.8 },
    { x:1, y:4, v:0.1 }, { x:2, y:4, v:0.2 }, { x:3, y:4, v:0.6 }, { x:4, y:4, v:0.3 },
  ];

  function heatColor(v) {
    if (v < 0.3) return '#22c55e';
    if (v < 0.6) return '#f59e0b';
    if (v < 0.8) return '#f97316';
    return '#ef4444';
  }

  function render() {
    const page = document.getElementById('page-alerts');
    if (!page) return;

    page.innerHTML = `
    <div class="section">
      <div class="container--wide">

        <div style="margin-bottom:2rem;">
          <div class="section-label">Public Safety Intelligence</div>
          <h1 class="headline">Live Alerts & <span class="gradient-text">Incident Map</span></h1>
          <p style="color:var(--text-secondary);margin-top:0.5rem;">Geofenced notifications and real-time incident heatmap for guests, hotels and city authorities.</p>
        </div>

        <!-- Top KPI strip -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:2rem;">
          ${[
            ['🔴', '3', 'Active Incidents',   'var(--accent)'],
            ['✅', '2', 'Resolved Today',     'var(--success)'],
            ['⚡', '4m', 'Avg Response Time',  'var(--warning)'],
            ['📡', '47', 'Guests Notified',    'var(--primary)'],
            ['🏨', '1',  'Hotel Zones Active', 'var(--purple)'],
          ].map(([icon,val,lbl,col]) => `
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:1rem;text-align:center;">
            <div style="font-size:1.5rem;">${icon}</div>
            <div style="font-size:1.75rem;font-weight:800;color:${col};line-height:1.2;">${val}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:0.125rem;">${lbl}</div>
          </div>`).join('')}
        </div>

        <div style="display:grid;grid-template-columns:1fr 380px;gap:1.5rem;align-items:start;" id="alerts-layout">

          <!-- LEFT: Alert Feed + Heatmap -->
          <div style="display:flex;flex-direction:column;gap:1.5rem;">

            <!-- Live Alert Feed -->
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
                <h2 style="font-size:1.125rem;font-weight:700;">📡 Live Alert Feed</h2>
                <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.75rem;color:var(--text-muted);">
                  <span class="status-dot live"></span> Auto-refreshing
                </div>
              </div>
              <div style="display:flex;flex-direction:column;gap:0.875rem;" id="alert-feed">
                ${ALERTS.map(a => {
                  const s = SEV_STYLE[a.severity] || SEV_STYLE.info;
                  return `
                  <div class="card" style="border-left:4px solid ${s.color};padding:1.25rem;position:relative;overflow:hidden;">
                    <div style="position:absolute;top:0;right:0;width:60px;height:60px;background:radial-gradient(circle,${s.color}11,transparent);border-radius:50%;"></div>
                    <div style="display:flex;align-items:flex-start;gap:1rem;">
                      <span style="font-size:1.75rem;flex-shrink:0;">${a.icon}</span>
                      <div style="flex:1;">
                        <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.375rem;">
                          <span style="font-weight:700;font-size:0.9375rem;">${a.title}</span>
                          <span style="font-size:0.68rem;font-weight:800;padding:0.125rem 0.5rem;border-radius:9999px;background:${s.bg};color:${s.color};border:1px solid ${s.border};">${s.label}</span>
                        </div>
                        <p style="font-size:0.8125rem;color:var(--text-secondary);line-height:1.5;margin-bottom:0.625rem;">${a.body}</p>
                        <div style="display:flex;align-items:center;gap:1rem;font-size:0.75rem;color:var(--text-muted);">
                          <span>📍 ${a.zone}</span>
                          <span>🕐 ${a.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>`;
                }).join('')}
              </div>
            </div>

            <!-- Heat Map (SVG) -->
            <div class="card">
              <h2 style="font-size:1.125rem;font-weight:700;margin-bottom:0.25rem;">🗺️ Incident Heat Map</h2>
              <p style="font-size:0.8125rem;color:var(--text-secondary);margin-bottom:1.25rem;">Anonymized incident density by zone — last 30 days</p>
              <div style="display:flex;gap:2rem;align-items:flex-start;flex-wrap:wrap;">
                <svg viewBox="0 0 220 220" style="width:220px;height:220px;flex-shrink:0;border-radius:var(--radius-md);overflow:hidden;">
                  <rect width="220" height="220" fill="#0f172a"/>
                  ${HEATMAP_CELLS.map(c => `
                  <rect x="${(c.x-1)*55}" y="${(c.y-1)*55}" width="52" height="52" rx="4" fill="${heatColor(c.v)}" opacity="${0.3 + c.v*0.55}"/>
                  <text x="${(c.x-1)*55+26}" y="${(c.y-1)*55+30}" text-anchor="middle" fill="white" font-size="11" font-weight="bold" opacity="0.9">${Math.round(c.v*100)}%</text>
                  `).join('')}
                  <!-- Zone labels -->
                  <text x="26"  y="215" text-anchor="middle" fill="#64748b" font-size="9">Zone A</text>
                  <text x="81"  y="215" text-anchor="middle" fill="#64748b" font-size="9">Zone B</text>
                  <text x="136" y="215" text-anchor="middle" fill="#64748b" font-size="9">Zone C</text>
                  <text x="191" y="215" text-anchor="middle" fill="#64748b" font-size="9">Zone D</text>
                </svg>
                <div style="flex:1;min-width:160px;">
                  <div style="font-size:0.8125rem;font-weight:600;margin-bottom:0.875rem;color:var(--text-secondary);">Legend</div>
                  ${[['#22c55e','Low (< 30%)','Safe zone'],['#f59e0b','Moderate (30–60%)','Use caution'],['#f97316','High (60–80%)','Elevated risk'],['#ef4444','Critical (> 80%)','Avoid if possible']].map(([c,l,d])=>`
                  <div style="display:flex;align-items:center;gap:0.625rem;margin-bottom:0.625rem;">
                    <div style="width:14px;height:14px;border-radius:3px;background:${c};flex-shrink:0;"></div>
                    <div><div style="font-size:0.8125rem;font-weight:600;">${l}</div><div style="font-size:0.75rem;color:var(--text-muted);">${d}</div></div>
                  </div>`).join('')}
                  <div style="margin-top:1.25rem;padding:0.875rem;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:var(--radius-md);">
                    <div style="font-size:0.75rem;font-weight:700;color:var(--warning);">⚠️ AI Insight</div>
                    <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:0.25rem;">Zone B shows 30% above-baseline incidents on Fri–Sat nights. Recommend increased patrol.</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT: Incident Table -->
          <div>
            <h2 style="font-size:1.125rem;font-weight:700;margin-bottom:1rem;">📋 Recent Incidents</h2>
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
              ${INCIDENTS.map(inc => {
                const s = SEV_STYLE[inc.severity] || SEV_STYLE.info;
                return `
                <div class="card" style="padding:1rem;border-left:3px solid ${s.color};">
                  <div style="display:flex;align-items:flex-start;gap:0.75rem;">
                    <span style="font-size:1.25rem;">${inc.icon}</span>
                    <div style="flex:1;min-width:0;">
                      <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.25rem;">
                        <span style="font-size:0.8125rem;font-weight:700;">${inc.title}</span>
                        <span style="font-size:0.65rem;padding:0.125rem 0.375rem;border-radius:9999px;background:${inc.status==='active'?'rgba(239,68,68,0.15)':'rgba(34,197,94,0.15)'};color:${inc.status==='active'?'#ef4444':'#22c55e'};font-weight:700;">${inc.status.toUpperCase()}</span>
                      </div>
                      <div style="font-size:0.75rem;color:var(--text-secondary);">📍 ${inc.zone}</div>
                      <div style="display:flex;justify-content:space-between;margin-top:0.5rem;font-size:0.75rem;color:var(--text-muted);">
                        <span>🕐 ${inc.time}</span>
                        <span style="font-family:monospace;color:var(--text-muted);">#${inc.id}</span>
                      </div>
                    </div>
                  </div>
                </div>`;
              }).join('')}
            </div>

            <!-- Opt-in toggle -->
            <div style="margin-top:1.5rem;padding:1.25rem;background:var(--bg-card);border:1px solid var(--border-bright);border-radius:var(--radius-lg);">
              <h3 style="font-size:0.9375rem;font-weight:700;margin-bottom:0.75rem;">🔔 Public Safety Alerts</h3>
              <p style="font-size:0.8125rem;color:var(--text-secondary);margin-bottom:1rem;">Receive geofenced push notifications when incidents are reported near your location.</p>
              <label style="display:flex;align-items:center;gap:0.875rem;cursor:pointer;user-select:none;">
                <div id="toggle-wrap" style="position:relative;width:48px;height:26px;background:var(--primary);border-radius:9999px;transition:background 0.3s;flex-shrink:0;" onclick="this.style.background=this.style.background==='rgb(14,165,233)'?'var(--bg-elevated)':'var(--primary)';this.querySelector('.toggle-thumb').style.transform=this.style.background!=='rgb(14,165,233)'?'translateX(0)':'translateX(22px)';">
                  <div class="toggle-thumb" style="position:absolute;top:3px;left:3px;width:20px;height:20px;background:white;border-radius:50%;transition:transform 0.3s;transform:translateX(22px);"></div>
                </div>
                <span style="font-size:0.875rem;font-weight:600;">Enable for this visit</span>
              </label>
            </div>

          </div>
        </div>

      </div>
    </div>`;

    // Responsive layout
    const layout = page.querySelector('#alerts-layout');
    if (window.innerWidth < 900) layout.style.gridTemplateColumns = '1fr';
  }

  document.addEventListener('pageChange', e => { if (e.detail.page === 'alerts') render(); });
})();
