'use client';

import { ArrowLeftRight, ShieldCheck, Zap, Radio, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const STAGES = [
  {
    id: 'ingress',
    icon: ArrowLeftRight,
    label: 'Transaction Input',
    subtitle: 'Stream event ingress & payload ingestion',
  },
  {
    id: 'evaluation',
    icon: ShieldCheck,
    label: 'Rule Evaluation',
    subtitle: 'Threshold, velocity & anomaly conditions',
    isEngine: true,
  },
  {
    id: 'signal',
    icon: Zap,
    label: 'Signal Generated',
    subtitle: 'Technical finding emitted to intelligence layer',
  },
];

const TOTAL_LOOP = 6; // seconds for full cycle
const NODE_LEN = 0.16;

const C = {
  surface: '#171717',
  muted: '#737373',
  soft: '#A3A3A3',
  bright: '#F5F5F5',
  border: '#292929',
};

const W = (a: number) => `rgba(245,245,245,${a})`;

const nodeTimes = (start: number, end: number) => [
  0,
  Math.max(0, start - 0.05),
  start,
  end,
  Math.min(1, end + 0.08),
  1,
];

const pulse = <T,>(idle: T, active: T): T[] => [idle, idle, active, active, idle, idle];

export function DetectionSignalPipeline({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div className={`w-full bg-card border border-border rounded-xl p-5 shadow-xs relative overflow-hidden ${className}`}>
      {/* Top Meta info */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-foreground tracking-tight">
            Detection Pipeline Topology
          </span>
          <span className="text-[10px] uppercase font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Real-Time Stream
          </span>
        </div>

        <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5">
          {!reduce && (
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          Deterministic Execution • ~2.4ms Avg
        </span>
      </div>

      {/* Horizontal Pipeline */}
      <div className="w-full overflow-x-auto hide-scrollbar pt-6 pb-2">
        <div className="flex flex-row items-start justify-between min-w-[580px] w-full px-2">
          {STAGES.map((stage, index) => {
            const Icon = stage.icon;

            const nodeStart = index * 0.36;
            const nodeEnd = nodeStart + NODE_LEN;
            const connStart = nodeEnd;
            const connEnd = connStart + NODE_LEN;

            const times = nodeTimes(nodeStart, nodeEnd);
            const loop = { duration: TOTAL_LOOP, times, repeat: Infinity, ease: 'easeInOut' as const };

            return (
              <div key={stage.id} className="flex items-start w-full">
                {/* Node */}
                <motion.div
                  className="flex flex-col items-center w-36 flex-shrink-0 z-10"
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
                >
                  <div className="relative w-12 h-12">
                    {/* Subtle node aura */}
                    {!reduce && (
                      <motion.div
                        className="absolute pointer-events-none rounded-full"
                        style={{
                          inset: -14,
                          background: `radial-gradient(circle, ${W(stage.isEngine ? 0.18 : 0.1)} 0%, ${W(0)} 70%)`,
                        }}
                        animate={{ opacity: pulse(0, 1), scale: pulse(0.8, 1) }}
                        transition={loop}
                      />
                    )}

                    {/* Node circle */}
                    <motion.div
                      className="absolute inset-0 rounded-full flex items-center justify-center border overflow-hidden"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, #262626 0%, ${C.surface} 60%, #121212 100%)`,
                      }}
                      initial={{
                        borderColor: reduce ? (stage.isEngine ? C.soft : C.border) : C.border,
                      }}
                      animate={
                        reduce
                          ? {}
                          : {
                              borderColor: pulse(C.border, stage.isEngine ? C.bright : C.soft),
                              scale: [1, 1, 1.08, 1.02, 1, 1],
                              boxShadow: pulse(
                                `inset 0 1px 0 ${W(0.04)}, 0 0 0 ${W(0)}`,
                                `inset 0 1px 0 ${W(0.2)}, 0 0 16px ${W(stage.isEngine ? 0.18 : 0.08)}`
                              ),
                            }
                      }
                      transition={loop}
                    >
                      <motion.div
                        initial={{ color: reduce ? (stage.isEngine ? C.bright : C.muted) : C.muted }}
                        animate={
                          reduce
                            ? {}
                            : {
                                color: pulse(C.muted, C.bright),
                                filter: pulse(
                                  'drop-shadow(0 0 0px rgba(245,245,245,0))',
                                  'drop-shadow(0 0 4px rgba(245,245,245,0.5))'
                                ),
                              }
                        }
                        transition={loop}
                      >
                        <Icon className="w-5 h-5" strokeWidth={1.8} />
                      </motion.div>
                    </motion.div>

                    {/* Completion marker on output stage */}
                    {stage.id === 'signal' && (
                      <motion.div
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: C.bright, color: C.surface, border: `2px solid ${C.surface}` }}
                        initial={{ scale: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
                        animate={
                          reduce ? {} : { scale: [0, 0, 0, 1.15, 1, 0], opacity: [0, 0, 1, 1, 1, 0] }
                        }
                        transition={{
                          duration: TOTAL_LOOP,
                          times: [
                            0,
                            nodeStart - 0.02,
                            nodeStart + 0.03,
                            nodeStart + 0.06,
                            nodeEnd + 0.05,
                            Math.min(1, nodeEnd + 0.09),
                          ],
                          repeat: Infinity,
                          ease: 'easeOut',
                        }}
                      >
                        <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
                      </motion.div>
                    )}
                  </div>

                  {/* Stage titles */}
                  <motion.h4
                    className="text-xs font-semibold text-center mt-3 tracking-tight"
                    initial={{ color: reduce ? (stage.isEngine ? C.bright : C.soft) : C.muted }}
                    animate={reduce ? {} : { color: pulse(C.muted, C.bright) }}
                    transition={loop}
                  >
                    {stage.label}
                  </motion.h4>

                  <motion.p
                    className="text-[11px] text-center leading-relaxed mt-0.5 max-w-[120px] text-muted-foreground"
                    initial={{ opacity: 0.7 }}
                    animate={reduce ? {} : { opacity: [0.7, 0.7, 1, 1, 0.7, 0.7] }}
                    transition={loop}
                  >
                    {stage.subtitle}
                  </motion.p>
                </motion.div>

                {/* Connector between nodes with moving dot */}
                {index < STAGES.length - 1 && (
                  <div className="flex-1 h-[1px] bg-border/80 relative overflow-visible mt-6 mx-2">
                    {!reduce && (
                      <>
                        {/* Glow beam */}
                        <motion.div
                          className="absolute inset-y-0 left-0 w-full origin-left"
                          style={{ background: W(0.35) }}
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: [0, 0, 1, 1, 1], opacity: [0, 1, 1, 0, 0] }}
                          transition={{
                            duration: TOTAL_LOOP,
                            times: [0, connStart, connEnd, Math.min(1, connEnd + 0.08), 1],
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />

                        {/* Animated traveling dot */}
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-foreground shadow-xs"
                          style={{
                            width: 5,
                            height: 5,
                            boxShadow: `0 0 8px ${W(0.9)}`,
                          }}
                          initial={{ left: '0%', opacity: 0 }}
                          animate={{
                            left: ['0%', '0%', '100%', '100%', '100%'],
                            opacity: [0, 1, 1, 0, 0],
                            scale: [0.7, 0.7, 1, 0.5, 0.5],
                          }}
                          transition={{
                            duration: TOTAL_LOOP,
                            times: [0, connStart, connEnd, Math.min(1, connEnd + 0.02), 1],
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
