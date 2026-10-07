/* ============================================================
   ROUTER · Definición de rutas con Iconos Vectoriales
   ============================================================ */

import React from 'react';
import {
  IconToday,
  IconDna,
  IconOutfits,
  IconCloset,
  IconTravel,
  IconHistory,
  IconProfile
} from '../components/Icons';

export type RouteId = 'today' | 'outfits' | 'closet' | 'history' | 'profile' | 'travel' | 'style-dna';

export interface RouteDef {
  id: RouteId;
  label: string;
  icon: React.ReactNode;
  title: string;
}

export const ROUTES: RouteDef[] = [
  { id: 'today', label: 'Hoy', icon: <IconToday size={19} />, title: 'Hoy' },
  { id: 'style-dna', label: 'ADN', icon: <IconDna size={19} />, title: 'Mi ADN de Estilo' },
  { id: 'outfits', label: 'Outfits', icon: <IconOutfits size={19} />, title: 'Outfits' },
  { id: 'closet', label: 'Clóset', icon: <IconCloset size={19} />, title: 'Clóset' },
  { id: 'travel', label: 'Viaje', icon: <IconTravel size={19} />, title: 'Viajes' },
  { id: 'history', label: 'Historial', icon: <IconHistory size={19} />, title: 'Historial' },
  { id: 'profile', label: 'Yo', icon: <IconProfile size={19} />, title: 'Yo' }
];
