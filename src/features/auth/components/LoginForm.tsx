'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginFormData } from '../schemas/auth-schemas';
import { PasswordInput } from './PasswordInput';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 24 
    } 
  }
};

const errorVariants = {
  hidden: { opacity: 0, height: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    height: 'auto', 
    scale: 1,
    transition: { type: 'spring', stiffness: 500, damping: 30 }
  },
  exit: {
    opacity: 0,
    height: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [mockError, setMockError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setMockError(null);
    
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock error state for demonstration
    if (data.email === 'error@example.com') {
      setMockError('Invalid email or password.');
      setIsLoading(false);
      return;
    }

    // Mock success - route to command center
    router.push('/command-center');
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Sign in to access the RTTMT risk monitoring platform.</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AnimatePresence>
          {mockError && (
            <motion.div 
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-3 text-sm rounded-md bg-danger/10 text-danger font-medium border border-danger/20 flex items-center shadow-sm shadow-danger/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-danger mr-2 animate-pulse" />
              {mockError}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${errors.email ? 'border-danger focus-visible:ring-danger focus-visible:shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-input hover:border-border/80 focus-visible:border-white/20 focus-visible:ring-white/10 focus-visible:shadow-[0_0_15px_rgba(255,255,255,0.05)]'}`}
            {...register('email')}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[0.8rem] font-medium text-danger">
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Password
          </label>
          <div className="relative group">
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              error={!!errors.password}
              className={`transition-all duration-200 ${errors.password ? 'focus-visible:shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'group-hover:border-border/80 focus-visible:border-white/20 focus-visible:ring-white/10 focus-visible:shadow-[0_0_15px_rgba(255,255,255,0.05)]'}`}
              {...register('password')}
            />
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[0.8rem] font-medium text-danger">
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              className="h-4 w-4 rounded border-border text-primary focus:ring-1 focus:ring-white/20 bg-background transition-colors focus:border-white/20 checked:bg-white/20"
              {...register('rememberMe')}
            />
            <label
              htmlFor="rememberMe"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-muted-foreground hover:text-white/80 transition-colors"
          >
            Forgot password?
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="group relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-white/90 hover:shadow-[0_4px_14px_rgba(255,255,255,0.1)] h-10 px-4 py-2 w-full mt-4"
          >
            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex items-center justify-center"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
                <span>Authenticating...</span>
              </motion.div>
            ) : (
              <>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Sign in
                  <motion.span 
                    className="inline-block text-black"
                    initial={{ x: 0, opacity: 0 }}
                    whileHover={{ x: 4, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    →
                  </motion.span>
                </span>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}
