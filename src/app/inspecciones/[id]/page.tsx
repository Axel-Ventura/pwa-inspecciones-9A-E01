import Link from "next/link";
import { inspections } from "../../../lib/data/inspections";

type InspectionDetailPageProps = {
  params: {
    id: string;
  };
};

export default function InspectionDetailPage({
  params
}: InspectionDetailPageProps) {
  const inspection = inspections.find(
    (item) => item.id === params.id
  );

  if (!inspection) {
    return (
      <section className="content-section" role="alert">
        <p className="eyebrow">Error</p>

        <h1>Inspección no encontrada</h1>

        <p>
          No existe una inspección registrada con el identificador solicitado.
        </p>

        <p>
          <Link href="/inspecciones">
            ← Volver a inspecciones
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="content-section">
      <p className="eyebrow">Renderizado del lado del servidor</p>

      <div className="section-heading">
        <div>
          <h1>{inspection.location}</h1>
          <p>{inspection.summary}</p>
        </div>

        <span className={`badge badge-${inspection.status}`}>
          {inspection.statusLabel}
        </span>
      </div>

      <article className="inspection-card">
        <dl>
          <div>
            <dt>ID de inspección</dt>
            <dd>{inspection.id}</dd>
          </div>

          <div>
            <dt>Fecha</dt>
            <dd>{inspection.date}</dd>
          </div>

          <div>
            <dt>Responsable</dt>
            <dd>{inspection.inspector}</dd>
          </div>

          <div>
            <dt>Hallazgos</dt>
            <dd>{inspection.findings}</dd>
          </div>

          <div>
            <dt>Estado</dt>
            <dd>{inspection.statusLabel}</dd>
          </div>
        </dl>

        <p>
          <Link href="/inspecciones">
            ← Volver a inspecciones
          </Link>
        </p>
      </article>
    </section>
  );
}