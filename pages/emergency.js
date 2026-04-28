(function () {
  'use strict';

  /* ── State ── */
  let step = 0;          // 0=language, 1=category, 2=details, 3=dispatching, 4=done
  let selectedCategory = null;
  let selectedLang = 'en';

  const LANGS = [
    { code:'en', label:'English',    flag:'🇬🇧' },
    { code:'hi', label:'हिंदी',       flag:'🇮🇳' },
    { code:'zh', label:'中文',        flag:'🇨🇳' },
    { code:'es', label:'Español',    flag:'🇪🇸' },
    { code:'fr', label:'Français',   flag:'🇫🇷' },
    { code:'de', label:'Deutsch',    flag:'🇩🇪' },
    { code:'ja', label:'日本語',      flag:'🇯🇵' },
    { code:'ko', label:'한국어',      flag:'🇰🇷' },
    { code:'pt', label:'Português',  flag:'🇧🇷' },
    { code:'ru', label:'Русский',    flag:'🇷🇺' },
    { code:'th', label:'ไทย',        flag:'🇹🇭' },
    { code:'vi', label:'Tiếng Việt', flag:'🇻🇳' },
  ];

  const CATS = [
    { id:'medical',   icon:'🏥', label:'Medical Emergency',  color:'#ef4444', desc:'Chest pain, injury, allergic reaction, unconscious' },
    { id:'fire',      icon:'🔥', label:'Fire / Smoke',        color:'#f97316', desc:'Active fire, smoke detected, burning smell, hazard' },
    { id:'security',  icon:'🚨', label:'Security Threat',     color:'#8b5cf6', desc:'Assault, robbery, harassment, stalking, danger' },
    { id:'hazard',    icon:'⚠️', label:'Hazard Alert',        color:'#f59e0b', desc:'Gas leak, flooding, structural damage, chemical spill' },
    { id:'distress',  icon:'💙', label:'Personal Distress',   color:'#0ea5e9', desc:'Anxiety, panic attack, suicidal ideation, crisis' },
    { id:'other',     icon:'📢', label:'Other Emergency',     color:'#64748b', desc:'Undefined situation requiring immediate attention' },
  ];

  const QUESTIONS = {
    medical:  ['Where in your body is the pain or problem?','Is the person conscious and breathing? (Yes / No)','Any known allergies or current medications?'],
    fire:     ['Which floor are you on?','Can you evacuate safely right now? (Yes / No)','How many people are with you?'],
    security: ['Describe the threat briefly (e.g. man in red jacket, armed)','Are you in immediate danger right now? (Yes / No)','Your room number or exact location?'],
    hazard:   ['What type of hazard? (gas, water, structural, other)','Is anyone injured?','Your current location or room number?'],
    distress: ['What are you experiencing right now?','Are you alone? (Yes / No)','Would you like us to connect you with a counsellor?'],
    other:    ['Describe your emergency in a few words','Are you in immediate physical danger? (Yes / No)','Your room number or location?'],
  };

  const TRANSLATIONS = {
    hi: { title:'आपातकालीन सहायता', subtitle:'अपनी भाषा में सहायता पाएं', select:'श्रेणी चुनें', report:'रिपोर्ट करें' },
    zh: { title:'紧急救援', subtitle:'用您的语言获得帮助', select:'选择类别', report:'报告紧急情况' },
    es: { title:'Ayuda de Emergencia', subtitle:'Obtenga ayuda en su idioma', select:'Seleccione categoría', report:'Reportar emergencia' },
    fr: { title:'Aide d\'Urgence', subtitle:'Obtenez de l\'aide dans votre langue', select:'Choisissez une catégorie', report:'Signaler une urgence' },
    en: { title:'Emergency Help', subtitle:'Get help in your language — instantly', select:'Select Emergency Type', report:'Report Emergency' },
  };

  function t(key) {
    const map = TRANSLATIONS[selectedLang] || TRANSLATIONS.en;
    return map[key] || TRANSLATIONS.en[key] || key;
  }

  /* ── Render helpers ── */
  function renderStep0() {
    return `
    <div style="text-align:center;max-width:640px;margin:0 auto;">
      <div style="font-size:3rem;margin-bottom:1rem;">🌐</div>
      <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;">Choose Your Language</h2>
      <p style="color:var(--text-secondary);margin-bottom:2rem;font-size:0.9375rem;">We'll communicate with you in your chosen language throughout the emergency.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:0.75rem;" id="lang-grid">
        ${LANGS.map(l => `
        <button class="lang-btn card" data-lang="${l.code}" style="display:flex;align-items:center;gap:0.625rem;padding:0.875rem 1rem;cursor:pointer;transition:all 0.2s;border:1.5px solid var(--border);" aria-label="Select ${l.label}">
          <span style="font-size:1.5rem;">${l.flag}</span>
          <span style="font-size:0.875rem;font-weight:600;">${l.label}</span>
        </button>`).join('')}
      </div>
      <button class="btn btn-primary mt-4 w-full" id="lang-continue" style="max-width:320px;margin:1.5rem auto 0;">Continue →</button>
    </div>`;
  }

  function renderStep1() {
    const tx = TRANSLATIONS[selectedLang] || TRANSLATIONS.en;
    return `
    <div style="max-width:700px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:2rem;">
        <div class="badge badge-danger mb-2" style="margin-bottom:1rem;"><span class="badge-dot" style="animation:blink 1.5s infinite;"></span> Emergency Active</div>
        <h2 style="font-size:1.75rem;font-weight:700;margin-bottom:0.5rem;">${tx.select || 'Select Emergency Type'}</h2>
        <p style="color:var(--text-secondary);">Tap the icon that best describes your situation</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;" id="cat-grid">
        ${CATS.map(c => `
        <button class="cat-btn card" data-cat="${c.id}" style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;padding:1.5rem 1rem;cursor:pointer;border:2px solid var(--border);text-align:center;min-height:140px;transition:all 0.25s;" aria-label="${c.label}">
          <span style="font-size:2.5rem;filter:drop-shadow(0 0 8px ${c.color}44);">${c.icon}</span>
          <span style="font-size:0.9375rem;font-weight:700;">${c.label}</span>
          <span style="font-size:0.75rem;color:var(--text-secondary);line-height:1.4;">${c.desc}</span>
        </button>`).join('')}
      </div>
      <p style="text-align:center;font-size:0.8125rem;color:var(--text-muted);margin-top:1.5rem;">🔇 This report can be sent silently if you cannot speak freely</p>
    </div>`;
  }

  function renderStep2() {
    const cat  = CATS.find(c => c.id === selectedCategory);
    const qs   = QUESTIONS[selectedCategory] || QUESTIONS.other;
    return `
    <div style="max-width:600px;margin:0 auto;">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:2rem;padding:1.25rem;background:rgba(${selectedCategory==='medical'?'239,68,68':selectedCategory==='fire'?'249,115,22':selectedCategory==='security'?'139,92,246':'245,158,11'},0.1);border-radius:var(--radius-md);border:1px solid rgba(${selectedCategory==='medical'?'239,68,68':selectedCategory==='fire'?'249,115,22':selectedCategory==='security'?'139,92,246':'245,158,11'},0.3);">
        <span style="font-size:2.5rem;">${cat?.icon || '🚨'}</span>
        <div>
          <div style="font-weight:700;font-size:1.125rem;">${cat?.label}</div>
          <div style="font-size:0.8125rem;color:var(--text-secondary);">Please answer a few quick questions to help responders</div>
        </div>
      </div>

      <form id="emergency-form">
        ${qs.map((q,i) => `
        <div class="form-group" style="margin-bottom:1.25rem;">
          <label class="form-label" for="q${i}">${i+1}. ${q}</label>
          <input class="form-input w-full" id="q${i}" name="q${i}" type="text" placeholder="Type your answer..." aria-label="${q}" />
        </div>`).join('')}

        <div class="form-group" style="margin-bottom:1.25rem;">
          <label class="form-label">📍 Auto-detected Location</label>
          <div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;background:var(--bg-elevated);border-radius:var(--radius-md);border:1.5px solid var(--border);">
            <span style="color:var(--success);">✅</span>
            <span id="location-display" style="font-size:0.875rem;color:var(--text-secondary);">Detecting GPS location…</span>
          </div>
        </div>

        <div class="form-group" style="margin-bottom:1.5rem;">
          <label class="form-label">🔇 Silent Mode</label>
          <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;">
            <input type="checkbox" id="silent-mode" style="width:18px;height:18px;cursor:pointer;accent-color:var(--primary);" />
            <span style="font-size:0.875rem;color:var(--text-secondary);">Send alert silently — I cannot speak freely right now</span>
          </label>
        </div>

        <button type="submit" class="btn btn-danger btn-lg w-full" id="submit-emergency">
          🚨 Send Emergency Alert
        </button>
        <p style="text-align:center;font-size:0.75rem;color:var(--text-muted);margin-top:0.75rem;">Your location and report will be sent to emergency services and hotel management simultaneously.</p>
      </form>
    </div>`;
  }

  function renderStep3() {
    return `
    <div style="max-width:560px;margin:0 auto;text-align:center;">
      <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--purple));display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;font-size:3rem;animation:spin 1s linear infinite;">⚡</div>
      <h2 style="font-size:1.75rem;font-weight:700;margin-bottom:0.75rem;">Dispatching Help…</h2>
      <p style="color:var(--text-secondary);margin-bottom:2rem;">AI is processing your report and alerting all responders simultaneously.</p>

      <div style="text-align:left;display:flex;flex-direction:column;gap:0.75rem;" id="dispatch-log">
        <div class="dispatch-item" data-delay="0">
          <div style="display:flex;align-items:center;gap:0.75rem;padding:0.875rem 1rem;background:var(--bg-card);border-radius:var(--radius-md);border:1px solid var(--border);">
            <span style="font-size:1.25rem;">🤖</span>
            <div>
              <div style="font-weight:600;font-size:0.875rem;">AI Processing Report</div>
              <div style="font-size:0.8125rem;color:var(--text-secondary);">Translating & analyzing severity…</div>
            </div>
            <span class="ml-auto" style="margin-left:auto;" id="d0-status">⏳</span>
          </div>
        </div>
        <div class="dispatch-item" data-delay="1200">
          <div style="display:flex;align-items:center;gap:0.75rem;padding:0.875rem 1rem;background:var(--bg-card);border-radius:var(--radius-md);border:1px solid var(--border);">
            <span style="font-size:1.25rem;">🚑</span>
            <div>
              <div style="font-weight:600;font-size:0.875rem;">Emergency Services</div>
              <div style="font-size:0.8125rem;color:var(--text-secondary);">Alerting nearest responder…</div>
            </div>
            <span style="margin-left:auto;" id="d1-status">⏳</span>
          </div>
        </div>
        <div class="dispatch-item" data-delay="2000">
          <div style="display:flex;align-items:center;gap:0.75rem;padding:0.875rem 1rem;background:var(--bg-card);border-radius:var(--radius-md);border:1px solid var(--border);">
            <span style="font-size:1.25rem;">🏨</span>
            <div>
              <div style="font-weight:600;font-size:0.875rem;">Hotel Management</div>
              <div style="font-size:0.8125rem;color:var(--text-secondary);">Sending silent alert to manager…</div>
            </div>
            <span style="margin-left:auto;" id="d2-status">⏳</span>
          </div>
        </div>
        <div class="dispatch-item" data-delay="2800">
          <div style="display:flex;align-items:center;gap:0.75rem;padding:0.875rem 1rem;background:var(--bg-card);border-radius:var(--radius-md);border:1px solid var(--border);">
            <span style="font-size:1.25rem;">🔔</span>
            <div>
              <div style="font-weight:600;font-size:0.875rem;">Nearby Guest Alerts</div>
              <div style="font-size:0.8125rem;color:var(--text-secondary);">Geofenced notifications dispatched…</div>
            </div>
            <span style="margin-left:auto;" id="d3-status">⏳</span>
          </div>
        </div>
        <div class="dispatch-item" data-delay="3600">
          <div style="display:flex;align-items:center;gap:0.75rem;padding:0.875rem 1rem;background:var(--bg-card);border-radius:var(--radius-md);border:1px solid var(--border);">
            <span style="font-size:1.25rem;">🏢</span>
            <div>
              <div style="font-weight:600;font-size:0.875rem;">Building Systems</div>
              <div style="font-size:0.8125rem;color:var(--text-secondary);">Triggering elevators & exits…</div>
            </div>
            <span style="margin-left:auto;" id="d4-status">⏳</span>
          </div>
        </div>
      </div>
    </div>`;
  }

  function renderStep4(cat) {
    const c = CATS.find(x => x.id === cat) || CATS[0];
    return `
    <div style="max-width:560px;margin:0 auto;text-align:center;">
      <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,var(--success),#16a34a);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;font-size:3rem;box-shadow:0 0 40px rgba(34,197,94,0.4);">✅</div>
      <h2 style="font-size:1.75rem;font-weight:700;margin-bottom:0.75rem;">Help is On Its Way</h2>
      <p style="color:var(--text-secondary);margin-bottom:2rem;">All 5 dispatch channels confirmed. Estimated response time: <strong style="color:var(--success);">3–6 minutes</strong>.</p>

      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5rem;text-align:left;margin-bottom:2rem;">
        <h3 style="font-size:1rem;font-weight:700;margin-bottom:1rem;">📡 Incident ID: RQ-${Math.random().toString(36).substr(2,8).toUpperCase()}</h3>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          ${[['Emergency Type',c.label],['Status','Dispatched — Responders En Route'],['Estimated Arrival','3–6 minutes'],['Hotel Manager','Silently Notified'],['Post-Crisis Support','Auto-matched & ready']].map(([k,v])=>`
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.875rem;padding:0.5rem 0;border-bottom:1px solid var(--border);">
            <span style="color:var(--text-secondary);">${k}</span>
            <span style="font-weight:600;color:${k==='Status'?'var(--success)':'var(--text-primary)'};">${v}</span>
          </div>`).join('')}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:2rem;">
        <button class="btn btn-ghost w-full" id="done-map">📍 Find Resources</button>
        <button class="btn btn-ghost w-full" id="done-hotlines">📞 Hotlines</button>
      </div>

      <button class="btn btn-primary w-full" id="done-new">Start New Report</button>
      <p style="font-size:0.75rem;color:var(--text-muted);margin-top:1rem;">Post-crisis counseling and shelter referrals have been automatically queued. A support coordinator will reach out within 30 minutes.</p>
    </div>`;
  }

  /* ── Main render ── */
  function renderPortal() {
    const page = document.getElementById('page-emergency');
    if (!page) return;

    const steps = ['🌐 Language','🚨 Category','📋 Details','⚡ Dispatching','✅ Done'];
    const pct   = [0, 25, 50, 75, 100];

    let body = '';
    if      (step === 0) body = renderStep0();
    else if (step === 1) body = renderStep1();
    else if (step === 2) body = renderStep2();
    else if (step === 3) body = renderStep3();
    else if (step === 4) body = renderStep4(selectedCategory);

    page.innerHTML = `
    <div class="section">
      <div class="container">
        <!-- Header -->
        <div style="text-align:center;margin-bottom:2.5rem;">
          <div class="badge badge-danger" style="margin-bottom:1rem;"><span class="badge-dot" style="animation:blink 1.5s infinite;"></span> Emergency Portal — Zero Login Required</div>
          <h1 class="headline">${t('title')}</h1>
          <p style="color:var(--text-secondary);margin-top:0.5rem;">${t('subtitle')}</p>
        </div>

        <!-- Progress -->
        <div style="max-width:600px;margin:0 auto 2.5rem;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
            ${steps.map((s,i) => `<span style="font-size:0.7rem;font-weight:${i===step?'700':'500'};color:${i===step?'var(--primary)':i<step?'var(--success)':'var(--text-muted)'};">${s}</span>`).join('')}
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${pct[step]}%;"></div>
          </div>
        </div>

        <!-- Step content -->
        <div id="step-content">
          ${body}
        </div>
      </div>
    </div>`;

    bindStepEvents();
    if (step === 2) detectLocation();
    if (step === 3) runDispatch();
  }

  function detectLocation() {
    const el = document.getElementById('location-display');
    if (!el) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        el.textContent = `📍 ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E — GPS confirmed`;
        el.style.color = 'var(--success)';
      }, () => {
        el.textContent = 'Hotel Lobby / Room — Please type your room number above';
      }, { timeout: 6000 });
    } else {
      el.textContent = 'Please enter your room number in the form above';
    }
  }

  function runDispatch() {
    const ids   = ['d0-status','d1-status','d2-status','d3-status','d4-status'];
    const delays= [600, 1400, 2200, 3000, 3800];
    ids.forEach((id, i) => {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) { el.textContent = '✅'; el.style.color = 'var(--success)'; }
        if (i === ids.length - 1) {
          setTimeout(() => {
            step = 4;
            renderPortal();
          }, 800);
        }
      }, delays[i]);
    });
  }

  /* ── Event Binding ── */
  function bindStepEvents() {
    if (step === 0) {
      let chosen = selectedLang;
      document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === chosen) btn.style.borderColor = 'var(--primary)';
        btn.addEventListener('click', () => {
          chosen = btn.dataset.lang;
          selectedLang = chosen;
          document.querySelectorAll('.lang-btn').forEach(b => b.style.borderColor = 'var(--border)');
          btn.style.borderColor = 'var(--primary)';
          btn.style.background = 'rgba(14,165,233,0.08)';
        });
      });
      document.getElementById('lang-continue')?.addEventListener('click', () => { step = 1; renderPortal(); });
    }

    if (step === 1) {
      document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedCategory = btn.dataset.cat;
          step = 2;
          renderPortal();
        });
        btn.addEventListener('mouseenter', () => { btn.style.transform = 'translateY(-4px)'; btn.style.borderColor = 'var(--primary)'; });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; btn.style.borderColor = 'var(--border)'; });
      });
    }

    if (step === 2) {
      document.getElementById('emergency-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const answers = Array.from(e.target.querySelectorAll('input[type=text]')).map(i => i.value.trim());
        if (answers.every(a => a.length === 0)) {
          window.ResQ?.toast('Please fill in at least one field', 'Describe your emergency so responders can help faster.', 'warning');
          return;
        }
        step = 3;
        renderPortal();
        window.ResQ?.toast('🚨 Alert Sent!', 'Dispatching to all 5 channels now…', 'danger');
      });
    }

    if (step === 4) {
      document.getElementById('done-map')?.addEventListener('click',      () => window.ResQ.showPage('map'));
      document.getElementById('done-hotlines')?.addEventListener('click', () => window.ResQ.showPage('hotlines'));
      document.getElementById('done-new')?.addEventListener('click',      () => { step = 0; renderPortal(); });
    }
  }

  /* ── Init ── */
  function init() {
    step = 0;
    selectedCategory = null;
    renderPortal();
  }

  document.addEventListener('DOMContentLoaded',  () => { /* ready */ });
  document.addEventListener('pageChange',  e => { if (e.detail.page === 'emergency') init(); });
  document.addEventListener('startSOS',    ()  => { if (step === 0) renderPortal(); });

  // Spin animation for dispatching
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`;
  document.head.appendChild(style);
})();
