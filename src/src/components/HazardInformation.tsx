/**
 * HazardInformation Component
 *
 * A comprehensive safety management interface for tracking hazards,
 * analyzing risks, and managing mitigations per ARP4761A FHA standards.
 *
 * Features:
 * - CRUD operations for hazards
 * - Risk matrix visualization
 * - Sortable/filterable table view
 * - Hazard detail panel with traceability
 * - Export to CSV (ARP4761A FHA format)
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Filter,
  Download,
  Search,
  ChevronUp,
  ChevronDown,
  X,
  Info,
  Link2,
  FileText,
  Shield,
} from 'lucide-react';

import { sampleHazards, type ExtendedHazard, type MitigationRecord } from '@/data/sampleData';

// Type aliases for safety types
type SeverityLevel = 'Catastrophic' | 'Hazardous' | 'Major' | 'Minor' | 'NoEffect';
type LikelihoodLevel = 'Frequent' | 'Probable' | 'Occasional' | 'Remote' | 'ExtremelyRemote' | 'ExtremelyImprobable';
type HazardStatus = 'Open' | 'Mitigated' | 'Monitoring' | 'Closed';
type DAL = 'A' | 'B' | 'C' | 'D' | 'E';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/components/ui/utils';

// =============================================================================
// Types
// =============================================================================

type SortField = 'id' | 'title' | 'severity' | 'likelihood' | 'dal' | 'status' | 'owner';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  severity: string;
  status: string;
  dal: string;
  owner: string;
  search: string;
}

interface HazardFormData {
  id: string;
  title: string;
  description: string;
  systemFunction: string;
  failureCondition: string;
  severity: SeverityLevel;
  likelihood: LikelihoodLevel;
  dal: DAL;
  phase: string;
  owner: string;
  status: HazardStatus;
}

// =============================================================================
// Constants
// =============================================================================

const SEVERITY_LEVELS: SeverityLevel[] = ['Catastrophic', 'Hazardous', 'Major', 'Minor', 'NoEffect'];
const LIKELIHOOD_LEVELS: LikelihoodLevel[] = [
  'Frequent',
  'Probable',
  'Occasional',
  'Remote',
  'ExtremelyRemote',
  'ExtremelyImprobable',
];
const DAL_LEVELS: DAL[] = ['A', 'B', 'C', 'D', 'E'];
const STATUS_OPTIONS: HazardStatus[] = ['Open', 'Mitigated', 'Monitoring', 'Closed'];
const PHASE_OPTIONS = ['All Phases', 'Preflight', 'Takeoff', 'Climb', 'Cruise', 'Descent', 'Approach', 'Landing', 'Post-flight'];
const PAGE_SIZE_OPTIONS = [10, 25, 50];

const SEVERITY_ORDER: Record<SeverityLevel, number> = {
  Catastrophic: 5,
  Hazardous: 4,
  Major: 3,
  Minor: 2,
  NoEffect: 1,
};

const LIKELIHOOD_ORDER: Record<LikelihoodLevel, number> = {
  Frequent: 6,
  Probable: 5,
  Occasional: 4,
  Remote: 3,
  ExtremelyRemote: 2,
  ExtremelyImprobable: 1,
};

const DAL_ORDER: Record<DAL, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
};

// =============================================================================
// Helper Functions
// =============================================================================

function getSeverityBadgeVariant(severity: SeverityLevel | string): 'destructive' | 'warning' | 'info' | 'default' | 'secondary' {
  switch (severity) {
    case 'Catastrophic': return 'destructive';
    case 'Hazardous': return 'warning';
    case 'Major': return 'warning';
    case 'Minor': return 'info';
    case 'NoEffect': return 'secondary';
    default: return 'secondary';
  }
}

function getStatusBadgeVariant(status: HazardStatus | string): 'destructive' | 'success' | 'default' | 'secondary' {
  switch (status) {
    case 'Open': return 'destructive';
    case 'Mitigated': return 'success';
    case 'Monitoring': return 'default';
    case 'Closed': return 'secondary';
    default: return 'secondary';
  }
}

function getDALBadgeVariant(dal: DAL | string): 'destructive' | 'warning' | 'info' | 'success' | 'secondary' {
  switch (dal) {
    case 'A': return 'destructive';
    case 'B': return 'warning';
    case 'C': return 'warning';
    case 'D': return 'success';
    case 'E': return 'secondary';
    default: return 'secondary';
  }
}

function getRiskLevel(severity: SeverityLevel, likelihood: LikelihoodLevel): 'high' | 'serious' | 'medium' | 'low' {
  const sevIndex = SEVERITY_ORDER[severity];
  const likIndex = LIKELIHOOD_ORDER[likelihood];

  if (
    (sevIndex >= 5 && likIndex >= 3) ||
    (sevIndex >= 4 && likIndex >= 4)
  ) {
    return 'high';
  }

  if (
    (sevIndex >= 5 && likIndex >= 2) ||
    (sevIndex >= 4 && likIndex >= 3) ||
    (sevIndex >= 3 && likIndex >= 4)
  ) {
    return 'serious';
  }

  if (
    (sevIndex >= 3 && likIndex >= 2) ||
    (sevIndex >= 2 && likIndex >= 4)
  ) {
    return 'medium';
  }

  return 'low';
}

function getRiskCellStyle(riskLevel: 'high' | 'serious' | 'medium' | 'low'): string {
  switch (riskLevel) {
    case 'high':
      return 'bg-critical-red/20 hover:bg-critical-red/30 text-critical-red border-critical-red/30';
    case 'serious':
      return 'bg-warning-amber/20 hover:bg-warning-amber/30 text-warning-amber border-warning-amber/30';
    case 'medium':
      return 'bg-warning-amber/10 hover:bg-warning-amber/15 text-warning-amber/80 border-warning-amber/20';
    case 'low':
      return 'bg-tactical-green/15 hover:bg-tactical-green/25 text-tactical-green border-tactical-green/30';
  }
}

function generateHazardId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `HAZ-${timestamp.slice(-3)}${random}`;
}

function formatLikelihood(likelihood: LikelihoodLevel): string {
  switch (likelihood) {
    case 'ExtremelyImprobable':
      return 'Ext. Improbable';
    case 'ExtremelyRemote':
      return 'Ext. Remote';
    default:
      return likelihood;
  }
}

// =============================================================================
// Sub-components
// =============================================================================

interface SummaryCardsProps {
  hazards: ExtendedHazard[];
}

function SummaryCards({ hazards }: SummaryCardsProps) {
  const dalCounts = useMemo(() => {
    return {
      A: hazards.filter((h) => h.dal === 'A').length,
      B: hazards.filter((h) => h.dal === 'B').length,
      C: hazards.filter((h) => h.dal === 'C').length,
      DE: hazards.filter((h) => h.dal === 'D' || h.dal === 'E').length,
    };
  }, [hazards]);

  const statusCounts = useMemo(() => {
    return {
      open: hazards.filter((h) => h.status === 'Open').length,
      mitigated: hazards.filter((h) => h.status === 'Mitigated').length,
      monitoring: hazards.filter((h) => h.status === 'Monitoring').length,
    };
  }, [hazards]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
      <Card className="border-critical-red/20">
        <CardContent className="p-4">
          <div className="data-label" style={{ color: 'var(--critical-red)' }}>DAL A (Critical)</div>
          <div className="data-value-large mt-1" style={{ color: 'var(--critical-red)' }}>{dalCounts.A}</div>
        </CardContent>
      </Card>
      <Card className="border-warning-amber/20">
        <CardContent className="p-4">
          <div className="data-label" style={{ color: 'var(--warning-amber)' }}>DAL B (Hazardous)</div>
          <div className="data-value-large mt-1" style={{ color: 'var(--warning-amber)' }}>{dalCounts.B}</div>
        </CardContent>
      </Card>
      <Card className="border-warning-amber/15">
        <CardContent className="p-4">
          <div className="data-label" style={{ color: 'var(--warning-amber)' }}>DAL C (Major)</div>
          <div className="data-value-large mt-1" style={{ color: 'var(--warning-amber)' }}>{dalCounts.C}</div>
        </CardContent>
      </Card>
      <Card className="border-tactical-green/20">
        <CardContent className="p-4">
          <div className="data-label" style={{ color: 'var(--tactical-green)' }}>DAL D/E (Low)</div>
          <div className="data-value-large mt-1" style={{ color: 'var(--tactical-green)' }}>{dalCounts.DE}</div>
        </CardContent>
      </Card>
      <Card className="border-critical-red/20">
        <CardContent className="p-4">
          <div className="data-label" style={{ color: 'var(--critical-red)' }}>Open</div>
          <div className="data-value-large mt-1" style={{ color: 'var(--critical-red)' }}>{statusCounts.open}</div>
        </CardContent>
      </Card>
      <Card className="border-electric-blue/20">
        <CardContent className="p-4">
          <div className="data-label" style={{ color: 'var(--electric-blue)' }}>Monitoring</div>
          <div className="data-value-large mt-1" style={{ color: 'var(--electric-blue)' }}>{statusCounts.monitoring}</div>
        </CardContent>
      </Card>
      <Card className="border-tactical-green/20">
        <CardContent className="p-4">
          <div className="data-label" style={{ color: 'var(--tactical-green)' }}>Mitigated</div>
          <div className="data-value-large mt-1" style={{ color: 'var(--tactical-green)' }}>{statusCounts.mitigated}</div>
        </CardContent>
      </Card>
    </div>
  );
}

interface RiskMatrixProps {
  hazards: ExtendedHazard[];
  onCellClick: (severity: SeverityLevel | null, likelihood: LikelihoodLevel | null) => void;
  activeFilter: { severity: SeverityLevel | null; likelihood: LikelihoodLevel | null };
}

function RiskMatrix({ hazards, onCellClick, activeFilter }: RiskMatrixProps) {
  const matrixCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const hazard of hazards) {
      const key = `${hazard.severity}-${hazard.likelihood}`;
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [hazards]);

  const displaySeverities: SeverityLevel[] = ['Catastrophic', 'Hazardous', 'Major', 'Minor', 'NoEffect'];
  const displayLikelihoods: LikelihoodLevel[] = ['Frequent', 'Probable', 'Occasional', 'Remote', 'ExtremelyRemote', 'ExtremelyImprobable'];

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="w-4 h-4" style={{ color: 'var(--electric-blue)' }} />
          Risk Assessment Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs font-mono">
            <thead>
              <tr>
                <th className="p-2 border border-border/30 bg-muted/30 text-left text-muted-foreground uppercase tracking-wider text-[0.625rem]">
                  Severity / Likelihood
                </th>
                {displayLikelihoods.map((likelihood) => (
                  <th
                    key={likelihood}
                    className="p-2 border border-border/30 bg-muted/30 text-center min-w-[80px] text-muted-foreground uppercase tracking-wider text-[0.625rem]"
                  >
                    {formatLikelihood(likelihood)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displaySeverities.map((severity) => (
                <tr key={severity}>
                  <td className="p-2 border border-border/30 bg-muted/20 font-medium text-foreground/80 text-[0.6875rem]">
                    {severity}
                  </td>
                  {displayLikelihoods.map((likelihood) => {
                    const count = matrixCounts[`${severity}-${likelihood}`] || 0;
                    const riskLevel = getRiskLevel(severity, likelihood);
                    const isActive =
                      activeFilter.severity === severity && activeFilter.likelihood === likelihood;

                    return (
                      <td
                        key={`${severity}-${likelihood}`}
                        className={cn(
                          'p-2 border border-border/20 text-center cursor-pointer transition-all tactical-corners font-bold tabular-nums',
                          getRiskCellStyle(riskLevel),
                          isActive && 'ring-2 ring-electric-blue ring-offset-1 ring-offset-background'
                        )}
                        onClick={() => {
                          if (isActive) {
                            onCellClick(null, null);
                          } else {
                            onCellClick(severity, likelihood);
                          }
                        }}
                      >
                        {count > 0 ? count : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'var(--critical-red)', opacity: 0.6 }} />
            <span className="text-muted-foreground uppercase tracking-wider">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'var(--warning-amber)', opacity: 0.6 }} />
            <span className="text-muted-foreground uppercase tracking-wider">Serious</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'var(--warning-amber)', opacity: 0.3 }} />
            <span className="text-muted-foreground uppercase tracking-wider">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'var(--tactical-green)', opacity: 0.5 }} />
            <span className="text-muted-foreground uppercase tracking-wider">Low</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface HazardDetailPanelProps {
  hazard: ExtendedHazard;
  onClose: () => void;
  onEdit: () => void;
}

function HazardDetailPanel({ hazard, onClose, onEdit }: HazardDetailPanelProps) {
  return (
    <Card className="tactical-corners" style={{ borderLeftWidth: '3px', borderLeftColor: 'var(--electric-blue)' }}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" style={{ color: 'var(--warning-amber)' }} />
              <span className="font-mono">{hazard.id}</span>: {hazard.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getSeverityBadgeVariant(hazard.severity)}>{hazard.severity}</Badge>
              <Badge variant={getStatusBadgeVariant(hazard.status)}>{hazard.status}</Badge>
              <Badge variant={getDALBadgeVariant(hazard.dal)}>DAL {hazard.dal}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground text-sm">{hazard.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="data-label">System Function</div>
            <p className="font-medium text-sm mt-1">{hazard.systemFunction}</p>
          </div>
          <div>
            <div className="data-label">Failure Condition</div>
            <p className="font-medium text-sm mt-1">{hazard.failureCondition}</p>
          </div>
          <div>
            <div className="data-label">Flight Phase</div>
            <p className="font-medium text-sm mt-1">{hazard.phase}</p>
          </div>
          <div>
            <div className="data-label">Likelihood</div>
            <p className="font-medium text-sm mt-1">{hazard.likelihood}</p>
          </div>
          <div>
            <div className="data-label">Owner</div>
            <p className="font-medium text-sm mt-1">{hazard.owner}</p>
          </div>
          <div>
            <div className="data-label">Probability (per flight hour)</div>
            <p className="font-mono font-medium text-sm mt-1 tabular-nums">{hazard.probabilityPerFlightHour?.toExponential(1) || 'N/A'}</p>
          </div>
        </div>

        {hazard.aircraftLevelEffect && (
          <div>
            <div className="data-label">Aircraft Level Effect</div>
            <p className="mt-1 p-3 bg-muted/30 rounded-sm border border-border/30 text-sm">{hazard.aircraftLevelEffect}</p>
          </div>
        )}

        {/* Mitigations Section */}
        {hazard.mitigationDetails && hazard.mitigationDetails.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2 uppercase tracking-wider text-sm">
              <Shield className="w-4 h-4" style={{ color: 'var(--tactical-green)' }} />
              Mitigations ({hazard.mitigationDetails.length})
            </h4>
            <div className="space-y-3">
              {hazard.mitigationDetails.map((mitigation: MitigationRecord) => (
                <div
                  key={mitigation.id}
                  className="p-3 bg-muted/20 rounded-sm border border-border/30"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{mitigation.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Verification: {mitigation.verificationMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          mitigation.implementationStatus === 'Verified'
                            ? 'success'
                            : mitigation.implementationStatus === 'Implemented'
                            ? 'default'
                            : 'warning'
                        }
                      >
                        {mitigation.implementationStatus}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1 font-mono tabular-nums">
                        Effectiveness: {(mitigation.effectiveness * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Traceability Section */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2 uppercase tracking-wider text-sm">
            <Link2 className="w-4 h-4" style={{ color: 'var(--electric-blue)' }} />
            Traceability
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-muted/20 rounded-sm border border-border/30">
              <div className="data-label">Linked Requirements</div>
              <p className="font-mono font-medium text-sm mt-1">
                {hazard.linkedRequirements?.length > 0
                  ? hazard.linkedRequirements.join(', ')
                  : 'None'}
              </p>
            </div>
            <div className="p-3 bg-muted/20 rounded-sm border border-border/30">
              <div className="data-label">Linked Fault Trees</div>
              <p className="font-mono font-medium text-sm mt-1">
                {hazard.linkedFaultTrees?.length > 0
                  ? hazard.linkedFaultTrees.join(', ')
                  : 'None'}
              </p>
            </div>
            <div className="p-3 bg-muted/20 rounded-sm border border-border/30">
              <div className="data-label">Linked GSN Nodes</div>
              <p className="font-mono font-medium text-sm mt-1">
                {hazard.linkedGSNNodes?.length > 0
                  ? hazard.linkedGSNNodes.join(', ')
                  : 'None'}
              </p>
            </div>
          </div>
        </div>

        {hazard.notes && (
          <div>
            <div className="data-label">Notes</div>
            <p className="mt-1 p-3 rounded-sm text-sm border" style={{ backgroundColor: 'var(--warning-amber-dim)', borderColor: 'rgba(245, 158, 11, 0.15)' }}>
              {hazard.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface HazardFormProps {
  hazard?: ExtendedHazard | null;
  onSave: (data: HazardFormData) => void;
  onCancel: () => void;
}

function HazardForm({ hazard, onSave, onCancel }: HazardFormProps) {
  const [formData, setFormData] = useState<HazardFormData>({
    id: hazard?.id || generateHazardId(),
    title: hazard?.title || '',
    description: hazard?.description || '',
    systemFunction: hazard?.systemFunction || '',
    failureCondition: hazard?.failureCondition || '',
    severity: hazard?.severity || 'Major',
    likelihood: hazard?.likelihood || 'Remote',
    dal: hazard?.dal || 'C',
    phase: hazard?.phase || 'All Phases',
    owner: hazard?.owner || '',
    status: hazard?.status || 'Open',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="id">Hazard ID</Label>
          <Input
            id="id"
            value={formData.id}
            disabled
            className="opacity-60"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as HazardStatus })}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="flex min-h-[80px] w-full rounded-sm border border-border/60 bg-card px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background transition-all duration-150"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="systemFunction">System Function</Label>
          <Input
            id="systemFunction"
            value={formData.systemFunction}
            onChange={(e) => setFormData({ ...formData, systemFunction: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="failureCondition">Failure Condition</Label>
          <Input
            id="failureCondition"
            value={formData.failureCondition}
            onChange={(e) => setFormData({ ...formData, failureCondition: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="severity">Severity</Label>
          <Select
            value={formData.severity}
            onValueChange={(value) => setFormData({ ...formData, severity: value as SeverityLevel })}
          >
            <SelectTrigger id="severity">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEVERITY_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="likelihood">Likelihood</Label>
          <Select
            value={formData.likelihood}
            onValueChange={(value) => setFormData({ ...formData, likelihood: value as LikelihoodLevel })}
          >
            <SelectTrigger id="likelihood">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LIKELIHOOD_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {formatLikelihood(level)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dal">Design Assurance Level</Label>
          <Select
            value={formData.dal}
            onValueChange={(value) => setFormData({ ...formData, dal: value as DAL })}
          >
            <SelectTrigger id="dal">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAL_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  DAL {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phase">Flight Phase</Label>
          <Select
            value={formData.phase}
            onValueChange={(value) => setFormData({ ...formData, phase: value })}
          >
            <SelectTrigger id="phase">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PHASE_OPTIONS.map((phase) => (
                <SelectItem key={phase} value={phase}>
                  {phase}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="owner">Owner</Label>
          <Input
            id="owner"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {hazard ? 'Update Hazard' : 'Create Hazard'}
        </Button>
      </DialogFooter>
    </form>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function HazardInformation() {
  const [hazards, setHazards] = useState<ExtendedHazard[]>(sampleHazards);
  const [selectedHazard, setSelectedHazard] = useState<ExtendedHazard | null>(null);
  const [editingHazard, setEditingHazard] = useState<ExtendedHazard | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewHazard, setIsNewHazard] = useState(false);

  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const [filters, setFilters] = useState<FilterState>({
    severity: '',
    status: '',
    dal: '',
    owner: '',
    search: '',
  });
  const [matrixFilter, setMatrixFilter] = useState<{
    severity: SeverityLevel | null;
    likelihood: LikelihoodLevel | null;
  }>({ severity: null, likelihood: null });
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const uniqueOwners = useMemo(() => {
    const owners = new Set(hazards.map((h) => h.owner));
    return Array.from(owners).sort();
  }, [hazards]);

  const filteredHazards = useMemo(() => {
    return hazards.filter((hazard) => {
      if (matrixFilter.severity && hazard.severity !== matrixFilter.severity) return false;
      if (matrixFilter.likelihood && hazard.likelihood !== matrixFilter.likelihood) return false;
      if (filters.severity && hazard.severity !== filters.severity) return false;
      if (filters.status && hazard.status !== filters.status) return false;
      if (filters.dal && hazard.dal !== filters.dal) return false;
      if (filters.owner && hazard.owner !== filters.owner) return false;

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          hazard.id.toLowerCase().includes(searchLower) ||
          hazard.title.toLowerCase().includes(searchLower) ||
          hazard.description.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [hazards, filters, matrixFilter]);

  const sortedHazards = useMemo(() => {
    return [...filteredHazards].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'severity':
          comparison = SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity];
          break;
        case 'likelihood':
          comparison = LIKELIHOOD_ORDER[b.likelihood] - LIKELIHOOD_ORDER[a.likelihood];
          break;
        case 'dal':
          comparison = DAL_ORDER[b.dal] - DAL_ORDER[a.dal];
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'owner':
          comparison = a.owner.localeCompare(b.owner);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredHazards, sortField, sortDirection]);

  const paginatedHazards = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedHazards.slice(start, start + pageSize);
  }, [sortedHazards, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedHazards.length / pageSize);

  const handleSort = useCallback((field: SortField) => {
    setSortField((current) => {
      if (current === field) {
        setSortDirection((dir) => (dir === 'asc' ? 'desc' : 'asc'));
        return field;
      }
      setSortDirection('asc');
      return field;
    });
  }, []);

  const handleMatrixCellClick = useCallback((severity: SeverityLevel | null, likelihood: LikelihoodLevel | null) => {
    setMatrixFilter({ severity, likelihood });
    setCurrentPage(1);
  }, []);

  const handleSaveHazard = useCallback((data: HazardFormData) => {
    if (isNewHazard) {
      const newHazard: ExtendedHazard = {
        ...data,
        riskScore: SEVERITY_ORDER[data.severity] * LIKELIHOOD_ORDER[data.likelihood],
        mitigationDetails: [],
        linkedRequirements: [],
        linkedFaultTrees: [],
        linkedGSNNodes: [],
        aircraftLevelEffect: '',
        initialRisk: { score: 0, level: 'Acceptable' },
        residualRisk: { score: 0, level: 'Acceptable' },
        relatedRequirements: [],
        dateIdentified: new Date().toISOString().split('T')[0],
        dateReviewed: new Date().toISOString().split('T')[0],
      };
      setHazards((prev) => [...prev, newHazard]);
    } else {
      setHazards((prev) =>
        prev.map((h) =>
          h.id === data.id
            ? {
                ...h,
                ...data,
                riskScore: SEVERITY_ORDER[data.severity] * LIKELIHOOD_ORDER[data.likelihood],
              }
            : h
        )
      );
    }
    setIsDialogOpen(false);
    setEditingHazard(null);
    setIsNewHazard(false);
  }, [isNewHazard]);

  const handleDeleteHazard = useCallback((hazardId: string) => {
    setHazards((prev) => prev.filter((h) => h.id !== hazardId));
    if (selectedHazard?.id === hazardId) {
      setSelectedHazard(null);
    }
  }, [selectedHazard]);

  const handleExportCSV = useCallback(() => {
    const headers = [
      'ID',
      'Title',
      'System Function',
      'Failure Condition',
      'Phase',
      'Severity',
      'Likelihood',
      'Probability',
      'DAL',
      'Mitigation',
      'Status',
    ];

    const rows = sortedHazards.map((h) => [
      h.id,
      `"${h.title.replace(/"/g, '""')}"`,
      `"${h.systemFunction.replace(/"/g, '""')}"`,
      `"${h.failureCondition.replace(/"/g, '""')}"`,
      h.phase,
      h.severity,
      h.likelihood,
      h.probabilityPerFlightHour?.toExponential(1) || 'N/A',
      h.dal,
      `"${h.mitigationDetails?.map((m) => m.description).join('; ').replace(/"/g, '""') || ''}"`,
      h.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hazard_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [sortedHazards]);

  const clearFilters = useCallback(() => {
    setFilters({ severity: '', status: '', dal: '', owner: '', search: '' });
    setMatrixFilter({ severity: null, likelihood: null });
    setCurrentPage(1);
  }, []);

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:bg-electric-blue-dim/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
        )}
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Hazard Registry</h2>
          <p className="text-muted-foreground text-sm mt-1 font-mono text-xs tracking-wider uppercase">
            Functional Hazard Assessment per ARP4761A
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-1" />
            Export CSV
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setIsNewHazard(true);
                  setEditingHazard(null);
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                New Hazard
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isNewHazard ? 'Create New Hazard' : 'Edit Hazard'}</DialogTitle>
                <DialogDescription>
                  {isNewHazard
                    ? 'Add a new hazard to the registry'
                    : `Editing hazard ${editingHazard?.id}`}
                </DialogDescription>
              </DialogHeader>
              <HazardForm
                hazard={editingHazard}
                onSave={handleSaveHazard}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingHazard(null);
                  setIsNewHazard(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards hazards={hazards} />

      {/* Risk Matrix */}
      <RiskMatrix
        hazards={hazards}
        onCellClick={handleMatrixCellClick}
        activeFilter={matrixFilter}
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search hazards..."
                value={filters.search}
                onChange={(e) => {
                  setFilters((f) => ({ ...f, search: e.target.value }));
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(showFilters && 'bg-electric-blue-dim border-electric-blue/30')}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
              {(filters.severity || filters.status || filters.dal || filters.owner) && (
                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {[filters.severity, filters.status, filters.dal, filters.owner].filter(Boolean).length}
                </Badge>
              )}
            </Button>

            {(filters.severity || filters.status || filters.dal || filters.owner || matrixFilter.severity) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/30">
              <div>
                <Label className="data-label">Severity</Label>
                <Select
                  value={filters.severity}
                  onValueChange={(value) => {
                    setFilters((f) => ({ ...f, severity: value === 'all' ? '' : value }));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {SEVERITY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="data-label">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => {
                    setFilters((f) => ({ ...f, status: value === 'all' ? '' : value }));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="data-label">DAL</Label>
                <Select
                  value={filters.dal}
                  onValueChange={(value) => {
                    setFilters((f) => ({ ...f, dal: value === 'all' ? '' : value }));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {DAL_LEVELS.map((dal) => (
                      <SelectItem key={dal} value={dal}>
                        DAL {dal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="data-label">Owner</Label>
                <Select
                  value={filters.owner}
                  onValueChange={(value) => {
                    setFilters((f) => ({ ...f, owner: value === 'all' ? '' : value }));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueOwners.map((owner) => (
                      <SelectItem key={owner} value={owner}>
                        {owner}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="id">ID</SortableHeader>
                <SortableHeader field="title">Title</SortableHeader>
                <SortableHeader field="severity">Severity</SortableHeader>
                <SortableHeader field="likelihood">Likelihood</SortableHeader>
                <SortableHeader field="dal">DAL</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
                <SortableHeader field="owner">Owner</SortableHeader>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedHazards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No hazards found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                paginatedHazards.map((hazard) => (
                  <TableRow
                    key={hazard.id}
                    className={cn(
                      'cursor-pointer',
                      selectedHazard?.id === hazard.id && 'bg-electric-blue-dim'
                    )}
                    onClick={() => setSelectedHazard(hazard)}
                  >
                    <TableCell className="font-mono text-sm">{hazard.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{hazard.title}</TableCell>
                    <TableCell>
                      <Badge variant={getSeverityBadgeVariant(hazard.severity)}>
                        {hazard.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono">{formatLikelihood(hazard.likelihood)}</TableCell>
                    <TableCell>
                      <Badge variant={getDALBadgeVariant(hazard.dal)}>
                        DAL {hazard.dal}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(hazard.status)}>
                        {hazard.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{hazard.owner}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingHazard(hazard);
                            setIsNewHazard(false);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-critical-red-dim"
                              style={{ color: 'var(--critical-red)' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Hazard</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete hazard {hazard.id}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-critical-red hover:bg-critical-red/80 text-white"
                                onClick={() => handleDeleteHazard(hazard.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono text-xs">
              <span className="tabular-nums">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, sortedHazards.length)} of {sortedHazards.length}
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[80px]" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="uppercase tracking-wider">per page</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground font-mono tabular-nums">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Panel */}
      {selectedHazard && (
        <HazardDetailPanel
          hazard={selectedHazard}
          onClose={() => setSelectedHazard(null)}
          onEdit={() => {
            setEditingHazard(selectedHazard);
            setIsNewHazard(false);
            setIsDialogOpen(true);
          }}
        />
      )}
    </div>
  );
}
