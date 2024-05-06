// Nom du cache
const CACHE_NAME = 'my-app-cache-v2';
// Liste des URLs à mettre en cache
const urlsToCache = [
    '/static/chater_logo.png',
    '/static/badge.png',
    '/static/font_decran.png',
    '/Utilisateur/apk/acceuil/',
    '/Utilisateur/parametre/',
    '/Utilisateur/apk/accueil_utilisateur/',
    '/Utilisateur/apk/comment_sse/'
];

// Écoute de l'événement 'install' pour installer le service worker
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
            .then(() => {
                logCachedResources(); // Appelez ici pour logger après l'installation
            })
    );
});

// Écoute de l'événement 'fetch' pour servir les contenus depuis le cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log(`Service worker: Ressource trouvée dans le cache: ${event.request.url}`);
                    return response;
                }
                return fetch(event.request);
            })
            .catch((error) => {
                console.error('Service worker: Échec lors de la récupération de la ressource', error);
            })
    );
});

// Fonction pour logguer les ressources mises en cache
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
