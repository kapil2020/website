/* Research in 30 seconds.
 *
 * Six five-second scenes (the problem, measure, model, learn, deliver,
 * impact) drawn in SVG and driven by one clock, render(t). Everything on
 * screen is a function of t, so the story can be paused, scrubbed from the
 * scene bar, and exported frame by frame (window.__story.seek).
 *
 * Numbers shown are from the papers: 723 commuters, two seasons, 5,224
 * choices; air quality weighs about four times more in winter; DRUM's
 * least-exposure route cut exposure by half for 40% more travel time in
 * simulations for Central Delhi. The rest is illustration. */

(function () {
  'use strict';

  var fig = document.querySelector('[data-story]');
  if (!fig) return;
  var svg = fig.querySelector('svg');
  var bar = fig.querySelector('.story-bar');
  var btn = fig.querySelector('.story-play');

  var DUR = 30, LEN = 5, N = 6;
  var INK = '#2b2f36', MUTED = '#5d636b', GREY = '#a3aab3', LINE = '#e1e5ea',
      BLUE = '#2f6fca', RED = '#d24f38', GREEN = '#2e9467', AMBER = '#e3a21a', VIOLET = '#6f56c4';
  var NAMES = ['The problem', 'Measure', 'Model', 'Learn', 'Deliver', 'Impact'];

  /* ---- Shared drawing ---------------------------------------------------- */

  var DEFS =
    '<defs>' +
    '<radialGradient id="st-hot"><stop offset="0" stop-color="' + RED + '" stop-opacity=".6"/><stop offset="1" stop-color="' + RED + '" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="st-smog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9826f" stop-opacity=".55"/><stop offset="1" stop-color="#d9826f" stop-opacity="0"/></linearGradient>' +
    '<clipPath id="st-map"><rect x="28" y="124" width="344" height="192" rx="12"/></clipPath>' +
    '<clipPath id="st-screen"><rect x="142" y="150" width="116" height="276" rx="6"/></clipPath>' +
    '<symbol id="st-person" viewBox="0 0 32 32"><circle cx="16" cy="7.5" r="5" fill="currentColor"/><path d="M7 31v-8a9 9 0 0 1 18 0v8z" fill="currentColor"/></symbol>' +
    '<symbol id="st-walk" viewBox="0 0 32 32"><circle cx="17.5" cy="4.5" r="3.5" fill="currentColor"/><path d="M16.5 10 14 19l-4 10M14 19l5 3 1 7M16.5 10l-5 4-1 5M16.5 10l4 5 4 1" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></symbol>' +
    '<symbol id="st-bus" viewBox="0 0 32 32"><g fill="#fff" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="2" y="6" width="28" height="18" rx="3"/><path d="M2 14h28M9 6v8M16 6v8M23 6v8" fill="none"/></g><circle cx="9" cy="24.5" r="3.2" fill="currentColor"/><circle cx="23" cy="24.5" r="3.2" fill="currentColor"/></symbol>' +
    '<symbol id="st-car" viewBox="0 0 32 32"><path d="M3 22v-5l3-1.5L10.5 10h10l5 5.5 3.5 1.5v5z" fill="#fff" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M11 15.5h14" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="23" r="3.2" fill="currentColor"/><circle cx="23" cy="23" r="3.2" fill="currentColor"/></symbol>' +
    '<symbol id="st-auto" viewBox="0 0 32 32"><path d="M5 23V13a7 7 0 0 1 7-7h8l6 9h2v8z" fill="#fff" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M5 15h15V6" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="10" cy="24" r="3.2" fill="currentColor"/><circle cx="25" cy="24" r="3.2" fill="currentColor"/></symbol>' +
    '<symbol id="st-bike" viewBox="0 0 32 32"><g fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="22" r="5.5"/><circle cx="25" cy="22" r="5.5"/><path d="M7 22 12 12h10l-7 10zM12 12l3 10M22 12l3 10M22 12V8h3M10 11h4"/></g></symbol>' +
    '<symbol id="st-sensor" viewBox="0 0 32 32"><g fill="#fff" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="10" y="14" width="12" height="15" rx="2"/><path d="M12 9.5a6 6 0 0 1 8 0M8.5 5.5a11 11 0 0 1 15 0" fill="none"/></g><circle cx="16" cy="21.5" r="2.4" fill="currentColor"/></symbol>' +
    '<symbol id="st-sun" viewBox="0 0 32 32"><circle cx="16" cy="16" r="7" fill="currentColor"/><path d="M16 1.5v4.5M16 26v4.5M1.5 16H6M26 16h4.5M5.7 5.7l3.2 3.2M23.1 23.1l3.2 3.2M5.7 26.3l3.2-3.2M23.1 8.9l3.2-3.2" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol>' +
    '<symbol id="st-haze" viewBox="0 0 32 32"><path d="M3 9c3.5-3 7.5 3 11 0s7.5-3 11 0M3 16c3.5-3 7.5 3 11 0s7.5-3 11 0M3 23c3.5-3 7.5 3 11 0s7.5-3 11 0" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol>' +
    '<symbol id="st-check" viewBox="0 0 32 32"><path d="M6 17l6.5 6.5L26 9" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>' +
    '<symbol id="st-pin" viewBox="0 0 32 32"><path d="M16 31s-10-10-10-18a10 10 0 0 1 20 0c0 8-10 18-10 18z" fill="currentColor"/><circle cx="16" cy="13" r="4" fill="#fff"/></symbol>' +
    '</defs>';

  function head(kicker, color, l1, l2) {
    return '<text class="st-k" x="28" y="44" fill="' + color + '">' + kicker + '</text>' +
      '<text class="st-h" x="28" y="74">' + l1 + '</text>' +
      '<text class="st-h" x="28" y="103">' + l2 + '</text>';
  }
  function icon(id, x, y, s, color, cls) {
    return '<use href="#st-' + id + '" x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '" color="' + color + '"' + (cls ? ' class="' + cls + '"' : '') + '/>';
  }

  /* Scene 1 — the problem: a commute through smog and heat. */
  var buildings = [[20, 40, 92], [64, 30, 122], [98, 44, 70], [146, 28, 142], [178, 50, 96],
                   [232, 34, 128], [270, 46, 80], [320, 30, 112], [354, 34, 76]];
  var VEH = [ // icon, size, start x, speed px/s, lane y
    ['bus', 44, 10, 52, 316], ['auto', 34, 250, 52, 323],
    ['car', 38, 130, 74, 342], ['bike', 32, 360, 38, 348]];
  var s1 =
    head('The problem', RED, 'Commuters face polluted air', 'and heat on every trip') +
    '<g fill="#e1e5ea">' + buildings.map(function (b) {
      return '<rect x="' + b[0] + '" y="' + (322 - b[2]) + '" width="' + b[1] + '" height="' + b[2] + '"/>';
    }).join('') + '</g>' +
    '<rect class="s1-smog" x="0" y="140" width="400" height="190" fill="url(#st-smog)"/>' +
    '<g class="s1-sun">' + icon('sun', -25, -25, 50, AMBER) + '</g>' +
    '<g class="s1-heat" stroke="' + AMBER + '" stroke-width="2.2" fill="none" stroke-linecap="round">' +
      [206, 252, 298].map(function (x) { return '<path d="M' + x + ' 0c4-4 8 4 12 0s8-4 12 0"/>'; }).join('') + '</g>' +
    '<rect x="0" y="322" width="400" height="56" fill="#d3d8de"/>' +
    '<path class="s1-dash" d="M0 350H400" stroke="#fff" stroke-width="3" stroke-dasharray="18 14"/>' +
    '<rect x="0" y="378" width="400" height="18" fill="#e7eaee"/>' +
    VEH.map(function (v, i) {
      return '<g class="s1-veh" data-i="' + i + '"><circle class="s1-puff" cx="-2" cy="' + v[1] * .72 + '" r="15" fill="url(#st-hot)"/>' + icon(v[0], 0, 0, v[1], INK) + '</g>';
    }).join('') +
    '<g class="s1-walk">' + icon('walk', 0, 0, 34, INK) + '</g>' +
    '<text class="st-l" x="28" y="428">Air pollution</text><rect x="136" y="419" width="236" height="10" rx="5" fill="#e3e7ec"/><rect class="s1-g1" x="136" y="419" width="0" height="10" rx="5" fill="' + RED + '"/>' +
    '<text class="st-l" x="28" y="452">Heat</text><rect x="136" y="443" width="236" height="10" rx="5" fill="#e3e7ec"/><rect class="s1-g2" x="136" y="443" width="0" height="10" rx="5" fill="' + AMBER + '"/>';

  /* Scene 2 — measure: sensors on the road, surveys of the same people. */
  var trace = [];
  for (var i = 0; i <= 40; i++) {
    var v = .34 + .1 * Math.sin(i * .7) + .06 * Math.sin(i * 1.9) +
      .42 * Math.exp(-Math.pow((i - 12) / 2.2, 2)) + .32 * Math.exp(-Math.pow((i - 29) / 2.6, 2));
    trace.push((i ? 'L' : 'M') + (112 + i * 6.5).toFixed(1) + ' ' + (244 - v * 100).toFixed(1));
  }
  var tiles = [['person', BLUE, 'commuters', 's2-n1', '0'], ['', '', 'seasons', '', '2'], ['check', GREEN, 'choices', 's2-n3', '0']];
  var s2 =
    head('Measure', GREEN, 'I collect the data myself:', 'sensors and surveys') +
    icon('person', 22, 150, 62, INK) +
    '<circle class="s2-ring" cx="92" cy="165" r="10" fill="none" stroke="' + RED + '" stroke-width="2"/>' +
    icon('sensor', 78, 150, 30, RED) +
    '<text class="st-s" x="56" y="234" text-anchor="middle">On-road sensor</text>' +
    '<path d="M112 138V246H374" fill="none" stroke="#c3c9d0" stroke-width="1.6"/>' +
    '<path d="M112 189H374" stroke="' + RED + '" stroke-width="1.4" stroke-dasharray="4 4" opacity=".6"/>' +
    '<text class="st-s" x="120" y="152">PM<tspan dy="3" font-size="10">2.5</tspan></text>' +
    '<path class="s2-trace" d="' + trace.join('') + '" fill="none" stroke="' + RED + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>' +
    tiles.map(function (tl, k) {
      var x = 28 + k * 118;
      var ic = k === 1 ? icon('haze', x + 14, 302, 24, RED) + icon('sun', x + 42, 302, 24, AMBER) : icon(tl[0], x + 14, 302, 24, tl[1]);
      return '<g class="s2-tile">' +
        '<rect x="' + x + '" y="290" width="108" height="110" rx="12" fill="#fff" stroke="' + LINE + '"/>' + ic +
        '<text class="st-n' + (tl[3] ? ' ' + tl[3] : '') + '" x="' + (x + 14) + '" y="364">' + tl[4] + '</text>' +
        '<text class="st-l" x="' + (x + 14) + '" y="388">' + tl[2] + '</text></g>';
    }).join('') +
    '<text class="st-s s2-foot" x="200" y="436" text-anchor="middle">A two-wave panel in Kolkata, winter and summer</text>';

  /* Scene 3 — model: what the choice models found. */
  var SWITCH = [0, 2, 3, 6, 8];
  var s3 =
    head('Model', BLUE, 'Choice models show who', 'reroutes for cleaner air') +
    '<text class="st-l" x="28" y="150">Weight on air quality in route choice</text>' +
    icon('sun', 28, 164, 20, AMBER) + '<text class="st-b" x="54" y="180">Summer</text>' +
    '<rect x="132" y="168" width="212" height="14" rx="7" fill="#e3e7ec"/><rect class="s3-b1" x="132" y="168" width="0" height="14" rx="7" fill="' + AMBER + '"/>' +
    '<text class="st-b s3-v1" x="0" y="180">1×</text>' +
    icon('haze', 28, 202, 20, RED) + '<text class="st-b" x="54" y="218">Winter</text>' +
    '<rect x="132" y="206" width="212" height="14" rx="7" fill="#e3e7ec"/><rect class="s3-b2" x="132" y="206" width="0" height="14" rx="7" fill="' + RED + '"/>' +
    '<text class="st-b s3-v2" x="0" y="218">~4×</text>' +
    '<text class="st-l" x="28" y="268">Commuters are not alike</text>' +
    Array.apply(null, Array(10)).map(function (_, k) {
      return '<g class="s3-p" data-k="' + k + '">' + icon('person', 26 + k * 34.8, 282, 30, GREY) + '</g>';
    }).join('') +
    '<g class="s3-leg"><circle cx="34" cy="340" r="6" fill="' + GREEN + '"/><text class="st-s" x="46" y="345">switch to a cleaner route</text>' +
    '<circle cx="240" cy="340" r="6" fill="' + INK + '"/><text class="st-s" x="252" y="345">stay</text></g>' +
    '<g class="s3-chip"><rect x="28" y="378" width="344" height="36" rx="18" fill="#fff" stroke="' + LINE + '"/>' +
    '<text class="st-s" x="200" y="401" text-anchor="middle">Hybrid latent class · ICLV · mixed logit</text></g>';

  /* Scene 4 — learn: sparse sensors to a full field; images to a graph. */
  var SENS = [[74, 206, .95], [150, 282, .55], [236, 176, 1], [312, 272, .7], [348, 148, .45], [190, 232, .85]];
  function mix(a, b, k) {
    var pa = [1, 3, 5].map(function (j) { return parseInt(a.substr(j, 2), 16); });
    var pb = [1, 3, 5].map(function (j) { return parseInt(b.substr(j, 2), 16); });
    return 'rgb(' + pa.map(function (c, j) { return Math.round(c + (pb[j] - c) * k); }).join(',') + ')';
  }
  function heat(v) { return v < .5 ? mix(GREEN, AMBER, v / .5) : mix(AMBER, RED, (v - .5) / .5); }
  var cells = '';
  for (var r = 0; r < 6; r++) for (var c = 0; c < 10; c++) {
    var cx = 28 + c * 34.4 + 17.2, cy = 124 + r * 32 + 16, ws = 0, vs = 0, near = 1e9;
    SENS.forEach(function (p) {
      var d2 = (p[0] - cx) * (p[0] - cx) + (p[1] - cy) * (p[1] - cy);
      var w = 1 / (d2 + 400); ws += w; vs += w * p[2]; near = Math.min(near, Math.sqrt(d2));
    });
    var val = (vs / ws - .45) / .55;
    cells += '<rect class="s4-cell" data-d="' + (near / 260).toFixed(3) + '" x="' + (28 + c * 34.4 + 1) + '" y="' + (124 + r * 32 + 1) +
      '" width="32.4" height="30" fill="' + heat(Math.max(0, Math.min(1, val))) + '" opacity="0"/>';
  }
  var L1 = [[62, 358], [62, 382], [62, 406]], L2 = [[110, 350], [110, 372], [110, 394], [110, 416]], L3 = [[158, 370], [158, 396]];
  var nnEdges = '';
  [[L1, L2], [L2, L3]].forEach(function (pair) {
    pair[0].forEach(function (a) { pair[1].forEach(function (b) { nnEdges += 'M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1]; }); });
  });
  var s4 =
    head('Learn', VIOLET, 'Interpretable AI fills', 'gaps in sparse data') +
    '<rect x="28" y="124" width="344" height="192" rx="12" fill="#e9edf2"/>' +
    '<g clip-path="url(#st-map)">' + cells +
      '<path d="M28 188H372M28 252H372M97 124V316M200 124V316M303 124V316" stroke="#fff" stroke-width="4" opacity=".75"/></g>' +
    SENS.map(function (p, k) {
      return '<g class="s4-s" data-k="' + k + '" transform="translate(' + p[0] + ' ' + p[1] + ')">' +
        '<circle class="s4-ring" r="8" fill="none" stroke="' + INK + '" stroke-width="1.6"/>' +
        '<circle r="6" fill="' + INK + '" stroke="#fff" stroke-width="2"/></g>';
    }).join('') +
    '<rect x="38" y="134" width="132" height="26" rx="13" fill="#fff"/>' +
    '<text class="st-s s4-c1" x="104" y="152" text-anchor="middle">6 sparse sensors</text>' +
    '<text class="st-s s4-c2" x="104" y="152" text-anchor="middle">Estimated field</text>' +
    '<g class="s4-nn"><rect x="28" y="330" width="164" height="122" rx="12" fill="#fff" stroke="' + LINE + '"/>' +
      '<path d="' + nnEdges + '" stroke="#d6cff2" stroke-width="1.4"/>' +
      L1.concat(L2, L3).map(function (n, k) {
        var layer = k < 3 ? 0 : k < 7 ? 1 : 2;
        return '<circle class="s4-node" data-l="' + layer + '" cx="' + n[0] + '" cy="' + n[1] + '" r="7" fill="' + VIOLET + '"/>';
      }).join('') +
      '<text class="st-s" x="110" y="442" text-anchor="middle">Deep learning</text></g>' +
    '<g class="s4-img"><rect x="208" y="330" width="164" height="122" rx="12" fill="#fff" stroke="' + LINE + '"/>' +
      '<rect x="216" y="338" width="148" height="80" rx="6" fill="#d3d8de"/>' +
      '<path d="M216 378H364" stroke="#fff" stroke-width="2" stroke-dasharray="8 6"/>' +
      '<rect x="228" y="350" width="32" height="15" rx="4" fill="' + BLUE + '"/>' +
      '<rect x="270" y="354" width="17" height="8" rx="4" fill="' + VIOLET + '"/>' +
      '<rect x="296" y="386" width="52" height="17" rx="3" fill="' + AMBER + '"/>' +
      '<rect x="236" y="388" width="19" height="14" rx="4" fill="' + GREEN + '"/>' +
      '<g class="s4-box" fill="none" stroke="' + VIOLET + '" stroke-width="1.6" stroke-dasharray="3 3">' +
        '<rect x="224" y="346" width="40" height="23" rx="3"/><rect x="266" y="350" width="25" height="16" rx="3"/>' +
        '<rect x="292" y="382" width="60" height="25" rx="3"/><rect x="232" y="384" width="27" height="22" rx="3"/></g>' +
      '<path class="s4-graph" d="M244 357L278 358L322 394L245 395L244 357" fill="none" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<text class="st-s" x="290" y="442" text-anchor="middle">Image › graph › LLM</text></g>';

  /* Scene 5 — deliver: DRUM on a phone, two routes, the result. */
  var s5 =
    head('Deliver', GREEN, 'DRUM turns it into routes', 'commuters can use') +
    '<g class="s5-phone">' +
      '<rect x="132" y="122" width="136" height="328" rx="22" fill="#fff" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M186 136H214" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
      '<g clip-path="url(#st-screen)">' +
        '<rect x="142" y="150" width="116" height="276" fill="#eef1f4"/>' +
        '<path d="M142 214H258M142 280H258M142 346H258M142 404H258M168 150V426M200 150V426M232 150V426" stroke="#fff" stroke-width="6"/>' +
        '<circle class="s5-hot" cx="200" cy="286" r="44" fill="url(#st-hot)"/>' +
        '<rect x="142" y="150" width="116" height="24" fill="#fff"/>' +
        '<text x="152" y="167" class="st-b" style="font-size:14px">DRUM</text>' +
        '<path class="s5-r1" d="M158 404H200V214H242" fill="none" stroke="' + INK + '" stroke-width="4.5" stroke-linejoin="round"/>' +
        '<path class="s5-r2" d="M158 409H246V214" fill="none" stroke="' + GREEN + '" stroke-width="4.5" stroke-linejoin="round"/>' +
      '</g>' +
      icon('pin', 146, 380, 24, INK) + icon('pin', 232, 190, 24, INK) +
    '</g>' +
    '<g class="s5-a"><text class="st-big" x="70" y="276" text-anchor="middle" fill="' + GREEN + '">−50%</text>' +
      '<text class="st-l" x="70" y="300" text-anchor="middle">exposure</text></g>' +
    '<g class="s5-b"><text class="st-big" x="330" y="276" text-anchor="middle" fill="' + INK + '">+40%</text>' +
      '<text class="st-l" x="330" y="300" text-anchor="middle">travel time</text></g>' +
    '<text class="st-s s5-note" x="200" y="470" text-anchor="middle">Least-exposure route, simulated for Central Delhi</text>';

  /* Scene 6 — impact. */
  var cards = [
    ['Published patent', 'Indian Patent Office, July 2026', 'seal'],
    ['Featured in The Hindu', 'The DRUM app, June 2025', 'news'],
    ['9 journal articles', 'and 17 conference papers', 'docs']];
  function mark(kind, x, y) {
    if (kind === 'seal') {
      return '<path d="M' + (x + 12) + ' ' + (y + 30) + 'l-5 12 6-3 4 5 2-12zM' + (x + 28) + ' ' + (y + 30) + 'l5 12-6-3-4 5-2-12z" fill="#c98a12"/>' +
        '<circle cx="' + (x + 20) + '" cy="' + (y + 20) + '" r="17" fill="' + AMBER + '"/>' +
        '<circle cx="' + (x + 20) + '" cy="' + (y + 20) + '" r="11.5" fill="none" stroke="#fff" stroke-width="1.8"/>' +
        icon('check', x + 12, y + 12, 16, '#fff');
    }
    if (kind === 'news') {
      return '<rect x="' + (x + 2) + '" y="' + (y + 4) + '" width="36" height="32" rx="3" fill="#fff" stroke="' + INK + '" stroke-width="2"/>' +
        '<rect x="' + (x + 7) + '" y="' + (y + 9) + '" width="26" height="6" rx="1" fill="' + INK + '"/>' +
        '<path d="M' + (x + 7) + ' ' + (y + 21) + 'h12M' + (x + 7) + ' ' + (y + 27) + 'h12M' + (x + 23) + ' ' + (y + 21) + 'h10M' + (x + 23) + ' ' + (y + 27) + 'h10" stroke="#9aa1ab" stroke-width="2"/>';
    }
    return '<rect x="' + (x + 10) + '" y="' + (y + 1) + '" width="26" height="32" rx="3" fill="#fff" stroke="#9aa1ab" stroke-width="2"/>' +
      '<rect x="' + (x + 4) + '" y="' + (y + 6) + '" width="26" height="32" rx="3" fill="#fff" stroke="' + BLUE + '" stroke-width="2"/>' +
      '<path d="M' + (x + 9) + ' ' + (y + 15) + 'h16M' + (x + 9) + ' ' + (y + 21) + 'h16M' + (x + 9) + ' ' + (y + 27) + 'h10" stroke="' + BLUE + '" stroke-width="2"/>';
  }
  var s6 =
    head('Impact', '#b07a0c', 'From field data', 'to a published patent') +
    cards.map(function (cd, k) {
      var y = 130 + k * 88, star = k === 0;
      return '<g class="s6-card">' +
        '<rect x="28" y="' + y + '" width="344" height="76" rx="12" fill="' + (star ? '#fff7d6' : '#fff') + '" stroke="' + (star ? '#f1e2a8' : LINE) + '"/>' +
        mark(cd[2], 44, y + 18) +
        '<text class="st-b" x="100" y="' + (y + 34) + '" style="font-size:18px">' + cd[0] + '</text>' +
        '<text class="st-s" x="100" y="' + (y + 56) + '">' + cd[1] + '</text></g>';
    }).join('') +
    '<text class="st-b s6-tag" x="200" y="432" text-anchor="middle" style="font-size:17px">' +
      '<tspan fill="' + BLUE + '">Transportation</tspan> <tspan fill="' + GREY + '">×</tspan> ' +
      '<tspan fill="' + RED + '">Environment</tspan> <tspan fill="' + GREY + '">×</tspan> ' +
      '<tspan fill="' + VIOLET + '">AI</tspan></text>';

  svg.insertAdjacentHTML('beforeend', DEFS + [s1, s2, s3, s4, s5, s6].map(function (s, k) {
    return '<g class="st-scene" data-scene="' + k + '" style="display:none">' + s + '</g>';
  }).join(''));

  /* ---- Motion ------------------------------------------------------------ */

  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function span(u, a, b) { return clamp((u - a) / (b - a)); }
  function ease(x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); }
  function inout(x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function q(s) { return svg.querySelector(s); }
  function qa(s) { return Array.prototype.slice.call(svg.querySelectorAll(s)); }
  function set(el, k, v) { el.setAttribute(k, v); }
  function draw(path) {
    var len = path.getTotalLength();
    set(path, 'stroke-dasharray', len + ' ' + len);
    return len;
  }

  var scenes = qa('.st-scene');

  var e1 = { dash: q('.s1-dash'), smog: q('.s1-smog'), sun: q('.s1-sun'), heat: qa('.s1-heat path'),
    veh: qa('.s1-veh'), puff: qa('.s1-puff'), walk: q('.s1-walk'), g1: q('.s1-g1'), g2: q('.s1-g2') };
  var e2 = { trace: q('.s2-trace'), ring: q('.s2-ring'), tiles: qa('.s2-tile'), n1: q('.s2-n1'), n3: q('.s2-n3'), foot: q('.s2-foot') };
  var e3 = { b1: q('.s3-b1'), b2: q('.s3-b2'), v1: q('.s3-v1'), v2: q('.s3-v2'), p: qa('.s3-p'), leg: q('.s3-leg'), chip: q('.s3-chip') };
  var e4 = { cells: qa('.s4-cell'), s: qa('.s4-s'), rings: qa('.s4-ring'), c1: q('.s4-c1'), c2: q('.s4-c2'),
    nn: q('.s4-nn'), nodes: qa('.s4-node'), img: q('.s4-img'), box: q('.s4-box'), graph: q('.s4-graph') };
  var e5 = { phone: q('.s5-phone'), hot: q('.s5-hot'), r1: q('.s5-r1'), r2: q('.s5-r2'), a: q('.s5-a'), b: q('.s5-b'), note: q('.s5-note') };
  var e6 = { cards: qa('.s6-card'), tag: q('.s6-tag') };

  // Path lengths need the scene laid out, so measure each with it shown.
  var lens = {};
  scenes.forEach(function (g) { g.style.display = ''; });
  lens.trace = draw(e2.trace); lens.r1 = draw(e5.r1); lens.r2 = draw(e5.r2); lens.graph = draw(e4.graph);
  scenes.forEach(function (g) { g.style.display = 'none'; });

  var UPDATE = [
    function (u) {
      set(e1.dash, 'stroke-dashoffset', (-u * 60).toFixed(1));
      set(e1.smog, 'opacity', (.95 * ease(span(u, .2, 2))).toFixed(3));
      var s = ease(span(u, .5, 1.3));
      set(e1.sun, 'transform', 'translate(336 170) rotate(' + (u * 14).toFixed(1) + ') scale(' + s.toFixed(3) + ')');
      e1.heat.forEach(function (p, k) {
        var ph = (u * .55 + k / 3) % 1;
        set(p, 'transform', 'translate(0 ' + (318 - ph * 48).toFixed(1) + ')');
        set(p, 'opacity', (Math.sin(ph * Math.PI) * .8 * ease(span(u, .9, 1.8))).toFixed(3));
      });
      e1.veh.forEach(function (g, k) {
        var v = VEH[k], x = ((v[2] + u * v[3]) % 480) - 60;
        set(g, 'transform', 'translate(' + x.toFixed(1) + ' ' + v[4] + ')');
        set(e1.puff[k], 'opacity', ((.55 + .25 * Math.sin(u * 6 + k)) * ease(span(u, .3, 1.2))).toFixed(3));
      });
      set(e1.walk, 'transform', 'translate(' + (34 + u * 22).toFixed(1) + ' ' + (362 - Math.abs(Math.sin(u * 7)) * 2).toFixed(1) + ')');
      set(e1.g1, 'width', (236 * .86 * ease(span(u, .8, 2.4))).toFixed(1));
      set(e1.g2, 'width', (236 * .72 * ease(span(u, 1.3, 2.9))).toFixed(1));
    },
    function (u) {
      set(e2.trace, 'stroke-dashoffset', (lens.trace * (1 - ease(span(u, .3, 2.4)))).toFixed(1));
      var ph = (u * 1.1) % 1;
      set(e2.ring, 'r', (10 + ph * 16).toFixed(1));
      set(e2.ring, 'opacity', (1 - ph).toFixed(3));
      e2.tiles.forEach(function (g, k) {
        var s = ease(span(u, .6 + k * .3, 1.1 + k * .3));
        set(g, 'opacity', s.toFixed(3));
        set(g, 'transform', 'translate(0 ' + ((1 - s) * 14).toFixed(1) + ')');
      });
      e2.n1.textContent = Math.round(723 * ease(span(u, .8, 2.2))).toLocaleString('en-US');
      e2.n3.textContent = Math.round(5224 * ease(span(u, 1.4, 2.9))).toLocaleString('en-US');
      set(e2.foot, 'opacity', ease(span(u, 2.6, 3.1)).toFixed(3));
    },
    function (u) {
      var w1 = 52 * ease(span(u, .3, 1.1)), w2 = 208 * ease(span(u, .8, 2));
      set(e3.b1, 'width', w1.toFixed(1)); set(e3.b2, 'width', w2.toFixed(1));
      set(e3.v1, 'x', (140 + w1).toFixed(1)); set(e3.v2, 'x', (140 + w2).toFixed(1));
      if (w2 > 150) set(e3.v2, 'x', (132 + w2 - 38).toFixed(1));
      e3.v2.style.fill = w2 > 150 ? '#fff' : INK;
      set(e3.v1, 'opacity', span(u, .6, 1.1).toFixed(3)); set(e3.v2, 'opacity', span(u, 1.3, 1.9).toFixed(3));
      e3.p.forEach(function (g, k) {
        var s = ease(span(u, 2 + k * .1, 2.45 + k * .1)), on = SWITCH.indexOf(k) >= 0;
        var use = g.firstChild;
        set(use, 'color', on ? mix(GREY, GREEN, s) : mix(GREY, INK, s));
        set(g, 'transform', 'translate(0 ' + (on ? -6 * s : 0).toFixed(1) + ')');
      });
      set(e3.leg, 'opacity', ease(span(u, 3, 3.4)).toFixed(3));
      set(e3.chip, 'opacity', ease(span(u, 3.4, 3.9)).toFixed(3));
    },
    function (u) {
      e4.s.forEach(function (g, k) {
        var s = ease(span(u, .2 + k * .1, .6 + k * .1));
        var p = SENS[k];
        set(g, 'transform', 'translate(' + p[0] + ' ' + p[1] + ') scale(' + s.toFixed(3) + ')');
        var ph = (u * .9 + k * .17) % 1;
        set(e4.rings[k], 'r', (8 + ph * 18).toFixed(1));
        set(e4.rings[k], 'opacity', ((1 - ph) * (u < 2.2 ? 1 : 1 - span(u, 2.2, 2.6))).toFixed(3));
      });
      e4.cells.forEach(function (r) {
        var d = +r.getAttribute('data-d');
        set(r, 'opacity', (.68 * ease(span(u, 1.2 + d, 1.7 + d))).toFixed(3));
      });
      var swap = u >= 1.7;
      e4.c1.style.display = swap ? 'none' : '';
      e4.c2.style.display = swap ? '' : 'none';
      set(e4.nn, 'opacity', ease(span(u, 2.3, 2.7)).toFixed(3));
      e4.nodes.forEach(function (n) {
        var l = +n.getAttribute('data-l');
        set(n, 'opacity', (.3 + .7 * ease(span(u, 2.7 + l * .35, 3 + l * .35))).toFixed(3));
      });
      set(e4.img, 'opacity', ease(span(u, 2.8, 3.2)).toFixed(3));
      set(e4.box, 'opacity', ease(span(u, 3.3, 3.7)).toFixed(3));
      set(e4.graph, 'stroke-dashoffset', (lens.graph * (1 - ease(span(u, 3.7, 4.3)))).toFixed(1));
    },
    function (u) {
      var s = ease(span(u, 0, .6));
      set(e5.phone, 'transform', 'translate(0 ' + ((1 - s) * 30).toFixed(1) + ')');
      set(e5.hot, 'r', (44 + 3 * Math.sin(u * 4)).toFixed(1));
      set(e5.r1, 'stroke-dashoffset', (lens.r1 * (1 - ease(span(u, .5, 1.5)))).toFixed(1));
      set(e5.r2, 'stroke-dashoffset', (lens.r2 * (1 - ease(span(u, 1.6, 2.8)))).toFixed(1));
      [[e5.a, 2.8], [e5.b, 3.1]].forEach(function (p) {
        var k = ease(span(u, p[1], p[1] + .4));
        set(p[0], 'opacity', k.toFixed(3));
        set(p[0], 'transform', 'translate(0 ' + ((1 - k) * 10).toFixed(1) + ')');
      });
      set(e5.note, 'opacity', ease(span(u, 3.4, 3.8)).toFixed(3));
    },
    function (u) {
      e6.cards.forEach(function (g, k) {
        var s = ease(span(u, .15 + k * .3, .65 + k * .3));
        set(g, 'opacity', s.toFixed(3));
        set(g, 'transform', 'translate(' + ((1 - s) * 40).toFixed(1) + ' 0)');
      });
      set(e6.tag, 'opacity', ease(span(u, 1.6, 2.2)).toFixed(3));
    }
  ];

  /* ---- Scene bar ---------------------------------------------------------- */

  var fills = NAMES.map(function (name, k) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Scene ' + (k + 1) + ': ' + name);
    b.innerHTML = '<span><i></i></span>';
    b.addEventListener('click', function () { seekTo(k * LEN + .001, true); });
    bar.appendChild(b);
    return b.querySelector('i');
  });

  /* ---- Clock -------------------------------------------------------------- */

  var t = 0, current = -1, playing = false, wanted = true, inView = false, last = 0, raf = 0;

  function render(time) {
    time = ((time % DUR) + DUR) % DUR;
    var k = Math.floor(time / LEN) % N, u = time - k * LEN;
    if (k !== current) {
      scenes.forEach(function (g, j) { g.style.display = j === k ? '' : 'none'; });
      current = k;
    }
    var a = ease(span(u, 0, .45)) * (1 - inout(span(u, 4.55, 5)));
    set(scenes[k], 'opacity', a.toFixed(3));
    set(scenes[k], 'transform', 'translate(0 ' + ((1 - ease(span(u, 0, .45))) * 10).toFixed(1) + ')');
    UPDATE[k](u);
    fills.forEach(function (f, j) { f.style.width = (j < k ? 100 : j > k ? 0 : u / LEN * 100).toFixed(2) + '%'; });
  }

  function frame(now) {
    if (!playing) return;
    // A frame's timestamp can precede the performance.now() taken when play
    // began, so never let the clock step backwards.
    t = (t + Math.max(0, Math.min(.1, (now - last) / 1000))) % DUR;
    last = now;
    render(t);
    raf = requestAnimationFrame(frame);
  }
  function label() {
    btn.setAttribute('aria-label', wanted ? 'Pause animation' : 'Play animation');
    fig.classList.toggle('is-paused', !wanted);
  }
  function sync() {
    var go = wanted && inView && !document.hidden;
    if (go && !playing) { playing = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    if (!go && playing) { playing = false; cancelAnimationFrame(raf); }
  }
  function seekTo(time, play) {
    t = time; render(t);
    if (play) { wanted = true; label(); }
    sync();
  }

  btn.addEventListener('click', function () {
    wanted = !wanted;
    label(); sync();
  });
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { inView = es[0].intersectionRatio > .25; sync(); },
      { threshold: [0, .25, .5] }).observe(fig);
  } else {
    inView = true;
  }

  // Reduced motion: hold on the last scene until someone presses play.
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    wanted = false;
    t = 27.6;
  }

  fig.hidden = false;
  render(t);
  label();
  sync();

  // For exporting frames: pause, then draw any moment.
  window.__story = { duration: DUR, seek: function (x) { wanted = false; label(); sync(); t = x; render(t); } };
})();
