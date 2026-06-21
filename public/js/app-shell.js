/* ============================================================
   ALCURA — shared app-shell behaviour for /pages screens
   Handles: theme persistence, active bottom-nav highlighting,
   user name/avatar injection, a toast() helper, and an optional
   lightweight auth guard.
   ============================================================ */
(function () {
  // ---- Avatar path resolver: makes a stored avatar work on root + /pages ----
  // Passes through data: / http(s) / root-absolute; re-roots local relative paths.
  window.resolveAvatar = function (val) {
    if (!val) return val;
    if (/^(data:|https?:|\/)/.test(val)) return val;
    var rel = val.replace(/^(\.\.\/|\.\/)+/, '');
    var inPages = location.pathname.indexOf('/pages/') !== -1;
    return (inPages ? '../' : '') + rel;
  };

  // ---- Theme: apply saved preference as early as possible ----
  var savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Global toggle (persists). Updates any [data-theme-icon] / #themeLabel too.
  window.toggleTheme = function () {
    var html = document.documentElement;
    var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncThemeUI(next);
  };

  function syncThemeUI(theme) {
    var label = document.getElementById('themeLabel');
    if (label) label.textContent = theme === 'dark' ? 'On' : 'Off';
    document.querySelectorAll('[data-theme-icon]').forEach(function (el) {
      el.className = (theme === 'dark' ? 'ph-fill ph-sun' : 'ph-fill ph-moon');
    });
  }

  // ---- Toast helper (replaces blocking alert()) ----
  var toastTimer;
  window.toast = function (message) {
    var el = document.getElementById('alcuraToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'alcuraToast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    // force reflow so re-trigger animates
    void el.offsetWidth;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2600);
  };

  // ---- Lightweight auth guard ----
  // Opt-out by setting <body data-no-auth> (e.g. onboarding).
  window.requireAuthPage = function () {
    if (document.body.hasAttribute('data-no-auth')) return;
    var cached = localStorage.getItem('alcuraUser');
    if (!cached) window.location.href = '../login.html';
  };

  // ---- On DOM ready: nav highlight + user info + theme UI ----
  function onReady() {
    syncThemeUI(savedTheme);

    // Highlight the active bottom-nav item by filename
    var here = (location.pathname.split('/').pop() || 'app.html');
    document.querySelectorAll('.bottom-nav .nav-item').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('/').pop();
      var active = href === here;
      a.classList.toggle('active', active);
      var icon = a.querySelector('i');
      if (icon) {
        var base = icon.getAttribute('data-icon');
        if (base) icon.className = (active ? 'ph-fill ' : 'ph ') + base;
      }
    });

    // Inject signed-in user's name / avatar where present
    var cached = localStorage.getItem('alcuraUser');
    if (cached) {
      try {
        var user = JSON.parse(cached);
        var nameEl = document.querySelector('[data-user-name]');
        if (nameEl) nameEl.textContent = user.displayName || (user.email ? user.email.split('@')[0] : 'Pengguna');
        var emailEl = document.querySelector('[data-user-email]');
        if (emailEl && user.email) emailEl.textContent = user.email;
        var avatarEl = document.querySelector('[data-user-avatar]');
        if (avatarEl && user.photoURL) avatarEl.src = window.resolveAvatar(user.photoURL);
      } catch (e) { /* ignore malformed cache */ }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
