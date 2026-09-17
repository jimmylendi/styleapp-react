import { useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import { useStore } from '../../lib/store';
import type { Garment } from '../../types';

interface ShareCardProps {
    outfit: { top?: string; bottom?: string; layer?: string; shoe?: string };
    onClose: () => void;
}

export default function ShareCard({ outfit, onClose }: ShareCardProps) {
    const garments = useStore(s => s.garments);
    const stylePersonality = useStore(s => s.stylePersonality);
    const name = useStore(s => s.name);

    const [generating, setGenerating] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const getGarment = (id?: string) => garments.find(g => g.id === id);

    const cTop = getGarment(outfit.top);
    const cBottom = getGarment(outfit.bottom);
    const cLayer = getGarment(outfit.layer);
    const cShoe = getGarment(outfit.shoe);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setGenerating(true);
        try {
            const dataUrl = await htmlToImage.toJpeg(cardRef.current, { quality: 0.95 });
            const link = document.createElement('a');
            link.download = `styleapp-outfit-${Date.now()}.jpg`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Error generando imagen', error);
            alert('No se pudo generar la imagen. Intenta de nuevo.');
        } finally {
            setGenerating(false);
        }
    };

    const renderSwatch = (g: Garment | undefined) => {
        if (!g) return null;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                    width: 50, height: 50, borderRadius: '50%', background: g.colorHex,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '2px solid rgba(255,255,255,0.1)'
                }} />
                <span style={{ fontSize: 10, fontWeight: 700, textAlign: 'center', lineHeight: 1.1, color: 'var(--ink-2)' }}>
                    {g.name}
                </span>
            </div>
        );
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(10px)'
        }}>
            {/* Contenedor que se tomará foto */}
            <div
                ref={cardRef}
                style={{
                    background: 'linear-gradient(145deg, #1A1A1A 0%, #111 100%)',
                    width: 320, borderRadius: 24, padding: 32,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}
            >
                {/* Cabecera marca */}
                <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 2, color: 'var(--accent)', marginBottom: 24 }}>
                    STYLEAPP
                </div>

                <div style={{ fontSize: 24, fontWeight: 800, textAlign: 'center', lineHeight: 1.2, marginBottom: 8 }}>
                    Outfit del Día
                </div>

                <div style={{ fontSize: 13, color: 'var(--ink-2)', textAlign: 'center', marginBottom: 32 }}>
                    Diseñado para el arquetipo <br />
                    <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{stylePersonality}</strong>
                </div>

                {/* Grid prendas circular */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32, width: '100%' }}>
                    {renderSwatch(cTop)}
                    {renderSwatch(cLayer)}
                    {renderSwatch(cBottom)}
                    {renderSwatch(cShoe)}
                </div>

                {/* Firma usuario */}
                <div style={{
                    width: '100%', borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: 16, display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', fontSize: 11, color: 'var(--ink-2)'
                }}>
                    <span>{new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                    <span>Moda Dinámica by <strong>{name || 'Usuario'}</strong></span>
                </div>
            </div>

            {/* Controles FUERA del canvas */}
            <div style={{ display: 'flex', gap: 12, marginTop: 40, width: 320 }}>
                <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cerrar</button>
                <button className="btn btn-primary" onClick={handleDownload} disabled={generating} style={{ flex: 2 }}>
                    {generating ? 'Generando...' : '📥 Descargar'}
                </button>
            </div>
        </div>
    );
}
