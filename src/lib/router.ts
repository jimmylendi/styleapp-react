/* ============================================================
   ROUTER · Definición de rutas
   ============================================================ */

export type RouteId = 'today' | 'outfits' | 'closet' | 'profile';

export interface RouteDef {
  id: RouteId;
  label: string;
  icon: string;
  title: string;
}

export const ROUTES: RouteDef[] = [
  { id: 'today',   label: 'Hoy',     icon: '◐', title: 'Hoy' },
  { id: 'outfits', label: 'Outfits', icon: '◇', title: 'Outfits' },
  { id: 'closet',  label: 'Clóset',  icon: '◫', title: 'Clóset' },
  { id: 'profile', label: 'Yo',      icon: '◉', title: 'Yo' }
];