/* ============================================================
   ALCURA — Harvest Logbook + yield calibration.
   Records each real harvest (date, grams, OD at harvest, the yield
   the model predicted) so the app can: show cumulative production,
   compare predicted vs actual, and CALIBRATE the growth model —
   it writes localStorage.alcuraYieldFactor (grams per unit OD),
   which sensors-engine.js reads for future harvest estimates.

   API (window.ALCURA_HARVEST):
     list()            -> [{id,t,grams,odAtHarvest,predictedG,note}] newest first
     add({grams,note}) -> capture current OD/prediction, store, recalibrate
     remove(id)        -> delete an entry, recalibrate
     stats()           -> {count,totalG,avgG,lastG,lastT,accuracyPct,gramsPerOD}
   ============================================================ */
(function () {
  'use strict';
  var KEY = 'alcuraHarvests';
  var FACTOR_KEY = 'alcuraYieldFactor';
  var DEFAULT_FACTOR = 210;

  function load() { try { var a = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function uid() { return 'h' + Date.now() + Math.floor((performance.now() % 1) * 1e6).toString(36); }

  // Average grams-per-OD across logged harvests → calibrate the model (clamped to sane bounds)
  function recalibrate(a) {
    var ratios = a.filter(function (h) { return h.grams > 0 && h.odAtHarvest > 0; })
                  .map(function (h) { return h.grams / h.odAtHarvest; });
    if (!ratios.length) { try { localStorage.removeItem(FACTOR_KEY); } catch (e) {} return DEFAULT_FACTOR; }
    var avg = ratios.reduce(function (s, v) { return s + v; }, 0) / ratios.length;
    avg = Math.max(60, Math.min(600, avg));
    try { localStorage.setItem(FACTOR_KEY, String(Math.round(avg))); } catch (e) {}
    if (window.ALCURA && ALCURA.refresh) try { ALCURA.refresh(); } catch (e) {}
    return Math.round(avg);
  }

  function mirrorFirestore(entry) {
    try {
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && firebase.firestore) {
        firebase.firestore().collection('harvests').doc(entry.id).set(entry, { merge: true });
      }
    } catch (e) {}
  }

  function list() { return load().slice().sort(function (a, b) { return b.t - a.t; }); }

  function add(opts) {
    opts = opts || {};
    var grams = parseFloat(opts.grams);
    if (isNaN(grams) || grams <= 0) return null;
    var snap = (window.ALCURA && ALCURA.snapshot) ? ALCURA.snapshot() : null;
    var od = snap ? snap.culture.od : 0;
    var predicted = snap ? snap.harvest.yieldG : 0;
    var entry = {
      id: uid(), t: opts.t || Date.now(), grams: Math.round(grams * 10) / 10,
      odAtHarvest: od, predictedG: predicted, note: (opts.note || '').slice(0, 200)
    };
    var a = load(); a.push(entry); save(a);
    recalibrate(a);
    mirrorFirestore(entry);
    return entry;
  }

  function remove(id) {
    var a = load().filter(function (h) { return h.id !== id; });
    save(a); recalibrate(a);
    try {
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && firebase.firestore) {
        firebase.firestore().collection('harvests').doc(id).delete();
      }
    } catch (e) {}
    return a;
  }

  function stats() {
    var a = load();
    var count = a.length;
    var totalG = a.reduce(function (s, h) { return s + (h.grams || 0); }, 0);
    var withPred = a.filter(function (h) { return h.predictedG > 0 && h.grams > 0; });
    var acc = withPred.length
      ? withPred.reduce(function (s, h) { return s + (1 - Math.abs(h.predictedG - h.grams) / h.grams); }, 0) / withPred.length * 100
      : null;
    var sorted = list();
    var factor = parseFloat(localStorage.getItem(FACTOR_KEY)) || DEFAULT_FACTOR;
    return {
      count: count,
      totalG: Math.round(totalG * 10) / 10,
      avgG: count ? Math.round(totalG / count * 10) / 10 : 0,
      lastG: sorted.length ? sorted[0].grams : 0,
      lastT: sorted.length ? sorted[0].t : 0,
      accuracyPct: acc == null ? null : Math.max(0, Math.round(acc)),
      gramsPerOD: Math.round(factor)
    };
  }

  window.ALCURA_HARVEST = { list: list, add: add, remove: remove, stats: stats };
})();
