/* ============================================================
   ALCURA — Sensors Engine
   Single source of truth for every device reading and every
   derived feature in the app.

   Data source:
     • Binds realtime to the Realtime Database `/sensor` node (firmware writes it).
     • Actuators bind to `/control` (fan/lamp/pump) via bindDevice()/setDevice().
     • Shows nothing but "--" placeholders until real RTDB data arrives —
       there is NO simulation; every value on screen is exactly what RTDB holds.

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

  // Current readings — start as NaN ("unknown"). Nothing fake is ever shown: each value
  // is filled the instant the Realtime Database pushes it, and the binder paints only
  // finite numbers (NaN keeps the "--" placeholder). No seeds, no simulation — the UI
  // always reflects exactly what RTDB holds, field by field, with no waiting.
  var NA = NaN;
  var S = {
    // gas (sensor/gas)
    co: NA, ch4: NA, co2: NA, h2: NA, o2: NA,
    // legacy gas mirrors (CO/CH₄/H₂ feed the gas-leak ranking)
    mq2_1: NA, mq2_2: NA, mq2_3: NA, mg811: NA, eco2: NA, tvoc: NA,
    // air (sensor/air)
    uv: NA, dht_t: NA, dht_h: NA, aht_t: NA, aht_h: NA,
    // water (sensor/water)
    ph: NA, tds: NA, mlx: NA, level: NA, turbidity: NA, dist: NA, green: NA,
    // device
    uptime: NA
  };

  // Firmware-computed status strings, keyed by sensor (authoritative when present).
  var STATUS = {};

  var listeners = [];
  var liveBound = false;
  var last = null;

  // ---- User-configurable alert thresholds (editable in Settings) ----
  // Calibrated to the real device: neutral-pH water + electrochemical gas array.
  var TH_DEFAULTS = {
    phMin: 6.5, phMax: 8.0,    // ideal water pH window
    tdsLow: 250,               // dissolved-solids attention floor (ppm)
    tempMin: 22, tempMax: 32,  // ideal water temp (°C)
    levelLow: 30,              // water-level refill alert (%)
    co2Warn: 1000,             // indoor CO₂ attention (ppm)
    gasWarn: 35, gasDanger: 200 // CO (carbon monoxide) attention/danger (ppm)
  };
  function loadThresholds() {
    try { return Object.assign({}, TH_DEFAULTS, JSON.parse(localStorage.getItem('alcuraThresholds') || '{}')); }
    catch (e) { return Object.assign({}, TH_DEFAULTS); }
  }
  var thresholds = loadThresholds();
  function persistThresholds() { try { localStorage.setItem('alcuraThresholds', JSON.stringify(thresholds)); } catch (e) {} }

  // ---- Harvest yield calibration: grams of dry biomass per unit OD ----
  // harvest-log.js writes a calibrated factor from real logged harvests; fall back to 210.
  function gramsPerOD() {
    try { var f = parseFloat(localStorage.getItem('alcuraYieldFactor')); return (f >= 60 && f <= 600) ? f : 210; }
    catch (e) { return 210; }
  }

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function num(v) { var n = parseFloat(v); return isNaN(n) ? null : n; }

  function resolve(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return (o == null) ? undefined : o[k];
    }, obj);
  }

  // Keep legacy/derived keys consistent with the canonical RTDB sensors.
  function syncMirrors() {
    S.mg811 = S.co2; S.eco2 = S.co2;            // indoor CO₂
    S.mq2_1 = S.co; S.mq2_2 = S.ch4; S.mq2_3 = S.h2; // CO / CH₄ / H₂ leak ranking
  }

  // ---- Firmware status helpers (firmware is the source of truth for statuses) ----
  // Which firmware status string applies to each bound sensor key.
  var FW_STATUS_KEY = {
    dht_t: 'temp', aht_t: 'temp', uv: 'uv', co: 'co', mq2_1: 'co',
    ph: 'ph', tds: 'tds', level: 'level', turbidity: 'turbidity'
  };
  function fwState(str) {
    if (!str) return null;
    var s = String(str).toLowerCase();
    if (/error|danger|critical|hazard|bahaya|high/.test(s)) return 'danger';
    if (/warn|caution|fair|waspada|poor|moderate/.test(s)) return 'warn';
    return 'ok'; // optimal, normal, low, clear, good, safe, ideal
  }
  function localizeStatus(s) {
    var map = {
      normal: ['Normal', 'Normal', '正常'], optimal: ['Optimal', 'Optimal', '最適'],
      low: ['Low', 'Rendah', '低'], high: ['High', 'Tinggi', '高'],
      warning: ['Warning', 'Waspada', '警告'], error: ['Error', 'Error', 'エラー'],
      fair: ['Fair', 'Cukup', '普通'], clear: ['Clear', 'Jernih', '澄明'],
      good: ['Good', 'Baik', '良好'], safe: ['Safe', 'Aman', '安全']
    };
    var k = String(s).toLowerCase();
    return map[k] ? L(map[k][0], map[k][1], map[k][2]) : s;
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
    var co2 = S.co2, co = S.co, rh = S.dht_h, o2 = S.o2;
    var combustible = Math.max(S.ch4, S.h2);          // flammable-gas headroom
    var sCo2 = score2(co2, 500, 2000);                // indoor CO₂ comfort
    var sCo = score2(co, 9, 200);                     // carbon monoxide (WHO 9ppm good)
    var sGas = score2(combustible, 400, 4000);        // CH₄ / H₂ build-up
    var sRh = clamp(100 - Math.abs(rh - 55) * 2.5, 0, 100);
    var score = Math.round(sCo2 * 0.25 + sCo * 0.35 + sGas * 0.20 + sRh * 0.20);
    var finite = isFinite(score);                      // false until real RTDB data
    var label = finite ? airLabel(score) : null;
    var aura = finite ? (score >= 70 ? 'green' : score >= 50 ? 'amber' : 'coral') : null;
    return {
      score: score, label: label, aura: aura,
      co2: Math.round(co2), co: Math.round(co), ch4: Math.round(S.ch4), h2: Math.round(S.h2),
      o2: Math.round(o2), eco2: Math.round(S.eco2), gas: Math.round(Math.max(co, combustible)), rh: Math.round(rh)
    };
  }

  // Gas-leak detection across the real electrochemical array (CO / CH₄ / H₂).
  // Each gas has its own ppm thresholds; CO defers to the firmware status when present.
  function computeSafety() {
    var rank = { ok: 0, warn: 1, danger: 2 };
    var defs = [
      { id: 'CO', v: S.co, warn: thresholds.gasWarn, danger: thresholds.gasDanger, fw: STATUS.co, loc: { en: 'Carbon Monoxide', id: 'Karbon Monoksida', ja: '一酸化炭素' } },
      { id: 'CH₄', v: S.ch4, warn: 1000, danger: 5000, loc: { en: 'Methane', id: 'Metana', ja: 'メタン' } },
      { id: 'H₂', v: S.h2, warn: 1000, danger: 4000, loc: { en: 'Hydrogen', id: 'Hidrogen', ja: '水素' } }
    ];
    var arr = defs.map(function (d) {
      var lvl = d.fw ? fwState(d.fw) : (d.v > d.danger ? 'danger' : d.v > d.warn ? 'warn' : 'ok');
      var pct = clamp(Math.round(d.v / d.danger * 100), 3, 100);
      return { id: d.id, v: d.v, loc: d.loc, level: lvl, pct: pct };
    }).sort(function (a, b) { return (rank[b.level] - rank[a.level]) || (b.v - a.v); });
    var top = arr[0];
    var loc = L(top.loc.en, top.loc.id, top.loc.ja);
    var v = Math.round(top.v);
    var level = top.level;
    var message = level === 'danger'
      ? L('Dangerous ' + loc + ' level detected (' + v + ' ppm). Ventilate immediately & find the source!',
          'Kadar ' + loc + ' berbahaya terdeteksi (' + v + ' ppm). Segera ventilasi & cari sumbernya!',
          loc + 'が危険濃度 (' + v + ' ppm)。直ちに換気し原因を特定してください！')
      : level === 'warn'
        ? L(loc + ' is elevated (' + v + ' ppm). Keep the area ventilated & monitor.',
            'Kadar ' + loc + ' meningkat (' + v + ' ppm). Jaga ventilasi & pantau.',
            loc + 'が上昇 (' + v + ' ppm)。換気を保ち監視してください。')
        : L('No gas leak detected. Environment is safe.',
            'Tidak ada kebocoran gas terdeteksi. Lingkungan aman.',
            'ガス漏れは検知されていません。環境は安全です。');
    var hasGas = isFinite(S.co) || isFinite(S.ch4) || isFinite(S.h2);   // any real gas reading?
    var aura = !hasGas ? null : level === 'danger' ? 'coral' : level === 'warn' ? 'amber' : 'green';
    return { level: level, aura: aura, loc: loc, value: v, message: message, sensors: arr };
  }

  // Map a firmware status string into the culture engine's ok/warn/bad scale.
  function fwCult(str) { var s = fwState(str); return s === 'danger' ? 'bad' : s; }

  function computeCulture() {
    var ph = S.ph, tds = S.tds, temp = S.mlx, turb = S.turbidity;
    var TH = thresholds, rec = [];

    var phStat = STATUS.ph ? fwCult(STATUS.ph)
      : (ph >= TH.phMin && ph <= TH.phMax) ? 'ok' : (ph < TH.phMin - 0.5 || ph > TH.phMax + 0.5) ? 'bad' : 'warn';
    if (phStat !== 'ok') rec.push(ph < TH.phMin
      ? L('pH low (acidic) — add a base/buffer to raise it.', 'pH rendah (asam) — tambah basa/buffer untuk menaikkannya.', 'pHが低い（酸性）— 塩基/緩衝剤で上げてください。')
      : L('pH high (alkaline) — add a mild acid/buffer to lower it.', 'pH tinggi (basa) — tambah asam/buffer ringan untuk menurunkannya.', 'pHが高い（アルカリ性）— 弱酸/緩衝剤で下げてください。'));

    var tdsStat = STATUS.tds ? fwCult(STATUS.tds)
      : (tds <= TH.tdsLow + 200 && tds >= TH.tdsLow * 0.4) ? 'ok' : (tds > TH.tdsLow + 500) ? 'bad' : 'warn';
    if (tdsStat !== 'ok') rec.push(tds > TH.tdsLow + 200
      ? L('TDS high — dilute with clean water or check for buildup.', 'TDS tinggi — encerkan dengan air bersih atau cek penumpukan.', 'TDSが高い — きれいな水で薄めるか堆積を確認してください。')
      : L('TDS low — top up minerals/nutrients.', 'TDS rendah — tambahkan mineral/nutrisi.', 'TDSが低い — ミネラル/栄養を補充してください。'));

    var tStat = (temp >= TH.tempMin && temp <= TH.tempMax) ? 'ok' : (temp > TH.tempMax + 4 || temp < TH.tempMin - 7) ? 'bad' : 'warn';
    if (tStat !== 'ok') rec.push(temp > TH.tempMax
      ? L('Water temperature high — reduce heating/lighting.', 'Suhu air tinggi — kurangi pemanasan/pencahayaan.', '水温が高い — 加熱/照明を下げてください。')
      : L('Water temperature low — increase heating/lighting.', 'Suhu air rendah — tingkatkan pemanasan/pencahayaan.', '水温が低い — 加熱/照明を上げてください。'));

    var turbStat = STATUS.turbidity ? fwCult(STATUS.turbidity) : (turb < 5 ? 'ok' : turb < 25 ? 'warn' : 'bad');
    if (turbStat === 'bad') rec.push(L('Water is turbid — filter or perform a partial water change.', 'Air keruh — saring atau lakukan pergantian air sebagian.', '水が濁っています — ろ過または部分換水をしてください。'));

    // Density proxy from turbidity (no optical-density sensor on this device).
    var od = +clamp(0.8 + turb * 0.45, 0.5, 2.2).toFixed(2);
    var chl = Math.round(clamp(58 + turb * 12, 40, 99));

    var hasC = isFinite(ph) || isFinite(tds) || isFinite(temp) || isFinite(turb);   // any real reading?
    var status = ([phStat, tdsStat, tStat, turbStat].indexOf('bad') >= 0) ? 'critical'
      : ([phStat, tdsStat, tStat, turbStat].indexOf('warn') >= 0) ? 'attention' : 'optimal';
    if (hasC && !rec.length) rec.push(L('All water parameters are within ideal range. Keep current settings.', 'Semua parameter air dalam rentang ideal. Pertahankan pengaturan saat ini.', 'すべての水質パラメータが理想範囲内です。現在の設定を維持してください。'));
    var aura = !hasC ? null : status === 'critical' ? 'coral' : status === 'attention' ? 'amber' : 'green';
    return {
      status: status, aura: aura, ph: +ph.toFixed(2), phStat: phStat, tds: Math.round(tds), tdsStat: tdsStat,
      temp: +temp.toFixed(1), tStat: tStat, turbidity: +turb.toFixed(2), turbStat: turbStat,
      od: od, chl: chl, green: Math.round(S.green), greenStat: turbStat, recommendations: rec
    };
  }

  function computeHarvest(c) {
    var target = 1.6, growthPerDay = 0.045;
    var days = Math.max(0, Math.ceil((target - c.od) / growthPerDay));
    var readiness = Math.round(clamp(c.od / target * 100, 5, 99));
    var yieldG = Math.round(c.od * gramsPerOD());
    return { days: days, readiness: readiness, yieldG: yieldG, od: c.od };
  }

  // ---- What-if growth projection (powers the Simulator page) ----
  function simulate(p) {
    p = p || {};
    var led = clamp(p.ledIntensity != null ? +p.ledIntensity : control.ledIntensity, 0, 100);
    var aer = clamp(p.aeration != null ? +p.aeration : control.aeration, 0, 100);
    var co2 = p.co2Injection != null ? !!p.co2Injection : control.co2Injection;
    var temp = p.temp != null ? +p.temp : S.mlx;
    var odNow = computeCulture().od;

    // Light response: climbs to a plateau near 78%, then mild photo-inhibition.
    var fLight = led <= 78 ? (0.25 + 0.75 * (led / 78)) : (1 - (led - 78) / 22 * 0.18);
    fLight = clamp(fLight, 0.2, 1);
    var fAer = clamp(0.55 + 0.45 * (aer / 80), 0.45, 1.1);    // mixing & CO₂ transfer
    var fCo2 = co2 ? 1.12 : 0.94;
    var fTemp = clamp(1 - Math.abs(temp - 29) * 0.06, 0.45, 1); // optimal ≈ 29°C
    var base = 0.045;
    var g = base * fLight * fAer * fCo2 * fTemp;               // OD gained per day

    var target = 1.6;
    var days = g > 0 ? Math.max(0, Math.ceil((target - odNow) / g)) : 99;
    var readiness = Math.round(clamp(odNow / target * 100, 5, 99));
    var yieldG = Math.round(target * gramsPerOD());

    // Energy: 8 LED modules ≈ 42 W peak + aeration pump ≈ 6 W at full.
    var energyDay = +(((led / 100 * 42) + (aer / 100 * 6)) * 24 / 1000).toFixed(2); // kWh/day
    var energyToHarvest = +(energyDay * days).toFixed(1);

    var curve = [], v = odNow, n = Math.min(Math.max(days, 6), 30);
    for (var i = 0; i < n; i++) { curve.push(+Math.min(target, v).toFixed(2)); v += g; }

    return {
      ledIntensity: led, aeration: aer, co2Injection: co2,
      growthPerDay: +g.toFixed(4), days: days, readiness: readiness, yieldG: yieldG,
      energyDay: energyDay, energyToHarvest: energyToHarvest, odNow: +odNow.toFixed(2), target: target,
      curve: curve, factors: { light: +fLight.toFixed(2), aeration: +fAer.toFixed(2), co2: +fCo2.toFixed(2), temp: +fTemp.toFixed(2) }
    };
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
    var TH = thresholds, r = [];
    if (S.level < TH.levelLow) r.push({ level: 'warning', icon: 'ph-drop', title: L('Low water level', 'Level air rendah', '水位が低い'), sub: L('Culture water ' + Math.round(S.level) + '% — refill soon.', 'Air kultur ' + Math.round(S.level) + '% — isi ulang segera.', '培養水 ' + Math.round(S.level) + '% — 早めに補充してください。') });
    if (c.tds < TH.tdsLow) r.push({ level: c.tds < TH.tdsLow - 200 ? 'critical' : 'warning', icon: 'ph-flask', title: L('Nutrients running low', 'Nutrisi menipis', '栄養不足'), sub: L('TDS ' + c.tds + ' ppm — add nutrient solution.', 'TDS ' + c.tds + ' ppm — tambahkan larutan nutrisi.', 'TDS ' + c.tds + ' ppm — 栄養液を追加してください。') });
    var phRange = '(' + TH.phMin + '–' + TH.phMax + ')';
    if (c.phStat !== 'ok') r.push({ level: c.phStat === 'bad' ? 'critical' : 'warning', icon: 'ph-test-tube', title: L('pH needs correction', 'pH perlu koreksi', 'pHの調整が必要'), sub: L('pH ' + c.ph + ' is outside the ideal range ' + phRange + '.', 'pH ' + c.ph + ' di luar rentang ideal ' + phRange + '.', 'pH ' + c.ph + ' は理想範囲' + phRange + '外です。') });
    if (c.tStat !== 'ok') r.push({ level: c.tStat === 'bad' ? 'critical' : 'warning', icon: 'ph-thermometer-hot', title: L('Water temp not ideal', 'Suhu air tidak ideal', '水温が不適'), sub: L('Temp ' + c.temp + '°C — adjust heating/cooling.', 'Suhu ' + c.temp + '°C — sesuaikan pemanas/pendingin.', '温度 ' + c.temp + '°C — 加熱/冷却を調整してください。') });
    return r;
  }

  function computeAuto(c, air) {
    var rec = [], led = 72, aer = 60, co2inj = false;
    var hour = new Date().getHours();
    var night = hour >= 22 || hour < 6;
    if (night) { led = 25; aer = 40; rec.push(L('Night mode (' + pad(hour) + ':00): LED lowered for culture rest phase.', 'Mode malam (' + pad(hour) + ':00): LED diturunkan untuk fase istirahat kultur.', '夜間モード (' + pad(hour) + ':00)：培養の休息のためLEDを下げました。')); }
    if (air.co2 > thresholds.co2Warn) { led = Math.min(100, led + 15); aer = Math.min(100, aer + 20); rec.push(L('High CO₂ (' + air.co2 + ' ppm) — LED & aeration raised to speed up photosynthesis.', 'CO₂ tinggi (' + air.co2 + ' ppm) — LED & aerasi dinaikkan untuk percepat fotosintesis.', 'CO₂が高い (' + air.co2 + ' ppm) — 光合成促進のためLEDとエアレーションを上げました。')); }
    if (c.temp > thresholds.tempMax) { led = Math.max(15, led - 20); rec.push(L('Culture temp ' + c.temp + '°C — LED lowered to cool down.', 'Suhu kultur ' + c.temp + '°C — LED diturunkan untuk mendinginkan.', '培養温度 ' + c.temp + '°C — 冷却のためLEDを下げました。')); }
    if (c.ph > thresholds.phMax - 0.2) { co2inj = true; rec.push(L('pH ' + c.ph + ' high — CO₂ injection enabled to stabilize pH.', 'pH ' + c.ph + ' tinggi — injeksi CO₂ diaktifkan untuk menstabilkan pH.', 'pH ' + c.ph + ' が高い — pH安定化のためCO₂注入を有効化。')); }
    if (c.od >= 1.5) { rec.push(L('High density (OD ' + c.od + ') — culture nearing harvest, keep lighting.', 'Densitas tinggi (OD ' + c.od + ') — kultur mendekati panen, pertahankan cahaya.', '高密度 (OD ' + c.od + ') — 収穫間近、照明を維持。')); }
    if (!rec.length) rec.push(L('Conditions optimal — system keeps current settings.', 'Kondisi optimal — sistem mempertahankan pengaturan saat ini.', '状態は最適 — 現在の設定を維持します。'));
    return { ledIntensity: Math.round(led), aeration: Math.round(aer), co2Injection: co2inj, recommendations: rec };
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  // ---- Predictive / anomaly insights from the rolling history (heads-up BEFORE thresholds trip) ----
  function insight(icon, title, sub) { return { level: 'warning', icon: icon, title: title, sub: sub, predictive: true }; }
  function computeInsights(c, air) {
    var out = [], H = window.ALCURA_HISTORY; if (!H) return out;
    var TH = thresholds, win = 3 * 3600 * 1000, hrs = 3;

    var t = H.stat('tds', win), tDrop = t.first - t.last;           // nutrients depleting
    if (tDrop > 25 && t.last > TH.tdsLow) {
      var tRate = tDrop / hrs, tEta = Math.round((t.last - TH.tdsLow) / tRate);
      if (tEta > 0 && tEta <= 36) out.push(insight('ph-flask',
        L('Nutrients trending down', 'Nutrisi cenderung menurun', '栄養が低下傾向'),
        L('TDS dropping ~' + Math.round(tRate) + ' ppm/h — hits the low limit in ~' + tEta + 'h. Plan a nutrient top-up.',
          'TDS turun ~' + Math.round(tRate) + ' ppm/jam — capai batas rendah ~' + tEta + ' jam lagi. Siapkan penambahan nutrisi.',
          'TDSが約' + Math.round(tRate) + ' ppm/時で低下 — 約' + tEta + '時間で下限に到達。栄養補充を計画してください。')));
    }

    var w = H.stat('level', win), wDrop = w.first - w.last;          // water level falling
    if (wDrop > 3 && w.last > TH.levelLow) {
      var wRate = wDrop / hrs, wEta = Math.round((w.last - TH.levelLow) / wRate);
      if (wEta > 0 && wEta <= 48) out.push(insight('ph-drop',
        L('Water level dropping', 'Level air menurun', '水位が低下'),
        L('Level falling ~' + wRate.toFixed(1) + '%/h — refill needed in ~' + wEta + 'h.',
          'Level turun ~' + wRate.toFixed(1) + '%/jam — perlu isi ulang ~' + wEta + ' jam lagi.',
          '水位が約' + wRate.toFixed(1) + '%/時で低下 — 約' + wEta + '時間で補充が必要。')));
    }

    var ph = H.stat('ph', win);                                     // pH drifting toward a limit
    if (ph.last - ph.first > 0.2 && ph.last > TH.phMax - 0.3 && ph.last <= TH.phMax) out.push(insight('ph-test-tube',
      L('pH drifting high', 'pH cenderung naik', 'pHが上昇傾向'),
      L('pH rising toward the upper limit (' + TH.phMax + '). Consider CO₂ injection soon.',
        'pH naik mendekati batas atas (' + TH.phMax + '). Pertimbangkan injeksi CO₂.',
        'pHが上限 (' + TH.phMax + ') に接近。CO₂注入を検討してください。')));
    else if (ph.first - ph.last > 0.2 && ph.last < TH.phMin + 0.3 && ph.last >= TH.phMin) out.push(insight('ph-test-tube',
      L('pH drifting low', 'pH cenderung turun', 'pHが低下傾向'),
      L('pH falling toward the lower limit (' + TH.phMin + '). Consider adding bicarbonate.',
        'pH turun mendekati batas bawah (' + TH.phMin + '). Pertimbangkan menambah bikarbonat.',
        'pHが下限 (' + TH.phMin + ') に接近。重曹の追加を検討してください。')));

    var g = H.stat('gas', win);                                     // smoke/gas creeping up (pre-alarm)
    if (g.last > g.first * 1.2 && g.last > TH.gasWarn * 0.7 && g.last <= TH.gasWarn) out.push(insight('ph-warning',
      L('Gas levels creeping up', 'Kadar gas merangkak naik', 'ガス濃度が上昇中'),
      L('Smoke/gas trending upward — keep the area ventilated.',
        'Asap/gas cenderung meningkat — jaga ventilasi area.',
        '煙/ガスが上昇傾向 — 換気を保ってください。')));
    return out;
  }

  function buildAlerts(saf, c, h, air, rem) {
    var a = [];
    if (saf.level === 'danger') a.push({ level: 'critical', icon: 'ph-fire', title: L('Danger: smoke/gas detected', 'Bahaya: asap/gas terdeteksi', '危険：煙/ガスを検知'), sub: saf.message });
    else if (saf.level === 'warn') a.push({ level: 'warning', icon: 'ph-warning', title: L('Gas level rising', 'Kadar gas meningkat', 'ガス濃度が上昇'), sub: saf.message });
    if (c.status === 'critical') a.push({ level: 'critical', icon: 'ph-flask', title: L('Culture needs attention', 'Kultur butuh perhatian', '培養に注意が必要'), sub: c.recommendations[0] });
    rem.forEach(function (r) { a.push({ level: r.level, icon: r.icon, title: r.title, sub: r.sub }); });
    computeInsights(c, air).forEach(function (ins) { a.push(ins); });   // predictive heads-up alerts
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
  // App-side preferences only (autoMode/spectrum/mode). The real actuators live in
  // `device` below and are written to RTDB /control — NOT this abstract object.
  function persistControl() {
    try { localStorage.setItem('alcuraControl', JSON.stringify(control)); } catch (e) {}
  }

  // ====================== REAL DEVICE CONTROL (RTDB /control) ======================
  // Firmware actuator state. Mirrors the exact /control structure the device reads.
  var DEVICE_DEFAULTS = {
    fan: { fan1: false, fan2: false },
    lamp: { brightness: 72, l1: false, l2: false, l3: false, l4: false, l5: false },
    pump: { pump1: false, pump2: false },
    uptime: 0
  };
  var device = JSON.parse(JSON.stringify(DEVICE_DEFAULTS));
  var deviceBound = false;

  function deviceView() {
    var l = device.lamp, f = device.fan, p = device.pump;
    var lampsOn = ['l1', 'l2', 'l3', 'l4', 'l5'].filter(function (k) { return !!l[k]; }).length;
    var fansOn = (f.fan1 ? 1 : 0) + (f.fan2 ? 1 : 0);
    var pumpsOn = (p.pump1 ? 1 : 0) + (p.pump2 ? 1 : 0);
    return {
      fan: Object.assign({}, f), lamp: Object.assign({}, l), pump: Object.assign({}, p),
      brightness: +l.brightness || 0, lampsOn: lampsOn, fansOn: fansOn, pumpsOn: pumpsOn, uptime: device.uptime
    };
  }
  // Circulation proxy (for impact/energy): share of fans+pumps that are running.
  function circulationPct() {
    var d = deviceView();
    return Math.round((d.fansOn + d.pumpsOn) / 4 * 100);
  }

  function bindDevice() {
    try {
      if (typeof firebase === 'undefined' || !firebase.apps || !firebase.apps.length || typeof firebase.database !== 'function') return;
      firebase.database().ref('control').on('value', function (snap) {
        var d = snap.val();
        if (!d) return;
        if (d.fan) device.fan = Object.assign({}, device.fan, d.fan);
        if (d.lamp) device.lamp = Object.assign({}, device.lamp, d.lamp);
        if (d.pump) device.pump = Object.assign({}, device.pump, d.pump);
        if (d.uptime != null) device.uptime = +d.uptime;
        if (d.lamp && d.lamp.brightness != null) control.ledIntensity = +d.lamp.brightness;
        deviceBound = true;
        emit();
      }, function () { /* keep last-known device state */ });
    } catch (e) { /* ignore */ }
  }

  // Write a single actuator. path is 'fan/fan1' | 'lamp/brightness' | 'lamp/l3' | 'pump/pump2'.
  function setDevice(path, val) {
    var parts = String(path).split('/');
    if (parts.length === 2 && device[parts[0]]) device[parts[0]][parts[1]] = val;
    if (parts[0] === 'lamp' && parts[1] === 'brightness') control.ledIntensity = +val;
    try {
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && typeof firebase.database === 'function') {
        var u = {}; u[path] = val;
        firebase.database().ref('control').update(u);
      }
    } catch (e) { /* ignore */ }
    emit();
  }

  // ====================== SNAPSHOT + EMIT ======================
  function snapshot() {
    var air = computeAir();
    var saf = computeSafety();
    var c = computeCulture();
    var h = computeHarvest(c);
    var au = computeAuto(c, air);                 // advisory recommendations only
    // Effective actuator state comes from the REAL device (lamp brightness + fans/pumps).
    var applied = { ledIntensity: device.lamp.brightness, aeration: circulationPct(), co2Injection: false };
    var im = computeImpact(c, applied);
    var rem = computeReminders(c);
    var alerts = buildAlerts(saf, c, h, air, rem);
    return {
      s: Object.assign({}, S),
      air: air, safety: saf, culture: c, harvest: h, impact: im,
      reminders: rem, auto: au, applied: applied, control: control, device: deviceView(), alerts: alerts
    };
  }

  // ---- DOM auto-binder ----
  function fmt(el, v) {
    var dec = el.getAttribute('data-dec');
    if (typeof v === 'number' && dec != null) return v.toFixed(+dec);
    return v;
  }
  // A value is "real" (and thus paintable) only when it's a finite number or a
  // non-empty string/bool. null / undefined / NaN keep the element's "--" placeholder.
  // This makes every binding reflect exactly what RTDB holds, field by field, the instant
  // it arrives — no global wait-gate, no seeds, no fabricated numbers.
  function realVal(v) {
    if (v == null) return false;
    if (typeof v === 'number') return isFinite(v);
    if (typeof v === 'object') return false;
    return true; // string / boolean
  }
  function applyBindings(snap) {
    document.querySelectorAll('[data-bind]').forEach(function (el) {
      var v = resolve(snap, el.getAttribute('data-bind'));
      if (realVal(v)) el.textContent = fmt(el, v);
    });
    document.querySelectorAll('[data-sensor]').forEach(function (el) {
      var v = snap.s[el.getAttribute('data-sensor')];
      if (v == null || !isFinite(v)) return;         // unknown → keep "--"
      var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      el.textContent = dec ? v.toFixed(dec) : Math.round(v).toString();
      updateStatusBadge(el, v);
    });
    document.querySelectorAll('[data-bind-w]').forEach(function (el) {
      var v = resolve(snap, el.getAttribute('data-bind-w'));
      if (realVal(v)) el.style.width = clamp(+v, 0, 100) + '%';
    });
    document.querySelectorAll('[data-bind-gp]').forEach(function (el) {
      var v = resolve(snap, el.getAttribute('data-bind-gp'));
      if (realVal(v)) el.style.setProperty('--gp', clamp(+v, 0, 100) + '%');
    });
    document.querySelectorAll('[data-bind-aura]').forEach(function (el) {
      var v = resolve(snap, el.getAttribute('data-bind-aura'));
      el.classList.remove('aura-green', 'aura-amber', 'aura-coral', 'aura-blue', 'aura-violet');
      if (v) el.classList.add('aura-' + v);
    });
  }

  // Status badge — prefers the firmware status string, falls back to per-value thresholds.
  function updateStatusBadge(valEl, v) {
    var card = valEl.closest('.metric-card');
    var badge = card && card.querySelector('[data-status]');
    if (!badge) return;
    var fw = STATUS[FW_STATUS_KEY[valEl.getAttribute('data-sensor')]];
    var state, label;
    if (fw) {
      state = fwState(fw); label = localizeStatus(fw);
    } else {
      var warn = num(valEl.getAttribute('data-warn'));
      var danger = num(valEl.getAttribute('data-danger'));
      if (warn == null && danger == null) return;
      state = (danger != null && v >= danger) ? 'danger' : (warn != null && v >= warn) ? 'warn' : 'ok';
    }
    badge.classList.remove('up', 'warn', 'danger');
    if (state === 'danger') { badge.classList.add('danger'); badge.textContent = label || L('Danger', 'Bahaya', '危険'); }
    else if (state === 'warn') { badge.classList.add('warn'); badge.textContent = label || L('Caution', 'Waspada', '注意'); }
    else {
      badge.classList.add('up');
      if (label) { badge.textContent = label; }
      else {
        var ok = badge.getAttribute('data-ok') || 'Aman';
        badge.textContent = (ok === 'Optimal') ? L('Optimal', 'Optimal', '最適') : L('Safe', 'Aman', '安全');
      }
    }
  }

  function emit() {
    last = snapshot();
    applyBindings(last);
    listeners.forEach(function (fn) { try { fn(last); } catch (e) {} });
    try { document.dispatchEvent(new CustomEvent('alcura:update', { detail: last })); } catch (e) {}
  }

  // ---- Realtime Database live binding ----
  // Firmware writes /sensor/{air,gas,water} + /sensor/uptime. We bind realtime and
  // map those fields onto the engine's canonical sensor keys.
  function mapLive(d) {
    var air = d.air || {}, gas = d.gas || {}, water = d.water || {};
    if (air.temp != null) { S.dht_t = +air.temp; S.aht_t = +air.temp; }
    if (air.humidity != null) { S.dht_h = +air.humidity; S.aht_h = +air.humidity; }
    if (air.uv_index != null) S.uv = +air.uv_index;
    if (gas.co2 != null) S.co2 = +gas.co2;
    if (gas.co != null) S.co = +gas.co;
    if (gas.ch4 != null) S.ch4 = +gas.ch4;
    if (gas.h2 != null) S.h2 = +gas.h2;
    if (gas.o2 != null) S.o2 = +gas.o2;
    if (water.ph != null) S.ph = +water.ph;
    if (water.tds != null) S.tds = +water.tds;
    if (water.temp != null) S.mlx = +water.temp;
    if (water.level != null) { S.level = +water.level; S.dist = clamp((100 - S.level) / 100 * 20 + 3, 2, 22); }
    if (water.turbidity != null) S.turbidity = +water.turbidity;
    if (d.uptime != null) S.uptime = +d.uptime;
    else if (gas.uptime != null) S.uptime = +gas.uptime;
    syncMirrors();
    // Firmware-computed status strings (authoritative for badges & diagnosis).
    STATUS = {
      temp: air.temp_status, uv: air.uv_status, co: gas.co_status,
      level: water.level_status, ph: water.ph_status, tds: water.tds_status,
      turbidity: water.turbidity_status
    };
  }

  function tryBindLive() {
    try {
      if (typeof firebase === 'undefined' || !firebase.apps || !firebase.apps.length || typeof firebase.database !== 'function') return;
      firebase.database().ref('sensor').on('value', function (snap) {
        var d = snap.val();
        if (!d) return;
        mapLive(d);
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
      if (!liveBound) {   // no fabricated alerts — wait for real RTDB data
        host.innerHTML = '<div class="alert"><i class="ph-fill ph-wifi-slash"></i>' +
          '<div class="alert-content"><h4>' + L('Waiting for sensor data', 'Menunggu data sensor', 'センサーデータ待ち') + '</h4>' +
          '<small>' + L('Connect the device to see live alerts.', 'Hubungkan perangkat untuk melihat peringatan langsung.', 'デバイスを接続するとライブ通知が表示されます。') + '</small></div></div>';
        return;
      }
      host.innerHTML = snap.alerts.map(function (a) {
        var cls = a.level === 'critical' ? 'critical' : a.level === 'warning' ? 'warning' : a.level === 'success' ? 'success' : '';
        var tag = a.predictive ? ' <span class="pred-tag"><i class="ph-fill ph-trend-up"></i>' + L('Prediction', 'Prediksi', '予測') + '</span>' : '';
        return '<div class="alert ' + cls + '" data-level="' + a.level + '"' + (a.predictive ? ' data-predictive="1"' : '') + '><i class="ph-fill ' + a.icon + '"></i>' +
          '<div class="alert-content"><h4>' + a.title + tag + '</h4><small>' + a.sub + '</small></div></div>';
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
    get device() { return deviceView(); },
    setDevice: setDevice,
    get deviceBound() { return deviceBound; },
    get live() { return liveBound; },
    renderAlerts: renderAlerts,
    simulate: simulate,
    refresh: emit,
    get thresholds() { return Object.assign({}, thresholds); },
    thresholdDefaults: function () { return Object.assign({}, TH_DEFAULTS); },
    setThresholds: function (obj) {
      if (obj && typeof obj === 'object') {
        Object.keys(TH_DEFAULTS).forEach(function (k) {
          if (obj[k] != null && !isNaN(parseFloat(obj[k]))) thresholds[k] = parseFloat(obj[k]);
        });
        persistThresholds();
        emit();
      }
      return Object.assign({}, thresholds);
    },
    resetThresholds: function () { thresholds = Object.assign({}, TH_DEFAULTS); persistThresholds(); emit(); return Object.assign({}, thresholds); }
  };

  // ---- Boot ----
  function boot() {
    tryBindLive();
    bindDevice();
    emit();
    // Refresh time-based derivations (impact accrual, auto night-mode). Sensor values
    // themselves only ever change when RTDB pushes — never simulated.
    setInterval(emit, 4000);
    // Re-render all generated text when the language changes
    document.addEventListener('alcura:lang', function () { emit(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
