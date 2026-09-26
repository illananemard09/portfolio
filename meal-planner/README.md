# Mise — meal planning prototype

A mobile-first prototype that takes the "what are we eating this week?" load off young professionals in Australia. Plain HTML/CSS/JS, no build step, and everything is saved in the browser (`localStorage`).

## Run it

From the repo root (the fonts come from `../fonts`):

```bash
python3 -m http.server 8000
# open http://localhost:8000/meal-planner/
```

## Screens

| Route | Screen | What it does |
| --- | --- | --- |
| `#/plan` | Plan (home) | Mon–Sun view. Drag a recipe from the bottom tray onto a day, or tap it and pick the day. Drag planned meals between days by their handle. Tap a meal to change servings or remove it. Shows the meal count and estimated weekly cost. |
| `#/recipes` | Recipes | Library with search by dish or ingredient. |
| `#/recipe/:id` | Recipe detail | Servings stepper that rescales quantities and cost live, method, add to this week. |
| `#/add` | Add a recipe | **Link**, **Paste** or **Type it**. Every failure explains why and offers *Paste the text* / *Type it in*. |
| `#/review`, `#/edit/:id` | Review / edit | The same full editor for imports, new recipes and edits: photo, name, servings, time, estimated price, ingredients (qty, unit, aisle), reorderable steps, bulk-paste ingredients, delete. After an import, doubtful lines are flagged in amber. The draft survives a reload. |
| `#/shop` | Shopping list | Built from the week's plan: ingredients merged across recipes (g+kg and ml+L combined, fresh and tinned kept apart), grouped by aisle in store-walk order, ticked items drop to *In the trolley*, quick add ("2L milk" is parsed), copy-to-share, and the screen stays awake while shopping. |

## How import works

- **Links** are fetched through public CORS proxies and read from the page's schema.org `Recipe` data, which most recipe sites publish. Instagram, TikTok, Facebook, YouTube and Pinterest are detected up front, and each gets an honest explanation plus the paste fallback.
- **Pasted text** (captions, notes, blog copy) is parsed heuristically. It finds the title, "Serves 4", the time, the *Ingredients* / *Method* sections (or guesses them without headings), numbered steps, unicode fractions, `2 x 400g tins`, `Chicken thighs - 500g` and so on. Hashtags and "save this for later" lines are dropped.
- Australian measures: 1 tbsp = 20 ml and 1 cup = 250 ml. Aisles use Woolworths/Coles-style names.

## Out of scope for now

Live prices and online ordering (these need retailer partnerships). The price is a manual estimate per recipe, and it scales with servings.

## Code map

- `js/store.js`: data model, seed recipes, persistence, units, aisle guessing
- `js/ui.js`: hash router, layout, event delegation, bottom sheet, toast
- `js/recipes.js`: library, detail, day picker
- `js/import.js`: link and text parsing
- `js/editor.js`: add screen and editor
- `js/plan.js`: week view and pointer-based drag & drop
- `js/shop.js`: shopping list
