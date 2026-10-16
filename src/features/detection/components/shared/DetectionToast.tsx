'use client';

import { useDetectionStore } from '../../store/useDetectionStore';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DetectionToast() {
  const { toastMessage, clearToast } = useDetectionStore();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md bg-card/95 border-border max-w-md"
        >
          {toastMessage.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          {toastMessage.type === 'warning' && (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          {toastMessage.type === 'info' && (
            <Info className="w-5 h-5 text-cyan-400 shrink-0" />
          )}

          <p className="text-sm font-medium text-foreground flex-1 pr-2">
            {toastMessage.text}
          </p>

          <button
            onClick={clearToast}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
