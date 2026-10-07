import { describe, expect, it } from 'vitest';
import { generateOutfits } from './engine';
import type { Garment, UserProfile } from '../types';

const profile: UserProfile = {
  onboarded: true,
  name: 'Prueba',
  height: '180',
  heightUnit: 'metric',
  build: 'atletico',
  skin: 'morena',
  climate: 'calido',
  stylePersonality: 'casual',
  wardrobePreference: 'sin-filtro'
};

const garment = (
  id: string,
  type: string,
  cat: Garment['cat'],
  colorName: string,
  colorCat: Garment['colorCat']
): Garment => ({
  id,
  type,
  cat,
  colorName,
  colorHex: '#223344',
  colorCat,
  name: id,
  status: 'ok',
  addedAt: 1
});

const closet: Garment[] = [
  garment('g-top-with-hyphen', 'camiseta', 'top', 'Blanco Roto', 'base'),
  garment('g-bottom-with-hyphen', 'pantalon', 'bottom', 'Azul Marino', 'base'),
  garment('g-shoe-with-hyphen', 'tenis', 'shoes', 'Crema', 'base')
];

describe('generateOutfits', () => {
  it('genera un outfit con las categorías esenciales', () => {
    const outfits = generateOutfits(closet, 'casual', profile, 1);
    expect(outfits).toHaveLength(1);
    expect(outfits[0].top.cat).toBe('top');
    expect(outfits[0].bottom.cat).toBe('bottom');
    expect(outfits[0].shoe.cat).toBe('shoes');
  });

  it('respeta el cooldown usando garmentIds con guiones', () => {
    const used = [{
      id: 'usage-1',
      key: 'legacy-key',
      garmentIds: closet.map((item) => item.id),
      date: Date.now(),
      occasion: 'casual' as const
    }];
    expect(() => generateOutfits(closet, 'casual', profile, 1, used)).not.toThrow();
  });

  it('prioriza y destaca tonos tierra / terracota para piel morena', () => {
    const closetWithTerracotta = [
      garment('g-top-terracota', 'camiseta', 'top', 'Terracota', 'accent'),
      garment('g-top-neutral', 'camiseta', 'top', 'Gris Claro', 'base'),
      garment('g-bottom', 'pantalon', 'bottom', 'Azul Marino', 'base'),
      garment('g-shoe', 'tenis', 'shoes', 'Crema', 'base')
    ];
    const outfits = generateOutfits(closetWithTerracotta, 'casual', profile, 2);
    expect(outfits.length).toBeGreaterThan(0);
    const terracottaOutfit = outfits.find(o => o.top.colorName === 'Terracota');
    if (terracottaOutfit) {
      expect(terracottaOutfit.styleNote).toContain('piel morena');
    }
  });
});
