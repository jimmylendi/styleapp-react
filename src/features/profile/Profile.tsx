import { useStore } from '../../lib/store';
import { assignPalette, STAR_PALETTES } from '../../lib/palettes';
import { BUILDS, SKINS } from '../../lib/data';
import { generateOutfits } from '../../lib/engine';
import type { StarPalette } from '../../lib/palettes';

export default function Profile() {
  const name = useStore((s) => s.name);
  const height = useStore((s) => s.height);
  const build = useStore((s) => s.build);
  const skin = useStore((s) => s.skin);
  const climate = useStore((s) => s.climate);
  const garments = useStore((s) => s.garments);
  const usedOutfits = useStore((s) => s.usedOutfits);
  const reset = useStore((s) => s.reset);

  const assignment = assignPalette(skin, 'neutro', build);

  const totalGarments = garments.length;
  const usedCount = usedOutfits.length;

  const usedIds = new Set<string>();
  usedOutfits.forEach((u) => {
    const outfits = generateOutfits(
      garments,
      u.occasion,
      {
        onboarded: true,
        name,
        height,
        heightUnit: 'metric',
        build,
        skin,
        climate
      },
      12
    );
    const o = outfits.find((x) => x.key === u.key);
    if (o) {
      [o.top, o.bottom, o.shoe, o.layer].filter(Boolean).forEach((p) => {
        if (p) usedIds.add(p.id);
      });
    }
  });

  const neverUsed = garments.filter((g) => !usedIds.has(g.id)).length;

  const achievements = [
    { id: 'first', icon: '🏆', title: 'Primer Paso', desc: 'Registraste tu primer outfit.', unlocked: usedOutfits.length >= 1 },
    { id: 'streak', icon: '🔥', title: 'Racha Constante', desc: 'Registraste al menos 5 outfits históricos.', unlocked: usedOutfits.length >= 5 },
    { id: 'collector', icon: '💎', title: 'Coleccionista', desc: 'Llegaste a más de 10 prendas en el Clóset.', unlocked: garments.length >= 10 },
    { id: 'critic', icon: '💅', title: 'Crítico de Moda', desc: 'Calificaste 3 outfits o más.', unlocked: usedOutfits.filter(u => u.rating).length >= 3 },
    { id: 'minimalist', icon: '🧘', title: 'Minimalista', desc: 'Usaste menos de 10 prendas únicas en múltiples días.', unlocked: usedIds.size <= 10 && usedOutfits.length >= 5 }
  ];

  const handleReset = () => {
    if (confirm('¿Borrar todo y empezar de nuevo?')) reset();
  };

  return (
    <div>
      <div className="ed-label" style={{ marginBottom: 12 }}>Yo</div>

      <h1 className="ed-title">{name || 'Tu perfil'}</h1>
      <p style={{ marginTop: 12, color: 'var(--ink-2)', fontSize: 13 }}>
        {BUILDS[build].name} · {(parseInt(height) / 100).toFixed(2)} m · {SKINS[skin].name}
      </p>

      <div className="me-stats" style={{ marginTop: 32 }}>
        <div className="me-stat">
          <div className="me-stat__value">{totalGarments}</div>
          <div className="me-stat__label">Prendas</div>
        </div>
        <div className="me-stat">
          <div className="me-stat__value">{usedCount}</div>
          <div className="me-stat__label">Outfits</div>
        </div>
        <div className="me-stat">
          <div
            className="me-stat__value"
            style={{ color: neverUsed > 3 ? 'var(--warn)' : 'inherit' }}
          >
            {neverUsed}
          </div>
          <div className="me-stat__label">Sin usar</div>
        </div>
      </div>

      <div className="me-section">
        <div className="me-section__title">🎨 Tu paleta asignada</div>

        <div className="palette-card">
          <div className="palette-card__head">
            <div>
              <div className="palette-card__num">
                Paleta #{assignment.main.num}
              </div>
              <div className="palette-card__name">
                {assignment.main.name}
              </div>
              <div className="palette-card__style">
                {assignment.main.style}
              </div>
            </div>
          </div>

          <div className="palette-card__colors">
            {assignment.main.colors.map((c: string, i: number) => (
              <div
                key={i}
                className="palette-card__swatch"
                style={{ background: c }}
              />
            ))}
          </div>

          <div className="palette-card__combo">
            {assignment.main.combination}
          </div>
        </div>

        <div className="me-section__title" style={{ marginTop: 24 }}>
          También te favorecen
        </div>

        {assignment.alternatives.map((p) => (
          <div key={p.id} className="palette-mini">
            <div className="palette-mini__colors">
              {p.colors.map((c: string, i: number) => (
                <div
                  key={i}
                  className="palette-mini__swatch"
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="palette-mini__name">
              {p.name}
              <span className="palette-mini__style">{p.style}</span>
            </div>
          </div>
        ))}

        {(skin === 'oscura' || skin === 'muy-oscura') && (
          <>
            <div className="me-section__title" style={{ marginTop: 24 }}>
              ★ Paletas estrella para tu piel
            </div>
            {STAR_PALETTES.map((sp: StarPalette) => (
              <div key={sp.id} className="palette-mini palette-mini--star">
                <div className="palette-mini__colors">
                  {sp.colors.map((c: string, i: number) => (
                    <div
                      key={i}
                      className="palette-mini__swatch"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <div className="palette-mini__name">
                  {sp.name}
                  <span className="palette-mini__style">{sp.bestFor}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="section" style={{ marginTop: 40 }}>
        <h3 className="section-title">Logros Desbloqueados</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
          {achievements.map(a => (
            <div key={a.id} style={{
              background: a.unlocked ? 'var(--surface-3)' : 'var(--surface-2)',
              opacity: a.unlocked ? 1 : 0.4,
              padding: 16,
              borderRadius: 'var(--r-md)',
              textAlign: 'center',
              border: a.unlocked ? '1px solid var(--accent)' : '1px solid transparent',
              boxShadow: a.unlocked ? '0 0 16px rgba(var(--accent-rgb), 0.1)' : 'none'
            }}>
              <div style={{ fontSize: 32, marginBottom: 8, filter: a.unlocked ? 'none' : 'grayscale(1)' }}>{a.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: a.unlocked ? 'var(--ink)' : 'var(--ink-2)' }}>{a.title}</div>
              <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 4 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
        <h3 className="section-title" style={{ color: 'var(--danger)', marginBottom: 12 }}>
          Zona de Peligro
        </h3>
        <button className="btn btn-secondary" onClick={handleReset} style={{ width: '100%' }}>
          Reiniciar app
        </button>
      </div>
    </div>
  );
}