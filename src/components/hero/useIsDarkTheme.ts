import { useEffect, useState } from "react";

// Même règle que Layout.tsx : sombre par défaut, clair seulement si l'utilisateur l'a choisi
const savedThemeIsDark = (): boolean => {
    try {
        return localStorage.getItem("theme") !== "light";
    } catch {
        return true;
    }
};

/**
 * Thème Dune courant. Initialisé depuis localStorage (Layout applique la classe `dark`
 * dans son propre effet, qui s'exécute après celui de ses enfants), puis synchronisé
 * avec la classe `dark` de <html>.
 */
export function useIsDarkTheme(): boolean {
    const [isDark, setIsDark] = useState(savedThemeIsDark);
    useEffect(() => {
        const root = document.documentElement;
        const observer = new MutationObserver(() => setIsDark(root.classList.contains("dark")));
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);
    return isDark;
}
