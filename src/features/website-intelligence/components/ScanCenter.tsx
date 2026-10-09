import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Cpu } from 'lucide-react';
import { WebsiteScan } from '../data/mockScans';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ScanCenterProps {
  isScanning: boolean;
  finalResult: WebsiteScan | null;
  scanProgressIndex: number;
  totalStages: number;
  isMobile?: boolean;
}

export function ScanCenter({
  isScanning, finalResult, scanProgressIndex, isMobile
}: ScanCenterProps) {
  const [pulse, setPulse] = useState(false);

  // Trigger a brief reaction when the stage changes (simulating signal arrival)
  useEffect(() => {
    if (isScanning && scanProgressIndex > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [scanProgressIndex, isScanning]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-500 border-green-500/30 bg-green-500/10';
      case 'elevated': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
      case 'critical': return 'text-red-500 border-red-500/30 bg-red-500/10';
      default: return 'text-muted-foreground border-border bg-muted/30';
    }
  };

  const containerClass = isMobile 
    ? "bg-[#0A0A0A] border border-[#292929] rounded-xl p-6 shadow-sm flex flex-col items-center text-center relative z-20 w-full mb-6"
    : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] bg-[#0A0A0A] border border-[#292929] rounded-2xl p-5 shadow-2xl flex flex-col items-center text-center z-20 transition-all duration-300";

  let statusText = "Network Ready";
  if (isScanning) {
    if (scanProgressIndex < 3) statusText = "Receiving intelligence";
    else if (scanProgressIndex < 6) statusText = "Correlating signals";
    else statusText = "Calculating merchant risk";
  }

  return (
    <motion.div 
      className={cn(
        containerClass,
        pulse ? "border-[#737373] shadow-[0_0_20px_rgba(255,255,255,0.05)] scale-105" : (isScanning && !finalResult ? "border-[#404040]" : "border-[#292929] scale-100")
      )}
      animate={{ scale: pulse ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      
      <div className="flex flex-col items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#101010] border border-[#292929] flex items-center justify-center relative">
          <Cpu className={cn("w-5 h-5 transition-colors duration-500", isScanning || pulse ? "text-[#F5F5F5]" : "text-[#737373]")} />
          {!finalResult && (
            <motion.div 
              className="absolute inset-0 rounded-full border border-[#F5F5F5]"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ 
                scale: isScanning ? 1.5 : 1, 
                opacity: pulse ? [0, 0.4, 0] : (isScanning ? [0, 0.1, 0] : 0) 
              }}
              transition={{ repeat: isScanning && !pulse ? Infinity : 0, duration: 2, ease: "easeOut" }}
            />
          )}
        </div>
        <div className="flex flex-col text-center">
          <span className="text-[10px] font-bold tracking-widest text-[#F5F5F5] uppercase leading-tight">
            RTMT
          </span>
          <span className="text-[10px] font-bold tracking-widest text-[#737373] uppercase leading-tight">
            Intelligence Core
          </span>
        </div>
      </div>

      <div className="w-full min-h-[40px] flex flex-col items-center justify-center border-t border-[#292929] pt-4">
        <AnimatePresence mode="wait">
          {!finalResult ? (
            <motion.div
              key={statusText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] uppercase tracking-wider font-semibold text-[#737373] flex items-center gap-2"
            >
              {!isScanning && <div className="w-1.5 h-1.5 rounded-full bg-[#404040] animate-pulse" />}
              {statusText}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center gap-2"
            >
              <div className="flex items-center gap-1.5 text-xs text-[#F5F5F5] uppercase tracking-wider font-semibold">
                {finalResult.riskLevel === 'low' ? (
                  <ShieldCheck className={cn("w-3.5 h-3.5", getRiskColor(finalResult.riskLevel).split(' ')[0])} />
                ) : (
                  <AlertTriangle className={cn("w-3.5 h-3.5", getRiskColor(finalResult.riskLevel).split(' ')[0])} />
                )}
                <span>Scan Complete</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
