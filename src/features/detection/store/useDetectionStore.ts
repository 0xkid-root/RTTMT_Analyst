import { create } from 'zustand';
import {
  DetectionRule,
  DetectionSignal,
  DetectionPattern,
  SimulationPreset,
  RuleSimulationInput,
  RuleSimulationResult,
} from '../types/detection';
import {
  mockDetectionRules,
  mockDetectionSignals,
  mockDetectionPatterns,
  mockSimulationPresets,
  evaluateRuleSimulation,
} from '../data/mockDetectionData';

interface DetectionStoreState {
  // Data
  signals: DetectionSignal[];
  rules: DetectionRule[];
  patterns: DetectionPattern[];
  simulationPresets: SimulationPreset[];

  // Selected for drawers & modals
  selectedSignal: DetectionSignal | null;
  selectedRule: DetectionRule | null;
  isSignalDrawerOpen: boolean;
  isRuleDrawerOpen: boolean;

  // Rule Form modal (Create / Edit)
  isRuleFormModalOpen: boolean;
  ruleFormMode: 'create' | 'edit';
  ruleToEdit: DetectionRule | null;

  // Rule Delete Confirm modal
  ruleToDelete: DetectionRule | null;
  isDeleteConfirmOpen: boolean;

  // Simulation state
  isSimulationModalOpen: boolean;
  activeSimulationPreset: SimulationPreset | null;
  simulationTargetRuleId: string | null;
  lastSimulationResult: RuleSimulationResult | null;

  // Feedback Notification / Toast
  toastMessage: { text: string; type: 'success' | 'info' | 'warning' } | null;

  // Signal Arrival Tracking
  newlyArrivedSignalId: string | null;

  // Actions
  setSelectedSignal: (signal: DetectionSignal | null) => void;
  setSelectedRule: (rule: DetectionRule | null) => void;
  closeSignalDrawer: () => void;
  closeRuleDrawer: () => void;

  toggleRuleEnabled: (ruleId: string) => void;
  openCreateRuleModal: () => void;
  openEditRuleModal: (rule: DetectionRule) => void;
  closeRuleModal: () => void;

  saveRule: (rule: Partial<DetectionRule> & { name: string; category: DetectionRule['category']; severity: DetectionRule['severity'] }) => void;
  promptDeleteRule: (rule: DetectionRule) => void;
  confirmDeleteRule: () => void;
  cancelDeleteRule: () => void;

  openSimulationModal: (ruleId?: string, presetId?: string) => void;
  closeSimulationModal: () => void;
  setActiveSimulationPreset: (preset: SimulationPreset | null) => void;
  setSimulationTargetRuleId: (ruleId: string) => void;
  runSimulation: (ruleId: string, input: RuleSimulationInput) => RuleSimulationResult;
  emitMockSignal: (customSignal?: Partial<DetectionSignal>) => DetectionSignal;

  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  clearToast: () => void;
}

export const useDetectionStore = create<DetectionStoreState>((set, get) => ({
  signals: mockDetectionSignals,
  rules: mockDetectionRules,
  patterns: mockDetectionPatterns,
  simulationPresets: mockSimulationPresets,

  selectedSignal: null,
  selectedRule: null,
  isSignalDrawerOpen: false,
  isRuleDrawerOpen: false,

  isRuleFormModalOpen: false,
  ruleFormMode: 'create',
  ruleToEdit: null,

  ruleToDelete: null,
  isDeleteConfirmOpen: false,

  isSimulationModalOpen: false,
  activeSimulationPreset: mockSimulationPresets[0],
  simulationTargetRuleId: mockDetectionRules[0]?.id || null,
  lastSimulationResult: null,

  newlyArrivedSignalId: null,
  toastMessage: null,

  setSelectedSignal: (signal) => set({
    selectedSignal: signal,
    isSignalDrawerOpen: !!signal,
  }),

  setSelectedRule: (rule) => set({
    selectedRule: rule,
    isRuleDrawerOpen: !!rule,
  }),

  closeSignalDrawer: () => set({
    selectedSignal: null,
    isSignalDrawerOpen: false,
  }),

  closeRuleDrawer: () => set({
    selectedRule: null,
    isRuleDrawerOpen: false,
  }),

  toggleRuleEnabled: (ruleId) => {
    const rules = get().rules;
    const rule = rules.find((r) => r.id === ruleId);
    if (!rule) return;

    const nextState = !rule.enabled;
    const updatedRules = rules.map((r) =>
      r.id === ruleId ? { ...r, enabled: nextState, lastUpdated: new Date().toISOString() } : r
    );

    set({
      rules: updatedRules,
      selectedRule: get().selectedRule?.id === ruleId
        ? { ...get().selectedRule!, enabled: nextState, lastUpdated: new Date().toISOString() }
        : get().selectedRule,
    });

    get().showToast(
      `Rule ${rule.id} (${rule.name}) is now ${nextState ? 'ENABLED' : 'DISABLED'}.`,
      nextState ? 'success' : 'warning'
    );
  },

  openCreateRuleModal: () => set({
    isRuleFormModalOpen: true,
    ruleFormMode: 'create',
    ruleToEdit: null,
  }),

  openEditRuleModal: (rule) => set({
    isRuleFormModalOpen: true,
    ruleFormMode: 'edit',
    ruleToEdit: rule,
  }),

  closeRuleModal: () => set({
    isRuleFormModalOpen: false,
    ruleToEdit: null,
  }),

  saveRule: (formData) => {
    const { rules, ruleFormMode, ruleToEdit } = get();

    if (ruleFormMode === 'edit' && ruleToEdit) {
      // Update existing
      const updatedRules = rules.map((r) => {
        if (r.id === ruleToEdit.id) {
          const versionParts = r.version.replace('v', '').split('.').map(Number);
          const nextVersion = `v${versionParts[0]}.${versionParts[1] + 1}.0`;

          const updated: DetectionRule = {
            ...r,
            ...formData,
            version: nextVersion,
            lastUpdated: new Date().toISOString(),
            updatedBy: 'Current Analyst (Saved via Web UI)',
            history: [
              {
                version: nextVersion,
                date: new Date().toISOString().split('T')[0],
                author: 'Current Analyst',
                changes: 'Configuration updated via Analyst Rules console.',
              },
              ...r.history,
            ],
          };
          return updated;
        }
        return r;
      });

      const updatedRule = updatedRules.find((r) => r.id === ruleToEdit.id) || null;

      set({
        rules: updatedRules,
        selectedRule: updatedRule,
        isRuleFormModalOpen: false,
        ruleToEdit: null,
      });

      get().showToast(`Rule ${ruleToEdit.id} successfully updated to version ${updatedRule?.version}.`, 'success');
    } else {
      // Create new
      const nextId = `RUL-CUST-${Math.floor(100 + Math.random() * 900)}`;
      const newRule: DetectionRule = {
        id: nextId,
        name: formData.name,
        category: formData.category,
        description: formData.description || 'Custom detection rule configured by analyst.',
        severity: formData.severity,
        enabled: formData.enabled ?? true,
        version: 'v1.0.0',
        lastUpdated: new Date().toISOString(),
        updatedBy: 'Current Analyst (Created via Web UI)',
        conditions: formData.conditions || [
          {
            id: `c-${Date.now()}`,
            field: 'tx.amount',
            label: 'Transaction Amount',
            operator: '>',
            value: 20000,
            unit: 'INR',
            description: 'Custom threshold.',
          },
        ],
        logic: formData.logic || 'AND',
        actionSignalType: formData.actionSignalType || 'HIGH_VELOCITY',
        stats: {
          hits24h: 0,
          hits7d: 0,
          falsePositiveRate: 0.0,
          avgLatencyMs: 1.5,
        },
        history: [
          {
            version: 'v1.0.0',
            date: new Date().toISOString().split('T')[0],
            author: 'Current Analyst',
            changes: 'Initial rule creation in detection engine.',
          },
        ],
        exampleEvidence: ['No events generated yet for newly initialized rule.'],
      };

      set({
        rules: [newRule, ...rules],
        selectedRule: newRule,
        isRuleFormModalOpen: false,
        ruleToEdit: null,
      });

      get().showToast(`New detection rule ${newRule.id} created successfully!`, 'success');
    }
  },

  promptDeleteRule: (rule) => set({
    ruleToDelete: rule,
    isDeleteConfirmOpen: true,
  }),

  cancelDeleteRule: () => set({
    ruleToDelete: null,
    isDeleteConfirmOpen: false,
  }),

  confirmDeleteRule: () => {
    const { ruleToDelete, rules, selectedRule } = get();
    if (!ruleToDelete) return;

    set({
      rules: rules.filter((r) => r.id !== ruleToDelete.id),
      selectedRule: selectedRule?.id === ruleToDelete.id ? null : selectedRule,
      isRuleDrawerOpen: selectedRule?.id === ruleToDelete.id ? false : get().isRuleDrawerOpen,
      ruleToDelete: null,
      isDeleteConfirmOpen: false,
    });

    get().showToast(`Rule ${ruleToDelete.id} removed from detection registry.`, 'info');
  },

  openSimulationModal: (ruleId, presetId) => {
    const { rules, simulationPresets } = get();
    const targetRule = ruleId ? rules.find((r) => r.id === ruleId) : rules[0];
    const targetPreset = presetId ? simulationPresets.find((p) => p.id === presetId) : simulationPresets[0];

    set({
      isSimulationModalOpen: true,
      simulationTargetRuleId: targetRule?.id || rules[0]?.id || null,
      activeSimulationPreset: targetPreset || null,
      lastSimulationResult: null,
    });
  },

  closeSimulationModal: () => set({
    isSimulationModalOpen: false,
    lastSimulationResult: null,
  }),

  setActiveSimulationPreset: (preset) => {
    set({
      activeSimulationPreset: preset,
      simulationTargetRuleId: preset ? preset.targetRuleId : get().simulationTargetRuleId,
      lastSimulationResult: null,
    });
  },

  setSimulationTargetRuleId: (ruleId) => set({
    simulationTargetRuleId: ruleId,
    lastSimulationResult: null,
  }),

  runSimulation: (ruleId, input) => {
    const rule = get().rules.find((r) => r.id === ruleId);
    if (!rule) {
      throw new Error(`Rule ${ruleId} not found`);
    }

    const result = evaluateRuleSimulation(rule, input);
    set({ lastSimulationResult: result });
    return result;
  },

  emitMockSignal: (customSignal) => {
    const nextNum = Math.floor(1000 + Math.random() * 9000);
    const newId = customSignal?.id || `SIG-SIM-${nextNum}`;
    const targetRule = get().rules[Math.floor(Math.random() * get().rules.length)] || mockDetectionRules[0];

    const signal: DetectionSignal = {
      id: newId,
      transactionId: customSignal?.transactionId || `TXN-INB-${Math.floor(100000 + Math.random() * 900000)}`,
      ruleId: customSignal?.ruleId || targetRule.id,
      ruleName: customSignal?.ruleName || targetRule.name,
      signalType: customSignal?.signalType || targetRule.actionSignalType,
      severity: customSignal?.severity || targetRule.severity,
      timestamp: new Date().toISOString(),
      evidence: customSignal?.evidence || {
        summary: `Mock signal generated by detection engine simulation for rule ${targetRule.id}.`,
        metrics: [
          {
            key: 'simulation.score',
            label: 'Risk Anomaly Score',
            value: 88,
            baseline: 40,
          },
        ],
        details: {
          simulated: true,
          channel: 'UPI',
        },
        triggerConditionsPassed: [`Rule ${targetRule.id} condition match against simulated test vector.`],
      },
      status: 'ACTIVE',
      relatedEntity: customSignal?.relatedEntity || {
        id: `USR-INB-${nextNum}`,
        type: 'ACCOUNT',
        name: `Simulated Account #${nextNum}`,
      },
      transactionSnapshot: customSignal?.transactionSnapshot || {
        id: `TXN-INB-${nextNum}`,
        amount: 28500,
        currency: 'INR',
        merchant: 'Simulated Merchant',
        merchantId: 'M-SIM-99',
        paymentMethod: 'UPI',
        transactionType: 'PAYMENT',
        location: 'Bengaluru',
        status: 'ALERT',
        ipAddress: '198.51.100.42 (Simulated)',
        deviceId: 'DEV-SIMULATED-INB',
        accountReference: `USR-INB-${nextNum}`,
        timestamp: new Date().toISOString(),
      },
    };

    set((state) => ({
      signals: [signal, ...state.signals],
      newlyArrivedSignalId: signal.id,
    }));

    get().showToast(`Mock Signal ${signal.id} emitted to Detection Events!`, 'success');

    setTimeout(() => {
      set((state) => (state.newlyArrivedSignalId === signal.id ? { newlyArrivedSignalId: null } : {}));
    }, 4500);

    return signal;
  },

  showToast: (text, type = 'info') => {
    set({ toastMessage: { text, type } });
    setTimeout(() => {
      set((state) => (state.toastMessage?.text === text ? { toastMessage: null } : {}));
    }, 4000);
  },

  clearToast: () => set({ toastMessage: null }),
}));
