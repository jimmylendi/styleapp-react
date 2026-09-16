import { useMemo, useState } from 'react';
import { useStore } from '../../lib/store';
import { COLORS, TYPES } from '../../lib/data';
import { getCapsuleProgress, getNextPurchase, matchCapsule, CAPSULE_IDEAL } from '../../lib/capsule';
import PurchaseSheet from '../purchase/PurchaseSheet';
import PurgeMode from './PurgeMode';
import type { GarmentCat } from '../../types';

type ClosetTab = 'ideal' | 'mine';

export default function Closet() {
  const garments = useStore((s) => s.garments);
  const removeGarment = useStore((s) => s.removeGarment);

  const [tab, setTab] = useState<ClosetTab>('ideal');
  const [showAdd, setShowAdd] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [showPurge, setShowPurge] = useState(false);
  const [prefill, setPrefill] = useState<{ type?: string; color?: string } | null>(null);

  const progress = useMemo(() => getCapsuleProgress(garments), [garments]);
  const nextBuy = useMemo(() => getNextPurchase(garments), [garments]);
  const matches = useMemo(() => matchCapsule(garments, CAPSULE_IDEAL), [garments]);

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
      <div className="closet-tabs" style={{ marginTop: 16, marginBottom: 24, paddingRight: 8 }}>
        <button
          className={`closet-tab ${tab === 'ideal' ? 'is-active' : ''}`}
          onClick={() => setTab('ideal')}
        >
          🎯 Mi clóset ideal
        </button>
        <button
          className={`closet-tab ${tab === 'mine' ? 'is-active' : ''}`}
          onClick={() => setTab('mine')}
        >
          👕 Mis prendas{garments.length > 0 ? ` (${garments.length})` : ''}
        </button>

        {/* MODO COMPRA BUTTON */}
        <button
          className="closet-tab"
          onClick={() => setShowPurchase(true)}
          style={{
            background: 'var(--accent)',
            color: '#fff',
            marginLeft: 8,
            flex: 'none'
          }}
        >
          🛒 Compra
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
              flex: 'none'
            }}
          >
            🧹 Limpiar
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
          <p style={{ color: 'var(--ink-2)', fontSize: 13, marginBottom: 20 }}>
            {garments.length === 0
              ? 'Aún no tienes prendas'
              : `${garments.length} prendas registradas`}
          </p>

          {garments.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <button className="btn btn-primary" onClick={handleAddFresh}>
                + Añadir prenda
              </button>
            </div>
          )}

          {garments.length === 0 && (
            <div className="empty">
              <div className="empty__icon">◫</div>
              <div className="empty__title">Clóset vacío</div>
              <div className="empty__sub">
                Añade tus primeras 3 prendas para empezar a generar combinaciones.
              </div>
              <button className="btn btn-primary btn-xl" onClick={handleAddFresh}>
                + Añadir prenda
              </button>
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
                  {items.map((g) => (
                    <div key={g.id} className="closet-card">
                      <div
                        className="closet-card__color"
                        style={{ background: g.colorHex }}
                      />
                      <div className="closet-card__info">
                        <div className="closet-card__name">{g.name}</div>
                        <div className="closet-card__meta">
                          {g.colorCat} · {g.type}
                        </div>
                      </div>
                      <button
                        className="closet-card__del"
                        onClick={() => removeGarment(g.id)}
                        aria-label="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
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
        <PurgeMode onClose={() => setShowPurge(false)} />
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

  const [type, setType] = useState<string | null>(prefillType ?? null);
  const [subtype, setSubtype] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(prefillColor ?? null);

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
      status: 'ok'
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
              {TYPES.map((t) => (
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