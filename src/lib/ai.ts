import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Garment } from '../types';

export const askOracle = async (prompt: string, garments: Garment[]) => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) throw new Error('No se encontró la llave de Gemini AI (VITE_GEMINI_API_KEY).');

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const minimalGarments = garments.map(g => ({
        id: g.id,
        name: g.name,
        type: g.type,
        color: g.colorName
    }));

    const systemInstruction = `
    Eres un oráculo estilista personal experto de élite respondiendo a una app móvil.
    El usuario te dirá cómo se siente, a dónde va o el clima, y tú debes armar un Outfit (cápsula temporal) usando ÚNICAMENTE las prendas disponibles en su clóset.
    
    CLÓSET DISPONIBLE (JSON):
    ${JSON.stringify(minimalGarments)}
    
    INSTRUCCIÓN DEL USUARIO:
    "${prompt}"
    
    REGLAS:
    - Solo usa IDs del clóset disponible.
    - RESPUESTA OBLIGATORIA: Debes devolver ÚNICAMENTE un objeto JSON puro (sin formato markdown ni \`\`\`json) con las 4 llaves exactas ("top", "bottom", "shoe", "layer").
    - "layer" puede ser un string vacío "" si el clima es caluroso o el usuario no necesita chamarra.
    Ejemplo exacto de tu respuesta:
    {"top":"id_21", "bottom":"id_31", "shoe":"id_83", "layer":""}
    `;

    try {
        const result = await model.generateContent(systemInstruction);
        const response = result.response;
        const textResponse = response.text();

        // Sanitize raw text to force JSON format in case the AI wraps it in markdown despite instructions
        const cleanJSON = textResponse.replace(/^```json/g, '').replace(/```$/g, '').trim();

        const outfitRaw = JSON.parse(cleanJSON);
        return outfitRaw;
    } catch (e) {
        console.error("AI Error:", e);
        throw new Error('La inteligencia artificial no pudo procesar tu solicitud. Intenta con un texto más claro.');
    }
};
