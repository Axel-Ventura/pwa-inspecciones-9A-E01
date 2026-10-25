import type { SyncOperation } from "../../src/lib/storage/schema";

// Clave que usa schema.ts para guardar las operaciones en localStorage.
export const STORAGE_KEY = "pwa_pending_operations";

// Operación sintética con identificadores y fechas fijas.
export function createOperation(
  overrides: Partial<SyncOperation> = {}
): SyncOperation {
  return {
    operationId: "op-001",
    inspectionId: "inspection-001",
    type: "create",
    payload: {
      location: "Laboratorio de Redes",
      status: "ok"
    },
    version: 1,
    status: "pending",
    createdAt: "2026-10-19T10:00:00.000Z",
    retryCount: 0,
    ...overrides
  };
}

// localStorage simulado: guarda todo en memoria, sin navegador real.
export class MemoryStorage {
  private data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.has(key) ? (this.data.get(key) as string) : null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, String(value));
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }

  get length(): number {
    return this.data.size;
  }
}

const originalDescriptors = {
  window: Object.getOwnPropertyDescriptor(globalThis, "window"),
  localStorage: Object.getOwnPropertyDescriptor(globalThis, "localStorage")
};

function defineGlobal(name: "window" | "localStorage", value: unknown): void {
  Object.defineProperty(globalThis, name, {
    configurable: true,
    writable: true,
    value
  });
}

// Simula un navegador: define "window" y un localStorage de prueba.
export function installBrowserStorage(
  storage: unknown = new MemoryStorage()
): unknown {
  defineGlobal("window", {});
  defineGlobal("localStorage", storage);
  return storage;
}

// Simula un entorno sin navegador (sin "window" ni localStorage).
export function removeBrowserGlobals(): void {
  Reflect.deleteProperty(globalThis, "window");
  Reflect.deleteProperty(globalThis, "localStorage");
}

// Devuelve los globales a como estaban antes de las pruebas.
export function restoreBrowserGlobals(): void {
  removeBrowserGlobals();

  if (originalDescriptors.window) {
    Object.defineProperty(globalThis, "window", originalDescriptors.window);
  }

  if (originalDescriptors.localStorage) {
    Object.defineProperty(
      globalThis,
      "localStorage",
      originalDescriptors.localStorage
    );
  }
}