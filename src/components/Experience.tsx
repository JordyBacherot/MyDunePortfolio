import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import type { ExperienceItem } from "../i18n/translations";
import { cn } from "@/lib/utils";
import SideDecoration from "./SideDecoration";

const TEXT = "text-theme-surface/70 group-hover/card:text-theme-surface/90 transition-colors duration-300";
const TAG = "bg-theme-primary/10 text-theme-primary group-hover/card:bg-theme-primary/20 rounded-full uppercase text-xs tracking-widest transition-colors duration-300";

// Une carte de la frise : titre, organisme, période, description (phrase ou puces), badges
const TimelineCard = ({ exp, index }: { exp: ExperienceItem; index: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2 }}
        className="relative pl-8 md:pl-12"
        style={{ willChange: "opacity, transform" }}
    >
        {/* Timeline Dot (pleine pour une carte mise en avant) */}
        <div className={cn(
            "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-theme-accent shadow-[0_0_10px_hsl(var(--theme-ember)/0.5)]",
            exp.highlight ? "bg-theme-accent" : "bg-theme-base",
        )}></div>

        {/* Spice Glow Card Wrapper */}
        <div className="relative group/card transition-all duration-500 hover:scale-[1.02] hover:z-10">
            {/* Gradient Border/Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-theme-accent via-theme-primary to-theme-base rounded-xl opacity-0 group-hover/card:opacity-100 transition-all duration-500 blur-[1px] group-hover/card:blur-sm group-hover/card:shadow-[0_0_30px_hsl(var(--theme-accent)/0.4)]" />

            {/* Inner Content */}
            <div className={cn(
                "relative bg-theme-base/40 backdrop-blur-sm border rounded-xl p-[1px] overflow-hidden group-hover/card:bg-theme-base group-hover/card:border-transparent transition-colors duration-500",
                exp.highlight ? "border-theme-accent/50" : "border-theme-primary/20",
            )}>
                <div className={cn(
                    "relative group-hover/card:bg-theme-base rounded-xl p-6 transition-all duration-300",
                    exp.highlight ? "bg-theme-accent/[0.08]" : "bg-theme-base/40",
                )}>
                    {/* Liseré d'accent en tête de la carte mise en avant */}
                    {exp.highlight && (
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-theme-primary to-theme-accent opacity-70" />
                    )}
                    <div className="flex justify-between items-start flex-wrap gap-2 mb-4">
                        <div>
                            <h3 className="text-xl text-theme-surface font-bold group-hover/card:text-theme-accent transition-colors duration-300">
                                {exp.title}
                            </h3>
                            <p className="text-theme-primary mt-1 font-medium">{exp.organization}</p>
                        </div>
                        <Badge variant="outline" className="border-theme-accent text-theme-accent rounded-full px-3 py-1 uppercase tracking-wider text-xs shadow-[0_0_10px_hsl(var(--theme-ember)/0.2)] group-hover/card:shadow-[0_0_15px_hsl(var(--theme-ember)/0.6)] transition-shadow duration-300">
                            {exp.period}
                        </Badge>
                    </div>
                    {Array.isArray(exp.description) ? (
                        <ul className={cn("mb-4 space-y-1.5", TEXT)}>
                            {exp.description.map((point) => (
                                <li key={point} className="flex gap-3">
                                    <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-theme-accent/70" aria-hidden="true" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={cn("mb-4", TEXT)}>{exp.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                        <Badge className={TAG}>{exp.type}</Badge>
                        {/* Uniquement si descriptionPlus est non vide */}
                        {exp.descriptionPlus && <Badge className={TAG}>{exp.descriptionPlus}</Badge>}
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

const Experience = () => {
    const { t } = useLanguage();
    // Deux colonnes : expériences (dont l'alternance et l'enseignement) puis formations ; empilées sur petit écran
    const columns = [
        { title: t.experience.professional, items: t.experience.experiences.filter((exp) => exp.section === "work") },
        { title: t.experience.academic, items: t.experience.experiences.filter((exp) => exp.section === "education") },
    ];

    return (
        <section id="parcours" className="py-24 w-full relative overflow-hidden">
            {/* Side Decorations - Desktop Only */}
            {typeof window !== 'undefined' && window.innerWidth >= 1024 && (
                <>
                    <SideDecoration side="left" variant="dune1" mode="dune" showParticles={false} className="left-0 top-20" />
                    <SideDecoration side="right" variant="dune2" mode="dune" showParticles={false} className="right-0 top-40" />
                </>
            )}

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="flex flex-col items-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-theme-primary tracking-[0.2em] uppercase"
                    >
                        {t.experience.title}
                    </motion.h2>
                    <div className="h-1 w-24 bg-theme-accent rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">
                    {columns.map((column) => (
                        <div key={column.title}>
                            <h3 className="font-heading text-sm md:text-base text-theme-accent tracking-[0.3em] uppercase mb-8 ml-4">
                                {column.title}
                            </h3>
                            <div className="relative border-l-2 border-theme-primary/20 ml-4 space-y-12">
                                {column.items.map((exp, index) => (
                                    <TimelineCard key={exp.title} exp={exp} index={index} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
