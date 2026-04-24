import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HomeLoader = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-complete after a set time if not manually triggered
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 4500); // Cinematic duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  const containerVariants = {
    exit: {
      opacity: 0,
      scale: 1.05,
      filter: "blur(10px)",
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const textVariants = {
    initial: { y: 40, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const letterVariants = {
    initial: { opacity: 0 },
    animate: i => ({
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.8 }
    })
  };

  const brandName = "FITFUSION";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="home-loader"
          variants={containerVariants}
          exit="exit"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black text-white"
        >
          {/* Animated Gradient Background */}
          <motion.div 
            animate={{ 
              background: [
                "radial-gradient(circle at 30% 30%, #111 0%, #000 70%)",
                "radial-gradient(circle at 70% 70%, #111 0%, #000 70%)",
                "radial-gradient(circle at 30% 30%, #111 0%, #000 70%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-60"
          />

          <div className="relative z-10 text-center">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, tracking: "0.5em" }}
              animate={{ opacity: 0.4, tracking: "1em" }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="mb-8 text-[10px] uppercase font-light text-neutral-400"
            >
              Est. 2024
            </motion.div>

            {/* Main Brand Name with Letter Animation */}
            <div className="flex gap-[0.5em] mb-12">
              {brandName.split("").map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                  className="text-6xl md:text-8xl font-light tracking-tighter"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Collection Title */}
            <motion.div
              variants={textVariants}
              initial="initial"
              animate="animate"
              className="overflow-hidden"
            >
              <span className="block text-sm md:text-base font-light italic tracking-widest text-neutral-300">
                Spring / Summer Collection
              </span>
            </motion.div>

            {/* Animated Loading Bar (Minimalist) */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-24 w-32 h-[1px] bg-neutral-800 overflow-hidden">
              <motion.div 
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 bottom-0 w-1/2 bg-white/40"
              />
            </div>
          </div>

          {/* Grain Overlay for Texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomeLoader;
