export type CapabilityResult<T> = { ok: true; value: T } | { ok: false; reason: string };

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export async function getCurrentLocation(): Promise<CapabilityResult<Coordinates>> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return { ok: false, reason: "Geolocation API not available." };
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          ok: true,
          value: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
        });
      },
      (err) => resolve({ ok: false, reason: err.message })
    );
  });
}
