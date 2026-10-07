import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AvatarMannequin } from './AvatarMannequin';
import type { Garment } from '../types';

const mockTop: Garment = {
  id: 'top-1',
  name: 'Polo Terracota',
  type: 'polo',
  cat: 'top',
  colorName: 'Terracota',
  colorHex: '#C0603A',
  colorCat: 'accent',
  status: 'ok',
  addedAt: 1
};

const mockBottom: Garment = {
  id: 'bottom-1',
  name: 'Chino Camel',
  type: 'pantalon',
  cat: 'bottom',
  colorName: 'Camel',
  colorHex: '#C19A6B',
  colorCat: 'base',
  status: 'ok',
  addedAt: 1
};

const mockShoe: Garment = {
  id: 'shoe-1',
  name: 'Mocasines Chocolate',
  type: 'mocasines',
  cat: 'shoes',
  colorName: 'Chocolate',
  colorHex: '#4A3220',
  colorCat: 'base',
  status: 'ok',
  addedAt: 1
};

describe('AvatarMannequin', () => {
  it('renderiza la silueta con el tono de piel del usuario y prendas', () => {
    const html = renderToStaticMarkup(
      <AvatarMannequin
        top={mockTop}
        bottom={mockBottom}
        shoe={mockShoe}
        skin="morena"
        build="atletico"
        hairStyle="corto"
        hairColor="#1A1A1A"
      />
    );

    expect(html).toContain('svg');
    expect(html).toContain('Polo Terracota');
    expect(html).toContain('Chino Camel');
    expect(html).toContain('Mocasines Chocolate');
    expect(html).toContain('#C0603A'); // color terracota
    expect(html).toContain('podium-surface'); // Pedestal 3D de estudio
    expect(html).toContain('Frontal'); // Control 3D
  });

  it('renderiza maniquí 3D con capa y acabado de alta costura', () => {
    const mockLayer: Garment = {
      id: 'layer-1',
      name: 'Sobrecamisa Oliva',
      type: 'sobrecamisa',
      cat: 'layer',
      colorName: 'Verde Oliva',
      colorHex: '#6B7B3A',
      colorCat: 'secondary',
      status: 'ok',
      addedAt: 1
    };

    const html = renderToStaticMarkup(
      <AvatarMannequin
        top={mockTop}
        layer={mockLayer}
        bottom={mockBottom}
        shoe={mockShoe}
        skin="morena"
        build="atletico"
        allowControls={true}
      />
    );

    expect(html).toContain('Sobrecamisa Oliva');
    expect(html).toContain('#6B7B3A');
    expect(html).toContain('3/4 Pasarela');
    expect(html).toContain('layer-inner-shadow-left'); // oclusión ambiental de sobrecamisa
  });

  it('renderiza gafas de sol de modelo de pasarela cuando está activo', () => {
    const html = renderToStaticMarkup(
      <AvatarMannequin
        top={mockTop}
        bottom={mockBottom}
        shoe={mockShoe}
        skin="morena"
        build="atletico"
        sunglasses={true}
        allowControls={true}
      />
    );

    expect(html).toContain('sunglasses-lens');
    expect(html).toContain('Con gafas');
  });
});
