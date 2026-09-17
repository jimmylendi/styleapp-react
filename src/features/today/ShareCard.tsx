import { useRef } from 'react';
import type { Garment } from '../../types';

interface ShareCardProps {
    outfitPieces: (Garment | null)[];
    occasion: string;
    name: string;
    onClose: () => void;
}

export default function ShareCard({ outfitPieces, occasion, name, onClose }: ShareCardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pieces = outfitPieces.filter(Boolean) as Garment[];

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = 400, H = 560;
        canvas.width = W;
        canvas.height = H;

        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#0A0E1A');
        grad.addColorStop(1, '#12182E');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Top accent bar
        ctx.fillStyle = '#6C63FF';
        ctx.fillRect(0, 0, W, 4);

        // "StyleApp" brand
        ctx.fillStyle = 'rgba(108,99,255,0.9)';
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.fillText('✨ StyleApp', 28, 36);

        // Occasion label
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '12px system-ui, sans-serif';
        ctx.fillText(occasion.toUpperCase(), 28, 58);

        // Name / title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 26px system-ui, sans-serif';
        ctx.fillText(name ? `Outfit de ${name}` : 'Mi Outfit del Día', 28, 100);

        // Divider
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(28, 118, W - 56, 1);

        // Color swatches + garment names
        let y = 148;
        pieces.forEach((piece, i) => {
            // Swatch circle
            ctx.beginPath();
            ctx.arc(52, y, 18, 0, Math.PI * 2);
            ctx.fillStyle = piece.colorHex;
            ctx.fill();

            // Index badge
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.font = '10px system-ui';
            ctx.fillText(String(i + 1), 48, y + 4);

            // Name
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 15px system-ui, sans-serif';
            ctx.fillText(piece.name, 82, y - 4);

            // Type
            ctx.fillStyle = 'rgba(255,255,255,0.45)';
            ctx.font = '12px system-ui, sans-serif';
            ctx.fillText(piece.type + ' · ' + piece.colorName, 82, y + 14);

            y += 64;
        });

        // Bottom date
        const dateStr = new Date().toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        ctx.font = '11px system-ui, sans-serif';
        ctx.fillText(dateStr, 28, H - 28);

        // Download
        const link = document.createElement('a');
        link.download = `outfit-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const handleShare = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const getBlob = (): Promise<Blob | null> =>
            new Promise(res => canvas.toBlob(res, 'image/png'));

        try {
            const blob = await getBlob();
            if (!blob) return;
            const file = new File([blob], 'outfit.png', { type: 'image/png' });
            if (navigator.canShare?.({ files: [file] })) {
                await navigator.share({ files: [file], title: 'Mi outfit del día — StyleApp' });
            } else {
                handleDownload();
            }
        } catch (_) {
            handleDownload();
        }
    };

    return (
        <div
            className="sheet-overlay"
            onClick={onClose}
            style={{ alignItems: 'center', justifyContent: 'center' }}
        >
            <div
                className="sheet"
                onClick={e => e.stopPropagation()}
                style={{ maxWidth: 440, borderRadius: 'var(--r-xl)', overflow: 'hidden' }}
            >
                <div className="sheet__head">
                    <div>
                        <div className="sheet__eyebrow">📤 Compartir</div>
                        <h2 className="sheet__title">Tu outfit del día</h2>
                    </div>
                    <button className="sheet__close" onClick={onClose}>✕</button>
                </div>

                {/* Visual card preview */}
                <div style={{ margin: '0 20px 20px', background: 'linear-gradient(160deg,#0A0E1A, #12182E)', borderRadius: 'var(--r-lg)', padding: 24, border: '1px solid rgba(108,99,255,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>✨ STYLEAPP</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{occasion}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>{name ? `Outfit de ${name}` : 'Mi Outfit del Día'}</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {pieces.map((p, i) => (
                            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: p.colorHex, flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'rgba(0,0,0,0.5)', fontWeight: 700 }}>
                                    {i + 1}
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{p.type} · {p.colorName}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                        {new Date().toLocaleDateString('es', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </div>
                </div>

                {/* Hidden canvas for export */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                <div className="sheet__foot" style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" onClick={handleDownload} style={{ flex: 1 }}>
                        ⬇️ Descargar PNG
                    </button>
                    <button className="btn btn-primary" onClick={handleShare} style={{ flex: 1 }}>
                        📤 Compartir
                    </button>
                </div>
            </div>
        </div>
    );
}
