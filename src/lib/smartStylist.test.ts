import { describe, it, expect } from 'vitest';
import {
  calculateOutfitIQ,
  autoOptimizeOutfit,
  detectBridgeGarment,
  simulatePurchaseImpact,
  validateDocumentoBaseFilters
} from './smartStylist';
import type { Garment, UserProfile } from '../types';

const mockProfile: UserProfile = {
  onboarded: true,
  name: 'Jimmy',
  height: '195',
  heightUnit: 'metric',
  build: 'atletico',
  skin: 'morena',
  climate: 'calido',
  stylePersonality: 'elegante',
  wardrobePreference: 'masculino'
};

const topTerracota: Garment = {
  id: 't-1',
  name: 'Polo Terracota',
  type: 'polo',
  cat: 'top',
  colorName: 'Terracota',
  colorHex: '#C0603A',
  colorCat: 'accent',
  status: 'ok',
  addedAt: 1
};

const topGris: Garment = {
  id: 't-2',
  name: 'Camiseta Gris Claro',
  type: 'camiseta',
  cat: 'top',
  colorName: 'Gris Claro',
  colorHex: '#8B8B8B',
  colorCat: 'base',
  status: 'ok',
  addedAt: 2
};

const bottomChino: Garment = {
  id: 'b-1',
  name: 'Chino Beige Piedra',
  type: 'pantalon',
  cat: 'bottom',
  colorName: 'Beige Piedra',
  colorHex: '#D9C7A8',
  colorCat: 'base',
  status: 'ok',
  addedAt: 3
};

const shoeMocasines: Garment = {
  id: 's-1',
  name: 'Mocasines Tabaco',
  type: 'mocasines',
  cat: 'shoes',
  colorName: 'Tabaco',
  colorHex: '#8B5A2B',
  colorCat: 'secondary',
  status: 'ok',
  addedAt: 4
};

const shoeTerracota: Garment = {
  id: 's-2',
  name: 'Mocasines Terracota',
  type: 'mocasines',
  cat: 'shoes',
  colorName: 'Terracota',
  colorHex: '#C0603A',
  colorCat: 'accent',
  status: 'ok',
  addedAt: 5
};

const layerSobrecamisa: Garment = {
  id: 'l-1',
  name: 'Sobrecamisa Marrón Tabaco',
  type: 'sobrecamisa',
  cat: 'layer',
  colorName: 'Tabaco',
  colorHex: '#8B5A2B',
  colorCat: 'secondary',
  status: 'ok',
  addedAt: 6
};

describe('Smart Stylist Intelligence Engine', () => {
  it('calculates higher Outfit IQ for piel morena with terracota and color sandwich', () => {
    // Sandwich: Top Terracota + Shoes Terracota con Bottom Beige
    const sandwichOutfit = calculateOutfitIQ(
      { top: topTerracota, bottom: bottomChino, shoe: shoeTerracota, layer: null },
      mockProfile
    );

    // Sin sandwich ni tono tierra cerca del rostro
    const dullOutfit = calculateOutfitIQ(
      { top: topGris, bottom: bottomChino, shoe: shoeMocasines, layer: null },
      mockProfile
    );

    expect(sandwichOutfit.overallIQ).toBeGreaterThan(dullOutfit.overallIQ);
    expect(sandwichOutfit.isSandwich).toBe(true);
    expect(sandwichOutfit.isPielMorenaSynergy).toBe(true);
    expect(sandwichOutfit.tier).toBe('Editorial');
  });

  it('auto-optimizes a suboptimal outfit by finding a better piece from closet', () => {
    const closet = [topTerracota, topGris, bottomChino, shoeMocasines, layerSobrecamisa];
    const initialOutfit = {
      top: topGris,
      bottom: bottomChino,
      shoe: shoeMocasines,
      layer: null
    };

    const optimization = autoOptimizeOutfit(initialOutfit, closet, mockProfile, 20);

    expect(optimization.hasOptimization).toBe(true);
    expect(optimization.optimizedIQ).toBeGreaterThan(optimization.originalIQ);
    expect(optimization.explanation).toBeTruthy();
  });

  it('detects an impactful bridge garment that unlocks multiple combinations', () => {
    const closet = [topTerracota, topGris, bottomChino, shoeMocasines];
    const bridge = detectBridgeGarment(closet, mockProfile);

    expect(bridge).not.toBeNull();
    if (bridge) {
      expect(bridge.newOutfitsCount).toBeGreaterThan(0);
      expect(bridge.typeName).toBeTruthy();
    }
  });

  it('simulates purchase impact with versatility and average IQ', () => {
    const closet = [topTerracota, bottomChino, shoeMocasines];
    const simulation = simulatePurchaseImpact(
      { type: 'sobrecamisa', colorName: 'Tabaco', cat: 'layer' },
      closet,
      mockProfile
    );

    expect(simulation.newOutfitsCreated).toBeGreaterThan(0);
    expect(simulation.averageIQ).toBeGreaterThanOrEqual(70);
    expect(['Imprescindible', 'Excelente', 'Aceptable']).toContain(simulation.verdict);
  });

  it('validates garments against the 4 Documento Base automatic filters', () => {
    const closet = [topTerracota, topGris, bottomChino, shoeMocasines];
    const candidateValid = { type: 'sobrecamisa', colorName: 'Verde Oliva', cat: 'layer' };

    const validation = validateDocumentoBaseFilters(candidateValid, closet, mockProfile);

    expect(validation.isHeightCalibrated).toBe(true);
    expect(validation.isClimateOptimized).toBe(true);
    expect(validation.isColorPaletteMatch).toBe(true);
    expect(validation.colorRole).toBe('30% Secundario');
    expect(validation.isVersatility3to1).toBe(true);
    expect(validation.versatileMatchesCount).toBeGreaterThanOrEqual(3);
    expect(validation.overallPassed).toBe(true);
  });
});
