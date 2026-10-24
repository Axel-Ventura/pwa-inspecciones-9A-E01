import { afterEach, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { SyncQueue } from "../../src/lib/sync/queue";
import {
  createOperation,
  removeBrowserGlobals,
  restoreBrowserGlobals
} from "../helpers/test-utils";

describe("SyncQueue (unitaria)", () => {
  beforeEach(() => {
    // Sin navegador: la cola trabaja solo en memoria y cada prueba empieza vacía.
    removeBrowserGlobals();
  });

  afterEach(() => {
    restoreBrowserGlobals();
  });

  test("agrega una operación válida como pendiente", () => {
    const queue = new SyncQueue();

    queue.enqueue(createOperation());

    const pending = queue.getPending();
    assert.equal(pending.length, 1);
    assert.equal(pending[0].operationId, "op-001");
    assert.equal(pending[0].status, "pending");
  });

  test("no duplica una operación con el mismo operationId", () => {
    const queue = new SyncQueue();

    queue.enqueue(createOperation());
    queue.enqueue(createOperation());

    assert.equal(queue.getPending().length, 1);
  });

  test("una operación fallida permanece pendiente", () => {
    const queue = new SyncQueue();
    queue.enqueue(createOperation());

    queue.markFailed("op-001");

    const pending = queue.getPending();
    assert.equal(pending.length, 1);
    assert.equal(pending[0].status, "pending");
  });

  test("retryCount aumenta con cada fallo", () => {
    const queue = new SyncQueue();
    queue.enqueue(createOperation());

    queue.markFailed("op-001");
    assert.equal(queue.getPending()[0].retryCount, 1);

    queue.markFailed("op-001");
    assert.equal(queue.getPending()[0].retryCount, 2);
  });

  test("una operación sincronizada deja de estar pendiente", () => {
    const queue = new SyncQueue();
    queue.enqueue(createOperation());

    queue.markSynced("op-001");

    assert.equal(queue.getPending().length, 0);
  });

  test("un reintento exitoso con process() completa la operación", async () => {
    const queue = new SyncQueue();
    queue.enqueue(createOperation());
    queue.markFailed("op-001");

    let attempts = 0;
    await queue.process(async () => {
      attempts += 1;
    });

    assert.equal(attempts, 1);
    assert.equal(queue.getPending().length, 0);
  });

  test("un reintento fallido con process() no pierde la operación", async () => {
    const queue = new SyncQueue();
    queue.enqueue(createOperation());

    await queue.process(async () => {
      throw new Error("Fallo simulado de red");
    });

    const pending = queue.getPending();
    assert.equal(pending.length, 1);
    assert.equal(pending[0].status, "pending");
    assert.equal(pending[0].retryCount, 1);
  });

  test("procesa varias operaciones pendientes", async () => {
    const queue = new SyncQueue();
    queue.enqueue(createOperation({ operationId: "op-001" }));
    queue.enqueue(createOperation({ operationId: "op-002" }));
    queue.enqueue(createOperation({ operationId: "op-003" }));

    const handled: string[] = [];
    await queue.process(async (operation) => {
      handled.push(operation.operationId);
    });

    assert.deepEqual(handled, ["op-001", "op-002", "op-003"]);
    assert.equal(queue.getPending().length, 0);
  });

  test("si falla una operación, las demás se siguen procesando", async () => {
    const queue = new SyncQueue();
    queue.enqueue(createOperation({ operationId: "op-001" }));
    queue.enqueue(createOperation({ operationId: "op-002" }));

    await queue.process(async (operation) => {
      if (operation.operationId === "op-001") {
        throw new Error("Fallo simulado solo para op-001");
      }
    });

    const pending = queue.getPending();
    assert.equal(pending.length, 1);
    assert.equal(pending[0].operationId, "op-001");
    assert.equal(pending[0].retryCount, 1);
  });

  test("marcar una operación inexistente no cambia la cola", () => {
    const queue = new SyncQueue();
    queue.enqueue(createOperation());

    queue.markFailed("op-no-existe");
    queue.markSynced("op-no-existe");

    const pending = queue.getPending();
    assert.equal(pending.length, 1);
    assert.equal(pending[0].retryCount, 0);
  });

  test("una operación ya sincronizada no se procesa otra vez", async () => {
    const queue = new SyncQueue();
    queue.enqueue(createOperation());

    let attempts = 0;
    const handler = async () => {
      attempts += 1;
    };

    await queue.process(handler);
    await queue.process(handler);

    assert.equal(attempts, 1);
  });
});