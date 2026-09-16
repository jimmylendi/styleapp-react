import { useState } from 'react';
import { useStore } from '../../lib/store';
import { OCCASIONS } from '../../lib/data';
import type { FeedbackRating, Garment } from '../../types';

export default function History() {
    const [tab, setTab] = useState<'timeline' | 'stats'>('timeline');
    const usedOutfits = useStore((s) => s.usedOutfits);
    const garments = useStore((s) => s.garments);
    const rateOutfit = useStore((s) => s.rateOutfit);

    // To render garments from keys, we need the profile to run the generator briefly,
    // or simply reconstruct the outfit. Actually, since key format is T-B-S or T-B-S-L,
    // we can reconstruct it just by splitting the key and finding the garments!

    const renderOutfitSummary = (key: string) => {
        const ids = key.split('-');
        const parts = ids.map(id => garments.find(g => g.id === id)).filter(Boolean) as Garment[];

        return (
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {parts.map(p => (
                    <div
                        key={p.id}
                        style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: p.colorHex, border: '2px solid rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16
                        }}
                        title={p.name}
                    >
                        {/* Fallback to simple first letter if no icon, or we could look up the generic icon by type */}
                    </div>
                ))}
            </div>
        );
    };

    const sortedOutfits = [...usedOutfits].sort((a, b) => b.date - a.date);

    const RatingButton = ({ id, current, type, icon }: { id: string, current?: FeedbackRating, type: FeedbackRating, icon: string }) => {
        const isActive = current === type;
        return (
            <button
                onClick={() => rateOutfit(id, type)}
                style={{
                    background: isActive ? 'var(--accent)' : 'var(--surface-3)',
                    opacity: isActive ? 1 : 0.6,
                    padding: '6px 12px', borderRadius: 20, fontSize: 16,
                    border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                    display: 'flex', alignItems: 'center', gap: 4
                }}
            >
                {icon}
            </button>
        );
    };

    return (
        <div>
            <div className="ed-label" style={{ marginBottom: 12 }}>Rastreo Diario</div>
            <h1 className="ed-title">Historial</h1>

            <div style={{ display: 'flex', gap: 8, marginTop: 20, marginBottom: 24, background: 'var(--surface-2)', padding: 4, borderRadius: 'var(--r-full)' }}>
                <button
                    className="btn"
                    style={{ flex: 1, padding: 8, background: tab === 'timeline' ? 'var(--surface-3)' : 'transparent', color: tab === 'timeline' ? 'var(--ink)' : 'var(--ink-2)' }}
                    onClick={() => setTab('timeline')}
                >
                    Línea de tiempo
                </button>
                <button
                    className="btn"
                    style={{ flex: 1, padding: 8, background: tab === 'stats' ? 'var(--surface-3)' : 'transparent', color: tab === 'stats' ? 'var(--ink)' : 'var(--ink-2)' }}
                    onClick={() => setTab('stats')}
                >
                    Métricas
                </button>
            </div>

            {
                tab === 'timeline' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {sortedOutfits.length === 0 ? (
                            <p style={{ color: 'var(--ink-2)', textAlign: 'center', marginTop: 40 }}>
                                Aún no has marcado ningún outfit como usado.
                            </p>
                        ) : (
                            sortedOutfits.map(u => {
                                const occ = OCCASIONS.find(o => o.id === u.occasion);
                                const dateStr = new Date(u.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

                                return (
                                    <div key={u.id} style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 'var(--r-md)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', textTransform: 'capitalize' }}>
                                                {dateStr}
                                            </div>
                                            <div style={{ fontSize: 12, background: 'var(--surface-3)', padding: '4px 8px', borderRadius: 12 }}>
                                                {occ?.emoji} {occ?.name}
                                            </div>
                                        </div>

                                        {renderOutfitSummary(u.key)}

                                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>
                                                ¿Cómo te sentiste?
                                            </span>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <RatingButton id={u.id} current={u.rating} type="dislike" icon="👎" />
                                                <RatingButton id={u.id} current={u.rating} type="neutral" icon="➖" />
                                                <RatingButton id={u.id} current={u.rating} type="like" icon="👍" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )
            }

            {
                tab === 'stats' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Tarjeta de métricas generales */}
                        <div style={{ background: 'var(--surface-2)', padding: 20, borderRadius: 'var(--r-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: 13, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>Días registrados</div>
                            <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--accent)', lineHeight: 1.2 }}>{usedOutfits.length}</div>
                        </div>

                        {(() => {
                            const totalVal = garments.reduce((acc, g) => acc + (g.price || 0), 0);
                            return (
                                <div style={{ background: 'var(--surface-2)', padding: '16px 20px', borderRadius: 'var(--r-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 600 }}>Valor de tu Clóset</div>
                                    <div style={{ fontSize: 20, fontWeight: 800 }}>${totalVal}</div>
                                </div>
                            );
                        })()}

                        <div className="ed-label">🔥 Prendas Estrella (CPW)</div>

                        <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {(() => {
                                if (usedOutfits.length === 0) return <div style={{ color: 'var(--ink-2)', fontSize: 13 }}>Sin datos suficientes.</div>;

                                // Build usage map
                                const counts: Record<string, number> = {};
                                usedOutfits.forEach(u => {
                                    const parts = u.key.split('-');
                                    parts.forEach(id => {
                                        counts[id] = (counts[id] || 0) + 1;
                                    });
                                });

                                const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
                                const maxCount = sortedCounts[0]?.[1] || 1;

                                return sortedCounts.map(([id, count]) => {
                                    const g = garments.find(g => g.id === id);
                                    if (!g) return null;
                                    const percentage = (count / maxCount) * 100;
                                    const cpw = g.price ? (g.price / count).toFixed(2) : '--';

                                    return (
                                        <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 8, background: g.colorHex, flexShrink: 0 }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                                                    <span>{g.name}</span>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div>{count} usos</div>
                                                        <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>${cpw} / uso</div>
                                                    </div>
                                                </div>
                                                <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${percentage}%`, background: 'var(--accent)', borderRadius: 3, transition: 'width 1s var(--ease)' }} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                )
            }
        </div>
    );
}
