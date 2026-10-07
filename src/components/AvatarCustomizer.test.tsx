import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AvatarCustomizer } from './AvatarCustomizer';

describe('AvatarCustomizer', () => {
  it('renderiza el personalizador 3D con rasgos y probador de outfits', () => {
    const html = renderToStaticMarkup(<AvatarCustomizer />);

    expect(html).toContain('Personalizar Avatar y Probador Virtual');
    expect(html).toContain('Rasgos Físicos');
    expect(html).toContain('Probador de Outfits');
    expect(html).toContain('Tono de Piel y Fototipo Cutáneo');
    expect(html).toContain('Complexión y Estructura Corporal');
    expect(html).toContain('Guardar rasgos en mi perfil');
  });

  it('renderiza la pestaña del probador de outfits con conjuntos predefinidos', () => {
    const html = renderToStaticMarkup(<AvatarCustomizer initialTab="tryon" />);

    expect(html).toContain('Selección de Outfit para Probar');
    expect(html).toContain('1. Elegante Clásico');
    expect(html).toContain('2. Fresco Moderno');
    expect(html).toContain('5. Tierra Refinada');
    expect(html).toContain('8. Verano con Estilo');
    expect(html).toContain('Armonía con tu Piel');
  });
});
