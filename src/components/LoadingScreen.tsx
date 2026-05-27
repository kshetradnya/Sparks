import { useEffect, useState, useRef, useCallback } from "react";
import type { FC } from "react";
import { motion } from "framer-motion";
import sparksLogo from "../../image-removebg-preview.png";

interface LoadingScreenProps {
  onComplete: () => void;
}

type Phase = "dark" | "light" | "burn" | "reveal" | "done";

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  bright: number;
}

export const LoadingScreen: FC<LoadingScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<Phase>("dark");
  const [textGlow, setTextGlow] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const rafRef = useRef(0);
  const frameRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const mountedRef = useRef(false);
  useEffect(() => { onCompleteRef.current = onComplete; });

  useEffect(() => {
    // StrictMode guard: skip phase timers on the first (discarded) mount
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    switch (phase) {
      case "dark":   t = setTimeout(() => setPhase("light"), 500); break;
      case "light":  t = setTimeout(() => setPhase("burn"), 600); break;
      case "burn":   t = setTimeout(() => setPhase("reveal"), 1800); break;
      case "reveal": t = setTimeout(() => setPhase("done"), 1100); break;
      case "done":   t = setTimeout(() => onCompleteRef.current(), 700); break;
      default: return;
    }
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "reveal" && phase !== "done") return;
    const start = performance.now();
    const dur = phase === "reveal" ? 900 : 600;
    const from = textGlow;
    const to = phase === "done" ? 1 : 0.9;
    const tick = (now: number) => {
      if (!mountedRef.current) return;
      const p = Math.min((now - start) / dur, 1);
      setTextGlow(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const spawnAt = useCallback((x: number, y: number, count: number, force: number) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = force * (0.3 + Math.random() * 0.7);
      sparklesRef.current.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 2,
        life: 0.5 + Math.random() * 0.5,
        size: 1.2 + Math.random() * 2.8,
        bright: Math.random(),
      });
    }
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      c.width = innerWidth * dpr;
      c.height = innerHeight * dpr;
      c.style.width = innerWidth + "px";
      c.style.height = innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      frameRef.current++;
      const W = innerWidth;
      const H = innerHeight;
      ctx.clearRect(0, 0, W, H);

      const tipX = W / 2;
      const tipY = H * 0.40;
      const stickLen = Math.min(H * 0.30, 220);
      const stickAngle = 0.35;
      const baseX = tipX + Math.cos(stickAngle) * stickLen;
      const baseY = tipY + Math.sin(stickAngle) * stickLen;

      // ── Sparkler stick ──
      if (phase !== "done") {
        ctx.save();
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 3.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(baseX, baseY);
        ctx.stroke();

        // Burnt portion near tip
        const burntLen = stickLen * 0.18;
        ctx.strokeStyle = "#3a3a3a";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(
          tipX + Math.cos(stickAngle) * burntLen,
          tipY + Math.sin(stickAngle) * burntLen
        );
        ctx.stroke();
        ctx.restore();
      }

      // ── LIGHT phase: ignition ──
      if (phase === "light") {
        const f = frameRef.current;
        ctx.save();
        const flash = Math.max(0, 1 - f * 0.05);
        const fg = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 100);
        fg.addColorStop(0, `rgba(180,210,240,${flash * 0.6})`);
        fg.addColorStop(0.4, `rgba(100,160,220,${flash * 0.25})`);
        fg.addColorStop(1, "transparent");
        ctx.fillStyle = fg;
        ctx.fillRect(tipX - 110, tipY - 110, 220, 220);
        ctx.restore();

        if (f % 2 === 0) spawnAt(tipX, tipY, 4, 4);
      }

      // ── BURN phase: sparkler fully lit ──
      if (phase === "burn") {
        if (frameRef.current % 2 === 0) spawnAt(tipX, tipY, 5, 5);
        if (frameRef.current % 12 === 0) spawnAt(tipX, tipY, 10, 7);

        // Glowing tip
        ctx.save();
        const pulse = 0.7 + Math.sin(frameRef.current * 0.12) * 0.15;
        const tg = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 35);
        tg.addColorStop(0, `rgba(200,225,250,${pulse})`);
        tg.addColorStop(0.25, `rgba(140,190,240,${pulse * 0.5})`);
        tg.addColorStop(0.6, `rgba(78,133,191,${pulse * 0.15})`);
        tg.addColorStop(1, "transparent");
        ctx.fillStyle = tg;
        ctx.fillRect(tipX - 40, tipY - 40, 80, 80);
        ctx.restore();

        // Wider blue ambient glow
        ctx.save();
        const ag = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 180);
        ag.addColorStop(0, `rgba(100,170,230,${pulse * 0.07})`);
        ag.addColorStop(0.5, `rgba(60,120,190,${pulse * 0.03})`);
        ag.addColorStop(1, "transparent");
        ctx.fillStyle = ag;
        ctx.fillRect(tipX - 200, tipY - 200, 400, 400);
        ctx.restore();
      }

      // ── REVEAL phase: dying sparkler ──
      if (phase === "reveal") {
        if (frameRef.current % 6 === 0) spawnAt(tipX, tipY, 2, 3);

        const fade = Math.max(0, 1 - frameRef.current * 0.012);
        ctx.save();
        const tg = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 25);
        tg.addColorStop(0, `rgba(140,190,240,${fade * 0.4})`);
        tg.addColorStop(1, "transparent");
        ctx.fillStyle = tg;
        ctx.fillRect(tipX - 30, tipY - 30, 60, 60);
        ctx.restore();
      }

      // ── Draw sparkles ──
      sparklesRef.current = sparklesRef.current.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.055;
        s.vx *= 0.98;
        s.life -= 0.016;

        if (s.life <= 0) return false;
        const a = s.life * s.life;
        const r = s.size * (0.4 + s.life * 0.6);

        // Soft glow halo
        ctx.save();
        ctx.globalAlpha = a * 0.35;
        const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 5);
        hg.addColorStop(0, s.bright > 0.7
          ? "rgba(180,215,245,0.5)"
          : "rgba(100,160,220,0.4)");
        hg.addColorStop(1, "transparent");
        ctx.fillStyle = hg;
        ctx.fillRect(s.x - r * 5, s.y - r * 5, r * 10, r * 10);
        ctx.restore();

        // Core dot
        ctx.save();
        ctx.globalAlpha = a;
        ctx.shadowBlur = s.bright > 0.6 ? 12 : 8;
        ctx.shadowColor = s.bright > 0.6
          ? "rgba(160,200,240,0.8)"
          : "rgba(100,160,220,0.6)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = s.bright > 0.8
          ? "#dceaf8"
          : s.bright > 0.5
          ? "#a8ccef"
          : "#7ab0e0";
        ctx.fill();

        // Bright center
        if (s.bright > 0.5) {
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(s.x, s.y, r * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220,235,250,${a * 0.7})`;
          ctx.fill();
        }
        ctx.restore();

        return true;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [phase, spawnAt]);

  const isDone = phase === "done";

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-bg overflow-hidden"
      animate={{ opacity: isDone ? 0 : 1 }}
      transition={{ duration: isDone ? 0.7 : 0 }}
      style={{ pointerEvents: isDone ? "none" : "auto" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />

      {/* Text */}
      <div className="absolute inset-0 z-30 flex flex-col items-center text-center px-4 max-w-5xl mx-auto h-full justify-center pointer-events-none">
        <motion.div
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-bg/40 px-4 py-2 backdrop-blur-md"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: phase === "reveal" || phase === "done" ? textGlow : 0,
            y: phase === "reveal" || phase === "done" ? 0 : 10,
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
                ? `0 0 ${textGlow * 60}px rgba(184,212,239,${textGlow * 0.4}),
                   0 0 ${textGlow * 120}px rgba(78,133,191,${textGlow * 0.18}),
                   0 2px 4px rgba(0,0,0,0.5)`
                : "none",
          }}
        >
          Sparks
        </motion.h1>

        <motion.p
          className="text-sm md:text-base text-muted/80 uppercase tracking-[0.25em] mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: phase === "reveal" || phase === "done" ? 1 : 0,
            y: phase === "reveal" || phase === "done" ? 0 : 10,
          }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          Igniting a spark in your mind
        </motion.p>

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

      {/* Ambient underglow */}
      {(phase === "burn" || phase === "reveal") && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "burn" ? 0.1 : 0.05 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 40% 35% at 50% 40%, rgba(78,133,191,0.25) 0%, transparent 70%)",
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};
