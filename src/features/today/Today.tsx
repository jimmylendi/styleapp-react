import { useStore } from '../../lib/store';

export default function Today() {
  const name = useStore((s) => s.name);

  return (
    <div>
      <div className="ed-label" style={{ marginBottom: 12 }}>Hoy</div>
      <h1 className="ed-title">
        ¿Qué te vas<br />a poner{name ? `, ${name}` : ''}?
      </h1>
      <p style={{ marginTop: 16, color: 'var(--ink-2)' }}>
        Aquí aparecerá tu outfit del día.
      </p>
    </div>
  );
}