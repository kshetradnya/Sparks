import { useEffect } from "react";
import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Heart, Users, Lightbulb, Globe } from "lucide-react";

interface MissionPageProps {
  onClose: () => void;
}

const VALUES = [
  {
    icon: Heart,
    title: "Empathy First",
    desc: "Every program starts by listening. We understand communities before we serve them — designing workshops around real needs, not assumptions.",
  },
  {
    icon: Users,
    title: "Inclusive by Design",
    desc: "Age, background, experience — none of it matters. Whether you're 8 or 80, our programs meet you exactly where you are.",
  },
  {
    icon: Lightbulb,
    title: "Learning by Doing",
    desc: "No lectures, no slides. We put tools in people's hands and let curiosity take over. The best learning happens when you build something real.",
  },
  {
    icon: Globe,
    title: "Community Driven",
    desc: "We don't wait for people to come to us. We go to schools, senior homes, and community centers — bringing innovation to every doorstep.",
  },
];

const TIMELINE = [
  { year: "2024", event: "Sparks founded by Nitya Jain with a vision to make STEM accessible to every generation." },
  { year: "2024", event: "First Handheld Fan Workshop — 30 kids build their own fans from scratch." },
  { year: "2025", event: "Vision Spectacles begins, building free smart spectacles for blind people." },
  { year: "2025", event: "AI for Good public sessions begin. 500+ lives impacted across all programs." },
  { year: "2025", event: "Presented at SPARKS x SRMD spiritual retreat to a wider audience." },
  { year: "2026", event: "Expanding to new cities. Community STEM Day, AI Literacy for All, and Tech & Tea in the pipeline." },
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
            We bridge the technology gap and empower every generation to thrive in a digital world. From soldering irons to AI prompts — Sparks makes innovation accessible, hands-on, and human.
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
                Sparks began with a simple observation: technology is advancing faster than most people can keep up. Kids are told to "learn to code" but never shown why it matters. Seniors are left behind in a digital-first world. And everyday people are overwhelmed by AI headlines with no guidance on what it means for their lives.
              </p>
              <p>
                Founded by Nitya Jain — a Cambridge Checkpoint World Topper pursuing IBDP — Sparks was born out of a conviction that education shouldn't be passive. When a child builds a working fan from a motor and wires, they don't just learn physics — they discover they can create. When a grandparent sends their first voice message, they don't just learn tech — they feel less alone.
              </p>
            </div>
            <div className="text-text-primary/80 text-lg leading-relaxed space-y-6">
              <p>
                Joined by co-founders Kshetradnya (an ML enthusiast pursuing HSC) and Aagam Jain (a creative force pursuing A Levels), the team grew from a weekend project into a movement. Three programs, 500+ lives touched, and a growing community of volunteers who believe that the best way to learn is by doing.
              </p>
              <p>
                Today, Sparks operates across schools, community centers, and senior homes in Mumbai — with plans to expand to new cities. We're not just teaching skills. We're building confidence, one spark at a time.
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

        {/* ═══ TIMELINE ═══ */}
        <motion.div
          className="mb-24 md:mb-32"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-display italic mb-12">Our journey so far.</h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-stroke" />

            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex gap-6 md:gap-10 items-start relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
                >
                  {/* Dot on timeline */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-8 md:w-16 flex justify-center">
                      <div className="w-3 h-3 rounded-full bg-[#b8d4ef] border-2 border-bg" />
                    </div>
                  </div>

                  <div className="pb-2">
                    <span className="text-xs text-[#b8d4ef] uppercase tracking-widest font-medium">{item.year}</span>
                    <p className="text-text-primary/80 mt-1 leading-relaxed">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
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
