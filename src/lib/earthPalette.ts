/* ============================================================
   EARTH PALETTE · Analizador de tono de piel & paleta tierra optimizada
   Colorimetría facial biomecánica y optimización de tierras cálidas
   ============================================================ */

import type { SkinTone } from '../types';

export interface EarthColorSwatch {
  id: string;
  name: string;
  hex: string;
  role: 'Acento facial principal' | 'Base neutra cálida' | 'Secundario de transición' | 'Luz y contraste';
  facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)' | 'Parte media / inferior (Pantalón)' | 'Capa o calzado';
  contrastLevel: 'Alto' | 'Medio' | 'Suave';
  harmonyReason: string;
}

export interface CapsuleFormulaPiece {
  category: 'Top' | 'Layer' | 'Bottom' | 'Shoes';
  garmentName: string;
  colorName: string;
  colorHex: string;
  roleDescription: string;
}

export interface EarthPaletteAnalysis {
  skinTone: SkinTone;
  skinName: string;
  melaninCategory: string;
  recommendedUndertone: 'Cálido dorado' | 'Neutro cálido' | 'Cálido profundo' | 'Contraste frío-cálido' | 'Alto contraste';
  scientificRationale: string;
  affinityScore: number; // 0-100
  heroColor: EarthColorSwatch;
  earthSwatches: EarthColorSwatch[];
  formulaOutfit: CapsuleFormulaPiece[];
  avoidColors: { name: string; hex: string; reason: string }[];
  proTips: string[];
}

export function analyzeSkinAndSuggestEarthPalette(
  skinTone: SkinTone | string
): EarthPaletteAnalysis {
  const normalizedTone: SkinTone = ['clara', 'media', 'morena', 'oscura', 'muy-oscura'].includes(skinTone as SkinTone)
    ? (skinTone as SkinTone)
    : 'morena';

  switch (normalizedTone) {
    case 'morena':
      return {
        skinTone: 'morena',
        skinName: 'Piel Morena (Subtono Cálido / Dorado)',
        melaninCategory: 'Fototipo IV-V · Rica en feomelanina y eumelanina dorada',
        recommendedUndertone: 'Cálido dorado',
        affinityScore: 98,
        scientificRationale:
          'Tu tez morena posee un matiz subyacente cálido y ámbar. Los colores de tierra ricos en óxidos de hierro —particularmente el Terracota (#C0603A), el Tabaco y el Camel dorado— refractan luz cálida directamente sobre la mandíbula y pómulos, realzando el brillo natural de tu rostro sin competir con él. Evitan el efecto "lavado" que provocan los grises y pasteles fríos.',
        heroColor: {
          id: 'terracota-master',
          name: 'Terracota Óxido',
          hex: '#C0603A',
          role: 'Acento facial principal',
          facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
          contrastLevel: 'Alto',
          harmonyReason: 'Máxima afinidad cromática: sus pigmentos cobrizos complementan los subtonos ámbar de la piel morena.'
        },
        earthSwatches: [
          {
            id: 'terracota',
            name: 'Terracota Cálido',
            hex: '#C0603A',
            role: 'Acento facial principal',
            facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
            contrastLevel: 'Alto',
            harmonyReason: 'Polo o camiseta statement: eleva la vitalidad y calidez del rostro al instante.'
          },
          {
            id: 'camel-dorado',
            name: 'Camel Dorado',
            hex: '#C19A6B',
            role: 'Secundario de transición',
            facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
            contrastLevel: 'Medio',
            harmonyReason: 'Aporta un puente tonal suave entre tu color de piel y colores base más oscuros.'
          },
          {
            id: 'verde-oliva',
            name: 'Verde Oliva Profundo',
            hex: '#6B7B3A',
            role: 'Acento facial principal',
            facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
            contrastLevel: 'Medio',
            harmonyReason: 'El verde de matiz cálido contrarresta rojeces y magnifica la luminosidad dorada de la piel.'
          },
          {
            id: 'tabaco',
            name: 'Tabaco Envejecido',
            hex: '#8B5A2B',
            role: 'Base neutra cálida',
            facialProximity: 'Capa o calzado',
            contrastLevel: 'Medio',
            harmonyReason: 'Ideal para sobrecamisas, cazadoras o mocasines que estructuran el conjunto.'
          },
          {
            id: 'chocolate',
            name: 'Chocolate Amargo',
            hex: '#4A3220',
            role: 'Base neutra cálida',
            facialProximity: 'Parte media / inferior (Pantalón)',
            contrastLevel: 'Alto',
            harmonyReason: 'Ancla el look con solidez cromática sin la frialdad dura del negro artificial.'
          },
          {
            id: 'crema-tostada',
            name: 'Crema Tostada',
            hex: '#F5E6D3',
            role: 'Luz y contraste',
            facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
            contrastLevel: 'Alto',
            harmonyReason: 'Genera un punto de luz radiante en camisetas o lino que resalta la tez sin el deslumbramiento clínico del blanco puro.'
          }
        ],
        formulaOutfit: [
          {
            category: 'Top',
            garmentName: 'Polo piqué o camiseta de algodón peinado',
            colorName: 'Terracota Cálido',
            colorHex: '#C0603A',
            roleDescription: 'Enmarca el rostro aportando brillo cobrizo y vitalidad inmediata.'
          },
          {
            category: 'Layer',
            garmentName: 'Sobrecamisa de sarga o cárdigan estructurado',
            colorName: 'Verde Oliva Profundo',
            colorHex: '#6B7B3A',
            roleDescription: 'Añade profundidad orgánica y contraste complementario con el terracota.'
          },
          {
            category: 'Bottom',
            garmentName: 'Pantalón chino regular o recto',
            colorName: 'Camel Dorado',
            colorHex: '#C19A6B',
            roleDescription: 'Mantiene la línea cromática en equilibrio térmico y elegancia sobria.'
          },
          {
            category: 'Shoes',
            garmentName: 'Mocasines o botines de ante / piel lisa',
            colorName: 'Chocolate Amargo',
            colorHex: '#4A3220',
            roleDescription: 'Sella el sándwich de color con una base terrosa robusta y elegante.'
          }
        ],
        avoidColors: [
          {
            name: 'Gris cenizo apagado',
            hex: '#8C8C8C',
            reason: 'Absorbe la luz y hace que la piel morena parezca pálida o cansada.'
          },
          {
            name: 'Café plano sin matiz cálido',
            hex: '#5A4A42',
            reason: 'Se confunde con el tono dérmico sin crear contraste ni luz.'
          },
          {
            name: 'Pasteles lavados o hielo',
            hex: '#DCE5E7',
            reason: 'Desaturan el tono de la piel y crean un efecto calcáreo.'
          }
        ],
        proTips: [
          'Aplica siempre la "Regla del Cuello": Mantén el Terracota o la Crema Tostada a menos de 10 cm de tu rostro.',
          'Técnica Sandwich de Tierra: Si usas polo terracota, calza zapatos en chocolate o tabaco para cerrar la silueta.',
          'El verde oliva actúa como neutro camaleónico: combina tanto con camel como con denim marino índigo.'
        ]
      };

    case 'media':
      return {
        skinTone: 'media',
        skinName: 'Piel Media / Trigueña',
        melaninCategory: 'Fototipo III-IV · Subtono neutro-cálido equilibrado',
        recommendedUndertone: 'Neutro cálido',
        affinityScore: 94,
        scientificRationale:
          'La piel media responde con gran versatilidad a las tierras medias como el verde oliva, el ocre dorado y el terracota suave. Crean un contraste gradual que define los rasgos faciales sin sobrecargar.',
        heroColor: {
          id: 'oliva-master',
          name: 'Verde Oliva Satinado',
          hex: '#6B7B3A',
          role: 'Acento facial principal',
          facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
          contrastLevel: 'Medio',
          harmonyReason: 'Armoniza con el tono trigueño y potencia la mirada sin saturar.'
        },
        earthSwatches: [
          {
            id: 'oliva-med',
            name: 'Verde Oliva',
            hex: '#6B7B3A',
            role: 'Acento facial principal',
            facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
            contrastLevel: 'Medio',
            harmonyReason: 'Ilumina los matices olivas y bronceados de la piel media.'
          },
          {
            id: 'terracota-suave',
            name: 'Terracota Tostado',
            hex: '#C0603A',
            role: 'Acento facial principal',
            facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
            contrastLevel: 'Alto',
            harmonyReason: 'Añade energía y tono saludable al rostro.'
          },
          {
            id: 'arena-piedra',
            name: 'Beige Piedra',
            hex: '#D9C7A8',
            role: 'Base neutra cálida',
            facialProximity: 'Parte media / inferior (Pantalón)',
            contrastLevel: 'Medio',
            harmonyReason: 'Base atemporal para chinos y pantalones sastre.'
          },
          {
            id: 'chocolate-medio',
            name: 'Chocolate Madera',
            hex: '#4A3220',
            role: 'Base neutra cálida',
            facialProximity: 'Capa o calzado',
            contrastLevel: 'Alto',
            harmonyReason: 'Sustituto sofisticado del negro.'
          },
          {
            id: 'marfil-calido',
            name: 'Marfil Suave',
            hex: '#FAF7F2',
            role: 'Luz y contraste',
            facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
            contrastLevel: 'Alto',
            harmonyReason: 'Luz limpia y contraste sutil cerca de la barbilla.'
          }
        ],
        formulaOutfit: [
          {
            category: 'Top',
            garmentName: 'Camisa lino marfil o camiseta suave',
            colorName: 'Marfil Suave',
            colorHex: '#FAF7F2',
            roleDescription: 'Luminosidad directa hacia el rostro.'
          },
          {
            category: 'Layer',
            garmentName: 'Sobrecamisa verde oliva',
            colorName: 'Verde Oliva',
            colorHex: '#6B7B3A',
            roleDescription: 'Marco de color que resalta la tez media.'
          },
          {
            category: 'Bottom',
            garmentName: 'Chino terracota o tabaco',
            colorName: 'Terracota Tostado',
            colorHex: '#C0603A',
            roleDescription: 'Acento terroso balanceado en la silueta.'
          },
          {
            category: 'Shoes',
            garmentName: 'Mocasines café moka',
            colorName: 'Chocolate Madera',
            colorHex: '#4A3220',
            roleDescription: 'Punto de apoyo visual elegante.'
          }
        ],
        avoidColors: [
          {
            name: 'Beige amarillento plano',
            hex: '#C4A882',
            reason: 'Se mimetiza con la piel desvaneciendo los límites de tu silueta.'
          },
          {
            name: 'Mostaza verdoso descolorido',
            hex: '#9A8E42',
            reason: 'Aporta sensación de palidez.'
          }
        ],
        proTips: [
          'Usa capas intermedias en verde oliva o camel para crear transiciones suaves.',
          'Los accesorios de cuero cálido (coñac o marrón tabaco) redondean la paleta.'
        ]
      };

    case 'clara':
      return {
        skinTone: 'clara',
        skinName: 'Piel Clara / Marfil',
        melaninCategory: 'Fototipo I-II · Subtono rosado o porcelana',
        recommendedUndertone: 'Contraste frío-cálido',
        affinityScore: 89,
        scientificRationale:
          'En pieles claras, los tonos tierra requieren mayor profundidad o contraste nítido (como el chocolate amargo o el tabaco profundo) para evitar que la tez parezca pálida. El terracota funciona de forma excepcional como acento vivo sobre bases neutras.',
        heroColor: {
          id: 'chocolate-profundo',
          name: 'Chocolate Profundo',
          hex: '#3D2817',
          role: 'Base neutra cálida',
          facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
          contrastLevel: 'Alto',
          harmonyReason: 'Crea el contraste nítido que la piel clara necesita para destacar sus facciones.'
        },
        earthSwatches: [
          {
            id: 'terracota-intenso',
            name: 'Terracota Teja',
            hex: '#B8532F',
            role: 'Acento facial principal',
            facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
            contrastLevel: 'Alto',
            harmonyReason: 'Aporta calidez instantánea a las pieles de porcelana o subtono frío.'
          },
          {
            id: 'chocolate-clara',
            name: 'Chocolate Amargo',
            hex: '#4A3220',
            role: 'Base neutra cálida',
            facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
            contrastLevel: 'Alto',
            harmonyReason: 'Contraste elegante que enmarca los ojos y cabello.'
          },
          {
            id: 'oliva-bosque',
            name: 'Oliva Bosque',
            hex: '#55632E',
            role: 'Secundario de transición',
            facialProximity: 'Capa o calzado',
            contrastLevel: 'Medio',
            harmonyReason: 'Verde terroso que suaviza los contrastes muy drásticos.'
          },
          {
            id: 'crema-suave',
            name: 'Blanco Roto Marfil',
            hex: '#FAF7F2',
            role: 'Luz y contraste',
            facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
            contrastLevel: 'Suave',
            harmonyReason: 'Alternativa cálida al blanco óptico.'
          }
        ],
        formulaOutfit: [
          {
            category: 'Top',
            garmentName: 'Polo o jersey terracota teja',
            colorName: 'Terracota Teja',
            colorHex: '#B8532F',
            roleDescription: 'Inyección de calidez que aviva la tez.'
          },
          {
            category: 'Layer',
            garmentName: 'Blazer o sobrecamisa chocolate amargo',
            colorName: 'Chocolate Amargo',
            colorHex: '#4A3220',
            roleDescription: 'Estructura con alto contraste.'
          },
          {
            category: 'Bottom',
            garmentName: 'Pantalón marfil o beige arena',
            colorName: 'Blanco Roto Marfil',
            colorHex: '#FAF7F2',
            roleDescription: 'Luminosidad balanceada.'
          },
          {
            category: 'Shoes',
            garmentName: 'Derby coñac o botines topo',
            colorName: 'Chocolate Amargo',
            colorHex: '#4A3220',
            roleDescription: 'Cierre equilibrado y sofisticado.'
          }
        ],
        avoidColors: [
          {
            name: 'Nude o beige rosado idéntico a la piel',
            hex: '#F0D5B8',
            reason: 'Provoca efecto "desnudo" desvaído sin contraste facial.'
          },
          {
            name: 'Marrón amarillento pálido',
            hex: '#D4B896',
            reason: 'Apaga el subtono natural.'
          }
        ],
        proTips: [
          'Evita tierras demasiado claras junto al rostro; prioriza terracotas saturados o chocolates oscuros.',
          'Combina tus tierras cálidas con toques de azul marino para un look clásico impecable.'
        ]
      };

    case 'oscura':
    case 'muy-oscura':
      return {
        skinTone: normalizedTone,
        skinName: normalizedTone === 'muy-oscura' ? 'Piel Muy Oscura / Ébano' : 'Piel Oscura / Ébano Cálido',
        melaninCategory: 'Fototipo V-VI · Alta concentración de eumelanina profunda',
        recommendedUndertone: 'Alto contraste',
        affinityScore: 96,
        scientificRationale:
          'Las pieles oscuras y muy oscuras poseen un lienzo majestuoso donde los tonos tierra luminosos y cálidos (como el Camel dorado, la Crema tostada y el Terracota cobrizo brillante) generan un contraste escultural de altísimo impacto estético.',
        heroColor: {
          id: 'camel-luz',
          name: 'Camel Brillante / Ocre',
          hex: '#D4A36A',
          role: 'Luz y contraste',
          facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
          contrastLevel: 'Alto',
          harmonyReason: 'Máxima luminosidad dorada que resalta los contornos faciales.'
        },
        earthSwatches: [
          {
            id: 'terracota-vibrante',
            name: 'Terracota Óxido Vivo',
            hex: '#C0603A',
            role: 'Acento facial principal',
            facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
            contrastLevel: 'Alto',
            harmonyReason: 'Destaca con calidez y nobleza contra la tez profunda.'
          },
          {
            id: 'camel-dorado-osc',
            name: 'Camel Cálido Intenso',
            hex: '#C19A6B',
            role: 'Luz y contraste',
            facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
            contrastLevel: 'Alto',
            harmonyReason: 'Genera una separación visual nítida y magnética.'
          },
          {
            id: 'crema-luz',
            name: 'Crema Marfil',
            hex: '#F5E6D3',
            role: 'Luz y contraste',
            facialProximity: 'Próximo al rostro (Top / Cuello / Solapa)',
            contrastLevel: 'Alto',
            harmonyReason: 'Brillo limpio que maximiza el contraste facial.'
          },
          {
            id: 'verde-oliva-dorado',
            name: 'Verde Oliva Dorado',
            hex: '#6B7B3A',
            role: 'Secundario de transición',
            facialProximity: 'Capa o calzado',
            contrastLevel: 'Medio',
            harmonyReason: 'Aporta matices de joyería terrosa.'
          }
        ],
        formulaOutfit: [
          {
            category: 'Top',
            garmentName: 'Camisa o polo camel brillante',
            colorName: 'Camel Cálido Intenso',
            colorHex: '#C19A6B',
            roleDescription: 'Contraste luminoso supremo junto al rostro.'
          },
          {
            category: 'Layer',
            garmentName: 'Sobrecamisa terracota óxido vivo',
            colorName: 'Terracota Óxido Vivo',
            colorHex: '#C0603A',
            roleDescription: 'Intensidad cálida que proyecta presencia.'
          },
          {
            category: 'Bottom',
            garmentName: 'Pantalón crema tostada o marfil',
            colorName: 'Crema Marfil',
            colorHex: '#F5E6D3',
            roleDescription: 'Línea de luz inferior limpia.'
          },
          {
            category: 'Shoes',
            garmentName: 'Mocasines o botines tabaco',
            colorName: 'Tabaco Envejecido',
            colorHex: '#8B5A2B',
            roleDescription: 'Suelo cálido sofisticado.'
          }
        ],
        avoidColors: [
          {
            name: 'Marrón oscuro apagado de bajo contraste',
            hex: '#3D2B1F',
            reason: 'Se confunde con el tono de piel sin aportar contraste ni vivacidad.'
          },
          {
            name: 'Negro monocromático plano',
            hex: '#1A1A1A',
            reason: 'Pierde la riqueza de los detalles y la tridimensionalidad.'
          }
        ],
        proTips: [
          'Aprovecha el alto contraste: las tierras claras y doradas (camel, crema, terracota vibrante) son tus mayores aliadas.',
          'Combina acabados con textura (lino, punto gofrado, ante) para multiplicar el juego de luces.'
        ]
      };
  }
}
