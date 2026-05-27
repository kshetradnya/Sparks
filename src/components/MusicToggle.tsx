import { useEffect, useRef, useState, useCallback } from "react";
import type { FC } from "react";

export const MusicToggle: FC = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const tRef = useRef(0);
  const smoothBars = useRef([3, 3, 3, 3, 3]);

  useEffect(() => {
    const audio = new Audio("/ambient.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const S = 32;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = S * dpr;
    c.height = S * dpr;
    c.style.width = S + "px";
    c.style.height = S + "px";
    ctx.scale(dpr, dpr);

    const draw = () => {
      tRef.current += 1 / 60;
      const t = tRef.current;
      ctx.clearRect(0, 0, S, S);

      const bars = 5;
      const bw = 2.5;
      const gap = 3.5;
      const total = bars * bw + (bars - 1) * gap;
      const x0 = (S - total) / 2;
      const cy = S / 2;
      const sb = smoothBars.current;

      for (let i = 0; i < bars; i++) {
        const x = x0 + i * (bw + gap);
        let target: number;

        if (playing) {
          // Layered sine waves for organic motion
          target = 5
            + Math.sin(t * 2.4 + i * 1.1) * 4.5
            + Math.sin(t * 3.8 + i * 0.7) * 2.5
            + Math.sin(t * 1.3 + i * 2.0) * 2;
        } else {
          target = 2.5;
        }

        // Smooth interpolation
        sb[i] += (target - sb[i]) * 0.12;

        const h = Math.max(2, sb[i]);
        const y = cy - h / 2;

        ctx.fillStyle = playing ? "#b8d4ef" : "rgba(184,212,239,0.35)";
        ctx.beginPath();
        ctx.rect(x, y, bw, h);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-surface/80 backdrop-blur-md border border-stroke flex items-center justify-center hover:bg-white/10 transition-all duration-300"
      aria-label={playing ? "Mute music" : "Play music"}
      title={playing ? "Mute" : "Play music"}
    >
      <canvas ref={canvasRef} className="pointer-events-none" />
    </button>
  );
};
