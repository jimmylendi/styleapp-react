# MEMORY.md — StyleApp Living Memory & Project State

## 1. Project Identity & Status
- **App Name**: StyleApp
- **Current Version**: v21.0 (Full-Stack Express + React 19 + Gemini 3.8 Flash + Modern Vector Icons)
- **Status**: Active development — Visual Styling Polish, Vector Icon System & Algorithmic Styling Sprint

---

## 2. Key Decisions & Architectural Milestones
- **[Decision 01] Node.js & Express API Migration**: Migrated legacy PHP 5.6 / Oracle 11g backend files to a unified TypeScript Express entry point (`server.ts`) running on port 3000.
- **[Decision 02] Modern Gemini SDK Adoption**: Integrated `@google/genai` TypeScript SDK with model `gemini-3.8-flash` on the server with structured JSON schema outputs and automatic fallback response generation.
- **[Decision 03] Local-First Architecture**: User profile, wardrobe, and outfit history are maintained locally using Zustand with localStorage persistence.
- **[Decision 04] Editorial Fashion Aesthetic**: Upgraded visual language with Playfair Display + Plus Jakarta Sans, anti-slop zero-pill discipline, tactile touch targets, and elegant glassmorphism.
- **[Decision 05] Unified Vector Icon Library**: Built standalone, high-performance SVG vector icon components in `src/components/Icons.tsx` replacing inconsistent OS emojis.
- **[Decision 06] Advanced Color Harmony & Bioclimatic Engine**: Enhanced `src/lib/engine.ts` with Color Sandwich Rule, 60/30/10 ratio, thermal climate checks, and rotation wear scoring.
- **[Decision 07] Facial Colorimetry & Piel Morena Earth Tone Affinity**: Prioritized tops and layers near the face for high chromatic synergy with skin tones (specifically warm earth tones like Terracota, Camel, Verde Oliva, Crema, Tabaco, and Chocolate for *piel morena*), with explicit UI colorimetry feedback and Gemini prompt guidance.

---

## 3. Active Roadmap & Improvement Tasks
- [x] Initial GitHub migration to Node.js / Vite full-stack environment.
- [x] **Security Hardening**:
  - [x] Remove permissive regex CSRF fallback in `server.ts` and enforce strict session token matching.
  - [x] Add sliding window Rate Limiting for `/api/v1/oracle/` and session endpoints.
  - [x] Bound in-memory usage logs (`apiUsageLogs`) with a fixed ring buffer (max 200 items) to prevent memory leaks.
  - [x] Sanitize coordinates in `weather.ts` (round to 2 decimal places) for location privacy.
  - [x] Prompt injection hardening: Separate system instructions and user prompt delimitations.
- [x] **Vector Icon System & UI Styling Modernization (Sprint v21.0)**:
  - [x] Create comprehensive SVG Icon system in `src/components/Icons.tsx` (navigation, categories, actions, weather, states).
  - [x] Convert `src/lib/router.ts` to `src/lib/router.tsx` to cleanly support typed React vector icon components.
  - [x] Modernize `Today.tsx` with vector icons, high-fidelity Flat-Lay cards, and clean unboxed metadata.
  - [x] Modernize `Outfits.tsx` with vector icons, favorites toggle, laundry filter, and refined score indicators.
  - [x] Modernize `Closet.tsx` with vector tab icons, capsule health indicators, and polished preset previews.
  - [x] Refine `src/styles/global.css` with 60-30-10 palette tokens, editorial typography, zero-pill metadata, and $\ge 44\text{px}$ touch zones.
- [x] **Advanced Styling Engine & Wardrobe Versatility Logic**:
  - [x] **Color Sandwich Rule ("Regla del Sándwich de Color")**: Award styling points when top & shoes or layer share tonal harmony with contrasting bottoms.
  - [x] **Real-time Bioclimatic Weighting**: Dynamically adjust scores based on temperature and climate (favouring breathable items in warm weather, thermal layers/boots in cold weather).
  - [x] **Wear Rotation Bonus**: Favor garments with low recent usage to break wardrobe monotony and maximize capsule versatility.
  - [x] **Explanatory Styling Notes**: Provide smart fashion insight labels ("Sándwich cromático", "Equilibrio 60/30/10", "Monocromático tonal", "Bioclimático").
- [x] **Facial Colorimetry & Skin-Tone Intelligence (Piel Morena & Tonos Tierra)**:
  - [x] Synchronized `SKIN_COLOR_DNA` and `SKIN_PALETTES` in `personality.ts` and `data.ts` to include warm earth tones (Terracota, Camel, Tabaco, Verde Oliva, Crema, Chocolate) for *piel morena*.
  - [x] Implemented Facial Colorimetry weighting in `engine.ts`: high affinity bonus (+5 para Terracota, +4 para tonos tierra) para prendas superiores y capas cercanas al rostro.
  - [x] Added explicit colorimetry tag in Outfit cards (`styleNote`: "Terracota: ilumina y resalta tu piel morena" / "Tonos tierra cálidos: armonía perfecta con piel morena").
  - [x] Enforced skin-tone facial colorimetry in `server.ts` Gemini Oracle system prompt and offline fallback.
  - [x] **StyleDNA Earth Palette Analyzer (`analyzeSkinAndSuggestEarthPalette`)**: Created specialized biomechanical analyzer in `src/lib/earthPalette.ts` with interactive skin tone picker, HEX code copying, capsule outfit formulas, and detailed facial refracción diagnosis.
- [x] **Virtual Avatar Mannequin & Fitting Room 3D (`AvatarMannequin.tsx`)**:
  - [x] Created high-fidelity volumetric 3D mannequin in `src/components/AvatarMannequin.tsx` with cylindrical shaders, ambient occlusion, and studio spotlighting reflecting user's skin tone (piel morena `#8E5B37` with warm glow, etc.), body build, hair style, hair color, and facial beard.
  - [x] **Model Overshirt Tailoring ("Sobrecamisa de Modelo de Pasarela")**: Re-architected overshirt and outer layer rendering based on the user's fashion model guide ("Guía visual para hombre alto, atlético y piel morena"):
    - Structured shirt collar with crisp lapels framing the neck and shoulders (`cuello camisero estructurado`).
    - Signature dual chest utility flap pockets with pointed tabs and horn buttons (`bolsillos utilitarios con solapa y botones de cuerno`).
    - Open front drape displaying inner polo/shirt, belt with metal buckle, and front plackets with tailored stitching and buttons.
    - Full-length tailored sleeves with elbow fold creases and structured buttoned cuffs at the wrist.
    - Specialized tailored lapels (Notch Lapel) and folded white pocket square (`pañuelo de bolsillo`) when the layer is a blazer.
    - Ambient occlusion drop shadows projected from the overshirt panels onto the inner garment for realistic 3D depth.
    - High-fashion model sunglasses toggle (`🕶️ Gafas`) with polarized lenses and runway glare reflection.
  - [x] **Interactive 3D Stage & Gyro**: Touch/pointer drag to rotate in real 3D perspective (`perspective(1000px)` with `rotateY` & `rotateX`), camera presets (`Frontal`, `3/4 Pasarela`, `Perfil`), and animated continuous 360° orbital spin.
  - [x] **Atelier 3D Finish & Lighting Moods**: Toggle between Realistic Avatar and Sculptural Haute Couture Mannequin, plus 3 studio lighting atmospheres (Atelier Blanco, Golden Hour / Tierra Cálida, Cyber Editorial).
  - [x] **Showroom 3D Pedestal**: Multi-layered floating showroom platform with metallic beveled edge, ambient occlusion contact shadow, and garment glow reflection.
  - [x] **Piece Inspection**: Click on any garment (top, layer, bottom, shoe) to highlight in 3D and inspect facial proximity, skin tone compatibility, and styling notes.
  - [x] Integrated in `Today.tsx`, `Outfits.tsx` (dynamic 3/4 runway pose), `StyleDNA.tsx`, and `Profile.tsx`.
- [x] **3D Avatar Customizer & Virtual Try-On Studio (`AvatarCustomizer.tsx`)**:
  - [x] Created `src/components/AvatarCustomizer.tsx` with dual mode: **Rasgos Físicos** (fototipo cutáneo, complexión biomecánica, estatura con range slider, silueta masculina/femenina/unisex, corte de cabello, paleta de colores capilares, barba) y **Probador de Outfits**.
  - [x] Integrated all **11 Master Looks from the User's Guide** ("Guía visual para hombre alto, atlético y de piel morena"):
    1. *Elegante Clásico* (Camisa blanca + pantalón camel + blazer azul marino + zapatos coñac)
    2. *Fresco Moderno* (Polo oliva + chino beige + sobrecamisa marrón + mocasines)
    3. *Noche Sofisticada* (Camisa borgoña + pantalón gris carbón + chaqueta negra + accesorios)
    4. *Casual Premium* (Camiseta blanca + pantalón gris + chaqueta azul petróleo + tenis blancos)
    5. *Tierra Refinada* (Polo terracota + chino arena + zapatos chocolate + camiseta marfil)
    6. *Oficina Moderna* (Camisa azul claro + pantalón gris + blazer azul marino + zapatos coñac)
    7. *Smart Casual* (Polo esmeralda + pantalón caqui + chaqueta crema + mocasines café)
    8. *Verano con Estilo* (Camisa lino blanco + pantalón arena + sobrecamisa salvia + mocasines tabaco)
    9. *Tierra Elegante* (Camisa marfil + pantalón beige piedra + blazer tabaco + zapatos chocolate)
    10. *Caídos Equilibrados* (Sobrecamisa oliva + camiseta crema + chino camel + botines topo)
    11. *Salida Nocturna Tierra* (Sobrecamisa chocolate + camiseta crema + pantalón gris carbón + mocasines)
  - [x] Persistent profile saving with instant visual feedback via `setProfile` into Zustand store.
  - [x] Embedded in `StyleDNA.tsx`, `Profile.tsx` (con vista rápida o estudio completo), y en `Today.tsx` con acceso rápido desde el probador diario.
  - [x] Unit test coverage in `src/components/AvatarCustomizer.test.tsx` and `src/components/AvatarMannequin.test.tsx` (12 passing tests total).
- [x] **Super Intelligence Architecture (Sprint v22.0 — "App Super Inteligente")**:
  - [x] **Motor Biomecánico & Outfit IQ (`src/lib/smartStylist.ts`)**:
    - Cálculo de Outfit IQ (0-100) desglosado en 4 pilares: Afinidad Facial (30%), Sincronía Cromática (25%), Silueta 60/30/10 (25%) y Balance Bioclimático (20%).
    - Clasificación por rangos editoriales: *Editorial* (92-100), *Distinguido* (82-91), *Correcto* (72-81), *Mejorable* (<72).
    - Veredicto y tips de estilismo biomecánico automáticos.
  - [x] **Auto-Optimizador con IA ("⚡ Optimizar con IA")**:
    - Algoritmo que evalúa todas las permutaciones del armario para sugerir la sustitución o adición de una sola prenda que eleve el outfit al 95%+.
    - Integrado en el avatar 3D (`AvatarMannequin`), el probador virtual (`AvatarCustomizer`) y la vista diaria (`Today.tsx`).
  - [x] **HUD Holográfico de Outfit IQ en Avatar 3D (`AvatarMannequin.tsx`)**:
    - Chip flotante en tiempo real con indicador luminoso y score de Outfit IQ.
    - Modal holográfico interactivo con 4 mini-radares, veredicto de pasarela y botón de auto-optimización inmediata.
  - [x] **Auditoría Inteligente de Clóset & Detector de Prenda Puente (`Closet.tsx`)**:
    - Prenda Puente Estrella: identifica qué pieza clave hipotética (p. ej., Sobrecamisa Marrón Tabaco) desbloquea más de 10+ nuevos outfits y aumenta la versatilidad del armario.
    - Plan de Rescate de Prendas Huérfanas con recetas de combinación para prendas con baja conectividad cromática.
  - [x] **Simulador de Compra Inteligente con Avatar 3D (`PurchaseSheet.tsx`)**:
    - Simulación visual de la prenda que se desea comprar modelada en el avatar 3D junto a prendas reales del clóset.
    - Métricas predictivas de ROI: nuevos outfits generados, Outfit IQ medio y porcentaje de afinidad dérmica facial.
  - [x] **Servidor Gemini Expandido (`server.ts` & `src/lib/ai.ts`)**:
    - Nuevos endpoints `/api/v1/oracle/optimize` (y `.php`) con Gemini 3.8 Flash y fallback determinista instantáneo.
    - Reglas reforzadas de colorimetría dérmica para piel morena y proporciones atléticas.
  - [x] Suite de pruebas expandida a 16 tests unitarios pasando y 0 errores de ESLint.

- [x] **Documento Base & Contexto del Proyecto Integration (Sprint v23.0)**:
  - [x] **Cápsula Fundamental Athletic Tall (12 Piezas Base)** agregada como preset #1 oficial en `src/lib/presets.ts`.
  - [x] **Modelo Cromático 60-30-10** formalizado: 60% Neutros Base (Azul marino, crema, blanco roto, gris carbón, beige piedra, camel), 30% Secundarios (Verde oliva, chocolate, tabaco, azul petróleo), 10% Acentos (Terracota, borgoña, verde esmeralda, rosa empolvado).
  - [x] **4 Filtros de Validación Automática para la API (`validateDocumentoBaseFilters`)** implementados en `src/lib/smartStylist.ts` y visualizados en tiempo real en `PurchaseSheet.tsx`:
    1. Estatura ~6'6" (1.98 m) y tallas Tall/Long/Athletic Tall.
    2. Tejidos transpirables para clima cálido/tropical (lino mezclado, algodón medio, piqué, seersucker, sin forro pesado).
    3. Paleta de alto contraste 60-30-10 para piel morena.
    4. Regla de versatilidad 3:1 (mínimo 3 opciones de enlace con el armario existente).
  - [x] **Manifiesto Oficial en Style DNA (`StyleDNA.tsx`)**: Sección editorial dedicada que expone los principios rectores, las directrices de sastrería física (hombro exacto, manga mitad bíceps, tiro medio/alto athletic taper, blazer cubriendo el asiento) y la fórmula estándar ($\text{Dos neutros} + \text{Un color con personalidad} + \text{Calzado limpio}$).
  - [x] **Directivas del Oráculo Gemini (`server.ts`)** calibradas estrictamente con el Documento Base.
  - [x] 17 tests unitarios pasando y 0 errores de ESLint.

---

## 4. Known Technical Notes
- Dev server runs via `tsx server.ts` on `0.0.0.0:3000`.
- Vitest unit tests cover `smartStylist.test.ts`, `engine.test.ts`, `capsule.test.ts`, `earthPalette.test.ts`, `AvatarCustomizer.test.tsx`, and `AvatarMannequin.test.tsx` (17 passing tests).
- Store name in localStorage: `styleapp_v19`. Schema version: 2.
- Vector icons are in `src/components/Icons.tsx`. Route definitions are in `src/lib/router.tsx`.
