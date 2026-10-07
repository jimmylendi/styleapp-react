import { useState, useMemo } from 'react';
import { useStore } from '../../lib/store';
import { COLORS, TYPES } from '../../lib/data';
import { analyzePurchase } from '../../lib/engine';
import { IconClose, IconCheck, IconCamera, IconCube, IconShieldCheck } from '../../components/Icons';
import type { PurchaseAnalysis } from '../../types';
import { AvatarMannequin } from '../../components/AvatarMannequin';
import {
    simulatePurchaseImpact,
    validateDocumentoBaseFilters,
    type PurchaseSimulationResult,
    type DocumentoBaseValidation
} from '../../lib/smartStylist';

export default function PurchaseSheet({ onClose }: { onClose: () => void }) {
    const name = useStore((s) => s.name);
    const height = useStore((s) => s.height);
    const hUnit = useStore((s) => s.heightUnit);
    const build = useStore((s) => s.build);
    const skin = useStore((s) => s.skin);
    const climate = useStore((s) => s.climate);
    const stylePersonality = useStore((s) => s.stylePersonality);
    const wardrobePreference = useStore((s) => s.wardrobePreference);
    const avatarHairStyle = useStore((s) => s.avatarHairStyle);
    const avatarHairColor = useStore((s) => s.avatarHairColor);
    const avatarBeard = useStore((s) => s.avatarBeard);

    const garments = useStore((s) => s.garments);
    const addGarment = useStore((s) => s.addGarment);

    const profile = useMemo(() => ({
        onboarded: true, name, height, heightUnit: hUnit, build, skin, climate, stylePersonality, wardrobePreference
    }), [name, height, hUnit, build, skin, climate, stylePersonality, wardrobePreference]);

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

    // Simulación de impacto estilístico de compra
    const simulation: PurchaseSimulationResult | null = useMemo(() => {
        if (!typeObj || !color) return null;
        return simulatePurchaseImpact({ type: typeObj.id, colorName: color, cat: typeObj.cat }, garments, profile);
    }, [typeObj, color, garments, profile]);

    // Validación automática según Documento Base (6'6", clima cálido, piel morena, regla 3:1)
    const docBaseValidation: DocumentoBaseValidation | null = useMemo(() => {
        if (!typeObj || !color) return null;
        return validateDocumentoBaseFilters({ type: typeObj.id, colorName: color, cat: typeObj.cat }, garments, profile);
    }, [typeObj, color, garments, profile]);

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
                        <div className="sheet__eyebrow">Checkout de estilo consciente</div>
                        <h2 className="sheet__title">Modo Compra</h2>
                    </div>
                    <button className="sheet__close" onClick={onClose} aria-label="Cerrar modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconClose size={18} />
                    </button>
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
                            {/* STAGE 2: Analysis & 3D Simulation */}
                            {simulation?.bestComboSample && (
                                <div style={{
                                    marginBottom: 20,
                                    padding: 16,
                                    borderRadius: 'var(--r-lg)',
                                    background: 'linear-gradient(180deg, var(--surface-3) 0%, var(--surface-2) 100%)',
                                    border: '1px solid rgba(255, 90, 38, 0.25)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
                                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                            <IconCube size={13} /> Simulación 3D en tu Avatar
                                        </span>
                                        <span style={{ fontSize: 11, color: 'var(--ink-2)' }}>
                                            Probando: {typeObj?.name} {color}
                                        </span>
                                    </div>
                                    <AvatarMannequin
                                        top={simulation.bestComboSample.top}
                                        layer={simulation.bestComboSample.layer}
                                        bottom={simulation.bestComboSample.bottom}
                                        shoe={simulation.bestComboSample.shoe}
                                        skin={skin}
                                        build={build}
                                        preference={wardrobePreference}
                                        hairStyle={avatarHairStyle}
                                        hairColor={avatarHairColor}
                                        beard={avatarBeard}
                                        size={240}
                                        allowControls={false}
                                        showIntelligenceHUD={true}
                                    />
                                </div>
                            )}

                            {simulation && (
                                <div style={{
                                    marginBottom: 18,
                                    padding: '12px 14px',
                                    borderRadius: 'var(--r-md)',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--line)',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: 8,
                                    textAlign: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--accent)' }}>
                                            +{simulation.newOutfitsCreated}
                                        </div>
                                        <div style={{ fontSize: 10, color: 'var(--ink-2)', marginTop: 2 }}>
                                            Nuevos Outfits
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 16, fontWeight: 900, color: simulation.averageIQ >= 88 ? '#8BC34A' : '#FF9800' }}>
                                            {simulation.averageIQ}/100
                                        </div>
                                        <div style={{ fontSize: 10, color: 'var(--ink-2)', marginTop: 2 }}>
                                            Outfit IQ Medio
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 16, fontWeight: 900, color: '#D4AF37' }}>
                                            {simulation.faceAffinityScore}%
                                        </div>
                                        <div style={{ fontSize: 10, color: 'var(--ink-2)', marginTop: 2 }}>
                                            Afinidad Facial
                                        </div>
                                    </div>
                                </div>
                            )}

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

                            {/* ── FILTROS DE VALIDACIÓN AUTOMÁTICA (DOCUMENTO BASE) ── */}
                            {docBaseValidation && (
                                <div style={{
                                    marginBottom: 20,
                                    padding: '16px 18px',
                                    borderRadius: 'var(--r-lg)',
                                    background: 'linear-gradient(135deg, rgba(30, 30, 42, 0.95) 0%, rgba(20, 20, 30, 0.98) 100%)',
                                    border: `1px solid ${docBaseValidation.overallPassed ? 'rgba(76, 175, 80, 0.35)' : 'rgba(255, 179, 64, 0.35)'}`
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <IconShieldCheck size={16} />
                                            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--accent)' }}>
                                                Filtros de Validación (Documento Base 6'6" / Piel Morena)
                                            </span>
                                        </div>
                                        <span style={{
                                            fontSize: 10.5,
                                            fontWeight: 800,
                                            padding: '2px 8px',
                                            borderRadius: 'var(--r-full)',
                                            background: docBaseValidation.overallPassed ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 179, 64, 0.15)',
                                            color: docBaseValidation.overallPassed ? 'var(--success)' : 'var(--warn)'
                                        }}>
                                            {docBaseValidation.overallPassed ? '✓ 4/4 Aprobados' : '⚠️ Revisión Sugerida'}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                                        {/* Filtro 1: Estatura */}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                                            <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓</span>
                                            <div>
                                                <strong style={{ color: 'var(--ink)' }}>Estatura ~6'6" (1.98 m):</strong>{' '}
                                                <span style={{ color: 'var(--ink-2)' }}>{docBaseValidation.heightNote}</span>
                                            </div>
                                        </div>

                                        {/* Filtro 2: Clima cálido */}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                                            <span style={{ color: docBaseValidation.isClimateOptimized ? 'var(--success)' : 'var(--warn)', fontWeight: 800 }}>
                                                {docBaseValidation.isClimateOptimized ? '✓' : '⚠️'}
                                            </span>
                                            <div>
                                                <strong style={{ color: 'var(--ink)' }}>Clima Cálido / Tropical:</strong>{' '}
                                                <span style={{ color: 'var(--ink-2)' }}>{docBaseValidation.climateNote}</span>
                                            </div>
                                        </div>

                                        {/* Filtro 3: Paleta 60-30-10 */}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                                            <span style={{ color: docBaseValidation.isColorPaletteMatch ? 'var(--success)' : 'var(--warn)', fontWeight: 800 }}>
                                                {docBaseValidation.isColorPaletteMatch ? '✓' : '⚠️'}
                                            </span>
                                            <div>
                                                <strong style={{ color: 'var(--ink)' }}>Paleta Alto Contraste (60-30-10):</strong>{' '}
                                                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>[{docBaseValidation.colorRole}]</span>{' '}
                                                <span style={{ color: 'var(--ink-2)' }}>{docBaseValidation.colorNote}</span>
                                            </div>
                                        </div>

                                        {/* Filtro 4: Regla 3:1 */}
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                                            <span style={{ color: docBaseValidation.isVersatility3to1 ? 'var(--success)' : 'var(--warn)', fontWeight: 800 }}>
                                                {docBaseValidation.isVersatility3to1 ? '✓' : '⚠️'}
                                            </span>
                                            <div>
                                                <strong style={{ color: 'var(--ink)' }}>Regla de Versatilidad (3:1):</strong>{' '}
                                                <span style={{ color: 'var(--ink-2)' }}>{docBaseValidation.versatilityNote}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                            <div style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--r-md)', background: 'var(--surface-3)', color: 'var(--ink)', textAlign: 'center', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                                <IconCamera size={16} />
                                                {imageUrl ? 'Foto cargada' : 'Añadir foto'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {analysis.verdict !== 'red' && (
                                <div className="checklist">
                                    <div className="field__label" style={{ marginBottom: 16 }}>Las 9 Preguntas Clave del Consumo Consciente</div>
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
                                                {checks[i] && <IconCheck size={14} />}
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
                            {allChecked ? 'Comprar y añadir a mi clóset' : 'Marca las 9 casillas para validar'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
