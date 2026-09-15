import { useState } from 'react';
import { useStore } from '../../lib/store';
import { BUILDS, SKINS, CLIMATES, HEIGHT_METRIC, HEIGHT_IMPERIAL } from '../../lib/data';
import type { BodyBuild, SkinTone, Climate, HeightUnit } from '../../types';

const STEPS = [1, 2, 3, 4, 5];

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

  const next = () => setStep((s) => Math.min(5, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const finish = () => {
    setProfile({
      name: name || 'amigo',
      height,
      heightUnit,
      build,
      skin,
      climate
    });
    completeOnboarding();
  };

  // Reset altura al cambiar de unidad
  const changeUnit = (unit: HeightUnit) => {
    setHeightUnit(unit);
    setHeight(unit === 'metric' ? '195' : '196');
  };

  return (
    <div className="ob">
      <div className="ob__progress">
        {STEPS.map((n) => (
          <span key={n} className={`ob__dot ${step >= n ? 'is-active' : ''}`} />
        ))}
      </div>

      <div className="ob__body">
        {step === 1 && (
          <section className="ob__step">
            <div className="ob__emoji">✦</div>
            <h1 className="ob__title">Hola.<br />Vamos a<br />vestirte bien.</h1>
            <p className="ob__sub">
              3 minutos para configurar tu estilo. Después, la app trabaja por ti.
            </p>
            <div className="ob__actions ob__actions--single">
              <button className="btn btn-primary btn-xl" onClick={next}>Empezar →</button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="ob__step">
            <div className="ob__label">Paso 01 / 04</div>
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
                  <button
                    className={`unit-btn ${heightUnit === 'metric' ? 'is-active' : ''}`}
                    onClick={() => changeUnit('metric')}
                  >
                    m
                  </button>
                  <button
                    className={`unit-btn ${heightUnit === 'imperial' ? 'is-active' : ''}`}
                    onClick={() => changeUnit('imperial')}
                  >
                    ft
                  </button>
                </div>
              </div>

              {heightUnit === 'metric' ? (
                <div className="chips">
                  {HEIGHT_METRIC.map((h) => (
                    <button
                      key={h}
                      className={`chip ${height === h ? 'is-active' : ''}`}
                      onClick={() => setHeight(h)}
                    >
                      {(parseInt(h) / 100).toFixed(2)} m
                    </button>
                  ))}
                </div>
              ) : (
                <div className="chips">
                  {HEIGHT_IMPERIAL.map((h) => (
                    <button
                      key={h.cm}
                      className={`chip ${height === h.cm ? 'is-active' : ''}`}
                      onClick={() => setHeight(h.cm)}
                    >
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

        {step === 3 && (
          <section className="ob__step">
            <div className="ob__label">Paso 02 / 04</div>
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

        {step === 4 && (
          <section className="ob__step">
            <div className="ob__label">Paso 03 / 04</div>
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
                {Object.entries(CLIMATES).map(([id, name]) => (
                  <button
                    key={id}
                    className={`chip ${climate === id ? 'is-active' : ''}`}
                    onClick={() => setClimate(id as Climate)}
                  >
                    {name}
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

        {step === 5 && (
          <section className="ob__step">
            <div className="ob__label">Paso 04 / 04</div>
            <h2 className="ob__title">Tu perfil<br />está listo.</h2>
            <p className="ob__sub">Con esto ya puedo armar tus mejores combinaciones.</p>

            <div className="summary">
              <div className="summary__row">
                <span className="summary__k">Nombre</span>
                <span className="summary__v">{name || 'amigo'}</span>
              </div>
              <div className="summary__row">
                <span className="summary__k">Altura</span>
                <span className="summary__v">
                  {heightUnit === 'metric'
                    ? `${(parseInt(height) / 100).toFixed(2)} m`
                    : `${Math.floor(parseInt(height) / 2.54 / 12)}'${Math.round((parseInt(height) / 2.54) % 12)}"`
                  }
                </span>
              </div>
              <div className="summary__row">
                <span className="summary__k">Constitución</span>
                <span className="summary__v">{BUILDS[build].name}</span>
              </div>
              <div className="summary__row">
                <span className="summary__k">Tono de piel</span>
                <span className="summary__v">{SKINS[skin].name}</span>
              </div>
              <div className="summary__row">
                <span className="summary__k">Clima</span>
                <span className="summary__v">{CLIMATES[climate]}</span>
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