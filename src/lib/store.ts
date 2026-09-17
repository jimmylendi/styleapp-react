/* ============================================================
   STORE · Estado global con Zustand
   ============================================================ */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  UserProfile, Garment, UsedOutfit, OccasionId,
  BodyBuild, SkinTone, Climate, HeightUnit, FeedbackRating, Badge, StylePersonality,
  PackingList
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
  stylePersonality: StylePersonality;

  // App
  theme: 'auto' | 'dark' | 'light';
  occasion: OccasionId;
  garments: Garment[];
  usedOutfits: UsedOutfit[];
  badges: Badge[];
  geminiApiKey: string;

  // Actions
  setProfile: (p: Partial<UserProfile>) => void;
  completeOnboarding: () => void;

  addGarment: (g: Omit<Garment, 'id' | 'addedAt'>) => void;
  removeGarment: (id: string) => void;

  setOccasion: (o: OccasionId) => void;
  useOutfit: (key: string, imageUrl?: string) => void;
  rateOutfit: (id: string, rating: FeedbackRating) => void;
  deleteGarment: (id: string) => void;

  setGeminiApiKey: (key: string) => void;
  toggleTheme: () => void;
  reset: () => void;

  // Helpers
  getProfile: () => UserProfile;

  // Trip
  activeTrip: PackingList | null;
  startTrip: (list: PackingList) => void;
  togglePackedItem: (garmentId: string, category: keyof Omit<PackingList, 'days' | 'climate' | 'totalCombinations'>) => void;
  endTrip: () => void;
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
  usedOutfits: [] as UsedOutfit[],
  badges: [] as Badge[],
  geminiApiKey: '',
  stylePersonality: 'casual' as StylePersonality,
  activeTrip: null as PackingList | null
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

      deleteGarment: (id) => set((s) => ({
        garments: s.garments.filter(g => g.id !== id),
        usedOutfits: s.usedOutfits.filter(u => !u.key.split('-').includes(id))
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

      setGeminiApiKey: (key) => set({ geminiApiKey: key }),

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
          climate: s.climate,
          stylePersonality: s.stylePersonality
        };
      },

      // --- Trip ---
      startTrip: (list) => set({ activeTrip: list }),
      endTrip: () => set({ activeTrip: null }),
      togglePackedItem: (garmentId, category) => set((s) => {
        if (!s.activeTrip) return s;
        const items = s.activeTrip[category].map(i =>
          i.garmentId === garmentId ? { ...i, packed: !i.packed } : i
        );
        return { activeTrip: { ...s.activeTrip, [category]: items } };
      })
    }),
    {
      name: 'styleapp_v19',
      storage: createJSONStorage(() => localStorage)
    }
  )
);