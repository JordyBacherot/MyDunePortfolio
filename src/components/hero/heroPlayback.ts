import { CUE_TIMES, type Cue } from "./heroTimeline";

export type Phase = "start" | "loading" | "intro" | "loop" | "still";

export interface PlaybackState {
    phase: Phase;
    cues: Readonly<Record<Cue, boolean>>;
    paused: boolean;
}

export type PlaybackEvent =
    | { type: "MOUNTED" }
    | { type: "INTRO_PLAYING" }
    | { type: "INTRO_TIME"; time: number }
    | { type: "INTRO_ENDED" }
    | { type: "SKIP" }
    | { type: "REVEAL" }
    | { type: "VARIANT_CHANGED" }
    | { type: "MEDIA_ERROR" }
    | { type: "START_TIMEOUT" }
    | { type: "TOGGLE_PAUSE" };

const NO_CUES: Record<Cue, boolean> = { name: false, frame: false, description: false, actions: false };
const ALL_CUES: Record<Cue, boolean> = { name: true, frame: true, description: true, actions: true };

export function initialPlaybackState(startsStill: boolean): PlaybackState {
    return startsStill
        ? { phase: "still", cues: ALL_CUES, paused: false }
        : { phase: "start", cues: NO_CUES, paused: false };
}

const toLoop = (state: PlaybackState): PlaybackState => ({ ...state, phase: "loop", cues: ALL_CUES, paused: false });
const toStill = (state: PlaybackState): PlaybackState => ({ ...state, phase: "still", cues: ALL_CUES, paused: false });

/** Machine à états de la lecture du Hero : pure, sans DOM (testée dans heroPlayback.test.ts) */
export function heroPlaybackReducer(state: PlaybackState, event: PlaybackEvent): PlaybackState {
    switch (event.type) {
        case "MOUNTED":
            return state.phase === "start" ? { ...state, phase: "loading" } : state;
        case "INTRO_PLAYING":
            return state.phase === "loading" ? { ...state, phase: "intro" } : state;
        case "INTRO_TIME": {
            if (state.phase !== "intro") return state;
            let changed = false;
            const cues = { ...state.cues };
            for (const cue of Object.keys(CUE_TIMES) as Cue[]) {
                if (!cues[cue] && event.time >= CUE_TIMES[cue]) {
                    cues[cue] = true;
                    changed = true;
                }
            }
            return changed ? { ...state, cues } : state;
        }
        case "INTRO_ENDED":
            return state.phase === "intro" ? toLoop(state) : state;
        case "SKIP":
            return state.phase === "start" || state.phase === "loading" || state.phase === "intro" ? toLoop(state) : state;
        case "REVEAL": {
            // Tout le texte d'un coup (défilement, clic) ; la vidéo poursuit son intro
            const playing = state.phase === "start" || state.phase === "loading" || state.phase === "intro";
            return playing && Object.values(state.cues).some((shown) => !shown) ? { ...state, cues: ALL_CUES } : state;
        }
        case "VARIANT_CHANGED":
            return state.phase === "intro" ? toLoop(state) : state;
        case "MEDIA_ERROR":
            return state.phase === "still" ? state : toStill(state);
        case "START_TIMEOUT":
            return state.phase === "start" || state.phase === "loading" ? toStill(state) : state;
        case "TOGGLE_PAUSE":
            return state.phase === "loop" ? { ...state, paused: !state.paused } : state;
    }
}
