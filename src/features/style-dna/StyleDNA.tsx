import { useStore } from '../../lib/store';
import { getStyleDNA, PERSONALITIES } from '../../lib/personality';
import { assignPalette } from '../../lib/palettes';
import type { StylePersonality } from '../../types';

export default function StyleDNA() {
    const skin = useStore(s => s.skin);
    const build = useStore(s => s.build);
    const stylePersonality = useStore(s => s.stylePersonality);
    const setProfile = useStore(s => s.setProfile);
    const name = useStore(s => s.name);

    const dna = getStyleDNA(stylePersonality, build, skin);
    const palette = assignPalette(skin, 'neutro', build, stylePersonality);

    return (
        <div>
            <div className="ed-label" style={{ marginBottom: 12 }}>Tu identidad visual</div>
            <h1 className="ed-title">ADN de Estilo</h1>
            <p style={{ marginTop: 8, fontSize: 13, color: 'var(--ink-2)' }}>
                La intersección de tus colores, tu cuerpo y tu personalidad.
            </p>

            {/* ── DNA Header Card ── */}
            <div style={{
                marginTop: 24,
                padding: '28px 24px',
                borderRadius: 'var(--r-xl)',
                background: 'linear-gradient(135deg, #12182E 0%, #1E2B4A 100%)',
                border: '1px solid rgba(108,99,255,0.25)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 120, opacity: 0.06 }}>🧬</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                    Perfil de {name || 'tu estilo'}
                </div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 32 }}>{dna.personality.icon}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-2)', marginTop: 4 }}>{dna.personality.name}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 32 }}>{dna.body.icon}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-2)', marginTop: 4 }}>{dna.body.name}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 32 }}>🎨</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-2)', marginTop: 4 }}>{dna.skin.name}</div>
                    </div>
                </div>
                <div style={{ marginTop: 16, fontSize: 16, fontWeight: 800 }}>{dna.personality.tagline}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>{dna.personality.desc}</div>
            </div>

            {/* ── Sección 0: Paleta del Día ── */}
            <Section icon="🎨" title={`Tu paleta: ${palette.main.name}`}>
                <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 4 }}>{palette.main.style}</div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        {palette.main.colors.map((c, i) => (
                            <div key={i} style={{
                                flex: 1, height: 48, borderRadius: 10, background: c,
                                border: '2px solid rgba(255,255,255,0.08)'
                            }} />
                        ))}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, borderLeft: '3px solid var(--accent)', paddingLeft: 12 }}>
                        💡 {palette.main.combination}
                    </div>
                </div>

                {palette.star && (
                    <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 'var(--r-md)', background: 'rgba(218,165,32,0.08)', border: '1px solid rgba(218,165,32,0.3)' }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#DAA520', marginBottom: 8 }}>★ Paleta Estrella — {palette.star.name}</div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            {palette.star.colors.map((c, i) => (
                                <div key={i} style={{ flex: 1, height: 36, borderRadius: 8, background: c }} />
                            ))}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{palette.star.description}</div>
                    </div>
                )}

                {palette.alternatives.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Alternativas</div>
                        {palette.alternatives.map(alt => (
                            <div key={alt.id} style={{ marginBottom: 10 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 6 }}>{alt.name} — {alt.style}</div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    {alt.colors.map((c, i) => (
                                        <div key={i} style={{ flex: 1, height: 28, borderRadius: 6, background: c }} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Section>

            {/* ── Sección 1: Colores ── */}
            <Section icon="🎨" title="Tus colores de poder">
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                        ✅ Colores que te favorecen
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                        {dna.skin.powerHex.map((hex, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: hex, border: '2px solid rgba(255,255,255,0.1)' }} />
                                <div style={{ fontSize: 10, color: 'var(--ink-3)', maxWidth: 44, textAlign: 'center', lineHeight: 1.2 }}>
                                    {dna.skin.powerColors[i]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ background: 'rgba(255,59,48,0.06)', borderRadius: 'var(--r-md)', padding: '12px 16px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                        ⚠️ Evita estos colores
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                        {dna.skin.avoidHex.map((hex, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: hex, border: '2px solid rgba(255,59,48,0.3)', opacity: 0.7 }} />
                                <div style={{ fontSize: 9, color: 'var(--ink-3)', maxWidth: 40, textAlign: 'center', lineHeight: 1.2 }}>
                                    {dna.skin.avoidColors[i]}
                                </div>
                            </div>
                        ))}
                    </div>
                    {dna.skin.avoidColors.map((c, i) => (
                        <div key={i} style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.6 }}>• {c}</div>
                    ))}
                </div>
            </Section>

            {/* ── Sección 2: Tipo de cuerpo ── */}
            <Section icon="👔" title={`Cortes para tu cuerpo (${dna.body.name})`}>
                <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                        ✅ Lo que te favorece
                    </div>
                    {dna.body.favorable.map((tip, i) => (
                        <div key={i} style={{ fontSize: 13, color: 'var(--ink-2)', padding: '6px 0', borderBottom: '1px solid var(--line)', lineHeight: 1.5 }}>
                            {tip}
                        </div>
                    ))}
                </div>
                <div style={{ background: 'rgba(255,59,48,0.06)', borderRadius: 'var(--r-md)', padding: '12px 16px', marginTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                        ⚠️ Lo que debes evitar
                    </div>
                    {dna.body.avoid.map((tip, i) => (
                        <div key={i} style={{ fontSize: 13, color: 'var(--ink-3)', padding: '4px 0', lineHeight: 1.5 }}>
                            • {tip}
                        </div>
                    ))}
                </div>
            </Section>

            {/* ── Sección 3: Personalidad ── */}
            <Section icon={dna.personality.icon} title={`Estilo ${dna.personality.name}`}>
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                        💡 Consejos para tu arquetipo
                    </div>
                    {dna.personality.tips.map((tip, i) => (
                        <div key={i} style={{
                            fontSize: 14, color: 'var(--ink)', padding: '12px 16px', marginBottom: 8,
                            background: 'var(--surface-3)', borderRadius: 'var(--r-md)',
                            borderLeft: '3px solid var(--accent)', lineHeight: 1.6
                        }}>
                            {tip}
                        </div>
                    ))}
                </div>
                <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                        🎯 Ocasiones ideales para ti
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {dna.personality.prefersOccasions.map(o => (
                            <span key={o} style={{
                                padding: '6px 14px', borderRadius: 'var(--r-full)', fontSize: 13, fontWeight: 700,
                                background: 'var(--surface-3)', border: '1px solid var(--accent)', color: 'var(--accent)'
                            }}>
                                {o}
                            </span>
                        ))}
                    </div>
                </div>
            </Section>

            {/* ── Personalidad switcher ── */}
            <Section icon="🔄" title="Cambiar mi personalidad de estilo">
                <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 16, lineHeight: 1.6 }}>
                    ¿Tu estilo evolucionó? Actualiza tu arquetipo para que los outfits generados se alineen mejor.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {(Object.values(PERSONALITIES) as typeof PERSONALITIES[keyof typeof PERSONALITIES][]).map(p => {
                        const isActive = stylePersonality === p.id;
                        return (
                            <button
                                key={p.id}
                                onClick={() => setProfile({ stylePersonality: p.id as StylePersonality })}
                                style={{
                                    padding: '14px 12px', borderRadius: 'var(--r-md)', textAlign: 'left',
                                    background: isActive ? 'rgba(108,99,255,0.15)' : 'var(--surface-2)',
                                    border: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                                    cursor: 'pointer', transition: 'all 0.18s'
                                }}
                            >
                                <div style={{ fontSize: 22, marginBottom: 4 }}>{p.icon}</div>
                                <div style={{ fontSize: 13, fontWeight: 800, color: isActive ? 'var(--accent)' : 'var(--ink)' }}>{p.name}</div>
                                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{p.tagline}</div>
                            </button>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
    return (
        <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <h2 style={{ fontSize: 15, fontWeight: 900 }}>{title}</h2>
            </div>
            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-lg)', padding: 20 }}>
                {children}
            </div>
        </div>
    );
}
