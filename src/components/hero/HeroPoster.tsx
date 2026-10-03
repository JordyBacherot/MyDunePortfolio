import { useRef } from "react";
import { Pause, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import PosterBackdrop from "./PosterBackdrop";
import PosterCartouche from "./PosterCartouche";
import PosterFrame from "./PosterFrame";
import PosterTitle from "./PosterTitle";
import { heroMedia } from "./heroMedia";
import { DEFAULT_TITLE_EFFECT, resolveTitleEffect } from "./titleEffects";
import { useHeroFormat } from "./useHeroFormat";
import { useHeroPlayback } from "./useHeroPlayback";
import { useIsDarkTheme } from "./useIsDarkTheme";

// En développement, ?titleFx=a|b|c compare les effets du nom
const titleEffect = import.meta.env.DEV ? resolveTitleEffect(window.location.search) : DEFAULT_TITLE_EFFECT;

/** Hero de l'univers Dune : affiche animée (vidéo HyperFrames) et texte HTML synchronisé sur sa timeline */
const HeroPoster = () => {
    const { t } = useLanguage();
    const heroRef = useRef<HTMLElement | null>(null);
    const theme = useIsDarkTheme() ? "dark" : "light";
    const format = useHeroFormat(heroRef);
    const variantKey = `${theme}-${format}`;
    const playback = useHeroPlayback(heroRef, variantKey);
    const { phase, cues, paused } = playback.state;

    return (
        <section id="profil" ref={heroRef} className="relative flex min-h-[90vh] w-full flex-col overflow-hidden">
            <PosterBackdrop
                media={heroMedia(theme, format)}
                variantKey={variantKey}
                phase={phase}
                paused={paused}
                setIntroVideo={playback.setIntroVideo}
                onIntroPlaying={playback.onIntroPlaying}
                onIntroEnded={playback.onIntroEnded}
                onMediaError={playback.onMediaError}
            />
            <PosterFrame show={cues.frame} instant={playback.instant} />
            <div className="relative z-20 flex flex-1 flex-col items-center justify-between gap-8 px-6 pb-[5vh] pt-[7vh]">
                <PosterTitle text={t.hero.name} show={cues.name} instant={playback.instant} effect={titleEffect} />
                <PosterCartouche
                    description={t.hero.description}
                    showDescription={cues.description}
                    showActions={cues.actions}
                    instant={playback.instant}
                />
            </div>
            {phase === "loop" && (
                <button
                    type="button"
                    onClick={playback.togglePause}
                    aria-label={paused ? t.hero.playAnimation : t.hero.pauseAnimation}
                    className="absolute right-7 top-7 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-poster-frame bg-poster-paper/80 text-poster-ink transition-colors hover:bg-poster-paper"
                >
                    {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
                </button>
            )}
        </section>
    );
};

export default HeroPoster;
