self.addEventListener("install", async (event) => {
  console.log("[ServiceWorker] Install");
  const cache = await caches.open("jinyongp.dev");
  event.waitUntil(cache.addAll(["/", "/index.html", "/src/"]));
});

self.addEventListener("fetch", async (event) => {
  const { request } = event;
  console.log(`[ServiceWorker] Fetching resource: ${request.url}`);
  let response = await caches.match(request);
  if (!response) {
    response = await fetch(request);
    console.log(`[ServiceWorker] Caching new resource: ${request.url}`);
    const cache = await caches.open("jinyongp.dev");
    cache.put(request, response.clone());
  }
  event.respondWith(response);
});
