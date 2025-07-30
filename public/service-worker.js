// service-worker.js

const CACHE_NAME = 'treasury-app-cache-v1';

// This is a "cache-falling-back-to-network" strategy.
// It's ideal for this app because it ensures that once a resource is downloaded,
// it's available offline, and it dynamically caches new resources as they are requested.

self.addEventListener('install', (event) => {
  // Perform install steps.
  // We don't need to pre-cache everything, the fetch handler will do it dynamically.
  console.log('Service Worker: Installing...');
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    // Clean up old caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim(); // Become available to all pages
});

self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. Try to get the response from the cache.
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        // console.log('Service Worker: Serving from cache:', event.request.url);
        return cachedResponse;
      }

      // 2. If it's not in the cache, try to fetch it from the network.
      try {
        const networkResponse = await fetch(event.request);
        
        // If the fetch is successful, clone it and store it in the cache.
        // We check for `ok` status or `opaque` type (for no-cors requests like fonts).
        if (networkResponse.ok || networkResponse.type === 'opaque') {
        //   console.log('Service Worker: Caching new resource:', event.request.url);
          await cache.put(event.request, networkResponse.clone());
        }
        
        // And return the network response.
        return networkResponse;
      } catch (error) {
        // If the fetch fails (e.g., user is offline) and the resource is not in the cache,
        // the browser will handle it as a standard network error.
        console.error('Service Worker: Fetch failed; user is offline and resource is not in cache.', error);
        // We could return a custom offline page here if we had one.
        throw error;
      }
    })
  );
});