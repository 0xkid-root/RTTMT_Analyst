import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Transaction } from '../types/transaction';
import { generateNewLiveTransaction } from '../data/mockTransactions';

// Simulated initial fetch
const fetchInitialTransactions = async (): Promise<Transaction[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  let nextId = 1;
  const initial = Array.from({ length: 20 }, () => {
    return generateNewLiveTransaction(nextId++);
  }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  return initial;
};

export function useLiveTransactions(isPaused: boolean) {
  const queryClient = useQueryClient();
  const nextId = useRef(21); // Start from 21 since initial generates 1-20

  const { data: transactions = [], isLoading, isError, error } = useQuery({
    queryKey: ['live-transactions'],
    queryFn: fetchInitialTransactions,
    staleTime: Infinity, // Manage updates manually
    refetchOnWindowFocus: false,
  });

  // Simulate WebSocket / SSE stream
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const newTxn = generateNewLiveTransaction(nextId.current++);
      
      queryClient.setQueryData<Transaction[]>(['live-transactions'], (oldData) => {
        if (!oldData) return [newTxn];
        // Keep the latest 100 transactions, appending to the bottom
        return [...oldData, newTxn].slice(-100);
      });
      
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, queryClient]);

  return {
    transactions,
    isLoading,
    isError,
    error,
  };
}
