/**
 * Défilement rapide vers une section (0,35 à 0,75 s selon la distance) au lieu du saut instantané d'une ancre.
 * Instantané si les animations sont réduites ; interrompu dès que l'utilisateur fait défiler lui-même.
 */
export function fastScrollTo(id: string): void {
    const target = document.getElementById(id);
    if (!target) return;
    const start = window.scrollY;
    const end = start + target.getBoundingClientRect().top;
    history.pushState(null, "", `#${id}`);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo(0, end);
        return;
    }

    const distance = end - start;
    const duration = Math.min(750, Math.max(350, 250 + Math.abs(distance) * 0.12));
    const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
    let frame = 0;
    const cancel = () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("wheel", cancel);
        window.removeEventListener("touchstart", cancel);
        window.removeEventListener("keydown", cancel);
    };
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", cancel);

    const t0 = performance.now();
    const step = (now: number) => {
        const u = Math.min(1, (now - t0) / duration);
        window.scrollTo(0, start + distance * ease(u));
        if (u < 1) frame = window.requestAnimationFrame(step);
        else cancel();
    };
    frame = window.requestAnimationFrame(step);
}
