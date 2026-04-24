import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="text-emerald-500" size={18} />,
  error: <XCircle className="text-rose-500" size={18} />,
  info: <Info className="text-blue-500" size={18} />,
  warning: <AlertTriangle className="text-amber-500" size={18} />,
};

const toastStyles = {
  success: 'bg-white border-emerald-100 shadow-emerald-500/5',
  error: 'bg-white border-rose-100 shadow-rose-500/5',
  info: 'bg-white border-blue-100 shadow-blue-500/5',
  warning: 'bg-white border-amber-100 shadow-amber-500/5',
};

const Toast = ({ message, type = 'info', onRemove, duration = 3000 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration === Infinity) return;
    
    const interval = 10;
    const step = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      whileHover={{ y: -2 }}
      className={`
        relative group min-w-[320px] max-w-[420px] 
        p-4 pr-10 rounded-2xl border 
        flex items-center gap-4 
        shadow-2xl backdrop-blur-md bg-white/90
        ${toastStyles[type] || toastStyles.info}
      `}
    >
      <div className="flex-shrink-0">
        {icons[type] || icons.info}
      </div>
      
      <div className="flex-grow">
        <p className="text-[13px] font-medium text-neutral-800 leading-tight">
          {message}
        </p>
      </div>

      <button 
        onClick={onRemove}
        className="absolute top-1/2 -translate-y-1/2 right-3 p-1.5 text-neutral-300 hover:text-neutral-500 hover:bg-neutral-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
      >
        <X size={14} />
      </button>

      {/* Progress Bar */}
      {duration !== Infinity && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-100/50 overflow-hidden rounded-b-2xl">
          <motion.div 
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
            className={`h-full ${
              type === 'success' ? 'bg-emerald-500' :
              type === 'error' ? 'bg-rose-500' :
              type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
            }`}
          />
        </div>
      )}
    </motion.div>
  );
};

export default Toast;
