const CACHE_NAME = 'resq-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/index.css',
  '/nav.js',
  '/app.js',
  '/pages/home.js',
  '/pages/emergency.js',
  '/pages/map.js',
  '/pages/hotlines.js',
  '/pages/alerts.js',
  '/pages/dashboard.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/index.html')))
  );
});
