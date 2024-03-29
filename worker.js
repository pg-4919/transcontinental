const cacheName = "TCR-v2.01";

const files = [
  "icon.png",
  "index.html",
  "script.js",
  "worker.js",
  "manifest.json",
  "dialogues.js",
  "events.js",
  "questions.js",
  "song.mp3"
];

self.addEventListener("install", event => {
  console.log("[Service Worker] Install");
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(files);
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
