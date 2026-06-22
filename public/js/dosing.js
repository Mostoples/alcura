/* ============================================================
   ALCURA — Maintenance / Dosing Assistant.
   Turns raw sensor readings + user thresholds into concrete,
   actionable steps with approximate quantities (nutrient grams,
   bicarbonate grams, water litres) scaled to the culture volume.

   Quantities are practical approximations for a hobby Spirulina
   reactor — always re-measure after dosing.

   API (window.ALCURA_DOSING):
     volume()        -> configured culture volume (L)
     setVolume(L)    -> persist culture volume
     compute()       -> { volume, items:[{severity,icon,title{en,id,ja},detail{en,id,ja}}] }
   severity: 'do' (act now) | 'watch' (keep an eye) | 'ok'
   ============================================================ */
(function () {
  'use strict';
  var VKEY = 'alcuraCultureVolume';
  var DEFAULT_V = 5;

  function volume() { var v = parseFloat(localStorage.getItem(VKEY)); return (v >= 0.5 && v <= 500) ? v : DEFAULT_V; }
  function setVolume(v) { v = parseFloat(v); if (v >= 0.5 && v <= 500) { try { localStorage.setItem(VKEY, String(v)); } catch (e) {} } return volume(); }
  function r1(n) { return Math.round(n * 10) / 10; }
  function item(sev, icon, title, detail) { return { severity: sev, icon: icon, title: title, detail: detail }; }

  function compute() {
    var V = volume(), items = [];
    if (typeof window.ALCURA === 'undefined') return { volume: V, items: items };
    var snap = ALCURA.snapshot(), TH = ALCURA.thresholds;
    var c = snap.culture, lvl = snap.s.level;

    // --- Nutrients (TDS) ---
    var tdsTarget = TH.tdsLow + 200;
    if (c.tds < TH.tdsLow) {
      var g = Math.max(0.1, r1((tdsTarget - c.tds) / 650 * V));   // ~650 ppm per g/L
      items.push(item('do', 'ph-flask',
        { en: 'Add nutrients', id: 'Tambah nutrisi', ja: '栄養を追加' },
        { en: 'TDS ' + c.tds + ' ppm is below ' + TH.tdsLow + '. Add ~' + g + ' g nutrient mix for ' + V + ' L to reach ~' + tdsTarget + ' ppm.',
          id: 'TDS ' + c.tds + ' ppm di bawah ' + TH.tdsLow + '. Tambah ~' + g + ' g campuran nutrisi untuk ' + V + ' L agar mencapai ~' + tdsTarget + ' ppm.',
          ja: 'TDS ' + c.tds + ' ppm が ' + TH.tdsLow + ' 未満。' + V + ' L に栄養を約 ' + g + ' g 追加し約 ' + tdsTarget + ' ppm へ。' }));
    }

    // --- pH ---
    if (c.ph < TH.phMin) {
      var bicarb = Math.max(0.2, r1((TH.phMin - c.ph) * V * 0.5));
      items.push(item('do', 'ph-test-tube',
        { en: 'Raise pH', id: 'Naikkan pH', ja: 'pHを上げる' },
        { en: 'pH ' + c.ph + ' is low. Add ~' + bicarb + ' g sodium bicarbonate for ' + V + ' L, then re-measure after ~30 min.',
          id: 'pH ' + c.ph + ' rendah. Tambah ~' + bicarb + ' g sodium bikarbonat untuk ' + V + ' L, lalu ukur ulang setelah ~30 menit.',
          ja: 'pH ' + c.ph + ' が低い。' + V + ' L に重曹を約 ' + bicarb + ' g 追加し、約30分後に再測定。' }));
    } else if (c.ph > TH.phMax) {
      items.push(item('do', 'ph-test-tube',
        { en: 'Lower pH', id: 'Turunkan pH', ja: 'pHを下げる' },
        { en: 'pH ' + c.ph + ' is high. Enable CO₂ injection (or add a little culture-safe acid) and re-check.',
          id: 'pH ' + c.ph + ' tinggi. Aktifkan injeksi CO₂ (atau tambah sedikit asam aman-kultur) lalu cek ulang.',
          ja: 'pH ' + c.ph + ' が高い。CO₂注入を有効化（または培養に安全な酸を少量）し再確認。' }));
    }

    // --- Water level ---
    if (lvl < 75) {
      var target = 90, topUp = Math.max(0.1, r1((target - lvl) / 100 * V));
      items.push(item(lvl < TH.levelLow ? 'do' : 'watch', 'ph-drop',
        { en: 'Top up water', id: 'Isi ulang air', ja: '水を補充' },
        { en: 'Water level ' + Math.round(lvl) + '%. Add ~' + topUp + ' L of dechlorinated water to reach ~' + target + '%.',
          id: 'Level air ' + Math.round(lvl) + '%. Tambah ~' + topUp + ' L air bebas klorin agar mencapai ~' + target + '%.',
          ja: '水位 ' + Math.round(lvl) + '%。脱塩素水を約 ' + topUp + ' L 追加し約 ' + target + '% へ。' }));
    }

    // --- Temperature ---
    if (c.temp > TH.tempMax) {
      items.push(item('watch', 'ph-thermometer-hot',
        { en: 'Cool the culture', id: 'Dinginkan kultur', ja: '培養を冷やす' },
        { en: 'Temp ' + c.temp + '°C above ' + TH.tempMax + '°C — lower LED intensity or improve ventilation/cooling.',
          id: 'Suhu ' + c.temp + '°C di atas ' + TH.tempMax + '°C — turunkan intensitas LED atau tingkatkan ventilasi/pendingin.',
          ja: '温度 ' + c.temp + '°C が ' + TH.tempMax + '°C 超 — LEDを下げるか換気/冷却を改善。' }));
    } else if (c.temp < TH.tempMin) {
      items.push(item('watch', 'ph-thermometer-cold',
        { en: 'Warm the culture', id: 'Hangatkan kultur', ja: '培養を温める' },
        { en: 'Temp ' + c.temp + '°C below ' + TH.tempMin + '°C — raise LED or add gentle heating.',
          id: 'Suhu ' + c.temp + '°C di bawah ' + TH.tempMin + '°C — naikkan LED atau beri pemanasan ringan.',
          ja: '温度 ' + c.temp + '°C が ' + TH.tempMin + '°C 未満 — LEDを上げるか弱い加熱を。' }));
    }

    // --- Harvest / dilution when dense ---
    if (snap.harvest.readiness >= 90) {
      var harvestL = r1(V * 0.3);
      items.push(item('do', 'ph-basket',
        { en: 'Partial harvest', id: 'Panen sebagian', ja: '部分収穫' },
        { en: 'Culture is dense (OD ' + c.od + '). Harvest ~' + harvestL + ' L, then top up with fresh medium to keep growth going.',
          id: 'Kultur pekat (OD ' + c.od + '). Panen ~' + harvestL + ' L, lalu isi ulang medium baru agar pertumbuhan berlanjut.',
          ja: '培養が高密度 (OD ' + c.od + ')。約 ' + harvestL + ' L 収穫し、新しい培地で補充して成長を維持。' }));
    }

    if (!items.length) items.push(item('ok', 'ph-check-circle',
      { en: 'Culture is well-balanced', id: 'Kultur seimbang', ja: '培養は良好' },
      { en: 'All parameters are within your target ranges. No dosing needed right now.',
        id: 'Semua parameter dalam rentang target Anda. Tidak perlu dosis saat ini.',
        ja: 'すべて目標範囲内。今は投与不要です。' }));

    return { volume: V, items: items };
  }

  window.ALCURA_DOSING = { volume: volume, setVolume: setVolume, compute: compute };
})();
