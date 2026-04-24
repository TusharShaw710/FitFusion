import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useToast } from './ToastContext';
import Toast from './Toast';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none items-end max-w-full px-6 md:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.slice(-3).map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast 
              {...toast} 
              onRemove={() => removeToast(toast.id)} 
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
