'use client';

import { useState, useEffect } from 'react';
import { useDetectionStore } from '../../store/useDetectionStore';
import {
  RuleCategory,
  SignalSeverity,
  SignalType,
  ComparisonOperator,
  DetectionCondition,
} from '../../types/detection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Trash2, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const CATEGORIES: RuleCategory[] = [
  'VELOCITY',
  'AMOUNT_ANOMALY',
  'DEVICE_INTELLIGENCE',
  'GEOLOCATION',
  'NETWORK_REPUTATION',
  'BEHAVIORAL',
];

const SEVERITIES: SignalSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const SIGNAL_TYPES: SignalType[] = [
  'HIGH_VELOCITY',
  'UNUSUAL_AMOUNT',
  'IMPOSSIBLE_TRAVEL',
  'IP_RISK',
  'NEW_DEVICE',
  'MERCHANT_RISK',
  'GEO_MISMATCH',
  'OFF_HOURS_ACTIVITY',
];

const OPERATORS: ComparisonOperator[] = ['>', '>=', '<', '<=', '==', '!='];

const FIELD_OPTIONS = [
  { field: 'tx.amount', label: 'Transaction Amount (INR)', defaultUnit: 'INR', defaultOp: '>' as const },
  { field: 'tx.velocity_10m', label: 'Transactions in 10m', defaultUnit: 'txns', defaultOp: '>' as const },
  { field: 'tx.velocity_1h', label: 'Transactions in 1h', defaultUnit: 'txns', defaultOp: '>' as const },
  { field: 'tx.distance_km', label: 'Distance from Prior (km)', defaultUnit: 'km', defaultOp: '>' as const },
  { field: 'tx.hours_since_last_seen', label: 'Hours Since Last Active', defaultUnit: 'hours', defaultOp: '<' as const },
  { field: 'tx.ip_risk_score', label: 'IP Risk Threat Score (0-100)', defaultUnit: '/100', defaultOp: '>=' as const },
  { field: 'tx.is_new_device', label: 'Is Unregistered Device (Boolean)', defaultUnit: '', defaultOp: '==' as const },
];

export function RuleFormModal() {
  const { isRuleFormModalOpen, ruleFormMode, ruleToEdit, closeRuleModal, saveRule } = useDetectionStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<RuleCategory>('VELOCITY');
  const [severity, setSeverity] = useState<SignalSeverity>('HIGH');
  const [actionSignalType, setActionSignalType] = useState<SignalType>('HIGH_VELOCITY');
  const [logic, setLogic] = useState<'AND' | 'OR'>('AND');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [conditions, setConditions] = useState<DetectionCondition[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (ruleFormMode === 'edit' && ruleToEdit) {
      setName(ruleToEdit.name);
      setCategory(ruleToEdit.category);
      setSeverity(ruleToEdit.severity);
      setActionSignalType(ruleToEdit.actionSignalType);
      setLogic(ruleToEdit.logic);
      setDescription(ruleToEdit.description);
      setEnabled(ruleToEdit.enabled);
      setConditions(JSON.parse(JSON.stringify(ruleToEdit.conditions)));
    } else {
      setName('');
      setCategory('VELOCITY');
      setSeverity('HIGH');
      setActionSignalType('HIGH_VELOCITY');
      setLogic('AND');
      setDescription('');
      setEnabled(true);
      setConditions([
        {
          id: `c-${Date.now()}`,
          field: 'tx.velocity_10m',
          label: 'Transactions in 10m',
          operator: '>',
          value: 4,
          unit: 'txns',
          description: 'Velocity counter threshold',
        },
      ]);
    }
    setError(null);
    setShowConfirm(false);
  }, [isRuleFormModalOpen, ruleFormMode, ruleToEdit]);

  if (!isRuleFormModalOpen) return null;

  const handleAddCondition = () => {
    const defaultField = FIELD_OPTIONS[0];
    setConditions([
      ...conditions,
      {
        id: `c-${Date.now()}-${Math.random()}`,
        field: defaultField.field,
        label: defaultField.label,
        operator: defaultField.defaultOp,
        value: 10000,
        unit: defaultField.defaultUnit,
        description: '',
      },
    ]);
  };

  const handleRemoveCondition = (id: string) => {
    if (conditions.length <= 1) {
      setError('A rule must have at least one detection condition.');
      return;
    }
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const handleFieldChange = (id: string, fieldName: string) => {
    const selectedField = FIELD_OPTIONS.find((f) => f.field === fieldName) || FIELD_OPTIONS[0];
    setConditions(
      conditions.map((c) => {
        if (c.id === id) {
          const isBool = fieldName === 'tx.is_new_device';
          return {
            ...c,
            field: selectedField.field,
            label: selectedField.label,
            operator: selectedField.defaultOp,
            unit: selectedField.defaultUnit,
            value: isBool ? true : 1000,
          };
        }
        return c;
      })
    );
  };

  const handleConditionValueChange = (id: string, val: string) => {
    setConditions(
      conditions.map((c) => {
        if (c.id === id) {
          if (c.field === 'tx.is_new_device') {
            return { ...c, value: val === 'true' };
          }
          return { ...c, value: isNaN(Number(val)) ? val : Number(val) };
        }
        return c;
      })
    );
  };

  const handleConditionOperatorChange = (id: string, op: ComparisonOperator) => {
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, operator: op } : c))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Rule name cannot be empty.');
      return;
    }
    if (conditions.length === 0) {
      setError('At least one condition is required.');
      return;
    }
    setError(null);
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    saveRule({
      name,
      category,
      severity,
      actionSignalType,
      logic,
      description,
      enabled,
      conditions,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              {ruleFormMode === 'create' ? 'Create Detection Rule' : `Edit Rule: ${ruleToEdit?.id}`}
            </h2>
          </div>
          <button
            onClick={closeRuleModal}
            className="text-muted-foreground hover:text-foreground p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Rule Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Extreme Velocity Spikes on UPI Rails"
                className="bg-background/50 border-input"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RuleCategory)}
                  className="w-full h-9 rounded-md border border-input bg-background/50 px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring [&>option]:bg-card [&>option]:text-foreground"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as SignalSeverity)}
                  className="w-full h-9 rounded-md border border-input bg-background/50 px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring [&>option]:bg-card [&>option]:text-foreground"
                >
                  {SEVERITIES.map((sev) => (
                    <option key={sev} value={sev}>
                      {sev}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Emitted Signal Type
                </label>
                <select
                  value={actionSignalType}
                  onChange={(e) => setActionSignalType(e.target.value as SignalType)}
                  className="w-full h-9 rounded-md border border-input bg-background/50 px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring [&>option]:bg-card [&>option]:text-foreground"
                >
                  {SIGNAL_TYPES.map((st) => (
                    <option key={st} value={st}>
                      {st.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Description & Purpose
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the fraud detection rationale, telemetry baseline, and expected signal behavior..."
                rows={2}
                className="w-full rounded-md border border-input bg-background/50 p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Rule Active Status
                </span>
                <span className="text-[11px] text-muted-foreground">
                  When enabled, this rule evaluates incoming transactions in real time.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
                  enabled
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-muted/40 border-border text-muted-foreground'
                }`}
              >
                {enabled ? 'Active (Enabled)' : 'Inactive (Disabled)'}
              </button>
            </div>
          </div>

          {/* Condition Builder */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Detection Conditions & Thresholds
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  All conditions are evaluated using {logic} logic.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={logic}
                  onChange={(e) => setLogic(e.target.value as 'AND' | 'OR')}
                  className="h-8 rounded-md border border-input bg-background/50 px-2 py-1 text-xs text-foreground focus:outline-none [&>option]:bg-card [&>option]:text-foreground font-mono"
                >
                  <option value="AND">AND (All match)</option>
                  <option value="OR">OR (Any match)</option>
                </select>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCondition}
                  className="h-8 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Condition
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {conditions.map((cond, idx) => (
                <div
                  key={cond.id}
                  className="p-3.5 rounded-lg border border-border bg-card space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground">
                      Condition #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(cond.id)}
                      className="text-muted-foreground hover:text-red-400 p-1"
                      title="Remove condition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    {/* Field select */}
                    <div className="sm:col-span-5">
                      <select
                        value={cond.field}
                        onChange={(e) => handleFieldChange(cond.id, e.target.value)}
                        className="w-full h-8 rounded border border-input bg-background/50 px-2 text-xs text-foreground focus:outline-none [&>option]:bg-card [&>option]:text-foreground"
                      >
                        {FIELD_OPTIONS.map((f) => (
                          <option key={f.field} value={f.field}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Operator */}
                    <div className="sm:col-span-3">
                      <select
                        value={cond.operator}
                        onChange={(e) => handleConditionOperatorChange(cond.id, e.target.value as ComparisonOperator)}
                        className="w-full h-8 rounded border border-input bg-background/50 px-2 text-xs text-foreground focus:outline-none font-mono font-bold [&>option]:bg-card [&>option]:text-foreground"
                      >
                        {OPERATORS.map((op) => (
                          <option key={op} value={op}>
                            {op}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Value */}
                    <div className="sm:col-span-4 flex items-center gap-1.5">
                      {cond.field === 'tx.is_new_device' ? (
                        <select
                          value={String(cond.value)}
                          onChange={(e) => handleConditionValueChange(cond.id, e.target.value)}
                          className="w-full h-8 rounded border border-input bg-background/50 px-2 text-xs text-foreground focus:outline-none [&>option]:bg-card [&>option]:text-foreground"
                        >
                          <option value="true">true (Unrecognized)</option>
                          <option value="false">false (Known)</option>
                        </select>
                      ) : (
                        <Input
                          type="number"
                          value={cond.value as number}
                          onChange={(e) => handleConditionValueChange(cond.id, e.target.value)}
                          className="h-8 text-xs font-mono bg-background/50"
                        />
                      )}
                      {cond.unit && (
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {cond.unit}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={closeRuleModal}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {ruleFormMode === 'create' ? 'Create Rule' : 'Save Changes'}
            </Button>
          </div>
        </form>

        {/* Confirmation Step Sub-Dialog */}
        {showConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-xs">
            <div className="bg-card border border-border rounded-xl p-5 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-foreground">
                  Confirm Rule Configuration
                </h3>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                You are about to save changes to{' '}
                <strong className="text-foreground">{name}</strong> ({category}, {severity}).
                {ruleFormMode === 'edit'
                  ? ' This will increment the rule version and update the active detection threshold in the engine.'
                  : ' This rule will be registered immediately in the detection registry.'}
              </p>

              <div className="p-3 bg-muted/30 rounded-lg text-xs font-mono space-y-1">
                <div>
                  <span className="text-muted-foreground">Conditions count:</span>{' '}
                  <span className="text-foreground font-semibold">{conditions.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Evaluation logic:</span>{' '}
                  <span className="text-primary font-semibold">{logic}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Target finding:</span>{' '}
                  <span className="text-foreground font-semibold">{actionSignalType}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirm(false)}
                >
                  Back to Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmSave}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Confirm & Commit Rule
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
