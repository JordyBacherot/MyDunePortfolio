import { describe, expect, it } from "vitest";
import { DEFAULT_TITLE_EFFECT, resolveTitleEffect } from "./titleEffects";

describe("resolveTitleEffect", () => {
    it("lit l'effet demandé dans l'URL", () => {
        expect(resolveTitleEffect("?titleFx=b")).toBe("b");
        expect(resolveTitleEffect("?lang=fr&titleFx=c")).toBe("c");
    });

    it("revient à l'effet par défaut sinon", () => {
        expect(resolveTitleEffect("")).toBe(DEFAULT_TITLE_EFFECT);
        expect(resolveTitleEffect("?titleFx=z")).toBe(DEFAULT_TITLE_EFFECT);
    });
});
