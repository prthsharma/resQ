(function () {
  'use strict';

  let mapInstance = null;

  const RESOURCES = [
    { type:'hospital', icon:'🏥', name:'City General Hospital',       lat:28.6140, lng:77.2090, dist:'0.8 km', wait:'12 min', badge:'Trauma Center',      color:'#ef4444' },
    { type:'hospital', icon:'🏥', name:'Apollo Medical Center',       lat:28.6180, lng:77.2150, dist:'1.4 km', wait:'8 min',  badge:'24/7 Cardiac ICU',   color:'#ef4444' },
    { type:'police',   icon:'👮', name:'Central Police Station',       lat:28.6100, lng:77.2050, dist:'0.5 km', wait:'—',      badge:'Tourist Police',     color:'#8b5cf6' },
    { type:'police',   icon:'👮', name:'District Security Office',    lat:28.6200, lng:77.2000, dist:'1.1 km', wait:'—',      badge:'Anti-Trafficking',   color:'#8b5cf6' },
    { type:'fire',     icon:'🚒', name:'Fire Station Alpha',           lat:28.6080, lng:77.2120, dist:'0.6 km', wait:'4 min',  badge:'Rescue Unit',        color:'#f97316' },
    { type:'fire',     icon:'🚒', name:'Sub Fire Station East',        lat:28.6160, lng:77.2200, dist:'1.7 km', wait:'7 min',  badge:'Hazmat Equipped',    color:'#f97316' },
    { type:'safe',     icon:'🛡️', name:'Safe Zone — Hotel Lobby',     lat:28.6130, lng:77.2080, dist:'0.1 km', wait:'—',      badge:'24/7 Staffed',       color:'#22c55e' },
    { type:'shelter',  icon:'🏠', name:'DV Shelter & Safe House',      lat:28.6220, lng:77.2180, dist:'2.2 km', wait:'—',      badge:'Confidential',       color:'#0ea5e9' },
  ];

  const TYPE_LABELS = { hospital:'Hospitals', police:'Police', fire:'Fire Stations', safe:'Safe Zones', shelter:'Shelters' };
  const TYPE_COLORS = { hospital:'#ef4444', police:'#8b5cf6', fire:'#f97316', safe:'#22c55e', shelter:'#0ea5e9' };

  function renderMapPage() {
    const page = document.getElementById('page-map');
    if (!page) return;

    page.innerHTML = `
    <div class="section">
      <div class="container--wide">
        <div style="margin-bottom:2rem;">
          <div class="section-label">Resource Discovery</div>
          <h1 class="headline">Emergency <span class="gradient-text">Resource Map</span></h1>
          <p style="color:var(--text-secondary);margin-top:0.5rem;">Real-time locations of hospitals, police stations, fire stations and safe zones near you.</p>
        </div>

        <!-- Filter bar -->
        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-bottom:1.5rem;">
          <span style="font-size:0.875rem;font-weight:600;color:var(--text-secondary);">Filter:</span>
          ${Object.entries(TYPE_LABELS).map(([k,v]) => `
          <button class="filter-btn" data-type="${k}" style="padding:0.4rem 1rem;border-radius:var(--radius-full);font-size:0.8125rem;font-weight:600;background:rgba(${k==='hospital'?'239,68,68':k==='police'?'139,92,246':k==='fire'?'249,115,22':k==='safe'?'34,197,94':'14,165,233'},0.12);color:${TYPE_COLORS[k]};border:1.5px solid ${TYPE_COLORS[k]}44;cursor:pointer;transition:all 0.2s;">
            ${v}
          </button>`).join('')}
          <button class="filter-btn" data-type="all" style="padding:0.4rem 1rem;border-radius:var(--radius-full);font-size:0.8125rem;font-weight:600;background:var(--bg-elevated);color:var(--text-secondary);border:1.5px solid var(--border);cursor:pointer;transition:all 0.2s;">All</button>
        </div>

        <!-- Map + Sidebar -->
        <div style="display:grid;grid-template-columns:1fr 340px;gap:1.5rem;align-items:start;" id="map-layout">
          <!-- Map -->
          <div style="border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--border);position:relative;">
            <div id="leaflet-map" style="height:520px;background:var(--bg-elevated);"></div>
            <div style="position:absolute;top:1rem;left:1rem;z-index:500;">
              <div style="background:rgba(2,8,23,0.85);backdrop-filter:blur(12px);border:1px solid var(--border);border-radius:var(--radius-md);padding:0.625rem 1rem;font-size:0.8125rem;">
                <div style="display:flex;align-items:center;gap:0.5rem;"><span class="status-dot live"></span><span style="font-weight:600;">Live — ${RESOURCES.length} resources found</span></div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div style="display:flex;flex-direction:column;gap:0.75rem;max-height:540px;overflow-y:auto;" id="resource-list">
            ${RESOURCES.map((r,i) => `
            <div class="resource-card card" data-type="${r.type}" data-idx="${i}" style="cursor:pointer;padding:1rem;border-left:3px solid ${TYPE_COLORS[r.type]};transition:all 0.2s;">
              <div style="display:flex;align-items:flex-start;gap:0.75rem;">
                <span style="font-size:1.5rem;margin-top:0.125rem;">${r.icon}</span>
                <div style="flex:1;min-width:0;">
                  <div style="font-weight:700;font-size:0.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.name}</div>
                  <div style="display:flex;align-items:center;gap:0.5rem;margin-top:0.25rem;flex-wrap:wrap;">
                    <span style="font-size:0.75rem;color:var(--text-secondary);">📍 ${r.dist}</span>
                    ${r.wait !== '—' ? `<span style="font-size:0.75rem;color:var(--warning);">⏱ ${r.wait}</span>` : ''}
                    <span style="font-size:0.7rem;background:rgba(${r.color==='#ef4444'?'239,68,68':r.color==='#8b5cf6'?'139,92,246':r.color==='#f97316'?'249,115,22':r.color==='#22c55e'?'34,197,94':'14,165,233'},0.12);color:${r.color};padding:0.125rem 0.5rem;border-radius:9999px;font-weight:600;">${r.badge}</span>
                  </div>
                </div>
              </div>
              <div style="display:flex;gap:0.5rem;margin-top:0.75rem;">
                <a href="tel:100" class="btn btn-sm btn-primary" style="flex:1;font-size:0.75rem;" onclick="event.stopPropagation()">📞 Call</a>
                <a href="https://maps.google.com/?q=${r.lat},${r.lng}" target="_blank" class="btn btn-sm btn-ghost" style="flex:1;font-size:0.75rem;" onclick="event.stopPropagation()">🗺 Directions</a>
              </div>
            </div>`).join('')}
          </div>
        </div>

        <!-- Info strip -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-top:1.5rem;">
          ${[['🏥','2','Hospitals within 2 km'],['👮','2','Police stations nearby'],['🚒','1','Fire station < 1 km'],['🛡️','1','Safe zone on-site']].map(([i,n,l])=>`
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:1rem;display:flex;align-items:center;gap:0.75rem;">
            <span style="font-size:1.5rem;">${i}</span>
            <div><div style="font-size:1.25rem;font-weight:800;color:var(--primary);">${n}</div><div style="font-size:0.75rem;color:var(--text-secondary);">${l}</div></div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;

    // Make responsive on small screens
    const layout = page.querySelector('#map-layout');
    if (window.innerWidth < 900) layout.style.gridTemplateColumns = '1fr';

    initMap();
    bindMapFilters();
  }

  function initMap() {
    if (typeof L === 'undefined') {
      setTimeout(initMap, 500);
      return;
    }
    if (mapInstance) { mapInstance.remove(); mapInstance = null; }

    const center = [28.6139, 77.2090];
    mapInstance = L.map('leaflet-map', { zoomControl: true, scrollWheelZoom: true }).setView(center, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      className: 'map-tiles'
    }).addTo(mapInstance);

    // Inject dark filter CSS for map tiles
    const styleEl = document.getElementById('map-style') || document.createElement('style');
    styleEl.id = 'map-style';
    styleEl.textContent = `.map-tiles { filter: invert(90%) hue-rotate(190deg) saturate(0.8) brightness(0.85); }
      .leaflet-container { background: #020817; }`;
    document.head.appendChild(styleEl);

    // User location marker
    const userIcon = L.divIcon({ html: '<div style="width:14px;height:14px;border-radius:50%;background:#0ea5e9;border:3px solid white;box-shadow:0 0 12px rgba(14,165,233,0.8);"></div>', iconSize:[14,14], iconAnchor:[7,7] });
    L.marker(center, { icon: userIcon }).addTo(mapInstance).bindPopup('<b>📍 Your Location</b><br/>Hotel Area');

    RESOURCES.forEach(r => {
      const icon = L.divIcon({
        html: `<div style="font-size:1.5rem;filter:drop-shadow(0 2px 6px ${r.color}88);">${r.icon}</div>`,
        iconSize:[32,32], iconAnchor:[16,16]
      });
      L.marker([r.lat, r.lng], { icon })
        .addTo(mapInstance)
        .bindPopup(`<b>${r.name}</b><br/>${r.badge} • ${r.dist}`);
    });
  }

  function bindMapFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        document.querySelectorAll('.resource-card').forEach(card => {
          card.style.display = (type === 'all' || card.dataset.type === type) ? '' : 'none';
        });
      });
    });

    document.querySelectorAll('.resource-card').forEach(card => {
      card.addEventListener('mouseenter', () => { card.style.background = 'var(--bg-hover)'; });
      card.addEventListener('mouseleave', () => { card.style.background = ''; });
    });
  }

  document.addEventListener('pageChange', e => {
    if (e.detail.page === 'map') {
      renderMapPage();
    } else {
      if (mapInstance) { mapInstance.remove(); mapInstance = null; }
    }
  });
})();
