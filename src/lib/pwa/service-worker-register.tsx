"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "./register-service-worker";

export function ServiceWorkerRegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}