import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gateCanvasAnimation } from "@/lib/canvasAnimationGate";
import { cn } from "@/lib/utils";
import type { HeroVariantMedia } from "./heroMedia";
import type { Phase } from "./heroPlayback";
import { CROSSFADE_S } from "./heroTimeline";

interface PosterBackdropProps {
    media: HeroVariantMedia;
    variantKey: string;
    phase: Phase;
    paused: boolean;
    setIntroVideo: (video: HTMLVideoElement | null) => void;
    onIntroPlaying: () => void;
    onIntroEnded: () => void;
    onMediaError: () => void;
}

const LAYER = "absolute inset-0 h-full w-full object-cover";
// WebM en AV1 (profil Main, niveau 5.0 pour le 2560×1440) : sans décodeur AV1, le navigateur prend directement le MP4 H.264
const AV1 = 'video/webm; codecs="av01.0.12M.08"';
const FADE = { duration: CROSSFADE_S };

/** Couches du fond : image de départ, image finale (sous la boucle), intro jouée une fois, boucle d'ambiance */
const PosterBackdrop = ({ media, variantKey, phase, paused, setIntroVideo, onIntroPlaying, onIntroEnded, onMediaError }: PosterBackdropProps) => {
    const [loopVideo, setLoopVideo] = useState<HTMLVideoElement | null>(null);
    const keepLoopVideo = useCallback((video: HTMLVideoElement | null) => {
        if (video) setLoopVideo(video);
    }, []);
    const resting = phase === "loop" || phase === "still";

    // La boucle ne tourne qu'à l'écran, onglet visible, sans pause demandée
    useEffect(() => {
        if (!loopVideo) return;
        if (phase !== "loop" || paused) {
            loopVideo.pause();
            return;
        }
        return gateCanvasAnimation(
            loopVideo,
            () => void loopVideo.play().catch(() => undefined),
            () => loopVideo.pause(),
        );
    }, [loopVideo, phase, paused]);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
            {/* Image de départ : peinte immédiatement (candidat LCP), inutile au repos (jamais chargée en mode statique) */}
            {!resting && (
                <picture>
                    <source srcSet={media.start.avif} type="image/avif" />
                    <img src={media.start.webp} alt="" className={LAYER} draggable={false} fetchPriority="high" />
                </picture>
            )}
            {/* Image finale (= première image de la boucle) : chargée tôt, affichée au repos */}
            <picture>
                <source srcSet={media.final.avif} type="image/avif" />
                <img src={media.final.webp} alt="" className={cn(LAYER, !resting && "opacity-0")} draggable={false} />
            </picture>

            <AnimatePresence>
                {(phase === "loading" || phase === "intro") && (
                    <motion.video
                        key={`intro-${variantKey}`}
                        ref={setIntroVideo}
                        className={LAYER}
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        initial={false}
                        exit={{ opacity: 0 }}
                        transition={FADE}
                        onPlaying={onIntroPlaying}
                        onEnded={onIntroEnded}
                    >
                        <source src={media.intro.webm} type={AV1} />
                        <source src={media.intro.mp4} type="video/mp4" onError={onMediaError} />
                    </motion.video>
                )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
                {(phase === "intro" || phase === "loop") && (
                    <motion.video
                        key={`loop-${variantKey}`}
                        ref={keepLoopVideo}
                        className={LAYER}
                        muted
                        playsInline
                        loop
                        preload="auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase === "loop" ? 1 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={FADE}
                    >
                        <source src={media.loop.webm} type={AV1} />
                        <source src={media.loop.mp4} type="video/mp4" onError={onMediaError} />
                    </motion.video>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PosterBackdrop;
