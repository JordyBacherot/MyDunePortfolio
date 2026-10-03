import { useEffect, useState, type RefObject } from "react";
import type { HeroFormat } from "./heroMedia";

// Première estimation avant la mesure : le Hero fait environ 90 % de la hauteur de la fenêtre
const guessFormat = (): HeroFormat => (window.innerWidth >= window.innerHeight * 0.9 ? "landscape" : "portrait");

/** Format de la vidéo selon le ratio réel du Hero : ≥ 1 → paysage, sinon portrait */
export function useHeroFormat(ref: RefObject<HTMLElement | null>): HeroFormat {
    const [format, setFormat] = useState<HeroFormat>(guessFormat);
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            if (height > 0) setFormat(width / height >= 1 ? "landscape" : "portrait");
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [ref]);
    return format;
}
