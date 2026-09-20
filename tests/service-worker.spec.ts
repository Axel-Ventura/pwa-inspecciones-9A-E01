import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert";

const rootDir = process.cwd();
const swPath = path.join(rootDir, "public", "sw.js");

// 1. Existencia de public/sw.js
assert.strictEqual(fs.existsSync(swPath), true, "public/sw.js debe existir");

const source = fs.readFileSync(swPath, "utf-8");

// --- Simulación mínima del entorno de un Service Worker ---

function createMockCaches() {
  const store = new Map();
  const openedCaches = [];

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
    open: async (name) => {
      openedCaches.push(name);
      return makeCache(name);
    },
    keys: async () => Array.from(store.keys()),
    delete: async (name) => store.delete(name),
    match: async (request) => {
      const key = normalize(request);
      for (const map of store.values()) {
        if (map.has(key)) return map.get(key);
      }
      return undefined;
    },
    _openedCaches: openedCaches,
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

async function main() {
  // ------------------------------------------------------------------
  // Escenario base: red disponible
  // ------------------------------------------------------------------
  const onlineFetch = async () => new Response("ok", { status: 200 });
  const { listeners, mockCaches } = loadServiceWorker(onlineFetch);

  assert.ok(typeof listeners.install === "function", "Debe existir un listener para 'install'");
  assert.ok(typeof listeners.activate === "function", "Debe existir un listener para 'activate'");
  assert.ok(typeof listeners.fetch === "function", "Debe existir un listener para 'fetch'");

  // 2 y 3. Precache: al instalar, debe abrirse la caché estática y precachear "/" y "/manifest.webmanifest"
  const installEvent = createLifecycleEvent();
  listeners.install(installEvent);
  await installEvent.settled;

  assert.ok(
    mockCaches._openedCaches.includes("inspecciones-laboratorio-v1-static"),
    'install debe abrir la caché "inspecciones-laboratorio-v1-static"'
  );

  const precachedRoot = await mockCaches.match("/");
  assert.ok(precachedRoot, 'La ruta "/" debe quedar precacheada tras install');

  const precachedManifest = await mockCaches.match("/manifest.webmanifest");
  assert.ok(precachedManifest, 'La ruta "/manifest.webmanifest" debe quedar precacheada tras install');

  // 4. Métodos: una solicitud que no sea GET no debe procesarse
  const postEvent = createFetchEvent({
    url: "https://example.test/api/inspecciones",
    method: "POST",
    mode: "same-origin",
    destination: "",
  });
  listeners.fetch(postEvent);
  assert.strictEqual(
    postEvent.responded,
    undefined,
    "Una solicitud POST no debe ser interceptada (no debe llamarse respondWith)"
  );

  // 5. Navegación: debe existir la estrategia Network First
  const navEvent = createFetchEvent({
    url: "https://example.test/",
    method: "GET",
    mode: "navigate",
    destination: "document",
  });
  listeners.fetch(navEvent);
  assert.ok(navEvent.responded, "Una solicitud de navegación debe ser interceptada");
  const navResponse = await navEvent.responded;
  assert.strictEqual(
    navResponse.status,
    200,
    "Con red disponible, la navegación debe responder con la respuesta de la red (Network First)"
  );

  assert.ok(
    mockCaches._openedCaches.includes("inspecciones-laboratorio-v1-runtime"),
    'Tras una navegación exitosa debe abrirse la caché "inspecciones-laboratorio-v1-runtime" para guardarla'
  );

  // ------------------------------------------------------------------
  // 6. Recursos estáticos: debe existir la estrategia Cache First
  // ------------------------------------------------------------------
  let staticFetchCalls = 0;
  const countingFetch = async () => {
    staticFetchCalls += 1;
    return new Response("body-estatico", { status: 200 });
  };
  const staticEnv = loadServiceWorker(countingFetch);

  const scriptRequest = {
    url: "https://example.test/_next/static/chunk.js",
    method: "GET",
    mode: "no-cors",
    destination: "script",
  };

  // Primera solicitud: no hay caché todavía, debe ir a la red y guardar el resultado
  const firstEvent = createFetchEvent(scriptRequest);
  staticEnv.listeners.fetch(firstEvent);
  await firstEvent.responded;
  assert.strictEqual(staticFetchCalls, 1, "La primera solicitud del recurso estático debe ir a la red");

  // Segunda solicitud idéntica: debe servirse desde caché SIN volver a llamar a la red
  const secondEvent = createFetchEvent(scriptRequest);
  staticEnv.listeners.fetch(secondEvent);
  await secondEvent.responded;
  assert.strictEqual(
    staticFetchCalls,
    1,
    "La segunda solicitud del mismo recurso estático debe servirse desde caché (Cache First), sin llamar a la red otra vez"
  );

  // ------------------------------------------------------------------
  // 7. Invalidación: activate debe borrar cachés anteriores del mismo proyecto
  // ------------------------------------------------------------------
  const activationEnv = loadServiceWorker(onlineFetch);
  await activationEnv.mockCaches.open("inspecciones-laboratorio-v0-static");
  await activationEnv.mockCaches.open("inspecciones-laboratorio-v0-runtime");

  const activateEvent = createLifecycleEvent();
  activationEnv.listeners.activate(activateEvent);
  await activateEvent.settled;

  const remaining = await activationEnv.mockCaches.keys();
  assert.ok(
    !remaining.includes("inspecciones-laboratorio-v0-static") &&
      !remaining.includes("inspecciones-laboratorio-v0-runtime"),
    "activate debe eliminar las cachés anteriores que ya no correspondan a la versión actual"
  );

  console.log("service-worker.spec.ts: PASS");
}

await main();