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

export function getStoredOperations(): SyncOperation[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al leer de localStorage:', error);
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

export function addPendingOperation(operation: SyncOperation): void {
  const operations = getStoredOperations();
  operations.push(operation);
  saveOperations(operations);
}

export function clearStoredOperations(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}