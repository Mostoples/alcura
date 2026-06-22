/* ============================================================
   ALCURA — Sensor History
   Records a rolling time-series of every key reading to
   localStorage so the app can draw REAL trend charts (replacing
   the old static/mock bars) and feed forecasts to the AI.

   On first run it backfills a believable 24h (diurnal) curve so
   charts are populated immediately, then keeps appending live
   points sampled from the engine (1 point / minute, capped).

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
  var KEY = 'alcuraHistV1';
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

  /* ---- Backfill 24h of plausible diurnal history on first run ---- */
  function backfill(d) {
    var now = Date.now(), step = 15 * 60 * 1000, n = 96; // 24h @ 15min
    var pts = [];
    for (var i = n; i >= 1; i--) {
      var t = now - i * step;
      var hour = new Date(t).getHours() + new Date(t).getMinutes() / 60;
      // diurnal shape: CO2 peaks pre-dawn, dips midday (photosynthesis); temp warmer midday
      var dayPhase = Math.cos((hour - 5) / 24 * 2 * Math.PI);     // +1 ~5am, -1 ~5pm
      var noise = function (a) { return (Math.sin(i * 1.7) + Math.sin(i * 0.6)) * 0.5 * a; };
      var co2 = clamp(d.air.co2 + dayPhase * 70 + noise(40), 400, 1400);
      var air = clamp(d.air.score - dayPhase * 8 + noise(4), 30, 100);
      pts.push({
        t: t,
        co2: r1(co2), air: r1(air), gas: r1(clamp(d.air.gas + noise(30), 120, 700)),
        ph: r2(clamp(d.culture.ph + Math.sin(i * 0.4) * 0.12, 8.6, 10.4)),
        tds: r1(clamp(d.culture.tds - i * 1.1 + noise(20), 600, 1100)),
        temp: r2(clamp(d.culture.temp - dayPhase * 1.2 + noise(0.4), 24, 31)),
        od: r2(clamp(d.culture.od - i * 0.0045, 0.4, d.culture.od)),
        level: r1(clamp(d.s.level + i * 0.06 + noise(1), 30, 100)),
        o2Today: r2(clamp(d.impact.o2Today * (1 - i / n), 0, d.impact.o2Today)),
        co2Today: r1(clamp(d.impact.co2Today * (1 - i / n), 0, d.impact.co2Today)),
        led: r1(clamp((hour >= 22 || hour < 6) ? 25 : d.applied.ledIntensity, 0, 100)),
        safety: r1(clamp(d.safety.value + noise(25), 100, 700))
      });
    }
    store.points = pts;
    save();
  }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

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

  /* ---- Chart renderers (build .bar children, reuse existing CSS) ---- */
  function el(target) { return typeof target === 'string' ? document.querySelector(target) : target; }
  function bars(host, vals, activeLast) {
    if (!host || !vals.length) return;
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), span = (max - min) || 1;
    host.innerHTML = vals.map(function (v, i) {
      var h = Math.round(14 + (v - min) / span * 86);
      var act = (activeLast && i === vals.length - 1) ? ' active' : '';
      return '<div class="bar' + act + '" style="height:' + h + '%"></div>';
    }).join('');
  }
  function renderBars(target, field, opts) {
    opts = opts || {};
    var host = el(target); if (!host) return;
    var vals = opts.vals || values(field, opts.n || 24);
    if (!vals.length) return;
    bars(host, vals, opts.activeLast !== false);
  }
  function renderSpark(target, field, opts) {
    opts = opts || {};
    var host = el(target); if (!host) return;
    var vals = values(field, opts.n || 24);
    if (!vals.length) return;
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), span = (max - min) || 1;
    host.innerHTML = vals.map(function (v, i) {
      var h = Math.round(30 + (v - min) / span * 70);
      return '<div class="bar' + (i === vals.length - 1 ? ' active' : '') + '" style="height:' + h + '%;opacity:' + (0.55 + h / 320).toFixed(2) + '"></div>';
    }).join('');
  }

  /* ---- Boot: backfill once, then sample live ---- */
  function tick(d) {
    if (!store.points.length) { backfill(d); lastT = store.points[store.points.length - 1].t; return; }
    var now = Date.now();
    if (now - lastT >= SAMPLE_MS) { store.points.push(pointFrom(d, now)); lastT = now; save(); }
  }
  function dump() { return store.points.slice(); }   // raw points for CSV export
  window.ALCURA_HISTORY = { series: series, values: values, stat: stat, growthCurve: growthCurve, renderBars: renderBars, renderSpark: renderSpark, dump: dump, fields: function () { return FIELDS.slice(); } };

  function boot() {
    if (typeof ALCURA === 'undefined') { return setTimeout(boot, 300); }
    var d0 = ALCURA.snapshot();
    if (!store.points.length) backfill(d0);
    lastT = store.points.length ? store.points[store.points.length - 1].t : 0;
    ALCURA.on(tick);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
