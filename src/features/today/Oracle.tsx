import { useState } from 'react';
import { useStore } from '../../lib/store';
import { askOracle } from '../../lib/ai';

export default function Oracle() {
    const garments = useStore(s => s.garments);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [outfit, setOutfit] = useState<any>(null); // The raw IDs returned by AI

    const handleAsk = async () => {
        if (!prompt.trim() || garments.length === 0) return;
        setLoading(true);
        setError(null);
        setOutfit(null);
        try {
            const result = await askOracle(prompt, garments);
            setOutfit(result);
        } catch (e: any) {
            setError(e.message || "Error al contactar al Oráculo.");
        } finally {
            setLoading(false);
        }
    };

    const renderPiece = (id: string) => {
        if (!id) return;
        const g = garments.find(g => g.id === id);
        if (!g) return;

        return (
            <div key={g.id} className="outfit-hero__piece" style={{ fontSize: 16 }}>
                <div className="outfit-hero__dot" style={{ background: g.colorHex, width: 24, height: 24, borderRadius: 6 }} />
                <span>{g.name}</span>
            </div>
        );
    };

    return (
        <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-xl)', padding: 24, marginTop: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>✨</span>
                <h3 style={{ fontSize: 16, fontWeight: 900 }}>El Oráculo</h3>
            </div>

            <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 16 }}>
                Describe a dónde vas o cómo te sientes. La Inteligencia Artificial armará el outfit perfecto usando tu clóset.
            </p>

            <div style={{ display: 'flex', gap: 8 }}>
                <input
                    type="text"
                    className="input"
                    placeholder="Ej. Cita casual de noche en invierno..."
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAsk()}
                    disabled={loading}
                    style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--r-full)' }}
                />
                <button
                    className="btn btn-primary"
                    onClick={handleAsk}
                    disabled={loading}
                    style={{ padding: '0 24px', borderRadius: 'var(--r-full)' }}
                >
                    {loading ? '...' : 'Preguntar'}
                </button>
            </div>

            {error && <div style={{ marginTop: 16, color: 'var(--danger)', fontSize: 13, fontWeight: 600 }}>{error}</div>}

            {outfit && (
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Sugerencia Divina</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {renderPiece(outfit.top)}
                        {renderPiece(outfit.layer)}
                        {renderPiece(outfit.bottom)}
                        {renderPiece(outfit.shoe)}
                    </div>
                </div>
            )}
        </div>
    );
}
