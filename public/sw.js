/* ============================================================
   ALCURA — Service Worker (PWA installability + light offline)
   - Pre-caches a minimal app shell so the app opens offline.
   - Navigations: network-first (fresh data) → cache fallback.
   - Same-origin static assets: stale-while-revalidate.
   - Cross-origin (Firebase, Gemini, fonts, CDNs): never intercepted.
   Bump CACHE on every shell change to invalidate old caches.
   ============================================================ */
var CACHE = 'alcura-shell-v4';
// Relative to the SW's own location so it works at the site root (Firebase)
// or under a subpath like /public/ (Live Server).
var CORE = [
  './',
  'app.html',
  'index.html',
  'css/styles.css',
  'css/mobile.css',
  'img/logo.png',
  'manifest.webmanifest'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  // Cache shell items individually so one 404 can't fail the whole install
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return Promise.all(CORE.map(function (url) {
        return cache.add(url).catch(function () { /* ignore missing */ });
      }));
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;                       // never touch POST (Gemini/Firestore writes)

  var url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return;        // let cross-origin pass straight through

  // App navigations → network-first so live data stays fresh; fall back to cache offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) { return hit || caches.match('app.html'); });
      })
    );
    return;
  }

  // Same-origin static assets → stale-while-revalidate
  e.respondWith(
    caches.match(req).then(function (hit) {
      var network = fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
        }
        return res;
      }).catch(function () { return hit; });
      return hit || network;
    })
  );
});
