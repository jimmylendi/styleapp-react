/* ============================================================
   CAPSULE · Utilidades del clóset cápsula de 20 prendas
   ============================================================ */

import { CAPSULE_IDEAL, STAGE_INFO } from './data';
import { matchCapsule } from './engine';
import type { Garment, CapsuleItem } from '../types';

export { CAPSULE_IDEAL, STAGE_INFO, matchCapsule };
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

/** Overall capsule completion + per-stage breakdown */
export function getCapsuleProgress(garments: Garment[]): CapsuleProgress {
    const matches = matchCapsule(garments, CAPSULE_IDEAL);

    const stages: StageProgress[] = ([1, 2, 3] as const).map((stage) => {
        const stageItems = CAPSULE_IDEAL.filter((c) => c.stage === stage);
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
        total: CAPSULE_IDEAL.length,
        owned: totalOwned,
        percent: Math.round((totalOwned / CAPSULE_IDEAL.length) * 100),
        stages
    };
}

/** Next capsule item to buy (first missing, in stage order) */
export function getNextPurchase(garments: Garment[]): CapsuleItem | null {
    const matches = matchCapsule(garments, CAPSULE_IDEAL);
    const missing = matches.find((m) => m.status === 'missing');
    return missing ? missing.ideal : null;
}
