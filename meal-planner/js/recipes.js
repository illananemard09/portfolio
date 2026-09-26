'use strict';
// Recipe library and recipe detail (with live portion scaling).
(() => {
  const { esc, icon, thumb } = App;
  let query = '';
  const viewServings = {}; // recipeId -> servings chosen on the detail screen

  function metaLine(r) {
    const bits = [];
    if (r.time) bits.push(`<span>${icon('clock')}${esc(r.time)} min</span>`);
    bits.push(`<span>${icon('users')}${esc(r.servings)} serves</span>`);
    if (r.price !== '' && r.price != null) bits.push(`<span>${icon('dollar')}${esc(App.money(r.price).slice(1))} est.</span>`);
    return `<div class="meta">${bits.join('')}</div>`;
  }

  function listHtml() {
    const q = query.trim().toLowerCase();
    const list = App.state.recipes.filter(r => !q ||
      r.title.toLowerCase().includes(q) || r.ingredients.some(i => i.name.toLowerCase().includes(q)));
    if (!App.state.recipes.length) {
      return `<div class="empty"><div class="big">📖</div><h2>No recipes yet</h2>
        <p>Save the dishes you actually cook — from a link, a caption, or your head.</p></div>`;
    }
    if (!list.length) return `<div class="empty"><p>Nothing matches “${esc(query)}”.</p></div>`;
    return list.map(r => `<a class="card recipe-row" href="#/recipe/${esc(r.id)}">
        ${thumb(r)}<div><h3>${esc(r.title || 'Untitled recipe')}</h3>${metaLine(r)}</div></a>`).join('');
  }

  App.screens.recipes = {
    render() {
      return {
        title: 'Recipes', tab: 'recipes',
        body: `<label class="search">${icon('search')}<span class="sr-only">Search recipes</span>
            <input type="search" placeholder="Search a dish or ingredient" value="${esc(query)}" data-input="search"></label>
          <div class="recipe-list" id="recipe-list">${listHtml()}</div>`,
        footer: `<a class="btn btn--primary btn--block" href="#/add">${icon('plus')} Add a recipe</a>`
      };
    },
    actions: {
      search(el) {
        query = el.value;
        document.getElementById('recipe-list').innerHTML = listHtml();
      }
    }
  };

  // ---------- Detail ----------
  function ingredientsHtml(r, servings) {
    const k = App.scale(r, servings);
    if (!r.ingredients.length) return '<p class="muted" style="padding:12px 16px;margin:0">No ingredients yet.</p>';
    return '<ul class="ing-list">' + r.ingredients.map(i => {
      const q = i.qty === '' || i.qty == null ? null : i.qty * k;
      return `<li><span class="amt">${esc(q == null ? '' : App.fmtAmount(q, i.unit))}</span><span>${esc(i.name)}</span></li>`;
    }).join('') + '</ul>';
  }

  App.screens.recipe = {
    render(id) {
      const r = App.getRecipe(id);
      if (!r) return { title: 'Not found', back: 'recipes', body: '<div class="empty"><p>This recipe no longer exists.</p></div>' };
      const s = viewServings[id] || r.servings;
      const price = r.price !== '' && r.price != null ? Number(r.price) * App.scale(r, s) : null;
      return {
        title: '', back: 'recipes',
        actions: `<button class="icon-btn" data-act="go" data-to="edit/${esc(id)}" aria-label="Edit recipe">
          <svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4z"/></svg></button>`,
        body: `${thumb(r, 'hero')}
          <div class="detail-head">
            <h2>${esc(r.title || 'Untitled recipe')}</h2>
            ${metaLine(r)}
            ${r.source ? `<div class="source">From <a href="${esc(r.source)}" target="_blank" rel="noopener">${esc(r.source.replace(/^https?:\/\/(www\.)?/, '').slice(0, 60))}</a></div>` : ''}
          </div>
          <div class="card stepper">
            <div class="stepper__label">Servings<small>${price != null ? `≈ ${App.money(price)} · ${App.money(price / s)} per serve` : 'Quantities update as you change this'}</small></div>
            <div class="stepper__ctrl">
              <button class="round-btn" data-act="serv" data-d="-1" aria-label="Fewer servings"${s <= 1 ? ' disabled' : ''}>${icon('minus')}</button>
              <output aria-live="polite">${s}</output>
              <button class="round-btn" data-act="serv" data-d="1" aria-label="More servings">${icon('plus')}</button>
            </div>
          </div>
          <h3 class="section-title">Ingredients <small>for ${s}</small></h3>
          <div class="card">${ingredientsHtml(r, s)}</div>
          <h3 class="section-title">Method</h3>
          ${r.steps.length ? `<ol class="step-list">${r.steps.map(t => `<li><span>${esc(t)}</span></li>`).join('')}</ol>` : '<p class="muted">No steps yet — tap the pencil to add them.</p>'}`,
        footer: `<button class="btn btn--primary btn--block" data-act="add-to-plan">${icon('cal')} Add to this week</button>`
      };
    },
    actions: {
      serv(el) {
        const id = App.route.params[0];
        const r = App.getRecipe(id);
        const s = Math.max(1, Math.min(24, (viewServings[id] || r.servings) + Number(el.dataset.d)));
        viewServings[id] = s;
        App.refresh();
      },
      'add-to-plan'() {
        const id = App.route.params[0];
        App.pickDay(id, viewServings[id] || App.getRecipe(id).servings);
      }
    }
  };

  // Bottom sheet: pick a day of the current week for a recipe. One tap, big targets.
  const DAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  App.DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  App.pickDay = (recipeId, servings) => {
    const r = App.getRecipe(recipeId);
    const week = App.currentWeek();
    const plan = App.plan(week);
    const dates = App.weekDates(week);
    App.openSheet(`<h2>Add to which day?</h2>
      <p class="sub">${esc(r.title)} · ${servings} serves</p>
      <div class="day-pick">${dates.map((d, i) => `<button class="btn" data-act="pick-day" data-i="${i}">
        ${DAY[i]} ${d.getDate()}<small>${plan[i].length ? plan[i].length + ' planned' : 'free'}</small></button>`).join('')}</div>`, {
      'pick-day'(el) {
        const i = Number(el.dataset.i);
        const meal = { id: App.uid(), recipeId, servings };
        App.plan(week)[i].push(meal);
        App.save();
        App.closeSheet();
        App.toast(`Added to ${App.DAY_NAMES[i]}`, () => {
          const day = App.plan(week)[i];
          day.splice(day.indexOf(meal), 1);
          App.save();
          App.refresh();
        });
        App.refresh();
      }
    });
  };
})();
