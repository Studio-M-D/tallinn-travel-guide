const CACHE_NAME = 'tallinn-guide-final-2026-08-09-c';

const CORE_ASSETS = [
  './',
  './index.html',
  './must-see.html',
  './routes.html',
  './food.html',
  './essentials.html',
  './offline.html',
  './about.html',
  './404.html',
  './emergency.html',
  './sources.html',
  './manifest.webmanifest',
  './assets/css/styles.css',
  './assets/js/app.js',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png',
  './assets/images/old-town-hero-r5-optimized.jpg',
  './assets/images/old-town-900.webp',
  './assets/images/noblessner-900.webp',
  './assets/images/noblessner-1600.webp',
  './assets/images/kadriorg-900.webp',
  './assets/images/kadriorg-1600.webp',
  './assets/images/modern-history-900.webp',
  './assets/images/cruise-terminal-1600.webp',
  './assets/images/seaplane-1600.webp',
  './assets/images/route-line.svg',
  './assets/icons/home.svg',
  './assets/icons/star.svg',
  './assets/icons/route.svg',
  './assets/icons/food.svg',
  './assets/icons/info.svg',
  './assets/icons/wifi.svg',
  './assets/icons/arrow-up.svg',
  './assets/icons/map.svg',
  './assets/icons/pin.svg',
  './assets/icons/external.svg',
  './assets/icons/clock.svg',
  './assets/icons/walk.svg',
  './assets/icons/ticket.svg',
  './assets/icons/book.svg',
  './assets/icons/weather.svg',
  './assets/icons/umbrella.svg',
  './assets/icons/bus.svg',
  './assets/icons/wallet.svg',
  './assets/icons/phone.svg',
  './assets/icons/building.svg',
  './assets/icons/chevron.svg',
  './downloads/route-1-old-town.pdf',
  './downloads/route-2-waterfront.pdf',
  './downloads/route-3-kadriorg.pdf',
  './downloads/route-4-modern-history.pdf',
  './downloads/must-see.pdf',
  './downloads/food.pdf',
  './downloads/practical-info.pdf',
  './downloads/full-guide.pdf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => (
          await caches.match(request, { ignoreSearch: true })
          || await caches.match('./404.html')
        ))
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
      return cached || network;
    })
  );
});
