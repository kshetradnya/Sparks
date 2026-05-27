import { useEffect, useState, useRef, useCallback } from "react";
import type { FC } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

type Phase = "dark" | "strike" | "shower" | "ignite" | "fading";

/* ── Spark particle ── */
interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  bright: number; // 0–1, controls white-hot vs dim orange
  trail: { x: number; y: number }[];
}

/* ── Ember (slow-floating afterglow) ── */
interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  hue: number; // 20–45
}

export const LoadingScreen: FC<LoadingScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<Phase>("dark");
  const [textGlow, setTextGlow] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const embersRef = useRef<Ember[]>([]);
  const rafRef = useRef(0);
  const frameRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; });

  /* Phase timing — sequential via phase state to avoid strict-mode timer issues */
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    switch (phase) {
      case "dark":     t = setTimeout(() => setPhase("strike"), 400); break;
      case "strike":   t = setTimeout(() => setPhase("shower"), 500); break;
      case "shower":   t = setTimeout(() => setPhase("ignite"), 1700); break;
      case "ignite":   t = setTimeout(() => setPhase("fading"), 1200); break;
      case "fading":   t = setTimeout(() => onCompleteRef.current(), 700); break;
      default: return;
    }
    return () => clearTimeout(t);
  }, [phase]);

  /* Text glow ramp */
  useEffect(() => {
    if (phase !== "ignite" && phase !== "fading") return;
    const start = performance.now();
    const dur = phase === "ignite" ? 800 : 500;
    const from = textGlow;
    const to = phase === "fading" ? 1 : 0.85;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setTextGlow(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* Spawn realistic sparks — fast, bright, with gravity and trails */
  const spawnSparks = useCallback(
    (cx: number, cy: number, count: number, force: number, spread: number) => {
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * spread;
        const speed = force * (0.4 + Math.random() * 0.8);
        const bright = Math.random();
        sparksRef.current.push({
          x: cx + (Math.random() - 0.5) * 8,
          y: cy + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 0.4 + Math.random() * 1.0,
          size: bright > 0.7 ? 1.5 + Math.random() * 2.5 : 0.5 + Math.random() * 1.5,
          bright,
          trail: [],
        });
      }
    },
    []
  );

  /* Spawn slow embers — float upward gently */
  const spawnEmbers = useCallback((cx: number, cy: number, count: number) => {
    for (let i = 0; i < count; i++) {
      embersRef.current.push({
        x: cx + (Math.random() - 0.5) * 120,
        y: cy + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(0.3 + Math.random() * 1.2),
        life: 1,
        size: 1 + Math.random() * 2.5,
        hue: 20 + Math.random() * 25,
      });
    }
  }, []);

  /* Main canvas loop */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      c.width = innerWidth * devicePixelRatio;
      c.height = innerHeight * devicePixelRatio;
      c.style.width = innerWidth + "px";
      c.style.height = innerHeight + "px";
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      frameRef.current++;
      const W = innerWidth;
      const H = innerHeight;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H * 0.46;

      /* ── STRIKE phase: single bright flash + initial burst ── */
      if (phase === "strike") {
        // Flash
        const flash = Math.max(0, 1 - frameRef.current * 0.08);
        if (flash > 0) {
          ctx.save();
          ctx.globalAlpha = flash * 0.6;
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
          g.addColorStop(0, "#fff");
          g.addColorStop(0.3, "rgba(255,200,100,0.8)");
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
          ctx.restore();
        }
        // Initial burst
        if (frameRef.current % 2 === 0) spawnSparks(cx, cy, 12, 14, Math.PI * 1.6);
      }

      /* ── SHOWER phase: continuous cascading sparks ── */
      if (phase === "shower") {
        // Main shower from center
        if (frameRef.current % 2 === 0) spawnSparks(cx, cy, 8, 10, Math.PI * 1.4);
        // Side cascades
        if (frameRef.current % 4 === 0) {
          spawnSparks(cx - 60, cy + 10, 3, 7, Math.PI);
          spawnSparks(cx + 60, cy + 10, 3, 7, Math.PI);
        }
        // Embers
        if (frameRef.current % 6 === 0) spawnEmbers(cx, cy, 2);

        // Core glow
        ctx.save();
        const pulse = 0.15 + Math.sin(frameRef.current * 0.1) * 0.05;
        const coreG = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160);
        coreG.addColorStop(0, `rgba(255,180,60,${pulse})`);
        coreG.addColorStop(0.5, `rgba(255,100,20,${pulse * 0.3})`);
        coreG.addColorStop(1, "transparent");
        ctx.fillStyle = coreG;
        ctx.fillRect(cx - 200, cy - 200, 400, 400);
        ctx.restore();
      }

      /* ── IGNITE phase: big burst then dying down ── */
      if (phase === "ignite") {
        if (frameRef.current % 3 === 0) spawnSparks(cx, cy, 5, 12, Math.PI * 2);
        if (frameRef.current % 5 === 0) spawnEmbers(cx, cy, 3);

        // Bright reveal glow
        ctx.save();
        const revealG = ctx.createRadialGradient(cx, cy, 0, cx, cy, 280);
        revealG.addColorStop(0, "rgba(255,200,100,0.2)");
        revealG.addColorStop(0.4, "rgba(255,140,40,0.06)");
        revealG.addColorStop(1, "transparent");
        ctx.fillStyle = revealG;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      /* ── FADING phase: just embers drifting ── */
      if (phase === "fading") {
        if (frameRef.current % 8 === 0) spawnEmbers(cx, cy, 1);
      }

      /* ── Update & draw sparks ── */
      sparksRef.current = sparksRef.current.filter((s) => {
        // Physics
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 6) s.trail.shift();

        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.18; // gravity
        s.vx *= 0.99;
        s.life -= 1 / 60 / s.maxLife;

        if (s.life <= 0) return false;

        const alpha = s.life * s.life;

        // Draw trail
        if (s.trail.length > 1) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(s.trail[0].x, s.trail[0].y);
          for (let i = 1; i < s.trail.length; i++) {
            ctx.lineTo(s.trail[i].x, s.trail[i].y);
          }
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle =
            s.bright > 0.7
              ? `rgba(255,240,200,${alpha * 0.6})`
              : `rgba(255,160,40,${alpha * 0.4})`;
          ctx.lineWidth = s.size * 0.5 * s.life;
          ctx.stroke();
          ctx.restore();
        }

        // Draw spark head
        ctx.save();
        ctx.globalAlpha = alpha;

        // Glow
        ctx.shadowBlur = s.bright > 0.7 ? s.size * 14 : s.size * 8;
        ctx.shadowColor =
          s.bright > 0.7 ? "rgba(255,220,150,0.9)" : "rgba(255,120,20,0.7)";

        // Core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fillStyle =
          s.bright > 0.85
            ? "#fffaf0" // white-hot
            : s.bright > 0.5
            ? "#ffd080" // bright orange
            : "#ff8020"; // deep orange
        ctx.fill();

        ctx.restore();
        return true;
      });

      /* ── Update & draw embers ── */
      embersRef.current = embersRef.current.filter((e) => {
        e.x += e.vx + Math.sin(frameRef.current * 0.02 + e.hue) * 0.3;
        e.y += e.vy;
        e.life -= 0.003;
        if (e.life <= 0) return false;

        ctx.save();
        ctx.globalAlpha = e.life * e.life * 0.7;
        ctx.shadowBlur = e.size * 6;
        ctx.shadowColor = `hsla(${e.hue}, 100%, 55%, 0.6)`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * e.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 100%, ${55 + e.life * 20}%, 1)`;
        ctx.fill();
        ctx.restore();
        return true;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    // Reset frame counter on phase change
    frameRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [phase, spawnSparks, spawnEmbers]);

  const done = phase === "fading";

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-bg overflow-hidden"
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: done ? 0.7 : 0 }}
      style={{ pointerEvents: done ? "none" : "auto" }}
    >
      {/* Spark canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />

      {/* Central impact point — a bright molten core during strike/shower */}
      {(phase === "strike" || phase === "shower") && (
        <motion.div
          className="absolute z-10 pointer-events-none"
          style={{
            left: "50%",
            top: "46%",
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: phase === "strike" ? [0, 1, 0.7] : [0.7, 0.5, 0.7],
            scale: phase === "strike" ? [0, 1.5, 1] : [1, 1.1, 1],
          }}
          transition={{
            duration: phase === "strike" ? 0.5 : 1.5,
            repeat: phase === "shower" ? Infinity : 0,
            repeatType: "reverse",
          }}
        >
          <div
            className="w-6 h-6 rounded-full"
            style={{
              background: "radial-gradient(circle, #fff 0%, #ffd080 30%, #ff8020 60%, transparent 100%)",
              boxShadow: "0 0 40px 20px rgba(255,160,40,0.4), 0 0 80px 40px rgba(255,100,0,0.2)",
            }}
          />
        </motion.div>
      )}

      {/* Text — same layout structure as hero for pixel-perfect alignment */}
      <div className="absolute inset-0 z-30 flex flex-col items-center text-center px-4 max-w-5xl mx-auto h-full justify-center pointer-events-none">
        {/* Invisible spacer matching hero "SPARKS NPO" label */}
        <p className="text-xs uppercase tracking-[0.3em] mb-8 opacity-0 select-none" aria-hidden="true">
          SPARKS NPO
        </p>

        <motion.div
          className="flex items-center gap-4 md:gap-6 mb-6"
          style={{
            opacity: textGlow,
            filter: `blur(${(1 - textGlow) * 16}px)`,
          }}
        >
          {/* Logo symbol — pentagon shape */}
          <svg viewBox="0 0 60 60" className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28" style={{
            filter: textGlow > 0.2
              ? `drop-shadow(0 0 ${textGlow * 30}px rgba(184,212,239,${textGlow * 0.5}))`
              : "none",
          }}>
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e0ecf7" />
                <stop offset="50%" stopColor="#b8d4ef" />
                <stop offset="100%" stopColor="#89AACC" />
              </linearGradient>
            </defs>
            <path
              d="M30 4 L52 18 L52 42 L30 56 L8 42 L8 18 Z"
              fill="none"
              stroke="url(#logoGrad)"
              strokeWidth="3"
              strokeLinejoin="round"
              opacity="0.9"
            />
            <path
              d="M30 12 L44 22 L44 38 L30 48 L16 38 L16 22 Z"
              fill="none"
              stroke="url(#logoGrad)"
              strokeWidth="2"
              strokeLinejoin="round"
              opacity="0.5"
            />
            <path
              d="M30 20 L36 26 L36 34 L30 40 L24 34 L24 26 Z"
              fill="url(#logoGrad)"
              opacity="0.15"
              stroke="url(#logoGrad)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
          <h1
            className="text-7xl md:text-[7rem] lg:text-[9rem] font-body font-semibold tracking-tight text-text-primary leading-[0.9]"
            style={{
              textShadow:
                textGlow > 0.2
                  ? `0 0 ${textGlow * 80}px rgba(255,180,60,${textGlow * 0.6}),
                     0 0 ${textGlow * 160}px rgba(255,100,0,${textGlow * 0.25}),
                     0 2px 4px rgba(0,0,0,0.5)`
                  : "none",
            }}
          >
            Sparks
          </h1>
        </motion.div>

        {/* Tagline fades in during ignite */}
        <motion.p
          className="text-base md:text-lg text-muted/80 font-display italic tracking-[0.05em] mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: phase === "ignite" || phase === "fading" ? 1 : 0,
            y: phase === "ignite" || phase === "fading" ? 0 : 10,
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Igniting a spark in your mind
        </motion.p>

        {/* Invisible spacers to match hero layout */}
        <div className="text-xl md:text-3xl font-light tracking-wide mb-6 opacity-0 select-none" aria-hidden="true">
          We are Educators
        </div>
        <p className="text-sm md:text-base max-w-md mb-10 opacity-0 select-none" aria-hidden="true">
          placeholder
        </p>
        <div className="flex flex-col sm:flex-row gap-4 opacity-0 select-none" aria-hidden="true">
          <span className="rounded-full text-sm px-7 py-3.5">a</span>
          <span className="rounded-full text-sm px-7 py-3.5">b</span>
        </div>
      </div>

      {/* Ambient warm underglow */}
      {(phase === "shower" || phase === "ignite" || phase === "fading") && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              phase === "ignite" ? 0.15 : phase === "fading" ? 0.08 : 0.05,
          }}
          transition={{ duration: 1 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 46%, rgba(255,140,40,0.25) 0%, transparent 70%)",
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};
