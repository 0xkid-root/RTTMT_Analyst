import { useQuery } from '@tanstack/react-query';
import { MaliAnalysisResult } from '../types/mali';
import { mockMaliTransactions } from '../data/mockMaliTransactions';

export interface MaliFilterState {
  search: string;
  riskLevel: string;
  startDate: string;
  endDate: string;
}

const fetchMaliTransactions = async (filters: MaliFilterState): Promise<MaliAnalysisResult[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return mockMaliTransactions.filter(t => {
    if (filters.search && !t.id.toLowerCase().includes(filters.search.toLowerCase()) && !t.merchant.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.riskLevel && t.riskLevel !== filters.riskLevel) {
      return false;
    }
    if (filters.startDate && new Date(t.timestamp) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(t.timestamp) > new Date(filters.endDate)) {
      return false;
    }
    return true;
  });
};

export function useMaliAnalysis(filters: MaliFilterState) {
  return useQuery({
    queryKey: ['mali-transactions', filters],
    queryFn: () => fetchMaliTransactions(filters),
  });
}
