(function () {
  'use strict';

  const html = `
  <!-- ── HERO ─────────────────────────────────────────────────────── -->
  <section class="hero-section" style="min-height:92vh;display:flex;align-items:center;position:relative;overflow:hidden;">
    <!-- Ambient background -->
    <div style="position:absolute;inset:0;z-index:0;">
      <div style="position:absolute;top:-20%;left:-10%;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(14,165,233,0.12) 0%,transparent 70%);"></div>
      <div style="position:absolute;bottom:-10%;right:-5%;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%);"></div>
      <div style="position:absolute;top:40%;left:50%;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(244,63,94,0.07) 0%,transparent 70%);transform:translate(-50%,-50%);"></div>
      <!-- Grid lines -->
      <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(148,163,184,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,0.03) 1px,transparent 1px);background-size:60px 60px;"></div>
    </div>

    <div class="container" style="position:relative;z-index:1;padding:3rem 1.5rem;">
      <div style="max-width:780px;margin:0 auto;text-align:center;">
        <div class="badge badge-danger mb-2" style="margin-bottom:1.5rem;">
          <span class="badge-dot" style="animation:blink 1.5s ease-in-out infinite;"></span>
          IEEE YESIST12 2026 Project — NovoCore Team
        </div>

        <h1 class="display" style="margin-bottom:1.5rem;line-height:1.1;">
          Emergency Help,<br/>
          <span class="gradient-text">Any Language.</span><br/>
          <span class="gradient-text-danger">Zero Barriers.</span>
        </h1>

        <p style="font-size:clamp(1rem,2vw,1.25rem);color:var(--text-secondary);max-width:600px;margin:0 auto 2.5rem;line-height:1.7;">
          ResQ bridges international tourists with emergency services — instantly, silently, in their own language. No app download. No registration. One QR code away.
        </p>

        <div class="flex-center gap-3" style="flex-wrap:wrap;">
          <button class="btn btn-danger btn-lg pulse-ring" id="hero-sos" style="font-size:1.125rem;">
            🆘 Report Emergency Now
          </button>
          <button class="btn btn-ghost btn-lg" id="hero-explore">
            🗺️ Find Resources
          </button>
        </div>

        <!-- Stats row -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:4rem;border-top:1px solid var(--border);padding-top:2.5rem;">
          ${[['1.4B','International tourists/year'],['&lt;2min','Emergency dispatch time'],['12+','Languages supported']].map(([v,l])=>`
          <div>
            <div style="font-family:'Space Grotesk',sans-serif;font-size:clamp(1.75rem,4vw,2.5rem);font-weight:800;background:linear-gradient(135deg,var(--primary),var(--purple));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">${v}</div>
            <div style="font-size:0.875rem;color:var(--text-secondary);margin-top:0.25rem;">${l}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- ── PROBLEM STATEMENT ─────────────────────────────────────────── -->
  <section class="section" style="background:var(--bg-surface);">
    <div class="container">
      <div class="text-center" style="margin-bottom:3rem;">
        <div class="section-label" style="justify-content:center;">The Problem</div>
        <h2 class="headline">Why Do Tourists Die From <span class="gradient-text-danger">Miscommunication?</span></h2>
        <p style="color:var(--text-secondary);max-width:560px;margin:1rem auto 0;">Language barriers in hospitality emergencies cause 3–4× worse outcomes. No existing system was built for this.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;">
        ${[
          ['🔥','Japanese tourist in a hotel fire','Cannot speak local language. Calls front desk — nobody understands. Critical minutes lost.','danger'],
          ['🚨','DV victim afraid to speak aloud','Cannot attract attention without alerting her abuser. No silent way to call for help.','warning'],
          ['🏥','Medical emergency in foreign room','Foreign guest disoriented, unclear on symptoms or location. Ambulance dispatched wrong floor.','primary'],
          ['📢','Fire in adjacent room','No system notifies nearby guests silently. Secondary panic caused by delayed warning.','purple'],
        ].map(([icon,title,desc,color])=>`
        <div class="card" style="border-color:rgba(var(--${color}-rgb,14,165,233),0.2);">
          <div style="font-size:2rem;margin-bottom:1rem;">${icon}</div>
          <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem;">${title}</h3>
          <p style="font-size:0.875rem;color:var(--text-secondary);line-height:1.6;">${desc}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- ── CORE FEATURES ─────────────────────────────────────────────── -->
  <section class="section">
    <div class="container">
      <div class="text-center" style="margin-bottom:3rem;">
        <div class="section-label" style="justify-content:center;">Core Features</div>
        <h2 class="headline">Everything a Tourist Needs,<br/><span class="gradient-text">Built for Crisis.</span></h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;">
        ${[
          ['🌐','Zero-Friction PWA','Access via QR code in seconds — no app download, no account, no password. Works on any device.','primary'],
          ['🤖','AI Translation (Gemini)','Real-time bidirectional translation in 12+ languages. Medical terminology auto-standardized.','purple'],
          ['🔇','Silent Hotel Mode','Managers alerted quietly. No public panic. Distress codes recognized without alerting abusers.','warning'],
          ['📍','Real-Time Resource Map','Nearest hospitals, police stations, fire stations and safe zones shown instantly on an interactive map.','success'],
          ['📞','Emergency Hotlines','Country-specific emergency numbers, embassy contacts, trauma lines — verified monthly.','primary'],
          ['🛡️','Victim-Centered Support','Post-crisis counseling referral, shelter coordination, legal aid — automatically matched.','accent'],
          ['📊','Incident Analytics','Heat maps, trend reports and anomaly detection for city planners and hotel managers.','purple'],
          ['♿','Accessibility First','WCAG 2.1 AA compliant. Visual + vibration alerts for deaf guests. Screen-reader optimized.','success'],
          ['⚡','Smart Dispatch','5 simultaneous channels: emergency services, hotel, building automation, guests, public.','warning'],
        ].map(([icon,title,desc,color])=>`
        <div class="card" style="position:relative;overflow:hidden;">
          <div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle,rgba(14,165,233,0.08),transparent);"></div>
          <div style="font-size:2rem;margin-bottom:1rem;">${icon}</div>
          <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem;">${title}</h3>
          <p style="font-size:0.875rem;color:var(--text-secondary);line-height:1.6;">${desc}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- ── HOW IT WORKS ──────────────────────────────────────────────── -->
  <section class="section" style="background:var(--bg-surface);">
    <div class="container">
      <div class="text-center" style="margin-bottom:3rem;">
        <div class="section-label" style="justify-content:center;">How It Works</div>
        <h2 class="headline">From Crisis to Help in <span class="gradient-text">&lt;2 Minutes</span></h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0;position:relative;">
        <!-- connector line -->
        <div style="position:absolute;top:48px;left:10%;right:10%;height:2px;background:linear-gradient(90deg,var(--primary),var(--purple),var(--accent));border-radius:9999px;z-index:0;display:none;" class="step-line"></div>
        ${[
          ['1','📱','Scan QR Code','Guest scans QR in hotel room — ResQ loads instantly in their language'],
          ['2','🚨','Select Emergency','6 icon-based categories. No reading needed. Tap and AI asks smart follow-ups'],
          ['3','🤖','AI Processes','Gemini translates, assesses severity, detects distress codes, compiles context packets'],
          ['4','⚡','Smart Dispatch','5 channels fire simultaneously: services, hotel, building, guests & public'],
          ['5','🤝','Help Arrives','Responders pre-briefed with full context. Guest gets real-time ETA updates'],
        ].map(([n,icon,title,desc])=>`
        <div style="text-align:center;padding:1.5rem 1rem;position:relative;z-index:1;">
          <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--purple));display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:1.75rem;box-shadow:0 0 24px var(--primary-glow);">${icon}</div>
          <div style="font-size:0.7rem;font-weight:800;letter-spacing:0.1em;color:var(--primary);text-transform:uppercase;margin-bottom:0.25rem;">Step ${n}</div>
          <h3 style="font-size:0.9375rem;font-weight:700;margin-bottom:0.5rem;">${title}</h3>
          <p style="font-size:0.8125rem;color:var(--text-secondary);line-height:1.6;">${desc}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- ── COMPETITIVE EDGE ──────────────────────────────────────────── -->
  <section class="section">
    <div class="container">
      <div class="text-center" style="margin-bottom:3rem;">
        <div class="section-label" style="justify-content:center;">Competitive Edge</div>
        <h2 class="headline">ResQ vs. <span class="gradient-text">Every Alternative</span></h2>
      </div>
      <div style="overflow-x:auto;border-radius:var(--radius-lg);border:1px solid var(--border);">
        <table style="width:100%;border-collapse:collapse;font-size:0.875rem;">
          <thead>
            <tr style="background:var(--bg-elevated);">
              <th style="padding:1rem 1.25rem;text-align:left;font-weight:700;color:var(--text-secondary);border-bottom:1px solid var(--border);">Feature</th>
              ${['ResQ','112 App','SOS Button','Uber Safety','Google Emergency'].map(h=>`<th style="padding:1rem;text-align:center;font-weight:700;${h==='ResQ'?'color:var(--primary);':'color:var(--text-secondary);'}border-bottom:1px solid var(--border);">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${[
              ['No Installation',      '✅','❌','❌','❌','✅'],
              ['AI Translation',       '✅','❌','❌','❌','❌'],
              ['Silent Mode',          '✅','❌','✅','❌','❌'],
              ['Distress Codes',       '✅','❌','❌','❌','❌'],
              ['Resource Map',         '✅','❌','❌','⚠️','✅'],
              ['Post-Crisis Support',  '✅','❌','❌','⚠️','❌'],
              ['Hotel Integration',    '✅','❌','❌','❌','❌'],
              ['Public Alerts',        '✅','❌','❌','❌','⚠️'],
            ].map(([feat,...vals],i)=>`
            <tr style="background:${i%2===0?'var(--bg-card)':'var(--bg-surface)'};transition:background 0.2s;">
              <td style="padding:0.875rem 1.25rem;font-weight:600;">${feat}</td>
              ${vals.map((v,j)=>`<td style="padding:0.875rem 1rem;text-align:center;font-size:1rem;${j===0?'background:rgba(14,165,233,0.05);':''}">${v}</td>`).join('')}
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ── STAKEHOLDERS ──────────────────────────────────────────────── -->
  <section class="section" style="background:var(--bg-surface);">
    <div class="container">
      <div class="text-center" style="margin-bottom:3rem;">
        <div class="section-label" style="justify-content:center;">Who It Serves</div>
        <h2 class="headline">One Platform, <span class="gradient-text">Four Ecosystems</span></h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;">
        ${[
          ['🧳','Tourists','Speak any language. We speak yours. Zero setup. Instant help in a country you don\'t know.','One tap. Any language.'],
          ['🏨','Hotels','Reduce liability. Faster response. Protect guests. Silent alerts. Staff coordination. Dashboard.','Safer guests. Proven ROI.'],
          ['👮','Police & Cities','Real-time incident intelligence, heat maps, predictive patrol allocation, audit trails.','Data-driven policing.'],
          ['💙','NGOs & Shelters','Auto-routed survivor referrals. No marketing needed. You become part of the response.','Victims reach you first.'],
        ].map(([icon,title,desc,tag])=>`
        <div class="card" style="border-top:3px solid var(--primary);">
          <div style="font-size:2.5rem;margin-bottom:1rem;">${icon}</div>
          <h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.75rem;">${title}</h3>
          <p style="font-size:0.875rem;color:var(--text-secondary);line-height:1.6;margin-bottom:1rem;">${desc}</p>
          <div class="badge badge-primary">${tag}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- ── CTA ───────────────────────────────────────────────────────── -->
  <section class="section">
    <div class="container">
      <div style="background:linear-gradient(135deg,rgba(14,165,233,0.1),rgba(139,92,246,0.1));border:1px solid var(--border-bright);border-radius:var(--radius-xl);padding:4rem 2rem;text-align:center;position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(148,163,184,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,0.03) 1px,transparent 1px);background-size:40px 40px;"></div>
        <div style="position:relative;z-index:1;">
          <div style="font-size:3rem;margin-bottom:1rem;">🚨</div>
          <h2 class="headline" style="margin-bottom:1rem;">Ready When You Need It Most</h2>
          <p style="color:var(--text-secondary);max-width:500px;margin:0 auto 2rem;">In a real emergency, every second counts. ResQ is pre-loaded and waiting — so you never have to search for help.</p>
          <div class="flex-center gap-3" style="flex-wrap:wrap;">
            <button class="btn btn-danger btn-lg" id="cta-emergency">🆘 Open Emergency Portal</button>
            <button class="btn btn-ghost btn-lg" id="cta-map">📍 Find Nearby Resources</button>
          </div>
          <p style="margin-top:1.5rem;font-size:0.8125rem;color:var(--text-muted);">IEEE YESIST12 2026 · NovoCore Team · Parth · Shivansh · Kajal · Riddhi</p>
        </div>
      </div>
    </div>
  </section>
  `;

  function init() {
    const page = document.getElementById('page-home');
    if (page && !page.dataset.loaded) {
      page.innerHTML = html;
      page.dataset.loaded = '1';

      page.querySelector('#hero-sos')?.addEventListener('click', () => window.ResQ.showPage('emergency'));
      page.querySelector('#hero-explore')?.addEventListener('click', () => window.ResQ.showPage('map'));
      page.querySelector('#cta-emergency')?.addEventListener('click', () => window.ResQ.showPage('emergency'));
      page.querySelector('#cta-map')?.addEventListener('click', () => window.ResQ.showPage('map'));
    }
  }

  // Init on load
  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pageChange', e => { if (e.detail.page === 'home') init(); });
})();
