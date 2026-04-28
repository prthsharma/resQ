/* ── Navigation & Page Router ─── */
(function () {
  'use strict';

  // ── Navbar scroll effect ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // ── Mobile hamburger ──
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // ── Page Router ──
  const pages   = document.querySelectorAll('.page');
  const navBtns = document.querySelectorAll('[data-page]');

  function showPage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    navBtns.forEach(b => b.classList.remove('active'));

    const target = document.getElementById('page-' + pageId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    navBtns.forEach(b => { if (b.dataset.page === pageId) b.classList.add('active'); });

    // Close mobile menu
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });

    // Trigger page init events
    document.dispatchEvent(new CustomEvent('pageChange', { detail: { page: pageId } }));
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showPage(btn.dataset.page);
    });
  });

  document.getElementById('logo-home').addEventListener('click', e => {
    e.preventDefault();
    showPage('home');
  });

  // SOS button → goes to emergency page
  document.getElementById('sos-btn').addEventListener('click', () => {
    showPage('emergency');
    document.dispatchEvent(new CustomEvent('startSOS'));
  });

  // Expose globally
  window.ResQ = window.ResQ || {};
  window.ResQ.showPage = showPage;

  // ── Toast system ──
  function toast(title, msg, type = 'info', duration = 4000) {
    const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', danger: '🆘', error: '❌' };
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = 'toast';
    el.style.borderLeft = `3px solid var(--${type === 'danger' ? 'accent' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'primary'})`;
    el.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
      </div>
    `;
    el.addEventListener('click', () => removeToast(el));
    container.appendChild(el);
    setTimeout(() => removeToast(el), duration);
    return el;
  }

  function removeToast(el) {
    if (!el.parentNode) return;
    el.classList.add('removing');
    setTimeout(() => el.remove(), 300);
  }

  window.ResQ.toast = toast;
})();
