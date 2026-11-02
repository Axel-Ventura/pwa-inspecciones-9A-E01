import type { SyncOperation } from "../storage/schema";
import { getStoredOperations, saveOperations } from "../storage/schema";
import { validateSyncOperation, type ValidationResult } from "../security";

/**
 * SyncQueue administra las operaciones pendientes de sincronización.
 *
 * Responsabilidades (W05):
 * - Evitar operaciones duplicadas (idempotencia por operationId).
 * - Conservar operaciones que fallan, permitiendo reintentarlas.
 * - Marcar como sincronizadas las operaciones exitosas.
 * - Procesar la cola contra un "handler" de sincronización simulado.
 *
 * Responsabilidad agregada (W09):
 * - Validar cada operación antes de aceptarla (src/lib/security).
 *
 * No es responsabilidad de esta clase:
 * - Decidir qué versión de una inspección gana ante un conflicto
 *   (eso lo resuelve conflict-policy.ts).
 * - Definir cómo se guardan los datos (eso lo define schema.ts).
 */
export class SyncQueue {
  private operations: SyncOperation[];

  constructor() {
    // En el navegador, esto recupera lo guardado en localStorage (persistencia
    // real entre sesiones). En un entorno sin "window" (como las pruebas),
    // siempre inicia vacío, lo cual mantiene cada prueba aislada.
    this.operations = getStoredOperations();
  }

  private persist(): void {
    saveOperations(this.operations);
  }

  /**
   * Agrega una operación a la cola. Primero se valida (W09): si es inválida
   * NO se agrega y se devuelve el motivo, sin lanzar excepción ni tocar lo
   * que ya estaba guardado. Si ya existe una operación con el mismo
   * operationId, no se agrega de nuevo (evita duplicados / idempotencia).
   */
  enqueue(operation: SyncOperation): ValidationResult<SyncOperation> {
    const checked = validateSyncOperation(operation);

    if (!checked.ok) {
      return checked;
    }

    const alreadyExists = this.operations.some(
      (existing) => existing.operationId === checked.value.operationId
    );

    if (!alreadyExists) {
      this.operations.push(checked.value);
      this.persist();
    }

    return checked;
  }

  /**
   * Devuelve únicamente las operaciones que siguen pendientes de sincronizar.
   */
  getPending(): SyncOperation[] {
    return this.operations.filter((operation) => operation.status === "pending");
  }

  /**
   * Marca una operación como fallida: permanece pendiente (para poder
   * reintentarla después) y aumenta su contador de reintentos.
   */
  markFailed(operationId: string): void {
    const operation = this.operations.find(
      (existing) => existing.operationId === operationId
    );

    if (!operation) {
      return;
    }

    operation.status = "pending";
    operation.retryCount += 1;
    this.persist();
  }

  /**
   * Marca una operación como sincronizada exitosamente. Deja de contar
   * como pendiente.
   */
  markSynced(operationId: string): void {
    const operation = this.operations.find(
      (existing) => existing.operationId === operationId
    );

    if (!operation) {
      return;
    }

    operation.status = "completed";
    this.persist();
  }

  /**
   * Recorre las operaciones pendientes e intenta sincronizarlas usando el
   * "syncHandler" recibido. Si el handler resuelve sin error, la operación
   * se marca como sincronizada; si lanza un error, se marca como fallida
   * (permanece pendiente con el contador de reintentos aumentado).
   */
  async process(
    syncHandler: (operation: SyncOperation) => Promise<void>
  ): Promise<void> {
    const pendingOperations = this.getPending();

    for (const operation of pendingOperations) {
      try {
        await syncHandler(operation);
        this.markSynced(operation.operationId);
      } catch (error) {
        this.markFailed(operation.operationId);
      }
    }
  }
}