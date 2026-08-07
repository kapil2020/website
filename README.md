# Kapil Kumar Meena, Ph.D. — personal academic website

[![Website](https://img.shields.io/badge/Live-kapil2020.github.io%2Fwebsite-1f5eb3?style=flat-square)](https://kapil2020.github.io/website/)
[![Scholar](https://img.shields.io/badge/Google-Scholar-4285F4?style=flat-square&logo=googlescholar&logoColor=white)](https://scholar.google.com/citations?user=5jIAPTEAAAAJ)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kapilmeena/)

Postdoctoral Researcher at the [HUMAN Lab](https://sites.google.com/cornell.edu/youngseokim/human-lab),
University of California, Los Angeles, working with Prof. Youngseo Kim on travel behaviour,
air-quality exposure and machine learning for sustainable urban mobility.
Ph.D. in Transportation Engineering, IIT Kharagpur (2026), advised by Prof. Arkopal K. Goswami.

---

## About this site

A hand-built static site — no framework, no build step, no bundler. Open `index.html`
in a browser and it runs.

```
index.html                 all markup and content
assets/css/style.css       design system and layout
assets/css/fonts.css       @font-face declarations
assets/fonts/*.woff2       self-hosted webfonts (latin subset)
assets/js/main.js          theme, navigation, publication filtering, map
.nojekyll                  serve files verbatim on GitHub Pages
```

### Design

Typography-first and deliberately restrained: Source Serif 4 for headings and reading
copy, Inter for interface text, JetBrains Mono for labels. A single deep-blue accent,
hairline rules instead of heavy shadows, and generous white space.

### Features

- **Light and dark themes** — follows the operating system by default, with a manual
  toggle stored in `localStorage`. The theme is applied before first paint, so there is
  no flash of the wrong colours.
- **Publications** — filter by type (journal / conference / patent), full-text search
  across title, authors and venue, one-click BibTeX copy, and DOI links. Entries are
  plain HTML, so the list is complete without JavaScript and is indexable.
- **Responsive** — a single fluid layout from 320 px upwards; no horizontal scrolling
  at any width.
- **Accessible** — semantic landmarks, visible focus rings, a skip link, ARIA state on
  interactive controls, and full support for `prefers-reduced-motion`.
- **Fast** — self-hosted fonts, inline SVG icons, no third-party JavaScript on load.
  Leaflet is fetched only if the footprint map scrolls into view, and the section
  removes itself cleanly if that fetch fails.
- **Printable** — a print stylesheet turns the page into a readable CV.

### Keyboard

| Key | Action |
| --- | --- |
| <kbd>/</kbd> | Focus the publication search |
| <kbd>Esc</kbd> | Clear search, close the menu or the image viewer |

---

## Editing the content

Everything lives in `index.html`.

- **Publications** — copy an existing `<article class="pub">` block. Set `data-type`
  to `journal`, `conference` or `patent` and `data-year` to the year; the filter counts
  in the toolbar and the `[n]` numbering are the only things to update by hand.
- **Metrics** — the numbers in the hero strip are the `data-count` attributes on
  `.metric .n`; they animate up from zero on first view.
- **Theme colours** — the custom properties at the top of `assets/css/style.css`
  (`:root` for light, `html[data-theme="dark"]` for dark).

## Local preview

No dependencies required:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deployment

GitHub Pages serves the site from this repository. Asset paths are relative, so the
site works both at a domain root and under the `/website/` sub-path.

---

## Contact

- **Email** — kapil.meena@kgpian.iitkgp.ac.in
- **Based in** — HUMAN Lab, UCLA · Los Angeles, California
- **Scholar** — [scholar.google.com](https://scholar.google.com/citations?user=5jIAPTEAAAAJ)
- **GitHub** — [@kapil2020](https://github.com/kapil2020)

Fonts are distributed under the SIL Open Font License 1.1.
