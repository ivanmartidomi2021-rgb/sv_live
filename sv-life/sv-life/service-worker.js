/* ============================================================
   SV LIFE — Service Worker
   Estrategia: cache-first para el "app shell" (archivos propios),
   network-first para llamadas a APIs externas (clima, mapa, IA).
   ============================================================ */
const CACHE_NAME = "sv-life-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/config.js",
  "./js/data.js",
  "./js/store.js",
  "./js/app.js",
  "./js/weather.js",
  "./js/ai.js",
  "./js/map.js",
  "./js/tramites.js",
  "./js/emergencias.js",
  "./js/dinero.js",
  "./js/gasolina.js",
  "./js/calendario.js",
  "./js/turismo.js",
  "./js/noticias.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Solo interceptamos GET
  if (req.method !== "GET") return;

  const isOwnOrigin = url.origin === self.location.origin;

  if (isOwnOrigin) {
    // Cache-first para el app shell
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
            return res;
          })
          .catch(() => caches.match("./index.html"));
      })
    );
  } else {
    // Network-first para APIs externas (clima, IA, mapas, tiles)
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req))
    );
  }
});
