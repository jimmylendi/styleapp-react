/* ============================================================
   SMART STYLIST · Motor de Inteligencia de Estilismo y Colorimetría
   Calcula Outfit IQ, optimizaciones automáticas con IA, detección
   de prendas puente y simulación de impacto de compra.
   ============================================================ */

import type { Garment, UserProfile, SkinTone } from '../types';
import { COLORS } from './data';
import { SKIN_COLOR_DNA } from './personality';

export type OutfitTier = 'Editorial' | 'Distinguido' | 'Correcto' | 'Mejorable';

export interface OutfitComponents {
  top: Garment;
  bottom: Garment;
  shoe: Garment;
  layer?: Garment | null;
}

export interface MetricBreakdown {
  score: number; // 0-100
  label: string;
  note: string;
  status: 'perfect' | 'good' | 'warning';
}

export interface OutfitIQAnalysis {
  overallIQ: number; // 0-100
  tier: OutfitTier;
  badgeColor: string;
  metrics: {
    faceAffinity: MetricBreakdown;
    colorHarmony: MetricBreakdown;
    silhouetteBalance: MetricBreakdown;
    thermalCoherence: MetricBreakdown;
  };
  verdictSummary: string;
  stylistTip: string;
  isSandwich: boolean;
  isPielMorenaSynergy: boolean;
  has60_30_10: boolean;
}

export interface OptimizationResult {
  hasOptimization: boolean;
  gain: number;
  originalIQ: number;
  optimizedIQ: number;
  explanation: string;
  optimizedOutfit: OutfitComponents;
  changedPiece?: {
    category: 'top' | 'bottom' | 'shoes' | 'layer';
    oldGarment?: Garment | null;
    newGarment: Garment;
    action: 'swap' | 'add_layer' | 'remove_layer';
  };
}

export interface BridgeGarmentRecommendation {
  type: string;
  typeName: string;
  colorName: string;
  colorHex: string;
  category: 'layer' | 'top' | 'bottom' | 'shoes';
  newOutfitsCount: number;
  versatilityGainPercent: number;
  reason: string;
  faceAffinityBonus: boolean;
}

export interface OrphanGarmentAnalysis {
  garment: Garment;
  comboCount: number;
  rescueTip: string;
  bestPartner?: Garment;
}

export interface PurchaseSimulationResult {
  newOutfitsCreated: number;
  averageIQ: number;
  faceAffinityScore: number;
  verdict: 'Imprescindible' | 'Excelente' | 'Aceptable' | 'Redundante';
  verdictDescription: string;
  bestComboSample?: OutfitComponents;
}

/* ────────────────────────────────────────────────────────────
   1. CÁLCULO DE OUTFIT IQ (0-100) CON 4 PILARES BIOMECÁNICOS
   ──────────────────────────────────────────────────────────── */
export function calculateOutfitIQ(
  pieces: OutfitComponents,
  profile: UserProfile,
  weatherTemp?: number | null
): OutfitIQAnalysis {
  const { top, bottom, shoe, layer } = pieces;
  const allGarments = [top, bottom, shoe, layer].filter(Boolean) as Garment[];

  // 1. AFINIDAD FACIAL & SUBTONO DÉRMICO (Peso: 30%)
  let faceScore: number;
  let faceNote: string;
  let isPielMorenaSynergy = false;
  const isMorena = profile.skin === 'morena';
  const warmEarthTones = ['Terracota', 'Camel', 'Tabaco', 'Verde Oliva', 'Chocolate'];
  const brightContrasts = ['Crema', 'Blanco Roto', 'Azul Marino'];

  // La prenda superior o solapas de la sobrecamisa impactan directamente el rostro
  const topColor = top?.colorName || '';
  const layerColor = layer?.colorName || '';

  if (isMorena) {
    if (topColor === 'Terracota' || layerColor === 'Terracota') {
      faceScore = 99;
      faceNote = 'Terracota es tu acento rey: maximiza la calidez y el resplandor de tu piel morena';
      isPielMorenaSynergy = true;
    } else if (warmEarthTones.includes(topColor) || warmEarthTones.includes(layerColor)) {
      faceScore = 95;
      faceNote = `${topColor || layerColor}: tono tierra en sintonía orgánica perfecta con tu tez morena`;
      isPielMorenaSynergy = true;
    } else if (brightContrasts.includes(topColor)) {
      faceScore = 90;
      faceNote = `${topColor}: contraste limpio y nítido que aporta luminosidad facial`;
      isPielMorenaSynergy = true;
    } else if (['Gris Claro', 'Gris Carbón'].includes(topColor) && !layer) {
      faceScore = 62;
      faceNote = 'Los tonos grises fríos sin capa cálida pueden apagar la luminosidad de tu piel morena';
    } else {
      faceScore = 78;
      faceNote = 'Tono aceptable para tu colorimetría; una capa tierra elevaría tu presencia';
    }
  } else {
    const skinDna = SKIN_COLOR_DNA[profile.skin as SkinTone] || SKIN_COLOR_DNA.media;
    const isPowerTop = skinDna.powerColors.some(c => c.toLowerCase().includes(topColor.toLowerCase()));
    const isPowerLayer = layer && skinDna.powerColors.some(c => c.toLowerCase().includes(layerColor.toLowerCase()));
    const isAvoid = skinDna.avoidColors.some(c => c.toLowerCase().includes(topColor.toLowerCase()));

    if (isPowerTop || isPowerLayer) {
      faceScore = 96;
      faceNote = `Armonía total con tu fototipo dérmico (${skinDna.name})`;
    } else if (isAvoid) {
      faceScore = 60;
      faceNote = 'Color que compite con tu subtono natural; prefiere tu paleta recomendada';
    } else {
      faceScore = 80;
      faceNote = 'Tono compatible con tu colorimetría facial';
    }
  }

  // 2. SINCRONIZACIÓN CROMÁTICA & REGLA DEL SÁNDWICH (Peso: 25%)
  let colorScore = 70;
  let colorNote = 'Coordinación tonal básica';
  let isSandwich = false;

  const topMatchesShoe = top?.colorName === shoe?.colorName;
  const layerMatchesShoe = Boolean(layer && layer.colorName === shoe?.colorName);
  const bottomDiffers = bottom?.colorName !== top?.colorName && (!layer || bottom?.colorName !== layer.colorName);

  if ((topMatchesShoe || layerMatchesShoe) && bottomDiffers) {
    isSandwich = true;
    colorScore = 98;
    colorNote = layerMatchesShoe
      ? `Sándwich de Alta Costura: sobrecamisa ${layer?.colorName} en armonía con calzado ${shoe?.colorName}`
      : `Sándwich Cromático: prenda superior ${top?.colorName} y calzado ${shoe?.colorName} enmarcando el conjunto`;
  } else if (allGarments.every(g => g.colorCat === 'base')) {
    colorScore = 88;
    colorNote = 'Paleta monocromática neutra: sobriedad atemporal';
  } else if (allGarments.filter(g => g.colorCat === 'accent').length === 1) {
    colorScore = 92;
    colorNote = 'Punto focal único bien controlado sin saturación visual';
  } else if (allGarments.filter(g => g.colorCat === 'accent').length > 1) {
    colorScore = 64;
    colorNote = 'Múltiples acentos compiten entre sí; se recomienda un solo tono de énfasis';
  }

  // 3. EQUILIBRIO DE SILUETA & PROPORCIÓN 60/30/10 (Peso: 25%)
  let silScore = 75;
  let silNote = 'Proporciones corporales estándar';
  let has60_30_10 = false;

  const hasBase = allGarments.some(g => g.colorCat === 'base');
  const hasSecondary = allGarments.some(g => g.colorCat === 'secondary');
  const hasAccent = allGarments.some(g => g.colorCat === 'accent');

  if (hasBase && hasSecondary && hasAccent) {
    has60_30_10 = true;
    silScore = 96;
    silNote = 'Regla de Oro 60/30/10: base neutra, secundaria estructural y acento focal';
  } else if (hasBase && (hasSecondary || hasAccent)) {
    silScore = 88;
    silNote = 'Distribución armoniosa de peso visual';
  }

  const heightVal = parseInt(profile.height, 10) || 175;
  const isTall = heightVal >= 190;
  const topIsDark = ['Negro', 'Azul Marino', 'Chocolate', 'Gris Carbón'].includes(top?.colorName || '');
  const bottomIsDark = ['Negro', 'Azul Marino', 'Chocolate', 'Gris Carbón'].includes(bottom?.colorName || '');
  const hasContrastBreak = (topIsDark && !bottomIsDark) || (!topIsDark && bottomIsDark);

  if (isTall && hasContrastBreak) {
    silScore = Math.min(100, silScore + 5);
    silNote += ' · Corte horizontal estilizado que equilibra tu estatura atlética';
  }

  if (layer) {
    silScore = Math.min(100, silScore + 4);
  }

  // 4. COHERENCIA TÉRMICA BIOCLIMÁTICA (Peso: 20%)
  let thermalScore: number;
  let thermalNote: string;

  const userClimate = profile.climate || 'templado';
  const effectiveTemp = typeof weatherTemp === 'number' ? weatherTemp : userClimate === 'calido' ? 26 : userClimate === 'frio' ? 12 : 20;

  if (effectiveTemp <= 16) {
    // Clima fresco/frío
    if (layer) {
      thermalScore = 96;
      thermalNote = `Excelente protección térmica estructurada (${effectiveTemp}°C)`;
    } else {
      thermalScore = 65;
      thermalNote = `Temperatura fresca (${effectiveTemp}°C): una sobrecamisa o blazer aportaría confort y presencia`;
    }
  } else if (effectiveTemp >= 25) {
    // Clima cálido
    if (layer) {
      thermalScore = 68;
      thermalNote = `Temperatura cálida (${effectiveTemp}°C): la sobrecamisa puede generar exceso térmico si es pesada`;
    } else {
      thermalScore = 95;
      thermalNote = `Silueta ligera y fresca ideal para clima cálido (${effectiveTemp}°C)`;
    }
  } else {
    // Templado (17°C - 24°C)
    thermalScore = 92;
    thermalNote = `Rango térmico ideal (${effectiveTemp}°C); adaptable tanto con capa como sin ella`;
  }

  // CÁLCULO PONDERADO FINAL
  const overallIQ = Math.round(
    faceScore * 0.30 +
    colorScore * 0.25 +
    silScore * 0.25 +
    thermalScore * 0.20
  );

  let tier: OutfitTier;
  let badgeColor: string;

  if (overallIQ >= 92) {
    tier = 'Editorial';
    badgeColor = '#C0603A'; // Terracota / Bronce Alta Costura
  } else if (overallIQ >= 82) {
    tier = 'Distinguido';
    badgeColor = '#C19A6B'; // Camel Oro
  } else if (overallIQ >= 72) {
    tier = 'Correcto';
    badgeColor = '#6B7B3A'; // Verde Oliva
  } else {
    tier = 'Mejorable';
    badgeColor = '#E65100'; // Naranja alerta
  }

  // Veredicto del Estilista
  let verdictSummary: string;
  if (overallIQ >= 92) {
    verdictSummary = isSandwich
      ? 'Presencia impecable de pasarela con sándwich cromático y alta resonancia dérmica.'
      : 'Equilibrio de proporciones y paleta armónica con estándar editorial de alta costura.';
  } else if (overallIQ >= 82) {
    verdictSummary = 'Conjunto sofisticado y balanceado con gran versatilidad para tu perfil.';
  } else if (overallIQ >= 72) {
    verdictSummary = 'Combinación correcta y funcional; un pequeño ajuste cromático la elevaría notablemente.';
  } else {
    verdictSummary = 'El atuendo presenta discordancias de colorimetría o clima que pueden optimizarse.';
  }

  // Tip del Estilista
  let stylistTip: string;
  if (isMorena && !isPielMorenaSynergy) {
    stylistTip = 'Tip: Añade una prenda o sobrecamisa en terracota, camel o tabaco para hacer brillar tu tono de piel.';
  } else if (!isSandwich && top && shoe && top.colorName !== shoe.colorName) {
    stylistTip = `Tip: Prueba coordinar el tono de tu calzado (${shoe.colorName}) con una sobrecamisa para crear el efecto sándwich.`;
  } else if (!layer && effectiveTemp <= 22) {
    stylistTip = 'Tip: Una sobrecamisa de corte recto aporta hombreras visuales y estructura V-Taper a tu silueta.';
  } else {
    stylistTip = 'Tip: Mantén los accesorios discretos en cuero o metal cepillado para no competir con las líneas del corte.';
  }

  const makeStatus = (val: number): 'perfect' | 'good' | 'warning' =>
    val >= 90 ? 'perfect' : val >= 75 ? 'good' : 'warning';

  return {
    overallIQ,
    tier,
    badgeColor,
    metrics: {
      faceAffinity: {
        score: faceScore,
        label: 'Afinidad Facial',
        note: faceNote,
        status: makeStatus(faceScore)
      },
      colorHarmony: {
        score: colorScore,
        label: 'Sincronía Cromática',
        note: colorNote,
        status: makeStatus(colorScore)
      },
      silhouetteBalance: {
        score: silScore,
        label: 'Proporción y Silueta',
        note: silNote,
        status: makeStatus(silScore)
      },
      thermalCoherence: {
        score: thermalScore,
        label: 'Balance Bioclimático',
        note: thermalNote,
        status: makeStatus(thermalScore)
      }
    },
    verdictSummary,
    stylistTip,
    isSandwich,
    isPielMorenaSynergy,
    has60_30_10
  };
}

/* ────────────────────────────────────────────────────────────
   2. AUTO-OPTIMIZACIÓN CON IA (SMART AUTO-OPTIMIZER)
   ──────────────────────────────────────────────────────────── */
export function autoOptimizeOutfit(
  current: OutfitComponents,
  closetGarments: Garment[],
  profile: UserProfile,
  weatherTemp?: number | null
): OptimizationResult {
  const currentIQ = calculateOutfitIQ(current, profile, weatherTemp).overallIQ;

  if (currentIQ >= 95) {
    return {
      hasOptimization: false,
      gain: 0,
      originalIQ: currentIQ,
      optimizedIQ: currentIQ,
      explanation: 'Tu outfit ya alcanza el estándar Editorial de Alta Costura (95%+). No requiere ajustes.',
      optimizedOutfit: current
    };
  }

  const cleanCloset = closetGarments.filter(g => !g.inLaundry && g.status !== 'want-replace');
  const availableLayers = cleanCloset.filter(g => g.cat === 'layer');
  const availableTops = cleanCloset.filter(g => g.cat === 'top');
  const availableBottoms = cleanCloset.filter(g => g.cat === 'bottom');
  const availableShoes = cleanCloset.filter(g => g.cat === 'shoes');

  let bestOutfit: OutfitComponents = current;
  let bestIQ = currentIQ;
  let bestChange: OptimizationResult['changedPiece'] | undefined;
  let bestExplanation = '';

  // 1. Probar añadir o cambiar capa (Sobrecamisa / Blazer)
  for (const lyr of availableLayers) {
    const candidate: OutfitComponents = { ...current, layer: lyr };
    const iq = calculateOutfitIQ(candidate, profile, weatherTemp).overallIQ;
    if (iq > bestIQ) {
      bestIQ = iq;
      bestOutfit = candidate;
      bestChange = {
        category: 'layer',
        oldGarment: current.layer,
        newGarment: lyr,
        action: current.layer ? 'swap' : 'add_layer'
      };
      bestExplanation = `Añadimos ${lyr.name} (${lyr.colorName}): aporta estructura V-Taper, sándwich de color y afinidad con tu piel.`;
    }
  }

  // 2. Si tiene capa pero hace calor o desbalancea, probar quitarla
  if (current.layer) {
    const withoutLayer: OutfitComponents = { ...current, layer: null };
    const iqWithout = calculateOutfitIQ(withoutLayer, profile, weatherTemp).overallIQ;
    if (iqWithout > bestIQ) {
      bestIQ = iqWithout;
      bestOutfit = withoutLayer;
      bestChange = {
        category: 'layer',
        oldGarment: current.layer,
        newGarment: current.top,
        action: 'remove_layer'
      };
      bestExplanation = `Retiramos la capa para lograr mayor ligereza bioclimática y resaltar la caída del ${current.top.name}.`;
    }
  }

  // 3. Probar cambiar la prenda superior (Top)
  for (const t of availableTops) {
    if (t.id === current.top.id) continue;
    const candidate: OutfitComponents = { ...current, top: t };
    const iq = calculateOutfitIQ(candidate, profile, weatherTemp).overallIQ;
    if (iq > bestIQ) {
      bestIQ = iq;
      bestOutfit = candidate;
      bestChange = {
        category: 'top',
        oldGarment: current.top,
        newGarment: t,
        action: 'swap'
      };
      bestExplanation = `Sustituimos ${current.top.name} por ${t.name} (${t.colorName}): potencia directamente la luminosidad de tu rostro.`;
    }
  }

  // 4. Probar cambiar el calzado (Shoes) para crear sándwich
  for (const s of availableShoes) {
    if (s.id === current.shoe.id) continue;
    const candidate: OutfitComponents = { ...current, shoe: s };
    const iq = calculateOutfitIQ(candidate, profile, weatherTemp).overallIQ;
    if (iq > bestIQ) {
      bestIQ = iq;
      bestOutfit = candidate;
      bestChange = {
        category: 'shoes',
        oldGarment: current.shoe,
        newGarment: s,
        action: 'swap'
      };
      bestExplanation = `Cambiamos el calzado a ${s.name} (${s.colorName}): armoniza con la parte superior creando la Regla del Sándwich.`;
    }
  }

  // 5. Probar cambiar la prenda inferior (Bottom)
  for (const b of availableBottoms) {
    if (b.id === current.bottom.id) continue;
    const candidate: OutfitComponents = { ...current, bottom: b };
    const iq = calculateOutfitIQ(candidate, profile, weatherTemp).overallIQ;
    if (iq > bestIQ) {
      bestIQ = iq;
      bestOutfit = candidate;
      bestChange = {
        category: 'bottom',
        oldGarment: current.bottom,
        newGarment: b,
        action: 'swap'
      };
      bestExplanation = `Reemplazamos ${current.bottom.name} por ${b.name} (${b.colorName}): equilibra el contraste 60/30/10 y la silueta.`;
    }
  }

  const gain = bestIQ - currentIQ;

  return {
    hasOptimization: gain > 0,
    gain,
    originalIQ: currentIQ,
    optimizedIQ: bestIQ,
    explanation: bestExplanation || 'El outfit actual ya representa la mejor armonía disponible con tu armario.',
    optimizedOutfit: bestOutfit,
    changedPiece: bestChange
  };
}

/* ────────────────────────────────────────────────────────────
   3. DETECTOR DE PRENDA PUENTE ("SMART CAPSULE BRIDGE")
   Calcula qué pieza hipotética desbloquea más nuevos looks.
   ──────────────────────────────────────────────────────────── */
const HIGH_FASHION_CATALOG_CANDIDATES: Array<{
  type: string;
  typeName: string;
  colorName: string;
  category: 'layer' | 'top' | 'bottom' | 'shoes';
}> = [
  { type: 'sobrecamisa', typeName: 'Sobrecamisa Marrón Tabaco', colorName: 'Tabaco', category: 'layer' },
  { type: 'sobrecamisa', typeName: 'Sobrecamisa Terracota', colorName: 'Terracota', category: 'layer' },
  { type: 'sobrecamisa', typeName: 'Sobrecamisa Verde Oliva', colorName: 'Verde Oliva', category: 'layer' },
  { type: 'blazer', typeName: 'Blazer Azul Marino Entallado', colorName: 'Azul Marino', category: 'layer' },
  { type: 'pantalon', typeName: 'Chino Beige Piedra / Arena', colorName: 'Beige Piedra', category: 'bottom' },
  { type: 'pantalon', typeName: 'Pantalón Chino Camel', colorName: 'Camel', category: 'bottom' },
  { type: 'polo', typeName: 'Polo Tejido Terracota', colorName: 'Terracota', category: 'top' },
  { type: 'polo', typeName: 'Polo Verde Esmeralda / Oliva', colorName: 'Verde Oliva', category: 'top' },
  { type: 'camisa', typeName: 'Camisa Lino Blanco Roto', colorName: 'Blanco Roto', category: 'top' },
  { type: 'mocasines', typeName: 'Mocasines Cuero Chocolate', colorName: 'Chocolate', category: 'shoes' },
  { type: 'mocasines', typeName: 'Mocasines Tabaco / Coñac', colorName: 'Tabaco', category: 'shoes' },
  { type: 'tenis', typeName: 'Tenis Minimalistas Blanco Roto', colorName: 'Blanco Roto', category: 'shoes' }
];

export function detectBridgeGarment(
  garments: Garment[],
  profile: UserProfile
): BridgeGarmentRecommendation | null {
  const tops = garments.filter(g => g.cat === 'top' && !g.inLaundry);
  const bottoms = garments.filter(g => g.cat === 'bottom' && !g.inLaundry);
  const shoes = garments.filter(g => g.cat === 'shoes' && !g.inLaundry);
  const layers = garments.filter(g => g.cat === 'layer' && !g.inLaundry);

  if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) return null;

  // Calculamos la versatilidad actual (outfits con IQ >= 80)
  let currentValidOutfits = 0;
  for (const t of tops) {
    for (const b of bottoms) {
      for (const s of shoes) {
        const iq = calculateOutfitIQ({ top: t, bottom: b, shoe: s }, profile).overallIQ;
        if (iq >= 80) currentValidOutfits++;
      }
    }
  }

  let bestCandidate = HIGH_FASHION_CATALOG_CANDIDATES[0];
  let maxNewOutfits = 0;

  for (const cand of HIGH_FASHION_CATALOG_CANDIDATES) {
    // Si el usuario ya tiene esta prenda exacta, omitir
    const alreadyOwns = garments.some(g => g.type === cand.type && g.colorName === cand.colorName);
    if (alreadyOwns) continue;

    const mockGarment: Garment = {
      id: 'mock-bridge',
      name: cand.typeName,
      type: cand.type,
      cat: cand.category,
      colorName: cand.colorName,
      colorHex: COLORS[cand.colorName]?.hex || '#888',
      colorCat: COLORS[cand.colorName]?.cat || 'secondary',
      status: 'ok',
      addedAt: Date.now()
    };

    let simulatedValid = 0;
    if (cand.category === 'layer') {
      for (const t of tops) {
        for (const b of bottoms) {
          for (const s of shoes) {
            const iq = calculateOutfitIQ({ top: t, bottom: b, shoe: s, layer: mockGarment }, profile).overallIQ;
            if (iq >= 82) simulatedValid++;
          }
        }
      }
    } else if (cand.category === 'bottom') {
      for (const t of tops) {
        for (const s of shoes) {
          const lyr = layers[0] || null;
          const iq = calculateOutfitIQ({ top: t, bottom: mockGarment, shoe: s, layer: lyr }, profile).overallIQ;
          if (iq >= 82) simulatedValid++;
        }
      }
    } else if (cand.category === 'top') {
      for (const b of bottoms) {
        for (const s of shoes) {
          const lyr = layers[0] || null;
          const iq = calculateOutfitIQ({ top: mockGarment, bottom: b, shoe: s, layer: lyr }, profile).overallIQ;
          if (iq >= 82) simulatedValid++;
        }
      }
    } else if (cand.category === 'shoes') {
      for (const t of tops) {
        for (const b of bottoms) {
          const lyr = layers[0] || null;
          const iq = calculateOutfitIQ({ top: t, bottom: b, shoe: mockGarment, layer: lyr }, profile).overallIQ;
          if (iq >= 82) simulatedValid++;
        }
      }
    }

    if (simulatedValid > maxNewOutfits) {
      maxNewOutfits = simulatedValid;
      bestCandidate = cand;
    }
  }

  if (maxNewOutfits === 0) return null;

  const versatilityGainPercent = currentValidOutfits > 0
    ? Math.round((maxNewOutfits / currentValidOutfits) * 100)
    : 100;

  const isMorena = profile.skin === 'morena';
  const faceBonus = isMorena && ['Terracota', 'Tabaco', 'Camel', 'Verde Oliva'].includes(bestCandidate.colorName);

  let reason: string;
  if (bestCandidate.category === 'layer') {
    reason = `Desbloquea ${maxNewOutfits} combinaciones de alta costura al cerrar sándwiches de color con tus zapatos y estructurar tus hombros.`;
  } else if (bestCandidate.category === 'bottom') {
    reason = `Actúa como lienzo neutro versátil de tono claro que contrasta con todas tus prendas superiores oscuras y de acento.`;
  } else if (bestCandidate.category === 'top') {
    reason = `Impacto facial directo: ilumina tu tono de piel y combina con prácticamente cualquier pantalón de tu armario.`;
  } else {
    reason = `Calzado ancla que completa la regla del sándwich de color con tus prendas superiores.`;
  }

  return {
    type: bestCandidate.type,
    typeName: bestCandidate.typeName,
    colorName: bestCandidate.colorName,
    colorHex: COLORS[bestCandidate.colorName]?.hex || '#C0603A',
    category: bestCandidate.category,
    newOutfitsCount: maxNewOutfits,
    versatilityGainPercent,
    reason,
    faceAffinityBonus: faceBonus
  };
}

/* ────────────────────────────────────────────────────────────
   4. DETECTOR DE PRENDAS HUÉRFANAS & PLAN DE RESCATE
   ──────────────────────────────────────────────────────────── */
export function detectOrphanGarments(
  garments: Garment[],
  profile: UserProfile
): OrphanGarmentAnalysis[] {
  const tops = garments.filter(g => g.cat === 'top' && !g.inLaundry);
  const bottoms = garments.filter(g => g.cat === 'bottom' && !g.inLaundry);
  const shoes = garments.filter(g => g.cat === 'shoes' && !g.inLaundry);

  const results: OrphanGarmentAnalysis[] = [];

  for (const g of garments) {
    if (g.inLaundry) continue;

    let validCombos = 0;
    let bestPartner: Garment | undefined;
    let highestPairIQ = 0;

    if (g.cat === 'top') {
      for (const b of bottoms) {
        for (const s of shoes) {
          const iq = calculateOutfitIQ({ top: g, bottom: b, shoe: s }, profile).overallIQ;
          if (iq >= 78) {
            validCombos++;
            if (iq > highestPairIQ) {
              highestPairIQ = iq;
              bestPartner = b;
            }
          }
        }
      }
    } else if (g.cat === 'bottom') {
      for (const t of tops) {
        for (const s of shoes) {
          const iq = calculateOutfitIQ({ top: t, bottom: g, shoe: s }, profile).overallIQ;
          if (iq >= 78) {
            validCombos++;
            if (iq > highestPairIQ) {
              highestPairIQ = iq;
              bestPartner = t;
            }
          }
        }
      }
    } else if (g.cat === 'layer') {
      for (const t of tops) {
        for (const b of bottoms) {
          for (const s of shoes) {
            const iq = calculateOutfitIQ({ top: t, bottom: b, shoe: s, layer: g }, profile).overallIQ;
            if (iq >= 78) {
              validCombos++;
              if (iq > highestPairIQ) {
                highestPairIQ = iq;
                bestPartner = s;
              }
            }
          }
        }
      }
    } else if (g.cat === 'shoes') {
      for (const t of tops) {
        for (const b of bottoms) {
          const iq = calculateOutfitIQ({ top: t, bottom: b, shoe: g }, profile).overallIQ;
          if (iq >= 78) {
            validCombos++;
            if (iq > highestPairIQ) {
              highestPairIQ = iq;
              bestPartner = t;
            }
          }
        }
      }
    }

    if (validCombos <= 2) {
      let rescueTip = `Combínalo con prendas de base neutra (Blanco Roto o Azul Marino) para mitigar el contraste excesivo.`;
      if (bestPartner) {
        rescueTip = `Tu mejor combinación actual es usarlo junto a ${bestPartner.name} para armonizar el balance tonal.`;
      }

      results.push({
        garment: g,
        comboCount: validCombos,
        rescueTip,
        bestPartner
      });
    }
  }

  return results;
}

/* ────────────────────────────────────────────────────────────
   5. SIMULADOR DE IMPACTO DE COMPRA (PURCHASE ROI)
   ──────────────────────────────────────────────────────────── */
export function simulatePurchaseImpact(
  prospective: { type: string; colorName: string; cat: Garment['cat'] },
  garments: Garment[],
  profile: UserProfile
): PurchaseSimulationResult {
  const meta = COLORS[prospective.colorName];
  const mock: Garment = {
    id: 'mock-prospective',
    name: `${prospective.type} ${prospective.colorName}`,
    type: prospective.type,
    cat: prospective.cat,
    colorName: prospective.colorName,
    colorHex: meta?.hex || '#888',
    colorCat: meta?.cat || 'secondary',
    status: 'ok',
    addedAt: Date.now()
  };

  const cleanGarments = garments.filter(g => !g.inLaundry);
  const tops = cleanGarments.filter(g => g.cat === 'top');
  const bottoms = cleanGarments.filter(g => g.cat === 'bottom');
  const shoes = cleanGarments.filter(g => g.cat === 'shoes');
  const layers = cleanGarments.filter(g => g.cat === 'layer');

  const simulatedOutfits: OutfitComponents[] = [];

  if (mock.cat === 'layer') {
    for (const t of tops) {
      for (const b of bottoms) {
        for (const s of shoes) {
          simulatedOutfits.push({ top: t, bottom: b, shoe: s, layer: mock });
        }
      }
    }
  } else if (mock.cat === 'top') {
    for (const b of bottoms) {
      for (const s of shoes) {
        simulatedOutfits.push({ top: mock, bottom: b, shoe: s, layer: layers[0] || null });
      }
    }
  } else if (mock.cat === 'bottom') {
    for (const t of tops) {
      for (const s of shoes) {
        simulatedOutfits.push({ top: t, bottom: mock, shoe: s, layer: layers[0] || null });
      }
    }
  } else if (mock.cat === 'shoes') {
    for (const t of tops) {
      for (const b of bottoms) {
        simulatedOutfits.push({ top: t, bottom: b, shoe: mock, layer: layers[0] || null });
      }
    }
  }

  const valid = simulatedOutfits
    .map(outfit => ({ outfit, analysis: calculateOutfitIQ(outfit, profile) }))
    .filter(item => item.analysis.overallIQ >= 78)
    .sort((a, b) => b.analysis.overallIQ - a.analysis.overallIQ);

  const averageIQ = valid.length > 0
    ? Math.round(valid.reduce((acc, curr) => acc + curr.analysis.overallIQ, 0) / valid.length)
    : 70;

  const isMorena = profile.skin === 'morena';
  const warmEarthTones = ['Terracota', 'Camel', 'Tabaco', 'Verde Oliva', 'Chocolate'];
  const faceAffinityScore = isMorena
    ? mock.colorName === 'Terracota' ? 99 : warmEarthTones.includes(mock.colorName) ? 94 : 75
    : 80;

  const alreadyOwnsIdentical = garments.some(g => g.type === mock.type && g.colorName === mock.colorName);

  let verdict: PurchaseSimulationResult['verdict'];
  let verdictDescription: string;

  if (alreadyOwnsIdentical) {
    verdict = 'Redundante';
    verdictDescription = `Ya posees ${mock.type} en ${mock.colorName}. No aporta versatilidad adicional a tu clóset cápsula.`;
  } else if (valid.length >= 8 && averageIQ >= 88) {
    verdict = 'Imprescindible';
    verdictDescription = `Multiplicador de versatilidad: crea ${valid.length} nuevos looks con un Outfit IQ promedio estelar de ${averageIQ}/100.`;
  } else if (valid.length >= 4 && averageIQ >= 82) {
    verdict = 'Excelente';
    verdictDescription = `Gran adquisición: añade ${valid.length} nuevos conjuntos armónicos que complementan tu paleta dérmica.`;
  } else {
    verdict = 'Aceptable';
    verdictDescription = `Aporta ${valid.length} combinaciones, aunque su integración requiere cuidado con los tonos de acento.`;
  }

  return {
    newOutfitsCreated: valid.length,
    averageIQ,
    faceAffinityScore,
    verdict,
    verdictDescription,
    bestComboSample: valid[0]?.outfit
  };
}

/* ────────────────────────────────────────────────────────────
   5. DOCUMENTO BASE Y CONTEXTO DEL PROYECTO (Reglas de la API)
   ──────────────────────────────────────────────────────────── */
export const DOCUMENTO_BASE_CONFIG = {
  persona: {
    height: '6\'6" (1.98 m)',
    heightCm: 198,
    build: 'Atlética (espalda ancha, pecho definido, extremidades largas)',
    skin: 'Oscuro / moreno (beneficiado por contrastes altos y paletas profundas)',
    climate: 'Cálido / tropical (tejidos transpirables: lino mezclado, algodón medio, piqué, seersucker, sin forro pesado)'
  },
  palette60_30_10: {
    neutrals60: ['Azul Marino', 'Crema', 'Blanco Roto', 'Gris Carbón', 'Beige Piedra', 'Camel'],
    secondary30: ['Verde Oliva', 'Chocolate', 'Tabaco', 'Azul Petróleo'],
    accents10: ['Terracota', 'Borgoña', 'Verde Esmeralda', 'Rosa Empolvado']
  },
  standardFormula: 'Dos neutros + Un color con personalidad + Calzado limpio y proporcionado',
  tailoringRules: [
    {
      area: 'Camisetas y Polos',
      rule: 'Costura exacta en el hombro, largo de torso suficiente para no salirse al estirarse, manga a mitad del bíceps.'
    },
    {
      area: 'Pantalones',
      rule: 'Tiro medio o ligeramente alto, corte athletic taper o recto moderno. Prohibido cortes skinny extremos.'
    },
    {
      area: 'Blazer',
      rule: 'Debe cubrir el asiento por completo, con solapa mediana y cintura sutilmente marcada.'
    },
    {
      area: 'Prioridad del Ajuste sobre la Marca',
      rule: 'Buscar tallas Tall, Long o Athletic Tall. Prohibido sugerir comprar una talla más ancha solo para ganar longitud (genera torso cuadrado).'
    }
  ]
};

export interface DocumentoBaseValidation {
  isHeightCalibrated: boolean;
  heightNote: string;
  isClimateOptimized: boolean;
  climateNote: string;
  isColorPaletteMatch: boolean;
  colorRole: '60% Neutro Base' | '30% Secundario' | '10% Acento' | 'No catalogado';
  colorNote: string;
  isVersatility3to1: boolean;
  versatileMatchesCount: number;
  versatilityNote: string;
  overallPassed: boolean;
}

export function validateDocumentoBaseFilters(
  candidate: { type: string; colorName: string; cat: string },
  closetGarments: Garment[],
  userProfile?: UserProfile
): DocumentoBaseValidation {
  // 1. Filtro Estatura (~6'6" / 1.98m)
  const isTall = !userProfile || Number(userProfile.height) >= 190 || userProfile.height.includes('6');
  const heightNote = isTall
    ? 'Considera estatura 6\'6" (1.98 m): requiere tallas Tall / Long / Athletic Tall para caída exacta sin ensanchar torso.'
    : 'Patronaje proporcionado según estatura declarada.';

  // 2. Filtro Clima Cálido / Tropical
  const warmHeavyTypes = ['campera', 'trench', 'buzo', 'cardigan'];
  const isHeavy = warmHeavyTypes.includes(candidate.type);
  const isClimateOptimized = !isHeavy;
  const climateNote = isClimateOptimized
    ? 'Apta para clima cálido / tropical: tejido ligero transpirable (lino, algodón medio, piqué o seersucker sin forro pesado).'
    : 'Advertencia: pieza pesada para clima tropical. Reservar exclusivamente para viajes o recintos con aire acondicionado.';

  // 3. Filtro Paleta 60-30-10 para Piel Morena
  const { neutrals60, secondary30, accents10 } = DOCUMENTO_BASE_CONFIG.palette60_30_10;
  let colorRole: DocumentoBaseValidation['colorRole'] = 'No catalogado';
  let colorNote: string;

  if (neutrals60.includes(candidate.colorName)) {
    colorRole = '60% Neutro Base';
    colorNote = `${candidate.colorName} pertenece al 60% de Neutros Base: soporte de contraste impecable para piel morena.`;
  } else if (secondary30.includes(candidate.colorName)) {
    colorRole = '30% Secundario';
    colorNote = `${candidate.colorName} pertenece al 30% Secundario: tono tierra con profunda resonancia dérmica.`;
  } else if (accents10.includes(candidate.colorName)) {
    colorRole = '10% Acento';
    colorNote = `${candidate.colorName} pertenece al 10% Acento: resalta el rostro con alta vibración cromática.`;
  } else {
    colorNote = `${candidate.colorName}: fuera de la triada 60-30-10 recomendada para alto contraste en piel oscura.`;
  }
  const isColorPaletteMatch = colorRole !== 'No catalogado';

  // 4. Filtro Regla de Versatilidad 3:1 (mínimo 3 opciones de enlace con el armario)
  const compatibleGarments = closetGarments.filter(g => {
    if (g.cat === candidate.cat) return false;
    // Comprueba compatibilidad armónica (neutros base, secundarios complementarios y acentos)
    const isPairNeutral = neutrals60.includes(g.colorName) || g.colorCat === 'base';
    const isPairSecondary = secondary30.includes(g.colorName) || g.colorCat === 'secondary';
    const isPairAccent = accents10.includes(g.colorName) || g.colorCat === 'accent';
    return isPairNeutral || isPairSecondary || isPairAccent;
  });
  const versatileMatchesCount = compatibleGarments.length;
  const isVersatility3to1 = versatileMatchesCount >= 3;
  const versatilityNote = isVersatility3to1
    ? `Cumple la Regla 3:1: enlaza con ${versatileMatchesCount} prendas existentes en tu clóset cápsula.`
    : `Requiere al menos 3 prendas compatibles en el armario (actualmente enlaza con ${versatileMatchesCount}).`;

  const overallPassed = isClimateOptimized && isColorPaletteMatch && isVersatility3to1;

  return {
    isHeightCalibrated: isTall,
    heightNote,
    isClimateOptimized,
    climateNote,
    isColorPaletteMatch,
    colorRole,
    colorNote,
    isVersatility3to1,
    versatileMatchesCount,
    versatilityNote,
    overallPassed
  };
}

