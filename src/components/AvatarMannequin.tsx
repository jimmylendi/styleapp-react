/* ============================================================
   AVATAR MANNEQUIN 3D · Probador virtual de alta costura
   Renderiza silueta 3D volumétrica biomecánica con iluminación de
   estudio atelier, rotación interactiva 3D, texturas y sombreado
   cilíndrico de alta definición.
   ============================================================ */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Garment, SkinTone, BodyBuild, WardrobePreference, AvatarHairStyle, AvatarBeard, UserProfile } from '../types';
import { IconSparkles, IconSun, IconRotate3D, IconCube, IconLightning, IconClose } from './Icons';
import { calculateOutfitIQ, autoOptimizeOutfit, type OutfitIQAnalysis } from '../lib/smartStylist';

export interface AvatarMannequinProps {
  top?: Garment | null;
  bottom?: Garment | null;
  layer?: Garment | null;
  shoe?: Garment | null;
  skin?: SkinTone;
  build?: BodyBuild;
  preference?: WardrobePreference;
  hairStyle?: AvatarHairStyle;
  hairColor?: string;
  beard?: AvatarBeard;
  showAnnotations?: boolean;
  size?: number;
  className?: string;
  onClickPiece?: (cat: 'top' | 'layer' | 'bottom' | 'shoes') => void;
  interactive3D?: boolean;
  allowControls?: boolean;
  defaultAngle?: 'front' | 'threeQuarter' | 'profile';
  sunglasses?: boolean;
  showIntelligenceHUD?: boolean;
  onApplyOptimization?: (optimized: { top: Garment; bottom: Garment; shoe: Garment; layer?: Garment | null }) => void;
  closetGarments?: Garment[];
  weatherTemp?: number | null;
}

export type MannequinFinish = 'realista' | 'escultural';
export type StudioLighting = 'atelier' | 'golden' | 'cyber';
export type CameraAngle = 'front' | 'threeQuarter' | 'profile';

const SKIN_PALETTES: Record<SkinTone, {
  base: string;
  shadow: string;
  deepShadow: string;
  highlight: string;
  specular: string;
  warmGlow: string;
}> = {
  'clara': {
    base: '#F4DCBA',
    shadow: '#D8B690',
    deepShadow: '#B38B65',
    highlight: '#FFF2E2',
    specular: '#FFFFFF',
    warmGlow: 'rgba(255, 235, 215, 0.65)'
  },
  'media': {
    base: '#CE9A69',
    shadow: '#A87544',
    deepShadow: '#845326',
    highlight: '#E8BD93',
    specular: '#FFF1DE',
    warmGlow: 'rgba(222, 168, 120, 0.6)'
  },
  'morena': {
    base: '#8E5B37',
    shadow: '#663B19',
    deepShadow: '#48240D',
    highlight: '#B87F56',
    specular: '#D6A47E',
    warmGlow: 'rgba(192, 96, 58, 0.65)' // Matiz terracota cálido natural
  },
  'oscura': {
    base: '#59361C',
    shadow: '#3B200E',
    deepShadow: '#261206',
    highlight: '#7E5331',
    specular: '#9F7049',
    warmGlow: 'rgba(126, 83, 49, 0.6)'
  },
  'muy-oscura': {
    base: '#382213',
    shadow: '#221308',
    deepShadow: '#150A03',
    highlight: '#563821',
    specular: '#734E32',
    warmGlow: 'rgba(86, 56, 33, 0.65)'
  }
};

// Acabados escultóricos de alta costura (Atelier Mannequin)
const ATELIER_FINISH = {
  base: '#2D313A',
  shadow: '#191B21',
  deepShadow: '#0E1014',
  highlight: '#484E5B',
  specular: '#939BAA',
  warmGlow: 'rgba(218, 165, 32, 0.45)'
};

export const AvatarMannequin: React.FC<AvatarMannequinProps> = ({
  top,
  bottom,
  layer,
  shoe,
  skin = 'morena',
  build = 'atletico',
  preference = 'sin-filtro',
  hairStyle = 'corto',
  hairColor = '#1A1A1A',
  beard = 'ninguna',
  showAnnotations = true,
  size = 360,
  className = '',
  onClickPiece,
  interactive3D = true,
  allowControls = true,
  defaultAngle = 'front',
  sunglasses: initialSunglasses = false,
  showIntelligenceHUD = true,
  onApplyOptimization,
  closetGarments = [],
  weatherTemp = null
}) => {
  // Estado de interactividad 3D
  const [angle, setAngle] = useState<CameraAngle>(defaultAngle);
  const [rotY, setRotY] = useState(defaultAngle === 'threeQuarter' ? 18 : defaultAngle === 'profile' ? 36 : 0);
  const [rotX, setRotX] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [finish, setFinish] = useState<MannequinFinish>('realista');
  const [lighting, setLighting] = useState<StudioLighting>('atelier');
  const [showSunglasses, setShowSunglasses] = useState(initialSunglasses);
  const [selectedPiece, setSelectedPiece] = useState<'top' | 'layer' | 'bottom' | 'shoes' | null>(null);

  // Estado de Inteligencia de Outfit & Modal HUD
  const [showIQModal, setShowIQModal] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optToast, setOptToast] = useState<string | null>(null);

  // Cálculo de Outfit IQ en tiempo real
  const outfitIQ: OutfitIQAnalysis | null = useMemo(() => {
    if (!top || !bottom || !shoe) return null;
    const profile: UserProfile = {
      onboarded: true,
      name: 'Usuario',
      height: '190',
      heightUnit: 'metric',
      build: build || 'atletico',
      skin: skin || 'morena',
      climate: 'calido',
      stylePersonality: 'elegante',
      wardrobePreference: preference || 'masculino'
    };
    return calculateOutfitIQ({ top, bottom, shoe, layer }, profile, weatherTemp);
  }, [top, bottom, shoe, layer, build, skin, preference, weatherTemp]);

  // Drag interaction
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Auto-rotación 3D orbital fluida
  useEffect(() => {
    if (!isAutoSpinning) return;
    const interval = setInterval(() => {
      setRotY(prev => (prev >= 360 ? 0 : prev + 1.2));
    }, 32);
    return () => clearInterval(interval);
  }, [isAutoSpinning]);

  // Manejadores de arrastre 3D libre
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive3D) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    if (isAutoSpinning) setIsAutoSpinning(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !interactive3D) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setRotY(prev => Math.max(-55, Math.min(55, prev + deltaX * 0.45)));
    setRotX(prev => Math.max(-15, Math.min(15, prev - deltaY * 0.25)));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleSetAnglePreset = (preset: CameraAngle) => {
    setIsAutoSpinning(false);
    setAngle(preset);
    setRotX(0);
    if (preset === 'front') setRotY(0);
    if (preset === 'threeQuarter') setRotY(20);
    if (preset === 'profile') setRotY(38);
  };

  // Paleta de materiales 3D
  const skinColors = finish === 'escultural' ? ATELIER_FINISH : (SKIN_PALETTES[skin] || SKIN_PALETTES.morena);
  const isFemale = preference === 'femenino';

  // Configuración biomecánica de anchura según complexión
  let shoulderW = 86;
  let chestW = 70;
  let waistW = 54;
  let hipW = 62;
  let legW = 21;
  let armW = 13;

  switch (build) {
    case 'delgado':
      shoulderW = 76;
      chestW = 62;
      waistW = 48;
      hipW = 56;
      legW = 18;
      armW = 11;
      break;
    case 'atletico':
      shoulderW = isFemale ? 82 : 94;
      chestW = isFemale ? 70 : 78;
      waistW = isFemale ? 48 : 52;
      hipW = isFemale ? 68 : 62;
      legW = 21;
      armW = 14;
      break;
    case 'robusto':
      shoulderW = 92;
      chestW = 84;
      waistW = 74;
      hipW = 76;
      legW = 25;
      armW = 15;
      break;
    case 'grande':
      shoulderW = 96;
      chestW = 88;
      waistW = 82;
      hipW = 84;
      legW = 27;
      armW = 16;
      break;
  }

  const cx = 140; // centro x
  const neckY = 82;
  const neckW = isFemale ? 14 : 18;
  const shoulderY = 104;
  const waistY = 210;
  const crotchY = 270;
  const kneeY = 360;
  const ankleY = 440;
  const footY = 468;

  // Colores por defecto si no hay prenda
  const defaultTop = '#272F3E';
  const defaultBottom = '#1B212D';
  const defaultShoe = '#141822';

  const topColor = top?.colorHex || defaultTop;
  const bottomColor = bottom?.colorHex || defaultBottom;
  const shoeColor = shoe?.colorHex || defaultShoe;
  const layerColor = layer?.colorHex;

  // Luz de estudio ambiental
  const lightingMoods = {
    atelier: {
      rimColor: 'rgba(255, 255, 255, 0.45)',
      ambient: '#FFFFFF',
      floorGlow: 'rgba(255, 255, 255, 0.08)',
      spotlight: 'rgba(255, 255, 255, 0.12)'
    },
    golden: {
      rimColor: 'rgba(255, 175, 75, 0.65)',
      ambient: '#FFD7A8',
      floorGlow: 'rgba(218, 120, 50, 0.22)',
      spotlight: 'rgba(255, 160, 60, 0.18)'
    },
    cyber: {
      rimColor: 'rgba(120, 200, 255, 0.65)',
      ambient: '#99D4FF',
      floorGlow: 'rgba(100, 180, 255, 0.2)',
      spotlight: 'rgba(80, 150, 255, 0.16)'
    }
  }[lighting];

  const handlePieceClick = (cat: 'top' | 'layer' | 'bottom' | 'shoes') => {
    setSelectedPiece(prev => (prev === cat ? null : cat));
    onClickPiece?.(cat);
  };

  return (
    <div
      ref={containerRef}
      className={`avatar-mannequin-3d-wrapper ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        maxWidth: size,
        userSelect: 'none'
      }}
    >
      {/* ── BARRA DE CONTROLES 3D ESTUDIO ── */}
      {allowControls && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginBottom: 10,
            padding: '6px 10px',
            background: 'var(--surface-3)',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--line)',
            fontSize: 11
          }}
        >
          {/* Cámara y Ángulo 3D */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: 'var(--ink-2)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <IconCube size={12} style={{ color: 'var(--accent)' }} /> 3D:
            </span>
            <button
              type="button"
              onClick={() => handleSetAnglePreset('front')}
              style={{
                padding: '3px 8px',
                borderRadius: 'var(--r-sm)',
                border: 'none',
                background: angle === 'front' && !isAutoSpinning ? 'var(--accent)' : 'var(--surface-2)',
                color: angle === 'front' && !isAutoSpinning ? '#FFF' : 'var(--ink-2)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Frontal
            </button>
            <button
              type="button"
              onClick={() => handleSetAnglePreset('threeQuarter')}
              style={{
                padding: '3px 8px',
                borderRadius: 'var(--r-sm)',
                border: 'none',
                background: angle === 'threeQuarter' && !isAutoSpinning ? 'var(--accent)' : 'var(--surface-2)',
                color: angle === 'threeQuarter' && !isAutoSpinning ? '#FFF' : 'var(--ink-2)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              3/4 Pasarela
            </button>
            <button
              type="button"
              onClick={() => handleSetAnglePreset('profile')}
              style={{
                padding: '3px 8px',
                borderRadius: 'var(--r-sm)',
                border: 'none',
                background: angle === 'profile' && !isAutoSpinning ? 'var(--accent)' : 'var(--surface-2)',
                color: angle === 'profile' && !isAutoSpinning ? '#FFF' : 'var(--ink-2)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Perfil
            </button>
            <button
              type="button"
              onClick={() => setIsAutoSpinning(p => !p)}
              title="Giro automático 360°"
              style={{
                padding: '3px 8px',
                borderRadius: 'var(--r-sm)',
                border: 'none',
                background: isAutoSpinning ? 'var(--accent)' : 'var(--surface-2)',
                color: isAutoSpinning ? '#FFF' : 'var(--ink-2)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <IconRotate3D size={12} /> {isAutoSpinning ? 'Pausar' : 'Girar'}
            </button>
          </div>

          {/* Acabado & Luz */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Modo Avatar vs Maniquí */}
            <button
              type="button"
              onClick={() => setFinish(f => (f === 'realista' ? 'escultural' : 'realista'))}
              title="Cambiar acabado de material"
              style={{
                padding: '3px 8px',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--line)',
                background: finish === 'escultural' ? 'var(--surface-1)' : 'var(--surface-2)',
                color: 'var(--ink)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <IconSparkles size={11} style={{ color: 'var(--accent)' }} />
              {finish === 'realista' ? 'Realista' : 'Atelier 3D'}
            </button>

            {/* Selector de Iluminación */}
            <button
              type="button"
              onClick={() => {
                setLighting(curr => (curr === 'atelier' ? 'golden' : curr === 'golden' ? 'cyber' : 'atelier'));
              }}
              title="Cambiar atmósfera de luz"
              style={{
                padding: '3px 8px',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--line)',
                background: 'var(--surface-2)',
                color: 'var(--ink-2)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <IconSun size={11} />
              {lighting === 'atelier' ? 'Luz Atelier' : lighting === 'golden' ? 'Golden' : 'Cyber'}
            </button>

            {/* Toggle Gafas de Sol de Modelo */}
            {finish === 'realista' && (
              <button
                type="button"
                onClick={() => setShowSunglasses(s => !s)}
                title="Gafas de sol de modelo"
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--r-sm)',
                  border: '1px solid var(--line)',
                  background: showSunglasses ? 'var(--accent)' : 'var(--surface-2)',
                  color: showSunglasses ? '#FFF' : 'var(--ink-2)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 11
                }}
              >
                🕶️ {showSunglasses ? 'Con gafas' : 'Sin gafas'}
              </button>
            )}

            {/* Toggle Outfit IQ Holográfico */}
            {showIntelligenceHUD && outfitIQ && (
              <button
                type="button"
                onClick={() => setShowIQModal(s => !s)}
                title="Diagnóstico de Armonía de Alta Costura"
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--r-sm)',
                  border: `1px solid ${outfitIQ.badgeColor}`,
                  background: showIQModal ? outfitIQ.badgeColor : 'var(--surface-2)',
                  color: showIQModal ? '#FFF' : outfitIQ.badgeColor,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 11
                }}
              >
                <IconLightning size={11} /> {outfitIQ.overallIQ} · {outfitIQ.tier}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── ESCENARIO 3D CON PERSPECTIVA Y PEDESTAL FLOTANTE ── */}
      <div
        style={{
          perspective: 1000,
          perspectiveOrigin: '50% 40%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          touchAction: 'none',
          cursor: interactive3D ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Floating Outfit IQ Badge (Top-Right) */}
        {showIntelligenceHUD && outfitIQ && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowIQModal(p => !p);
            }}
            title="Abrir Diagnóstico Inteligente de Alta Costura"
            style={{
              position: 'absolute',
              top: 10,
              right: 12,
              zIndex: 20,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 11px',
              borderRadius: 'var(--r-full)',
              background: 'rgba(20, 20, 26, 0.88)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${outfitIQ.badgeColor}`,
              color: '#FFF',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: `0 4px 16px ${outfitIQ.badgeColor}33`,
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: outfitIQ.badgeColor,
                boxShadow: `0 0 6px ${outfitIQ.badgeColor}`
              }}
            />
            <span>IQ {outfitIQ.overallIQ}</span>
            <span
              style={{
                color: outfitIQ.badgeColor,
                fontSize: 10,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              · {outfitIQ.tier}
            </span>
          </button>
        )}

        {/* Toast de Optimización */}
        {optToast && (
          <div
            style={{
              position: 'absolute',
              top: 48,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              background: 'rgba(20, 20, 24, 0.94)',
              border: '1px solid var(--accent)',
              borderRadius: 'var(--r-md)',
              padding: '7px 14px',
              color: '#FFF',
              fontSize: 11,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              animation: 'fadeIn 0.25s ease'
            }}
          >
            <IconSparkles size={13} style={{ color: 'var(--accent)' }} />
            {optToast}
          </div>
        )}

        {/* Modal / Drawer Holográfico de Diagnóstico Inteligente */}
        {showIQModal && outfitIQ && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              right: 10,
              zIndex: 25,
              background: 'rgba(16, 16, 22, 0.95)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${outfitIQ.badgeColor}66`,
              borderRadius: 'var(--r-lg)',
              padding: '14px 16px',
              color: '#FFF',
              fontSize: 11,
              boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
              maxHeight: '440px',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--r-md)',
                    background: `${outfitIQ.badgeColor}22`,
                    border: `1px solid ${outfitIQ.badgeColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: outfitIQ.badgeColor,
                    fontWeight: 800,
                    fontSize: 13
                  }}
                >
                  {outfitIQ.overallIQ}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    Outfit IQ · Nivel {outfitIQ.tier}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--ink-2)' }}>Diagnóstico Biomecánico & Colorimetría</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIQModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--ink-2)',
                  cursor: 'pointer',
                  padding: 4
                }}
              >
                <IconClose size={16} />
              </button>
            </div>

            {/* 4 Métricas de Radar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              {Object.entries(outfitIQ.metrics).map(([key, item]) => (
                <div
                  key={key}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '8px 10px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: 'var(--ink-2)' }}>{item.label}</span>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: 10,
                        color: item.status === 'perfect' ? 'var(--accent)' : item.status === 'good' ? '#8BC34A' : '#FF9800'
                      }}
                    >
                      {item.score}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: 4,
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      overflow: 'hidden',
                      marginBottom: 5
                    }}
                  >
                    <div
                      style={{
                        width: `${item.score}%`,
                        height: '100%',
                        background: item.status === 'perfect' ? 'var(--accent)' : item.status === 'good' ? '#8BC34A' : '#FF9800',
                        borderRadius: 2
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>
                    {item.note}
                  </div>
                </div>
              ))}
            </div>

            {/* Veredicto & Tip */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '10px 12px',
                borderRadius: 'var(--r-md)',
                marginBottom: 12,
                borderLeft: `3px solid ${outfitIQ.badgeColor}`
              }}
            >
              <div style={{ fontSize: 10, color: outfitIQ.badgeColor, fontWeight: 700, marginBottom: 2 }}>
                Veredicto de Pasarela:
              </div>
              <div style={{ fontSize: 10.5, lineHeight: 1.4, marginBottom: 6 }}>
                {outfitIQ.verdictSummary}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255, 255, 255, 0.65)', fontStyle: 'italic' }}>
                {outfitIQ.stylistTip}
              </div>
            </div>

            {/* Botón de Auto-Optimización con IA */}
            {onApplyOptimization && closetGarments && closetGarments.length > 0 && (
              <button
                type="button"
                disabled={isOptimizing}
                onClick={() => {
                  if (!top || !bottom || !shoe) return;
                  setIsOptimizing(true);
                  setTimeout(() => {
                    const opt = autoOptimizeOutfit(
                      { top, bottom, shoe, layer },
                      closetGarments,
                      {
                        onboarded: true,
                        name: 'Usuario',
                        height: '190',
                        heightUnit: 'metric',
                        build: build || 'atletico',
                        skin: skin || 'morena',
                        climate: 'calido',
                        stylePersonality: 'elegante',
                        wardrobePreference: preference || 'masculino'
                      },
                      weatherTemp
                    );
                    if (opt.hasOptimization) {
                      onApplyOptimization(opt.optimizedOutfit);
                      setOptToast(`¡Optimizado a ${opt.optimizedIQ}/100! (+${opt.gain} pts)`);
                    } else {
                      setOptToast('Tu outfit ya tiene la máxima armonía alcanzable.');
                    }
                    setIsOptimizing(false);
                    setTimeout(() => setOptToast(null), 4000);
                  }, 300);
                }}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: 'var(--r-md)',
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: isOptimizing ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  boxShadow: '0 4px 12px rgba(192, 96, 58, 0.35)'
                }}
              >
                <IconLightning size={13} />
                {isOptimizing ? 'Analizando combinaciones...' : '⚡ Optimizar con IA'}
              </button>
            )}
          </div>
        )}
        {/* Luz de foco cenital detrás del maniquí */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '75%',
            background: `radial-gradient(ellipse at 50% 25%, ${lightingMoods.spotlight} 0%, transparent 70%)`,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* CONTENEDOR TRANSFORM 3D */}
        <div
          style={{
            width: '100%',
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`,
            transition: isDragging || isAutoSpinning ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.45))'
          }}
        >
          <svg
            viewBox="0 0 280 500"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          >
            <defs>
              {/* ── 3D SHADERS & GRADIENTES DE PROFUNDIDAD ── */}

              {/* Pedestal 3D de estudio */}
              <radialGradient id="podium-surface" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#3A404E" />
                <stop offset="65%" stopColor="#1E222A" />
                <stop offset="100%" stopColor="#12141A" />
              </radialGradient>
              <linearGradient id="podium-bevel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="50%" stopColor="rgba(0,0,0,0.6)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
              </linearGradient>

              {/* Sombra de contacto oclusivo */}
              <radialGradient id="ao-floor-shadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0,0,0,0.85)" />
                <stop offset="45%" stopColor="rgba(0,0,0,0.45)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Gradiente anatómico de la piel con luz clave (Top-Left) y sombra profunda */}
              <linearGradient id={`skin-3d-cylindrical-${skin}-${finish}`} x1="0.1" y1="0" x2="0.9" y2="1">
                <stop offset="0%" stopColor={skinColors.specular} stopOpacity="0.85" />
                <stop offset="25%" stopColor={skinColors.highlight} />
                <stop offset="55%" stopColor={skinColors.base} />
                <stop offset="85%" stopColor={skinColors.shadow} />
                <stop offset="100%" stopColor={skinColors.deepShadow} />
              </linearGradient>

              {/* Piel: Cabeza y Rostro 3D esculpido */}
              <radialGradient id={`skin-3d-face-${skin}-${finish}`} cx="45%" cy="35%" r="65%">
                <stop offset="0%" stopColor={skinColors.specular} stopOpacity="0.9" />
                <stop offset="28%" stopColor={skinColors.highlight} />
                <stop offset="70%" stopColor={skinColors.base} />
                <stop offset="100%" stopColor={skinColors.shadow} />
              </radialGradient>

              {/* Halo facial de afinidad cutánea */}
              <radialGradient id={`facial-aura-${skin}`} cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor={skinColors.warmGlow} />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Sombreado 3D de prendas: Top cilíndrico */}
              <linearGradient id="top-3d-shade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
                <stop offset="30%" stopColor="rgba(255,255,255,0.06)" />
                <stop offset="70%" stopColor="rgba(0,0,0,0.08)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.38)" />
              </linearGradient>

              {/* Sombreado 3D de prendas: Bottom (Pantalón con raya frontal de alta sastrería) */}
              <linearGradient id="pant-leg-left" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                <stop offset="45%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="50%" stopColor="rgba(0,0,0,0.12)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
              </linearGradient>
              <linearGradient id="pant-leg-right" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                <stop offset="45%" stopColor="rgba(255,255,255,0.02)" />
                <stop offset="50%" stopColor="rgba(0,0,0,0.18)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.42)" />
              </linearGradient>

              {/* Brillo especular de calzado y solapa */}
              <linearGradient id="leather-specular" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
              </linearGradient>

              {/* Sombreados de Alta Costura para Sobrecamisa / Capa */}
              <linearGradient id="layer-body-left" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(0,0,0,0.32)" />
                <stop offset="60%" stopColor="rgba(255,255,255,0.14)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
              </linearGradient>
              <linearGradient id="layer-body-right" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0.14)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.36)" />
              </linearGradient>
              <linearGradient id="layer-sleeve-left" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(0,0,0,0.28)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.38)" />
              </linearGradient>
              <linearGradient id="layer-sleeve-right" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(0,0,0,0.22)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.42)" />
              </linearGradient>

              {/* Oclusión ambiental proyectada hacia el top interior */}
              <linearGradient id="layer-inner-shadow-left" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(0,0,0,0.45)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="layer-inner-shadow-right" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="rgba(0,0,0,0.45)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>

              {/* Cristales y reflejos para gafas de sol de modelo */}
              <linearGradient id="sunglasses-lens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1B1713" />
                <stop offset="55%" stopColor="#2E241B" />
                <stop offset="100%" stopColor="#120F0C" />
              </linearGradient>
              <linearGradient id="sunglasses-glare" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            {/* ── 0. PEDESTAL 3D SHOWROOM PLATFORM ── */}
            {/* Sombra proyectada del pedestal en el piso */}
            <ellipse cx={cx} cy={footY + 22} rx={hipW + 36} ry="14" fill="url(#ao-floor-shadow)" opacity="0.8" />

            {/* Borde biselado del pedestal (Profundidad 3D) */}
            <path
              d={`M ${cx - hipW - 32} ${footY + 12}
                 A ${hipW + 32} 11 0 0 0 ${cx + hipW + 32} ${footY + 12}
                 L ${cx + hipW + 32} ${footY + 18}
                 A ${hipW + 32} 11 0 0 1 ${cx - hipW - 32} ${footY + 18} Z`}
              fill="url(#podium-bevel)"
            />

            {/* Superficie superior del pedestal 3D */}
            <ellipse
              cx={cx}
              cy={footY + 12}
              rx={hipW + 32}
              ry="11"
              fill="url(#podium-surface)"
              stroke={lightingMoods.rimColor}
              strokeWidth="0.8"
            />

            {/* Anillo de resplandor interior del pedestal */}
            <ellipse
              cx={cx}
              cy={footY + 12}
              rx={hipW + 28}
              ry="9.5"
              fill="none"
              stroke={lightingMoods.floorGlow}
              strokeWidth="1.5"
            />

            {/* Sombra de contacto de los pies sobre el pedestal */}
            <ellipse cx={cx - 24} cy={footY + 4} rx="16" ry="5" fill="url(#ao-floor-shadow)" />
            <ellipse cx={cx + 24} cy={footY + 4} rx="16" ry="5" fill="url(#ao-floor-shadow)" />

            {/* ── 1. HALO Y REFRACCIÓN FACIAL DÉRMICA ── */}
            <circle cx={cx} cy="58" r="56" fill={`url(#facial-aura-${skin})`} opacity="0.75" />

            {/* ── 2. CUELLO Y CLAVÍCULAS 3D ── */}
            <path
              d={`M ${cx - neckW / 2} ${neckY - 10}
                 L ${cx + neckW / 2} ${neckY - 10}
                 L ${cx + neckW / 2 + 3} ${shoulderY - 4}
                 Q ${cx} ${shoulderY + 6}, ${cx - neckW / 2 - 3} ${shoulderY - 4} Z`}
              fill={`url(#skin-3d-cylindrical-${skin}-${finish})`}
            />
            {/* Clavícula estilizada con sombra de volumen */}
            <path
              d={`M ${cx - 16} ${shoulderY + 2} Q ${cx - 7} ${shoulderY + 7}, ${cx - 2} ${shoulderY + 4}`}
              stroke="rgba(0,0,0,0.18)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d={`M ${cx + 16} ${shoulderY + 2} Q ${cx + 7} ${shoulderY + 7}, ${cx + 2} ${shoulderY + 4}`}
              stroke="rgba(0,0,0,0.18)"
              strokeWidth="1"
              fill="none"
            />

            {/* ── 3. BRAZOS ANATÓMICOS CON VOLUMEN 3D ── */}
            {/* Brazo izquierdo (Deltoides, Bíceps, Antebrazo) */}
            <g>
              <path
                d={`M ${cx - shoulderW / 2 + 4} ${shoulderY + 5}
                   Q ${cx - shoulderW / 2 - 14} 175, ${cx - shoulderW / 2 - 8} 252
                   L ${cx - shoulderW / 2 + armW - 8} 252
                   Q ${cx - shoulderW / 2} 175, ${cx - shoulderW / 2 + armW + 2} ${shoulderY + 12} Z`}
                fill={`url(#skin-3d-cylindrical-${skin}-${finish})`}
              />
              {/* Mano izquierda 3D */}
              <ellipse
                cx={cx - shoulderW / 2 - 3}
                cy="264"
                rx={armW * 0.65}
                ry="12"
                fill={skinColors.base}
                stroke={skinColors.shadow}
                strokeWidth="0.8"
              />
            </g>

            {/* Brazo derecho (Deltoides, Bíceps, Antebrazo) */}
            <g>
              <path
                d={`M ${cx + shoulderW / 2 - 4} ${shoulderY + 5}
                   Q ${cx + shoulderW / 2 + 14} 175, ${cx + shoulderW / 2 + 8} 252
                   L ${cx + shoulderW / 2 - armW + 8} 252
                   Q ${cx + shoulderW / 2} 175, ${cx + shoulderW / 2 - armW - 2} ${shoulderY + 12} Z`}
                fill={`url(#skin-3d-cylindrical-${skin}-${finish})`}
              />
              {/* Mano derecha 3D */}
              <ellipse
                cx={cx + shoulderW / 2 + 3}
                cy="264"
                rx={armW * 0.65}
                ry="12"
                fill={skinColors.base}
                stroke={skinColors.shadow}
                strokeWidth="0.8"
              />
            </g>

            {/* Articulaciones de atelier si el modo es escultórico */}
            {finish === 'escultural' && (
              <g fill="#B48238" stroke="#1A1108" strokeWidth="0.8">
                <circle cx={cx - shoulderW / 2 + 2} cy={shoulderY + 12} r="4.5" />
                <circle cx={cx + shoulderW / 2 - 2} cy={shoulderY + 12} r="4.5" />
                <circle cx={cx - shoulderW / 2 - 7} cy="208" r="3.5" />
                <circle cx={cx + shoulderW / 2 + 7} cy="208" r="3.5" />
              </g>
            )}

            {/* ── 4. PRENDA INFERIOR & PIERNAS 3D ── */}
            <g
              onClick={() => handlePieceClick('bottom')}
              style={{ cursor: 'pointer' }}
              filter={selectedPiece === 'bottom' ? 'drop-shadow(0 0 8px rgba(255, 90, 38, 0.75))' : undefined}
            >
              {/* Piernas dérmicas 3D (visibles si es bermuda o falda) */}
              <path
                d={`M ${cx - hipW / 2 + 4} ${kneeY - 20}
                   L ${cx - hipW / 2 + 7} ${ankleY}
                   L ${cx - 10} ${ankleY}
                   L ${cx - 8} ${kneeY - 20} Z`}
                fill={`url(#skin-3d-cylindrical-${skin}-${finish})`}
              />
              <path
                d={`M ${cx + 8} ${kneeY - 20}
                   L ${cx + 10} ${ankleY}
                   L ${cx + hipW / 2 - 7} ${ankleY}
                   L ${cx + hipW / 2 - 4} ${kneeY - 20} Z`}
                fill={`url(#skin-3d-cylindrical-${skin}-${finish})`}
              />

              {bottom?.type === 'falda' ? (
                /* Falda con caída 3D */
                <g>
                  <path
                    d={`M ${cx - waistW / 2} ${waistY + 4}
                       L ${cx + waistW / 2} ${waistY + 4}
                       L ${cx + hipW / 2 + 16} ${kneeY + 20}
                       L ${cx - hipW / 2 - 16} ${kneeY + 20} Z`}
                    fill={bottomColor}
                  />
                  {/* Sombreado de pliegues 3D */}
                  <path
                    d={`M ${cx - waistW / 2} ${waistY + 4}
                       L ${cx + waistW / 2} ${waistY + 4}
                       L ${cx + hipW / 2 + 16} ${kneeY + 20}
                       L ${cx - hipW / 2 - 16} ${kneeY + 20} Z`}
                    fill="url(#top-3d-shade)"
                  />
                </g>
              ) : bottom?.type === 'bermuda' ? (
                /* Bermuda con dobladillo estructurado */
                <g>
                  <path
                    d={`M ${cx - waistW / 2} ${waistY + 4}
                       L ${cx + waistW / 2} ${waistY + 4}
                       L ${cx + hipW / 2 + 4} ${kneeY - 10}
                       L ${cx + 5} ${kneeY - 10}
                       L ${cx} ${crotchY}
                       L ${cx - 5} ${kneeY - 10}
                       L ${cx - hipW / 2 - 4} ${kneeY - 10} Z`}
                    fill={bottomColor}
                  />
                  <path
                    d={`M ${cx - waistW / 2} ${waistY + 4}
                       L ${cx + waistW / 2} ${waistY + 4}
                       L ${cx + hipW / 2 + 4} ${kneeY - 10}
                       L ${cx + 5} ${kneeY - 10}
                       L ${cx} ${crotchY}
                       L ${cx - 5} ${kneeY - 10}
                       L ${cx - hipW / 2 - 4} ${kneeY - 10} Z`}
                    fill="url(#top-3d-shade)"
                  />
                </g>
              ) : (
                /* Pantalón largo chino / sastre / denim con volumen cilíndrico */
                <g>
                  {/* Pierna izquierda 3D */}
                  <path
                    d={`M ${cx - waistW / 2} ${waistY + 4}
                       L ${cx} ${waistY + 4}
                       L ${cx} ${crotchY + 8}
                       L ${cx - 12} ${ankleY + 2}
                       L ${cx - hipW / 2 + 3} ${ankleY + 2}
                       L ${cx - hipW / 2 - 3} ${crotchY} Z`}
                    fill={bottomColor}
                  />
                  <path
                    d={`M ${cx - waistW / 2} ${waistY + 4}
                       L ${cx} ${waistY + 4}
                       L ${cx} ${crotchY + 8}
                       L ${cx - 12} ${ankleY + 2}
                       L ${cx - hipW / 2 + 3} ${ankleY + 2}
                       L ${cx - hipW / 2 - 3} ${crotchY} Z`}
                    fill="url(#pant-leg-left)"
                  />

                  {/* Pierna derecha 3D */}
                  <path
                    d={`M ${cx} ${waistY + 4}
                       L ${cx + waistW / 2} ${waistY + 4}
                       L ${cx + hipW / 2 + 3} ${crotchY}
                       L ${cx + hipW / 2 - 3} ${ankleY + 2}
                       L ${cx + 12} ${ankleY + 2}
                       L ${cx} ${crotchY + 8} Z`}
                    fill={bottomColor}
                  />
                  <path
                    d={`M ${cx} ${waistY + 4}
                       L ${cx + waistW / 2} ${waistY + 4}
                       L ${cx + hipW / 2 + 3} ${crotchY}
                       L ${cx + hipW / 2 - 3} ${ankleY + 2}
                       L ${cx + 12} ${ankleY + 2}
                       L ${cx} ${crotchY + 8} Z`}
                    fill="url(#pant-leg-right)"
                  />

                  {/* Raya de sastrería central iluminada (Crest line 3D) */}
                  <line
                    x1={cx - hipW / 4 - 1}
                    y1={crotchY + 12}
                    x2={cx - hipW / 4}
                    y2={ankleY - 4}
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="1.2"
                  />
                  <line
                    x1={cx + hipW / 4 + 1}
                    y1={crotchY + 12}
                    x2={cx + hipW / 4}
                    y2={ankleY - 4}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1.2"
                  />

                  {/* Bragueta y pretina 3D */}
                  <path
                    d={`M ${cx} ${waistY + 4} L ${cx} ${crotchY - 14} Q ${cx - 7} ${crotchY - 14}, ${cx - 7} ${crotchY - 26}`}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="1.2"
                    fill="none"
                  />
                </g>
              )}

              {/* Cinturón con hebilla metálica 3D */}
              <rect
                x={cx - waistW / 2}
                y={waistY + 2}
                width={waistW}
                height="6"
                fill="#181310"
              />
              <rect
                x={cx - 5}
                y={waistY + 1.5}
                width="10"
                height="7"
                fill="#C5A059"
                stroke="#473618"
                strokeWidth="0.8"
                rx="1"
              />
            </g>

            {/* ── 5. CALZADO (Shoes) CON SUELA Y RELIEVE 3D ── */}
            <g
              onClick={() => handlePieceClick('shoes')}
              style={{ cursor: 'pointer' }}
              filter={selectedPiece === 'shoes' ? 'drop-shadow(0 0 8px rgba(255, 90, 38, 0.75))' : undefined}
            >
              {/* Zapato izquierdo */}
              <g>
                <path
                  d={`M ${cx - hipW / 2 + 3} ${ankleY}
                     Q ${cx - hipW / 2 - 8} ${footY - 4}, ${cx - hipW / 2 - 6} ${footY}
                     L ${cx - 7} ${footY}
                     L ${cx - 9} ${ankleY} Z`}
                  fill={shoeColor}
                />
                <path
                  d={`M ${cx - hipW / 2 + 3} ${ankleY}
                     Q ${cx - hipW / 2 - 8} ${footY - 4}, ${cx - hipW / 2 - 6} ${footY}
                     L ${cx - 7} ${footY}
                     L ${cx - 9} ${ankleY} Z`}
                  fill="url(#leather-specular)"
                />
                {/* Suela 3D */}
                <rect
                  x={cx - hipW / 2 - 7}
                  y={footY}
                  width={legW + 11}
                  height="6"
                  rx="2"
                  fill={shoe?.type === 'tenis' ? '#F7F6F2' : '#17120C'}
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth="0.8"
                />
              </g>

              {/* Zapato derecho */}
              <g>
                <path
                  d={`M ${cx + 9} ${ankleY}
                     L ${cx + 7} ${footY}
                     L ${cx + hipW / 2 + 6} ${footY}
                     Q ${cx + hipW / 2 + 8} ${footY - 4}, ${cx + hipW / 2 - 3} ${ankleY} Z`}
                  fill={shoeColor}
                />
                <path
                  d={`M ${cx + 9} ${ankleY}
                     L ${cx + 7} ${footY}
                     L ${cx + hipW / 2 + 6} ${footY}
                     Q ${cx + hipW / 2 + 8} ${footY - 4}, ${cx + hipW / 2 - 3} ${ankleY} Z`}
                  fill="url(#leather-specular)"
                />
                {/* Suela 3D */}
                <rect
                  x={cx + 7}
                  y={footY}
                  width={legW + 11}
                  height="6"
                  rx="2"
                  fill={shoe?.type === 'tenis' ? '#F7F6F2' : '#17120C'}
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth="0.8"
                />
              </g>
            </g>

            {/* ── 6. PRENDA SUPERIOR (Top) 3D CON VOLUMEN TORÁCICO ── */}
            <g
              onClick={() => handlePieceClick('top')}
              style={{ cursor: 'pointer' }}
              filter={selectedPiece === 'top' ? 'drop-shadow(0 0 10px rgba(255, 90, 38, 0.8))' : undefined}
            >
              {/* Cuerpo del Top con caída y silueta anatómica */}
              <path
                d={`M ${cx - neckW / 2 - 4} ${shoulderY - 4}
                   L ${cx - shoulderW / 2} ${shoulderY + 6}
                   L ${cx - shoulderW / 2 - 4} 175
                   L ${cx - chestW / 2 + 4} 175
                   L ${cx - waistW / 2} ${waistY + 8}
                   L ${cx + waistW / 2} ${waistY + 8}
                   L ${cx + chestW / 2 - 4} 175
                   L ${cx + shoulderW / 2 + 4} 175
                   L ${cx + shoulderW / 2} ${shoulderY + 6}
                   L ${cx + neckW / 2 + 4} ${shoulderY - 4}
                   Q ${cx} ${shoulderY + 14}, ${cx - neckW / 2 - 4} ${shoulderY - 4} Z`}
                fill={topColor}
              />

              {/* Sombreado 3D cilíndrico en el pecho y costados */}
              <path
                d={`M ${cx - neckW / 2 - 4} ${shoulderY - 4}
                   L ${cx - shoulderW / 2} ${shoulderY + 6}
                   L ${cx - shoulderW / 2 - 4} 175
                   L ${cx - chestW / 2 + 4} 175
                   L ${cx - waistW / 2} ${waistY + 8}
                   L ${cx + waistW / 2} ${waistY + 8}
                   L ${cx + chestW / 2 - 4} 175
                   L ${cx + shoulderW / 2 + 4} 175
                   L ${cx + shoulderW / 2} ${shoulderY + 6}
                   L ${cx + neckW / 2 + 4} ${shoulderY - 4}
                   Q ${cx} ${shoulderY + 14}, ${cx - neckW / 2 - 4} ${shoulderY - 4} Z`}
                fill="url(#top-3d-shade)"
              />

              {/* Arrugas naturales de tensión en cintura y axilas */}
              <path
                d={`M ${cx - waistW / 2 + 4} ${waistY - 8} Q ${cx - 10} ${waistY - 4}, ${cx - 4} ${waistY + 2}`}
                stroke="rgba(0,0,0,0.18)"
                strokeWidth="1"
                fill="none"
              />
              <path
                d={`M ${cx + waistW / 2 - 4} ${waistY - 8} Q ${cx + 10} ${waistY - 4}, ${cx + 4} ${waistY + 2}`}
                stroke="rgba(0,0,0,0.18)"
                strokeWidth="1"
                fill="none"
              />

              {/* Cuello detallado según prenda */}
              {top?.type === 'camisa' || top?.type === 'blusa' ? (
                /* Cuello camisero con cuello armado 3D y botones nacarados */
                <g>
                  {/* Pala izquierda de cuello */}
                  <polygon
                    points={`${cx - neckW / 2 - 3},${shoulderY - 4} ${cx - 1},${shoulderY + 16} ${cx - 5},${shoulderY + 2}`}
                    fill="rgba(255,255,255,0.15)"
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth="1"
                  />
                  {/* Pala derecha de cuello */}
                  <polygon
                    points={`${cx + neckW / 2 + 3},${shoulderY - 4} ${cx + 1},${shoulderY + 16} ${cx + 5},${shoulderY + 2}`}
                    fill="rgba(0,0,0,0.1)"
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth="1"
                  />
                  {/* Plaqueta central con botones con relieve */}
                  <line x1={cx} y1={shoulderY + 16} x2={cx} y2={waistY + 6} stroke="rgba(0,0,0,0.22)" strokeWidth="1.6" />
                  <circle cx={cx} cy={shoulderY + 30} r="1.6" fill="#FBF8F3" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
                  <circle cx={cx} cy={shoulderY + 52} r="1.6" fill="#FBF8F3" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
                  <circle cx={cx} cy={shoulderY + 74} r="1.6" fill="#FBF8F3" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
                </g>
              ) : top?.type === 'polo' ? (
                /* Polo con ribetes acanalados y tapeta */
                <g>
                  <path
                    d={`M ${cx - neckW / 2 - 3} ${shoulderY - 4}
                       L ${cx - 8} ${shoulderY + 12}
                       L ${cx + 8} ${shoulderY + 12}
                       L ${cx + neckW / 2 + 3} ${shoulderY - 4} Z`}
                    fill={topColor}
                    stroke="rgba(0,0,0,0.35)"
                    strokeWidth="1.2"
                  />
                  <rect x={cx - 4} y={shoulderY + 12} width="8" height="34" fill="rgba(0,0,0,0.16)" rx="1" />
                  <circle cx={cx} cy={shoulderY + 20} r="1.4" fill="#FAF7F2" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
                  <circle cx={cx} cy={shoulderY + 34} r="1.4" fill="#FAF7F2" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
                </g>
              ) : (
                /* Cuello redondo con ribete grueso de punto y sombra de cuello */
                <g>
                  <path
                    d={`M ${cx - neckW / 2 - 3} ${shoulderY - 2}
                       Q ${cx} ${shoulderY + 13}, ${cx + neckW / 2 + 3} ${shoulderY - 2}`}
                    fill="none"
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="3.5"
                  />
                  <path
                    d={`M ${cx - neckW / 2 - 3} ${shoulderY - 2}
                       Q ${cx} ${shoulderY + 13}, ${cx + neckW / 2 + 3} ${shoulderY - 2}`}
                    fill="none"
                    stroke={topColor}
                    strokeWidth="2.2"
                  />
                </g>
              )}
            </g>

            {/* ── 7. CAPA / SOBRECAMISA / BLAZER (Layer) 3D ESTILO MODELO DE ALTA COSTURA ── */}
            {layer && layerColor && (() => {
              const isBlazer = layer?.type === 'blazer';
              const isJacket = layer?.type === 'chaqueta' || layer?.type === 'cazadora';
              const isOvershirt = !isBlazer && !isJacket;

              return (
                <g
                  onClick={() => handlePieceClick('layer')}
                  style={{ cursor: 'pointer' }}
                  filter={selectedPiece === 'layer' ? 'drop-shadow(0 0 14px rgba(255, 90, 38, 0.85))' : 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'}
                >
                  {/* Sombra de oclusión ambiental proyectada hacia el top interior */}
                  <rect
                    x={cx - 15}
                    y={shoulderY + 6}
                    width="10"
                    height={waistY + 28 - (shoulderY + 6)}
                    fill="url(#layer-inner-shadow-left)"
                  />
                  <rect
                    x={cx + 5}
                    y={shoulderY + 6}
                    width="10"
                    height={waistY + 28 - (shoulderY + 6)}
                    fill="url(#layer-inner-shadow-right)"
                  />

                  {/* Sombra inferior sobre el pantalón */}
                  <ellipse
                    cx={cx}
                    cy={waistY + 27}
                    rx={hipW / 2 + 10}
                    ry="5"
                    fill="rgba(0,0,0,0.35)"
                  />

                  {/* ── MANGAS DE ALTA COSTURA CON PUÑOS Y ESTRUCTURA ── */}
                  {/* Manga Izquierda */}
                  <g>
                    <path
                      d={`M ${cx - shoulderW / 2 - 2} ${shoulderY + 3}
                         Q ${cx - shoulderW / 2 - 16} 175, ${cx - shoulderW / 2 - 10} 242
                         L ${cx - shoulderW / 2 + armW - 4} 242
                         Q ${cx - shoulderW / 2 + 3} 175, ${cx - shoulderW / 2 + armW + 6} ${shoulderY + 12} Z`}
                      fill={layerColor}
                    />
                    <path
                      d={`M ${cx - shoulderW / 2 - 2} ${shoulderY + 3}
                         Q ${cx - shoulderW / 2 - 16} 175, ${cx - shoulderW / 2 - 10} 242
                         L ${cx - shoulderW / 2 + armW - 4} 242
                         Q ${cx - shoulderW / 2 + 3} 175, ${cx - shoulderW / 2 + armW + 6} ${shoulderY + 12} Z`}
                      fill="url(#layer-sleeve-left)"
                    />
                    {/* Pliegue de flexión en el codo */}
                    <path
                      d={`M ${cx - shoulderW / 2 - 12} 196 Q ${cx - shoulderW / 2} 200, ${cx - shoulderW / 2 + armW - 3} 197`}
                      stroke="rgba(0,0,0,0.22)"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    {/* Puño camisero / de sastre con botón */}
                    <rect
                      x={cx - shoulderW / 2 - 11}
                      y={242}
                      width={armW + 7}
                      height="11"
                      rx="1.5"
                      fill={layerColor}
                      stroke="rgba(0,0,0,0.35)"
                      strokeWidth="0.9"
                    />
                    <line
                      x1={cx - shoulderW / 2 - 10}
                      y1={244}
                      x2={cx - shoulderW / 2 + armW - 5}
                      y2={244}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="0.6"
                      strokeDasharray="1.5,1.5"
                    />
                    <circle
                      cx={cx - shoulderW / 2 - 7}
                      cy={247.5}
                      r="1.4"
                      fill="#241911"
                      stroke="#4A3423"
                      strokeWidth="0.5"
                    />
                  </g>

                  {/* Manga Derecha */}
                  <g>
                    <path
                      d={`M ${cx + shoulderW / 2 + 2} ${shoulderY + 3}
                         Q ${cx + shoulderW / 2 + 16} 175, ${cx + shoulderW / 2 + 10} 242
                         L ${cx + shoulderW / 2 - armW + 4} 242
                         Q ${cx + shoulderW / 2 - 3} 175, ${cx + shoulderW / 2 - armW - 6} ${shoulderY + 12} Z`}
                      fill={layerColor}
                    />
                    <path
                      d={`M ${cx + shoulderW / 2 + 2} ${shoulderY + 3}
                         Q ${cx + shoulderW / 2 + 16} 175, ${cx + shoulderW / 2 + 10} 242
                         L ${cx + shoulderW / 2 - armW + 4} 242
                         Q ${cx + shoulderW / 2 - 3} 175, ${cx + shoulderW / 2 - armW - 6} ${shoulderY + 12} Z`}
                      fill="url(#layer-sleeve-right)"
                    />
                    {/* Pliegue de flexión en el codo */}
                    <path
                      d={`M ${cx + shoulderW / 2 + 12} 196 Q ${cx + shoulderW / 2} 200, ${cx + shoulderW / 2 - armW + 3} 197`}
                      stroke="rgba(0,0,0,0.22)"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    {/* Puño camisero / de sastre con botón */}
                    <rect
                      x={cx + shoulderW / 2 - armW + 4}
                      y={242}
                      width={armW + 7}
                      height="11"
                      rx="1.5"
                      fill={layerColor}
                      stroke="rgba(0,0,0,0.35)"
                      strokeWidth="0.9"
                    />
                    <line
                      x1={cx + shoulderW / 2 - armW + 5}
                      y1={244}
                      x2={cx + shoulderW / 2 + 10}
                      y2={244}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="0.6"
                      strokeDasharray="1.5,1.5"
                    />
                    <circle
                      cx={cx + shoulderW / 2 + 7}
                      cy={247.5}
                      r="1.4"
                      fill="#241911"
                      stroke="#4A3423"
                      strokeWidth="0.5"
                    />
                  </g>

                  {/* ── CUERPO DE LA PRENDA: PANELES FRONTALES CON CAÍDA HOLGADA HASTA LA CADERA ── */}
                  {/* Panel Izquierdo */}
                  <g>
                    <path
                      d={`M ${cx - neckW / 2 - 4} ${shoulderY - 4}
                         L ${cx - shoulderW / 2 - 4} ${shoulderY + 4}
                         Q ${cx - shoulderW / 2 - 6} 145, ${cx - chestW / 2 - 5} 174
                         Q ${cx - waistW / 2 - 7} 210, ${cx - hipW / 2 - 6} ${waistY + 28}
                         L ${cx - 14} ${waistY + 28}
                         L ${cx - 14} 160
                         L ${cx - 13} ${shoulderY + 12} Z`}
                      fill={layerColor}
                      stroke="rgba(0,0,0,0.35)"
                      strokeWidth="1.1"
                    />
                    <path
                      d={`M ${cx - neckW / 2 - 4} ${shoulderY - 4}
                         L ${cx - shoulderW / 2 - 4} ${shoulderY + 4}
                         Q ${cx - shoulderW / 2 - 6} 145, ${cx - chestW / 2 - 5} 174
                         Q ${cx - waistW / 2 - 7} 210, ${cx - hipW / 2 - 6} ${waistY + 28}
                         L ${cx - 14} ${waistY + 28}
                         L ${cx - 14} 160
                         L ${cx - 13} ${shoulderY + 12} Z`}
                      fill="url(#layer-body-left)"
                    />
                    {/* Pespunte inferior de alta costura */}
                    <line
                      x1={cx - hipW / 2 - 5}
                      y1={waistY + 26}
                      x2={cx - 14}
                      y2={waistY + 26}
                      stroke="rgba(0,0,0,0.22)"
                      strokeWidth="0.8"
                      strokeDasharray="2,1.5"
                    />
                    {/* Tapeta frontal izquierda con doble costura */}
                    <line
                      x1={cx - 18}
                      y1={shoulderY + 12}
                      x2={cx - 18}
                      y2={waistY + 28}
                      stroke="rgba(0,0,0,0.25)"
                      strokeWidth="0.8"
                      strokeDasharray="2.5,1.5"
                    />
                  </g>

                  {/* Panel Derecho */}
                  <g>
                    <path
                      d={`M ${cx + neckW / 2 + 4} ${shoulderY - 4}
                         L ${cx + shoulderW / 2 + 4} ${shoulderY + 4}
                         Q ${cx + shoulderW / 2 + 6} 145, ${cx + chestW / 2 + 5} 174
                         Q ${cx + waistW / 2 + 7} 210, ${cx + hipW / 2 + 6} ${waistY + 28}
                         L ${cx + 14} ${waistY + 28}
                         L ${cx + 14} 160
                         L ${cx + 13} ${shoulderY + 12} Z`}
                      fill={layerColor}
                      stroke="rgba(0,0,0,0.35)"
                      strokeWidth="1.1"
                    />
                    <path
                      d={`M ${cx + neckW / 2 + 4} ${shoulderY - 4}
                         L ${cx + shoulderW / 2 + 4} ${shoulderY + 4}
                         Q ${cx + shoulderW / 2 + 6} 145, ${cx + chestW / 2 + 5} 174
                         Q ${cx + waistW / 2 + 7} 210, ${cx + hipW / 2 + 6} ${waistY + 28}
                         L ${cx + 14} ${waistY + 28}
                         L ${cx + 14} 160
                         L ${cx + 13} ${shoulderY + 12} Z`}
                      fill="url(#layer-body-right)"
                    />
                    {/* Pespunte inferior */}
                    <line
                      x1={cx + 14}
                      y1={waistY + 26}
                      x2={cx + hipW / 2 + 5}
                      y2={waistY + 26}
                      stroke="rgba(0,0,0,0.22)"
                      strokeWidth="0.8"
                      strokeDasharray="2,1.5"
                    />
                    {/* Tapeta frontal derecha con doble costura */}
                    <line
                      x1={cx + 18}
                      y1={shoulderY + 12}
                      x2={cx + 18}
                      y2={waistY + 28}
                      stroke="rgba(0,0,0,0.25)"
                      strokeWidth="0.8"
                      strokeDasharray="2.5,1.5"
                    />
                  </g>

                  {/* ── CUELLO ESTRUCTURADO: SOBRECAMISA VS BLAZER ── */}
                  {/* Pie de cuello en la nuca */}
                  <path
                    d={`M ${cx - neckW / 2 - 4} ${shoulderY - 4}
                       Q ${cx} ${shoulderY - 14}, ${cx + neckW / 2 + 4} ${shoulderY - 4}
                       L ${cx + neckW / 2 + 5} ${shoulderY - 1}
                       Q ${cx} ${shoulderY - 8}, ${cx - neckW / 2 - 5} ${shoulderY - 1} Z`}
                    fill={layerColor}
                    stroke="rgba(0,0,0,0.32)"
                    strokeWidth="0.8"
                  />

                  {isOvershirt ? (
                    /* Cuello camisero abierto con solapas triangulares estructuradas */
                    <g>
                      {/* Solapa izquierda de sobrecamisa */}
                      <polygon
                        points={`${cx - neckW / 2 - 5},${shoulderY - 5} ${cx - 28},${shoulderY + 14} ${cx - 13},${shoulderY + 12} ${cx - 4},${shoulderY - 1}`}
                        fill={layerColor}
                        stroke="rgba(0,0,0,0.38)"
                        strokeWidth="0.9"
                      />
                      <line
                        x1={cx - neckW / 2 - 4}
                        y1={shoulderY - 4}
                        x2={cx - 27}
                        y2={shoulderY + 13}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="0.6"
                        strokeDasharray="1.5,1.5"
                      />

                      {/* Solapa derecha de sobrecamisa */}
                      <polygon
                        points={`${cx + neckW / 2 + 5},${shoulderY - 5} ${cx + 28},${shoulderY + 14} ${cx + 13},${shoulderY + 12} ${cx + 4},${shoulderY - 1}`}
                        fill={layerColor}
                        stroke="rgba(0,0,0,0.38)"
                        strokeWidth="0.9"
                      />
                      <line
                        x1={cx + neckW / 2 + 4}
                        y1={shoulderY - 4}
                        x2={cx + 27}
                        y2={shoulderY + 13}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="0.6"
                        strokeDasharray="1.5,1.5"
                      />
                    </g>
                  ) : (
                    /* Solapa de sastre en muesca (Notch Lapel) para blazer o chaqueta */
                    <g>
                      <path
                        d={`M ${cx - neckW / 2 - 4} ${shoulderY - 5}
                           L ${cx - 26} 136
                           L ${cx - 21} 138
                           L ${cx - 26} 165
                           L ${cx - 13} 185
                           L ${cx - 6} ${shoulderY + 10} Z`}
                        fill={layerColor}
                        stroke="rgba(0,0,0,0.4)"
                        strokeWidth="1"
                      />
                      <path
                        d={`M ${cx + neckW / 2 + 4} ${shoulderY - 5}
                           L ${cx + 26} 136
                           L ${cx + 21} 138
                           L ${cx + 26} 165
                           L ${cx + 13} 185
                           L ${cx + 6} ${shoulderY + 10} Z`}
                        fill={layerColor}
                        stroke="rgba(0,0,0,0.4)"
                        strokeWidth="1"
                      />
                    </g>
                  )}

                  {/* ── DETALLES DE ALTA COSTURA: BOLSILLOS Y BOTONES ── */}
                  {isOvershirt ? (
                    /* Bolsillos utilitarios con solapa (Signature Shacket Look) */
                    <g>
                      {/* Bolsillo de pecho izquierdo */}
                      <g>
                        <path
                          d={`M ${cx - 36} 142 L ${cx - 18} 142 L ${cx - 18} 168 L ${cx - 20} 171 L ${cx - 34} 171 L ${cx - 36} 168 Z`}
                          fill={layerColor}
                          stroke="rgba(0,0,0,0.3)"
                          strokeWidth="0.8"
                        />
                        <line
                          x1={cx - 27}
                          y1={143}
                          x2={cx - 27}
                          y2={170}
                          stroke="rgba(0,0,0,0.22)"
                          strokeWidth="0.7"
                          strokeDasharray="1.5,1.5"
                        />
                        {/* Solapa del bolsillo con forma de sobre */}
                        <path
                          d={`M ${cx - 37} 140 L ${cx - 17} 140 L ${cx - 17} 148 L ${cx - 27} 153 L ${cx - 37} 148 Z`}
                          fill={layerColor}
                          stroke="rgba(0,0,0,0.38)"
                          strokeWidth="0.9"
                        />
                        <circle cx={cx - 27} cy={148} r="1.8" fill="#241911" stroke="#4A3423" strokeWidth="0.5" />
                        <circle cx={cx - 27} cy={148} r="0.7" fill="#8C6544" />
                      </g>

                      {/* Bolsillo de pecho derecho */}
                      <g>
                        <path
                          d={`M ${cx + 18} 142 L ${cx + 36} 142 L ${cx + 36} 168 L ${cx + 34} 171 L ${cx + 20} 171 L ${cx + 18} 168 Z`}
                          fill={layerColor}
                          stroke="rgba(0,0,0,0.3)"
                          strokeWidth="0.8"
                        />
                        <line
                          x1={cx + 27}
                          y1={143}
                          x2={cx + 27}
                          y2={170}
                          stroke="rgba(0,0,0,0.22)"
                          strokeWidth="0.7"
                          strokeDasharray="1.5,1.5"
                        />
                        {/* Solapa del bolsillo derecho */}
                        <path
                          d={`M ${cx + 17} 140 L ${cx + 37} 140 L ${cx + 37} 148 L ${cx + 27} 153 L ${cx + 17} 148 Z`}
                          fill={layerColor}
                          stroke="rgba(0,0,0,0.38)"
                          strokeWidth="0.9"
                        />
                        <circle cx={cx + 27} cy={148} r="1.8" fill="#241911" stroke="#4A3423" strokeWidth="0.5" />
                        <circle cx={cx + 27} cy={148} r="0.7" fill="#8C6544" />
                      </g>

                      {/* Botones de cuerno de alta costura a lo largo de la tapeta derecha */}
                      <g>
                        {[shoulderY + 26, 158, 188, 218].map((btnY, i) => (
                          <g key={i}>
                            <circle cx={cx + 19} cy={btnY} r="2.2" fill="#221811" stroke="#483424" strokeWidth="0.6" />
                            <circle cx={cx + 19} cy={btnY} r="1" fill="#755234" />
                            {/* Ojal horizontal discreto en tapeta izquierda */}
                            <line x1={cx - 21} y1={btnY} x2={cx - 17} y2={btnY} stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" />
                          </g>
                        ))}
                      </g>
                    </g>
                  ) : (
                    /* Detalles de sastrería para blazer */
                    <g>
                      {/* Bolsillo superior izquierdo con Pañuelo de Bolsillo Blanco (Pocket Square) */}
                      <rect
                        x={cx - 35}
                        y={142}
                        width="16"
                        height="3.5"
                        fill="rgba(0,0,0,0.25)"
                        stroke="rgba(0,0,0,0.4)"
                        strokeWidth="0.8"
                      />
                      {/* Pañuelo doblado en pico de lino blanco */}
                      <polygon
                        points={`${cx - 33},142 ${cx - 29},136 ${cx - 25},142`}
                        fill="#FFFFFF"
                        stroke="rgba(0,0,0,0.15)"
                        strokeWidth="0.5"
                      />
                      <polygon
                        points={`${cx - 28},142 ${cx - 24},137 ${cx - 20},142`}
                        fill="#F6F6F6"
                        stroke="rgba(0,0,0,0.15)"
                        strokeWidth="0.5"
                      />

                      {/* Bolsillos de tapeta en la cintura baja */}
                      <rect
                        x={cx - 37}
                        y={204}
                        width="18"
                        height="5"
                        rx="1"
                        fill={layerColor}
                        stroke="rgba(0,0,0,0.35)"
                        strokeWidth="0.8"
                      />
                      <rect
                        x={cx + 19}
                        y={204}
                        width="18"
                        height="5"
                        rx="1"
                        fill={layerColor}
                        stroke="rgba(0,0,0,0.35)"
                        strokeWidth="0.8"
                      />

                      {/* Botón de sastre */}
                      <circle cx={cx + 17} cy={188} r="2.4" fill="#1C1814" stroke="#443526" strokeWidth="0.7" />
                    </g>
                  )}
                </g>
              );
            })()}

            {/* ── 8. CABEZA Y ROSTRO 3D DE ALTA COSTURA ── */}
            {/* Cabeza oval estilizada con sombreado esférico */}
            <ellipse
              cx={cx}
              cy="56"
              rx="18"
              ry="23"
              fill={`url(#skin-3d-face-${skin}-${finish})`}
              stroke={lightingMoods.rimColor}
              strokeWidth="0.8"
            />

            {/* Orejas anatómicas */}
            <ellipse cx={cx - 18} cy="57" rx="3.5" ry="6" fill={skinColors.base} stroke={skinColors.shadow} strokeWidth="0.8" />
            <ellipse cx={cx + 18} cy="57" rx="3.5" ry="6" fill={skinColors.base} stroke={skinColors.shadow} strokeWidth="0.8" />

            {/* Rasgos faciales de maniquí de atelier contemporáneo */}
            {finish === 'realista' && (
              <g>
                {/* Cejas perfiladas */}
                <path d={`M ${cx - 11} 49 Q ${cx - 6} 47, ${cx - 2} 50`} stroke={hairColor} strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d={`M ${cx + 2} 50 Q ${cx + 6} 47, ${cx + 11} 49`} stroke={hairColor} strokeWidth="1.6" fill="none" strokeLinecap="round" />
                {/* Mirada editorial (ojos con párpado) */}
                <path d={`M ${cx - 10} 55 Q ${cx - 6} 57, ${cx - 2} 55`} stroke="rgba(0,0,0,0.65)" strokeWidth="1.3" fill="none" />
                <circle cx={cx - 6} cy="56" r="1.1" fill="rgba(0,0,0,0.8)" />
                <path d={`M ${cx + 2} 55 Q ${cx + 6} 57, ${cx + 10} 55`} stroke="rgba(0,0,0,0.65)" strokeWidth="1.3" fill="none" />
                <circle cx={cx + 6} cy="56" r="1.1" fill="rgba(0,0,0,0.8)" />
                {/* Puente nasal con reflejo y sombra de aleta */}
                <path d={`M ${cx - 0.5} 53 L ${cx} 63 L ${cx + 3} 64.5`} stroke={skinColors.shadow} strokeWidth="1.2" fill="none" />
                <circle cx={cx} cy="63.5" r="0.8" fill={skinColors.highlight} />
                {/* Labios con arco de cupido suave */}
                <path d={`M ${cx - 6} 70 Q ${cx} 72.5, ${cx + 6} 70`} stroke={skinColors.shadow} strokeWidth="1.8" fill="none" strokeLinecap="round" />
              </g>
            )}

            {/* Barba según perfil */}
            {finish === 'realista' && beard === 'corta' && (
              <path
                d={`M ${cx - 15} 58 Q ${cx - 12} 76, ${cx} 79 Q ${cx + 12} 76, ${cx + 15} 58 Q ${cx + 8} 74, ${cx} 75 Q ${cx - 8} 74, ${cx - 15} 58 Z`}
                fill={hairColor}
                opacity="0.65"
              />
            )}
            {finish === 'realista' && beard === 'completa' && (
              <path
                d={`M ${cx - 16} 55 Q ${cx - 14} 79, ${cx} 82 Q ${cx + 14} 79, ${cx + 16} 55 Q ${cx + 8} 74, ${cx} 75 Q ${cx - 8} 74, ${cx - 16} 55 Z`}
                fill={hairColor}
                opacity="0.88"
              />
            )}

            {/* ── 9. PEINADO CON VOLUMEN 3D ── */}
            {finish === 'realista' && (
              <g>
                {hairStyle === 'rapado' ? (
                  <path
                    d={`M ${cx - 18} 54 Q ${cx} 30, ${cx + 18} 54 Q ${cx} 42, ${cx - 18} 54 Z`}
                    fill={hairColor}
                    opacity="0.55"
                  />
                ) : hairStyle === 'rizado' ? (
                  /* Rizado con micro-esferas 3D de cabello */
                  <g fill={hairColor}>
                    <circle cx={cx - 15} cy="42" r="7.5" />
                    <circle cx={cx - 8} cy="36" r="8.5" />
                    <circle cx={cx} cy="32" r="9" />
                    <circle cx={cx + 8} cy="36" r="8.5" />
                    <circle cx={cx + 15} cy="42" r="7.5" />
                    <circle cx={cx - 17} cy="50" r="5.5" />
                    <circle cx={cx + 17} cy="50" r="5.5" />
                    {/* Mechones con reflejo suave */}
                    <circle cx={cx - 4} cy="34" r="2.5" fill="rgba(255,255,255,0.12)" />
                  </g>
                ) : hairStyle === 'largo' ? (
                  /* Melena fluida con volumen lateral */
                  <path
                    d={`M ${cx - 18} 54 Q ${cx} 26, ${cx + 18} 54
                       L ${cx + 21} 96 Q ${cx + 15} 90, ${cx + 16} 70
                       L ${cx - 16} 70 Q ${cx - 15} 90, ${cx - 21} 96 Z`}
                    fill={hairColor}
                  />
                ) : hairStyle === 'ondulado' ? (
                  /* Ondas esculpidas */
                  <path
                    d={`M ${cx - 18} 52 Q ${cx - 8} 30, ${cx} 31 Q ${cx + 14} 27, ${cx + 19} 50
                       Q ${cx + 12} 41, ${cx} 43 Q ${cx - 12} 41, ${cx - 18} 52 Z`}
                    fill={hairColor}
                  />
                ) : (
                  /* Corto contemporáneo con tupé y textura */
                  <g>
                    <path
                      d={`M ${cx - 18} 53
                         Q ${cx - 14} 33, ${cx} 32
                         Q ${cx + 16} 33, ${cx + 19} 52
                         Q ${cx + 10} 43, ${cx} 45
                         Q ${cx - 10} 43, ${cx - 18} 53 Z`}
                      fill={hairColor}
                    />
                    <path
                      d={`M ${cx - 12} 42 Q ${cx} 35, ${cx + 12} 42`}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </g>
                )}
              </g>
            )}

            {/* Gafas de Sol de Modelo de Pasarela */}
            {finish === 'realista' && showSunglasses && (
              <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.5))">
                {/* Montura de pasta italiana / carey */}
                <path
                  d={`M ${cx - 16} 49 L ${cx - 2} 49 L ${cx - 3} 60 L ${cx - 15} 60 Z`}
                  fill="#151210"
                  stroke="#38281B"
                  strokeWidth="0.8"
                />
                <path
                  d={`M ${cx + 2} 49 L ${cx + 16} 49 L ${cx + 15} 60 L ${cx + 3} 60 Z`}
                  fill="#151210"
                  stroke="#38281B"
                  strokeWidth="0.8"
                />
                {/* Puente metálico dorado */}
                <rect x={cx - 2.5} y="50" width="5" height="2" rx="0.5" fill="#C5A059" />
                {/* Cristales polarizados oscuros */}
                <path
                  d={`M ${cx - 15} 50.5 L ${cx - 3} 50.5 L ${cx - 4} 58.5 L ${cx - 14} 58.5 Z`}
                  fill="url(#sunglasses-lens)"
                />
                <path
                  d={`M ${cx + 3} 50.5 L ${cx + 15} 50.5 L ${cx + 14} 58.5 L ${cx + 4} 58.5 Z`}
                  fill="url(#sunglasses-lens)"
                />
                {/* Reflejos de pasarela oblicuos */}
                <polygon
                  points={`${cx - 14},51 ${cx - 8},51 ${cx - 11},58 ${cx - 14},58`}
                  fill="url(#sunglasses-glare)"
                  opacity="0.7"
                />
                <polygon
                  points={`${cx + 4},51 ${cx + 10},51 ${cx + 7},58 ${cx + 4},58`}
                  fill="url(#sunglasses-glare)"
                  opacity="0.7"
                />
                {/* Patillas hacia las orejas */}
                <line x1={cx - 16} y1={50} x2={cx - 18} y2={53} stroke="#221A14" strokeWidth="1.2" />
                <line x1={cx + 16} y1={50} x2={cx + 18} y2={53} stroke="#221A14" strokeWidth="1.2" />
              </g>
            )}

            {/* Cabeza escultórica si es modo Atelier */}
            {finish === 'escultural' && (
              <path
                d={`M ${cx - 14} 50 L ${cx + 14} 50`}
                stroke="#C5A059"
                strokeWidth="1.5"
                fill="none"
              />
            )}
          </svg>
        </div>
      </div>

      {/* ── TARJETA DE INSPECCIÓN 3D DE PRENDA SELECCIONADA ── */}
      {selectedPiece && (
        <div
          style={{
            marginTop: 10,
            width: '100%',
            background: 'linear-gradient(135deg, rgba(255, 90, 38, 0.12), rgba(0, 0, 0, 0.4))',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--r-md)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            fontSize: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background:
                  selectedPiece === 'top'
                    ? topColor
                    : selectedPiece === 'layer'
                    ? layerColor
                    : selectedPiece === 'bottom'
                    ? bottomColor
                    : shoeColor,
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 0 8px rgba(255, 90, 38, 0.5)'
              }}
            />
            <div>
              <div style={{ fontWeight: 800, color: 'var(--ink)' }}>
                {selectedPiece === 'top'
                  ? top?.name || 'Prenda Superior'
                  : selectedPiece === 'layer'
                  ? layer?.name || 'Capa'
                  : selectedPiece === 'bottom'
                  ? bottom?.name || 'Prenda Inferior'
                  : shoe?.name || 'Calzado'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--ink-2)' }}>
                {selectedPiece === 'top'
                  ? `Proximidad facial · ${top?.colorName || 'Tono'} (Afinidad dérmica con piel ${skin})`
                  : selectedPiece === 'layer'
                  ? `Estructura y textura · ${layer?.colorName || 'Tono'}`
                  : selectedPiece === 'bottom'
                  ? `Base de silueta · ${bottom?.colorName || 'Tono'}`
                  : `Anclaje y equilibrio · ${shoe?.colorName || 'Tono'}`}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedPiece(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--ink-2)',
              fontSize: 14,
              cursor: 'pointer',
              padding: 4
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── ANOTACIONES FLOTANTES CON CHIPS 3D ── */}
      {showAnnotations && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 6,
            marginTop: 12,
            width: '100%'
          }}
        >
          {top && (
            <div
              onClick={() => handlePieceClick('top')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 'var(--r-full)',
                background: selectedPiece === 'top' ? 'var(--accent)' : 'var(--surface-3)',
                color: selectedPiece === 'top' ? '#FFF' : 'inherit',
                border: selectedPiece === 'top' ? '1px solid var(--accent)' : '1px solid var(--line)',
                fontSize: 11,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: topColor,
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              />
              <span style={{ fontWeight: 700 }}>{top.name}</span>
            </div>
          )}

          {layer && (
            <div
              onClick={() => handlePieceClick('layer')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 'var(--r-full)',
                background: selectedPiece === 'layer' ? 'var(--accent)' : 'var(--surface-3)',
                color: selectedPiece === 'layer' ? '#FFF' : 'inherit',
                border: selectedPiece === 'layer' ? '1px solid var(--accent)' : '1px solid var(--line)',
                fontSize: 11,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: layerColor,
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              />
              <span style={{ fontWeight: 700 }}>{layer.name}</span>
            </div>
          )}

          {bottom && (
            <div
              onClick={() => handlePieceClick('bottom')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 'var(--r-full)',
                background: selectedPiece === 'bottom' ? 'var(--accent)' : 'var(--surface-3)',
                color: selectedPiece === 'bottom' ? '#FFF' : 'inherit',
                border: selectedPiece === 'bottom' ? '1px solid var(--accent)' : '1px solid var(--line)',
                fontSize: 11,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: bottomColor,
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              />
              <span style={{ fontWeight: 700 }}>{bottom.name}</span>
            </div>
          )}

          {shoe && (
            <div
              onClick={() => handlePieceClick('shoes')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 'var(--r-full)',
                background: selectedPiece === 'shoes' ? 'var(--accent)' : 'var(--surface-3)',
                color: selectedPiece === 'shoes' ? '#FFF' : 'inherit',
                border: selectedPiece === 'shoes' ? '1px solid var(--accent)' : '1px solid var(--line)',
                fontSize: 11,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: shoeColor,
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              />
              <span style={{ fontWeight: 700 }}>{shoe.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
