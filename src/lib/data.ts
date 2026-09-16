/* ============================================================
   DATOS · Colores, tipos, ocasiones, cápsula
   ============================================================ */

import type {
  ColorMeta, GarmentType, Occasion, CapsuleItem, BodyBuild, SkinTone, Climate
} from '../types';

export const COLORS: Record<string, ColorMeta> = {
  'Azul Marino': { cat: 'base', hex: '#1B2A4A' },
  'Azul Petróleo': { cat: 'base', hex: '#2C4A5E' },
  'Azul Claro': { cat: 'base', hex: '#A8C4E0' },
  'Negro': { cat: 'base', hex: '#1A1A1A' },
  'Blanco Roto': { cat: 'base', hex: '#FAF7F2' },
  'Crema': { cat: 'base', hex: '#F5E6D3' },
  'Beige Piedra': { cat: 'base', hex: '#D9C7A8' },
  'Camel': { cat: 'base', hex: '#C19A6B' },
  'Gris Carbón': { cat: 'base', hex: '#36454F' },
  'Gris Claro': { cat: 'base', hex: '#8B8B8B' },
  'Chocolate': { cat: 'base', hex: '#4A3220' },
  'Tabaco': { cat: 'secondary', hex: '#8B5A2B' },
  'Caqui': { cat: 'secondary', hex: '#8B7D6B' },
  'Verde Oliva': { cat: 'secondary', hex: '#6B7B3A' },
  'Verde Esmeralda': { cat: 'secondary', hex: '#1F6B5A' },
  'Terracota': { cat: 'accent', hex: '#C0603A' },
  'Borgoña': { cat: 'accent', hex: '#6B2C3A' },
  'Vino Tinto': { cat: 'accent', hex: '#722F37' }
};

export const TYPES: GarmentType[] = [
  { id: 'camiseta', name: 'Camiseta', icon: '👕', cat: 'top', subtypes: [] },
  { id: 'polo', name: 'Polo', icon: '👔', cat: 'top', subtypes: [] },
  { id: 'camisa', name: 'Camisa', icon: '👔', cat: 'top', subtypes: ['Formal', 'Casual', 'Lino'] },
  { id: 'pantalon', name: 'Pantalón', icon: '👖', cat: 'bottom', subtypes: ['Chino', 'De vestir', 'Jean'] },
  { id: 'blazer', name: 'Blazer', icon: '🧥', cat: 'layer', subtypes: [] },
  { id: 'sobrecamisa', name: 'Sobrecamisa', icon: '🧥', cat: 'layer', subtypes: [] },
  { id: 'tenis', name: 'Tenis', icon: '👟', cat: 'shoes', subtypes: [] },
  { id: 'mocasines', name: 'Mocasines', icon: '👞', cat: 'shoes', subtypes: [] },
  { id: 'derby', name: 'Derby', icon: '👞', cat: 'shoes', subtypes: [] },
  { id: 'botines', name: 'Botines', icon: '🥾', cat: 'shoes', subtypes: [] }
];

export const OCCASIONS: Occasion[] = [
  {
    id: 'oficina', name: 'Oficina', emoji: '💼',
    prefersTops: ['camisa'], avoidsTops: ['camiseta'],
    prefersShoes: ['derby', 'mocasines'], avoidsShoes: ['tenis'], layerLevel: 1
  },
  {
    id: 'casual', name: 'Casual', emoji: '☕',
    prefersTops: ['polo', 'camiseta'], avoidsTops: [],
    prefersShoes: ['tenis', 'mocasines'], avoidsShoes: [], layerLevel: 0
  },
  {
    id: 'templo', name: 'Templo', emoji: '⛪',
    prefersTops: ['camisa'], avoidsTops: ['camiseta'],
    prefersShoes: ['derby', 'mocasines'], avoidsShoes: ['tenis'], layerLevel: 1
  },
  {
    id: 'noche', name: 'Noche', emoji: '🌙',
    prefersTops: ['camisa', 'polo'], avoidsTops: [],
    prefersShoes: ['derby', 'botines'], avoidsShoes: ['tenis'], layerLevel: 1
  },
  {
    id: 'elegante', name: 'Elegante', emoji: '🎩',
    prefersTops: ['camisa'], avoidsTops: ['camiseta'],
    prefersShoes: ['derby'], avoidsShoes: ['tenis'], layerLevel: 2
  }
];

export const SKIN_PALETTES: Record<SkinTone, string[]> = {
  'clara': ['Azul Marino', 'Blanco Roto', 'Crema', 'Camel', 'Terracota', 'Gris Carbón'],
  'media': ['Azul Marino', 'Blanco Roto', 'Camel', 'Verde Oliva', 'Terracota', 'Gris Carbón'],
  'morena': ['Azul Marino', 'Crema', 'Camel', 'Verde Oliva', 'Terracota', 'Chocolate'],
  'oscura': ['Azul Petróleo', 'Blanco Roto', 'Camel', 'Verde Esmeralda', 'Borgoña', 'Chocolate'],
  'muy-oscura': ['Azul Petróleo', 'Blanco Roto', 'Beige Piedra', 'Verde Esmeralda', 'Vino Tinto', 'Chocolate']
};

export const CAPSULE_IDEAL: CapsuleItem[] = [
  { id: 'c1', stage: 1, type: 'camiseta', name: 'Camiseta blanca', color: 'Blanco Roto', icon: '👕', price: 20 },
  { id: 'c2', stage: 1, type: 'camiseta', name: 'Camiseta crema', color: 'Crema', icon: '👕', price: 20 },
  { id: 'c3', stage: 1, type: 'polo', name: 'Polo azul marino', color: 'Azul Marino', icon: '👔', price: 35 },
  { id: 'c4', stage: 1, type: 'polo', name: 'Polo verde oliva', color: 'Verde Oliva', icon: '👔', price: 35 },
  { id: 'c5', stage: 1, type: 'pantalon', name: 'Chino camel', color: 'Camel', icon: '👖', price: 45 },
  { id: 'c6', stage: 1, type: 'pantalon', name: 'Chino beige', color: 'Beige Piedra', icon: '👖', price: 45 },
  { id: 'c7', stage: 1, type: 'pantalon', name: 'Jean índigo', color: 'Azul Marino', icon: '👖', price: 50 },
  { id: 'c8', stage: 1, type: 'tenis', name: 'Tenis crema', color: 'Crema', icon: '👟', price: 70 },
  { id: 'c9', stage: 2, type: 'camisa', name: 'Camisa blanca', color: 'Blanco Roto', icon: '👔', price: 60 },
  { id: 'c10', stage: 2, type: 'camisa', name: 'Camisa azul claro', color: 'Azul Claro', icon: '👔', price: 60 },
  { id: 'c11', stage: 2, type: 'pantalon', name: 'Pantalón gris', color: 'Gris Claro', icon: '👖', price: 55 },
  { id: 'c12', stage: 2, type: 'blazer', name: 'Blazer marino', color: 'Azul Marino', icon: '🧥', price: 120 },
  { id: 'c13', stage: 2, type: 'mocasines', name: 'Mocasines coñac', color: 'Tabaco', icon: '👞', price: 90 },
  { id: 'c14', stage: 2, type: 'derby', name: 'Derby café', color: 'Chocolate', icon: '👞', price: 100 },
  { id: 'c15', stage: 3, type: 'polo', name: 'Polo terracota', color: 'Terracota', icon: '👔', price: 35 },
  { id: 'c16', stage: 3, type: 'sobrecamisa', name: 'Sobrecamisa oliva', color: 'Verde Oliva', icon: '🧥', price: 65 },
  { id: 'c17', stage: 3, type: 'sobrecamisa', name: 'Sobrecamisa chocolate', color: 'Chocolate', icon: '🧥', price: 65 },
  { id: 'c18', stage: 3, type: 'pantalon', name: 'Pantalón crema', color: 'Crema', icon: '👖', price: 45 },
  { id: 'c19', stage: 3, type: 'camisa', name: 'Camisa lino crema', color: 'Crema', icon: '👔', price: 80 },
  { id: 'c20', stage: 3, type: 'botines', name: 'Botines topo', color: 'Caqui', icon: '🥾', price: 110 }
];

export const STAGE_INFO = {
  1: { name: 'Base diaria', desc: 'Resuelve el 60% de tu semana' },
  2: { name: 'Trabajo y salidas', desc: 'Eleva tu look para oficina y eventos' },
  3: { name: 'Personalidad', desc: 'Acentos y capas con carácter' }
} as const;

export const BUILDS: Record<BodyBuild, { name: string; icon: string; desc: string }> = {
  delgado: { name: 'Delgado', icon: '🧍', desc: 'Silueta esbelta' },
  atletico: { name: 'Atlético', icon: '💪', desc: 'Hombros definidos' },
  robusto: { name: 'Robusto', icon: '🏋️', desc: 'Torso ancho' },
  grande: { name: 'Grande', icon: '🐻', desc: 'Constitución amplia' }
};

export const SKINS: Record<SkinTone, { name: string; hex: string }> = {
  'clara': { name: 'Clara', hex: '#F0D5B8' },
  'media': { name: 'Media', hex: '#C89666' },
  'morena': { name: 'Morena', hex: '#8B5E3C' },
  'oscura': { name: 'Oscura', hex: '#5C3A21' },
  'muy-oscura': { name: 'Muy oscura', hex: '#3A2415' }
};

export const CLIMATES: Record<Climate, string> = {
  frio: 'Frío',
  templado: 'Templado',
  calido: 'Cálido'
};

/* ===== Helpers de altura ===== */

export const HEIGHT_METRIC = ['170', '180', '195', '200', '205'];

export const HEIGHT_IMPERIAL: Array<{ label: string; cm: string }> = [
  { label: `5'8"`, cm: '173' },
  { label: `5'11"`, cm: '180' },
  { label: `6'0"`, cm: '183' },
  { label: `6'2"`, cm: '188' },
  { label: `6'4"`, cm: '193' },
  { label: `6'5"`, cm: '196' },
  { label: `6'6"`, cm: '198' },
  { label: `6'8"`, cm: '203' }
];

export function cmToImperial(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

export function cmToMeters(cm: number): string {
  return (cm / 100).toFixed(2) + ' m';
}

export function formatHeight(cm: string, unit: 'metric' | 'imperial'): string {
  const n = parseInt(cm);
  return unit === 'metric' ? cmToMeters(n) : cmToImperial(n);
}