import type { CSSProperties } from "react";
import { motion } from "framer-motion";

interface PosterFrameProps {
    /** Repère « frame » franchi */
    show: boolean;
    /** Mode statique : affiché sans animation */
    instant: boolean;
}

// Chaque filet se trace côté par côté (haut, droite, bas, gauche), comme un trait de plume
const EDGES = [
    { className: "top-0 left-0 right-0 h-[var(--rule)] origin-left", from: { scaleX: 0 }, to: { scaleX: 1 } },
    { className: "top-0 right-0 bottom-0 w-[var(--rule)] origin-top", from: { scaleY: 0 }, to: { scaleY: 1 } },
    { className: "bottom-0 left-0 right-0 h-[var(--rule)] origin-right", from: { scaleX: 0 }, to: { scaleX: 1 } },
    { className: "top-0 bottom-0 left-0 w-[var(--rule)] origin-bottom", from: { scaleY: 0 }, to: { scaleY: 1 } },
];

const Rule = ({ inset, width, delay, instant }: { inset: number; width: number; delay: number; instant: boolean }) => (
    <div className="absolute" style={{ inset, "--rule": `${width}px` } as CSSProperties}>
        {EDGES.map((edge, i) => (
            <motion.span
                key={i}
                className={`absolute block bg-poster-frame ${edge.className}`}
                initial={instant ? false : edge.from}
                animate={edge.to}
                transition={{ duration: 0.2, delay: delay + i * 0.2, ease: "easeInOut" }}
            />
        ))}
    </div>
);

/** Cadre double filet de l'affiche, en HTML : il épouse toujours les bords du Hero (jamais rogné) */
const PosterFrame = ({ show, instant }: PosterFrameProps) =>
    show ? (
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
            <Rule inset={12} width={3} delay={0} instant={instant} />
            <Rule inset={18} width={1} delay={0.1} instant={instant} />
        </div>
    ) : null;

export default PosterFrame;
