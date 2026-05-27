import { useEffect, useRef, useState } from "react";
import type { FC, FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";

type Phase = "entering" | "form" | "sent" | "done";

interface DonationOverlayProps {
  onClose: () => void;
}

export const DonationOverlay: FC<DonationOverlayProps> = ({ onClose }) => {
  const [phase, setPhase] = useState<Phase>("entering");
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    if (phase === "entering") {
      const t = setTimeout(() => setPhase("form"), 500);
      return () => clearTimeout(t);
    }
    if (phase === "done") {
      const t = setTimeout(() => onCloseRef.current(), 200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPhase("sent");
  };

  const inputCls =
    "w-full bg-[#0a0a0a] border border-stroke rounded-xl px-5 py-3.5 text-text-primary placeholder:text-muted/50 focus:outline-none focus:border-[#b8d4ef]/50 transition-colors text-sm";

  return (
    <motion.div
      className="fixed inset-0 z-[9998] bg-bg overflow-y-auto"
      initial={{ clipPath: "circle(0% at 50% 100%)" }}
      animate={{
        clipPath:
          phase === "done"
            ? "circle(0% at 100% 50%)"
            : "circle(150% at 50% 100%)",
      }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="min-h-screen flex items-center justify-center px-4 py-14"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.55 }}
      >
        {phase !== "sent" ? (
          <div className="w-full max-w-3xl">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-8 h-px bg-stroke" />
                <span className="text-xs text-muted uppercase tracking-[0.3em]">Partner With Sparks</span>
                <div className="w-8 h-px bg-stroke" />
              </div>
              <h2 className="text-5xl md:text-7xl font-display italic tracking-tight mb-4">
                Send us your<br />
                <span className="not-italic font-sans font-medium text-3xl md:text-5xl text-text-primary/80">idea.</span>
              </h2>
              <p className="text-muted text-sm max-w-md mx-auto">
                Tell us about your program, collaboration, or project idea. We will read it like a letter from someone who wants to build something meaningful with us.
              </p>
            </div>

            <div className="relative mt-20">
              <div
                className="absolute left-2 right-2 z-0"
                style={{
                  top: "-70px",
                  height: "72px",
                  background: "linear-gradient(180deg, #1e1e38 0%, #16162c 100%)",
                  clipPath: "polygon(0 100%, 50% 0%, 100% 100%)",
                }}
              />

              <div className="relative bg-surface border border-stroke rounded-b-3xl overflow-hidden z-10">
                <div className="m-3 md:m-5 rounded-2xl border border-stroke/20 bg-bg/60">
                  <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-bg/80 flex items-center justify-center">
                          <span className="font-display italic text-[11px]">S</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted uppercase tracking-[0.2em]">To</p>
                        <p className="text-sm font-medium">Sparks Partnership Team</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Your Name</label>
                        <input type="text" placeholder="Your full name" className={inputCls} required />
                      </div>
                      <div>
                        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Email</label>
                        <input type="email" placeholder="you@example.com" className={inputCls} required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Phone / WhatsApp</label>
                        <input type="tel" placeholder="Optional" className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-xs text-muted uppercase tracking-widest mb-2">School / Organization</label>
                        <input type="text" placeholder="Optional" className={inputCls} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Idea / Program Name</label>
                        <input type="text" placeholder="What should we call it?" className={inputCls} required />
                      </div>
                      <div>
                        <label className="block text-xs text-muted uppercase tracking-widest mb-2">Type</label>
                        <select className={`${inputCls} appearance-none cursor-pointer`} required defaultValue="">
                          <option value="" disabled>Select one...</option>
                          <option>Workshop</option>
                          <option>Product idea</option>
                          <option>School collaboration</option>
                          <option>Volunteer partnership</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-muted uppercase tracking-widest mb-2">Tell us about the idea</label>
                      <textarea
                        placeholder="What do you want to build, who will it help, and how can Sparks be involved?"
                        rows={5}
                        className={`${inputCls} resize-none`}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-muted uppercase tracking-widest mb-2">What support do you need?</label>
                      <textarea
                        placeholder="Mentors, volunteers, venue, technical help, materials, outreach..."
                        rows={3}
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full group relative rounded-2xl text-sm px-7 py-4 mt-4 hover:scale-[1.02] transition-all duration-300 bg-text-primary text-bg font-medium overflow-hidden"
                    >
                      <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute inset-[2px] bg-bg rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative z-10 group-hover:text-text-primary transition-colors inline-flex items-center justify-center gap-2">
                        Send Partnership Idea <Send className="w-4 h-4" />
                      </span>
                    </button>
                  </form>
                </div>

                <div className="absolute bottom-0 left-3 right-3 md:left-5 md:right-5 h-10 overflow-hidden rounded-b-2xl pointer-events-none opacity-25">
                  <div className="w-full h-full" style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)", background: "linear-gradient(180deg, #222 0%, transparent 100%)" }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => setPhase("done")}
              className="mt-6 mx-auto flex items-center gap-2 text-muted text-sm hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to site
            </button>
          </div>
        ) : (
          <div className="text-center max-w-lg px-6">
            <div className="w-16 h-16 mx-auto rounded-full accent-gradient flex items-center justify-center mb-8">
              <Send className="w-7 h-7 text-bg" />
            </div>
            <h2 className="text-5xl md:text-7xl font-display italic tracking-tight mb-5">Received.</h2>
            <p className="text-muted leading-relaxed mb-8">
              Thanks for writing to Sparks. Your idea is on our desk, and our team will review how we can build or collaborate on it.
            </p>
            <button
              onClick={() => setPhase("done")}
              className="rounded-full border border-stroke px-7 py-3 text-sm font-medium hover:bg-white hover:text-black transition-all"
            >
              Return to site
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
