import { useState, useEffect } from 'react';
import { RiskFactor } from '../types/risk-factor';
import { mockRiskFactors } from '../data/mockRiskFactors';

export interface RiskFactorFilterState {
  search: string;
  category: string;
  riskLevel: string;
}

export function useRiskFactors(filters: RiskFactorFilterState) {
  const [data, setData] = useState<RiskFactor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchRiskFactors = async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filtered = [...mockRiskFactors];
      
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(rf => 
          rf.transactionId.toLowerCase().includes(query) ||
          rf.name.toLowerCase().includes(query)
        );
      }
      
      if (filters.category) {
        filtered = filtered.filter(rf => rf.category === filters.category);
      }
      
      if (filters.riskLevel) {
        filtered = filtered.filter(rf => rf.severity === filters.riskLevel.toLowerCase());
      }
      
      setData(filtered);
    } catch (err) {
      console.error('Failed to fetch risk factors:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskFactors();
  }, [filters]);

  return {
    data,
    isLoading,
    isError,
    refetch: fetchRiskFactors
  };
}
