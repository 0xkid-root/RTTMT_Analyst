import React from 'react';
import { Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ScanNodeProps {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  isCurrent: boolean;
  isCompleted: boolean;
  position?: { x: number; y: number };
  isMobile?: boolean;
  finalRiskScore?: number | null;
  finalRiskLevel?: string | null;
}

export function ScanNode({ 
  id, label, description, icon: Icon, isCurrent, isCompleted, position, isMobile, finalRiskScore, finalRiskLevel 
}: ScanNodeProps) {
  
  const isRisk = id === 'risk';
  const showRiskResult = isRisk && finalRiskScore && finalRiskLevel;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-500 border-green-500/30';
      case 'elevated': return 'text-yellow-500 border-yellow-500/30';
      case 'critical': return 'text-red-500 border-red-500/30';
      default: return 'text-muted-foreground border-border';
    }
  };

  const containerClass = cn(
    "relative group rounded-xl p-[1px] transition-all duration-500 overflow-hidden",
    isMobile ? "w-full z-10" : "absolute z-10 w-[150px]",
    isCurrent ? "scale-[1.02] shadow-[0_4px_20px_rgba(255,255,255,0.03)]" : "scale-100",
    showRiskResult ? "scale-[1.04] shadow-[0_8px_30px_rgba(255,255,255,0.05)]" : ""
  );

  const innerClass = cn(
    "relative h-full bg-[#0A0A0A] rounded-[10px] p-3 flex items-start gap-3 transition-colors duration-500 z-10 border",
    isCurrent 
      ? "border-[#737373]" 
      : "border-[#292929] group-hover:border-[#404040]",
    isCompleted && !isRisk ? "border-[#404040]" : "",
    showRiskResult ? getRiskColor(finalRiskLevel) + " bg-[#101010]" : ""
  );

  const content = (
    <>
      {/* Refined Traveling Perimeter Ray (Hover) */}
      {!showRiskResult && (
        <div className="absolute inset-[-100%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-[spin_3s_linear_infinite] motion-reduce:hidden bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_95%,#A3A3A3_100%)] z-0" />
      )}
      
      <div className={innerClass}>
        <div className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:border-[#737373] group-hover:text-[#F5F5F5]",
          isCompleted && !isRisk ? "bg-[#101010] text-[#A3A3A3] border-[#404040]" : 
          isCurrent ? "bg-[#292929] text-[#F5F5F5] border-[#737373]" : 
          showRiskResult ? "bg-transparent " + getRiskColor(finalRiskLevel) :
          "bg-[#0A0A0A] text-[#737373] border-[#292929]"
        )}>
          {isCompleted && !isRisk ? <Check className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> : <Icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />}
        </div>
        <div className="flex flex-col pt-0.5">
          <span className={cn(
            "text-xs font-semibold tracking-tight transition-colors duration-500",
            isCurrent || showRiskResult ? "text-[#F5F5F5]" : 
            isCompleted ? "text-[#A3A3A3]" : "text-[#737373] group-hover:text-[#A3A3A3]"
          )}>
            {label}
          </span>
          
          {showRiskResult ? (
            <div className="mt-1 flex flex-col">
              <span className="text-lg font-mono text-[#F5F5F5] leading-none mb-0.5">{finalRiskScore}</span>
              <span className="text-[9px] uppercase tracking-wider font-bold opacity-80">{finalRiskLevel} RISK</span>
            </div>
          ) : (
            <span className="text-[10px] text-[#737373] mt-0.5 leading-tight group-hover:text-[#A3A3A3] transition-colors">{description}</span>
          )}
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return <div className={containerClass}>{content}</div>;
  }

  return (
    <motion.div 
      className={containerClass}
      style={{
        left: position?.x || 0,
        top: position?.y || 0,
        x: '-50%',
        y: '-50%'
      }}
      initial={false}
      animate={{
        scale: showRiskResult ? 1.04 : isCurrent ? 1.02 : 1
      }}
      transition={{ duration: 0.4 }}
    >
      {content}
    </motion.div>
  );
}
