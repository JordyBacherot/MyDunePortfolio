import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

type SideDecorationProps = {
    side: 'left' | 'right';
    variant: 'dune1' | 'dune2' | 'mountain';
    mode?: 'dune' | 'geometry' | 'matrix' | 'storm';
    showParticles?: boolean;
    className?: string;
};

const SideDecoration = ({ side, variant, mode = 'dune', showParticles = true, className = '' }: SideDecorationProps) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    const scrollY = useSpring(scrollYProgress, springConfig);

    // --- DUNE MODE CONFIG (Slower) ---
    const duneAnimConfig = {
        dune1: {
            duration: 10,
            yBack: ["0%", "5%", "0%"],
            yMid: ["0%", "-5%", "0%"],
            yFront: ["0%", "8%", "0%"],
            particleCount: 12,
            particleSpeed: 0.5
        },
        dune2: {
            duration: 15,
            yBack: ["0%", "8%", "0%"],
            yMid: ["0%", "-8%", "0%"],
            yFront: ["0%", "12%", "0%"],
            particleCount: 18,
            particleSpeed: 0.3
        },
        mountain: {
            duration: 12,
            yBack: ["0%", "3%", "0%"],
            yMid: ["0%", "-2%", "0%"],
            yFront: ["0%", "4%", "0%"],
            particleCount: 8,
            particleSpeed: 0.6
        }
    };

    const config = duneAnimConfig[variant];
    // Parallax layers (Back, Mid, Front)
    const yBack = useTransform(scrollY, [0, 1], ["0%", "20%"]);
    const yMid = useTransform(scrollY, [0, 1], ["0%", "40%"]);
    const yFront = useTransform(scrollY, [0, 1], ["0%", "60%"]);

    // --- PARTICLES STATE ---
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number; type?: string }>>([]);

    useEffect(() => {
        // Only generate particles ONCE on mount, not on every scroll
        if (!showParticles) {
            setParticles([]);
            return;
        }

        let count = 12;
        let speed = 1;

        if (mode === 'dune') {
            count = config.particleCount;
            speed = config.particleSpeed;
        } else if (mode === 'geometry') {
            count = 8;
            speed = 0.2;
        } else if (mode === 'matrix') {
            count = 25;
            speed = 0.5;
        } else if (mode === 'storm') {
            count = 50;
            speed = 15;
        }

        const newParticles = Array.from({ length: count }, (_, i) => {
            const shapes = ['circle', 'square', 'triangle'];
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];

            return {
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 2,
                duration: (Math.random() * 4 + 4) / speed,
                delay: Math.random() * 5,
                type: shapeType
            };
        });
        setParticles(newParticles);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty array = run once on mount only

    // Determine positioning and mirroring
    const positionStyle = side === 'left'
        ? { left: 0, transform: 'scaleX(1)' }
        : { right: 0, transform: 'scaleX(-1)' };

    const getDunePaths = () => {
        switch (variant) {
            case 'dune1':
                return {
                    back: "M0,800 L0,150 C100,200 200,100 300,250 C400,400 450,600 500,800 Z",
                    mid: "M0,800 L0,300 C80,350 150,250 250,400 C350,550 400,700 500,800 Z",
                    front: "M0,800 L0,500 C50,550 120,450 200,600 C280,750 350,800 500,800 Z"
                };
            case 'dune2':
                return {
                    back: "M0,800 L0,100 C120,150 200,50 350,300 C450,500 480,700 500,800 Z",
                    mid: "M0,800 L0,250 C100,300 180,200 300,450 C400,650 450,750 500,800 Z",
                    front: "M0,800 L0,450 C60,500 140,400 250,600 C350,780 400,800 500,800 Z"
                };
            case 'mountain':
                return {
                    back: "M0,800 L0,200 L150,100 L300,250 L400,500 L500,800 Z",
                    mid: "M0,800 L0,400 L100,300 L200,450 L350,600 L500,800 Z",
                    front: "M0,800 L0,600 L80,500 L180,650 L300,800 Z"
                };
            default:
                return { back: "", mid: "", front: "" };
        }
    };

    const paths = getDunePaths();

    return (
        <div
            ref={ref}
            style={positionStyle}
            className={`absolute top-0 bottom-0 w-[300px] xl:w-[450px] pointer-events-none z-0 hidden lg:block overflow-hidden ${className}`}
        >
            {/* Common Gradient Masks */}
            <div className={`absolute inset-0 z-20 bg-gradient-to-${side === 'left' ? 'r' : 'l'} from-transparent via-transparent to-theme-base/5`} />
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-theme-base via-transparent to-transparent" />
            <div className="absolute inset-0 z-20 bg-gradient-to-b from-theme-base via-transparent to-transparent" />

            {/* --- DUNE MODE --- */}
            {mode === 'dune' && (
                <>
                    {/* Particles */}
                    {showParticles && particles.map((p) => (
                        <motion.div
                            key={p.id}
                            className="absolute rounded-full bg-theme-accent z-10"
                            style={{
                                width: p.size,
                                height: p.size,
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                opacity: 0.6,
                                willChange: "transform, opacity"
                            }}
                            animate={{
                                y: [0, -50, 0],
                                opacity: [0.2, 0.8, 0.2],
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                    {/* Layers - smooth parallax only, no conflicting animations */}
                    <motion.div style={{ y: yBack, willChange: "transform" }} className="absolute inset-0 text-theme-primary opacity-30">
                        <svg viewBox="0 0 500 800" className="w-full h-full" preserveAspectRatio="none"><path fill="currentColor" d={paths.back} /></svg>
                    </motion.div>
                    <motion.div style={{ y: yMid, willChange: "transform" }} className="absolute inset-0 text-theme-accent opacity-30">
                        <svg viewBox="0 0 500 800" className="w-full h-full" preserveAspectRatio="none"><path fill="currentColor" d={paths.mid} /></svg>
                    </motion.div>
                    <motion.div style={{ y: yFront, willChange: "transform" }} className="absolute inset-0 text-theme-glow opacity-20">
                        <svg viewBox="0 0 500 800" className="w-full h-full" preserveAspectRatio="none"><path fill="currentColor" d={paths.front} /></svg>
                    </motion.div>
                </>
            )}

            {/* --- GEOMETRY MODE (Skills) --- */}
            {mode === 'geometry' && (
                <div className="absolute inset-0 opacity-30">
                    <svg className="w-full h-full">
                        {particles.map((p) => (
                            <motion.g
                                key={p.id}
                                initial={{ x: `${p.x}%`, y: `${p.y}%` }}
                                animate={{
                                    y: [`${p.y}%`, `${p.y - 10}%`, `${p.y}%`],
                                    rotate: [0, 360],
                                    opacity: [0.2, 0.6, 0.2]
                                }}
                                transition={{
                                    duration: p.duration * 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                style={{ willChange: "transform, opacity" }}
                            >
                                {p.type === 'circle' && <circle r={p.size * 2} fill="none" stroke="currentColor" strokeWidth="1" className="text-theme-accent" />}
                                {p.type === 'square' && <rect width={p.size * 4} height={p.size * 4} fill="none" stroke="currentColor" strokeWidth="1" className="text-theme-primary" />}
                                {p.type === 'triangle' && <polygon points={`0,0 ${p.size * 4},0 ${p.size * 2},${p.size * 3.5}`} fill="none" stroke="currentColor" strokeWidth="1" className="text-theme-glow" />}
                            </motion.g>
                        ))}
                    </svg>
                </div>
            )}

            {/* --- STORM MODE (Contact) - Slower --- */}
            {mode === 'storm' && (
                <div className="absolute inset-0">
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            className="absolute h-[1px] bg-gradient-to-r from-transparent via-theme-primary to-transparent"
                            style={{
                                width: p.size * 20,
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                opacity: 0.5,
                                willChange: "transform, opacity"
                            }}
                            animate={{
                                x: ["-50%", "50%"], // Reduced distance
                                opacity: [0, 0.6, 0],
                            }}
                            transition={{
                                duration: p.duration, // Slower
                                repeat: Infinity,
                                delay: p.delay,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};

export default SideDecoration;
