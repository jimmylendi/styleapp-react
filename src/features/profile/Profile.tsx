import { useState } from 'react';
import { useStore } from '../../lib/store';
import { assignPalette } from '../../lib/palettes';
import { BUILDS, SKINS, WARDROBE_PREFERENCES } from '../../lib/data';
import { PERSONALITIES } from '../../lib/personality';
import {
  IconDownload,
  IconUpload,
  IconShieldCheck,
  IconCube
} from '../../components/Icons';
import { AvatarMannequin } from '../../components/AvatarMannequin';
import { AvatarCustomizer } from '../../components/AvatarCustomizer';
import type { WardrobePreference } from '../../types';

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
  const stylePersonality = useStore((s) => s.stylePersonality);
  const wardrobePreference = useStore((s) => s.wardrobePreference);
  const avatarHairStyle = useStore((s) => s.avatarHairStyle);
  const avatarHairColor = useStore((s) => s.avatarHairColor);
  const avatarBeard = useStore((s) => s.avatarBeard);
  const setProfile = useStore((s) => s.setProfile);
  const reset = useStore((s) => s.reset);
  const exportWardrobeData = useStore((s) => s.exportWardrobeData);
  const importWardrobeData = useStore((s) => s.importWardrobeData);

  const [importStatus, setImportStatus] = useState<string>('');
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);

  const handleExport = () => {
    const json = exportWardrobeData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `styleapp_respaldo_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = importWardrobeData(reader.result as string);
      if (res.success) {
        setImportStatus('¡Datos importados con éxito!');
      } else {
        setImportStatus(res.error || 'Error al importar datos');
      }
    };
    reader.readAsText(file);
  };


  const assignment = assignPalette(skin, 'neutro', build, stylePersonality);
  const streak = calcStreak(usedOutfits);
  const selfieCount = usedOutfits.filter(u => u.imageUrl).length;
  const totalGarments = garments.length;
  const usedCount = usedOutfits.length;

  const usedIds = new Set<string>();
  usedOutfits.forEach((u) => {
    u.garmentIds.forEach(id => usedIds.add(id));
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

      <div className="me-section" style={{ marginTop: 24 }}>
        <div className="me-section__title">Preferencia de vestimenta</div>
        <p style={{ marginBottom: 12, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>
          Adapta el catálogo, la cápsula y las recomendaciones. No limita las prendas que ya guardaste.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {Object.entries(WARDROBE_PREFERENCES).map(([id, option]) => {
            const active = wardrobePreference === id;
            return (
              <button
                key={id}
                className={`chip ${active ? 'is-active' : ''}`}
                onClick={() => setProfile({ wardrobePreference: id as WardrobePreference })}
                aria-pressed={active}
                title={option.desc}
                style={{ minHeight: 68, whiteSpace: 'normal' }}
              >
                <span style={{ display: 'block', fontSize: 20 }}>{option.icon}</span>
                {option.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Maniquí Avatar 3D de Alta Costura ── */}
      <div className="me-section" style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div className="me-section__title" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, margin: 0 }}>
            <IconCube size={18} style={{ color: 'var(--accent)' }} /> Tu Maniquí Avatar 3D
          </div>
          <button
            type="button"
            onClick={() => setShowCustomizer(v => !v)}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: 12, padding: '6px 14px', borderRadius: 'var(--r-full)' }}
          >
            {showCustomizer ? 'Vista Rápida del Maniquí' : 'Personalizar Rasgos & Probar Outfits'}
          </button>
        </div>

        {showCustomizer ? (
          <AvatarCustomizer showTitle={false} />
        ) : (
          <>
            <p style={{ marginBottom: 16, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              Representación volumétrica calibrada según tu silueta ({BUILDS[build]?.name || build}), tono de piel ({SKINS[skin]?.name || skin}) y estilo personal.
            </p>

            <div style={{
              background: 'linear-gradient(180deg, var(--surface-3) 0%, var(--surface-2) 100%)',
              borderRadius: 'var(--r-xl)',
              padding: '20px 16px',
              border: '1px solid rgba(255, 90, 38, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <AvatarMannequin
                skin={skin}
                build={build}
                preference={wardrobePreference}
                hairStyle={avatarHairStyle}
                hairColor={avatarHairColor}
                beard={avatarBeard}
                size={340}
                allowControls={true}
              />
              <button
                type="button"
                onClick={() => setShowCustomizer(true)}
                className="btn btn-primary btn-sm"
                style={{ marginTop: 14, fontSize: 12, padding: '8px 18px' }}
              >
                Abrir Estudio de Personalización y Probador
              </button>
            </div>
          </>
        )}
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

      {/* ── Secure AI status ── */}
      <div style={{ marginTop: 40, background: 'var(--surface-2)', borderRadius: 'var(--r-lg)', padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 900, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconShieldCheck size={18} style={{ color: 'var(--success)' }} /> Oráculo IA seguro
        </h3>
        <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>
          La clave de inteligencia artificial se administra en el servidor y nunca se expone en este dispositivo.
        </p>
      </div>

      {/* ── Copia de Seguridad & Datos ── */}
      <div style={{ marginTop: 24, background: 'var(--surface-2)', borderRadius: 'var(--r-lg)', padding: 24, border: '1px solid var(--line)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 900, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconDownload size={18} /> Copia de Seguridad y Datos
        </h3>
        <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 16 }}>
          Descarga un archivo JSON con todo tu armario, perfil e historial para respaldar tu información o sincronizarla con otro dispositivo.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button className="btn btn-secondary" onClick={handleExport} style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44 }}>
            <IconDownload size={16} /> Exportar copia
          </button>
          <label className="btn btn-secondary" style={{ fontSize: 13, textAlign: 'center', cursor: 'pointer', overflow: 'hidden', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44 }}>
            <IconUpload size={16} /> Importar copia
            <input type="file" accept=".json,application/json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
        {importStatus && (
          <div style={{ marginTop: 12, fontSize: 12, color: importStatus.includes('éxito') ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
            {importStatus}
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
