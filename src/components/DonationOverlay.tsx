import { useState, useEffect, useMemo, useRef } from "react";
import type { FC } from "react";
import { motion } from "framer-motion";

type Phase = "entering" | "form" | "dissolving" | "running" | "curtain" | "done";

interface DonationOverlayProps {
  onClose: () => void;
}

interface MoneyParticle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  size: number;
  symbol: string;
  color: string;
  delay: number;
  rotation: number;
}

const SYMBOLS = ["$", "€", "£", "¥"];
const COLORS = ["#FFD700", "#32CD32", "#FFA500", "#00CED1"];

export const DonationOverlay: FC<DonationOverlayProps> = ({ onClose }) => {
  const [phase, setPhase] = useState<Phase>("entering");
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  const particles = useMemo<MoneyParticle[]>(() => {
    const arr: MoneyParticle[] = [];
    for (let i = 0; i < 35; i++) {
      arr.push({
        id: i,
        x: 15 + Math.random() * 70,
        y: 10 + Math.random() * 60,
        tx: 40 + Math.random() * 20,
        ty: 70 + Math.random() * 10,
        size: 18 + Math.random() * 28,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.8,
        rotation: Math.random() * 720 - 360,
      });
    }
    return arr;
  }, []);

  // Phase transitions — onClose stored in ref to avoid dep-array churn
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    switch (phase) {
      case "entering":  t = setTimeout(() => setPhase("form"), 700); break;
      case "dissolving": t = setTimeout(() => setPhase("running"), 2600); break;
      case "running":    t = setTimeout(() => setPhase("curtain"), 2200); break;
      case "curtain":    t = setTimeout(() => setPhase("done"), 1800); break;
      case "done":       t = setTimeout(() => onCloseRef.current(), 200); break;
      default: return;
    }
    return () => clearTimeout(t);
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhase("dissolving");
  };

  const inputCls =
    "w-full bg-[#0a0a0a] border border-stroke rounded-xl px-5 py-3.5 text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-[#b8d4ef]/50 transition-colors text-sm";

  return (
    <motion.div
      className="fixed inset-0 z-[9998] bg-bg overflow-hidden"
      initial={{ clipPath: "circle(0% at 50% 100%)" }}
      animate={{
        clipPath:
          phase === "done"
            ? "circle(0% at 100% 50%)"
            : "circle(150% at 50% 100%)",
      }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* === FORM === */}
      {(phase === "entering" || phase === "form") && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-4 overflow-y-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="w-full max-w-lg py-16">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-8 h-px bg-stroke" />
                <span className="text-xs text-muted uppercase tracking-[0.3em]">Support Us</span>
                <div className="w-8 h-px bg-stroke" />
              </div>
              <h2 className="text-5xl md:text-7xl font-display italic tracking-tight mb-4">Donate.</h2>
              <p className="text-muted text-sm max-w-xs mx-auto">
                Every contribution fuels a spark of change in our communities.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-surface border border-stroke rounded-3xl p-8 md:p-10 space-y-5"
            >
              <div>
                <label className="block text-xs text-muted uppercase tracking-widest mb-2">Amount</label>
                <div className="grid grid-cols-4 gap-3">
                  {["$10", "$25", "$50", "$100"].map((amt) => (
                    <button key={amt} type="button"
                      className="py-3 rounded-xl border border-stroke text-sm font-medium hover:bg-white hover:text-black transition-all">
                      {amt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted uppercase tracking-widest mb-2">Your Name</label>
                <input type="text" placeholder="Optional" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-muted uppercase tracking-widest mb-2">Message</label>
                <textarea placeholder="Optional note" rows={2} className={`${inputCls} resize-none`} />
              </div>
              <button type="submit"
                className="w-full group relative rounded-2xl text-sm px-7 py-4 mt-4 hover:scale-[1.02] transition-all duration-300 bg-text-primary text-bg font-medium overflow-hidden">
                <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute inset-[2px] bg-bg rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 group-hover:text-text-primary transition-colors">Submit Donation</span>
              </button>
            </form>

            <button onClick={() => onCloseRef.current()}
              className="mt-6 mx-auto block text-muted text-sm hover:text-text-primary transition-colors">
              &larr; Back to site
            </button>
          </div>
        </motion.div>
      )}

      {/* === DISSOLVING — money particles === */}
      {phase === "dissolving" && (
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute font-bold pointer-events-none select-none"
              style={{ fontSize: p.size, color: p.color, left: `${p.x}%`, top: `${p.y}%` }}
              initial={{ scale: 0, rotate: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.4, 1],
                rotate: p.rotation,
                x: `${(p.tx - p.x) * 2}px`,
                y: `${(p.ty - p.y) * 3}px`,
                opacity: [0, 1, 1, 0.7],
              }}
              transition={{ duration: 2.2, delay: p.delay, ease: "easeInOut" }}
            >
              {p.symbol}
            </motion.div>
          ))}
          <motion.p
            className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-muted text-sm uppercase tracking-widest whitespace-nowrap"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            Processing your generosity...
          </motion.p>
        </motion.div>
      )}

      {/* === RUNNING — robot grabs money and runs === */}
      {phase === "running" && (
        <motion.div className="absolute inset-0 flex items-end justify-center overflow-hidden"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.p
            className="absolute top-1/3 left-1/2 -translate-x-1/2 text-3xl md:text-5xl font-display italic text-text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9] }}
            transition={{ duration: 2.2, times: [0, 0.2, 0.7, 1] }}>
            Thank you!
          </motion.p>

          <motion.div className="mb-12"
            initial={{ x: -200 }}
            animate={{ x: [0, 0, 2200] }}
            transition={{ duration: 2.2, times: [0, 0.3, 1], ease: "easeIn" }}>
            <svg width="130" height="170" viewBox="0 0 130 170">
              <rect x="35" y="8" width="52" height="40" rx="13" fill="#1a1a2e" stroke="#333" strokeWidth="1.5" />
              <circle cx="50" cy="26" r="6.5" fill="#FFA500" />
              <circle cx="72" cy="26" r="6.5" fill="#FFA500" />
              <circle cx="50" cy="26" r="2.5" fill="#FFD700" />
              <circle cx="72" cy="26" r="2.5" fill="#FFD700" />
              <path d="M48 38 Q61 47 74 38" stroke="#FFA500" strokeWidth="2" fill="none" strokeLinecap="round" />
              <line x1="61" y1="8" x2="61" y2="0" stroke="#555" strokeWidth="2" />
              <circle cx="61" cy="0" r="3" fill="#FFA500" />
              <rect x="54" y="48" width="14" height="8" rx="3" fill="#2a2a4e" />
              <rect x="30" y="56" width="62" height="52" rx="9" fill="#1a1a2e" stroke="#333" strokeWidth="1.5" />
              <circle cx="61" cy="80" r="8" fill="#b8d4ef" opacity="0.5" />
              <circle cx="61" cy="80" r="3.5" fill="#e0ecf7" />
              <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 0.35, repeat: Infinity }}>
                <circle cx="102" cy="48" r="22" fill="#FFD700" opacity="0.85" stroke="#DAA520" strokeWidth="2" />
                <text x="102" y="55" textAnchor="middle" fill="#333" fontSize="18" fontWeight="bold">$</text>
              </motion.g>
              <path d="M92 66 L102 54 L102 40" stroke="#2a2a4e" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <motion.g animate={{ rotate: [-25, 25, -25] }} transition={{ duration: 0.3, repeat: Infinity }} style={{ transformOrigin: "30px 66px" }}>
                <path d="M30 66 L15 85 L8 100" stroke="#2a2a4e" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </motion.g>
              <motion.g animate={{ rotate: [-22, 22, -22] }} transition={{ duration: 0.3, repeat: Infinity }} style={{ transformOrigin: "48px 108px" }}>
                <path d="M48 108 L38 138 L28 158" stroke="#2a2a4e" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <rect x="18" y="155" width="20" height="8" rx="3" fill="#1a1a2e" />
              </motion.g>
              <motion.g animate={{ rotate: [22, -22, 22] }} transition={{ duration: 0.3, repeat: Infinity }} style={{ transformOrigin: "74px 108px" }}>
                <path d="M74 108 L84 138 L94 158" stroke="#2a2a4e" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <rect x="84" y="155" width="20" height="8" rx="3" fill="#1a1a2e" />
              </motion.g>
            </svg>
          </motion.div>
        </motion.div>
      )}

      {/* === CURTAIN — worker robot slides across === */}
      {phase === "curtain" && (
        <motion.div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 w-full bg-surface/95 backdrop-blur-sm flex items-center justify-center"
            initial={{ x: "-100%" }} animate={{ x: "0%" }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}>
            <motion.div
              className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2"
              animate={{ x: [40, 0] }} transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}>
              <svg width="90" height="130" viewBox="0 0 90 130">
                <rect x="22" y="5" width="46" height="34" rx="12" fill="#1a1a2e" stroke="#333" strokeWidth="1.5" />
                <circle cx="36" cy="20" r="6" fill="#b8d4ef" />
                <circle cx="54" cy="20" r="6" fill="#b8d4ef" />
                <circle cx="36" cy="20" r="2.5" fill="#e0ecf7" />
                <circle cx="54" cy="20" r="2.5" fill="#e0ecf7" />
                <path d="M20 12 L45 2 L70 12" stroke="#FFA500" strokeWidth="3" fill="none" strokeLinecap="round" />
                <line x1="45" y1="5" x2="45" y2="0" stroke="#555" strokeWidth="2" />
                <circle cx="45" cy="0" r="3" fill="#b8d4ef" />
                <path d="M36 30 Q45 36 54 30" stroke="#b8d4ef" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <rect x="40" y="39" width="10" height="7" rx="3" fill="#2a2a4e" />
                <rect x="18" y="46" width="54" height="42" rx="7" fill="#1a1a2e" stroke="#333" strokeWidth="1.5" />
                <circle cx="45" cy="64" r="6" fill="#b8d4ef" opacity="0.4" />
                <path d="M18 56 L5 64 L0 78" stroke="#2a2a4e" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M72 56 L85 64 L90 78" stroke="#2a2a4e" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M32 88 L28 108 L24 125" stroke="#2a2a4e" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M58 88 L62 108 L66 125" stroke="#2a2a4e" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <rect x="16" y="122" width="16" height="7" rx="3" fill="#1a1a2e" />
                <rect x="58" y="122" width="16" height="7" rx="3" fill="#1a1a2e" />
              </svg>
            </motion.div>
            <motion.p className="text-muted text-sm uppercase tracking-widest"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              Returning you home...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
