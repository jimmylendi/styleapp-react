import { useState } from 'react';
import { useStore } from '../../lib/store';
import { BUILDS, SKINS, CLIMATES, HEIGHT_METRIC, HEIGHT_IMPERIAL } from '../../lib/data';
import { assignPalette } from '../../lib/palettes';
import { PERSONALITIES } from '../../lib/personality';
import type { BodyBuild, SkinTone, Climate, HeightUnit, StylePersonality } from '../../types';

const STEPS = [1, 2, 3, 4, 5, 6];

export default function Onboarding() {
  const setProfile = useStore((s) => s.setProfile);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [height, setHeight] = useState('195');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('metric');
  const [build, setBuild] = useState<BodyBuild>('atletico');
  const [skin, setSkin] = useState<SkinTone>('morena');
  const [climate, setClimate] = useState<Climate>('calido');
  const [personality, setPersonality] = useState<StylePersonality>('casual');

  const next = () => setStep((s) => Math.min(6, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const finish = () => {
    setProfile({ name: name || 'amigo', height, heightUnit, build, skin, climate, stylePersonality: personality });
    completeOnboarding();
  };

  const changeUnit = (unit: HeightUnit) => {
    setHeightUnit(unit);
    setHeight(unit === 'metric' ? '195' : '196');
  };

  const assignment = assignPalette(skin, 'neutro', build, personality);

  return (
    <div className="ob">
      <div className="ob__progress">
        {STEPS.map((n) => (
          <span key={n} className={`ob__dot ${step >= n ? 'is-active' : ''}`} />
        ))}
      </div>

      <div className="ob__body">
        {/* ── Step 1: Bienvenida ── */}
        {step === 1 && (
          <section className="ob__step">
            <div className="ob__emoji">✦</div>
            <h1 className="ob__title">Hola.<br />Vamos a<br />vestirte bien.</h1>
            <p className="ob__sub">
              4 minutos para configurar tu perfil de estilo completo.
            </p>
            <div className="ob__actions ob__actions--single">
              <button className="btn btn-primary btn-xl" onClick={next}>Empezar →</button>
            </div>
          </section>
        )}

        {/* ── Step 2: Nombre + Altura ── */}
        {step === 2 && (
          <section className="ob__step">
            <div className="ob__label">Paso 01 / 05</div>
            <h2 className="ob__title">Cuéntame<br />de ti</h2>

            <div className="field">
              <label className="field__label">¿Cómo te llamas?</label>
              <input
                type="text"
                className="input"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <div className="field__head">
                <label className="field__label">¿Cuánto mides?</label>
                <div className="unit-toggle">
                  <button className={`unit-btn ${heightUnit === 'metric' ? 'is-active' : ''}`} onClick={() => changeUnit('metric')}>m</button>
                  <button className={`unit-btn ${heightUnit === 'imperial' ? 'is-active' : ''}`} onClick={() => changeUnit('imperial')}>ft</button>
                </div>
              </div>
              {heightUnit === 'metric' ? (
                <div className="chips">
                  {HEIGHT_METRIC.map((h) => (
                    <button key={h} className={`chip ${height === h ? 'is-active' : ''}`} onClick={() => setHeight(h)}>
                      {(parseInt(h) / 100).toFixed(2)} m
                    </button>
                  ))}
                </div>
              ) : (
                <div className="chips">
                  {HEIGHT_IMPERIAL.map((h) => (
                    <button key={h.cm} className={`chip ${height === h.cm ? 'is-active' : ''}`} onClick={() => setHeight(h.cm)}>
                      {h.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="ob__actions">
              <button className="btn btn-secondary" onClick={prev}>←</button>
              <button className="btn btn-primary" onClick={next}>Continuar →</button>
            </div>
          </section>
        )}

        {/* ── Step 3: Cuerpo ── */}
        {step === 3 && (
          <section className="ob__step">
            <div className="ob__label">Paso 02 / 05</div>
            <h2 className="ob__title">¿Cómo es<br />tu cuerpo?</h2>
            <p className="ob__sub">Esto define qué cortes te favorecen.</p>

            <div className="build-grid">
              {Object.entries(BUILDS).map(([id, info]) => (
                <button
                  key={id}
                  className={`build ${build === id ? 'is-active' : ''}`}
                  onClick={() => setBuild(id as BodyBuild)}
                >
                  <span className="build__icon">{info.icon}</span>
                  <span className="build__title">{info.name}</span>
                  <span className="build__desc">{info.desc}</span>
                </button>
              ))}
            </div>

            <div className="ob__actions">
              <button className="btn btn-secondary" onClick={prev}>←</button>
              <button className="btn btn-primary" onClick={next}>Continuar →</button>
            </div>
          </section>
        )}

        {/* ── Step 4: Piel + Clima ── */}
        {step === 4 && (
          <section className="ob__step">
            <div className="ob__label">Paso 03 / 05</div>
            <h2 className="ob__title">Tu color,<br />tu paleta.</h2>

            <div className="field">
              <label className="field__label">Tono de piel</label>
              <div className="skins">
                {Object.entries(SKINS).map(([id, info]) => (
                  <button
                    key={id}
                    className={`skin ${skin === id ? 'is-active' : ''}`}
                    style={{ background: info.hex }}
                    onClick={() => setSkin(id as SkinTone)}
                    aria-label={info.name}
                  />
                ))}
              </div>
            </div>

            <div className="field">
              <label className="field__label">Clima donde vives</label>
              <div className="chips">
                {Object.entries(CLIMATES).map(([id, cname]) => (
                  <button
                    key={id}
                    className={`chip ${climate === id ? 'is-active' : ''}`}
                    onClick={() => setClimate(id as Climate)}
                  >
                    {cname}
                  </button>
                ))}
              </div>
            </div>

            <div className="ob__actions">
              <button className="btn btn-secondary" onClick={prev}>←</button>
              <button className="btn btn-primary" onClick={next}>Continuar →</button>
            </div>
          </section>
        )}

        {/* ── Step 5: NUEVO — Personalidad de estilo ── */}
        {step === 5 && (
          <section className="ob__step">
            <div className="ob__label">Paso 04 / 05</div>
            <h2 className="ob__title">¿Cuál es<br />tu estilo?</h2>
            <p className="ob__sub">Tu personalidad guía los outfits que te sugerimos.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 8 }}>
              {Object.values(PERSONALITIES).map((p) => {
                const isActive = personality === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPersonality(p.id)}
                    style={{
                      padding: '16px 14px',
                      borderRadius: 'var(--r-lg)',
                      textAlign: 'left',
                      background: isActive ? 'rgba(108,99,255,0.15)' : 'var(--surface-2)',
                      border: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.18s'
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{p.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: isActive ? 'var(--accent)' : 'var(--ink)' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3, lineHeight: 1.4 }}>
                      {p.tagline}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 'var(--r-md)', background: 'var(--surface-2)', border: '1px solid rgba(108,99,255,0.2)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
                {PERSONALITIES[personality].icon} {PERSONALITIES[personality].name}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                {PERSONALITIES[personality].desc}
              </div>
            </div>

            <div className="ob__actions">
              <button className="btn btn-secondary" onClick={prev}>←</button>
              <button className="btn btn-primary" onClick={next}>Continuar →</button>
            </div>
          </section>
        )}

        {/* ── Step 6: Paleta reveal ── */}
        {step === 6 && (
          <section className="ob__step">
            <div className="ob__label">Paso 05 / 05</div>
            <h2 className="ob__title">Tu paleta<br />está lista.</h2>
            <p className="ob__sub">
              Basada en tu tono de piel, complexión y estilo {PERSONALITIES[personality].name.toLowerCase()}.
            </p>

            <div className="palette-reveal">
              <div className="palette-reveal__label">Paleta #{assignment.main.num}</div>
              <div className="palette-reveal__name">{assignment.main.name}</div>
              <div className="palette-reveal__style">{assignment.main.style}</div>
              <div className="palette-reveal__colors">
                {assignment.main.colors.map((c, i) => (
                  <span key={i} className="palette-reveal__swatch" style={{ background: c }} />
                ))}
              </div>
              <div className="palette-reveal__combo">{assignment.main.combination}</div>
            </div>

            {assignment.star && (
              <div className="palette-reveal palette-reveal--star">
                <div className="palette-reveal__badge">★ Estrella</div>
                <div className="palette-reveal__name">{assignment.star.name}</div>
                <div className="palette-reveal__colors">
                  {assignment.star.colors.map((c: string, i: number) => (
                    <span key={i} className="palette-reveal__swatch" style={{ background: c }} />
                  ))}
                </div>
                <div className="palette-reveal__combo">{assignment.star.description}</div>
              </div>
            )}

            <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 'var(--r-md)', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)' }}>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                🧬 Tu ADN de estilo completo estará disponible en la pantalla <strong>ADN</strong> del menú principal.
              </div>
            </div>

            <div className="ob__actions ob__actions--single">
              <button className="btn btn-primary btn-xl" onClick={finish}>
                Entrar a StyleApp →
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}