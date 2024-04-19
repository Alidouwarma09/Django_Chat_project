// Nom du cache
const CACHE_NAME = 'my-app-cache-v1';

// Liste des ressources à mettre en cache
const urlsToCache = [
    '/',
    '/static/chater_logo.png',
    '/static/font_decran.png',

];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service worker: Ouverture du cache');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Service worker: Échec lors de l\'ajout d\'URLs au cache', error);
            })
    );
});

// Gestionnaire d'événement de récupération des ressources
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si la ressource est trouvée dans le cache, la retourner
                if (response) {
                    console.log(`Service worker: Ressource trouvée dans le cache: ${event.request.url}`);
                    return response;
                }
                // Sinon, effectuer une requête réseau
                return fetch(event.request);
            })
            .catch((error) => {
                console.error('Service worker: Échec lors de la récupération de la ressource', error);
            })
    );
});

// Fonction pour lister les ressources mises en cache dans la console
function logCachedResources() {
    caches.open(CACHE_NAME)
        .then((cache) => {
            return cache.keys();
        })
        .then((cacheKeys) => {
            console.log(`Service worker: Ressources mises en cache dans '${CACHE_NAME}':`);
            cacheKeys.forEach((request) => {
                console.log(request.url);
            });
        })
        .catch((error) => {
            console.error('Service worker: Erreur lors de l\'accès au cache', error);
        });
}

// Vous pouvez appeler logCachedResources() pour lister les ressources mises en cache dans la console
