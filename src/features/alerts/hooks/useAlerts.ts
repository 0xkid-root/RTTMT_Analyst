import { useQuery } from '@tanstack/react-query';
import { Alert, AlertFilters } from '../types/alert';
import { mockAlerts } from '../data/mockAlerts';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchAlerts = async (filters?: AlertFilters): Promise<Alert[]> => {
  await delay(800); // Simulate network latency

  let filtered = [...mockAlerts];

  if (filters) {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.id.toLowerCase().includes(q) || 
        a.title.toLowerCase().includes(q) || 
        a.merchantName.toLowerCase().includes(q) ||
        a.transactionId?.toLowerCase().includes(q)
      );
    }
    if (filters.severity) {
      filtered = filtered.filter(a => a.severity === filters.severity);
    }
    if (filters.status) {
      filtered = filtered.filter(a => a.status === filters.status);
    }
    if (filters.assignedTo) {
      filtered = filtered.filter(a => a.assignedTo === filters.assignedTo);
    }
    if (filters.slaStatus) {
      filtered = filtered.filter(a => a.slaStatus === filters.slaStatus);
    }
    if (filters.escalated !== undefined) {
      filtered = filtered.filter(a => a.escalated === filters.escalated);
    }
  }

  // Sort by created at descending
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return filtered;
};

export function useAlerts(filters?: AlertFilters) {
  return useQuery({
    queryKey: ['alerts', filters],
    queryFn: () => fetchAlerts(filters),
  });
}
