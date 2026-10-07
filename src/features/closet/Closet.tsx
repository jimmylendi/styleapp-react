import { useMemo, useState } from 'react';
import { useStore } from '../../lib/store';
import { COLORS, TYPES } from '../../lib/data';
import { STARTER_CAPSULES } from '../../lib/presets';
import { getCapsuleProgress, getNextPurchase, matchCapsule, getDynamicCapsule } from '../../lib/capsule';
import { assignPalette } from '../../lib/palettes';
import {
  IconTarget,
  IconCloset,
  IconCart,
  IconBroom,
  IconLightning,
  IconLaundry,
  IconPlus,
  IconCheck,
  IconTrash,
  IconSparkles
} from '../../components/Icons';
import PurchaseSheet from '../purchase/PurchaseSheet';
import PurgeMode from './PurgeMode';
import type { GarmentCat, UserProfile } from '../../types';
import { detectBridgeGarment, detectOrphanGarments } from '../../lib/smartStylist';

type ClosetTab = 'ideal' | 'mine';

export default function Closet() {
  const garments = useStore((s) => s.garments);
  const deleteGarment = useStore((s) => s.deleteGarment);
  const toggleLaundry = useStore((s) => s.toggleLaundry);
  const loadStarterCapsule = useStore((s) => s.loadStarterCapsule);
  const usedOutfits = useStore((s) => s.usedOutfits);

  const build = useStore((s) => s.build);
  const skin = useStore((s) => s.skin);
  const stylePersonality = useStore((s) => s.stylePersonality);
  const wardrobePreference = useStore((s) => s.wardrobePreference);

  const [tab, setTab] = useState<ClosetTab>('ideal');
  const [showAdd, setShowAdd] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [showPurge, setShowPurge] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [prefill, setPrefill] = useState<{ type?: string; color?: string } | null>(null);

  const dynamicCapsule = useMemo(() => {
    const assignment = assignPalette(skin, 'neutro', build, stylePersonality);
    return getDynamicCapsule(assignment, wardrobePreference);
  }, [skin, build, stylePersonality, wardrobePreference]);

  const progress = useMemo(() => getCapsuleProgress(garments, dynamicCapsule), [garments, dynamicCapsule]);
  const nextBuy = useMemo(() => getNextPurchase(garments, dynamicCapsule), [garments, dynamicCapsule]);
  const matches = useMemo(() => matchCapsule(garments, dynamicCapsule), [garments, dynamicCapsule]);

  const userProfile: UserProfile = useMemo(() => ({
    onboarded: true,
    name: '',
    height: '190',
    heightUnit: 'metric',
    build,
    skin,
    climate: 'calido',
    stylePersonality,
    wardrobePreference
  }), [build, skin, stylePersonality, wardrobePreference]);

  // Auditoría inteligente de clóset
  const bridgeGarment = useMemo(() => detectBridgeGarment(garments, userProfile), [garments, userProfile]);
  const orphanGarments = useMemo(() => detectOrphanGarments(garments, userProfile), [garments, userProfile]);

  const cats: Record<GarmentCat, string> = {
    top: 'Superiores', bottom: 'Pantalones', layer: 'Capas', shoes: 'Calzado'
  };

  const groups: Record<GarmentCat, typeof garments> = {
    top: [], bottom: [], layer: [], shoes: []
  };
  garments.forEach((g) => groups[g.cat]?.push(g));

  const handleAddFromCapsule = (type: string, color: string) => {
    setPrefill({ type, color });
    setShowAdd(true);
  };

  const handleAddFresh = () => {
    setPrefill(null);
    setShowAdd(true);
  };

  return (
    <div>
      <div className="ed-label" style={{ marginBottom: 12 }}>Clóset</div>
      <h1 className="ed-title">
        {tab === 'ideal' ? 'Clóset ideal' : 'Mis prendas'}
      </h1>

      {/* ── Tabs ── */}
      <div className="closet-tabs" style={{ marginTop: 16, marginBottom: 24, paddingRight: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button
          className={`closet-tab ${tab === 'ideal' ? 'is-active' : ''}`}
          onClick={() => setTab('ideal')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 40 }}
        >
          <IconTarget size={16} /> Mi clóset ideal
        </button>
        <button
          className={`closet-tab ${tab === 'mine' ? 'is-active' : ''}`}
          onClick={() => setTab('mine')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 40 }}
        >
          <IconCloset size={16} /> Mis prendas{garments.length > 0 ? ` (${garments.length})` : ''}
        </button>

        {/* MODO COMPRA BUTTON */}
        <button
          className="closet-tab"
          onClick={() => setShowPurchase(true)}
          style={{
            background: 'var(--accent)',
            color: '#fff',
            marginLeft: 8,
            flex: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            minHeight: 40
          }}
        >
          <IconCart size={16} /> Compra
        </button>

        {/* MODO PURGA BUTTON */}
        {garments.length > 3 && (
          <button
            className="closet-tab"
            onClick={() => setShowPurge(true)}
            style={{
              background: 'rgba(255, 59, 48, 0.15)',
              color: 'var(--danger)',
              marginLeft: 8,
              flex: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              minHeight: 40
            }}
          >
            <IconBroom size={16} /> Limpiar
          </button>
        )}
      </div>

      {/* ════════════════════════════════════════════════
          TAB: MI CLÓSET IDEAL (cápsula 20 prendas)
         ════════════════════════════════════════════════ */}
      {tab === 'ideal' && (
        <div>
          {/* Progreso general */}
          <div className="cap-progress">
            <div className="cap-progress__bar">
              <div
                className="cap-progress__fill"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <div className="cap-progress__text">
              {progress.owned}/{progress.total} prendas · {progress.percent}% completo
            </div>
          </div>

          {/* Siguiente compra */}
          {nextBuy && (
            <div className="cap-next">
              <div className="cap-next__label">Siguiente compra recomendada</div>
              <div className="cap-next__item">
                <div
                  className="cap-next__dot"
                  style={{ background: COLORS[nextBuy.color]?.hex ?? '#888' }}
                />
                <div className="cap-next__info">
                  <div className="cap-next__name">{nextBuy.icon} {nextBuy.name}</div>
                  <div className="cap-next__hint">Etapa {nextBuy.stage} · {nextBuy.color}</div>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', fontSize: 12 }}
                  onClick={() => handleAddFromCapsule(nextBuy.type, nextBuy.color)}
                >
                  + Añadir
                </button>
              </div>
            </div>
          )}

          {progress.percent === 100 && (
            <div className="cap-next" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
              <div className="cap-next__label">¡Cápsula completa!</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>
                Tienes las 20 prendas. Comprar menos, combinar mejor.
              </div>
            </div>
          )}

          {/* Etapas */}
          {progress.stages.map((st) => (
            <div key={st.stage} className="cap-stage">
              <div className="cap-stage__head">
                <div>
                  <div className="cap-stage__name">
                    Etapa {st.stage} · {st.name}
                  </div>
                  <div className="cap-stage__desc">{st.desc}</div>
                </div>
                <div className="cap-stage__count">
                  {st.owned}/{st.total}
                </div>
              </div>

              <div className="cap-stage__items">
                {matches
                  .filter((m) => m.ideal.stage === st.stage)
                  .map((m) => (
                    <div
                      key={m.ideal.id}
                      className={`cap-item ${m.status === 'have'
                        ? 'cap-item--have'
                        : m.status === 'similar'
                          ? 'cap-item--similar'
                          : 'cap-item--missing'
                        }`}
                    >
                      <div
                        className="cap-item__dot"
                        style={{ background: COLORS[m.ideal.color]?.hex ?? '#888' }}
                      />
                      <div className="cap-item__info">
                        <div className="cap-item__name">
                          {m.ideal.icon} {m.ideal.name}
                        </div>
                        <div className="cap-item__status">
                          {m.status === 'have'
                            ? '✓ Tienes'
                            : m.status === 'similar'
                              ? '≈ Similar'
                              : 'Falta'}
                        </div>
                      </div>
                      {m.status === 'missing' && (
                        <button
                          className="cap-item__add"
                          onClick={() => handleAddFromCapsule(m.ideal.type, m.ideal.color)}
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════════════
          TAB: MIS PRENDAS (inventario real)
         ════════════════════════════════════════════════ */}
      {tab === 'mine' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <p style={{ color: 'var(--ink-2)', fontSize: 13, margin: 0 }}>
              {garments.length === 0
                ? 'Aún no tienes prendas registradas'
                : `${garments.length} prendas registradas · ${garments.filter(g => g.inLaundry).length} en lavado`}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowPresets(!showPresets)}
                style={{ fontSize: 12, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}
              >
                <IconLightning size={14} /> {showPresets ? 'Ocultar cápsulas' : 'Cápsulas de inicio'}
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleAddFresh} style={{ fontSize: 12, padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <IconPlus size={14} /> Añadir prenda
              </button>
            </div>
          </div>

          {showPresets && (
            <div style={{ marginBottom: 28, background: 'var(--surface-2)', padding: 18, borderRadius: 'var(--r-lg)', border: '1px solid rgba(255, 90, 38, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconLightning size={16} /> Cápsulas Predefinidas
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--ink-2)' }}>Agrega un guardarropa completo y balanceado con un solo clic.</p>
                </div>
              </div>
              <div className="starter-capsule-grid">
                {STARTER_CAPSULES.map(cap => (
                  <div key={cap.id} className="starter-capsule-card">
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 6 }}>{cap.badge}</div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{cap.name}</h4>
                      <p style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 14, lineHeight: 1.4 }}>{cap.description}</p>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        loadStarterCapsule(cap.id, false);
                        setShowPresets(false);
                      }}
                      style={{ width: '100%' }}
                    >
                      Añadir {cap.garments.length} prendas
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {garments.length === 0 && !showPresets && (
            <div className="empty" style={{ padding: '36px 20px' }}>
              <div className="empty__icon">◫</div>
              <div className="empty__title">Tu clóset está listo</div>
              <div className="empty__sub" style={{ maxWidth: 400, margin: '0 auto 20px' }}>
                Puedes comenzar añadiendo tus prendas favoritas una a una o cargar una cápsula completa para probar combinaciones de inmediato.
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={handleAddFresh}>
                  + Añadir prenda manualmente
                </button>
                <button className="btn btn-secondary" onClick={() => setShowPresets(true)}>
                  ⚡ Ver cápsulas de inicio
                </button>
              </div>
            </div>
          )}

          {/* ── AUDITORÍA INTELIGENTE DE CLÓSET CÁPSULA ── */}
          {garments.length >= 3 && (
            <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Tarjeta 1: Prenda Puente Estrella */}
              {bridgeGarment && (
                <div
                  style={{
                    padding: '16px 18px',
                    borderRadius: 'var(--r-lg)',
                    background: 'linear-gradient(135deg, rgba(192, 96, 58, 0.12) 0%, rgba(30, 30, 38, 0.9) 100%)',
                    border: '1px solid rgba(192, 96, 58, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 14
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 260 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 'var(--r-md)',
                        background: bridgeGarment.colorHex,
                        border: '2px solid rgba(255,255,255,0.25)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        flexShrink: 0
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--accent)', fontWeight: 800 }}>
                          ⚡ Prenda Puente Recomendada
                        </span>
                        {bridgeGarment.faceAffinityBonus && (
                          <span style={{ fontSize: 10, color: '#D4AF37', fontWeight: 700 }}>
                            ★ Favorece Piel Morena
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>
                        {bridgeGarment.typeName}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--ink-2)', marginTop: 2, lineHeight: 1.4 }}>
                        {bridgeGarment.reason}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--accent)' }}>
                        +{bridgeGarment.newOutfitsCount} looks
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--ink-2)' }}>
                        +{bridgeGarment.versatilityGainPercent}% versatilidad
                      </div>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ padding: '8px 14px', fontSize: 11, borderRadius: 'var(--r-full)' }}
                      onClick={() => handleAddFromCapsule(bridgeGarment.type, bridgeGarment.colorName)}
                    >
                      + Añadir prenda
                    </button>
                  </div>
                </div>
              )}

              {/* Tarjeta 2: Rescate de Prendas Huérfanas */}
              {orphanGarments.length > 0 && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--r-md)',
                    background: 'rgba(255, 179, 64, 0.08)',
                    border: '1px solid rgba(255, 179, 64, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--warn)', textTransform: 'uppercase', letterSpacing: 0.8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconSparkles size={14} /> Plan de Rescate: {orphanGarments.length} prenda{orphanGarments.length > 1 ? 's' : ''} con pocas combinaciones
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 8 }}>
                    {orphanGarments.slice(0, 2).map((orphan) => (
                      <div
                        key={orphan.garment.id}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 'var(--r-sm)',
                          background: 'rgba(0,0,0,0.2)',
                          fontSize: 11,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8
                        }}
                      >
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: orphan.garment.colorHex,
                            flexShrink: 0
                          }}
                        />
                        <div>
                          <strong>{orphan.garment.name}:</strong> {orphan.rescueTip}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {(Object.keys(groups) as GarmentCat[]).map((cat) => {
            const items = groups[cat];
            if (!items.length) return null;
            return (
              <div key={cat} className="closet-cat">
                <div className="closet-cat__title">
                  {cats[cat]} · {items.length}
                </div>
                <div className="closet-grid">
                  {items.map((g) => {
                    const wearCount = usedOutfits.filter(u => u.garmentIds?.includes(g.id)).length;
                    const cpw = g.price && wearCount > 0 ? (g.price / wearCount).toFixed(2) : g.price ? g.price.toFixed(2) : null;
                    return (
                      <div key={g.id} className="closet-card" style={{ opacity: g.inLaundry ? 0.75 : 1 }}>
                        {g.imageUrl ? (
                          <img
                            src={g.imageUrl}
                            alt={g.name}
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 'var(--r-sm)',
                              objectFit: 'cover',
                              border: `2px solid ${g.colorHex}`
                            }}
                          />
                        ) : (
                          <div
                            className="closet-card__color"
                            style={{ background: g.colorHex }}
                          />
                        )}
                        <div className="closet-card__info" style={{ flex: 1, minWidth: 0 }}>
                          <div className="closet-card__name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>{g.name}</span>
                          </div>
                          <div className="closet-card__meta" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 4 }}>
                            <span>{g.colorCat} · {g.type}</span>
                            {cpw && (
                              <span className="cpw-badge" title={`Precio: $${g.price} · Usada ${wearCount} veces`}>
                                ${cpw}/uso
                              </span>
                            )}
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <button
                              type="button"
                              className={`laundry-pill ${g.inLaundry ? 'laundry-pill--wash' : 'laundry-pill--clean'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLaundry(g.id);
                              }}
                              title={g.inLaundry ? 'Marcar como limpia' : 'Marcar como en cesto/lavado'}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                            >
                              {g.inLaundry ? <><IconLaundry size={13} /> En lavado</> : <><IconCheck size={13} /> Limpia</>}
                            </button>
                          </div>
                        </div>
                        <button
                          className="closet-card__del"
                          onClick={() => deleteGarment(g.id)}
                          aria-label="Eliminar prenda"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <IconTrash size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <AddModal
          onClose={() => { setShowAdd(false); setPrefill(null); }}
          prefillType={prefill?.type}
          prefillColor={prefill?.color}
        />
      )}

      {showPurchase && (
        <PurchaseSheet onClose={() => setShowPurchase(false)} />
      )}

      {showPurge && (
        <PurgeMode
          garments={garments}
          onClose={() => setShowPurge(false)}
          onPurge={deleteGarment}
        />
      )}
    </div>
  );
}

/* ============================================================
   MODAL AÑADIR PRENDA (con soporte de pre-fill desde cápsula)
   ============================================================ */
function AddModal({
  onClose,
  prefillType,
  prefillColor
}: {
  onClose: () => void;
  prefillType?: string;
  prefillColor?: string;
}) {
  const addGarment = useStore((s) => s.addGarment);
  const wardrobePreference = useStore((s) => s.wardrobePreference);
  const availableTypes = TYPES.filter((item) => item.audience.includes(wardrobePreference));

  const [type, setType] = useState<string | null>(prefillType ?? null);
  const [subtype, setSubtype] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(prefillColor ?? null);
  const [price, setPrice] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const typeObj = TYPES.find((t) => t.id === type);
  const needsSub = typeObj && typeObj.subtypes.length > 0;
  const ready = type && color && (!needsSub || subtype);

  const buttonLabel = !type
    ? 'Elige un tipo'
    : needsSub && !subtype
      ? 'Elige un subtipo'
      : !color
        ? 'Elige un color'
        : 'Guardar prenda';

  const hint = !type
    ? '① Selecciona el tipo de prenda'
    : needsSub && !subtype
      ? '② Selecciona el subtipo'
      : !color
        ? '③ Selecciona el color'
        : '';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 360;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setImageUrl(canvas.toDataURL('image/jpeg', 0.8));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!typeObj || !color) return;
    const meta = COLORS[color];

    let name = typeObj.name;
    if (subtype) name += ` ${subtype.toLowerCase()}`;
    name += ` ${color.toLowerCase()}`;
    name = name.charAt(0).toUpperCase() + name.slice(1);

    addGarment({
      type: typeObj.id,
      cat: typeObj.cat,
      colorName: color,
      colorHex: meta.hex,
      colorCat: meta.cat,
      name,
      status: 'ok',
      price: price ? Math.max(0, parseFloat(price)) : undefined,
      imageUrl: imageUrl || undefined,
    });

    onClose();
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__head">
          <div>
            <div className="sheet__eyebrow">Nueva prenda</div>
            <h2 className="sheet__title">¿Qué vas a añadir?</h2>
          </div>
          <button className="sheet__close" onClick={onClose}>✕</button>
        </div>

        <div className="sheet__body">
          <div className="field">
            <div className="field__label">1 · Tipo</div>
            <div className="chips">
              {availableTypes.map((t) => (
                <button
                  key={t.id}
                  className={`chip ${type === t.id ? 'is-active' : ''}`}
                  onClick={() => {
                    setType(t.id);
                    setSubtype(null);
                    setColor(null);
                  }}
                >
                  {t.icon} {t.name}
                </button>
              ))}
            </div>
          </div>

          {needsSub && (
            <div className="field">
              <div className="field__label">2 · Subtipo</div>
              <div className="chips">
                {typeObj!.subtypes.map((s) => (
                  <button
                    key={s}
                    className={`chip ${subtype === s ? 'is-active' : ''}`}
                    onClick={() => setSubtype(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {type && (
            <div className="field">
              <div className="field__label">{needsSub ? '3' : '2'} · Color</div>
              <div className="color-grid">
                {Object.entries(COLORS).map(([name, meta]) => (
                  <button
                    key={name}
                    className={`color-opt ${color === name ? 'is-active' : ''}`}
                    style={{ background: meta.hex }}
                    onClick={() => setColor(name)}
                    aria-label={name}
                  />
                ))}
              </div>

              {color && (
                <div className="color-preview">
                  <div
                    className="color-preview__swatch"
                    style={{ background: COLORS[color].hex }}
                  />
                  <div className="color-preview__info">
                    <div className="color-preview__name">{color}</div>
                    <div className="color-preview__cat">
                      {COLORS[color].cat === 'base'
                        ? 'Base'
                        : COLORS[color].cat === 'secondary'
                          ? 'Secundario'
                          : 'Acento'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {ready && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="field" style={{ marginBottom: 16 }}>
                <div className="field__label">Detalles opcionales</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--ink-2)', display: 'block', marginBottom: 4 }}>
                      Precio de compra ($)
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="Ej. 45"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--r-md)', fontSize: 14 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--ink-2)', display: 'block', marginBottom: 4 }}>
                      Foto de la prenda
                    </label>
                    <label
                      className="btn btn-secondary"
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        padding: '10px 12px',
                        fontSize: 13,
                        cursor: 'pointer',
                        borderRadius: 'var(--r-md)',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {imageUrl ? '📷 Foto cargada' : '📷 Subir foto'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {imageUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--success)' }}>✓ Foto lista para guardar</span>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    style={{ fontSize: 12, color: 'var(--danger)', marginLeft: 'auto' }}
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {!ready && hint && (
          <div className="sheet__hint">{hint}</div>
        )}

        <div className="sheet__foot">
          <button
            className="btn btn-primary btn-xl"
            disabled={!ready}
            onClick={handleSave}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
