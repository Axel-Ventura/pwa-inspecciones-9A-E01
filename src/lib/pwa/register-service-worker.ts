export function registerServiceWorker(): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!("serviceWorker" in navigator)) {
    console.warn("Service Worker no disponible en este navegador.");
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.info(
          "Service Worker registrado correctamente:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Error al registrar el Service Worker:", error);
      });
  });
}