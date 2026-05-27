import { useRef, useEffect, useState } from "react";
import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, Users, Calendar, MapPin, Clock, Sparkles } from "lucide-react";

export interface EventData {
  id: string;
  title: string;
  tag: string;
  img: string;
  desc: string;
  longDesc: string;
  highlights: string[];
  stats: { label: string; value: string }[];
  date?: string;
  location?: string;
  duration?: string;
  video?: string; // path relative to public/
}

interface EventPageProps {
  event: EventData;
  onClose: () => void;
}

export const EventPage: FC<EventPageProps> = ({ event, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-bg overflow-y-auto"
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      animate={{ clipPath: "circle(150% at 50% 50%)" }}
      exit={{ clipPath: "circle(0% at 50% 50%)" }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Subtle grid pattern background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

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

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-20">

        {/* HERO AREA */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-stroke" />
            <span className="bg-bg/80 border border-stroke px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest">
              {event.tag}
            </span>
            <div className="w-8 h-px bg-stroke" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display italic tracking-tight mb-6 leading-[0.95]">
            {event.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-text-primary/60">{event.title.split(" ").slice(-1)}</span>
          </h1>

          {/* Meta info row */}
          <div className="flex flex-wrap gap-6 text-sm text-muted mt-8">
            {event.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
            {event.duration && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{event.duration}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* VIDEO SECTION (if available) */}
        {event.video && (
          <motion.div
            className="mb-20 relative rounded-3xl overflow-hidden border border-stroke bg-surface group"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="aspect-video relative">
              <video
                ref={videoRef}
                src={event.video}
                className="w-full h-full object-cover"
                playsInline
                preload="metadata"
                onLoadedData={() => setVideoReady(true)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
              />
              {/* Play/Pause overlay */}
              <AnimatePresence>
                {(!playing || !videoReady) && (
                  <motion.div
                    className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                    onClick={togglePlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
                    </motion.div>
                    <p className="absolute bottom-8 left-8 text-white/60 text-sm uppercase tracking-widest">
                      Watch our presentation
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Click-to-pause when playing */}
              {playing && (
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={togglePlay}
                />
              )}

              {/* Minimal control bar */}
              {playing && (
                <motion.div
                  className="absolute bottom-4 left-4 flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <Pause className="w-4 h-4 text-white" />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 mb-20">

          {/* Main description — 3 cols */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-display italic mb-8">About this program.</h2>
            <div className="text-text-primary/80 text-lg leading-relaxed space-y-6">
              {event.longDesc.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Cover image if no video */}
            {!event.video && (
              <div className="mt-12 rounded-3xl overflow-hidden border border-stroke">
                <img src={event.img} alt={event.title} className="w-full aspect-[16/9] object-cover" />
              </div>
            )}
          </motion.div>

          {/* Sidebar — 2 cols */}
          <motion.div
            className="lg:col-span-2 space-y-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            {/* Stats */}
            <div className="bg-surface border border-stroke rounded-3xl p-8">
              <h3 className="text-xs text-muted uppercase tracking-widest mb-6 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Impact
              </h3>
              <div className="space-y-6">
                {event.stats.map((stat, i) => (
                  <div key={i} className="group">
                    <p className="text-3xl font-display italic text-text-primary mb-1">{stat.value}</p>
                    <p className="text-sm text-muted uppercase tracking-widest">{stat.label}</p>
                    {i < event.stats.length - 1 && <div className="w-full h-px bg-stroke mt-6" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-surface border border-stroke rounded-3xl p-8">
              <h3 className="text-xs text-muted uppercase tracking-widest mb-6 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> Highlights
              </h3>
              <ul className="space-y-4">
                {event.highlights.map((h, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 text-sm text-text-primary/80"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#b8d4ef] mt-2 flex-shrink-0" />
                    <span>{h}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                onClose();
                setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 800);
              }}
              className="w-full group relative rounded-2xl text-sm px-7 py-4 hover:scale-[1.02] transition-all duration-300 bg-text-primary text-bg font-medium overflow-hidden"
            >
              <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-[2px] bg-bg rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 group-hover:text-text-primary transition-colors">Get Involved →</span>
            </button>
          </motion.div>
        </div>

        {/* DECORATIVE ROBOT ICON — bottom of page */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" className="text-muted/20">
            <rect x="15" y="12" width="30" height="22" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="24" cy="22" r="3" fill="currentColor" />
            <circle cx="36" cy="22" r="3" fill="currentColor" />
            <line x1="30" y1="12" x2="30" y2="6" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="30" cy="5" r="2" fill="currentColor" />
            <rect x="20" y="36" width="20" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="26" y1="42" x2="34" y2="42" stroke="currentColor" strokeWidth="1" />
            <line x1="26" y1="45" x2="34" y2="45" stroke="currentColor" strokeWidth="1" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};
