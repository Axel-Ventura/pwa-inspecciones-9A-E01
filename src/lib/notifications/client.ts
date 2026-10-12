export type NotificationResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: string };

export async function requestNotificationPermission(): Promise<NotificationResult<NotificationPermission>> {
  if (typeof Notification === "undefined") {
    return {
      ok: false,
      reason: "Notification API is not supported in this browser.",
    };
  }

  if (Notification.permission === "granted") {
    return {
      ok: true,
      value: "granted",
    };
  }

  if (Notification.permission === "denied") {
    return {
      ok: false,
      reason: "Notification permission has been denied by the user.",
    };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return {
        ok: true,
        value: "granted",
      };
    }
    return {
      ok: false,
      reason: `Notification permission was not granted (status: ${permission}).`,
    };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "Error requesting notification permission.",
    };
  }
}

export function notifyChange(message: string): NotificationResult<void> {
  if (typeof Notification === "undefined") {
    return {
      ok: false,
      reason: "Notification API is not supported in this browser.",
    };
  }

  if (Notification.permission !== "granted") {
    return {
      ok: false,
      reason: "Notification permission is not granted.",
    };
  }

  try {
    new Notification(message);
    return {
      ok: true,
      value: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "Failed to trigger notification.",
    };
  }
}