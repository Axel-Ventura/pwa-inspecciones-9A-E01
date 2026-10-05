import type { SyncOperation } from "../storage/schema";

/**
 * conflict-policy.ts NO sincroniza nada ni modifica la cola. Su única
 * responsabilidad es decidir, dadas dos versiones de la misma inspección,
 * cuál debe conservarse.
 *
 * Regla definida para W05: gana la versión con el número de "version" más
 * alto. Esto evita que una respuesta antigua (por ejemplo, una que tardó
 * más en llegar por la red) sobrescriba una versión más reciente que ya
 * se había guardado.
 */
export function resolveConflict(
  local: SyncOperation,
  remote: SyncOperation
): SyncOperation {
  return local.version >= remote.version ? local : remote;
}