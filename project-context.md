# Project Context — MyWebsite2

> AI-agent reference file. Read this before making any code change.

## 1. Overview

Personal portfolio website for **Jordy Bacherot**, built with a **Dune (movie)** visual theme — desert aesthetics, copper/sand/orange palette, custom "Dune Rise" display font, atmospheric effects (sandstorm particles, desert parallax, sandworm trail).

**Live sections:** Hero → Experience → Skills → Projects → Contact

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | React | 19.1 |
| Language | TypeScript | 5.9 |
| Build | Vite | 7.0 |
| Styling | Tailwind CSS | 3.4 |
| Components | shadcn/ui | — |
| Animation | Framer Motion | 12.12 |
| Icons | Lucide React | 0.513 |
| Pkg manager | npm | — |

**No router** — single-page app with anchor-based navigation.

---

## 3. Directory Structure

```
src/
├── App.tsx                 # Root — wraps everything in LanguageProvider → Layout
├── main.tsx                # Entry point
├── index.css               # Tailwind directives + CSS variables + @font-face
├── contexts/
│   └── LanguageContext.tsx  # i18n provider (FR/EN), React Context
├── components/
│   ├── Layout.tsx           # Header (nav, theme/lang toggles), <main>, footer
│   ├── Hero.tsx             # Hero switch by universe (Dune → hero/HeroPoster, Cyberpunk → hero/HeroCyberpunk)
│   ├── hero/                # Animated poster hero: pre-rendered HyperFrames video + synced HTML text (spec 2026-10-01-hero-affiche-animee)
│   ├── Experience.tsx       # Professional journey timeline
│   ├── Skills.tsx           # Tech skills grid
│   ├── Projects.tsx         # Project cards
│   ├── Contact.tsx          # Contact form
│   ├── LanguageToggle.tsx   # FR/EN switcher
│   ├── DuneThemeToggle.tsx  # Dark/light mode toggle
│   ├── SideDecoration.tsx   # Decorative side elements
│   ├── DesertParallax.tsx   # Canvas-based desert parallax background
│   ├── SandstormEffect.tsx  # Canvas-based particle effect
│   └── SandwormTrail.tsx    # SVG sandworm decorative trail
│   └── ui/                 # shadcn/ui primitives (DO NOT edit directly)
│       ├── button.tsx
│       ├── badge.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── separator.tsx
│       └── textarea.tsx
├── lib/
│   └── utils.ts             # cn() utility (clsx + tailwind-merge)
└── assets/
    └── fonts/
        ├── Dune_Rise.ttf
        └── Dune_Rise.otf
```

---

## 4. Design System

### 4.1 Color Palette (HSL CSS variables)

All Dune colors are declared as CSS custom properties in `src/index.css` and consumed via Tailwind classes `text-theme-*`, `bg-theme-*`, `border-theme-*` (arbitrary shadows use `hsl(var(--theme-*)/alpha)`, never hardcoded rgba). Light mode is palette A "parchemin" (2026-10), every text color AA on the background.

| Token | Dark mode | Light mode | Usage |
|-------|----------|------------|-------|
| `--theme-base` | `15 44% 7%` (hero night sky, = `--poster-paper`) | `38 62% 89%` (parchment) | Page and body background |
| `--theme-surface` | `30 30% 87%` (pale sand) | `18 55% 16%` (ink brown, 12:1) | Body text |
| `--theme-primary` | `23 63% 52%` (copper) | `18 60% 36%` (deep copper, 5.5:1) | Headings, accents, nav |
| `--theme-accent` | `37 70% 49%` (amber) | `26 78% 36%` (burnt orange, 4.6:1) | Primary CTA, highlights |
| `--theme-glow` | `38 50% 60%` | `38 66% 70%` | Hover glow states (never as text or under white text in light) |
| `--theme-shadow` | `0 11% 2%` | `35 40% 80%` | Deepest shadows |
| `--theme-ember` | `20 100% 50%` (vivid orange) | `26 78% 36%` (= accent) | Halos of timeline dots, badges, skill bullets |

The hero poster has its own `--poster-*` tokens, aligned with `motion/src/palettes.js`.

### 4.2 Typography

- **Display font:** `font-dune` → `"Dune Rise"` (custom, loaded via `@font-face` with `font-display: swap`)
- **Body font:** system `sans-serif` (Tailwind default)
- Headings use `font-dune tracking-tighter uppercase`

### 4.3 Dark/Light Mode

- Controlled by `class` strategy (`darkMode: ["class"]` in `tailwind.config.js`)
- Toggle managed in `Layout.tsx` via `useState`, persisted in `localStorage`
- Default: **dark mode**

---

## 5. Key Patterns

### 5.1 i18n

- `LanguageContext.tsx` exports `LanguageProvider` and `useLanguage()` hook
- Returns `{ language, setLanguage, t }` where `t` is the full translations object
- Supported languages: `"fr"` (default) and `"en"`
- All user-facing strings accessed via `t.section.key`
- Navigation keys mapped to French section IDs: `profile→profil`, `journey→parcours`, `skills→competences`, `projects→projets`

### 5.2 Lazy Loading

- `Experience`, `Skills`, `Projects`, `Contact`, `SandwormTrail` are `React.lazy()` loaded
- Each wrapped in `<Suspense fallback={<SectionLoader />}>` (spinner)
- Hero eagerly loaded for LCP; heavy canvas effects deferred 100ms

### 5.3 Animations

- **Framer Motion** for entrance animations (`motion.h1`, `motion.div`, `motion.a`)
- Common pattern: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`
- **Dune hero**: pre-rendered video (local `motion/` HyperFrames project, see `motion/CLAUDE.md`) + Framer Motion text synced by `hero/heroTimeline.ts`; Cyberpunk hero effects deferred 100 ms in `hero/HeroCyberpunk.tsx`

### 5.4 Component Conventions

- Functional components, default exports
- Props typed with `interface` when needed (e.g., `LayoutProps`)
- shadcn `cn()` utility for conditional class merging
- `Button` uses `asChild` pattern with `<a>` for nav links

---

## 6. Section IDs (Anchor Navigation)

| Section | HTML `id` |
|---------|-----------|
| Hero | `profil` |
| Experience | `parcours` |
| Skills | `competences` |
| Projects | `projets` |
| Contact | `contact` |

Smooth scroll via `element.scrollIntoView({ behavior: 'smooth' })` in `Layout.tsx` nav.

---

## 7. Build & Dev

```bash
npm run dev       # Vite dev server
npm run build     # Production build
npm run preview   # Preview prod build
npm run lint      # ESLint
npm run test      # Vitest (hero playback state machine, assets, title effect)
```

- Path alias: `@` → `./src` (configured in `vite.config.ts` and `tsconfig.json`)
- `components.json` configures shadcn/ui to use `@/components/ui` and `@/lib/utils`

---

## 8. Rules for AI Agents

1. **Never edit `src/components/ui/`** — these are shadcn/ui managed primitives.
2. **All strings must use the `t` object** from `useLanguage()` — never hardcode user-facing text.
3. **Respect the Dune color palette** — use `theme-*` Tailwind classes or `hsl(var(--theme-*))`, not arbitrary colors.
4. **Keep section IDs in French** — they are anchor targets used by nav and CTAs.
5. **Lazy-load new heavy components** — follow the `React.lazy()` + `Suspense` pattern in `App.tsx`.
6. **Animations use Framer Motion** — prefer `motion.*` components over raw CSS animations for entrance effects.
7. **Dark mode is the default** — test both themes when making visual changes.
8. **Use `cn()` from `@/lib/utils`** for conditional class merging.
