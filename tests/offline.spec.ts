import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert";

const rootDir = process.cwd();
const swPath = path.join(rootDir, "public", "sw.js");

assert.strictEqual(fs.existsSync(swPath), true, "public/sw.js debe existir");

const source = fs.readFileSync(swPath, "utf-8");

function createMockCaches() {
  const store = new Map();

  function normalize(requestOrUrl) {
    const key = typeof requestOrUrl === "string" ? requestOrUrl : requestOrUrl.url;
    return new URL(key, "https://example.test").toString();
  }

  function makeCache(name) {
    if (!store.has(name)) store.set(name, new Map());
    const map = store.get(name);
    return {
      addAll: async (urls) => {
        for (const url of urls) {
          map.set(normalize(url), new Response(`precache:${url}`, { status: 200 }));
        }
      },
      put: async (request, response) => {
        map.set(normalize(request), response);
      },
      match: async (request) => map.get(normalize(request)),
    };
  }

  return {
    open: async (name) => makeCache(name),
    keys: async () => Array.from(store.keys()),
    delete: async (name) => store.delete(name),
    match: async (request) => {
      const key = normalize(request);
      for (const map of store.values()) {
        if (map.has(key)) return map.get(key);
      }
      return undefined;
    },
  };
}

function createLifecycleEvent() {
  let pending = Promise.resolve();
  return {
    waitUntil(promise) {
      pending = promise;
    },
    get settled() {
      return pending;
    },
  };
}

function createFetchEvent(request) {
  let responded;
  return {
    request,
    respondWith(value) {
      responded = Promise.resolve(value);
    },
    get responded() {
      return responded;
    },
  };
}

function loadServiceWorker(fetchImpl) {
  const listeners = {};
  const fakeSelf = {
    addEventListener: (type, handler) => {
      listeners[type] = handler;
    },
    location: { origin: "https://example.test" },
  };
  const mockCaches = createMockCaches();

  const sandbox = { self: fakeSelf, caches: mockCaches, fetch: fetchImpl, Response, URL, console };
  const context = vm.createContext(sandbox);
  vm.runInContext(source, context, { filename: "sw.js" });

  return { listeners, mockCaches };
}

const offlineFetch = async () => {
  throw new Error("Sin conexión simulada");
};

const navRequest = {
  url: "https://example.test/",
  method: "GET",
  mode: "navigate",
  destination: "document",
};

async function testFallbackFinal() {
  // Sin ninguna caché previa (ni siquiera precache de "/"): debe caer en OFFLINE_RESPONSE
  const { listeners } = loadServiceWorker(offlineFetch);

  const event = createFetchEvent(navRequest);
  listeners.fetch(event);
  const response = await event.responded;

  assert.strictEqual(response.status, 503, "Sin caché disponible, la respuesta offline debe tener estado 503");

  const contentType = response.headers.get("content-type") || "";
  assert.ok(
    contentType.includes("text/html"),
    'La respuesta offline debe declarar Content-Type "text/html"'
  );

  const body = await response.text();
  assert.ok(
    body.includes("Sin conexión"),
    'El cuerpo de la respuesta offline debe incluir el mensaje "Sin conexión"'
  );

  console.log("offline.spec.ts (fallback final OFFLINE_RESPONSE): PASS");
}

async function testRecoveryViaPrecachedRoot() {
  // Existe precache de "/" (por un install previo), pero no una caché exacta de esta request:
  // debe recuperarse usando caches.match("/")
  const { listeners } = loadServiceWorker(offlineFetch);

  const installEvent = createLifecycleEvent();
  listeners.install(installEvent);
  await installEvent.settled;

  const event = createFetchEvent(navRequest);
  listeners.fetch(event);
  const response = await event.responded;

  assert.strictEqual(response.status, 200, 'Debe recuperar la versión precacheada de "/" en vez de la respuesta offline');
  const body = await response.text();
  assert.ok(body.includes("precache:/"), 'La respuesta recuperada debe provenir del precache de "/"');

  console.log('offline.spec.ts (recuperación con caches.match("/")): PASS');
}

async function testRecoveryViaExactCache() {
  // Existe una respuesta cacheada exacta para esta misma request (guardada por una visita previa
  // con red disponible): debe recuperarse usando caches.match(request), sin necesidad del precache de "/"
  const sharedFetchState = { online: true };
  const flakyFetch = async () => {
    if (sharedFetchState.online) return new Response("visita-anterior-en-linea", { status: 200 });
    throw new Error("Sin conexión simulada");
  };
  const shared = loadServiceWorker(flakyFetch);

  const firstVisit = createFetchEvent(navRequest);
  shared.listeners.fetch(firstVisit);
  await firstVisit.responded;

  sharedFetchState.online = false;
  const secondVisit = createFetchEvent(navRequest);
  shared.listeners.fetch(secondVisit);
  const secondResponse = await secondVisit.responded;

  assert.strictEqual(
    secondResponse.status,
    200,
    "Debe recuperar la respuesta cacheada de una visita anterior (caches.match(request)) al perder la conexión"
  );
  const body = await secondResponse.text();
  assert.ok(
    body.includes("visita-anterior-en-linea"),
    "La respuesta recuperada debe ser exactamente la que se cacheó en la visita anterior"
  );

  console.log("offline.spec.ts (recuperación con caches.match(request)): PASS");
}

async function main() {
  await testFallbackFinal();
  await testRecoveryViaPrecachedRoot();
  await testRecoveryViaExactCache();
}

await main();