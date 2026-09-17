import { useState } from 'react';
import { useStore } from '../../lib/store';
import { generatePackingList } from '../../lib/travel';
import type { Climate, PackingItem, PackingList } from '../../types';

export default function Travel() {
    const garments = useStore(s => s.garments);
    const activeTrip = useStore(s => s.activeTrip);
    const startTrip = useStore(s => s.startTrip);
    const endTrip = useStore(s => s.endTrip);
    const togglePackedItem = useStore(s => s.togglePackedItem);

    const [days, setDays] = useState(3);
    const [climate, setClimate] = useState<Climate>('calido');

    const handlePack = () => {
        if (garments.length < 5) return alert('Debes tener al menos 5 prendas en tu clóset para usar el Asistente de Viaje.');
        const suitcase = generatePackingList(garments, days, climate);
        startTrip(suitcase);
    };

    const renderPiece = (item: PackingItem, category: keyof Omit<PackingList, 'days' | 'climate' | 'totalCombinations'>) => {
        const g = garments.find(g => g.id === item.garmentId);
        if (!g) return null;

        return (
            <button
                key={g.id}
                className="checklist-btn"
                onClick={() => togglePackedItem(g.id, category)}
                style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
                    width: '100%', textAlign: 'left',
                    background: item.packed ? 'rgba(26, 224, 95, 0.05)' : 'transparent',
                    borderBottom: '1px solid var(--line)',
                    opacity: item.packed ? 0.6 : 1,
                    transition: 'all 0.2s'
                }}
            >
                <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    border: item.packed ? 'none' : '2px solid var(--line)',
                    background: item.packed ? 'var(--success)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 12
                }}>
                    {item.packed && '✓'}
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: g.colorHex }} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, textDecoration: item.packed ? 'line-through' : 'none' }}>{g.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-2)' }}>{g.type}</div>
                </div>
            </button>
        );
    };

    const getProgress = () => {
        if (!activeTrip) return { curr: 0, total: 1 };
        const totalItems = [...activeTrip.tops, ...activeTrip.bottoms, ...activeTrip.shoes, ...activeTrip.layers];
        const packed = totalItems.filter(i => i.packed).length;
        return { curr: packed, total: totalItems.length };
    };

    return (
        <div>
            <div className="ed-label" style={{ marginBottom: 12 }}>Asistente Inteligente</div>
            <h1 className="ed-title">Viajes</h1>

            {!activeTrip ? (
                <div style={{ background: 'var(--surface-2)', padding: 24, borderRadius: 'var(--r-xl)', marginTop: 24 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>¿Cuántos días te vas?</div>
                    <input
                        type="range"
                        min="1"
                        max="14"
                        value={days}
                        onChange={e => setDays(Number(e.target.value))}
                        style={{ width: '100%', marginBottom: 16 }}
                    />
                    <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent)', textAlign: 'center', marginBottom: 24 }}>{days} días</div>

                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Clima de tu destino</div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                        <button onClick={() => setClimate('calido')} className={`btn ${climate === 'calido' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}>☀️ Cálido</button>
                        <button onClick={() => setClimate('templado')} className={`btn ${climate === 'templado' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}>⛅ Templado</button>
                        <button onClick={() => setClimate('frio')} className={`btn ${climate === 'frio' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}>❄️ Frío</button>
                    </div>

                    <button className="btn btn-primary btn-xl" style={{ width: '100%' }} onClick={handlePack}>🧳 Preparar Maleta</button>
                </div>
            ) : (
                <div style={{ marginTop: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 800 }}>Tu checklist de equipaje</div>
                            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{activeTrip.days} días en clima {activeTrip.climate}</div>
                        </div>
                        <button className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }} onClick={endTrip}>Desempacar</button>
                    </div>

                    <div style={{ background: 'var(--surface-2)', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                        <div style={{ background: 'var(--success)', height: '100%', width: `${(getProgress().curr / getProgress().total) * 100}%`, transition: 'width 0.3s' }} />
                    </div>
                    <div style={{ fontSize: 11, textAlign: 'right', color: 'var(--ink-2)', marginBottom: 24 }}>
                        {getProgress().curr} de {getProgress().total} empacado
                    </div>

                    <div style={{ background: 'rgba(26, 224, 95, 0.1)', color: 'var(--success)', padding: 16, borderRadius: 'var(--r-md)', marginBottom: 24, fontWeight: 700 }}>
                        ¡Increíble! Con estas {getProgress().total} prendas puedes hacer {activeTrip.totalCombinations} combinaciones. No necesitas llevar más.
                    </div>

                    <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Tops ({activeTrip.tops.length})</h3>
                    <div style={{ marginBottom: 24 }}>{activeTrip.tops.map(i => renderPiece(i, 'tops'))}</div>

                    <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Pantalones ({activeTrip.bottoms.length})</h3>
                    <div style={{ marginBottom: 24 }}>{activeTrip.bottoms.map(i => renderPiece(i, 'bottoms'))}</div>

                    <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Calzado ({activeTrip.shoes.length})</h3>
                    <div style={{ marginBottom: 24 }}>{activeTrip.shoes.map(i => renderPiece(i, 'shoes'))}</div>

                    {activeTrip.layers.length > 0 && (
                        <>
                            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Capas ({activeTrip.layers.length})</h3>
                            <div style={{ marginBottom: 24 }}>{activeTrip.layers.map(i => renderPiece(i, 'layers'))}</div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
