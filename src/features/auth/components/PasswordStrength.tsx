'use client';

import { useMemo } from 'react';
import { calculatePasswordStrength, checkPasswordRequirements } from '../utils/password-strength';
import { Check, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PasswordStrengthProps {
  password?: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password = '', className }: PasswordStrengthProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);
  const reqs = useMemo(() => checkPasswordRequirements(password), [password]);

  const strengthColor = {
    EMPTY: 'bg-muted',
    WEAK: 'bg-danger',
    MEDIUM: 'bg-warning',
    STRONG: 'bg-success',
  }[strength];

  const strengthLabel = {
    EMPTY: '',
    WEAK: 'Weak',
    MEDIUM: 'Medium',
    STRONG: 'Strong',
  }[strength];

  const requirementsList = [
    { label: 'At least 8 characters', met: reqs.length },
    { label: 'One uppercase letter', met: reqs.uppercase },
    { label: 'One lowercase letter', met: reqs.lowercase },
    { label: 'One number', met: reqs.number },
    { label: 'One special character', met: reqs.special },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-muted-foreground">Password strength</span>
          <span
            className={cn(
              strength === 'WEAK' && 'text-danger',
              strength === 'MEDIUM' && 'text-warning',
              strength === 'STRONG' && 'text-success'
            )}
          >
            {strengthLabel}
          </span>
        </div>
        <div className="flex gap-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300",
              strengthColor,
              strength === 'EMPTY' ? 'w-0' : strength === 'WEAK' ? 'w-1/3' : strength === 'MEDIUM' ? 'w-2/3' : 'w-full'
            )}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        {requirementsList.map((req, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors",
              req.met ? "text-success" : "text-muted-foreground"
            )}
          >
            {req.met ? (
              <Check className="h-3 w-3 shrink-0" />
            ) : (
              <X className="h-3 w-3 shrink-0 opacity-50" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
