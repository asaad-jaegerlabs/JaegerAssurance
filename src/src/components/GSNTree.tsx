import React, { useState, useMemo } from 'react';
import {
 ChevronDown,
 ChevronRight,
 Shield,
 Target,
 FileText,
 CheckCircle,
 AlertCircle,
 Info,
 HelpCircle,
 Plus,
 X,
 ExternalLink,
 ArrowRight,
 Circle,
} from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
 Tooltip,
 TooltipContent,
 TooltipTrigger,
} from '@/components/ui/tooltip';
import { sampleGSNNodes } from '@/data/sampleData';
import type { GSNNode as SampleGSNNode, GSNEvidence, ConfidenceLevel, ComplianceMapping } from '@/data/sampleData';

// =============================================================================
// Types
// =============================================================================

type GSNNodeType = 'Goal' | 'Strategy' | 'Solution' | 'Context' | 'Assumption' | 'Justification';

interface GSNNode {
 id: string;
 type: GSNNodeType;
 label: string;
 description: string;
 status?: 'complete' | 'in-progress' | 'not-started';
 confidence?: ConfidenceLevel;
 complianceMapping?: ComplianceMapping[];
 evidence?: GSNEvidence[];
 children?: string[];
 parent?: string;
 linkedHazards?: string[];
 linkedRequirements?: string[];
 isAway?: boolean;
 awayReference?: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

function getEvidenceStatusColor(status: string): string {
 switch (status) {
 case 'approved':
 return 'bg-tactical-green text-white';
 case 'under-review':
 return 'bg-warning-amber text-white';
 case 'draft':
 return 'bg-muted/200 text-white';
 default:
 return 'bg-muted/200 text-white';
 }
}

function getComplianceStatusColor(status: string): string {
 switch (status) {
 case 'Compliant':
 case 'Complete':
 return 'bg-tactical-green';
 case 'Partial':
 return 'bg-warning-amber';
 case 'Non-Compliant':
 return 'bg-critical-red';
 default:
 return 'bg-muted/200';
 }
}

function getNodeConfig(type: GSNNodeType) {
 switch (type) {
 case 'Goal':
 return {
 bgColor: 'bg-electric-blue-dim',
 borderColor: 'border-electric-blue/40',
 textColor: 'text-electric-blue',
 icon: Shield,
 shape: 'rounded-sm', // Rectangle
 badgeVariant: 'default' as const,
 };
 case 'Strategy':
 return {
 bgColor: 'bg-muted/30',
 borderColor: 'border-muted-foreground/30',
 textColor: 'text-muted-foreground',
 icon: Target,
 shape: 'rounded-sm skew-x-[-6deg]', // Parallelogram effect
 badgeVariant: 'secondary' as const,
 };
 case 'Solution':
 return {
 bgColor: 'bg-tactical-green-dim',
 borderColor: 'border-tactical-green/40',
 textColor: 'text-tactical-green',
 icon: CheckCircle,
 shape: 'rounded-full', // Circle
 badgeVariant: 'default' as const,
 };
 case 'Context':
 return {
 bgColor: 'bg-muted/20',
 borderColor: 'border-border/40',
 textColor: 'text-foreground/80',
 icon: Info,
 shape: 'rounded-xl', // Rounded rectangle
 badgeVariant: 'outline' as const,
 };
 case 'Assumption':
 return {
 bgColor: 'bg-warning-amber-dim',
 borderColor: 'border-warning-amber/40',
 textColor: 'text-warning-amber',
 icon: AlertCircle,
 shape: 'rounded-[50%]', // Ellipse
 badgeVariant: 'secondary' as const,
 };
 case 'Justification':
 return {
 bgColor: 'bg-warning-amber-dim',
 borderColor: 'border-warning-amber/40',
 textColor: 'text-warning-amber',
 icon: HelpCircle,
 shape: 'rounded-[50%]', // Ellipse with J
 badgeVariant: 'secondary' as const,
 };
 default:
 return {
 bgColor: 'bg-muted/20',
 borderColor: 'border-border/40',
 textColor: 'text-foreground/80',
 icon: FileText,
 shape: 'rounded-sm',
 badgeVariant: 'outline' as const,
 };
 }
}

function getStatusColor(status?: string) {
 switch (status) {
 case 'complete':
 return 'bg-tactical-green';
 case 'in-progress':
 return 'bg-warning-amber';
 case 'not-started':
 return 'bg-muted-foreground/60';
 default:
 return 'bg-muted-foreground/40';
 }
}

// Build a tree structure from flat node array
function buildNodeTree(nodes: GSNNode[]): Map<string, GSNNode> {
 const nodeMap = new Map<string, GSNNode>();
 nodes.forEach((node) => nodeMap.set(node.id, node));
 return nodeMap;
}

// Find root nodes (nodes with no parent)
function findRootNodes(nodes: GSNNode[]): GSNNode[] {
 return nodes.filter((node) => !node.parent);
}

// =============================================================================
// Confidence Indicator Component
// =============================================================================

function ConfidenceIndicator({ confidence }: { confidence: ConfidenceLevel }) {
 const colors: Record<string, string> = {
 high: 'bg-tactical-green',
 medium: 'bg-warning-amber',
 low: 'bg-critical-red',
 };

 return (
 <Tooltip>
 <TooltipTrigger asChild>
 <div className="flex items-center gap-1 cursor-help">
 <div className={cn('w-2 h-2 rounded-full', colors[confidence.level])} />
 <span className="text-xs capitalize">{confidence.level}</span>
 </div>
 </TooltipTrigger>
 <TooltipContent className="max-w-xs">
 <p className="font-medium">Confidence: {confidence.level}</p>
 <p className="text-xs mt-1">{confidence.rationale}</p>
 </TooltipContent>
 </Tooltip>
 );
}

// =============================================================================
// Evidence Panel Component
// =============================================================================

function EvidencePanel({ node }: { node: GSNNode }) {
 return (
 <div className="space-y-3">
 <h4 className="font-semibold flex items-center gap-2">
 <FileText className="w-4 h-4"/>
 Linked Evidence ({node.evidence?.length || 0})
 </h4>
 {node.evidence?.map((ev) => (
 <div key={ev.id} className="p-3 bg-muted/20 rounded-sm border">
 <div className="flex items-start justify-between gap-2">
 <div className="flex-1 min-w-0">
 <Badge variant="secondary"className="mb-1">
 {ev.type}
 </Badge>
 <p className="font-medium mt-1 truncate">{ev.title}</p>
 <p className="text-xs text-muted-foreground truncate">{ev.location}</p>
 {ev.dateApproved && (
 <p className="text-xs text-muted-foreground mt-1">
 Approved: {ev.dateApproved}
 </p>
 )}
 </div>
 <Badge className={getEvidenceStatusColor(ev.status)}>{ev.status}</Badge>
 </div>
 </div>
 ))}
 <Button variant="outline"size="sm"className="w-full">
 <Plus className="w-4 h-4 mr-1"/>
 Link Evidence
 </Button>
 </div>
 );
}

// =============================================================================
// Compliance Mapping Panel Component
// =============================================================================

function ComplianceMappingPanel({ mappings }: { mappings: ComplianceMapping[] }) {
 return (
 <div className="space-y-3">
 <h4 className="font-semibold">Standards Compliance</h4>
 {mappings.map((mapping, idx) => (
 <div key={idx} className="p-2 border rounded bg-muted/20">
 <Badge variant="outline"className="mb-1">
 {mapping.standard}
 </Badge>
 <p className="text-sm mt-1 text-muted-foreground">{mapping.objective}</p>
 <Badge className={cn('mt-2', getComplianceStatusColor(mapping.status))}>
 {mapping.status}
 </Badge>
 </div>
 ))}
 </div>
 );
}

// =============================================================================
// Completeness Tracker Component
// =============================================================================

function CompletenessTracker({ nodes }: { nodes: GSNNode[] }) {
 const stats = useMemo(() => {
 const goals = nodes.filter((n) => n.type === 'Goal');
 const goalsWithEvidence = goals.filter(
 (g) =>
 g.status === 'complete' ||
 nodes.some(
 (n) =>
 n.type === 'Solution' &&
 n.parent === g.id &&
 n.evidence &&
 n.evidence.length > 0
 )
 );
 const percentage = goals.length > 0 ? (goalsWithEvidence.length / goals.length) * 100 : 0;

 const complete = nodes.filter((n) => n.status === 'complete').length;
 const inProgress = nodes.filter((n) => n.status === 'in-progress').length;
 const notStarted = nodes.filter((n) => n.status === 'not-started').length;

 return {
 goals,
 goalsWithEvidence,
 percentage,
 complete,
 inProgress,
 notStarted,
 };
 }, [nodes]);

 return (
 <Card>
 <CardHeader className="pb-2">
 <CardTitle className="text-base">Safety Case Completeness</CardTitle>
 </CardHeader>
 <CardContent>
 <Progress value={stats.percentage} className="h-3"/>
 <p className="text-sm mt-2 text-muted-foreground">
 {stats.goalsWithEvidence.length} of {stats.goals.length} goals have supporting evidence
 </p>
 <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
 <div className="p-2 bg-tactical-green-dim rounded">
 <div className="font-bold text-tactical-green">{stats.complete}</div>
 <div className="text-xs text-muted-foreground">Complete</div>
 </div>
 <div className="p-2 bg-warning-amber-dim rounded">
 <div className="font-bold text-warning-amber">{stats.inProgress}</div>
 <div className="text-xs text-muted-foreground">In Progress</div>
 </div>
 <div className="p-2 bg-muted/20 rounded">
 <div className="font-bold text-muted-foreground">{stats.notStarted}</div>
 <div className="text-xs text-muted-foreground">Not Started</div>
 </div>
 </div>
 </CardContent>
 </Card>
 );
}

// =============================================================================
// Node Detail Panel Component
// =============================================================================

function NodeDetailPanel({
 node,
 onClose,
}: {
 node: GSNNode;
 onClose: () => void;
}) {
 const config = getNodeConfig(node.type);
 const Icon = config.icon;

 return (
 <Card className={cn('border-l-4', config.borderColor)}>
 <CardHeader className="pb-2">
 <div className="flex justify-between items-start">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <Badge variant={config.badgeVariant} className={cn(config.bgColor, config.textColor)}>
 <Icon className="w-3 h-3 mr-1"/>
 {node.type}
 </Badge>
 {node.status && (
 <div className="flex items-center gap-1">
 <div className={cn('w-2 h-2 rounded-full', getStatusColor(node.status))} />
 <span className="text-xs capitalize">{node.status.replace('-', ' ')}</span>
 </div>
 )}
 {node.isAway && (
 <Badge variant="outline"className="border-dashed">
 <ExternalLink className="w-3 h-3 mr-1"/>
 Away
 </Badge>
 )}
 </div>
 <CardTitle className="text-lg">
 {node.id}: {node.label}
 </CardTitle>
 </div>
 <Button variant="ghost"size="icon"onClick={onClose}>
 <X className="w-4 h-4"/>
 </Button>
 </div>
 </CardHeader>
 <CardContent className="space-y-4">
 <p className="text-muted-foreground">{node.description}</p>

 {node.confidence && (
 <div className="p-3 bg-muted/20 rounded-sm">
 <h4 className="font-semibold text-sm mb-2">Confidence Assessment</h4>
 <ConfidenceIndicator confidence={node.confidence} />
 <p className="text-xs text-muted-foreground mt-2">
 {node.confidence.rationale}
 </p>
 </div>
 )}

 {node.linkedHazards && node.linkedHazards.length > 0 && (
 <div className="p-3 bg-critical-red-dim rounded-sm">
 <h4 className="font-semibold text-sm mb-2">Linked Hazards</h4>
 <div className="flex flex-wrap gap-1">
 {node.linkedHazards.map((hazard) => (
 <Badge key={hazard} variant="outline"className="text-critical-red border-critical-red/30">
 {hazard}
 </Badge>
 ))}
 </div>
 </div>
 )}

 {node.linkedRequirements && node.linkedRequirements.length > 0 && (
 <div className="p-3 bg-electric-blue-dim rounded-sm">
 <h4 className="font-semibold text-sm mb-2">Linked Requirements</h4>
 <div className="flex flex-wrap gap-1">
 {node.linkedRequirements.map((req) => (
 <Badge key={req} variant="outline"className="text-electric-blue border-electric-blue/30">
 {req}
 </Badge>
 ))}
 </div>
 </div>
 )}

 {node.isAway && node.awayReference && (
 <div className="p-3 bg-muted/30 rounded-sm">
 <h4 className="font-semibold text-sm mb-2">Away Reference</h4>
 <p className="text-sm text-muted-foreground">
 <ExternalLink className="w-3 h-3 inline mr-1"/>
 {node.awayReference}
 </p>
 </div>
 )}

 {node.evidence && node.evidence.length > 0 && <EvidencePanel node={node} />}

 {node.complianceMapping && node.complianceMapping.length > 0 && (
 <ComplianceMappingPanel mappings={node.complianceMapping} />
 )}
 </CardContent>
 </Card>
 );
}

// =============================================================================
// Summary Stats Component
// =============================================================================

function SummaryStats({ nodes }: { nodes: GSNNode[] }) {
 const stats = useMemo(() => {
 const byType: Record<string, number> = {
 Goal: 0,
 Strategy: 0,
 Solution: 0,
 Context: 0,
 Assumption: 0,
 Justification: 0,
 };

 let evidenceCount = 0;
 let approvedEvidence = 0;

 nodes.forEach((node) => {
 byType[node.type] = (byType[node.type] || 0) + 1;
 if (node.evidence) {
 evidenceCount += node.evidence.length;
 approvedEvidence += node.evidence.filter((e) => e.status === 'approved').length;
 }
 });

 const complete = nodes.filter((n) => n.status === 'complete').length;
 const total = nodes.filter((n) => n.status !== undefined).length;
 const completionPercent = total > 0 ? Math.round((complete / total) * 100) : 0;

 const evidenceCoverage =
 evidenceCount > 0 ? Math.round((approvedEvidence / evidenceCount) * 100) : 0;

 return { byType, evidenceCount, approvedEvidence, completionPercent, evidenceCoverage };
 }, [nodes]);

 const typeConfig = [
 { type: 'Goal', icon: Shield, color: 'text-electric-blue' },
 { type: 'Strategy', icon: Target, color: 'text-muted-foreground' },
 { type: 'Solution', icon: CheckCircle, color: 'text-tactical-green' },
 { type: 'Context', icon: Info, color: 'text-muted-foreground' },
 { type: 'Assumption', icon: AlertCircle, color: 'text-warning-amber' },
 { type: 'Justification', icon: HelpCircle, color: 'text-warning-amber' },
 ];

 return (
 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
 {typeConfig.map(({ type, icon: Icon, color }) => (
 <div
 key={type}
 className="p-3 bg-card border rounded-sm text-center"
 >
 <Icon className={cn('w-5 h-5 mx-auto mb-1', color)} />
 <div className="font-bold text-lg">{stats.byType[type] || 0}</div>
 <div className="text-xs text-muted-foreground">{type}s</div>
 </div>
 ))}
 <div className="p-3 bg-card border rounded-sm text-center">
 <Circle className="w-5 h-5 mx-auto mb-1 text-tactical-green"/>
 <div className="font-bold text-lg">{stats.completionPercent}%</div>
 <div className="text-xs text-muted-foreground">Complete</div>
 </div>
 <div className="p-3 bg-card border rounded-sm text-center">
 <FileText className="w-5 h-5 mx-auto mb-1 text-info-cyan"/>
 <div className="font-bold text-lg">{stats.evidenceCoverage}%</div>
 <div className="text-xs text-muted-foreground">Evidence</div>
 </div>
 </div>
 );
}

// =============================================================================
// GSN Node Component
// =============================================================================

function GSNNodeComponent({
 node,
 nodeMap,
 level = 0,
 selectedNode,
 onSelectNode,
}: {
 node: GSNNode;
 nodeMap: Map<string, GSNNode>;
 level?: number;
 selectedNode: string | null;
 onSelectNode: (nodeId: string | null) => void;
}) {
 const [isExpanded, setIsExpanded] = useState(true);

 const childNodes = node.children
 ?.map((childId) => nodeMap.get(childId))
 .filter((n): n is GSNNode => n !== undefined) || [];

 const hasChildren = childNodes.length > 0;
 const config = getNodeConfig(node.type);
 const Icon = config.icon;
 const isSelected = selectedNode === node.id;

 // For Solution type, use different styling (more circular)
 const isSolution = node.type === 'Solution';
 const isContextual = node.type === 'Context' || node.type === 'Assumption' || node.type === 'Justification';

 return (
 <div className="relative">
 <div className="flex items-start gap-2">
 {hasChildren ? (
 <button
 onClick={() => setIsExpanded(!isExpanded)}
 className="mt-3 text-muted-foreground hover:text-foreground flex-shrink-0"
 >
 {isExpanded ? <ChevronDown className="w-5 h-5"/> : <ChevronRight className="w-5 h-5"/>}
 </button>
 ) : (
 <div className="w-5 flex-shrink-0"/>
 )}

 <div className="flex-1">
 <button
 onClick={() => onSelectNode(isSelected ? null : node.id)}
 className={cn(
 'w-full text-left border-2 p-4 shadow-sm hover:shadow-md transition-all',
 config.bgColor,
 config.borderColor,
 isSolution ? 'rounded-full px-6' : config.shape,
 node.isAway && 'border-dashed',
 isSelected && 'ring-2 ring-offset-2 ring-electric-blue ring-offset-[var(--bg-base)]'
 )}
 >
 <div className={cn('flex items-start gap-3', node.type === 'Strategy' && 'skew-x-[6deg]')}>
 <div className="flex items-center gap-2 flex-shrink-0 mt-1">
 <Icon className={cn('w-5 h-5', config.textColor)} />
 {node.isAway && <ArrowRight className="w-4 h-4 text-muted-foreground/70"/>}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 flex-wrap mb-1">
 <span className="text-xs px-2 py-0.5 bg-muted/40 rounded font-mono">
 {node.id}
 </span>
 <span
 className={cn(
 'text-xs px-2 py-0.5 rounded capitalize',
 config.bgColor,
 config.textColor
 )}
 >
 {node.type}
 </span>
 {node.status && (
 <div className="flex items-center gap-1">
 <div className={cn('w-2 h-2 rounded-full', getStatusColor(node.status))} />
 <span className="text-xs capitalize">{node.status.replace('-', ' ')}</span>
 </div>
 )}
 {node.confidence && <ConfidenceIndicator confidence={node.confidence} />}
 {node.evidence && node.evidence.length > 0 && (
 <Badge variant="outline"className="text-xs">
 <FileText className="w-3 h-3 mr-1"/>
 {node.evidence.length}
 </Badge>
 )}
 {node.isAway && (
 <Badge variant="outline"className="text-xs border-dashed">
 Away
 </Badge>
 )}
 </div>
 <div className={cn('font-medium', config.textColor)}>{node.label}</div>
 {!isSolution && !isContextual && (
 <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
 {node.description}
 </p>
 )}
 </div>
 </div>
 </button>

 {hasChildren && isExpanded && (
 <div className="ml-6 mt-3 border-l-2 border-border/30 pl-4 space-y-3">
 {childNodes.map((child) => (
 <GSNNodeComponent
 key={child.id}
 node={child}
 nodeMap={nodeMap}
 level={level + 1}
 selectedNode={selectedNode}
 onSelectNode={onSelectNode}
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
// Legend Component
// =============================================================================

function GSNLegend() {
 const legendItems = [
 { type: 'Goal', icon: Shield, color: 'text-electric-blue', shape: 'Rectangle' },
 { type: 'Strategy', icon: Target, color: 'text-muted-foreground', shape: 'Parallelogram' },
 { type: 'Solution', icon: CheckCircle, color: 'text-tactical-green', shape: 'Circle' },
 { type: 'Context', icon: Info, color: 'text-muted-foreground', shape: 'Rounded Rectangle' },
 { type: 'Assumption', icon: AlertCircle, color: 'text-warning-amber', shape: 'Ellipse (A)' },
 { type: 'Justification', icon: HelpCircle, color: 'text-warning-amber', shape: 'Ellipse (J)' },
 ];

 return (
 <div className="bg-muted/20 border border-border/40 rounded-sm p-4">
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
 {legendItems.map(({ type, icon: Icon, color, shape }) => (
 <Tooltip key={type}>
 <TooltipTrigger asChild>
 <div className="flex items-center gap-2 cursor-help">
 <Icon className={cn('w-4 h-4', color)} />
 <span>{type}</span>
 </div>
 </TooltipTrigger>
 <TooltipContent>
 <p>{type}: {shape}</p>
 </TooltipContent>
 </Tooltip>
 ))}
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/30 text-sm">
 <div className="flex items-center gap-2">
 <div className="w-3 h-3 rounded-full bg-tactical-green"/>
 <span>Complete - Evidence provided and verified</span>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-3 h-3 rounded-full bg-warning-amber"/>
 <span>In Progress - Work ongoing</span>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-3 h-3 rounded-full bg-muted-foreground/60"/>
 <span>Not Started - Planned work</span>
 </div>
 </div>
 </div>
 );
}

// =============================================================================
// Main GSNTree Component
// =============================================================================

export function GSNTree() {
 const [selectedNode, setSelectedNode] = useState<string | null>(null);

 // Cast sample data to our local type
 const nodes = sampleGSNNodes as unknown as GSNNode[];
 const nodeMap = useMemo(() => buildNodeTree(nodes), [nodes]);
 const rootNodes = useMemo(() => findRootNodes(nodes), [nodes]);

 const selectedNodeData = selectedNode ? nodeMap.get(selectedNode) : null;

 return (
 <div className="space-y-6">
 {/* Header */}
 <div>
 <h2 className="text-2xl font-bold">Goal Structured Notation Tree</h2>
 <p className="text-muted-foreground mt-1">
 Interactive safety argument structure showing goals, strategies, and supporting evidence per GSN Standard Version 2
 </p>
 </div>

 {/* Summary Stats */}
 <SummaryStats nodes={nodes} />

 {/* Completeness Tracker */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2">
 <CompletenessTracker nodes={nodes} />
 </div>
 <div className="flex items-center justify-center">
 <Card className="w-full">
 <CardHeader className="pb-2">
 <CardTitle className="text-base">Quick Actions</CardTitle>
 </CardHeader>
 <CardContent className="space-y-2">
 <Button variant="outline"size="sm"className="w-full justify-start">
 <Plus className="w-4 h-4 mr-2"/>
 Add New Goal
 </Button>
 <Button variant="outline"size="sm"className="w-full justify-start">
 <FileText className="w-4 h-4 mr-2"/>
 Export Safety Case
 </Button>
 <Button variant="outline"size="sm"className="w-full justify-start">
 <CheckCircle className="w-4 h-4 mr-2"/>
 Validate Completeness
 </Button>
 </CardContent>
 </Card>
 </div>
 </div>

 {/* Legend */}
 <GSNLegend />

 {/* Main Content */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Tree View */}
 <div className={cn('bg-card border border-border/40 rounded-sm p-6', selectedNodeData ? 'lg:col-span-2' : 'lg:col-span-3')}>
 <div className="space-y-4">
 {rootNodes.map((rootNode) => (
 <GSNNodeComponent
 key={rootNode.id}
 node={rootNode}
 nodeMap={nodeMap}
 selectedNode={selectedNode}
 onSelectNode={setSelectedNode}
 />
 ))}
 </div>
 </div>

 {/* Detail Panel */}
 {selectedNodeData && (
 <div className="lg:col-span-1">
 <NodeDetailPanel node={selectedNodeData} onClose={() => setSelectedNode(null)} />
 </div>
 )}
 </div>
 </div>
 );
}
