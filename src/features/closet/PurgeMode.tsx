import { useState } from 'react';
import type { Garment } from '../../types';
import { IconSparkles, IconTrash, IconCheck, IconClose } from '../../components/Icons';

interface PurgeModeProps {
  garments: Garment[];
  onClose: () => void;
  onPurge: (id: string) => void;
}

export default function PurgeMode({ garments, onClose, onPurge }: PurgeModeProps) {
  const [queue, setQueue] = useState<Garment[]>(() => {
    return [...garments].sort(() => 0.5 - Math.random());
  });

  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);

  const match = queue[0];

  const handleAction = (action: 'keep' | 'purge') => {
    if (!match) return;
    setSwipeDir(action === 'keep' ? 'right' : 'left');

    setTimeout(() => {
      if (action === 'purge') {
        onPurge(match.id);
      }
      setQueue(q => q.slice(1));
      setSwipeDir(null);
    }, 250);
  };

  if (queue.length === 0) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--bg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, color: 'var(--accent)' }}>
          <IconSparkles size={56} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 12 }}>¡Limpieza Completada!</h2>
        <p style={{ color: 'var(--ink-2)', textAlign: 'center', marginBottom: 32, maxWidth: 360, lineHeight: 1.6 }}>
          Has revisado tu clóset. Quedarte solo con lo que realmente usas optimiza tus combinaciones y cuida tu espacio.
        </p>
        <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', maxWidth: 320, minHeight: 48 }}>
          Volver a mi Clóset
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', padding: 24
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 900 }}>Modo Limpieza</h3>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--ink-2)', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, minHeight: 44, padding: '0 8px', cursor: 'pointer' }}
        >
          <IconClose size={18} /> Salir
        </button>
      </div>

      <div style={{ fontSize: 13, color: 'var(--ink-2)', textAlign: 'center', marginBottom: 24 }}>
        Prenda {garments.length - queue.length + 1} de {garments.length}
      </div>

      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '100%', maxWidth: 320, padding: 32,
          background: 'var(--surface-2)', borderRadius: 32,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          border: '1px solid var(--line)',
          transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
          transform: swipeDir === 'left' ? 'translateX(-100vw) rotate(-20deg)' : swipeDir === 'right' ? 'translateX(100vw) rotate(20deg)' : 'translateX(0) rotate(0)',
          opacity: swipeDir ? 0 : 1
        }}>
          {match.imageUrl ? (
            <img
              src={match.imageUrl}
              alt={match.name}
              style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 24, border: `4px solid ${match.colorHex}` }}
            />
          ) : (
            <div style={{
              width: 120, height: 120, borderRadius: '50%', background: match.colorHex,
              marginBottom: 24, border: '4px solid rgba(255,255,255,0.15)'
            }} />
          )}
          <h2 style={{ fontSize: 22, fontWeight: 800, textAlign: 'center', marginBottom: 6 }}>{match.name}</h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{match.colorName} · {match.type}</p>
        </div>
      </div>

      {/* Acciones */}
      <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
        <button
          onClick={() => handleAction('purge')}
          disabled={swipeDir !== null}
          style={{
            flex: 1, padding: '18px', borderRadius: 24,
            background: 'rgba(255, 59, 48, 0.12)', color: 'var(--danger)',
            border: '2px solid rgba(255, 59, 48, 0.3)',
            fontSize: 14, fontWeight: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            minHeight: 64, cursor: 'pointer'
          }}
        >
          <IconTrash size={24} />
          Purgar
        </button>
        <button
          onClick={() => handleAction('keep')}
          disabled={swipeDir !== null}
          style={{
            flex: 1, padding: '18px', borderRadius: 24,
            background: 'rgba(26, 224, 95, 0.12)', color: 'var(--success)',
            border: '2px solid rgba(26, 224, 95, 0.3)',
            fontSize: 14, fontWeight: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            minHeight: 64, cursor: 'pointer'
          }}
        >
          <IconCheck size={24} />
          Conservar
        </button>
      </div>
    </div>
  );
}
