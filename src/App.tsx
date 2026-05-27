import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hls from "hls.js";
import { ArrowUpRight, Bell } from "lucide-react";

import { LoadingScreen } from "./components/LoadingScreen";
import { ContactForm } from "./components/ContactForm";
import { FooterRobot } from "./components/FooterRobot";
import { DonationOverlay } from "./components/DonationOverlay";
import { EventPage } from "./components/EventPage";
import type { EventData } from "./components/EventPage";
import { MissionPage } from "./components/MissionPage";

gsap.registerPlugin(ScrollTrigger);

const roles = ["Educators", "Mentors", "Innovators", "Change-Makers"];

const programs: EventData[] = [
  {
    id: "handheld-fan",
    title: "Handheld Fan Workshop",
    tag: "STEM for Kids",
    img: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800",
    desc: "Taught 200+ kids how to build their own handheld fans, sparking curiosity in engineering and hands-on creation.",
    longDesc:
      "The Handheld Fan Workshop is our flagship program — a hands-on STEM experience designed for children aged 6 to 14. Each child receives a kit containing a small DC motor, battery pack, wires, and fan blades. Guided step by step, they learn the basics of electrical circuits, motor mechanics, and simple engineering.\n\nWhat makes this workshop special is the moment a child's fan spins for the first time. That spark of wonder — the realization that they built something real — is exactly what Sparks is about. Over multiple sessions across schools and community centers, we've reached over 200 children, many of whom had never touched a circuit before.\n\nOur volunteers break down complex concepts into playful, age-appropriate lessons. By the end of each session, every child walks away with a working fan and a newfound confidence in their ability to create.",
    highlights: [
      "Hands-on circuit building with real components",
      "Age-appropriate lessons for 6–14 year olds",
      "Every child takes home a working handheld fan",
      "Conducted across multiple schools and communities",
      "Volunteer mentors guide each child individually",
      "Presented at SPARKS x SRMD spiritual retreat",
    ],
    stats: [
      { label: "Kids Taught", value: "200+" },
      { label: "Sessions Held", value: "12" },
      { label: "Schools Reached", value: "6" },
    ],
    date: "Ongoing — Monthly Sessions",
    location: "Mumbai, India",
    duration: "2 hours per session",
    video: "sparks-retreat.mp4",
  },
  {
    id: "ai-seniors",
    title: "AI for Seniors",
    tag: "Digital Literacy",
    img: "https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg?auto=compress&cs=tinysrgb&w=800",
    desc: "Helped senior citizens navigate and embrace AI tools, bridging the generational technology gap with patience and care.",
    longDesc:
      "AI for Seniors is our initiative to bridge the generational technology gap. We work with senior citizens — many of whom are encountering smartphones and computers for the first time — to introduce them to AI-powered tools that can genuinely improve their daily lives.\n\nFrom voice assistants and translation apps to AI-powered health trackers, we show participants how technology can be a helpful companion rather than an intimidating barrier. Sessions are intentionally slow-paced, patient, and hands-on, with a high volunteer-to-participant ratio.\n\nThe most rewarding moments come when a grandparent sends their first voice message, or when someone uses Google Lens to translate a medicine label. These small victories represent massive leaps in digital confidence.",
    highlights: [
      "Patient, one-on-one teaching approach",
      "Focus on practical AI tools for daily life",
      "Voice assistants, translation, health apps",
      "High volunteer-to-participant ratio",
      "Sessions at community centers and senior homes",
    ],
    stats: [
      { label: "Seniors Reached", value: "150+" },
      { label: "Sessions Held", value: "8" },
      { label: "Satisfaction Rate", value: "97%" },
    ],
    date: "Bi-monthly Sessions",
    location: "Mumbai, India",
    duration: "1.5 hours per session",
  },
  {
    id: "ai-for-good",
    title: "AI for Good",
    tag: "Public Awareness",
    img: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    desc: "Educated the general public on using AI responsibly and productively — empowering everyday people with tomorrow's tools.",
    longDesc:
      "AI for Good is our public-facing awareness program aimed at demystifying artificial intelligence for everyday people. In an era of rapid AI advancement, misinformation and fear can spread just as quickly as the technology itself. This program exists to change that.\n\nThrough interactive sessions, live demonstrations, and Q&A panels, we cover everything from how large language models work to the ethical considerations of AI in society. We make the complex simple without dumbing it down — respecting our audience's intelligence while meeting them where they are.\n\nWhether it's a college student wondering how AI will affect their career, a parent concerned about AI in education, or a professional looking to integrate AI into their workflow — AI for Good provides clear, honest, and empowering answers.",
    highlights: [
      "Interactive demos of AI tools and capabilities",
      "Ethical AI discussions and responsible usage",
      "Career guidance for an AI-driven future",
      "Open to all ages and backgrounds",
      "Live Q&A with tech-savvy volunteers",
    ],
    stats: [
      { label: "Attendees", value: "300+" },
      { label: "Events Held", value: "5" },
      { label: "Topics Covered", value: "15+" },
    ],
    date: "Quarterly Events",
    location: "Mumbai, India",
    duration: "2.5 hours per event",
  },
];

const founders = [
  {
    name: "Nitya Jain",
    role: "Founder",
    desc: "Pursuing IBDP, Nitya is a Cambridge Checkpoint World Topper and one of only 70 students selected for HVBGA. Her academic excellence fuels her drive to make quality education accessible to all.",
    img: "https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Kshetradnya",
    role: "Co-Founder",
    desc: "Pursuing HSC with a deep love for mathematics and machine learning. When not building ML models or solving equations, you'll find him gaming — bringing the same strategic thinking to both code and controllers.",
    img: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Aagam Jain",
    role: "Co-Founder",
    desc: "The creative force behind Sparks. Pursuing A Levels, Aagam brings artistry to everything — from playing guitar and composing melodies to crafting the creative vision of our programs.",
    img: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const quickLookImages = [
  { src: "https://images.pexels.com/photos/8613312/pexels-photo-8613312.jpeg?auto=compress&cs=tinysrgb&w=600", caption: "Kids building handheld fans" },
  { src: "https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg?auto=compress&cs=tinysrgb&w=600", caption: "AI workshop in action" },
  { src: "https://images.pexels.com/photos/7551442/pexels-photo-7551442.jpeg?auto=compress&cs=tinysrgb&w=600", caption: "Seniors learning AI tools" },
  { src: "https://images.pexels.com/photos/8386365/pexels-photo-8386365.jpeg?auto=compress&cs=tinysrgb&w=600", caption: "Public AI awareness session" },
  { src: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=600", caption: "Young engineers at work" },
  { src: "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=600", caption: "Community workshop" },
];

const futureEvents = [
  {
    title: "Community STEM Day",
    date: "June 15, 2026",
    desc: "A hands-on electronics and engineering workshop for kids aged 8-14. Build, break, and learn!",
    tag: "Workshop",
  },
  {
    title: "AI Literacy for All",
    date: "July 8, 2026",
    desc: "Our monthly public session on using AI tools responsibly — from ChatGPT to image generators.",
    tag: "Public Talk",
  },
  {
    title: "Tech & Tea",
    date: "August 22, 2026",
    desc: "A relaxed afternoon for seniors to brush up on AI skills, ask questions, and connect with peers.",
    tag: "Seniors",
  },
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const [showDonation, setShowDonation] = useState(false);
  const [partnerHovered, setPartnerHovered] = useState(false);
  const [activeEvent, setActiveEvent] = useState<EventData | null>(null);
  const [showMission, setShowMission] = useState(false);

  const handleComplete = useCallback(() => setIsLoading(false), []);
  const handleDonationClose = useCallback(() => setShowDonation(false), []);
  const handleEventClose = useCallback(() => setActiveEvent(null), []);
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

      // Future events
      document.querySelectorAll(".event-card").forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, delay: i * 0.15, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 95%", toggleActions: "play none none none" },
          }
        );
      });

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
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={handleComplete} />}
      </AnimatePresence>

      {/* Mission Page Overlay */}
      <AnimatePresence>
        {showMission && <MissionPage onClose={handleMissionClose} />}
      </AnimatePresence>

      {/* Event Detail Overlay */}
      <AnimatePresence>
        {activeEvent && <EventPage event={activeEvent} onClose={handleEventClose} />}
      </AnimatePresence>

      {/* Donation Overlay */}
      <AnimatePresence>
        {showDonation && <DonationOverlay onClose={handleDonationClose} />}
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
                { name: "Programs", id: "programs" },
                { name: "Quick Look", id: "quicklook" },
                { name: "About", id: "about" },
                { name: "Events", id: "events" },
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
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative flex items-center text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full overflow-hidden">
              <span className="absolute inset-[-2px] accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              <span className="absolute inset-0 bg-surface rounded-full backdrop-blur-md -z-10" />
              <span className="text-text-primary flex items-center gap-1 relative z-10">
                Donate <ArrowUpRight className="w-3 h-3" />
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
            <button onClick={() => document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative rounded-full text-sm px-7 py-3.5 hover:scale-105 transition-all duration-300 bg-text-primary text-bg hover:text-text-primary overflow-hidden">
              <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 font-medium">Our Programs</span>
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

      {/* PROGRAMS */}
      <section id="programs" className="bg-bg py-24 md:py-32 relative z-20 border-t border-stroke/50">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-px bg-stroke" />
                <span className="text-xs text-muted uppercase tracking-[0.3em]">What We Do</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display italic tracking-tight">Our<br />Programs.</h2>
            </div>
            <p className="text-muted max-w-sm text-sm leading-relaxed">
              Three focused initiatives, each designed to make technology accessible and empowering for every generation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((prog, i) => (
              <div
                key={i}
                className="group bg-surface border border-stroke rounded-3xl overflow-hidden hover:border-text-primary/30 transition-all duration-500 cursor-pointer"
                onClick={() => setActiveEvent(prog)}
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={prog.img} alt={prog.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-bg/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] uppercase tracking-widest border border-stroke">{prog.tag}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-display italic mb-2">{prog.title}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-6">{prog.desc}</p>
                  <div className="w-10 h-10 rounded-full border border-stroke flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK LOOK — Horizontal Scroll Gallery */}
      <section id="quicklook" ref={quickLookRef} className="relative z-20 h-screen overflow-hidden border-t border-stroke/50">
        <div className="quick-look-track flex items-center h-full gap-8 px-12 will-change-transform">
          <div className="flex-shrink-0 w-[380px] md:w-[480px] h-full flex flex-col justify-center pr-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Gallery</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display italic tracking-tight mb-6">Quick<br />Look.</h2>
            <p className="text-muted text-sm max-w-xs">
              Moments captured from our programs — real impact, real smiles, real change.
            </p>
          </div>
          {quickLookImages.map((item, i) => (
            <div key={i} className="flex-shrink-0 w-[320px] md:w-[420px] h-[65vh] rounded-3xl overflow-hidden relative group">
              <img src={item.src} alt={item.caption} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white text-lg font-medium">{item.caption}</p>
                <div className="w-12 h-[2px] accent-gradient mt-3 rounded-full" />
              </div>
            </div>
          ))}
          <div className="flex-shrink-0 w-[80px]" />
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="mission-section bg-bg py-24 md:py-48 relative z-20 border-t border-stroke/50 overflow-hidden">
        <div className="mission-bg-text absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <h2 className="text-[20vw] font-display italic leading-none whitespace-nowrap">SPARKS</h2>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <div className="text-center mb-24 md:mb-32">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-8 h-px bg-stroke" /><span className="text-xs text-muted uppercase tracking-[0.3em]">Our Mission</span><div className="w-8 h-px bg-stroke" />
            </div>
            <h2 className="mission-reveal text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] max-w-4xl mx-auto group">
              To ignite{" "}
              <span className="font-display italic text-text-primary group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#b8d4ef] group-hover:to-[#e0ecf7] transition-all duration-500">curiosity</span>
              , bridge the technology gap, and empower every generation to thrive in a digital world.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 perspective-[1000px]">
            {[
              { title: "Hands-On Learning", desc: "We believe in learning by doing. Every workshop puts tools in people's hands — from soldering irons to AI prompts.", icon: "01" },
              { title: "Every Generation", desc: "From kids building their first circuits to seniors navigating AI — we design programs for every age and background.", icon: "02" },
              { title: "Community First", desc: "We go where we're needed. Our programs are community-driven, shaped by the people we serve.", icon: "03" },
            ].map((pillar, i) => (
              <div key={i} onClick={() => setShowMission(true)} className="mission-reveal mission-card group relative bg-surface/50 border border-stroke p-10 rounded-[2.5rem] hover:bg-surface transition-colors duration-500 transform-gpu overflow-hidden cursor-pointer">
                <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 font-display italic select-none text-stroke">{pillar.icon}</div>
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

      {/* STATS */}
      <section className="bg-bg py-16 md:py-32 relative z-20 border-t border-stroke/50">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-stroke">
            {[
              { val: "3", label: "Programs" },
              { val: "500+", label: "Lives Impacted" },
              { val: "200+", label: "Kids Taught" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center pt-8 md:pt-0">
                <h4 className="text-5xl md:text-7xl font-display text-text-primary mb-2">{s.val}</h4>
                <p className="text-sm text-muted uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FUTURE EVENTS */}
      <section id="events" className="bg-bg py-24 md:py-32 relative z-20 border-t border-stroke/50">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-px bg-stroke" /><span className="text-xs text-muted uppercase tracking-[0.3em]">Upcoming</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display italic tracking-tight">Future<br />Events.</h2>
            </div>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex items-center gap-3 rounded-full border border-stroke px-8 py-4 text-sm font-medium hover:bg-white hover:text-black transition-all"
            >
              <Bell className="w-4 h-4" />
              <span>Get Notified</span>
            </button>
          </div>

          <div className="events-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            {futureEvents.map((ev, i) => (
              <div key={i} className="event-card group bg-surface border border-stroke rounded-3xl p-8 hover:border-text-primary/30 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 text-6xl opacity-[0.04] font-display italic select-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <span className="inline-block bg-bg/80 border border-stroke px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest mb-6">
                  {ev.tag}
                </span>
                <h3 className="text-2xl font-display italic mb-3 group-hover:translate-x-1 transition-transform">{ev.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-6">{ev.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted uppercase tracking-widest">{ev.date}</span>
                  <div className="w-10 h-10 rounded-full border border-stroke flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <Bell className="w-4 h-4" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT / FOUNDERS — moved below Future Events */}
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
                {"Sparks is a student-led NPO built on a simple belief: technology should empower everyone. From teaching kids to solder circuits to helping grandparents chat with AI — we bring innovation to every doorstep.".split(" ").map((word, i) => (
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
          <div className="founders-grid grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
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
              Drop us a<br />
              <span className="not-italic font-sans font-medium text-3xl md:text-5xl text-text-primary/80">letter.</span>
            </h2>
            <p className="contact-reveal text-muted text-sm max-w-md mx-auto">
              Whether you want to volunteer, learn more, or just say hi — we'd love to hear from you.
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
              onClick={() => setShowDonation(true)}
            />
          </div>

          <div className="flex flex-col items-center text-center px-4">
            <h2 className="text-4xl md:text-6xl tracking-tight mb-8">
              Want to support <br />our <span className="font-display italic">mission?</span>
            </h2>
            <button
              onClick={() => setShowDonation(true)}
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
