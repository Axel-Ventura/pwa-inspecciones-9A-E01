import { afterEach, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_ID_LENGTH,
  isValidId,
  isValidOperationStatus,
  validateSyncOperation
} from "../src/lib/security";
import { SyncQueue } from "../src/lib/sync/queue";
import {
  MemoryStorage,
  STORAGE_KEY,
  createOperation,
  installBrowserStorage,
  restoreBrowserGlobals
} from "./helpers/test-utils";

const QUARANTINE_KEY = "pwa_pending_operations_quarantine";

describe("Validación de identificadores", () => {
  test("identificador válido se acepta", () => {
    assert.equal(isValidId("op-001"), true);
    assert.equal(isValidId("inspection-001"), true);
  });

  test("identificador vacío se rechaza", () => {
    assert.equal(isValidId(""), false);
  });

  test("identificador de tipo incorrecto se rechaza", () => {
    assert.equal(isValidId(123), false);
    assert.equal(isValidId(null), false);
    assert.equal(isValidId(undefined), false);
    assert.equal(isValidId({ id: "op-001" }), false);
  });

  test("identificador excesivamente largo se rechaza", () => {
    assert.equal(isValidId("a".repeat(MAX_ID_LENGTH)), true);
    assert.equal(isValidId("a".repeat(MAX_ID_LENGTH + 1)), false);
  });

  test("identificador con caracteres no esperados se rechaza", () => {
    assert.equal(isValidId("<script>alert(1)</script>"), false);
    assert.equal(isValidId("op 001"), false);
    assert.equal(isValidId("../op-001"), false);
  });
});

describe("Validación de estados", () => {
  test("los estados reales del proyecto se aceptan", () => {
    for (const status of ["pending", "syncing", "completed", "failed"]) {
      assert.equal(isValidOperationStatus(status), true);
    }
  });

  test("un estado desconocido se rechaza", () => {
    assert.equal(isValidOperationStatus("done"), false);
    assert.equal(isValidOperationStatus("PENDING"), false);
    assert.equal(isValidOperationStatus(""), false);
    assert.equal(isValidOperationStatus(undefined), false);
  });
});

describe("Validación de la operación completa", () => {
  test("un objeto completo y válido se acepta", () => {
    const result = validateSyncOperation(createOperation());
    assert.equal(result.ok, true);
  });

  test("un objeto sin un campo obligatorio se rechaza", () => {
    const { operationId: _omitted, ...incomplete } = createOperation();
    const result = validateSyncOperation(incomplete);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, "MISSING_FIELD");
      assert.equal(result.field, "operationId");
    }
  });

  test("un campo extra inesperado se rechaza", () => {
    const result = validateSyncOperation({ ...createOperation(), isAdmin: true });
    assert.equal(result.ok, false);
  });

  test("valores fuera de rango o de tipo incorrecto se rechazan", () => {
    assert.equal(validateSyncOperation(createOperation({ version: -1 })).ok, false);
    assert.equal(validateSyncOperation(createOperation({ version: 1.5 })).ok, false);
    assert.equal(validateSyncOperation(createOperation({ retryCount: -3 })).ok, false);
    assert.equal(validateSyncOperation(createOperation({ createdAt: "ayer" })).ok, false);
    assert.equal(validateSyncOperation(createOperation({ status: "done" as never })).ok, false);
    assert.equal(validateSyncOperation(createOperation({ payload: "texto" })).ok, false);
  });

  test("un payload excesivamente grande se rechaza", () => {
    const huge = createOperation({ payload: { note: "x".repeat(20_000) } });
    assert.equal(validateSyncOperation(huge).ok, false);
  });

  test("el rechazo no filtra el valor recibido en el mensaje", () => {
    const secret = "valor-sensible-que-no-debe-aparecer";
    const result = validateSyncOperation(createOperation({ operationId: `${secret} !` }));
    assert.equal(result.ok, false);
    assert.equal(JSON.stringify(result).includes(secret), false);
  });
});

describe("Integración con la cola y el almacenamiento", () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = installBrowserStorage() as MemoryStorage;
  });

  afterEach(() => {
    restoreBrowserGlobals();
  });

  test("una entrada inválida no entra a la cola ni al almacenamiento", () => {
    const queue = new SyncQueue();
    queue.enqueue(createOperation({ operationId: "op-001" }));
    const before = storage.getItem(STORAGE_KEY);

    const result = queue.enqueue(createOperation({ operationId: "", status: "done" as never }));

    assert.equal(result.ok, false);
    assert.equal(queue.getPending().length, 1);
    assert.equal(storage.getItem(STORAGE_KEY), before);
  });

  test("una operación duplicada sigue sin duplicarse", () => {
    const queue = new SyncQueue();
    queue.enqueue(createOperation());
    queue.enqueue(createOperation());
    assert.equal(queue.getPending().length, 1);
  });

  test("datos manipulados: se conservan los válidos y los rechazados se resguardan", () => {
    const good = createOperation({ operationId: "op-001" });
    const tampered = { ...createOperation({ operationId: "op-002" }), status: "hacked" };
    const raw = JSON.stringify([good, tampered]);
    storage.setItem(STORAGE_KEY, raw);

    const queue = new SyncQueue();

    assert.deepEqual(
      queue.getPending().map((operation) => operation.operationId),
      ["op-001"]
    );
    const quarantined = JSON.parse(storage.getItem(QUARANTINE_KEY) as string);
    assert.deepEqual(quarantined, [raw]);
  });

  test("REGRESIÓN: JSON corrupto no se pierde en silencio al encolar una operación nueva", () => {
    const corruptRaw = '[{"operationId":"op-777", "status":';
    storage.setItem(STORAGE_KEY, corruptRaw);

    const queue = new SyncQueue();
    queue.enqueue(createOperation({ operationId: "op-002" }));

    // La cola nueva funciona...
    assert.deepEqual(
      queue.getPending().map((operation) => operation.operationId),
      ["op-002"]
    );
    // ...y lo corrupto sigue disponible para recuperarlo, no desapareció.
    const quarantined = JSON.parse(storage.getItem(QUARANTINE_KEY) as string);
    assert.deepEqual(quarantined, [corruptRaw]);
  });

  test("una estructura que no es lista se trata como no confiable", () => {
    storage.setItem(STORAGE_KEY, JSON.stringify({ operationId: "op-001" }));

    const queue = new SyncQueue();

    assert.equal(queue.getPending().length, 0);
    assert.ok(storage.getItem(QUARANTINE_KEY));
  });
});