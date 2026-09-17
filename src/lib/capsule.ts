/* ============================================================
   CAPSULE · Utilidades del clóset cápsula de 20 prendas
   ============================================================ */

import { COLORS, STAGE_INFO } from './data';
import { matchCapsule } from './engine';
import type { Garment, CapsuleItem } from '../types';
import type { PaletteAssignment } from './palettes';

export { STAGE_INFO, matchCapsule };
export type { CapsuleItem };

export interface StageProgress {
    stage: 1 | 2 | 3;
    name: string;
    desc: string;
    total: number;
    owned: number;
    percent: number;
    items: CapsuleItem[];
}

export interface CapsuleProgress {
    total: number;
    owned: number;
    percent: number;
    stages: StageProgress[];
}

/** 
 * Genera la cápsula de 20 prendas dinámicamente inyectando
 * los colores de la paleta asignada del usuario. 
 */
export function getDynamicCapsule(palette: PaletteAssignment): CapsuleItem[] {
    const mainCols = palette.main.colors;

    // Función helper para encontrar el nombre del color por HEX en COLORS db
    const findColorName = (hex: string, fallback: string) => {
        const found = Object.entries(COLORS).find(([_, meta]) => meta.hex.toUpperCase() === hex.toUpperCase());
        return found ? found[0] : fallback;
    };

    // mainCols = [base_fuerte, base_clara, acento1, acento2]  (Usualmente)
    const cSolid = findColorName(mainCols[0], 'Azul Marino'); // ej. Marino, Petroleo, Negro
    const cLight = findColorName(mainCols[1], 'Blanco Roto'); // ej. Blanco, Crema, Gris Claro
    const cAcc1 = findColorName(mainCols[2], 'Verde Oliva');
    const cAcc2 = findColorName(mainCols[3] || mainCols[0], 'Camel');

    return [
        { id: 'c1', stage: 1, type: 'camiseta', name: `Camiseta ${cLight.toLowerCase()}`, color: cLight, icon: '👕', price: 20 },
        { id: 'c2', stage: 1, type: 'camiseta', name: `Camiseta ${cAcc1.toLowerCase()}`, color: cAcc1, icon: '👕', price: 20 },
        { id: 'c3', stage: 1, type: 'polo', name: `Polo ${cSolid.toLowerCase()}`, color: cSolid, icon: '👔', price: 35 },
        { id: 'c4', stage: 1, type: 'polo', name: `Polo ${cAcc2.toLowerCase()}`, color: cAcc2, icon: '👔', price: 35 },
        { id: 'c5', stage: 1, type: 'pantalon', name: `Chino ${cAcc1.toLowerCase()}`, color: cAcc1, icon: '👖', price: 45 },
        { id: 'c6', stage: 1, type: 'pantalon', name: `Chino ${cLight.toLowerCase()}`, color: cLight, icon: '👖', price: 45 },
        { id: 'c7', stage: 1, type: 'pantalon', name: `Pantalón ${cSolid.toLowerCase()}`, color: cSolid, icon: '👖', price: 50 },
        { id: 'c8', stage: 1, type: 'tenis', name: `Tenis ${cLight.toLowerCase()}`, color: cLight, icon: '👟', price: 70 },
        { id: 'c9', stage: 2, type: 'camisa', name: `Camisa ${cLight.toLowerCase()}`, color: cLight, icon: '👔', price: 60 },
        { id: 'c10', stage: 2, type: 'camisa', name: `Camisa ${cSolid.toLowerCase()}`, color: cSolid, icon: '👔', price: 60 },
        { id: 'c11', stage: 2, type: 'pantalon', name: `Pantalón de vestir ${cAcc2.toLowerCase()}`, color: cAcc2, icon: '👖', price: 55 },
        { id: 'c12', stage: 2, type: 'blazer', name: `Blazer ${cSolid.toLowerCase()}`, color: cSolid, icon: '🧥', price: 120 },
        { id: 'c13', stage: 2, type: 'mocasines', name: `Mocasines zapatos`, color: cAcc2, icon: '👞', price: 90 },
        { id: 'c14', stage: 2, type: 'derby', name: `Derby zapatos`, color: cSolid, icon: '👞', price: 100 },
        { id: 'c15', stage: 3, type: 'polo', name: `Polo ${cAcc1.toLowerCase()}`, color: cAcc1, icon: '👔', price: 35 },
        { id: 'c16', stage: 3, type: 'sobrecamisa', name: `Sobrecamisa ${cAcc2.toLowerCase()}`, color: cAcc2, icon: '🧥', price: 65 },
        { id: 'c17', stage: 3, type: 'sobrecamisa', name: `Sobrecamisa ${cSolid.toLowerCase()}`, color: cSolid, icon: '🧥', price: 65 },
        { id: 'c18', stage: 3, type: 'pantalon', name: `Chino ${cAcc1.toLowerCase()}`, color: cAcc1, icon: '👖', price: 45 },
        { id: 'c19', stage: 3, type: 'camisa', name: `Camisa casual ${cLight.toLowerCase()}`, color: cLight, icon: '👔', price: 80 },
        { id: 'c20', stage: 3, type: 'botines', name: `Botines resistentes`, color: cAcc1, icon: '🥾', price: 110 }
    ];
}

/** Overall capsule completion + per-stage breakdown */
export function getCapsuleProgress(garments: Garment[], capsuleIdeal: CapsuleItem[]): CapsuleProgress {
    const matches = matchCapsule(garments, capsuleIdeal);

    const stages: StageProgress[] = ([1, 2, 3] as const).map((stage) => {
        const stageItems = capsuleIdeal.filter((c) => c.stage === stage);
        const stageMatches = matches.filter((m) => m.ideal.stage === stage);
        const owned = stageMatches.filter((m) => m.status !== 'missing').length;

        return {
            stage,
            name: STAGE_INFO[stage].name,
            desc: STAGE_INFO[stage].desc,
            total: stageItems.length,
            owned,
            percent: stageItems.length ? Math.round((owned / stageItems.length) * 100) : 0,
            items: stageItems
        };
    });

    const totalOwned = matches.filter((m) => m.status !== 'missing').length;

    return {
        total: capsuleIdeal.length,
        owned: totalOwned,
        percent: Math.round((totalOwned / capsuleIdeal.length) * 100),
        stages
    };
}

/** Next capsule item to buy (first missing, in stage order) */
export function getNextPurchase(garments: Garment[], capsuleIdeal: CapsuleItem[]): CapsuleItem | null {
    const matches = matchCapsule(garments, capsuleIdeal);
    const missing = matches.find((m) => m.status === 'missing');
    return missing ? missing.ideal : null;
}
