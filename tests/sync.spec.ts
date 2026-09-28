import assert from "node:assert/strict";
import { SyncQueue } from "../src/lib/sync/queue";
import type { SyncOperation } from "../src/lib/storage/schema";
import { resolveConflict } from "../src/lib/sync/conflict-policy";

function createOperation(
  overrides: Partial<SyncOperation> = {}
): SyncOperation {
  return {
    operationId: "op-001",
    inspectionId: "inspection-001",
    type: "create",
    payload: {
      location: "Laboratorio 1",
      status: "ok"
    },
    version: 1,
    status: "pending",
    createdAt: "2026-09-28T10:00:00.000Z",
    retryCount: 0,
    ...overrides
  };
}

function test(name: string, callback: () => void | Promise<void>) {
  Promise.resolve()
    .then(callback)
    .then(
      () => {
        console.log(`${name}: PASS`);
      },
      (error) => {
        console.error(`${name}: FAIL`);
        throw error;
      }
    );
}

/* ============================================================
   TEST 1 — ENCOLAR OPERACIÓN
   Verifica que una operación válida pueda agregarse a la cola
   y quede disponible como operación pendiente.
   ============================================================ */

test("Test 1 — una operación válida se agrega como pendiente", () => {
  const queue = new SyncQueue();
  const operation = createOperation();

  queue.enqueue(operation);

  const pending = queue.getPending();

  assert.equal(pending.length, 1);
  assert.equal(pending[0].operationId, "op-001");
  assert.equal(pending[0].status, "pending");
});

/* ============================================================
   TEST 2 — IDEMPOTENCIA / DUPLICADOS
   Verifica que agregar dos veces la misma operationId no
   produzca dos operaciones pendientes.
   ============================================================ */

test("Test 2 — una operación duplicada no se agrega dos veces", () => {
  const queue = new SyncQueue();
  const operation = createOperation();

  queue.enqueue(operation);
  queue.enqueue(operation);

  const pending = queue.getPending();

  assert.equal(pending.length, 1);
  assert.equal(pending[0].operationId, "op-001");
});

/* ============================================================
   TEST 3 — FALLO Y RETRY
   Verifica que una operación que falla permanezca pendiente
   y aumente su contador de reintentos.
   ============================================================ */

test("Test 3 — una operación fallida permanece pendiente para reintento", () => {
  const queue = new SyncQueue();
  const operation = createOperation();

  queue.enqueue(operation);
  queue.markFailed(operation.operationId);

  const pending = queue.getPending();

  assert.equal(pending.length, 1);
  assert.equal(pending[0].status, "pending");
  assert.equal(pending[0].retryCount, 1);
});

/* ============================================================
   TEST 4 — SINCRONIZACIÓN EXITOSA
   Verifica que una operación marcada como sincronizada deje
   de aparecer entre las operaciones pendientes.
   ============================================================ */

test("Test 4 — una operación sincronizada deja de estar pendiente", () => {
  const queue = new SyncQueue();
  const operation = createOperation();

  queue.enqueue(operation);
  queue.markSynced(operation.operationId);

  const pending = queue.getPending();

  assert.equal(pending.length, 0);
});

/* ============================================================
   TEST 5 — RETRY EXITOSO
   Verifica que process() pueda volver a intentar una operación
   pendiente y completarla cuando el sincronizador tiene éxito.
   ============================================================ */

test("Test 5 — un reintento exitoso permite completar la operación", async () => {
  const queue = new SyncQueue();
  const operation = createOperation();

  queue.enqueue(operation);
  queue.markFailed(operation.operationId);

  let attempts = 0;

  await queue.process(async () => {
    attempts += 1;
  });

  assert.equal(attempts, 1);
  assert.equal(queue.getPending().length, 0);
});

/* ============================================================
   TEST 6 — RETRY FALLIDO
   Verifica que si process() vuelve a fallar, la operación no
   se pierda y permanezca disponible para otro intento.
   ============================================================ */

test("Test 6 — una operación fallida durante process permanece pendiente", async () => {
  const queue = new SyncQueue();
  const operation = createOperation();

  queue.enqueue(operation);

  await queue.process(async () => {
    throw new Error("Fallo simulado de red");
  });

  const pending = queue.getPending();

  assert.equal(pending.length, 1);
  assert.equal(pending[0].status, "pending");
  assert.equal(pending[0].retryCount, 1);
});

/* ============================================================
   TEST 7 — RESOLUCIÓN DE CONFLICTO
   Verifica que la política de conflicto seleccione la versión
   más reciente cuando existen dos versiones diferentes.
   ============================================================ */

test("Test 7 — una versión más nueva gana ante un conflicto", () => {
  const local = createOperation({
    version: 2,
    payload: {
      location: "Laboratorio 1",
      status: "attention"
    }
  });

  const remote = createOperation({
    version: 1,
    payload: {
      location: "Laboratorio 1",
      status: "ok"
    }
  });

  const result = resolveConflict(local, remote);

  assert.equal(result.version, 2);
  assert.equal(result.payload.status, "attention");
});

/* ============================================================
   TEST 8 — RESPUESTAS FUERA DE ORDEN
   Verifica que una respuesta antigua no pueda sobrescribir
   una versión más nueva del mismo registro.
   ============================================================ */

test("Test 8 — una respuesta antigua no sobrescribe una versión nueva", () => {
  const current = createOperation({
    version: 3,
    payload: {
      location: "Laboratorio 1",
      status: "attention"
    }
  });

  const oldResponse = createOperation({
    version: 2,
    payload: {
      location: "Laboratorio 1",
      status: "ok"
    }
  });

  const result = resolveConflict(current, oldResponse);

  assert.equal(result.version, 3);
  assert.equal(result.payload.status, "attention");
});

console.log("Pruebas de sincronización definidas.");