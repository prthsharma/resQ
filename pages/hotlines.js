(function () {
  'use strict';

  const HOTLINES = [
    {
      country: 'India 🇮🇳', code: 'in',
      lines: [
        { cat:'Emergency',        icon:'🚨', name:'Police',                        number:'100',      note:'24/7' },
        { cat:'Emergency',        icon:'🔥', name:'Fire Brigade',                  number:'101',      note:'24/7' },
        { cat:'Emergency',        icon:'🚑', name:'Ambulance',                     number:'102',      note:'24/7' },
        { cat:'Emergency',        icon:'🆘', name:'Unified Emergency Helpline',    number:'112',      note:'All emergencies' },
        { cat:'Tourist Support',  icon:'👮', name:'Tourist Police Helpline',       number:'1363',     note:'24/7 multilingual' },
        { cat:'Women Safety',     icon:'👩', name:'Women Helpline',                number:'181',      note:'24/7' },
        { cat:'Mental Health',    icon:'💙', name:'iCall Mental Health',           number:'9152987821',note:'Mon–Sat' },
        { cat:'Trafficking',      icon:'🛡️', name:'Anti-Human Trafficking',       number:'1800-419-8588', note:'Toll free' },
        { cat:'Medical',          icon:'🏥', name:'AIIMS Emergency',               number:'011-26588500', note:'Trauma & cardiac' },
      ]
    },
    {
      country: 'United Kingdom 🇬🇧', code: 'gb',
      lines: [
        { cat:'Emergency',        icon:'🚨', name:'Police / Fire / Ambulance',     number:'999',      note:'All emergencies' },
        { cat:'Emergency',        icon:'🆘', name:'European Emergency',            number:'112',      note:'EU standard' },
        { cat:'Tourist Support',  icon:'👮', name:'Non-Emergency Police',          number:'101',      note:'24/7' },
        { cat:'Mental Health',    icon:'💙', name:'Samaritans',                    number:'116 123',  note:'24/7 free' },
        { cat:'Trafficking',      icon:'🛡️', name:'Modern Slavery Helpline',      number:'08000 121 700', note:'24/7' },
        { cat:'Women Safety',     icon:'👩', name:'Domestic Abuse Helpline',       number:'0808 2000 247', note:'24/7' },
      ]
    },
    {
      country: 'United States 🇺🇸', code: 'us',
      lines: [
        { cat:'Emergency',        icon:'🚨', name:'Police / Fire / Ambulance',     number:'911',      note:'All emergencies' },
        { cat:'Mental Health',    icon:'💙', name:'Suicide & Crisis Lifeline',     number:'988',      note:'24/7' },
        { cat:'Trafficking',      icon:'🛡️', name:'Human Trafficking Hotline',    number:'1-888-373-7888', note:'24/7' },
        { cat:'Women Safety',     icon:'👩', name:'DV Hotline',                    number:'1-800-799-7233',  note:'24/7 multilingual' },
        { cat:'Tourist Support',  icon:'👮', name:'Non-Emergency (local)',         number:'311',      note:'City services' },
        { cat:'Medical',          icon:'🏥', name:'Poison Control',               number:'1-800-222-1222',  note:'24/7' },
      ]
    },
    {
      country: 'France 🇫🇷', code: 'fr',
      lines: [
        { cat:'Emergency',        icon:'🚨', name:'Police',                        number:'17',       note:'24/7' },
        { cat:'Emergency',        icon:'🔥', name:'Fire / SAMU',                   number:'18',       note:'24/7' },
        { cat:'Emergency',        icon:'🚑', name:'Medical Emergency',             number:'15',       note:'24/7' },
        { cat:'Emergency',        icon:'🆘', name:'European Emergency',            number:'112',      note:'EU standard' },
        { cat:'Mental Health',    icon:'💙', name:'Suicide Prevention',            number:'3114',     note:'24/7' },
        { cat:'Trafficking',      icon:'🛡️', name:'Violence & Trafficking',       number:'3919',     note:'Mon–Fri' },
      ]
    },
    {
      country: 'Japan 🇯🇵', code: 'jp',
      lines: [
        { cat:'Emergency',        icon:'🚨', name:'Police',                        number:'110',      note:'24/7' },
        { cat:'Emergency',        icon:'🔥', name:'Fire & Ambulance',              number:'119',      note:'24/7' },
        { cat:'Tourist Support',  icon:'👮', name:'Japan Helpline (English)',      number:'0120-461-997', note:'24/7 English' },
        { cat:'Mental Health',    icon:'💙', name:'Inochi no Denwa',               number:'0120-783-556', note:'24/7' },
        { cat:'Medical',          icon:'🏥', name:'Japan Medical (English)',       number:'#8905',    note:'For tourists' },
      ]
    },
    {
      country: 'UAE 🇦🇪', code: 'ae',
      lines: [
        { cat:'Emergency',        icon:'🚨', name:'Police',                        number:'999',      note:'24/7' },
        { cat:'Emergency',        icon:'🚑', name:'Ambulance',                     number:'998',      note:'24/7' },
        { cat:'Emergency',        icon:'🔥', name:'Fire',                          number:'997',      note:'24/7' },
        { cat:'Tourist Support',  icon:'👮', name:'Dubai Police Tourist',         number:'901',      note:'24/7 multilingual' },
        { cat:'Women Safety',     icon:'👩', name:'Women & Children Centre',       number:'800-HOPE',  note:'800-4673' },
        { cat:'Mental Health',    icon:'💙', name:'Mental Health Helpline',        number:'800-4-673',note:'24/7' },
      ]
    },
  ];

  const CAT_COLORS = {
    'Emergency':      { bg:'rgba(239,68,68,0.12)',    color:'#ef4444', border:'rgba(239,68,68,0.3)' },
    'Tourist Support':{ bg:'rgba(14,165,233,0.12)',   color:'#0ea5e9', border:'rgba(14,165,233,0.3)' },
    'Women Safety':   { bg:'rgba(244,114,182,0.12)',  color:'#f472b6', border:'rgba(244,114,182,0.3)' },
    'Mental Health':  { bg:'rgba(139,92,246,0.12)',   color:'#8b5cf6', border:'rgba(139,92,246,0.3)' },
    'Trafficking':    { bg:'rgba(245,158,11,0.12)',   color:'#f59e0b', border:'rgba(245,158,11,0.3)' },
    'Medical':        { bg:'rgba(34,197,94,0.12)',    color:'#22c55e', border:'rgba(34,197,94,0.3)' },
  };

  let activeCountry = 'in';
  let activeCategory = 'all';

  function render() {
    const page = document.getElementById('page-hotlines');
    if (!page) return;

    const countryData = HOTLINES.find(h => h.code === activeCountry) || HOTLINES[0];
    const filteredLines = activeCategory === 'all'
      ? countryData.lines
      : countryData.lines.filter(l => l.cat === activeCategory);

    const allCats = [...new Set(countryData.lines.map(l => l.cat))];

    page.innerHTML = `
    <div class="section">
      <div class="container">

        <div style="margin-bottom:2rem;">
          <div class="section-label">Emergency Hotlines</div>
          <h1 class="headline">Country-Specific <span class="gradient-text">Emergency Numbers</span></h1>
          <p style="color:var(--text-secondary);margin-top:0.5rem;">Verified monthly. One-tap calling. Available in your language.</p>
        </div>

        <!-- Country selector -->
        <div style="margin-bottom:1.5rem;">
          <label class="form-label" style="margin-bottom:0.75rem;display:block;">🌍 Select Your Country / Location</label>
          <div style="display:flex;flex-wrap:wrap;gap:0.625rem;" id="country-tabs">
            ${HOTLINES.map(h => `
            <button class="country-tab" data-code="${h.code}" style="padding:0.5rem 1.125rem;border-radius:var(--radius-full);font-size:0.8125rem;font-weight:600;cursor:pointer;transition:all 0.2s;background:${h.code===activeCountry?'var(--primary)':'var(--bg-elevated)'};color:${h.code===activeCountry?'white':'var(--text-secondary)'};border:1.5px solid ${h.code===activeCountry?'var(--primary)':'var(--border)'};">
              ${h.country}
            </button>`).join('')}
          </div>
        </div>

        <!-- Category filter -->
        <div style="display:flex;flex-wrap:wrap;gap:0.625rem;margin-bottom:1.75rem;">
          <button class="cat-tab" data-cat="all" style="padding:0.375rem 0.875rem;border-radius:var(--radius-full);font-size:0.8125rem;font-weight:600;cursor:pointer;background:${activeCategory==='all'?'var(--bg-elevated)':'transparent'};color:var(--text-secondary);border:1.5px solid var(--border);">All</button>
          ${allCats.map(c => {
            const style = CAT_COLORS[c] || CAT_COLORS['Emergency'];
            return `<button class="cat-tab" data-cat="${c}" style="padding:0.375rem 0.875rem;border-radius:var(--radius-full);font-size:0.8125rem;font-weight:600;cursor:pointer;background:${activeCategory===c?style.bg:'transparent'};color:${style.color};border:1.5px solid ${activeCategory===c?style.border:'transparent'};transition:all 0.2s;">${c}</button>`;
          }).join('')}
        </div>

        <!-- Hotline Cards -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem;" id="hotlines-grid">
          ${filteredLines.map(l => {
            const style = CAT_COLORS[l.cat] || CAT_COLORS['Emergency'];
            return `
            <div class="card" style="padding:1.25rem;border-left:3px solid ${style.color};display:flex;flex-direction:column;gap:1rem;">
              <div style="display:flex;align-items:flex-start;gap:0.875rem;">
                <span style="font-size:1.75rem;">${l.icon}</span>
                <div style="flex:1;">
                  <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.25rem;">
                    <span style="font-size:0.7rem;padding:0.125rem 0.5rem;border-radius:9999px;background:${style.bg};color:${style.color};font-weight:700;">${l.cat}</span>
                    <span style="font-size:0.7rem;color:var(--text-muted);">${l.note}</span>
                  </div>
                  <div style="font-weight:700;font-size:0.9375rem;">${l.name}</div>
                  <div style="font-size:1.25rem;font-weight:800;color:${style.color};letter-spacing:0.03em;margin-top:0.25rem;">${l.number}</div>
                </div>
              </div>
              <div style="display:flex;gap:0.5rem;">
                <a href="tel:${l.number.replace(/[^0-9+]/g,'')}" class="btn btn-sm btn-primary" style="flex:1;font-size:0.8125rem;">📞 Call Now</a>
                <button class="btn btn-sm btn-ghost copy-btn" data-number="${l.number}" style="flex:1;font-size:0.8125rem;">📋 Copy</button>
              </div>
            </div>`;
          }).join('')}
        </div>

        <!-- Distress Code Info -->
        <div style="margin-top:3rem;background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(239,68,68,0.08));border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius-xl);padding:2rem;">
          <div style="display:flex;align-items:flex-start;gap:1rem;flex-wrap:wrap;">
            <div style="font-size:2.5rem;">🔒</div>
            <div style="flex:1;">
              <h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.75rem;color:var(--warning);">Silent Distress Codes — For When You Can't Speak Freely</h3>
              <p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:1rem;">ResQ recognizes these coded phrases — trained with hospitality partners and anti-trafficking NGOs. Say them at the front desk or type them in the emergency portal.</p>
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:0.75rem;">
                ${[
                  ['"I have an appointment tomorrow at the front desk"', 'Human trafficking indicator'],
                  ['"The WiFi isn\'t working in my room"',               'Coercion / forced labor signal'],
                  ['"I need a room upgrade — I have a guest with me"',   'Domestic violence victim'],
                  ['"Can I get extra towels sent up?"',                  'General distress / unsafe situation'],
                ].map(([code, meaning]) => `
                <div style="background:rgba(0,0,0,0.2);border:1px solid rgba(245,158,11,0.2);border-radius:var(--radius-md);padding:0.875rem;">
                  <div style="font-size:0.8125rem;font-style:italic;color:var(--text-primary);margin-bottom:0.375rem;">${code}</div>
                  <div style="font-size:0.75rem;color:var(--warning);font-weight:600;">→ ${meaning}</div>
                </div>`).join('')}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>`;

    bindHotlineEvents();
  }

  function bindHotlineEvents() {
    document.querySelectorAll('.country-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCountry = btn.dataset.code;
        activeCategory = 'all';
        render();
      });
    });

    document.querySelectorAll('.cat-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        render();
      });
    });

    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard?.writeText(btn.dataset.number).then(() => {
          window.ResQ?.toast('Copied!', btn.dataset.number + ' copied to clipboard', 'success', 2500);
        });
      });
    });
  }

  document.addEventListener('pageChange', e => { if (e.detail.page === 'hotlines') render(); });
})();
