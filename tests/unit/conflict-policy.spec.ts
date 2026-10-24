import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { resolveConflict } from "../../src/lib/sync/conflict-policy";
import { createOperation } from "../helpers/test-utils";

describe("resolveConflict (unitaria)", () => {
  test("conserva la versión local cuando es más reciente", () => {
    const local = createOperation({
      version: 2,
      payload: { location: "Laboratorio de Redes", status: "attention" }
    });
    const remote = createOperation({
      version: 1,
      payload: { location: "Laboratorio de Redes", status: "ok" }
    });

    const result = resolveConflict(local, remote);

    assert.equal(result, local);
    assert.equal(result.version, 2);
  });

  test("conserva la versión remota cuando es más reciente", () => {
    const local = createOperation({
      version: 1,
      payload: { location: "Laboratorio de Redes", status: "ok" }
    });
    const remote = createOperation({
      version: 3,
      payload: { location: "Laboratorio de Redes", status: "attention" }
    });

    const result = resolveConflict(local, remote);

    assert.equal(result, remote);
    assert.equal(result.version, 3);
  });

  test("con versiones iguales gana la local", () => {
    const local = createOperation({
      version: 2,
      payload: { location: "Laboratorio de Redes", status: "local" }
    });
    const remote = createOperation({
      version: 2,
      payload: { location: "Laboratorio de Redes", status: "remote" }
    });

    const result = resolveConflict(local, remote);

    assert.equal(result, local);
  });

  test("una respuesta antigua no sobrescribe una versión más reciente", () => {
    const current = createOperation({
      version: 3,
      payload: { location: "Laboratorio de Redes", status: "attention" }
    });
    const oldResponse = createOperation({
      version: 2,
      payload: { location: "Laboratorio de Redes", status: "ok" }
    });

    // La respuesta antigua llega como "remota"...
    assert.equal(resolveConflict(current, oldResponse), current);
    // ...y también cuando llega en la posición de "local".
    assert.equal(resolveConflict(oldResponse, current), current);
  });

  test("no modifica las operaciones que recibe", () => {
    const local = createOperation({ version: 1 });
    const remote = createOperation({ version: 2 });
    const localBefore = structuredClone(local);
    const remoteBefore = structuredClone(remote);

    resolveConflict(local, remote);

    assert.deepEqual(local, localBefore);
    assert.deepEqual(remote, remoteBefore);
  });
});