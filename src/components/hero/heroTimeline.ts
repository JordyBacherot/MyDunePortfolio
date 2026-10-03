/**
 * Repères de la vidéo du Hero (secondes), copie conforme de motion/src/timeline.js.
 * Le texte HTML apparaît quand le temps de l'intro franchit ces repères.
 */
export const INTRO_DURATION = 11;
export const LOOP_DURATION = 8;

export type Cue = "name" | "frame" | "description" | "actions";

export const CUE_TIMES: Readonly<Record<Cue, number>> = {
    name: 0.6,
    frame: 7.0,
    description: 8.4,
    actions: 8.9,
};

/** Délai avant le montage de la vidéo : le poster et le texte peignent d'abord (LCP) */
export const MOUNT_DELAY_MS = 100;
/** Si l'intro n'a pas démarré après ce délai, on passe en mode statique */
export const START_TIMEOUT_MS = 2500;
/** Défilement (px) au-delà duquel l'intro est sautée */
export const SKIP_SCROLL_PX = 40;
/** Durée des fondus entre couches vidéo (s) */
export const CROSSFADE_S = 0.3;
