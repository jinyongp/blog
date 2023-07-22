const key = "jinyongp.dev";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      console.log("[ServiceWorker] Install");
      const cache = await caches.open(key);
      return cache.addAll(["/", "/index.html"]);
    })()
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const { request } = event;
      console.log(`[ServiceWorker] Fetching resource: ${request.url}`);
      let response = await caches.match(request);
      if (!response) {
        response = await fetch(request);
        console.log(`[ServiceWorker] Caching new resource: ${request.url}`);
        const cache = await caches.open(key);
        cache.put(request, response.clone());
      }
      return response;
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const promise = Promise.all(
        keys.map((_key) => _key === key && caches.delete(key))
      );
      return promise;
    })()
  );
});
