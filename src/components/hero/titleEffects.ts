/** Effets du nom (spec §3.3) : a — lettres découpées, b — découpe au cutter, c — balayage en éventail */
export type TitleEffect = "a" | "b" | "c";

/** Effet retenu pour la v1 (ajusté après comparaison, tâche B6) */
export const DEFAULT_TITLE_EFFECT: TitleEffect = "a";

/** En développement, `?titleFx=a|b|c` permet de comparer les effets */
export function resolveTitleEffect(search: string): TitleEffect {
    const value = new URLSearchParams(search).get("titleFx");
    return value === "a" || value === "b" || value === "c" ? value : DEFAULT_TITLE_EFFECT;
}
