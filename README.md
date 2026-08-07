# Kapil Kumar Meena, Ph.D.

[![Website](https://img.shields.io/badge/Live-kapil2020.github.io%2Fwebsite-d8430e?style=flat-square)](https://kapil2020.github.io/website/)
[![Scholar](https://img.shields.io/badge/Google-Scholar-0e0e10?style=flat-square&logo=googlescholar&logoColor=white)](https://scholar.google.com/citations?user=5jIAPTEAAAAJ)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-0e0e10?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kapilmeena/)

Postdoctoral Researcher at the [HUMAN Lab](https://sites.google.com/cornell.edu/youngseokim/human-lab),
University of California, Los Angeles, working with Prof. Youngseo Kim.
Ph.D. in Transportation Engineering, IIT Kharagpur (2026), advised by Prof. Arkopal K. Goswami.

Research: travel behaviour, air-quality exposure and machine learning for sustainable urban
mobility. The DRUM routing engine built from this work was covered by *The Hindu* in June 2025.

---

## The site

Hand-built and static. No framework, no build step, no bundler, no third-party request at
runtime — open `index.html` and it runs.

```
index.html                all markup and content
assets/css/style.css      design system and layout
assets/css/fonts.css      @font-face declarations
assets/fonts/*.woff2      self-hosted webfonts (latin subset)
assets/img/*.jpg          portrait and press clipping
assets/js/main.js         theme, nav, publications explorer, lightbox
qa.js                     Playwright checks (see below)
.nojekyll                 serve files verbatim on GitHub Pages
```

### Design system

Warm paper (`#fcfcfa`) and near-black ink. **Colour carries meaning, never decoration** — each
research area owns one hue, reused wherever that area appears: the facet swatch, the group
heading, the publication identifier, and the keyword highlights in the hero.

| Area | Hue |
| --- | --- |
| Travel behaviour & choice modelling | indigo `#3b3f9e` |
| Air quality & exposure | orange `#d8430e` |
| Machine learning & prediction | rose `#c2255c` |
| Active mobility & accessibility | teal `#0e7c66` |
| Routing & decision tools | amber `#9a6a00` |

Rose doubles as the primary interface accent — links, active nav, section eyebrows.

| Role | Typeface |
| --- | --- |
| The name, at masthead size | Instrument Serif |
| Headings and interface | Instrument Sans |
| Reading prose, pull quotes, venues | Newsreader |
| Data, labels, identifiers | DM Mono |

Corners are 4 px, borders are hairlines, and shadows are almost absent. Motion is limited to
scroll reveals, a counting animation on the figures and one ticker.

### Features

- **Research programme first.** The research section opens with the four directions the work
  runs in — behaviour and decision science, environment and health, methods and machine
  learning, systems and policy — each naming the disciplines it bridges.
- **Findings as figures.** Published numbers rather than adjectives: exposure share, LEAP and
  LECR route savings, the monitoring-station gap, a two-wave seasonal panel comparison, a
  stacked bar chart of output by year, and a five-stage diagram of the method.
- **Press coverage.** A designed preview of *The Hindu* article alongside the scanned page,
  which opens full size in a lightbox.
- **Publications explorer.** Opens filtered to the twelve journal articles; every other filter
  is one click away. All 28 entries — 12 journal articles, 15 refereed conference papers
  and one filed patent — with a faceted filter rail (research area, type, year, venue),
  full-text search, grouping by topic / year / type, sorting, collapsible group headings, DOI
  links and one-click BibTeX. Facets and their counts are derived from the markup, so adding a
  paper needs no counter updates. Entries are plain HTML, so the list still reads without
  JavaScript; on phones the rail collapses behind a Filters button.
- **Current work.** PD-MUSE (the convex reformulation of structured choice estimation, under
  review at *Transportation Research Part B*) and HEAT (heat, exposure, activity, travel).
- **Light and dark.** The site always opens light, whatever the visitor's OS setting. Dark is
  opt-in via the toggle and is remembered from then on, applied before first paint so there is
  no flash.
- **Responsive.** One fluid layout from 320 px up. The portrait bleeds to the viewport edge on
  desktop and runs full width under the header on phones.
- **Accessible.** Landmarks, skip link, focus rings, ARIA state, and full
  `prefers-reduced-motion` support.
- **Printable.** A print stylesheet turns the page into a readable CV.

### Keyboard

| Key | Action |
| --- | --- |
| <kbd>/</kbd> | Focus the publication search |
| <kbd>Esc</kbd> | Clear search, close the menu or the lightbox |

---

## Editing

Everything lives in `index.html`.

- **Publications** — copy an `<article class="pub">` block and set `data-type`
  (`journal` / `conference` / `patent`), `data-year`, `data-venue`, `data-topics` (one of
  `behaviour` / `exposure` / `learning` / `active` / `routing`) and the `data-bib` JSON payload.
  Facet options and counts update themselves; only the hero button, the section heading and the
  ticker carry hard-coded totals.
- **Topic labels** — the `TOPIC_LABEL` / `TOPIC_ORDER` maps at the top of the explorer block in
  `assets/js/main.js`.
- **Figures** — `data-count` on a `<span>` drives the counting animation; the unit sits in a
  sibling `.u` span so it survives the animation.
- **Bar chart** — each `.seg` height is a percentage of the tallest year (currently 12, in 2025).
- **Colours** — the custom properties at the top of `assets/css/style.css`
  (`:root` for light, `html[data-theme="dark"]` for dark).

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deployment

GitHub Pages serves this repository. Asset paths are relative, so the site works both at a
domain root and under the `/website/` sub-path.

**Bump the cache key when you touch CSS or JS.** `index.html` loads them as
`assets/css/style.css?v=YYYYMMDDx`. Without a new key a returning visitor gets the new HTML with
yesterday's stylesheet, and half the page renders unstyled. Change every `?v=` in `index.html`
together.

## Checks

`qa.js` (Playwright) covers what is easy to break:

- every class used in the markup resolves to a CSS rule, and both stylesheets parsed
- no horizontal overflow at 320 / 360 / 390 / 430 / 600 / 768 / 1024 / 1280 / 1440 / 1920 px
- no touch target under 30 px on phones, no console or request errors
- filters, grouping, sorting, search, BibTeX, theme persistence, lightbox, `/` shortcut
- the mobile filter rail and menu

Scroll reveals are gated behind an `html.js` class, so if JavaScript never runs the content is
plain and visible rather than stuck at `opacity: 0`.

---

## Contact

- **Email** — kapilm.48@gmail.com
- **ORCID** — [0000-0002-0271-0175](https://orcid.org/0000-0002-0271-0175)
- **Based in** — HUMAN Lab, University of California, Los Angeles
- **Scholar** — [scholar.google.com](https://scholar.google.com/citations?user=5jIAPTEAAAAJ)
- **GitHub** — [@kapil2020](https://github.com/kapil2020)

Fonts are distributed under the SIL Open Font License 1.1. The press clipping is reproduced
from *The Hindu*, 8 June 2025.
