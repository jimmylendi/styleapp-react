/* ============================================================
   TIPOS · StyleApp
   ============================================================ */

export type ColorCategory = 'base' | 'secondary' | 'accent';
export type GarmentCat = 'top' | 'bottom' | 'layer' | 'shoes';
export type BodyBuild = 'delgado' | 'atletico' | 'robusto' | 'grande';
export type SkinTone = 'clara' | 'media' | 'morena' | 'oscura' | 'muy-oscura';
export type Climate = 'frio' | 'templado' | 'calido';
export type OccasionId = 'oficina' | 'casual' | 'templo' | 'noche' | 'elegante';
export type VerdictType = 'green' | 'yellow' | 'red';

export interface ColorMeta {
  cat: ColorCategory;
  hex: string;
}

export interface GarmentType {
  id: string;
  name: string;
  icon: string;
  cat: GarmentCat;
  subtypes: string[];
}

export interface Occasion {
  id: OccasionId;
  name: string;
  emoji: string;
  prefersTops: string[];
  avoidsTops: string[];
  prefersShoes: string[];
  avoidsShoes: string[];
  layerLevel: number;
}

export interface CapsuleItem {
  id: string;
  stage: 1 | 2 | 3;
  type: string;
  name: string;
  color: string;
  icon: string;
  price?: number;
}

export interface Garment {
  id: string;
  type: string;
  cat: GarmentCat;
  colorName: string;
  colorHex: string;
  colorCat: ColorCategory;
  name: string;
  status: 'ok' | 'want-replace';
  addedAt: number;
  price?: number;
  imageUrl?: string;
}

export type HeightUnit = 'metric' | 'imperial';

export interface UserProfile {
  onboarded: boolean;
  name: string;
  height: string;           // siempre en cm
  heightUnit: HeightUnit;   // preferencia de visualización
  build: BodyBuild;
  skin: SkinTone;
  climate: Climate;
}

export interface Outfit {
  top: Garment;
  bottom: Garment;
  shoe: Garment;
  layer: Garment | null;
  score: number;
  key: string;
}

export type FeedbackRating = 'like' | 'neutral' | 'dislike';

export interface UsedOutfit {
  id: string;
  key: string;
  date: number;
  occasion: OccasionId;
  rating?: FeedbackRating;
  imageUrl?: string;
}

export interface BiomechRules {
  preferredFits: string[];
  avoidFits: string[];
  breakVerticality: boolean;
  maxLayers: number;
  palette: string[];
}

export interface PurchaseAnalysis {
  verdict: VerdictType;
  title: string;
  reasons: string[];
  colorName: string;
  typeName: string;
  typeIcon: string;
}