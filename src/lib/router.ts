/* ============================================================
   ROUTER · Definición de rutas
   ============================================================ */

export type RouteId = 'today' | 'outfits' | 'closet' | 'history' | 'profile' | 'travel' | 'style-dna';

export interface RouteDef {
  id: RouteId;
  label: string;
  icon: string;
  title: string;
}

export const ROUTES: RouteDef[] = [
  { id: 'today', label: 'Hoy', icon: '◐', title: 'Hoy' },
  { id: 'style-dna', label: 'ADN', icon: '🧬', title: 'Mi ADN de Estilo' },
  { id: 'outfits', label: 'Outfits', icon: '◇', title: 'Outfits' },
  { id: 'closet', label: 'Clóset', icon: '◫', title: 'Clóset' },
  { id: 'travel', label: 'Viaje', icon: '🧳', title: 'Viajes' },
  { id: 'history', label: 'Historial', icon: '🗓️', title: 'Historial' },
  { id: 'profile', label: 'Yo', icon: '◉', title: 'Yo' }
];