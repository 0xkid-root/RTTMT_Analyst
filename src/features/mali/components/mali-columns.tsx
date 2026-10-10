import { createColumnHelper } from '@tanstack/react-table';
import { MaliAnalysisResult } from '../types/mali';
import { RiskBadge } from '../../monitor/components/shared/RiskBadge';

const columnHelper = createColumnHelper<MaliAnalysisResult>();

export const maliColumns = [
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
  columnHelper.accessor('amount', {
    header: () => <div className="text-right">Amount</div>,
    cell: (info) => <div className="font-mono font-medium text-right whitespace-nowrap">₹{info.getValue().toLocaleString('en-IN')}</div>
  }),
  columnHelper.accessor('paymentMethod', {
    header: 'Payment Method',
    cell: (info) => <span className="text-muted-foreground whitespace-nowrap">{info.getValue()}</span>
  }),
  columnHelper.accessor('maliScore', {
    header: () => <div className="text-center">MALi Score</div>,
    cell: (info) => {
      const score = info.getValue();
      return (
        <div className="text-center whitespace-nowrap flex items-center justify-center">
          <span className={`font-mono font-bold text-lg ${score >= 80 ? 'text-destructive' : score >= 60 ? 'text-orange-500' : 'text-emerald-500'}`}>
            {score}
          </span>
        </div>
      );
    }
  }),
  columnHelper.accessor('riskLevel', {
    header: () => <div className="text-center">Risk Level</div>,
    cell: (info) => <div className="flex justify-center whitespace-nowrap"><RiskBadge level={info.getValue()} /></div>
  }),
];
