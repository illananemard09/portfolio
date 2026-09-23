# Illana Nemard — Ideas into experiences

An immersive portfolio for a Marketing, Communications & Event Manager.
It's an editorial site with a story arc (discover, explore, understand, interact, remember, connect) that ends at a first-person café table. Every object on the table is clickable, and the MacBook opens into a working desktop.

**Stack:** Next.js 16 (static export) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Lenis smooth scroll.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
npm run lint     # type-check
```

## Structure

```
app/                  layout (fonts, SEO, JSON-LD), page, robots, sitemap, icon
content/site.ts       ← all copy: projects, roles, skills, notebook pages…
components/
  Nav, Loader         sticky nav with a Melbourne clock + animated mobile menu, intro loader
  sections/           Hero, About, Work (+ case-study overlay), Events, Marketing,
                      Experience, Toolkit, Process, BehindScenes, Beyond
  cafe/               Finale transition, CafeScene, desk objects, notebook
  cafe/os/            the laptop: Desktop (window manager + dock), Window,
                      Safari (+ pages), Mail, Notes, Calendar, Files
  ui/                 SmoothScroll, Cursor, Magnetic, Reveal, Counter, Plate
```

## The experience

| Section | Interaction |
| --- | --- |
| Hero | Letter-by-letter reveal. Letters get heavier near the cursor, the spotlight follows the pointer, and the layers move in parallax. Magnetic CTAs, a ticket and a rotating stamp. |
| About | Equation reveal, clickable keywords, a timeline you can scrub by year |
| Selected work | Cursor-following image previews. Each case study opens from the row you clicked, runs full screen through Challenge → Strategy → Idea → Execution → Result, and moves on with *Next case*. |
| Events | A pinned, scroll-driven journey (Concept → Results) with drawn icons and a *Creative / Both / Operational* toggle |
| Marketing | Capability ticker, animated stats, a campaign archive you step through Brief → Impact |
| Experience | Horizontal journey driven by vertical scroll, from Hoenheim to Melbourne. Each stop expands to show its responsibilities. |
| Toolkit | Eight categories. The one you pick expands to reveal its skills. |
| How I work | Five steps that animate in on scroll and fill on hover |
| Behind the scenes | A workspace board: drag the moodboard, run-of-show, floor plan and notes around (desktop), and tick the checklist |
| Beyond the brief | Expanding panels |
| Finale | "The work is never really finished." → "See you at the next idea." → the café table |

**Café table** — a sunny daylight café (white walls, window and plants, espresso machine, croissants, flowers, walnut table). Every object carries a "+" marker; on phones the table scrolls sideways.
- **MacBook:** the camera zooms into the screen and a real desktop opens. It has a dock (with magnification), draggable windows, and working close / minimise / maximise buttons.
- **Safari:** working tabs (LinkedIn, Portfolio, Events, Contact), back/forward, reload, and an address bar you can type in.
- **Mail, Notes, Calendar, Files:** each has something to click. Try accepting the coffee invite.
- **Mouse:** moves the cursor on the laptop screen and opens the contact page.
- **Notebook, pen, coffee, phone, sunglasses:** open the notebook, write with the pen, sip the coffee, read the message on the phone, switch the light to golden hour.
- **Hidden extras:** a few easter eggs. A counter appears once you find the first one.

**Accessibility:** everything works with a click or tap. Every object is a real `<button>`. `Esc` closes overlays, and keyboard focus is visible. `prefers-reduced-motion` turns off smooth scroll, the loader, parallax and camera moves. The custom cursor only runs on fine pointers.

## Make it yours

- **Copy:** edit `content/site.ts`. Nothing else needs to change.
- **Photography:** put images in `public/images/` and set `image: "/images/your-photo.jpg"` on a project. Until then each project shows an art-directed SVG plate instead of a stock photo.
- **LinkedIn:** set `person.linkedin` in `content/site.ts`. It's used by the nav menu, the final CTA and the LinkedIn-inspired page inside the laptop.
- **Contact form:** the laptop's form and Mail app open the visitor's mail client (`mailto:`) with the message filled in. That needs no backend. To receive messages directly, point the form at a service such as Formspree.
- **Fonts:** Fraunces (display), DM Sans (text) and Caveat (handwriting) are self-hosted in `app/fonts/` under the SIL Open Font License.

## Publish on GitHub Pages

`.github/workflows/deploy.yml` builds on every push and deploys the default branch.
Once, in **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
The base path (`/portfolio`) and the site URL are picked up automatically.

On any other host (Vercel, Netlify…), run `npm run build` and serve `out/`. Set `NEXT_PUBLIC_SITE_URL` so the canonical URL and sitemap are correct.
