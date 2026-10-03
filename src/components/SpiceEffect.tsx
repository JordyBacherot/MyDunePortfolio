import { useEffect, useRef } from "react";
import { useUniverse } from "../contexts/UniverseContext";
import { gateCanvasAnimation } from "@/lib/canvasAnimationGate";
import { useIsDarkTheme } from "./hero/useIsDarkTheme";

/** Un grain d'épice : profondeur z (0 = lointain, 1 = tout proche), phase et vitesse de scintillement, teinte */
interface Mote {
    x: number;
    y: number;
    z: number;
    phase: number;
    twinkle: number;
    tone: number;
    gust: number;
}

// De la plus claire à la plus profonde. Nuit : poussière lumineuse (fusion additive) ; parchemin : poudre de cannelle
const TONES = {
    dark: ["#ffe2b0", "#f3c27e", "#e8a865", "#d27237"],
    light: ["#d9893f", "#c9743a", "#a35214", "#934625"],
    cyber: ["#fef08a", "#fde047", "#fbbf24", "#f59e0b"],
};

const SPRITE = 64;
// Une rafale de vent traverse la section à cette période (s) et emporte l'épice en traînées
const GUST_PERIOD = 9;
const GUST_WIDTH = 280;

const withAlpha = (hex: string, alpha: number) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

// Grain pré-rendu : cœur net et large halo en lumineux, grain plein au bord doux sur fond clair
function makeSprite(color: string, glow: boolean): HTMLCanvasElement {
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = SPRITE;
    const g = sprite.getContext("2d")!;
    const h = SPRITE / 2;
    const gradient = g.createRadialGradient(h, h, 0, h, h, h);
    if (glow) {
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.16, color);
        gradient.addColorStop(0.32, withAlpha(color, 0.35));
        gradient.addColorStop(1, withAlpha(color, 0));
    } else {
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.45, withAlpha(color, 0.75));
        gradient.addColorStop(1, withAlpha(color, 0));
    }
    g.fillStyle = gradient;
    g.fillRect(0, 0, SPRITE, SPRITE);
    return sprite;
}

// Voile de nuage : dégradé radial très progressif, agrandi au dessin
function makeHaze(color: string): HTMLCanvasElement {
    const haze = document.createElement("canvas");
    haze.width = haze.height = 128;
    const g = haze.getContext("2d")!;
    const gradient = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, withAlpha(color, 1));
    gradient.addColorStop(0.5, withAlpha(color, 0.4));
    gradient.addColorStop(1, withAlpha(color, 0));
    g.fillStyle = gradient;
    g.fillRect(0, 0, 128, 128);
    return haze;
}

/**
 * Épice en suspension derrière les projets : trois profondeurs de grains qui dérivent, scintillent
 * et sont emportés en traînées par des rafales. Suspendu hors écran ; image fixe si les animations sont réduites.
 */
const SpiceEffect = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { universe } = useUniverse();
    const isDark = useIsDarkTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = canvas?.parentElement;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !parent || !ctx) return;

        const cyber = universe === "cyberpunk";
        const glow = cyber || isDark;
        const tones = cyber ? TONES.cyber : isDark ? TONES.dark : TONES.light;
        const sprites = tones.map((color) => makeSprite(color, glow));
        const haze = makeHaze(tones[glow ? 2 : 0]);
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const mobile = window.innerWidth < 768;

        let width = 0;
        let height = 0;
        let time = 0;
        const motes: Mote[] = [];
        const spawn = (): Mote => ({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() ** 1.6, // surtout des grains lointains, quelques-uns tout proches
            phase: Math.random() * Math.PI * 2,
            twinkle: 0.6 + Math.random() * 1.8,
            tone: Math.floor(Math.random() * sprites.length),
            gust: 0,
        });

        const step = (dt: number) => {
            time += dt / 60;
            const margin = GUST_WIDTH * 2;
            const gustX = ((time / GUST_PERIOD) % 1) * (width + 2 * margin) - margin;
            for (const m of motes) {
                const depth = 0.25 + m.z * 0.75;
                m.gust = Math.exp(-(((m.x - gustX) / GUST_WIDTH) ** 2));
                m.x += ((0.18 + m.gust * 2.6) * depth + Math.sin(time * 0.7 + m.phase) * 0.12 * depth) * dt;
                m.y += (-0.12 * depth + Math.cos(time * 0.5 + m.phase * 1.7) * 0.18 * depth - Math.sin(m.phase + time * 2) * m.gust * 0.7 * depth) * dt;
                if (m.x > width + 30) { m.x = -30; m.y = Math.random() * height; }
                else if (m.x < -30) m.x = width + 30;
                if (m.y < -30) { m.y = height + 30; m.x = Math.random() * width; }
                else if (m.y > height + 30) m.y = -30;
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = glow ? "lighter" : "source-over";
            // Nuages d'épice : trois voiles très doux qui dérivent lentement derrière les grains
            const cloud = Math.min(width, 900) * 0.45;
            for (let i = 0; i < 3; i++) {
                const cx = width * (0.2 + 0.3 * i) + Math.sin(time * 0.05 + i * 2.1) * width * 0.12;
                const cy = height * (0.3 + 0.2 * (i % 2)) + Math.cos(time * 0.04 + i * 1.3) * height * 0.1;
                ctx.globalAlpha = glow ? 0.09 : 0.08;
                ctx.drawImage(haze, cx - cloud, cy - cloud, cloud * 2, cloud * 2);
            }
            for (const m of motes) {
                const core = glow ? (0.7 + m.z * m.z * 3.8) : (1 + m.z * m.z * 3.2);
                const size = core * (glow ? 11 : 4.5) * (mobile ? 0.85 : 1);
                const shimmer = 0.55 + 0.45 * Math.sin(time * m.twinkle * 2 + m.phase);
                const bokeh = m.z > 0.85 ? 0.5 : 1; // les grains tout proches restent flous et discrets
                const alpha = Math.min(1, (glow ? 0.32 + 0.6 * m.z : 0.3 + 0.5 * m.z) * shimmer * bokeh * (1 + m.gust * 0.9));
                const sprite = sprites[m.tone];
                // Grain pris dans la rafale : étiré en traînée derrière lui, comme un flou de vitesse
                if (m.gust > 0.2) {
                    const streak = m.gust * (10 + m.z * 28);
                    ctx.globalAlpha = alpha * 0.55;
                    ctx.drawImage(sprite, m.x - streak - size / 2, m.y - size * 0.3, size + streak, size * 0.6);
                }
                ctx.globalAlpha = alpha;
                ctx.drawImage(sprite, m.x - size / 2, m.y - size / 2, size, size);
            }
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
        };

        let running = false;
        let frame = 0;
        let last = 0;
        const loop = (now: number) => {
            const dt = last ? Math.min(3, (now - last) / (1000 / 60)) : 1;
            last = now;
            step(dt);
            draw();
            if (running) frame = requestAnimationFrame(loop);
        };
        const start = () => {
            if (running || reduced) return;
            running = true;
            last = 0;
            frame = requestAnimationFrame(loop);
        };
        const stop = () => {
            running = false;
            cancelAnimationFrame(frame);
        };

        // La section grandit quand ses cartes se chargent : on suit sa taille réelle
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = parent.clientWidth;
            height = parent.clientHeight;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const target = Math.round(Math.min(mobile ? 90 : 220, Math.max(50, (width * height) / 6000)));
            while (motes.length < target) motes.push(spawn());
            motes.length = target;
            if (!running) draw();
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(parent);
        resize();
        const ungate = gateCanvasAnimation(canvas, start, stop);

        return () => {
            resizeObserver.disconnect();
            ungate();
        };
    }, [universe, isDark]);

    return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true" />;
};

export default SpiceEffect;
