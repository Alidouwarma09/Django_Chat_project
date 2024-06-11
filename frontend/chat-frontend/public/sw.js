const CACHE_NAME = "spotlist-cache-v1";

const STATIC_ASSETS = [
    "/index.html",
    "/manifest.json",
    "/static/bundle.js",
];

const CACHE_ASSETS = STATIC_ASSETS;

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                cache.addAll(CACHE_ASSETS);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
