import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hls from "hls.js";
import {
  ArrowUpRight,
  BrainCircuit,
  Glasses,
  HandHeart,
  HeartPulse,
  Lightbulb,
  ShieldCheck,
  UsersRound,
  Wrench,
} from "lucide-react";

import { LoadingScreen } from "./components/LoadingScreen";
import { ContactForm } from "./components/ContactForm";
import { FooterRobot } from "./components/FooterRobot";
import { DonationOverlay } from "./components/DonationOverlay";
import { MissionPage } from "./components/MissionPage";
import aagamImg from "../Aagam.png";
import kshetraImg from "../Kshetra.png";
import nityaImg from "../Nitya.png";
import vivanImg from "../Vivan.png";

gsap.registerPlugin(ScrollTrigger);

const roles = ["Educators", "Mentors", "Innovators", "Change-Makers"];

const founders = [
  {
    name: "Nitya Jain",
    role: "Founder",
    desc: "Curious, driven, and deeply focused on meaningful impact.\nAt Sparks, he leads the vision, partnerships, and mission behind every program.",
    img: nityaImg,
  },
  {
    name: "Kshetradnya Patole",
    role: "Chief Technology Officer",
    desc: "A builder at heart with a strong interest in mathematics, machine learning, and systems.\nAt Sparks, he leads technical development and turns ideas into working prototypes.",
    img: kshetraImg,
  },
  {
    name: "Aagam Jain",
    role: "Chief Innovations Officer",
    desc: "Creative, expressive, and always looking for fresh ways to make ideas feel alive.\nAt Sparks, he shapes innovation strategy, creative direction, and new program ideas.",
    img: aagamImg,
  },
  {
    name: "Vivan Kudale",
    role: "Chief Operations Officer",
    desc: "Practical, dependable, and strong at bringing people and plans together.\nAt Sparks, he manages operations, coordination, and on-ground execution.",
    img: vivanImg,
  },
];

const quickLookCards = [
  {
    kicker: "01 / Learn",
    title: "Young Makers Lab",
    desc: "Hands-on STEM sessions where kids build simple real-world projects and discover that science is something they can touch, test, and create.",
    points: ["Circuit kits and simple motors", "Guided build sessions", "Take-home working projects"],
    Icon: Wrench,
  },
  {
    kicker: "02 / Build",
    title: "Vision Spectacles",
    desc: "A coming-soon assistive technology project focused on smart spectacles for blind users, designed around everyday usefulness and free access.",
    points: ["Obstacle-awareness support", "Comfort-first wearable design", "Free access for users"],
    Icon: Glasses,
  },
  {
    kicker: "03 / Explain",
    title: "AI for Good",
    desc: "A planned public awareness initiative that makes AI easier to understand, safer to use, and more useful for students, families, and communities.",
    points: ["Responsible AI basics", "Practical everyday use cases", "Safety, ethics, and clarity"],
    Icon: BrainCircuit,
  },
  {
    kicker: "04 / Care",
    title: "Tech for Health",
    desc: "Exploring responsible, low-cost health technology that can support prevention, accessibility, early awareness, and everyday care.",
    points: ["Practical health access tools", "Prevention and early-awareness ideas", "Human-centered safety design"],
    Icon: HeartPulse,
  },
  {
    kicker: "05 / Serve",
    title: "Community First",
    desc: "Every Sparks project starts with a real need, then turns student energy, design, and technology into something practical for people.",
    points: ["Listen before building", "Partner with local groups", "Measure real usefulness"],
    Icon: UsersRound,
  },
];

const philosophyCards = [
  {
    title: "Our Vision",
    desc: "A world where technology feels less frightening and more useful, humane, and accessible to everyone.",
    icon: "01",
    Icon: Lightbulb,
  },
  {
    title: "Our Mission",
    desc: "To use hands-on learning, assistive products, and responsible innovation for the betterment of society.",
    icon: "02",
    Icon: HandHeart,
  },
  {
    title: "Our Values",
    desc: "Empathy, safety, access, and service guide what we build and who we build it for.",
    icon: "03",
    Icon: ShieldCheck,
  },
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [partnerHovered, setPartnerHovered] = useState(false);
  const [showMission, setShowMission] = useState(false);

  const handleComplete = useCallback(() => setIsLoading(false), []);
  const handlePartnerFormClose = useCallback(() => setShowPartnerForm(false), []);
  const handleMissionClose = useCallback(() => setShowMission(false), []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const footerVideoRef = useRef<HTMLVideoElement>(null);
  const quickLookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setRoleIndex((p) => (p + 1) % roles.length), 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initVideo = (el: HTMLVideoElement | null, src: string) => {
      if (!el) return;
      if (src.endsWith(".m3u8")) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(el);
          hls.on(Hls.Events.MANIFEST_PARSED, () => el.play().catch(() => {}));
        } else if (el.canPlayType("application/vnd.apple.mpegurl")) {
          el.src = src;
          el.addEventListener("loadedmetadata", () => el.play().catch(() => {}));
        }
      } else {
        el.src = src;
        el.load();
        el.play().catch(() => {});
      }
    };
    initVideo(videoRef.current, "https://videos.pexels.com/video-files/31575746/13456574_2560_1440_30fps.mp4");
    initVideo(footerVideoRef.current, "https://videos.pexels.com/video-files/31575747/13456598_2560_1440_30fps.mp4");
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      // Hero entrance — skip h1 (already visible from loader transition)
      gsap.fromTo(
        ".blur-in",
        { opacity: 0, filter: "blur(10px)", y: 20 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.12, ease: "power3.out", delay: 0.2 }
      );

      // Quick Look horizontal scroll
      if (quickLookRef.current) {
        const track = quickLookRef.current.querySelector(".quick-look-track") as HTMLElement;
        if (track) {
          const initQuickLook = () => {
            const totalScroll = track.scrollWidth - window.innerWidth;
            if (totalScroll > 100) {
              gsap.to(track, {
                x: -totalScroll,
                ease: "none",
                scrollTrigger: {
                  trigger: quickLookRef.current,
                  start: "top top",
                  end: () => `+=${totalScroll}`,
                  pin: true,
                  scrub: 1,
                  invalidateOnRefresh: true,
                },
              });
            }
            ScrollTrigger.refresh();
          };
          setTimeout(initQuickLook, 500);
        }
      }

      // Marquee
      gsap.to(".marquee-inner", { xPercent: -50, ease: "none", duration: 40, repeat: -1 });

      // Founder cards
      document.querySelectorAll(".founder-card").forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, delay: i * 0.15, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 95%", toggleActions: "play none none none" },
          }
        );
      });

      // Mission
      gsap.to(".mission-bg-text", {
        yPercent: -20,
        scrollTrigger: { trigger: ".mission-section", start: "top bottom", end: "bottom top", scrub: true },
      });
      document.querySelectorAll(".mission-reveal").forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 30, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: i * 0.2,
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
          }
        );
      });
      document.querySelectorAll(".mission-card").forEach((card) => {
        gsap.to(card, {
          rotationX: -10, rotationY: 10, z: 50,
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      // Bio word reveal
      const bioWords = document.querySelectorAll(".bio-word");
      if (bioWords.length > 0) {
        gsap.fromTo(bioWords, { opacity: 0.15, color: "rgba(255,255,255,0.1)" }, {
          opacity: 1, color: "#ffffff", stagger: 0.08,
          scrollTrigger: { trigger: ".about-bio-container", start: "top 90%", end: "top 15%", scrub: true },
        });
      }

      // Contact section
      document.querySelectorAll(".contact-reveal").forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, delay: i * 0.2,
            scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [isLoading]);

  return (
    <div className="bg-bg min-h-screen text-text-primary selection:bg-text-primary selection:text-bg overflow-x-hidden">
      {isLoading && <LoadingScreen onComplete={handleComplete} />}

      {/* Mission Page Overlay */}
      <AnimatePresence>
        {showMission && <MissionPage onClose={handleMissionClose} />}
      </AnimatePresence>

      {/* Partner idea overlay */}
      <AnimatePresence>
        {showPartnerForm && <DonationOverlay onClose={handlePartnerFormClose} />}
      </AnimatePresence>

      {/* NAVBAR */}
      {!isLoading && (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 transition-all duration-300">
          <div className="inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2 shadow-md shadow-black/10">
            <div className="w-9 h-9 rounded-full relative group cursor-pointer overflow-hidden flex items-center justify-center transition-transform hover:scale-110">
              <div className="absolute inset-0 accent-gradient group-hover:rotate-180 transition-transform duration-700" />
              <div className="w-8 h-8 rounded-full bg-bg relative z-10 flex items-center justify-center">
                <span className="font-display italic text-[13px]">S</span>
              </div>
            </div>
            <div className="w-px h-5 bg-stroke mx-1 hidden md:block" />
            <div className="hidden md:flex items-center gap-10">
              {[
                { name: "Philosophy", id: "philosophy" },
                { name: "Snapshot", id: "quicklook" },
                { name: "About", id: "about" },
                { name: "Contact", id: "contact" },
              ].map((item) => (
                <button key={item.name} onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
                  className="text-sm font-medium tracking-wide text-text-primary/70 hover:text-text-primary transition-colors cursor-pointer">
                  {item.name}
                </button>
              ))}
              <button className="accent-gradient px-6 py-2 rounded-full text-sm font-bold text-white hover:opacity-90 transition-opacity cursor-pointer">
                Join Us
              </button>
            </div>
            <div className="w-px h-5 bg-stroke mx-1" />
            <button onClick={() => setShowPartnerForm(true)}
              className="group relative flex items-center text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full overflow-hidden">
              <span className="absolute inset-[-2px] accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              <span className="absolute inset-0 bg-surface rounded-full backdrop-blur-md -z-10" />
              <span className="text-text-primary flex items-center gap-1 relative z-10">
                Partner <ArrowUpRight className="w-3 h-3" />
              </span>
            </button>
          </div>
        </nav>
      )}

      {/* HERO */}
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <video ref={videoRef} className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2" autoPlay muted loop playsInline />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[1] opacity-70">
          <div className="visual-node visual-float absolute left-[8%] top-[28%] hidden md:flex">
            <Wrench className="w-4 h-4" />
            <span>Build</span>
          </div>
          <div className="visual-node visual-float-delayed absolute right-[10%] top-[34%] hidden md:flex">
            <BrainCircuit className="w-4 h-4" />
            <span>Explain</span>
          </div>
          <div className="visual-node visual-float-slow absolute left-[14%] bottom-[22%] hidden lg:flex">
            <HeartPulse className="w-4 h-4" />
            <span>Care</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto h-full justify-center">
          <p className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8">SPARKS NPO</p>
          <h1 className="text-7xl md:text-[7rem] lg:text-[9rem] font-display italic leading-[0.9] tracking-tight text-text-primary mb-6">
            Sparks
          </h1>
          <div className="blur-in text-xl md:text-3xl text-text-primary/90 font-light tracking-wide mb-6">
            We are{" "}
            <span key={roleIndex} className="font-display italic text-text-primary animate-role-fade-in inline-block font-medium">
              {roles[roleIndex]}
            </span>
          </div>
          <p className="blur-in text-sm md:text-base text-muted max-w-md mb-10">
            Igniting curiosity and empowering communities through hands-on STEM workshops and AI literacy programs. 500+ lives impacted and counting.
          </p>
          <div className="blur-in flex flex-col sm:flex-row gap-4">
            <button onClick={() => document.getElementById("philosophy")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative rounded-full text-sm px-7 py-3.5 hover:scale-105 transition-all duration-300 bg-text-primary text-bg hover:text-text-primary overflow-hidden">
              <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 font-medium">Our Philosophy</span>
            </button>
            <button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative rounded-full text-sm px-7 py-3.5 hover:scale-105 transition-all duration-300 border-2 border-stroke bg-bg text-text-primary hover:border-transparent overflow-hidden">
              <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 font-medium">Meet the Team</span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-[10px] text-muted uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-px h-10 bg-stroke relative overflow-hidden">
            <div className="w-full h-full bg-text-primary absolute top-0 left-0 animate-[scroll-down_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section id="philosophy" className="mission-section bg-bg py-24 md:py-32 relative z-20 border-t border-stroke/50 overflow-hidden">
        <div className="mission-bg-text absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <h2 className="text-[20vw] font-display italic leading-none whitespace-nowrap">SPARKS</h2>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <div className="text-center mb-20 md:mb-24">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-8 h-px bg-stroke" /><span className="text-xs text-muted uppercase tracking-[0.3em]">Philosophy</span><div className="w-8 h-px bg-stroke" />
            </div>
            <h2 className="mission-reveal text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] max-w-4xl mx-auto group">
              Using tech for{" "}
              <span className="font-display italic text-text-primary group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#b8d4ef] group-hover:to-[#e0ecf7] transition-all duration-500">curiosity</span>
              , care, and the betterment of society — one small step at a time.
            </h2>
            <p className="mission-reveal text-muted text-sm md:text-base leading-relaxed max-w-2xl mx-auto mt-8">
              In a time when many people fear how technology can be misused, Sparks chooses a different path: building and teaching technology that helps communities, improves access, and makes the world a little better.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 perspective-[1000px]">
            {philosophyCards.map((pillar, i) => (
              <div key={i} onClick={() => setShowMission(true)} className="mission-reveal mission-card group relative bg-surface/50 border border-stroke p-10 rounded-[2.5rem] hover:bg-surface transition-colors duration-500 transform-gpu overflow-hidden cursor-pointer">
                <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 font-display italic select-none text-stroke">{pillar.icon}</div>
                <div className="relative mb-8 h-24 overflow-hidden rounded-2xl border border-stroke bg-bg/50">
                  <div className="absolute inset-0 tech-grid opacity-40" />
                  <div className="signal-sweep absolute inset-y-0 left-0 w-16" />
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 h-12 w-12 rounded-2xl border border-[#b8d4ef]/30 bg-[#b8d4ef]/10 flex items-center justify-center text-[#b8d4ef]">
                    <pillar.Icon className="h-5 w-5" />
                  </div>
                  <div className="absolute right-5 top-6 h-2 w-2 rounded-full bg-[#b8d4ef] visual-pulse" />
                  <div className="absolute right-12 bottom-7 h-1.5 w-1.5 rounded-full bg-white/50" />
                  <div className="absolute right-20 top-11 h-1 w-1 rounded-full bg-white/30" />
                </div>
                <h3 className="text-2xl font-display italic mb-4 group-hover:translate-x-2 transition-transform">{pillar.title}</h3>
                <p className="text-muted leading-relaxed group-hover:text-text-primary/80 transition-colors">{pillar.desc}</p>
                <div className="mt-8 w-12 h-12 rounded-full border border-stroke flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SNAPSHOT — Horizontal Scroll Concepts */}
      <section id="quicklook" ref={quickLookRef} className="relative z-20 h-screen overflow-hidden border-t border-stroke/50">
        <div className="quick-look-track flex items-center h-full gap-8 px-12 will-change-transform">
          <div className="flex-shrink-0 w-[380px] md:w-[480px] h-full flex flex-col justify-center pr-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Snapshot</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display italic tracking-tight mb-6">What We're<br />Building.</h2>
            <p className="text-muted text-sm max-w-xs">
              Until we have real photos from every program, this space shows the ideas, products, and community work Sparks is focused on.
            </p>
          </div>
          {quickLookCards.map((item, i) => (
            <div key={i} className="flex-shrink-0 w-[320px] md:w-[420px] h-[65vh] rounded-3xl overflow-hidden relative group bg-surface border border-stroke p-7 md:p-8 flex flex-col justify-between hover:border-text-primary/30 transition-all duration-500">
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                <div className="absolute -top-20 -right-24 text-[14rem] font-display italic leading-none">{String(i + 1).padStart(2, "0")}</div>
              </div>
              <div>
                <span className="inline-block bg-bg/80 border border-stroke px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest mb-10">
                  {item.kicker}
                </span>
                <div className="relative mb-7 h-24 overflow-hidden rounded-2xl border border-stroke bg-bg/60">
                  <div className="absolute inset-0 tech-grid opacity-50" />
                  <div className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-[#b8d4ef]/50 to-transparent" />
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl bg-[#b8d4ef]/10 border border-[#b8d4ef]/30 flex items-center justify-center text-[#b8d4ef] visual-float-slow">
                    <item.Icon className="h-6 w-6" />
                  </div>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-white/15 flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-[#b8d4ef] visual-pulse" />
                  </div>
                  <div className="signal-sweep absolute inset-y-0 left-0 w-20" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display italic tracking-tight mb-4">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                <ul className="mt-6 space-y-2.5">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-text-primary/75">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#b8d4ef]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div className="h-px w-full bg-stroke" />
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-muted">
                  <span>Sparks</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="flex-shrink-0 w-[80px]" />
        </div>
      </section>

      {/* ABOUT / FOUNDERS */}
      <section id="about" className="bg-bg py-24 md:py-32 relative z-20 border-t border-stroke/50 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row gap-16 md:gap-24 mb-24 md:mb-32">
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-px bg-stroke" /><span className="text-xs text-muted uppercase tracking-[0.3em]">Who We Are</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display italic tracking-tight mb-12">Meet the<br />Team.</h2>
            </div>
            <div className="w-full md:w-1/2 about-bio-container pt-8 md:pt-16">
              <p className="text-2xl md:text-3xl leading-relaxed font-light text-text-primary mb-8">
                {"Sparks is a student-led NPO built on a simple belief: technology should empower everyone. From teaching kids to solder circuits to building free assistive spectacles for blind users — we bring innovation to every doorstep.".split(" ").map((word, i) => (
                  <span key={i} className="bio-word inline-block mr-[0.3em]">{word}</span>
                ))}
              </p>
              <div className="flex flex-col gap-6">
                {[
                  { label: "People impacted", value: "500+ across all programs" },
                  { label: "Active programs", value: "3 focused initiatives" },
                  { label: "Our approach", value: "Hands-on, Community-first" },
                ].map((item, i) => (
                  <div key={i} className="group cursor-pointer">
                    <p className="text-xs text-muted uppercase tracking-widest mb-2 group-hover:text-white transition-colors">{item.label}</p>
                    <p className="text-xl font-medium border-b border-stroke pb-4 group-hover:border-white transition-colors">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Founders Grid */}
          <div className="founders-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {founders.map((f, i) => (
              <div key={i} className="founder-card group bg-surface border border-stroke rounded-3xl overflow-hidden hover:border-text-primary/30 transition-all duration-500">
                <div className="aspect-square overflow-hidden relative">
                  <img src={f.img} alt={f.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="bg-bg/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest border border-stroke">{f.role}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-display italic mb-3">{f.name}</h3>
                  <p className="text-muted text-sm leading-relaxed whitespace-pre-line">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT US — Letter / Envelope */}
      <section id="contact" className="contact-section bg-bg py-24 md:py-32 relative z-20 border-t border-stroke/50">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16 md:mb-20">
            <div className="contact-reveal flex items-center justify-center gap-4 mb-8">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Get in Touch</span>
              <div className="w-8 h-px bg-stroke" />
            </div>
            <h2 className="contact-reveal text-5xl md:text-7xl font-display italic tracking-tight mb-6">
              Write to<br />
              <span className="not-italic font-sans font-medium text-3xl md:text-5xl text-text-primary/80">Sparks.</span>
            </h2>
            <p className="contact-reveal text-muted text-sm max-w-md mx-auto">
              Tell us how you'd like to help, collaborate, or learn more — your message comes straight to our team.
            </p>
          </div>
          <div className="contact-reveal">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="relative w-full py-20 md:py-32 bg-bg overflow-hidden flex flex-col items-center justify-center z-20 min-h-screen">
        <div className="absolute inset-0 w-full h-full z-0">
          <video ref={footerVideoRef} className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1]" autoPlay muted loop playsInline />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1">
          <div className="w-full overflow-hidden mb-12 select-none flex">
            <div className="marquee-inner flex whitespace-nowrap text-8xl md:text-[10rem] font-display italic text-white/20">
              {[...Array(10)].map((_, i) => <span key={i} className="px-4">IGNITING POTENTIAL •</span>)}
            </div>
          </div>

          {/* Footer Robot with cursor-tracking eyes */}
          <div className="mb-10">
            <FooterRobot
              isPartnerHovered={partnerHovered}
              onClick={() => setShowPartnerForm(true)}
            />
          </div>

          <div className="flex flex-col items-center text-center px-4">
            <h2 className="text-4xl md:text-6xl tracking-tight mb-8">
              Have an idea <br />for <span className="font-display italic">Sparks?</span>
            </h2>
            <button
              onClick={() => setShowPartnerForm(true)}
              onMouseEnter={() => setPartnerHovered(true)}
              onMouseLeave={() => setPartnerHovered(false)}
              className="group relative inline-flex items-center gap-3 rounded-full bg-white text-black px-8 py-4 text-lg font-medium hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="absolute -inset-2 rounded-full accent-gradient opacity-0 group-hover:opacity-30 blur-lg transition-opacity" />
              <span className="relative z-10">Partner with us</span>
              <ArrowUpRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="relative z-10 w-full px-6 md:px-12 mt-20 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
          <div className="flex items-center gap-6 text-sm text-white/50">
            {["Twitter", "LinkedIn", "Instagram"].map((s) => <a key={s} href="#" className="hover:text-white transition-colors">{s}</a>)}
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span>Currently seeking volunteers</span>
          </div>
          <div className="text-sm text-white/40">&copy; 2026 Sparks NPO</div>
        </div>
      </section>
    </div>
  );
}
