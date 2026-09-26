type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Cargando información..."
}: LoadingStateProps) {
  return (
    <section
      className="content-section"
      aria-live="polite"
      aria-busy="true"
    >
      <h2>Cargando</h2>
      <p>{message}</p>
    </section>
  );
}