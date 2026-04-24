import React from 'react';
import { motion } from 'framer-motion';

const InlineLoader = ({ className = "w-4 h-4", color = "currentColor" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-full h-full border-2 border-transparent border-t-current rounded-full opacity-80"
        style={{ color }}
      />
    </div>
  );
};

export default InlineLoader;
