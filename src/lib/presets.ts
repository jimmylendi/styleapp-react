import type { Garment } from '../types';

export interface StarterCapsule {
  id: string;
  name: string;
  description: string;
  badge: string;
  garments: (Omit<Garment, 'id' | 'addedAt' | 'status'> & { status?: 'ok' | 'want-replace' })[];
}

export const STARTER_CAPSULES: StarterCapsule[] = [
  {
    id: 'athletic-tall-fundamental',
    name: 'Cápsula Fundamental Athletic Tall (12 Piezas)',
    description: 'Diseñada para hombres altos (6\'6" / 1.98 m), atléticos y piel morena. 12 piezas base calibradas para clima cálido y máxima versatilidad.',
    badge: '★ Documento Base Oficial',
    garments: [
      { name: 'Camiseta Blanca (Algodón medio, Athletic Tall)', type: 'camiseta', cat: 'top', colorName: 'Blanco Roto', colorHex: '#FAF7F2', colorCat: 'base', price: 28 },
      { name: 'Camiseta Crema / Marfil (Caída suave)', type: 'camiseta', cat: 'top', colorName: 'Crema', colorHex: '#F5E6D3', colorCat: 'base', price: 28 },
      { name: 'Polo Piqué Azul Marino (Corte hombro exacto)', type: 'polo', cat: 'top', colorName: 'Azul Marino', colorHex: '#1B2A4A', colorCat: 'base', price: 42 },
      { name: 'Polo Verde Oliva Transpirable', type: 'polo', cat: 'top', colorName: 'Verde Oliva', colorHex: '#6B7B3A', colorCat: 'secondary', price: 42 },
      { name: 'Camisa Blanco Roto (Popelín/Lino formal)', type: 'camisa', cat: 'top', colorName: 'Blanco Roto', colorHex: '#FAF7F2', colorCat: 'base', price: 58 },
      { name: 'Camisa Azul Claro (Base profesional)', type: 'camisa', cat: 'top', colorName: 'Azul Claro', colorHex: '#A8C4E0', colorCat: 'base', price: 58 },
      { name: 'Pantalón Chino Camel (Tiro medio athletic)', type: 'pantalon', cat: 'bottom', colorName: 'Camel', colorHex: '#C19A6B', colorCat: 'base', price: 65 },
      { name: 'Pantalón Chino Beige Piedra', type: 'pantalon', cat: 'bottom', colorName: 'Beige Piedra', colorHex: '#D9C7A8', colorCat: 'base', price: 65 },
      { name: 'Pantalón Gris Carbón (Oficina / Noche)', type: 'pantalon', cat: 'bottom', colorName: 'Gris Carbón', colorHex: '#36454F', colorCat: 'base', price: 72 },
      { name: 'Jean Índigo Oscuro (Limpio sin roturas)', type: 'pantalon', cat: 'bottom', colorName: 'Azul Marino', colorHex: '#1D2A4A', colorCat: 'base', price: 70 },
      { name: 'Sobrecamisa Verde Oliva (Bolsillos utilitarios)', type: 'sobrecamisa', cat: 'layer', colorName: 'Verde Oliva', colorHex: '#6B7B3A', colorCat: 'secondary', price: 85 },
      { name: 'Blazer Azul Marino Estructurado (Cubre asiento)', type: 'blazer', cat: 'layer', colorName: 'Azul Marino', colorHex: '#14213D', colorCat: 'base', price: 135 },
      { name: 'Tenis Crema / Blancos Minimalistas', type: 'tenis', cat: 'shoes', colorName: 'Crema', colorHex: '#F5E6D3', colorCat: 'base', price: 90 },
      { name: 'Mocasines Coñac Cuero', type: 'mocasines', cat: 'shoes', colorName: 'Tabaco', colorHex: '#8B5A2B', colorCat: 'secondary', price: 105 },
      { name: 'Zapatos Derby Café Oscuro', type: 'derby', cat: 'shoes', colorName: 'Chocolate', colorHex: '#4A3220', colorCat: 'base', price: 110 },
      { name: 'Botines Topo / Chocolate', type: 'botines', cat: 'shoes', colorName: 'Chocolate', colorHex: '#4A3220', colorCat: 'base', price: 120 },
    ],
  },
  {
    id: 'minimalista',
    name: 'Cápsula Minimalista (12 Piezas)',
    description: 'Básicos neutros de alta versatilidad. Crea más de 30 combinaciones impecables.',
    badge: '★ Más Popular',
    garments: [
      { name: 'Playera Blanca Clásica', type: 'remera', cat: 'top', colorName: 'Blanco', colorHex: '#FFFFFF', colorCat: 'base', price: 25 },
      { name: 'Camisa Oxford Celeste', type: 'camisa-casual', cat: 'top', colorName: 'Celeste', colorHex: '#8CB8E8', colorCat: 'base', price: 45 },
      { name: 'Camiseta Negra Cuello Redondo', type: 'remera', cat: 'top', colorName: 'Negro', colorHex: '#181A20', colorCat: 'base', price: 25 },
      { name: 'Pantalón Chino Beige', type: 'chino', cat: 'bottom', colorName: 'Beige', colorHex: '#D7C4A5', colorCat: 'base', price: 55 },
      { name: 'Jeans Recto Azul Índigo', type: 'jean', cat: 'bottom', colorName: 'Azul Marino', colorHex: '#1D2A4A', colorCat: 'base', price: 65 },
      { name: 'Pantalón Sastre Gris Carbón', type: 'vestir', cat: 'bottom', colorName: 'Gris Carbón', colorHex: '#3D424F', colorCat: 'base', price: 70 },
      { name: 'Blazer Marino Entallado', type: 'blazer', cat: 'layer', colorName: 'Azul Marino', colorHex: '#14213D', colorCat: 'base', price: 120 },
      { name: 'Cardigan de Punto Gris Claro', type: 'cardigan', cat: 'layer', colorName: 'Gris Claro', colorHex: '#C5CBD3', colorCat: 'secondary', price: 60 },
      { name: 'Sobrecamisa de Lino Oliva', type: 'sobrecamisa', cat: 'layer', colorName: 'Verde Oliva', colorHex: '#4E5B42', colorCat: 'accent', price: 75 },
      { name: 'Tenis de Piel Blancos Minimalistas', type: 'sneakers', cat: 'shoes', colorName: 'Blanco', colorHex: '#F0F2F5', colorCat: 'base', price: 85 },
      { name: 'Mocasines Cuero Marrón Tabaco', type: 'mocasines', cat: 'shoes', colorName: 'Marrón Tabaco', colorHex: '#6F4E37', colorCat: 'secondary', price: 95 },
      { name: 'Botas Chelsea Negras', type: 'botas', cat: 'shoes', colorName: 'Negro', colorHex: '#15161A', colorCat: 'base', price: 110 },
    ],
  },
  {
    id: 'oficina-smart',
    name: 'Cápsula Ejecutiva & Smart Casual (14 Piezas)',
    description: 'Equilibrio sofisticado entre presencia profesional, elegancia y confort.',
    badge: '💼 Profesional',
    garments: [
      { name: 'Camisa Blanca Formal Popelín', type: 'camisa-formal', cat: 'top', colorName: 'Blanco', colorHex: '#FFFFFF', colorCat: 'base', price: 50 },
      { name: 'Camisa a Rayas Azul y Blanca', type: 'camisa-casual', cat: 'top', colorName: 'Celeste', colorHex: '#A2C4EC', colorCat: 'base', price: 55 },
      { name: 'Polo Piqué Azul Marino', type: 'polo', cat: 'top', colorName: 'Azul Marino', colorHex: '#1B263B', colorCat: 'base', price: 40 },
      { name: 'Suéter de Cuello Tortuga Negro', type: 'remera', cat: 'top', colorName: 'Negro', colorHex: '#1A1C20', colorCat: 'base', price: 60 },
      { name: 'Pantalón Chino Marino', type: 'chino', cat: 'bottom', colorName: 'Azul Marino', colorHex: '#19243C', colorCat: 'base', price: 60 },
      { name: 'Pantalón de Vestir Gris Plomo', type: 'vestir', cat: 'bottom', colorName: 'Gris', colorHex: '#525B6C', colorCat: 'base', price: 75 },
      { name: 'Pantalón Chino Caqui Claro', type: 'chino', cat: 'bottom', colorName: 'Caqui', colorHex: '#C9B89C', colorCat: 'base', price: 55 },
      { name: 'Blazer Estructurado Azul Noche', type: 'blazer', cat: 'layer', colorName: 'Azul Noche', colorHex: '#111D36', colorCat: 'base', price: 130 },
      { name: 'Chaqueta Harrington Gris Oxford', type: 'campera', cat: 'layer', colorName: 'Gris Oscuro', colorHex: '#363E4D', colorCat: 'secondary', price: 90 },
      { name: 'Gabardina Clásica Beige / Trench', type: 'trench', cat: 'layer', colorName: 'Beige', colorHex: '#DECBB5', colorCat: 'secondary', price: 140 },
      { name: 'Zapatos Oxford de Piel Negros', type: 'zapatos-vestir', cat: 'shoes', colorName: 'Negro', colorHex: '#121316', colorCat: 'base', price: 110 },
      { name: 'Zapatos Derby Marrón Coñac', type: 'zapatos-vestir', cat: 'shoes', colorName: 'Coñac', colorHex: '#8B4513', colorCat: 'secondary', price: 105 },
      { name: 'Tenis de Vestir Monocromáticos', type: 'sneakers', cat: 'shoes', colorName: 'Blanco Cálido', colorHex: '#EDEDED', colorCat: 'base', price: 80 },
      { name: 'Mocasines de Terciopelo / Gamuza', type: 'mocasines', cat: 'shoes', colorName: 'Gris Carbón', colorHex: '#454C58', colorCat: 'secondary', price: 95 },
    ],
  },
  {
    id: 'urbana-casual',
    name: 'Cápsula Urbana & Fin de Semana (11 Piezas)',
    description: 'Estilo contemporáneo, desenfadado y fresco para días libres y salidas sociales.',
    badge: '⚡ Street & Weekend',
    garments: [
      { name: 'Camiseta Oversized Arena', type: 'remera', cat: 'top', colorName: 'Arena', colorHex: '#D8CBB6', colorCat: 'base', price: 30 },
      { name: 'Camiseta Gráfica Minimalista Negra', type: 'remera', cat: 'top', colorName: 'Negro', colorHex: '#1C1D21', colorCat: 'base', price: 35 },
      { name: 'Camisa Guayabera / Lino Salvia', type: 'camisa-casual', cat: 'top', colorName: 'Verde Salvia', colorHex: '#879F88', colorCat: 'accent', price: 50 },
      { name: 'Jeans Lavado Claro Estilo Vintage', type: 'jean', cat: 'bottom', colorName: 'Azul Claro', colorHex: '#7AA3D5', colorCat: 'base', price: 60 },
      { name: 'Pantalón Cargo Negro Ajustado', type: 'chino', cat: 'bottom', colorName: 'Negro', colorHex: '#1D1E22', colorCat: 'base', price: 65 },
      { name: 'Bermuda Chino Lino Beige', type: 'bermuda', cat: 'bottom', colorName: 'Beige', colorHex: '#DDD1B8', colorCat: 'secondary', price: 40 },
      { name: 'Chaqueta Bomber Negra', type: 'campera', cat: 'layer', colorName: 'Negro', colorHex: '#15171B', colorCat: 'base', price: 85 },
      { name: 'Chaqueta de Mezclilla Azul Medio', type: 'campera', cat: 'layer', colorName: 'Azul Mezclilla', colorHex: '#355070', colorCat: 'secondary', price: 80 },
      { name: 'Sudadera Hoodie Gris Jaspe', type: 'buzo', cat: 'layer', colorName: 'Gris Jaspe', colorHex: '#9FA5B2', colorCat: 'base', price: 55 },
      { name: 'Sneakers Retro Estilo Deportivo', type: 'sneakers', cat: 'shoes', colorName: 'Multicolor Neutro', colorHex: '#EAE6DF', colorCat: 'base', price: 90 },
      { name: 'Alpargatas o Zapatillas Lona', type: 'alpargatas', cat: 'shoes', colorName: 'Azul Marino', colorHex: '#212E4A', colorCat: 'secondary', price: 35 },
    ],
  },
];
