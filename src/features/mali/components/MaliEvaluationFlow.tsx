'use client';

import { ArrowLeftRight, ScanSearch, BrainCircuit, ShieldCheck, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const STAGES = [
  { id: 'input', icon: ArrowLeftRight, label: 'Transaction Input', subtitle: 'Data enters evaluation pipeline' },
  { id: 'analysis', icon: ScanSearch, label: 'Feature Analysis', subtitle: 'Examine signals & features' },
  { id: 'mali', icon: BrainCircuit, label: 'MALi Scoring Engine', subtitle: 'Evaluate risk models', isEngine: true },
  { id: 'result', icon: ShieldCheck, label: 'Risk Result', subtitle: 'Produce risk score' },
];

const TOTAL_LOOP = 9; // seconds
const NODE_LEN = 0.125;

// Same palette as before
const C = {
  surface: '#171717',
  muted: '#737373',
  soft: '#A3A3A3',
  bright: '#F5F5F5',
};
const W = (a: number) => `rgba(245,245,245,${a})`;

const nodeTimes = (start: number, end: number) => [
  0,
  Math.max(0, start - 0.04),
  start,
  end,
  Math.min(1, end + 0.08),
  1,
];
const pulse = <T,>(idle: T, active: T): T[] => [idle, idle, active, active, idle, idle];

// Mask that turns a conic gradient into a thin ring
const RING_MASK = 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))';

export function MaliEvaluationFlow() {
  const reduce = useReducedMotion();

  return (
    <div className="w-full mb-8 pt-2">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-sm font-semibold text-foreground tracking-tight"></h2>
          <p className="text-xs text-muted-foreground mt-1"></p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground bg-foreground/5 px-2 py-1 rounded border border-border">
          {!reduce && (
            <motion.span
              className="w-1 h-1 rounded-full bg-foreground"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          Illustrative flow
        </span>
      </div>

      {/* Pipeline (extra padding so glows never get clipped) */}
      <div className="w-full overflow-x-auto hide-scrollbar pb-6 pt-10 -mt-10">
        <div className="flex flex-row items-start justify-between min-w-[700px] w-full px-4">
          {STAGES.map((stage, index) => {
            const Icon = stage.icon;

            const nodeStart = index * 0.25;
            const nodeEnd = nodeStart + NODE_LEN;
            const connStart = nodeEnd;
            const connEnd = connStart + NODE_LEN;

            const times = nodeTimes(nodeStart, nodeEnd);
            const loop = { duration: TOTAL_LOOP, times, repeat: Infinity, ease: 'easeInOut' as const };

            const rippleTimes = (delay: number) => [
              0,
              Math.max(0, nodeStart - 0.04 + delay),
              nodeStart + delay,
              nodeStart + delay + 0.1,
              1,
            ];

            return (
              <div key={stage.id} className="flex items-start w-full">
                {/* Node */}
                <motion.div
                  className="flex flex-col items-center w-32 flex-shrink-0 z-10"
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
                >
                  <div className="relative w-14 h-14">
                    {/* Soft ambient glow behind the node */}
                    {!reduce && (
                      <motion.div
                        className="absolute pointer-events-none rounded-full"
                        style={{
                          inset: -22,
                          background: `radial-gradient(circle, ${W(stage.isEngine ? 0.2 : 0.12)} 0%, ${W(0)} 65%)`,
                        }}
                        animate={{ opacity: pulse(0, 1), scale: pulse(0.7, 1) }}
                        transition={loop}
                      />
                    )}

                    {/* Two staggered ripples */}
                    {!reduce &&
                      [0, 0.02].map((d, i) => (
                        <motion.div
                          key={i}
                          className="absolute inset-0 rounded-full border pointer-events-none"
                          style={{ borderColor: W(0.4 - i * 0.12) }}
                          initial={{ scale: 1, opacity: 0 }}
                          animate={{ scale: [1, 1, 1, 2, 2], opacity: [0, 0, 0.8, 0, 0] }}
                          transition={{
                            duration: TOTAL_LOOP,
                            times: rippleTimes(d),
                            repeat: Infinity,
                            ease: 'easeOut',
                          }}
                        />
                      ))}

                    {/* Rotating light arc (all nodes, faster on engine) */}
                    {!reduce && (
                      <motion.div
                        className="absolute rounded-full pointer-events-none"
                        style={{
                          inset: -5,
                          background: `conic-gradient(from 0deg, ${W(0)} 0%, ${W(0)} 50%, ${W(0.95)} 100%)`,
                          WebkitMask: RING_MASK,
                          mask: RING_MASK,
                        }}
                        animate={{ rotate: 360, opacity: pulse(0, 1) }}
                        transition={{
                          rotate: { duration: stage.isEngine ? 1.2 : 2, repeat: Infinity, ease: 'linear' },
                          opacity: loop,
                        }}
                      />
                    )}

                    {/* Engine: three orbiting dots, counter-rotating */}
                    {!reduce && stage.isEngine && (
                      <motion.div
                        className="absolute pointer-events-none"
                        style={{ inset: -12 }}
                        animate={{ rotate: -360, opacity: pulse(0, 1) }}
                        transition={{
                          rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                          opacity: loop,
                        }}
                      >
                        {[
                          { x: 50, y: 0 },
                          { x: 93.3, y: 75 },
                          { x: 6.7, y: 75 },
                        ].map((p, i) => (
                          <span
                            key={i}
                            className="absolute w-1 h-1 rounded-full -translate-x-1/2 -translate-y-1/2"
                            style={{
                              left: `${p.x}%`,
                              top: `${p.y}%`,
                              background: C.bright,
                              boxShadow: `0 0 6px ${W(0.8)}`,
                            }}
                          />
                        ))}
                      </motion.div>
                    )}

                    {/* Node body */}
                    <motion.div
                      className="absolute inset-0 rounded-full flex items-center justify-center border overflow-hidden"
                      style={{
                        background: `radial-gradient(circle at 30% 25%, #2A2A2A 0%, ${C.surface} 55%, #121212 100%)`,
                      }}
                      initial={{
                        borderColor: reduce ? (stage.isEngine ? C.soft : 'var(--border)') : 'var(--border)',
                      }}
                      animate={
                        reduce
                          ? {}
                          : {
                            borderColor: pulse('var(--border)', stage.isEngine ? C.bright : C.soft),
                            scale: [1, 1, 1.12, 1.05, 1, 1],
                            boxShadow: pulse(
                              `inset 0 1px 0 ${W(0.06)}, 0 0 0 ${W(0)}`,
                              `inset 0 1px 0 ${W(0.22)}, 0 0 22px ${W(stage.isEngine ? 0.22 : 0.12)}`
                            ),
                          }
                      }
                      transition={loop}
                    >
                      {/* Bright fill that fades in when active */}
                      {!reduce && (
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at 50% 40%, ${W(0.16)} 0%, ${W(0)} 70%)`,
                          }}
                          animate={{ opacity: pulse(0, 1) }}
                          transition={loop}
                        />
                      )}

                      {/* Icon (stage-specific motion) */}
                      <motion.div
                        className="relative"
                        initial={{ color: reduce ? (stage.isEngine ? C.bright : C.muted) : C.muted }}
                        animate={
                          reduce
                            ? {}
                            : {
                              color: pulse(C.muted, C.bright),
                              filter: pulse('drop-shadow(0 0 0px rgba(245,245,245,0))', 'drop-shadow(0 0 5px rgba(245,245,245,0.55))'),
                              ...(stage.id === 'input'
                                ? { x: [0, 0, -3, 3, 0, 0] }
                                : stage.id === 'analysis'
                                  ? { scale: [1, 1, 1.12, 1, 1, 1], rotate: [0, 0, -8, 8, 0, 0] }
                                  : stage.id === 'mali'
                                    ? { scale: [1, 1, 1.18, 1, 1.18, 1] }
                                    : { scale: [1, 1, 0.7, 1.25, 1, 1] }),
                            }
                        }
                        transition={loop}
                      >
                        <Icon className="w-6 h-6" strokeWidth={1.6} />
                      </motion.div>

                      {/* Scan line (analysis only) */}
                      {!reduce && stage.id === 'analysis' && (
                        <motion.div
                          className="absolute left-2 right-2 h-px"
                          style={{ background: W(0.8), boxShadow: `0 0 6px ${W(0.8)}` }}
                          initial={{ top: '18%', opacity: 0 }}
                          animate={{
                            top: ['18%', '18%', '82%', '18%', '82%', '18%', '18%'],
                            opacity: [0, 0, 1, 1, 1, 0, 0],
                          }}
                          transition={{
                            duration: TOTAL_LOOP,
                            times: [
                              0,
                              nodeStart,
                              nodeStart + NODE_LEN * 0.25,
                              nodeStart + NODE_LEN * 0.5,
                              nodeStart + NODE_LEN * 0.75,
                              nodeEnd,
                              1,
                            ],
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      )}
                    </motion.div>

                    {/* Completion badge on the result node */}
                    {stage.id === 'result' && (
                      <motion.div
                        className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                        style={{ background: C.bright, color: C.surface, border: `2px solid ${C.surface}` }}
                        initial={{ scale: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
                        animate={reduce ? {} : { scale: [0, 0, 0, 1.2, 1, 0], opacity: [0, 0, 1, 1, 1, 0] }}
                        transition={{
                          duration: TOTAL_LOOP,
                          times: [0, nodeStart - 0.02, nodeStart + 0.03, nodeStart + 0.06, nodeEnd + 0.05, Math.min(1, nodeEnd + 0.09)],
                          repeat: Infinity,
                          ease: 'easeOut',
                        }}
                      >
                        <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
                      </motion.div>
                    )}
                  </div>

                  <motion.h3
                    className="text-[13px] font-medium text-center mt-4 tracking-tight"
                    initial={{ color: reduce ? (stage.isEngine ? C.bright : C.soft) : C.muted }}
                    animate={reduce ? {} : { color: pulse(C.muted, C.bright), y: [0, 0, -1, -1, 0, 0] }}
                    transition={loop}
                  >
                    {stage.label}
                  </motion.h3>

                  <motion.p
                    className="text-[11px] text-center leading-relaxed mt-1 max-w-[110px]"
                    initial={{ color: C.muted }}
                    animate={reduce ? {} : { color: pulse(C.muted, C.soft) }}
                    transition={loop}
                  >
                    {stage.subtitle}
                  </motion.p>

                  {/* Risk meter (result only) */}
                  {stage.id === 'result' && (
                    <div className="w-20 h-[3px] rounded-full mt-3 overflow-hidden" style={{ background: W(0.08) }}>
                      <motion.div
                        className="h-full w-full rounded-full origin-left"
                        style={{ background: C.bright, boxShadow: `0 0 6px ${W(0.5)}` }}
                        initial={{ scaleX: reduce ? 0.72 : 0 }}
                        animate={reduce ? {} : { scaleX: [0, 0, 0, 0.72, 0.72, 0] }}
                        transition={{
                          duration: TOTAL_LOOP,
                          times: [0, Math.max(0, nodeStart - 0.04), nodeStart, nodeEnd, Math.min(1, nodeEnd + 0.08), 1],
                          repeat: Infinity,
                          ease: 'easeOut',
                        }}
                      />
                    </div>
                  )}
                </motion.div>

                {/* Connector (aligned to the bigger node's center) */}
                {index < STAGES.length - 1 && (
                  <div className="flex-1 h-[1px] bg-border relative overflow-visible mt-7 mx-2">
                    {!reduce && (
                      <>
                        <motion.div
                          className="absolute inset-y-0 left-0 w-full origin-left"
                          style={{ background: W(0.45) }}
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: [0, 0, 1, 1, 1], opacity: [0, 1, 1, 0, 0] }}
                          transition={{
                            duration: TOTAL_LOOP,
                            times: [0, connStart, connEnd, Math.min(1, connEnd + 0.1), 1],
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                        {[0, 0.014, 0.028].map((delay, i) => (
                          <motion.div
                            key={i}
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-foreground"
                            style={{
                              width: 6 - i * 1.5,
                              height: 6 - i * 1.5,
                              boxShadow: `0 0 ${i === 0 ? 10 : 5}px ${W(i === 0 ? 0.8 : 0.4)}`,
                            }}
                            initial={{ left: '0%', opacity: 0 }}
                            animate={{
                              left: ['0%', '0%', '100%', '100%', '100%'],
                              opacity: [0, 1 - i * 0.3, 1 - i * 0.3, 0, 0],
                              scale: [0.6, 0.6, 1, 0.4, 0.4],
                            }}
                            transition={{
                              duration: TOTAL_LOOP,
                              times: [0, connStart + delay, connEnd + delay * 0.5, Math.min(1, connEnd + delay * 0.5 + 0.01), 1],
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          />
                        ))}
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