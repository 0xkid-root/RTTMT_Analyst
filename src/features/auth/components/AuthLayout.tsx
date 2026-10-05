'use client';

import { motion } from 'framer-motion';
import { AuthLogo } from './AuthLogo';
import { AuthSecurityNote } from './AuthSecurityNote';
import { AuthBackground } from './AuthBackground';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background relative overflow-hidden">
      {/* Unified Master Background */}
      <AuthBackground />

      {/* Branding / Security Panel (Left on Desktop, Top on Mobile) */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full md:w-[45%] lg:w-[40%] bg-transparent p-6 md:p-12 flex flex-col justify-between z-10"
      >
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <AuthLogo className="mb-8" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block max-w-sm space-y-4"
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Real Time Transaction Monitoring and Threat Intelligence
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Enterprise-grade financial risk monitoring, fraud detection, and alerting for analysts and security teams.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="hidden md:block relative z-10"
        >
          <AuthSecurityNote />
        </motion.div>
      </motion.div>

      {/* Form Area (Right on Desktop, Bottom on Mobile) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 relative z-10 bg-transparent"
      >
        <div className="w-full max-w-[440px] space-y-8 relative z-10 bg-background/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 shadow-2xl">
          {children}
        </div>
        <div className="mt-8 md:hidden w-full max-w-[440px] relative z-10">
           <AuthSecurityNote />
        </div>
      </motion.div>
    </div>
  );
}
