import { useState } from 'react';
import { useStore } from '../../lib/store';
import { askOracle } from '../../lib/ai';

export default function Oracle() {
    const garments = useStore(s => s.garments);
    const geminiApiKey = useStore(s => s.geminiApiKey);
    const build = useStore(s => s.build);
    const skin = useStore(s => s.skin);
    const stylePersonality = useStore(s => s.stylePersonality);

    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [outfitData, setOutfitData] = useState<{ reasoning: string, outfit: any } | null>(null);

    const hasKey = !!(geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY);

    const handleAsk = async () => {
        if (!prompt.trim() || garments.length === 0) return;
        setLoading(true);
        setError(null);
        setOutfitData(null);
        try {
            const profileCtx = { skin, build, stylePersonality };
            const result = await askOracle(prompt, garments, profileCtx, geminiApiKey || undefined);
            setOutfitData(result);
        } catch (e: any) {
            setError(e.message || 'Error al contactar al Oráculo.');
        } finally {
            setLoading(false);
        }
    };

    const renderPiece = (id: string) => {
        if (!id) return null;
        const g = garments.find(g => g.id === id);
        if (!g) return null;
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

            {!hasKey ? (
                <div style={{
                    background: 'rgba(255, 200, 0, 0.08)',
                    border: '1px solid rgba(255, 200, 0, 0.25)',
                    borderRadius: 'var(--r-md)',
                    padding: '14px 16px',
                    fontSize: 13,
                    color: 'var(--warn)',
                    lineHeight: 1.6
                }}>
                    ⚠️ <strong>API Key no configurada.</strong><br />
                    Ve a <strong>Perfil → Oráculo IA</strong> y pega tu clave de{' '}
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
                        style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                        Google AI Studio
                    </a>.
                </div>
            ) : (
                <>
                    <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 16 }}>
                        Describe a dónde vas o cómo te sientes. La IA armará el outfit perfecto con tu clóset.
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
                            disabled={loading || !prompt.trim()}
                            style={{ padding: '0 24px', borderRadius: 'var(--r-full)' }}
                        >
                            {loading ? '...' : 'Preguntar'}
                        </button>
                    </div>
                </>
            )}

            {error && (
                <div style={{ marginTop: 16, background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 'var(--r-md)', padding: '12px 16px', color: 'var(--danger)', fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
                    {error}
                </div>
            )}

            {outfitData && (
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>El Oráculo ha hablado</div>
                    <p style={{ fontSize: 14, color: 'var(--ink-1)', marginBottom: 20, lineHeight: 1.6, fontStyle: 'italic' }}>
                        "{outfitData.reasoning}"
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {renderPiece(outfitData.outfit.top)}
                        {renderPiece(outfitData.outfit.layer)}
                        {renderPiece(outfitData.outfit.bottom)}
                        {renderPiece(outfitData.outfit.shoe)}
                    </div>
                </div>
            )}
        </div>
    );
}
