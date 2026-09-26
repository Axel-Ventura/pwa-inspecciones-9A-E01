"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { inspections, type InspectionStatus } from "../../lib/data/inspections";
import { LoadingState } from "../../components/loading-state";

type Filter = "all" | InspectionStatus;

export default function InspeccionesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => window.clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingState message="Preparando las inspecciones..." />;
  }

  if (error) {
    return (
      <section className="content-section" role="alert">
        <h2>No fue posible cargar las inspecciones</h2>
        <p>Intenta nuevamente más tarde.</p>
        <button type="button" onClick={() => setError(false)}>
          Reintentar
        </button>
      </section>
    );
  }

  const filteredInspections =
    filter === "all"
      ? inspections
      : inspections.filter((inspection) => inspection.status === filter);

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Renderizado del lado del cliente</p>
          <h1>Inspecciones</h1>
        </div>

        <span className="count">
          {filteredInspections.length} registros
        </span>
      </div>

      <div
        role="group"
        aria-label="Filtrar inspecciones"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "24px",
          flexWrap: "wrap"
        }}
      >
        <button
          type="button"
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
        >
          Todas
        </button>

        <button
          type="button"
          onClick={() => setFilter("ok")}
          aria-pressed={filter === "ok"}
        >
          Sin incidencias
        </button>

        <button
          type="button"
          onClick={() => setFilter("attention")}
          aria-pressed={filter === "attention"}
        >
          Requieren atención
        </button>
      </div>

      {filteredInspections.length === 0 ? (
        <section aria-live="polite" className="content-section">
          <h2>No hay inspecciones</h2>
          <p>No existen registros para el filtro seleccionado.</p>
        </section>
      ) : (
        <div className="inspection-grid">
          {filteredInspections.map((inspection) => (
            <article className="inspection-card" key={inspection.id}>
              <div className="card-topline">
                <span className={`badge badge-${inspection.status}`}>
                  {inspection.statusLabel}
                </span>

                <span className="muted">{inspection.date}</span>
              </div>

              <h2>{inspection.location}</h2>

              <p>{inspection.summary}</p>

              <dl>
                <div>
                  <dt>Responsable</dt>
                  <dd>{inspection.inspector}</dd>
                </div>

                <div>
                  <dt>Hallazgos</dt>
                  <dd>{inspection.findings}</dd>
                </div>
              </dl>

              <p>
                <Link href={`/inspecciones/${inspection.id}`}>
                  Ver detalle
                </Link>
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}