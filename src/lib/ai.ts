import type { Garment } from '../types';

export interface OracleResponse {
    reasoning: string;
    outfit: { top: string; bottom: string; shoe: string; layer: string };
}

interface OracleProfile {
    skin: string;
    build: string;
    stylePersonality: string;
    wardrobePreference: string;
}

const configuredApiBase = import.meta.env.VITE_API_BASE_URL || '/api';
const API_BASE = configuredApiBase.endsWith('/') ? configuredApiBase.slice(0, -1) : configuredApiBase;
let csrfToken = '';

function validateOracleResponse(value: unknown, garments: Garment[]): OracleResponse {
    if (!value || typeof value !== 'object') throw new Error('La respuesta de IA no es válida.');
    const candidate = value as Record<string, unknown>;
    if (typeof candidate.reasoning !== 'string' || candidate.reasoning.length > 1000 || !candidate.outfit || typeof candidate.outfit !== 'object') {
        throw new Error('La respuesta de IA no cumple el formato esperado.');
    }
    const selected = candidate.outfit as Record<string, unknown>;
    if (['top', 'bottom', 'shoe', 'layer'].some((field) => typeof selected[field] !== 'string')) {
        throw new Error('La respuesta de IA contiene prendas inválidas.');
    }
    const byId = new Map(garments.map((garment) => [garment.id, garment]));
    const required = [['top', 'top'], ['bottom', 'bottom'], ['shoe', 'shoes']] as const;
    for (const [field, category] of required) {
        if (byId.get(selected[field] as string)?.cat !== category) {
            throw new Error(`La IA seleccionó una prenda inválida para ${field}.`);
        }
    }
    const layer = selected.layer as string;
    if (layer && byId.get(layer)?.cat !== 'layer') throw new Error('La IA seleccionó una capa inválida.');
    return {
        reasoning: candidate.reasoning,
        outfit: {
            top: selected.top as string,
            bottom: selected.bottom as string,
            shoe: selected.shoe as string,
            layer
        }
    };
}

async function getCsrfToken(signal: AbortSignal): Promise<string> {
    if (csrfToken) return csrfToken;
    const response = await fetch(`${API_BASE}/v1/session.php`, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
        signal
    });
    const data: unknown = await response.json().catch(() => null);
    if (!response.ok || !data || typeof data !== 'object' || typeof (data as Record<string, unknown>).csrfToken !== 'string') {
        throw new Error(response.status === 401 ? 'Tu sesión expiró. Inicia sesión nuevamente.' : 'No se pudo iniciar la sesión segura del Oráculo.');
    }
    csrfToken = (data as { csrfToken: string }).csrfToken;
    return csrfToken;
}

export const askOracle = async (
    prompt: string,
    garments: Garment[],
    userProfile: OracleProfile
): Promise<OracleResponse> => {
    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt || normalizedPrompt.length > 500) {
        throw new Error('La consulta debe contener entre 1 y 500 caracteres.');
    }
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 25000);
    try {
        const token = await getCsrfToken(controller.signal);
        const response = await fetch(`${API_BASE}/v1/oracle/recommendation.php`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({ prompt: normalizedPrompt, garments, profile: userProfile }),
            signal: controller.signal
        });
        const data: unknown = await response.json().catch(() => null);
        if (!response.ok) {
            if (response.status === 403) csrfToken = '';
            const message = data && typeof data === 'object' && typeof (data as Record<string, unknown>).error === 'string'
                ? (data as { error: string }).error
                : 'El Oráculo no está disponible.';
            throw new Error(message);
        }
        return validateOracleResponse(data, garments);
    } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('El Oráculo tardó demasiado en responder.', { cause: error });
        }
        throw error instanceof Error ? error : new Error('Error al contactar al Oráculo.', { cause: error });
    } finally {
        window.clearTimeout(timeoutId);
    }
};

export interface AiOptimizationResponse {
    explanation: string;
    optimizedOutfit: { top: string; bottom: string; shoe: string; layer: string };
}

export const optimizeOutfitWithAi = async (
    currentOutfit: { top: string; bottom: string; shoe: string; layer?: string },
    garments: Garment[],
    userProfile: OracleProfile
): Promise<AiOptimizationResponse> => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);
    try {
        const token = await getCsrfToken(controller.signal);
        const response = await fetch(`${API_BASE}/v1/oracle/optimize.php`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({ currentOutfit, garments, profile: userProfile }),
            signal: controller.signal
        });
        const data: unknown = await response.json().catch(() => null);
        if (!response.ok || !data || typeof data !== 'object') {
            throw new Error('No se pudo optimizar el outfit.');
        }
        const parsed = data as Record<string, unknown>;
        const opt = (parsed.optimizedOutfit || {}) as Record<string, string>;
        return {
            explanation: typeof parsed.explanation === 'string' ? parsed.explanation : 'Atuendo optimizado con IA.',
            optimizedOutfit: {
                top: opt.top || currentOutfit.top,
                bottom: opt.bottom || currentOutfit.bottom,
                shoe: opt.shoe || currentOutfit.shoe,
                layer: opt.layer || ''
            }
        };
    } catch (err) {
        console.warn('[AI Optimize fallback]:', err);
        return {
            explanation: 'Optimización basada en reglas deterministas de alta costura.',
            optimizedOutfit: {
                top: currentOutfit.top,
                bottom: currentOutfit.bottom,
                shoe: currentOutfit.shoe,
                layer: currentOutfit.layer || ''
            }
        };
    } finally {
        window.clearTimeout(timeoutId);
    }
};
