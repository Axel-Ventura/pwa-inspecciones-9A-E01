"use client";

import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="app-brand" href="/">
          Inspecciones de laboratorio
        </a>

        <nav aria-label="Navegación principal">
          <ul className="app-nav">
            <li>
              <a href="/">Inicio</a>
            </li>
            <li>
              <a href="#inspections-heading">Inspecciones</a>
            </li>
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}