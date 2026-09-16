import { useMemo, useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { generateOutfits } from '../../lib/engine';
import { OCCASIONS } from '../../lib/data';
import type { OccasionId, Outfit } from '../../types';
import Oracle from './Oracle';
import { fetchLiveWeather, type LiveWeather } from '../../lib/weather';
import { compressImage } from '../../lib/image';

export default function Today() {
  /* ── Store (all primitive selectors for referential stability) ── */
  const name = useStore((s) => s.name);
  const garments = useStore((s) => s.garments);
  const occasion = useStore((s) => s.occasion);
  const setOcc = useStore((s) => s.setOccasion);
  const markUsed = useStore((s) => s.useOutfit);
  const height = useStore((s) => s.height);
  const hUnit = useStore((s) => s.heightUnit);
  const build = useStore((s) => s.build);
  const skin = useStore((s) => s.skin);
  const climate = useStore((s) => s.climate);
  const usedOutfits = useStore((s) => s.usedOutfits);

  /* ── Local state ── */
  const [seed, setSeed] = useState(0);
  const [used, setUsed] = useState(false);
  const [liveWeather, setLiveWeather] = useState<LiveWeather | null>(null);

  useEffect(() => {
    fetchLiveWeather().then(setLiveWeather).catch(() => { });
  }, []);

  /* ── Stable garment count (primitive) for dep tracking ── */
  const gLen = garments.length;
  const uLen = usedOutfits.length;

  /*
   * ★ KEY FIX: all deps are PRIMITIVES (string | number).
   * This guarantees useMemo never sees a "new" dep on each render.
   * generateOutfits uses Math.random() internally — without memo
   * it creates new objects each render ➜ Zustand detects "change" ➜
   * re-render ➜ infinite loop ➜ freeze.
   */
  const outfits: Outfit[] = useMemo(() => {
    if (gLen === 0) return [];

    const activeClimate = liveWeather ? liveWeather.climate : climate;
    const profile = { onboarded: true, name, height, heightUnit: hUnit, build, skin, climate: activeClimate };

    return generateOutfits(garments, occasion, profile, 3, usedOutfits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gLen, occasion, name, height, hUnit, build, skin, climate, seed, uLen, liveWeather]);

  const hero = outfits[0] ?? null;
  const occMeta = OCCASIONS.find((o) => o.id === occasion);

  const handleUse = (imageUrl?: string) => {
    if (!hero) return;
    markUsed(hero.key, imageUrl);
    setUsed(true);
  };

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImage(file, 400);
      handleUse(base64);
    } catch (err) {
      console.error(err);
      alert("Hubo un error al guardar la foto.");
    }
  };

  const handleRegen = () => {
    setSeed((s) => s + 1);
    setUsed(false);
  };

  /* ── Greeting ── */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  const hasEnough =
    garments.some((g) => g.cat === 'top') &&
    garments.some((g) => g.cat === 'bottom') &&
    garments.some((g) => g.cat === 'shoes');

  return (
    <div>
      <div className="ed-label" style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
        <span>{greeting}</span>
        {liveWeather && (
          <span style={{ color: 'var(--accent)' }}>
            {liveWeather.isDay ? '☀️' : '🌙'} {liveWeather.tempC}°C ({liveWeather.climate === 'calido' ? 'Clima cálido' : 'Clima frío'})
          </span>
        )}
      </div>
      <h1 className="ed-title">{name || 'Tu outfit'}</h1>

      {/* Occasion chips */}
      <div className="chips chips--scroll" style={{ marginTop: 20, marginBottom: 24 }}>
        {OCCASIONS.map((o) => (
          <button
            key={o.id}
            className={`chip ${occasion === o.id ? 'is-active' : ''}`}
            onClick={() => {
              setOcc(o.id as OccasionId);
              setUsed(false);
            }}
          >
            {o.emoji} {o.name}
          </button>
        ))}
      </div>

      {/* ── Empty states ── */}
      {!hasEnough && (
        <div className="empty">
          <div className="empty__icon">👔</div>
          <div className="empty__title">Agrega tus prendas</div>
          <div className="empty__sub">
            Necesitas al menos 1 prenda superior, 1 pantalón y 1 calzado para
            generar combinaciones.
          </div>
        </div>
      )}

      {hasEnough && !hero && (
        <div className="empty">
          <div className="empty__icon">🤔</div>
          <div className="empty__title">Sin combinaciones</div>
          <div className="empty__sub">
            No encontré outfits para {occMeta?.name ?? 'esta ocasión'} con tus
            prendas. Prueba otra ocasión o agrega más prendas.
          </div>
        </div>
      )}

      {/* ── Outfit hero ── */}
      {hero && (
        <div className="outfit-hero">
          <div className="outfit-hero__label">
            {occMeta?.emoji} Outfit para {occMeta?.name}
          </div>

          <div className="outfit-hero__pieces">
            {([hero.top, hero.layer, hero.bottom, hero.shoe] as const)
              .filter(Boolean)
              .map((piece) => (
                <div key={piece!.id} className="outfit-hero__piece">
                  <div
                    className="outfit-hero__dot"
                    style={{ background: piece!.colorHex }}
                  />
                  <span>{piece!.name}</span>
                </div>
              ))}
          </div>

          <div className="outfit-hero__reason">
            {([hero.top, hero.layer, hero.bottom, hero.shoe] as const).filter(Boolean).length} piezas · Score{' '}
            {hero.score} ·{' '}
            {hero.score >= 10
              ? 'Combinación excelente'
              : hero.score >= 6
                ? 'Buena combinación'
                : 'Combinación correcta'}
          </div>

          <div className="outfit-hero__actions" style={{ flexDirection: 'column', gap: 12 }}>
            {!used ? (
              <>
                <label className="btn btn-primary" style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
                  📸 Selfie de mi Outfit (Guardar)
                  <input type="file" accept="image/*" capture="user" style={{ position: 'absolute', opacity: 0, inset: 0, cursor: 'pointer' }} onChange={handlePhotoCapture} />
                </label>
                <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                  <button className="btn btn-secondary" onClick={() => handleUse()} style={{ flex: 1, fontSize: 13 }}>
                    Solo confirmar (Sin foto)
                  </button>
                  <button className="btn btn-secondary" onClick={handleRegen} style={{ width: 56 }}>
                    ↻
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: 16, borderRadius: 'var(--r-md)', background: 'rgba(26, 224, 95, 0.1)', color: 'var(--success)', fontWeight: 800, textAlign: 'center' }}>
                ¡Outfit Registrado en el Historial!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Alternativas ── */}
      {outfits.length > 1 && (
        <div style={{ marginTop: 24 }}>
          <div className="ed-label" style={{ marginBottom: 12 }}>
            Otras opciones
          </div>
          <div className="outfit-grid">
            {outfits.slice(1).map((o, i) => (
              <div key={o.key || i} className="outfit-card">
                <div className="outfit-card__pieces">
                  {([o.top, o.layer, o.bottom, o.shoe] as const)
                    .filter(Boolean)
                    .map((p) => (
                      <div key={p!.id} className="outfit-card__piece">
                        <div
                          className="outfit-card__dot"
                          style={{ background: p!.colorHex }}
                        />
                        <span>{p!.name}</span>
                      </div>
                    ))}
                </div>
                <div className="outfit-card__meta">
                  Score {o.score} ·{' '}
                  {([o.top, o.layer, o.bottom, o.shoe] as const).filter(Boolean).length} piezas
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AI Oracle Section ── */}
      <Oracle />
    </div>
  );
}