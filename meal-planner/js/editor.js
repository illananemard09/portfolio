'use strict';
// Add a recipe (link / paste / type) and the one editor used for reviewing
// imports, creating from scratch and editing any saved recipe.
(() => {
  const { esc, icon, thumb } = App;
  const DRAFT_KEY = 'mise.draft';

  // ---------- Add screen ----------
  const add = { mode: 'link', url: '', text: '', error: null, busy: false };

  function errorHtml() {
    const e = add.error;
    if (!e) return '';
    return `<div class="banner banner--error" role="alert">
      <strong>${icon('alert')} ${esc(e.message)}</strong>
      <p>${esc(e.fix || '')}</p>
      <div class="btn-row">
        ${add.mode !== 'paste' ? `<button class="btn btn--primary" data-act="fallback-paste">${icon('text')} Paste the text</button>` : ''}
        <button class="btn btn--ghost" data-act="fallback-manual">${icon('pen')} Type it in</button>
      </div></div>`;
  }

  App.screens.add = {
    render() {
      const tabs = [['link', 'link', 'Link'], ['paste', 'text', 'Paste'], ['manual', 'pen', 'Type it']];
      let body = `<div class="segmented" role="tablist">${tabs.map(([id, ic, label]) =>
        `<button role="tab" aria-selected="${add.mode === id}" class="${add.mode === id ? 'is-on' : ''}" data-act="mode" data-mode="${id}">${icon(ic)}${label}</button>`).join('')}</div>`;
      body += errorHtml();
      let footer = '';
      if (add.mode === 'link') {
        body += `<label class="field"><span>Recipe link</span>
            <input class="input" type="url" inputmode="url" autocomplete="off" placeholder="https://www.taste.com.au/recipes/…" value="${esc(add.url)}" data-input="url"></label>
          <p class="hint">Works best with recipe websites (taste.com.au, RecipeTin Eats, BBC Good Food…). For Instagram, TikTok or videos, use <b>Paste</b>.</p>`;
        footer = `<button class="btn btn--primary btn--block" data-act="import-link"${add.busy ? ' disabled' : ''}>${add.busy ? 'Reading the page…' : 'Import recipe'}</button>`;
      } else if (add.mode === 'paste') {
        body += `<label class="field"><span>Paste the recipe <small>— caption, notes, message…</small></span>
            <textarea class="textarea" rows="11" data-input="text" placeholder="Creamy tuscan chicken 🍗\nServes 2\n\nIngredients\n- 2 chicken breasts\n- 1 cup cream\n- 2 cloves garlic\n\nMethod\n1. Sear the chicken…">${esc(add.text)}</textarea></label>
          <p class="hint">We’ll pull out the title, servings, ingredients and steps. You can fix anything on the next screen.</p>`;
        footer = `<button class="btn btn--primary btn--block" data-act="import-text">Read recipe</button>`;
      } else {
        body += `<div class="empty"><div class="big">✍️</div><h2>Start from scratch</h2>
          <p>Add a title, ingredients and steps at your own pace. Everything stays editable later.</p></div>`;
        footer = `<button class="btn btn--primary btn--block" data-act="fallback-manual">Start typing</button>`;
      }
      return { title: 'Add a recipe', back: 'recipes', body, footer };
    },
    mount(root) {
      const f = root.querySelector('[data-input="url"], [data-input="text"]');
      if (f && !add.error && !f.value) f.focus();
    },
    actions: {
      mode(el) { add.mode = el.dataset.mode; add.error = null; App.refresh(); },
      url(el) { add.url = el.value; },
      text(el) { add.text = el.value; },
      async 'import-link'() {
        if (!add.url.trim()) { App.toast('Paste a link first'); return; }
        add.busy = true; add.error = null; App.refresh();
        try {
          const { recipe, warnings } = await App.importUrl(add.url);
          add.busy = false;
          startDraft(recipe, 'import', warnings);
          add.url = '';
          App.go('review');
        } catch (e) {
          add.busy = false;
          add.error = e instanceof App.ImportError ? e : { message: 'Something went wrong while importing.', fix: 'Paste the recipe text or type it in instead.' };
          App.refresh();
        }
      },
      'import-text'() {
        if (add.text.trim().length < 10) { App.toast('Paste a bit more of the recipe first'); return; }
        const { ok, recipe, warnings } = App.parseRecipeText(add.text);
        if (!ok) {
          add.error = { message: 'We couldn’t spot ingredients or steps in that text.',
            fix: 'Try putting each ingredient on its own line — or type it in, we’ll keep your text as the first step.' };
          App.refresh();
          return;
        }
        if (/^https?:\/\//.test(add.url.trim())) recipe.source = add.url.trim();
        startDraft(recipe, 'import', warnings);
        add.text = ''; add.url = '';
        App.go('review');
      },
      'fallback-paste'() { add.mode = 'paste'; add.error = null; App.refresh(); },
      'fallback-manual'() {
        const r = App.blankRecipe();
        if (/^https?:\/\//.test(add.url.trim()) || /\./.test(add.url)) r.source = add.url.trim();
        if (add.mode === 'paste' && add.text.trim()) {
          const lines = add.text.split(/\n/).map(s => s.trim()).filter(Boolean);
          r.title = (lines[0] || '').slice(0, 80);
          r.steps = [lines.slice(1).join('\n')].filter(Boolean);
        }
        add.error = null; add.url = ''; add.text = '';
        startDraft(r, 'new', []);
        App.go('review');
      }
    }
  };

  // ---------- Editor ----------
  // The draft survives reloads so nothing typed on the bus is lost.
  let draft = null; // { recipe, origin: 'import'|'new'|'edit', warnings }

  function startDraft(recipe, origin, warnings) {
    for (const i of recipe.ingredients) i.aisleAuto = true;
    draft = { recipe, origin, warnings: warnings || [] };
    persistDraft();
  }
  function persistDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch (e) { /* draft is a convenience */ }
  }
  function loadDraft() {
    if (draft) return draft;
    try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch (e) { draft = null; }
    return draft;
  }
  function clearDraft() {
    draft = null;
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ }
  }

  const unitOptions = u => ['', ...App.UNITS, ...(u && !App.UNITS.includes(u) ? [u] : [])]
    .map(x => `<option value="${esc(x)}"${x === u ? ' selected' : ''}>${x ? esc(x) : '—'}</option>`).join('');
  const aisleOptions = a => App.AISLES.map(x => `<option${x === a ? ' selected' : ''}>${esc(x)}</option>`).join('');

  function ingRow(i, idx) {
    return `<div class="ing-row${i.flag ? ' is-flag' : ''}" data-id="${esc(i.id)}">
      <div class="ing-row__top">
        <input class="input" placeholder="Ingredient" aria-label="Ingredient name" value="${esc(i.name)}" data-input="ing-name" data-change="ing-name-done">
        <button class="mini-btn" data-act="ing-del" aria-label="Remove ingredient">${icon('x')}</button>
      </div>
      <div class="ing-row__bottom">
        <input class="input" inputmode="decimal" placeholder="Qty" aria-label="Quantity" value="${esc(i.qty === '' ? '' : App.fmtQty(i.qty, i.unit).replace(/^(\d)([½⅓⅔¼¾⅛])/, '$1 $2'))}" data-change="ing-qty">
        <select class="select" aria-label="Unit" data-change="ing-unit">${unitOptions(i.unit)}</select>
        <select class="select" aria-label="Aisle" data-change="ing-aisle">${aisleOptions(i.aisle)}</select>
      </div>
      ${i.flag ? `<div class="ing-row__flag">${icon('alert')} ${esc(i.flag)}</div>` : ''}
    </div>`;
  }

  function stepRow(t, idx, n) {
    return `<div class="step-row" data-idx="${idx}">
      <span class="step-row__n">${idx + 1}</span>
      <textarea class="textarea" rows="2" aria-label="Step ${idx + 1}" data-input="step">${esc(t)}</textarea>
      <div class="step-row__tools">
        <button class="mini-btn" data-act="step-move" data-d="-1" aria-label="Move up"${idx === 0 ? ' disabled' : ''}>${icon('up')}</button>
        <button class="mini-btn" data-act="step-move" data-d="1" aria-label="Move down"${idx === n - 1 ? ' disabled' : ''}>${icon('down')}</button>
        <button class="mini-btn" data-act="step-del" aria-label="Delete step">${icon('trash')}</button>
      </div></div>`;
  }

  function editorView(mode) {
    const d = loadDraft();
    if (!d) return { title: 'Nothing to edit', back: 'recipes', body: '<div class="empty"><p>Start from Recipes → Add a recipe.</p></div>' };
    const r = d.recipe;
    const isNew = !App.getRecipe(r.id);
    const flagged = r.ingredients.filter(i => i.flag).length;
    let banner = '';
    if (d.origin === 'import') {
      banner = d.warnings.length
        ? `<div class="banner banner--warn">${icon('alert')}<div><strong>Check what we found</strong>
            <p>${d.warnings.map(esc).join('<br>')}</p></div></div>`
        : `<div class="banner banner--ok">${icon('check')}<div><strong>Imported — have a quick look</strong>
            <p>Everything below is editable before you save.</p></div></div>`;
    }
    const body = `${banner}
      <label class="photo-pick">
        ${thumb(r)}
        <input type="file" accept="image/*" data-change="photo" aria-label="Choose a photo">
        <span class="photo-pick__btn">
          ${r.photo ? `<button type="button" class="btn btn--sm" data-act="photo-del">${icon('trash')} Remove</button>` : ''}
          <span class="btn btn--sm">${icon('camera')} ${r.photo ? 'Change' : 'Add'} photo</span>
        </span>
      </label>
      <label class="field"><span>Recipe name</span>
        <input class="input" placeholder="e.g. Mum’s spag bol" value="${esc(r.title)}" data-input="field" data-k="title"></label>
      <div class="grid-3">
        <label class="field"><span>Serves</span><input class="input" inputmode="numeric" value="${esc(r.servings)}" data-input="field" data-k="servings" data-num="1"></label>
        <label class="field"><span>Minutes</span><input class="input" inputmode="numeric" placeholder="–" value="${esc(r.time)}" data-input="field" data-k="time" data-num="1"></label>
        <label class="field"><span>Est. price $</span><input class="input" inputmode="decimal" placeholder="0.00" value="${esc(r.price)}" data-input="field" data-k="price" data-num="1"></label>
      </div>
      <p class="hint">Price is your own estimate for the whole recipe — it scales with servings.</p>

      <h3 class="section-title">Ingredients <small>${r.ingredients.length} ${flagged ? `· <span style="color:var(--warn)">${flagged} to check</span>` : ''}</small></h3>
      <div class="ing-edit" id="ing-edit">${r.ingredients.map(ingRow).join('')}</div>
      <div class="btn-row add-line">
        <button class="btn btn--ghost" data-act="ing-add">${icon('plus')} Ingredient</button>
        <button class="btn btn--ghost" data-act="ing-bulk">${icon('text')} Paste list</button>
      </div>

      <h3 class="section-title">Method <small>${r.steps.length} steps</small></h3>
      <div class="step-edit">${r.steps.map((t, i) => stepRow(t, i, r.steps.length)).join('')}</div>
      <button class="btn btn--ghost btn--block add-line" data-act="step-add">${icon('plus')} Add a step</button>

      <label class="field" style="margin-top:22px"><span>Source link <small>(optional)</small></span>
        <input class="input" type="url" placeholder="https://" value="${esc(r.source)}" data-input="field" data-k="source"></label>
      ${!isNew ? `<button class="btn btn--danger btn--block" data-act="delete" style="margin-top:12px">${icon('trash')} Delete recipe</button>` : ''}`;
    return {
      title: mode === 'review' ? (d.origin === 'import' ? 'Review import' : 'New recipe') : 'Edit recipe',
      back: isNew ? 'add' : 'recipe/' + r.id,
      keepScroll: false,
      body,
      footer: `<button class="btn btn--primary btn--block" data-act="save">${icon('check')} ${isNew ? 'Save recipe' : 'Save changes'}</button>`
    };
  }

  const ingById = el => draft.recipe.ingredients.find(i => i.id === el.closest('.ing-row').dataset.id);
  const clearFlag = el => {
    const i = ingById(el);
    if (i.flag) { i.flag = ''; el.closest('.ing-row').classList.remove('is-flag'); el.closest('.ing-row').querySelector('.ing-row__flag')?.remove(); }
  };

  // Downscale photos so they fit comfortably in local storage.
  function readPhoto(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const max = 900, k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(img.src);
        resolve(c.toDataURL('image/jpeg', 0.78));
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  const editorActions = {
    field(el) {
      const k = el.dataset.k;
      draft.recipe[k] = el.dataset.num ? (el.value.trim() === '' ? '' : Number(el.value.replace(',', '.')) || 0) : el.value;
      persistDraft();
    },
    async photo(el) {
      const f = el.files && el.files[0];
      if (!f) return;
      try { draft.recipe.photo = await readPhoto(f); persistDraft(); App.refresh(); } catch (e) { App.toast('That photo couldn’t be read. Try another one.'); }
    },
    'photo-del'(el, e) { e.preventDefault(); draft.recipe.photo = ''; persistDraft(); App.refresh(); },
    'ing-qty'(el) {
      const i = ingById(el);
      const q = App.parseQty(el.value);
      i.qty = q == null ? '' : q;
      if (q == null && el.value.trim()) App.toast('Use numbers like 2, 1.5 or 1/2');
      if (q != null) clearFlag(el);
      persistDraft();
    },
    'ing-unit'(el) { ingById(el).unit = el.value; persistDraft(); },
    'ing-name'(el) { ingById(el).name = el.value; persistDraft(); },
    'ing-name-done'(el) {
      const i = ingById(el);
      if (i.aisleAuto) { i.aisle = App.guessAisle(i.name, i.unit); el.closest('.ing-row').querySelector('[data-change="ing-aisle"]').value = i.aisle; }
      if (i.name.trim()) clearFlag(el);
      persistDraft();
    },
    'ing-aisle'(el) { const i = ingById(el); i.aisle = el.value; i.aisleAuto = false; persistDraft(); },
    'ing-del'(el) {
      const r = draft.recipe, i = ingById(el), idx = r.ingredients.indexOf(i);
      r.ingredients.splice(idx, 1); persistDraft(); App.refresh();
      App.toast(`Removed ${i.name || 'ingredient'}`, () => { r.ingredients.splice(idx, 0, i); persistDraft(); App.refresh(); });
    },
    'ing-add'() {
      const i = { id: App.uid(), qty: '', unit: '', name: '', aisle: 'Other', aisleAuto: true };
      draft.recipe.ingredients.push(i); persistDraft(); App.refresh();
      document.querySelector(`.ing-row[data-id="${i.id}"] input`).focus();
    },
    'ing-bulk'() {
      App.openSheet(`<h2>Paste a list</h2><p class="sub">One ingredient per line — “200g feta”, “2 tbsp olive oil”, “Salt to taste”.</p>
        <textarea class="textarea" rows="8" id="bulk" autofocus></textarea>
        <button class="btn btn--primary btn--block" data-act="bulk-add" style="margin-top:12px">Add ingredients</button>`, {
        'bulk-add'() {
          const lines = document.getElementById('bulk').value.split('\n').map(s => s.trim()).filter(Boolean);
          const parsed = lines.map(l => Object.assign(App.parseIngredient(l), { aisleAuto: true }));
          draft.recipe.ingredients.push(...parsed); persistDraft();
          App.closeSheet(); App.refresh();
          App.toast(`Added ${parsed.length} ingredient${parsed.length === 1 ? '' : 's'}`);
        }
      });
    },
    step(el) { draft.recipe.steps[Number(el.closest('.step-row').dataset.idx)] = el.value; persistDraft(); },
    'step-add'() {
      draft.recipe.steps.push(''); persistDraft(); App.refresh();
      const all = document.querySelectorAll('.step-row textarea'); all[all.length - 1].focus();
    },
    'step-move'(el) {
      const s = draft.recipe.steps, i = Number(el.closest('.step-row').dataset.idx), j = i + Number(el.dataset.d);
      [s[i], s[j]] = [s[j], s[i]]; persistDraft(); App.refresh();
    },
    'step-del'(el) {
      const s = draft.recipe.steps, i = Number(el.closest('.step-row').dataset.idx), t = s[i];
      s.splice(i, 1); persistDraft(); App.refresh();
      if (t.trim()) App.toast('Step deleted', () => { s.splice(i, 0, t); persistDraft(); App.refresh(); });
    },
    save() {
      const r = draft.recipe;
      if (!r.title.trim()) {
        App.toast('Give your recipe a name');
        const f = document.querySelector('[data-k="title"]'); f.focus(); f.scrollIntoView({ block: 'center' });
        return;
      }
      r.title = r.title.trim();
      r.servings = Math.max(1, Math.round(Number(r.servings) || App.state.prefs.defaultServings || 2));
      r.ingredients = r.ingredients.filter(i => i.name.trim()).map(({ aisleAuto, flag, ...i }) => i);
      r.steps = r.steps.map(s => s.trim()).filter(Boolean);
      const isNew = !App.getRecipe(r.id);
      App.upsertRecipe(r);
      clearDraft();
      App.toast(isNew ? 'Recipe saved' : 'Changes saved');
      history.replaceState(null, '', '#/recipe/' + r.id);
      App.render();
    },
    delete() {
      const r = App.getRecipe(draft.recipe.id);
      App.openSheet(`<h2>Delete “${esc(r.title)}”?</h2><p class="sub">It will also be removed from your meal plans.</p>
        <div class="btn-row"><button class="btn" data-act="sheet-close">Keep it</button>
        <button class="btn btn--primary" data-act="confirm-del">Delete</button></div>`, {
        'confirm-del'() {
          App.deleteRecipe(r.id); clearDraft(); App.closeSheet();
          App.toast('Recipe deleted'); App.go('recipes');
        }
      });
    }
  };

  App.screens.review = { render: () => editorView('review'), actions: editorActions };
  App.screens.edit = {
    render(id) {
      const r = App.getRecipe(id);
      if (r && (!loadDraft() || draft.recipe.id !== id)) startDraft(JSON.parse(JSON.stringify(r)), 'edit', []);
      return editorView('edit');
    },
    actions: editorActions
  };
})();
