/* ============================================================
   AVATAR CUSTOMIZER · Estudio de Personalización y Probador 3D
   Permite al usuario calibrar sus rasgos físicos reales (piel,
   complexión, estatura, cabello, barba) y probar combinaciones de
   outfits virtualmente sobre su avatar biomecánico 3D.
   ============================================================ */

import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { AvatarMannequin } from './AvatarMannequin';
import {
  IconCheck,
  IconCube,
  IconSparkles,
  IconRefresh,
  IconTop,
  IconBottom,
  IconLayer,
  IconShoes,
  IconStar
} from './Icons';
import type {
  SkinTone,
  BodyBuild,
  AvatarHairStyle,
  AvatarBeard,
  WardrobePreference,
  Garment
} from '../types';
import { BUILDS, SKINS } from '../lib/data';

const SKIN_UNDERTONES: Record<SkinTone, string> = {
  clara: 'Nórdico · Frío',
  media: 'Mediterráneo · Neutro',
  morena: 'Cálido · Tierra',
  oscura: 'Ébano · Castaño',
  'muy-oscura': 'Ébano profundo'
};

export interface AvatarCustomizerProps {
  initialTab?: 'traits' | 'tryon';
  onSaved?: () => void;
  className?: string;
  showTitle?: boolean;
}

// Catálogo de colores de cabello realistas
const HAIR_COLORS = [
  { name: 'Negro Azabache', hex: '#1A1A1A' },
  { name: 'Castaño Oscuro', hex: '#362215' },
  { name: 'Castaño Cálido', hex: '#593822' },
  { name: 'Rubio Dorado', hex: '#C19A6B' },
  { name: 'Cobrizo Tierra', hex: '#8B3A1A' },
  { name: 'Plata / Canoso', hex: '#8B8B8B' }
];

// Fórmulas de outfits de prueba listas para alta costura (Catálogo de los 11 Estilos de Modelo)
const PRESET_OUTFITS: {
  id: string;
  name: string;
  desc: string;
  top: Garment;
  layer?: Garment;
  bottom: Garment;
  shoe: Garment;
}[] = [
  {
    id: 'elegante-clasico',
    name: '1. Elegante Clásico',
    desc: 'Camisa blanca + pantalón camel + blazer marino + zapatos coñac (Formal / Business)',
    top: {
      id: 'pre-top-blanca',
      name: 'Camisa Blanca Algodón',
      type: 'camisa',
      cat: 'top',
      colorName: 'Blanco Puro',
      colorHex: '#F8F9FA',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    layer: {
      id: 'pre-layer-marino',
      name: 'Blazer Azul Marino',
      type: 'blazer',
      cat: 'layer',
      colorName: 'Azul Marino',
      colorHex: '#1C2B42',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    bottom: {
      id: 'pre-bottom-camel',
      name: 'Pantalón Camel',
      type: 'pantalon',
      cat: 'bottom',
      colorName: 'Camel Dorado',
      colorHex: '#C19A6B',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    shoe: {
      id: 'pre-shoe-conac',
      name: 'Zapatos Oxford Coñac',
      type: 'zapatos',
      cat: 'shoes',
      colorName: 'Coñac Tostado',
      colorHex: '#7B3F11',
      colorCat: 'accent',
      status: 'ok',
      addedAt: 1
    }
  },
  {
    id: 'fresco-moderno',
    name: '2. Fresco Moderno',
    desc: 'Polo oliva + chino beige + sobrecamisa marrón + mocasines (Casual refinado)',
    top: {
      id: 'pre-top-oliva',
      name: 'Polo Verde Oliva',
      type: 'polo',
      cat: 'top',
      colorName: 'Verde Oliva',
      colorHex: '#636B46',
      colorCat: 'secondary',
      status: 'ok',
      addedAt: 1
    },
    layer: {
      id: 'pre-layer-marron',
      name: 'Sobrecamisa Marrón Oscuro',
      type: 'sobrecamisa',
      cat: 'layer',
      colorName: 'Marrón Oscuro',
      colorHex: '#4A3220',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    bottom: {
      id: 'pre-bottom-beige',
      name: 'Chino Beige Piedra',
      type: 'pantalon',
      cat: 'bottom',
      colorName: 'Beige Piedra',
      colorHex: '#D4C5B3',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    shoe: {
      id: 'pre-shoe-mocasines-m',
      name: 'Mocasines Marrón Oscuro',
      type: 'mocasines',
      cat: 'shoes',
      colorName: 'Marrón Oscuro',
      colorHex: '#382417',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    }
  },
  {
    id: 'noche-sofisticada',
    name: '3. Noche Sofisticada',
    desc: 'Camisa borgoña + pantalón gris carbón + chaqueta negra + zapatos negros',
    top: {
      id: 'pre-top-borgona',
      name: 'Camisa Borgoña',
      type: 'camisa',
      cat: 'top',
      colorName: 'Borgoña / Vino',
      colorHex: '#5E1928',
      colorCat: 'accent',
      status: 'ok',
      addedAt: 1
    },
    layer: {
      id: 'pre-layer-negra',
      name: 'Chaqueta Negra Suave',
      type: 'chaqueta',
      cat: 'layer',
      colorName: 'Negro Suave',
      colorHex: '#1E1E22',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    bottom: {
      id: 'pre-bottom-carbon',
      name: 'Pantalón Gris Carbón',
      type: 'pantalon',
      cat: 'bottom',
      colorName: 'Gris Carbón',
      colorHex: '#34373E',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    shoe: {
      id: 'pre-shoe-negro',
      name: 'Zapatos de Vestir Negro',
      type: 'zapatos',
      cat: 'shoes',
      colorName: 'Negro Azabache',
      colorHex: '#161618',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    }
  },
  {
    id: 'casual-premium',
    name: '4. Casual Premium',
    desc: 'Camiseta blanca + pantalón gris + chaqueta azul petróleo + tenis blancos',
    top: {
      id: 'pre-top-blanca-t',
      name: 'Camiseta Blanca Seda',
      type: 'camiseta',
      cat: 'top',
      colorName: 'Blanco Puro',
      colorHex: '#FBFBFB',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    layer: {
      id: 'pre-layer-petroleo',
      name: 'Chaqueta Azul Petróleo',
      type: 'chaqueta',
      cat: 'layer',
      colorName: 'Azul Petróleo',
      colorHex: '#234559',
      colorCat: 'secondary',
      status: 'ok',
      addedAt: 1
    },
    bottom: {
      id: 'pre-bottom-gris-c',
      name: 'Pantalón Gris Claro',
      type: 'pantalon',
      cat: 'bottom',
      colorName: 'Gris Claro',
      colorHex: '#A4AAB3',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    shoe: {
      id: 'pre-shoe-tenis-b',
      name: 'Tenis Cuero Blanco',
      type: 'tenis',
      cat: 'shoes',
      colorName: 'Blanco Roto',
      colorHex: '#ECEBE6',
      colorCat: 'accent',
      status: 'ok',
      addedAt: 1
    }
  },
  {
    id: 'tierra-refinada',
    name: '5. Tierra Refinada',
    desc: 'Polo terracota + chino arena + zapatos chocolate + camiseta marfil',
    top: {
      id: 'pre-top-terracota-p',
      name: 'Polo Terracota Cálido',
      type: 'polo',
      cat: 'top',
      colorName: 'Terracota',
      colorHex: '#A8482A',
      colorCat: 'accent',
      status: 'ok',
      addedAt: 1
    },
    layer: {
      id: 'pre-layer-marfil',
      name: 'Sobrecamisa Marfil Cálido',
      type: 'sobrecamisa',
      cat: 'layer',
      colorName: 'Marfil / Crema',
      colorHex: '#F2EEE5',
      colorCat: 'accent',
      status: 'ok',
      addedAt: 1
    },
    bottom: {
      id: 'pre-bottom-arena',
      name: 'Chino Tono Arena',
      type: 'pantalon',
      cat: 'bottom',
      colorName: 'Arena Tostada',
      colorHex: '#D9CBB7',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    shoe: {
      id: 'pre-shoe-choco-m',
      name: 'Mocasines Chocolate',
      type: 'mocasines',
      cat: 'shoes',
      colorName: 'Chocolate Amargo',
      colorHex: '#3B2317',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    }
  },
  {
    id: 'oficina-moderna',
    name: '6. Oficina Moderna',
    desc: 'Camisa azul claro + pantalón gris + blazer azul marino + zapatos coñac',
    top: {
      id: 'pre-top-azul-c',
      name: 'Camisa Azul Claro',
      type: 'camisa',
      cat: 'top',
      colorName: 'Azul Claro',
      colorHex: '#B0C4DE',
      colorCat: 'secondary',
      status: 'ok',
      addedAt: 1
    },
    layer: {
      id: 'pre-layer-marino-o',
      name: 'Blazer Azul Marino',
      type: 'blazer',
      cat: 'layer',
      colorName: 'Azul Marino',
      colorHex: '#1B2940',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    bottom: {
      id: 'pre-bottom-gris-m',
      name: 'Pantalón Gris Medio',
      type: 'pantalon',
      cat: 'bottom',
      colorName: 'Gris Medio',
      colorHex: '#6B7280',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    shoe: {
      id: 'pre-shoe-conac-o',
      name: 'Zapatos Oxford Coñac',
      type: 'zapatos',
      cat: 'shoes',
      colorName: 'Coñac',
      colorHex: '#7A421D',
      colorCat: 'accent',
      status: 'ok',
      addedAt: 1
    }
  },
  {
    id: 'smart-casual',
    name: '7. Smart Casual',
    desc: 'Polo esmeralda + pantalón caqui + chaqueta crema + mocasines café',
    top: {
      id: 'pre-top-esmeralda',
      name: 'Polo Verde Esmeralda',
      type: 'polo',
      cat: 'top',
      colorName: 'Verde Esmeralda',
      colorHex: '#1C4D3B',
      colorCat: 'accent',
      status: 'ok',
      addedAt: 1
    },
    layer: {
      id: 'pre-layer-crema-sc',
      name: 'Chaqueta / Sobrecamisa Crema',
      type: 'sobrecamisa',
      cat: 'layer',
      colorName: 'Crema Suave',
      colorHex: '#E8E0D2',
      colorCat: 'accent',
      status: 'ok',
      addedAt: 1
    },
    bottom: {
      id: 'pre-bottom-caqui',
      name: 'Pantalón Caqui Dorado',
      type: 'pantalon',
      cat: 'bottom',
      colorName: 'Caqui',
      colorHex: '#B79D76',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    shoe: {
      id: 'pre-shoe-cafe',
      name: 'Mocasines Café',
      type: 'mocasines',
      cat: 'shoes',
      colorName: 'Café Tostado',
      colorHex: '#4A3022',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    }
  },
  {
    id: 'verano-estilo',
    name: '8. Verano con Estilo',
    desc: 'Camisa lino blanco + pantalón arena + sobrecamisa salvia + mocasines tabaco',
    top: {
      id: 'pre-top-lino-b',
      name: 'Camisa de Lino Blanca',
      type: 'camisa',
      cat: 'top',
      colorName: 'Blanco Roto',
      colorHex: '#F5F3EC',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    layer: {
      id: 'pre-layer-salvia',
      name: 'Sobrecamisa Verde Salvia',
      type: 'sobrecamisa',
      cat: 'layer',
      colorName: 'Verde Salvia',
      colorHex: '#7D8D70',
      colorCat: 'secondary',
      status: 'ok',
      addedAt: 1
    },
    bottom: {
      id: 'pre-bottom-arena-c',
      name: 'Pantalón Arena Clara',
      type: 'pantalon',
      cat: 'bottom',
      colorName: 'Arena Clara',
      colorHex: '#DACDBB',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    shoe: {
      id: 'pre-shoe-tabaco-m',
      name: 'Mocasines Tabaco',
      type: 'mocasines',
      cat: 'shoes',
      colorName: 'Tabaco',
      colorHex: '#6D4C33',
      colorCat: 'accent',
      status: 'ok',
      addedAt: 1
    }
  },
  {
    id: 'tierra-elegante',
    name: '9. Tierra Elegante',
    desc: 'Camisa marfil + pantalón beige piedra + blazer tabaco + zapatos chocolate',
    top: {
      id: 'pre-top-marfil-c',
      name: 'Camisa Marfil Seda',
      type: 'camisa',
      cat: 'top',
      colorName: 'Marfil',
      colorHex: '#F3EEE3',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    layer: {
      id: 'pre-layer-tabaco-b',
      name: 'Blazer Tabaco Cálido',
      type: 'blazer',
      cat: 'layer',
      colorName: 'Tabaco',
      colorHex: '#6E4528',
      colorCat: 'accent',
      status: 'ok',
      addedAt: 1
    },
    bottom: {
      id: 'pre-bottom-beige-p',
      name: 'Pantalón Beige Piedra',
      type: 'pantalon',
      cat: 'bottom',
      colorName: 'Beige Piedra',
      colorHex: '#CEBFAC',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    shoe: {
      id: 'pre-shoe-choco-z',
      name: 'Zapatos Chocolate',
      type: 'zapatos',
      cat: 'shoes',
      colorName: 'Chocolate Amargo',
      colorHex: '#382115',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    }
  },
  {
    id: 'caidos-equilibrados',
    name: '10. Caídos Equilibrados',
    desc: 'Sobrecamisa oliva + camiseta crema + chino camel + botines topo',
    top: {
      id: 'pre-top-crema-ce',
      name: 'Camiseta Crema Suave',
      type: 'camiseta',
      cat: 'top',
      colorName: 'Crema',
      colorHex: '#F2ECE0',
      colorCat: 'accent',
      status: 'ok',
      addedAt: 1
    },
    layer: {
      id: 'pre-layer-oliva-a',
      name: 'Sobrecamisa Oliva Apagado',
      type: 'sobrecamisa',
      cat: 'layer',
      colorName: 'Oliva Apagado',
      colorHex: '#656C4A',
      colorCat: 'secondary',
      status: 'ok',
      addedAt: 1
    },
    bottom: {
      id: 'pre-bottom-camel-ce',
      name: 'Chino Camel Dorado',
      type: 'pantalon',
      cat: 'bottom',
      colorName: 'Camel',
      colorHex: '#BF925A',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    shoe: {
      id: 'pre-shoe-topo',
      name: 'Botines de Cuero Topo',
      type: 'botas',
      cat: 'shoes',
      colorName: 'Topo',
      colorHex: '#7A7265',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    }
  },
  {
    id: 'salida-nocturna-tierra',
    name: '11. Salida Nocturna Tierra',
    desc: 'Sobrecamisa chocolate + camiseta crema + pantalón gris carbón + mocasines chocolate',
    top: {
      id: 'pre-top-crema-sn',
      name: 'Camiseta Crema Seda',
      type: 'camiseta',
      cat: 'top',
      colorName: 'Crema',
      colorHex: '#F1EBE0',
      colorCat: 'accent',
      status: 'ok',
      addedAt: 1
    },
    layer: {
      id: 'pre-layer-choco-sn',
      name: 'Sobrecamisa Chocolate',
      type: 'sobrecamisa',
      cat: 'layer',
      colorName: 'Chocolate Amargo',
      colorHex: '#3F2A1E',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    bottom: {
      id: 'pre-bottom-carbon-sn',
      name: 'Pantalón Gris Carbón',
      type: 'pantalon',
      cat: 'bottom',
      colorName: 'Gris Carbón',
      colorHex: '#33363D',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    },
    shoe: {
      id: 'pre-shoe-choco-sn',
      name: 'Mocasines Chocolate',
      type: 'mocasines',
      cat: 'shoes',
      colorName: 'Chocolate',
      colorHex: '#3A2419',
      colorCat: 'base',
      status: 'ok',
      addedAt: 1
    }
  }
];

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({
  initialTab = 'traits',
  onSaved,
  className = '',
  showTitle = true
}) => {
  // Estado global desde el store
  const storedSkin = useStore(s => s.skin);
  const storedBuild = useStore(s => s.build);
  const storedHeight = useStore(s => s.height);
  const storedPreference = useStore(s => s.wardrobePreference);
  const storedHairStyle = useStore(s => s.avatarHairStyle);
  const storedHairColor = useStore(s => s.avatarHairColor);
  const storedBeard = useStore(s => s.avatarBeard);
  const userGarments = useStore(s => s.garments);
  const setProfile = useStore(s => s.setProfile);

  // Pestaña activa: 'traits' (Rasgos Físicos) o 'tryon' (Probador Virtual)
  const [activeTab, setActiveTab] = useState<'traits' | 'tryon'>(initialTab);

  // Estado local para personalización antes de guardar
  const [skin, setSkin] = useState<SkinTone>(storedSkin);
  const [build, setBuild] = useState<BodyBuild>(storedBuild);
  const [height, setHeight] = useState<string>(storedHeight || '175');
  const [wardrobePreference, setWardrobePreference] = useState<WardrobePreference>(storedPreference || 'sin-filtro');
  const [hairStyle, setHairStyle] = useState<AvatarHairStyle>(storedHairStyle || 'corto');
  const [hairColor, setHairColor] = useState<string>(storedHairColor || '#1A1A1A');
  const [beard, setBeard] = useState<AvatarBeard>(storedBeard || 'ninguna');

  // Estado del probador virtual de outfits
  const [presetIndex, setPresetIndex] = useState<number>(0);
  const [useCustomGarments, setUseCustomGarments] = useState<boolean>(false);
  const [customTopId, setCustomTopId] = useState<string>('');
  const [customLayerId, setCustomLayerId] = useState<string>('');
  const [customBottomId, setCustomBottomId] = useState<string>('');
  const [customShoeId, setCustomShoeId] = useState<string>('');

  // Notificación de guardado
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Prendas filtradas por categoría del armario del usuario
  const userTops = userGarments.filter(g => g.cat === 'top');
  const userLayers = userGarments.filter(g => g.cat === 'layer');
  const userBottoms = userGarments.filter(g => g.cat === 'bottom');
  const userShoes = userGarments.filter(g => g.cat === 'shoes');

  // Prenda activa para el probador
  const activePreset = PRESET_OUTFITS[presetIndex] || PRESET_OUTFITS[0];

  const activeTop: Garment | null = useCustomGarments
    ? userTops.find(g => g.id === customTopId) || userTops[0] || activePreset.top
    : activePreset.top;

  const activeLayer: Garment | null | undefined = useCustomGarments
    ? userLayers.find(g => g.id === customLayerId) || null
    : activePreset.layer;

  const activeBottom: Garment | null = useCustomGarments
    ? userBottoms.find(g => g.id === customBottomId) || userBottoms[0] || activePreset.bottom
    : activePreset.bottom;

  const activeShoe: Garment | null = useCustomGarments
    ? userShoes.find(g => g.id === customShoeId) || userShoes[0] || activePreset.shoe
    : activePreset.shoe;

  // Comprobar si hay cambios sin guardar
  const hasUnsavedChanges =
    skin !== storedSkin ||
    build !== storedBuild ||
    height !== storedHeight ||
    wardrobePreference !== storedPreference ||
    hairStyle !== storedHairStyle ||
    hairColor !== storedHairColor ||
    beard !== storedBeard;

  // Guardar en el perfil de usuario (Zustand + localStorage)
  const handleSaveProfile = () => {
    setProfile({
      skin,
      build,
      height,
      wardrobePreference,
      avatarHairStyle: hairStyle,
      avatarHairColor: hairColor,
      avatarBeard: beard
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    onSaved?.();
  };

  // Revertir cambios a los valores guardados
  const handleResetToSaved = () => {
    setSkin(storedSkin);
    setBuild(storedBuild);
    setHeight(storedHeight);
    setWardrobePreference(storedPreference);
    setHairStyle(storedHairStyle);
    setHairColor(storedHairColor);
    setBeard(storedBeard);
  };

  return (
    <div
      className={`avatar-customizer-container ${className}`}
      style={{
        background: 'var(--surface-2)',
        borderRadius: 'var(--r-xl)',
        border: '1px solid var(--line)',
        padding: '24px 20px',
        width: '100%'
      }}
    >
      {/* ── Encabezado del Personalizador ── */}
      {showTitle && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1.2, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <IconCube size={14} /> Estudio Biomecánico 3D
              </div>
              <h2 style={{ fontSize: 20, fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 900, color: 'var(--ink)', marginTop: 4 }}>
                Personalizar Avatar y Probador Virtual
              </h2>
            </div>

            {/* Pestañas de Modo */}
            <div
              style={{
                display: 'inline-flex',
                background: 'var(--surface-3)',
                padding: 4,
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--line)'
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('traits')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--r-sm)',
                  border: 'none',
                  background: activeTab === 'traits' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'traits' ? '#FFF' : 'var(--ink-2)',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Rasgos Físicos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tryon')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--r-sm)',
                  border: 'none',
                  background: activeTab === 'tryon' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'tryon' ? '#FFF' : 'var(--ink-2)',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Probador de Outfits
              </button>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.5 }}>
            Calibra tus rasgos anatómicos reales para que tu avatar 3D refleje tu figura con precisión y prueba combinaciones de ropa antes de vestirte.
          </p>
        </div>
      )}

      {/* ── Distribución en 2 Columnas: Escenario 3D a la izquierda, Controles a la derecha ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          alignItems: 'start'
        }}
      >
        {/* COLUMNA 1: ESCENARIO 3D INTERACTIVO */}
        <div
          style={{
            background: 'linear-gradient(180deg, var(--surface-3) 0%, var(--surface-1) 100%)',
            borderRadius: 'var(--r-lg)',
            padding: '20px 16px',
            border: '1px solid rgba(255, 90, 38, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: 'var(--accent)',
              letterSpacing: 1.1,
              textTransform: 'uppercase',
              marginBottom: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <IconSparkles size={13} />
            {activeTab === 'traits' ? 'Previsualización Anatómica' : 'Probador de Alta Costura'}
          </div>

          <p style={{ fontSize: 11, color: 'var(--ink-2)', marginBottom: 12, textAlign: 'center' }}>
            Arrastra para rotar libremente en 3D o cambia el ángulo de cámara y luz de estudio.
          </p>

          {/* Maniquí 3D interactivo en tiempo real con Inteligencia de Pasarela */}
          <AvatarMannequin
            top={activeTop}
            layer={activeLayer}
            bottom={activeBottom}
            shoe={activeShoe}
            skin={skin}
            build={build}
            preference={wardrobePreference}
            hairStyle={hairStyle}
            hairColor={hairColor}
            beard={beard}
            size={340}
            allowControls={true}
            showIntelligenceHUD={true}
            closetGarments={userGarments}
            onApplyOptimization={(opt) => {
              setUseCustomGarments(true);
              setCustomTopId(opt.top.id);
              setCustomBottomId(opt.bottom.id);
              setCustomShoeId(opt.shoe.id);
              setCustomLayerId(opt.layer ? opt.layer.id : '');
            }}
          />

          {/* Ficha rápida de diagnóstico anatómico */}
          <div
            style={{
              width: '100%',
              marginTop: 14,
              padding: '10px 14px',
              background: 'rgba(0,0,0,0.25)',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--line)',
              fontSize: 11,
              lineHeight: 1.5
            }}
          >
            <div style={{ fontWeight: 800, color: 'var(--ink)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Piel {SKINS[skin]?.name || skin} · {BUILDS[build]?.name || build}</span>
              <span style={{ color: 'var(--accent)' }}>{(parseInt(height) / 100).toFixed(2)} m</span>
            </div>
            <div style={{ color: 'var(--ink-2)', marginTop: 2 }}>
              {skin === 'morena'
                ? '★ Máxima afinidad con terracota, camel, tabaco y tonos tierra cálidos.'
                : `Armonía calibrada para fototipo ${skin} con silueta ${build}.`}
            </div>
          </div>
        </div>

        {/* COLUMNA 2: CONTROLES SEGÚN PESTAÑA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* ──────────────── MODO 1: RASGOS FÍSICOS ──────────────── */}
          {activeTab === 'traits' ? (
            <>
              {/* 1. Tono de Piel y Fototipo */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  1. Tono de Piel y Fototipo Cutáneo
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
                  {Object.entries(SKINS).map(([id, s]) => {
                    const isSelected = skin === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSkin(id as SkinTone)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '8px 12px',
                          borderRadius: 'var(--r-md)',
                          background: isSelected ? 'rgba(255, 90, 38, 0.12)' : 'var(--surface-3)',
                          border: isSelected ? '2px solid var(--accent)' : '1px solid var(--line)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background:
                              id === 'clara'
                                ? '#F4DCBA'
                                : id === 'media'
                                ? '#CE9A69'
                                : id === 'morena'
                                ? '#8E5B37'
                                : id === 'oscura'
                                ? '#59361C'
                                : '#382213',
                            border: '1px solid rgba(255,255,255,0.25)',
                            boxShadow: isSelected ? '0 0 8px rgba(255, 90, 38, 0.4)' : 'none',
                            flexShrink: 0
                          }}
                        />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? 'var(--accent)' : 'var(--ink)' }}>
                            {s.name}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>
                            {SKIN_UNDERTONES[id as SkinTone] || 'Tono equilibrado'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Complexión y Biomecánica */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  2. Complexión y Estructura Corporal
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {Object.entries(BUILDS).map(([id, b]) => {
                    const isSelected = build === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setBuild(id as BodyBuild)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--r-md)',
                          background: isSelected ? 'rgba(255, 90, 38, 0.12)' : 'var(--surface-3)',
                          border: isSelected ? '2px solid var(--accent)' : '1px solid var(--line)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 800, color: isSelected ? 'var(--accent)' : 'var(--ink)' }}>
                          {b.name}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--ink-2)', marginTop: 2 }}>
                          {b.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Estatura y Silueta de Vestimenta */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* Estatura */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                    3. Estatura (cm)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="range"
                      min="145"
                      max="215"
                      value={height}
                      onChange={e => setHeight(e.target.value)}
                      style={{ flex: 1, accentColor: 'var(--accent)' }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', minWidth: 54, textAlign: 'right' }}>
                      {height} cm
                    </span>
                  </div>
                </div>

                {/* Silueta / Preferencia */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                    4. Silueta
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {(['masculino', 'femenino', 'sin-filtro'] as WardrobePreference[]).map(pref => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setWardrobePreference(pref)}
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          borderRadius: 'var(--r-sm)',
                          fontSize: 11,
                          fontWeight: wardrobePreference === pref ? 700 : 500,
                          background: wardrobePreference === pref ? 'var(--accent)' : 'var(--surface-3)',
                          color: wardrobePreference === pref ? '#FFF' : 'var(--ink-2)',
                          border: 'none',
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {pref === 'sin-filtro' ? 'Unisex' : pref}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Estilo y Color de Cabello */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  5. Cabello (Corte y Tono)
                </div>

                {/* Cortes */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {(['corto', 'rizado', 'ondulado', 'largo', 'rapado'] as AvatarHairStyle[]).map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setHairStyle(style)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--r-sm)',
                        fontSize: 12,
                        fontWeight: hairStyle === style ? 700 : 500,
                        background: hairStyle === style ? 'var(--accent)' : 'var(--surface-3)',
                        color: hairStyle === style ? '#FFF' : 'var(--ink-2)',
                        border: '1px solid var(--line)',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {style}
                    </button>
                  ))}
                </div>

                {/* Colores de cabello */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: 'var(--ink-2)' }}>Tono:</span>
                  {HAIR_COLORS.map(color => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setHairColor(color.hex)}
                      title={color.name}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: color.hex,
                        border: hairColor === color.hex ? '3px solid var(--accent)' : '2px solid rgba(255,255,255,0.2)',
                        boxShadow: hairColor === color.hex ? '0 0 8px rgba(255, 90, 38, 0.5)' : 'none',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* 5. Vello Facial / Barba */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  6. Vello Facial / Barba
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {([
                    { id: 'ninguna', label: 'Afeitado / Sin barba' },
                    { id: 'corta', label: 'Barba Corta' },
                    { id: 'completa', label: 'Barba Completa' }
                  ] as const).map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBeard(b.id)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: 'var(--r-md)',
                        fontSize: 11,
                        fontWeight: beard === b.id ? 700 : 500,
                        background: beard === b.id ? 'var(--accent)' : 'var(--surface-3)',
                        color: beard === b.id ? '#FFF' : 'var(--ink-2)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* ──────────────── MODO 2: PROBADOR VIRTUAL DE OUTFITS ──────────────── */
            <>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Selección de Outfit para Probar
                  </div>
                  {userGarments.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setUseCustomGarments(v => !v)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--r-full)',
                        fontSize: 11,
                        fontWeight: 700,
                        background: useCustomGarments ? 'var(--accent)' : 'var(--surface-3)',
                        color: useCustomGarments ? '#FFF' : 'var(--ink-2)',
                        border: '1px solid var(--line)',
                        cursor: 'pointer'
                      }}
                    >
                      {useCustomGarments ? 'Usando mi Clóset' : 'Probar con mi Clóset'}
                    </button>
                  )}
                </div>

                {!useCustomGarments ? (
                  /* Conjuntos Predefinidos de Alta Costura */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontSize: 11, color: 'var(--ink-2)', marginBottom: 2 }}>
                      Guía visual para hombre alto, atlético y piel morena (11 estilos recomendados):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '380px', overflowY: 'auto', paddingRight: 4 }}>
                      {PRESET_OUTFITS.map((p, idx) => {
                        const isSelected = presetIndex === idx;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setPresetIndex(idx)}
                            style={{
                              padding: '10px 12px',
                              borderRadius: 'var(--r-md)',
                              background: isSelected ? 'rgba(255, 90, 38, 0.12)' : 'var(--surface-3)',
                              border: isSelected ? '2px solid var(--accent)' : '1px solid var(--line)',
                              cursor: 'pointer',
                              textAlign: 'left',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 800, color: isSelected ? 'var(--accent)' : 'var(--ink)' }}>
                                {p.name}
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--ink-2)', marginTop: 2, lineHeight: 1.4 }}>
                                {p.desc}
                              </div>
                            </div>
                            {isSelected && <IconCheck size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Probador con prendas reales del clóset del usuario */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Selector de Top */}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <IconTop size={14} /> Prenda Superior:
                      </label>
                      <select
                        value={customTopId}
                        onChange={e => setCustomTopId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--r-sm)',
                          background: 'var(--surface-3)',
                          border: '1px solid var(--line)',
                          color: 'var(--ink)',
                          fontSize: 12
                        }}
                      >
                        {userTops.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.colorName})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Selector de Layer */}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <IconLayer size={14} /> Capa / Abrigo (Opcional):
                      </label>
                      <select
                        value={customLayerId}
                        onChange={e => setCustomLayerId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--r-sm)',
                          background: 'var(--surface-3)',
                          border: '1px solid var(--line)',
                          color: 'var(--ink)',
                          fontSize: 12
                        }}
                      >
                        <option value="">Sin capa (Solo prenda base)</option>
                        {userLayers.map(l => (
                          <option key={l.id} value={l.id}>
                            {l.name} ({l.colorName})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Selector de Bottom */}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <IconBottom size={14} /> Prenda Inferior:
                      </label>
                      <select
                        value={customBottomId}
                        onChange={e => setCustomBottomId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--r-sm)',
                          background: 'var(--surface-3)',
                          border: '1px solid var(--line)',
                          color: 'var(--ink)',
                          fontSize: 12
                        }}
                      >
                        {userBottoms.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.colorName})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Selector de Calzado */}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <IconShoes size={14} /> Calzado:
                      </label>
                      <select
                        value={customShoeId}
                        onChange={e => setCustomShoeId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--r-sm)',
                          background: 'var(--surface-3)',
                          border: '1px solid var(--line)',
                          color: 'var(--ink)',
                          fontSize: 12
                        }}
                      >
                        {userShoes.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.colorName})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Tarjeta de Colorimetría del Outfit Puesto */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--r-md)',
                  background: 'rgba(255, 90, 38, 0.08)',
                  border: '1px solid rgba(255, 90, 38, 0.25)',
                  fontSize: 12
                }}
              >
                <div style={{ fontWeight: 800, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <IconStar size={14} /> Armonía con tu Piel {SKINS[skin]?.name || skin}
                </div>
                <div style={{ color: 'var(--ink)', lineHeight: 1.5 }}>
                  {activeTop?.colorName.toLowerCase().includes('terracota') ||
                  activeTop?.colorName.toLowerCase().includes('camel') ||
                  activeTop?.colorName.toLowerCase().includes('tierra')
                    ? '¡Combinación de alto impacto! La prenda superior ilumina tu rostro y realza el brillo dorado natural de tu tez.'
                    : `Prenda superior en ${activeTop?.colorName || 'tono base'} colocada en proximidad facial directa con tu avatar.`}
                </div>
              </div>
            </>
          )}

          {/* ── BOTONES DE ACCIÓN: GUARDAR PERFIL & RESTABLECER ── */}
          <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="btn btn-primary"
              style={{
                flex: 1,
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 800
              }}
            >
              <IconCheck size={16} /> Guardar rasgos en mi perfil
            </button>

            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={handleResetToSaved}
                className="btn btn-secondary"
                title="Descartar cambios no guardados"
                style={{
                  minHeight: 44,
                  padding: '0 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontSize: 12
                }}
              >
                <IconRefresh size={14} /> Revertir
              </button>
            )}
          </div>

          {/* Mensaje de Confirmación de Guardado */}
          {saveSuccess && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--r-sm)',
                background: 'rgba(52, 199, 89, 0.15)',
                border: '1px solid var(--success)',
                color: 'var(--success)',
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <IconCheck size={14} /> ¡Rasgos anatómicos guardados correctamente en tu perfil!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AvatarCustomizer;
