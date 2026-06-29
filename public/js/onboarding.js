/* ============================================================
   ALCURA — first-login onboarding tour (coach-marks / spotlight)
   - Auto-runs once after login (localStorage flag), or on ?tour=1
   - Highlights dashboard elements + explains the other pages
   - Replay anytime: ALCURA_TOUR.start()
   ============================================================ */
(function () {
  var KEY = 'alcura_tour_v1';
  function lang() { return (window.ALCURA_I18N && ALCURA_I18N.lang) || localStorage.getItem('lang') || 'id'; }
  function T(o) { if (!o) return ''; return o[lang()] || o.en || o.id; }

  // Each step: sel (CSS target or null=centered), icon, title{}, body{}
  var STEPS = [
    { sel: null, icon: 'ph-hand-waving',
      title: { id: 'Selamat datang di ALCURA 👋', en: 'Welcome to ALCURA 👋' },
      body: { id: 'Tur singkat ini mengenalkan dashboard Anda dan halaman lain yang bisa diakses. Sekitar 1 menit.', en: 'A quick tour of your dashboard and the other pages you can open. About 1 minute.' } },
    { sel: '.dash-hero .hero-status', icon: 'ph-gauge',
      title: { id: 'Skor Kesehatan', en: 'Health Score' },
      body: { id: 'Ringkasan utama: kesehatan kultur, kualitas udara, dan O₂ yang diproduksi hari ini.', en: 'Your headline status: culture health, air quality, and O₂ produced today.' } },
    { sel: '.dash-brief', icon: 'ph-sparkle',
      title: { id: 'Briefing Harian AI', en: 'AI Daily Briefing' },
      body: { id: 'AI merangkum kondisi 24 jam terakhir dengan bahasa sederhana. Ketuk ikon segarkan untuk memperbarui.', en: 'AI summarizes the last 24 hours in plain language. Tap the refresh icon to regenerate.' } },
    { sel: '.dash-xai', icon: 'ph-tree-structure',
      title: { id: 'Penjelasan AI', en: 'Explainable AI' },
      body: { id: 'Lihat MENGAPA AI mengambil keputusan: faktor pembatas pertumbuhan & alasan setiap peringatan. Ketuk "Detail".', en: 'See WHY the AI decides: the limiting growth factor & the reason behind each alert. Tap "Detail".' } },
    { sel: '.dash-pbr', icon: 'ph-circles-three',
      title: { id: 'Photobioreactor Live', en: 'Photobioreactor Live' },
      body: { id: 'Visual kultur Spirulina secara langsung. Ketuk "Detail" untuk halaman Kesehatan Kultur.', en: 'A live view of the Spirulina culture. Tap "Detail" for the Culture Health page.' } },
    { sel: '.dash-metrik', icon: 'ph-cloud',
      title: { id: 'Metrik Cepat', en: 'Quick Metrics' },
      body: { id: 'Pembacaan real-time: CO₂, nutrisi (TDS), suhu, dan pH. Status berubah bila keluar dari rentang ideal.', en: 'Real-time readings: CO₂, nutrients (TDS), temperature, and pH. The status changes if a value drifts out of range.' } },
    { sel: '.dash-harvest', icon: 'ph-basket',
      title: { id: 'Panen Berikutnya', en: 'Next Harvest' },
      body: { id: 'Perkiraan hari menuju panen + estimasi hasil. Tombol membuka Simulator untuk merencanakan panen.', en: 'Days-to-harvest estimate + expected yield. The button opens the Simulator to plan a harvest.' } },
    { sel: '.dash-impact', icon: 'ph-leaf',
      title: { id: 'Dampak Hari Ini', en: "Today's Impact" },
      body: { id: 'CO₂ yang terserap, O₂ yang diproduksi, dan energi HVAC yang dihemat.', en: 'CO₂ absorbed, O₂ produced, and HVAC energy saved.' } },
    { sel: '.dash-qa', icon: 'ph-squares-four',
      title: { id: 'Aksi Cepat — Halaman Lain', en: 'Quick Actions — Other Pages' },
      body: { id: 'Pintasan ke semua halaman: Kontrol (lampu/kipas/pompa), Keamanan, Tanya AI, Penjelasan AI, Simulasi, Dampak, Panen, dan Panduan.', en: 'Shortcuts to every page: Controls (lights/fan/pump), Safety, Ask AI, Explainable AI, Simulator, Impact, Harvest, and the Guide.' } },
    { sel: '.ai-fab', icon: 'ph-chat-circle-dots',
      title: { id: 'Asisten AI', en: 'AI Assistant' },
      body: { id: 'Tanya apa saja tentang sistem Anda kapan pun — tombol ini selalu tersedia.', en: 'Ask anything about your system anytime — this button is always available.' } },
    { sel: '.bottom-nav', icon: 'ph-compass',
      title: { id: 'Navigasi Utama', en: 'Main Navigation' },
      body: { id: 'Home · Air (kualitas udara) · Culture (kesehatan kultur) · Alerts (peringatan) · More (pengaturan & lainnya).', en: 'Home · Air (air quality) · Culture (culture health) · Alerts · More (settings & extras).' } },
    { sel: null, icon: 'ph-check-circle',
      title: { id: 'Selesai! 🎉', en: 'All set! 🎉' },
      body: { id: 'Anda siap. Panduan lengkap bisa dibuka kapan saja lewat Aksi Cepat → Panduan.', en: 'You are ready. The full written guide is always available via Quick Actions → Guide.' },
      cta: { href: 'pages/guide.html', label: { id: 'Buka Panduan', en: 'Open Guide' } } }
  ];

  var i = 0, els = null, active = false;

  function build() {
    if (els) return;
    var catch_ = document.createElement('div'); catch_.className = 'ob-catch';
    var spot = document.createElement('div'); spot.className = 'ob-spot';
    var card = document.createElement('div'); card.className = 'ob-card'; card.setAttribute('role', 'dialog');
    document.body.appendChild(catch_); document.body.appendChild(spot); document.body.appendChild(card);
    els = { catch_: catch_, spot: spot, card: card };
    window.addEventListener('resize', reflow);
    window.addEventListener('scroll', reflow, true);
  }
  function destroy() {
    if (!els) return;
    window.removeEventListener('resize', reflow);
    window.removeEventListener('scroll', reflow, true);
    [els.catch_, els.spot, els.card].forEach(function (n) { n && n.remove(); });
    els = null; active = false;
  }

  function positionSpot(rect) {
    var s = els.spot, pad = 8;
    if (!rect) { s.classList.add('noring'); s.style.top = '50%'; s.style.left = '50%'; s.style.width = '0'; s.style.height = '0'; return; }
    s.classList.remove('noring');
    s.style.top = (rect.top - pad) + 'px'; s.style.left = (rect.left - pad) + 'px';
    s.style.width = (rect.width + pad * 2) + 'px'; s.style.height = (rect.height + pad * 2) + 'px';
  }
  function positionCard(rect) {
    var c = els.card, vw = innerWidth, vh = innerHeight, cw = c.offsetWidth, ch = c.offsetHeight, top, left;
    if (!rect) { top = (vh - ch) / 2; left = (vw - cw) / 2; }
    else {
      if (rect.bottom + ch + 18 < vh) top = rect.bottom + 12;
      else if (rect.top - ch - 18 > 0) top = rect.top - ch - 12;
      else top = Math.max(12, (vh - ch) / 2);
      left = Math.min(Math.max(12, rect.left + rect.width / 2 - cw / 2), vw - cw - 12);
    }
    c.style.top = Math.max(12, top) + 'px'; c.style.left = left + 'px';
  }
  function curRect() {
    var st = STEPS[i]; var t = st.sel ? document.querySelector(st.sel) : null;
    return (t && t.offsetParent !== null) ? t.getBoundingClientRect() : null;
  }
  function reflow() { if (!active) return; var r = curRect(); positionSpot(r); positionCard(r); }

  function fill() {
    var st = STEPS[i], last = i === STEPS.length - 1;
    var dots = STEPS.map(function (_, k) { return '<i class="' + (k === i ? 'on' : '') + '"></i>'; }).join('');
    var cta = st.cta ? '<a class="ob-next" href="' + st.cta.href + '">' + T(st.cta.label) + ' <i class="ph ph-arrow-right"></i></a>' : '';
    els.card.innerHTML =
      '<h4><i class="ph-fill ' + st.icon + '"></i> ' + T(st.title) + '</h4>' +
      '<p>' + T(st.body) + '</p>' +
      '<div class="ob-foot"><div class="ob-dots">' + dots + '</div>' +
      '<div class="ob-btns">' +
      (i > 0 ? '<button class="ob-back" type="button">' + (lang() === 'en' ? 'Back' : 'Kembali') + '</button>' : '') +
      (last ? cta || ('<button class="ob-next" type="button">' + (lang() === 'en' ? 'Done' : 'Selesai') + '</button>')
            : '<button class="ob-next" type="button">' + (lang() === 'en' ? 'Next' : 'Lanjut') + ' <i class="ph ph-arrow-right"></i></button>') +
      '</div></div>' +
      (last ? '' : '<button class="ob-skip" type="button">' + (lang() === 'en' ? 'Skip tour' : 'Lewati') + '</button>');
    var back = els.card.querySelector('.ob-back'); if (back) back.onclick = function () { go(i - 1); };
    var nextBtn = els.card.querySelector('button.ob-next'); if (nextBtn) nextBtn.onclick = function () { i === STEPS.length - 1 ? finish() : go(i + 1); };
    var skip = els.card.querySelector('.ob-skip'); if (skip) skip.onclick = finish;
    var ctaA = els.card.querySelector('a.ob-next'); if (ctaA) ctaA.addEventListener('click', function () { try { localStorage.setItem(KEY, '1'); } catch (e) {} });
  }

  function go(n) {
    i = Math.max(0, Math.min(STEPS.length - 1, n));
    var st = STEPS[i], t = st.sel ? document.querySelector(st.sel) : null;
    fill();
    if (t && t.scrollIntoView) { t.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(reflow, 360); }
    else reflow();
  }
  function finish() { try { localStorage.setItem(KEY, '1'); } catch (e) {} destroy(); }

  function start(reset) {
    if (active) return;
    if (reset) try { localStorage.removeItem(KEY); } catch (e) {}
    build(); active = true; i = 0; go(0);
  }

  window.ALCURA_TOUR = { start: function () { start(true); }, reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} } };
  document.addEventListener('alcura:lang', function () { if (active) fill(); });

  function boot() {
    var force = /[?&]tour=1/.test(location.search);
    var seen = false; try { seen = !!localStorage.getItem(KEY); } catch (e) {}
    if (force || !seen) setTimeout(function () { start(false); }, 1000); // let the dashboard settle
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
