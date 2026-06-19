/* ============================================================
   ALCURA — Sensors Engine
   Single source of truth for every device reading and every
   derived feature in the app.

   Data source:
     • If Firestore has a `devices/live` doc, binds to it realtime.
     • Otherwise simulates a believable random-walk so the UI lives.

   Derived features (computed every tick):
     • air      — indoor air-health score (CO₂ + TVOC + gas + RH)
     • safety   — smoke / gas leak detection + triangulation (3× MQ-2)
     • culture  — pH / TDS / temp / colour diagnosis + recommendations
     • harvest  — readiness & days-to-harvest from biomass density
     • impact   — CO₂ absorbed / O₂ produced (accumulating)
     • reminders— maintenance reminders (water, nutrient, pH)
     • auto     — AI auto-mode rules engine (LED / aeration / CO₂)
     • alerts   — aggregated alert feed (safety + culture + reminders…)

   Public API (window.ALCURA):
     .snapshot()        -> latest computed object
     .on(fn)            -> subscribe to every tick, returns unsubscribe
     .control           -> live actuator state (led, aeration, …)
     .setControl(k,v)   -> update an actuator (persists + re-emits)
     .renderAlerts(sel) -> render the alert feed into a container
   Auto-binds the DOM:
     [data-bind="path"]    textContent = snapshot value (dot-path)
     [data-sensor="key"]   textContent = raw sensor value
     [data-bind-w="path"]  style.width = value%
     [data-bind-aura="p"]  toggles aura-green/amber/coral
     [data-status] + data-warn/data-danger on a sibling value
                           -> live Aman / Waspada / Bahaya badge
   ============================================================ */
(function () {
  'use strict';

  // ---- Normal ranges (used for simulation seeds + comfort scoring) ----
  var RANGES = {
    mq2_1: [180, 300], mq2_2: [180, 300], mq2_3: [180, 320],
    mg811: [440, 620], tvoc: [30, 140], eco2: [420, 600],
    uv: [1, 4], dht_t: [24, 29], dht_h: [45, 65],
    aht_t: [25, 28], aht_h: [48, 60], mlx: [26, 29],
    ph: [9.0, 9.8], tds: [780, 1000], level: [60, 92],
    dist: [4, 12], green: [180, 230]
  };

  // Current readings (sensible seed values)
  var S = {
    mq2_1: 214, mq2_2: 198, mq2_3: 226, mg811: 486, tvoc: 58, eco2: 452,
    uv: 2.4, dht_t: 26, dht_h: 52, aht_t: 26.7, aht_h: 53.1, mlx: 27.3,
    ph: 9.4, tds: 864, level: 86, dist: 5.8, green: 208
  };

  var listeners = [];
  var liveBound = false;
  var last = null;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function num(v) { var n = parseFloat(v); return isNaN(n) ? null : n; }

  function resolve(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return (o == null) ? undefined : o[k];
    }, obj);
  }

  // ---- Simulation: gentle bounded random walk ----
  function randomWalk() {
    Object.keys(RANGES).forEach(function (k) {
      var r = RANGES[k], span = r[1] - r[0], step = span * 0.05;
      var next = S[k] + (Math.random() - 0.5) * 2 * step;
      S[k] = clamp(next, r[0] - span * 0.06, r[1] + span * 0.06);
    });
    // water level & ultrasonic distance are physically linked
    S.dist = clamp((100 - S.level) / 100 * 20 + 3, 2, 22);
  }

  // ---- Scoring helper: 100 at `good`, 0 at `bad` (either direction) ----
  function score2(v, good, bad) {
    if (good < bad) return clamp((bad - v) / (bad - good) * 100, 0, 100);
    return clamp((v - bad) / (good - bad) * 100, 0, 100);
  }

  // ---- Language helper (EN / ID / JA), follows i18n.js ----
  function lng() { try { return (window.ALCURA_I18N && window.ALCURA_I18N.lang) || localStorage.getItem('lang') || 'en'; } catch (e) { return 'en'; } }
  function L(en, id, ja) { var l = lng(); return l === 'id' ? id : (l === 'ja' ? ja : en); }
  function airLabel(score) {
    if (score >= 85) return L('Excellent', 'Luar biasa', '非常に良い');
    if (score >= 70) return L('Good', 'Baik', '良好');
    if (score >= 50) return L('Moderate', 'Sedang', '普通');
    if (score >= 30) return L('Poor', 'Buruk', '悪い');
    return L('Hazardous', 'Berbahaya', '危険');
  }

  // ====================== FEATURE COMPUTATIONS ======================

  function computeAir() {
    var co2 = S.mg811, tvoc = S.tvoc, gas = Math.max(S.mq2_1, S.mq2_2, S.mq2_3), rh = S.dht_h;
    var sCo2 = score2(co2, 500, 2000);
    var sTvoc = score2(tvoc, 100, 1000);
    var sGas = score2(gas, 250, 1000);
    var sRh = clamp(100 - Math.abs(rh - 50) * 3, 0, 100);
    var score = Math.round(sCo2 * 0.35 + sTvoc * 0.25 + sGas * 0.25 + sRh * 0.15);
    var label = airLabel(score);
    var aura = score >= 70 ? 'green' : score >= 50 ? 'amber' : 'coral';
    return { score: score, label: label, aura: aura, co2: Math.round(co2), tvoc: Math.round(tvoc), eco2: Math.round(S.eco2), gas: Math.round(gas), rh: Math.round(rh) };
  }

  function computeSafety() {
    var arr = [
      { id: '#1', v: S.mq2_1, loc: { en: 'Kitchen', id: 'Dapur', ja: 'キッチン' } },
      { id: '#2', v: S.mq2_2, loc: { en: 'Living Room', id: 'Ruang Tamu', ja: 'リビング' } },
      { id: '#3', v: S.mq2_3, loc: { en: 'Reactor Area', id: 'Area Reaktor', ja: 'リアクター付近' } }
    ].sort(function (a, b) { return b.v - a.v; });
    var top = arr[0];
    var loc = L(top.loc.en, top.loc.id, top.loc.ja);
    var v = Math.round(top.v);
    var level = top.v > 600 ? 'danger' : top.v > 300 ? 'warn' : 'ok';
    var message = level === 'danger'
      ? L('High smoke/gas detected in ' + loc + ' (' + v + ' ppm). Check immediately & ensure ventilation!',
          'Asap/gas tinggi terdeteksi di ' + loc + ' (' + v + ' ppm). Periksa segera & pastikan ventilasi!',
          loc + 'で高濃度の煙/ガスを検知 (' + v + ' ppm)。直ちに確認し換気してください！')
      : level === 'warn'
        ? L('Gas level rising in ' + loc + ' (' + v + ' ppm). Monitoring.',
            'Kadar gas meningkat di ' + loc + ' (' + v + ' ppm). Sedang dipantau.',
            loc + 'でガス濃度が上昇 (' + v + ' ppm)。監視中。')
        : L('No smoke or gas leak detected. Environment is safe.',
            'Tidak ada asap atau kebocoran gas terdeteksi. Lingkungan aman.',
            '煙やガス漏れは検知されていません。環境は安全です。');
    var aura = level === 'danger' ? 'coral' : level === 'warn' ? 'amber' : 'green';
    return { level: level, aura: aura, loc: loc, value: v, message: message, sensors: arr };
  }

  function computeCulture() {
    var ph = S.ph, tds = S.tds, temp = S.mlx, green = S.green;
    var rec = [];
    var phStat = (ph >= 9.0 && ph <= 10.2) ? 'ok' : (ph < 8.6 || ph > 10.6) ? 'bad' : 'warn';
    if (phStat !== 'ok') rec.push(ph < 9
      ? L('pH low — add sodium bicarbonate to raise pH.', 'pH rendah — tambah sodium bikarbonat untuk menaikkan pH.', 'pHが低い — 重曹を加えてpHを上げてください。')
      : L('pH high — enable CO₂ injection to lower pH.', 'pH tinggi — aktifkan injeksi CO₂ untuk menurunkan pH.', 'pHが高い — CO₂注入を有効にしてpHを下げてください。'));
    var tdsStat = (tds >= 800 && tds <= 1200) ? 'ok' : (tds < 600) ? 'bad' : 'warn';
    if (tdsStat !== 'ok') rec.push(tds < 800
      ? L('Nutrients (TDS) running low — add nutrient solution.', 'Nutrisi (TDS) menipis — tambahkan larutan nutrisi.', '栄養（TDS）が不足 — 栄養液を追加してください。')
      : L('TDS too high — dilute with clean water.', 'TDS terlalu tinggi — encerkan dengan air bersih.', 'TDSが高すぎ — きれいな水で薄めてください。'));
    var tStat = (temp >= 25 && temp <= 30) ? 'ok' : (temp > 34 || temp < 18) ? 'bad' : 'warn';
    if (tStat !== 'ok') rec.push(temp > 30
      ? L('Culture temperature high — reduce LED intensity.', 'Suhu kultur tinggi — kurangi intensitas LED.', '培養温度が高い — LED強度を下げてください。')
      : L('Culture temperature low — increase heating/LED.', 'Suhu kultur rendah — tingkatkan pemanasan/LED.', '培養温度が低い — 加熱/LEDを上げてください。'));
    var od = +(1.0 + (green - 180) / 50 * 0.7).toFixed(2);
    var chl = Math.round(clamp(70 + (green - 180) / 50 * 29, 40, 99));
    var greenStat = green >= 195 ? 'ok' : 'warn';
    if (green < 190) rec.push(L('Culture color fading — sign of stress/chlorophyll drop. Check light & nutrients.', 'Warna kultur memudar — indikasi stress/penurunan klorofil. Periksa cahaya & nutrisi.', '培養の色が薄い — ストレス/クロロフィル低下の兆候。光と栄養を確認してください。'));
    var status = ([phStat, tdsStat, tStat].indexOf('bad') >= 0) ? 'critical'
      : ([phStat, tdsStat, tStat, greenStat].indexOf('warn') >= 0) ? 'attention' : 'optimal';
    if (!rec.length) rec.push(L('All culture parameters are within ideal range. Keep current settings.', 'Semua parameter kultur dalam rentang ideal. Pertahankan pengaturan saat ini.', 'すべての培養パラメータが理想範囲内です。現在の設定を維持してください。'));
    var aura = status === 'critical' ? 'coral' : status === 'attention' ? 'amber' : 'green';
    return {
      status: status, aura: aura, ph: +ph.toFixed(1), phStat: phStat, tds: Math.round(tds), tdsStat: tdsStat,
      temp: +temp.toFixed(1), tStat: tStat, od: od, chl: chl, green: Math.round(green), greenStat: greenStat, recommendations: rec
    };
  }

  function computeHarvest(c) {
    var target = 1.6, growthPerDay = 0.045;
    var days = Math.max(0, Math.ceil((target - c.od) / growthPerDay));
    var readiness = Math.round(clamp(c.od / target * 100, 5, 99));
    var yieldG = Math.round(c.od * 210);
    return { days: days, readiness: readiness, yieldG: yieldG, od: c.od };
  }

  function startOfDay() { var d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); }

  function computeImpact(c, applied) {
    var ledFactor = (applied.ledIntensity || 72) / 100;
    var o2RatePerHr = 0.6 * c.od * (0.5 + 0.5 * ledFactor); // L/hr
    var co2RatePerHr = o2RatePerHr * 3.0;                   // g/hr
    var elapsedH = clamp((Date.now() - startOfDay()) / 3.6e6, 0.2, 24);
    var o2Today = +(o2RatePerHr * elapsedH).toFixed(1);
    var co2Today = Math.round(co2RatePerHr * elapsedH);
    var dom = new Date().getDate();
    var co2Month = Math.round(co2RatePerHr * 24 * (dom - 1) * 0.82 + co2Today);
    var o2Month = Math.round(o2RatePerHr * 24 * (dom - 1) * 0.82 + o2Today);
    return {
      o2Today: o2Today, co2Today: co2Today,
      co2Month: co2Month, o2Month: o2Month,
      vocMonth: +(co2Month * 0.01).toFixed(1),
      energyMonth: +(co2Month * 0.0068).toFixed(1),
      treeEq: +(co2Month / 5400).toFixed(2),
      kmEq: +(co2Month / 200).toFixed(1)
    };
  }

  function computeReminders(c) {
    var r = [];
    if (S.level < 40) r.push({ level: 'warning', icon: 'ph-drop', title: L('Low water level', 'Level air rendah', '水位が低い'), sub: L('Culture water ' + Math.round(S.level) + '% — refill soon.', 'Air kultur ' + Math.round(S.level) + '% — isi ulang segera.', '培養水 ' + Math.round(S.level) + '% — 早めに補充してください。') });
    if (c.tds < 800) r.push({ level: c.tds < 600 ? 'critical' : 'warning', icon: 'ph-flask', title: L('Nutrients running low', 'Nutrisi menipis', '栄養不足'), sub: L('TDS ' + c.tds + ' ppm — add nutrient solution.', 'TDS ' + c.tds + ' ppm — tambahkan larutan nutrisi.', 'TDS ' + c.tds + ' ppm — 栄養液を追加してください。') });
    if (c.phStat !== 'ok') r.push({ level: c.phStat === 'bad' ? 'critical' : 'warning', icon: 'ph-test-tube', title: L('pH needs correction', 'pH perlu koreksi', 'pHの調整が必要'), sub: L('pH ' + c.ph + ' is outside the ideal range (9.0–10.2).', 'pH ' + c.ph + ' di luar rentang ideal (9.0–10.2).', 'pH ' + c.ph + ' は理想範囲(9.0–10.2)外です。') });
    if (c.tStat !== 'ok') r.push({ level: c.tStat === 'bad' ? 'critical' : 'warning', icon: 'ph-thermometer-hot', title: L('Culture temp not ideal', 'Suhu kultur tidak ideal', '培養温度が不適'), sub: L('Temp ' + c.temp + '°C — adjust LED/cooling.', 'Suhu ' + c.temp + '°C — sesuaikan LED/pendingin.', '温度 ' + c.temp + '°C — LED/冷却を調整してください。') });
    return r;
  }

  function computeAuto(c, air) {
    var rec = [], led = 72, aer = 60, co2inj = false;
    var hour = new Date().getHours();
    var night = hour >= 22 || hour < 6;
    if (night) { led = 25; aer = 40; rec.push(L('Night mode (' + pad(hour) + ':00): LED lowered for culture rest phase.', 'Mode malam (' + pad(hour) + ':00): LED diturunkan untuk fase istirahat kultur.', '夜間モード (' + pad(hour) + ':00)：培養の休息のためLEDを下げました。')); }
    if (air.co2 > 800) { led = Math.min(100, led + 15); aer = Math.min(100, aer + 20); rec.push(L('High CO₂ (' + air.co2 + ' ppm) — LED & aeration raised to speed up photosynthesis.', 'CO₂ tinggi (' + air.co2 + ' ppm) — LED & aerasi dinaikkan untuk percepat fotosintesis.', 'CO₂が高い (' + air.co2 + ' ppm) — 光合成促進のためLEDとエアレーションを上げました。')); }
    if (c.temp > 30) { led = Math.max(15, led - 20); rec.push(L('Culture temp ' + c.temp + '°C — LED lowered to cool down.', 'Suhu kultur ' + c.temp + '°C — LED diturunkan untuk mendinginkan.', '培養温度 ' + c.temp + '°C — 冷却のためLEDを下げました。')); }
    if (c.ph > 10.0) { co2inj = true; rec.push(L('pH ' + c.ph + ' high — CO₂ injection enabled to stabilize pH.', 'pH ' + c.ph + ' tinggi — injeksi CO₂ diaktifkan untuk menstabilkan pH.', 'pH ' + c.ph + ' が高い — pH安定化のためCO₂注入を有効化。')); }
    if (c.od >= 1.5) { rec.push(L('High density (OD ' + c.od + ') — culture nearing harvest, keep lighting.', 'Densitas tinggi (OD ' + c.od + ') — kultur mendekati panen, pertahankan cahaya.', '高密度 (OD ' + c.od + ') — 収穫間近、照明を維持。')); }
    if (!rec.length) rec.push(L('Conditions optimal — system keeps current settings.', 'Kondisi optimal — sistem mempertahankan pengaturan saat ini.', '状態は最適 — 現在の設定を維持します。'));
    return { ledIntensity: Math.round(led), aeration: Math.round(aer), co2Injection: co2inj, recommendations: rec };
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function buildAlerts(saf, c, h, air, rem) {
    var a = [];
    if (saf.level === 'danger') a.push({ level: 'critical', icon: 'ph-fire', title: L('Danger: smoke/gas detected', 'Bahaya: asap/gas terdeteksi', '危険：煙/ガスを検知'), sub: saf.message });
    else if (saf.level === 'warn') a.push({ level: 'warning', icon: 'ph-warning', title: L('Gas level rising', 'Kadar gas meningkat', 'ガス濃度が上昇'), sub: saf.message });
    if (c.status === 'critical') a.push({ level: 'critical', icon: 'ph-flask', title: L('Culture needs attention', 'Kultur butuh perhatian', '培養に注意が必要'), sub: c.recommendations[0] });
    rem.forEach(function (r) { a.push({ level: r.level, icon: r.icon, title: r.title, sub: r.sub }); });
    if (h.days <= 3) a.push({ level: 'warning', icon: 'ph-plant', title: L('Harvest ready in ' + h.days + ' days', 'Panen siap dalam ' + h.days + ' hari', '収穫まであと' + h.days + '日'), sub: L('Estimated yield ' + h.yieldG + ' g. Prepare harvest tools.', 'Estimasi yield ' + h.yieldG + ' g. Siapkan peralatan panen.', '推定収量 ' + h.yieldG + ' g。収穫の準備をしてください。') });
    if (air.score >= 85) a.push({ level: 'success', icon: 'ph-wind', title: L('Excellent air quality', 'Kualitas udara sangat baik', '空気の質が非常に良い'), sub: L('Air score ' + air.score + '/100 (' + air.label + ').', 'Skor udara ' + air.score + '/100 (' + air.label + ').', '空気スコア ' + air.score + '/100 (' + air.label + ')。') });
    if (!a.length) a.push({ level: 'success', icon: 'ph-check-circle', title: L('All systems normal', 'Semua sistem normal', 'すべて正常'), sub: L('No active alerts right now.', 'Tidak ada peringatan aktif saat ini.', '現在アクティブな通知はありません。') });
    return a;
  }

  // ====================== ACTUATOR / CONTROL STATE ======================
  var CONTROL_DEFAULTS = {
    ledIntensity: 72, aeration: 60, co2Injection: true, autoMode: true, mode: 'growth',
    spectrum: { red: 85, blue: 60, green: 45, farRed: 30, uv: 15 }
  };
  var control = loadControl();
  function loadControl() {
    try {
      var saved = JSON.parse(localStorage.getItem('alcuraControl') || '{}');
      return Object.assign({}, CONTROL_DEFAULTS, saved, { spectrum: Object.assign({}, CONTROL_DEFAULTS.spectrum, saved.spectrum || {}) });
    } catch (e) { return Object.assign({}, CONTROL_DEFAULTS); }
  }
  function persistControl() {
    try { localStorage.setItem('alcuraControl', JSON.stringify(control)); } catch (e) {}
    // best-effort mirror to Firestore for the device to read
    try {
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && firebase.firestore) {
        firebase.firestore().collection('devices').doc('control').set(control, { merge: true });
      }
    } catch (e) {}
  }

  // ====================== SNAPSHOT + EMIT ======================
  function snapshot() {
    var air = computeAir();
    var saf = computeSafety();
    var c = computeCulture();
    var h = computeHarvest(c);
    var au = computeAuto(c, air);
    var applied = control.autoMode
      ? { ledIntensity: au.ledIntensity, aeration: au.aeration, co2Injection: au.co2Injection }
      : { ledIntensity: control.ledIntensity, aeration: control.aeration, co2Injection: control.co2Injection };
    var im = computeImpact(c, applied);
    var rem = computeReminders(c);
    var alerts = buildAlerts(saf, c, h, air, rem);
    return {
      s: Object.assign({}, S),
      air: air, safety: saf, culture: c, harvest: h, impact: im,
      reminders: rem, auto: au, applied: applied, control: control, alerts: alerts
    };
  }

  // ---- DOM auto-binder ----
  function fmt(el, v) {
    var dec = el.getAttribute('data-dec');
    if (typeof v === 'number' && dec != null) return v.toFixed(+dec);
    return v;
  }
  function applyBindings(snap) {
    document.querySelectorAll('[data-bind]').forEach(function (el) {
      var v = resolve(snap, el.getAttribute('data-bind'));
      if (v != null && typeof v !== 'object') el.textContent = fmt(el, v);
    });
    document.querySelectorAll('[data-sensor]').forEach(function (el) {
      var v = snap.s[el.getAttribute('data-sensor')];
      if (v != null) {
        var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
        el.textContent = dec ? v.toFixed(dec) : Math.round(v).toString();
        updateStatusBadge(el, v);
      }
    });
    document.querySelectorAll('[data-bind-w]').forEach(function (el) {
      var v = resolve(snap, el.getAttribute('data-bind-w'));
      if (v != null) el.style.width = clamp(+v, 0, 100) + '%';
    });
    document.querySelectorAll('[data-bind-gp]').forEach(function (el) {
      var v = resolve(snap, el.getAttribute('data-bind-gp'));
      if (v != null) el.style.setProperty('--gp', clamp(+v, 0, 100) + '%');
    });
    document.querySelectorAll('[data-bind-aura]').forEach(function (el) {
      var v = resolve(snap, el.getAttribute('data-bind-aura'));
      el.classList.remove('aura-green', 'aura-amber', 'aura-coral', 'aura-blue', 'aura-violet');
      if (v) el.classList.add('aura-' + v);
    });
  }

  // status badge from per-value thresholds (data-warn / data-danger)
  function updateStatusBadge(valEl, v) {
    var warn = num(valEl.getAttribute('data-warn'));
    var danger = num(valEl.getAttribute('data-danger'));
    if (warn == null && danger == null) return;
    var card = valEl.closest('.metric-card');
    var badge = card && card.querySelector('[data-status]');
    if (!badge) return;
    var state = (danger != null && v >= danger) ? 'danger' : (warn != null && v >= warn) ? 'warn' : 'ok';
    badge.classList.remove('up', 'warn', 'danger');
    if (state === 'danger') { badge.classList.add('danger'); badge.textContent = L('Danger', 'Bahaya', '危険'); }
    else if (state === 'warn') { badge.classList.add('warn'); badge.textContent = L('Caution', 'Waspada', '注意'); }
    else {
      badge.classList.add('up');
      var ok = badge.getAttribute('data-ok') || 'Aman';
      badge.textContent = (ok === 'Optimal') ? L('Optimal', 'Optimal', '最適') : L('Safe', 'Aman', '安全');
    }
  }

  function emit() {
    last = snapshot();
    applyBindings(last);
    listeners.forEach(function (fn) { try { fn(last); } catch (e) {} });
    try { document.dispatchEvent(new CustomEvent('alcura:update', { detail: last })); } catch (e) {}
  }

  // ---- Firestore live binding (optional) ----
  function tryBindLive() {
    try {
      if (typeof firebase === 'undefined' || !firebase.apps || !firebase.apps.length || !firebase.firestore) return;
      firebase.firestore().collection('devices').doc('live').onSnapshot(function (snap) {
        if (!snap.exists) return;
        var d = snap.data() || {};
        Object.keys(RANGES).forEach(function (k) { if (d[k] != null) S[k] = parseFloat(d[k]); });
        liveBound = true;
        emit();
      }, function () { /* stay on simulation */ });
    } catch (e) { /* stay on simulation */ }
  }

  // ====================== ALERT FEED RENDERER ======================
  function renderAlerts(sel) {
    var host = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!host) return;
    function paint(snap) {
      host.innerHTML = snap.alerts.map(function (a) {
        var cls = a.level === 'critical' ? 'critical' : a.level === 'warning' ? 'warning' : a.level === 'success' ? 'success' : '';
        return '<div class="alert ' + cls + '" data-level="' + a.level + '"><i class="ph-fill ' + a.icon + '"></i>' +
          '<div class="alert-content"><h4>' + a.title + '</h4><small>' + a.sub + '</small></div></div>';
      }).join('');
    }
    paint(last || snapshot());
    on(paint);
  }

  function on(fn) {
    listeners.push(fn);
    if (last) try { fn(last); } catch (e) {}
    return function () { listeners = listeners.filter(function (f) { return f !== fn; }); };
  }

  // ====================== PUBLIC API ======================
  window.ALCURA = {
    snapshot: function () { return last || snapshot(); },
    on: on,
    get control() { return control; },
    setControl: function (key, val) {
      if (key === 'spectrum' && typeof val === 'object') control.spectrum = Object.assign({}, control.spectrum, val);
      else control[key] = val;
      persistControl();
      emit();
    },
    renderAlerts: renderAlerts,
    refresh: emit
  };

  // ---- Boot ----
  function boot() {
    tryBindLive();
    emit();
    setInterval(function () { if (!liveBound) randomWalk(); emit(); }, 4000);
    // Re-render all generated text when the language changes
    document.addEventListener('alcura:lang', function () { emit(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
