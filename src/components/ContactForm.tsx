import { useState, useEffect } from "react";
import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import sparksLogo from "../../image-removebg-preview.png";

type Phase = "form" | "sealing" | "flying" | "arrived";

/* ── Sparks logo palette — soft ice-blue & white ── */
const C = {
  accent: "#b8d4ef",
  light: "#e0ecf7",
  dim: "rgba(184, 212, 239, 0.35)",
  body: "#1a1a2e",
  bodyLt: "#222240",
  panel: "#0d0d1a",
};

const REASONS = [
  { value: "", label: "Select a reason..." },
  { value: "events", label: "Send me notifications for future events" },
  { value: "mission", label: "I want to learn more about the mission" },
  { value: "contact", label: "I want to contact the team" },
  { value: "other", label: "Other" },
];

export const ContactForm: FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [otherText, setOtherText] = useState("");
  const [phase, setPhase] = useState<Phase>("form");

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    switch (phase) {
      case "sealing":
        t = setTimeout(() => setPhase("flying"), 2800);
        break;
      case "flying":
        t = setTimeout(() => setPhase("arrived"), 3400);
        break;
      default:
        return;
    }
    return () => clearTimeout(t);
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !reason) return;
    setPhase("sealing");
  };

  const reset = () => {
    setName("");
    setEmail("");
    setReason("");
    setOtherText("");
    setPhase("form");
  };

  const inputCls =
    "w-full bg-[#0a0a0a] border border-stroke rounded-xl px-5 py-3.5 text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-[#b8d4ef]/50 transition-colors text-sm";

  return (
    <div className="relative max-w-2xl mx-auto min-h-[480px]">
      <AnimatePresence mode="wait">
        {/* ════════════════════ FORM ════════════════════ */}
        {phase === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            transition={{ duration: 0.5 }}
          >
            {/* Envelope container */}
            <div className="relative">
              {/* Open flap — folded behind the envelope (V pointing up) */}
              <div
                className="absolute left-2 right-2 z-0"
                style={{
                  top: "-70px",
                  height: "72px",
                  background: "linear-gradient(180deg, #1e1e38 0%, #16162c 100%)",
                  clipPath: "polygon(0 100%, 50% 0%, 100% 100%)",
                }}
              />

              {/* Envelope body */}
              <div className="relative bg-surface border border-stroke rounded-b-3xl overflow-hidden z-10">
                {/* Letter paper inside */}
                <div className="m-3 md:m-5 rounded-2xl border border-stroke/20 bg-bg/60">
                  <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-5">
                    {/* Sparks header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.light})` }}
                      >
                        <div className="w-7 h-7 rounded-full bg-bg/80 flex items-center justify-center">
                          <img src={sparksLogo} alt="Sparks logo" className="h-5 w-5 object-contain" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted uppercase tracking-[0.2em]">To</p>
                        <p className="text-sm font-medium">Sparks Team</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Your Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className={inputCls} required />
                      </div>
                      <div>
                        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Your Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className={inputCls} required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-muted uppercase tracking-widest mb-2">Reason</label>
                      <select value={reason} onChange={(e) => setReason(e.target.value)} className={`${inputCls} appearance-none cursor-pointer`} required>
                        {REASONS.map((r) => (
                          <option key={r.value} value={r.value} disabled={r.value === ""}>{r.label}</option>
                        ))}
                      </select>
                    </div>

                    {reason === "other" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.3 }}>
                        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Tell us more</label>
                        <textarea value={otherText} onChange={(e) => setOtherText(e.target.value)} placeholder="What's on your mind?" rows={3} className={`${inputCls} resize-none`} />
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      className="w-full group relative rounded-2xl text-sm px-7 py-4 mt-4 hover:scale-[1.02] transition-all duration-300 bg-text-primary text-bg font-medium overflow-hidden"
                    >
                      <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute inset-[2px] bg-bg rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative z-10 group-hover:text-text-primary transition-colors">Send Message</span>
                    </button>
                  </form>
                </div>

                {/* Bottom V fold decoration */}
                <div className="absolute bottom-0 left-3 right-3 md:left-5 md:right-5 h-10 overflow-hidden rounded-b-2xl pointer-events-none opacity-25">
                  <div className="w-full h-full" style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)", background: "linear-gradient(180deg, #222 0%, transparent 100%)" }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ════════════════════ SEALING — SVG Envelope ════════════════════ */}
        {phase === "sealing" && (
          <motion.div
            key="sealing"
            className="flex items-center justify-center min-h-[480px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.85, y: -40 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center w-full">
              <svg viewBox="0 0 500 360" className="w-full max-w-lg mx-auto" style={{ overflow: "visible" }}>
                <defs>
                  <linearGradient id="envBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#222240" />
                    <stop offset="100%" stopColor="#16162c" />
                  </linearGradient>
                  <linearGradient id="envFlap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2a2a48" />
                    <stop offset="100%" stopColor="#1e1e38" />
                  </linearGradient>
                </defs>

                {/* Envelope body */}
                <rect x="50" y="120" width="400" height="230" rx="14" fill="url(#envBody)" stroke="#3a3a5e" strokeWidth="1.5" />

                {/* Letter sliding in */}
                <motion.g initial={{ y: -70 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}>
                  <rect x="80" y="135" width="340" height="195" rx="10" fill="#111122" stroke="#2a2a4e" strokeWidth="1" />
                  {/* Letter lines */}
                  <rect x="110" y="165" width="160" height="6" rx="3" fill="#3a3a5e" opacity="0.6" />
                  <rect x="110" y="185" width="280" height="5" rx="2.5" fill="#2a2a48" opacity="0.5" />
                  <rect x="110" y="202" width="240" height="5" rx="2.5" fill="#2a2a48" opacity="0.5" />
                  <rect x="110" y="219" width="260" height="5" rx="2.5" fill="#2a2a48" opacity="0.5" />
                  <rect x="110" y="236" width="180" height="5" rx="2.5" fill="#2a2a48" opacity="0.5" />
                  {/* Sparks logo on letter */}
                  <circle cx="130" cy="155" r="8" fill={C.accent} opacity="0.3" />
                  <text x="130" y="159" textAnchor="middle" fill={C.light} fontSize="10" fontStyle="italic" fontFamily="serif">S</text>
                </motion.g>

                {/* Bottom V-fold line */}
                <path d="M52,122 L250,270 L448,122" fill="none" stroke="#3a3a5e" strokeWidth="0.8" opacity="0.5" />

                {/* Envelope flap — closes over the top */}
                <motion.path
                  fill="url(#envFlap)"
                  stroke="#3a3a5e"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  initial={{ d: "M50,120 L250,8 L450,120" }}
                  animate={{ d: "M50,120 L250,270 L450,120" }}
                  transition={{ duration: 1.4, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Wax seal — stamps on after flap closes */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 2.2, duration: 0.35, type: "spring", stiffness: 350, damping: 15 }}
                  style={{ transformOrigin: "250px 200px" }}
                >
                  {/* Seal outer ring */}
                  <circle cx="250" cy="200" r="26" fill={C.accent} opacity="0.9" />
                  <circle cx="250" cy="200" r="22" fill={C.panel} />
                  <circle cx="250" cy="200" r="20" fill="none" stroke={C.accent} strokeWidth="0.8" opacity="0.4" />
                  <text x="250" y="208" textAnchor="middle" fill={C.light} fontSize="18" fontFamily="'Instrument Serif', serif" fontStyle="italic">S</text>
                </motion.g>
              </svg>

              <motion.p
                className="text-muted text-sm uppercase tracking-widest mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Sealing your message...
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* ════════════════════ FLYING — Robot delivers ════════════════════ */}
        {phase === "flying" && (
          <motion.div
            key="flying"
            className="flex items-center justify-center min-h-[480px] relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Mailbox — drops in from above */}
            <motion.div
              className="absolute top-6 left-1/2 -translate-x-1/2"
              initial={{ y: -240, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 100, damping: 14 }}
            >
              <svg width="240" height="220" viewBox="0 0 240 220">
                {/* Post */}
                <rect x="106" y="145" width="28" height="75" fill="#333" rx="4" />
                <rect x="82" y="208" width="76" height="10" rx="4" fill="#2a2a4e" />
                {/* Mailbox body */}
                <rect x="22" y="22" width="196" height="128" rx="16" fill={C.body} stroke={C.accent} strokeWidth="1.5" />
                <rect x="22" y="22" width="196" height="36" rx="16" fill={C.bodyLt} />
                {/* Mail slot */}
                <rect x="55" y="80" width="130" height="12" rx="4" fill={C.panel} stroke="#333" strokeWidth="1" />
                {/* Slot glow */}
                <motion.rect
                  x="60" y="82" width="120" height="8" rx="3"
                  fill={C.accent}
                  opacity={0.08}
                  animate={{ opacity: [0.05, 0.15, 0.05] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {/* Label */}
                <text x="120" y="130" textAnchor="middle" fill={C.accent} fontSize="13" fontWeight="700" letterSpacing="3" fontFamily="Inter, sans-serif">YOUR INBOX</text>
                {/* Bolts */}
                <circle cx="44" cy="40" r="3" fill="#333" stroke="#555" strokeWidth="0.8" />
                <circle cx="196" cy="40" r="3" fill="#333" stroke="#555" strokeWidth="0.8" />
                {/* Flag */}
                <motion.g
                  initial={{ rotate: 0 }}
                  animate={{ rotate: -90 }}
                  transition={{ delay: 2.2, duration: 0.5, type: "spring", stiffness: 180 }}
                  style={{ transformOrigin: "216px 78px" }}
                >
                  <rect x="214" y="50" width="5" height="42" rx="2" fill="#e05050" />
                  <rect x="214" y="50" width="20" height="16" rx="2" fill="#e05050" />
                </motion.g>
              </svg>
            </motion.div>

            {/* Robot flying upward with envelope */}
            <motion.div
              className="relative z-10"
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: [60, -200], opacity: [1, 1, 0] }}
              transition={{ duration: 2.6, delay: 0.2, ease: "easeIn" }}
            >
              <svg width="90" height="130" viewBox="0 0 90 130">
                {/* Head — sleek oval */}
                <ellipse cx="45" cy="20" rx="20" ry="16" fill={C.body} stroke="#333" strokeWidth="1" />
                {/* Eyes */}
                <circle cx="38" cy="18" r="4.5" fill={C.accent} />
                <circle cx="52" cy="18" r="4.5" fill={C.accent} />
                <circle cx="38" cy="18" r="2" fill={C.light} />
                <circle cx="52" cy="18" r="2" fill={C.light} />
                {/* Antenna */}
                <line x1="45" y1="5" x2="45" y2="0" stroke="#444" strokeWidth="1.5" />
                <motion.circle cx="45" cy="0" r="2.5" fill={C.accent} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }} />
                {/* Neck */}
                <rect x="40" y="35" width="10" height="5" rx="2" fill="#2a2a4e" />
                {/* Body */}
                <rect x="24" y="40" width="42" height="28" rx="8" fill={C.body} stroke="#333" strokeWidth="1" />
                <circle cx="45" cy="53" r="4" fill={C.accent} opacity="0.3" />
                {/* Backpack with envelope */}
                <rect x="13" y="42" width="14" height="22" rx="5" fill="#333" stroke="#555" strokeWidth="0.8" />
                <rect x="63" y="42" width="14" height="22" rx="5" fill="#333" stroke="#555" strokeWidth="0.8" />
                {/* Mini sealed envelope */}
                <rect x="15" y="47" width="10" height="7" rx="1.5" fill="#111" stroke={C.accent} strokeWidth="0.6" />
                <circle cx="20" cy="50" r="2" fill={C.accent} opacity="0.5" />
                {/* Arms */}
                <path d="M24 48 L14 58 L12 66" stroke="#2a2a4e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M66 48 L76 58 L78 66" stroke="#2a2a4e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {/* Jetpack flames */}
                <motion.g animate={{ opacity: [0.5, 1, 0.5], scaleY: [0.7, 1.4, 0.7] }} transition={{ duration: 0.2, repeat: Infinity }} style={{ transformOrigin: "20px 70px" }}>
                  <ellipse cx="20" cy="72" rx="5" ry="16" fill="#e08040" opacity="0.7" />
                  <ellipse cx="20" cy="70" rx="3" ry="9" fill="#f0c868" />
                </motion.g>
                <motion.g animate={{ opacity: [0.5, 1, 0.5], scaleY: [0.8, 1.5, 0.8] }} transition={{ duration: 0.18, repeat: Infinity }} style={{ transformOrigin: "70px 70px" }}>
                  <ellipse cx="70" cy="72" rx="5" ry="16" fill="#e08040" opacity="0.7" />
                  <ellipse cx="70" cy="70" rx="3" ry="9" fill="#f0c868" />
                </motion.g>
                {/* Legs tucked */}
                <path d="M34 68 L32 82 L36 92" stroke="#2a2a4e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M56 68 L58 82 L54 92" stroke="#2a2a4e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </motion.div>

            <motion.p
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted text-sm uppercase tracking-widest whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Delivering your message...
            </motion.p>
          </motion.div>
        )}

        {/* ════════════════════ ARRIVED ════════════════════ */}
        {phase === "arrived" && (
          <motion.div
            key="arrived"
            className="flex flex-col items-center justify-center min-h-[480px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Happy robot waving */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <svg width="80" height="70" viewBox="0 0 80 70">
                <ellipse cx="40" cy="17" rx="18" ry="14" fill={C.body} stroke="#333" strokeWidth="1.5" />
                <circle cx="34" cy="15" r="5" fill={C.accent} />
                <circle cx="46" cy="15" r="5" fill={C.accent} />
                <circle cx="34" cy="15" r="2" fill={C.light} />
                <circle cx="46" cy="15" r="2" fill={C.light} />
                <line x1="40" y1="3" x2="40" y2="0" stroke="#555" strokeWidth="2" />
                <motion.circle cx="40" cy="0" r="3" fill={C.accent} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }} />
                {/* Smile */}
                <path d="M33 24 Q40 30 47 24" stroke={C.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                {/* Left hand waving */}
                <motion.g animate={{ rotate: [0, 18, -18, 18, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.5 }} style={{ transformOrigin: "15px 40px" }}>
                  <path d="M22 28 L12 36 L8 48" stroke="#2a2a4e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <circle cx="8" cy="50" r="4" fill={C.body} stroke={C.accent} strokeWidth="1" />
                </motion.g>
                {/* Right hand waving */}
                <motion.g animate={{ rotate: [0, -18, 18, -18, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.7 }} style={{ transformOrigin: "65px 40px" }}>
                  <path d="M58 28 L68 36 L72 48" stroke="#2a2a4e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <circle cx="72" cy="50" r="4" fill={C.body} stroke={C.accent} strokeWidth="1" />
                </motion.g>
              </svg>
            </motion.div>

            <motion.h3
              className="text-2xl md:text-3xl font-display italic text-text-primary mt-6 mb-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Check your inbox!
            </motion.h3>

            <motion.p
              className="text-muted text-sm mb-8 text-center max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              We received your message and will get back to you shortly.
            </motion.p>

            <motion.button
              onClick={reset}
              className="rounded-full border border-stroke px-6 py-3 text-sm hover:bg-white hover:text-black transition-all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Send another message
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
