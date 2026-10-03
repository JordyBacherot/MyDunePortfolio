export type HeroTheme = "light" | "dark";
export type HeroFormat = "landscape" | "portrait";

export interface HeroVariantMedia {
    intro: { webm: string; mp4: string };
    loop: { webm: string; mp4: string };
    start: { avif: string; webp: string };
    final: { avif: string; webp: string };
}

// URLs des 32 fichiers produits par motion/scripts/encode.sh ; le navigateur ne télécharge que la variante affichée
const files = import.meta.glob<string>("../../assets/hero/hero-*-*-*.{webm,mp4,avif,webp}", {
    eager: true,
    query: "?url",
    import: "default",
});

function asset(name: string): string {
    const key = Object.keys(files).find((path) => path.endsWith(`/${name}`));
    if (!key) throw new Error(`Asset du Hero manquant : ${name}`);
    return files[key];
}

export function heroMedia(theme: HeroTheme, format: HeroFormat): HeroVariantMedia {
    const prefix = `hero-${theme}-${format}`;
    return {
        intro: { webm: asset(`${prefix}-intro.webm`), mp4: asset(`${prefix}-intro.mp4`) },
        loop: { webm: asset(`${prefix}-loop.webm`), mp4: asset(`${prefix}-loop.mp4`) },
        start: { avif: asset(`${prefix}-start.avif`), webp: asset(`${prefix}-start.webp`) },
        final: { avif: asset(`${prefix}-final.avif`), webp: asset(`${prefix}-final.webp`) },
    };
}
