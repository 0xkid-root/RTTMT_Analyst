'use client';

import { Transaction } from '../../types/transaction';
import { RiskBadge } from './RiskBadge';
import { TransactionStatusBadge } from './TransactionStatusBadge';
import { X, MapPin, MonitorSmartphone, Globe, CreditCard, Clock, Store, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionDetailsDrawerProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailsDrawer({ transaction, isOpen, onClose }: TransactionDetailsDrawerProps) {
  if (!transaction) return null;

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-sidebar border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold">Transaction Details</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-mono text-muted-foreground">{transaction.id}</span>
              <RiskBadge level={transaction.riskLevel} />
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Amount & Method Summary */}
          <div className="bg-card border border-border rounded-xl p-5 text-center">
            <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-medium">Amount</div>
            <div className="text-3xl font-bold font-mono text-foreground mb-2">
              ₹{transaction.amount.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              {transaction.paymentMethod}
              <span className="text-border">•</span>
              <TransactionStatusBadge status={transaction.status} />
            </div>
          </div>

          <hr className="border-border" />

          {/* Risk Intelligence */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
              <Network className="w-4 h-4" /> Risk Intelligence
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background rounded-lg p-3 border border-border">
                <div className="text-xs text-muted-foreground mb-1">Risk Score</div>
                <div className={`text-xl font-mono font-semibold ${
                  transaction.riskScore >= 85 ? 'text-red-500' : 
                  transaction.riskScore >= 65 ? 'text-orange-500' : 
                  transaction.riskScore >= 40 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {transaction.riskScore}
                </div>
              </div>
              
              <div className="bg-background rounded-lg p-3 border border-border">
                <div className="text-xs text-muted-foreground mb-1">MALi Score</div>
                <div className={`text-xl font-mono font-semibold ${
                  transaction.maliScore >= 80 ? 'text-red-500' : 
                  transaction.maliScore >= 60 ? 'text-orange-500' : 
                  'text-green-500'
                }`}>
                  {transaction.maliScore}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Transaction Details */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Transaction Data
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground flex items-center gap-2"><Store className="w-4 h-4" /> Merchant</span>
                <span className="font-medium text-foreground">{transaction.merchant}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</span>
                <span className="font-medium text-foreground">{transaction.location}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground flex items-center gap-2"><MonitorSmartphone className="w-4 h-4" /> Device</span>
                <span className="font-mono text-muted-foreground">{transaction.deviceId}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground flex items-center gap-2"><Globe className="w-4 h-4" /> IP Address</span>
                <span className="font-mono text-muted-foreground">{transaction.ipAddress}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> Timestamp</span>
                <span className="font-mono text-foreground text-right max-w-[150px] leading-tight">
                  {new Date(transaction.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </span>
              </div>
            </div>
          </div>

          {transaction.detectionRules.length > 0 && (
            <>
              <hr className="border-border" />
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Triggered Rules
                </h3>
                <div className="flex flex-wrap gap-2">
                  {transaction.detectionRules.map((rule, idx) => (
                    <span key={idx} className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded text-xs">
                      {rule}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-card flex flex-col gap-2">
          <Button variant="default" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => alert('Investigation started')}>
            Investigate
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full" onClick={() => alert('Case created')}>
              Create Case
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => alert('Note added')}>
              Add Note
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
