/* ============================================================
   STORE · Estado global con Zustand
   ============================================================ */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  UserProfile, Garment, UsedOutfit, OccasionId,
  BodyBuild, SkinTone, Climate, HeightUnit, FeedbackRating
} from '../types';
interface StyleState {
  // Onboarding
  onboarded: boolean;
  name: string;
  height: string;
  heightUnit: HeightUnit;
  build: BodyBuild;
  skin: SkinTone;
  climate: Climate;

  // App
  theme: 'auto' | 'dark' | 'light';
  occasion: OccasionId;
  garments: Garment[];
  usedOutfits: UsedOutfit[];

  // Actions
  setProfile: (p: Partial<UserProfile>) => void;
  completeOnboarding: () => void;

  addGarment: (g: Omit<Garment, 'id' | 'addedAt'>) => void;
  removeGarment: (id: string) => void;

  setOccasion: (o: OccasionId) => void;
  useOutfit: (key: string, imageUrl?: string) => void;
  rateOutfit: (id: string, rating: FeedbackRating) => void;

  toggleTheme: () => void;
  reset: () => void;

  // Helpers
  getProfile: () => UserProfile;
}

const initial = {
  onboarded: false,
  name: '',
  height: '195',
  heightUnit: 'metric' as HeightUnit,  // ← NUEVO
  build: 'atletico' as BodyBuild,
  skin: 'morena' as SkinTone,
  climate: 'calido' as Climate,
  theme: 'dark' as const,
  occasion: 'oficina' as OccasionId,
  garments: [] as Garment[],
  usedOutfits: [] as UsedOutfit[]
};

export const useStore = create<StyleState>()(
  persist(
    (set, get) => ({
      ...initial,

      setProfile: (p) => set((s) => ({ ...s, ...p })),

      completeOnboarding: () => set({ onboarded: true }),

      addGarment: (g) => set((s) => ({
        garments: [
          ...s.garments,
          {
            ...g,
            id: 'g-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
            addedAt: Date.now()
          }
        ]
      })),

      removeGarment: (id) => set((s) => ({
        garments: s.garments.filter(g => g.id !== id)
      })),

      setOccasion: (o) => set({ occasion: o }),

      useOutfit: (key, imageUrl) => set((s) => ({
        usedOutfits: [...s.usedOutfits, {
          id: 'u-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          key,
          date: Date.now(),
          occasion: s.occasion,
          ...(imageUrl && { imageUrl })
        }]
      })),

      rateOutfit: (id, rating) => set((s) => ({
        usedOutfits: s.usedOutfits.map(u => u.id === id ? { ...u, rating } : u)
      })),

      toggleTheme: () => set((s) => {
        const order: Array<'auto' | 'dark' | 'light'> = ['auto', 'dark', 'light'];
        const next = order[(order.indexOf(s.theme) + 1) % 3];
        return { theme: next };
      }),

      reset: () => set({ ...initial, onboarded: false }),

      getProfile: () => {
        const s = get();
        return {
          onboarded: s.onboarded,
          name: s.name,
          height: s.height,
          heightUnit: s.heightUnit,
          build: s.build,
          skin: s.skin,
          climate: s.climate
        };
      }
    }),
    {
      name: 'styleapp_v16',
      storage: createJSONStorage(() => localStorage)
    }
  )
);