import { useEffect, useRef } from 'react';
import { gateCanvasAnimation } from '@/lib/canvasAnimationGate';

interface SandwormTrailProps {
    variant?: 'desktop-horizontal' | 'mobile-vertical';
}

const SandwormTrail = ({ variant = 'desktop-horizontal' }: SandwormTrailProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const setCanvasSize = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        setCanvasSize();

        let resizeTimeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(setCanvasSize, 200);
        };
        window.addEventListener('resize', handleResize);

        // --- CONFIGURATION ---
        const WORM_SIZE = 140;
        const SEGMENT_COUNT = 100;

        const THUMPER_X_RATIO = 0.85;

        // --- STATE ---
        let time = 0;
        const isMobile = variant === 'mobile-vertical';

        // Mobile config overrides
        const wormSize = isMobile ? 45 : WORM_SIZE; // Smaller on mobile
        const segmentCount = isMobile ? 40 : SEGMENT_COUNT; // Drastically reduced on mobile

        // Vitesses en px par image (60 i/s sur ordinateur, 30 sur mobile) : arrivée rapide, puis départ qui accélère
        const APPROACH_SPEED = isMobile ? 8 : 6;
        const LEAVE_SPEED_START = 2;
        const LEAVE_SPEED_MAX = isMobile ? 8 : 9;
        const LEAVE_ACCEL = 0.12;
        // Un anneau du corps tous les SPACING px parcourus : la longueur du ver ne dépend pas de sa vitesse
        const SPACING = isMobile ? 3.2 : 3.5;
        // Départ juste hors champ (auparavant 1000 px à gauche, soit ~5 s d'attente)
        const START_X = -wormSize * 2;

        // Initial positions based on variant
        let wormX = isMobile ? canvas.width / 2 : START_X;
        let wormY = isMobile ? -200 : canvas.height / 2;
        let prevX = wormX;
        let prevY = wormY;
        let trail = 0;
        let leaveSpeed = LEAVE_SPEED_START;

        let thumperActive = true;
        let thumperScale = 1;
        let thumperFallY = 0;

        // Animation State Machine
        type WormState = 'APPROACH' | 'EMERGE' | 'DEVOUR' | 'LEAVE';
        let currentState: WormState = 'APPROACH';
        let stateTimer = 0;

        // Visual State
        let wormOpacity = 0;
        let mouthOpen = 0;
        let headLift = 0;

        // Worm segments (trail)
        const segments: { x: number; y: number; size: number }[] = [];
        // Initialize segments off-screen
        for (let i = 0; i < segmentCount; i++) {
            if (isMobile) {
                segments.push({ x: canvas.width / 2, y: -500 - i * 10, size: wormSize });
            } else {
                segments.push({ x: START_X - i * SPACING, y: canvas.height / 2, size: wormSize });
            }
        }

        // Thumper Rings
        const rings: { r: number; opacity: number }[] = [];

        // PRE-RENDER TEETH PATTERN
        const teethCanvas = document.createElement('canvas');
        const maxMouthSize = wormSize * 1.2;
        teethCanvas.width = maxMouthSize * 2;
        teethCanvas.height = maxMouthSize * 2;
        const teethCtx = teethCanvas.getContext('2d')!;

        teethCtx.translate(maxMouthSize, maxMouthSize);
        const ringCount = isMobile ? 3 : 5; // Less detail on mobile
        for (let r = 0; r < ringCount; r++) {
            const ringRadius = maxMouthSize * (1 - r * 0.15);
            const teethCount = isMobile ? 10 - r * 2 : 20 - r * 2;

            for (let t = 0; t < teethCount; t++) {
                const angle = (t / teethCount) * Math.PI * 2;
                const tx = Math.cos(angle) * ringRadius;
                const ty = Math.sin(angle) * ringRadius;

                teethCtx.save();
                teethCtx.translate(tx, ty);
                teethCtx.rotate(angle + Math.PI / 2);

                teethCtx.beginPath();
                teethCtx.moveTo(0, 0);
                teethCtx.lineTo(-3, -10);
                teethCtx.lineTo(3, -10);
                teethCtx.closePath();
                teethCtx.fillStyle = 'rgba(240, 240, 255, 1)';
                teethCtx.fill();
                teethCtx.restore();
            }
        }

        // PRE-RENDER SEGMENT (Body)
        const segmentCanvas = document.createElement('canvas');
        const segSize = wormSize * 2; // Max size
        segmentCanvas.width = segSize;
        segmentCanvas.height = segSize;
        const segCtx = segmentCanvas.getContext('2d')!;

        const segGrad = segCtx.createLinearGradient(segSize / 2, 0, segSize / 2, segSize);
        segGrad.addColorStop(0, `rgba(60, 30, 10, 1)`);
        segGrad.addColorStop(0.5, `rgba(100, 50, 20, 1)`);
        segGrad.addColorStop(1, `rgba(40, 20, 5, 1)`);

        segCtx.fillStyle = segGrad;
        segCtx.beginPath();
        segCtx.arc(segSize / 2, segSize / 2, segSize / 2, 0, Math.PI * 2);
        segCtx.fill();

        // Add stroke to sprite
        segCtx.strokeStyle = `rgba(30, 15, 5, 0.5)`;
        segCtx.lineWidth = 2; // Scaled up
        segCtx.stroke();

        // Calque du corps (voir le dessin du corps dans animate)
        const bodyCanvas = document.createElement('canvas');
        const bodyCtx = bodyCanvas.getContext('2d')!;

        let lastFrameTime = 0;
        const targetFPS = isMobile ? 30 : 60;
        const frameInterval = 1000 / targetFPS;

        const animate = (timestamp: number) => {
            const elapsed = timestamp - lastFrameTime;

            if (elapsed > frameInterval) {
                lastFrameTime = timestamp - (elapsed % frameInterval);

                time += 0.05;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const thumperX = isMobile ? canvas.width / 2 : canvas.width * THUMPER_X_RATIO;
                const thumperY = isMobile ? canvas.height - 1500 : canvas.height / 2;

                // --- STATE LOGIC ---
                let speed = 0;

                switch (currentState) {
                    case 'APPROACH':
                        speed = APPROACH_SPEED;
                        wormOpacity = 0.1;
                        mouthOpen = 0;
                        headLift = 0;

                        const hasReached = isMobile ? (wormY >= thumperY) : (wormX >= thumperX);

                        if (hasReached) {
                            currentState = 'EMERGE';
                            stateTimer = 0;
                        }
                        break;

                    case 'EMERGE':
                        speed = 0;
                        stateTimer += 0.02;

                        wormOpacity = Math.min(1, wormOpacity + 0.02);
                        mouthOpen = Math.min(1, mouthOpen + 0.015);
                        headLift = Math.min(70, headLift + 0.5);

                        if (mouthOpen > 0.95) {
                            currentState = 'DEVOUR';
                            stateTimer = 0;
                        }
                        break;

                    case 'DEVOUR':
                        stateTimer += 0.02;
                        speed = 0;
                        mouthOpen = 1.0;

                        if (thumperActive && stateTimer < 1.5) {
                            thumperScale = Math.max(0.1, 1 - stateTimer * 0.6);
                            thumperFallY = stateTimer * -30;
                        } else if (thumperActive) {
                            thumperActive = false;
                        }

                        if (stateTimer > 2) {
                            currentState = 'LEAVE';
                            leaveSpeed = LEAVE_SPEED_START;
                        }
                        break;

                    case 'LEAVE': {
                        // Repart doucement puis accélère : la boucle reprend dès que la queue a quitté l'écran
                        leaveSpeed = Math.min(LEAVE_SPEED_MAX, leaveSpeed + LEAVE_ACCEL);
                        speed = leaveSpeed;
                        wormOpacity = Math.max(0.1, wormOpacity - 0.005);
                        mouthOpen = Math.max(0, mouthOpen - 0.02);
                        headLift = Math.max(0, headLift - 0.5);

                        const tail = segments[segments.length - 1];
                        const isGone = isMobile ? (tail.y > canvas.height + wormSize) : (tail.x > canvas.width + wormSize * 2);

                        if (isGone) {
                            if (isMobile) {
                                wormY = -200;
                                wormX = canvas.width / 2;
                            } else {
                                wormX = START_X;
                            }
                            prevX = wormX;
                            prevY = wormY;
                            trail = 0;

                            currentState = 'APPROACH';
                            thumperActive = true;
                            thumperScale = 1;
                            thumperFallY = 0;
                            // Reset segments
                            for (let i = 0; i < segmentCount; i++) {
                                if (isMobile) {
                                    segments[i] = { x: canvas.width / 2, y: -200 - i * 10, size: wormSize };
                                } else {
                                    segments[i] = { x: START_X - i * SPACING, y: canvas.height / 2, size: wormSize };
                                }
                            }
                        }
                        break;
                    }
                }

                // --- UPDATE POSITION ---
                if (isMobile) {
                    wormY += speed;
                    const waveAmp = (currentState === 'EMERGE' || currentState === 'DEVOUR') ? 2 : 15;
                    const waveX = Math.sin(time * 0.5) * waveAmp + Math.sin(time * 0.2) * (waveAmp / 2);
                    wormX = canvas.width / 2 + waveX;
                } else {
                    wormX += speed;
                    const waveAmp = (currentState === 'EMERGE' || currentState === 'DEVOUR') ? 2 : 40;
                    const waveY = Math.sin(time * 0.5) * waveAmp + Math.sin(time * 0.2) * (waveAmp / 2);
                    wormY = canvas.height / 2 + waveY - headLift;
                }

                // Update Segments : anneaux intercalés tous les SPACING px, du plus ancien au plus récent
                if (speed > 0) {
                    trail += Math.hypot(wormX - prevX, wormY - prevY);
                    const added = Math.floor(trail / SPACING);
                    for (let k = 1; k <= added; k++) {
                        const f = k / added;
                        segments.unshift({ x: prevX + (wormX - prevX) * f, y: prevY + (wormY - prevY) * f, size: wormSize });
                    }
                    trail -= added * SPACING;
                    if (segments.length > segmentCount) segments.length = segmentCount;
                }
                prevX = wormX;
                prevY = wormY;


                // --- 1. DRAW SAND WAVES ---
                ctx.beginPath();
                for (let side = -1; side <= 1; side += 2) {
                    for (let i = 0; i < segments.length; i += 3) {
                        const s = segments[i];
                        const waveOffset = s.size * 1.4 * side;

                        let waveX, waveY;
                        if (isMobile) {
                            waveX = s.x + waveOffset;
                            waveY = s.y - 10;
                        } else {
                            waveX = s.x - 20;
                            waveY = s.y + waveOffset;
                        }

                        if (i === 0) ctx.moveTo(waveX, waveY);
                        else ctx.lineTo(waveX, waveY);
                    }
                }
                ctx.strokeStyle = `rgba(210, 144, 38, ${0.5 + wormOpacity * 0.3})`;
                ctx.lineWidth = 5;
                ctx.stroke();

                // Inner thicker dust wave
                ctx.beginPath();
                for (let side = -1; side <= 1; side += 2) {
                    for (let i = 0; i < segments.length; i += 4) {
                        const s = segments[i];
                        const waveOffset = s.size * 1.0 * side;

                        let waveX, waveY;
                        if (isMobile) {
                            waveX = s.x + waveOffset;
                            waveY = s.y - 10;
                        } else {
                            waveX = s.x - 20;
                            waveY = s.y + waveOffset;
                        }

                        if (i === 0) ctx.moveTo(waveX, waveY);
                        else ctx.lineTo(waveX, waveY);
                    }
                }
                ctx.strokeStyle = `rgba(217, 119, 6, ${0.15 + wormOpacity * 0.15})`;
                ctx.lineWidth = 20;
                ctx.lineCap = 'round';
                ctx.stroke();


                // --- 2. DRAW WORM BODY ---
                // Corps opaque sur un calque à part, puis posé avec une seule transparence : des anneaux
                // semi-transparents superposés formaient une traînée floue quand le ver entre ou sort par un bord
                if (bodyCanvas.width !== canvas.width || bodyCanvas.height !== canvas.height) {
                    bodyCanvas.width = canvas.width;
                    bodyCanvas.height = canvas.height;
                }
                bodyCtx.clearRect(0, 0, bodyCanvas.width, bodyCanvas.height);
                for (let i = segments.length - 1; i >= 0; i--) {
                    const s = segments[i];
                    const size = s.size * (1 - (i / segmentCount) * 0.3);
                    bodyCtx.drawImage(segmentCanvas, s.x - size, s.y - size, size * 2, size * 2);
                }
                ctx.globalAlpha = wormOpacity;
                ctx.drawImage(bodyCanvas, 0, 0);
                ctx.globalAlpha = 1.0;

                // Draw Head (Circular Mouth)
                const headX = wormX;
                const headY = wormY;
                const headSize = wormSize;

                if (wormOpacity > 0.1) {
                    ctx.save();
                    ctx.translate(headX, headY);
                    if (isMobile) ctx.rotate(Math.PI / 2);

                    // Outer Skin Ring
                    ctx.beginPath();
                    ctx.arc(0, 0, headSize * 1.1, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(42, 26, 16, ${wormOpacity})`;
                    ctx.fill();

                    if (mouthOpen > 0.05) {
                        const maxRadius = headSize;
                        const currentRadius = maxRadius * mouthOpen;

                        // Black Void Center
                        ctx.beginPath();
                        ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
                        ctx.fillStyle = 'black';
                        ctx.fill();

                        // Draw pre-rendered teeth
                        ctx.save();
                        const scale = currentRadius / maxMouthSize;
                        ctx.scale(scale, scale);
                        ctx.globalAlpha = wormOpacity;
                        ctx.drawImage(teethCanvas, -maxMouthSize, -maxMouthSize);
                        ctx.restore();

                        // Deep Throat Glow
                        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius * 0.5);
                        glow.addColorStop(0, `rgba(255, 100, 0, ${wormOpacity * 0.8})`);
                        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
                        ctx.fillStyle = glow;
                        ctx.fill();

                    } else {
                        // Closed Head (Round)
                        ctx.beginPath();
                        ctx.arc(0, 0, headSize, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(42, 26, 16, ${wormOpacity})`;
                        ctx.fill();
                    }
                    ctx.restore();
                }


                // --- 3. DRAW THUMPER (on top) ---
                if (thumperActive) {
                    ctx.save();
                    ctx.translate(thumperX, thumperY + thumperFallY);
                    const baseScale = isMobile ? 0.6 : 1.0;
                    ctx.scale(thumperScale * baseScale, thumperScale * baseScale);

                    // Legs
                    ctx.strokeStyle = '#2a1a10';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(0, 50);
                    ctx.lineTo(-20, 80);
                    ctx.moveTo(0, 50);
                    ctx.lineTo(20, 80);
                    ctx.stroke();

                    // Body
                    ctx.fillStyle = '#4a3b2a';
                    ctx.fillRect(-8, -60, 16, 110);

                    // Details
                    ctx.fillStyle = '#1a1008';
                    ctx.fillRect(-10, -20, 20, 10);
                    ctx.fillRect(-10, 20, 20, 10);

                    // Hammer
                    const thumpCycle = Math.sin(time * 0.8);
                    const hammerY = -80 + (thumpCycle > 0.8 ? -30 : 0);

                    ctx.fillStyle = '#6d4c41';
                    ctx.beginPath();
                    ctx.roundRect(-25, hammerY, 50, 25, 5);
                    ctx.fill();

                    // Rings
                    if (thumpCycle > 0.95 && Math.random() > 0.7) {
                        rings.push({ r: 20, opacity: 0.8 });
                    }

                    ctx.lineWidth = 2;
                    for (let i = rings.length - 1; i >= 0; i--) {
                        const ring = rings[i];
                        ring.r += 3;
                        ring.opacity -= 0.015;

                        ctx.beginPath();
                        ctx.ellipse(0, 70, ring.r, ring.r * 0.3, 0, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(217, 119, 6, ${ring.opacity})`;
                        ctx.stroke();

                        if (ring.opacity <= 0) rings.splice(i, 1);
                    }

                    ctx.restore();
                }
            }

            if (running) animationFrameId = requestAnimationFrame(animate);
        };

        let animationFrameId = 0;
        let running = false;
        const startLoop = () => {
            if (running) return;
            running = true;
            lastFrameTime = 0;
            animationFrameId = requestAnimationFrame(animate);
        };
        const stopLoop = () => {
            running = false;
            cancelAnimationFrame(animationFrameId);
        };
        const ungate = gateCanvasAnimation(canvas, startLoop, stopLoop);

        return () => {
            window.removeEventListener('resize', handleResize);
            ungate();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
        />
    );
};

export default SandwormTrail;
