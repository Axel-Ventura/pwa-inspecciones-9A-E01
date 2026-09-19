import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "../components/app-shell";
import { ServiceWorkerRegister } from "../lib/pwa/service-worker-register";

export const metadata: Metadata = {
  title: "Inspecciones de laboratorio",
  description: "Aplicación para registrar inspecciones de mantenimiento de laboratorios",
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body>
        <AppShell>{children}</AppShell>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}