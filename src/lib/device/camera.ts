export type CapabilityResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      reason: string;
    };

// Nunca lanza errores: siempre devuelve éxito o un fallback controlado.
export async function requestCamera(): Promise<CapabilityResult<MediaStream>> {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices ||
    typeof navigator.mediaDevices.getUserMedia !== "function"
  ) {
    return {
      ok: false,
      reason: "La cámara no está disponible en este navegador."
    };
  }

  try {
    // Se pide solo video, nunca audio.
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    return { ok: true, value: stream };
  } catch (error: unknown) {
    const errorName =
      typeof error === "object" && error !== null && "name" in error
        ? String((error as { name: unknown }).name)
        : "";

    if (errorName === "NotAllowedError") {
      return {
        ok: false,
        reason: "El usuario no permitió el acceso a la cámara."
      };
    }

    return {
      ok: false,
      reason: "No fue posible usar la cámara del dispositivo."
    };
  }
}