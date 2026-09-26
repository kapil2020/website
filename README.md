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
column. No framework, no build step and no third-party requests.

```
index.html                  all content
assets/css/style.css        the whole stylesheet
assets/js/main.js           shows and hides BibTeX (the page works without it)
assets/fonts/               Source Sans 3, roman and italic (variable, latin subset)
assets/img/portrait.jpg     the photo on the page (square crop of kapil-portrait.jpg)
assets/img/hindu-*.jpg      press thumbnail and the full print page
assets/img/favicon.*        monogram K, svg source plus .ico and png sizes
cv/                         the CV: LaTeX source and the built PDF
qa.js                       layout and link checks (see below)
```

### Design

- White page, near-black text, one link blue (`#1d5fb5`). Grey is used only for secondary text
  such as venues and dates.
- One typeface, Source Sans 3, at 17 px. Hierarchy comes from size and weight.
- Four representative papers have a pale highlight and a one-sentence summary.
- The column is 820 px wide. Below 720 px the photo moves above the name; below 540 px dates
  stack above their entries and the nav drops "Service" so it fits on one line.
- Light only, by choice.

## Editing

Everything is in `index.html`.

- **News.** Add an `<li>` at the top of the `#news` list: a `<span class="when">` with the
  date and a `<p>` with the text. Keep it to about ten items.
- **A publication.** Copy an `<li class="pub">` in the right group. Add `hl` to the class to
  highlight it, and a `<p class="pub-note">` for a one-line summary. A `BibTeX` button needs a
  matching `<pre class="bib" id="…" hidden>` with the same id as its `data-bib`.
- **A thumbnail.** There are no paper figures yet. The `.press` block in Media is the pattern
  to follow if you want to add some.
- **Software, talks, service, awards.** Plain lists, one `<li>` each.

**Change the cache key when you edit CSS or JS.** `index.html` loads them as
`style.css?v=YYYYMMDDx`. Without a new key, a returning visitor can get the new HTML with the old
stylesheet. Change every `?v=` together.

## The CV

`cv/Kapil-Kumar-Meena-CV.tex`, with page, type and macros in `cv/preamble.tex`. US Letter,
Charter (XCharter) at 10 pt, small-caps section headings, one dark blue for links. Published
papers, manuscripts under review, conference papers and the patent are listed separately and
numbered newest-first.

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
- all text is at least 4.5:1 against its background

## Deployment

GitHub Pages serves this repository. All paths are relative, so the site works at a domain root
and under `/website/`.

Source Sans 3 is under the SIL Open Font License 1.1. The press clipping is from *The Hindu*,
8 June 2025.
