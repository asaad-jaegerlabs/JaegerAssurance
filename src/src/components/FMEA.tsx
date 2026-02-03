import React, { useState, useMemo } from 'react';
import { sampleFMEAItems, type ExtendedFMEAItem } from '@/data/sampleData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Plus, Edit, Trash2, Filter, Download, BarChart3, Link, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, TooltipProps } from 'recharts';

/**
 * FMEA (Failure Modes and Effects Analysis) Component
 *
 * Aerospace FMECA module aligned with SAE ARP4761A and MIL-STD-1629A standards.
 * Provides comprehensive failure mode analysis with RPN (Risk Priority Number) calculations,
 * severity filtering, Pareto analysis, and cross-references to hazards and fault trees.
 */

// =============================================================================
// Rating Scales (Aerospace-specific per SAE ARP4761A / MIL-STD-1629A)
// =============================================================================

const severityScale = [
 { rating: 10, description: 'Hazardous without warning - affects safe operation, no warning' },
 { rating: 9, description: 'Hazardous with warning - affects safe operation, with warning' },
 { rating: 8, description: 'Very High - item inoperable, loss of primary function' },
 { rating: 7, description: 'High - item operable but at reduced level of performance' },
 { rating: 6, description: 'Moderate - item operable but comfort item inoperable' },
 { rating: 5, description: 'Low - item operable but comfort item at reduced performance' },
 { rating: 4, description: 'Very Low - fit & finish/squeak & rattle item does not conform' },
 { rating: 3, description: 'Minor - fit & finish/squeak & rattle item noticed by average customer' },
 { rating: 2, description: 'Very Minor - fit & finish/squeak & rattle item noticed by discriminating customer' },
 { rating: 1, description: 'None - no effect' },
];

const occurrenceScale = [
 { rating: 10, description: 'Very High: Failure is almost inevitable (>= 1 in 2)' },
 { rating: 9, description: 'High (1 in 3)' },
 { rating: 8, description: 'High (1 in 8)' },
 { rating: 7, description: 'Moderate (1 in 20)' },
 { rating: 6, description: 'Moderate (1 in 80)' },
 { rating: 5, description: 'Moderate (1 in 400)' },
 { rating: 4, description: 'Low (1 in 2,000)' },
 { rating: 3, description: 'Low (1 in 15,000)' },
 { rating: 2, description: 'Very Low (1 in 150,000)' },
 { rating: 1, description: 'Remote: Failure is unlikely (<= 1 in 1,500,000)' },
];

const detectionScale = [
 { rating: 10, description: 'Absolute Uncertainty: Design control cannot detect' },
 { rating: 9, description: 'Very Remote: Very remote chance of detection' },
 { rating: 8, description: 'Remote: Remote chance of detection' },
 { rating: 7, description: 'Very Low: Very low chance of detection' },
 { rating: 6, description: 'Low: Low chance of detection' },
 { rating: 5, description: 'Moderate: Moderate chance of detection' },
 { rating: 4, description: 'Moderately High: Moderately high chance of detection' },
 { rating: 3, description: 'High: High chance of detection' },
 { rating: 2, description: 'Very High: Very high chance of detection' },
 { rating: 1, description: 'Almost Certain: Design control will detect' },
];

// =============================================================================
// Type Definitions
// =============================================================================

type SortField = 'rpn' | 'severity' | 'component' | 'id';
type SortDirection = 'asc' | 'desc';

interface CustomTooltipPayload {
 id: string;
 componentName: string;
 failureMode: string;
 rpn: number;
 severity: number;
 occurrence: number;
 detection: number;
}

// =============================================================================
// Helper Components
// =============================================================================

/**
 * RPN Badge with color coding based on risk level
 * - Red (>100): High priority - immediate action required
 * - Orange (>50): Medium priority - action recommended
 * - Green (<=50): Low priority - monitor
 */
function RPNBadge({ rpn }: { rpn: number }) {
 const getColor = () => {
 if (rpn > 100) return 'bg-critical-red text-white';
 if (rpn > 50) return 'bg-warning-amber text-white';
 return 'bg-tactical-green text-white';
 };

 return <span className={`px-2 py-1 rounded font-bold ${getColor()}`}>{rpn}</span>;
}

/**
 * Summary card for displaying key metrics
 */
function SummaryCard({
 title,
 value,
 color
}: {
 title: string;
 value: number;
 color: 'blue' | 'red' | 'orange' | 'gray';
}) {
 const bgColors: Record<string, string> = {
 blue: 'bg-electric-blue-dim border-electric-blue/30',
 red: 'bg-critical-red-dim border-critical-red/30',
 orange: 'bg-warning-amber-dim border-warning-amber/30',
 gray: 'bg-muted/20 border-border/40',
 };

 const textColors: Record<string, string> = {
 blue: 'text-electric-blue',
 red: 'text-critical-red',
 orange: 'text-warning-amber',
 gray: 'text-foreground ',
 };

 return (
 <Card className={`${bgColors[color]} border tactical-corners`}>
 <CardContent className="pt-4">
 <div className={`data-label ${textColors[color]}`}>{title}</div>
 <div className={`data-value-large ${textColors[color]}`}>{value}</div>
 </CardContent>
 </Card>
 );
}

/**
 * Rating scale display component
 */
function RatingScale({
 title,
 items
}: {
 title: string;
 items: { rating: number; description: string }[];
}) {
 return (
 <div>
 <h4 className="font-semibold mb-2">{title}</h4>
 <div className="space-y-1 text-sm">
 {items.slice(0, 5).map((item) => (
 <div key={item.rating} className="flex gap-2">
 <span className="font-mono w-6 text-foreground/80">{item.rating}</span>
 <span className="text-muted-foreground truncate">{item.description}</span>
 </div>
 ))}
 </div>
 </div>
 );
}

/**
 * Custom tooltip for the Pareto chart
 */
function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
 if (!active || !payload || payload.length === 0) return null;

 const data = payload[0].payload as CustomTooltipPayload;

 return (
 <div className="bg-card p-3 rounded-sm shadow-lg border border-border/40">
 <p className="font-semibold text-foreground">{data.id}</p>
 <p className="text-sm text-muted-foreground">{data.componentName}</p>
 <p className="text-sm text-muted-foreground max-w-xs truncate">{data.failureMode}</p>
 <div className="mt-2 pt-2 border-t border-border/30">
 <p className="text-sm">
 <span className="font-medium">RPN:</span>{' '}
 <span className={data.rpn > 100 ? 'text-critical-red' : data.rpn > 50 ? 'text-warning-amber' : 'text-tactical-green'}>
 {data.rpn}
 </span>
 </p>
 <p className="text-xs text-muted-foreground">
 S={data.severity} x O={data.occurrence} x D={data.detection}
 </p>
 </div>
 </div>
 );
}

/**
 * Severity badge with color coding
 */
function SeverityBadge({ severity }: { severity: number }) {
 if (severity >= 9) {
 return <Badge variant="destructive">{severity}</Badge>;
 }
 if (severity >= 7) {
 return <Badge className="bg-warning-amber text-white hover:bg-warning-amber/80">{severity}</Badge>;
 }
 if (severity >= 5) {
 return <Badge className="bg-warning-amber text-white hover:bg-warning-amber/80">{severity}</Badge>;
 }
 return <Badge variant="secondary">{severity}</Badge>;
}

// =============================================================================
// Main FMEA Component
// =============================================================================

export function FMEA() {
 const [items, setItems] = useState<ExtendedFMEAItem[]>(sampleFMEAItems);
 const [sortField, setSortField] = useState<SortField>('rpn');
 const [sortDir, setSortDir] = useState<SortDirection>('desc');
 const [filterSeverity, setFilterSeverity] = useState<number | 'all'>('all');
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedItem, setSelectedItem] = useState<ExtendedFMEAItem | null>(null);
 const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

 // Sorted and filtered items
 const sortedItems = useMemo(() => {
 return [...items]
 .filter((item) => {
 // Severity filter
 if (filterSeverity !== 'all' && item.severity < filterSeverity) {
 return false;
 }
 // Search filter
 if (searchTerm) {
 const term = searchTerm.toLowerCase();
 return (
 item.id.toLowerCase().includes(term) ||
 item.componentName.toLowerCase().includes(term) ||
 item.failureMode.toLowerCase().includes(term) ||
 item.function.toLowerCase().includes(term)
 );
 }
 return true;
 })
 .sort((a, b) => {
 let aVal: number | string;
 let bVal: number | string;

 switch (sortField) {
 case 'rpn':
 aVal = a.rpn;
 bVal = b.rpn;
 break;
 case 'severity':
 aVal = a.severity;
 bVal = b.severity;
 break;
 case 'component':
 aVal = a.componentName;
 bVal = b.componentName;
 break;
 case 'id':
 aVal = a.id;
 bVal = b.id;
 break;
 default:
 return 0;
 }

 if (typeof aVal === 'string' && typeof bVal === 'string') {
 return sortDir === 'desc'
 ? bVal.localeCompare(aVal)
 : aVal.localeCompare(bVal);
 }

 return sortDir === 'desc'
 ? (bVal as number) - (aVal as number)
 : (aVal as number) - (bVal as number);
 });
 }, [items, sortField, sortDir, filterSeverity, searchTerm]);

 // Summary statistics
 const stats = useMemo(() => ({
 total: items.length,
 highRPN: items.filter((i) => i.rpn > 100).length,
 highSeverity: items.filter((i) => i.severity >= 9).length,
 avgRPN: items.length > 0
 ? Math.round(items.reduce((sum, i) => sum + i.rpn, 0) / items.length)
 : 0,
 }), [items]);

 // Handle column header click for sorting
 const handleSort = (field: SortField) => {
 if (sortField === field) {
 setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
 } else {
 setSortField(field);
 setSortDir('desc');
 }
 };

 // Render sort indicator
 const renderSortIndicator = (field: SortField) => {
 if (sortField !== field) return null;
 return sortDir === 'desc'
 ? <ChevronDown className="w-4 h-4 inline ml-1"/>
 : <ChevronUp className="w-4 h-4 inline ml-1"/>;
 };

 // Handle item detail view
 const handleViewDetails = (item: ExtendedFMEAItem) => {
 setSelectedItem(item);
 setIsDetailDialogOpen(true);
 };

 // Export to CSV
 const handleExport = () => {
 const headers = [
 'ID', 'Component', 'Function', 'Failure Mode', 'Local Effect', 'System Effect',
 'Severity', 'Occurrence', 'Detection', 'RPN', 'Current Controls', 'Recommended Actions'
 ];

 const rows = sortedItems.map((item) => [
 item.id,
 item.componentName,
 item.function,
 item.failureMode,
 item.localEffect,
 item.systemEffect,
 item.severity,
 item.occurrence,
 item.detection,
 item.rpn,
 item.currentControls,
 item.recommendedActions,
 ]);

 const csv = [
 headers.join(','),
 ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
 ].join('\n');

 const blob = new Blob([csv], { type: 'text/csv' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = 'fmea_export.csv';
 a.click();
 URL.revokeObjectURL(url);
 };

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex justify-between items-center flex-wrap gap-4">
 <div>
 <h2 className="text-2xl font-bold text-foreground">
 Failure Modes and Effects Analysis
 </h2>
 <p className="text-muted-foreground">
 Design FMEA for Flight Management System (SAE ARP4761A aligned)
 </p>
 </div>
 <div className="flex gap-2">
 <Button variant="outline"onClick={handleExport}>
 <Download className="w-4 h-4 mr-2"/>
 Export
 </Button>
 <Button>
 <Plus className="w-4 h-4 mr-2"/>
 Add Item
 </Button>
 </div>
 </div>

 {/* Summary Cards */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 <SummaryCard title="Total Items"value={stats.total} color="blue"/>
 <SummaryCard title="High RPN (>100)"value={stats.highRPN} color="red"/>
 <SummaryCard title="Severity 9-10"value={stats.highSeverity} color="orange"/>
 <SummaryCard title="Avg RPN"value={stats.avgRPN} color="gray"/>
 </div>

 {/* Pareto Chart */}
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <BarChart3 className="w-5 h-5"/>
 RPN Pareto Chart (Top 10)
 </CardTitle>
 </CardHeader>
 <CardContent className="scanline-overlay">
 <ResponsiveContainer width="100%"height={250}>
 <BarChart data={sortedItems.slice(0, 10)} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
 <XAxis
 dataKey="id"
 tick={{ fontSize: 10 }}
 angle={-45}
 textAnchor="end"
 height={60}
 />
 <YAxis />
 <Tooltip content={<CustomTooltip />} />
 <Bar dataKey="rpn"name="RPN">
 {sortedItems.slice(0, 10).map((entry) => (
 <Cell
 key={entry.id}
 fill={entry.rpn > 100 ? '#ef4444' : entry.rpn > 50 ? '#f59e0b' : '#22c55e'}
 />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </CardContent>
 </Card>

 {/* FMEA Table */}
 <Card>
 <CardHeader>
 <div className="flex justify-between items-center flex-wrap gap-4">
 <CardTitle>FMEA Worksheet</CardTitle>
 <div className="flex gap-2 flex-wrap">
 {/* Search Input */}
 <div className="relative">
 <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/70"/>
 <Input
 placeholder="Search..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="pl-9 w-48"
 />
 </div>

 {/* Severity Filter */}
 <Select
 value={String(filterSeverity)}
 onValueChange={(v) => setFilterSeverity(v === 'all' ? 'all' : parseInt(v))}
 >
 <SelectTrigger className="w-40">
 <Filter className="w-4 h-4 mr-2"/>
 <SelectValue placeholder="Filter Severity"/>
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all">All Severities</SelectItem>
 <SelectItem value="9">Severity &gt;= 9</SelectItem>
 <SelectItem value="7">Severity &gt;= 7</SelectItem>
 <SelectItem value="5">Severity &gt;= 5</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 </CardHeader>
 <CardContent>
 <div className="overflow-x-auto">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead
 className="cursor-pointer hover:bg-electric-blue-dim/50"
 onClick={() => handleSort('id')}
 >
 ID {renderSortIndicator('id')}
 </TableHead>
 <TableHead
 className="cursor-pointer hover:bg-electric-blue-dim/50"
 onClick={() => handleSort('component')}
 >
 Component {renderSortIndicator('component')}
 </TableHead>
 <TableHead>Function</TableHead>
 <TableHead>Failure Mode</TableHead>
 <TableHead>Local Effect</TableHead>
 <TableHead>System Effect</TableHead>
 <TableHead
 className="cursor-pointer text-center hover:bg-electric-blue-dim/50"
 onClick={() => handleSort('severity')}
 >
 S {renderSortIndicator('severity')}
 </TableHead>
 <TableHead className="text-center">O</TableHead>
 <TableHead className="text-center">D</TableHead>
 <TableHead
 className="cursor-pointer text-center hover:bg-electric-blue-dim/50"
 onClick={() => handleSort('rpn')}
 >
 RPN {renderSortIndicator('rpn')}
 </TableHead>
 <TableHead>Current Controls</TableHead>
 <TableHead>Recommended Actions</TableHead>
 <TableHead>Links</TableHead>
 <TableHead>Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {sortedItems.map((item) => (
 <TableRow
 key={item.id}
 className={item.rpn > 100 ? 'bg-critical-red-dim' : ''}
 >
 <TableCell className="font-mono text-sm">{item.id}</TableCell>
 <TableCell className="max-w-32">
 <span className="truncate block"title={item.componentName}>
 {item.componentName}
 </span>
 </TableCell>
 <TableCell className="max-w-32">
 <span className="truncate block"title={item.function}>
 {item.function}
 </span>
 </TableCell>
 <TableCell className="max-w-40">
 <span className="truncate block"title={item.failureMode}>
 {item.failureMode}
 </span>
 </TableCell>
 <TableCell className="max-w-32">
 <span className="truncate block"title={item.localEffect}>
 {item.localEffect}
 </span>
 </TableCell>
 <TableCell className="max-w-32">
 <span className="truncate block"title={item.systemEffect}>
 {item.systemEffect}
 </span>
 </TableCell>
 <TableCell className="text-center">
 <SeverityBadge severity={item.severity} />
 </TableCell>
 <TableCell className="text-center">{item.occurrence}</TableCell>
 <TableCell className="text-center">{item.detection}</TableCell>
 <TableCell className="text-center">
 <RPNBadge rpn={item.rpn} />
 </TableCell>
 <TableCell className="max-w-40">
 <span className="truncate block"title={item.currentControls}>
 {item.currentControls}
 </span>
 </TableCell>
 <TableCell className="max-w-40">
 <span className="truncate block"title={item.recommendedActions}>
 {item.recommendedActions}
 </span>
 </TableCell>
 <TableCell>
 <div className="flex gap-1">
 {item.linkedHazards && item.linkedHazards.length > 0 && (
 <Badge
 variant="outline"
 title={`Linked Hazards: ${item.linkedHazards.join(', ')}`}
 className="cursor-help"
 >
 <Link className="w-3 h-3 mr-1"/>
 {item.linkedHazards.length}
 </Badge>
 )}
 {item.linkedFaultTreeEvents && item.linkedFaultTreeEvents.length > 0 && (
 <Badge
 variant="outline"
 title={`Linked FT Events: ${item.linkedFaultTreeEvents.join(', ')}`}
 className="cursor-help"
 >
 <AlertTriangle className="w-3 h-3 mr-1"/>
 {item.linkedFaultTreeEvents.length}
 </Badge>
 )}
 </div>
 </TableCell>
 <TableCell>
 <div className="flex gap-1">
 <Button
 variant="ghost"
 size="sm"
 onClick={() => handleViewDetails(item)}
 title="View Details"
 >
 <Edit className="w-4 h-4"/>
 </Button>
 <Button
 variant="ghost"
 size="sm"
 title="Delete"
 className="text-critical-red hover:text-critical-red hover:bg-critical-red-dim"
 >
 <Trash2 className="w-4 h-4"/>
 </Button>
 </div>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </div>

 {sortedItems.length === 0 && (
 <div className="text-center py-8 text-muted-foreground">
 No items match the current filters
 </div>
 )}
 </CardContent>
 </Card>

 {/* FMEA Legend / Rating Scales */}
 <Card>
 <CardHeader>
 <CardTitle>Rating Scales (SAE ARP4761A / MIL-STD-1629A)</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <RatingScale title="Severity (S)"items={severityScale} />
 <RatingScale title="Occurrence (O)"items={occurrenceScale} />
 <RatingScale title="Detection (D)"items={detectionScale} />
 </div>
 <div className="mt-4 pt-4 border-t border-border/30">
 <p className="text-sm text-muted-foreground">
 <strong>RPN</strong> (Risk Priority Number) = Severity x Occurrence x Detection.
 Range: 1-1000. Action thresholds: &gt;100 (High Priority), &gt;50 (Medium Priority), &lt;=50 (Monitor).
 </p>
 </div>
 </CardContent>
 </Card>

 {/* Detail Dialog */}
 <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
 <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
 <DialogHeader>
 <DialogTitle className="flex items-center gap-2">
 <AlertTriangle className="w-5 h-5 text-warning-amber"/>
 FMEA Item Details: {selectedItem?.id}
 </DialogTitle>
 </DialogHeader>

 {selectedItem && (
 <div className="space-y-4">
 {/* Component Info */}
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-sm font-medium text-muted-foreground">Component</label>
 <p className="text-foreground">{selectedItem.componentName}</p>
 </div>
 <div>
 <label className="text-sm font-medium text-muted-foreground">Component ID</label>
 <p className="font-mono text-foreground">{selectedItem.componentId}</p>
 </div>
 </div>

 {/* Function */}
 <div>
 <label className="text-sm font-medium text-muted-foreground">Function</label>
 <p className="text-foreground">{selectedItem.function}</p>
 </div>

 {/* Failure Mode & Mechanism */}
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-sm font-medium text-muted-foreground">Failure Mode</label>
 <p className="text-foreground">{selectedItem.failureMode}</p>
 </div>
 <div>
 <label className="text-sm font-medium text-muted-foreground">Failure Mechanism</label>
 <p className="text-foreground">{selectedItem.failureMechanism}</p>
 </div>
 </div>

 {/* Effects */}
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-sm font-medium text-muted-foreground">Local Effect</label>
 <p className="text-foreground">{selectedItem.localEffect}</p>
 </div>
 <div>
 <label className="text-sm font-medium text-muted-foreground">System Effect</label>
 <p className="text-foreground">{selectedItem.systemEffect}</p>
 </div>
 </div>

 {/* RPN Breakdown */}
 <div className="bg-muted/20 rounded-sm p-4">
 <h4 className="font-semibold mb-3">Risk Assessment</h4>
 <div className="grid grid-cols-4 gap-4 text-center">
 <div>
 <div className="text-2xl font-bold">
 <SeverityBadge severity={selectedItem.severity} />
 </div>
 <div className="text-sm text-muted-foreground mt-1">Severity</div>
 </div>
 <div>
 <div className="text-2xl font-bold text-foreground">
 {selectedItem.occurrence}
 </div>
 <div className="text-sm text-muted-foreground mt-1">Occurrence</div>
 </div>
 <div>
 <div className="text-2xl font-bold text-foreground">
 {selectedItem.detection}
 </div>
 <div className="text-sm text-muted-foreground mt-1">Detection</div>
 </div>
 <div>
 <div className="text-2xl font-bold">
 <RPNBadge rpn={selectedItem.rpn} />
 </div>
 <div className="text-sm text-muted-foreground mt-1">RPN</div>
 </div>
 </div>
 </div>

 {/* Controls & Actions */}
 <div>
 <label className="text-sm font-medium text-muted-foreground">Current Controls</label>
 <p className="text-foreground">{selectedItem.currentControls}</p>
 </div>

 <div>
 <label className="text-sm font-medium text-muted-foreground">Recommended Actions</label>
 <p className="text-foreground">{selectedItem.recommendedActions}</p>
 </div>

 {/* Responsibility */}
 {(selectedItem.responsible || selectedItem.targetDate) && (
 <div className="grid grid-cols-2 gap-4">
 {selectedItem.responsible && (
 <div>
 <label className="text-sm font-medium text-muted-foreground">Responsible</label>
 <p className="text-foreground">{selectedItem.responsible}</p>
 </div>
 )}
 {selectedItem.targetDate && (
 <div>
 <label className="text-sm font-medium text-muted-foreground">Target Date</label>
 <p className="text-foreground">{selectedItem.targetDate}</p>
 </div>
 )}
 </div>
 )}

 {/* Action Taken & New RPN */}
 {selectedItem.actionTaken && (
 <div className="bg-tactical-green-dim/30 rounded-sm p-4">
 <h4 className="font-semibold mb-2 text-tactical-green">Action Taken</h4>
 <p className="text-tactical-green mb-3">{selectedItem.actionTaken}</p>
 {selectedItem.newRpn && (
 <div className="flex items-center gap-4">
 <span className="text-sm text-muted-foreground">New RPN:</span>
 <RPNBadge rpn={selectedItem.newRpn} />
 <span className="text-sm text-muted-foreground">
 (S={selectedItem.newSeverity}, O={selectedItem.newOccurrence}, D={selectedItem.newDetection})
 </span>
 </div>
 )}
 </div>
 )}

 {/* Cross-references */}
 {((selectedItem.linkedHazards && selectedItem.linkedHazards.length > 0) ||
 (selectedItem.linkedFaultTreeEvents && selectedItem.linkedFaultTreeEvents.length > 0)) && (
 <div className="border-t pt-4">
 <h4 className="font-semibold mb-2">Cross-References</h4>
 <div className="flex flex-wrap gap-2">
 {selectedItem.linkedHazards?.map((hazId) => (
 <Badge key={hazId} variant="outline"className="cursor-pointer">
 <Link className="w-3 h-3 mr-1"/>
 {hazId}
 </Badge>
 ))}
 {selectedItem.linkedFaultTreeEvents?.map((eventId) => (
 <Badge key={eventId} variant="outline"className="cursor-pointer">
 <AlertTriangle className="w-3 h-3 mr-1"/>
 {eventId}
 </Badge>
 ))}
 </div>
 </div>
 )}
 </div>
 )}
 </DialogContent>
 </Dialog>
 </div>
 );
}

export default FMEA;
