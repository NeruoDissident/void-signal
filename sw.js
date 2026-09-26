'use strict';
// Bump this version whenever any cached game file changes.
const CACHE_PREFIX = 'void-signal-shell-';
const CACHE_NAME = CACHE_PREFIX + 'v1.0.0';
const ASSETS = [
  './', './index.html', './styles.css', './game.js', './pwa.js',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './icons/maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'
];
const scopedURL = path => new URL(path, self.registration.scope).href;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS.map(scopedURL))));
  // Let existing games finish. Updated workers activate after old tabs close.
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !request.url.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Use a consistent, precached release for both online and offline play.
    if (request.mode === 'navigate') return (await cache.match(scopedURL('./index.html'))) || fetch(request);
    return (await cache.match(request, { ignoreSearch: true })) || fetch(request);
  })());
});
