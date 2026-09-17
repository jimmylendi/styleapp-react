/* ============================================================
   PERSONALITY · Arquetipos de estilo y ADN completo
   ============================================================ */

import type { StylePersonality, BodyBuild, SkinTone } from '../types';

export interface PersonalityDef {
    id: StylePersonality;
    icon: string;
    name: string;
    tagline: string;
    desc: string;
    colors: string[];          // colores hex ilustrativos
    prefersTypes: string[];    // ids de tipo de prenda favoritos
    prefersOccasions: string[];
    tips: string[];
}

export const PERSONALITIES: Record<StylePersonality, PersonalityDef> = {
    clasico: {
        id: 'clasico',
        icon: '🎩',
        name: 'Clásico',
        tagline: 'Atemporal y refinado',
        desc: 'Tu estilo es elegante y sobrio. Prefieres prendas de calidad que nunca pasan de moda.',
        colors: ['#1A1A2E', '#2E3A59', '#8B7355', '#C8B89A', '#F5F0E8'],
        prefersTypes: ['camisa', 'polo', 'pantalon-dress', 'oxford'],
        prefersOccasions: ['oficina', 'elegante'],
        tips: [
            'Prioriza colores neutros: navy, gris, beige y blanco.',
            'Invierte en básicos de alta calidad sobre tendencias.'
        ]
    },
    casual: {
        id: 'casual',
        icon: '👕',
        name: 'Casual',
        tagline: 'Cómodo y auténtico',
        desc: 'Practicidad sin sacrificar el estilo. Te sientes mejor cuando puedes moverte con libertad.',
        colors: ['#4A90D9', '#7EC8A4', '#F5A623', '#E8E8E8', '#2C2C2C'],
        prefersTypes: ['tshirt', 'polo', 'jeans', 'sneakers'],
        prefersOccasions: ['casual', 'templo'],
        tips: [
            'La regla del 80/20: 80% básicos neutros, 20% piezas con carácter.',
            'Un buen par de sneakers blancos eleva cualquier look casual.'
        ]
    },
    urbano: {
        id: 'urbano',
        icon: '🏙️',
        name: 'Urbano',
        tagline: 'Streetwear & contemporáneo',
        desc: 'Mezcla streetwear con piezas modernas. Estás al día con lo que pasa en las calles.',
        colors: ['#1C1C1C', '#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4'],
        prefersTypes: ['hoodie', 'bomber', 'jogger', 'sneakers'],
        prefersOccasions: ['casual', 'noche'],
        tips: [
            'Combina piezas oversized con ajustadas para equilibrio visual.',
            'Los colores contrastantes son tu carta de presentación.'
        ]
    },
    artistico: {
        id: 'artistico',
        icon: '🎨',
        name: 'Artístico',
        tagline: 'Vanguardista y expresivo',
        desc: 'La ropa es tu lienzo. Disfrutas mezclar texturas, patrones y colores inesperados.',
        colors: ['#8B4513', '#DAA520', '#800080', '#DC143C', '#228B22'],
        prefersTypes: ['blazer', 'tshirt', 'pantalon', 'boots'],
        prefersOccasions: ['casual', 'noche', 'elegante'],
        tips: [
            'Rompe la regla de un máximo de 3 colores con propósito.',
            'Una pieza statement domina; el resto debe ser más neutro.'
        ]
    },
    minimalista: {
        id: 'minimalista',
        icon: '◻️',
        name: 'Minimalista',
        tagline: 'Menos es más',
        desc: 'Claridad y funcionalidad. Cada prenda tiene su propósito y nada sobra en tu clóset.',
        colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#9E9E9E', '#212121'],
        prefersTypes: ['tshirt', 'polo', 'pantalon', 'sneakers'],
        prefersOccasions: ['oficina', 'casual'],
        tips: [
            'La cápsula de 10 piezas: domina 10 básicos que combinan entre sí.',
            'Invierte en calidad de tela — la textura habla cuando el color calla.'
        ]
    },
    elegante: {
        id: 'elegante',
        icon: '✨',
        name: 'Elegante',
        tagline: 'Sofisticado en todo momento',
        desc: 'Cada salida es una oportunidad de causar impresión. Prefieres looks pulidos y estructurados.',
        colors: ['#1A0A00', '#2C1810', '#8B6914', '#C5A028', '#F0E6D3'],
        prefersTypes: ['camisa', 'blazer', 'pantalon-dress', 'oxford', 'chelsea'],
        prefersOccasions: ['elegante', 'noche', 'oficina'],
        tips: [
            'El fit es rey: una prenda simple bien ajustada supera a cualquier diseño.',
            'El detalle hace la diferencia: hebilla, reloj, bolsillo.'
        ]
    }
};

/* ── Body type advice ── */
export interface BodyDNA {
    icon: string;
    name: string;
    favorable: string[];
    avoid: string[];
}

export const BODY_DNA: Record<BodyBuild, BodyDNA> = {
    delgado: {
        icon: '📏',
        name: 'Delgado',
        favorable: [
            'Capas y estructuras que añaden volumen',
            'Patrones horizontales y bloques de color',
            'Camisas con texturas (cuadros, rayas)',
            'Pantalones slim o regular'
        ],
        avoid: [
            'Ropa excesivamente holgada (pierde la silueta)',
            'Colores oscuros monocromáticos de pies a cabeza',
            'Telas muy ligeras sin estructura'
        ]
    },
    atletico: {
        icon: '💪',
        name: 'Atlético',
        favorable: [
            'Cortes regular o athletic fit',
            'Polos y camisetas que marquen el torso',
            'Chinos y pantalones con algo de elastán',
            'Capas ligeras tipo bomber'
        ],
        avoid: [
            'Cortes muy slim que restringen el movimiento',
            'Hombros caídos o ropa sin estructura'
        ]
    },
    robusto: {
        icon: '🤝',
        name: 'Robusto',
        favorable: [
            'Colores oscuros y elementos verticales',
            'Camisas con botones (camufla el torso)',
            'Pantalones con caída recta',
            'Blazers estructurados'
        ],
        avoid: [
            'Patrones grandes o rayas horizontales',
            'Camisetas de cuello redondo ajustadas',
            'Bolsillos en el pecho que añaden volumen'
        ]
    },
    grande: {
        icon: '🛡️',
        name: 'Grande',
        favorable: [
            'Líneas verticales (rayas finas, botones)',
            'Colores base oscuros como protagonistas',
            'Telas con caída natural (no rígidas)',
            'Monocromáticos base a base'
        ],
        avoid: [
            'Estampados muy grandes o llamativos',
            'Prendas muy ajustadas o muy holgadas',
            'Múltiples colores vivos simultáneos'
        ]
    }
};

/* ── Skin color advice ── */
export interface SkinColorDNA {
    name: string;
    powerColors: string[];  // colores que siempre funcionan
    avoidColors: string[];  // colores que apagan el tono
    avoidHex: string[];
    powerHex: string[];
}

export const SKIN_COLOR_DNA: Record<SkinTone, SkinColorDNA> = {
    clara: {
        name: 'Piel clara',
        powerColors: ['Navy', 'Borgoña', 'Verde oscuro', 'Gris carbón', 'Mostaza'],
        avoidColors: ['Blanco puro (funde con la piel)', 'Beige claro', 'Nude'],
        powerHex: ['#1A2744', '#722F37', '#2D5016', '#3C3C3C', '#B8860B'],
        avoidHex: ['#FAFAFA', '#F5F0E8', '#D4B896']
    },
    media: {
        name: 'Piel media',
        powerColors: ['Terracota', 'Verde olivo', 'Azul petróleo', 'Coral', 'Dorado'],
        avoidColors: ['Beige oscuro (confunde)', 'Café mostaza sin contraste'],
        powerHex: ['#C45C26', '#6B6B35', '#1E6B7B', '#E8735A', '#C8A84B'],
        avoidHex: ['#C4A882', '#A0784A']
    },
    morena: {
        name: 'Piel morena',
        powerColors: ['Blanco, Crema', 'Cobalt', 'Naranja vibrante', 'Rosa fuerte', 'Verde esmeralda'],
        avoidColors: ['Café oscuro sin contraste', 'Gris muy oscuro', 'Marrón apagado'],
        powerHex: ['#FFFEF0', '#0047AB', '#FF5733', '#FF1493', '#00A550'],
        avoidHex: ['#3B2314', '#2C2C2C', '#6B4423']
    },
    oscura: {
        name: 'Piel oscura',
        powerColors: ['Blanco brillante', 'Amarillo vibrante', 'Rojo vivo', 'Morado royal', 'Dorado'],
        avoidColors: ['Negro puro (pierde contraste)', 'Navy muy oscuro', 'Gris oscuro'],
        powerHex: ['#FFFFFF', '#FFD700', '#CC0000', '#6A0DAD', '#DAA520'],
        avoidHex: ['#000000', '#0A0E3D', '#1A1A1A']
    },
    'muy-oscura': {
        name: 'Piel muy oscura',
        powerColors: ['Blanco, Crema', 'Colores neón controlados', 'Rojo fuerte', 'Amarillo dorado', 'Verde lima'],
        avoidColors: ['Paletas de tierra muy oscuras', 'Negro total'],
        powerHex: ['#FFFFF0', '#FF6EFF', '#FF0000', '#FFB300', '#BFFF00'],
        avoidHex: ['#3D2B1F', '#1A1A1A']
    }
};

/* ── getStyleDNA ── */
export interface StyleDNA {
    personality: PersonalityDef;
    body: BodyDNA;
    skin: SkinColorDNA;
}

export function getStyleDNA(
    stylePersonality: StylePersonality,
    build: BodyBuild,
    skin: SkinTone
): StyleDNA {
    return {
        personality: PERSONALITIES[stylePersonality],
        body: BODY_DNA[build],
        skin: SKIN_COLOR_DNA[skin]
    };
}
