'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Investigation } from '../types/investigation';
import {
  Network, ShieldAlert, ArrowRightLeft, Store,
  FileArchive, FileText, Gavel, FileCheck2
} from 'lucide-react';


interface InvestigationJourneyProps {
  investigation: Investigation;
}

interface NodeProps {
  x?: number;
  y?: number;
  label: string;
  value: string | number;
  icon: LucideIcon;
  sectionId: string;
  delay?: number;
}

export function InvestigationJourney({ investigation }: InvestigationJourneyProps) {
  const shouldReduceMotion = useReducedMotion();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 85) return 'text-red-500';
    if (score >= 65) return 'text-orange-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const strokeColorHex = investigation.riskScore >= 85 ? '#ef4444' : investigation.riskScore >= 65 ? '#f97316' : investigation.riskScore >= 40 ? '#eab308' : '#22c55e';

  // Path drawing helper
  const drawCubic = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  };

  const PathLine = ({ d, delay }: { d: string, delay: number }) => (
    <g>
      {/* Base Line */}
      <motion.path
        d={d}
        fill="none"
        stroke="#292929"
        strokeWidth="2"
        strokeDasharray={shouldReduceMotion ? "none" : "1000"}
        strokeDashoffset={shouldReduceMotion ? 0 : "1000"}
        initial={shouldReduceMotion ? undefined : { strokeDashoffset: 1000 }}
        whileInView={shouldReduceMotion ? undefined : { strokeDashoffset: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.2, delay, ease: "easeOut" }}
      />

      {/* Glowing Ray */}
      {!shouldReduceMotion && (
        <motion.path
          d={d}
          fill="none"
          stroke={strokeColorHex}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${strokeColorHex})` }}
          strokeDasharray="20 1000"
          initial={{ strokeDashoffset: 1000, opacity: 0 }}
          whileInView={{ strokeDashoffset: [1000, 0], opacity: [0, 1, 1, 0] }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            strokeDashoffset: { duration: 3, repeat: Infinity, ease: "linear", delay: delay + 1.5 },
            opacity: { duration: 3, repeat: Infinity, ease: "linear", delay: delay + 1.5, times: [0, 0.1, 0.9, 1] }
          }}
        />
      )}
    </g>
  );

  const IntelligenceNode = ({ x = 0, y = 0, label, value, icon: Icon, sectionId, delay = 0 }: NodeProps) => (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, x: -10 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, x: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={shouldReduceMotion ? {} : { y: -2, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: '#141414' }}
      className="absolute flex items-center gap-3 bg-[#0a0a0a] border border-[#292929] p-3 rounded-xl shadow-sm cursor-pointer z-10 transition-colors"
      style={{ left: x - 80, top: y - 32, width: 160, height: 64 }}
      onClick={() => scrollToSection(sectionId)}
    >
      <div className="bg-background border border-border p-2 rounded-lg text-muted-foreground shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col min-w-0 overflow-hidden">
        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground truncate">{label}</span>
        <span className="text-xs font-medium text-foreground truncate">{value}</span>
      </div>
    </motion.div>
  );

  const MobileNode = ({ label, value, icon: Icon, sectionId }: NodeProps) => (
    <div
      className="flex items-center gap-3 bg-[#0a0a0a] border border-[#292929] p-3 rounded-xl shadow-sm cursor-pointer hover:bg-[#141414] hover:border-[rgba(255,255,255,0.15)] transition-colors w-full max-w-[280px]"
      onClick={() => scrollToSection(sectionId)}
    >
      <div className="bg-background border border-border p-2 rounded-lg text-muted-foreground shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col min-w-0 overflow-hidden">
        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground truncate">{label}</span>
        <span className="text-xs font-medium text-foreground truncate">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#101010] border border-border rounded-xl shadow-sm p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Investigation Map</h2>
      </div>

      {/* DESKTOP VISUALIZATION */}
      <div className="hidden lg:block relative w-full h-[600px] max-w-[1000px] mx-auto select-none">

        {/* SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {/* Inputs -> Center */}
          <PathLine d={drawCubic(220, 120, 370, 300)} delay={0.5} />
          <PathLine d={drawCubic(220, 240, 370, 300)} delay={0.5} />
          <PathLine d={drawCubic(220, 360, 370, 300)} delay={0.5} />
          <PathLine d={drawCubic(220, 480, 370, 300)} delay={0.5} />

          {/* Center -> Analysis */}
          <PathLine d={drawCubic(550, 300, 640, 200)} delay={0.8} />
          <PathLine d={drawCubic(550, 300, 640, 320)} delay={0.8} />

          {/* Analysis -> Decision */}
          <PathLine d={drawCubic(800, 200, 850, 260)} delay={1.2} />
          <PathLine d={drawCubic(800, 320, 850, 260)} delay={1.2} />

          {/* Decision -> Resolve */}
          <PathLine d="M 920 292 L 920 328" delay={1.6} />
        </svg>

        {/* INPUT NODES */}
        <IntelligenceNode x={140} y={120} label="Risk Signals" value={`${investigation.riskSignals.length} signals`} icon={Network} sectionId="risk-signals" delay={0.3} />
        <IntelligenceNode x={140} y={240} label="Alerts" value={`${investigation.alertCount} alerts`} icon={ShieldAlert} sectionId="risk-signals" delay={0.3} />
        <IntelligenceNode x={140} y={360} label="Transactions" value={`${investigation.transactionCount} linked`} icon={ArrowRightLeft} sectionId="related-transactions" delay={0.3} />
        <IntelligenceNode x={140} y={480} label="Entity" value={investigation.merchant} icon={Store} sectionId="merchant-context" delay={0.3} />

        {/* CENTER INVESTIGATION NODE */}
        <motion.div
          className="absolute z-10 flex flex-col items-center justify-center rounded-2xl bg-[#0a0a0a] border shadow-xl cursor-pointer"
          style={{ left: 460 - 90, top: 300 - 90, width: 180, height: 180, borderColor: '#404040' }}
          initial={shouldReduceMotion ? undefined : { scale: 0.9, opacity: 0 }}
          whileInView={shouldReduceMotion ? undefined : { scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
          onClick={() => scrollToSection('investigation-header')}
          whileHover={shouldReduceMotion ? {} : { scale: 1.02, borderColor: strokeColorHex }}
        >
          {!shouldReduceMotion && (
            <div className="absolute inset-0 rounded-2xl blur-2xl opacity-10 pointer-events-none" style={{ backgroundColor: strokeColorHex }} />
          )}
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-1">Investigation</span>
          <span className="text-xs font-mono text-[#f5f5f5] mb-4">{investigation.id}</span>

          <span className="text-4xl font-black font-mono tracking-tighter mb-2" style={{ color: strokeColorHex }}>{investigation.riskScore}</span>

          <span className="text-[9px] font-bold uppercase tracking-wider bg-[#171717] px-2 py-0.5 rounded border mb-2" style={{ color: strokeColorHex, borderColor: strokeColorHex + '40' }}>
            {investigation.riskLevel} RISK
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#737373]">
            {investigation.status.replace('_', ' ')}
          </span>
        </motion.div>

        {/* ANALYSIS NODES */}
        <IntelligenceNode x={720} y={200} label="Evidence" value={`${investigation.evidence.length} items`} icon={FileArchive} sectionId="evidence" delay={1.0} />
        <IntelligenceNode x={720} y={320} label="Review" value={`${investigation.notes.length} notes`} icon={FileText} sectionId="analyst-notes" delay={1.0} />

        {/* OUTCOME NODES */}
        <IntelligenceNode x={920} y={260} label="Decision" value={['RESOLVED', 'CLOSED'].includes(investigation.status) ? 'Made' : 'Pending'} icon={Gavel} sectionId="analyst-notes" delay={1.4} />
        <IntelligenceNode x={920} y={360} label="Resolve / Escalate" value={investigation.status.replace('_', ' ')} icon={FileCheck2} sectionId="investigation-header" delay={1.8} />

      </div>

      {/* MOBILE / TABLET VISUALIZATION (Vertical Flow) */}
      <div className="flex lg:hidden flex-col items-center w-full py-4">

        {/* Inputs */}
        <MobileNode label="Risk Signals" value={`${investigation.riskSignals.length} signals`} icon={Network} sectionId="risk-signals" />
        <div className="w-0.5 h-6 bg-border" />
        <MobileNode label="Alerts" value={`${investigation.alertCount} alerts`} icon={ShieldAlert} sectionId="risk-signals" />
        <div className="w-0.5 h-6 bg-border" />
        <MobileNode label="Transactions" value={`${investigation.transactionCount} linked`} icon={ArrowRightLeft} sectionId="related-transactions" />
        <div className="w-0.5 h-6 bg-border" />
        <MobileNode label="Entity" value={investigation.merchant} icon={Store} sectionId="merchant-context" />
        <div className="w-0.5 h-6 bg-border" />

        {/* Center Investigation */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-[#0a0a0a] border border-border p-6 shadow-xl cursor-pointer w-full max-w-[280px]"
          onClick={() => scrollToSection('investigation-header')}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Investigation</span>
          <span className="text-xs font-mono text-foreground mb-4">{investigation.id}</span>
          <span className="text-4xl font-black font-mono tracking-tighter mb-2" style={{ color: strokeColorHex }}>{investigation.riskScore}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider bg-muted/30 px-2 py-0.5 rounded border border-border" style={{ color: strokeColorHex, borderColor: strokeColorHex + '40' }}>
            {investigation.riskLevel} RISK
          </span>
        </div>
        <div className="w-0.5 h-6 bg-border" />

        {/* Analysis & Outcome */}
        <MobileNode label="Evidence" value={`${investigation.evidence.length} items`} icon={FileArchive} sectionId="evidence" />
        <div className="w-0.5 h-6 bg-border" />
        <MobileNode label="Review" value={`${investigation.notes.length} notes`} icon={FileText} sectionId="analyst-notes" />
        <div className="w-0.5 h-6 bg-border" />
        <MobileNode label="Decision" value={['RESOLVED', 'CLOSED'].includes(investigation.status) ? 'Made' : 'Pending'} icon={Gavel} sectionId="analyst-notes" />
        <div className="w-0.5 h-6 bg-border" />
        <MobileNode label="Resolve / Escalate" value={investigation.status.replace('_', ' ')} icon={FileCheck2} sectionId="investigation-header" />

      </div>

    </div>
  );
}
