import { useEffect } from "react";
import type { FC } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Heart, Users, Lightbulb } from "lucide-react";

interface MissionPageProps {
  onClose: () => void;
}

const VALUES = [
  {
    icon: Heart,
    title: "Empathy First",
    desc: "Every program starts by listening. We understand people before we build for them, so our work is shaped by real needs, not assumptions.",
  },
  {
    icon: Users,
    title: "Tech for Good",
    desc: "At a time when technology can be misused, we choose to use it for care, access, education, and the betterment of society.",
  },
  {
    icon: Lightbulb,
    title: "Small Steps Matter",
    desc: "We believe change does not need to begin with something huge. One workshop, one product, one student, and one community can still move the world forward.",
  },
];


export const MissionPage: FC<MissionPageProps> = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-bg overflow-y-auto"
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      animate={{ clipPath: "circle(150% at 50% 50%)" }}
      exit={{ clipPath: "circle(0% at 50% 50%)" }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Back button */}
      <motion.button
        onClick={onClose}
        className="fixed top-6 left-6 z-[10000] flex items-center gap-2 rounded-full bg-surface/80 backdrop-blur-md border border-stroke px-5 py-3 text-sm text-text-primary hover:bg-white hover:text-black transition-all group"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </motion.button>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-24">

        {/* ═══ HERO ═══ */}
        <motion.div
          className="mb-24 md:mb-32"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">Our Mission</span>
            <div className="w-8 h-px bg-stroke" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display italic tracking-tight mb-8 leading-[0.95]">
            To ignite{" "}
            <span className="bg-gradient-to-r from-[#b8d4ef] to-[#e0ecf7] bg-clip-text text-transparent">
              curiosity
            </span>
            .
          </h1>

          <p className="text-xl md:text-2xl text-text-primary/70 max-w-3xl leading-relaxed font-light">
            We use technology for education, health, accessibility, and social good. In a time when people fear how tech can be used in harmful ways, Sparks is working to prove that it can still be human, helpful, and hopeful.
          </p>
        </motion.div>

        {/* ═══ THE STORY ═══ */}
        <motion.div
          className="mb-24 md:mb-32"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-display italic mb-10">The Spark that started it all.</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="text-text-primary/80 text-lg leading-relaxed space-y-6">
              <p>
                Sparks began with a simple observation: technology is advancing faster than most people can access it meaningfully. Kids are told to "learn to code" but never shown why it matters. People with disabilities are often priced out of practical assistive tools. Families hear about AI and new technology, but also worry about how these tools can be misused.
              </p>
              <p>
                Founded by Nitya Jain — a Cambridge Checkpoint World Topper pursuing IBDP — Sparks was born out of a conviction that technology should make society better, not more divided or afraid. When a child builds a working fan, they discover they can create. When a blind user receives assistive technology, innovation becomes personal. When technology supports health and safety, it becomes care.
              </p>
            </div>
            <div className="text-text-primary/80 text-lg leading-relaxed space-y-6">
              <p>
                Our vision is to build a future where technology is used responsibly, compassionately, and practically. We are not trying to change the world in one dramatic leap. We are trying to take one small step at a time: one program, one idea, one useful product, one person helped.
              </p>
              <p>
                Today, Sparks operates across schools and community spaces in Mumbai — with plans to expand to new cities. We're not just teaching skills. We're building confidence, access, and trust in technology, one spark at a time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ═══ VALUES ═══ */}
        <motion.div
          className="mb-24 md:mb-32"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-display italic mb-12">What we stand for.</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  className="group bg-surface border border-stroke rounded-3xl p-8 md:p-10 hover:border-text-primary/20 transition-all duration-500 relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                >
                  <div className="absolute top-0 right-0 p-6 text-7xl opacity-[0.03] font-display italic select-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-bg border border-stroke flex items-center justify-center mb-6 group-hover:border-[#b8d4ef]/40 transition-colors">
                    <Icon className="w-5 h-5 text-[#b8d4ef]" />
                  </div>
                  <h3 className="text-xl font-display italic mb-3 group-hover:translate-x-1 transition-transform">
                    {v.title}
                  </h3>
                  <p className="text-muted leading-relaxed">{v.desc}</p>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ CTA ═══ */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-display italic mb-6">Ready to spark change?</h2>
          <p className="text-muted text-sm max-w-md mx-auto mb-8">
            Whether you want to volunteer, partner, or simply learn more — every conversation starts a new spark.
          </p>
          <button
            onClick={() => {
              onClose();
              setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 800);
            }}
            className="group relative inline-flex items-center gap-2 rounded-full text-sm px-8 py-4 bg-text-primary text-bg font-medium hover:scale-[1.02] transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 group-hover:text-text-primary transition-colors flex items-center gap-2">
              Get in Touch <ArrowUpRight className="w-4 h-4" />
            </span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
