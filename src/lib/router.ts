/* ============================================================
   ROUTER · Definición de rutas
   ============================================================ */

export type RouteId = 'today' | 'outfits' | 'closet' | 'history' | 'profile' | 'travel';

export interface RouteDef {
  id: RouteId;
  label: string;
  icon: string;
  title: string;
}

export const ROUTES: RouteDef[] = [
  { id: 'today', label: 'Hoy', icon: '◐', title: 'Hoy' },
  { id: 'travel', label: 'Viaje', icon: '🧳', title: 'Viajes' },
  { id: 'outfits', label: 'Outfits', icon: '◇', title: 'Outfits' },
  { id: 'closet', label: 'Clóset', icon: '◫', title: 'Clóset' },
  { id: 'history', label: 'Historial', icon: '🗓️', title: 'Historial' },
  { id: 'profile', label: 'Yo', icon: '◉', title: 'Yo' }
];