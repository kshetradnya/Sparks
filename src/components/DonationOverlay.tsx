import { useState, useEffect, useMemo, useRef } from "react";
import type { FC } from "react";
import { motion } from "framer-motion";

type Phase = "entering" | "form" | "dissolving" | "thankyou" | "done";

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

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    switch (phase) {
      case "entering":  t = setTimeout(() => setPhase("form"), 700); break;
      case "dissolving": t = setTimeout(() => setPhase("thankyou"), 3000); break;
      case "thankyou":   t = setTimeout(() => setPhase("done"), 3000); break;
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
            ? "circle(0% at 50% 50%)"
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
              transition={{ duration: 2.5, delay: p.delay, ease: "easeInOut" }}
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

      {/* === THANK YOU — clean text, no robot === */}
      {phase === "thankyou" && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full border-2 border-[#b8d4ef]/30 flex items-center justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <motion.svg
              viewBox="0 0 24 24"
              className="w-10 h-10 text-[#b8d4ef]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M20 6L9 17l-5-5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            </motion.svg>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl font-display italic text-text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Thank you!
          </motion.h2>

          <motion.p
            className="text-muted text-sm max-w-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Your generosity helps us ignite more sparks. We'll put every cent to good use.
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
};
