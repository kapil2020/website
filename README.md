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
column. No framework and no third-party requests. The only build step is optional: redrawing
the paper thumbnails after editing one (see below).

```
index.html                  all content
assets/css/style.css        the whole stylesheet
assets/js/main.js           shows and hides BibTeX (the page works without it)
assets/js/story.js          "Research in 30 seconds", the animation under the photo
assets/fonts/               Source Sans 3, roman and italic (variable, latin subset)
assets/img/portrait.jpg     the photo on the page (square crop of kapil-portrait.jpg)
assets/img/hindu-*.jpg      press thumbnail and the full print page
assets/img/favicon.*        monogram K, svg source plus .ico and png sizes
assets/img/pubs/*.webp      paper thumbnails, drawn from figures/
figures/                    thumbnail sources (one SVG per paper, shared icons, render script)
                            and render-story.js, which exports the animation as an MP4
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
- The Research section is a short research statement: a lede, Figure 1 (field data, models,
  decisions) built in HTML so it reflows on phones, and three thrusts that cite the papers.
- Publications open with the patent and the press coverage, each on a pale highlighter
  background (`.pub--star`, `.press--star`). In the CV the same two come right after Education,
  marked by a thin blue rule down the left edge (`\featured`).
- Journal articles and manuscripts under review have a thumbnail, a venue badge
  (`TRR 2026`; grey for under review, green for conferences) and a one-line summary.
- The column is 820 px wide. The header drops the name below 800 px; below 720 px the photo
  moves above the name; below 640 px thumbnails stack above their papers; below 540 px dates
  stack above their entries and the nav drops Teaching and Service.
- Light only, by choice.

## Editing

Everything is in `index.html`.

- **News.** Add an `<li>` at the top of the `#news` list: a `<span class="when">` with the
  date and a `<p>` with the text. Keep it to about ten items.
- **A publication.** Copy an `<li class="pub">` in the right group. The badge is
  `<span class="badge">` (add `badge--review`, `badge--conf` or `badge--patent`), and
  `<p class="pub-note">` is the one-line summary. A `BibTeX` button needs a matching
  `<pre class="bib" id="…" hidden>` with the same id as its `data-bib`.
- **The counts** (1 patent, 9 journal articles, 7 under review, 17 conference papers) appear in
  the intro, the Publications heading and the CV's Record line. Update all three when a paper moves.
- **When a paper is accepted,** move its `<li>` from Under review to Journal articles, change
  the badge class to plain `badge`, and add the DOI link.
- **Software, talks, service, awards.** Plain lists, one `<li>` each.

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
paper, and says so in the footer. The sources are in `figures/`:

- `figures/pubs/NAME.svg` is one drawing on a 400 × 250 canvas
- `figures/icons.svg` holds the shared icons (people, modes, sensor, sun, charger…) and arrows
- `figures/figures.css` holds the type and the palette: blue for models and information, red for
  pollution and risk, green for clean or active travel, amber for heat, violet for learning

```bash
npm i --no-save playwright
node figures/render.js                 # all thumbnails → assets/img/pubs/*.webp
node figures/render.js pd-muse         # just one
node figures/render.js --sheet s.png   # plus a contact sheet to review
```

To use a real figure from a paper instead, save it as `assets/img/pubs/NAME.webp` (400 × 250,
or any 8:5 image) and point the `<img>` at it.

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
- all text is at least 4.5:1 against its background

## Deployment

GitHub Pages serves this repository. All paths are relative, so the site works at a domain root
and under `/website/`.

Source Sans 3 is under the SIL Open Font License 1.1. The press clipping is from *The Hindu*,
8 June 2025.
