export type CapabilityResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      reason: string;
    };

type Location = {
  latitude: number;
  longitude: number;
};

// Tiempo máximo de espera para obtener la ubicación (en milisegundos).
const LOCATION_TIMEOUT_MS = 10000;

// Códigos de error que define el navegador.
const PERMISSION_DENIED = 1;
const TIMEOUT = 3;

// Nunca lanza errores: siempre devuelve éxito o un fallback controlado.
export function getCurrentLocation(): Promise<CapabilityResult<Location>> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({
        ok: false,
        reason: "La ubicación no está disponible en este navegador."
      });
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Por privacidad, solo se devuelven latitud y longitud.
          resolve({
            ok: true,
            value: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          });
        },
        (error) => {
          if (error.code === PERMISSION_DENIED) {
            resolve({
              ok: false,
              reason: "El usuario no permitió el acceso a la ubicación."
            });
            return;
          }

          if (error.code === TIMEOUT) {
            resolve({
              ok: false,
              reason: "Se agotó el tiempo de espera para obtener la ubicación."
            });
            return;
          }

          resolve({
            ok: false,
            reason: "No fue posible obtener la ubicación del dispositivo."
          });
        },
        {
          timeout: LOCATION_TIMEOUT_MS,
          maximumAge: 0,
          enableHighAccuracy: false
        }
      );
    } catch {
      resolve({
        ok: false,
        reason: "No fue posible obtener la ubicación del dispositivo."
      });
    }
  });
}