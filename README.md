# Illana Nemard — Event Manager Portfolio

Personal portfolio website (in English) for an Event Manager / Event & Communications Specialist based in Australia with French expertise.

Static site: `index.html`, `styles.css`, `script.js` — no build step.

## Preview locally

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 8000
```

## Customise

- Content lives directly in `index.html`.
- Add a portrait at `images/portrait.jpg` and swap the `.photo-placeholder` block for an `<img>`.
- Add event photos by setting `background-image` on each `.event__img`.
- To offer a CV download, add `cv.pdf` and a `<a href="cv.pdf" download>` button in the Contact section.

## Publish with GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → select the branch and `/ (root)`.
