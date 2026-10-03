import { Fragment } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TitleEffect } from "./titleEffects";

interface PosterTitleProps {
    text: string;
    show: boolean;
    instant: boolean;
    effect: TitleEffect;
}

// a — lettres découpées : chaque lettre tombe et se pose (léger pivot, échelle qui retombe)
const DropLetters = ({ text }: { text: string }) => {
    const words = text.split(" ");
    return (
        <>
            {words.map((word, w) => {
                const offset = words.slice(0, w).join("").length;
                return (
                    <Fragment key={w}>
                        {w > 0 && " "}
                        <span className="inline-block whitespace-nowrap">
                            {Array.from(word).map((letter, l) => (
                                <motion.span
                                    key={l}
                                    className="inline-block"
                                    initial={{ y: "-0.7em", opacity: 0, scale: 1.25, rotate: (offset + l) % 2 ? 6 : -6 }}
                                    animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 520, damping: 24, delay: (offset + l) * 0.04 }}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </span>
                    </Fragment>
                );
            })}
        </>
    );
};

// b — découpe au cutter : un contour pointillé se trace, puis le nom se soulève
const CutterReveal = ({ text }: { text: string }) => (
    <span className="relative inline-block">
        <motion.span
            className="absolute -inset-x-4 -inset-y-2 border-2 border-dashed border-poster-ink"
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 1 }}
            animate={{ clipPath: "inset(0 0% 0 0)", opacity: [1, 1, 0] }}
            transition={{ clipPath: { duration: 0.45, ease: "easeInOut" }, opacity: { duration: 1.2, times: [0, 0.75, 1] } }}
        />
        <motion.span
            className="relative inline-block"
            initial={{ opacity: 0, y: "0.12em", scale: 1.04 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.45, ease: "easeOut" }}
        >
            {text}
        </motion.span>
    </span>
);

// c — balayage en éventail depuis l'horizon : le nom se découvre de gauche à droite, comme sous les rayons
const FAN = [
    "polygon(50% 150%, -150% 150%, -150% 150%, -150% 150%, -150% 150%)",
    "polygon(50% 150%, -150% 150%, -150% -150%, -150% -150%, -150% -150%)",
    "polygon(50% 150%, -150% 150%, -150% -150%, 250% -150%, 250% -150%)",
    "polygon(50% 150%, -150% 150%, -150% -150%, 250% -150%, 250% 150%)",
];
const FanReveal = ({ text }: { text: string }) => (
    <motion.span
        className="inline-block"
        initial={{ clipPath: FAN[0] }}
        animate={{ clipPath: FAN }}
        transition={{ duration: 0.9, times: [0, 0.3, 0.7, 1], ease: "easeInOut" }}
    >
        {text}
    </motion.span>
);

/** Nom (h1) : vrai texte pour le SEO et les lecteurs d'écran ; l'animation est décorative */
const PosterTitle = ({ text, show, instant, effect }: PosterTitleProps) => {
    const animated = show && !instant;
    return (
        <h1
            aria-label={text}
            className="text-center font-heading text-[length:max(min(9.4vw,2.25rem),min(5vw,4.5rem))] uppercase leading-tight tracking-[0.16em] text-poster-ink [text-shadow:0.075em_0.075em_0_hsl(var(--poster-ink-shadow))]"
        >
            <span aria-hidden="true" className={cn(!show && !instant && "invisible")}>
                {!animated && text}
                {animated && effect === "a" && <DropLetters text={text} />}
                {animated && effect === "b" && <CutterReveal text={text} />}
                {animated && effect === "c" && <FanReveal text={text} />}
            </span>
        </h1>
    );
};

export default PosterTitle;
