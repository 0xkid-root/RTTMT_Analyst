import { createColumnHelper } from '@tanstack/react-table';
import { Transaction } from '../../types/transaction';
import { RiskBadge } from './RiskBadge';
import { TransactionStatusBadge } from './TransactionStatusBadge';

const columnHelper = createColumnHelper<Transaction>();

export const explorerColumns = [
  columnHelper.accessor('timestamp', {
    header: 'Date/Time',
    cell: (info) => {
      const date = new Date(info.getValue());
      return (
        <span className="text-muted-foreground whitespace-nowrap">
          {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          <span className="font-mono ml-1">{date.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
        </span>
      );
    }
  }),
  columnHelper.accessor('id', {
    header: 'Transaction ID',
    cell: (info) => <span className="font-medium text-primary whitespace-nowrap">{info.getValue()}</span>
  }),
  columnHelper.accessor('merchant', {
    header: 'Merchant',
    cell: (info) => <span className="whitespace-nowrap">{info.getValue()}</span>
  }),
  columnHelper.accessor('amount', {
    header: () => <div className="text-right">Amount</div>,
    cell: (info) => <div className="font-mono font-medium text-right whitespace-nowrap">₹{info.getValue().toLocaleString('en-IN')}</div>
  }),
  columnHelper.accessor('paymentMethod', {
    header: 'Payment',
    cell: (info) => <span className="text-muted-foreground whitespace-nowrap">{info.getValue()}</span>
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    cell: (info) => <span className="text-muted-foreground whitespace-nowrap">{info.getValue()}</span>
  }),
  columnHelper.accessor('riskScore', {
    header: () => <div className="text-center">Risk Score</div>,
    cell: (info) => {
      const score = info.getValue();
      const riskLevel = info.row.original.riskLevel;
      return (
        <div className="flex flex-col items-center gap-1 whitespace-nowrap">
          <span className={`font-mono font-semibold ${score >= 85 ? 'text-red-500' : score >= 65 ? 'text-orange-500' : 'text-foreground'}`}>
            {score}
          </span>
          <RiskBadge level={riskLevel} className="scale-75 origin-top" />
        </div>
      );
    }
  }),
  columnHelper.accessor('maliScore', {
    header: () => <div className="text-center">MALi Score</div>,
    cell: (info) => {
      const score = info.getValue();
      return (
        <div className="text-center whitespace-nowrap">
          <span className={`font-mono font-semibold ${score >= 80 ? 'text-red-500' : score >= 60 ? 'text-orange-500' : 'text-foreground'}`}>
            {score}
          </span>
        </div>
      );
    }
  }),
  columnHelper.accessor('detectionRules', {
    header: 'Rule',
    cell: (info) => {
      const rules = info.getValue();
      if (rules.length > 0) {
        return (
          <div className="flex flex-col gap-1 whitespace-nowrap">
            <span className="text-xs truncate max-w-[150px]">{rules[0]}</span>
            {rules.length > 1 && (
              <span className="text-[10px] text-muted-foreground">+{rules.length - 1} more</span>
            )}
          </div>
        );
      }
      return <span className="text-muted-foreground whitespace-nowrap">-</span>;
    }
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => <div className="whitespace-nowrap"><TransactionStatusBadge status={info.getValue()} /></div>
  })
];

export const liveColumns = [
  columnHelper.accessor('timestamp', {
    header: 'Time',
    cell: (info) => {
      const date = new Date(info.getValue());
      return (
        <span className="text-muted-foreground font-mono whitespace-nowrap">
          {date.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' })}
        </span>
      );
    }
  }),
  columnHelper.accessor('id', {
    header: 'Transaction ID',
    cell: (info) => <span className="font-medium text-primary whitespace-nowrap">{info.getValue()}</span>
  }),
  columnHelper.accessor('merchant', {
    header: 'Merchant',
    cell: (info) => <span className="whitespace-nowrap">{info.getValue()}</span>
  }),
  columnHelper.accessor('amount', {
    header: () => <div className="text-right">Amount</div>,
    cell: (info) => <div className="font-mono font-medium text-right whitespace-nowrap">₹{info.getValue().toLocaleString('en-IN')}</div>
  }),
  columnHelper.accessor('paymentMethod', {
    header: 'Payment',
    cell: (info) => <span className="text-muted-foreground whitespace-nowrap">{info.getValue()}</span>
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    cell: (info) => <span className="text-muted-foreground whitespace-nowrap">{info.getValue()}</span>
  }),
  columnHelper.accessor('riskLevel', {
    header: () => <div className="text-center">Risk</div>,
    cell: (info) => <div className="text-center whitespace-nowrap"><RiskBadge level={info.getValue()} /></div>
  }),
  columnHelper.accessor('maliScore', {
    header: () => <div className="text-center">MALi</div>,
    cell: (info) => {
      const score = info.getValue();
      return (
        <div className="text-center whitespace-nowrap">
          <span className={`font-mono font-semibold ${score >= 80 ? 'text-red-500' : score >= 60 ? 'text-orange-500' : 'text-foreground'}`}>
            {score}
          </span>
        </div>
      );
    }
  }),
  columnHelper.accessor('detectionRules', {
    header: 'Detection',
    cell: (info) => {
      const rules = info.getValue();
      if (rules.length > 0) {
        return (
          <div className="flex flex-col gap-1 whitespace-nowrap">
            <span className="text-xs truncate max-w-[150px]">{rules[0]}</span>
            {rules.length > 1 && (
              <span className="text-[10px] text-muted-foreground">+{rules.length - 1} more</span>
            )}
          </div>
        );
      }
      return <span className="text-muted-foreground whitespace-nowrap">-</span>;
    }
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => <div className="whitespace-nowrap"><TransactionStatusBadge status={info.getValue()} /></div>
  })
];
