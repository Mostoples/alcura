/* ============================================================
   ALCURA — "More" bottom-nav popup.
   Turns the bottom-nav "More" item into a button that opens a
   small menu: Kontrol (controls.html), Simulator (simulator.html),
   Impact (impact.html), Pengaturan (settings.html). Works on every page that has a
   .bottom-nav; resolves relative paths automatically.
   ============================================================ */
(function () {
  function init() {
    var nav = document.querySelector('.bottom-nav');
    if (!nav) return;

    // Find the "More" nav item by its label
    var moreItem = null;
    nav.querySelectorAll('.nav-item, .bn').forEach(function (a) {
      var s = a.querySelector('span');
      if (s && s.textContent.trim().toLowerCase() === 'more') moreItem = a;
    });
    if (!moreItem) return;

    // Resolve base path: pages/* are siblings; app.html is one level up
    var base = (location.pathname.indexOf('/pages/') !== -1) ? '' : 'pages/';
    var links = [
      { href: 'ai-chat.html',   icon: 'ph-sparkle',            label: 'AI Chat' },
      { href: 'harvest.html',   icon: 'ph-basket',             label: i18n('Harvest', 'Panen', '収穫') },
      { href: 'profile.html',   icon: 'ph-user-circle',         label: 'Profil' },
      { href: 'controls.html',  icon: 'ph-sliders-horizontal', label: 'Kontrol' },
      { href: 'simulator.html', icon: 'ph-flask',               label: 'Simulator' },
      { href: 'impact.html',    icon: 'ph-leaf',                label: 'Impact' },
      { href: 'settings.html',  icon: 'ph-gear',                label: 'Pengaturan' }
    ];

    function i18n(en, id, ja) {
      var lng = (window.ALCURA_I18N && ALCURA_I18N.lang) || 'id';
      return ({ en: en, id: id, ja: ja })[lng] || id;
    }

    var menu = document.createElement('div');
    menu.className = 'more-menu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = links.map(function (l) {
      return '<a role="menuitem" href="' + base + l.href + '"><i class="ph ' + l.icon + '"></i><span>' + l.label + '</span></a>';
    }).join('') +
      // PWA install action — hidden automatically when already running as an installed app
      '<a role="menuitem" href="#" class="more-install" data-action="install">' +
        '<i class="ph ph-download-simple"></i><span>' +
        i18n('Download App', 'Unduh Aplikasi', 'アプリをダウンロード') + '</span></a>';
    document.body.appendChild(menu);

    // Backdrop that blurs the page behind the menu. It sits BELOW the bottom-nav
    // (z-index) so the navbar stays sharp while everything else is blurred.
    var backdrop = document.createElement('div');
    backdrop.className = 'more-backdrop';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', function () { close(); });

    // Wire the install item; hide it if the app is already installed
    var installItem = menu.querySelector('.more-install');
    function syncInstall() {
      if (window.ALCURA_PWA && ALCURA_PWA.isInstalled()) installItem.style.display = 'none';
      else installItem.style.display = '';
    }
    syncInstall();
    document.addEventListener('alcura:pwa-installed', syncInstall);
    installItem.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      close();
      if (window.ALCURA_PWA) ALCURA_PWA.promptInstall();
    });

    function position() {
      // Slightly narrower than the bottom-nav, kept centered above it.
      var nr = nav.getBoundingClientRect();
      var inset = 20; // total px narrower than the navbar (10px each side)
      menu.style.left = (nr.left + inset / 2) + 'px';
      menu.style.right = 'auto';
      menu.style.width = (nr.width - inset) + 'px';
      menu.style.bottom = (window.innerHeight - nr.top + 10) + 'px';
    }
    function open() { position(); menu.classList.add('open'); backdrop.classList.add('open'); moreItem.classList.add('more-open'); }
    function close() { menu.classList.remove('open'); backdrop.classList.remove('open'); moreItem.classList.remove('more-open'); }
    function toggle() { menu.classList.contains('open') ? close() : open(); }

    moreItem.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); toggle(); });
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !moreItem.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', function () { if (menu.classList.contains('open')) position(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
