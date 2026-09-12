import { inspections } from "../lib/data/inspections";

type InspectionState = "loading" | "error" | "empty" | "ready";

const state: InspectionState = "ready";

function InspectionContent() {
  if (state === "loading") {
    return (
      <section aria-live="polite" className="content-section">
        <h2>Cargando inspecciones</h2>
        <p>Preparando los registros de inspección...</p>
      </section>
    );
  }

  if (state === "error") {
    return (
      <section role="alert" className="content-section">
        <h2>No fue posible cargar las inspecciones</h2>
        <p>Intenta nuevamente más tarde.</p>
      </section>
    );
  }

  if (state === "empty") {
    return (
      <section aria-live="polite" className="content-section">
        <h2>No hay inspecciones registradas</h2>
        <p>No existen registros para mostrar actualmente.</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="inspections-heading"
      className="content-section"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">Datos de demostración</p>
          <h2 id="inspections-heading">Inspecciones recientes</h2>
        </div>

        <span className="count">{inspections.length} registros</span>
      </div>

      <div className="inspection-grid">
        {inspections.map((inspection) => (
          <article className="inspection-card" key={inspection.id}>
            <div className="card-topline">
              <span className={`badge badge-${inspection.status}`}>
                {inspection.statusLabel}
              </span>

              <span className="muted">{inspection.date}</span>
            </div>

            <h3>{inspection.location}</h3>

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
          </article>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <header className="hero">
        <p className="eyebrow">Proyecto base · Semana 2</p>

        <h1>Inspecciones de laboratorio</h1>

        <p className="lead">
          Registro de mantenimiento para trabajar con conectividad intermitente.
          Los datos mostrados son sintéticos.
        </p>

        <span className="status">
          Estado del shell: instalado y navegable
        </span>
      </header>

      <InspectionContent />

      <footer className="footer">
        <p>
          Aplicaciones Web Progresivas · Universidad Tecnológica de Tehuacán
        </p>
      </footer>
    </>
  );
}