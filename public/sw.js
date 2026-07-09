// Service worker minimal : présence requise pour l'installation PWA (Android).
// Passthrough réseau — pas de cache agressif (évite tout contenu périmé).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
