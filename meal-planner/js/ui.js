'use strict';
// Router, layout, and shared UI helpers (toast, bottom sheet, escaping).
(() => {
  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const screens = {};
  let current = { name: '', params: [] };

  function parseHash() {
    const parts = (location.hash.replace(/^#\/?/, '') || 'plan').split('/').map(decodeURIComponent);
    return { name: screens[parts[0]] ? parts[0] : (screens.plan ? 'plan' : 'recipes'), params: parts.slice(1) };
  }

  function go(path) {
    if (location.hash === '#/' + path) render(); else location.hash = '#/' + path;
  }

  const TABS = [
    ['plan', 'Plan', '<path d="M4 6h16M4 12h16M4 18h10" />'],
    ['recipes', 'Recipes', '<path d="M6 3h10a2 2 0 0 1 2 2v16l-7-3-7 3V5a2 2 0 0 1 2-2z" />'],
    ['shop', 'Shop', '<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" /><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>']
  ];

  function tabbar(active) {
    return '<nav class="tabbar" aria-label="Main">' + TABS.map(([id, label, icon]) =>
      `<a href="#/${id}" class="tab${active === id ? ' is-active' : ''}"${active === id ? ' aria-current="page"' : ''}>
        <svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><span>${label}</span></a>`).join('') + '</nav>';
  }

  function render() {
    current = parseHash();
    const scr = screens[current.name];
    const root = document.getElementById('app');
    const view = scr.render(...current.params);
    root.className = 'screen-' + current.name + (view.tab ? ' has-tabs' : '');
    root.innerHTML = `
      <header class="topbar${view.back ? ' has-back' : ''}">
        ${view.back ? `<button class="icon-btn" data-act="nav-back" data-to="${esc(view.back)}" aria-label="Back">
          <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>` : ''}
        <div class="topbar__title">${view.kicker ? `<small>${esc(view.kicker)}</small>` : ''}<h1>${esc(view.title)}</h1></div>
        <div class="topbar__actions">${view.actions || ''}</div>
      </header>
      <main class="view">${view.body}</main>
      ${view.footer ? `<div class="footer-bar">${view.footer}</div>` : ''}
      ${view.tab ? tabbar(view.tab) : ''}`;
    if (!view.keepScroll) window.scrollTo(0, 0);
    scr.mount && scr.mount(root, ...current.params);
  }

  // Re-render the current screen without resetting the scroll position.
  function refresh() {
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
  }

  // Event delegation: any element with data-act="name" calls the current
  // screen's actions[name](el, event), falling back to global actions.
  const globalActions = {
    'nav-back': el => {
      if (App._navCount > 1) history.back(); else go(el.dataset.to || 'plan');
    },
    'go': el => go(el.dataset.to),
    'sheet-close': () => closeSheet()
  };
  function dispatch(type, e) {
    const el = e.target.closest('[data-' + type + ']');
    if (!el) return;
    const name = el.getAttribute('data-' + type);
    const scr = screens[current.name];
    const fn = (scr.actions && scr.actions[name]) || (sheetActions && sheetActions[name]) || globalActions[name];
    if (fn) fn(el, e);
  }
  document.addEventListener('click', e => dispatch('act', e));
  document.addEventListener('input', e => dispatch('input', e));
  document.addEventListener('change', e => dispatch('change', e));

  // ---------- Bottom sheet ----------
  let sheetActions = null;
  function openSheet(html, actions) {
    sheetActions = actions || null;
    const root = document.getElementById('sheet-root');
    root.innerHTML = `<div class="sheet-backdrop" data-act="sheet-close"></div>
      <div class="sheet" role="dialog" aria-modal="true"><div class="sheet__grip"></div>${html}</div>`;
    root.classList.add('is-open');
    const f = root.querySelector('[autofocus]');
    if (f) f.focus();
  }
  function closeSheet() {
    const root = document.getElementById('sheet-root');
    root.classList.remove('is-open');
    root.innerHTML = '';
    sheetActions = null;
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg, undo) {
    const t = document.getElementById('toast');
    t.innerHTML = `<span>${esc(msg)}</span>${undo ? '<button type="button">Undo</button>' : ''}`;
    t.classList.add('is-on');
    if (undo) t.querySelector('button').onclick = () => { undo(); t.classList.remove('is-on'); };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), undo ? 5000 : 3200);
  }

  // Photo or a warm placeholder with the recipe emoji.
  function thumb(r, cls) {
    if (r.photo) return `<div class="thumb ${cls || ''}" style="background-image:url('${esc(r.photo)}')"></div>`;
    return `<div class="thumb thumb--emoji ${cls || ''}" style="--h:${Number(r.hue) || 30}"><span>${esc(r.emoji || '🍽️')}</span></div>`;
  }

  function icon(name) {
    const paths = {
      plus: '<path d="M12 5v14M5 12h14"/>',
      minus: '<path d="M5 12h14"/>',
      edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/>',
      trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
      clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
      users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 11a3 3 0 1 0 0-6M21 20c0-2.6-1.6-4.8-4-5.6"/>',
      search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>',
      link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
      text: '<path d="M5 6h14M5 10h14M5 14h9M5 18h6"/>',
      pen: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/>',
      up: '<path d="M6 15l6-6 6 6"/>',
      down: '<path d="M6 9l6 6 6-6"/>',
      x: '<path d="M6 6l12 12M18 6L6 18"/>',
      check: '<path d="M5 12l5 5 9-10"/>',
      camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
      alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
      cal: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
      grip: '<circle cx="9" cy="7" r="1.2"/><circle cx="15" cy="7" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="17" r="1.2"/><circle cx="15" cy="17" r="1.2"/>',
      left: '<path d="M15 5l-7 7 7 7"/>',
      right: '<path d="M9 5l7 7-7 7"/>',
      dollar: '<path d="M12 3v18M16 7c-1-1.3-2.4-2-4-2-2.2 0-4 1.3-4 3s1.5 2.6 4 3 4 1.4 4 3.2-1.8 2.8-4 2.8c-1.8 0-3.3-.8-4.3-2"/>'
    };
    return `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ''}</svg>`;
  }

  App._navCount = 0;
  window.addEventListener('hashchange', () => { App._navCount++; closeSheet(); render(); });

  Object.assign(App, { esc, screens, go, render, refresh, openSheet, closeSheet, toast, thumb, icon });
  Object.defineProperty(App, 'route', { get: () => current });
})();
