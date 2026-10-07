/* ============================================================
   PALETAS · Las 11 del Anexo C + 3 estrella del Anexo E
   Sistema dinámico: tono de piel × personalidad de estilo
   ============================================================ */

import type { StylePersonality, SkinTone } from '../types';

export interface Palette {
  id: string;
  num: number;
  name: string;
  style: string;
  colors: string[];
  combination: string;
  bestFor: string[];
}

export interface StarPalette {
  id: string;
  name: string;
  colors: string[];
  description: string;
  bestFor: string;
}

export interface PaletteAssignment {
  main: Palette;
  alternatives: Palette[];
  star?: StarPalette;
}

export const PALETTES: Palette[] = [
  {
    id: 'elegante-clasico',
    num: 1,
    name: 'Elegante Clásico',
    style: 'Formal · Business casual',
    colors: ['#1B2A4A', '#FAF7F2', '#C19A6B', '#8B5A2B'],
    combination: 'Camisa blanca + pantalón camel + blazer azul marino + zapatos coñac',
    bestFor: ['base']
  },
  {
    id: 'fresco-moderno',
    num: 2,
    name: 'Fresco Moderno',
    style: 'Casual refinado',
    colors: ['#6B7B3A', '#D9C7A8', '#FAF7F2', '#4A3220'],
    combination: 'Polo oliva + chino beige + sobrecamisa marrón + mocasines',
    bestFor: ['secundario']
  },
  {
    id: 'noche-sofisticada',
    num: 3,
    name: 'Noche Sofisticada',
    style: 'Elegante nocturno',
    colors: ['#36454F', '#1A1A1A', '#6B2C3A', '#C0C0C0'],
    combination: 'Camisa borgoña + pantalón gris carbón + chaqueta negra + plata',
    bestFor: ['acento']
  },
  {
    id: 'casual-premium',
    num: 4,
    name: 'Casual Premium',
    style: 'Minimalista premium',
    colors: ['#2C4A5E', '#36454F', '#FAF7F2', '#8B5A2B'],
    combination: 'Camiseta blanca + pantalón gris + chaqueta azul petróleo',
    bestFor: ['base']
  },
  {
    id: 'tierra-refinada',
    num: 5,
    name: 'Tierra Refinada',
    style: 'Earthy chic',
    colors: ['#C0603A', '#D9C7A8', '#4A3220', '#F5E6D3'],
    combination: 'Polo terracota + chino arena + zapatos chocolate',
    bestFor: ['acento']
  },
  {
    id: 'oficina-moderna',
    num: 6,
    name: 'Oficina Moderna',
    style: 'Business moderno',
    colors: ['#A8C4E0', '#8B8B8B', '#1B2A4A', '#8B5A2B'],
    combination: 'Camisa azul claro + pantalón gris + blazer azul marino',
    bestFor: ['base']
  },
  {
    id: 'smart-casual',
    num: 7,
    name: 'Smart Casual',
    style: 'Smart casual',
    colors: ['#1F6B5A', '#F5E6D3', '#C19A6B', '#4A3220'],
    combination: 'Polo esmeralda + pantalón caqui + chaqueta crema',
    bestFor: ['secundario']
  },
  {
    id: 'verano-estilo',
    num: 8,
    name: 'Verano con Estilo',
    style: 'Resort · relaxed chic',
    colors: ['#6B7B3A', '#FAF7F2', '#D9C7A8', '#8B5A2B'],
    combination: 'Camisa lino blanco + pantalón arena + sobrecamisa salvia',
    bestFor: ['base']
  },
  {
    id: 'tierra-elegante',
    num: 9,
    name: 'Tierra Elegante',
    style: 'Sastrería cálida',
    colors: ['#8B5A2B', '#D9C7A8', '#F5E6D3', '#4A3220'],
    combination: 'Camisa marfil + pantalón beige piedra + blazer tabaco',
    bestFor: ['base']
  },
  {
    id: 'caidos-equilibrados',
    num: 10,
    name: 'Caídos Equilibrados',
    style: 'Casual otoñal',
    colors: ['#6B7B3A', '#8B7D6B', '#C19A6B', '#F5E6D3'],
    combination: 'Sobrecamisa oliva + camiseta crema + chino camel',
    bestFor: ['secundario']
  },
  {
    id: 'salida-nocturna',
    num: 11,
    name: 'Salida Nocturna Tierra',
    style: 'Nocturno tonos tierra',
    colors: ['#4A3220', '#C0603A', '#36454F', '#F5E6D3'],
    combination: 'Sobrecamisa chocolate + camiseta crema + pantalón gris',
    bestFor: ['acento']
  },
  {
    id: 'urbano-oscuro',
    num: 12,
    name: 'Urbano Oscuro',
    style: 'Streetwear premium',
    colors: ['#1A1A1A', '#2C2C2C', '#FF6B35', '#E8E8E8'],
    combination: 'Camiseta negra + jogger gris + detalle naranja + sneakers blancos',
    bestFor: ['acento']
  },
  {
    id: 'artista-libre',
    num: 13,
    name: 'Artista Libre',
    style: 'Expresivo y creativo',
    colors: ['#8B4513', '#DAA520', '#800080', '#F5F5F5'],
    combination: 'Camisa terrosa + pantalón dorado + detalle violeta',
    bestFor: ['acento']
  },
  {
    id: 'monocromo-zen',
    num: 14,
    name: 'Monocromo Zen',
    style: 'Minimalismo absoluto',
    colors: ['#FAFAFA', '#E0E0E0', '#9E9E9E', '#212121'],
    combination: 'Todo en escala de grises — textura es el protagonista',
    bestFor: ['base']
  },
  {
    id: 'contraste-vibrante',
    num: 15,
    name: 'Contraste Vibrante',
    style: 'Alto contraste dinámico',
    colors: ['#FFFFFF', '#00A550', '#FFD700', '#1A1A1A'],
    combination: 'Blanco + verde vibrante + toque dorado + negro',
    bestFor: ['acento']
  }
];

export const STAR_PALETTES: StarPalette[] = [
  {
    id: 'zafiro',
    name: 'Azul Zafiro & Marino',
    colors: ['#0A1F44', '#1B2A4A', '#FAF7F2', '#C19A6B'],
    description: 'Alto contraste. Elegante y formal.',
    bestFor: 'Oficina, eventos'
  },
  {
    id: 'esmeralda',
    name: 'Verde Esmeralda & Oliva',
    colors: ['#1F6B5A', '#6B7B3A', '#4A3220', '#F5E6D3'],
    description: 'Verdes profundos que iluminan la piel.',
    bestFor: 'Cenas, casual elegante'
  },
  {
    id: 'vino',
    name: 'Vino Tinto & Borgoña',
    colors: ['#722F37', '#6B2C3A', '#8B7D6B', '#36454F'],
    description: 'Rojos profundos con carácter.',
    bestFor: 'Noche, citas'
  },
  {
    id: 'oro-negro',
    name: 'Oro & Negro',
    colors: ['#1A1A1A', '#DAA520', '#FAF7F2', '#C19A6B'],
    description: 'Máximo contraste y sofisticación urbana.',
    bestFor: 'Salidas nocturnas, eventos'
  }
];

/* ─────────────────────────────────────────────────────────
   TABLA MAESTRA: skin × personality → palette IDs
   ───────────────────────────────────────────────────────── */
type PaletteMap = Record<SkinTone, Record<StylePersonality, { main: string; alt: string[]; star?: string }>>;

const PALETTE_MAP: PaletteMap = {
  'clara': {
    clasico: { main: 'elegante-clasico', alt: ['oficina-moderna', 'casual-premium'], star: 'zafiro' },
    casual: { main: 'fresco-moderno', alt: ['verano-estilo', 'caidos-equilibrados'] },
    urbano: { main: 'casual-premium', alt: ['urbano-oscuro', 'noche-sofisticada'], star: 'oro-negro' },
    artistico: { main: 'artista-libre', alt: ['noche-sofisticada', 'fresco-moderno'], star: 'vino' },
    minimalista: { main: 'monocromo-zen', alt: ['casual-premium', 'fresco-moderno'] },
    elegante: { main: 'elegante-clasico', alt: ['noche-sofisticada', 'oficina-moderna'], star: 'zafiro' }
  },
  'media': {
    clasico: { main: 'tierra-elegante', alt: ['elegante-clasico', 'oficina-moderna'], star: 'esmeralda' },
    casual: { main: 'tierra-refinada', alt: ['caidos-equilibrados', 'fresco-moderno'] },
    urbano: { main: 'urbano-oscuro', alt: ['casual-premium', 'noche-sofisticada'], star: 'oro-negro' },
    artistico: { main: 'artista-libre', alt: ['tierra-refinada', 'salida-nocturna'], star: 'esmeralda' },
    minimalista: { main: 'monocromo-zen', alt: ['tierra-elegante', 'casual-premium'] },
    elegante: { main: 'tierra-elegante', alt: ['noche-sofisticada', 'elegante-clasico'], star: 'vino' }
  },
  'morena': {
    clasico: { main: 'elegante-clasico', alt: ['tierra-elegante', 'oficina-moderna'], star: 'zafiro' },
    casual: { main: 'fresco-moderno', alt: ['smart-casual', 'verano-estilo'] },
    urbano: { main: 'urbano-oscuro', alt: ['noche-sofisticada', 'casual-premium'], star: 'oro-negro' },
    artistico: { main: 'artista-libre', alt: ['salida-nocturna', 'tierra-refinada'], star: 'esmeralda' },
    minimalista: { main: 'monocromo-zen', alt: ['casual-premium', 'smart-casual'] },
    elegante: { main: 'noche-sofisticada', alt: ['elegante-clasico', 'tierra-elegante'], star: 'vino' }
  },
  'oscura': {
    clasico: { main: 'oficina-moderna', alt: ['elegante-clasico', 'casual-premium'], star: 'zafiro' },
    casual: { main: 'fresco-moderno', alt: ['smart-casual', 'tierra-refinada'], star: 'esmeralda' },
    urbano: { main: 'contraste-vibrante', alt: ['urbano-oscuro', 'casual-premium'], star: 'oro-negro' },
    artistico: { main: 'artista-libre', alt: ['contraste-vibrante', 'noche-sofisticada'], star: 'esmeralda' },
    minimalista: { main: 'monocromo-zen', alt: ['oficina-moderna', 'casual-premium'] },
    elegante: { main: 'noche-sofisticada', alt: ['oficina-moderna', 'elegante-clasico'], star: 'oro-negro' }
  },
  'muy-oscura': {
    clasico: { main: 'oficina-moderna', alt: ['tierra-refinada', 'casual-premium'], star: 'zafiro' },
    casual: { main: 'contraste-vibrante', alt: ['fresco-moderno', 'verano-estilo'], star: 'esmeralda' },
    urbano: { main: 'contraste-vibrante', alt: ['urbano-oscuro', 'noche-sofisticada'], star: 'oro-negro' },
    artistico: { main: 'artista-libre', alt: ['contraste-vibrante', 'salida-nocturna'], star: 'esmeralda' },
    minimalista: { main: 'monocromo-zen', alt: ['contraste-vibrante', 'oficina-moderna'] },
    elegante: { main: 'noche-sofisticada', alt: ['contraste-vibrante', 'oficina-moderna'], star: 'oro-negro' }
  }
};

/* ─────────────────────────────────────────────────────────
   assignPalette — AHORA DINÁMICO: skin × personality
   ───────────────────────────────────────────────────────── */
export function assignPalette(
  skinTone: SkinTone | string,
  _undertone: string,
  _build: string,
  personality?: StylePersonality | string
): PaletteAssignment {

  const skin = (skinTone as SkinTone) in PALETTE_MAP ? (skinTone as SkinTone) : 'morena';
  const pers = (personality as StylePersonality) in PALETTE_MAP[skin]
    ? (personality as StylePersonality)
    : 'casual';

  const entry = PALETTE_MAP[skin][pers];

  const main = PALETTES.find(p => p.id === entry.main)!;
  const alts = entry.alt.map(id => PALETTES.find(p => p.id === id)!).filter(Boolean);
  const star = entry.star ? STAR_PALETTES.find(s => s.id === entry.star) : undefined;

  return { main, alternatives: alts, ...(star ? { star } : {}) };
}