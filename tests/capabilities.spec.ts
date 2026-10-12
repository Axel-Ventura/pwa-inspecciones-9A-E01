import assert from "node:assert/strict";
import { requestCamera } from "../src/lib/device/camera";
import { getCurrentLocation } from "../src/lib/device/geolocation";
import {
  notifyChange,
  requestNotificationPermission
} from "../src/lib/notifications/client";

type CapabilityResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      reason: string;
    };

function assertSuccess<T>(
  result: CapabilityResult<T>,
  message: string
): asserts result is { ok: true; value: T } {
  assert.equal(result.ok, true, message);
}

function assertFailure<T>(
  result: CapabilityResult<T>,
  message: string
): asserts result is { ok: false; reason: string } {
  assert.equal(result.ok, false, message);
  assert.ok(result.reason.length > 0);
}

async function runTest(
  name: string,
  callback: () => void | Promise<void>
): Promise<void> {
  try {
    await callback();
    console.log(`✓ ${name}: PASS`);
  } catch (error) {
    console.error(`✗ ${name}: FAIL`);

    if (error instanceof Error) {
      console.error(`  Error: ${error.message}`);
      console.error(`  Stack: ${error.stack}`);
    } else {
      console.error("  Error:", error);
    }

    throw error;
  }
}

function setNavigator(value: unknown): void {
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    writable: true,
    value
  });
}

function setNotification(value: unknown): void {
  Object.defineProperty(globalThis, "Notification", {
    configurable: true,
    writable: true,
    value
  });
}

async function main(): Promise<void> {
  /*
   * ============================================================
   * CÁMARA
   * ============================================================
   */

  await runTest(
    "Cámara: API no disponible produce fallback controlado",
    async () => {
      const originalNavigator = globalThis.navigator;

      setNavigator({});

      const result = await requestCamera();

      assertFailure(
        result,
        "La cámara debe devolver fallback si la API no está disponible."
      );

      setNavigator(originalNavigator);
    }
  );

  await runTest(
    "Cámara: acceso concedido devuelve el MediaStream",
    async () => {
      const originalNavigator = globalThis.navigator;

      let requested = false;

      const fakeStream = {
        getTracks: () => []
      } as unknown as MediaStream;

      setNavigator({
        mediaDevices: {
          getUserMedia: async () => {
            requested = true;
            return fakeStream;
          }
        }
      });

      const result = await requestCamera();

      assert.equal(
        requested,
        true,
        "La implementación debe solicitar la cámara únicamente al invocar la función."
      );

      assertSuccess(
        result,
        "La cámara debe devolver éxito cuando getUserMedia funciona."
      );

      assert.equal(result.value, fakeStream);

      setNavigator(originalNavigator);
    }
  );

  await runTest(
    "Cámara: permiso rechazado produce fallback",
    async () => {
      const originalNavigator = globalThis.navigator;

      setNavigator({
        mediaDevices: {
          getUserMedia: async () => {
            throw new DOMException(
              "Permiso rechazado",
              "NotAllowedError"
            );
          }
        }
      });

      const result = await requestCamera();

      assertFailure(
        result,
        "El rechazo del permiso de cámara debe manejarse sin romper la aplicación."
      );

      setNavigator(originalNavigator);
    }
  );

  await runTest(
    "Cámara: error del dispositivo produce fallback",
    async () => {
      const originalNavigator = globalThis.navigator;

      setNavigator({
        mediaDevices: {
          getUserMedia: async () => {
            throw new Error("Cámara no disponible");
          }
        }
      });

      const result = await requestCamera();

      assertFailure(
        result,
        "Un error del dispositivo debe convertirse en un resultado controlado."
      );

      setNavigator(originalNavigator);
    }
  );

  /*
   * ============================================================
   * GEOLOCALIZACIÓN
   * ============================================================
   */

  await runTest(
    "Geolocalización: API no disponible produce fallback",
    async () => {
      const originalNavigator = globalThis.navigator;

      setNavigator({});

      const result = await getCurrentLocation();

      assertFailure(
        result,
        "La geolocalización debe devolver fallback si la API no existe."
      );

      setNavigator(originalNavigator);
    }
  );

  await runTest(
    "Geolocalización: devuelve únicamente latitud y longitud",
    async () => {
      const originalNavigator = globalThis.navigator;

      setNavigator({
        geolocation: {
          getCurrentPosition: (
            success: (position: {
              coords: {
                latitude: number;
                longitude: number;
              };
            }) => void
          ) => {
            success({
              coords: {
                latitude: 10.123456,
                longitude: -20.654321
              }
            });
          }
        }
      });

      const result = await getCurrentLocation();

      assertSuccess(
        result,
        "La geolocalización debe devolver la posición cuando está disponible."
      );

      assert.deepEqual(result.value, {
        latitude: 10.123456,
        longitude: -20.654321
      });

      assert.deepEqual(
        Object.keys(result.value).sort(),
        ["latitude", "longitude"]
      );

      setNavigator(originalNavigator);
    }
  );

  await runTest(
    "Geolocalización: error de permiso produce fallback",
    async () => {
      const originalNavigator = globalThis.navigator;

      setNavigator({
        geolocation: {
          getCurrentPosition: (
            _success: unknown,
            error: (positionError: {
              code: number;
              message: string;
            }) => void
          ) => {
            error({
              code: 1,
              message: "Permiso denegado"
            });
          }
        }
      });

      const result = await getCurrentLocation();

      assertFailure(
        result,
        "El rechazo de ubicación debe producir un fallback controlado."
      );

      setNavigator(originalNavigator);
    }
  );

  await runTest(
    "Geolocalización: timeout produce fallback",
    async () => {
      const originalNavigator = globalThis.navigator;

      setNavigator({
        geolocation: {
          getCurrentPosition: (
            _success: unknown,
            error: (positionError: {
              code: number;
              message: string;
            }) => void
          ) => {
            error({
              code: 3,
              message: "Tiempo de espera agotado"
            });
          }
        }
      });

      const result = await getCurrentLocation();

      assertFailure(
        result,
        "Un timeout de geolocalización debe producir fallback."
      );

      setNavigator(originalNavigator);
    }
  );

  /*
   * ============================================================
   * NOTIFICACIONES
   * ============================================================
   */

  await runTest(
    "Notificaciones: API no disponible produce fallback",
    async () => {
      const originalNotification = globalThis.Notification;

      setNotification(undefined);

      const result = await requestNotificationPermission();

      assertFailure(
        result,
        "Las notificaciones deben devolver fallback si la API no existe."
      );

      setNotification(originalNotification);
    }
  );

  await runTest(
    "Notificaciones: permiso ya concedido se reconoce correctamente",
    async () => {
      const originalNotification = globalThis.Notification;

      class FakeNotification {
        static permission: NotificationPermission = "granted";
      }

      setNotification(FakeNotification);

      const result = await requestNotificationPermission();

      assertSuccess(
        result,
        "Un permiso concedido debe producir un resultado exitoso."
      );

      assert.equal(result.value, "granted");

      setNotification(originalNotification);
    }
  );

  await runTest(
    "Notificaciones: permiso denegado produce fallback",
    async () => {
      const originalNotification = globalThis.Notification;

      class FakeNotification {
        static permission: NotificationPermission = "denied";
      }

      setNotification(FakeNotification);

      const result = await requestNotificationPermission();

      assertFailure(
        result,
        "Un permiso denegado debe producir un fallback."
      );

      setNotification(originalNotification);
    }
  );

  await runTest(
    "Notificaciones: permiso default solicita autorización",
    async () => {
      const originalNotification = globalThis.Notification;

      let requested = false;

      class FakeNotification {
        static permission: NotificationPermission = "default";

        static async requestPermission(): Promise<NotificationPermission> {
          requested = true;
          return "granted";
        }
      }

      setNotification(FakeNotification);

      const result = await requestNotificationPermission();

      assert.equal(
        requested,
        true,
        "La aplicación debe solicitar permiso cuando el estado es default."
      );

      assertSuccess(
        result,
        "El permiso concedido después de solicitarlo debe producir éxito."
      );

      assert.equal(result.value, "granted");

      setNotification(originalNotification);
    }
  );

  await runTest(
    "Notificaciones: muestra cambio cuando el permiso está concedido",
    async () => {
      const originalNotification = globalThis.Notification;

      let notificationMessage = "";

      class FakeNotification {
        static permission: NotificationPermission = "granted";

        constructor(message: string) {
          notificationMessage = message;
        }
      }

      setNotification(FakeNotification);

      const result = await notifyChange("Inspección actualizada");

      assertSuccess(
        result,
        "Debe mostrarse la notificación cuando el permiso está concedido."
      );

      assert.equal(
        notificationMessage,
        "Inspección actualizada"
      );

      setNotification(originalNotification);
    }
  );

  await runTest(
    "Notificaciones: permiso denegado evita crear la notificación",
    async () => {
      const originalNotification = globalThis.Notification;

      let created = false;

      class FakeNotification {
        static permission: NotificationPermission = "denied";

        constructor(_message: string) {
          created = true;
        }
      }

      setNotification(FakeNotification);

      const result = await notifyChange("Cambio de inspección");

      assertFailure(
        result,
        "No debe crearse una notificación con permiso denegado."
      );

      assert.equal(
        created,
        false,
        "La implementación no debe intentar crear una notificación bloqueada."
      );

      setNotification(originalNotification);
    }
  );

  await runTest(
    "Notificaciones: API inexistente evita romper el flujo",
    async () => {
      const originalNotification = globalThis.Notification;

      setNotification(undefined);

      const result = await notifyChange("Cambio de inspección");

      assertFailure(
        result,
        "La ausencia de Notification debe producir fallback."
      );

      setNotification(originalNotification);
    }
  );

  console.log("\nWeek 6 capabilities: todas las pruebas pasaron.");
}

main().catch(() => {
  process.exitCode = 1;
});