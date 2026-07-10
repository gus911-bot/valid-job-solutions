// Service worker : installation PWA + notifications push (espace admin).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});

// Réception d'une notification push.
self.addEventListener('push', (event) => {
  let data = { title: 'Valid Job', body: '', url: '/admin' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (e) {
    /* payload non-JSON : ignoré */
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: data.url || '/admin' },
      vibrate: [120, 60, 120],
    }),
  );
});

// Clic sur la notification → ouvre / focus l'espace admin.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/admin';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.includes('/admin') && 'focus' in c) return c.focus();
      }
      return self.clients.openWindow(url);
    }),
  );
});
