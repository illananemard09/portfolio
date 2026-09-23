# Illana Nemard — Ideas into experiences

An immersive portfolio for a Marketing, Communications & Event Manager.
The home page is Illana's world: a sticker collage, a short intro, then a first-person café table. Every object on the table is clickable, and the MacBook opens into a desktop where each file is a piece of the CV. A detailed editorial portfolio lives at /portfolio.

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
app/page.tsx          home: Illana's world → the café → the laptop
app/portfolio/        the detailed editorial portfolio (work, events, marketing, experience…)
content/site.ts       ← all copy: stickers, intro, roles (+ their desktop file names), projects…
components/
  world/              WorldHero (sticker collage), stickers, Intro, Phrase
  cafe/               CafeFinale (scroll-in focus), CafeScene (photo + outlined objects), notebook
  cafe/os/            the laptop: Desktop (window manager, dock, CV files), docs (CV documents + Preview),
                      Window, Safari (+ pages), Mail, Notes, Calendar, Files
  sections/           sections of the /portfolio page
  ui/                 SmoothScroll, Cursor, Magnetic, Reveal, Counter, Plate
```

## The home page, in reading order

1. **Illana's world:** a collage of stickers on espresso brown (a name tag, an all-access pass, a croissant, a latte, an event ticket, a métro ticket, a beret, a paper flower, a coffee bean, a café receipt, a stamp and a polaroid). Drag them around on desktop. Tap one to read a fact.
2. **Intro:** "Made in France, now in Melbourne…" lights up word by word as you scroll.
3. **Interlude:** "One flat white, one big idea. Plan it, then make it happen." on cream.
4. **The café:** a photo of a sunny café table (`public/images/cafe.jpg`) comes into focus as you scroll. Objects trace a white outline on hover or tap, and the laptop screen is live. On phones the photo scrolls sideways.
5. **The laptop:** a working desktop. **Each file on it is a piece of the CV**: one PDF per role (`2024_LexisNexis_France.pdf`…), plus `CV_Illana_Nemard.pdf`, `About_me.txt`, `Contact.vcf`, `Education.pdf`, `Skills_Toolkit.pdf`, `Languages.txt` and a *Case studies* folder. Files open in Preview. Safari, Mail, Notes, Calendar and Files work too.
The page ends at the café table; contact lives inside the laptop (Contact.vcf, the Safari contact tab, Mail).

**Accessibility:** everything works with a click or tap. Every object is a real `<button>`. `Esc` closes overlays, and keyboard focus is visible. `prefers-reduced-motion` turns off smooth scroll, the loader, parallax and camera moves. The custom cursor only runs on fine pointers.

## Make it yours

- **Copy:** edit `content/site.ts`. Nothing else needs to change.
- **Photography:** put images in `public/images/` and set `image: "/images/your-photo.jpg"` on a project. Until then each project shows an art-directed SVG plate instead of a stock photo. The polaroid sticker takes an `image` prop too.
- **Desktop files:** each role in `content/site.ts` has a `file` name. Add or rename roles there and the laptop desktop follows.
- **LinkedIn:** set `person.linkedin` in `content/site.ts`. It's used by the nav menu, the final CTA and the LinkedIn-inspired page inside the laptop.
- **Contact form:** the laptop's form and Mail app open the visitor's mail client (`mailto:`) with the message filled in. That needs no backend. To receive messages directly, point the form at a service such as Formspree.
- **Fonts:** Fraunces (display), DM Sans (text) and Caveat (handwriting) are self-hosted in `app/fonts/` under the SIL Open Font License.

## Publish on GitHub Pages

`.github/workflows/deploy.yml` builds on every push and deploys the default branch.
Once, in **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
The base path (`/portfolio`) and the site URL are picked up automatically.

On any other host (Vercel, Netlify…), run `npm run build` and serve `out/`. Set `NEXT_PUBLIC_SITE_URL` so the canonical URL and sitemap are correct.
