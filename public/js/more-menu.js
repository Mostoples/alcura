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
      { href: 'profile.html',   icon: 'ph-user-circle',         label: 'Profil' },
      { href: 'controls.html',  icon: 'ph-sliders-horizontal', label: 'Kontrol' },
      { href: 'simulator.html', icon: 'ph-flask',               label: 'Simulator' },
      { href: 'impact.html',    icon: 'ph-leaf',                label: 'Impact' },
      { href: 'settings.html',  icon: 'ph-gear',                label: 'Pengaturan' }
    ];

    var menu = document.createElement('div');
    menu.className = 'more-menu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = links.map(function (l) {
      return '<a role="menuitem" href="' + base + l.href + '"><i class="ph ' + l.icon + '"></i><span>' + l.label + '</span></a>';
    }).join('');
    document.body.appendChild(menu);

    function position() {
      var r = moreItem.getBoundingClientRect();
      menu.style.right = Math.max(12, window.innerWidth - r.right) + 'px';
      menu.style.bottom = (window.innerHeight - r.top + 12) + 'px';
    }
    function open() { position(); menu.classList.add('open'); moreItem.classList.add('more-open'); }
    function close() { menu.classList.remove('open'); moreItem.classList.remove('more-open'); }
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
