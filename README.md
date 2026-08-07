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
assets/js/main.js         theme, nav, publication filtering, lightbox
.nojekyll                 serve files verbatim on GitHub Pages
```

### Design system

Warm paper (`#fcfcfa`) and near-black ink, with **two accent colours that mean something**:
orange for exposure and pollution, teal for clean and green routing. They are used in the
figures, the chart legend and the publication identifiers — never as decoration.

| Role | Typeface |
| --- | --- |
| Display, headings, interface | Instrument Sans |
| Reading prose, pull quotes, venues | Newsreader |
| Data, labels, identifiers | DM Mono |

Corners are 4 px, borders are hairlines, and shadows are almost absent. Motion is limited to
scroll reveals, a counting animation on the figures and one ticker.

### Features

- **Findings as figures.** The research section leads with published numbers — exposure share,
  LEAP and LECR route savings, the monitoring-station gap — plus a stacked bar chart of output
  by year and a five-stage diagram of the method.
- **Press coverage.** A designed preview of *The Hindu* article alongside the scanned page,
  which opens full size in a lightbox.
- **Publications.** All 24 entries with the identifiers used in the thesis appendix
  (`[J1]`–`[J10]`, `[C1]`–`[C13]`, `[P1]`), DOI links, type filters, full-text search and
  one-click BibTeX. Entries are plain HTML, so the list works without JavaScript.
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

- **Publications** — copy an `<article class="pub">` block. Set `data-type` to `journal`,
  `conference` or `patent`, `data-year` to the year, and the `data-bib` JSON payload for the
  BibTeX button. Update the counts in the filter tabs.
- **Figures** — `data-count` on a `<span>` drives the counting animation; the unit sits in a
  sibling `.u` span so it survives the animation.
- **Bar chart** — each `.seg` height is a percentage of the tallest year (currently 9).
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

---

## Contact

- **Email** — kapil.meena@kgpian.iitkgp.ac.in
- **Based in** — HUMAN Lab, UCLA · Los Angeles, California
- **Scholar** — [scholar.google.com](https://scholar.google.com/citations?user=5jIAPTEAAAAJ)
- **GitHub** — [@kapil2020](https://github.com/kapil2020)

Fonts are distributed under the SIL Open Font License 1.1. The press clipping is reproduced
from *The Hindu*, 8 June 2025.
