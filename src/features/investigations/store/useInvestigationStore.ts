import { create } from 'zustand';
import { Investigation, InvestigationStatus } from '../types/investigation';
import { mockInvestigations } from '../data/mockInvestigations';

interface InvestigationState {
  investigations: Investigation[];
  addInvestigation: (investigation: Investigation) => void;
  updateInvestigationStatus: (id: string, status: InvestigationStatus) => void;
  getInvestigation: (id: string) => Investigation | undefined;
}

export const useInvestigationStore = create<InvestigationState>((set, get) => ({
  investigations: [...mockInvestigations],
  
  addInvestigation: (investigation) => set((state) => ({ 
    investigations: [investigation, ...state.investigations] 
  })),
  
  updateInvestigationStatus: (id, status) => set((state) => ({
    investigations: state.investigations.map(inv => 
      inv.id === id ? { ...inv, status, updatedAt: new Date().toISOString() } : inv
    )
  })),

  getInvestigation: (id) => {
    return get().investigations.find(inv => inv.id === id);
  }
}));
