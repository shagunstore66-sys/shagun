// SHAGUN STORE - Progressive Web App Service Worker
const CACHE_NAME = 'shagun-store-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './staff.html',
  './admin.html',
  './styles.css',
  './app.js',
  './firebase-config.js',
  './sound.js',
  './qrGenerator.js',
  './whatsAppNotificationEngine.js',
  './manifest.json',
  './favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network First strategy with Cache Fallback for dynamic real-time data
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return; // Do not cache dynamic APIs

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
