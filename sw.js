/* ==========================================================================
   AMITA DUBEY PORTFOLIO — SERVICE WORKER (PWA)
   Offline caching, stale-while-revalidate for assets, and instant loading
   ========================================================================== */

const CACHE_NAME = 'amita-portfolio-v1.0.3';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/favicon.ico',
  '/assets/icons/favicon.svg',
  '/assets/icons/favicon-32x32.png',
  '/assets/icons/favicon-16x16.png',
  '/assets/icons/apple-touch-icon.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/icon-maskable.png',
  '/assets/images/hero-portrait.jpg',
  '/assets/images/hero-portrait-shirt.jpg',
  '/assets/images/proj-ui.jpg',
  '/assets/images/proj-brand.jpg',
  '/assets/images/proj-comic.jpg',
  '/assets/images/footer-gallery.jpg'
];

// Install Event: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline application shell');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Some precache assets failed:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up legacy caches & claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Clearing outdated cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-first for API, Stale-while-revalidate for assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests or browser-extension schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Bypass cache for media streaming (video range requests)
  if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm')) {
    return;
  }

  // Do NOT cache API endpoints or dynamic data feeds
  if (url.pathname.startsWith('/api/') || url.pathname === '/data' || url.pathname === '/data.json') {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ offline: true, error: 'You are currently offline' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Stale-While-Revalidate strategy for internal assets
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // If offline and requesting navigation, return index.html
          if (request.mode === 'navigate') {
            return cache.match('/index.html') || cachedResponse;
          }
          return cachedResponse;
        });

        // Return cached version immediately if available, while updating cache in background
        return cachedResponse || fetchPromise;
      });
    })
  );
});
