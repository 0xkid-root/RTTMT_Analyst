import { TransactionStatus } from '../../types/transaction';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Clock, Ban } from 'lucide-react';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  className?: string;
}

export function TransactionStatusBadge({ status, className }: TransactionStatusBadgeProps) {
  const styles = {
    CLEAR: {
      color: 'text-zinc-400 bg-zinc-800/50 border-zinc-700',
      icon: <CheckCircle2 className="w-3 h-3 mr-1" />
    },
    ALERT: {
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      icon: <AlertCircle className="w-3 h-3 mr-1" />
    },
    REVIEW: {
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      icon: <Clock className="w-3 h-3 mr-1" />
    },
    BLOCKED: {
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
      icon: <Ban className="w-3 h-3 mr-1" />
    },
  };

  const { color, icon } = styles[status];

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border",
      color,
      className
    )}>
      {icon}
      {status}
    </span>
  );
}
