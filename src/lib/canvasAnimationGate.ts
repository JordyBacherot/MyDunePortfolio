/**
 * Suspend une animation (boucle canvas, vidéo…) quand l'élément est hors écran
 * ou que l'onglet est caché, et la relance quand il redevient visible.
 * `start` doit être idempotent (ne rien faire si l'animation tourne déjà).
 * Retourne une fonction de nettoyage à appeler au démontage.
 */
export function gateCanvasAnimation(
    element: Element,
    start: () => void,
    stop: () => void
): () => void {
    let onScreen = false;

    const update = () => {
        if (onScreen && !document.hidden) {
            start();
        } else {
            stop();
        }
    };

    const observer = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        update();
    });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);

    return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', update);
        stop();
    };
}
