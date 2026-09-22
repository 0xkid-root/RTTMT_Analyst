import { LockKeyhole } from 'lucide-react';

export function AuthSecurityNote() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-8 p-4 rounded-md bg-muted/30 border border-border/50">
      <LockKeyhole className="h-4 w-4 shrink-0 text-primary" />
      <p>
        Protected RTMT environment. Access is restricted to authorized risk and security personnel.
      </p>
    </div>
  );
}
