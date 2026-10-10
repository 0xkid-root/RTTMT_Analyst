import { useState, useEffect } from 'react';
import { RiskHistoryRecord } from '../types/risk-history';
import { mockRiskHistory } from '../data/mockRiskHistory';

export interface RiskHistoryFilterState {
  search: string;
  timeRange: string; // '24h', '7d', '30d', '90d', 'all'
  riskLevel: string;
  status: string;
  modelVersion: string;
}

export function useRiskHistory(filters: RiskHistoryFilterState) {
  const [data, setData] = useState<RiskHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let filtered = [...mockRiskHistory];
      
      // Sort by timestamp descending
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(h => 
          h.transactionId.toLowerCase().includes(query) ||
          h.evaluationId.toLowerCase().includes(query)
        );
      }
      
      if (filters.riskLevel) {
        filtered = filtered.filter(h => h.currentRiskLevel === filters.riskLevel);
      }
      
      if (filters.status) {
        filtered = filtered.filter(h => h.evaluationStatus === filters.status);
      }
      
      if (filters.modelVersion) {
        filtered = filtered.filter(h => h.modelVersion === filters.modelVersion);
      }

      if (filters.timeRange && filters.timeRange !== 'all') {
        const now = new Date().getTime();
        let limit = 0;
        switch(filters.timeRange) {
          case '24h': limit = 24 * 60 * 60 * 1000; break;
          case '7d': limit = 7 * 24 * 60 * 60 * 1000; break;
          case '30d': limit = 30 * 24 * 60 * 60 * 1000; break;
          case '90d': limit = 90 * 24 * 60 * 60 * 1000; break;
        }
        if (limit > 0) {
          // Note: In a real app, 'now' is actual current time. 
          // Our mock data uses evaluationTimestamp from mockMaliTransactions, which could be anything.
          // For the sake of the mock working properly regardless of current real time, 
          // we'll filter based on the most recent record's time if 'now' is too far ahead,
          // or just assume we want relative to the latest timestamp in the dataset.
          const latestTime = Math.max(...mockRiskHistory.map(h => new Date(h.timestamp).getTime()));
          filtered = filtered.filter(h => latestTime - new Date(h.timestamp).getTime() <= limit);
        }
      }
      
      setData(filtered);
    } catch (err) {
      console.error('Failed to fetch risk history:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filters]);

  return {
    data,
    isLoading,
    isError,
    refetch: fetchHistory
  };
}
