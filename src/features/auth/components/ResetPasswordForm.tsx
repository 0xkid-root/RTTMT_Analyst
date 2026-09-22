'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/auth-schemas';
import { PasswordInput } from './PasswordInput';
import { PasswordStrengthIndicator } from './PasswordStrength';
import { Loader2, ArrowLeft } from 'lucide-react';

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log('Password reset successful', data);
    setIsLoading(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Password updated</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
        </div>
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Create a new password</h2>
        <p className="text-sm text-muted-foreground">
          Choose a strong password for your RTMT account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              New password
            </label>
            <PasswordInput
              id="password"
              placeholder="Enter your new password"
              error={!!errors.password}
              {...register('password')}
            />
            {errors.password && <p className="text-[0.8rem] font-medium text-danger">{errors.password.message}</p>}
          </div>

          <PasswordStrengthIndicator password={passwordValue} />

          <div className="space-y-2 pt-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Confirm new password
            </label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your new password"
              error={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="text-[0.8rem] font-medium text-danger">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating password...
            </>
          ) : (
            'Update password'
          )}
        </button>
      </form>
    </div>
  );
}
