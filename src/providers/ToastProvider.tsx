'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Remove toast automatically after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 md:px-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="glass-panel-dark pointer-events-auto rounded-xl p-4 flex items-center justify-between gap-3 shadow-xl text-white text-sm"
              style={{
                background: 'rgba(28, 26, 23, 0.9)',
                border: '1px solid rgba(250, 249, 246, 0.1)',
              }}
            >
              <div className="flex items-center gap-3">
                {t.type === 'success' && <CheckCircle className="w-5 h-5 text-primary shrink-0" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-blue-300 shrink-0" />}
                <p className="font-sans font-medium">{t.message}</p>
              </div>
              <button
                onClick={() => remove(t.id)}
                className="text-stone-400 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}
