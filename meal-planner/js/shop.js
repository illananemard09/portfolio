'use strict';
// Shopping list built from the week's plan: ingredients merged across recipes,
// grouped by aisle in store-walk order, ticked items sink to the bottom.
(() => {
  const { esc, icon } = App;

  function shopState(week) {
    const s = App.state.shop;
    if (!s[week]) s[week] = { checked: {}, extras: [] };
    return s[week];
  }

  // g+kg and ml+L merge; spoons, cups and count units stay as written.
  const bucketOf = u => (u === 'kg' ? 'g' : u === 'L' ? 'ml' : u || '');
  function toBucket(q, u) { return u === 'kg' || u === 'L' ? q * 1000 : q; }
  function showBucket(q, b) {
    if (b === 'g' && q >= 1000) return App.fmtAmount(Math.round(q / 100) / 10, 'kg');
    if (b === 'ml' && q >= 1000) return App.fmtAmount(Math.round(q / 100) / 10, 'L');
    return App.fmtAmount(q, b);
  }
  const displayName = n => {
    const s = String(n).replace(/\(.*?\)/g, '').split(',')[0].trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  function buildList(week) {
    const items = new Map();
    for (const day of App.plan(week)) for (const m of day) {
      const r = App.getRecipe(m.recipeId);
      if (!r) continue;
      const k = App.scale(r, m.servings);
      for (const i of r.ingredients) {
        // Tinned and fresh versions of the same thing live in different aisles.
        const tinned = /^(can|jar)$/.test(i.unit);
        const key = (tinned ? 'tinned ' : '') + (App.nameKey(i.name) || i.name.toLowerCase());
        let it = items.get(key);
        if (!it) { it = { key, name: (tinned && !/tin|can/i.test(i.name) ? 'Tinned ' + displayName(i.name).toLowerCase() : displayName(i.name)), aisle: i.aisle || App.guessAisle(i.name, i.unit), parts: new Map(), from: new Set() }; items.set(key, it); }
        it.from.add(r.title);
        if (i.qty === '' || i.qty == null) continue;
        const b = bucketOf(i.unit);
        it.parts.set(b, (it.parts.get(b) || 0) + toBucket(Number(i.qty) * k, i.unit));
      }
    }
    for (const it of items.values()) {
      it.amount = [...it.parts].map(([b, q]) => showBucket(q, b)).join(' + ');
    }
    return [...items.values()];
  }

  function weekCost(week) {
    let t = 0, any = false;
    for (const day of App.plan(week)) for (const m of day) {
      const r = App.getRecipe(m.recipeId);
      if (r && r.price !== '' && r.price != null) { t += Number(r.price) * App.scale(r, m.servings); any = true; }
    }
    return any ? t : null;
  }

  function itemHtml(it, done) {
    return `<button class="item${done ? ' is-done' : ''}${it.extra ? ' is-extra' : ''}" data-act="toggle" data-key="${esc(it.key)}" aria-pressed="${done}">
      <span class="item__box">${icon('check')}</span>
      <span class="item__main"><span class="item__name">${esc(it.name)}</span>
        ${!done && it.from && it.from.size ? `<span class="item__from">${esc([...it.from].join(' · '))}</span>` : ''}</span>
      ${it.amount ? `<span class="item__qty">${esc(it.amount)}</span>` : ''}
    </button>`;
  }

  App.screens.shop = {
    render() {
      const week = App.currentWeek();
      const st = shopState(week);
      const list = buildList(week).concat(st.extras.map(e => ({
        key: 'x:' + e.id, name: e.name, aisle: e.aisle, amount: e.amount, extra: true
      })));
      const done = list.filter(it => st.checked[it.key]);
      const todo = list.filter(it => !st.checked[it.key]);
      const cost = weekCost(week);
      const pct = list.length ? Math.round(done.length / list.length * 100) : 0;
      const dates = App.weekDates(week);

      let body = `<form class="quick-add" data-submit="quick-add" autocomplete="off">
          <input class="input" name="q" placeholder="Add an item — e.g. 2L milk" aria-label="Add an item" enterkeyhint="done">
          <button class="round-btn" aria-label="Add item">${icon('plus')}</button>
        </form>`;

      if (!list.length) {
        body += `<div class="empty"><div class="big">🛒</div><h2>Your list is empty</h2>
          <p>Plan a few dinners and everything you need lands here, sorted by aisle.</p>
          <a class="btn btn--primary" href="#/plan">Plan the week</a></div>`;
        return { title: 'Shopping list', kicker: `Week of ${dates[0].getDate()}/${dates[0].getMonth() + 1}`, tab: 'shop', keepScroll: true, body };
      }

      body += `<div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
        <div class="shop-stats"><span>${done.length} of ${list.length} in the trolley</span>${cost != null ? `<span>≈ ${App.money(cost)} est.</span>` : ''}</div>`;

      for (const aisle of App.AISLES) {
        const group = todo.filter(it => (App.AISLES.includes(it.aisle) ? it.aisle : 'Other') === aisle);
        if (!group.length) continue;
        body += `<section class="aisle"><h2 class="aisle__title"><span>${esc(aisle)}</span><span>${group.length}</span></h2>
          <div class="card items">${group.map(it => itemHtml(it, false)).join('')}</div></section>`;
      }
      if (!todo.length) body += `<div class="banner banner--ok" style="margin-top:18px">${icon('check')}<div><strong>All done!</strong><p>Everything’s in the trolley. Enjoy the week.</p></div></div>`;
      if (done.length) {
        body += `<div class="done-head"><h2 class="aisle__title"><span>In the trolley · ${done.length}</span></h2>
          <button class="btn btn--sm btn--ghost" data-act="reset">Untick all</button></div>
          <div class="card items">${done.map(it => itemHtml(it, true)).join('')}</div>`;
      }
      return {
        title: 'Shopping list', kicker: `Week of ${dates[0].getDate()}/${dates[0].getMonth() + 1}`, tab: 'shop', keepScroll: true, body,
        actions: `<button class="icon-btn" data-act="copy" aria-label="Copy list to share">
          <svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg></button>`
      };
    },
    mount() { keepAwake(true); },
    actions: {
      toggle(el) {
        const st = shopState(App.currentWeek());
        const k = el.dataset.key;
        if (st.checked[k]) delete st.checked[k]; else st.checked[k] = true;
        if (navigator.vibrate) navigator.vibrate(8);
        App.save();
        App.refresh();
      },
      'quick-add'(form, e) {
        e.preventDefault();
        const input = form.elements.q;
        const text = input.value.trim();
        if (!text) return;
        const p = App.parseIngredient(text);
        const st = shopState(App.currentWeek());
        st.extras.push({
          id: App.uid(), name: displayName(p.name || text), aisle: p.aisle,
          amount: p.qty === '' ? '' : App.fmtAmount(p.qty, p.unit)
        });
        App.save();
        App.refresh();
        const again = document.querySelector('.quick-add input');
        again.focus();
        App.toast(`Added to ${p.aisle}`);
      },
      reset() {
        const st = shopState(App.currentWeek());
        const prev = st.checked;
        st.checked = {};
        App.save(); App.refresh();
        App.toast('Unticked everything', () => { st.checked = prev; App.save(); App.refresh(); });
      },
      async copy() {
        const week = App.currentWeek();
        const st = shopState(week);
        const list = buildList(week).concat(st.extras.map(e => ({ key: 'x:' + e.id, ...e })));
        const lines = [];
        for (const aisle of App.AISLES) {
          const g = list.filter(it => !st.checked[it.key] && (App.AISLES.includes(it.aisle) ? it.aisle : 'Other') === aisle);
          if (!g.length) continue;
          lines.push(aisle.toUpperCase(), ...g.map(it => '☐ ' + it.name + (it.amount ? ' — ' + it.amount : '')), '');
        }
        try { await navigator.clipboard.writeText(lines.join('\n').trim()); App.toast('List copied — paste it to your flatmates'); }
        catch (e) { App.toast('Couldn’t copy on this browser'); }
      }
    }
  };

  // Keep the phone screen on while shopping, where supported.
  let lock = null;
  async function keepAwake(on) {
    try {
      if (on && !lock && navigator.wakeLock) { lock = await navigator.wakeLock.request('screen'); lock.addEventListener('release', () => { lock = null; }); }
      if (!on && lock) { await lock.release(); lock = null; }
    } catch (e) { lock = null; }
  }
  window.addEventListener('hashchange', () => { if (App.route.name !== 'shop') keepAwake(false); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && App.route.name === 'shop') keepAwake(true); });

  App.buildShoppingList = buildList;
})();
