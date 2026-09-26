"""Puts the paper thumbnails into index.html as inline SVG.

    python3 figures/pubs.py

Each figures/pubs/NAME.svg is copied into the page wherever a
<div class="pub-fig" data-fig="NAME"> or <div class="thrust-fig" data-fig="NAME">
stands, so the drawings use the site's font and can move (the classes are
explained in assets/css/style.css, under "Motion"). The shared icons in
figures/icons.svg go in once, near the top of <body>, between the
figsprite:start and figsprite:end comments. Every id gets an fg- prefix,
and ids local to one drawing also get the drawing's name and its place on
the page, so a figure can appear twice (Research and Publications).

A <div class="pub-fig"><img src="assets/img/pubs/NAME.webp" ...></div> is
converted too when figures/pubs/NAME.svg exists; without one, the image
stays (use that for a real figure from a paper). Run again after editing
any drawing.
"""

import re
import textwrap
from pathlib import Path

DIR = Path(__file__).resolve().parent
PAGE = DIR.parent / 'index.html'

SPRITE_START, SPRITE_END = '<!-- figsprite:start -->', '<!-- figsprite:end -->'
ROOT_TAG = '<svg class="pubfig" viewBox="0 0 400 250" aria-hidden="true" focusable="false">'


def strip(svg):
    """Drops comments and blank lines, and the outer <svg> tags."""
    svg = re.sub(r'<!--.*?-->', '', svg, flags=re.S)
    body = re.search(r'<svg[^>]*>(.*)</svg>', svg, flags=re.S).group(1)
    body = '\n'.join(l.rstrip() for l in body.splitlines() if l.strip())
    return textwrap.dedent(body).splitlines()


def refs(text, rename):
    """Points href="#x" and url(#x) at the renamed ids."""
    text = re.sub(r'href="#([\w-]+)"', lambda m: 'href="#%s"' % rename(m.group(1)), text)
    return re.sub(r'url\(#([\w-]+)\)', lambda m: 'url(#%s)' % rename(m.group(1)), text)


def sprite():
    lines = strip((DIR / 'icons.svg').read_text())
    text = '\n'.join(lines)
    text = re.sub(r'id="([\w-]+)"', r'id="fg-\1"', text)
    text = refs(text, lambda i: 'fg-' + i)
    return ('<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">\n'
            + text + '\n</svg>')


def figure(name, place, indent):
    lines = strip((DIR / 'pubs' / (name + '.svg')).read_text())
    text = '\n'.join(lines)
    local = set(re.findall(r'id="([\w-]+)"', text))
    rename = lambda i: 'fg-%s-%s-%s' % (name, place, i) if i in local else 'fg-' + i
    text = re.sub(r'id="([\w-]+)"', lambda m: 'id="%s"' % rename(m.group(1)), text)
    text = refs(text, rename)
    # A line traced in with stroke-dashoffset needs a length of 1.
    text = re.sub(r'<(\w+) class="([^"]*\ba-draw\b[^"]*)"', r'<\1 pathLength="1" class="\2"', text)
    # Browsers scale and turn a <use> placed with x and y around the wrong
    # point, so an icon's motion goes on a <g> around it.
    text = re.sub(r'<use class="([^"]*)"((?: style="[^"]*")?)([^>]*?)/>', r'<g class="\1"\2><use\3/></g>', text)
    pad = ' ' * indent
    body = '\n'.join(pad + l for l in text.splitlines())
    return ROOT_TAG + '\n' + body + '\n' + ' ' * (indent - 2) + '</svg>'


def main():
    html = PAGE.read_text()

    # 1. An <img> thumbnail that has a drawing in figures/pubs becomes a
    #    data-fig wrapper. Any other image (a real figure) is left alone.
    has = lambda m: (DIR / 'pubs' / (m.group(1) + '.svg')).exists()
    html = re.sub(r'<div class="pub-fig"><img src="assets/img/pubs/([\w-]+)\.\w+"[^>]*></div>',
                  lambda m: '<div class="pub-fig" data-fig="%s"></div>' % m.group(1) if has(m) else m.group(0), html)
    html = re.sub(r'<img class="thrust-fig" src="assets/img/pubs/([\w-]+)\.\w+"[^>]*>',
                  lambda m: '<div class="thrust-fig" data-fig="%s"></div>' % m.group(1) if has(m) else m.group(0), html)

    # 2. Fill every wrapper. The place (r for Research, p for Publications)
    #    keeps ids apart when one drawing appears twice.
    seen = {}

    def fill(m):
        kind, name, indent = m.group(2), m.group(3), len(m.group(1))
        place = 'r' if kind == 'thrust-fig' else 'p'
        seen[name, place] = seen.get((name, place), 0) + 1
        if seen[name, place] > 1:
            place += str(seen[name, place])
        return '%s<div class="%s" data-fig="%s">\n%s%s\n%s</div>' % (
            m.group(1), kind, name, ' ' * (indent + 2), figure(name, place, indent + 4), m.group(1))

    html, n = re.subn(r'(?m)^( *)<div class="(pub-fig|thrust-fig)" data-fig="([\w-]+)">.*?</div>',
                      fill, html, flags=re.S)

    # 3. Cards whose drawing moves are marked for main.js.
    html = re.sub(r'<div class="thrust">', '<div class="thrust m-card">', html)
    html = re.sub(r'<li class="pub((?: [\w-]+)*)"( id="[\w-]+")?>(\s*<div class="pub-fig")',
                  lambda m: '<li class="pub%s"%s>%s' % (
                      m.group(1) if 'm-card' in m.group(1) else m.group(1) + ' m-card',
                      m.group(2) or '', m.group(3)), html)

    # 4. The shared icons, once.
    block = SPRITE_START + '\n' + sprite() + '\n' + SPRITE_END
    if SPRITE_START in html:
        html = re.sub(re.escape(SPRITE_START) + '.*?' + re.escape(SPRITE_END), lambda m: block, html, flags=re.S)
    else:
        html = html.replace('\n<header class="top">', '\n' + block + '\n\n<header class="top">', 1)

    PAGE.write_text(html)
    print('%d figures placed' % n)


if __name__ == '__main__':
    main()
