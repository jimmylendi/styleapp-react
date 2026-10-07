import { useMemo, useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { generateOutfits } from '../../lib/engine';
import { OCCASIONS } from '../../lib/data';
import {
  IconCamera,
  IconShare,
  IconRefresh,
  IconSun,
  IconMoon,
  IconCheck,
  IconTop,
  IconBottom,
  IconLayer,
  IconShoes,
  IconStar,
  IconCloset,
  IconCube,
  IconLightning,
  IconSparkles
} from '../../components/Icons';
import type { OccasionId, Outfit } from '../../types';
import Oracle from './Oracle';
import ShareCard from './ShareCard';
import { AvatarMannequin } from '../../components/AvatarMannequin';
import { AvatarCustomizer } from '../../components/AvatarCustomizer';
import { fetchLiveWeather, type LiveWeather } from '../../lib/weather';
import { compressImage } from '../../lib/image';
import { calculateOutfitIQ, autoOptimizeOutfit, type OutfitIQAnalysis } from '../../lib/smartStylist';

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
  const stylePersonality = useStore((s) => s.stylePersonality);
  const wardrobePreference = useStore((s) => s.wardrobePreference);
  const avatarHairStyle = useStore((s) => s.avatarHairStyle);
  const avatarHairColor = useStore((s) => s.avatarHairColor);
  const avatarBeard = useStore((s) => s.avatarBeard);

  /* ── Local state ── */
  const [seed, setSeed] = useState(0);
  const [used, setUsed] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [viewMode, setViewMode] = useState<'avatar' | 'flatlay'>('avatar');
  const [liveWeather, setLiveWeather] = useState<LiveWeather | null>(null);
  const [customHero, setCustomHero] = useState<Outfit | null>(null);
  const [optToast, setOptToast] = useState<string | null>(null);

  useEffect(() => {
    fetchLiveWeather().then(setLiveWeather).catch(() => {});
  }, []);

  /* ── Stable garment count for dep tracking ── */
  const gLen = garments.length;
  const uLen = usedOutfits.length;

  const outfits: Outfit[] = useMemo(() => {
    if (gLen === 0) return [];

    const activeClimate = liveWeather ? liveWeather.climate : climate;
    const profile = { onboarded: true, name, height, heightUnit: hUnit, build, skin, climate: activeClimate, stylePersonality, wardrobePreference };

    return generateOutfits(garments, occasion, profile, 3, usedOutfits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gLen, occasion, name, height, hUnit, build, skin, climate, seed, uLen, liveWeather, stylePersonality, wardrobePreference]);

  const rawHero = outfits[0] ?? null;
  const hero = customHero || rawHero;
  const occMeta = OCCASIONS.find((o) => o.id === occasion);

  // Diagnóstico inteligente en tiempo real para el atuendo del día
  const heroIQ: OutfitIQAnalysis | null = useMemo(() => {
    if (!hero) return null;
    const activeClimate = liveWeather ? liveWeather.climate : climate;
    const profile = { onboarded: true, name, height, heightUnit: hUnit, build, skin, climate: activeClimate, stylePersonality, wardrobePreference };
    return calculateOutfitIQ(hero, profile, liveWeather?.tempC);
  }, [hero, liveWeather, climate, name, height, hUnit, build, skin, stylePersonality, wardrobePreference]);

  const handleAutoOptimizeHero = () => {
    if (!hero) return;
    const activeClimate = liveWeather ? liveWeather.climate : climate;
    const profile = { onboarded: true, name, height, heightUnit: hUnit, build, skin, climate: activeClimate, stylePersonality, wardrobePreference };
    const opt = autoOptimizeOutfit(hero, garments, profile, liveWeather?.tempC);
    if (opt.hasOptimization) {
      setCustomHero({
        top: opt.optimizedOutfit.top,
        bottom: opt.optimizedOutfit.bottom,
        shoe: opt.optimizedOutfit.shoe,
        layer: opt.optimizedOutfit.layer || null,
        score: opt.optimizedIQ,
        key: [opt.optimizedOutfit.top.id, opt.optimizedOutfit.bottom.id, opt.optimizedOutfit.shoe.id, opt.optimizedOutfit.layer?.id].filter(Boolean).join('-'),
        styleNote: opt.explanation
      });
      setOptToast(`¡Optimizado a ${opt.optimizedIQ}/100! (+${opt.gain} pts)`);
      setTimeout(() => setOptToast(null), 4500);
    } else {
      setOptToast('Tu atuendo ya cuenta con la máxima armonía alcanzable.');
      setTimeout(() => setOptToast(null), 3000);
    }
  };

  const handleUse = (imageUrl?: string) => {
    if (!hero) return;
    const garmentIds = [hero.top, hero.layer, hero.bottom, hero.shoe]
      .filter((garment): garment is NonNullable<typeof garment> => Boolean(garment))
      .map((garment) => garment.id);
    markUsed(hero.key, garmentIds, imageUrl);
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
      // Graceful fallback without breaking user flow
      handleUse();
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
      <div className="ed-label" style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{greeting}</span>
        {liveWeather && (
          <span style={{ color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
            {liveWeather.isDay ? <IconSun size={15} /> : <IconMoon size={15} />}
            {liveWeather.tempC}°C · {liveWeather.climate === 'calido' ? 'Cálido' : liveWeather.climate === 'frio' ? 'Frío' : 'Templado'}
          </span>
        )}
      </div>
      <h1 className="ed-title">{name ? `${name}` : 'Tu estilismo diario'}</h1>

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
            {o.name}
          </button>
        ))}
      </div>

      {/* ── Empty states ── */}
      {!hasEnough && (
        <div className="empty">
          <div className="empty__icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconCloset size={36} />
          </div>
          <div className="empty__title">Agrega tus prendas</div>
          <div className="empty__sub">
            Necesitas al menos 1 prenda superior, 1 pantalón y 1 calzado para generar combinaciones.
          </div>
        </div>
      )}

      {hasEnough && !hero && (
        <div className="empty">
          <div className="empty__icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconRefresh size={36} />
          </div>
          <div className="empty__title">Sin combinaciones</div>
          <div className="empty__sub">
            No encontramos outfits limpios para {occMeta?.name ?? 'esta ocasión'}. Prueba otra ocasión o revisa tu cesto de lavandería.
          </div>
        </div>
      )}

      {/* ── Outfit hero ── */}
      {hero && (
        <div className="outfit-hero" style={{ padding: 24, borderRadius: 'var(--r-xl)', border: '1px solid rgba(255, 90, 38, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="outfit-hero__label" style={{ margin: 0, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {occMeta?.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {hero.styleNote && (
                <span style={{ fontSize: 11, color: 'var(--ink-2)', fontStyle: 'italic' }}>
                  {hero.styleNote}
                </span>
              )}
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', background: 'rgba(255, 90, 38, 0.12)', padding: '4px 10px', borderRadius: 'var(--r-full)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <IconStar size={13} /> Score {hero.score}
              </span>
            </div>
          </div>

          {/* Switcher de Vista Maniquí Avatar vs Flat-Lay */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{
              display: 'inline-flex',
              padding: 4,
              borderRadius: 'var(--r-md)',
              background: 'var(--surface-3)',
              border: '1px solid var(--line)'
            }}>
              <button
                type="button"
                onClick={() => setViewMode('avatar')}
                style={{
                  padding: '6px 14px',
                  fontSize: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 'var(--r-sm)',
                  border: 'none',
                  background: viewMode === 'avatar' ? 'var(--accent)' : 'transparent',
                  color: viewMode === 'avatar' ? '#FFFFFF' : 'var(--ink-2)',
                  fontWeight: viewMode === 'avatar' ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <IconCube size={15} /> Maniquí 3D Interactivo
              </button>
              <button
                type="button"
                onClick={() => setViewMode('flatlay')}
                style={{
                  padding: '6px 14px',
                  fontSize: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 'var(--r-sm)',
                  border: 'none',
                  background: viewMode === 'flatlay' ? 'var(--accent)' : 'transparent',
                  color: viewMode === 'flatlay' ? '#FFFFFF' : 'var(--ink-2)',
                  fontWeight: viewMode === 'flatlay' ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <IconTop size={15} /> Prendas Flat-Lay
              </button>
            </div>
          </div>

          {viewMode === 'avatar' ? (
            showCustomizer ? (
              <div style={{ margin: '14px 0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowCustomizer(false)}
                    className="btn btn-sm btn-secondary"
                    style={{ fontSize: 12, padding: '4px 12px' }}
                  >
                    Cerrar Personalizador
                  </button>
                </div>
                <AvatarCustomizer onSaved={() => setShowCustomizer(false)} />
              </div>
            ) : (
              <div style={{
                margin: '14px 0 20px',
                padding: '20px 16px',
                borderRadius: 'var(--r-lg)',
                background: 'linear-gradient(180deg, var(--surface-3) 0%, var(--surface-2) 100%)',
                border: '1px solid rgba(255, 90, 38, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: 12
                }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: 'var(--accent)',
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'rgba(255, 90, 38, 0.1)',
                    padding: '4px 12px',
                    borderRadius: 'var(--r-full)'
                  }}>
                    <IconCube size={13} /> Probador 3D Alta Costura: Piel {skin} · Complexión {build}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCustomizer(true)}
                    className="btn btn-sm btn-secondary"
                    style={{ fontSize: 11, padding: '4px 10px', borderRadius: 'var(--r-full)' }}
                  >
                    Personalizar Avatar
                  </button>
                </div>
                <p style={{ fontSize: 11, color: 'var(--ink-2)', marginBottom: 12, textAlign: 'center' }}>
                  Arrastra libremente para rotar en 3D o usa los controles de ángulo, luz de pasarela y giro orbital.
                </p>
                <AvatarMannequin
                  top={hero.top}
                  layer={hero.layer}
                  bottom={hero.bottom}
                  shoe={hero.shoe}
                  skin={skin}
                  build={build}
                  preference={wardrobePreference}
                  hairStyle={avatarHairStyle}
                  hairColor={avatarHairColor}
                  beard={avatarBeard}
                  size={350}
                  allowControls={true}
                  showIntelligenceHUD={true}
                  closetGarments={garments}
                  weatherTemp={liveWeather?.tempC}
                  onApplyOptimization={(opt) => {
                    setCustomHero({
                      top: opt.top,
                      bottom: opt.bottom,
                      shoe: opt.shoe,
                      layer: opt.layer || null,
                      score: 98,
                      key: [opt.top.id, opt.bottom.id, opt.shoe.id, opt.layer?.id].filter(Boolean).join('-'),
                      styleNote: 'Optimizado con IA de Pasarela'
                    });
                  }}
                />
              </div>
            )
          ) : (
            <div className="flatlay-container" style={{ margin: '14px 0 20px', padding: 16 }}>
              {([
                { item: hero.top, label: 'Superior', icon: <IconTop size={20} /> },
                { item: hero.layer, label: 'Capa / Abrigo', icon: <IconLayer size={20} /> },
                { item: hero.bottom, label: 'Inferior', icon: <IconBottom size={20} /> },
                { item: hero.shoe, label: 'Calzado', icon: <IconShoes size={20} /> },
              ] as const)
                .filter(entry => Boolean(entry.item))
                .map(({ item, label, icon }) => (
                  <div key={item!.id} className="flatlay-piece">
                    {item!.imageUrl ? (
                      <img
                        src={item!.imageUrl}
                        alt={item!.name}
                        style={{ width: 44, height: 44, borderRadius: 'var(--r-sm)', objectFit: 'cover', border: `2px solid ${item!.colorHex}` }}
                      />
                    ) : (
                      <div
                        className="flatlay-piece__icon"
                        style={{ background: item!.colorHex, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {icon}
                      </div>
                    )}
                    <div className="flatlay-piece__info">
                      <div className="flatlay-piece__name">{item!.name}</div>
                      <div className="flatlay-piece__meta" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-2)' }}>
                        <span>{label}</span>
                        <span>·</span>
                        <span style={{ color: item!.colorHex, fontWeight: 600 }}>{item!.colorName}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* ── TARJETA DE INTELIGENCIA DE ESTILISMO (OUTFIT IQ) ── */}
          {heroIQ && (
            <div
              style={{
                marginBottom: 16,
                padding: '14px 16px',
                borderRadius: 'var(--r-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${heroIQ.badgeColor}44`,
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--r-sm)',
                      background: `${heroIQ.badgeColor}22`,
                      color: heroIQ.badgeColor,
                      fontWeight: 800,
                      fontSize: 12,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <IconLightning size={13} /> IQ {heroIQ.overallIQ} · Nivel {heroIQ.tier}
                  </div>
                  {heroIQ.isSandwich && (
                    <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>
                      🥪 Sándwich Cromático
                    </span>
                  )}
                  {heroIQ.isPielMorenaSynergy && (
                    <span style={{ fontSize: 11, color: '#D4AF37', fontWeight: 600 }}>
                      ★ Armonía Piel Morena
                    </span>
                  )}
                </div>

                {heroIQ.overallIQ < 96 && garments.length >= 4 && (
                  <button
                    type="button"
                    onClick={handleAutoOptimizeHero}
                    className="btn btn-sm btn-primary"
                    style={{
                      fontSize: 11,
                      padding: '5px 12px',
                      borderRadius: 'var(--r-full)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5
                    }}
                  >
                    <IconSparkles size={13} /> ⚡ Optimizar con IA
                  </button>
                )}
              </div>

              {optToast && (
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--r-sm)',
                    background: 'rgba(192, 96, 58, 0.15)',
                    border: '1px solid var(--accent)',
                    color: '#FFF',
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <IconSparkles size={14} style={{ color: 'var(--accent)' }} />
                  {optToast}
                </div>
              )}

              {/* Rótulo de Diagnóstico del Estilista */}
              <div style={{ fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--ink)' }}>Asesor Biomecánico: </strong>
                {heroIQ.verdictSummary} {heroIQ.stylistTip}
              </div>
            </div>
          )}

          <div className="outfit-hero__reason" style={{ marginBottom: 18, color: 'var(--ink-2)', fontSize: 13 }}>
            {([hero.top, hero.layer, hero.bottom, hero.shoe] as const).filter(Boolean).length} prendas combinadas ·{' '}
            {hero.styleNote || (hero.score >= 10 ? 'Armonía y contraste perfectos' : hero.score >= 6 ? 'Equilibrio estético versátil' : 'Conjunto funcional y cómodo')}
          </div>

          <div className="outfit-hero__actions" style={{ flexDirection: 'column', gap: 12 }}>
            {!used ? (
              <>
                <label className="btn btn-primary" style={{ width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46 }}>
                  <IconCamera size={18} />
                  Selfie de mi Outfit (Guardar)
                  <input type="file" accept="image/*" capture="user" style={{ position: 'absolute', opacity: 0, inset: 0, cursor: 'pointer' }} onChange={handlePhotoCapture} />
                </label>
                <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                  <button className="btn btn-secondary" onClick={() => handleUse()} style={{ flex: 1, fontSize: 13, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <IconCheck size={16} /> Confirmar uso
                  </button>
                  <button className="btn btn-secondary" onClick={handleRegen} style={{ width: 52, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Recombinar outfit">
                    <IconRefresh size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                <div style={{ padding: 14, borderRadius: 'var(--r-md)', background: 'rgba(26, 224, 95, 0.12)', color: 'var(--success)', fontWeight: 700, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <IconCheck size={18} /> ¡Outfit registrado en el historial de uso!
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowShare(true)}
                  style={{ width: '100%', fontSize: 13, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <IconShare size={16} /> Compartir este outfit
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Alternativas ── */}
      {outfits.length > 1 && (
        <div style={{ marginTop: 28 }}>
          <div className="ed-label" style={{ marginBottom: 12 }}>
            Otras opciones combinadas
          </div>
          <div className="outfit-grid">
            {outfits.slice(1).map((o, i) => (
              <div key={o.key || i} className="outfit-card">
                <div className="outfit-card__pieces">
                  {([o.top, o.layer, o.bottom, o.shoe] as const)
                    .filter(Boolean)
                    .map((p) => (
                      <div key={p!.id} className="outfit-card__piece" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          className="outfit-card__dot"
                          style={{ background: p!.colorHex, width: 14, height: 14, borderRadius: 3, flexShrink: 0 }}
                        />
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{p!.name}</span>
                      </div>
                    ))}
                </div>
                <div className="outfit-card__meta" style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-2)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Score {o.score}</span>
                  {o.styleNote && <span>{o.styleNote}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AI Oracle Section ── */}
      <Oracle />

      {showShare && hero && (
        <ShareCard
          outfit={{ top: hero.top?.id, bottom: hero.bottom?.id, layer: hero.layer?.id, shoe: hero.shoe?.id }}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
