import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { getStyleDNA, PERSONALITIES } from '../../lib/personality';
import { assignPalette } from '../../lib/palettes';
import { analyzeSkinAndSuggestEarthPalette } from '../../lib/earthPalette';
import type { StylePersonality, SkinTone } from '../../types';
import { WARDROBE_PREFERENCES, SKINS } from '../../lib/data';
import { AvatarCustomizer } from '../../components/AvatarCustomizer';
import {
  IconPalette,
  IconDna,
  IconRefresh,
  IconTop,
  IconStar,
  IconSparkles,
  IconCheck,
  IconTag,
  IconShieldCheck
} from '../../components/Icons';

export default function StyleDNA() {
  const skin = useStore(s => s.skin);
  const build = useStore(s => s.build);
  const stylePersonality = useStore(s => s.stylePersonality);
  const setProfile = useStore(s => s.setProfile);
  const name = useStore(s => s.name);
  const wardrobePreference = useStore(s => s.wardrobePreference);

  // Selector interactivo de tono de piel para el análisis de paleta tierra
  const [analyzedSkin, setAnalyzedSkin] = useState<SkinTone>(skin || 'morena');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const dna = getStyleDNA(stylePersonality, build, skin);
  const palette = assignPalette(skin, 'neutro', build, stylePersonality);

  // Análisis biomecánico de tonos tierra para el tono seleccionado
  const earthAnalysis = analyzeSkinAndSuggestEarthPalette(analyzedSkin);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleApplySkinToProfile = () => {
    setProfile({ skin: analyzedSkin });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div>
      <div className="ed-label" style={{ marginBottom: 12 }}>Identidad Visual & Colorimetría</div>
      <h1 className="ed-title">ADN de Estilo</h1>
      <p style={{ marginTop: 8, fontSize: 13, color: 'var(--ink-2)' }}>
        Intersección armónica entre tu colorimetría facial, tu silueta corporal y tu personalidad.
      </p>

      {/* ── DNA Header Card ── */}
      <div style={{
        marginTop: 24,
        padding: '28px 24px',
        borderRadius: 'var(--r-xl)',
        background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface-3) 100%)',
        border: '1px solid rgba(255, 90, 38, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
          Perfil de {name || 'tu estilo'}
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, color: 'var(--accent)', display: 'flex', justifyContent: 'center' }}><IconSparkles size={24} /></div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>{dna.personality.name}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, color: 'var(--accent)', display: 'flex', justifyContent: 'center' }}><IconTop size={24} /></div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>{dna.body.name}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, color: 'var(--accent)', display: 'flex', justifyContent: 'center' }}><IconPalette size={24} /></div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>{dna.skin.name}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, color: 'var(--accent)', display: 'flex', justifyContent: 'center' }}><IconDna size={24} /></div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>{WARDROBE_PREFERENCES[wardrobePreference].name}</div>
          </div>
        </div>
        <div style={{ marginTop: 18, fontSize: 16, fontWeight: 800 }}>{dna.personality.tagline}</div>
        <div style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>{dna.personality.desc}</div>
      </div>

      {/* ── MANIFIESTO DEL DOCUMENTO BASE OFICIAL (6'6", PIEL MORENA, CLIMA CÁLIDO) ── */}
      <Section
        icon={<IconShieldCheck size={18} />}
        title={"Documento Base: Manifiesto Athletic Tall & Piel Morena (6'6\" / 1.98 m)"}
        badge="Reglas Oficiales del Proyecto"
      >
        <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 16 }}>
          Criterios rectores de patronaje, sastrería y distribución cromática que gobiernan todas las sugerencias del motor inteligente y del Oráculo:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {/* Card 1: The Persona */}
          <div style={{ padding: 14, borderRadius: 'var(--r-md)', background: 'var(--surface-3)', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 6 }}>
              1. The Persona (Contexto Real)
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>
              <li><strong>Estatura:</strong> ~6'6" (1.98 m) con proporciones de extremidades largas.</li>
              <li><strong>Complexión:</strong> Atlética (espalda ancha, pecho definido, torso proporcionado).</li>
              <li><strong>Tono de piel:</strong> Moreno / oscuro (máximo provecho de contrastes altos y paletas profundas).</li>
              <li><strong>Clima:</strong> Cálido / tropical (tejidos transpirables: lino mezclado, algodón medio, piqué, seersucker).</li>
            </ul>
          </div>

          {/* Card 2: Principios Rectores */}
          <div style={{ padding: 14, borderRadius: 'var(--r-md)', background: 'var(--surface-3)', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 6 }}>
              2. Principios Rectores & Lógica de Negocio
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>
              <li><strong>Ajuste sobre Marca:</strong> Tallas Tall, Long o Athletic Tall. Prohibido talla ancha para ganar largo.</li>
              <li><strong>Regla 3:1 de Versatilidad:</strong> Cada prenda debe enlazar con mínimo 3 piezas existentes.</li>
              <li><strong>Fórmula de Estilo:</strong> Dos neutros + Un color con personalidad + Calzado limpio.</li>
            </ul>
          </div>

          {/* Card 3: Modelo 60-30-10 */}
          <div style={{ padding: 14, borderRadius: 'var(--r-md)', background: 'var(--surface-3)', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 6 }}>
              3. Distribución Cromática 60-30-10
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div><strong>60% Neutros Base:</strong> Azul marino, crema, blanco roto, gris carbón, beige piedra, camel.</div>
              <div><strong>30% Secundarios:</strong> Verde oliva, chocolate, tabaco, azul petróleo.</div>
              <div><strong>10% Acentos:</strong> Terracota, borgoña, verde esmeralda, rosa empolvado.</div>
            </div>
          </div>

          {/* Card 4: Sastrería & Proporción */}
          <div style={{ padding: 14, borderRadius: 'var(--r-md)', background: 'var(--surface-3)', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 6 }}>
              4. Directrices de Sastrería & Proporción
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>
              <li><strong>Camisetas / Polos:</strong> Costura exacta en hombro, torso largo y manga a mitad del bíceps.</li>
              <li><strong>Pantalones:</strong> Tiro medio o alto, corte athletic taper o recto moderno (no skinny).</li>
              <li><strong>Blazer:</strong> Debe cubrir el asiento por completo, con solapa mediana y cintura marcada.</li>
              <li><strong>Sobrecamisa:</strong> Cuello camisero estructurado, doble bolsillo con solapa, abierta sobre polo/remera.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ── NUEVA SECCIÓN: Optimizador de Paleta Tierra & Colorimetría Facial ── */}
      <Section
        icon={<IconSparkles size={18} />}
        title="Optimizador de Paleta Tierra & Colorimetría Facial"
        badge={`${earthAnalysis.affinityScore}% Afinidad`}
      >
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>
                Tono analizado: {earthAnalysis.skinName}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2 }}>
                {earthAnalysis.melaninCategory} · Subtono: <strong>{earthAnalysis.recommendedUndertone}</strong>
              </div>
            </div>

            {/* Si el tono analizado difiere del perfil actual, permitir guardarlo */}
            {analyzedSkin !== skin && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleApplySkinToProfile}
                style={{ fontSize: 12, padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                {saveSuccess ? <><IconCheck size={14} /> Tono guardado</> : 'Aplicar a mi perfil'}
              </button>
            )}
          </div>

          {/* Selector de tonos de piel para interactividad */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {(Object.entries(SKINS) as [SkinTone, { name: string; hex: string }][]).map(([key, item]) => {
              const isSelected = analyzedSkin === key;
              const isProfileSkin = skin === key;
              return (
                <button
                  key={key}
                  onClick={() => setAnalyzedSkin(key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    borderRadius: 'var(--r-md)',
                    border: isSelected ? '2px solid var(--accent)' : '1px solid var(--line)',
                    background: isSelected ? 'rgba(255, 90, 38, 0.12)' : 'var(--surface-3)',
                    color: isSelected ? 'var(--accent)' : 'var(--ink)',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: isSelected ? 800 : 500,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: item.hex,
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'inline-block'
                    }}
                  />
                  <span>{item.name}</span>
                  {isProfileSkin && (
                    <span style={{ fontSize: 10, opacity: 0.65, fontWeight: 400 }}>· Tu perfil</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tarjeta de Rationale Científico Biomecánico */}
          <div style={{
            background: 'rgba(255, 90, 38, 0.06)',
            border: '1px solid rgba(255, 90, 38, 0.25)',
            borderRadius: 'var(--r-lg)',
            padding: 18,
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--accent)', fontWeight: 800, fontSize: 13 }}>
              <IconShieldCheck size={16} /> Diagnóstico de Refracción Facial
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
              {earthAnalysis.scientificRationale}
            </p>
          </div>

          {/* Tarjeta Hero: Tono Héroe para el Rostro */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-3)',
            borderRadius: 'var(--r-lg)',
            padding: 16,
            marginBottom: 22,
            border: '1px solid var(--line)',
            flexWrap: 'wrap',
            gap: 14
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--r-md)',
                  background: earthAnalysis.heroColor.hex,
                  border: '2px solid rgba(255,255,255,0.15)',
                  boxShadow: 'var(--shadow-sm)',
                  flexShrink: 0
                }}
              />
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Tono Héroe Facial Recomendado
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--ink)', marginTop: 2 }}>
                  {earthAnalysis.heroColor.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2 }}>
                  {earthAnalysis.heroColor.harmonyReason}
                </div>
              </div>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleCopyHex(earthAnalysis.heroColor.hex)}
              style={{ fontSize: 12, padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              {copiedHex === earthAnalysis.heroColor.hex ? (
                <><IconCheck size={14} /> Copiado</>
              ) : (
                <>{earthAnalysis.heroColor.hex} · Copiar HEX</>
              )}
            </button>
          </div>

          {/* Muestrario de Tonos Tierra Optimizados */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
              Gama de Tierras Optimizada ({earthAnalysis.earthSwatches.length} tonos)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {earthAnalysis.earthSwatches.map((swatch) => {
                const isHero = swatch.id === earthAnalysis.heroColor.id;
                return (
                  <div
                    key={swatch.id}
                    style={{
                      background: isHero ? 'rgba(255, 90, 38, 0.08)' : 'var(--surface-3)',
                      border: isHero ? '1px solid rgba(255, 90, 38, 0.35)' : '1px solid var(--line)',
                      borderRadius: 'var(--r-md)',
                      padding: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: swatch.hex,
                            border: '1px solid rgba(255,255,255,0.12)'
                          }}
                        />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>
                            {swatch.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                            {swatch.hex}
                          </div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--r-full)',
                          background: swatch.role.includes('Acento') ? 'rgba(255, 90, 38, 0.15)' : 'rgba(255,255,255,0.06)',
                          color: swatch.role.includes('Acento') ? 'var(--accent)' : 'var(--ink-2)'
                        }}
                      >
                        {swatch.role}
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.45 }}>
                      {swatch.harmonyReason}
                    </div>

                    <div style={{
                      fontSize: 11,
                      color: 'var(--ink-3)',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      paddingTop: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <IconTop size={13} /> {swatch.facialProximity}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fórmula Cápsula Sugerida con estos tonos */}
          <div style={{
            background: 'var(--surface-3)',
            borderRadius: 'var(--r-lg)',
            padding: 18,
            marginBottom: 20,
            border: '1px solid var(--line)'
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>
              Fórmula de Outfit Cápsula Sugerida
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {earthAnalysis.formulaOutfit.map((piece, i) => (
                <div key={i} style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 'var(--r-sm)', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-3)', textTransform: 'uppercase' }}>
                      {piece.category}
                    </span>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: piece.colorHex, border: '1px solid rgba(255,255,255,0.2)' }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
                    {piece.colorName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2 }}>
                    {piece.garmentName}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 6, lineHeight: 1.4 }}>
                    {piece.roleDescription}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tonos a Evitar & Consejos Pro */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            <div style={{ background: 'rgba(255,59,48,0.06)', borderRadius: 'var(--r-md)', padding: 16, border: '1px solid rgba(255,59,48,0.18)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Tonos de tierra a evitar
              </div>
              {earthAnalysis.avoidColors.map((avoid, idx) => (
                <div key={idx} style={{ marginBottom: 10, fontSize: 12, lineHeight: 1.45 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--ink)' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: avoid.hex, display: 'inline-block' }} />
                    {avoid.name}
                  </div>
                  <div style={{ color: 'var(--ink-3)', marginTop: 2 }}>
                    · {avoid.reason}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--surface-3)', borderRadius: 'var(--r-md)', padding: 16, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <IconTag size={13} /> Consejos de Estilismo Facial
              </div>
              {earthAnalysis.proTips.map((tip, idx) => (
                <div key={idx} style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 8 }}>
                  • {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Sección 0: Paleta Asignada ── */}
      <Section icon={<IconPalette size={18} />} title={`Tu paleta cromática general: ${palette.main.name}`}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 8 }}>{palette.main.style}</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {palette.main.colors.map((c, i) => (
              <div key={i} style={{
                flex: 1, height: 44, borderRadius: 8, background: c,
                border: '2px solid rgba(255,255,255,0.08)'
              }} />
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, borderLeft: '3px solid var(--accent)', paddingLeft: 12 }}>
            {palette.main.combination}
          </div>
        </div>

        {palette.star && (
          <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 'var(--r-md)', background: 'rgba(255, 90, 38, 0.08)', border: '1px solid rgba(255, 90, 38, 0.25)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconStar size={14} /> Paleta Estrella — {palette.star.name}
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              {palette.star.colors.map((c, i) => (
                <div key={i} style={{ flex: 1, height: 32, borderRadius: 6, background: c }} />
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{palette.star.description}</div>
          </div>
        )}
      </Section>

      {/* ── Sección 1: Colores de Poder ── */}
      <Section icon={<IconSparkles size={18} />} title="Colores de alto impacto">
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--success)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
            Colores recomendados
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            {dna.skin.powerHex.map((hex, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: hex, border: '2px solid rgba(255,255,255,0.1)' }} />
                <div style={{ fontSize: 10, color: 'var(--ink-3)', maxWidth: 44, textAlign: 'center', lineHeight: 1.2 }}>
                  {dna.skin.powerColors[i]}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'rgba(255,59,48,0.06)', borderRadius: 'var(--r-md)', padding: '12px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--danger)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
            Tonos a evitar
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            {dna.skin.avoidHex.map((hex, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: hex, border: '2px solid rgba(255,59,48,0.3)', opacity: 0.7 }} />
                <div style={{ fontSize: 9, color: 'var(--ink-3)', maxWidth: 40, textAlign: 'center', lineHeight: 1.2 }}>
                  {dna.skin.avoidColors[i]}
                </div>
              </div>
            ))}
          </div>
          {dna.skin.avoidColors.map((c, i) => (
            <div key={i} style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.6 }}>· {c}</div>
          ))}
        </div>
      </Section>

      {/* ── Sección 2: Tipo de cuerpo & Cortes ── */}
      <Section icon={<IconTop size={18} />} title={`Cortes biomecánicos (${dna.body.name})`}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Cortes que te favorecen
          </div>
          {dna.body.favorable.map((tip, i) => (
            <div key={i} style={{ fontSize: 13, color: 'var(--ink-2)', padding: '8px 0', borderBottom: '1px solid var(--line)', lineHeight: 1.5 }}>
              {tip}
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(255,59,48,0.06)', borderRadius: 'var(--r-md)', padding: '12px 16px', marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--danger)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Cortes desaconsejados
          </div>
          {dna.body.avoid.map((tip, i) => (
            <div key={i} style={{ fontSize: 12, color: 'var(--ink-3)', padding: '4px 0', lineHeight: 1.5 }}>
              · {tip}
            </div>
          ))}
        </div>
      </Section>

      {/* ── Sección Avatar: Maniquí Biomecánico Personalizable y Probador 3D ── */}
      <div style={{ marginTop: 24, marginBottom: 28 }}>
        <AvatarCustomizer />
      </div>

      {/* ── Personalidad switcher ── */}
      <Section icon={<IconRefresh size={18} />} title="Actualizar arquetipo de estilo">
        <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 16, lineHeight: 1.6 }}>
          Si tu estilo personal evoluciona, actualiza tu arquetipo para calibrar las recomendaciones del motor.
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
                  background: isActive ? 'rgba(255, 90, 38, 0.15)' : 'var(--surface-2)',
                  border: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  cursor: 'pointer', transition: 'all 0.18s'
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, color: isActive ? 'var(--accent)' : 'var(--ink)' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{p.tagline}</div>
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function Section({
  icon,
  title,
  badge,
  children
}: {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>{icon}</span>
          <h2 style={{ fontSize: 16, fontWeight: 800 }}>{title}</h2>
        </div>
        {badge && (
          <span style={{
            fontSize: 11,
            fontWeight: 800,
            color: 'var(--accent)',
            background: 'rgba(255, 90, 38, 0.12)',
            padding: '4px 10px',
            borderRadius: 'var(--r-full)'
          }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-lg)', padding: 20 }}>
        {children}
      </div>
    </div>
  );
}
