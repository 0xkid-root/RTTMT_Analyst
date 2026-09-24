import { useQuery } from '@tanstack/react-query';
import { Transaction } from '../types/transaction';
import { mockHistoricalTransactions } from '../data/mockTransactions';
import { FilterState } from '../components/explorer/TransactionExplorerFilters';

// Simulate API call with filters
const fetchExplorerTransactions = async (filters: FilterState): Promise<Transaction[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockHistoricalTransactions.filter(t => {
    // Search term
    if (filters.search) {
      const term = filters.search.toLowerCase();
      if (!t.id.toLowerCase().includes(term) && 
          !t.merchant.toLowerCase().includes(term) && 
          !t.accountReference.toLowerCase().includes(term)) {
        return false;
      }
    }

    // Date Range
    if (filters.startDate && new Date(t.timestamp) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(t.timestamp) > new Date(filters.endDate + 'T23:59:59')) return false;

    // Amount
    if (filters.minAmount && t.amount < parseFloat(filters.minAmount)) return false;
    if (filters.maxAmount && t.amount > parseFloat(filters.maxAmount)) return false;

    // Exact matches
    if (filters.riskLevel && t.riskLevel !== filters.riskLevel) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (filters.paymentMethod && t.paymentMethod !== filters.paymentMethod) return false;
    if (filters.transactionType && t.transactionType !== filters.transactionType) return false;

    return true;
  });
};

export function useTransactionExplorer(filters: FilterState) {
  const { data: transactions = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['explorer-transactions', filters],
    queryFn: () => fetchExplorerTransactions(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    transactions,
    isLoading,
    isError,
    error,
    refetch
  };
}
