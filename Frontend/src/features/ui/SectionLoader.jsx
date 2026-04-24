import React from 'react';
import { motion } from 'framer-motion';

const SectionLoader = ({ className = "h-40" }) => {
  return (
    <div className={`w-full flex items-center justify-center bg-neutral-50/50 rounded-2xl overflow-hidden ${className}`}>
      <motion.div 
        animate={{ 
          opacity: [0.4, 0.7, 0.4],
          scale: [0.98, 1, 0.98]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-12 h-[1px] bg-neutral-300" />
        <div className="w-8 h-[1px] bg-neutral-200" />
      </motion.div>
    </div>
  );
};

export default SectionLoader;
