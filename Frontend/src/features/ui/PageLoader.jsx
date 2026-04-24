import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = ({ text = "Loading..." }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white"
    >
      <div className="relative flex items-center justify-center">
        {/* Subtle rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-[1px] border-neutral-100 border-t-neutral-800 rounded-full"
        />
        
        {/* Pulsing center dot */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-2 h-2 bg-neutral-900 rounded-full"
        />
      </div>
      
      {text && (
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-medium"
        >
          {text}
        </motion.span>
      )}
    </motion.div>
  );
};

export default PageLoader;
