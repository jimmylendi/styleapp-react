import { useState } from 'react';
import { useStore } from '../../lib/store';
import type { Garment } from '../../types';

interface PurgeModeProps {
    onClose: () => void;
}

export default function PurgeMode({ onClose }: PurgeModeProps) {
    const garments = useStore(s => s.garments);
    const usedOutfits = useStore(s => s.usedOutfits);
    const removeGarment = useStore(s => s.removeGarment);

    // Calculate usage
    const usageCounts = garments.reduce((acc, g) => {
        acc[g.id] = 0;
        return acc;
    }, {} as Record<string, number>);

    usedOutfits.forEach(u => {
        const ids = u.key.split('-'); // Top-Bottom-Shoe-Layer
        ids.forEach(id => {
            if (usageCounts[id] !== undefined) {
                usageCounts[id]++;
            }
        });
    });

    // Sort by lowest usage first
    const [candidates, setCandidates] = useState<Garment[]>(() => {
        return [...garments].sort((a, b) => usageCounts[a.id] - usageCounts[b.id]);
    });

    const currentGarment = candidates[0];

    const handleAction = (id: string, action: 'keep' | 'delete') => {
        if (action === 'delete') {
            removeGarment(id);
        }
        setCandidates(prev => prev.slice(1));
    };

    if (!currentGarment) {
        return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bg)', display: 'flex', flexDirection: 'column', padding: 24, paddingBottom: 100 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>✨</div>
                    <h2 style={{ fontSize: 24, fontWeight: 900, textAlign: 'center' }}>¡Clóset Purificado!</h2>
                    <p style={{ color: 'var(--ink-2)', textAlign: 'center', marginTop: 8 }}>Has revisado todas tus prendas.</p>
                </div>
                <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', padding: 16 }}>Volver al Clóset</button>
            </div>
        );
    }

    const usages = usageCounts[currentGarment.id] || 0;
    const cpw = currentGarment.price && usages > 0 ? (currentGarment.price / usages).toFixed(2) : currentGarment.price?.toFixed(2) || '0.00';

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bg)', display: 'flex', flexDirection: 'column', padding: 24, paddingTop: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink-3)', letterSpacing: 1 }}>Modo Purga</div>
                    <div style={{ fontSize: 20, fontWeight: 900 }}>Ordenando Clóset</div>
                </div>
                <button onClick={onClose} style={{ padding: 8, background: 'var(--surface-2)', borderRadius: '50%', width: 40, height: 40, display: 'grid', placeItems: 'center' }}>✕</button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <div style={{ width: '100%', maxWidth: 320, background: 'var(--surface)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--line)', overflow: 'hidden', transition: 'transform 0.3s ease' }}>
                    <div style={{ height: 280, background: currentGarment.colorHex, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        {usages === 0 && <span style={{ position: 'absolute', top: 16, right: 16, background: 'var(--danger)', color: '#fff', fontSize: 11, fontWeight: 900, padding: '4px 12px', borderRadius: 12 }}>Nunca usada</span>}
                    </div>

                    <div style={{ padding: 24 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', textTransform: 'uppercase' }}>{currentGarment.type}</div>
                        <h3 style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>{currentGarment.name}</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)' }}>Veces Usada</div>
                                <div style={{ fontSize: 16, fontWeight: 800 }}>{usages}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)' }}>Costo x Uso</div>
                                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>${cpw}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 16, marginTop: 40, width: '100%', maxWidth: 320 }}>
                    <button onClick={() => handleAction(currentGarment.id, 'delete')} style={{ flex: 1, background: 'var(--surface-2)', color: 'var(--danger)', padding: 20, borderRadius: 'var(--r-full)', fontSize: 28, transition: 'transform 0.2s', boxShadow: 'var(--shadow-md)' }}>
                        🗑️
                    </button>
                    <button onClick={() => handleAction(currentGarment.id, 'keep')} style={{ flex: 1, background: 'rgba(26, 224, 95, 0.15)', color: 'var(--success)', padding: 20, borderRadius: 'var(--r-full)', fontSize: 28, transition: 'transform 0.2s', boxShadow: 'var(--shadow-md)' }}>
                        💚
                    </button>
                </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-3)', marginBottom: 20 }}>
                {candidates.length} prendas por revisar (ordenadas por menos uso)
            </div>
        </div>
    );
}
