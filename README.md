# Illana Nemard — Event Manager Portfolio

Personal portfolio website (in English) for an Event Manager / Event & Communications Specialist based in Australia with French expertise.

Static site: `index.html`, `styles.css`, `script.js` — no build step.

## How it works

- **Cinematic intro** — three animated scenes (tagline, France → Melbourne route, name reveal) over animated event lights, then *Enter the experience*. A *Skip intro* button is always available, and the intro only plays once per browser session.
- **Interactive stage** — floating elements (About, Expertise, Experience, Events, Skills, Contact) react to the pointer; touching one opens a panel on that tab.
- **Tabbed panel** — switch sections from the tab bar; Experience has its own tabs, one per role. `Esc` closes the panel, and links like `index.html#experience` open a tab directly.

## Preview locally

Open `index.html` in a browser, or run:

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
