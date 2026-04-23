import { useEffect, useState } from "react";
import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const words = ["Teach", "Inspire", "Innovate"];

export const LoadingScreen: FC<LoadingScreenProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    // 2700ms duration for count 0 -> 100
    const duration = 2700;
    const startTime = performance.now();

    let animationFrameId: number;
    let timeoutId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother counter (easeOutQuart)
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeProgress * 100);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        timeoutId = window.setTimeout(onComplete, 400); // 400ms delay after 100%
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onComplete]);

  useEffect(() => {
    // Cycle words every 900ms (2700ms / 3 words)
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between overflow-hidden"
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      {/* Top Left Label */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="p-6 md:p-10"
      >
        <span className="text-xs text-muted uppercase tracking-[0.3em]">Spark NPO</span>
      </motion.div>

      {/* Center Rotating Words */}
      <div className="flex-1 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.h1
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80 absolute"
          >
            {words[wordIndex]}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col w-full pb-6 px-6 md:pb-10 md:px-10">
        <div className="flex justify-end w-full mb-4">
          {/* Counter */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums leading-none"
          >
            {String(count).padStart(3, "0")}
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="h-[3px] bg-stroke/50 w-full overflow-hidden rounded-full">
          <div
            className="h-full accent-gradient origin-left rounded-full"
            style={{
              transform: `scaleX(${count / 100})`,
              boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};
