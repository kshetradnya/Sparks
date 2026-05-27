import { useEffect } from "react";
import type { FC } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Heart, Users, Lightbulb, Globe } from "lucide-react";

interface MissionPageProps {
  onClose: () => void;
  focusId?: string | null;
}

const FOCUS_AREAS = [
  {
    id: "hands-on",
    icon: Lightbulb,
    title: "Hands-On Learning",
    tagline: "Learn by building, not by watching.",
    desc: "We believe in learning by doing. Every workshop puts tools in people's hands — from soldering irons to AI prompts.",
    longDesc:
      "At Sparks, passive learning has no place. Our philosophy is rooted in the belief that understanding comes from creation. When a child wires a circuit and watches a fan spin, they don't just learn about electricity — they internalize the confidence that they can build things.\n\nEvery program we run is designed around tactile, hands-on experiences. We provide real components, real tools, and real challenges. Our volunteers don't lecture — they guide. They sit beside participants, ask questions, and let curiosity drive the learning.\n\nThis approach has proven transformative. Participants retain more, engage more, and come back for more. The spark of creation is addictive — and that's exactly the point.",
    highlights: [
      "Real components and tools in every session",
      "Volunteer mentors guide, never lecture",
      "Project-based learning with take-home creations",
      "Iterative design — build, test, improve",
    ],
  },
  {
    id: "every-gen",
    icon: Users,
    title: "Every Generation",
    tagline: "From 8 to 80, innovation knows no age.",
    desc: "From kids building their first circuits to seniors navigating AI — we design programs for every age and background.",
    longDesc:
      "Technology doesn't discriminate by age — and neither do we. Sparks was founded on the observation that the digital divide isn't just about access to devices. It's about confidence, context, and community.\n\nFor children, we make STEM tangible and exciting. For seniors, we make technology approachable and relevant. For everyone in between, we demystify AI and empower responsible, productive use.\n\nOur programs are intentionally designed with age-appropriate pacing, vocabulary, and outcomes. A workshop for 8-year-olds looks nothing like a session for 80-year-olds — but both are built on the same foundation: respect for the learner and a commitment to meeting them where they are.",
    highlights: [
      "Age-appropriate curriculum for every group",
      "High volunteer-to-participant ratios",
      "Inclusive by design — no prerequisites",
      "Programs for kids, adults, and seniors",
    ],
  },
  {
    id: "community",
    icon: Globe,
    title: "Community First",
    tagline: "We go where we're needed.",
    desc: "We go where we're needed. Our programs are community-driven, shaped by the people we serve.",
    longDesc:
      "Sparks doesn't wait for communities to come to us. We go to schools, senior homes, and community centers — bringing innovation directly to every doorstep.\n\nBefore launching any program in a new location, we listen. We talk to community leaders, understand local needs, and design sessions that address real gaps. A farming community might need different AI tools than an urban school. A senior home with limited internet requires a different approach than a tech-savvy college campus.\n\nThis community-first philosophy means our impact is deeper and more lasting. We're not dropping in with a one-size-fits-all curriculum. We're building relationships and creating programs that genuinely serve.",
    highlights: [
      "Programs designed around community needs",
      "Partnerships with local schools and centers",
      "On-site workshops — we come to you",
      "Feedback-driven program iteration",
    ],
  },
];

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

export const MissionPage: FC<MissionPageProps> = ({ onClose, focusId }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const focusArea = focusId ? FOCUS_AREAS.find((f) => f.id === focusId) : null;

  if (focusArea) {
    const Icon = focusArea.icon;
    return (
      <motion.div
        className="fixed inset-0 z-[9999] bg-bg overflow-y-auto"
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{ clipPath: "circle(150% at 50% 50%)" }}
        exit={{ clipPath: "circle(0% at 50% 50%)" }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

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

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pt-28 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-surface border border-stroke flex items-center justify-center mb-8">
              <Icon className="w-7 h-7 text-[#b8d4ef]" />
            </div>

            <h1 className="text-5xl md:text-7xl font-display italic tracking-tight mb-4 leading-[0.95]">
              {focusArea.title}
            </h1>
            <p className="text-xl md:text-2xl text-text-primary/60 font-light mb-16">
              {focusArea.tagline}
            </p>
          </motion.div>

          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <div className="text-text-primary/80 text-lg leading-relaxed space-y-6">
              {focusArea.longDesc.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <h2 className="text-2xl font-display italic mb-8">Key principles.</h2>
            <div className="bg-surface border border-stroke rounded-3xl p-8">
              <ul className="space-y-4">
                {focusArea.highlights.map((h, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 text-text-primary/80"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#b8d4ef] mt-2.5 flex-shrink-0" />
                    <span>{h}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
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
                Get Involved <ArrowUpRight className="w-4 h-4" />
              </span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-bg overflow-y-auto"
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      animate={{ clipPath: "circle(150% at 50% 50%)" }}
      exit={{ clipPath: "circle(0% at 50% 50%)" }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

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

        {/* HERO */}
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

        {/* THE STORY */}
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
                Founded by Nitya Jain — a Cambridge Checkpoint World Topper — Sparks was born out of a conviction that education shouldn't be passive. When a child builds a working fan from a motor and wires, they don't just learn physics — they discover they can create. When a grandparent sends their first voice message, they don't just learn tech — they feel less alone.
              </p>
            </div>
            <div className="text-text-primary/80 text-lg leading-relaxed space-y-6">
              <p>
                Joined by co-founders Kshetradnya (an ML enthusiast) and Aagam Jain (a creative force), the team grew from a weekend project into a movement. Three programs, 500+ lives touched, and a growing community of volunteers who believe that the best way to learn is by doing.
              </p>
              <p>
                Today, Sparks operates across schools, community centers, and senior homes in Mumbai — with plans to expand to new cities. We're not just teaching skills. We're building confidence, one spark at a time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* VALUES */}
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

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
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
