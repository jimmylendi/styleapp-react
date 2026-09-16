import { useMemo, useState } from 'react';
import { useStore } from '../../lib/store';
import { generateOutfits } from '../../lib/engine';
import { OCCASIONS } from '../../lib/data';
import type { OccasionId } from '../../types';

export default function Outfits() {
  /* ── Store (primitive selectors) ── */
  const garments = useStore((s) => s.garments);
  const occasion = useStore((s) => s.occasion);
  const setOcc = useStore((s) => s.setOccasion);
  const markUsed = useStore((s) => s.useOutfit);
  const height = useStore((s) => s.height);
  const hUnit = useStore((s) => s.heightUnit);
  const build = useStore((s) => s.build);
  const skin = useStore((s) => s.skin);
  const climate = useStore((s) => s.climate);
  const name = useStore((s) => s.name);

  const [seed, setSeed] = useState(0);
  const [usedKeys, setUsedKeys] = useState<Set<string>>(new Set());

  const gLen = garments.length;

  const outfits = useMemo(() => {
    if (gLen === 0) return [];
    const profile = { onboarded: true, name, height, heightUnit: hUnit, build, skin, climate };
    return generateOutfits(garments, occasion, profile, 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gLen, occasion, name, height, hUnit, build, skin, climate, seed]);

  const occMeta = OCCASIONS.find((o) => o.id === occasion);

  const hasEnough =
    garments.some((g) => g.cat === 'top') &&
    garments.some((g) => g.cat === 'bottom') &&
    garments.some((g) => g.cat === 'shoes');

  const handleUse = (key: string) => {
    markUsed(key);
    setUsedKeys((prev) => new Set(prev).add(key));
  };

  return (
    <div>
      <div className="ed-label" style={{ marginBottom: 12 }}>Outfits</div>
      <h1 className="ed-title">Combinaciones</h1>

      {/* Occasion selector */}
      <div className="chips chips--scroll" style={{ marginTop: 20, marginBottom: 24 }}>
        {OCCASIONS.map((o) => (
          <button
            key={o.id}
            className={`chip ${occasion === o.id ? 'is-active' : ''}`}
            onClick={() => setOcc(o.id as OccasionId)}
          >
            {o.emoji} {o.name}
          </button>
        ))}
      </div>

      {/* Regen */}
      {hasEnough && outfits.length > 0 && (
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>
            {outfits.length} combinaciones para {occMeta?.name}
          </span>
          <button
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: 13 }}
            onClick={() => setSeed((s) => s + 1)}
          >
            ↻ Nuevas
          </button>
        </div>
      )}

      {/* Empty states */}
      {!hasEnough && (
        <div className="empty">
          <div className="empty__icon">◇</div>
          <div className="empty__title">Agrega prendas primero</div>
          <div className="empty__sub">
            Necesitas mínimo 1 superior, 1 pantalón y 1 calzado.
          </div>
        </div>
      )}

      {hasEnough && outfits.length === 0 && (
        <div className="empty">
          <div className="empty__icon">🤔</div>
          <div className="empty__title">Sin combinaciones</div>
          <div className="empty__sub">
            Prueba otra ocasión o agrega más prendas.
          </div>
        </div>
      )}

      {/* Outfit grid */}
      {outfits.length > 0 && (
        <div className="outfit-grid">
          {outfits.map((o, i) => {
            const pieces = ([o.top, o.layer, o.bottom, o.shoe] as const).filter(Boolean);
            const wasUsed = usedKeys.has(o.key);
            return (
              <div key={o.key || i} className="outfit-card">
                <div className="outfit-card__rank">#{i + 1}</div>
                <div className="outfit-card__pieces">
                  {pieces.map((p) => (
                    <div key={p!.id} className="outfit-card__piece">
                      <div
                        className="outfit-card__dot"
                        style={{ background: p!.colorHex }}
                      />
                      <span>{p!.name}</span>
                    </div>
                  ))}
                </div>
                <div className="outfit-card__footer">
                  <div className="outfit-card__meta">
                    Score {o.score} · {pieces.length} piezas
                  </div>
                  <button
                    className={`btn ${wasUsed ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ padding: '8px 14px', fontSize: 12 }}
                    onClick={() => handleUse(o.key)}
                    disabled={wasUsed}
                  >
                    {wasUsed ? '✓ Usado' : 'Usar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}