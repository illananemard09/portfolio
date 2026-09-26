'use strict';
// Weekly plan: drag recipes from the tray onto days (or tap to pick a day),
// drag planned meals between days, tap a meal to change servings.
(() => {
  const { esc, icon, thumb } = App;
  const SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let week = App.isoDate(App.mondayOf(new Date()));
  App.currentWeek = () => week;

  const thisWeek = () => App.isoDate(App.mondayOf(new Date()));
  function shiftWeek(n) {
    const d = App.weekDates(week)[0];
    d.setDate(d.getDate() + 7 * n);
    week = App.isoDate(d);
  }
  function weekLabel() {
    const ds = App.weekDates(week), a = ds[0], b = ds[6];
    const range = a.getMonth() === b.getMonth()
      ? `${a.getDate()}–${b.getDate()} ${MONTHS[b.getMonth()]}`
      : `${a.getDate()} ${MONTHS[a.getMonth()]} – ${b.getDate()} ${MONTHS[b.getMonth()]}`;
    const diff = Math.round((ds[0] - App.weekDates(thisWeek())[0]) / 6048e5);
    const name = diff === 0 ? 'This week' : diff === 1 ? 'Next week' : diff === -1 ? 'Last week' : '';
    return { name, range };
  }

  function mealCost(m, r) {
    return r && r.price !== '' && r.price != null ? Number(r.price) * App.scale(r, m.servings) : null;
  }

  function mealHtml(m) {
    const r = App.getRecipe(m.recipeId);
    if (!r) return '';
    const cost = mealCost(m, r);
    return `<div class="meal" data-meal="${esc(m.id)}">
      <button class="meal__main" data-act="meal">
        ${thumb(r)}<span class="meal__text"><span class="meal__title">${esc(r.title)}</span>
        <span class="meal__serv">${m.servings} serves${cost != null ? ' · ' + App.money(cost) : ''}</span></span>
      </button>
      <span class="meal__grip" data-drag="meal" aria-hidden="true">${icon('grip')}</span>
    </div>`;
  }

  App.screens.plan = {
    render() {
      const plan = App.plan(week);
      const dates = App.weekDates(week);
      const today = App.isoDate(new Date());
      let meals = 0, total = 0, priced = 0;
      for (const day of plan) for (const m of day) {
        const r = App.getRecipe(m.recipeId);
        if (!r) continue;
        meals++;
        const c = mealCost(m, r);
        if (c != null) { total += c; priced++; }
      }
      const { name, range } = weekLabel();
      const recipes = App.state.recipes;
      return {
        title: 'What’s for dinner?', kicker: 'Mise', tab: 'plan', keepScroll: true,
        body: `<div class="week-nav">
            <button class="icon-btn" data-act="week" data-d="-1" aria-label="Previous week"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
            <div style="text-align:center"><strong>${esc(name || range)}</strong><div class="muted" style="font-size:14px">${name ? esc(range) : '&nbsp;'}</div></div>
            <button class="icon-btn" data-act="week" data-d="1" aria-label="Next week"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
          </div>
          <div class="week-sum">
            <span class="price-chip">🍽️ ${meals} meal${meals === 1 ? '' : 's'} planned</span>
            ${priced ? `<span class="price-chip">≈ ${App.money(total)} this week</span>` : ''}
          </div>
          <div class="days">${plan.map((day, i) => {
            const d = dates[i];
            return `<section class="card day${App.isoDate(d) === today ? ' is-today' : ''}" data-day="${i}" aria-label="${App.DAY_NAMES[i]}">
              <div class="day__head"><span class="day__name">${App.DAY_NAMES[i]}</span><span class="day__date">${d.getDate()} ${MONTHS[d.getMonth()]}${App.isoDate(d) === today ? ' · today' : ''}</span></div>
              ${day.length ? day.map(mealHtml).join('') : `<div class="day__empty"><button data-act="fill-day">+ Drop a recipe or tap to choose</button></div>`}
            </section>`;
          }).join('')}</div>
          <div class="tray-wrap"><div class="tray">
            <div class="tray__label"><span>Drag onto a day — or tap</span><span>${recipes.length} recipes</span></div>
            <div class="tray__scroll">${recipes.map(r => `<button class="chip" data-act="chip" data-drag="recipe" data-id="${esc(r.id)}">
              ${thumb(r)}<span class="chip__t">${esc(r.title)}</span></button>`).join('')}
              <a class="chip chip--add" href="#/add"><span class="thumb">${icon('plus')}</span><span class="chip__t">New recipe</span></a>
            </div></div></div>`
      };
    },
    actions: {
      week(el) {
        shiftWeek(Number(el.dataset.d));
        App.render();
      },
      chip(el) {
        if (suppressClick) return;
        const r = App.getRecipe(el.dataset.id);
        App.pickDay(r.id, r.servings);
      },
      'fill-day'(el) {
        const i = Number(el.closest('[data-day]').dataset.day);
        App.openSheet(`<h2>${App.DAY_NAMES[i]}</h2><p class="sub">Pick a recipe</p>
          <div class="recipe-list" style="margin-top:0">${App.state.recipes.map(r => `<button class="card recipe-row" style="border:0;text-align:left;width:100%" data-act="fill-pick" data-id="${esc(r.id)}">
            ${thumb(r)}<div><h3>${esc(r.title)}</h3><div class="meta"><span>${esc(r.servings)} serves</span></div></div></button>`).join('')}</div>`, {
          'fill-pick'(b) {
            const r = App.getRecipe(b.dataset.id);
            addMeal(i, r.id, r.servings);
            App.closeSheet();
          }
        });
      },
      meal(el) {
        if (suppressClick) return;
        openMeal(el.closest('[data-meal]').dataset.meal);
      }
    }
  };

  function findMeal(id) {
    const plan = App.plan(week);
    for (let d = 0; d < 7; d++) {
      const i = plan[d].findIndex(m => m.id === id);
      if (i >= 0) return { day: d, index: i, meal: plan[d][i] };
    }
    return null;
  }

  function addMeal(day, recipeId, servings) {
    const meal = { id: App.uid(), recipeId, servings };
    App.plan(week)[day].push(meal);
    App.save();
    App.refresh();
    App.toast(`Added to ${App.DAY_NAMES[day]}`, () => {
      const f = findMeal(meal.id);
      if (f) { App.plan(week)[f.day].splice(f.index, 1); App.save(); App.refresh(); }
    });
  }

  function openMeal(id) {
    const f = findMeal(id);
    const r = App.getRecipe(f.meal.recipeId);
    const draw = () => {
      const c = mealCost(f.meal, r);
      return `<h2>${esc(r.title)}</h2><p class="sub">${App.DAY_NAMES[f.day]}</p>
        <div class="card stepper" style="margin-top:0">
          <div class="stepper__label">Servings<small>${c != null ? '≈ ' + App.money(c) : 'Shopping list follows this'}</small></div>
          <div class="stepper__ctrl">
            <button class="round-btn" data-act="m-serv" data-d="-1" aria-label="Fewer servings"${f.meal.servings <= 1 ? ' disabled' : ''}>${icon('minus')}</button>
            <output>${f.meal.servings}</output>
            <button class="round-btn" data-act="m-serv" data-d="1" aria-label="More servings">${icon('plus')}</button>
          </div></div>
        <div class="btn-row" style="margin-top:14px">
          <a class="btn" href="#/recipe/${esc(r.id)}">View recipe</a>
          <button class="btn btn--danger" data-act="m-del">${icon('trash')} Remove</button>
        </div>`;
    };
    App.openSheet(draw(), {
      'm-serv'(el) {
        f.meal.servings = Math.max(1, Math.min(24, f.meal.servings + Number(el.dataset.d)));
        App.save();
        document.querySelector('.sheet').innerHTML = '<div class="sheet__grip"></div>' + draw();
        App.refresh();
      },
      'm-del'() {
        const cur = findMeal(id);
        App.plan(week)[cur.day].splice(cur.index, 1);
        App.save(); App.closeSheet(); App.refresh();
        App.toast('Removed from ' + App.DAY_NAMES[cur.day], () => {
          App.plan(week)[cur.day].splice(cur.index, 0, cur.meal); App.save(); App.refresh();
        });
      }
    });
  }

  // ---------- Drag & drop (pointer events: works with touch, pen and mouse) ----------
  let pending = null, drag = null, suppressClick = false, raf = 0;

  document.addEventListener('pointerdown', e => {
    if (App.route.name !== 'plan' || e.button > 0) return;
    const src = e.target.closest('[data-drag]');
    if (!src) return;
    const kind = src.dataset.drag;
    const payload = kind === 'recipe'
      ? { kind, recipeId: src.dataset.id }
      : { kind, mealId: src.closest('[data-meal]').dataset.meal };
    pending = { x: e.clientX, y: e.clientY, payload, src, pointerId: e.pointerId, type: e.pointerType };
  });

  document.addEventListener('pointermove', e => {
    if (pending && !drag && e.pointerId === pending.pointerId) {
      const dx = e.clientX - pending.x, dy = e.clientY - pending.y;
      const dist = Math.hypot(dx, dy);
      // In the tray, horizontal swipes scroll; a vertical pull starts the drag.
      const ok = pending.payload.kind === 'meal' ? dist > 4
        : pending.type === 'mouse' ? dist > 6 : Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx);
      if (ok) beginDrag(e);
    }
    if (drag && e.pointerId === drag.pointerId) {
      e.preventDefault();
      moveDrag(e.clientX, e.clientY);
    }
  }, { passive: false });

  const endPointer = e => {
    if (drag && e.pointerId === drag.pointerId) finishDrag(e.type === 'pointerup');
    pending = null;
  };
  document.addEventListener('pointerup', endPointer);
  document.addEventListener('pointercancel', endPointer);

  function beginDrag(e) {
    const p = pending.payload;
    const recipeId = p.kind === 'recipe' ? p.recipeId : findMeal(p.mealId).meal.recipeId;
    const r = App.getRecipe(recipeId);
    const ghost = document.createElement('div');
    ghost.className = 'ghost';
    ghost.innerHTML = thumb(r) + `<span>${esc(r.title)}</span>`;
    document.body.appendChild(ghost);
    document.body.classList.add('is-dragging');
    drag = { ...pending, ghost, over: null, y: e.clientY };
    if (p.kind === 'meal') pending.src.closest('.meal').style.opacity = '.35';
    try { pending.src.setPointerCapture(e.pointerId); } catch (err) { /* not capturable */ }
    if (navigator.vibrate) navigator.vibrate(12);
    moveDrag(e.clientX, e.clientY);
    autoScroll();
  }

  function moveDrag(x, y) {
    drag.ghost.style.left = x + 'px';
    drag.ghost.style.top = y + 'px';
    drag.y = y;
    const hit = document.elementFromPoint(x, y);
    const day = hit && hit.closest('.day');
    if (day !== drag.over) {
      if (drag.over) drag.over.classList.remove('is-over');
      if (day) day.classList.add('is-over');
      drag.over = day;
    }
  }

  // Scroll the week while dragging near the top or just above the tray.
  function autoScroll() {
    if (!drag) return;
    const top = 110, bottom = window.innerHeight - 230;
    if (drag.y < top) window.scrollBy(0, -Math.ceil((top - drag.y) / 6));
    else if (drag.y > bottom) window.scrollBy(0, Math.ceil((drag.y - bottom) / 6));
    raf = requestAnimationFrame(autoScroll);
  }

  function finishDrag(dropped) {
    cancelAnimationFrame(raf);
    const d = drag;
    drag = null;
    d.ghost.remove();
    document.body.classList.remove('is-dragging');
    if (d.over) d.over.classList.remove('is-over');
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 350);
    const target = dropped && d.over ? Number(d.over.dataset.day) : null;
    const p = d.payload;
    if (p.kind === 'recipe') {
      if (target != null) { const r = App.getRecipe(p.recipeId); addMeal(target, r.id, r.servings); }
      return;
    }
    const f = findMeal(p.mealId);
    if (target == null || target === f.day) { App.refresh(); return; }
    App.plan(week)[f.day].splice(f.index, 1);
    App.plan(week)[target].push(f.meal);
    App.save();
    App.refresh();
    App.toast(`Moved to ${App.DAY_NAMES[target]}`, () => {
      const cur = findMeal(f.meal.id);
      App.plan(week)[cur.day].splice(cur.index, 1);
      App.plan(week)[f.day].splice(f.index, 0, f.meal);
      App.save(); App.refresh();
    });
  }
})();
