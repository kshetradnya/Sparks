import { useEffect, useState, useRef, useCallback } from "react";
import type { FC } from "react";
import { motion } from "framer-motion";
import sparksLogo from "../../image-removebg-preview.png";

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
      case "dark":     t = setTimeout(() => setPhase("strike"), 300); break;
      case "strike":   t = setTimeout(() => setPhase("shower"), 650); break;
      case "shower":   t = setTimeout(() => setPhase("ignite"), 1350); break;
      case "ignite":   t = setTimeout(() => setPhase("fading"), 1050); break;
      case "fading":   t = setTimeout(() => onCompleteRef.current(), 750); break;
      default: return;
    }
    return () => clearTimeout(t);
  }, [phase]);

  /* Text glow ramp */
  useEffect(() => {
    if (phase !== "ignite" && phase !== "fading") return;
    const start = performance.now();
    const dur = phase === "ignite" ? 950 : 650;
    const from = textGlow;
    const to = phase === "fading" ? 1 : 0.9;
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
        const speed = force * (0.28 + Math.random() * 0.55);
        const bright = Math.random();
        sparksRef.current.push({
          x: cx + (Math.random() - 0.5) * 6,
          y: cy + (Math.random() - 0.5) * 3,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.7,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 0.8 + Math.random() * 1.1,
          size: bright > 0.7 ? 1.1 + Math.random() * 1.8 : 0.5 + Math.random() * 1.1,
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
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(0.18 + Math.random() * 0.55),
        life: 1,
        size: 0.8 + Math.random() * 1.8,
        hue: 205 + Math.random() * 25,
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
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
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
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220);
          g.addColorStop(0, "#fff");
          g.addColorStop(0.3, "rgba(184,212,239,0.7)");
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
          ctx.restore();
        }
        // Initial burst
        if (frameRef.current % 3 === 0) spawnSparks(cx, cy, 7, 9, Math.PI * 1.15);
      }

      /* ── SHOWER phase: continuous cascading sparks ── */
      if (phase === "shower") {
        // Main shower from center
        if (frameRef.current % 3 === 0) spawnSparks(cx, cy, 5, 7, Math.PI * 1.05);
        // Side cascades
        if (frameRef.current % 4 === 0) {
          spawnSparks(cx - 52, cy + 8, 2, 5, Math.PI * 0.8);
          spawnSparks(cx + 52, cy + 8, 2, 5, Math.PI * 0.8);
        }
        // Embers
        if (frameRef.current % 7 === 0) spawnEmbers(cx, cy, 2);

        // Core glow
        ctx.save();
        const pulse = 0.12 + Math.sin(frameRef.current * 0.055) * 0.04;
        const coreG = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160);
        coreG.addColorStop(0, `rgba(224,236,247,${pulse})`);
        coreG.addColorStop(0.5, `rgba(78,133,191,${pulse * 0.45})`);
        coreG.addColorStop(1, "transparent");
        ctx.fillStyle = coreG;
        ctx.fillRect(cx - 200, cy - 200, 400, 400);
        ctx.restore();
      }

      /* ── IGNITE phase: big burst then dying down ── */
      if (phase === "ignite") {
        if (frameRef.current % 5 === 0) spawnSparks(cx, cy, 3, 7, Math.PI * 1.5);
        if (frameRef.current % 5 === 0) spawnEmbers(cx, cy, 3);

        // Bright reveal glow
        ctx.save();
        const revealG = ctx.createRadialGradient(cx, cy, 0, cx, cy, 280);
        revealG.addColorStop(0, "rgba(224,236,247,0.18)");
        revealG.addColorStop(0.4, "rgba(78,133,191,0.08)");
        revealG.addColorStop(1, "transparent");
        ctx.fillStyle = revealG;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      /* ── FADING phase: just embers drifting ── */
      if (phase === "fading") {
        if (frameRef.current % 10 === 0) spawnEmbers(cx, cy, 1);
      }

      /* ── Update & draw sparks ── */
      sparksRef.current = sparksRef.current.filter((s) => {
        // Physics
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 9) s.trail.shift();

        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.08; // soft gravity
        s.vx *= 0.985;
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
              ? `rgba(235,247,255,${alpha * 0.55})`
              : `rgba(137,170,204,${alpha * 0.35})`;
          ctx.lineWidth = s.size * 0.4 * s.life;
          ctx.stroke();
          ctx.restore();
        }

        // Draw spark head
        ctx.save();
        ctx.globalAlpha = alpha;

        // Glow
        ctx.shadowBlur = s.bright > 0.7 ? s.size * 12 : s.size * 7;
        ctx.shadowColor =
          s.bright > 0.7 ? "rgba(224,236,247,0.85)" : "rgba(78,133,191,0.65)";

        // Core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fillStyle =
          s.bright > 0.85
            ? "#f7fbff" // white-hot
            : s.bright > 0.5
            ? "#b8d4ef" // bright blue
            : "#4e85bf"; // deep blue
        ctx.fill();

        ctx.restore();
        return true;
      });

      /* ── Update & draw embers ── */
      embersRef.current = embersRef.current.filter((e) => {
        e.x += e.vx + Math.sin(frameRef.current * 0.018 + e.hue) * 0.16;
        e.y += e.vy;
        e.life -= 0.0024;
        if (e.life <= 0) return false;

        ctx.save();
        ctx.globalAlpha = e.life * e.life * 0.7;
        ctx.shadowBlur = e.size * 6;
        ctx.shadowColor = `hsla(${e.hue}, 70%, 70%, 0.55)`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * e.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 70%, ${58 + e.life * 22}%, 1)`;
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
            opacity: phase === "strike" ? [0, 0.85, 0.55] : [0.55, 0.38, 0.55],
            scale: phase === "strike" ? [0, 1.25, 0.95] : [0.95, 1.08, 0.95],
          }}
          transition={{
            duration: phase === "strike" ? 0.65 : 1.8,
            repeat: phase === "shower" ? Infinity : 0,
            repeatType: "reverse",
          }}
        >
          <div
            className="w-6 h-6 rounded-full"
            style={{
              background: "radial-gradient(circle, #fff 0%, #e0ecf7 35%, #89aacc 65%, transparent 100%)",
              boxShadow: "0 0 40px 18px rgba(184,212,239,0.32), 0 0 90px 42px rgba(78,133,191,0.18)",
            }}
          />
        </motion.div>
      )}

      {/* Text — same layout structure as hero for pixel-perfect alignment */}
      <div className="absolute inset-0 z-30 flex flex-col items-center text-center px-4 max-w-5xl mx-auto h-full justify-center pointer-events-none">
        <motion.div
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-bg/40 px-4 py-2 backdrop-blur-md"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: phase === "ignite" || phase === "fading" ? textGlow : 0,
            y: phase === "ignite" || phase === "fading" ? 0 : 10,
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={sparksLogo} alt="Sparks logo" className="h-6 w-6 object-contain" />
          <span className="text-xs text-muted uppercase tracking-[0.3em]">SPARKS NPO</span>
        </motion.div>

        <motion.h1
          className="text-7xl md:text-[7rem] lg:text-[9rem] font-display italic tracking-tight text-text-primary leading-[0.9] mb-6"
          style={{
            opacity: textGlow,
            filter: `blur(${(1 - textGlow) * 10}px)`,
            textShadow:
              textGlow > 0.2
                ? `0 0 ${textGlow * 70}px rgba(184,212,239,${textGlow * 0.45}),
                   0 0 ${textGlow * 150}px rgba(78,133,191,${textGlow * 0.22}),
                   0 2px 4px rgba(0,0,0,0.5)`
                : "none",
          }}
        >
          Sparks
        </motion.h1>

        {/* Tagline fades in during ignite */}
        <motion.p
          className="text-sm md:text-base text-muted/80 uppercase tracking-[0.25em] mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: phase === "ignite" || phase === "fading" ? 1 : 0,
            y: phase === "ignite" || phase === "fading" ? 0 : 10,
          }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
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
              phase === "ignite" ? 0.16 : phase === "fading" ? 0.08 : 0.06,
          }}
          transition={{ duration: 1 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 46%, rgba(78,133,191,0.26) 0%, transparent 70%)",
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};
