import { useEffect, useState, useRef } from "react";
import type { FC } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

type Phase = "growing" | "pulsing" | "revealing" | "fading";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const SPARK_COLORS = ["#FFD700", "#FFA500", "#FF6B00", "#FF4500", "#FFFFFF", "#4E85BF", "#89AACC"];

/*
 * Circuit trace definitions — Manhattan-routed paths radiating from center.
 * ViewBox: 0 0 1000 600. Center node at (500, 300).
 * Traces branch outward like a PCB, with right-angle turns.
 */
const TRACES: { d: string; delay: number; dur: number; w: number }[] = [
  // ── Main arteries ──
  { d: "M500 300 L500 165", delay: 0, dur: 0.85, w: 2.5 },
  { d: "M500 300 L500 435", delay: 0.08, dur: 0.85, w: 2.5 },
  { d: "M500 300 L330 300", delay: 0.04, dur: 0.9, w: 2.5 },
  { d: "M500 300 L670 300", delay: 0.12, dur: 0.9, w: 2.5 },
  // ── Diagonals (short jog then Manhattan turn) ──
  { d: "M500 300 L440 240 L440 180", delay: 0.16, dur: 0.75, w: 2 },
  { d: "M500 300 L560 240 L560 180", delay: 0.2, dur: 0.75, w: 2 },
  { d: "M500 300 L440 360 L440 420", delay: 0.24, dur: 0.75, w: 2 },
  { d: "M500 300 L560 360 L560 420", delay: 0.28, dur: 0.75, w: 2 },
  // ── Primary branches ──
  { d: "M500 165 L425 165 L425 105", delay: 0.75, dur: 0.55, w: 1.5 },
  { d: "M500 165 L575 165 L575 95", delay: 0.8, dur: 0.55, w: 1.5 },
  { d: "M500 435 L415 435 L415 495", delay: 0.82, dur: 0.5, w: 1.5 },
  { d: "M500 435 L590 435 L590 505", delay: 0.85, dur: 0.5, w: 1.5 },
  { d: "M330 300 L330 228 L268 228", delay: 0.78, dur: 0.55, w: 1.5 },
  { d: "M330 300 L330 372 L258 372", delay: 0.82, dur: 0.55, w: 1.5 },
  { d: "M670 300 L670 228 L732 228", delay: 0.8, dur: 0.55, w: 1.5 },
  { d: "M670 300 L670 378 L742 378", delay: 0.84, dur: 0.55, w: 1.5 },
  // ── Secondary branches ──
  { d: "M440 180 L388 180 L388 130", delay: 1.0, dur: 0.45, w: 1.2 },
  { d: "M560 180 L612 180 L612 125", delay: 1.04, dur: 0.45, w: 1.2 },
  { d: "M440 420 L382 420 L382 468", delay: 1.08, dur: 0.45, w: 1.2 },
  { d: "M560 420 L618 420 L618 475", delay: 1.1, dur: 0.45, w: 1.2 },
  { d: "M268 228 L218 228 L218 188", delay: 1.2, dur: 0.4, w: 1 },
  { d: "M258 372 L208 372 L208 412", delay: 1.22, dur: 0.4, w: 1 },
  { d: "M732 228 L782 228 L782 182", delay: 1.24, dur: 0.4, w: 1 },
  { d: "M742 378 L792 378 L792 428", delay: 1.26, dur: 0.4, w: 1 },
  // ── Twigs ──
  { d: "M425 105 L385 105", delay: 1.4, dur: 0.3, w: 0.8 },
  { d: "M575 95 L618 95", delay: 1.42, dur: 0.3, w: 0.8 },
  { d: "M388 130 L348 130", delay: 1.44, dur: 0.3, w: 0.8 },
  { d: "M612 125 L652 125", delay: 1.46, dur: 0.3, w: 0.8 },
  { d: "M218 188 L178 188", delay: 1.5, dur: 0.3, w: 0.8 },
  { d: "M782 182 L822 182", delay: 1.52, dur: 0.3, w: 0.8 },
];

/* Junction nodes at key branch points */
const NODES: { cx: number; cy: number; r: number; delay: number }[] = [
  { cx: 500, cy: 300, r: 7, delay: 0 },
  { cx: 500, cy: 165, r: 4, delay: 0.7 },
  { cx: 500, cy: 435, r: 4, delay: 0.78 },
  { cx: 330, cy: 300, r: 4, delay: 0.75 },
  { cx: 670, cy: 300, r: 4, delay: 0.8 },
  { cx: 440, cy: 180, r: 3, delay: 0.85 },
  { cx: 560, cy: 180, r: 3, delay: 0.88 },
  { cx: 440, cy: 420, r: 3, delay: 0.92 },
  { cx: 560, cy: 420, r: 3, delay: 0.95 },
  { cx: 268, cy: 228, r: 2.5, delay: 1.18 },
  { cx: 732, cy: 228, r: 2.5, delay: 1.2 },
  { cx: 258, cy: 372, r: 2.5, delay: 1.2 },
  { cx: 742, cy: 378, r: 2.5, delay: 1.24 },
];

/* Tiny IC chip shapes at trace endpoints */
const CHIPS: { x: number; y: number; w: number; h: number; delay: number }[] = [
  { x: 378, y: 101, w: 16, h: 9, delay: 1.5 },
  { x: 611, y: 91, w: 16, h: 9, delay: 1.52 },
  { x: 341, y: 126, w: 16, h: 9, delay: 1.54 },
  { x: 645, y: 121, w: 16, h: 9, delay: 1.56 },
  { x: 171, y: 184, w: 14, h: 9, delay: 1.6 },
  { x: 815, y: 178, w: 14, h: 9, delay: 1.62 },
];

export const LoadingScreen: FC<LoadingScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<Phase>("growing");
  const [textGlow, setTextGlow] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef(0);

  /* Phase timing */
  useEffect(() => {
    const t = [
      setTimeout(() => setPhase("pulsing"), 1650),
      setTimeout(() => setPhase("revealing"), 2900),
      setTimeout(() => setPhase("fading"), 3900),
      setTimeout(onComplete, 4600),
    ];
    return () => t.forEach(clearTimeout);
  }, [onComplete]);

  /* Text glow ramp */
  useEffect(() => {
    if (phase !== "revealing" && phase !== "fading") return;
    const start = performance.now();
    const dur = phase === "revealing" ? 900 : 500;
    const from = textGlow;
    const to = phase === "fading" ? 1 : 0.75;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setTextGlow(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* Canvas spark particle system */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      c.width = innerWidth;
      c.height = innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (n: number) => {
      const cx = c.width / 2;
      const cy = c.height * 0.46; // slightly above center, near text
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 2 + Math.random() * 9;
        sparksRef.current.push({
          x: cx + (Math.random() - 0.5) * 30,
          y: cy + (Math.random() - 0.5) * 30,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - Math.random() * 3,
          life: 1,
          maxLife: 0.3 + Math.random() * 1.2,
          size: 0.5 + Math.random() * 3.5,
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
        });
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      const cx = c.width / 2;
      const cy = c.height * 0.46;

      // Spawn particles based on phase
      if (phase === "pulsing") spawn(6);
      else if (phase === "revealing") spawn(14);
      else if (phase === "fading") spawn(3);

      // Central radial glow
      if (phase === "pulsing" || phase === "revealing" || phase === "fading") {
        const sz = phase === "revealing" ? 220 : phase === "fading" ? 160 : 100;
        const alpha = phase === "fading" ? 0.12 : 0.25;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, sz);
        g.addColorStop(0, `rgba(255,165,0,${alpha})`);
        g.addColorStop(0.5, "rgba(255,120,0,0.05)");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(cx - sz, cy - sz, sz * 2, sz * 2);
      }

      sparksRef.current = sparksRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.vx *= 0.99;
        p.life -= 1 / 60 / p.maxLife;
        if (p.life <= 0) return false;
        ctx.save();
        ctx.globalAlpha = p.life * p.life;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [phase]);

  const traceColor =
    phase === "growing"
      ? "#4E85BF"
      : phase === "pulsing"
      ? "#e8932a"
      : "#FFD700";
  const circuitFading = phase === "revealing" || phase === "fading";

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-bg overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
    >
      {/* Canvas for spark particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-30 pointer-events-none" />

      {/* ══ Circuit SVG ══ */}
      <motion.svg
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid meet"
        animate={{ opacity: circuitFading ? 0 : 1 }}
        transition={{ duration: circuitFading ? 1.2 : 0.3 }}
      >
        <defs>
          <filter id="cg">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#cg)">
          {/* Circuit traces */}
          {TRACES.map((t, i) => (
            <motion.path
              key={`t${i}`}
              d={t.d}
              stroke={traceColor}
              strokeWidth={t.w}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity:
                  phase === "pulsing"
                    ? [0.6, 1, 0.6]
                    : 0.7,
                stroke: traceColor,
              }}
              transition={{
                pathLength: { duration: t.dur, delay: t.delay, ease: "easeOut" },
                opacity:
                  phase === "pulsing"
                    ? { duration: 0.7, repeat: Infinity, repeatType: "reverse", delay: t.delay * 0.3 }
                    : { duration: t.dur * 0.5, delay: t.delay },
                stroke: { duration: 0.6 },
              }}
            />
          ))}

          {/* Junction nodes */}
          {NODES.map((n, i) => (
            <motion.circle
              key={`n${i}`}
              cx={n.cx}
              cy={n.cy}
              fill={traceColor}
              initial={{ r: 0, opacity: 0 }}
              animate={{
                r: n.r,
                opacity:
                  phase === "pulsing"
                    ? [0.5, 1, 0.5]
                    : 0.7,
                fill: traceColor,
              }}
              transition={{
                r: { duration: 0.35, delay: n.delay, type: "spring", stiffness: 260, damping: 20 },
                opacity:
                  phase === "pulsing"
                    ? { duration: 0.9, repeat: Infinity, repeatType: "reverse" }
                    : { duration: 0.3, delay: n.delay },
                fill: { duration: 0.6 },
              }}
            />
          ))}

          {/* IC chips */}
          {CHIPS.map((chip, i) => (
            <g key={`c${i}`}>
              <motion.rect
                x={chip.x}
                y={chip.y}
                width={chip.w}
                height={chip.h}
                rx={2}
                fill="#0d0d1a"
                stroke={traceColor}
                strokeWidth={0.8}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8, stroke: traceColor }}
                transition={{ delay: chip.delay, duration: 0.3, stroke: { duration: 0.6 } }}
              />
              {/* Chip pins */}
              {[0, 1, 2].map((pi) => (
                <motion.line
                  key={pi}
                  x1={chip.x + 3 + pi * 5}
                  y1={chip.y}
                  x2={chip.x + 3 + pi * 5}
                  y2={chip.y - 4}
                  stroke={traceColor}
                  strokeWidth={0.6}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5, stroke: traceColor }}
                  transition={{ delay: chip.delay + 0.1, duration: 0.2, stroke: { duration: 0.6 } }}
                />
              ))}
            </g>
          ))}

          {/* Center pulsing rings during energy phase */}
          {phase === "pulsing" && (
            <>
              <motion.circle
                cx="500" cy="300" fill="none" stroke={traceColor} strokeWidth="1.5"
                initial={{ r: 12, opacity: 0.6 }}
                animate={{ r: [15, 50, 90], opacity: [0.5, 0.15, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.circle
                cx="500" cy="300" fill="none" stroke={traceColor} strokeWidth="1"
                initial={{ r: 12, opacity: 0.4 }}
                animate={{ r: [15, 60, 110], opacity: [0.4, 0.1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
              />
            </>
          )}
        </g>
      </motion.svg>

      {/*
        "Sparks" text — uses identical flex layout structure as the hero
        so the text occupies the exact same viewport position.
      */}
      <div className="absolute inset-0 z-20 flex flex-col items-center text-center px-4 max-w-5xl mx-auto h-full justify-center pointer-events-none">
        {/* Invisible spacer: matches hero "SPARKS NPO" label */}
        <p className="text-xs uppercase tracking-[0.3em] mb-8 opacity-0 select-none" aria-hidden="true">
          SPARKS NPO
        </p>

        {/* The actual text */}
        <motion.h1
          className="text-7xl md:text-[7rem] lg:text-[9rem] font-display italic tracking-tight text-text-primary leading-[0.9] mb-6"
          style={{
            opacity: textGlow,
            filter: `blur(${(1 - textGlow) * 14}px)`,
            textShadow:
              textGlow > 0.3
                ? `0 0 ${textGlow * 90}px rgba(255,165,0,${textGlow * 0.5}),
                   0 0 ${textGlow * 170}px rgba(255,100,0,${textGlow * 0.2})`
                : "none",
          }}
        >
          Sparks
        </motion.h1>

        {/* Invisible spacers: match hero content below h1 */}
        <div className="text-xl md:text-3xl font-light tracking-wide mb-6 opacity-0 select-none" aria-hidden="true">
          We are Educators
        </div>
        <p className="text-sm md:text-base max-w-md mb-10 opacity-0 select-none" aria-hidden="true">
          Igniting curiosity and empowering communities through hands-on STEM workshops and AI literacy programs. 500+ lives impacted and counting.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 opacity-0 select-none" aria-hidden="true">
          <span className="rounded-full text-sm px-7 py-3.5">Our Programs</span>
          <span className="rounded-full text-sm px-7 py-3.5">Meet the Team</span>
        </div>
      </div>

      {/* Ambient warm glow */}
      {(phase === "pulsing" || phase === "revealing" || phase === "fading") && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "revealing" ? 0.18 : phase === "fading" ? 0.1 : 0.06 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(255,165,0,0.18) 0%, transparent 60%)",
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};
