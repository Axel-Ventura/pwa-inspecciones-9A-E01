import {
  parseStoredOperations,
  validateSyncOperation,
  type ValidationResult
} from '../security';

export interface SyncOperation {
  operationId: string;
  inspectionId: string;
  type: string;
  payload: unknown;
  version: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  createdAt: string;
  retryCount: number;
}

const STORAGE_KEY = 'pwa_pending_operations';
// Copia de resguardo de lo que NO se pudo validar (corrupto o manipulado).
// Así nada se pierde en silencio cuando la cola vuelve a guardarse.
const QUARANTINE_KEY = 'pwa_pending_operations_quarantine';
const MAX_QUARANTINE_ENTRIES = 10;

function quarantine(raw: string): void {
  try {
    let entries: string[] = [];
    const previous = localStorage.getItem(QUARANTINE_KEY);
    if (previous) {
      const parsed: unknown = JSON.parse(previous);
      if (Array.isArray(parsed)) {
        entries = parsed.filter((item): item is string => typeof item === 'string');
      }
    }
    if (entries.includes(raw)) return;
    entries.push(raw);
    localStorage.setItem(
      QUARANTINE_KEY,
      JSON.stringify(entries.slice(-MAX_QUARANTINE_ENTRIES))
    );
  } catch {
    console.warn('No fue posible resguardar los datos locales rechazados.');
  }
}

export function getStoredOperations(): SyncOperation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const { valid, rejectedCount, corrupted } = parseStoredOperations(raw);

    if (raw !== null && (corrupted || rejectedCount > 0)) {
      quarantine(raw);
      console.warn(
        `Datos locales no confiables: ${rejectedCount} registro(s) rechazado(s)` +
          (corrupted ? ' y estructura ilegible.' : '.')
      );
    }

    return valid;
  } catch {
    console.error('Error al leer de localStorage.');
    return [];
  }
}

export function saveOperations(operations: SyncOperation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
}

export function addPendingOperation(
  operation: SyncOperation
): ValidationResult<SyncOperation> {
  const checked = validateSyncOperation(operation);
  if (!checked.ok) return checked;

  const operations = getStoredOperations();
  const alreadyExists = operations.some(
    (existing) => existing.operationId === checked.value.operationId
  );
  if (!alreadyExists) {
    operations.push(checked.value);
    saveOperations(operations);
  }
  return checked;
}

export function clearStoredOperations(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}