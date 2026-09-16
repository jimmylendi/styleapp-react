/* ============================================================
   ENGINE · Generador de outfits + análisis biomecánico
   ============================================================ */

import type {
  Garment, Outfit, OccasionId, UserProfile,
  BiomechRules, PurchaseAnalysis, VerdictType, CapsuleItem, UsedOutfit
} from '../types';
import { OCCASIONS, SKIN_PALETTES, COLORS, TYPES } from './data';

/* ===== Reglas biomecánicas según perfil ===== */
export function getBiomechRules(profile: UserProfile): BiomechRules {
  return {
    preferredFits: profile.build === 'delgado' ? ['regular', 'slim'] : ['athletic', 'regular'],
    avoidFits: profile.build === 'delgado' ? [] : ['slim'],
    breakVerticality: parseInt(profile.height) >= 190,
    maxLayers: profile.climate === 'calido' ? 1 : 2,
    palette: SKIN_PALETTES[profile.skin] || SKIN_PALETTES.morena
  };
}

/* ===== Generar outfits ===== */
export function generateOutfits(
  garments: Garment[],
  occasionId: OccasionId,
  profile: UserProfile,
  count = 6,
  usedOutfits: UsedOutfit[] = []
): Outfit[] {
  const occ = OCCASIONS.find(o => o.id === occasionId);
  if (!occ) return [];

  // 1. Cooldown filter (24 hours)
  const COOLDOWN_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const recentUsedIds = new Set<string>();

  usedOutfits.forEach(u => {
    if (now - u.date < COOLDOWN_MS) {
      u.key.split('-').forEach(id => recentUsedIds.add(id));
    }
  });

  const rules = getBiomechRules(profile);

  // 2. Climate adjustments
  let currentLayerLevel = occ.layerLevel;
  if (profile.climate === 'calido') {
    currentLayerLevel -= 1;
  } else if (profile.climate === 'frio') {
    currentLayerLevel = Math.max(1, currentLayerLevel);
  }

  // Active garments
  let active = garments.filter(g => g.status !== 'want-replace');
  const availableWithCooldown = active.filter(g => !recentUsedIds.has(g.id));

  // Fallback: If applying cooldown leaves us without essential categories, ignore the cooldown
  const hasEssentials =
    availableWithCooldown.some(g => g.cat === 'top') &&
    availableWithCooldown.some(g => g.cat === 'bottom') &&
    availableWithCooldown.some(g => g.cat === 'shoes');

  if (hasEssentials) {
    active = availableWithCooldown;
  }

  const tops = active.filter(g => g.cat === 'top');
  const bottoms = active.filter(g => g.cat === 'bottom');
  const shoes = active.filter(g => g.cat === 'shoes');
  const layers = active.filter(g => g.cat === 'layer');

  if (!tops.length || !bottoms.length || !shoes.length) return [];

  const outfits: Outfit[] = [];
  const usedKeys = new Set<string>();
  const maxAttempts = 300;

  const wT = (x: Garment) =>
    occ.prefersTops.includes(x.type) ? 3 : occ.avoidsTops.includes(x.type) ? 0 : 1;
  const wB = () => 1;
  const wS = (x: Garment) =>
    occ.prefersShoes.includes(x.type) ? 3 : occ.avoidsShoes.includes(x.type) ? 0 : 1;

  const pick = <T,>(arr: T[], weightFn: (x: T) => number): T | null => {
    const weighted: T[] = [];
    arr.forEach(x => {
      const w = weightFn(x);
      for (let i = 0; i < w; i++) weighted.push(x);
    });
    if (!weighted.length) return null;
    return weighted[Math.floor(Math.random() * weighted.length)];
  };

  for (let i = 0; i < maxAttempts && outfits.length < count * 3; i++) {
    const top = pick(tops, wT);
    const bottom = pick(bottoms, wB);
    const shoe = pick(shoes, wS);
    if (!top || !bottom || !shoe) continue;

    let layer: Garment | null = null;
    if (currentLayerLevel > 0 && layers.length && currentLayerLevel <= rules.maxLayers) {
      if (Math.random() > 0.35) layer = layers[Math.floor(Math.random() * layers.length)];
    }

    const all = [top, bottom, shoe, layer].filter(Boolean) as Garment[];

    if (all.filter(x => x.colorCat === 'accent').length > 1) continue;

    const nonBase = all.filter(x => x.colorCat !== 'base').map(x => x.colorName);
    if (new Set(nonBase).size < nonBase.length) continue;

    const key = all.map(x => x.id).sort().join('-');
    if (usedKeys.has(key)) continue;
    usedKeys.add(key);

    let score = wT(top) * 2 + wS(shoe) * 2;
    if (layer) score += 2;
    if (all.some(x => x.colorCat === 'accent')) score += 3;
    if (all.some(x => x.colorCat === 'secondary')) score += 1;
    if (all.filter(x => x.colorCat === 'base').length >= 2) score += 2;
    if (rules.palette.includes(top.colorName)) score += 2;
    if (rules.palette.includes(bottom.colorName)) score += 2;

    outfits.push({ top, bottom, shoe, layer, score, key });
  }

  outfits.sort((a, b) => b.score - a.score);

  const unique: Outfit[] = [];
  const usedTop = new Set<string>();
  for (const o of outfits) {
    if (unique.length >= count) break;
    if (unique.length > 0 && unique.length < count && usedTop.has(o.top.id) && usedTop.size < tops.length) continue;
    unique.push(o);
    usedTop.add(o.top.id);
  }
  return unique;
}

/* ===== Análisis de compra ===== */
export function analyzePurchase(
  typeId: string,
  colorName: string,
  profile: UserProfile,
  garments: Garment[]
): PurchaseAnalysis | null {
  const t = TYPES.find(x => x.id === typeId);
  const meta = COLORS[colorName];
  if (!t || !meta) return null;

  const rules = getBiomechRules(profile);
  const inPalette = rules.palette.includes(colorName);
  const colorCat = meta.cat;
  const accents = garments.filter(g => g.colorCat === 'accent').length;
  const duplicate = garments.some(g => g.type === typeId && g.colorName === colorName);

  let verdict: VerdictType = 'green';
  let title = 'Adelante, compra';
  const reasons: string[] = [];

  if (duplicate) {
    verdict = 'yellow';
    title = 'Ya tienes una igual';
    reasons.push(`Ya tienes ${colorName.toLowerCase()} en ${t.name.toLowerCase()}.`);
  } else if (colorCat === 'accent' && accents >= 3) {
    verdict = 'red';
    title = 'Mejor no compres';
    reasons.push('Ya tienes 3+ prendas de acento.');
  } else if (colorCat === 'accent' && t.cat === 'bottom') {
    verdict = 'red';
    title = 'No compres';
    reasons.push('Un pantalón de color acento rompe el balance 60/30/10.');
  } else if (!inPalette && colorCat === 'accent') {
    verdict = 'yellow';
    title = 'Cuidado con este color';
    reasons.push('Este acento no está en tu paleta ideal.');
  } else if (inPalette) {
    reasons.push('✓ Este color favorece tu tono de piel.');
    if (colorCat === 'accent') {
      reasons.push(`Te quedan ${3 - accents} espacios de acento.`);
    }
  } else {
    verdict = 'yellow';
    title = 'Buena compra, pero no óptima';
    reasons.push('Este color no está en tu paleta ideal.');
  }

  return {
    verdict,
    title,
    reasons,
    colorName,
    typeName: t.name,
    typeIcon: t.icon
  };
}

/* ===== Cápsula: matching ===== */

export interface CapsuleMatch {
  ideal: CapsuleItem;
  exact: Garment | undefined;
  similar: Garment | undefined;
  status: 'have' | 'similar' | 'missing';
}

export function matchCapsule(garments: Garment[], capsule: CapsuleItem[]): CapsuleMatch[] {
  return capsule.map((ideal) => {
    const exact = garments.find(
      g => g.type === ideal.type && g.colorName === ideal.color
    );
    const similar = exact ? undefined : garments.find(
      g => g.type === ideal.type &&
        COLORS[g.colorName]?.cat === COLORS[ideal.color]?.cat
    );
    return {
      ideal,
      exact,
      similar,
      status: exact ? 'have' : similar ? 'similar' : 'missing'
    };
  });
}