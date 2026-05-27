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
      const cy = rect.top + rect.height * 0.42;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const maxOff = 6;
      const scale = Math.min(maxOff / dist, 0.04);
      setPupil({ x: dx * scale, y: dy * scale });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const happy = isPartnerHovered;
  const glow = happy ? "#FFA500" : "#b8d4ef";
  const glowInner = happy ? "#FFD700" : "#e0ecf7";

  return (
    <div ref={containerRef} className="relative cursor-pointer select-none" onClick={onClick}>
      <motion.svg
        viewBox="0 0 340 380"
        className="w-full max-w-[300px] mx-auto"
        style={{ filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.5))" }}
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <defs>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.4" />
            <stop offset="100%" stopColor={glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="craniumG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#252545" />
            <stop offset="100%" stopColor="#15152a" />
          </linearGradient>
          <linearGradient id="faceG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a32" />
            <stop offset="100%" stopColor="#111128" />
          </linearGradient>
        </defs>

        {/* ═══ NECK / BASE ═══ */}
        <rect x="135" y="330" width="70" height="50" rx="8" fill="#0e0e20" stroke="#2a2a4e" strokeWidth="1" />
        {/* Neck cables */}
        <line x1="152" y1="332" x2="152" y2="355" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="170" y1="332" x2="170" y2="358" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="188" y1="332" x2="188" y2="355" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        {/* Neck ring */}
        <ellipse cx="170" cy="330" rx="46" ry="8" fill="#1a1a32" stroke="#333" strokeWidth="1.5" />

        {/* ═══ CRANIUM SHELL ═══ */}
        <path
          d="M62 200 C62 90, 170 40, 170 40 C170 40, 278 90, 278 200
             L278 260 C278 300, 240 330, 170 330 C100 330, 62 300, 62 260 Z"
          fill="url(#craniumG)"
          stroke="#333"
          strokeWidth="1.5"
        />

        {/* Cranium panel lines */}
        <path d="M170 42 L170 120" stroke="#2a2a4e" strokeWidth="1" opacity="0.5" />
        <path d="M110 80 C110 80, 140 65, 170 62" stroke="#2a2a4e" strokeWidth="0.8" opacity="0.4" fill="none" />
        <path d="M230 80 C230 80, 200 65, 170 62" stroke="#2a2a4e" strokeWidth="0.8" opacity="0.4" fill="none" />
        {/* Side seams */}
        <path d="M80 160 C80 160, 82 220, 90 270" stroke="#2a2a4e" strokeWidth="0.8" opacity="0.4" fill="none" />
        <path d="M260 160 C260 160, 258 220, 250 270" stroke="#2a2a4e" strokeWidth="0.8" opacity="0.4" fill="none" />

        {/* ═══ FOREHEAD VISOR ═══ */}
        <path
          d="M100 130 L240 130 L240 140 L100 140 Z"
          fill="#0d0d1a"
          stroke="#333"
          strokeWidth="0.8"
          rx="3"
        />
        {/* Visor LED strip */}
        <motion.rect
          x="105" y="132" width="130" height="6" rx="3"
          fill={glow}
          opacity={0.15}
          animate={{ opacity: happy ? [0.15, 0.4, 0.15] : [0.08, 0.2, 0.08] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Visor segment lines */}
        {[130, 150, 170, 190, 210].map((x) => (
          <line key={x} x1={x} y1="131" x2={x} y2="139" stroke="#222" strokeWidth="0.5" />
        ))}

        {/* ═══ FACE PLATE ═══ */}
        <path
          d="M88 145 L252 145 L262 200 L268 240 C268 280, 230 315, 170 315 C110 315, 72 280, 72 240 L78 200 Z"
          fill="url(#faceG)"
          stroke="#333"
          strokeWidth="1"
        />

        {/* ═══ EAR MODULES ═══ */}
        {/* Left ear */}
        <rect x="52" y="160" width="18" height="70" rx="6" fill="#1a1a32" stroke="#333" strokeWidth="1" />
        <rect x="55" y="168" width="12" height="4" rx="1" fill="#0d0d1a" />
        <rect x="55" y="176" width="12" height="4" rx="1" fill="#0d0d1a" />
        <rect x="55" y="184" width="12" height="4" rx="1" fill="#0d0d1a" />
        <motion.circle cx="61" cy="198" r="2.5" fill={glow} animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
        <rect x="55" y="206" width="12" height="4" rx="1" fill="#0d0d1a" />
        <rect x="55" y="214" width="12" height="4" rx="1" fill="#0d0d1a" />
        {/* Right ear */}
        <rect x="270" y="160" width="18" height="70" rx="6" fill="#1a1a32" stroke="#333" strokeWidth="1" />
        <rect x="273" y="168" width="12" height="4" rx="1" fill="#0d0d1a" />
        <rect x="273" y="176" width="12" height="4" rx="1" fill="#0d0d1a" />
        <rect x="273" y="184" width="12" height="4" rx="1" fill="#0d0d1a" />
        <motion.circle cx="279" cy="198" r="2.5" fill={glow} animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
        <rect x="273" y="206" width="12" height="4" rx="1" fill="#0d0d1a" />
        <rect x="273" y="214" width="12" height="4" rx="1" fill="#0d0d1a" />

        {/* ═══ BROW RIDGE ═══ */}
        <path d="M100 160 L155 155 L170 157 L185 155 L240 160" stroke="#2a2a4e" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* ═══ EYES ═══ */}
        {/* Eye glow auras */}
        <circle cx="130" cy="195" r="30" fill="url(#eyeGlow)" />
        <circle cx="210" cy="195" r="30" fill="url(#eyeGlow)" />

        {/* Left eye assembly */}
        {/* Outer socket ring */}
        <circle cx="130" cy="195" r="26" fill="#0a0a18" stroke="#333" strokeWidth="1.5" />
        {/* Inner mechanical ring */}
        <motion.circle cx="130" cy="195" r="22" fill="none" stroke={glow} strokeWidth="1"
          animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} />
        {/* Iris ring */}
        <motion.circle cx="130" cy="195" r="17" fill="none" stroke={glow} strokeWidth="2.5" opacity="0.5"
          animate={{ opacity: happy ? [0.5, 0.9, 0.5] : [0.3, 0.5, 0.3], stroke: glow }}
          transition={{ duration: 1.8, repeat: Infinity }} />
        {/* Iris fill */}
        <circle cx="130" cy="195" r="14" fill="#0d0d1a" />
        {/* Pupil — tracks cursor */}
        <motion.circle
          cx={130 + pupil.x} cy={195 + pupil.y} r="9"
          fill={glow}
          animate={{ fill: glow }}
          transition={{ duration: 0.3 }}
        />
        <motion.circle
          cx={130 + pupil.x} cy={195 + pupil.y} r="5"
          fill={glowInner}
          animate={{ fill: glowInner }}
          transition={{ duration: 0.3 }}
        />
        {/* Reflection highlights */}
        <circle cx={130 + pupil.x + 3} cy={195 + pupil.y - 4} r="2.5" fill="white" opacity="0.6" />
        <circle cx={130 + pupil.x - 2} cy={195 + pupil.y + 2} r="1.2" fill="white" opacity="0.3" />
        {/* Iris detail arcs */}
        <path d="M118 183 A14 14 0 0 1 130 181" stroke={glow} strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M142 183 A14 14 0 0 0 130 181" stroke={glow} strokeWidth="0.5" fill="none" opacity="0.4" />

        {/* Right eye assembly */}
        <circle cx="210" cy="195" r="26" fill="#0a0a18" stroke="#333" strokeWidth="1.5" />
        <motion.circle cx="210" cy="195" r="22" fill="none" stroke={glow} strokeWidth="1"
          animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }} />
        <motion.circle cx="210" cy="195" r="17" fill="none" stroke={glow} strokeWidth="2.5" opacity="0.5"
          animate={{ opacity: happy ? [0.5, 0.9, 0.5] : [0.3, 0.5, 0.3], stroke: glow }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 0.2 }} />
        <circle cx="210" cy="195" r="14" fill="#0d0d1a" />
        <motion.circle
          cx={210 + pupil.x} cy={195 + pupil.y} r="9"
          fill={glow}
          animate={{ fill: glow }}
          transition={{ duration: 0.3 }}
        />
        <motion.circle
          cx={210 + pupil.x} cy={195 + pupil.y} r="5"
          fill={glowInner}
          animate={{ fill: glowInner }}
          transition={{ duration: 0.3 }}
        />
        <circle cx={210 + pupil.x + 3} cy={195 + pupil.y - 4} r="2.5" fill="white" opacity="0.6" />
        <circle cx={210 + pupil.x - 2} cy={195 + pupil.y + 2} r="1.2" fill="white" opacity="0.3" />
        <path d="M198 183 A14 14 0 0 1 210 181" stroke={glow} strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M222 183 A14 14 0 0 0 210 181" stroke={glow} strokeWidth="0.5" fill="none" opacity="0.4" />

        {/* ═══ NOSE BRIDGE ═══ */}
        <path d="M160 190 L170 225 L180 190" stroke="#2a2a4e" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <circle cx="170" cy="218" r="2" fill="#0d0d1a" stroke="#333" strokeWidth="0.5" />

        {/* ═══ CHEEK PANELS ═══ */}
        <rect x="88" y="225" width="28" height="14" rx="4" fill="#0d0d1a" stroke="#333" strokeWidth="0.5" />
        <motion.circle cx="96" cy="232" r="2" fill={glow} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3, repeat: Infinity }} />
        <motion.circle cx="108" cy="232" r="2" fill={glow} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />

        <rect x="224" y="225" width="28" height="14" rx="4" fill="#0d0d1a" stroke="#333" strokeWidth="0.5" />
        <motion.circle cx="232" cy="232" r="2" fill={glow} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} />
        <motion.circle cx="244" cy="232" r="2" fill={glow} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }} />

        {/* Happy cheek blush */}
        {happy && (
          <>
            <motion.ellipse cx="102" cy="235" rx="14" ry="8" fill="#FF6B00" initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} />
            <motion.ellipse cx="238" cy="235" rx="14" ry="8" fill="#FF6B00" initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} />
          </>
        )}

        {/* ═══ MOUTH ═══ */}
        <rect x="120" y="262" width="100" height="32" rx="8" fill="#0a0a18" stroke="#333" strokeWidth="1" />
        {happy ? (
          /* Happy smile — curved LED bar */
          <motion.path
            d="M132 275 Q150 290, 170 290 Q190 290, 208 275"
            stroke="#FFA500"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          /* Neutral — horizontal grille lines */
          <g opacity="0.35">
            {[270, 275, 280, 285].map((y) => (
              <line key={y} x1="128" y1={y} x2="212" y2={y} stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
            ))}
          </g>
        )}

        {/* ═══ CHIN DETAIL ═══ */}
        <path d="M130 298 L170 310 L210 298" stroke="#2a2a4e" strokeWidth="1" fill="none" opacity="0.4" />
        {/* Chin rivets */}
        <circle cx="140" cy="302" r="2" fill="#1a1a2e" stroke="#333" strokeWidth="0.5" />
        <circle cx="170" cy="308" r="2" fill="#1a1a2e" stroke="#333" strokeWidth="0.5" />
        <circle cx="200" cy="302" r="2" fill="#1a1a2e" stroke="#333" strokeWidth="0.5" />

        {/* ═══ ANTENNA ARRAY ═══ */}
        {/* Main antenna mast */}
        <line x1="170" y1="42" x2="170" y2="14" stroke="#444" strokeWidth="3" strokeLinecap="round" />
        <line x1="170" y1="14" x2="170" y2="4" stroke="#555" strokeWidth="2" strokeLinecap="round" />
        <motion.circle
          cx="170" cy="3" r="5"
          fill={glow}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Side antennas */}
        <line x1="148" y1="65" x2="138" y2="38" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="137" cy="36" r="2.5" fill="#333" stroke={glow} strokeWidth="0.8" />
        <line x1="192" y1="65" x2="202" y2="38" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="203" cy="36" r="2.5" fill="#333" stroke={glow} strokeWidth="0.8" />

        {/* ═══ SURFACE RIVETS ═══ */}
        {[
          [95, 150], [245, 150],
          [82, 200], [258, 200],
          [90, 260], [250, 260],
          [110, 310], [230, 310],
        ].map(([cx, cy], i) => (
          <circle key={`r${i}`} cx={cx} cy={cy} r="2" fill="#15152a" stroke="#2a2a4e" strokeWidth="0.8" />
        ))}

        {/* ═══ FOREHEAD STATUS LEDS ═══ */}
        {[140, 155, 170, 185, 200].map((x, i) => (
          <motion.circle
            key={`led${i}`}
            cx={x} cy="120"
            r="2"
            fill={glow}
            animate={{ opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.svg>
    </div>
  );
};
