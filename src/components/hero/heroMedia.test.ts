import { describe, expect, it } from "vitest";
import { heroMedia } from "./heroMedia";

describe("heroMedia", () => {
    it("fournit les 8 fichiers de chacune des 4 variantes", () => {
        for (const theme of ["light", "dark"] as const) {
            for (const format of ["landscape", "portrait"] as const) {
                const media = heroMedia(theme, format);
                const urls = [media.intro.webm, media.intro.mp4, media.loop.webm, media.loop.mp4, media.start.avif, media.start.webp, media.final.avif, media.final.webp];
                for (const url of urls) expect(url).toContain(`hero-${theme}-${format}-`);
            }
        }
    });
});
