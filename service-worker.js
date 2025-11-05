const CACHE_NAME = 'mototaxi-jeison-v2';
const urlsToCache = [
  '/jeison10/',
  '/jeison10/index.html',
  '/jeison10/manifest.json',
  '/jeison10/icon-192.png',
  '/jeison10/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.warn('Error al cachear:', err))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/jeison10/')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
        .catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/jeison10/index.html');
          }
        })
    );
  }
});

self.addEventListener('activate', (event) => {
  const cacheAllowlist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheAllowlist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
