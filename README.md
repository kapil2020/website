# Dr. Kapil Kumar Meena

[![Website](https://img.shields.io/badge/Live-kapil2020.github.io%2Fwebsite-d8430e?style=flat-square)](https://kapil2020.github.io/website/)
[![Scholar](https://img.shields.io/badge/Google-Scholar-0e0e10?style=flat-square&logo=googlescholar&logoColor=white)](https://scholar.google.com/citations?user=5jIAPTEAAAAJ)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-0e0e10?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kapilmeena/)

Postdoctoral Researcher at the [HUMAN Lab](https://sites.google.com/cornell.edu/youngseokim/human-lab),
University of California, Los Angeles, working with Prof. Youngseo Kim.
Ph.D. in Transportation Engineering, IIT Kharagpur (2026), advised by Prof. Arkopal K. Goswami.

Research: travel behaviour, air-quality exposure, heat, and machine learning and AI for
sustainable urban mobility. The DRUM routing engine built from this work was covered by *The Hindu* in June 2025.

---

## The site

Hand-built and static. No framework, no build step, no bundler, no third-party request at
runtime — open `index.html` and it runs. The choice model, the force-directed network and the
command palette are all in the same ~1,300-line `main.js`; there is no D3, no Fuse, no cmdk.

```
index.html                all markup and content
cv/                       the CV — LaTeX source and the built PDF
assets/css/style.css      design system and layout
assets/css/fonts.css      @font-face declarations
assets/fonts/*.woff2      self-hosted webfonts (latin subset)
assets/img/*.jpg          portrait and press clipping
assets/img/favicon.*      monogram icon — svg source, .ico, 32/180/512 png
assets/js/main.js         theme, nav, publications explorer, lightbox
site.webmanifest          icon set and colours for installed/pinned use
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
| Machine learning, AI & prediction | rose `#c2255c` |
| Active mobility & accessibility | teal `#0e7c66` |
| Routing & decision tools | amber `#9a6a00` |

Those same five hues, in that order, make the 3 px rule across the top of the page: the site's
signature, and also its legend.

The header bar is a name, seven nav items, search, the theme toggle and the CV button inside a
1240 px column, which is full. The wordmark is therefore the name and nothing else — the
affiliation sits two lines below it in the hero, and again in the ticker, the contact block and
the footer — and `.wordmark` carries `overflow: hidden` so that anything added back truncates
instead of painting over the nav.

Rose doubles as the primary interface accent — links, active nav, section eyebrows. The
favicon is a monogram K on ink, its diagonal in that same rose; it is drawn as SVG paths
rather than set in a typeface, so it rasterises cleanly all the way down to 16 px.

| Role | Typeface |
| --- | --- |
| The name, at masthead size | Instrument Serif |
| Headings and interface | Instrument Sans |
| Reading prose, pull quotes, venues | Newsreader |
| Data, labels, identifiers | DM Mono |

Corners are 4 px, borders are hairlines, and shadows are almost absent. Motion is limited to
scroll reveals, a counting animation on the figures and one ticker.

### Features

- **The hero says who, not what was found.** Who the researcher is and what holds his
  attention, then the research interests as colour-coded tags rather than a run-on
  sentence, then how the work is actually done. Findings live in the sections below.
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
- **Current work.** Three strands, ruled apart like columns of a page: PD-MUSE (the convex
  reformulation of structured choice estimation, under review at *Transportation Research
  Part B*), HEAT (heat, exposure, activity, travel), and AI in transportation.
- **Service.** Peer review for eight journals, set as titles rather than crammed into chips.
- **A choice model you can move.** A multinomial logit over four urban modes, solved on every
  input event: linear-in-parameters utilities, a numerically-guarded softmax, and the log-sum
  reported both in utils and as a money-metric change against a reference scenario. Exposure
  enters as *inhaled dose* — ambient concentration × micro-environment factor × breathing rate ×
  duration — which is why walking stops being the clean option once the air is bad. Drag
  PM<sub>2.5</sub> up at 2.5 km and the walk share falls from 27% to 1%; zero the exposure
  coefficient and it comes straight back. Parameters are illustrative and say so.
- **A co-authorship network that reads itself.** Nodes and edges are parsed out of the
  publication markup, so adding a paper redraws the graph. Layout is Fruchterman–Reingold
  written from scratch — repulsion `k²/d`, attraction `d²/k`, `k` derived from the area per node
  so it fills whatever canvas it is given, and a cooling temperature capping each move. Node
  size is joint papers, colour is the shared research area, and clicking anyone filters the
  list.
- **A command palette.** <kbd>⌘K</kbd> / <kbd>Ctrl</kbd>+<kbd>K</kbd> over every section,
  publication, project and action. Scoring is a subsequence match with bonuses for word starts
  and consecutive runs, so `nattr` finds *Not all travellers think alike*; matched characters
  are marked in the result. Weak matches are dropped against a floor set from the best score,
  because subsequence matching on a long author string will otherwise match nearly anything.
- **Export.** One click turns whatever the filters are showing into a `.bib` file; the palette
  exports all 28.
- **Light and dark.** The site always opens light, whatever the visitor's OS setting. Dark is
  opt-in via the toggle and is remembered from then on, applied before first paint so there is
  no flash. Where the View Transitions API exists, the incoming theme is clipped open from the
  middle of the toggle, so the change has a source; everywhere else it is the instant swap it
  always was.
- **Responsive.** One fluid layout from 320 px up. The portrait bleeds to the viewport edge
  beside the text on desktop; below that it runs full width under the masthead, widening as the
  viewport does — 4:3 on a phone, 2:1 on a tablet — so it never swallows the first screen. On
  phones the header has no room for the CV button, so the menu carries it.
- **Accessible.** Landmarks, skip link, focus rings, ARIA state, and full
  `prefers-reduced-motion` support.
- **Printable.** A print stylesheet turns the page into a readable CV.

### Keyboard

| Key | Action |
| --- | --- |
| <kbd>⌘K</kbd> / <kbd>Ctrl</kbd>+<kbd>K</kbd> | Open the command palette |
| <kbd>↑</kbd> <kbd>↓</kbd> | Move through palette results |
| <kbd>↵</kbd> | Open the selected result |
| <kbd>/</kbd> | Focus the publication search |
| <kbd>Esc</kbd> | Close the palette, clear search, close the menu or the lightbox |

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
- **Research interests** — the `<li class="tag tag--…">` items in `.interests`; the modifier
  picks the hue, so use the same five names as the publications.
- **Favicon** — edit `assets/img/favicon.svg`, then re-export the `.ico` and the three PNGs
  from it at 16/32/48, 32, 180 and 512 px.
- **Figures** — `data-count` on a `<span>` drives the counting animation; the unit sits in a
  sibling `.u` span so it survives the animation.
- **Bar chart** — each `.seg` height is a percentage of the tallest year (currently 12, in 2025).
- **Colours** — the custom properties at the top of `assets/css/style.css`
  (`:root` for light, `html[data-theme="dark"]` for dark). `--faint` carries the 10 px
  uppercase labels, so it cannot be lightened without failing the contrast check.
- **Peer review** — the `<li><cite>` items in `.jrnls`, with the count in `.subh-n`.
- **The choice model** — the `MODES` table at the top of the live-model block in
  `assets/js/main.js`: an alternative-specific constant, time and cost as functions of distance,
  a micro-environment factor and a breathing-rate multiplier. Add a row and the table, the split
  bar and the log-sum all follow.
- **The network** — nothing to edit. It is read from the publication markup.
- **The palette** — sections, publications and projects are indexed automatically; the action
  list is the small array beside them.

## The CV

`cv/Kapil-Kumar-Meena-CV.tex`, with the page, palette and macros in `cv/preamble.tex`. The
site's three CV buttons point at the built PDF in this repository, so the CV and the site can
never drift apart.

No CV class. moderncv fixes the layout for you and its `banking` style shows its age; this is
ordinary LaTeX built on four macros:

| Macro | For |
| --- | --- |
| `\row{label}{content}` | any labelled line — a skill group, an award, a talk |
| `\post{dates}{role}{detail}{place}` | an appointment or a degree |
| `\pubentry{id}{authors}{title}{venue}{year}{status}{url}{link}` | one publication |
| `\me` | my own name, bold, so it is findable in a long author list |

Everything hangs off one measure, `\cvlab`, which is the width of the left label column.
Type is Source Sans Pro with Source Code Pro for dates and identifiers — the print analogue of
the site's Instrument Sans and DM Mono. The `accent` colour in `preamble.tex` is the site's
rose; change that one line and the section labels, rules and links all follow.

```bash
cd cv
pdflatex Kapil-Kumar-Meena-CV.tex   # twice — the second pass resolves the page count
```

Needs `texlive-latex-recommended`, `texlive-latex-extra` and `texlive-fonts-extra`.

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
- no horizontal overflow at fifteen widths from 320 px to 1920 px, covering phones, every
  iPad size in both orientations, and desktop
- **no text overlapping any other text** at any of those widths. Overflow is not overlap: a flex
  item with `min-width: 0` and `nowrap` text shrinks its box and paints straight over its
  neighbour without ever widening the page, which is exactly how the wordmark's affiliation came
  to sit on top of the nav while the overflow check stayed green. Compared per line fragment via
  `getClientRects()`, so an inline element that wraps is not mistaken for a collision
- no touch target under 30 px on phones, no console or request errors
- every button, link and heading clears 3:1 against whatever is actually behind it, in both
  themes — what catches a fill that quietly erases a label on the inverted contact band
- filters, grouping, sorting, search, BibTeX, theme persistence, lightbox, `/` shortcut
- the mobile filter rail, the menu's CV and email buttons, and the scroll lock releasing
- iPad portrait and landscape: the writing starts above the fold, and no script errors
- the choice model solves four modes to shares summing to 100%, walking collapses as
  PM<sub>2.5</sub> rises, and zeroing the exposure coefficient brings it back — if the utility
  function is ever broken, these fail
- the network builds a graph of the expected size with every node settled inside its frame, and
  clicking a co-author filters the list
- the palette opens on Ctrl-K, fuzzy-matches, moves on arrow keys, shows a no-match state,
  closes on Escape and releases the scroll lock
- the `.bib` export actually produces a download

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
