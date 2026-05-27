import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { motion } from "framer-motion";

interface FooterRobotProps {
  isPartnerHovered: boolean;
  onClick: () => void;
}

export const FooterRobot: FC<FooterRobotProps> = ({ isPartnerHovered, onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.4;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const maxOff = 5;
      const scale = Math.min(maxOff / dist, 0.035);
      setPupil({ x: dx * scale, y: dy * scale });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const happy = isPartnerHovered;
  const accent = happy ? "#FFA500" : "#b8d4ef";
  const accentBright = happy ? "#FFD700" : "#e0ecf7";

  return (
    <div ref={containerRef} className="relative cursor-pointer select-none" onClick={onClick}>
      <motion.svg
        viewBox="0 0 400 440"
        className="w-full max-w-[320px] mx-auto"
        style={{ filter: "drop-shadow(0 25px 70px rgba(0,0,0,0.6))" }}
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <defs>
          <linearGradient id="fr-cranium" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="50%" stopColor="#0f0f20" />
            <stop offset="100%" stopColor="#0a0a18" />
          </linearGradient>
          <linearGradient id="fr-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#141428" />
            <stop offset="100%" stopColor="#0c0c1e" />
          </linearGradient>
          <linearGradient id="fr-visor" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} stopOpacity="0" />
            <stop offset="50%" stopColor={accent} stopOpacity="0.6" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="fr-eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
            <stop offset="60%" stopColor={accent} stopOpacity="0.1" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <filter id="fr-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="fr-visorClip">
            <rect x="90" y="152" width="220" height="12" rx="6" />
          </clipPath>
        </defs>

        {/* ═══ NECK ASSEMBLY ═══ */}
        <rect x="155" y="370" width="90" height="70" rx="6" fill="#08081a" stroke="#1a1a3a" strokeWidth="1" />
        {/* Hydraulic lines */}
        <line x1="170" y1="372" x2="170" y2="400" stroke="#1a1a3a" strokeWidth="3" strokeLinecap="round" />
        <line x1="200" y1="372" x2="200" y2="405" stroke="#1a1a3a" strokeWidth="3" strokeLinecap="round" />
        <line x1="230" y1="372" x2="230" y2="400" stroke="#1a1a3a" strokeWidth="3" strokeLinecap="round" />
        {/* Flex segments */}
        {[376, 382, 388, 394].map((y) => (
          <line key={y} x1="158" y1={y} x2="242" y2={y} stroke="#111130" strokeWidth="0.5" />
        ))}
        {/* Collar ring */}
        <ellipse cx="200" cy="370" rx="55" ry="10" fill="#0f0f24" stroke="#1a1a3a" strokeWidth="1.5" />
        <motion.ellipse cx="200" cy="370" rx="55" ry="10" fill="none" stroke={accent} strokeWidth="0.5"
          animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 3, repeat: Infinity }} />

        {/* ═══ CRANIUM ═══ */}
        <path
          d="M70 220 C70 95, 200 45, 200 45 C200 45, 330 95, 330 220
             L330 285 C330 335, 280 370, 200 370 C120 370, 70 335, 70 285 Z"
          fill="url(#fr-cranium)"
          stroke="#1a1a3a"
          strokeWidth="1.2"
        />
        {/* Surface panels */}
        <path d="M200 47 L200 130" stroke="#1a1a3a" strokeWidth="0.8" opacity="0.4" />
        <path d="M130 85 Q165 70, 200 67" stroke="#1a1a3a" strokeWidth="0.6" opacity="0.3" fill="none" />
        <path d="M270 85 Q235 70, 200 67" stroke="#1a1a3a" strokeWidth="0.6" opacity="0.3" fill="none" />
        {/* Hex panel lines */}
        <path d="M85 180 L85 250 L100 295" stroke="#1a1a3a" strokeWidth="0.6" opacity="0.25" fill="none" />
        <path d="M315 180 L315 250 L300 295" stroke="#1a1a3a" strokeWidth="0.6" opacity="0.25" fill="none" />
        <path d="M120 120 L280 120" stroke="#1a1a3a" strokeWidth="0.4" opacity="0.2" />

        {/* ═══ VISOR STRIP ═══ */}
        <rect x="90" y="152" width="220" height="12" rx="6" fill="#06061a" stroke="#1a1a3a" strokeWidth="0.8" />
        {/* Scanning light */}
        <g clipPath="url(#fr-visorClip)">
          <motion.rect
            x="90" y="152" width="80" height="12" rx="6"
            fill="url(#fr-visor)"
            animate={{ x: [60, 260, 60] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
        {/* Visor tick marks */}
        {[110, 135, 160, 185, 200, 215, 240, 265, 290].map((x) => (
          <line key={x} x1={x} y1="153" x2={x} y2="163" stroke="#0f0f24" strokeWidth="0.4" />
        ))}

        {/* ═══ FACE PLATE ═══ */}
        <path
          d="M95 170 L305 170 L318 225 L325 265 C325 315, 275 355, 200 355 C125 355, 75 315, 75 265 L82 225 Z"
          fill="url(#fr-face)"
          stroke="#1a1a3a"
          strokeWidth="0.8"
        />

        {/* ═══ SIDE MODULES ═══ */}
        {/* Left */}
        <rect x="52" y="185" width="22" height="80" rx="4" fill="#0c0c1e" stroke="#1a1a3a" strokeWidth="1" />
        {[193, 201, 209, 217, 225, 233, 241, 249].map((y) => (
          <line key={`l${y}`} x1="56" y1={y} x2="70" y2={y} stroke="#111130" strokeWidth="0.8" />
        ))}
        <motion.rect x="58" y="255" width="12" height="3" rx="1" fill={accent}
          animate={{ opacity: [0.2, 0.7, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
        {/* Right */}
        <rect x="326" y="185" width="22" height="80" rx="4" fill="#0c0c1e" stroke="#1a1a3a" strokeWidth="1" />
        {[193, 201, 209, 217, 225, 233, 241, 249].map((y) => (
          <line key={`r${y}`} x1="330" y1={y} x2="344" y2={y} stroke="#111130" strokeWidth="0.8" />
        ))}
        <motion.rect x="330" y="255" width="12" height="3" rx="1" fill={accent}
          animate={{ opacity: [0.2, 0.7, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.7 }} />

        {/* ═══ BROW ═══ */}
        <path d="M110 185 L170 180 L200 182 L230 180 L290 185" stroke="#1a1a3a" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* ═══ EYES ═══ */}
        {[{ ex: 155 }, { ex: 245 }].map(({ ex }, idx) => (
          <g key={idx}>
            {/* Glow aura */}
            <circle cx={ex} cy="218" r="35" fill="url(#fr-eyeGlow)" />
            {/* Outer housing */}
            <circle cx={ex} cy="218" r="28" fill="#060618" stroke="#1a1a3a" strokeWidth="1.5" />
            {/* Precision ring */}
            <motion.circle cx={ex} cy="218" r="24" fill="none" stroke={accent} strokeWidth="0.8"
              strokeDasharray="4 4"
              animate={{ opacity: [0.2, 0.5, 0.2], rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: `${ex}px 218px` }}
            />
            {/* Iris ring */}
            <motion.circle cx={ex} cy="218" r="19" fill="none" stroke={accent} strokeWidth="2"
              animate={{ opacity: happy ? [0.5, 1, 0.5] : [0.25, 0.5, 0.25] }}
              transition={{ duration: 2, repeat: Infinity }} />
            {/* Dark iris */}
            <circle cx={ex} cy="218" r="16" fill="#060618" />
            {/* Segmented iris detail */}
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const r1 = 12, r2 = 16;
              return (
                <line key={deg}
                  x1={ex + Math.cos(rad) * r1} y1={218 + Math.sin(rad) * r1}
                  x2={ex + Math.cos(rad) * r2} y2={218 + Math.sin(rad) * r2}
                  stroke={accent} strokeWidth="0.4" opacity="0.3" />
              );
            })}
            {/* Pupil */}
            <motion.circle
              cx={ex + pupil.x} cy={218 + pupil.y} r="10"
              fill={accent}
              animate={{ fill: accent }}
              transition={{ duration: 0.3 }}
            />
            <motion.circle
              cx={ex + pupil.x} cy={218 + pupil.y} r="6"
              fill={accentBright}
              animate={{ fill: accentBright }}
              transition={{ duration: 0.3 }}
            />
            {/* Reflections */}
            <circle cx={ex + pupil.x + 3} cy={218 + pupil.y - 4} r="2.5" fill="white" opacity="0.65" />
            <circle cx={ex + pupil.x - 2} cy={218 + pupil.y + 2} r="1.2" fill="white" opacity="0.3" />
            {/* Scan line */}
            <motion.line
              x1={ex - 16} y1={218} x2={ex + 16} y2={218}
              stroke={accent} strokeWidth="0.5"
              animate={{ opacity: [0, 0.4, 0], y1: [204, 232, 204], y2: [204, 232, 204] }}
              transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}
            />
          </g>
        ))}

        {/* ═══ NOSE SENSOR ═══ */}
        <path d="M190 215 L200 248 L210 215" stroke="#1a1a3a" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
        <motion.circle cx="200" cy="242" r="2.5" fill={accent}
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 3, repeat: Infinity }} />

        {/* ═══ CHEEK PANELS ═══ */}
        <path d="M95 255 L130 250 L130 270 L95 275 Z" fill="#08081a" stroke="#1a1a3a" strokeWidth="0.5" />
        <path d="M305 255 L270 250 L270 270 L305 275 Z" fill="#08081a" stroke="#1a1a3a" strokeWidth="0.5" />
        {/* Cheek LEDs */}
        {[102, 114].map((x) => (
          <motion.circle key={`cl${x}`} cx={x} cy="262" r="1.5" fill={accent}
            animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 2.5, repeat: Infinity }} />
        ))}
        {[298, 286].map((x) => (
          <motion.circle key={`cr${x}`} cx={x} cy="262" r="1.5" fill={accent}
            animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }} />
        ))}
        {/* Happy blush */}
        {happy && (
          <>
            <motion.ellipse cx="112" cy="262" rx="16" ry="8" fill="#FF6B00" initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} />
            <motion.ellipse cx="288" cy="262" rx="16" ry="8" fill="#FF6B00" initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} />
          </>
        )}

        {/* ═══ MOUTH ═══ */}
        <rect x="140" y="285" width="120" height="36" rx="6" fill="#060618" stroke="#1a1a3a" strokeWidth="1" />
        {happy ? (
          <motion.path
            d="M155 300 Q175 318, 200 318 Q225 318, 245 300"
            stroke="#FFA500"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            filter="url(#fr-glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <g>
            {/* Equalizer bars */}
            {[155, 165, 175, 185, 195, 205, 215, 225, 235, 245].map((x, i) => (
              <motion.rect key={x}
                x={x - 2} y={298} width="3" rx="1"
                fill={accent} opacity="0.25"
                animate={{ height: [4, 8 + Math.sin(i * 0.7) * 6, 4], y: [300, 296 - Math.sin(i * 0.7) * 3, 300] }}
                transition={{ duration: 1.5 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </g>
        )}

        {/* ═══ CHIN ═══ */}
        <path d="M145 330 L200 345 L255 330" stroke="#1a1a3a" strokeWidth="0.8" fill="none" opacity="0.3" />
        {/* Ventilation slits */}
        {[165, 185, 200, 215, 235].map((x) => (
          <line key={x} x1={x} y1="338" x2={x} y2="348" stroke="#111130" strokeWidth="0.6" opacity="0.4" />
        ))}

        {/* ═══ ANTENNA ARRAY ═══ */}
        {/* Main mast */}
        <line x1="200" y1="47" x2="200" y2="15" stroke="#1a1a3a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="200" y1="15" x2="200" y2="5" stroke="#2a2a50" strokeWidth="1.5" strokeLinecap="round" />
        <motion.circle
          cx="200" cy="4" r="5"
          fill={accent}
          filter="url(#fr-glow)"
          animate={{ opacity: [0.4, 1, 0.4], r: [4, 5.5, 4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Side antennas */}
        <line x1="175" y1="72" x2="162" y2="42" stroke="#1a1a3a" strokeWidth="1.5" strokeLinecap="round" />
        <motion.circle cx="161" cy="40" r="3" fill="#111130" stroke={accent} strokeWidth="0.8"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
        <line x1="225" y1="72" x2="238" y2="42" stroke="#1a1a3a" strokeWidth="1.5" strokeLinecap="round" />
        <motion.circle cx="239" cy="40" r="3" fill="#111130" stroke={accent} strokeWidth="0.8"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />

        {/* ═══ SURFACE DETAILS ═══ */}
        {/* Hex bolt pattern */}
        {[
          [105, 175], [295, 175],
          [88, 225], [312, 225],
          [95, 285], [305, 285],
          [120, 340], [280, 340],
        ].map(([bx, by], i) => (
          <g key={`bolt${i}`}>
            <circle cx={bx} cy={by} r="3" fill="#0c0c1e" stroke="#1a1a3a" strokeWidth="0.6" />
            <line x1={bx! - 1.5} y1={by} x2={bx! + 1.5} y2={by} stroke="#1a1a3a" strokeWidth="0.4" />
          </g>
        ))}

        {/* ═══ FOREHEAD HUD ═══ */}
        {[160, 175, 190, 200, 210, 225, 240].map((x, i) => (
          <motion.circle
            key={`hud${i}`}
            cx={x} cy="142"
            r="1.5"
            fill={accent}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}

        {/* Data stream decoration */}
        <motion.text x="95" y="148" fontSize="5" fill={accent} fontFamily="monospace" opacity="0.15"
          animate={{ opacity: [0.05, 0.2, 0.05] }} transition={{ duration: 4, repeat: Infinity }}>
          SYS::ONLINE
        </motion.text>
        <motion.text x="265" y="148" fontSize="5" fill={accent} fontFamily="monospace" opacity="0.15"
          animate={{ opacity: [0.05, 0.2, 0.05] }} transition={{ duration: 4, repeat: Infinity, delay: 2 }}>
          v4.2.1
        </motion.text>
      </motion.svg>
    </div>
  );
};
