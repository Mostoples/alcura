/* ============================================================
   ALCURA — apply the user's personalization to the dashboard.
   Reads localStorage.alcuraPersona (saved by personalize.html) and:
     • shows a role chip beside the greeting
     • adds a "personalized for you" welcome card at the top
     • promotes + highlights the most relevant quick action
   Trilingual (id / en / ja). Safe no-op if no persona / skipped.
   ============================================================ */
(function () {
  'use strict';
  var p; try { p = JSON.parse(localStorage.getItem('alcuraPersona') || 'null'); } catch (e) { p = null; }
  if (!p || p.skipped || !p.done) return;

  var lang = p.lang || localStorage.getItem('lang') || 'id';
  if (['id', 'en', 'ja'].indexOf(lang) < 0) lang = 'id';

  var L = {
    id: {
      eyebrow: 'Dipersonalisasi untuk Anda', hi: 'Halo, {n}!', welcome: 'Selamat datang!', foryou: 'Untuk Anda',
      role: { student: 'Pelajar', entrepreneur: 'Wirausaha', researcher: 'Peneliti', educator: 'Pendidik', enthusiast: 'Hobiis' },
      line: { student: 'Jelajahi & pelajari mikroalga', entrepreneur: 'Dampak & efisiensi untuk bisnis Anda', researcher: 'Data presisi siap untuk riset Anda', educator: 'Siap untuk demonstrasi kelas', enthusiast: 'Udara hidup untuk ruang Anda' },
      use: { air: 'Udara bersih', cultivation: 'Budidaya', research: 'Riset & data', education: 'Edukasi', sustainability: 'Keberlanjutan', wellness: 'Kesehatan' },
      env: { home: 'Rumah', office: 'Kantor', lab: 'Laboratorium', classroom: 'Kelas', cafe: 'Kafe/Bisnis', other: '' },
      fallbackLine: 'Udara hidup untuk ruang yang hidup'
    },
    en: {
      eyebrow: 'Personalized for you', hi: 'Hi, {n}!', welcome: 'Welcome!', foryou: 'For you',
      role: { student: 'Student', entrepreneur: 'Entrepreneur', researcher: 'Researcher', educator: 'Educator', enthusiast: 'Hobbyist' },
      line: { student: 'Explore & learn about microalgae', entrepreneur: 'Impact & efficiency for your business', researcher: 'Precise data ready for your research', educator: 'Ready for classroom demos', enthusiast: 'Living air for your space' },
      use: { air: 'Clean air', cultivation: 'Cultivation', research: 'Research & data', education: 'Education', sustainability: 'Sustainability', wellness: 'Wellness' },
      env: { home: 'Home', office: 'Office', lab: 'Laboratory', classroom: 'Classroom', cafe: 'Café/Business', other: '' },
      fallbackLine: 'Living air for living spaces'
    },
    ja: {
      eyebrow: 'あなた向けにパーソナライズ', hi: 'こんにちは、{n}さん！', welcome: 'ようこそ！', foryou: 'あなたへ',
      role: { student: '学生', entrepreneur: '起業家', researcher: '研究者', educator: '教育者', enthusiast: '愛好家' },
      line: { student: '微細藻類を学び探求する', entrepreneur: 'ビジネスの効果と効率', researcher: '研究に使える精密データ', educator: '授業デモの準備完了', enthusiast: 'あなたの空間に生きた空気を' },
      use: { air: 'きれいな空気', cultivation: '培養', research: '研究・データ', education: '教育', sustainability: '持続可能性', wellness: '健康' },
      env: { home: '自宅', office: 'オフィス', lab: '研究室', classroom: '教室', cafe: 'カフェ/店舗', other: '' },
      fallbackLine: '生きた空気を生きた空間へ'
    }
  };
  var t = L[lang] || L.id;

  var USE_ICON = { air: 'ph-wind', cultivation: 'ph-circles-three', research: 'ph-chart-line-up', education: 'ph-graduation-cap', sustainability: 'ph-leaf', wellness: 'ph-heartbeat' };
  var ROLE_ICON = { student: 'ph-student', entrepreneur: 'ph-rocket-launch', researcher: 'ph-flask', educator: 'ph-chalkboard-teacher', enthusiast: 'ph-house-line' };

  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    document.body.setAttribute('data-role', p.role || '');

    // 1) Role chip beside the greeting
    var hi = document.querySelector('.top-bar .hi');
    if (hi && t.role[p.role] && !hi.querySelector('.persona-chip')) {
      var chip = document.createElement('span');
      chip.className = 'persona-chip';
      chip.innerHTML = '<i class="ph-fill ' + (ROLE_ICON[p.role] || 'ph-user') + '"></i> ' + esc(t.role[p.role]);
      hi.appendChild(chip);
    }

    // 2) Personalized welcome card at the top of the dashboard
    var scroll = document.querySelector('.app-scroll.dash');
    if (scroll && !scroll.querySelector('.persona-welcome')) {
      var firstName = (p.name || '').split(' ')[0] || '';
      var tags = (p.uses || []).slice(0, 4).map(function (u) {
        return t.use[u] ? '<span class="pf-tag"><i class="ph-fill ' + (USE_ICON[u] || 'ph-check') + '"></i> ' + esc(t.use[u]) + '</span>' : '';
      }).join('');
      var envTxt = (p.env && t.env[p.env]) ? ' · ' + esc(t.env[p.env]) : '';
      var title = firstName ? t.hi.replace('{n}', esc(firstName)) : t.welcome;
      var line = (p.role && t.line[p.role]) ? t.line[p.role] : t.fallbackLine;
      var sec = document.createElement('section');
      sec.className = 'dash-block persona-welcome span-2';
      sec.innerHTML =
        '<div class="card glass persona-card no-pattern">' +
          '<span class="pw-eyebrow"><i class="ph-fill ph-sparkle"></i> ' + esc(t.eyebrow) + '</span>' +
          '<h3 class="pw-h">' + title + '</h3>' +
          '<p class="pw-line">' + esc(line) + envTxt + '</p>' +
          (tags ? '<div class="pw-tags">' + tags + '</div>' : '') +
        '</div>';
      scroll.insertBefore(sec, scroll.firstChild);
    }

    // 3) Promote + highlight the most relevant quick action
    var FOCUS = {
      research: 'pages/impact.html', air: 'pages/air-quality.html', cultivation: 'pages/culture-health.html',
      education: 'pages/guide.html', wellness: 'pages/air-quality.html', sustainability: 'pages/impact.html'
    };
    var target = FOCUS[p.primaryUse];
    var grid = document.querySelector('.qa-grid');
    if (target && grid) {
      var qa = grid.querySelector('a[href="' + target + '"]');
      if (qa) { qa.classList.add('qa-focus'); qa.setAttribute('data-foryou', t.foryou); grid.insertBefore(qa, grid.firstChild); }
    }
  });
})();
