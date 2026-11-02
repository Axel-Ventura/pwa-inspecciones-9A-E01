import type { SyncOperation } from "../storage/schema";

/**
 * Controles de seguridad (Week 09). Validan en TIEMPO DE EJECUCIÓN los datos
 * que entran a la app o se recuperan del navegador. Los tipos de TypeScript
 * no bastan: localStorage puede haber sido alterado.
 *
 * Los mensajes de error NO incluyen el valor recibido (solo un código y el
 * nombre del campo) para no filtrar datos internos.
 */

// Estados reales del proyecto (SyncOperation.status en schema.ts).
export const OPERATION_STATUSES = [
  "pending",
  "syncing",
  "completed",
  "failed"
] as const;

// Límites razonables.
export const MAX_ID_LENGTH = 64;
export const MAX_TYPE_LENGTH = 32;
export const MAX_PAYLOAD_LENGTH = 10_000; // caracteres del JSON del payload
export const MAX_VERSION = 1_000_000;
export const MAX_RETRY_COUNT = 1_000;

// Caracteres seguros para IDs: "op-001", "inspection-001", UUID, etc.
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
const TYPE_PATTERN = /^[a-z][a-z0-9_-]*$/;
const ISO_DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;

const ALLOWED_KEYS = [
  "operationId",
  "inspectionId",
  "type",
  "payload",
  "version",
  "status",
  "createdAt",
  "retryCount"
] as const;

export type ValidationErrorCode =
  | "INVALID_OBJECT"
  | "MISSING_FIELD"
  | "UNEXPECTED_FIELD"
  | "INVALID_ID"
  | "INVALID_TYPE"
  | "INVALID_STATUS"
  | "INVALID_PAYLOAD"
  | "INVALID_NUMBER"
  | "INVALID_DATE";

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: ValidationErrorCode; field?: string };

function fail(
  code: ValidationErrorCode,
  field?: string
): { ok: false; code: ValidationErrorCode; field?: string } {
  return { ok: false, code, field };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

// A. Identificadores
export function isValidId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_ID_LENGTH &&
    ID_PATTERN.test(value)
  );
}

// B. Estados
export function isValidOperationStatus(
  value: unknown
): value is SyncOperation["status"] {
  return (
    typeof value === "string" &&
    (OPERATION_STATUSES as readonly string[]).includes(value)
  );
}

function isBoundedInteger(
  value: unknown,
  min: number,
  max: number
): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= min &&
    value <= max
  );
}

function payloadWithinLimit(payload: unknown): boolean {
  try {
    const json = JSON.stringify(payload);
    return typeof json === "string" && json.length <= MAX_PAYLOAD_LENGTH;
  } catch {
    return false; // referencias circulares, BigInt, etc.
  }
}

// B + D. Operación completa. Devuelve una COPIA limpia (solo campos permitidos).
export function validateSyncOperation(
  input: unknown
): ValidationResult<SyncOperation> {
  if (!isPlainObject(input)) return fail("INVALID_OBJECT");

  for (const key of Object.keys(input)) {
    if (!(ALLOWED_KEYS as readonly string[]).includes(key)) {
      return fail("UNEXPECTED_FIELD");
    }
  }
  for (const key of ALLOWED_KEYS) {
    if (
      !Object.prototype.hasOwnProperty.call(input, key) ||
      input[key] === undefined
    ) {
      return fail("MISSING_FIELD", key);
    }
  }

  if (!isValidId(input.operationId)) return fail("INVALID_ID", "operationId");
  if (!isValidId(input.inspectionId)) return fail("INVALID_ID", "inspectionId");

  if (
    typeof input.type !== "string" ||
    input.type.length === 0 ||
    input.type.length > MAX_TYPE_LENGTH ||
    !TYPE_PATTERN.test(input.type)
  ) {
    return fail("INVALID_TYPE", "type");
  }

  if (!isValidOperationStatus(input.status)) {
    return fail("INVALID_STATUS", "status");
  }

  if (!isPlainObject(input.payload) || !payloadWithinLimit(input.payload)) {
    return fail("INVALID_PAYLOAD", "payload");
  }

  if (!isBoundedInteger(input.version, 0, MAX_VERSION)) {
    return fail("INVALID_NUMBER", "version");
  }
  if (!isBoundedInteger(input.retryCount, 0, MAX_RETRY_COUNT)) {
    return fail("INVALID_NUMBER", "retryCount");
  }

  if (
    typeof input.createdAt !== "string" ||
    input.createdAt.length > 40 ||
    !ISO_DATE_PATTERN.test(input.createdAt) ||
    Number.isNaN(Date.parse(input.createdAt))
  ) {
    return fail("INVALID_DATE", "createdAt");
  }

  return {
    ok: true,
    value: {
      operationId: input.operationId,
      inspectionId: input.inspectionId,
      type: input.type,
      payload: input.payload,
      version: input.version,
      status: input.status,
      createdAt: input.createdAt,
      retryCount: input.retryCount
    }
  };
}

// C. Datos recuperados del dispositivo
export interface ParsedStoredOperations {
  valid: SyncOperation[];
  rejectedCount: number;
  corrupted: boolean; // true si el JSON no se pudo leer o no era una lista
}

export function parseStoredOperations(
  raw: string | null
): ParsedStoredOperations {
  if (raw === null || raw === "") {
    return { valid: [], rejectedCount: 0, corrupted: false };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { valid: [], rejectedCount: 0, corrupted: true };
  }

  if (!Array.isArray(parsed)) {
    return { valid: [], rejectedCount: 0, corrupted: true };
  }

  const valid: SyncOperation[] = [];
  const seen = new Set<string>();
  let rejectedCount = 0;

  for (const item of parsed) {
    const result = validateSyncOperation(item);
    if (!result.ok || seen.has(result.value.operationId)) {
      rejectedCount += 1; // inválido o duplicado de operationId
      continue;
    }
    seen.add(result.value.operationId);
    valid.push(result.value);
  }

  return { valid, rejectedCount, corrupted: false };
}