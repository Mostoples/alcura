/* ============================================================
   ALCURA — Notification engine.
   Fires a browser notification when a NEW critical/warning alert
   appears in the live sensor feed (ALCURA.on). Rising-edge only:
   each alert notifies once when it first appears and won't repeat
   until it clears and recurs — so no per-tick spam.

   Categories map to the Settings toggles:
     • "Alert Notifications" (alerts)  -> safety/air/culture/system alerts
     • "Harvest Reminders"  (harvest)  -> harvest-ready alerts
     • "Weekly Impact Report" (weekly) -> persisted only (no realtime trigger)

   Public API: window.ALCURA_NOTIFY
     getPrefs()            -> { alerts, harvest, weekly }
     setPref(key, on)      -> persist a single toggle
     supported()           -> Notification API available?
     permission()          -> 'granted' | 'denied' | 'default' | 'unsupported'
     ensurePermission()    -> Promise<permission> (requests if needed)
   ============================================================ */
(function () {
  var PREF_KEY = 'alcuraNotif';
  var DEFAULTS = { alerts: true, harvest: true, weekly: false };
  var COOLDOWN_MS = 15 * 60 * 1000;   // safety net: don't re-fire same key within 15 min

  function supported() { return typeof window.Notification !== 'undefined'; }
  function permission() { return supported() ? Notification.permission : 'unsupported'; }

  function getPrefs() {
    try {
      var raw = JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
      return {
        alerts:  raw.alerts  != null ? !!raw.alerts  : DEFAULTS.alerts,
        harvest: raw.harvest != null ? !!raw.harvest : DEFAULTS.harvest,
        weekly:  raw.weekly  != null ? !!raw.weekly  : DEFAULTS.weekly
      };
    } catch (_) { return Object.assign({}, DEFAULTS); }
  }
  function setPref(key, on) {
    if (!(key in DEFAULTS)) return;
    var p = getPrefs(); p[key] = !!on;
    try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch (_) {}
  }
  function ensurePermission() {
    if (!supported()) return Promise.resolve('unsupported');
    if (Notification.permission !== 'default') return Promise.resolve(Notification.permission);
    try {
      var r = Notification.requestPermission();
      // Older Safari uses a callback signature
      return (r && typeof r.then === 'function') ? r
        : new Promise(function (res) { Notification.requestPermission(res); });
    } catch (_) { return Promise.resolve(Notification.permission); }
  }

  window.ALCURA_NOTIFY = {
    getPrefs: getPrefs, setPref: setPref,
    supported: supported, permission: permission, ensurePermission: ensurePermission
  };

  // ---- Classify an alert into a toggle category ----
  function isHarvest(a) {
    return a.icon === 'ph-plant' || /harvest|panen|収穫/i.test(a.title || '');
  }
  function enabledFor(a, prefs) {
    return isHarvest(a) ? prefs.harvest : prefs.alerts;
  }
  function notifiable(a) { return a.level === 'critical' || a.level === 'warning'; }
  function keyOf(a) { return a.level + '|' + a.title; }

  function show(a) {
    try {
      var n = new Notification(a.title, {
        body: a.sub || '',
        icon: '/img/logo.png',
        badge: '/img/logo.png',
        tag: keyOf(a),          // coalesce duplicates in the tray
        renotify: false,
        lang: (window.ALCURA_I18N && ALCURA_I18N.lang) || 'id'
      });
      n.onclick = function () {
        try { window.focus(); } catch (_) {}
        try { window.location.href = (location.pathname.indexOf('/pages/') !== -1) ? 'alerts.html' : 'pages/alerts.html'; } catch (_) {}
        n.close();
      };
    } catch (_) { /* construction can throw on some browsers; ignore */ }
  }

  // ---- Engine: rising-edge tracking across ticks ----
  var fired = {};        // key -> last fired timestamp (ms)
  var primed = false;    // first tick only records state, never notifies

  function onTick(snap) {
    if (!snap || !snap.alerts) return;
    var prefs = getPrefs();
    var now = Date.now();
    var active = {};

    snap.alerts.forEach(function (a) {
      if (!notifiable(a)) return;
      var k = keyOf(a);
      active[k] = true;
      if (!primed) { fired[k] = now; return; }       // first load: seed as "known", never notify the backlog
      if (permission() !== 'granted') return;
      if (!enabledFor(a, prefs)) return;
      var last = fired[k];
      if (last && (now - last) < COOLDOWN_MS) return; // already notified recently
      show(a);
      fired[k] = now;
    });

    // Forget keys that are no longer active so they can re-fire when they recur
    Object.keys(fired).forEach(function (k) { if (!active[k]) delete fired[k]; });
    primed = true;
  }

  // ---- Attach once ALCURA (sensors-engine) is present; otherwise stay idle ----
  function attach() {
    if (typeof window.ALCURA === 'undefined' || typeof ALCURA.on !== 'function') return false;
    ALCURA.on(onTick);
    return true;
  }
  if (!attach()) {
    var tries = 0;
    var t = setInterval(function () {
      if (attach() || ++tries > 50) clearInterval(t);  // give up after ~10s on pages without sensors
    }, 200);
  }
})();
