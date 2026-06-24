/* ============================================================
   ALCURA — Reports & Export.
   - downloadCSV(): exports the recorded sensor history as CSV.
   - shareCard():  renders a shareable impact image (canvas) and
     shares it via the Web Share API, or downloads it as a fallback.
   - maybeWeekly(): if the "Weekly Impact Report" toggle is on and a
     week has passed, surfaces a summary (notification + toast).

   API: window.ALCURA_REPORT
   ============================================================ */
(function () {
  'use strict';
  function lang() { return (window.ALCURA_I18N && ALCURA_I18N.lang) || 'id'; }
  function T(en, id, ja) { var l = lang(); return l === 'en' ? en : l === 'ja' ? ja : id; }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function stamp(d) { d = d || new Date(); return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes()); }

  function triggerDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1500);
  }

  // ---- CSV of recorded history ----
  function csvText() {
    var H = window.ALCURA_HISTORY; if (!H || !H.dump) return '';
    var fields = H.fields ? H.fields() : ['co2', 'air', 'gas', 'ph', 'tds', 'temp', 'od', 'level', 'o2Today', 'co2Today', 'led', 'safety'];
    var head = ['timestamp', 'datetime'].concat(fields);
    var rows = [head.join(',')];
    H.dump().forEach(function (p) {
      var iso; try { iso = new Date(p.t).toISOString(); } catch (e) { iso = ''; }
      var row = [p.t, iso].concat(fields.map(function (f) { return p[f] != null ? p[f] : ''; }));
      rows.push(row.join(','));
    });
    return rows.join('\n');
  }
  function downloadCSV() {
    var txt = csvText();
    if (!txt) { if (window.toast) toast(T('No data to export yet.', 'Belum ada data untuk diekspor.', 'エクスポートするデータがまだありません。')); return; }
    triggerDownload(new Blob([txt], { type: 'text/csv;charset=utf-8' }), 'alcura-history-' + stamp() + '.csv');
    if (window.toast) toast(T('CSV exported ✓', 'CSV diekspor ✓', 'CSVをエクスポートしました ✓'));
  }

  // ---- Shareable impact card (canvas → image) ----
  function snap() { return (window.ALCURA && ALCURA.snapshot) ? ALCURA.snapshot() : null; }

  function drawCard(cb) {
    var s = snap(); if (!s) { cb(null); return; }
    var W = 1080, Hh = 1080, cv = document.createElement('canvas'); cv.width = W; cv.height = Hh;
    var x = cv.getContext('2d');
    var grd = x.createLinearGradient(0, 0, W, Hh);
    grd.addColorStop(0, '#56b97c'); grd.addColorStop(1, '#234f37');
    x.fillStyle = grd; x.fillRect(0, 0, W, Hh);
    // soft circle
    x.fillStyle = 'rgba(255,255,255,0.07)'; x.beginPath(); x.arc(W - 160, 180, 280, 0, 7); x.fill();

    x.fillStyle = '#fff'; x.textBaseline = 'alphabetic';
    x.font = '700 46px Inter, sans-serif'; x.fillText('ALCURA', 80, 130);
    x.font = '500 30px Inter, sans-serif'; x.globalAlpha = .85;
    x.fillText(T('My clean-air impact', 'Dampak udara bersih saya', '私のクリーンエア効果'), 80, 178); x.globalAlpha = 1;

    // Big CO2 number
    x.font = '800 190px "Space Grotesk", Inter, sans-serif';
    x.fillText(String(s.impact.co2Month), 76, 470);
    x.font = '600 44px Inter, sans-serif'; x.globalAlpha = .9;
    x.fillText(T('grams of CO₂ removed this month', 'gram CO₂ dihapus bulan ini', '今月除去したCO₂(g)'), 80, 540); x.globalAlpha = 1;

    // Stat rows
    var rows = [
      ['🫧  ' + T('O₂ produced', 'O₂ diproduksi', 'O₂生成'), s.impact.o2Month + ' L'],
      ['🌳  ' + T('Tree equivalent', 'Setara pohon', '樹木換算'), s.impact.treeEq + ''],
      ['🚗  ' + T('Driving avoided', 'Setara berkendara', '走行回避'), s.impact.kmEq + ' km'],
      ['💨  ' + T('Air score now', 'Skor udara kini', '現在の空気スコア'), s.air.score + '/100']
    ];
    x.font = '600 40px Inter, sans-serif';
    var yy = 700;
    rows.forEach(function (r) {
      x.globalAlpha = .92; x.fillText(r[0], 80, yy);
      x.textAlign = 'right'; x.font = '800 44px Inter, sans-serif'; x.fillText(r[1], W - 80, yy);
      x.textAlign = 'left'; x.font = '600 40px Inter, sans-serif'; x.globalAlpha = 1;
      yy += 92;
    });

    x.globalAlpha = .8; x.font = '500 30px Inter, sans-serif';
    x.fillText(T('Powered by ALCURA — smart Spirulina air purifier', 'Ditenagai ALCURA — pemurni udara Spirulina pintar', 'ALCURA — スマートスピルリナ空気清浄機'), 80, Hh - 70);
    x.globalAlpha = 1;
    cv.toBlob(function (b) { cb(b); }, 'image/png');
  }

  function shareCard() {
    drawCard(function (blob) {
      if (!blob) { if (window.toast) toast(T('No data yet.', 'Belum ada data.', 'データがありません。')); return; }
      var file = new File([blob], 'alcura-impact-' + stamp() + '.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: 'ALCURA', text: summaryText() }).catch(function () {});
      } else {
        triggerDownload(blob, file.name);
        if (window.toast) toast(T('Impact card saved ✓', 'Kartu dampak tersimpan ✓', 'インパクトカードを保存 ✓'));
      }
    });
  }

  function summaryText() {
    var s = snap(); if (!s) return 'ALCURA';
    return T(
      'This month ALCURA removed ' + s.impact.co2Month + ' g CO₂ and produced ' + s.impact.o2Month + ' L O₂ — cleaner air for my space. 🌱',
      'Bulan ini ALCURA menghapus ' + s.impact.co2Month + ' g CO₂ dan memproduksi ' + s.impact.o2Month + ' L O₂ — udara lebih bersih. 🌱',
      '今月ALCURAはCO₂を' + s.impact.co2Month + ' g除去し、O₂を' + s.impact.o2Month + ' L生成しました。🌱');
  }

  // ---- Weekly report surfacing (client-side, gated by the Settings toggle) ----
  var WK = 7 * 24 * 3600 * 1000, TS = 'alcuraWeeklyTs';
  function maybeWeekly() {
    var prefs = window.ALCURA_NOTIFY ? ALCURA_NOTIFY.getPrefs() : null;
    if (!prefs || !prefs.weekly) return;
    var last = parseInt(localStorage.getItem(TS) || '0', 10);
    if (!last) { try { localStorage.setItem(TS, String(Date.now())); } catch (e) {} return; } // seed, don't fire immediately
    if (Date.now() - last < WK) return;
    try { localStorage.setItem(TS, String(Date.now())); } catch (e) {}
    var body = summaryText();
    if (window.Notification && Notification.permission === 'granted') {
      try { new Notification(T('Weekly impact report', 'Laporan dampak mingguan', '週間インパクトレポート'), { body: body, icon: '/img/logo.png', tag: 'alcura-weekly' }); } catch (e) {}
    } else if (window.toast) { toast(body); }
  }

  window.ALCURA_REPORT = { downloadCSV: downloadCSV, shareCard: shareCard, summaryText: summaryText, maybeWeekly: maybeWeekly };

  function boot() { setTimeout(maybeWeekly, 4000); }   // let engine/notify settle first
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
