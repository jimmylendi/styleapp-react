import { describe, expect, it } from 'vitest';
import { analyzeSkinAndSuggestEarthPalette } from './earthPalette';

describe('analyzeSkinAndSuggestEarthPalette', () => {
  it('analiza piel morena y optimiza la paleta de tonos tierra con terracota', () => {
    const analysis = analyzeSkinAndSuggestEarthPalette('morena');

    expect(analysis.skinTone).toBe('morena');
    expect(analysis.affinityScore).toBeGreaterThanOrEqual(95);
    expect(analysis.recommendedUndertone).toBe('Cálido dorado');
    expect(analysis.heroColor.name).toContain('Terracota');
    expect(analysis.heroColor.hex).toBe('#C0603A');

    const swatchNames = analysis.earthSwatches.map((s) => s.name);
    expect(swatchNames.some((n) => n.includes('Terracota'))).toBe(true);
    expect(swatchNames.some((n) => n.includes('Camel'))).toBe(true);
    expect(swatchNames.some((n) => n.includes('Oliva'))).toBe(true);
    expect(swatchNames.some((n) => n.includes('Chocolate'))).toBe(true);

    expect(analysis.formulaOutfit.length).toBe(4);
    expect(analysis.avoidColors.length).toBeGreaterThan(0);
    expect(analysis.scientificRationale).toContain('Terracota');
  });

  it('proporciona paleta adaptada para otros tonos de piel', () => {
    const analysisClara = analyzeSkinAndSuggestEarthPalette('clara');
    expect(analysisClara.skinTone).toBe('clara');
    expect(analysisClara.earthSwatches.length).toBeGreaterThan(0);

    const analysisOscura = analyzeSkinAndSuggestEarthPalette('oscura');
    expect(analysisOscura.skinTone).toBe('oscura');
    expect(analysisOscura.affinityScore).toBeGreaterThan(90);
  });
});
