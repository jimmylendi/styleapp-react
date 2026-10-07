/* ============================================================
   STORE · Estado global con Zustand
   ============================================================ */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  UserProfile, Garment, UsedOutfit, OccasionId,
  BodyBuild, SkinTone, Climate, HeightUnit, FeedbackRating, Badge, StylePersonality,
  PackingList, WardrobePreference, AvatarHairStyle, AvatarBeard
} from '../types';
import { STARTER_CAPSULES } from './presets';

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
  wardrobePreference: WardrobePreference;
  avatarHairStyle: AvatarHairStyle;
  avatarHairColor: string;
  avatarBeard: AvatarBeard;

  // App
  theme: 'auto' | 'dark' | 'light';
  occasion: OccasionId;
  garments: Garment[];
  usedOutfits: UsedOutfit[];
  favoriteOutfits: string[];
  badges: Badge[];

  // Actions
  setProfile: (p: Partial<UserProfile>) => void;
  completeOnboarding: () => void;

  addGarment: (g: Omit<Garment, 'id' | 'addedAt'>) => void;
  removeGarment: (id: string) => void;
  updateGarment: (id: string, updates: Partial<Garment>) => void;
  toggleLaundry: (id: string) => void;

  setOccasion: (o: OccasionId) => void;
  useOutfit: (key: string, garmentIds: string[], imageUrl?: string) => void;
  rateOutfit: (id: string, rating: FeedbackRating) => void;
  toggleFavoriteOutfit: (key: string) => void;
  deleteGarment: (id: string) => void;

  loadStarterCapsule: (presetId: string, replaceExisting?: boolean) => void;
  exportWardrobeData: () => string;
  importWardrobeData: (jsonStr: string) => { success: boolean; error?: string };

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
  favoriteOutfits: [] as string[],
  badges: [] as Badge[],
  stylePersonality: 'casual' as StylePersonality,
  wardrobePreference: 'sin-filtro' as WardrobePreference,
  avatarHairStyle: 'corto' as AvatarHairStyle,
  avatarHairColor: '#1A1A1A',
  avatarBeard: 'ninguna' as AvatarBeard,
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

      updateGarment: (id, updates) => set((s) => ({
        garments: s.garments.map(g => g.id === id ? { ...g, ...updates } : g)
      })),

      toggleLaundry: (id) => set((s) => ({
        garments: s.garments.map(g => g.id === id ? { ...g, inLaundry: !g.inLaundry } : g)
      })),

      deleteGarment: (id) => set((s) => ({
        garments: s.garments.filter(g => g.id !== id),
        usedOutfits: s.usedOutfits.filter(u => !u.garmentIds.includes(id))
      })),

      loadStarterCapsule: (presetId, replaceExisting = false) => {
        const preset = STARTER_CAPSULES.find(p => p.id === presetId);
        if (!preset) return;
        const newItems: Garment[] = preset.garments.map(g => ({
          status: g.status || 'ok',
          ...g,
          id: 'g-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          addedAt: Date.now()
        }));
        set((s) => ({
          garments: replaceExisting ? newItems : [...s.garments, ...newItems]
        }));
      },

      exportWardrobeData: () => {
        const state = get();
        const exportObj = {
          version: 3,
          exportedAt: new Date().toISOString(),
          profile: state.getProfile(),
          garments: state.garments,
          usedOutfits: state.usedOutfits,
          occasion: state.occasion,
        };
        return JSON.stringify(exportObj, null, 2);
      },

      importWardrobeData: (jsonStr) => {
        try {
          const parsed = JSON.parse(jsonStr);
          if (!parsed || typeof parsed !== 'object') {
            return { success: false, error: 'El archivo JSON no tiene un formato válido.' };
          }
          if (Array.isArray(parsed.garments)) {
            set((s) => ({
              ...s,
              garments: parsed.garments,
              ...(parsed.profile && { ...parsed.profile }),
              ...(Array.isArray(parsed.usedOutfits) && { usedOutfits: parsed.usedOutfits })
            }));
            return { success: true };
          }
          return { success: false, error: 'El archivo no contiene un catálogo de prendas válido.' };
        } catch {
          return { success: false, error: 'Error al interpretar el archivo JSON.' };
        }
      },

      setOccasion: (o) => set({ occasion: o }),

      useOutfit: (key, garmentIds, imageUrl) => set((s) => ({
        usedOutfits: [...s.usedOutfits, {
          id: 'u-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          key,
          garmentIds,
          date: Date.now(),
          occasion: s.occasion,
          ...(imageUrl && { imageUrl })
        }]
      })),

      rateOutfit: (id, rating) => set((s) => ({
        usedOutfits: s.usedOutfits.map(u => u.id === id ? { ...u, rating } : u)
      })),

      toggleFavoriteOutfit: (key) => set((s) => ({
        favoriteOutfits: s.favoriteOutfits.includes(key)
          ? s.favoriteOutfits.filter(k => k !== key)
          : [...s.favoriteOutfits, key]
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
          climate: s.climate,
          stylePersonality: s.stylePersonality,
          wardrobePreference: s.wardrobePreference || 'sin-filtro',
          avatarHairStyle: s.avatarHairStyle || 'corto',
          avatarHairColor: s.avatarHairColor || '#1A1A1A',
          avatarBeard: s.avatarBeard || 'ninguna'
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
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState: unknown) => {
        const state = persistedState as Partial<StyleState>;
        const garments = state.garments || [];
        const usedOutfits = (state.usedOutfits || []).map((usage) => ({
          ...usage,
          garmentIds: usage.garmentIds && usage.garmentIds.length
            ? usage.garmentIds
            : garments.filter((garment) => usage.key.includes(garment.id)).map((garment) => garment.id)
        }));
        return {
          ...state,
          usedOutfits,
          favoriteOutfits: state.favoriteOutfits || [],
          wardrobePreference: state.wardrobePreference || 'sin-filtro'
        } as StyleState;
      }
    }
  )
);
