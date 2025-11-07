import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, show, onHide }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <div 
      className={`fixed bottom-7 left-1/2 -translate-x-1/2 px-5 py-3.5 rounded-2xl text-sm bg-slate-900 dark:bg-slate-900 light:bg-white border border-white/12 dark:border-white/12 light:border-slate-200 shadow-2xl max-w-[320px] z-[250] transition-all duration-350 ${
        show 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-5 pointer-events-none'
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
