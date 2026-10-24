import { afterEach, beforeEach, describe, mock, test } from "node:test";
import assert from "node:assert/strict";
import {
  addPendingOperation,
  clearStoredOperations,
  getStoredOperations,
  saveOperations
} from "../../src/lib/storage/schema";
import {
  MemoryStorage,
  STORAGE_KEY,
  createOperation,
  installBrowserStorage,
  restoreBrowserGlobals
} from "../helpers/test-utils";

describe("schema.ts: almacenamiento local (unitaria)", () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = installBrowserStorage() as MemoryStorage;
    // schema.ts avisa los errores con console.error; se silencia para no ensuciar la salida.
    mock.method(console, "error", () => {});
  });

  afterEach(() => {
    mock.restoreAll();
    restoreBrowserGlobals();
  });

  test("guarda operaciones en localStorage", () => {
    saveOperations([createOperation()]);

    const raw = storage.getItem(STORAGE_KEY);
    assert.notEqual(raw, null);
    assert.equal(JSON.parse(raw as string).length, 1);
  });

  test("recupera las operaciones guardadas", () => {
    const operation = createOperation();
    saveOperations([operation]);

    assert.deepEqual(getStoredOperations(), [operation]);
  });

  test("devuelve un arreglo vacío si todavía no hay operaciones", () => {
    assert.deepEqual(getStoredOperations(), []);
  });

  test("maneja JSON inválido sin interrumpir la aplicación", () => {
    storage.setItem(STORAGE_KEY, "{esto no es json");

    assert.deepEqual(getStoredOperations(), []);
  });

  test("limpia el almacenamiento", () => {
    saveOperations([createOperation()]);

    clearStoredOperations();

    assert.equal(storage.getItem(STORAGE_KEY), null);
    assert.deepEqual(getStoredOperations(), []);
  });

  test("sin window no falla, no lee y no guarda nada", () => {
    saveOperations([createOperation()]);
    Reflect.deleteProperty(globalThis, "window");

    assert.deepEqual(getStoredOperations(), []);
    assert.doesNotThrow(() => saveOperations([createOperation({ operationId: "op-002" })]));
    assert.doesNotThrow(() => clearStoredOperations());

    // Con window de nuevo disponible, solo sigue lo que se guardó antes.
    installBrowserStorage(storage);
    assert.equal(getStoredOperations().length, 1);
    assert.equal(getStoredOperations()[0].operationId, "op-001");
  });

  test("un error al leer el almacenamiento se maneja de forma controlada", () => {
    installBrowserStorage({
      getItem: () => {
        throw new Error("Acceso al almacenamiento bloqueado");
      },
      setItem: () => {},
      removeItem: () => {}
    });

    assert.deepEqual(getStoredOperations(), []);
  });

  test("un error al guardar (por ejemplo, sin espacio) no rompe la aplicación", () => {
    installBrowserStorage({
      getItem: () => null,
      setItem: () => {
        throw new Error("Almacenamiento lleno");
      },
      removeItem: () => {}
    });

    assert.doesNotThrow(() => saveOperations([createOperation()]));
  });

  test("addPendingOperation agrega una operación", () => {
    addPendingOperation(createOperation());

    assert.equal(getStoredOperations().length, 1);
  });

  // PRUEBA DE REGRESIÓN: hoy addPendingOperation() permite duplicados, por lo
  // que esta prueba FALLA contra la implementación original. Ese fallo es la
  // evidencia del defecto. Pasará cuando se agregue la protección por operationId.
  test("addPendingOperation no duplica la misma operación", () => {
    addPendingOperation(createOperation());
    addPendingOperation(createOperation());

    assert.equal(
      getStoredOperations().length,
      1,
      "La misma operationId no debe guardarse dos veces"
    );
  });
});