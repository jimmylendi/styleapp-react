import { useState } from 'react';
import { useStore } from '../../lib/store';
import { COLORS, TYPES } from '../../lib/data';
import { analyzePurchase } from '../../lib/engine';
import type { PurchaseAnalysis } from '../../types';

export default function PurchaseSheet({ onClose }: { onClose: () => void }) {
    const name = useStore((s) => s.name);
    const height = useStore((s) => s.height);
    const hUnit = useStore((s) => s.heightUnit);
    const build = useStore((s) => s.build);
    const skin = useStore((s) => s.skin);
    const climate = useStore((s) => s.climate);
    const stylePersonality = useStore((s) => s.stylePersonality);

    const garments = useStore((s) => s.garments);
    const addGarment = useStore((s) => s.addGarment);

    const profile = { onboarded: true, name, height, heightUnit: hUnit, build, skin, climate, stylePersonality };

    const [type, setType] = useState<string | null>(null);
    const [subtype, setSubtype] = useState<string | null>(null);
    const [color, setColor] = useState<string | null>(null);

    // Analysis result
    const [analysis, setAnalysis] = useState<PurchaseAnalysis | null>(null);

    // Advanced Info (V2)
    const [price, setPrice] = useState<number>(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // 9 Questions Checklist
    const [checks, setChecks] = useState<boolean[]>(Array(9).fill(false));

    const typeObj = TYPES.find((t) => t.id === type);
    const needsSub = typeObj && typeObj.subtypes.length > 0;
    const readyToAnalyze = type && color && (!needsSub || subtype);

    // Default smart questions if user doesn't provide them yet
    const QUESTIONS = [
        '¿Realmente me hace falta en la cápsula?',
        '¿Combina con al menos 3 prendas que ya tengo?',
        '¿El fit es ideal para mi complexión?',
        '¿Es de mi paleta de colores?',
        '¿Es cómoda y no requiere arreglos extra?',
        '¿El material es de buena calidad?',
        '¿Es para mi estilo de vida actual (no el ideal)?',
        '¿Si estuviera a precio normal, lo compraría?',
        '¿Me siento al 100% seguro de comprarla?'
    ];

    const allChecked = checks.every((c) => c);

    const handleAnalyze = () => {
        if (!typeObj || !color) return;
        const res = analyzePurchase(typeObj.id, color, profile, garments);
        setAnalysis(res);
    };

    const handleBuy = () => {
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
            price: price > 0 ? price : undefined,
            imageUrl: imageUrl || undefined
        });

        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof e.target?.result === 'string') {
                setImageUrl(e.target.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const toggleCheck = (idx: number) => {
        const newChecks = [...checks];
        newChecks[idx] = !newChecks[idx];
        setChecks(newChecks);
    };

    return (
        <div className="sheet-overlay" onClick={onClose}>
            <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '95vh' }}>
                <div className="sheet__head">
                    <div>
                        <div className="sheet__eyebrow">Checkout de estilo</div>
                        <h2 className="sheet__title">Modo Compra</h2>
                    </div>
                    <button className="sheet__close" onClick={onClose}>✕</button>
                </div>

                <div className="sheet__body">
                    {!analysis ? (
                        <>
                            {/* STAGE 1: Selection */}
                            <div className="field">
                                <div className="field__label">1 · Qué vas a comprar</div>
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
                                    <div className="field__label">Subtipo</div>
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
                                    <div className="field__label">2 · Color exacto</div>
                                    <div className="color-grid">
                                        {Object.entries(COLORS).map(([cName, meta]) => (
                                            <button
                                                key={cName}
                                                className={`color-opt ${color === cName ? 'is-active' : ''}`}
                                                style={{ background: meta.hex }}
                                                onClick={() => setColor(cName)}
                                                aria-label={cName}
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

                            {readyToAnalyze && (
                                <button
                                    className="btn btn-primary btn-xl"
                                    style={{ width: '100%', marginTop: 16 }}
                                    onClick={handleAnalyze}
                                >
                                    Analizar prenda →
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {/* STAGE 2: Analysis & Checklist */}
                            <div className="analysis-card" style={{ marginBottom: 24, padding: 16, borderRadius: 'var(--r-md)', background: 'var(--surface-2)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                    <div
                                        style={{
                                            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                                            background: analysis.verdict === 'green' ? 'var(--success)' : analysis.verdict === 'yellow' ? 'var(--warn)' : 'var(--danger)'
                                        }}
                                    />
                                    <h3 style={{ fontSize: 16, fontWeight: 800 }}>{analysis.title}</h3>
                                </div>
                                <ul style={{ paddingLeft: 24, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                                    {analysis.reasons.map((r, i) => (
                                        <li key={i} style={{ marginBottom: 4 }}>{r}</li>
                                    ))}
                                </ul>
                            </div>

                            {analysis.verdict !== 'red' && (
                                <div style={{ marginBottom: 24 }}>
                                    <div className="field__label" style={{ marginBottom: 8 }}>Datos Reales (Opcional)</div>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <div style={{ flex: 1 }}>
                                            <input
                                                type="number"
                                                placeholder="Precio ($)"
                                                value={price === 0 ? '' : price}
                                                onChange={(e) => setPrice(Number(e.target.value))}
                                                style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', background: 'var(--surface)' }}
                                            />
                                        </div>
                                        <div style={{ flex: 1, position: 'relative' }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                                            />
                                            <div style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--r-md)', background: 'var(--surface-3)', color: 'var(--ink)', textAlign: 'center', fontWeight: 'bold' }}>
                                                {imageUrl ? '📸 Lista' : '📸 Foto'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {analysis.verdict !== 'red' && (
                                <div className="checklist">
                                    <div className="field__label" style={{ marginBottom: 16 }}>Las 9 Preguntas Clave</div>
                                    {QUESTIONS.map((q, i) => (
                                        <div
                                            key={i}
                                            onClick={() => toggleCheck(i)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 12,
                                                padding: '12px 14px', background: 'var(--surface)',
                                                borderRadius: 'var(--r-sm)', marginBottom: 8, cursor: 'pointer',
                                                border: checks[i] ? '1px solid var(--accent)' : '1px solid transparent',
                                                userSelect: 'none'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    border: checks[i] ? 'none' : '2px solid var(--line)',
                                                    background: checks[i] ? 'var(--accent)' : 'transparent',
                                                    color: '#fff', fontSize: 13, fontWeight: 'bold'
                                                }}
                                            >
                                                {checks[i] && '✓'}
                                            </div>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: checks[i] ? 'var(--ink)' : 'var(--ink-2)' }}>{q}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {analysis && analysis.verdict !== 'red' && (
                    <div className="sheet__foot" style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-secondary" onClick={() => setAnalysis(null)} style={{ flex: 1 }}>
                            Atrás
                        </button>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 2, opacity: allChecked ? 1 : 0.6 }}
                            disabled={!allChecked}
                            onClick={handleBuy}
                        >
                            {allChecked ? '🎉 Comprar y añadir' : 'Marca las 9 casillas \u2191'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
