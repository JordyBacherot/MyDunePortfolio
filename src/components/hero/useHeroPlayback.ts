import { useCallback, useEffect, useReducer, useRef, useState, type RefObject } from "react";
import { heroPlaybackReducer, initialPlaybackState, type PlaybackState } from "./heroPlayback";
import { MOUNT_DELAY_MS, REVEAL_SCROLL_PX, START_TIMEOUT_MS } from "./heroTimeline";

// Animations réduites, ou `?still` en développement pour vérifier le mode statique
const startsStill = (): boolean =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    (import.meta.env.DEV && new URLSearchParams(window.location.search).has("still"));

export interface HeroPlayback {
    state: PlaybackState;
    /** Mode statique dès l'arrivée : le texte s'affiche sans animation */
    instant: boolean;
    /** Ref de la vidéo d'intro (ignore le démontage des anciennes variantes) */
    setIntroVideo: (video: HTMLVideoElement | null) => void;
    onIntroPlaying: () => void;
    onIntroEnded: () => void;
    onMediaError: () => void;
    togglePause: () => void;
}

/** Branche la machine à états (heroPlayback.ts) sur la vidéo, les minuteries et les gestes de l'utilisateur */
export function useHeroPlayback(heroRef: RefObject<HTMLElement | null>, variantKey: string): HeroPlayback {
    const [instant] = useState(startsStill);
    const [state, dispatch] = useReducer(heroPlaybackReducer, instant, initialPlaybackState);
    const introVideo = useRef<HTMLVideoElement | null>(null);

    // Changement de thème ou de format : ajusté pendant le rendu (motif React « état précédent »)
    const [lastVariant, setLastVariant] = useState(variantKey);
    if (variantKey !== lastVariant) {
        setLastVariant(variantKey);
        dispatch({ type: "VARIANT_CHANGED" });
    }

    // Montage différé de la vidéo (LCP), et filet de sécurité si l'intro ne démarre pas. Le délai ne court que page
    // visible : un onglet ouvert en arrière-plan ne lance sa vidéo qu'une fois affiché, il ne doit pas finir en statique.
    useEffect(() => {
        const mount = window.setTimeout(() => dispatch({ type: "MOUNTED" }), MOUNT_DELAY_MS);
        let timeout = 0;
        const arm = () => {
            if (document.hidden) {
                window.clearTimeout(timeout);
                timeout = 0;
            } else if (!timeout) {
                timeout = window.setTimeout(() => dispatch({ type: "START_TIMEOUT" }), START_TIMEOUT_MS);
            }
        };
        arm();
        document.addEventListener("visibilitychange", arm);
        return () => {
            window.clearTimeout(mount);
            window.clearTimeout(timeout);
            document.removeEventListener("visibilitychange", arm);
        };
    }, []);

    // Défilement ou clic dans le Hero (hors liens et boutons) : le texte apparaît d'un coup, l'animation continue.
    // Échap saute l'intro jusqu'à la boucle.
    const skippable = state.phase === "start" || state.phase === "loading" || state.phase === "intro";
    useEffect(() => {
        if (!skippable) return;
        const reveal = () => dispatch({ type: "REVEAL" });
        const onScroll = () => {
            if (window.scrollY > REVEAL_SCROLL_PX) reveal();
        };
        const onPointerDown = (event: PointerEvent) => {
            const target = event.target;
            if (target instanceof Element && heroRef.current?.contains(target) && !target.closest("a, button")) reveal();
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") dispatch({ type: "SKIP" });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [skippable, heroRef]);

    // Repères du texte : temps de l'intro lu à chaque image du navigateur, seulement pendant l'intro
    useEffect(() => {
        if (state.phase !== "intro") return;
        let frame = 0;
        const poll = () => {
            const video = introVideo.current;
            if (video) dispatch({ type: "INTRO_TIME", time: video.currentTime });
            frame = window.requestAnimationFrame(poll);
        };
        frame = window.requestAnimationFrame(poll);
        return () => window.cancelAnimationFrame(frame);
    }, [state.phase]);

    const setIntroVideo = useCallback((video: HTMLVideoElement | null) => {
        if (video) introVideo.current = video;
    }, []);
    const onIntroPlaying = useCallback(() => dispatch({ type: "INTRO_PLAYING" }), []);
    const onIntroEnded = useCallback(() => dispatch({ type: "INTRO_ENDED" }), []);
    const onMediaError = useCallback(() => dispatch({ type: "MEDIA_ERROR" }), []);
    const togglePause = useCallback(() => dispatch({ type: "TOGGLE_PAUSE" }), []);

    return { state, instant, setIntroVideo, onIntroPlaying, onIntroEnded, onMediaError, togglePause };
}
