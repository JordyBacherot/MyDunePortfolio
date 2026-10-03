# Hero cinématique « Arrivée sur Arrakis » — Design

**Date :** 2026-07-12
**Statut :** remplacé le 2026-10-01 par `2026-10-01-hero-affiche-animee-design.md` (motion design 2D)
**Portée :** univers Dune uniquement, section Hero uniquement

## 1. Objectif

Remplacer le fond animé actuel du Hero (canvas `DesertParallax` + `SandstormEffect`) par une vidéo cinématique générée via le MCP Higgsfield : Arrakis vue de l'espace → plongée à travers un voile de sable → un Fremen marchant sur les dunes, un ver des sables passant à l'arrière-plan. La vidéo se joue une fois au chargement puis laisse place à un fond fixe haute qualité avec un micro-effet de parallax au scroll.

## 2. Décisions actées

| Sujet | Décision |
|---|---|
| Rôle de la vidéo | Intro cinématique jouée une fois, puis état de repos fixe |
| État de repos | **Approche A** : cross-fade (~0,5 s) vers une image AVIF/WebP haute qualité de la scène finale |
| Séquence | 2 plans chaînés (~5 s chacun), raccord invisible sur un « voile de sable » quasi uniforme |
| Effets Dune actuels | Retirés du Hero ; composants conservés dans le repo, relogement décidé plus tard (hors périmètre) |
| Univers Cyberpunk | Inchangé (`NightCityParallax` + `CyberRainEffect`) |
| Texte / CTA | Affichés immédiatement par-dessus la vidéo (LCP préservé, pattern actuel conservé) |
| Mobile | Même vidéo en `object-cover` (recadrage central) ; plan B si décevant : vidéo verticale 9:16 dédiée |
| Micro-effet scroll | Léger scale/translation Framer Motion sur l'image finale en quittant le Hero |
| Rejeu | La vidéo rejoue à chaque rechargement de page (simple ; limitable par session plus tard) |
| Génération | Via MCP Higgsfield, abonnement Starter (270 crédits/mois) — valider les 3 images clés (~2 crédits pièce) AVANT de générer les vidéos (~18 crédits pièce) |

## 3. Assets à produire

Générés via MCP Higgsfield, commités dans `src/assets/hero/`. Aucune dépendance runtime à Higgsfield.

| Asset | Contenu | Usage |
|---|---|---|
| `img-space` | Arrakis vue de l'espace, palette sombre/cuivre | Frame de départ du plan 1 + poster de la vidéo |
| `img-veil` | Voile de sable orangé quasi uniforme, sans détail identifiable | Frame de fin du plan 1 ET de départ du plan 2 (raccord invisible) |
| `img-fremen` | Fremen marchant (petit, proche du centre), ver au fond, tiers supérieur sombre et calme | Frame de fin du plan 2 + fond permanent + fallback reduced-motion/erreur |
| `video-1` | img-space → img-veil, ~5 s | Plongée depuis l'espace |
| `video-2` | img-veil → img-fremen, ~5 s | Révélation de la scène |

**Post-production (hors ligne, ffmpeg) :**
- Concaténation des 2 clips en un seul fichier, raccord sur le voile
- Export `hero-arrakis.webm` (VP9/AV1) + `hero-arrakis.mp4` (H.264, fallback Safari), **cible ≤ 3 Mo**, sans piste audio
- Image finale exportée en AVIF + WebP (~200 Ko), poster en AVIF + WebP

**Contraintes de composition (dans les prompts de génération) :**
- Sujets (Fremen, ver) proches du centre du cadre → le recadrage portrait mobile reste bon
- Tiers supérieur de l'image finale sombre et peu détaillé → lisibilité du nom en `text-theme-primary` et des CTA
- Palette conforme aux tokens Dune (sable/cuivre/orange, ambiance crépusculaire)

**Plan B génération :** si l'interpolation first/last frame n'est pas disponible sur les modèles du plan Starter, chaînage simple : image de départ + prompt de mouvement, extraction de la dernière frame → départ du plan suivant.

## 4. Composant `HeroCinematic`

Nouveau fichier `src/components/HeroCinematic.tsx`. Monté uniquement quand `universe === 'dune'`, dans la couche z-0 du Hero.

**Machine à états :**
1. `resting-start` (0–100 ms) : poster (`img-space`) affiché instantanément — même pattern de délai que le `showEffects` actuel, LCP intact
2. `playing` : `<video autoplay muted playsinline preload="auto">` en `object-cover`, `aria-hidden="true"`
3. `resting-final` : au `onEnded`, cross-fade 0,5 s vers `img-fremen` (déjà montée sous la vidéo — on fond l'opacité de la vidéo, aucun flash possible), puis démontage de la vidéo (libération mémoire)

**Micro-effet scroll :** `useScroll` + `useTransform` (Framer Motion) sur l'image finale — scale 1 → 1,08 et légère translation Y pendant la sortie du Hero. GPU-only.

**Cas dégradés :**
- `prefers-reduced-motion: reduce` → directement `resting-final`, la vidéo n'est jamais montée
- Erreur de chargement/lecture vidéo (`onError`) → bascule immédiate vers `resting-final`
- Contenu purement décoratif : aucun texte, rien à traduire (règle i18n non concernée)

## 5. Changements dans l'existant

- **`src/components/Hero.tsx`** (seul fichier existant modifié) : dans les couches 1–2, la branche Dune (`DesertParallax` + `SandstormEffect`) est remplacée par `<HeroCinematic />` ; la branche Cyberpunk est inchangée
- `DesertParallax.tsx` et `SandstormEffect.tsx` restent dans le repo, plus importés par le Hero
- Aucune modification de `translations.ts`, des sections, de la nav, ni des composants `ui/`

## 6. Performance

- Le texte reste l'élément LCP : rendu immédiat, la vidéo démarre après le délai de 100 ms
- Vidéo compressée agressivement (vue seulement ~10 s) grâce au fond fixe séparé
- `preload="auto"` seulement à partir du montage différé ; poster affiché pendant le buffering
- Une seule vidéo décodée à la fois, démontée après lecture

## 7. Hors périmètre (explicite)

- Relogement de `DesertParallax` / `SandstormEffect` dans une autre section
- Vidéo Hero pour l'univers Cyberpunk (le mécanisme par univers le permettra plus tard)
- Vidéo verticale mobile dédiée (plan B, activé seulement si le recadrage central déçoit)
- Toute modification du contenu textuel ou des autres sections

## 8. Prérequis avant implémentation

1. Abonnement Higgsfield Starter actif
2. MCP Higgsfield connecté à Claude Code (`https://mcp.higgsfield.ai/mcp`)
3. Vérification des modèles réellement exposés au plan Starter (première connexion) — ajuster le plan de génération si besoin
