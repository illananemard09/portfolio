'use strict';
// Data model, persistence, units and quantity maths.
window.App = window.App || {};

(() => {
  const KEY = 'mise.v1';

  // Store-walk order, Australian supermarket style.
  const AISLES = ['Fruit & Veg', 'Meat & Seafood', 'Deli & Dairy', 'Bakery', 'Pantry',
    'Herbs & Spices', 'Frozen', 'Drinks', 'Household', 'Other'];

  const AISLE_WORDS = {
    'Fruit & Veg': 'apple banana lemon lime orange avocado tomato cherry onion shallot spring garlic ginger potato sweet kumara pumpkin carrot celery capsicum pepper chilli zucchini eggplant broccoli broccolini cauliflower spinach kale lettuce rocket cos cabbage bok choy pak choy mushroom corn pea bean sprout cucumber beetroot leek asparagus berry strawberry blueberry mango pineapple coriander parsley basil mint dill thyme rosemary herb salad snow radish fennel',
    'Meat & Seafood': 'chicken beef mince lamb pork bacon sausage steak thigh breast fillet salmon prawn fish tuna barramundi snapper chorizo turkey ham duck',
    'Deli & Dairy': 'milk butter cheese cheddar feta parmesan mozzarella haloumi ricotta cream yoghurt yogurt egg eggs tofu hummus gnocchi tortilla wrap pesto',
    'Bakery': 'bread roll bun sourdough baguette pita naan brioche',
    'Pantry': 'rice pasta spaghetti penne noodle flour sugar honey oil olive vinegar soy sauce stock tinned canned tin can coconut chickpea lentil kidney tomato paste passata oats peanut nut almond cashew sesame mayo mustard ketchup sriracha fish curry tahini maple cornflour breadcrumb quinoa couscous stock cube',
    'Herbs & Spices': 'salt pepper cumin paprika turmeric cinnamon oregano chilli flakes garam masala spice seasoning coriander ground nutmeg cardamom',
    'Frozen': 'frozen ice',
    'Drinks': 'juice water soda wine beer coffee tea',
    'Household': 'foil paper towel detergent soap sponge bag'
  };

  // Words that decide the aisle before the generic dictionary (e.g. "tinned tomatoes").
  const AISLE_OVERRIDES = [
    [/\b(tinned|canned|can|tin)\b|passata|paste|stock|sauce|oil/, 'Pantry'],
    [/\bground\b|\bdried\b|flakes|powder|masala|seasoning|\bsalt\b|black pepper/, 'Herbs & Spices'],
    [/\bfrozen\b/, 'Frozen']
  ];

  function guessAisle(name, unit) {
    if (/^(can|tin|jar)s?$/i.test(unit || '')) return 'Pantry';
    const n = ' ' + String(name || '').toLowerCase() + ' ';
    for (const [re, aisle] of AISLE_OVERRIDES) if (re.test(n)) return aisle;
    let best = 'Other', bestLen = 0;
    for (const aisle of Object.keys(AISLE_WORDS)) {
      for (const w of AISLE_WORDS[aisle].split(' ')) {
        if (w.length > bestLen && new RegExp('\\b' + w + '(e?s)?\\b').test(n)) { best = aisle; bestLen = w.length; }
      }
    }
    return best;
  }

  // Units. Australian measures: tbsp = 20 ml, cup = 250 ml.
  const UNIT_DEFS = [
    ['g', 'mass', 1, ['g', 'gram', 'grams', 'gr']],
    ['kg', 'mass', 1000, ['kg', 'kilo', 'kilos', 'kilogram', 'kilograms']],
    ['ml', 'vol', 1, ['ml', 'millilitre', 'millilitres', 'milliliter', 'milliliters']],
    ['L', 'vol', 1000, ['l', 'litre', 'litres', 'liter', 'liters']],
    ['tsp', 'vol', 5, ['tsp', 'teaspoon', 'teaspoons', 't']],
    ['tbsp', 'vol', 20, ['tbsp', 'tablespoon', 'tablespoons', 'tbs', 'tbl', 'T']],
    ['cup', 'vol', 250, ['cup', 'cups', 'c']],
    ['clove', null, 1, ['clove', 'cloves']],
    ['can', null, 1, ['can', 'cans', 'tin', 'tins']],
    ['bunch', null, 1, ['bunch', 'bunches']],
    ['pinch', null, 1, ['pinch', 'pinches']],
    ['handful', null, 1, ['handful', 'handfuls']],
    ['slice', null, 1, ['slice', 'slices']],
    ['pack', null, 1, ['pack', 'packs', 'packet', 'packets', 'pkt']],
    ['jar', null, 1, ['jar', 'jars']],
    ['sprig', null, 1, ['sprig', 'sprigs']],
    ['stalk', null, 1, ['stalk', 'stalks', 'stick', 'sticks']],
    ['head', null, 1, ['head', 'heads']],
    ['sheet', null, 1, ['sheet', 'sheets']]
  ];
  const UNIT_ALIAS = {};
  for (const [u, fam, f, aliases] of UNIT_DEFS) for (const a of aliases) UNIT_ALIAS[a] = { u, fam: fam || 'n:' + u, f };
  const UNITS = UNIT_DEFS.map(d => d[0]);

  function unitInfo(unit) {
    if (!unit) return { u: '', fam: 'n:', f: 1 };
    return UNIT_ALIAS[unit] || UNIT_ALIAS[unit.toLowerCase()] || { u: unit, fam: 'n:' + unit.toLowerCase(), f: 1 };
  }

  const FRACTIONS = [[0.125, '⅛'], [0.25, '¼'], [1 / 3, '⅓'], [0.5, '½'], [2 / 3, '⅔'], [0.75, '¾']];

  function fmtQty(q, unit) {
    if (q == null || q === '' || isNaN(q)) return '';
    const u = unitInfo(unit);
    if ((u.fam === 'mass' || u.fam === 'vol') && u.f === 1) {
      if (q >= 100) return String(Math.round(q / 5) * 5);
      return String(Math.round(q));
    }
    const whole = Math.floor(q), frac = q - whole;
    if (frac < 0.06) return String(whole || (q > 0 ? '¼' : '0'));
    if (frac > 0.94) return String(whole + 1);
    for (const [v, s] of FRACTIONS) if (Math.abs(frac - v) < 0.06) return (whole ? whole : '') + s;
    return String(Math.round(q * 10) / 10);
  }

  function fmtAmount(q, unit) {
    const n = fmtQty(q, unit);
    if (!unit) return n;
    const plural = q > 1 && !['g', 'kg', 'ml', 'L', 'tsp', 'tbsp'].includes(unit) && !/s$/.test(unit);
    return (n ? n + ' ' : '') + unit + (plural ? (unit === 'bunch' || unit === 'pinch' ? 'es' : 's') : '');
  }

  function money(n) {
    if (n == null || n === '' || isNaN(n)) return '';
    return '$' + Number(n).toFixed(2);
  }

  // Name normalisation for merging "2 tomatoes" and "1 tomato, diced".
  const NOISE = /\b(fresh|freshly|finely|roughly|thinly|chopped|diced|sliced|minced|grated|crushed|peeled|large|small|medium|ripe|to serve|optional|about|approx\.?|plus extra|extra)\b/g;
  function singular(w) {
    if (/ies$/.test(w)) return w.slice(0, -3) + 'y';
    if (/(tomato|potato)es$/.test(w)) return w.slice(0, -2);
    if (/(ch|sh|x)es$/.test(w)) return w.slice(0, -2);
    if (/[^s]s$/.test(w) && w.length > 3) return w.slice(0, -1);
    return w;
  }
  function nameKey(name) {
    return String(name || '').toLowerCase()
      .replace(/\(.*?\)/g, ' ').split(',')[0]
      .replace(NOISE, ' ').replace(/[^a-z0-9 &'-]/g, ' ')
      .split(/\s+/).filter(Boolean).map(singular).join(' ').trim();
  }

  const uid = () => Math.random().toString(36).slice(2, 10);

  // Week keys are the Monday of the week, local time, as YYYY-MM-DD.
  function mondayOf(d) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    return x;
  }
  function isoDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function weekDates(key) {
    const [y, m, dd] = key.split('-').map(Number);
    return Array.from({ length: 7 }, (_, i) => new Date(y, m - 1, dd + i));
  }

  // ---------- Persistence ----------
  let state;
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) state = JSON.parse(raw);
    } catch (e) { state = null; }
    if (!state || state.v !== 1) state = seed();
    return state;
  }
  let saveTimer;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 150);
  }
  function saveNow() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      App.toast && App.toast('Couldn’t save on this device — storage may be full. Try a smaller photo.');
      return false;
    }
  }
  function reset() {
    state = seed();
    saveNow();
  }

  function ing(qty, unit, name, aisle) {
    return { id: uid(), qty, unit, name, aisle: aisle || guessAisle(name, unit) };
  }

  function seed() {
    const week = isoDate(mondayOf(new Date()));
    const r = [
      {
        id: 'r-stirfry', title: 'Honey soy chicken stir-fry', emoji: '🥢', hue: 24,
        servings: 2, time: 25, price: 14.5, source: '',
        ingredients: [
          ing(400, 'g', 'chicken thigh fillets, sliced'),
          ing(1, '', 'red capsicum, sliced'),
          ing(1, 'head', 'broccoli, in florets'),
          ing(2, 'clove', 'garlic, crushed'),
          ing(2, 'tbsp', 'soy sauce'),
          ing(1, 'tbsp', 'honey'),
          ing(1, 'tbsp', 'vegetable oil'),
          ing(1, 'cup', 'jasmine rice')
        ],
        steps: [
          'Cook the rice following the packet instructions.',
          'Heat the oil in a wok over high heat. Stir-fry the chicken for 5–6 minutes until golden.',
          'Add the capsicum, broccoli and garlic and toss for 3 minutes.',
          'Stir through the soy sauce and honey, cook 1 minute until glossy. Serve over rice.'
        ]
      },
      {
        id: 'r-tacos', title: 'Weeknight beef tacos', emoji: '🌮', hue: 42,
        servings: 2, time: 20, price: 16,
        ingredients: [
          ing(250, 'g', 'beef mince'),
          ing(1, 'pack', 'taco seasoning', 'Herbs & Spices'),
          ing(6, '', 'small flour tortillas', 'Deli & Dairy'),
          ing(1, '', 'avocado'),
          ing(2, '', 'tomatoes, diced'),
          ing(0.5, '', 'red onion, finely chopped'),
          ing(50, 'g', 'cheddar, grated'),
          ing(1, 'bunch', 'coriander')
        ],
        steps: [
          'Brown the mince in a hot pan, breaking it up, about 5 minutes.',
          'Add the taco seasoning and 1/4 cup water, simmer 3 minutes.',
          'Mash the avocado; mix the tomato, onion and half the coriander.',
          'Warm the tortillas and fill with mince, salsa, avocado and cheese.'
        ]
      },
      {
        id: 'r-gnocchi', title: 'One-pan pesto gnocchi', emoji: '🌿', hue: 110,
        servings: 2, time: 15, price: 11,
        ingredients: [
          ing(500, 'g', 'potato gnocchi', 'Deli & Dairy'),
          ing(3, 'tbsp', 'basil pesto', 'Deli & Dairy'),
          ing(250, 'g', 'cherry tomatoes'),
          ing(60, 'g', 'baby spinach'),
          ing(30, 'g', 'parmesan, grated'),
          ing(1, 'tbsp', 'olive oil')
        ],
        steps: [
          'Pan-fry the gnocchi in the oil over medium-high heat for 6–8 minutes until crisp.',
          'Add the tomatoes and cook until they start to burst.',
          'Stir through the spinach and pesto until wilted. Top with parmesan.'
        ]
      },
      {
        id: 'r-curry', title: 'Chickpea & spinach curry', emoji: '🍛', hue: 36,
        servings: 4, time: 30, price: 12,
        ingredients: [
          ing(1, '', 'brown onion, diced'),
          ing(3, 'clove', 'garlic'),
          ing(2, 'tbsp', 'curry paste', 'Pantry'),
          ing(2, 'can', 'chickpeas, drained'),
          ing(1, 'can', 'coconut milk'),
          ing(1, 'can', 'diced tomatoes'),
          ing(120, 'g', 'baby spinach'),
          ing(1, 'cup', 'jasmine rice')
        ],
        steps: [
          'Soften the onion in a little oil for 5 minutes, add the garlic and curry paste for 1 minute.',
          'Add the chickpeas, coconut milk and tomatoes. Simmer 15 minutes.',
          'Stir through the spinach. Serve with rice — leftovers make great lunches.'
        ]
      }
    ];
    return {
      v: 1,
      recipes: r,
      plans: {
        [week]: [
          [{ id: uid(), recipeId: 'r-stirfry', servings: 2 }], [], [{ id: uid(), recipeId: 'r-curry', servings: 4 }], [], [], [], []
        ]
      },
      shop: {},
      prefs: { defaultServings: 2 }
    };
  }

  // ---------- Recipes ----------
  function getRecipe(id) { return state.recipes.find(r => r.id === id); }
  function upsertRecipe(recipe) {
    const i = state.recipes.findIndex(r => r.id === recipe.id);
    if (i >= 0) state.recipes[i] = recipe; else state.recipes.unshift(recipe);
    save();
  }
  function deleteRecipe(id) {
    state.recipes = state.recipes.filter(r => r.id !== id);
    for (const k of Object.keys(state.plans)) state.plans[k] = state.plans[k].map(day => day.filter(m => m.recipeId !== id));
    save();
  }
  function blankRecipe() {
    return {
      id: 'r-' + uid(), title: '', emoji: '🍽️', hue: Math.floor(Math.random() * 360), photo: '',
      servings: state.prefs.defaultServings || 2, time: '', price: '', source: '',
      ingredients: [], steps: []
    };
  }
  function scale(recipe, servings) {
    const base = Number(recipe.servings) || 1;
    return (Number(servings) || base) / base;
  }

  // ---------- Plans ----------
  function plan(week) {
    if (!state.plans[week]) state.plans[week] = [[], [], [], [], [], [], []];
    return state.plans[week];
  }

  Object.assign(App, {
    AISLES, UNITS, guessAisle, unitInfo, fmtQty, fmtAmount, money, nameKey, uid,
    mondayOf, isoDate, weekDates, load, save, saveNow, reset,
    getRecipe, upsertRecipe, deleteRecipe, blankRecipe, scale, plan
  });
  Object.defineProperty(App, 'state', { get: () => state });
})();
