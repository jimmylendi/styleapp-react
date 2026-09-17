import { useState } from 'react';
import { useStore } from '../../lib/store';
import { assignPalette } from '../../lib/palettes';
import { BUILDS, SKINS } from '../../lib/data';
import { PERSONALITIES } from '../../lib/personality';

/* ── Helpers ── */
function calcStreak(usedOutfits: { date: number }[]): number {
  if (!usedOutfits.length) return 0;
  const days = new Set(
    usedOutfits.map(u => new Date(u.date).toDateString())
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (days.has(d.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export default function Profile() {
  const name = useStore((s) => s.name);
  const height = useStore((s) => s.height);
  const build = useStore((s) => s.build);
  const skin = useStore((s) => s.skin);
  const garments = useStore((s) => s.garments);
  const usedOutfits = useStore((s) => s.usedOutfits);
  const geminiApiKey = useStore((s) => s.geminiApiKey);
  const setGeminiApiKey = useStore((s) => s.setGeminiApiKey);
  const stylePersonality = useStore((s) => s.stylePersonality);
  const reset = useStore((s) => s.reset);

  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);
  const [keySaved, setKeySaved] = useState(false);

  const assignment = assignPalette(skin, 'neutro', build, stylePersonality);
  const streak = calcStreak(usedOutfits);
  const selfieCount = usedOutfits.filter(u => u.imageUrl).length;
  const totalGarments = garments.length;
  const usedCount = usedOutfits.length;

  const usedIds = new Set<string>();
  usedOutfits.forEach((u) => {
    u.key.split('-').forEach(id => usedIds.add(id));
  });
  const neverUsed = garments.filter((g) => !usedIds.has(g.id)).length;

  const achievements = [
    {
      id: 'first', icon: '🏆', title: 'Primer Paso',
      desc: 'Registraste tu primer outfit.',
      unlocked: usedOutfits.length >= 1
    },
    {
      id: 'streak5', icon: '🔥', title: 'Racha Constante',
      desc: 'Registraste al menos 5 outfits.',
      unlocked: usedOutfits.length >= 5
    },
    {
      id: 'streak7', icon: '🌟', title: 'Semana de Fuego',
      desc: '7 días consecutivos con outfit registrado.',
      unlocked: streak >= 7
    },
    {
      id: 'collector', icon: '💎', title: 'Coleccionista',
      desc: '10 prendas o más en el Clóset.',
      unlocked: garments.length >= 10
    },
    {
      id: 'critic', icon: '💅', title: 'Crítico de Moda',
      desc: 'Calificaste 3 outfits o más.',
      unlocked: usedOutfits.filter(u => u.rating).length >= 3
    },
    {
      id: 'minimalist', icon: '🧘', title: 'Minimalista',
      desc: 'Múltiples días con menos de 10 prendas únicas.',
      unlocked: usedIds.size <= 10 && usedOutfits.length >= 5
    },
    {
      id: 'photographer', icon: '📸', title: 'Fotógrafo de Moda',
      desc: '5 selfies de outfit guardadas.',
      unlocked: selfieCount >= 5
    },
  ];

  const handleSaveKey = () => {
    setGeminiApiKey(apiKeyInput.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

  const handleReset = () => {
    if (confirm('¿Borrar todo y empezar de nuevo?')) reset();
  };

  return (
    <div>
      <div className="ed-label" style={{ marginBottom: 12 }}>Yo</div>
      <h1 className="ed-title">{name || 'Tu perfil'}</h1>
      <p style={{ marginTop: 8, color: 'var(--ink-2)', fontSize: 13 }}>
        {BUILDS[build].name} · {(parseInt(height) / 100).toFixed(2)} m · {SKINS[skin].name}
      </p>
      <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 'var(--r-full)', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)' }}>
        <span>{PERSONALITIES[stylePersonality]?.icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{PERSONALITIES[stylePersonality]?.name}</span>
      </div>

      {/* ── Stats ── */}
      <div className="me-stats" style={{ marginTop: 32 }}>
        <div className="me-stat">
          <div className="me-stat__value">{totalGarments}</div>
          <div className="me-stat__label">Prendas</div>
        </div>
        <div className="me-stat">
          <div className="me-stat__value">{usedCount}</div>
          <div className="me-stat__label">Outfits</div>
        </div>
        <div className="me-stat">
          <div className="me-stat__value" style={{ color: streak >= 3 ? 'var(--warn)' : 'inherit' }}>
            {streak > 0 ? `${streak}🔥` : neverUsed}
          </div>
          <div className="me-stat__label">{streak > 0 ? 'Racha' : 'Sin usar'}</div>
        </div>
      </div>

      {/* Streak card */}
      {streak >= 2 && (
        <div style={{
          marginTop: 20, background: 'linear-gradient(135deg, rgba(255,149,0,0.12), rgba(255,59,48,0.12))',
          border: '1px solid rgba(255,149,0,0.25)', borderRadius: 'var(--r-md)', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 16
        }}>
          <span style={{ fontSize: 36 }}>🔥</span>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{streak} días seguidos</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2 }}>
              {streak >= 7 ? '¡Semana de Fuego desbloqueada!' : `${7 - streak} días para la Semana de Fuego`}
            </div>
          </div>
        </div>
      )}

      {/* ── Color Palette ── */}
      <div className="me-section" style={{ marginTop: 32 }}>
        <div className="me-section__title">🎨 Tu paleta asignada</div>

        <div className="palette-card">
          <div className="palette-card__head">
            <div>
              <div className="palette-card__num">Paleta #{assignment.main.num}</div>
              <div className="palette-card__name">{assignment.main.name}</div>
              <div className="palette-card__style">{assignment.main.style}</div>
            </div>
          </div>
          <div className="palette-card__colors">
            {assignment.main.colors.map((c: string, i: number) => (
              <div key={i} className="palette-card__swatch" style={{ background: c }} />
            ))}
          </div>
          <div className="palette-card__combo">{assignment.main.combination}</div>
        </div>

        <div className="me-section__title" style={{ marginTop: 24 }}>También te favorecen</div>
        {assignment.alternatives.map((p) => (
          <div key={p.id} className="palette-mini">
            <div className="palette-mini__colors">
              {p.colors.map((c: string, i: number) => (
                <div key={i} className="palette-mini__swatch" style={{ background: c }} />
              ))}
            </div>
            <div className="palette-mini__name">
              {p.name}<span className="palette-mini__style">{p.style}</span>
            </div>
          </div>
        ))}

        {assignment.star && (
          <>
            <div className="me-section__title" style={{ marginTop: 24 }}>★ Tu paleta estrella</div>
            <div className="palette-mini palette-mini--star">
              <div className="palette-mini__colors">
                {assignment.star.colors.map((c: string, i: number) => (
                  <div key={i} className="palette-mini__swatch" style={{ background: c }} />
                ))}
              </div>
              <div className="palette-mini__name">
                {assignment.star.name}<span className="palette-mini__style">{assignment.star.bestFor}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Achievements ── */}
      <div className="section" style={{ marginTop: 40 }}>
        <h3 className="section-title">Logros Desbloqueados</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
          {achievements.map(a => (
            <div key={a.id} style={{
              background: a.unlocked ? 'var(--surface-3)' : 'var(--surface-2)',
              opacity: a.unlocked ? 1 : 0.4,
              padding: 16, borderRadius: 'var(--r-md)', textAlign: 'center',
              border: a.unlocked ? '1px solid var(--accent)' : '1px solid transparent',
              boxShadow: a.unlocked ? '0 0 16px rgba(var(--accent-rgb), 0.1)' : 'none'
            }}>
              <div style={{ fontSize: 32, marginBottom: 8, filter: a.unlocked ? 'none' : 'grayscale(1)' }}>{a.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: a.unlocked ? 'var(--ink)' : 'var(--ink-2)' }}>{a.title}</div>
              <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 4 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── API Key Config ── */}
      <div style={{ marginTop: 40, background: 'var(--surface-2)', borderRadius: 'var(--r-lg)', padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 900, marginBottom: 4 }}>✨ Oráculo IA — API Key</h3>
        <p style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 16, lineHeight: 1.6 }}>
          Necesitas una clave de Gemini para usar el Oráculo. Obténla gratis en{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
            style={{ color: 'var(--accent)' }}>
            aistudio.google.com
          </a>
        </p>
        <input
          type="password"
          className="input"
          placeholder="AIzaSy... (pega tu API key aquí)"
          value={apiKeyInput}
          onChange={e => setApiKeyInput(e.target.value)}
          style={{ width: '100%', marginBottom: 12, fontFamily: 'monospace', fontSize: 13 }}
        />
        <button
          className={`btn ${keySaved ? 'btn-secondary' : 'btn-primary'}`}
          onClick={handleSaveKey}
          disabled={!apiKeyInput.trim()}
          style={{ width: '100%' }}
        >
          {keySaved ? '✅ Guardado' : 'Guardar API Key'}
        </button>
        {geminiApiKey && (
          <div style={{ marginTop: 10, fontSize: 11, color: 'var(--success)', textAlign: 'center' }}>
            ✓ API Key configurada · {geminiApiKey.slice(0, 8)}...
          </div>
        )}
      </div>

      {/* ── Danger Zone ── */}
      <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
        <h3 className="section-title" style={{ color: 'var(--danger)', marginBottom: 12 }}>
          Zona de Peligro
        </h3>
        <button className="btn btn-secondary" onClick={handleReset} style={{ width: '100%' }}>
          Reiniciar app
        </button>
      </div>
    </div>
  );
}