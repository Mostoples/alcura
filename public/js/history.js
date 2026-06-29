/* ============================================================
   ALCURA — Sensor History
   Records a rolling time-series of every key reading to
   localStorage so the app can draw REAL trend charts (replacing
   the old static/mock bars) and feed forecasts to the AI.

   Records ONLY real points sampled from the engine once live RTDB data
   has bound (1 point / minute, capped). No synthetic/backfilled history —
   charts fill in over time as real readings arrive.

   API (window.ALCURA_HISTORY):
     .series(field, sinceMs?)      -> [{t, v}]
     .values(field, n?)            -> [v, …] (last n)
     .stat(field, sinceMs?)        -> {min,max,avg,first,last,deltaPct}
     .growthCurve(odNow, days)     -> [v,…] synthesized OD growth
     .renderBars(target, field, opts)
     .renderSpark(target, field, opts)
   Fields: co2, air, gas, ph, tds, temp, od, level, o2Today, co2Today, led, safety
   ============================================================ */
(function () {
  'use strict';
  var KEY = 'alcuraHistV2';   // v2: real-data-only (discards old synthetic/backfilled history)
  var SAMPLE_MS = 60 * 1000;       // append at most 1 live point / minute
  var MAX_POINTS = 1600;           // ~26h at 1/min, plenty for 24h charts
  var FIELDS = ['co2', 'air', 'gas', 'ph', 'tds', 'temp', 'od', 'level', 'o2Today', 'co2Today', 'led', 'safety'];

  var store = load();
  var lastT = store.points.length ? store.points[store.points.length - 1].t : 0;

  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.points) return s; } catch (e) {}
    return { v: 1, points: [] };
  }
  function save() {
    if (store.points.length > MAX_POINTS) store.points = store.points.slice(-MAX_POINTS);
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
  }

  function pointFrom(d, t) {
    return {
      t: t,
      co2: r1(d.air.co2), air: r1(d.air.score), gas: r1(d.air.gas),
      ph: r2(d.culture.ph), tds: r1(d.culture.tds), temp: r2(d.culture.temp),
      od: r2(d.culture.od), level: r1(d.s.level),
      o2Today: r2(d.impact.o2Today), co2Today: r1(d.impact.co2Today),
      led: r1(d.applied.ledIntensity), safety: r1(d.safety.value)
    };
  }
  function r1(v) { return Math.round(+v || 0); }
  function r2(v) { return Math.round((+v || 0) * 100) / 100; }

  /* ---- Public reads ---- */
  function series(field, sinceMs) {
    var cut = sinceMs ? Date.now() - sinceMs : 0;
    return store.points.filter(function (p) { return p.t >= cut && p[field] != null; })
      .map(function (p) { return { t: p.t, v: p[field] }; });
  }
  function values(field, n) {
    var a = store.points.map(function (p) { return p[field]; }).filter(function (v) { return v != null; });
    return n ? a.slice(-n) : a;
  }
  function stat(field, sinceMs) {
    var a = series(field, sinceMs).map(function (p) { return p.v; });
    if (!a.length) return { min: 0, max: 0, avg: 0, first: 0, last: 0, deltaPct: 0 };
    var min = Math.min.apply(null, a), max = Math.max.apply(null, a);
    var sum = a.reduce(function (s, v) { return s + v; }, 0);
    var first = a[0], last = a[a.length - 1];
    return { min: min, max: max, avg: sum / a.length, first: first, last: last, deltaPct: first ? (last - first) / first * 100 : 0 };
  }
  // Synthesize an ascending OD growth curve ending at the current value.
  function growthCurve(odNow, days) {
    days = days || 30; var perDay = 0.92;
    var arr = [], v = odNow;
    for (var i = 0; i < days; i++) { arr.unshift(Math.max(0.1, +v.toFixed(2))); v = v * perDay; }
    return arr;
  }

  /* ---- Chart renderers — smooth SVG line/area TRENDLINES ----
     Replaces the old bar charts. Both renderBars()/renderSpark() keep
     their signatures so existing call sites work unchanged; they now
     paint a filled trendline (Catmull-Rom → cubic bézier) instead. */
  function el(target) { return typeof target === 'string' ? document.querySelector(target) : target; }
  var gradUID = 0;

  // Straight polyline through the points — a plain research-style trace
  // (no smoothing: segments connect actual samples, like a lab plot).
  function linePath(pts) {
    if (!pts.length) return '';
    return 'M ' + pts.map(function (p) { return p[0].toFixed(2) + ' ' + p[1].toFixed(2); }).join(' L ');
  }

  // Core trendline painter. vals = [number, …]; host fills its box.
  function trend(host, vals, opts) {
    opts = opts || {};
    if (!host || !vals || !vals.length) return;
    var W = 100, H = 100, padY = 10;
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), span = (max - min) || 1;
    var n = vals.length;
    var pts = vals.map(function (v, i) {
      var x = n > 1 ? (i / (n - 1)) * W : W / 2;
      var y = (H - padY) - ((v - min) / span) * (H - padY * 2);
      return [x, y];
    });
    var line = linePath(pts);
    var area = line + ' L ' + W + ' ' + H + ' L 0 ' + H + ' Z';
    var last = pts[n - 1];
    var gid = 'alcTrend' + (++gradUID);
    // Faint horizontal gridlines for the "research graph" feel.
    var grid = [25, 50, 75].map(function (gy) {
      return '<line class="trend-grid" x1="0" y1="' + gy + '" x2="' + W + '" y2="' + gy + '" vector-effect="non-scaling-stroke"/>';
    }).join('');
    host.classList.add('trend');
    host.innerHTML =
      '<svg class="trend-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" class="ts-0"/><stop offset="1" class="ts-1"/></linearGradient></defs>' +
      grid +
      '<path class="trend-area" d="' + area + '" fill="url(#' + gid + ')"/>' +
      '<path class="trend-line" d="' + line + '" vector-effect="non-scaling-stroke"/>' +
      '</svg>' +
      '<i class="trend-cap" style="left:' + last[0].toFixed(2) + '%;top:' + last[1].toFixed(2) + '%"></i>';
  }

  function renderBars(target, field, opts) {
    opts = opts || {};
    var host = el(target); if (!host) return;
    var vals = opts.vals || values(field, opts.n || 24);
    trend(host, vals, opts);
  }
  function renderSpark(target, field, opts) {
    opts = opts || {};
    var host = el(target); if (!host) return;
    trend(host, values(field, opts.n || 24), opts);
  }
  // Public alias for clarity at new call sites.
  function renderTrend(target, field, opts) { renderSpark(target, field, opts); }

  /* ---- Boot: sample real RTDB data only (no synthetic backfill) ---- */
  function tick(d) {
    if (!(window.ALCURA && ALCURA.live)) return;   // record only real RTDB-derived points
    var now = Date.now();
    if (now - lastT >= SAMPLE_MS) { store.points.push(pointFrom(d, now)); lastT = now; save(); }
  }
  function dump() { return store.points.slice(); }   // raw points for CSV export
  window.ALCURA_HISTORY = { series: series, values: values, stat: stat, growthCurve: growthCurve, renderBars: renderBars, renderSpark: renderSpark, renderTrend: renderTrend, dump: dump, fields: function () { return FIELDS.slice(); } };

  function boot() {
    if (typeof ALCURA === 'undefined') { return setTimeout(boot, 300); }
    lastT = store.points.length ? store.points[store.points.length - 1].t : 0;
    ALCURA.on(tick);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
