(function () {
  'use strict';

  const INCIDENTS = [
    { id:'RQ-A1F3', type:'fire',     icon:'🔥', title:'Fire / Smoke',        zone:'East Wing – Fl.2', severity:'critical', status:'active',   time:'2m ago',  responder:'Fire Dept.',  ack:true  },
    { id:'RQ-B2E9', type:'medical',  icon:'🏥', title:'Medical Emergency',   zone:'Room 412',          severity:'high',     status:'active',   time:'8m ago',  responder:'Ambulance',   ack:true  },
    { id:'RQ-E5B2', type:'distress', icon:'💙', title:'Personal Distress',   zone:'Room 308',          severity:'medium',   status:'active',   time:'31m ago', responder:'Counsellor',  ack:false },
    { id:'RQ-C3D7', type:'security', icon:'🚨', title:'Security Threat',     zone:'Lobby',             severity:'high',     status:'resolved', time:'15m ago', responder:'Police',      ack:true  },
    { id:'RQ-D4C5', type:'hazard',   icon:'⚠️', title:'Gas Leak Warning',    zone:'Parking B1',        severity:'medium',   status:'resolved', time:'22m ago', responder:'Fire Dept.',  ack:true  },
  ];

  const STAFF = [
    { name:'Priya Menon',    role:'Duty Manager',    status:'on-duty',  avatar:'👩', alerts:3 },
    { name:'Rahul Sharma',   role:'Security Officer', status:'on-duty',  avatar:'👮', alerts:2 },
    { name:'Anita Kapoor',   role:'Front Desk',       status:'on-duty',  avatar:'👩‍💼', alerts:1 },
    { name:'Dev Nair',       role:'Maintenance',      status:'off-duty', avatar:'👷', alerts:0 },
  ];

  const METRICS = [
    { label:'Active Incidents',    value:'3',    color:'var(--accent)',   icon:'🚨' },
    { label:'Avg Response Time',   value:'3.8m', color:'var(--warning)',  icon:'⚡' },
    { label:'Guests Notified',     value:'47',   color:'var(--primary)',  icon:'📡' },
    { label:'Resolved Today',      value:'8',    color:'var(--success)',  icon:'✅' },
    { label:'Translation Accuracy',value:'94%',  color:'var(--purple)',   icon:'🤖' },
    { label:'System Uptime',       value:'99.97%',color:'var(--success)', icon:'🛡️' },
  ];

  const SEV_STYLE = {
    critical:{ bg:'rgba(239,68,68,0.12)',   color:'#ef4444', label:'CRITICAL' },
    high:    { bg:'rgba(249,115,22,0.12)',  color:'#f97316', label:'HIGH'     },
    medium:  { bg:'rgba(245,158,11,0.12)', color:'#f59e0b', label:'MEDIUM'   },
    low:     { bg:'rgba(34,197,94,0.12)',   color:'#22c55e', label:'LOW'      },
  };

  let activeTab = 'overview';

  function render() {
    const page = document.getElementById('page-dashboard');
    if (!page) return;

    page.innerHTML = `
    <div class="section">
      <div class="container--wide">

        <!-- Header -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:2rem;">
          <div>
            <div class="section-label">Hotel Manager Portal</div>
            <h1 class="headline">Incident <span class="gradient-text">Command Dashboard</span></h1>
            <p style="color:var(--text-secondary);margin-top:0.25rem;">Grand Hyatt New Delhi — Live Operations View</p>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0.875rem;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:var(--radius-full);font-size:0.8125rem;font-weight:700;color:var(--accent);">
              <span class="status-dot live" style="background:var(--accent);"></span> 3 Active Incidents
            </div>
            <button class="btn btn-ghost btn-sm" id="export-btn">📄 Export Report</button>
            <button class="btn btn-primary btn-sm" id="new-incident-btn">+ Log Incident</button>
          </div>
        </div>

        <!-- KPI Cards -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:1rem;margin-bottom:2rem;">
          ${METRICS.map(m => `
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:1.25rem;position:relative;overflow:hidden;">
            <div style="position:absolute;top:-10px;right:-10px;font-size:3rem;opacity:0.06;">${m.icon}</div>
            <div style="font-size:1.5rem;margin-bottom:0.5rem;">${m.icon}</div>
            <div style="font-size:1.625rem;font-weight:800;color:${m.color};line-height:1.2;">${m.value}</div>
            <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:0.25rem;">${m.label}</div>
          </div>`).join('')}
        </div>

        <!-- Tabs -->
        <div style="display:flex;gap:0.5rem;margin-bottom:1.5rem;border-bottom:1px solid var(--border);padding-bottom:0;">
          ${[['overview','📊 Overview'],['incidents','🚨 Incidents'],['staff','👥 Staff'],['analytics','📈 Analytics']].map(([id,lbl]) => `
          <button class="dash-tab" data-tab="${id}" style="padding:0.625rem 1.25rem;font-size:0.875rem;font-weight:600;border:none;cursor:pointer;background:transparent;color:${activeTab===id?'var(--primary)':'var(--text-secondary)'};border-bottom:2px solid ${activeTab===id?'var(--primary)':'transparent'};margin-bottom:-1px;transition:all 0.2s;">${lbl}</button>`).join('')}
        </div>

        <!-- Tab Content -->
        <div id="dash-tab-content">
          ${activeTab === 'overview'   ? renderOverview()   : ''}
          ${activeTab === 'incidents'  ? renderIncidents()  : ''}
          ${activeTab === 'staff'      ? renderStaff()      : ''}
          ${activeTab === 'analytics'  ? renderAnalytics()  : ''}
        </div>

      </div>
    </div>`;

    bindEvents();
  }

  /* ── Tab: Overview ── */
  function renderOverview() {
    const active = INCIDENTS.filter(i => i.status === 'active');
    return `
    <div style="display:grid;grid-template-columns:1fr 340px;gap:1.5rem;align-items:start;" id="overview-layout">
      <!-- Active incidents -->
      <div>
        <h2 style="font-size:1rem;font-weight:700;margin-bottom:1rem;color:var(--accent);">🔴 Active Incidents (${active.length})</h2>
        <div style="display:flex;flex-direction:column;gap:0.875rem;">
          ${active.map(inc => renderIncidentCard(inc, true)).join('')}
        </div>

        <h2 style="font-size:1rem;font-weight:700;margin:1.5rem 0 1rem;color:var(--success);">✅ Recently Resolved</h2>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          ${INCIDENTS.filter(i => i.status === 'resolved').map(inc => renderIncidentCard(inc, false)).join('')}
        </div>
      </div>

      <!-- Right panel -->
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <!-- Staff on duty -->
        <div class="card">
          <h3 style="font-size:0.9375rem;font-weight:700;margin-bottom:1rem;">👥 Staff On Duty</h3>
          ${STAFF.filter(s => s.status === 'on-duty').map(s => `
          <div style="display:flex;align-items:center;gap:0.75rem;padding:0.625rem 0;border-bottom:1px solid var(--border);">
            <span style="font-size:1.5rem;">${s.avatar}</span>
            <div style="flex:1;">
              <div style="font-size:0.875rem;font-weight:600;">${s.name}</div>
              <div style="font-size:0.75rem;color:var(--text-secondary);">${s.role}</div>
            </div>
            ${s.alerts > 0 ? `<span style="background:var(--accent);color:white;font-size:0.7rem;font-weight:800;padding:0.125rem 0.5rem;border-radius:9999px;">${s.alerts}</span>` : ''}
          </div>`).join('')}
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <h3 style="font-size:0.9375rem;font-weight:700;margin-bottom:0.875rem;">⚡ Quick Actions</h3>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            ${[['🚨','Trigger Evacuation Alarm','danger'],['📢','Broadcast to All Guests','primary'],['🔇','Enable Silent Mode','ghost'],['📞','Call Emergency Services','ghost']].map(([i,l,t])=>`
            <button class="btn btn-${t} btn-sm w-full" style="justify-content:flex-start;gap:0.625rem;">${i} ${l}</button>`).join('')}
          </div>
        </div>

        <!-- Building status -->
        <div class="card">
          <h3 style="font-size:0.9375rem;font-weight:700;margin-bottom:0.875rem;">🏢 Building Systems</h3>
          ${[['Elevators','Online','success'],['Emergency Exits','Unlocked','success'],['Fire Suppression','Armed','success'],['HVAC','Normal','success'],['Floor 2 Access','Restricted','warning']].map(([s,v,c])=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0.375rem 0;border-bottom:1px solid var(--border);">
            <span style="font-size:0.8125rem;">${s}</span>
            <span style="font-size:0.75rem;font-weight:700;color:var(--${c});">${v}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
  }

  function renderIncidentCard(inc, showActions) {
    const s = SEV_STYLE[inc.severity] || SEV_STYLE.low;
    return `
    <div class="card" style="padding:1.25rem;border-left:4px solid ${s.color};">
      <div style="display:flex;align-items:flex-start;gap:0.875rem;">
        <span style="font-size:1.5rem;">${inc.icon}</span>
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.375rem;">
            <span style="font-weight:700;">${inc.title}</span>
            <span style="font-size:0.68rem;font-weight:800;padding:0.125rem 0.5rem;border-radius:9999px;background:${s.bg};color:${s.color};">${s.label}</span>
            ${inc.ack ? '<span style="font-size:0.68rem;color:var(--success);font-weight:700;">✓ Acknowledged</span>' : '<span style="font-size:0.68rem;color:var(--accent);font-weight:700;">! Pending Ack</span>'}
          </div>
          <div style="display:flex;gap:1rem;font-size:0.8125rem;color:var(--text-secondary);">
            <span>📍 ${inc.zone}</span>
            <span>🕐 ${inc.time}</span>
            <span>👤 ${inc.responder}</span>
          </div>
          ${showActions ? `
          <div style="display:flex;gap:0.5rem;margin-top:0.875rem;">
            <button class="btn btn-sm btn-primary" style="font-size:0.75rem;">View Details</button>
            <button class="btn btn-sm btn-ghost" style="font-size:0.75rem;">Assign Staff</button>
            <button class="btn btn-sm btn-ghost" style="font-size:0.75rem;">Mark Resolved</button>
          </div>` : ''}
        </div>
        <span style="font-size:0.75rem;font-family:monospace;color:var(--text-muted);flex-shrink:0;">#${inc.id}</span>
      </div>
    </div>`;
  }

  /* ── Tab: Incidents ── */
  function renderIncidents() {
    return `
    <div>
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;flex-wrap:wrap;">
        <input class="form-input" style="flex:1;min-width:180px;max-width:300px;" placeholder="🔍 Search incidents…" />
        <select class="form-select" style="min-width:140px;">
          <option>All Types</option>
          <option>Medical</option><option>Fire</option><option>Security</option><option>Hazard</option><option>Distress</option>
        </select>
        <select class="form-select" style="min-width:140px;">
          <option>All Statuses</option><option>Active</option><option>Resolved</option>
        </select>
      </div>
      <div style="overflow-x:auto;border-radius:var(--radius-lg);border:1px solid var(--border);">
        <table style="width:100%;border-collapse:collapse;font-size:0.875rem;min-width:680px;">
          <thead>
            <tr style="background:var(--bg-elevated);">
              ${['Incident ID','Type','Zone','Severity','Status','Responder','Time','Actions'].map(h=>`<th style="padding:0.875rem 1rem;text-align:left;font-weight:700;color:var(--text-secondary);border-bottom:1px solid var(--border);white-space:nowrap;">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${INCIDENTS.map((inc,i) => {
              const s = SEV_STYLE[inc.severity] || SEV_STYLE.low;
              return `
              <tr style="background:${i%2===0?'var(--bg-card)':'var(--bg-surface)'};transition:background 0.15s;" onmouseenter="this.style.background='var(--bg-hover)'" onmouseleave="this.style.background='${i%2===0?'var(--bg-card)':'var(--bg-surface)'}'">
                <td style="padding:0.75rem 1rem;font-family:monospace;font-size:0.8125rem;color:var(--text-muted);">${inc.id}</td>
                <td style="padding:0.75rem 1rem;">${inc.icon} ${inc.title}</td>
                <td style="padding:0.75rem 1rem;color:var(--text-secondary);">${inc.zone}</td>
                <td style="padding:0.75rem 1rem;"><span style="font-size:0.75rem;font-weight:700;padding:0.125rem 0.5rem;border-radius:9999px;background:${s.bg};color:${s.color};">${s.label}</span></td>
                <td style="padding:0.75rem 1rem;"><span style="font-size:0.75rem;font-weight:700;color:${inc.status==='active'?'var(--accent)':'var(--success)'};">${inc.status.toUpperCase()}</span></td>
                <td style="padding:0.75rem 1rem;color:var(--text-secondary);">${inc.responder}</td>
                <td style="padding:0.75rem 1rem;color:var(--text-muted);white-space:nowrap;">${inc.time}</td>
                <td style="padding:0.75rem 1rem;">
                  <div style="display:flex;gap:0.375rem;">
                    <button class="btn btn-sm btn-ghost" style="padding:0.25rem 0.625rem;font-size:0.75rem;">View</button>
                    ${inc.status==='active'?'<button class="btn btn-sm btn-primary" style="padding:0.25rem 0.625rem;font-size:0.75rem;">Resolve</button>':''}
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  /* ── Tab: Staff ── */
  function renderStaff() {
    return `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;">
      ${STAFF.map(s => `
      <div class="card">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
          <div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--purple));display:flex;align-items:center;justify-content:center;font-size:1.5rem;">${s.avatar}</div>
          <div>
            <div style="font-weight:700;">${s.name}</div>
            <div style="font-size:0.8125rem;color:var(--text-secondary);">${s.role}</div>
            <div style="display:flex;align-items:center;gap:0.375rem;margin-top:0.25rem;">
              <span class="status-dot" style="background:${s.status==='on-duty'?'var(--success)':'var(--text-muted)'};${s.status==='on-duty'?'box-shadow:0 0 6px var(--success);':''};"></span>
              <span style="font-size:0.75rem;color:${s.status==='on-duty'?'var(--success)':'var(--text-muted)'};">${s.status === 'on-duty' ? 'On Duty' : 'Off Duty'}</span>
            </div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:0.875rem;font-size:0.8125rem;">
          <span style="color:var(--text-secondary);">Active Alerts</span>
          <span style="font-weight:700;color:${s.alerts>0?'var(--accent)':'var(--success)'};">${s.alerts}</span>
        </div>
        <div style="display:flex;gap:0.5rem;">
          <button class="btn btn-sm btn-ghost w-full">📞 Call</button>
          <button class="btn btn-sm btn-primary w-full">Assign</button>
        </div>
      </div>`).join('')}
    </div>`;
  }

  /* ── Tab: Analytics ── */
  function renderAnalytics() {
    const bars = [
      ['Medical', 42, 'var(--accent)'],
      ['Security', 28, 'var(--purple)'],
      ['Fire', 15, 'var(--warning)'],
      ['Hazard', 10, 'var(--primary)'],
      ['Distress', 5, 'var(--success)'],
    ];
    const maxVal = Math.max(...bars.map(b => b[1]));
    return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;" id="analytics-layout">
      <!-- Incident breakdown bar chart -->
      <div class="card">
        <h3 style="font-size:1rem;font-weight:700;margin-bottom:1.25rem;">📊 Incident Breakdown (This Month)</h3>
        <div style="display:flex;flex-direction:column;gap:0.875rem;">
          ${bars.map(([lbl,val,col]) => `
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.8125rem;margin-bottom:0.375rem;">
              <span style="font-weight:600;">${lbl}</span>
              <span style="color:var(--text-muted);">${val}%</span>
            </div>
            <div class="progress-bar">
              <div style="height:100%;width:${(val/maxVal)*100}%;background:${col};border-radius:9999px;transition:width 1s var(--ease);"></div>
            </div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Response time trend (sparkline) -->
      <div class="card">
        <h3 style="font-size:1rem;font-weight:700;margin-bottom:1.25rem;">⏱️ Response Time Trend (7 Days)</h3>
        <svg viewBox="0 0 300 120" style="width:100%;height:120px;">
          <defs>
            <linearGradient id="rt-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0,90 L43,70 L86,80 L129,50 L172,60 L215,40 L258,38 L300,35" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M0,90 L43,70 L86,80 L129,50 L172,60 L215,40 L258,38 L300,35 L300,120 L0,120Z" fill="url(#rt-grad)"/>
          ${[['Mon','6.2m'],['Tue','5.1m'],['Wed','5.8m'],['Thu','4.2m'],['Fri','4.8m'],['Sat','3.8m'],['Sun','3.5m']].map(([d,v],i)=>`
          <text x="${i*43}" y="115" font-size="9" fill="#475569" text-anchor="middle">${d}</text>
          <circle cx="${i*43}" cy="${[90,70,80,50,60,40,38][i]}" r="4" fill="var(--primary)"/>
          <text x="${i*43}" y="${[80,60,70,40,50,30,28][i]}" font-size="9" fill="#94a3b8" text-anchor="middle">${v}</text>
          `).join('')}
        </svg>
        <p style="font-size:0.75rem;color:var(--success);text-align:right;margin-top:0.5rem;">↓ 43% improvement this week</p>
      </div>

      <!-- Translation accuracy -->
      <div class="card">
        <h3 style="font-size:1rem;font-weight:700;margin-bottom:1.25rem;">🤖 AI Translation Accuracy</h3>
        <div style="display:flex;align-items:center;gap:1.5rem;">
          <svg viewBox="0 0 120 120" style="width:100px;height:100px;flex-shrink:0;">
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-elevated)" stroke-width="12"/>
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--purple)" stroke-width="12"
              stroke-dasharray="${2*Math.PI*50*0.94} ${2*Math.PI*50*(1-0.94)}"
              stroke-dashoffset="${2*Math.PI*50*0.25}" stroke-linecap="round"/>
            <text x="60" y="64" text-anchor="middle" font-size="20" font-weight="bold" fill="white">94%</text>
            <text x="60" y="78" text-anchor="middle" font-size="9" fill="#64748b">accuracy</text>
          </svg>
          <div>
            ${[['English→Hindi','97%'],['English→Mandarin','93%'],['Spanish→English','96%'],['Japanese→English','91%']].map(([l,v])=>`
            <div style="display:flex;justify-content:space-between;gap:1rem;font-size:0.8125rem;margin-bottom:0.5rem;">
              <span style="color:var(--text-secondary);">${l}</span>
              <span style="font-weight:700;color:var(--purple);">${v}</span>
            </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- Compliance checklist -->
      <div class="card">
        <h3 style="font-size:1rem;font-weight:700;margin-bottom:1.25rem;">🛡️ Compliance Status</h3>
        ${[
          ['GDPR – Auto data deletion (90d)','✅'],
          ['WCAG 2.1 AA Accessibility','✅'],
          ['AES-256 Encryption at rest','✅'],
          ['Audit trail – tamper proof','✅'],
          ['Third-party security audit','⚠️ Due June 2026'],
          ['Data residency – IN servers','✅'],
        ].map(([item,status])=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--border);font-size:0.8125rem;">
          <span style="color:var(--text-secondary);">${item}</span>
          <span style="font-weight:600;color:${status.startsWith('✅')?'var(--success)':'var(--warning)'};">${status}</span>
        </div>`).join('')}
      </div>
    </div>`;
  }

  /* ── Events ── */
  function bindEvents() {
    document.querySelectorAll('.dash-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        render();
      });
    });

    document.getElementById('export-btn')?.addEventListener('click', () => {
      window.ResQ?.toast('Report Exported', 'Incident report PDF generated and downloaded.', 'success');
    });
    document.getElementById('new-incident-btn')?.addEventListener('click', () => {
      window.ResQ?.toast('Log Incident', 'Use the Emergency Portal to log a new incident.', 'info');
    });

    // Fix responsive layout
    const ol = document.getElementById('overview-layout');
    const al = document.getElementById('analytics-layout');
    if (ol && window.innerWidth < 900) ol.style.gridTemplateColumns = '1fr';
    if (al && window.innerWidth < 900) al.style.gridTemplateColumns = '1fr';
  }

  document.addEventListener('pageChange', e => { if (e.detail.page === 'dashboard') { activeTab = 'overview'; render(); } });
})();
