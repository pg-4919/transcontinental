const cacheName = "TCR-v1";

const files = [
  "icon.png",
  "index.html",
  "script.js",
  "worker.js",
  "manifest.json"
];

self.addEventListener("install", event => {
  console.log('[Service Worker] Install');
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(contentToCache);
  })());
});

self.addEventListener("fetch", event => {
  event.respondWith((async () => {
    const resource = await caches.match(event.request);
    if (resource) return resource;
    const response = await fetch(event.request);
    const cache = await caches.open(cacheName);
    cache.put(event.request, response.clone());
    return response;
  })());
});
