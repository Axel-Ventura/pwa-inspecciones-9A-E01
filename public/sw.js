const CACHE_PREFIX = "inspecciones-laboratorio-";
const CACHE_VERSION = "v1";
const STATIC_CACHE = `${CACHE_PREFIX}${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_PREFIX}${CACHE_VERSION}-runtime`;

const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest"
];

const OFFLINE_RESPONSE = `
<!doctype html>
<html lang="es-MX">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sin conexión</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        max-width: 720px;
        margin: 0 auto;
        padding: 2rem;
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <h1>Sin conexión</h1>
    <p>
      No fue posible cargar una versión actualizada de la aplicación.
    </p>
    <p>
      Comprueba tu conexión e inténtalo nuevamente.
    </p>
  </body>
</html>
`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName.startsWith(CACHE_PREFIX) &&
              cacheName !== STATIC_CACHE &&
              cacheName !== RUNTIME_CACHE
          )
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(cacheFirstStatic(request));
  }
});

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const precachedResponse = await caches.match("/");

    if (precachedResponse) {
      return precachedResponse;
    }

    return new Response(OFFLINE_RESPONSE, {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    });
  }
}

async function cacheFirstStatic(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    return new Response("Recurso no disponible sin conexión.", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  }
}