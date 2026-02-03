import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  Home,
  Square,
  Circle,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
  Expand,
  Minimize2,
  Edit3
} from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { sampleFaultTree, type ExtendedFaultTree, type ExtendedCutSet } from '@/data/sampleData';
import { calculateTreeProbabilities } from '@/utils/safety';
import type { GateType } from '@/types/safety';

// Define ImportanceMeasure to match the sample data structure
interface ImportanceMeasure {
  eventId: string;
  eventLabel?: string;
  baseProbability?: number;
  fussellVesely: number;
  birnbaum: number;
  raw: number;
  rrw: number;
}

// Define a more flexible node type that matches the sample data structure
interface FaultTreeNodeType {
  id: string;
  label: string;
  description?: string;
  type: 'top-event' | 'intermediate' | 'basic-event' | 'undeveloped' | 'transfer' | 'house' | 'house-event';
  gate?: GateType | string | { type: GateType; votingThreshold?: number };
  votingThreshold?: number;
  probability?: number;
  failureRate?: number;
  exposureTime?: number;
  failureData?: {
    probability?: number;
    failureRate?: number;
    exposureTime?: number;
  };
  children?: FaultTreeNodeType[];
  linkedHazards?: string[];
  linkedFMEA?: string[];
  cutSetMember?: boolean;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Format a probability in scientific notation with superscript
 */
function formatProbability(p: number | undefined): string {
  if (p === undefined || p === null) return 'N/A';
  if (p === 0) return '0';
  if (p < 1e-12) return '< 1x10^-12';

  const exp = Math.floor(Math.log10(p));
  const mantissa = p / Math.pow(10, exp);

  // Unicode superscript digits
  const superscriptDigits = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  const superscriptMinus = '⁻';

  const formatExponent = (e: number): string => {
    const absE = Math.abs(e);
    const digits = absE.toString().split('').map(d => superscriptDigits[parseInt(d)]).join('');
    return e < 0 ? superscriptMinus + digits : digits;
  };

  return `${mantissa.toFixed(2)}x10${formatExponent(exp)}`;
}

/**
 * Calculate target progress percentage (capped at 100%)
 */
function calculateTargetProgress(actual: number, target: number): number {
  if (actual <= 0) return 100;
  if (target <= 0) return 0;

  // If we're below target, we've achieved 100% of our goal
  if (actual <= target) return 100;

  // Calculate how far we are from the target
  const ratio = target / actual;
  return Math.min(Math.max(ratio * 100, 0), 100);
}

/**
 * Get node style based on type
 */
function getNodeStyle(type: string): string {
  switch (type) {
    case 'top-event':
      return 'border-critical-red/50 text-foreground glow-red';
    case 'intermediate':
      return 'border-electric-blue/40 text-foreground';
    case 'basic-event':
      return 'border-tactical-green/40 text-foreground glow-green';
    case 'undeveloped':
      return 'border-warning-amber/40 text-foreground';
    case 'house-event':
      return 'border-info-cyan/40 text-foreground';
    default:
      return 'border-border/40 text-foreground';
  }
}

/**
 * Get node type icon
 */
function getNodeTypeIcon(type: string) {
  switch (type) {
    case 'top-event':
      return <Home className="w-4 h-4" style={{ color: 'var(--critical-red)' }} />;
    case 'intermediate':
      return <Square className="w-4 h-4" style={{ color: 'var(--electric-blue)' }} />;
    case 'basic-event':
      return <Circle className="w-4 h-4 fill-current" style={{ color: 'var(--tactical-green)' }} />;
    case 'undeveloped':
      return <div className="w-4 h-4 border-2 rounded-full relative" style={{ borderColor: 'var(--warning-amber)' }}>
        <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold" style={{ color: 'var(--warning-amber)' }}>?</div>
      </div>;
    case 'house-event':
      return <Home className="w-4 h-4" style={{ color: 'var(--info-cyan)' }} />;
    default:
      return null;
  }
}

// =============================================================================
// Basic Event Editor Component
// =============================================================================

interface BasicEventEditorProps {
  event: FaultTreeNodeType;
  onUpdate: (updated: FaultTreeNodeType) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function BasicEventEditor({ event, onUpdate, open, onOpenChange }: BasicEventEditorProps) {
  const [failureRate, setFailureRate] = useState(event.failureRate ?? 0);
  const [exposureTime, setExposureTime] = useState(event.exposureTime ?? 1);

  const calculatedProbability = useMemo(() => {
    return 1 - Math.exp(-failureRate * exposureTime);
  }, [failureRate, exposureTime]);

  const handleSave = () => {
    onUpdate({
      ...event,
      failureRate,
      exposureTime,
      probability: calculatedProbability,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Basic Event: {event.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label className="text-sm font-medium">Event Label</Label>
            <p className="text-sm text-muted-foreground mt-1">{event.label}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="failureRate">Failure Rate (λ) [per hour]</Label>
            <Input
              id="failureRate"
              type="number"
              step="1e-10"
              value={failureRate}
              onChange={(e) => setFailureRate(parseFloat(e.target.value) || 0)}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Current: {formatProbability(failureRate)} per hour
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exposureTime">Exposure Time [hours]</Label>
            <Input
              id="exposureTime"
              type="number"
              step="0.1"
              min="0"
              value={exposureTime}
              onChange={(e) => setExposureTime(parseFloat(e.target.value) || 1)}
              className="font-mono"
            />
          </div>

          <div className="border-t pt-4">
            <Label>Calculated Probability</Label>
            <p className="font-mono text-lg mt-1">
              P = 1 - e<sup>-λt</sup> = {formatProbability(calculatedProbability)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Using exponential distribution: P = 1 - e^(-{formatProbability(failureRate)} x {exposureTime}h)
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// =============================================================================
// Fault Tree Node Component
// =============================================================================

interface FaultTreeNodeProps {
  node: FaultTreeNodeType;
  level: number;
  showProbabilities: boolean;
  highlightCutSets: boolean;
  cutSetEventIds: Set<string>;
  singlePointThreshold: number;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  onEditNode: (node: FaultTreeNodeType) => void;
  zoom: number;
}

function FaultTreeNode({
  node,
  level,
  showProbabilities,
  highlightCutSets,
  cutSetEventIds,
  singlePointThreshold,
  expandedNodes,
  onToggleExpand,
  onEditNode,
  zoom
}: FaultTreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);

  // Get probability from node or failureData
  const probability = node.probability ?? node.failureData?.probability;

  // Check for single-point failure (basic event with high probability)
  const isSinglePointFailure =
    node.type === 'basic-event' &&
    probability !== undefined &&
    probability > singlePointThreshold;

  // Check if this node is part of a cut set
  const isInCutSet = highlightCutSets && cutSetEventIds.has(node.id);

  // Get gate type from node
  const gateType = typeof node.gate === 'string' ? node.gate : node.gate?.type;
  const votingThreshold = typeof node.gate === 'object' ? node.gate?.votingThreshold : node.votingThreshold;

  // Get gate badge content
  const getGateBadge = () => {
    if (!gateType) return null;

    let symbol = '';
    let label = gateType;

    switch (gateType) {
      case 'AND':
        symbol = '∧';
        break;
      case 'OR':
        symbol = '∨';
        break;
      case 'VOTING':
        symbol = `${votingThreshold}/${node.children?.length || 'n'}`;
        label = `VOTING ${votingThreshold}/${node.children?.length || 'n'}`;
        break;
      case 'NOT':
        symbol = '¬';
        break;
      case 'INHIBIT':
        symbol = '⊲';
        break;
      default:
        symbol = gateType;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="text-xs px-2 py-0.5 font-mono">
            {symbol}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {label} Gate
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div
      className="relative"
      style={{
        fontSize: `${Math.max(0.75, zoom)}rem`,
        transform: `scale(${Math.max(0.5, zoom / 100)})`,
        transformOrigin: 'top left'
      }}
    >
      <div className="flex items-start gap-2">
        {hasChildren && (
          <button
            onClick={() => onToggleExpand(node.id)}
            className="mt-2 text-muted-foreground hover:text-foreground flex-shrink-0 transition-transform"
            style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
        {!hasChildren && <div className="w-5" />}

        <div className="flex-1">
          <div
            className={cn(
              "border-2 rounded-sm p-3 transition-all tactical-corners",
              getNodeStyle(node.type),
              isSinglePointFailure && "border-critical-red ring-2 ring-critical-red/30",
              isInCutSet && "ring-2 ring-warning-amber/40"
            )}
            style={{ backgroundColor: 'var(--bg-elevated)' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {getNodeTypeIcon(node.type)}
                  {getGateBadge()}
                  <span className="text-xs opacity-70 font-mono">{node.id}</span>
                  {isSinglePointFailure && (
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertTriangle className="w-4 h-4 text-critical-red" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Single-Point Failure Warning: Probability exceeds {formatProbability(singlePointThreshold)}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {node.type === 'basic-event' && (
                    <button
                      onClick={() => onEditNode(node)}
                      className="ml-auto p-1 hover:bg-electric-blue-dim/50 rounded"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="mt-1 font-medium">{node.label}</div>
                {node.description && (
                  <div className="mt-1 text-xs opacity-70">{node.description}</div>
                )}
              </div>

              {showProbabilities && probability !== undefined && (
                <div className="text-right flex-shrink-0">
                  <div className="text-xs opacity-70">Probability</div>
                  <div className="font-mono text-sm">{formatProbability(probability)}</div>
                  {node.type === 'basic-event' && node.failureRate !== undefined && (
                    <div className="text-xs opacity-60 mt-1">
                      λ = {formatProbability(node.failureRate)}/hr
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {hasChildren && isExpanded && (
            <div className="ml-6 mt-3 border-l-2 border-border/40 pl-4 space-y-3">
              {node.children!.map((child) => (
                <FaultTreeNode
                  key={child.id}
                  node={child}
                  level={level + 1}
                  showProbabilities={showProbabilities}
                  highlightCutSets={highlightCutSets}
                  cutSetEventIds={cutSetEventIds}
                  singlePointThreshold={singlePointThreshold}
                  expandedNodes={expandedNodes}
                  onToggleExpand={onToggleExpand}
                  onEditNode={onEditNode}
                  zoom={zoom}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Quantitative Analysis Panel
// =============================================================================

interface QuantitativeAnalysisPanelProps {
  tree: ExtendedFaultTree;
}

function QuantitativeAnalysisPanel({ tree }: QuantitativeAnalysisPanelProps) {
  // DAL targets per DO-178C
  const dalTargets = {
    A: { value: 1e-9, label: 'DAL A: Catastrophic' },
    B: { value: 1e-7, label: 'DAL B: Hazardous' },
    C: { value: 1e-5, label: 'DAL C: Major' },
    D: { value: 1e-3, label: 'DAL D: Minor' },
  };

  const topEventProb = tree.topEventProbability;
  const meetsDAL_A = topEventProb <= dalTargets.A.value;
  const meetsDAL_B = topEventProb <= dalTargets.B.value;
  const meetsDAL_C = topEventProb <= dalTargets.C.value;

  return (
    <div className="rounded-sm border border-border/40 p-4 space-y-6">
      <h3 className="text-lg font-semibold">Quantitative Analysis Results</h3>

      {/* Top Event Probability */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Top Event Probability:</span>
          <span className="font-mono text-xl font-bold">
            {formatProbability(topEventProb)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          per flight hour
        </p>
      </div>

      {/* DAL Target Comparisons */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-foreground/80">Target Compliance</h4>

        {/* DAL A Target */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{dalTargets.A.label}</span>
            <span className="font-mono">≤ {formatProbability(dalTargets.A.value)}</span>
          </div>
          <Progress
            value={calculateTargetProgress(topEventProb, dalTargets.A.value)}
            className={cn(
              "h-3",
              meetsDAL_A ? "[&>div]:bg-tactical-green" : "[&>div]:bg-critical-red"
            )}
          />
          <div className={cn(
            "text-sm font-medium",
            meetsDAL_A ? "text-tactical-green" : "text-critical-red"
          )}>
            {meetsDAL_A ? '✓ Meets target' : '✗ Exceeds target'}
          </div>
        </div>

        {/* DAL B Target */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{dalTargets.B.label}</span>
            <span className="font-mono">≤ {formatProbability(dalTargets.B.value)}</span>
          </div>
          <Progress
            value={calculateTargetProgress(topEventProb, dalTargets.B.value)}
            className={cn(
              "h-3",
              meetsDAL_B ? "[&>div]:bg-tactical-green" : "[&>div]:bg-warning-amber"
            )}
          />
          <div className={cn(
            "text-sm font-medium",
            meetsDAL_B ? "text-tactical-green" : "text-warning-amber"
          )}>
            {meetsDAL_B ? '✓ Meets target' : '✗ Exceeds target'}
          </div>
        </div>

        {/* DAL C Target */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{dalTargets.C.label}</span>
            <span className="font-mono">≤ {formatProbability(dalTargets.C.value)}</span>
          </div>
          <Progress
            value={calculateTargetProgress(topEventProb, dalTargets.C.value)}
            className={cn(
              "h-3",
              meetsDAL_C ? "[&>div]:bg-tactical-green" : "[&>div]:bg-electric-blue"
            )}
          />
          <div className={cn(
            "text-sm font-medium",
            meetsDAL_C ? "text-tactical-green" : "text-electric-blue"
          )}>
            {meetsDAL_C ? '✓ Meets target' : '✗ Exceeds target'}
          </div>
        </div>
      </div>

      {/* Analysis Metadata */}
      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Analysis Type:</span>
          <Badge variant="outline">{tree.analysisType}</Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Analysis Date:</span>
          <span>{tree.analysisDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Analyst:</span>
          <span>{tree.analyst}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <Badge variant={tree.approvalStatus === 'Approved' ? 'default' : 'secondary'}>
            {tree.approvalStatus}
          </Badge>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Minimal Cut Sets Panel
// =============================================================================

interface MinimalCutSetsPanelProps {
  cutSets: ExtendedCutSet[];
  topEventProbability: number;
}

function MinimalCutSetsPanel({ cutSets, topEventProbability }: MinimalCutSetsPanelProps) {
  // Sort by order then probability
  const sortedCutSets = useMemo(() => {
    return [...cutSets].sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return (b.probability ?? 0) - (a.probability ?? 0);
    });
  }, [cutSets]);

  // Count single-point failures
  const singlePointFailures = cutSets.filter(cs => cs.order === 1).length;

  return (
    <div className="rounded-sm border border-border/40 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Minimal Cut Sets</h3>
        <Badge variant="outline">{cutSets.length} total</Badge>
      </div>

      {singlePointFailures > 0 && (
        <div className="flex items-center gap-2 p-3 bg-critical-red-dim border border-critical-red/30 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-critical-red" />
          <span className="text-sm text-critical-red">
            Warning: {singlePointFailures} single-point failure{singlePointFailures > 1 ? 's' : ''} identified
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Order</TableHead>
              <TableHead>Basic Events</TableHead>
              <TableHead className="text-right">Probability</TableHead>
              <TableHead className="text-right w-24">Contribution</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCutSets.map((cs) => {
              const contribution = topEventProbability > 0
                ? ((cs.probability ?? 0) / topEventProbability * 100)
                : 0;

              return (
                <TableRow
                  key={cs.id}
                  className={cn(
                    cs.order === 1 && "bg-critical-red-dim"
                  )}
                >
                  <TableCell>
                    <Badge
                      variant={cs.order === 1 ? 'destructive' : 'secondary'}
                      className="font-mono"
                    >
                      {cs.order}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {cs.basicEventIds.map((id, idx) => (
                        <React.Fragment key={id}>
                          {idx > 0 && <span className="text-muted-foreground/70">∧</span>}
                          <code className="text-xs bg-muted/40 px-1 py-0.5 rounded">
                            {id}
                          </code>
                        </React.Fragment>
                      ))}
                    </div>
                    {cs.description && (
                      <p className="text-xs text-muted-foreground mt-1">{cs.description}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatProbability(cs.probability)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-16 bg-muted/30 rounded-full h-2">
                        <div
                          className="bg-electric-blue h-2 rounded-full"
                          style={{ width: `${Math.min(contribution, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono w-12 text-right">
                        {contribution.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// =============================================================================
// Importance Measures Panel
// =============================================================================

interface ImportanceMeasuresPanelProps {
  measures: ImportanceMeasure[];
}

function ImportanceMeasuresPanel({ measures }: ImportanceMeasuresPanelProps) {
  const sortedMeasures = useMemo(() => {
    return [...measures].sort((a, b) => b.fussellVesely - a.fussellVesely);
  }, [measures]);

  return (
    <div className="rounded-sm border border-border/40 p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Importance Measures</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Identifies which basic events contribute most to system failure probability
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Basic Event</TableHead>
              <TableHead className="text-right">
                <Tooltip>
                  <TooltipTrigger className="cursor-help underline decoration-dotted">
                    F-V
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold">Fussell-Vesely Importance</p>
                    <p className="text-xs mt-1">
                      Fraction of top event probability from cut sets containing this event.
                      Higher values indicate greater contribution to system failure.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead className="text-right">
                <Tooltip>
                  <TooltipTrigger className="cursor-help underline decoration-dotted">
                    Birnbaum
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold">Birnbaum Importance</p>
                    <p className="text-xs mt-1">
                      Rate of change of top event probability with respect to this event.
                      Shows sensitivity to component reliability changes.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead className="text-right">
                <Tooltip>
                  <TooltipTrigger className="cursor-help underline decoration-dotted">
                    RAW
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold">Risk Achievement Worth</p>
                    <p className="text-xs mt-1">
                      Factor increase in top event probability if event probability = 1.
                      High RAW indicates critical component for system success.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead className="text-right">
                <Tooltip>
                  <TooltipTrigger className="cursor-help underline decoration-dotted">
                    RRW
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold">Risk Reduction Worth</p>
                    <p className="text-xs mt-1">
                      Factor decrease in top event probability if event probability = 0.
                      High RRW indicates good candidate for reliability improvement.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMeasures.map((m) => (
              <TableRow key={m.eventId}>
                <TableCell>
                  <div>
                    <code className="text-xs bg-muted/40 px-1 py-0.5 rounded">
                      {m.eventId}
                    </code>
                    {m.eventLabel && (
                      <p className="text-xs text-muted-foreground mt-1">{m.eventLabel}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {m.fussellVesely.toFixed(4)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {m.birnbaum.toExponential(2)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {m.raw > 1e6 ? m.raw.toExponential(2) : m.raw.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {m.rrw.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// =============================================================================
// Gate Legend Panel
// =============================================================================

function GateLegendPanel() {
  return (
    <div className="rounded-sm border border-border/40 p-4">
      <h4 className="font-medium mb-4">Gate Types</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* OR Gate */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-border/50 rounded-full flex items-center justify-center font-bold">
            ∨
          </div>
          <div>
            <span className="font-medium block">OR Gate</span>
            <span className="text-xs text-muted-foreground font-mono">
              P = 1 - ∏(1 - Pᵢ)
            </span>
          </div>
        </div>

        {/* AND Gate */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-border/50 rounded flex items-center justify-center font-bold">
            ∧
          </div>
          <div>
            <span className="font-medium block">AND Gate</span>
            <span className="text-xs text-muted-foreground font-mono">
              P = ∏Pᵢ
            </span>
          </div>
        </div>

        {/* VOTING Gate */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-border/50 rounded flex items-center justify-center text-xs font-bold">
            k/n
          </div>
          <div>
            <span className="font-medium block">VOTING Gate</span>
            <span className="text-xs text-muted-foreground">
              k+ of n inputs fail
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/30">
        <h4 className="font-medium mb-3">Node Types</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-critical-red/40 border-2 border-critical-red rounded" />
            <span className="text-sm">Top Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-electric-blue/40 border-2 border-electric-blue rounded" />
            <span className="text-sm">Intermediate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-tactical-green/40 border-2 border-tactical-green rounded-full" />
            <span className="text-sm">Basic Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-warning-amber/40 border-2 border-warning-amber rounded-full" />
            <span className="text-sm">Undeveloped</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-info-cyan/40 border-2 border-info-cyan rounded" />
            <span className="text-sm">House Event</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main FaultTree Component
// =============================================================================

export function FaultTree() {
  // Use sample fault tree data
  const [tree, setTree] = useState<ExtendedFaultTree>(sampleFaultTree);

  // View options
  const [showProbabilities, setShowProbabilities] = useState(true);
  const [highlightCutSets, setHighlightCutSets] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    // Initially expand all nodes
    const allNodes = new Set<string>();
    const collectNodes = (node: FaultTreeNodeType) => {
      allNodes.add(node.id);
      node.children?.forEach(collectNodes);
    };
    collectNodes(tree.rootNode);
    return allNodes;
  });

  // Single-point failure threshold (DAL A = 1e-9)
  const singlePointThreshold = 1e-9;

  // Collect cut set event IDs for highlighting
  const cutSetEventIds = useMemo(() => {
    const ids = new Set<string>();
    tree.minimalCutSets?.forEach(cs => {
      cs.basicEventIds.forEach(id => ids.add(id));
    });
    return ids;
  }, [tree.minimalCutSets]);

  // Editor state
  const [editingNode, setEditingNode] = useState<FaultTreeNodeType | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Toggle node expansion
  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // Expand all nodes
  const handleExpandAll = () => {
    const allNodes = new Set<string>();
    const collectNodes = (node: FaultTreeNodeType) => {
      allNodes.add(node.id);
      node.children?.forEach(collectNodes);
    };
    collectNodes(tree.rootNode);
    setExpandedNodes(allNodes);
  };

  // Collapse all nodes
  const handleCollapseAll = () => {
    setExpandedNodes(new Set([tree.rootNode.id]));
  };

  // Handle node edit
  const handleEditNode = (node: FaultTreeNodeType) => {
    setEditingNode(node);
    setEditDialogOpen(true);
  };

  // Handle node update
  const handleNodeUpdate = (updatedNode: FaultTreeNodeType) => {
    // Update node in tree (deep clone and update)
    const updateNodeInTree = (node: FaultTreeNodeType): FaultTreeNodeType => {
      if (node.id === updatedNode.id) {
        return updatedNode;
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNodeInTree),
        };
      }
      return node;
    };

    const updatedRootNode = updateNodeInTree(tree.rootNode);

    // Recalculate probabilities (cast to any to handle type differences between
    // the flexible local type and the strict utility function type)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recalculatedTree = calculateTreeProbabilities(updatedRootNode as any) as unknown as FaultTreeNodeType;

    setTree({
      ...tree,
      rootNode: recalculatedTree,
      topEventProbability: recalculatedTree.probability ?? tree.topEventProbability,
    });

    setEditingNode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Fault Tree Analysis</h2>
        <p className="text-muted-foreground mt-1">
          Quantitative fault tree analysis with probability calculations and importance measures
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">{tree.name}</Badge>
          <Badge variant="secondary">{tree.analysisType}</Badge>
          <Badge variant={tree.approvalStatus === 'Approved' ? 'default' : 'outline'}>
            {tree.approvalStatus}
          </Badge>
        </div>
      </div>

      {/* View Controls */}
      <div className="rounded-sm border border-border/40 p-4">
        <div className="flex flex-wrap items-center gap-6">
          {/* Probability toggle */}
          <div className="flex items-center gap-2">
            <Switch
              id="show-probabilities"
              checked={showProbabilities}
              onCheckedChange={setShowProbabilities}
            />
            <Label htmlFor="show-probabilities" className="cursor-pointer">
              <span className="flex items-center gap-1">
                {showProbabilities ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Show Probabilities
              </span>
            </Label>
          </div>

          {/* Cut set highlight toggle */}
          <div className="flex items-center gap-2">
            <Switch
              id="highlight-cutsets"
              checked={highlightCutSets}
              onCheckedChange={setHighlightCutSets}
            />
            <Label htmlFor="highlight-cutsets" className="cursor-pointer">
              Highlight Cut Sets
            </Label>
          </div>

          {/* Expand/Collapse buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExpandAll}>
              <Expand className="w-4 h-4 mr-1" />
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={handleCollapseAll}>
              <Minimize2 className="w-4 h-4 mr-1" />
              Collapse All
            </Button>
          </div>

          {/* Zoom slider */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <ZoomOut className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={[zoom]}
              onValueChange={(v) => setZoom(v[0])}
              min={50}
              max={150}
              step={10}
              className="flex-1"
            />
            <ZoomIn className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground w-12">{zoom}%</span>
          </div>
        </div>
      </div>

      {/* Gate Legend */}
      <GateLegendPanel />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fault Tree Visualization */}
        <div className="lg:col-span-2">
          <div className="rounded-sm border border-border/40 p-6 overflow-x-auto">
            <FaultTreeNode
              node={tree.rootNode}
              level={0}
              showProbabilities={showProbabilities}
              highlightCutSets={highlightCutSets}
              cutSetEventIds={cutSetEventIds}
              singlePointThreshold={singlePointThreshold}
              expandedNodes={expandedNodes}
              onToggleExpand={handleToggleExpand}
              onEditNode={handleEditNode}
              zoom={zoom}
            />
          </div>
        </div>

        {/* Quantitative Analysis Panel */}
        <div className="lg:col-span-1">
          <QuantitativeAnalysisPanel tree={tree} />
        </div>
      </div>

      {/* Minimal Cut Sets */}
      {tree.minimalCutSets && tree.minimalCutSets.length > 0 && (
        <MinimalCutSetsPanel
          cutSets={tree.minimalCutSets}
          topEventProbability={tree.topEventProbability}
        />
      )}

      {/* Importance Measures */}
      {tree.importanceMeasures && tree.importanceMeasures.length > 0 && (
        <ImportanceMeasuresPanel measures={tree.importanceMeasures} />
      )}

      {/* Basic Event Editor Dialog */}
      {editingNode && (
        <BasicEventEditor
          event={editingNode}
          onUpdate={handleNodeUpdate}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </div>
  );
}
