import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hls from "hls.js";
import { ArrowUpRight } from "lucide-react";

import { LoadingScreen } from "./components/LoadingScreen";

gsap.registerPlugin(ScrollTrigger);

const roles = ["Educators", "Mentors", "Innovators", "Change-Makers"];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);

  const handleComplete = useCallback(() => {
    setIsLoading(false);
  }, []);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const footerVideoRef = useRef<HTMLVideoElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const parallaxColsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Role rotation
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initVideo = (videoElement: HTMLVideoElement | null, src: string) => {
      if (!videoElement) return;
      
      // Simple logic to handle both HLS and MP4
      if (src.endsWith('.m3u8')) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(videoElement);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement.play().catch(() => {});
          });
        } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
          videoElement.src = src;
          videoElement.addEventListener("loadedmetadata", () => {
            videoElement.play().catch(() => {});
          });
        }
      } else {
        // Standard MP4
        videoElement.src = src;
        videoElement.load();
        videoElement.play().catch(() => {});
      }
    };

    const heroVideoSrc = "https://videos.pexels.com/video-files/31575746/13456574_2560_1440_30fps.mp4";
    const footerVideoSrc = "https://videos.pexels.com/video-files/31575747/13456598_2560_1440_30fps.mp4";
    
    initVideo(videoRef.current, heroVideoSrc);
    initVideo(footerVideoRef.current, footerVideoSrc);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const ctx = gsap.context(() => {
        // Hero Entrance Animation
        const tl = gsap.timeline();
        
        tl.fromTo(
          ".name-reveal",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.1 }
        );
        
        tl.fromTo(
          ".blur-in",
          { opacity: 0, filter: "blur(10px)", y: 20 },
          { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1, ease: "power3.out" },
          "-=0.8"
        );

        // Scroll-driven Parallax (Explorations Section)
        if (pinRef.current && parallaxColsRef.current && parallaxRef.current) {
          ScrollTrigger.create({
            trigger: parallaxRef.current,
            start: "top top",
            end: "+=200vh",
            pin: pinRef.current,
            pinSpacing: false,
          });

          const col1 = parallaxColsRef.current.querySelector('.col-1');
          const col2 = parallaxColsRef.current.querySelector('.col-2');

          if (col1) {
            gsap.to(col1, {
              yPercent: -30,
              ease: "none",
              scrollTrigger: {
                trigger: parallaxRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              }
            });
          }

          if (col2) {
            gsap.to(col2, {
              yPercent: -60,
              ease: "none",
              scrollTrigger: {
                trigger: parallaxRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              }
            });
          }
        }

        // Footer Marquee
        gsap.to(".marquee-inner", {
          xPercent: -50,
          ease: "none",
          duration: 40,
          repeat: -1,
        });

        // Founder Section Animations - Faster & Color Reveal
        const bioWords = document.querySelectorAll('.bio-word');
        if (bioWords.length > 0) {
          gsap.fromTo(bioWords, 
            { opacity: 0.15, color: "rgba(255,255,255,0.1)" },
            { 
              opacity: 1, 
              color: "#ffffff",
              stagger: 0.1,
              scrollTrigger: {
                trigger: ".founder-bio-container",
                start: "top 95%", // Start even earlier
                end: "top 10%", 
                scrub: true,
              }
            }
          );
        }

        // Timeline Animations
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, i) => {
          gsap.from(item, {
            opacity: 0,
            x: i % 2 === 0 ? -50 : 50,
            duration: 1,
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          });
        });

        const timelineLine = document.querySelector('.timeline-line-inner');
        if (timelineLine) {
          gsap.to(timelineLine, {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: ".timeline-container",
              start: "top center",
              end: "bottom center",
              scrub: true
            }
          });
        }

        // Mission Section - 3D Scroll Tilt
        const missionCards = document.querySelectorAll('.mission-card');
        missionCards.forEach(card => {
          gsap.to(card, {
            rotationX: -10,
            rotationY: 10,
            z: 50,
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          });
        });

        // Mission Background Parallax
        gsap.to(".mission-bg-text", {
          yPercent: -20,
          scrollTrigger: {
            trigger: ".mission-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });

        // Mission Section Entrance
        gsap.from(".mission-reveal", {
          opacity: 0,
          y: 30,
          filter: "blur(10px)",
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".mission-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });

        // Founder Section Entrance
        gsap.from(".founder-reveal", {
          opacity: 0,
          y: 40,
          filter: "blur(10px)",
          duration: 1.2,
          stagger: 0.3,
          scrollTrigger: {
            trigger: ".founder-bio-container",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });

        // Magnetic Image Effect (re-added to maintain context)
        const portrait = document.querySelector('.founder-portrait');
        if (portrait) {
          const onMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = portrait.getBoundingClientRect();
            const x = (clientX - (left + width / 2)) * 0.1;
            const y = (clientY - (top + height / 2)) * 0.1;
            gsap.to(portrait, { x, y, duration: 0.5, ease: "power2.out" });
          };
          
          const onMouseLeave = () => {
            gsap.to(portrait, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
          };

          const container = document.querySelector('.founder-image-container');
          container?.addEventListener('mousemove', onMouseMove as EventListener);
          container?.addEventListener('mouseleave', onMouseLeave);
        }
      });

      return () => ctx.revert(); // Cleanup GSAP on unmount
    }
  }, [isLoading]);

  return (
    <div className="bg-bg min-h-screen text-text-primary selection:bg-text-primary selection:text-bg overflow-x-hidden">
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={handleComplete} />}
      </AnimatePresence>

      {/* NAVBAR */}
      {!isLoading && (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 transition-all duration-300">
          <div className="inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2 shadow-md shadow-black/10">
            {/* Logo */}
            <div className="w-9 h-9 rounded-full relative group cursor-pointer overflow-hidden flex items-center justify-center transition-transform hover:scale-110">
              <div className="absolute inset-0 accent-gradient group-hover:rotate-180 transition-transform duration-700" />
              <div className="w-8 h-8 rounded-full bg-bg relative z-10 flex items-center justify-center">
                <span className="font-display italic text-[13px]">SF</span>
              </div>
            </div>
            
            <div className="w-px h-5 bg-stroke mx-1 hidden md:block" />
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-10">
            {[
              { name: "Programs", id: "programs" },
              { name: "Impact", id: "timeline" },
              { name: "About", id: "about" },
              { name: "Donate", id: "contact" }
            ].map((item) => (
              <button 
                key={item.name} 
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium tracking-wide text-text-primary/70 hover:text-text-primary transition-colors cursor-pointer"
              >
                {item.name}
              </button>
            ))}
            <button className="accent-gradient px-6 py-2 rounded-full text-sm font-bold text-white hover:opacity-90 transition-opacity cursor-pointer">
              Join Us
            </button>
          </div>

            <div className="w-px h-5 bg-stroke mx-1" />

            {/* CTA */}
            <button className="group relative flex items-center text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full overflow-hidden">
              <span className="absolute inset-[-2px] accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              <span className="absolute inset-0 bg-surface rounded-full backdrop-blur-md -z-10" />
              <span className="text-text-primary flex items-center gap-1 relative z-10">
                Donate <ArrowUpRight className="w-3 h-3" />
              </span>
            </button>
          </div>
        </nav>
      )}

      {/* SECTION 1: HERO */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video
            ref={videoRef}
            className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
        </div>

        {/* Hero Content */}
        <div ref={heroTextRef} className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto mt-12">
          <p className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8">
            INITIATIVE '26
          </p>
          <h1 className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6">
            Spark Foundation
          </h1>
          <div className="blur-in text-xl md:text-3xl text-text-primary/90 font-light tracking-wide mb-8">
            Empowering{" "}
            <span key={roleIndex} className="font-display italic text-text-primary animate-role-fade-in inline-block font-medium">
              {roles[roleIndex]}
            </span>
            {" "}across the globe.
          </div>
          <p className="blur-in text-sm md:text-base text-muted max-w-md mb-12">
            Building the future by educating youth, fostering technical skills, and funding innovative digital learning experiences.
          </p>
          
          <div className="blur-in flex flex-col sm:flex-row gap-4">
            <button className="group relative rounded-full text-sm px-7 py-3.5 hover:scale-105 transition-all duration-300 bg-text-primary text-bg hover:text-text-primary overflow-hidden">
              <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 font-medium">See Programs</span>
            </button>
            <button className="group relative rounded-full text-sm px-7 py-3.5 hover:scale-105 transition-all duration-300 border-2 border-stroke bg-bg text-text-primary hover:border-transparent overflow-hidden">
              <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 font-medium">Get Involved</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-[10px] text-muted uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-px h-10 bg-stroke relative overflow-hidden">
            <div className="w-full h-full bg-text-primary absolute top-0 left-0 animate-[scroll-down_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* SECTION 2: SELECTED WORKS */}
      <section id="programs" className="bg-bg py-24 md:py-32 relative z-20 border-t border-stroke/50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-px bg-stroke" />
                <span className="text-xs text-muted uppercase tracking-[0.3em]">Selected Initiatives</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display italic tracking-tight">Our active <br />Impact channels.</h2>
            </div>
            <button className="rounded-full border border-stroke px-8 py-4 text-sm font-medium hover:bg-white hover:text-black transition-all">
              View all programs (12)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: "Code Academy", 
                tag: "Digital Literacy", 
                img: "https://images.pexels.com/photos/4709294/pexels-photo-4709294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                desc: "Equipping youth with the fundamentals of software engineering and problem solving."
              },
              { 
                title: "Mentorship Pro", 
                tag: "Leadership", 
                img: "https://images.pexels.com/photos/35745564/pexels-photo-35745564.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                desc: "Connecting industry experts with aspiring tech leaders for 1-on-1 guidance."
              },
              { 
                title: "Innovation Hub", 
                tag: "Future Tech", 
                img: "https://images.pexels.com/photos/31121842/pexels-photo-31121842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                desc: "State-of-the-art labs for 3D printing, robotics, and creative hardware hacking."
              },
              { 
                title: "Global Reach", 
                tag: "Community", 
                img: "https://images.pexels.com/photos/10638075/pexels-photo-10638075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                desc: "Expanding our digital resources to underserved communities across 15+ countries."
              },
            ].map((work, i) => (
              <div key={i} className="group bg-surface border border-stroke rounded-3xl overflow-hidden hover:border-text-primary/30 transition-all duration-500">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={work.img} alt={work.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-bg/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] uppercase tracking-widest border border-stroke">{work.tag}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-display italic mb-2">{work.title}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-6">{work.desc}</p>
                  <div className="w-10 h-10 rounded-full border border-stroke flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: JOURNAL */}
      <section className="bg-bg py-16 md:py-24 relative z-20 border-t border-stroke/50">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-px bg-stroke" />
                <span className="text-xs text-muted uppercase tracking-[0.3em]">Impact Stories</span>
              </div>
              <h2 className="text-4xl md:text-5xl tracking-tight">
                Recent <span className="font-display italic">successes</span>
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { title: "Building an app for local communities", read: "5 min read", date: "Oct 12" },
              { title: "How 10-year-old Sarah learned Python", read: "4 min read", date: "Sep 28" },
              { title: "Partnering with schools in rural areas", read: "7 min read", date: "Sep 15" },
              { title: "The future of AI in early education", read: "6 min read", date: "Aug 30" },
            ].map((entry, i) => (
              <div key={i} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-4 bg-surface/30 hover:bg-surface border border-stroke rounded-3xl sm:rounded-full transition-colors cursor-pointer">
                <div className="flex items-center gap-6 mb-4 sm:mb-0">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 shrink-0 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-zinc-700 to-zinc-800 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-medium mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-muted">{entry.read}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end sm:pr-4">
                  <span className="text-sm text-muted">{entry.date}</span>
                  <div className="w-10 h-10 rounded-full border border-stroke flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: EXPLORATIONS (PARALLAX) */}
      <section ref={parallaxRef} className="relative min-h-[300vh] bg-bg z-20">
        {/* Layer 1: Pinned Center */}
        <div ref={pinRef} className="h-screen w-full flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">Student Gallery</span>
            <div className="w-8 h-px bg-stroke" />
          </div>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-display italic tracking-tight text-white mb-6 text-center">
            Innovation
            <br />
            <span className="not-italic font-sans font-medium text-4xl md:text-6xl lg:text-8xl tracking-tight text-white/90">
              playground
            </span>
          </h2>
          <button className="pointer-events-auto rounded-full border border-stroke px-6 py-3 text-sm hover:bg-white hover:text-black transition-colors">
            View Showcase
          </button>
        </div>

        {/* Layer 2: Parallax Columns */}
        <div ref={parallaxColsRef} className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none">
          <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-40 px-4 md:px-20 pt-[50vh] pb-[50vh]">
            <div className="col-1 flex flex-col gap-20 md:gap-40 items-start">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full max-w-[320px] aspect-square bg-surface border border-stroke rounded-2xl pointer-events-auto transform hover:scale-105 hover:-rotate-2 transition-all duration-500 shadow-2xl p-2">
                  <div className="w-full h-full bg-zinc-800 rounded-xl relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
                     <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                       <span className="text-xs font-mono text-white/50">PROJECT_0{i}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-2 flex flex-col gap-20 md:gap-40 items-end pt-[20vh] md:pt-[40vh]">
              {[4, 5, 6].map((i) => (
                <div key={i} className="w-full max-w-[320px] aspect-[4/5] bg-surface border border-stroke rounded-2xl pointer-events-auto transform hover:scale-105 hover:rotate-2 transition-all duration-500 shadow-2xl p-2">
                  <div className="w-full h-full bg-zinc-800 rounded-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 to-blue-900/20" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                       <span className="text-xs font-mono text-white/50">PROJECT_0{i}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4.5: MISSION SECTION */}
      <section id="mission" className="mission-section bg-bg py-24 md:py-48 relative z-20 border-t border-stroke/50 overflow-hidden">
        {/* Large Parallax Background Text */}
        <div className="mission-bg-text absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <h2 className="text-[20vw] font-display italic leading-none whitespace-nowrap">MISSION</h2>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <div className="text-center mb-24 md:mb-32">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">The Spark Core</span>
              <div className="w-8 h-px bg-stroke" />
            </div>
            <h2 className="mission-reveal text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] max-w-4xl mx-auto group">
              To ignite <span className="font-display italic text-text-primary group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#89AACC] group-hover:to-[#4E85BF] transition-all duration-500">curiosity</span>, foster technical fluency, and empower the next generation of digital pioneers.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 perspective-[1000px]">
            {[
              { title: "Innovation", desc: "Pushing boundaries through creative experimentation and rapid prototyping.", icon: "01" },
              { title: "Access", desc: "Bridging the digital divide with radical accessibility and open resources.", icon: "02" },
              { title: "Community", desc: "Building a global network of mentors and peers for lifelong growth.", icon: "03" },
            ].map((pillar, i) => (
              <div key={i} className="mission-reveal mission-card group relative bg-surface/50 border border-stroke p-10 rounded-[2.5rem] hover:bg-surface transition-colors duration-500 transform-gpu overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-stroke-primary text-6xl opacity-10 font-display italic select-none">
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-display italic mb-4 group-hover:translate-x-2 transition-transform">{pillar.title}</h3>
                <p className="text-muted leading-relaxed group-hover:text-text-primary/80 transition-colors">
                  {pillar.desc}
                </p>
                <div className="mt-8 w-12 h-12 rounded-full border border-stroke flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                {/* 3D Glass Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4.7: TIMELINE SECTION */}
      <section id="timeline" className="timeline-container bg-bg py-24 md:py-48 relative z-20 border-t border-stroke/50 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="text-center mb-24 md:mb-32">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Our Journey</span>
              <div className="w-8 h-px bg-stroke" />
            </div>
            <h2 className="text-5xl md:text-7xl font-display italic tracking-tight mb-8">Decade of <br/>Innovation</h2>
          </div>

          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-stroke md:-translate-x-1/2">
              <div className="timeline-line-inner absolute top-0 left-0 w-full h-0 bg-white" />
            </div>

            <div className="flex flex-col gap-24 md:gap-48 relative">
              {[
                { year: "2016", title: "The Spark Ignites", desc: "First technical workshop launched in a local community center with just 10 students.", icon: "🔥" },
                { year: "2019", title: "Global Outreach", desc: "Successfully scaled to 15 cities, reaching over 50,000 students worldwide.", icon: "🌍" },
                { year: "2022", title: "Innovation Labs", desc: "Opened our first three physical hardware labs for advanced robotics and 3D prototyping.", icon: "🔬" },
                { year: "2026", title: "The Million Goal", desc: "Set to empower our one-millionth innovator through radical technical inclusion.", icon: "🚀" }
              ].map((item, i) => (
                <div key={i} className={`timeline-item flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-24 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`w-full md:w-1/2 flex flex-col ${i % 2 === 0 ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} pl-12 md:pl-0`}>
                    <span className="text-4xl md:text-6xl font-display italic text-muted mb-4">{item.year}</span>
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <p className="text-muted max-w-sm leading-relaxed">{item.desc}</p>
                  </div>
                  
                  {/* Node */}
                  <div className="absolute left-[10px] md:left-1/2 w-5 h-5 rounded-full bg-bg border-2 border-white z-10 -translate-x-1/2 shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center">
                     <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </div>

                  <div className="w-full md:w-1/2 flex items-center justify-center md:justify-start pl-12 md:pl-0">
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-3xl bg-surface border border-stroke flex items-center justify-center text-4xl md:text-6xl grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110 cursor-default">
                      {item.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FOUNDER SECTION */}
      <section id="about" className="bg-bg py-24 md:py-32 relative z-20 border-t border-stroke/50 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col md:flex-row gap-16 md:gap-24">
          {/* Left Side: Sticky Portrait */}
          <div className="w-full md:w-1/2">
            <div className="sticky top-32 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-px bg-stroke" />
                <span className="text-xs text-muted uppercase tracking-[0.3em]">The Visionary</span>
              </div>
              <h2 className="founder-reveal text-5xl md:text-7xl font-display italic tracking-tight mb-12">Meet the <br/>Founder</h2>
              
              <div className="founder-reveal founder-image-container relative w-full aspect-[4/5] max-w-[450px] rounded-3xl overflow-hidden group">
                <img 
                  src="https://images.pexels.com/photos/10657877/pexels-photo-10657877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Founder Portrait" 
                  className="founder-portrait w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-8 left-8">
                  <p className="text-white text-2xl font-display italic">Michael Smith</p>
                  <p className="text-white/50 text-xs uppercase tracking-widest mt-1">Chief Executive Catalyst</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Bio Text Reveal */}
          <div className="w-full md:w-1/2 founder-bio-container pt-8 md:pt-48">
            <div className="max-w-md">
              <p className="text-2xl md:text-4xl leading-relaxed font-light text-text-primary mb-12">
                {"Founded with a radical vision to bridge the digital divide, Spark is more than just an NPO—it's an incubator for the next generation of global problem solvers. We believe that every child, regardless of their background, deserves the keys to the digital kingdom.".split(" ").map((word, i) => (
                  <span key={i} className="bio-word inline-block mr-[0.3em]">{word}</span>
                ))}
              </p>
              
              <p className="text-muted text-lg mb-12">
                Michael's journey began in the tech hubs of Chicago, where he witnessed firsthand the disparity in technical education. He spent a decade building scalable systems before deciding to scale something more important: human potential.
              </p>

              <div className="flex flex-col gap-8">
                <div className="group cursor-pointer">
                  <p className="text-xs text-muted uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Our philosophy</p>
                  <p className="text-xl font-medium border-b border-stroke pb-4 group-hover:border-white transition-colors">Radical Inclusion</p>
                </div>
                <div className="group cursor-pointer">
                  <p className="text-xs text-muted uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Our method</p>
                  <p className="text-xl font-medium border-b border-stroke pb-4 group-hover:border-white transition-colors">Hands-on Hacking</p>
                </div>
                <div className="group cursor-pointer">
                  <p className="text-xs text-muted uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Our goal</p>
                  <p className="text-xl font-medium border-b border-stroke pb-4 group-hover:border-white transition-colors">1 Million Innovators</p>
                </div>
              </div>
              
              <button className="mt-16 group relative inline-flex items-center gap-3 rounded-full border border-stroke px-8 py-4 text-sm font-medium hover:bg-white hover:text-black transition-all">
                <span>Read the full story</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: STATS */}
      <section className="bg-bg py-16 md:py-32 relative z-20 border-t border-stroke/50">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-stroke">
            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <h4 className="text-5xl md:text-7xl font-display text-text-primary mb-2">10<span className="text-accent">+</span></h4>
              <p className="text-sm text-muted uppercase tracking-widest">Years Impact</p>
            </div>
            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <h4 className="text-5xl md:text-7xl font-display text-text-primary mb-2">50<span className="text-accent">k</span></h4>
              <p className="text-sm text-muted uppercase tracking-widest">Students Reached</p>
            </div>
            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <h4 className="text-5xl md:text-7xl font-display text-text-primary mb-2">100<span className="text-accent">+</span></h4>
              <p className="text-sm text-muted uppercase tracking-widest">Partner Schools</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FOOTER */}
      <section className="relative w-full py-20 md:py-32 bg-bg overflow-hidden flex flex-col items-center justify-center z-20 min-h-screen">
        {/* Footer Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video
            ref={footerVideoRef}
            className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1]"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1">
          {/* Marquee */}
          <div className="w-full overflow-hidden mb-12 select-none flex">
            <div className="marquee-inner flex whitespace-nowrap text-8xl md:text-[10rem] font-display italic text-white/20">
              {[...Array(10)].map((_, i) => (
                <span key={i} className="px-4">BUILDING THE FUTURE •</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center text-center px-4">
            <h2 className="text-4xl md:text-6xl tracking-tight mb-8">
              Want to support <br />our <span className="font-display italic">mission?</span>
            </h2>
            <a 
              href="mailto:hello@sparkfoundation.org"
              className="group relative inline-flex items-center gap-3 rounded-full bg-white text-black px-8 py-4 text-lg font-medium hover:scale-105 transition-transform"
            >
              <div className="absolute -inset-2 rounded-full accent-gradient opacity-0 group-hover:opacity-30 blur-lg transition-opacity" />
              <span className="relative z-10">Partner with us</span>
              <ArrowUpRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="relative z-10 w-full px-6 md:px-12 mt-20 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
          <div className="flex items-center gap-6 text-sm text-white/50">
            {["Twitter", "LinkedIn", "Instagram", "GitHub"].map((social) => (
              <a key={social} href="#" className="hover:text-white transition-colors">
                {social}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Currently seeking volunteers for 2026</span>
          </div>
          <div className="text-sm text-white/40">
            © 2026 Spark Foundation
          </div>
        </div>
      </section>
    </div>
  );
}
