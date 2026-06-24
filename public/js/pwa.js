/* ============================================================
   ALCURA — PWA bootstrap & install controller.
   Self-contained: injects the manifest <link> + theme-color meta,
   registers the service worker, captures the install prompt, and
   exposes window.ALCURA_PWA for the "Download App" menu item.

   Public API:
     ALCURA_PWA.isInstalled()  -> running as an installed PWA?
     ALCURA_PWA.canInstall()   -> native install prompt available?
     ALCURA_PWA.promptInstall() -> trigger install (or show how-to)
   Events on document:
     'alcura:pwa-installable'   -> native prompt became available
     'alcura:pwa-installed'     -> app was installed
   ============================================================ */
(function () {
  var deferredPrompt = null;

  // Derive the app's base URL from THIS script's own location so paths work
  // whether the app is served at the site root (Firebase) or under a subpath
  // like /public/ (VS Code Live Server). Falls back to '/'.
  var APP_BASE = (function () {
    try {
      var cs = document.currentScript;
      if (cs && cs.src) return cs.src.replace(/js\/pwa\.js(?:\?.*)?$/, '');
    } catch (e) {}
    return '/';
  })();

  function i18n(en, id, ja) {
    var l = (window.ALCURA_I18N && ALCURA_I18N.lang) || 'id';
    return ({ en: en, id: id, ja: ja })[l] || id;
  }
  function notify(msg) {
    if (typeof window.toast === 'function') window.toast(msg);
    else try { alert(msg); } catch (_) {}
  }

  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
           window.navigator.standalone === true;
  }
  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }

  // ---- Inject manifest link + theme-color if the page doesn't already have them ----
  function injectHead() {
    function addMeta(name, content) {
      if (document.querySelector('meta[name="' + name + '"]')) return;
      var m = document.createElement('meta'); m.name = name; m.content = content;
      document.head.appendChild(m);
    }
    if (!document.querySelector('link[rel="manifest"]')) {
      var link = document.createElement('link');
      link.rel = 'manifest';
      link.href = APP_BASE + 'manifest.webmanifest';
      document.head.appendChild(link);
    }
    // iOS home-screen icon (uses the brand logo).
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      var ati = document.createElement('link');
      ati.rel = 'apple-touch-icon';
      ati.href = APP_BASE + 'img/logo.png';
      document.head.appendChild(ati);
    }
    addMeta('theme-color', '#56b97c');
    // Standalone hints. mobile-web-app-capable is the standard (replaces the
    // now-deprecated apple- prefix); keep the apple one too for older iOS Safari.
    addMeta('mobile-web-app-capable', 'yes');
    addMeta('apple-mobile-web-app-capable', 'yes');
    addMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
  }

  // ---- Service worker (only over https / localhost; silently skips file://) ----
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    var ok = location.protocol === 'https:' ||
             location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (!ok) return;
    navigator.serviceWorker.register(APP_BASE + 'sw.js', { scope: APP_BASE }).catch(function () { /* non-fatal */ });
  }

  // ---- Capture the native install prompt ----
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    document.dispatchEvent(new CustomEvent('alcura:pwa-installable'));
  });
  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    document.dispatchEvent(new CustomEvent('alcura:pwa-installed'));
    notify(i18n('App installed 🎉', 'Aplikasi terpasang 🎉', 'アプリをインストールしました 🎉'));
  });

  window.ALCURA_PWA = {
    isInstalled: isStandalone,
    canInstall: function () { return !!deferredPrompt; },
    promptInstall: function () {
      if (isStandalone()) {
        notify(i18n('App is already installed.', 'Aplikasi sudah terpasang.', 'アプリは既にインストール済みです。'));
        return Promise.resolve('installed');
      }
      if (deferredPrompt) {
        var dp = deferredPrompt;
        deferredPrompt = null;
        dp.prompt();
        return dp.userChoice.then(function (c) {
          if (c && c.outcome !== 'accepted') {
            deferredPrompt = dp; // allow trying again later
          }
          return c && c.outcome;
        });
      }
      // No native prompt (iOS Safari, or criteria not yet met)
      if (isIOS()) {
        notify(i18n('Tap the Share button, then "Add to Home Screen".',
                    'Ketuk tombol Bagikan, lalu "Tambahkan ke Layar Utama".',
                    '共有ボタンから「ホーム画面に追加」を選んでください。'));
      } else {
        notify(i18n('Use your browser menu → "Install app".',
                    'Buka menu browser → "Instal aplikasi".',
                    'ブラウザのメニュー →「アプリをインストール」を選んでください。'));
      }
      return Promise.resolve('manual');
    }
  };

  injectHead();
  if (document.readyState === 'complete') registerSW();
  else window.addEventListener('load', registerSW);
})();
