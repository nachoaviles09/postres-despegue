const CACHE_NAME = 'despegue-v86';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './img/logo.jpeg',
  './img/banner.jpeg',
  './img/azafata logo.jpeg',
  './img/logo-ig.jpg',
  './img/logo-wsp.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('script.google.com') || event.request.url.includes('googleusercontent.com')) {
    return;
  }

  // Network-First para HTML, CSS y JS (siempre trae los cambios nuevos si hay internet)
  if (event.request.mode === 'navigate' || event.request.url.match(/\.(html|css|js)(\?.*)?$/)) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request, { cacheName: CACHE_NAME }))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { cacheName: CACHE_NAME }).then((res) => res || fetch(event.request))
  );
});
