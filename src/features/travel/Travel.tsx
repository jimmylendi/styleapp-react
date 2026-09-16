import { useState } from 'react';
import { useStore } from '../../lib/store';
import { generatePackingList } from '../../lib/travel';

export default function Travel() {
    const garments = useStore(s => s.garments);
    const [days, setDays] = useState(3);
    const [climate, setClimate] = useState<'calido' | 'frio'>('calido');
    const [suitcase, setSuitcase] = useState<ReturnType<typeof generatePackingList> | null>(null);

    const handlePack = () => {
        if (garments.length < 5) return alert('Debes tener al menos 5 prendas en tu clóset para usar el Asistente de Viaje.');
        setSuitcase(generatePackingList(garments, days, climate));
    };

    const renderPiece = (g: any) => (
        <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: g.colorHex }} />
            <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{g.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-2)' }}>{g.type}</div>
            </div>
        </div>
    );

    return (
        <div>
            <div className="ed-label" style={{ marginBottom: 12 }}>Asistente Inteligente</div>
            <h1 className="ed-title">Viajes</h1>

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
                    <button onClick={() => setClimate('frio')} className={`btn ${climate === 'frio' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}>❄️ Frío</button>
                </div>

                <button className="btn btn-primary btn-xl" style={{ width: '100%' }} onClick={handlePack}>🧳 Preparar Maleta</button>
            </div>

            {suitcase && (
                <div style={{ marginTop: 40 }}>
                    <div style={{ background: 'rgba(26, 224, 95, 0.1)', color: 'var(--success)', padding: 16, borderRadius: 'var(--r-md)', marginBottom: 24, fontWeight: 700 }}>
                        ¡Increíble! Con estas {suitcase.tops.length + suitcase.bottoms.length + suitcase.shoes.length + suitcase.layers.length} prendas
                        puedes hacer {suitcase.totalCombinations} combinaciones diferentes. No necesitas llevar más.
                    </div>

                    <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Tops ({suitcase.tops.length})</h3>
                    <div style={{ marginBottom: 24 }}>{suitcase.tops.map(renderPiece)}</div>

                    <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Pantalones ({suitcase.bottoms.length})</h3>
                    <div style={{ marginBottom: 24 }}>{suitcase.bottoms.map(renderPiece)}</div>

                    <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Calzado ({suitcase.shoes.length})</h3>
                    <div style={{ marginBottom: 24 }}>{suitcase.shoes.map(renderPiece)}</div>

                    {suitcase.layers.length > 0 && (
                        <>
                            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Capas ({suitcase.layers.length})</h3>
                            <div style={{ marginBottom: 24 }}>{suitcase.layers.map(renderPiece)}</div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
