import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, useMotionValue, useTransform, useInView } from "framer-motion";
import { Linkedin, Github, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useUniverse } from "../contexts/UniverseContext";
import DesertParallax from "./DesertParallax";

const Contact = () => {
    const { t } = useLanguage();
    const { universe } = useUniverse();
    const [isHovered, setIsHovered] = useState(false);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    // Suspend les animations en boucle quand la section est hors écran
    const sectionInView = useInView(sectionRef, { margin: "20% 0px" });

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [cooldown, setCooldown] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if cooldown is active
        if (cooldown > 0) return;

        // Construct mailto link
        const mailtoLink = `mailto:jordybacherot.@outlook.fr?subject=Contact de ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(
            `Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;

        // Open email client
        window.location.href = mailtoLink;

        // Start cooldown
        setCooldown(30);
    };

    // Cooldown timer
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => {
                setCooldown(cooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    // Parallax 3D effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

    // Generate sand particles
    useEffect(() => {
        const newParticles = Array.from({ length: 25 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5,
        }));
        setParticles(newParticles);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    return (
        <section id="contact" ref={sectionRef} className="pt-24 pb-56 w-full mb-20 relative overflow-hidden">
            {/* Desert Parallax Background (Dune universe only) */}
            {universe === 'dune' && <DesertParallax />}

            {/* Sand Storm Background Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                {sectionInView && particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute w-1 h-1 bg-theme-primary rounded-full"
                        initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0 }}
                        animate={{
                            x: [`${particle.x}%`, `${particle.x + 20}%`, `${particle.x}%`],
                            y: [`${particle.y}%`, `${particle.y + 30}%`, `${particle.y}%`],
                            opacity: [0, 0.6, 0],
                        }}
                        transition={{
                            duration: 8 + particle.delay,
                            repeat: Infinity,
                            delay: particle.delay,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="flex flex-col items-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-theme-primary tracking-[0.2em] uppercase"
                    >
                        {t.contact.title}
                    </motion.h2>
                    <div className="h-1 w-24 bg-theme-accent rounded-full"></div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-theme-surface/70 max-w-2xl text-lg"
                    >
                        {t.contact.subtitle}
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    {/* Left side - Info cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 space-y-6"
                    >

                        {/* Social links card */}
                        <motion.div
                            whileHover={{ scale: 1.03, y: -5 }}
                            className="bg-gradient-to-br from-theme-primary/10 to-theme-accent/5 p-6 rounded-2xl border border-theme-primary/20 backdrop-blur-sm hover:border-theme-accent/40 transition-all duration-500"
                        >
                            <h3 className="font-bold text-theme-primary mb-4 tracking-wider">{t.contact.networks}</h3>
                            <div className="flex gap-3">
                                {[
                                    { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/jordy-bacherot/" },
                                    { Icon: Github, label: "GitHub", href: "https://github.com/JordyBacherot" },
                                ].map(({ Icon, label, href }, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.15, rotate: 10 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-3 rounded-full bg-theme-primary/20 text-theme-primary hover:bg-theme-accent hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--theme-accent)/0.5)]"
                                        aria-label={label}
                                    >
                                        <Icon size={24} />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quote card */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-theme-accent/10 to-transparent p-6 rounded-2xl border border-theme-accent/20 italic"
                        >
                            <p className="text-theme-primary dark:text-theme-glow text-sm leading-relaxed">
                                "{t.contact.quote}"
                            </p>
                            <p className="text-theme-primary/60 text-xs mt-2 text-right">{t.contact.quoteAuthor}</p>
                        </motion.div>
                    </motion.div>

                    {/* Right side - Floating 3D Form */}
                    <motion.div
                        ref={containerRef}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-3"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => {
                            setIsHovered(false);
                            mouseX.set(0);
                            mouseY.set(0);
                        }}
                        style={{ perspective: 1000 }}
                    >
                        <motion.div
                            style={{
                                rotateX,
                                rotateY,
                                transformStyle: "preserve-3d",
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <form
                                className="relative bg-gradient-to-br from-theme-base/40 to-theme-primary/5 p-8 md:p-10 rounded-3xl border-2 border-theme-primary/30 backdrop-blur-md shadow-2xl"
                                onSubmit={handleSubmit}
                            >
                                {/* Spice glow effect */}
                                <motion.div
                                    className="absolute -inset-1 bg-gradient-to-r from-theme-accent/20 via-theme-primary/20 to-theme-accent/20 rounded-3xl blur-xl -z-10"
                                    animate={{
                                        opacity: isHovered ? 0.8 : 0.3,
                                        scale: isHovered ? 1.05 : 1,
                                    }}
                                    transition={{ duration: 0.5 }}
                                />

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-theme-primary font-bold flex items-center gap-2">
                                            <span className="w-2 h-2 bg-theme-accent rounded-full animate-pulse"></span>
                                            {t.contact.formLabels.identity}
                                        </label>
                                        <Input
                                            placeholder={t.contact.placeholders.name}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="bg-theme-base/70 border-theme-primary/30 focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/50 text-theme-surface placeholder:text-theme-surface/40 rounded-xl h-14 transition-all duration-300 hover:border-theme-accent/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-theme-primary font-bold flex items-center gap-2">
                                            <span className="w-2 h-2 bg-theme-accent rounded-full animate-pulse"></span>
                                            {t.contact.formLabels.coordinates}
                                        </label>
                                        <Input
                                            type="email"
                                            placeholder={t.contact.placeholders.email}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-theme-base/70 border-theme-primary/30 focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/50 text-theme-surface placeholder:text-theme-surface/40 rounded-xl h-14 transition-all duration-300 hover:border-theme-accent/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-theme-primary font-bold flex items-center gap-2">
                                            <span className="w-2 h-2 bg-theme-accent rounded-full animate-pulse"></span>
                                            {t.contact.formLabels.transmission}
                                        </label>
                                        <Textarea
                                            placeholder={t.contact.placeholders.message}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="bg-theme-base/70 border-theme-primary/30 focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/50 text-theme-surface placeholder:text-theme-surface/40 rounded-xl min-h-[160px] transition-all duration-300 hover:border-theme-accent/50 resize-none"
                                        />
                                    </div>

                                    {/* Stylized submit button */}
                                    <motion.div
                                        whileHover={cooldown === 0 ? { scale: 1.02 } : {}}
                                        whileTap={cooldown === 0 ? { scale: 0.98 } : {}}
                                    >
                                        <Button
                                            type="submit"
                                            disabled={cooldown > 0}
                                            className={`w-full font-bold tracking-[0.3em] uppercase rounded-xl h-14 text-sm relative overflow-hidden group transition-all duration-500 shadow-lg ${cooldown > 0
                                                ? 'bg-theme-primary/30 text-theme-surface/50 cursor-not-allowed'
                                                // Classes Tailwind natives : tailwind-merge (cn du Button) écrasait le dégradé avec les anciens utilitaires bg-size-200/bg-pos-*
                                                : 'bg-gradient-to-r from-theme-primary via-theme-accent to-theme-primary bg-[length:200%_100%] bg-left hover:bg-right text-white hover:shadow-[0_0_30px_hsl(var(--theme-accent)/0.6)]'
                                                }`}
                                        >
                                            {/* Animated background */}
                                            {cooldown === 0 && sectionInView && (
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                                    animate={{
                                                        x: ["-100%", "100%"],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                />
                                            )}
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                <Send size={18} />
                                                {cooldown > 0 ? `Cooldown: ${cooldown}s` : t.contact.submit}
                                            </span>
                                        </Button>
                                    </motion.div>

                                    {/* Footer note */}
                                    <p className="text-center text-xs text-theme-surface/50 italic pt-2">
                                        {t.contact.footerNote}
                                    </p>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
