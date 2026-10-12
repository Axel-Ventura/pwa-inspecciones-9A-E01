export type CapabilityResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: string };

export async function requestCamera(): Promise<CapabilityResult<MediaStream>> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return { ok: false, reason: "Camera API not available." };
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    return { ok: true, value: stream };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "Camera access denied.",
    };
  }
}