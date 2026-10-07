import { useState } from 'react';
import { useStore } from '../../lib/store';
import { askOracle, type OracleResponse } from '../../lib/ai';
import {
  IconSparkles,
  IconTop,
  IconLayer,
  IconBottom,
  IconShoes
} from '../../components/Icons';

export default function Oracle() {
  const garments = useStore(s => s.garments);
  const build = useStore(s => s.build);
  const skin = useStore(s => s.skin);
  const stylePersonality = useStore(s => s.stylePersonality);
  const wardrobePreference = useStore(s => s.wardrobePreference);

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outfitData, setOutfitData] = useState<OracleResponse | null>(null);

  const handleAsk = async () => {
    if (!prompt.trim() || prompt.trim().length > 500 || garments.length === 0) return;
    setLoading(true);
    setError(null);
    setOutfitData(null);
    try {
      const profileCtx = { skin, build, stylePersonality, wardrobePreference };
      const availableGarments = garments.filter(g => !g.inLaundry);
      const garmentsToUse = availableGarments.length >= 3 ? availableGarments : garments;
      const result = await askOracle(prompt, garmentsToUse, profileCtx);
      setOutfitData(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al contactar al Oráculo.');
    } finally {
      setLoading(false);
    }
  };

  const renderPiece = (id: string, label: string) => {
    if (!id) return null;
    const g = garments.find(item => item.id === id);
    if (!g) return null;

    const iconNode =
      g.cat === 'top' ? <IconTop size={18} /> :
      g.cat === 'layer' ? <IconLayer size={18} /> :
      g.cat === 'bottom' ? <IconBottom size={18} /> :
      <IconShoes size={18} />;

    return (
      <div key={g.id} className="flatlay-piece" style={{ padding: '10px 14px' }}>
        {g.imageUrl ? (
          <img
            src={g.imageUrl}
            alt={g.name}
            style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', objectFit: 'cover', border: `2px solid ${g.colorHex}` }}
          />
        ) : (
          <div className="flatlay-piece__icon" style={{ background: g.colorHex, color: '#fff', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {iconNode}
          </div>
        )}
        <div className="flatlay-piece__info">
          <div className="flatlay-piece__name" style={{ fontSize: 13, fontWeight: 600 }}>{g.name}</div>
          <div className="flatlay-piece__meta" style={{ fontSize: 11, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{label}</span>
            <span>·</span>
            <span style={{ color: g.colorHex, fontWeight: 600 }}>{g.colorName}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-xl)', padding: 24, marginTop: 24, border: '1px solid rgba(255, 90, 38, 0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>
          <IconSparkles size={22} />
        </span>
        <h3 style={{ fontSize: 17, fontWeight: 800 }}>El Oráculo de Estilo</h3>
      </div>

      <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 16 }}>
        Describe tu ocasión o estado de ánimo. La inteligencia artificial armará el outfit ideal seleccionando exclusivamente prendas de tu propio armario.
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          className="input"
          placeholder="Ej. Cena casual de noche en clima templado..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          maxLength={500}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
          disabled={loading}
          style={{ flex: 1, padding: '12px 18px', borderRadius: 'var(--r-full)', fontSize: 13 }}
        />
        <button
          className="btn btn-primary"
          onClick={handleAsk}
          disabled={loading || !prompt.trim()}
          style={{ padding: '0 20px', borderRadius: 'var(--r-full)', minHeight: 44, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
        >
          {loading ? 'Consultando...' : 'Preguntar'}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 16, background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 'var(--r-md)', padding: '12px 16px', color: 'var(--danger)', fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
          {error}
        </div>
      )}

      {outfitData && (
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
            Recomendación del Oráculo
          </div>
          <p style={{ fontSize: 14, color: 'var(--ink)', marginBottom: 18, lineHeight: 1.6, fontStyle: 'italic' }}>
            "{outfitData.reasoning}"
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {renderPiece(outfitData.outfit.top, 'Superior')}
            {renderPiece(outfitData.outfit.layer, 'Capa')}
            {renderPiece(outfitData.outfit.bottom, 'Inferior')}
            {renderPiece(outfitData.outfit.shoe, 'Calzado')}
          </div>
        </div>
      )}
    </div>
  );
}
