'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useInvestigationStore } from '../store/useInvestigationStore';
import { PageTransition } from '@/components/animations/PageTransition';
import { StaggerContainer, StaggerItem } from '@/components/animations/Stagger';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  ArrowLeft, AlertTriangle, ShieldAlert, Network, ArrowRightLeft, 
  Store, Clock, FileText, UserPlus, FileCheck2, Share, FileArchive, Plus,
  ArrowRight
} from 'lucide-react';
import { InvestigationJourney } from './InvestigationJourney';
import Link from 'next/link';

interface InvestigationDetailsPageProps {
  investigationId: string;
}

const getDeterministicAmount = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return (Math.abs(Math.sin(hash)) * 50000 + 1000).toFixed(2);
};

function AnimatedNumber({ value }: { value: number }) {
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplay(value);
      return;
    }
    const duration = 600;
    const steps = 30;
    const stepTime = duration / steps;
    let current = 0;
    const target = value;
    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        setDisplay(target);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, shouldReduceMotion]);

  return <>{display}</>;
}

export function InvestigationDetailsPage({ investigationId }: InvestigationDetailsPageProps) {
  const router = useRouter();
  const getInvestigation = useInvestigationStore(state => state.getInvestigation);
  const investigation = useMemo(() => getInvestigation(investigationId), [getInvestigation, investigationId]);
  const shouldReduceMotion = useReducedMotion();

  // For Risk Score animation
  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    if (!investigation) return;
    if (shouldReduceMotion) {
      setDisplayedScore(investigation.riskScore);
      return;
    }
    
    const duration = 1500;
    const steps = 60;
    const stepTime = Math.abs(Math.floor(duration / steps));
    const target = investigation.riskScore;
    let current = 0;
    
    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        setDisplayedScore(target);
        clearInterval(timer);
      } else {
        setDisplayedScore(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [investigation, shouldReduceMotion]);

  if (!investigation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-12">
        <h2 className="text-xl font-bold mb-2">Investigation Not Found</h2>
        <p className="mb-4">The investigation ID {investigationId} does not exist or you do not have permission.</p>
        <button 
          onClick={() => router.push('/investigations/all')}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm transition-colors hover:bg-primary/90"
        >
          Return to Investigations
        </button>
      </div>
    );
  }

  const getRiskColor = (score: number) => {
    if (score >= 85) return 'text-red-500';
    if (score >= 65) return 'text-orange-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  const getRiskBorder = (score: number) => {
    if (score >= 85) return 'border-red-500/50';
    if (score >= 65) return 'border-orange-500/50';
    if (score >= 40) return 'border-yellow-500/50';
    return 'border-green-500/50';
  };

  const getRiskBg = (score: number) => {
    if (score >= 85) return 'bg-red-500/10';
    if (score >= 65) return 'bg-orange-500/10';
    if (score >= 40) return 'bg-yellow-500/10';
    return 'bg-green-500/10';
  };

  const scoreColor = getRiskColor(investigation.riskScore);
  const scoreBorder = getRiskBorder(investigation.riskScore);
  const scoreBg = getRiskBg(investigation.riskScore);

  const isActive = investigation.status !== 'CLOSED' && investigation.status !== 'RESOLVED';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
    }
  };

  return (
    <PageTransition>
      <motion.div 
        className="max-w-[1600px] mx-auto w-full flex flex-col gap-6 pb-24"
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial="hidden"
        animate="show"
      >
        
        {/* Top Navigation */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/investigations/all" className="flex items-center gap-1 hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Investigations
            </Link>
            <span>/</span>
            <span className="text-foreground font-mono">{investigation.id}</span>
          </div>
          
          {/* Active Indicator */}
          <div className="flex items-center gap-2 text-sm font-medium">
            {isActive ? (
              <>
                <motion.div 
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={shouldReduceMotion ? {} : { opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-green-500">Investigation Active</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">Resolved</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Header Section */}
        <motion.div id="investigation-header" variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-6 rounded-xl shadow-sm relative overflow-hidden">
          {/* Subtle background glow based on risk */}
          {!shouldReduceMotion && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 1 }}
              className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none ${scoreBg.replace('/10', '')}`}
            />
          )}

          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex items-center gap-3">
              <motion.span 
                initial={shouldReduceMotion ? false : { boxShadow: '0 0 0px transparent' }}
                animate={shouldReduceMotion ? false : { boxShadow: ['0 0 0px transparent', `0 0 12px var(--tw-shadow-color)`, '0 0 0px transparent'] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`shadow-${scoreColor.replace('text-', '')} px-2 py-0.5 rounded text-[11px] font-bold tracking-widest uppercase border ${scoreColor} ${scoreBorder} ${scoreBg}`}
              >
                {investigation.riskLevel} RISK
              </motion.span>
              <span className="text-xs font-mono text-muted-foreground border border-border bg-muted/30 px-2 py-0.5 rounded">
                {investigation.status.replace('_', ' ')}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight">{investigation.title}</h1>
            <p className="text-muted-foreground max-w-2xl">{investigation.description}</p>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Store className="w-4 h-4" /> {investigation.merchant}
              </div>
              <div className="flex items-center gap-1.5">
                <UserPlus className="w-4 h-4" /> Assigned to {investigation.assignedTo}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Last updated: {new Date(investigation.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          <motion.div 
            className="flex gap-2 relative z-10 shrink-0"
            variants={shouldReduceMotion ? undefined : {
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
            }}
            initial="hidden"
            animate="show"
          >
            <motion.button 
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -1 }}
              className="h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" /> Assign
            </motion.button>
            <motion.button 
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -1 }}
              className="h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" /> Add Note
            </motion.button>
            <motion.button 
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.01 }}
              className="h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              <Share className="w-4 h-4 mr-2" /> Escalate
            </motion.button>
            <motion.button 
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.02 }}
              className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              <FileCheck2 className="w-4 h-4 mr-2" /> Resolve
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Investigation Journey */}
        <motion.div variants={itemVariants}>
          <InvestigationJourney investigation={investigation} />
        </motion.div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Risk Intelligence & Evidence */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Risk Overview Grid */}
            <motion.div 
              id="risk-overview"
              variants={shouldReduceMotion ? undefined : {
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <motion.div 
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/30 transition-colors hover:shadow-md"
              >
                <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">Risk Score</div>
                
                {/* Radial Progress Visualization */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
                    <circle className="text-muted/30 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                    <motion.circle 
                      className={`${scoreColor} stroke-current`} 
                      strokeWidth="8" 
                      strokeLinecap="round" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent"
                      initial={shouldReduceMotion ? { strokeDasharray: "251.2", strokeDashoffset: `${251.2 - (251.2 * investigation.riskScore) / 100}` } : { strokeDasharray: "251.2", strokeDashoffset: "251.2" }}
                      animate={{ strokeDashoffset: `${251.2 - (251.2 * investigation.riskScore) / 100}` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    ></motion.circle>
                  </svg>
                  {/* Subtle animated scanning/highlight arc */}
                  {!shouldReduceMotion && (
                    <motion.svg className="w-full h-full -rotate-90 absolute inset-0 z-0 opacity-50" viewBox="0 0 100 100">
                      <motion.circle 
                        className={`${scoreColor} stroke-current blur-sm`} 
                        strokeWidth="12" 
                        strokeLinecap="round" 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent"
                        strokeDasharray="251.2"
                        initial={{ strokeDashoffset: "251.2" }}
                        animate={{ strokeDashoffset: [`251.2`, `${251.2 - (251.2 * investigation.riskScore) / 100}`], opacity: [0, 0.5, 0] }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      ></motion.circle>
                    </motion.svg>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <span className={`text-3xl font-black font-mono tracking-tighter ${scoreColor}`}>
                      {displayedScore}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col items-center justify-center hover:border-primary/20 transition-colors hover:shadow-md"
              >
                <ShieldAlert className="w-6 h-6 text-muted-foreground mb-3" />
                <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Alerts</div>
                <div className="text-3xl font-bold font-mono"><AnimatedNumber value={investigation.alertCount} /></div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col items-center justify-center hover:border-primary/20 transition-colors hover:shadow-md"
              >
                <ArrowRightLeft className="w-6 h-6 text-muted-foreground mb-3" />
                <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Txns</div>
                <div className="text-3xl font-bold font-mono"><AnimatedNumber value={investigation.transactionCount} /></div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col items-center justify-center hover:border-primary/20 transition-colors hover:shadow-md"
              >
                <Store className="w-6 h-6 text-muted-foreground mb-3" />
                <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Entities</div>
                <div className="text-3xl font-bold font-mono"><AnimatedNumber value={1} /></div>
              </motion.div>
            </motion.div>

            {/* Risk Signals */}
            <motion.div 
              id="risk-signals"
              variants={itemVariants}
              whileInView="show"
              initial="hidden"
              viewport={{ once: true, amount: 0.15 }}
              className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg tracking-tight">Risk Signals</h3>
              </div>
              <div className="p-4">
                {investigation.riskSignals.length > 0 ? (
                  <motion.div 
                    className="space-y-3"
                    variants={{ show: { transition: { staggerChildren: 0.12 } } }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                  >
                    {investigation.riskSignals.map((signal, idx) => (
                      <motion.div 
                        key={idx} 
                        variants={{
                          hidden: { opacity: 0, x: -8, scale: 0.99 },
                          show: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4 } }
                        }}
                        whileHover={shouldReduceMotion ? {} : { scale: 1.005, y: -1 }}
                        className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border hover:border-primary/40 hover:shadow-sm transition-all group"
                      >
                        <div className="mt-0.5">
                          <motion.div
                            initial={shouldReduceMotion ? {} : { scale: 1.5, opacity: 0 }}
                            animate={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                          >
                            <AlertTriangle className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                          </motion.div>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{signal}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            System detected anomalous pattern matching known risk typologies for this profile.
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <p className="text-muted-foreground text-sm p-4 text-center">No explicit risk signals mapped.</p>
                )}
              </div>
            </motion.div>

            {/* Related Transactions */}
            <motion.div 
              id="related-transactions"
              variants={itemVariants}
              whileInView="show"
              initial="hidden"
              viewport={{ once: true, amount: 0.15 }}
              className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg tracking-tight">Related Transactions</h3>
                </div>
                <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                  {investigation.relatedTransactions.length} items
                </span>
              </div>
              
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-sm text-left relative">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/10 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium">Transaction ID</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium text-right">Risk</th>
                    </tr>
                  </thead>
                  <motion.tbody 
                    className="divide-y divide-border"
                    variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                  >
                    {investigation.relatedTransactions.length > 0 ? (
                      investigation.relatedTransactions.map((txnId, idx) => (
                        <motion.tr 
                          key={txnId} 
                          variants={{
                            hidden: { opacity: 0, y: 6 },
                            show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                          }}
                          whileHover={shouldReduceMotion ? {} : { backgroundColor: 'var(--tw-colors-muted-30)' }}
                          onClick={() => router.push(`/transactions/${txnId}`)}
                          className="hover:bg-muted/30 transition-colors cursor-pointer group relative"
                        >
                          <td className="px-4 py-3 font-mono text-primary group-hover:underline relative">
                            {/* Subtle left accent on hover */}
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            {txnId}
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">₹{getDeterministicAmount(txnId)}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border border-orange-500/30 bg-orange-500/10 text-orange-500">
                              HIGH
                            </span>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">No transactions linked directly.</td>
                      </tr>
                    )}
                  </motion.tbody>
                </table>
              </div>
            </motion.div>

            {/* Evidence Section */}
            <motion.div 
              id="evidence"
              variants={itemVariants}
              whileInView="show"
              initial="hidden"
              viewport={{ once: true, amount: 0.15 }}
              className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <FileArchive className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg tracking-tight">Evidence</h3>
                </div>
                <motion.button 
                  whileHover={shouldReduceMotion ? {} : { y: -1, scale: 1.02 }}
                  className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/80 transition-colors"
                >
                  + Add Evidence
                </motion.button>
              </div>
              <div className="p-4">
                {investigation.evidence.length > 0 ? (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                  >
                    {investigation.evidence.map((ev) => (
                      <motion.div 
                        key={ev.id} 
                        variants={{
                          hidden: { opacity: 0, y: 8 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                        }}
                        whileHover={shouldReduceMotion ? {} : { y: -2 }}
                        className="p-4 rounded-lg bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">{ev.type}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {new Date(ev.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{ev.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">No evidence collected yet.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Timeline & Context */}
          <div className="space-y-6">
            
            {/* Entity Context */}
            <motion.div 
              id="merchant-context"
              variants={itemVariants}
              whileInView="show"
              initial="hidden"
              viewport={{ once: true, amount: 0.15 }}
              className="bg-card border border-border rounded-xl shadow-sm p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Store className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg tracking-tight">Merchant Context</h3>
              </div>
              
              <motion.div 
                className="space-y-4"
                variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
                  <div className="text-2xl font-bold tracking-tight text-foreground">{investigation.merchant}</div>
                  <div className="text-sm text-muted-foreground">Category: Digital Goods</div>
                </motion.div>
                
                <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="grid grid-cols-2 gap-3">
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-semibold">Entity Risk</div>
                    <div className="text-xl font-bold font-mono text-orange-500">72</div>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-semibold">Prior Alerts</div>
                    <div className="text-xl font-bold font-mono">6</div>
                  </div>
                </motion.div>
                
                <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="pt-2">
                  <button 
                    onClick={() => router.push(`/merchants/mock`)}
                    className="group w-full h-9 border border-input bg-background hover:bg-accent hover:border-primary/40 hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-xs font-medium transition-all"
                  >
                    View Merchant Details 
                    <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Investigation Timeline */}
            <motion.div 
              variants={itemVariants}
              whileInView="show"
              initial="hidden"
              viewport={{ once: true, amount: 0.15 }}
              className="bg-card border border-border rounded-xl shadow-sm p-5"
            >
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg tracking-tight">Timeline</h3>
              </div>
              
              {investigation.timeline.length > 0 ? (
                <div className="relative pl-4 border-l-2 border-muted pb-4 space-y-6">
                  {/* Subtle timeline drawing animation */}
                  {!shouldReduceMotion && (
                    <motion.div 
                      className="absolute top-0 bottom-0 left-[-2px] w-[2px] bg-primary origin-top"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  )}
                  
                  {investigation.timeline.map((event, idx) => (
                    <motion.div 
                      key={event.id} 
                      className="relative pl-6 group"
                      initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      whileHover={shouldReduceMotion ? {} : { x: 4 }}
                      viewport={{ once: true }}
                      transition={{ 
                        opacity: { delay: idx * 0.1, duration: 0.4 },
                        x: { type: "spring", stiffness: 300, damping: 20 }
                      }}
                    >
                      <motion.div 
                        initial={shouldReduceMotion ? false : { scale: 0.7 }}
                        whileInView={{ scale: 1 }}
                        whileHover={shouldReduceMotion ? {} : { scale: 1.3, backgroundColor: 'var(--tw-colors-primary)' }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 + 0.2, duration: 0.3 }}
                        className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-background border-2 border-primary z-10 transition-colors" 
                      />
                      <div className="text-xs font-mono text-muted-foreground mb-1 group-hover:text-primary transition-colors">
                        {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.user}
                      </div>
                      <div className="text-sm font-medium text-foreground">{event.action}</div>
                      {event.details && (
                        <div className="text-xs text-muted-foreground mt-1 bg-muted/30 p-2 rounded border border-border group-hover:border-primary/30 transition-colors">
                          {event.details}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center">No timeline events recorded.</p>
              )}
            </motion.div>

            {/* Analyst Notes */}
            <motion.div 
              id="analyst-notes"
              variants={itemVariants}
              whileInView="show"
              initial="hidden"
              viewport={{ once: true, amount: 0.15 }}
              className="bg-card border border-border rounded-xl shadow-sm p-5"
            >
              <div className="flex items-center gap-2 justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg tracking-tight">Analyst Notes</h3>
                </div>
                <motion.button 
                  whileHover={shouldReduceMotion ? {} : { rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {investigation.notes.length > 0 ? (
                  <motion.div 
                    className="space-y-4"
                    variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                  >
                    {investigation.notes.map((note) => (
                      <motion.div 
                        key={note.id} 
                        variants={{
                          hidden: { opacity: 0, y: 8 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                        }}
                        whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.01, borderColor: 'var(--tw-colors-primary)' }}
                        className="bg-background rounded-lg p-3 border border-border space-y-2 hover:shadow-md transition-all group"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{note.user}</span>
                          <span className="font-mono text-muted-foreground">
                            {new Date(note.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">"{note.text}"</p>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">No notes added.</p>
                )}
                
                <motion.div 
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="pt-2"
                >
                  <textarea 
                    className="w-full min-h-[80px] text-sm bg-background border border-input rounded-md p-3 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    placeholder="Add a new note..."
                  />
                  <div className="flex justify-end mt-2">
                    <button className="h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors">
                      Save Note
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </PageTransition>
  );
}
