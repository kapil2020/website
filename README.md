# Kapil Kumar Meena

Academic homepage: <https://kapil2020.github.io/website/>

Postdoctoral researcher in the [HUMAN Lab](https://sites.google.com/cornell.edu/youngseokim/human-lab),
University of California, Los Angeles. Ph.D. in Transportation Engineering, IIT Kharagpur (2026).

---

## The site

One static page in the style of a conventional academic homepage (the layout that
[Jon Barron](https://jonbarron.info/), [Ye Yuan](https://ye-yuan.com/) and
[Vindula Jayawardana](https://vindulamj.github.io/) use): a short bio with a photo and links,
then news, research, publications, software, media, teaching, service and awards, in one
column. No framework and no third-party requests. There is no build step: after editing a
thumbnail or a software card, a small Python script rewrites that part of `index.html` (see below).

```
index.html                  all content
assets/css/style.css        the whole stylesheet
assets/js/main.js           shows and hides BibTeX; starts the drawings on scroll
assets/js/story.js          "Research in 30 seconds", the animation under the photo
assets/fonts/               Source Sans 3, roman and italic (variable, latin subset), plus β and ε
assets/img/portrait.jpg     the photo on the page (square crop of kapil-portrait.jpg)
assets/img/hindu-*.jpg      press thumbnail and the full print page
assets/img/favicon.*        monogram K, svg source plus .ico and png sizes
figures/                    thumbnail sources (one SVG per paper, shared icons) and scripts:
                            pubs.py puts the thumbnails into the page, software.py writes the
                            Software section, render.js and render-story.js export images
                            and the video
cv/                         the CV: LaTeX source and the built PDF
qa.js                       layout and link checks (see below)
```

### Design

- White page, near-black text, one link blue (`#1d5fb5`). Grey is used only for secondary text
  such as venues and dates.
- One typeface, Source Sans 3, at 17 px. Hierarchy comes from size and weight.
- The intro is a profile: two short paragraphs, then a small graphic (Transportation ×
  Environment × AI & data science, and what came of them) in place of a long paragraph. The
  photo and a 30-second animation fill the right-hand column. On phones the photo sits beside
  the name, the header scrolls away with the page instead of covering it, and the animation
  follows the text at full width.
- News is a timeline by year: a coloured tag says what each item is (paper, patent, award,
  grant, talk, media, career), a dot of the same colour sits on the rail, and the year stays in
  view while its items scroll past. On phones the year becomes a marker on the rail.
- The Research section is a short research statement: a lede, Figure 1 (field data, models,
  decisions) built in HTML so it reflows on phones, and three thrusts that cite the papers.
- Publications open with the patent and the press coverage, each on a pale highlighter
  background (`.pub--star`, `.press--star`). In the CV the same two come right after Education,
  marked by a thin blue rule down the left edge (`\featured`).
- Journal articles and manuscripts under review have a thumbnail, a venue badge
  (`TRR 2026`; grey for under review, green for conferences) and a one-line summary.
- The thumbnails, like the software drawings, are inline SVG that move. Each draws itself in
  the first time it scrolls into view (routes trace, bars grow, people and icons pop in). While
  a paper is hovered, parts of its drawing loop: pollution pulses, the clean route flows,
  vehicles drive, the sun turns. Phones and tablets have no hover, so there the loop runs while
  the paper sits in the middle of the screen. With reduced motion, or without JavaScript, the
  finished drawing shows.
- The column is 820 px wide. The header drops the name below 800 px; below 720 px the photo
  moves above the name; below 640 px thumbnails stack above their papers; below 540 px dates
  stack above their entries and the nav drops Teaching and Service.
- Light only, by choice.

## Editing

Everything is in `index.html`.

- **News.** A timeline grouped by year. Copy an `<li class="nw nw--paper">` into the right
  year's list (or copy a whole `news-year` block for a new year). The class sets the colour and
  icon: `nw--paper`, `nw--patent`, `nw--award`, `nw--grant`, `nw--talk`, `nw--media` or
  `nw--career`; change the tag's label and its `#i-n-…` icon to match. Add
  `<span class="nw-when">Jul</span>` after the tag when the month is known, and start the text
  with a short bold lead. The newest item's dot pings.
- **A publication.** Copy an `<li class="pub">` in the right group. The badge is
  `<span class="badge">` (add `badge--review`, `badge--conf` or `badge--patent`), and
  `<p class="pub-note">` is the one-line summary. A `BibTeX` button needs a matching
  `<pre class="bib" id="…" hidden>` with the same id as its `data-bib`.
- **The counts** (1 patent, 9 journal articles, 7 under review, 17 conference papers) appear in
  the intro, the Publications heading and the CV's Record line. Update all three when a paper moves.
- **When a paper is accepted,** move its `<li>` from Under review to Journal articles, change
  the badge class to plain `badge`, and add the DOI link.
- **Software.** Edit the `CARDS` list in `figures/software.py` (name, text, tags, links) and
  run `python3 figures/software.py`; it rewrites the section between the `software:start` and
  `software:end` comments. Each card's thumbnail is inline SVG drawn by a function in the same
  file, so it animates and uses the site's font: it traces itself in when the card scrolls into
  view, and comes alive on hover (the clean route flows, the gauge swings, the survey answer
  changes). Reduced motion shows the finished drawing.
- **Talks, service, awards.** Plain lists, one `<li>` each.

### Research in 30 seconds

`assets/js/story.js` draws six five-second scenes in SVG (the problem, measure, model, learn,
deliver, impact) from one clock, `render(t)`, so everything on screen is a function of time. It
plays only while on screen, pauses with the button, jumps to a scene from the bar, holds on the
last scene for visitors who ask for reduced motion, and never appears half-drawn without
JavaScript. The figures it shows are from the papers (723 commuters, 5,224 choices, about 4×
in winter, −50% exposure for +40% time in the Delhi simulations); change them in the scene
strings near the top of the file.

To make a video of it (1080 × 1350, 30 fps; needs ffmpeg):

```bash
npm i --no-save playwright
node figures/render-story.js research-in-30-seconds.mp4
```

### Paper thumbnails

Each thumbnail is a schematic of the study (its setting or its method), not a figure from the
paper. The sources are in `figures/`:

- `figures/pubs/NAME.svg` is one drawing on a 400 × 250 canvas
- `figures/icons.svg` holds the shared icons (people, modes, sensor, sun, charger, rupee…),
  arrows and gradients
- `figures/figures.css` holds the type and the palette: blue for models and information, red for
  pollution and risk, green for clean or active travel, amber for heat, violet for learning

The page shows them as inline SVG, so they use the site's font and can move. After editing a
drawing, or to give a new paper one, run:

```bash
python3 figures/pubs.py
```

It fills every `<div class="pub-fig" data-fig="NAME">` (and `thrust-fig` in Research) with
`figures/pubs/NAME.svg`, and puts the shared icons in once near the top of the page. For a new
paper, copy an existing `<li>` and change `data-fig`.

The motion is set with class names on the parts of a drawing. Entrances, once, delayed by
`--d`: `a-draw` (a line traces itself), `a-grow` / `a-growy` (a bar grows across / up),
`a-pop`, `a-fade`, `a-slide`, `a-drop`. Loops while hovered, delayed by `--w`: `h-pulse`,
`h-float`, `h-wave`, `h-march` (dashes flowing along a route), `h-spin`, `h-drive`. For example
`<path class="a-draw" style="--d:.3s" …>`. The rules are in `style.css` under "Motion".

To export the drawings as images (1200 × 750 PNG, for slides or a research statement):

```bash
npm i --no-save playwright
node figures/render.js                 # all → figures/export/NAME.png
node figures/render.js pd-muse         # just one
node figures/render.js --sheet s.png   # plus a contact sheet to review
```

To use a real figure from a paper instead, save it as `assets/img/pubs/NAME.webp` (any 8:5
image) and write `<div class="pub-fig"><img src="assets/img/pubs/NAME.webp" alt="" width="400"
height="250" loading="lazy"></div>`. `pubs.py` leaves an image alone when there is no drawing
of that name.

**Change the cache key when you edit CSS or JS.** `index.html` loads them as
`style.css?v=YYYYMMDDx`. Without a new key, a returning visitor can get the new HTML with the old
stylesheet. Change every `?v=` together.

## The CV

`cv/Kapil-Kumar-Meena-CV.tex`, with page, type and macros in `cv/preamble.tex`. A4 (the size
Indian institutes expect), Charter (XCharter) at 10 pt, small-caps section headings, one dark
blue for links. It opens with interests and a one-line record, and lists published papers,
manuscripts under review, conference papers and the patent separately, numbered newest-first.

| Macro | For |
| --- | --- |
| `\post{dates}{title}{institution}{place}{detail}` | an appointment or a degree |
| `\pub{id}{authors}{year}{title}{venue}{status and DOI}` | one publication |
| `\entry{label}{text}` | any other dated or labelled line |
| `\doi{10.xxxx/…}` | a DOI link that can break across lines |
| `\me` | my name in bold in an author list |

```bash
cd cv
pdflatex Kapil-Kumar-Meena-CV.tex   # run twice so "page N of M" resolves
```

Needs `texlive-latex-recommended`, `texlive-latex-extra` and `texlive-fonts-extra`.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Checks

```bash
npm i --no-save playwright
node qa.js            # or: CHROMIUM=/path/to/chrome node qa.js
```

`qa.js` serves the folder itself and checks that:

- every in-page link has a target, every local file resolves, ids are unique, images have alt
  text and dimensions, and each BibTeX button opens and closes its entry
- at 15 widths from 320 px to 1920 px there is no sideways scroll, nothing runs past the edge,
  no line of text overlaps another, and there are no script errors
- the 30-second story draws all six scenes, plays while on screen, pauses on the button, and in
  every scene its labels stay apart and inside the frame
- all 20 thumbnails are inline, every icon and gradient they use resolves, and the drawings
  start only when they scroll into view
- all text is at least 4.5:1 against its background

## Deployment

GitHub Pages serves this repository. All paths are relative, so the site works at a domain root
and under `/website/`.

Source Sans 3 is under the SIL Open Font License 1.1. The press clipping is from *The Hindu*,
8 June 2025.
