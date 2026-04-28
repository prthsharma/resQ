/* ── ResQ App Bootstrap ───────────────── */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // ── Init home page on load ──
    const homeEvent = new CustomEvent('pageChange', { detail: { page: 'home' } });
    document.dispatchEvent(homeEvent);

    // ── Keyboard shortcut: S → SOS ──
    document.addEventListener('keydown', e => {
      if (e.key === 's' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea' && tag !== 'select') {
          window.ResQ?.showPage('emergency');
          window.ResQ?.toast('🆘 SOS Mode', 'Emergency portal opened. Press S anytime.', 'danger');
        }
      }
    });

    // ── Service Worker registration (offline support) ──
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {
        // SW not critical for MVP
      });
    }

    // ── Welcome toast ──
    setTimeout(() => {
      window.ResQ?.toast(
        '🛡️ ResQ Ready',
        'Press S anytime for instant emergency access.',
        'info',
        5000
      );
    }, 1200);

    // ── Respond to window resize ──
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const currentPage = document.querySelector('.page.active');
        if (currentPage) {
          const id = currentPage.id.replace('page-', '');
          document.dispatchEvent(new CustomEvent('pageChange', { detail: { page: id } }));
        }
      }, 300);
    });

    // ── Language detection ──
    const lang = navigator.language?.slice(0, 2) || 'en';
    window.ResQ = window.ResQ || {};
    window.ResQ.userLang = lang;

    // ── PWA install prompt ──
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e;
      setTimeout(() => {
        window.ResQ?.toast(
          '📱 Install ResQ',
          'Add to Home Screen for offline emergency access.',
          'info',
          8000
        );
      }, 10000);
    });

  });
})();
