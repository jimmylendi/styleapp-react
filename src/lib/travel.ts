import type { Garment } from '../types';


interface PackingMap {
    tops: Garment[];
    bottoms: Garment[];
    shoes: Garment[];
    layers: Garment[];
    totalCombinations: number;
}

export const generatePackingList = (garments: Garment[], days: number, climate: 'calido' | 'frio'): PackingMap => {
    // Use the mathematical model for a Capsule Wardrobe (Golden Ratio Packing)
    // 5-4-3-2-1 rule adapted for N days.
    const tCount = Math.max(3, Math.ceil(days * 0.7)); // Tops
    const bCount = Math.max(2, Math.ceil(days * 0.4)); // Bottoms
    const sCount = Math.max(1, Math.min(3, Math.ceil(days * 0.2))); // Shoes
    const lCount = climate === 'frio' ? Math.max(1, Math.ceil(days * 0.3)) : 0; // Layers

    // Shuffle array function for dynamic lists
    const shuffle = (array: Garment[]) => [...array].sort(() => 0.5 - Math.random());

    // Filter garments based on climate logic (if cold, mostly heavy. if warm, mostly light)
    // Here we'll use a simplified check against the database
    const smartFilter = (cat: string) => {
        return shuffle(garments.filter(g => {
            if (g.cat !== cat) return false;

            // Si es clima frío, omitimos prendas que sepamos que son para la playa, pero como no tenemos peso,
            // dejaremos las validaciones base. Se puede refinar con la IA.
            return true;
        }));
    };

    const tops = smartFilter('top').slice(0, tCount);
    const bottoms = smartFilter('bottom').slice(0, bCount);
    const shoes = smartFilter('shoes').slice(0, sCount);
    const layers = smartFilter('layer').slice(0, lCount);

    // Calculate absolute total possible configurations
    const totalCombinations = tops.length * bottoms.length * shoes.length * (layers.length > 0 ? (layers.length + 1) : 1);

    return {
        tops,
        bottoms,
        shoes,
        layers,
        totalCombinations
    };
};
