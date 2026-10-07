import { describe, expect, it } from 'vitest';
import { getDynamicCapsule } from './capsule';
import type { PaletteAssignment } from './palettes';

const palette = {
  main: {
    id: 'test',
    num: 1,
    name: 'Prueba',
    style: 'Prueba',
    colors: ['#1B2A4A', '#FAF7F2', '#6B7B3A', '#C19A6B'],
    combination: 'Prueba'
  },
  alternatives: []
} as unknown as PaletteAssignment;

describe('getDynamicCapsule', () => {
  it('crea una cápsula femenina de 20 piezas con categorías esenciales', () => {
    const capsule = getDynamicCapsule(palette, 'femenino');
    expect(capsule).toHaveLength(20);
    expect(capsule.some((item) => item.type === 'blusa')).toBe(true);
    expect(capsule.some((item) => item.type === 'falda')).toBe(true);
    expect(capsule.some((item) => item.type === 'tacones')).toBe(true);
  });

  it('mantiene la cápsula masculina/base de 20 piezas', () => {
    const capsule = getDynamicCapsule(palette, 'masculino');
    expect(capsule).toHaveLength(20);
    expect(capsule.some((item) => item.type === 'derby')).toBe(true);
  });
});
