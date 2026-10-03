import { Fragment } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import HeroActions from "./HeroActions";

interface PosterCartoucheProps {
    description: string;
    showDescription: boolean;
    showActions: boolean;
    instant: boolean;
}

// Mêmes unités aux deux bouts pour que Framer Motion interpole le masque
const CLOSED = "inset(0% 50% 0% 50%)";
const OPEN = "inset(-2% -2% -10% -2%)";

// Les mots montent en fondu, en cascade, une fois le cartouche presque déroulé
const RisingWords = ({ text }: { text: string }) => (
    <>
        {text.split(" ").map((word, i) => (
            <Fragment key={i}>
                {i > 0 && " "}
                <motion.span
                    className="inline-block"
                    initial={{ opacity: 0, y: "0.6em" }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 + i * 0.03, ease: "easeOut" }}
                >
                    {word}
                </motion.span>
            </Fragment>
        ))}
    </>
);

/** Cartouche de l'affiche : description puis boutons. L'espace est réservé dès le départ (aucun décalage de mise en page). */
const PosterCartouche = ({ description, showDescription, showActions, instant }: PosterCartoucheProps) => {
    const descriptionVisible = showDescription || instant;
    const actionsVisible = showActions || instant;
    return (
        <motion.div
            className={cn(
                "w-full max-w-3xl border border-poster-frame bg-poster-paper/85 px-5 py-4 shadow-[4px_4px_0_hsl(var(--poster-ink-shadow)/0.5)] md:px-10 md:py-6",
                !descriptionVisible && "invisible",
            )}
            // Dévoilé depuis le centre par un masque, sans mise à l'échelle : un scaleX étirait le texte pixelisé
            // pendant l'ouverture. Le masque final déborde pour laisser passer l'ombre portée.
            initial={instant ? false : { clipPath: CLOSED }}
            animate={{ clipPath: descriptionVisible ? OPEN : CLOSED }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            <h2 className="mb-4 text-balance text-center text-sm font-medium leading-relaxed text-poster-ink md:mb-5 md:text-xl">
                {descriptionVisible && !instant ? <RisingWords text={description} /> : description}
            </h2>
            <motion.div
                className={cn("flex justify-center", !actionsVisible && "invisible")}
                initial={instant ? false : { opacity: 0, y: 20 }}
                animate={actionsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <HeroActions compact />
            </motion.div>
        </motion.div>
    );
};

export default PosterCartouche;
