
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import SideDecoration from "./SideDecoration";
import SandwormTrail from "./SandwormTrail";
import CyberBikeTrail from "./CyberBikeTrail";
import { useUniverse } from "../contexts/UniverseContext";

const Skills = () => {
    const { t } = useLanguage();
    const { universe } = useUniverse();
    const skillCategories = t.skills.categories;
    return (
        <section id="competences" className="py-24 w-full relative overflow-hidden">
            {/* Side Decorations - Desktop Only */}
            {typeof window !== 'undefined' && window.innerWidth >= 1024 && (
                <>
                    <SideDecoration side="left" variant="mountain" mode="geometry" className="left-0 top-10" />
                    <SideDecoration side="right" variant="dune1" mode="geometry" className="right-0 top-40" />
                </>
            )}

            {/* Sandworm Trail Background (Desktop Only) */}
            <div className="absolute inset-0 z-0 hidden lg:block">
                {/* Conditionally render to prevent background execution on mobile */}
                {typeof window !== 'undefined' && window.innerWidth >= 1024 && (
                    universe === 'dune' ? <SandwormTrail variant="desktop-horizontal" /> : <CyberBikeTrail variant="desktop-horizontal" />
                )}
            </div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="flex flex-col items-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-theme-primary tracking-[0.2em] uppercase"
                    >
                        {t.skills.title}
                    </motion.h2>
                    <div className="h-1 w-24 bg-theme-accent rounded-full"></div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 group/skills">
                    {skillCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.5,
                                        delay: index * 0.1,
                                        ease: "easeOut"
                                    }
                                }
                            }}
                            whileHover={{
                                scale: 1.05,
                                zIndex: 10,
                                transition: { duration: 0.3 }
                            }}
                            className="bg-theme-base/30 border border-theme-primary/10 p-8 rounded-2xl transition-colors duration-500 hover:bg-theme-base/50 hover:border-theme-accent/30 group-hover/skills:blur-[2px] group-hover/skills:scale-95 hover:!blur-0"
                        >
                            <h3 className="text-xl text-theme-accent font-bold mb-6 flex items-center">
                                <span className="w-2 h-2 bg-theme-accent rounded-full mr-3 shadow-[0_0_10px_hsl(var(--theme-ember)/0.8)]"></span>
                                {category.name}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {category.skills.map((skill, idx) => (
                                    <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="bg-theme-primary/10 text-theme-surface hover:bg-theme-accent hover:text-white transition-all duration-300 rounded-lg px-4 py-2 text-sm cursor-default"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
