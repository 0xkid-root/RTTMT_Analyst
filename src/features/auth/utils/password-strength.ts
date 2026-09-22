export type PasswordStrength = 'WEAK' | 'MEDIUM' | 'STRONG' | 'EMPTY';

export interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export function checkPasswordRequirements(password: string): PasswordRequirements {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) return 'EMPTY';
  
  const reqs = checkPasswordRequirements(password);
  const passedCount = Object.values(reqs).filter(Boolean).length;
  
  if (passedCount === 5) return 'STRONG';
  if (passedCount >= 3) return 'MEDIUM';
  return 'WEAK';
}
