import { afterEach, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  addPendingOperation,
  getStoredOperations
} from "../../src/lib/storage/schema";
import { SyncQueue } from "../../src/lib/sync/queue";
import {
  MemoryStorage,
  STORAGE_KEY,
  createOperation,
  installBrowserStorage,
  restoreBrowserGlobals
} from "../helpers/test-utils";

// Estas pruebas usan los módulos reales (schema.ts y queue.ts) trabajando juntos,
// con un localStorage simulado compartido entre las "recargas" de la aplicación.
// Cada `new SyncQueue()` representa abrir la aplicación de nuevo.

const failingHandler = async () => {
  throw new Error("Fallo simulado de red");
};

const successHandler = async () => {};

describe("Cola de sincronización + almacenamiento (integración)", () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = installBrowserStorage() as MemoryStorage;
  });

  afterEach(() => {
    restoreBrowserGlobals();
  });

  test("la cola recupera una operación que ya estaba guardada", () => {
    addPendingOperation(createOperation());

    const queue = new SyncQueue();

    const pending = queue.getPending();
    assert.equal(pending.length, 1);
    assert.equal(pending[0].operationId, "op-001");
  });

  test("una nueva instancia conserva las operaciones de la anterior", () => {
    const firstSession = new SyncQueue();
    firstSession.enqueue(createOperation());

    const secondSession = new SyncQueue();

    assert.equal(secondSession.getPending().length, 1);
    assert.equal(secondSession.getPending()[0].operationId, "op-001");
  });

  test("si la sincronización falla, la operación sigue pendiente y guardada", async () => {
    const queue = new SyncQueue();
    queue.enqueue(createOperation());

    await queue.process(failingHandler);

    assert.equal(queue.getPending().length, 1);
    assert.equal(getStoredOperations().length, 1);
    assert.equal(getStoredOperations()[0].status, "pending");
  });

  test("retryCount se conserva al recargar la aplicación", async () => {
    const firstSession = new SyncQueue();
    firstSession.enqueue(createOperation());
    await firstSession.process(failingHandler);

    const secondSession = new SyncQueue();
    assert.equal(secondSession.getPending()[0].retryCount, 1);

    await secondSession.process(failingHandler);

    const thirdSession = new SyncQueue();
    assert.equal(thirdSession.getPending()[0].retryCount, 2);
  });

  test("tras un fallo, un reintento exitoso completa la operación y se guarda", async () => {
    const firstSession = new SyncQueue();
    firstSession.enqueue(createOperation());
    await firstSession.process(failingHandler);

    const secondSession = new SyncQueue();
    await secondSession.process(successHandler);

    assert.equal(secondSession.getPending().length, 0);

    // Al recargar de nuevo, sigue completada: no vuelve a la cola.
    const thirdSession = new SyncQueue();
    assert.equal(thirdSession.getPending().length, 0);
    assert.equal(getStoredOperations()[0].status, "completed");
  });

  test("la misma operación no se duplica al guardarla y recuperarla", () => {
    const firstSession = new SyncQueue();
    firstSession.enqueue(createOperation());

    // Se reintenta el envío desde una sesión nueva (por ejemplo, tras recargar).
    const secondSession = new SyncQueue();
    secondSession.enqueue(createOperation());

    assert.equal(getStoredOperations().length, 1);
    assert.equal(new SyncQueue().getPending().length, 1);
  });

  test("el éxito de una operación no elimina otra que falló", async () => {
    const queue = new SyncQueue();
    queue.enqueue(createOperation({ operationId: "op-001" }));
    queue.enqueue(createOperation({ operationId: "op-002" }));

    await queue.process(async (operation) => {
      if (operation.operationId === "op-001") {
        throw new Error("Fallo simulado solo para op-001");
      }
    });

    // Se comprueba también después de "recargar".
    const reloaded = new SyncQueue();
    const pending = reloaded.getPending();
    assert.equal(pending.length, 1);
    assert.equal(pending[0].operationId, "op-001");

    const stored = getStoredOperations();
    assert.equal(stored.length, 2);
    assert.equal(
      stored.find((operation) => operation.operationId === "op-002")?.status,
      "completed"
    );
  });

  test("el estado guardado está en la clave de almacenamiento esperada", () => {
    new SyncQueue().enqueue(createOperation());

    assert.notEqual(storage.getItem(STORAGE_KEY), null);
  });
});