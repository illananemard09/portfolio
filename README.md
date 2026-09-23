# Illana Nemard — Event Manager Portfolio

Personal portfolio website (in English) for an Event Manager / Event & Communications Specialist based in Australia with French expertise.

Static site: `index.html`, `styles.css`, `script.js` — no build step.

## How it works

Coffee-shop theme: espresso and caramel browns with sage/forest green touches, paper grain, sticker-style cards.

- **Intro** — a steaming cup with a *Brewing your experience 0→100%* counter, then *Freshly brewed events, served with a French touch.*, then the name and *Enter the café*. The intro opens like a circle onto the stage. *Skip intro* is always available; it plays once per browser session.
- **Stage** — the café counter: floating stickers (About, Expertise, Experience, Events, Skills, Contact) that react to the pointer, a rotating stamp logo, a green marquee and a custom cursor on desktop. Touching a sticker opens the menu card on that tab.
- **Menu card panel** — tabbed sections; Expertise is a café menu, Experience has one tab per role shown as a receipt. `Esc` closes it, and links like `index.html#experience` open a tab directly.
- **Fonts** — Fraunces (display), DM Sans (text) and Caveat (handwritten notes), self-hosted in `fonts/` under the SIL Open Font License.

## Preview locally

Run a local server (fonts don't load from `file://`):

```bash
python3 -m http.server 8000
```

## Customise

- Content lives directly in `index.html`.
- Add a portrait at `images/portrait.jpg` and replace the `.portrait` block (About tab) with an `<img>`.
- Add event photos by setting `background-image` on each `.event__img`.
- To offer a CV download, add `cv.pdf` and a `<a href="cv.pdf" download>` button in the Contact section.

## Publish with GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → select the branch and `/ (root)`.
