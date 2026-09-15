import { useStore } from '../../lib/store';

export default function Closet() {
  const garments = useStore((s) => s.garments);

  return (
    <div>
      <div className="ed-label" style={{ marginBottom: 12 }}>Clóset</div>
      <h1 className="ed-title">Mis prendas</h1>
      <p style={{ marginTop: 16, color: 'var(--ink-2)' }}>
        {garments.length === 0
          ? 'Aún no tienes prendas. Añade las primeras.'
          : `${garments.length} prendas registradas`}
      </p>
    </div>
  );
}