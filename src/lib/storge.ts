/* ============================================================
   STORAGE · Persistencia en localStorage
   ============================================================ */

const KEY = 'styleapp_v16';

export function saveToStorage<T>(data: T): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error guardando:', e);
  }
}

export function loadFromStorage<T>(): Partial<T> | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando:', e);
    return null;
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    console.error('Error limpiando:', e);
  }
}