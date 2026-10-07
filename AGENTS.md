# AGENTS.md — StyleApp Agent & System Architecture Guide

## 1. Project Overview & Identity
- **Name**: StyleApp
- **Domain**: Smart Capsule Wardrobe & Biomechanical Personal Stylist with Generative AI
- **Core Philosophy**: Local-first, privacy-respecting capsule wardrobe manager that maximizes outfit versatility, eliminates decision fatigue, and promotes conscious fashion.
- **Language**: Spanish (UI copy, error messages, and styling recommendations).

---

## 2. Technical Stack & Runtime Environment
- **Runtime**: Node.js 22 (Linux x64 container)
- **Port**: `3000` (Binding: `0.0.0.0`)
- **Backend**: Express 5 full-stack entry (`server.ts`) serving API endpoints and mounting Vite middlewares in development.
- **Frontend**: React 19 SPA, TypeScript, Vite 8, Zustand (v5) with `persist` middleware, Recharts, `html-to-image`.
- **CSS / Styling**: Modern CSS Variables design system (`Plus Jakarta Sans` + Editorial Serif typography), responsive desktop sidebar and mobile bottom tabbar.
- **AI Engine**: `@google/genai` TypeScript SDK (server-side only, model: `gemini-3.8-flash`), structured JSON outputs with automated deterministic stylist fallback.
- **Weather Service**: Open-Meteo REST API via browser geolocation (privacy-sanitized coordinates).

---

## 3. Directory Structure
```
/
├── AGENTS.md              # Agent architecture and development conventions
├── MEMORY.md              # Living memory, decision log, and roadmap tracking
├── index.html             # HTML entry point with meta tags and Google Fonts
├── metadata.json          # AI Studio capabilities and app descriptors
├── package.json           # Dependencies and scripts (dev: "tsx server.ts")
├── server.ts              # Full-stack Express backend with Gemini API proxy
├── vite.config.ts         # Vite bundler configuration & PWA manifest
├── src/
│   ├── main.tsx           # React root mounting
│   ├── App.tsx            # Navigation shell and route controller
│   ├── components/
│   │   └── Icons.tsx      # Unified SVG vector icon library (zero-dependency)
│   ├── types/index.ts     # Core domain types (Garment, Outfit, Profile, etc.)
│   ├── styles/global.css  # Design system tokens, editorial typography & glassmorphism
│   ├── features/
│   │   ├── today/         # Daily view, live weather, Gemini Oracle & ShareCard
│   │   ├── outfits/       # Algorithmic outfits generator with 24h cooldown & favorites
│   │   ├── closet/        # Inventory management, photo preview & Purge Mode
│   │   ├── style-dna/     # Seasonal colorimetry & biomechanical rules
│   │   ├── travel/        # Smart packing list calculator & interactive checklist
│   │   ├── history/       # Wear frequency, CPW metrics & analytics
│   │   ├── profile/       # Antropometric profile, theme & JSON data export/import
│   │   ├── purchase/      # Smart purchase compatibility analyzer
│   │   └── onboarding/    # Interactive user onboarding with capsule presets
│   └── lib/
│       ├── ai.ts          # Client API bridge to /api/v1/oracle
│       ├── store.ts       # Zustand store with migrations & local persistence
│       ├── engine.ts      # Biomechanical outfit generation & color harmony algorithms
│       ├── capsule.ts     # Closet health metrics & orphan item detection
│       ├── weather.ts     # Geolocation & weather fetcher with privacy sanitization
│       ├── palettes.ts    # Skin tone palettes and chromatic harmonies
│       ├── data.ts        # Occasions, categories, and preset color catalogs
│       ├── presets.ts     # Ready-to-use starter capsule wardrobe presets
│       └── router.tsx     # Route definitions with vector icon components
```

---

## 4. Development & Contribution Conventions for Agents
1. **Full-Stack Execution**: Dev server is driven by `npm run dev` (`tsx server.ts`), which runs Express on port `3000` and proxies frontend requests via Vite. Never mount Express inside `vite.config.ts`.
2. **AI & Gemini Security**:
   - Gemini API calls MUST remain strictly server-side in `server.ts`. Never import `@google/genai` on the client.
   - Always validate model output and enforce garment ID membership against the user's provided closet.
   - Always preserve the deterministic fallback stylist generator to guarantee zero downtime even when offline or unconfigured.
3. **Local-First Reliability**: User data persists in `localStorage` through Zustand. Any state schema change must increment the store version in `src/lib/store.ts` and define a backwards-compatible `migrate` function.
4. **Editorial Fashion UI & Icon Standards**:
   - High-contrast editorial typography (Playfair Display for headlines + Plus Jakarta Sans for body).
   - Zero-Pill & Metadata Discipline: Render metadata as clean, unboxed text separated by typographic dots (`·`).
   - SVG Vector Icons: Always use components from `src/components/Icons.tsx` instead of unpredictable OS emojis.
   - Touch Ergonomics: Ensure interactive elements have hit areas of $\ge 44\text{px}$ on touch devices.
5. **Styling & Color Harmony Engine (`src/lib/engine.ts`)**:
   - Outfits are scored deterministically via:
     - The Golden Ratio (60% Base / 30% Secondary / 10% Accent)
     - Color Sandwich Rule: Harmonizing shoe/layer tones with top garments
     - Monochromatic Elegance & Texture Harmony
     - Bioclimatic Temperature Adjustments (penalizing inappropriate thermal weights)
     - Rotation Bonus to reduce decision fatigue and wear frequency monotony
   - Favorite outfits persist in state under `favoriteOutfits` by composite key.
6. **Facial Colorimetry & Skin-Tone Intelligence**:
   - Tops and Layers near the face must be prioritized with high chromatic affinity (+4 bonus) for the user's skin tone (e.g., for *piel morena*: warm earth tones like Terracota, Camel, Tabaco, Verde Oliva, Crema, and Chocolate).
   - Colors that wash out or dull facial tone are penalized (-3).
   - Outfits reflect an explicit colorimetry justification in `styleNote` or `colorimetryNote` so the user clearly sees how their skin tone drove the outfit selection.
   - The AI Oracle in `server.ts` explicitly enforces skin-tone colorimetry in its system instructions.
