'use strict';
// Turning links and pasted text into recipes. Every path ends on an editable
// review screen; every failure explains itself and offers a manual fallback.
(() => {
  const UNI_FRAC = { '½': .5, '⅓': 1 / 3, '⅔': 2 / 3, '¼': .25, '¾': .75, '⅛': .125, '⅕': .2 };

  function parseQty(str) {
    if (str == null) return null;
    let s = String(str).trim().replace(',', '.');
    if (!s) return null;
    s = s.replace(/(\d)?\s*([½⅓⅔¼¾⅛⅕])/g, (_, d, f) => ' ' + ((d ? Number(d) : 0) + UNI_FRAC[f]));
    s = s.trim();
    let m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
    if (m) return Number(m[1]) + Number(m[2]) / Number(m[3]);
    m = s.match(/^(\d+)\/(\d+)$/);
    if (m) return Number(m[2]) ? Number(m[1]) / Number(m[2]) : null;
    const n = Number(s);
    return isFinite(n) && n >= 0 ? n : null;
  }

  const NUM = '(?:\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:[.,]\\d+)?)';
  const LEAD = new RegExp('^(' + NUM + ')\\s*(?:(?:-|–|to)\\s*' + NUM + ')?\\s*');
  const TRAIL = new RegExp('^(.*?)[\\s,:–-]+(' + NUM + ')\\s*([a-zA-Z]+)?\\.?\\s*$');
  const NO_QTY_OK = /to taste|to serve|pinch|optional|as needed|for frying|for greasing|to garnish|drizzle|splash|salt|pepper/i;

  function takeUnit(s) {
    const m = s.match(/^([a-zA-Z]+)\.?(?=[\s/(,]|$)/);
    if (!m) return { unit: '', rest: s };
    const info = App.unitInfo(m[1]);
    if (!App.UNITS.includes(info.u)) return { unit: '', rest: s };
    return { unit: info.u, rest: s.slice(m[0].length).trim() };
  }

  function parseIngredient(raw) {
    let s = String(raw).replace(/^[\s•●◦▪\-*–—·▢☐□✓✔️🔸🔹➡️👉]+/u, '').trim();
    s = s.replace(/^(\d+)[.)]\s+(?=\D)/, '');
    s = s.replace(/(\d)?\s*([½⅓⅔¼¾⅛⅕])/g, (_, d, f) => (d ? Number(d) : 0) + UNI_FRAC[f] + ' ').replace(/\s+/g, ' ').trim();
    // "2 x 400g tins chickpeas" -> 2 can chickpeas (400g)
    s = s.replace(/^(\d+)\s*x\s*(\d+\s*(?:g|ml))\s+(tins?|cans?|jars?)\s+(?:of\s+)?(.*)$/i, '$1 $3 $4 ($2)');
    let qty = null, unit = '', name = s, note = '';
    const lead = s.match(LEAD);
    if (lead && lead[1]) {
      qty = parseQty(lead[1]);
      // "1 (400g) can coconut milk": keep the pack size as a note
      const rest = s.slice(lead[0].length).replace(/^\(([^)]*)\)\s*/, (_, x) => { note = x; return ''; });
      const u = takeUnit(rest);
      unit = u.unit; name = u.rest;
    } else if (/^(a\s+)?(handful|pinch|bunch|sprig|splash|dash)s?\b/i.test(s)) {
      const m = s.match(/^(?:a\s+)?(\w+)\s*(?:of\s+)?(.*)$/i);
      const u = takeUnit(m[1]);
      qty = 1; unit = u.unit; name = u.unit ? m[2] : s;
    } else {
      const trail = s.match(TRAIL);
      if (trail && !/\d/.test(trail[1])) {
        const u = trail[3] ? takeUnit(trail[3]) : { unit: '', rest: '' };
        if (!trail[3] || u.unit) { qty = parseQty(trail[2]); unit = u.unit; name = trail[1]; }
      }
    }
    name = name
      .replace(/^\/\s*[\d.]+\s*(oz|lb|fl oz)\b\.?/i, '')
      .replace(/\(\s*[\d.\/]+\s*(oz|lb|fl oz|cups?)\s*\)/gi, '')
      .replace(/^of\s+/i, '')
      .replace(/\s+/g, ' ').trim().replace(/[,;:]$/, '');
    if (note) name += ' (' + note + ')';
    let flag = '';
    if (!name) flag = 'Name missing';
    else if (qty == null && !NO_QTY_OK.test(name)) flag = 'No quantity found';
    return { id: App.uid(), qty: qty == null ? '' : qty, unit, name, aisle: App.guessAisle(name, unit), flag };
  }

  // ---------- Pasted text (captions, notes, blog copy) ----------
  const strip = l => l.replace(/^[^\p{L}\p{N}]+/u, '').replace(/[^\p{L}\p{N})]+$/u, '');
  const ING_HEAD = /^(ingredients?|what you('| wi)?ll need|you('| wi)?ll need|you need|shopping list)$/i;
  const STEP_HEAD = /^(method|steps?|instructions?|directions?|how to( make( it)?)?|preparation|to make)$/i;
  const JUNK = /^(#\S+\s*)+$|link in (my )?bio|save (this|for later)|follow (me|@)|tag (a|someone)|^@\S+$|^(like|share|comment)\b/i;

  function minutesFrom(text) {
    let m = text.match(/(\d+)\s*(?:h|hr|hrs|hours?)\s*(?:(\d+)\s*(?:m|min|mins|minutes))?/i);
    if (m) return Number(m[1]) * 60 + Number(m[2] || 0);
    m = text.match(/(\d+)\s*(?:min|mins|minutes)\b/i);
    return m ? Number(m[1]) : '';
  }

  function parseRecipeText(text) {
    const lines = String(text).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const warnings = [];
    let title = '', servings = '', time = '';
    const ings = [], steps = [];
    let mode = '';

    for (const line of lines) {
      const clean = strip(line);
      if (!clean || JUNK.test(line)) continue;
      if (/^https?:\/\//.test(line)) continue;
      const serv = line.match(/\b(serves|servings?|makes|portions?|yield)\b\D{0,6}(\d+)/i);
      if (serv && line.length < 60) { servings = Number(serv[2]); if (!/ingredient/i.test(line)) continue; }
      const isTime = /\b(time|prep|cook|ready in|takes)\b/i.test(line) && line.length < 60 && minutesFrom(line);
      if (isTime && !time) time = minutesFrom(line);
      if (ING_HEAD.test(clean)) { mode = 'ing'; continue; }
      if (STEP_HEAD.test(clean)) { mode = 'step'; continue; }
      if (!title && !mode) {
        title = strip(clean.replace(/\(.*?\)|\s*#\S+/g, '')).replace(/\s{2,}/g, ' ').slice(0, 80);
        continue;
      }
      if (isTime) continue;

      const numbered = /^(step\s*\d+\s*[:.)-]?|\d+\s*[.)])\s*/i;
      const looksIng = /^[•●◦▪\-*–·▢☐□✓✔🔸🔹]/u.test(line) || new RegExp('^[\\d½⅓⅔¼¾⅛]').test(line) && line.length < 70 && !numbered.test(line);
      const looksStep = numbered.test(line) || line.length >= 70;

      if (mode === 'step' || (!mode && looksStep && !looksIng)) {
        steps.push(line.replace(numbered, '').replace(/\s*#\S+/g, '').trim());
      } else if (mode === 'ing' || looksIng) {
        ings.push(parseIngredient(line));
      } else if (!mode && ings.length && line.length < 50) {
        ings.push(parseIngredient(line));
      } else if (line.length > 25) {
        steps.push(line);
      }
    }

    if (!servings) warnings.push('No serving size found — we set ' + (App.state.prefs.defaultServings || 2) + '.');
    const flagged = ings.filter(i => i.flag).length;
    if (flagged) warnings.push(`${flagged} ingredient${flagged > 1 ? 's' : ''} need${flagged > 1 ? '' : 's'} a quick check.`);
    if (!steps.length) warnings.push('No method steps found — add them if you need them.');

    return {
      ok: ings.length > 0 || steps.length > 1,
      recipe: Object.assign(App.blankRecipe(), {
        title, time, servings: servings || App.state.prefs.defaultServings || 2, ingredients: ings, steps
      }),
      warnings
    };
  }

  // ---------- Links ----------
  class ImportError extends Error {
    constructor(code, message) { super(message); this.code = code; }
  }

  const BLOCKED = [
    [/(^|\.)instagram\.com$|(^|\.)instagr\.am$/, 'social', 'Instagram doesn’t let other apps read posts, so we can’t import it automatically.',
      'Open the post, copy the caption, then paste it here. We’ll keep the link as the source.'],
    [/(^|\.)tiktok\.com$/, 'social', 'TikTok doesn’t let other apps read videos or captions.',
      'Copy the caption (or type what you saw) and paste it here. We’ll keep the link as the source.'],
    [/(^|\.)facebook\.com$|(^|\.)fb\.watch$/, 'social', 'Facebook posts are private to Facebook, so we can’t read them.',
      'Copy the post text and paste it here.'],
    [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/, 'video', 'We can’t watch videos (yet).',
      'If the recipe is in the video description, copy and paste it here.'],
    [/(^|\.)pinterest\.[a-z.]+$|(^|\.)pin\.it$/, 'social', 'Pinterest pins only point to the real recipe.',
      'Open the pin, tap through to the original website and import that link instead.']
  ];

  const PROXIES = [
    u => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u),
    u => 'https://corsproxy.io/?url=' + encodeURIComponent(u)
  ];

  async function fetchText(url, ms) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), ms);
    try {
      const res = await fetch(url, { signal: ctl.signal });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.text();
    } finally { clearTimeout(t); }
  }

  const decode = s => {
    const d = new DOMParser().parseFromString('<!doctype html><body>' + String(s || ''), 'text/html');
    return (d.body.textContent || '').replace(/\s+/g, ' ').trim();
  };

  function findRecipeNode(node) {
    if (!node || typeof node !== 'object') return null;
    if (Array.isArray(node)) { for (const n of node) { const r = findRecipeNode(n); if (r) return r; } return null; }
    const type = node['@type'];
    if (type === 'Recipe' || (Array.isArray(type) && type.includes('Recipe'))) return node;
    return findRecipeNode(node['@graph']) || findRecipeNode(node.mainEntity) || null;
  }

  function isoMinutes(s) {
    const m = String(s || '').match(/P(?:\d+D)?T?(?:(\d+)H)?(?:(\d+)M)?/);
    return m && (m[1] || m[2]) ? Number(m[1] || 0) * 60 + Number(m[2] || 0) : '';
  }

  function flattenSteps(ins) {
    if (!ins) return [];
    if (typeof ins === 'string') return decode(ins).split(/(?<=\.)\s+(?=[A-Z])|\n+/).map(s => s.trim()).filter(Boolean);
    if (Array.isArray(ins)) return ins.flatMap(flattenSteps);
    if (ins.itemListElement) return flattenSteps(ins.itemListElement);
    if (ins.text) return [decode(ins.text)];
    if (ins.name) return [decode(ins.name)];
    return [];
  }

  function fromJsonLd(node, url) {
    const warnings = [];
    let img = node.image;
    if (Array.isArray(img)) img = img[0];
    if (img && typeof img === 'object') img = img.url || img.contentUrl;
    const yieldRaw = Array.isArray(node.recipeYield) ? node.recipeYield.join(' ') : String(node.recipeYield || '');
    const servings = Number((yieldRaw.match(/\d+/) || [])[0]) || '';
    const ings = (node.recipeIngredient || node.ingredients || []).map(s => parseIngredient(decode(s)));
    const steps = flattenSteps(node.recipeInstructions);
    if (!servings) warnings.push('No serving size found — we set ' + (App.state.prefs.defaultServings || 2) + '.');
    const flagged = ings.filter(i => i.flag).length;
    if (flagged) warnings.push(`${flagged} ingredient${flagged > 1 ? 's' : ''} need${flagged > 1 ? '' : 's'} a quick check.`);
    if (!steps.length) warnings.push('No method steps found on the page.');
    return {
      recipe: Object.assign(App.blankRecipe(), {
        title: decode(node.name).slice(0, 100), photo: typeof img === 'string' ? img : '',
        servings: servings || App.state.prefs.defaultServings || 2,
        time: isoMinutes(node.totalTime) || (isoMinutes(node.prepTime) || 0) + (isoMinutes(node.cookTime) || 0) || '',
        source: url, ingredients: ings, steps
      }),
      warnings
    };
  }

  function recipeFromHtml(html, url) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    for (const s of doc.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const node = findRecipeNode(JSON.parse(s.textContent));
        if (node && (node.recipeIngredient || node.recipeInstructions)) return fromJsonLd(node, url);
      } catch (e) { /* malformed JSON-LD: try the next block */ }
    }
    return null;
  }

  async function importUrl(input) {
    let url;
    try {
      url = new URL(/^https?:\/\//i.test(input.trim()) ? input.trim() : 'https://' + input.trim());
      if (!url.hostname.includes('.')) throw 0;
    } catch (e) {
      const err = new ImportError('invalid', 'That doesn’t look like a web link.');
      err.fix = 'Check it starts with https:// — or paste the recipe text instead.';
      throw err;
    }
    const host = url.hostname.replace(/^www\./, '');
    for (const [re, code, msg, fix] of BLOCKED) {
      if (re.test(host)) { const e = new ImportError(code, msg); e.fix = fix; throw e; }
    }
    let reached = false;
    for (const proxy of PROXIES) {
      try {
        const html = await fetchText(proxy(url.href), 9000);
        if (html.length < 200) continue;
        reached = true;
        const found = recipeFromHtml(html, url.href);
        if (found) return found;
      } catch (e) { /* try the next proxy */ }
    }
    const e = reached
      ? new ImportError('norecipe', 'We opened the page but couldn’t find a recipe on it.')
      : new ImportError('network', 'We couldn’t reach that page.');
    e.fix = reached
      ? 'Some sites hide recipes behind pop-ups or logins. Copy the ingredients and method from the page and paste them here.'
      : 'The site may be down or blocking apps. Copy the recipe from the page and paste it here — it takes 10 seconds.';
    throw e;
  }

  Object.assign(App, { parseQty, parseIngredient, parseRecipeText, importUrl, recipeFromHtml, ImportError });
})();
