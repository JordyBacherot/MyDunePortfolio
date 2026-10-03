import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import NightCityParallax from "../NightCityParallax";
import CyberRainEffect from "../CyberRainEffect";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroActions from "./HeroActions";

/** Hero de l'univers Cyberpunk (inchangé) : ville nocturne et pluie, texte centré */
const HeroCyberpunk = () => {
    const { t } = useLanguage();
    const [showEffects, setShowEffects] = useState(false);

    useEffect(() => {
        // Defer heavy effects to allow LCP (text) to paint first
        const timer = setTimeout(() => {
            setShowEffects(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section id="profil" className="min-h-[90vh] relative w-full flex flex-col justify-center items-center overflow-hidden">
            {/* Layer 0: Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-theme-accent/10 rounded-full blur-[100px] pointer-events-none z-0" />

            {/* Layer 1: Background (parallax) */}
            <div className="absolute inset-0 z-0">
                {showEffects && <NightCityParallax />}
            </div>

            {/* Layer 2: Atmosphere overlay (Cyber Rain) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {showEffects && <CyberRainEffect />}
            </div>

            {/* Layer 3: Content Container */}
            <div className="w-full max-w-4xl mx-auto px-4 flex flex-col justify-center items-center text-center space-y-12 relative z-20 -mt-20">
                <div className="space-y-6 relative">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="font-heading text-3xl md:text-5xl lg:text-7xl font-bold text-theme-primary mb-4 tracking-[0.1em] uppercase [text-shadow:0_2px_12px_rgba(0,0,0,0.85),0_0_30px_hsl(var(--theme-glow)/0.6),0_0_70px_hsl(var(--theme-accent)/0.4)]"
                    >
                        {t.hero.name}
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg md:text-xl text-theme-surface font-medium leading-relaxed [text-shadow:0_1px_8px_rgba(0,0,0,0.9),0_0_24px_hsl(var(--theme-glow)/0.35)]"
                    >
                        {t.hero.description}
                    </motion.h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <HeroActions />
                </motion.div>
            </div>
        </section>
    );
};

export default HeroCyberpunk;
