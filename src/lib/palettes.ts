/* ============================================================
   PALETAS · Las 11 del Anexo C + 3 estrella del Anexo E
   ============================================================ */

export interface Palette {
  id: string;
  num: number;
  name: string;
  style: string;
  colors: string[];
  combination: string;
  bestFor: string[];
}

export interface StarPalette {
  id: string;
  name: string;
  colors: string[];
  description: string;
  bestFor: string;
}

export interface PaletteAssignment {
  main: Palette;
  alternatives: Palette[];
  star?: StarPalette;
}

export const PALETTES: Palette[] = [
  {
    id: 'elegante-clasico',
    num: 1,
    name: 'Elegante Clásico',
    style: 'Formal · Business casual',
    colors: ['#1B2A4A', '#FAF7F2', '#C19A6B', '#8B5A2B'],
    combination: 'Camisa blanca + pantalón camel + blazer azul marino + zapatos coñac',
    bestFor: ['base']
  },
  {
    id: 'fresco-moderno',
    num: 2,
    name: 'Fresco Moderno',
    style: 'Casual refinado',
    colors: ['#6B7B3A', '#D9C7A8', '#FAF7F2', '#4A3220'],
    combination: 'Polo oliva + chino beige + sobrecamisa marrón + mocasines',
    bestFor: ['secundario']
  },
  {
    id: 'noche-sofisticada',
    num: 3,
    name: 'Noche Sofisticada',
    style: 'Elegante nocturno',
    colors: ['#36454F', '#1A1A1A', '#6B2C3A', '#C0C0C0'],
    combination: 'Camisa borgoña + pantalón gris carbón + chaqueta negra + plata',
    bestFor: ['acento']
  },
  {
    id: 'casual-premium',
    num: 4,
    name: 'Casual Premium',
    style: 'Minimalista premium',
    colors: ['#2C4A5E', '#36454F', '#FAF7F2', '#8B5A2B'],
    combination: 'Camiseta blanca + pantalón gris + chaqueta azul petróleo',
    bestFor: ['base']
  },
  {
    id: 'tierra-refinada',
    num: 5,
    name: 'Tierra Refinada',
    style: 'Earthy chic',
    colors: ['#C0603A', '#D9C7A8', '#4A3220', '#F5E6D3'],
    combination: 'Polo terracota + chino arena + zapatos chocolate',
    bestFor: ['acento']
  },
  {
    id: 'oficina-moderna',
    num: 6,
    name: 'Oficina Moderna',
    style: 'Business moderno',
    colors: ['#A8C4E0', '#8B8B8B', '#1B2A4A', '#8B5A2B'],
    combination: 'Camisa azul claro + pantalón gris + blazer azul marino',
    bestFor: ['base']
  },
  {
    id: 'smart-casual',
    num: 7,
    name: 'Smart Casual',
    style: 'Smart casual',
    colors: ['#1F6B5A', '#F5E6D3', '#C19A6B', '#4A3220'],
    combination: 'Polo esmeralda + pantalón caqui + chaqueta crema',
    bestFor: ['secundario']
  },
  {
    id: 'verano-estilo',
    num: 8,
    name: 'Verano con Estilo',
    style: 'Resort · relaxed chic',
    colors: ['#6B7B3A', '#FAF7F2', '#D9C7A8', '#8B5A2B'],
    combination: 'Camisa lino blanco + pantalón arena + sobrecamisa salvia',
    bestFor: ['base']
  },
  {
    id: 'tierra-elegante',
    num: 9,
    name: 'Tierra Elegante',
    style: 'Sastrería cálida',
    colors: ['#8B5A2B', '#D9C7A8', '#F5E6D3', '#4A3220'],
    combination: 'Camisa marfil + pantalón beige piedra + blazer tabaco',
    bestFor: ['base']
  },
  {
    id: 'caidos-equilibrados',
    num: 10,
    name: 'Caídos Equilibrados',
    style: 'Casual otoñal',
    colors: ['#6B7B3A', '#8B7D6B', '#C19A6B', '#F5E6D3'],
    combination: 'Sobrecamisa oliva + camiseta crema + chino camel',
    bestFor: ['secundario']
  },
  {
    id: 'salida-nocturna',
    num: 11,
    name: 'Salida Nocturna Tierra',
    style: 'Nocturno tonos tierra',
    colors: ['#4A3220', '#C0603A', '#36454F', '#F5E6D3'],
    combination: 'Sobrecamisa chocolate + camiseta crema + pantalón gris',
    bestFor: ['acento']
  }
];

export const STAR_PALETTES: StarPalette[] = [
  {
    id: 'zafiro',
    name: 'Azul Zafiro & Marino',
    colors: ['#0A1F44', '#1B2A4A', '#FAF7F2', '#C19A6B'],
    description: 'Alto contraste. Elegante y formal.',
    bestFor: 'Oficina, eventos'
  },
  {
    id: 'esmeralda',
    name: 'Verde Esmeralda & Oliva',
    colors: ['#1F6B5A', '#6B7B3A', '#4A3220', '#F5E6D3'],
    description: 'Verdes profundos que iluminan la piel.',
    bestFor: 'Cenas, casual elegante'
  },
  {
    id: 'vino',
    name: 'Vino Tinto & Borgoña',
    colors: ['#722F37', '#6B2C3A', '#8B7D6B', '#36454F'],
    description: 'Rojos profundos con carácter.',
    bestFor: 'Noche, citas'
  }
];

export function assignPalette(
  skinTone: string,
  undertone: string,
  _build: string
): PaletteAssignment {
  // Piel oscura o muy oscura → alto contraste + estrella
  if (skinTone === 'oscura' || skinTone === 'muy-oscura') {
    return {
      main: PALETTES.find((p) => p.id === 'oficina-moderna')!,
      alternatives: [
        PALETTES.find((p) => p.id === 'tierra-refinada')!,
        PALETTES.find((p) => p.id === 'noche-sofisticada')!
      ],
      star: STAR_PALETTES[0]
    };
  }

  // Piel morena cálida → tierra
  if (skinTone === 'morena' && undertone === 'calido') {
    return {
      main: PALETTES.find((p) => p.id === 'tierra-refinada')!,
      alternatives: [
        PALETTES.find((p) => p.id === 'caidos-equilibrados')!,
        PALETTES.find((p) => p.id === 'fresco-moderno')!
      ]
    };
  }

  // Piel morena (fría o neutra) → frescas
  if (skinTone === 'morena') {
    return {
      main: PALETTES.find((p) => p.id === 'fresco-moderno')!,
      alternatives: [
        PALETTES.find((p) => p.id === 'smart-casual')!,
        PALETTES.find((p) => p.id === 'tierra-elegante')!
      ]
    };
  }

  // Piel clara o media → frescas
  return {
    main: PALETTES.find((p) => p.id === 'fresco-moderno')!,
    alternatives: [
      PALETTES.find((p) => p.id === 'verano-estilo')!,
      PALETTES.find((p) => p.id === 'casual-premium')!
    ]
  };
}