"""Writes the Software section of index.html: six cards, each with an animated
SVG thumbnail of the tool.

    python3 figures/software.py

Replaces everything between <!-- software:start --> and <!-- software:end -->
in index.html. Edit the CARDS list below (names, text, tags, links) or the
drawing functions, then run it again.

The drawings carry class names that the stylesheet animates:
  a-draw   a line traces itself in        a-grow / a-growy  a bar grows
  a-pop    a mark pops in                 a-fade / a-slide  fades or slides in
  a-needle the gauge needle swings up     (all once, when the card scrolls into view)
  h-*      small loops that run while the card is hovered
--d sets a delay for the entrance; --w a delay for the hover loop.
"""

import math
import re
from pathlib import Path

INK, MUTED, LINE = '#2b2f36', '#5d636b', '#e1e5ea'
BLUE, RED, GREEN, AMBER, VIOLET = '#2f6fca', '#d24f38', '#2e9467', '#e3a21a', '#6f56c4'


def svg(body, label):
    return (f'<svg class="app-svg" viewBox="0 0 400 250" role="img" aria-label="{label}">'
            f'{body}</svg>')


def pin(x, y):
    return (f'<g transform="translate({x} {y})"><path d="M0 0C-6-7-9-11-9-15.5a9 9 0 0 1 18 0C9-11 6-7 0 0z" '
            f'fill="{INK}"/><circle cy="-15.5" r="3.4" fill="#fff"/></g>')


# --- DRUM: map with a pollution hotspot, two routes, the five route options ----
def drum():
    rows = [('Fastest', INK, False), ('Shortest', '#9aa1ab', False), ('Least exposure', GREEN, True),
            ('Least energy', BLUE, False), ('Balanced', AMBER, False)]
    panel = ''
    for k, (name, col, on) in enumerate(rows):
        y = 26 + k * 42
        fill, stroke = ('#e5f3ec', GREEN) if on else ('#fff', LINE)
        panel += (f'<g class="a-slide" style="--d:{.35 + k * .09:.2f}s">'
                  f'<rect x="262" y="{y}" width="124" height="32" rx="8" fill="{fill}" stroke="{stroke}"/>'
                  f'<path d="M272 {y + 16}h12" stroke="{col}" stroke-width="4" stroke-linecap="round"/>'
                  f'<text x="291" y="{y + 20.5}" class="t13">{name}</text></g>')
    green = 'M40 195H198V75H222'
    body = (
        '<defs><radialGradient id="ap-d-hot"><stop offset="0" stop-color="#d24f38" stop-opacity=".55"/>'
        '<stop offset="1" stop-color="#d24f38" stop-opacity="0"/></radialGradient>'
        '<clipPath id="ap-d-map"><rect x="14" y="14" width="236" height="222" rx="10"/></clipPath></defs>'
        '<g clip-path="url(#ap-d-map)">'
        '<rect x="14" y="14" width="236" height="222" fill="#e4e8ed"/>'
        '<path d="M14 72H250M14 132H250M14 192H250M66 14V236M132 14V236M198 14V236" stroke="#fff" stroke-width="9"/>'
        '<circle class="h-pulse" cx="132" cy="132" r="48" fill="url(#ap-d-hot)"/>'
        f'<path class="a-draw" pathLength="1" d="M40 189H132V69H222" fill="none" stroke="{INK}" stroke-width="5" stroke-linejoin="round" style="--d:.1s"/>'
        f'<path class="a-draw" pathLength="1" d="{green}" fill="none" stroke="{GREEN}" stroke-width="5" stroke-linejoin="round" style="--d:.45s"/>'
        f'<path class="h-march" d="{green}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 9" stroke-linecap="round"/>'
        '</g>' + pin(40, 192) + pin(222, 72) + panel)
    return svg(body, 'DRUM: a map with a pollution hotspot, the fastest route through it and the least-exposure route around it, and five route options')


# --- Survey: a choice card on a tablet, and the responses coming in --------------
def survey():
    def attrs(x0, widths):
        out = ''
        for k, (w, col) in enumerate(widths):
            y = 104 + k * 26
            out += f'<rect class="a-grow" style="--d:{.3 + k * .1:.2f}s" x="{x0}" y="{y}" width="{w}" height="8" rx="4" fill="{col}"/>'
        return out
    icons = (  # time, cost, air
        f'<circle cx="40" cy="108" r="6" fill="none" stroke="{INK}" stroke-width="1.8"/><path d="M40 104.5V108l2.5 1.5" stroke="{INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
        f'<circle cx="40" cy="134" r="6" fill="none" stroke="{INK}" stroke-width="1.8"/><path d="M40 130.5v7" stroke="{INK}" stroke-width="1.8" stroke-linecap="round"/>'
        f'<path d="M34 157c2-2 4 2 6 0s4-2 6 0M34 162c2-2 4 2 6 0s4-2 6 0" stroke="{RED}" stroke-width="1.6" fill="none" stroke-linecap="round"/>')
    body = (
        f'<rect x="14" y="14" width="236" height="222" rx="14" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
        '<text x="30" y="44" class="t14 b">Which route would you take?</text>'
        f'<rect x="56" y="62" width="84" height="118" rx="10" fill="#fff" stroke="{LINE}"/>'
        f'<rect x="150" y="62" width="84" height="118" rx="10" fill="#fff" stroke="{LINE}"/>'
        f'<rect class="h-selA" x="56" y="62" width="84" height="118" rx="10" fill="none" stroke="{GREEN}" stroke-width="2.5" opacity="0"/>'
        f'<rect class="h-selB" x="150" y="62" width="84" height="118" rx="10" fill="#f1f8f4" fill-opacity=".6" stroke="{GREEN}" stroke-width="2.5"/>'
        '<text x="66" y="84" class="t13 b">Route A</text><text x="160" y="84" class="t13 b">Route B</text>'
        + icons
        + attrs(66, [(40, '#9aa1ab'), (22, '#9aa1ab'), (52, RED)])
        + attrs(160, [(58, '#9aa1ab'), (34, '#9aa1ab'), (18, RED)])
        + f'<rect x="170" y="196" width="64" height="26" rx="13" fill="{BLUE}"/><text x="202" y="213.5" class="t13 b" text-anchor="middle" fill="#fff">Next</text>'
        '<text x="266" y="40" class="t13" fill="#5d636b">Responses</text>'
        f'<path d="M266 202H386" stroke="{LINE}" stroke-width="2"/>'
        '<rect class="a-growy" style="--d:.5s" x="284" y="120" width="34" height="82" rx="5" fill="#b8bfc8"/>'
        f'<rect class="a-growy" style="--d:.65s" x="336" y="72" width="34" height="130" rx="5" fill="{GREEN}"/>'
        '<text x="301" y="222" class="t13 b" text-anchor="middle">A</text><text x="353" y="222" class="t13 b" text-anchor="middle">B</text>')
    return svg(body, 'Survey platform: a stated-choice question comparing two routes on time, cost and air quality, and a live chart of responses')


# --- Next-day PM2.5: observed series, today, tomorrow's forecast ------------------
def forecast():
    pts = []
    for i in range(16):
        v = .45 + .14 * math.sin(i * .75) + .08 * math.sin(i * 1.9) + .25 * math.exp(-((i - 9) / 2) ** 2)
        pts.append((40 + i * 15, 190 - v * 130))
    obs = 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in pts)
    x0, y0 = pts[-1]
    fy = y0 - 22
    body = (
        f'<path d="M36 26V198H304" fill="none" stroke="#c3c9d0" stroke-width="1.6"/>'
        + ''.join(f'<path d="M{40 + i * 30} 198v5" stroke="#c3c9d0" stroke-width="1.6"/>' for i in range(9))
        + f'<path d="M{x0} 30V198" stroke="#9aa1ab" stroke-width="1.4" stroke-dasharray="4 4"/>'
        f'<path class="a-draw" pathLength="1" d="{obs}" fill="none" stroke="{INK}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" style="--d:.1s"/>'
        f'<path class="a-fade" style="--d:1.1s" d="M{x0} {y0}L{x0 + 30} {fy - 20}V{fy + 20}Z" fill="{RED}" fill-opacity=".16"/>'
        f'<path class="a-fade" style="--d:1.1s" d="M{x0} {y0}L{x0 + 30} {fy}" stroke="{RED}" stroke-width="2.6" stroke-dasharray="5 4"/>'
        f'<circle class="a-pop h-pulse" style="--d:1.3s" cx="{x0 + 30}" cy="{fy}" r="6.5" fill="{RED}"/>'
        f'<text x="{x0}" y="222" class="t13" text-anchor="middle" fill="#5d636b">Today</text>'
        '<text x="44" y="42" class="t13 b">PM<tspan dy="3" font-size="9.5">2.5</tspan></text>'
        # a globe: the viewer covers cities worldwide
        '<g class="a-fade" style="--d:.2s">'
        f'<circle cx="350" cy="84" r="34" fill="#eaf2fb" stroke="#c7d6ea" stroke-width="1.5"/>'
        '<ellipse cx="350" cy="84" rx="14" ry="34" fill="none" stroke="#c7d6ea" stroke-width="1.3"/>'
        '<path d="M316 84H384M320 68H380M320 100H380" stroke="#c7d6ea" stroke-width="1.3"/></g>'
        + ''.join(f'<circle class="a-pop h-pulse" style="--d:{.4 + k * .12:.2f}s;--w:{k * .25:.2f}s" cx="{cx}" cy="{cy}" r="3.6" fill="{c}"/>'
                  for k, (cx, cy, c) in enumerate([(338, 72, RED), (362, 90, AMBER), (344, 104, GREEN), (366, 66, RED)]))
        + '<text x="350" y="148" class="t14 b" text-anchor="middle">Next day</text>'
        '<text x="350" y="170" class="t13" text-anchor="middle" fill="#5d636b">forecast</text>')
    return svg(body, 'Next-day PM2.5 forecasting: an observed pollution series up to today, a forecast point for tomorrow with its uncertainty band, and a globe of cities')


# --- India air-quality dashboard: a gauge and city bars ---------------------------
def dashboard():
    cx, cy, r = 102, 170, 62
    segs = [GREEN, '#86a83a', AMBER, '#df7a2e', RED]
    arcs = ''
    for k, col in enumerate(segs):
        a0, a1 = math.pi + k * math.pi / 5, math.pi + (k + 1) * math.pi / 5 - .03
        x0, y0 = cx + r * math.cos(a0), cy + r * math.sin(a0)
        x1, y1 = cx + r * math.cos(a1), cy + r * math.sin(a1)
        arcs += f'<path d="M{x0:.1f} {y0:.1f}A{r} {r} 0 0 1 {x1:.1f} {y1:.1f}" fill="none" stroke="{col}" stroke-width="13"/>'
    ang = math.pi + .72 * math.pi
    nx, ny = cx + 48 * math.cos(ang), cy + 48 * math.sin(ang)
    bars = ''
    for k, (w, col) in enumerate([(118, RED), (104, '#df7a2e'), (90, '#df7a2e'), (72, AMBER), (56, '#86a83a'), (40, GREEN)]):
        y = 64 + k * 26
        bars += (f'<rect x="206" y="{y}" width="28" height="10" rx="3" fill="#e1e5ea"/>'
                 f'<rect class="a-grow" style="--d:{.25 + k * .08:.2f}s" x="242" y="{y}" width="{w}" height="10" rx="5" fill="{col}"/>')
    body = (
        f'<rect x="14" y="14" width="372" height="222" rx="12" fill="#fff" stroke="{LINE}"/>'
        '<path d="M14 26a12 12 0 0 1 12-12h348a12 12 0 0 1 12 12V42H14z" fill="#f1f3f5"/>'
        + ''.join(f'<circle cx="{30 + k * 12}" cy="28" r="3.5" fill="#cfd4da"/>' for k in range(3))
        + '<text x="72" y="33" class="t13 b">Air quality, India</text>'
        f'<circle class="h-pulse" cx="364" cy="28" r="4" fill="{GREEN}"/>'
        + arcs
        + f'<g class="a-needle h-swing"><path d="M{cx} {cy}L{nx:.1f} {ny:.1f}" stroke="{INK}" stroke-width="3.2" stroke-linecap="round"/></g>'
        f'<circle cx="{cx}" cy="{cy}" r="6" fill="{INK}"/>'
        f'<text x="{cx}" y="{cy + 30}" class="t14 b" text-anchor="middle">AQI</text>'
        + bars)
    return svg(body, 'India air-quality dashboard: an AQI gauge and bars comparing cities')


# --- Cycling and motorcycle mode share: a globe of cities and stacked bars --------
def modeshare():
    dots = [(70, 92, GREEN), (118, 80, AMBER), (92, 132, AMBER), (140, 120, GREEN), (60, 150, GREEN),
            (126, 164, AMBER), (100, 100, GREEN), (150, 150, AMBER)]
    bars = ''
    for k, g in enumerate([.62, .38, .5, .24, .7]):
        y = 78 + k * 28
        gw = 176 * g
        bars += (f'<g class="a-grow" style="--d:{.3 + k * .08:.2f}s">'
                 f'<rect x="204" y="{y}" width="{gw:.1f}" height="14" rx="3" fill="{GREEN}"/>'
                 f'<rect x="{204 + gw:.1f}" y="{y}" width="{176 - gw:.1f}" height="14" rx="3" fill="{AMBER}"/></g>')
    moto = (f'<g stroke="{AMBER}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">'
            '<circle cx="292" cy="40" r="5"/><circle cx="310" cy="40" r="5"/><path d="M292 40l6-8h8l4 8M298 32l-2-4h-4M306 32l3-5"/></g>')
    bike = (f'<g stroke="{GREEN}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">'
            '<circle cx="210" cy="40" r="5"/><circle cx="228" cy="40" r="5"/><path d="M210 40l5-9h9l4 9M215 31l4 9M224 31v-4"/></g>')
    body = (
        '<g class="a-fade" style="--d:.1s">'
        '<circle cx="104" cy="125" r="86" fill="#eaf2fb" stroke="#c7d6ea" stroke-width="1.5"/>'
        '<ellipse cx="104" cy="125" rx="34" ry="86" fill="none" stroke="#c7d6ea" stroke-width="1.3"/>'
        '<ellipse cx="104" cy="125" rx="66" ry="86" fill="none" stroke="#c7d6ea" stroke-width="1.3"/>'
        '<path d="M18 125H190M28 85H180M28 165H180" stroke="#c7d6ea" stroke-width="1.3"/></g>'
        + ''.join(f'<circle class="a-pop h-float" style="--d:{.3 + k * .07:.2f}s;--w:{k * .2:.2f}s" cx="{x}" cy="{y}" r="6" fill="{c}" stroke="#fff" stroke-width="2"/>'
                  for k, (x, y, c) in enumerate(dots))
        + bike + '<text x="238" y="45" class="t13">Cycling</text>'
        + moto + '<text x="320" y="45" class="t13">Motorcycle</text>'
        + bars)
    return svg(body, 'Cycling and motorcycle mode-share dashboard: cities on a globe and the share of each mode by city')


# --- Bharat Districts Explorer: an abstract hex grid of districts, one selected ---
def districts():
    r = 12.5
    w, h = math.sqrt(3) * r, 1.5 * r
    shades = ['#dce8f8', '#b8d0f0', '#8db2e3', '#5b8fd2', '#2f6fca', '#1f4f99']
    hexes = ''
    chosen = None
    for row in range(10):
        for col in range(10):
            x = 30 + col * w + (w / 2 if row % 2 else 0)
            y = 30 + row * h
            # an irregular blob, not any real outline
            d = math.hypot((x - 126) / 100, (y - 122) / 92) + .12 * math.sin(col * 1.3 + row * .7)
            if d > .98 or x > 236:
                continue
            v = .5 + .35 * math.sin(x / 38) * math.cos(y / 44) + .15 * math.sin((x + y) / 23)
            fill = shades[max(0, min(5, int(v * 6)))]
            pts = ' '.join(f'{x + r * math.cos(math.radians(60 * i - 30)):.1f},{y + r * math.sin(math.radians(60 * i - 30)):.1f}'
                           for i in range(6))
            delay = math.hypot(x - 60, y - 60) / 420
            hexes += (f'<polygon class="a-pop h-wave" style="--d:{delay:.2f}s;--w:{x / 260:.2f}s" points="{pts}" '
                      f'fill="{fill}" stroke="#fff" stroke-width="1.5"/>')
            if chosen is None and 150 < x < 175 and 105 < y < 125:
                chosen = (x, y, pts)
    x, y, pts = chosen
    card = (
        '<g class="a-slide" style="--d:.7s">'
        f'<rect x="262" y="44" width="124" height="138" rx="10" fill="#fff" stroke="{LINE}"/>'
        '<text x="276" y="70" class="t14 b">District</text>'
        + ''.join(f'<rect x="276" y="{86 + k * 30}" width="40" height="7" rx="3.5" fill="#e1e5ea"/>'
                  f'<rect class="a-grow" style="--d:{.9 + k * .1:.2f}s" x="276" y="{97 + k * 30}" width="{w_}" height="8" rx="4" fill="{BLUE}"/>'
                  for k, w_ in enumerate([92, 60, 78]))
        + '</g>')
    body = (
        hexes
        + f'<polygon points="{pts}" fill="none" stroke="{INK}" stroke-width="2.6"/>'
        f'<path class="a-fade" style="--d:.7s" d="M{x + 9:.1f} {y:.1f}H262" stroke="{INK}" stroke-width="1.6" stroke-dasharray="3 3"/>'
        + card
        + '<defs><linearGradient id="ap-b-leg"><stop offset="0" stop-color="#dce8f8"/><stop offset="1" stop-color="#1f4f99"/></linearGradient></defs>'
        '<rect x="262" y="204" width="124" height="8" rx="4" fill="url(#ap-b-leg)"/>')
    return svg(body, 'Bharat Districts Explorer: a grid of districts shaded by a statistic, with one district selected and its values shown')


OUT = '<svg class="i" aria-hidden="true"><use href="#i-out"></use></svg>'
CODE = '<svg class="i" aria-hidden="true"><use href="#i-code"></use></svg>'

CARDS = [
    dict(name='DRUM', sub='Dynamic Routing for Urban Mobility', url='https://leap-routing-iitkgp.vercel.app/', live=True,
         text='Pollution-aware route planning for commuters: five routes from live air-quality and traffic data, including the least-exposure and least-energy options.',
         cred='<a class="badge badge--patent" href="#patent">Patent</a><a class="badge badge--press" href="#media">The Hindu</a><a class="badge" href="#j5">TRR 2025</a>',
         tags=['React', 'Python', 'GraphHopper', 'Mapbox'],
         links=[('Open app', 'https://leap-routing-iitkgp.vercel.app/', OUT), ('Code', 'https://github.com/orgs/clean-route/repositories', CODE)],
         draw=drum),
    dict(name='Choice experiment platform', sub='Stated-preference surveys', url='https://survey-iitkgp.vercel.app/', live=True,
         text='Adaptive choice experiments with live response analysis. The instrument behind the two-wave panel of 723 Kolkata commuters.',
         tags=['React', 'Node.js', 'MongoDB'],
         links=[('Open app', 'https://survey-iitkgp.vercel.app/', OUT)],
         draw=survey),
    dict(name='Next-day PM<sub>2.5</sub> forecasting', sub='Machine learning', url='https://kapil2020.github.io/global-PM-2.5-next-day-forecasting/', live=True,
         text='Machine-learning forecasts of next-day fine particulate concentrations for cities worldwide, in an interactive viewer.',
         tags=['Python', 'scikit-learn'],
         links=[('Open viewer', 'https://kapil2020.github.io/global-PM-2.5-next-day-forecasting/', OUT),
                ('Code', 'https://github.com/kapil2020/global-PM-2.5-next-day-forecasting', CODE)],
         draw=forecast),
    dict(name='India air-quality dashboard', sub='Real-time monitoring', url='https://github.com/kapil2020/india-air-quality-dashboard', live=False,
         text='City-level analysis of real-time air quality across India.',
         tags=['Streamlit', 'Plotly'],
         links=[('Code', 'https://github.com/kapil2020/india-air-quality-dashboard', CODE)],
         draw=dashboard),
    dict(name='Mode-share dashboard', sub='Cycling and motorcycles', url='https://kapil2020.github.io/cycling-dashboard/', live=True,
         text='Cycling and motorcycle mode share in cities worldwide, with a model that predicts it.',
         tags=['JavaScript', 'Machine learning'],
         links=[('Open dashboard', 'https://kapil2020.github.io/cycling-dashboard/', OUT),
                ('Code', 'https://github.com/kapil2020/cycling-dashboard', CODE)],
         draw=modeshare),
    dict(name='Bharat Districts Explorer', sub='Spatial data', url='https://kapil2020.github.io/Bharat-Districts-Explorer/', live=True,
         text='District-level demographic and spatial data for India, explored on an interactive map.',
         tags=['D3.js'],
         links=[('Open explorer', 'https://kapil2020.github.io/Bharat-Districts-Explorer/', OUT)],
         draw=districts),
]


def card(c):
    live = ' <span class="app-live">Live</span>' if c['live'] else ''
    cred = f'\n      <p class="app-cred">{c["cred"]}</p>' if c.get('cred') else ''
    tags = ''.join(f'<li>{t}</li>' for t in c['tags'])
    links = ''.join(f'<a href="{u}">{label} {icon}</a>' for label, u, icon in c['links'])
    return f'''  <article class="app">
    <a class="app-fig" href="{c['url']}" tabindex="-1" aria-hidden="true">
      {c['draw']()}
    </a>
    <div class="app-body">
      <p class="app-sub">{c['sub']}</p>
      <h3 class="app-name"><a href="{c['url']}">{c['name']}</a>{live}</h3>
      <p class="app-text">{c['text']}</p>{cred}
      <ul class="app-tags">{tags}</ul>
      <p class="app-links">{links}</p>
    </div>
  </article>'''


def main():
    section = ('<!-- software:start -->\n<section id="software">\n'
               '  <div class="sec-head">\n    <h2>Software</h2>\n'
               '    <p class="aside">Tools built from the research, most of them live.</p>\n  </div>\n'
               '  <div class="apps">\n' + '\n'.join(card(c) for c in CARDS) + '\n  </div>\n</section>\n<!-- software:end -->')
    page = Path(__file__).resolve().parent.parent / 'index.html'
    html = page.read_text()
    new, n = re.subn(r'<!-- software:start -->.*?<!-- software:end -->', lambda m: section, html, flags=re.S)
    if n != 1:
        raise SystemExit('index.html needs one <!-- software:start --> ... <!-- software:end --> block')
    page.write_text(new)
    print('wrote the Software section')


if __name__ == '__main__':
    main()
