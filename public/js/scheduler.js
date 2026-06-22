/* ============================================================
   ALCURA — Actuator Scheduler.
   Time-based automation for the photobioreactor:
     • Photoperiod — LED day/night cycle (Spirulina needs a light
       rhythm; default 06:00–22:00 light).
     • Aeration cycle — pump bursts on an interval.
   Applies setpoints via ALCURA.setControl(). To avoid fighting the
   AI auto-mode, the schedule only drives actuators when Auto Mode
   is OFF — otherwise it stands by.

   API (window.ALCURA_SCHED):
     get()           -> config object
     set(partial)    -> merge + persist + apply now
     status()        -> { ledOn, ledWant, aerWant, governed, summary }
   Config persisted to localStorage.alcuraSchedule.
   ============================================================ */
(function () {
  'use strict';
  var KEY = 'alcuraSchedule';
  var DEFAULTS = {
    photoperiod: { enabled: false, onHour: 6, offHour: 22, dayLevel: 75, nightLevel: 20 },
    aeration:    { enabled: false, intervalMin: 60, durationMin: 20, level: 70, idleLevel: 30 }
  };

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || '{}');
      return {
        photoperiod: Object.assign({}, DEFAULTS.photoperiod, s.photoperiod || {}),
        aeration: Object.assign({}, DEFAULTS.aeration, s.aeration || {})
      };
    } catch (e) { return JSON.parse(JSON.stringify(DEFAULTS)); }
  }
  var cfg = load();
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) {} }

  // Is `hour` (float) inside the [on, off) window, handling midnight wrap?
  function inWindow(hour, on, off) {
    if (on === off) return true;
    return on < off ? (hour >= on && hour < off) : (hour >= on || hour < off);
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hhmm(h) { return pad(h) + ':00'; }

  function compute(now) {
    now = now || new Date();
    var hour = now.getHours() + now.getMinutes() / 60;
    var p = cfg.photoperiod, a = cfg.aeration;
    var ledOn = inWindow(hour, p.onHour, p.offHour);
    var ledWant = p.enabled ? (ledOn ? p.dayLevel : p.nightLevel) : null;
    var aerWant = null, aerOn = false;
    if (a.enabled) {
      var minOfDay = now.getHours() * 60 + now.getMinutes();
      var phase = a.intervalMin > 0 ? (minOfDay % a.intervalMin) : 0;
      aerOn = phase < a.durationMin;
      aerWant = aerOn ? a.level : a.idleLevel;
    }
    return { ledOn: ledOn, ledWant: ledWant, aerWant: aerWant, aerOn: aerOn };
  }

  function apply() {
    if (typeof window.ALCURA === 'undefined' || !ALCURA.setControl) return;
    var governed = !ALCURA.control.autoMode;     // schedule only drives when AI auto-mode is off
    if (!governed) return;
    var c = compute();
    if (c.ledWant != null && ALCURA.control.ledIntensity !== c.ledWant) ALCURA.setControl('ledIntensity', c.ledWant);
    if (c.aerWant != null && ALCURA.control.aeration !== c.aerWant) ALCURA.setControl('aeration', c.aerWant);
  }

  function status() {
    var governed = (typeof window.ALCURA !== 'undefined') ? !ALCURA.control.autoMode : false;
    var c = compute();
    return {
      governed: governed, ledOn: c.ledOn, ledWant: c.ledWant, aerWant: c.aerWant, aerOn: c.aerOn,
      photoSummary: cfg.photoperiod.enabled ? (hhmm(cfg.photoperiod.onHour) + '–' + hhmm(cfg.photoperiod.offHour)) : null
    };
  }

  window.ALCURA_SCHED = {
    get: function () { return JSON.parse(JSON.stringify(cfg)); },
    defaults: function () { return JSON.parse(JSON.stringify(DEFAULTS)); },
    set: function (partial) {
      partial = partial || {};
      if (partial.photoperiod) Object.assign(cfg.photoperiod, partial.photoperiod);
      if (partial.aeration) Object.assign(cfg.aeration, partial.aeration);
      persist(); apply();
      return this.get();
    },
    status: status
  };

  // Run continuously while the app is open
  function boot() {
    apply();
    setInterval(apply, 30 * 1000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
