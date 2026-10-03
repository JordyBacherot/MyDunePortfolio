import { describe, expect, it } from "vitest";
import { heroPlaybackReducer as reduce, initialPlaybackState, type PlaybackState } from "./heroPlayback";
import { CUE_TIMES } from "./heroTimeline";

const allCues = { name: true, frame: true, description: true, actions: true };
const loading = (): PlaybackState => reduce(initialPlaybackState(false), { type: "MOUNTED" });
const intro = (): PlaybackState => reduce(loading(), { type: "INTRO_PLAYING" });
const loop = (): PlaybackState => reduce(intro(), { type: "INTRO_ENDED" });

describe("heroPlaybackReducer", () => {
    it("démarre en mode statique quand les animations sont réduites", () => {
        expect(initialPlaybackState(true)).toEqual({ phase: "still", cues: allCues, paused: false });
    });

    it("démarre sur le poster, sans texte affiché", () => {
        const state = initialPlaybackState(false);
        expect(state.phase).toBe("start");
        expect(Object.values(state.cues).some(Boolean)).toBe(false);
    });

    it("passe en chargement au montage, puis en intro quand la vidéo joue", () => {
        expect(loading().phase).toBe("loading");
        expect(intro().phase).toBe("intro");
    });

    it("déclenche chaque repère quand le temps de l'intro le franchit", () => {
        let state = reduce(intro(), { type: "INTRO_TIME", time: CUE_TIMES.name - 0.01 });
        expect(state.cues.name).toBe(false);
        state = reduce(state, { type: "INTRO_TIME", time: CUE_TIMES.name });
        expect(state.cues).toEqual({ name: true, frame: false, description: false, actions: false });
        state = reduce(state, { type: "INTRO_TIME", time: CUE_TIMES.description + 0.1 });
        expect(state.cues).toEqual({ name: true, frame: true, description: true, actions: false });
    });

    it("ne retire jamais un repère déjà déclenché", () => {
        const state = reduce(reduce(intro(), { type: "INTRO_TIME", time: CUE_TIMES.frame + 0.2 }), { type: "INTRO_TIME", time: 1 });
        expect(state.cues.frame).toBe(true);
    });

    it("renvoie le même objet quand aucun repère ne change (pas de rendu inutile)", () => {
        const state = reduce(intro(), { type: "INTRO_TIME", time: CUE_TIMES.name + 0.1 });
        expect(reduce(state, { type: "INTRO_TIME", time: CUE_TIMES.name + 0.2 })).toBe(state);
    });

    it("ignore le temps hors de l'intro", () => {
        const state = loading();
        expect(reduce(state, { type: "INTRO_TIME", time: CUE_TIMES.actions + 1 })).toBe(state);
    });

    it("enchaîne sur la boucle à la fin de l'intro, avec tout le texte", () => {
        expect(loop()).toEqual({ phase: "loop", cues: allCues, paused: false });
    });

    it("saute l'intro depuis le poster, le chargement ou l'intro, mais pas en mode statique", () => {
        for (const state of [initialPlaybackState(false), loading(), intro()]) {
            expect(reduce(state, { type: "SKIP" }).phase).toBe("loop");
        }
        const still = initialPlaybackState(true);
        expect(reduce(still, { type: "SKIP" })).toBe(still);
    });

    it("passe sur la boucle si le thème ou le format change pendant l'intro", () => {
        expect(reduce(intro(), { type: "VARIANT_CHANGED" }).phase).toBe("loop");
        const state = loading();
        expect(reduce(state, { type: "VARIANT_CHANGED" })).toBe(state);
    });

    it("bascule en mode statique sur erreur vidéo", () => {
        expect(reduce(intro(), { type: "MEDIA_ERROR" })).toEqual({ phase: "still", cues: allCues, paused: false });
        expect(reduce(loop(), { type: "MEDIA_ERROR" }).phase).toBe("still");
    });

    it("bascule en mode statique si l'intro ne démarre pas à temps", () => {
        expect(reduce(loading(), { type: "START_TIMEOUT" }).phase).toBe("still");
        const playing = intro();
        expect(reduce(playing, { type: "START_TIMEOUT" })).toBe(playing);
    });

    it("met en pause et relance seulement pendant la boucle", () => {
        const paused = reduce(loop(), { type: "TOGGLE_PAUSE" });
        expect(paused.paused).toBe(true);
        expect(reduce(paused, { type: "TOGGLE_PAUSE" }).paused).toBe(false);
        const playing = intro();
        expect(reduce(playing, { type: "TOGGLE_PAUSE" })).toBe(playing);
    });
});
