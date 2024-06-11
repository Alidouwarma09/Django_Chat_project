// serviceWorker.js

// Ceci est une version légèrement modifiée du service worker par défaut créé par create-react-app.
// https://github.com/facebook/create-react-app/blob/main/packages/cra-template/template/src/serviceWorker.js

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/
    )
);

export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        // L'URL de base du service worker
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
        if (publicUrl.origin !== window.location.origin) {
            return;
        }

        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            if (isLocalhost) {
                // Vérifiez si un service worker existe ou non.
                checkValidServiceWorker(swUrl, config);

                navigator.serviceWorker.ready.then(() => {
                    console.log(
                        'Cette application est en cours de mise en cache par un service worker.'
                    );
                });
            } else {
                // S'enregistrer pour le service worker
                registerValidSW(swUrl, config);
            }
        });
    }
}

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker == null) {
                    return;
                }
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            console.log(
                                'Nouveau contenu disponible; veuillez actualiser.'
                            );

                            if (config && config.onUpdate) {
                                config.onUpdate(registration);
                            }
                        } else {
                            console.log('Contenu mis en cache pour une utilisation hors ligne.');

                            if (config && config.onSuccess) {
                                config.onSuccess(registration);
                            }
                        }
                    }
                };
            };
        })
        .catch((error) => {
            console.error('Erreur lors de l\'enregistrement du service worker:', error);
        });
}

function checkValidServiceWorker(swUrl, config) {
    fetch(swUrl, {
        headers: { 'Service-Worker': 'script' },
    })
        .then((response) => {
            const contentType = response.headers.get('content-type');
            if (
                response.status === 404 ||
                (contentType != null && contentType.indexOf('javascript') === -1)
            ) {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.unregister().then(() => {
                        window.location.reload();
                    });
                });
            } else {
                registerValidSW(swUrl, config);
            }
        })
        .catch(() => {
            console.log(
                'Aucune connexion Internet trouvée. L\'application est en mode hors ligne.'
            );
        });
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister();
            })
            .catch((error) => {
                console.error(error.message);
            });
    }
}
