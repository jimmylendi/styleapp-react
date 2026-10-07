import { useMemo, useState } from 'react';
import { useStore } from '../../lib/store';
import { generateOutfits } from '../../lib/engine';
import { OCCASIONS } from '../../lib/data';
import {
  IconHeart,
  IconHeartFilled,
  IconRefresh,
  IconLaundry,
  IconStar,
  IconCheck,
  IconCloset,
  IconTop,
  IconBottom,
  IconLayer,
  IconShoes,
  IconAvatar,
  IconLightning
} from '../../components/Icons';
import type { OccasionId, GarmentCat } from '../../types';
import { AvatarMannequin } from '../../components/AvatarMannequin';
import { calculateOutfitIQ } from '../../lib/smartStylist';

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
  const usedOutfits = useStore((s) => s.usedOutfits);
  const favoriteOutfits = useStore((s) => s.favoriteOutfits);
  const toggleFavoriteOutfit = useStore((s) => s.toggleFavoriteOutfit);
  const stylePersonality = useStore((s) => s.stylePersonality);
  const wardrobePreference = useStore((s) => s.wardrobePreference);
  const avatarHairStyle = useStore((s) => s.avatarHairStyle);
  const avatarHairColor = useStore((s) => s.avatarHairColor);
  const avatarBeard = useStore((s) => s.avatarBeard);

  const [seed, setSeed] = useState(0);
  const [usedKeys, setUsedKeys] = useState<Set<string>>(new Set());
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [filterEditorial, setFilterEditorial] = useState(false);
  const [hideLaundry, setHideLaundry] = useState(true);
  const [displayMode, setDisplayMode] = useState<'cards' | 'mannequins'>('cards');

  const gLen = garments.length;
  const uLen = usedOutfits.length;
  const inLaundryCount = garments.filter(g => g.inLaundry).length;

  const profile = useMemo(() => ({
    onboarded: true, name, height, heightUnit: hUnit, build, skin, climate, stylePersonality, wardrobePreference
  }), [name, height, hUnit, build, skin, climate, stylePersonality, wardrobePreference]);

  const filteredGarments = useMemo(() => {
    if (!hideLaundry) return garments;
    const clean = garments.filter(g => !g.inLaundry);
    const hasCleanEssentials =
      clean.some(g => g.cat === 'top') &&
      clean.some(g => g.cat === 'bottom') &&
      clean.some(g => g.cat === 'shoes');
    return hasCleanEssentials ? clean : garments;
  }, [garments, hideLaundry]);

  const outfits = useMemo(() => {
    if (gLen === 0) return [];
    return generateOutfits(filteredGarments, occasion, profile, 8, usedOutfits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredGarments, occasion, name, height, hUnit, build, skin, climate, seed, uLen, stylePersonality, wardrobePreference]);

  const analyzedOutfits = useMemo(() => {
    return outfits.map(o => ({
      ...o,
      iq: calculateOutfitIQ(o, profile)
    }));
  }, [outfits, profile]);

  const displayedOutfits = useMemo(() => {
    let list = analyzedOutfits;
    if (filterFavorites) list = list.filter(o => favoriteOutfits.includes(o.key));
    if (filterEditorial) list = list.filter(o => o.iq.overallIQ >= 88);
    return list;
  }, [analyzedOutfits, filterFavorites, filterEditorial, favoriteOutfits]);

  const occMeta = OCCASIONS.find((o) => o.id === occasion);

  const hasEnough =
    garments.some((g) => g.cat === 'top') &&
    garments.some((g) => g.cat === 'bottom') &&
    garments.some((g) => g.cat === 'shoes');

  const handleUse = (outfit: (typeof outfits)[number]) => {
    const garmentIds = [outfit.top, outfit.layer, outfit.bottom, outfit.shoe]
      .filter((garment): garment is NonNullable<typeof garment> => Boolean(garment))
      .map((garment) => garment.id);
    markUsed(outfit.key, garmentIds);
    setUsedKeys((prev) => new Set(prev).add(outfit.key));
  };

  const getCategoryIcon = (cat: GarmentCat) => {
    switch (cat) {
      case 'top': return <IconTop size={16} />;
      case 'bottom': return <IconBottom size={16} />;
      case 'layer': return <IconLayer size={16} />;
      case 'shoes': return <IconShoes size={16} />;
    }
  };

  return (
    <div>
      <div className="ed-label" style={{ marginBottom: 12 }}>Catálogo & Estilismo Algorítmico</div>
      <h1 className="ed-title">Armario Cápsula</h1>

      {/* Occasion selector */}
      <div className="chips chips--scroll" style={{ marginTop: 20, marginBottom: 20 }}>
        {OCCASIONS.map((o) => (
          <button
            key={o.id}
            className={`chip ${occasion === o.id ? 'is-active' : ''}`}
            onClick={() => setOcc(o.id as OccasionId)}
          >
            {o.name}
          </button>
        ))}
      </div>

      {/* Quick Filters Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${!filterFavorites && !filterEditorial ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setFilterFavorites(false); setFilterEditorial(false); }}
            style={{ fontSize: 12, padding: '7px 14px', minHeight: 38 }}
          >
            Todas ({outfits.length})
          </button>
          <button
            className={`btn btn-sm ${filterEditorial ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setFilterEditorial(!filterEditorial); setFilterFavorites(false); }}
            style={{ fontSize: 12, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6, minHeight: 38 }}
          >
            <IconLightning size={14} /> Editorial 90%+ ({analyzedOutfits.filter(o => o.iq.overallIQ >= 88).length})
          </button>
          <button
            className={`btn btn-sm ${filterFavorites ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setFilterFavorites(true); setFilterEditorial(false); }}
            style={{ fontSize: 12, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 6, minHeight: 38 }}
          >
            <IconHeartFilled size={14} /> Favoritas ({outfits.filter(o => favoriteOutfits.includes(o.key)).length})
          </button>

          {inLaundryCount > 0 && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setHideLaundry(!hideLaundry)}
              style={{
                fontSize: 12,
                padding: '7px 12px',
                minHeight: 38,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: hideLaundry ? 'rgba(255, 179, 64, 0.12)' : 'var(--surface-2)',
                color: hideLaundry ? 'var(--warn)' : 'var(--ink-2)',
                border: hideLaundry ? '1px solid rgba(255, 179, 64, 0.3)' : '1px solid var(--line)'
              }}
              title="Alternar filtro de prendas en lavandería"
            >
              <IconLaundry size={15} />
              {hideLaundry ? `Ocultando ${inLaundryCount} en lavado` : `Incluyendo en lavado (${inLaundryCount})`}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', padding: 3, borderRadius: 'var(--r-md)', background: 'var(--surface-3)', border: '1px solid var(--line)' }}>
            <button
              type="button"
              className={`btn btn-sm ${displayMode === 'cards' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDisplayMode('cards')}
              style={{ fontSize: 11, padding: '5px 12px', minHeight: 32 }}
            >
              Lista
            </button>
            <button
              type="button"
              className={`btn btn-sm ${displayMode === 'mannequins' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDisplayMode('mannequins')}
              style={{ fontSize: 11, padding: '5px 12px', minHeight: 32, display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <IconAvatar size={14} /> Maniquíes Puestos
            </button>
          </div>

          {hasEnough && (
            <button
              className="btn btn-secondary btn-sm"
              style={{ padding: '7px 14px', minHeight: 38, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={() => setSeed((s) => s + 1)}
            >
              <IconRefresh size={15} /> Recombinar
            </button>
          )}
        </div>
      </div>

      {/* Empty states */}
      {!hasEnough && (
        <div className="empty">
          <div className="empty__icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconCloset size={36} />
          </div>
          <div className="empty__title">Agrega prendas primero</div>
          <div className="empty__sub">
            Necesitas mínimo 1 superior, 1 pantalón y 1 calzado para generar combinaciones.
          </div>
        </div>
      )}

      {hasEnough && displayedOutfits.length === 0 && (
        <div className="empty" style={{ padding: '40px 20px' }}>
          <div className="empty__icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {filterFavorites ? <IconHeart size={36} /> : <IconRefresh size={36} />}
          </div>
          <div className="empty__title">
            {filterFavorites ? 'Sin favoritas en esta ocasión' : 'Sin combinaciones disponibles'}
          </div>
          <div className="empty__sub">
            {filterFavorites
              ? 'Guarda combinaciones pulsando el corazón en las tarjetas de outfits.'
              : `Prueba otra ocasión (${occMeta?.name}) o agrega prendas adicionales a tu armario.`}
          </div>
        </div>
      )}

      {/* Outfit Mannequin Gallery */}
      {displayedOutfits.length > 0 && displayMode === 'mannequins' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {displayedOutfits.map((o, i) => {
            const wasUsed = usedKeys.has(o.key);
            const isFav = favoriteOutfits.includes(o.key);
            return (
              <div
                key={o.key || i}
                style={{
                  background: 'linear-gradient(180deg, var(--surface-3) 0%, var(--surface-2) 100%)',
                  borderRadius: 'var(--r-xl)',
                  padding: 20,
                  border: '1px solid rgba(255, 90, 38, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--accent)' }}>#{i + 1}</span>
                    <span
                      style={{
                        padding: '2px 7px',
                        borderRadius: 'var(--r-sm)',
                        background: `${o.iq.badgeColor}22`,
                        color: o.iq.badgeColor,
                        fontWeight: 700,
                        fontSize: 10.5,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3
                      }}
                    >
                      <IconLightning size={11} /> IQ {o.iq.overallIQ} · {o.iq.tier}
                    </span>
                    {o.iq.isSandwich && (
                      <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600 }}>
                        🥪 Sándwich
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavoriteOutfit(o.key)}
                    style={{ padding: 6, minWidth: 32, minHeight: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'transparent', border: 'none' }}
                  >
                    {isFav ? <IconHeartFilled size={18} /> : <IconHeart size={18} style={{ opacity: 0.6 }} />}
                  </button>
                </div>

                <AvatarMannequin
                  top={o.top}
                  layer={o.layer}
                  bottom={o.bottom}
                  shoe={o.shoe}
                  skin={skin}
                  build={build}
                  preference={wardrobePreference}
                  hairStyle={avatarHairStyle}
                  hairColor={avatarHairColor}
                  beard={avatarBeard}
                  size={270}
                  defaultAngle="threeQuarter"
                  allowControls={false}
                  showIntelligenceHUD={true}
                />

                <div style={{ width: '100%', marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <IconStar size={13} /> Score {o.score}
                  </span>
                  <button
                    className={`btn ${wasUsed ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                    style={{ padding: '6px 14px', fontSize: 12 }}
                    onClick={() => handleUse(o)}
                    disabled={wasUsed}
                  >
                    {wasUsed ? 'En uso' : 'Vestir hoy'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Outfit grid (Card list) */}
      {displayedOutfits.length > 0 && displayMode === 'cards' && (
        <div className="outfit-grid">
          {displayedOutfits.map((o, i) => {
            const pieces = ([o.top, o.layer, o.bottom, o.shoe] as const).filter(Boolean);
            const wasUsed = usedKeys.has(o.key);
            const isFav = favoriteOutfits.includes(o.key);

            return (
              <div key={o.key || i} className="outfit-card" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div className="outfit-card__rank" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span>#{i + 1}</span>
                    <span
                      style={{
                        padding: '2px 7px',
                        borderRadius: 'var(--r-sm)',
                        background: `${o.iq.badgeColor}22`,
                        color: o.iq.badgeColor,
                        fontWeight: 700,
                        fontSize: 10.5,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3
                      }}
                    >
                      <IconLightning size={11} /> IQ {o.iq.overallIQ} · {o.iq.tier}
                    </span>
                    {o.iq.isSandwich && (
                      <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600 }}>
                        🥪 Sándwich
                      </span>
                    )}
                    {o.styleNote && (
                      <span style={{ fontSize: 11, color: 'var(--ink-2)', fontStyle: 'italic', fontWeight: 400 }}>
                        · {o.styleNote}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavoriteOutfit(o.key)}
                    style={{ padding: 6, minWidth: 36, minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    aria-label={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                  >
                    {isFav ? <IconHeartFilled size={19} /> : <IconHeart size={19} style={{ opacity: 0.6 }} />}
                  </button>
                </div>

                <div className="outfit-card__pieces" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {pieces.map((p) => (
                    <div key={p!.id} className="outfit-card__piece" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {p!.imageUrl ? (
                        <img
                          src={p!.imageUrl}
                          alt={p!.name}
                          style={{ width: 34, height: 34, borderRadius: 6, objectFit: 'cover', border: `1.5px solid ${p!.colorHex}` }}
                        />
                      ) : (
                        <div
                          className="outfit-card__dot"
                          style={{ background: p!.colorHex, color: '#FFFFFF', width: 34, height: 34, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {getCategoryIcon(p!.cat)}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 600, fontSize: 13, textOverflow: 'ellipsis', overflow: 'hidden' }}>{p!.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span>{p!.colorName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="outfit-card__footer" style={{ marginTop: 14 }}>
                  <div className="outfit-card__meta" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <IconStar size={13} /> {o.score}
                    </span>
                    <span>· {pieces.length} piezas</span>
                  </div>
                  <button
                    className={`btn ${wasUsed ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ padding: '8px 16px', fontSize: 12, minHeight: 36, display: 'flex', alignItems: 'center', gap: 5 }}
                    onClick={() => handleUse(o)}
                    disabled={wasUsed}
                  >
                    {wasUsed ? <><IconCheck size={14} /> Usado</> : 'Usar'}
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
