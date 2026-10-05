'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction } from '../../types/transaction';
import { TransactionStatusBadge } from '../shared/TransactionStatusBadge';

interface LiveTransactionStackProps {
  transactions: Transaction[];
  maxCards?: number;
  onTransactionClick?: (txn: Transaction) => void;
}

export function LiveTransactionStack({ transactions, maxCards = 7, onTransactionClick }: LiveTransactionStackProps) {
  const [focusedId, setFocusedId] = useState<string | null>(null);

  // The newest transactions are appended to the end of the array.
  // We extract the last `maxCards` items so we always display the latest stream.
  const recent = [...transactions].slice(-maxCards);

  // Find index of focused card, or default to the newest (last)
  let currentIndex = recent.length - 1;
  if (focusedId) {
    const idx = recent.findIndex(t => t.id === focusedId);
    if (idx !== -1) currentIndex = idx;
  }

  // Determine the color based on status or risk level
  const getCardColor = (txn: Transaction) => {
    if (txn.status === 'BLOCKED' || txn.riskLevel === 'CRITICAL') return 'var(--destructive)';
    if (txn.riskLevel === 'HIGH' || txn.status === 'ALERT') return '#f59e0b'; // Amber
    if (txn.status === 'CLEAR') return 'var(--success)';
    return 'var(--primary)';
  };

  return (
    <div className="relative h-[140px] w-full flex items-center justify-center overflow-visible perspective-[1200px] pointer-events-none">
      <AnimatePresence mode="popLayout">
        {recent.map((txn, index) => {
          const distance = index - currentIndex; 
          const cardColor = getCardColor(txn);
          
          let x = 0;
          let rotateY = 0;
          let z = -Math.abs(distance) * 80;
          
          if (distance < 0) {
            rotateY = 25; // face right
            x = distance * 60 - 120; // push left
          } else if (distance > 0) {
            rotateY = -25; // face left
            x = distance * 60 + 120; // push right
          }

          return (
            <motion.div
              key={txn.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ 
                opacity: 1 - Math.abs(distance) * 0.15, 
                x,
                z,
                rotateY,
                scale: distance === 0 ? 1 : 0.95
              }}
              exit={{ opacity: 0, y: 20, scale: 0.8, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                setFocusedId(txn.id);
                onTransactionClick?.(txn);
              }}
              className="absolute shadow-2xl rounded-xl bg-card p-4 w-[280px] h-[120px] flex flex-col justify-between will-change-transform overflow-hidden pointer-events-auto cursor-pointer hover:opacity-90"
              style={{
                zIndex: 100 - Math.abs(distance),
                border: '1px solid var(--border)',
                borderTop: `4px solid ${cardColor}`,
                WebkitBoxReflect: 'below 2px linear-gradient(transparent 70%, rgba(255,255,255,0.15))'
              }}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="font-semibold text-foreground truncate">{txn.merchant}</div>
                <div className="font-mono font-bold text-foreground">₹{txn.amount.toLocaleString('en-IN')}</div>
              </div>
              <div className="text-xs text-muted-foreground truncate mt-1">
                {txn.paymentMethod} • {txn.location}
              </div>

              <div className="flex justify-between items-end mt-auto pt-2">
                <TransactionStatusBadge status={txn.status} />
                <div className="text-[11px] font-mono text-muted-foreground opacity-70">
                  {new Date(txn.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
