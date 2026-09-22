'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/auth-schemas';
import { Loader2, ArrowLeft } from 'lucide-react';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log('Password reset requested for', data);
    setIsLoading(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Check your email</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If an account exists for this email address, we've sent instructions to reset your password.
          </p>
        </div>
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Forgot your password?</h2>
        <p className="text-sm text-muted-foreground">
          Enter your registered email address and we'll help you reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.email ? 'border-danger focus-visible:ring-danger' : 'border-input'}`}
            {...register('email')}
          />
          {errors.email && <p className="text-[0.8rem] font-medium text-danger">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending link...
            </>
          ) : (
            'Send reset link'
          )}
        </button>

        <div className="pt-4 text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
