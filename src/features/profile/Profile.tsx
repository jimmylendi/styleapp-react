import { useStore } from '../../lib/store';

export default function Profile() {
  const name = useStore((s) => s.name);
  const build = useStore((s) => s.build);
  const skin = useStore((s) => s.skin);

  return (
    <div>
      <div className="ed-label" style={{ marginBottom: 12 }}>Yo</div>
      <h1 className="ed-title">{name || 'Tu perfil'}</h1>
      <p style={{ marginTop: 16, color: 'var(--ink-2)' }}>
        {build} · {skin}
      </p>
    </div>
  );
}