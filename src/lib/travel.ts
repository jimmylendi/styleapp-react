import type { Garment, Climate, PackingList } from '../types';

export const generatePackingList = (garments: Garment[], days: number, climate: Climate): PackingList => {
    // 5-4-3-2-1 rule adapted for N days.
    const tCount = Math.max(3, Math.ceil(days * 0.7)); // Tops
    const bCount = Math.max(2, Math.ceil(days * 0.4)); // Bottoms
    const sCount = Math.max(1, Math.min(3, Math.ceil(days * 0.2))); // Shoes
    let lCount = 0;
    if (climate === 'frio') lCount = Math.max(2, Math.ceil(days * 0.4));
    if (climate === 'templado') lCount = Math.max(1, Math.ceil(days * 0.2));

    // Prioritization scoring for highly combinable items
    const scoreGarment = (g: Garment) => {
        let score = 0;
        if (g.colorCat === 'base') score += 10;
        else if (g.colorCat === 'secondary') score += 5;
        // Penailze duplicate types/colors slightly, but for now just prioritize bases
        return score + Math.random(); // Add slight variance so it's not identical every time
    };

    const sortByScore = (list: Garment[]) => [...list].sort((a, b) => scoreGarment(b) - scoreGarment(a));

    const allTops = garments.filter(g => g.cat === 'top');
    const allBottoms = garments.filter(g => g.cat === 'bottom');
    const allShoes = garments.filter(g => g.cat === 'shoes');
    const allLayers = garments.filter(g => g.cat === 'layer');

    const selectedTops = sortByScore(allTops).slice(0, tCount);
    const selectedBottoms = sortByScore(allBottoms).slice(0, bCount);
    const selectedShoes = sortByScore(allShoes).slice(0, sCount);
    const selectedLayers = sortByScore(allLayers).slice(0, lCount);

    // Calculate absolute total possible configurations
    const totalCombinations = selectedTops.length * selectedBottoms.length * selectedShoes.length * (selectedLayers.length > 0 ? (selectedLayers.length + 1) : 1);

    const toPackingItem = (g: Garment[]) => g.map(garment => ({ garmentId: garment.id, packed: false }));

    return {
        days,
        climate,
        tops: toPackingItem(selectedTops),
        bottoms: toPackingItem(selectedBottoms),
        shoes: toPackingItem(selectedShoes),
        layers: toPackingItem(selectedLayers),
        totalCombinations
    };
};
