import { Button } from "@/components/ui/button";
import type { MouseEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fastScrollTo } from "@/lib/fastScroll";
import { cn } from "@/lib/utils";

interface HeroActionsProps {
    className?: string;
    /** Boutons plus bas sur mobile (cartouche de l'affiche) ; taille habituelle à partir de md */
    compact?: boolean;
}

const SIZE = "px-10 py-7 text-lg tracking-widest";
// Défilement rapide vers la section plutôt que le saut instantané de l'ancre
const scrollTo = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    fastScrollTo(id);
};
const COMPACT_SIZE = "h-12 px-6 py-0 text-sm tracking-[0.15em] md:h-9 md:px-10 md:py-7 md:text-lg md:tracking-widest";

/** Les deux boutons du Hero (projets, contact), communs aux deux univers */
const HeroActions = ({ className, compact = false }: HeroActionsProps) => {
    const { t } = useLanguage();
    const size = compact ? COMPACT_SIZE : SIZE;
    return (
        <div className={cn("flex flex-col md:flex-row", compact ? "gap-3 md:gap-6" : "gap-6", className)}>
            {/* Clair : accent presque plein, texte blanc (4,7:1), survol cuivre. Sombre : or du nom, texte nuit (11:1) */}
            <Button asChild className={cn("bg-theme-accent/90 dark:bg-theme-title backdrop-blur-sm text-white dark:text-theme-base hover:bg-theme-primary dark:hover:bg-theme-glow hover:animate-spice-glow transition-all duration-300 rounded-full uppercase font-bold", size)}>
                <a href="#projets" onClick={scrollTo("projets")}>{t.hero.viewProjects}</a>
            </Button>
            <Button asChild variant="outline" className={cn("bg-theme-base/40 backdrop-blur-sm border-theme-primary text-theme-primary hover:bg-theme-primary/10 hover:text-theme-surface hover:border-theme-accent transition-all duration-300 rounded-full uppercase font-bold", size)}>
                <a href="#contact" onClick={scrollTo("contact")}>{t.hero.contactMe}</a>
            </Button>
        </div>
    );
};

export default HeroActions;
