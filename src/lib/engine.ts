/* ============================================================
   ENGINE · Generador de outfits + análisis biomecánico
   ============================================================ */

import type {
  Garment, Outfit, OccasionId, UserProfile,
  BiomechRules, PurchaseAnalysis, VerdictType, CapsuleItem, UsedOutfit
} from '../types';
import { OCCASIONS, SKIN_PALETTES, COLORS, TYPES } from './data';
import { PERSONALITIES, SKIN_COLOR_DNA } from './personality';

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
      u.garmentIds.forEach(id => recentUsedIds.add(id));
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

  // Active garments (excluding items marked in laundry or to replace)
  const cleanActive = garments.filter(g => g.status !== 'want-replace' && !g.inLaundry);
  const hasCleanEssentials =
    cleanActive.some(g => g.cat === 'top') &&
    cleanActive.some(g => g.cat === 'bottom') &&
    cleanActive.some(g => g.cat === 'shoes');

  let active = hasCleanEssentials ? cleanActive : garments.filter(g => g.status !== 'want-replace');
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

    // Lifetime wear frequency tracking for rotation bonus
    const wearCounts = new Map<string, number>();
    usedOutfits.forEach(u => {
      (u.garmentIds || []).forEach(id => {
        wearCounts.set(id, (wearCounts.get(id) || 0) + 1);
      });
    });

    let score = wT(top) * 2 + wS(shoe) * 2;
    if (layer) score += 2;
    if (all.some(x => x.colorCat === 'accent')) score += 3;
    if (all.some(x => x.colorCat === 'secondary')) score += 1;
    if (all.filter(x => x.colorCat === 'base').length >= 2) score += 2;
    // 0. Colorimetría facial y armonía dérmica (prendas próximas al rostro)
    const isTopInPalette = rules.palette.includes(top.colorName);
    const isLayerInPalette = layer ? rules.palette.includes(layer.colorName) : false;
    const isBottomInPalette = rules.palette.includes(bottom.colorName);

    if (isTopInPalette) score += 3;
    if (isLayerInPalette) score += 2;
    if (isBottomInPalette) score += 2;

    let primaryNote = 'Equilibrio estético versátil';

    // Prioridad de colorimetría específica para piel morena (tonos tierra y terracota)
    const isMorena = profile.skin === 'morena';
    const earthWarmTones = ['Terracota', 'Camel', 'Tabaco', 'Chocolate', 'Verde Oliva'];
    const hasTerracotaTop = top.colorName === 'Terracota' || (layer && layer.colorName === 'Terracota');
    const hasEarthToneTop = earthWarmTones.includes(top.colorName) || (layer && earthWarmTones.includes(layer.colorName));

    if (isMorena && hasTerracotaTop) {
      score += 5;
      primaryNote = 'Terracota: ilumina y resalta tu piel morena';
    } else if (isMorena && hasEarthToneTop) {
      score += 4;
      primaryNote = 'Tonos tierra cálidos: armonía perfecta con piel morena';
    } else if (isTopInPalette) {
      primaryNote = 'Colorimetría facial armónica';
    }

    // 1. Regla de Oro 60/30/10 (Equilibrio de Base, Secundaria y Acento)
    const hasBase = all.some(x => x.colorCat === 'base');
    const hasSec = all.some(x => x.colorCat === 'secondary');
    const hasAcc = all.some(x => x.colorCat === 'accent');
    if (hasBase && hasSec && hasAcc) {
      score += 4;
      primaryNote = 'Equilibrio 60/30/10 (Base + Acento)';
    } else if (hasBase && all.every(x => x.colorCat === 'base')) {
      score += 3; // Armonía neutra atemporal
      primaryNote = 'Monocromático tonal elegante';
    }

    // 2. Regla del Sándwich de Color (Top & Calzado coordinados vs Inferior)
    const isSandwichMatch =
      top.colorName === shoe.colorName ||
      (layer && layer.colorName === shoe.colorName) ||
      (top.colorCat === shoe.colorCat && top.colorCat !== 'accent');
    const isBottomContrasting = bottom.colorName !== top.colorName;

    if (isSandwichMatch && isBottomContrasting) {
      score += 4;
      primaryNote = 'Sándwich cromático impecable';
    }

    // 3. Ponderación Bioclimática Inteligente
    if (profile.climate === 'calido') {
      if (['camiseta', 'polo', 'camisa-lino', 'top'].includes(top.type)) score += 2;
      if (['bermuda', 'falda', 'pantalon-lino'].includes(bottom.type)) score += 2;
      if (['sandalias', 'tenis', 'espadrilles'].includes(shoe.type)) score += 2;
      if (['botas', 'abrigo', 'chaqueta-cuero'].includes(shoe.type) || (layer && ['abrigo', 'trench'].includes(layer.type))) {
        score -= 4; // Penalización por sobrecalentamiento
      }
    } else if (profile.climate === 'frio') {
      if (layer) score += 3;
      if (['botas', 'chelsea'].includes(shoe.type)) score += 2;
      if (['jersey', 'sudadera', 'cuello-alto'].includes(top.type)) score += 2;
      if (['sandalias', 'bermuda'].includes(bottom.type) || ['sandalias'].includes(shoe.type)) {
        score -= 5; // Penalización por falta de abrigo
      }
    }

    // 4. Bono de Rotación del Armario (Desbloquear prendas olvidadas)
    const totalWears = all.reduce((acc, g) => acc + (wearCounts.get(g.id) || 0), 0);
    if (totalWears <= 2) {
      score += 2; // Fomentar variedad
    }

    // 5. Biomecánica de silueta y contraste
    const topIsDark = ['Negro', 'Azul Marino', 'Azul Noche', 'Gris Carbón', 'Gris Oscuro', 'Marrón Oscuro'].includes(top.colorName);
    const bottomIsDark = ['Negro', 'Azul Marino', 'Azul Noche', 'Gris Carbón', 'Gris Oscuro', 'Marrón Oscuro'].includes(bottom.colorName);
    const isContrasted = (topIsDark && !bottomIsDark) || (!topIsDark && bottomIsDark);

    if (rules.breakVerticality && isContrasted) {
      score += 2;
      if (primaryNote === 'Equilibrio estético versátil') primaryNote = 'Silueta con corte horizontal estilizado';
    } else if (!rules.breakVerticality && !isContrasted) {
      score += 2;
      if (primaryNote === 'Equilibrio estético versátil') primaryNote = 'Línea vertical unificada';
    }

    // Personality bonus
    if (profile.stylePersonality) {
      const prefTypes = PERSONALITIES[profile.stylePersonality]?.prefersTypes ?? [];
      if (prefTypes.includes(top.type)) score += 2;
      if (prefTypes.includes(shoe.type)) score += 1;
    }

    if (profile.wardrobePreference === 'femenino') {
      if (['blusa', 'top'].includes(top.type)) score += 2;
      if (bottom.type === 'falda') score += 2;
      if (['tacones', 'bailarinas'].includes(shoe.type)) score += 1;
    } else if (profile.wardrobePreference === 'masculino') {
      if (['camisa', 'polo'].includes(top.type)) score += 1;
      if (['derby', 'mocasines'].includes(shoe.type)) score += 1;
    }

    // 6. Colorimetría Facial & Tonos de Piel (Prendas superiores cerca del rostro)
    const skinDna = SKIN_COLOR_DNA[profile.skin] || SKIN_COLOR_DNA.morena;
    let colorimetryNote: string | undefined;

    if (profile.skin === 'morena') {
      const warmEarthTones = ['Terracota', 'Camel', 'Tabaco', 'Verde Oliva', 'Chocolate'];
      if (top.colorName === 'Terracota') {
        score += 5; // Terracota es el acento rey para piel morena
        colorimetryNote = 'Terracota: ilumina y resalta la calidez de tu piel morena';
      } else if (warmEarthTones.includes(top.colorName)) {
        score += 4;
        colorimetryNote = `${top.colorName}: tono tierra en sintonía armónica con tu piel morena`;
      } else if (['Crema', 'Blanco Roto', 'Azul Marino'].includes(top.colorName)) {
        score += 3;
        colorimetryNote = `${top.colorName}: contraste limpio y luminoso para tu piel morena`;
      } else if (['Gris Claro', 'Gris Carbón'].includes(top.colorName) && !layer) {
        score -= 2; // Tono frío apagado cerca del rostro
      }

      if (layer && warmEarthTones.includes(layer.colorName)) {
        score += 3;
      }
    } else {
      if (skinDna.powerColors.some(pc => pc.toLowerCase().includes(top.colorName.toLowerCase()))) {
        score += 4;
        colorimetryNote = `${top.colorName}: tono favorecedor para tu colorimetría (${skinDna.name})`;
      }
      if (layer && skinDna.powerColors.some(pc => pc.toLowerCase().includes(layer.colorName.toLowerCase()))) {
        score += 2;
      }
      if (skinDna.avoidColors.some(ac => ac.toLowerCase().includes(top.colorName.toLowerCase()))) {
        score -= 3;
      }
    }

    outfits.push({ top, bottom, shoe, layer, score, key, styleNote: primaryNote, colorimetryNote });
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
