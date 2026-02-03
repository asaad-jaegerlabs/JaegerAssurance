/**
 * TraceabilityMatrix Component
 *
 * Provides bidirectional traceability between hazards, requirements, tests, and evidence
 * for DO-178C/ARP4761A compliance. Supports matrix view, chain view, and gap analysis.
 *
 * @module components/TraceabilityMatrix
 */

import React, { useState, useMemo } from 'react';
import {
 sampleHazards,
 sampleRequirements,
 sampleEvidence,
 sampleFMEAItems,
 type ExtendedHazard,
 type ExtendedRequirement,
} from '@/data/sampleData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
 AlertTriangle,
 FileText,
 CheckCircle,
 XCircle,
 Link2,
 ArrowRight,
 Download,
 Filter,
 Search,
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

interface MatrixRow {
 id: string;
 label: string;
}

interface MatrixColumn {
 id: string;
 label: string;
}

interface MatrixViewProps {
 rows: MatrixRow[];
 columns: MatrixColumn[];
 getCellValue: (rowId: string, colId: string) => boolean;
}

interface TraceabilityChainProps {
 hazardId: string;
}

type ActiveViewType = 'matrix' | 'chain' | 'gaps';

// =============================================================================
// Matrix View Component
// =============================================================================

function MatrixView({ rows, columns, getCellValue }: MatrixViewProps) {
 return (
 <div className="overflow-x-auto">
 <table className="w-full border-collapse text-xs">
 <thead>
 <tr>
 <th className="p-2 border bg-muted/30 sticky left-0 z-10">
 Hazards / Requirements
 </th>
 {columns.map((col) => (
 <th
 key={col.id}
 className="p-2 border bg-muted/30 min-w-[60px]"
 >
 <div className="transform -rotate-45 origin-center whitespace-nowrap">
 {col.id}
 </div>
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {rows.map((row) => (
 <tr key={row.id}>
 <td className="p-2 border bg-muted/20 sticky left-0 font-medium">
 {row.id}
 </td>
 {columns.map((col) => {
 const linked = getCellValue(row.id, col.id);
 return (
 <td
 key={`${row.id}-${col.id}`}
 className={`p-2 border text-center ${
 linked ? 'bg-tactical-green-dim' : ''
 }`}
 >
 {linked && (
 <CheckCircle className="w-4 h-4 text-tactical-green mx-auto"/>
 )}
 </td>
 );
 })}
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 );
}

// =============================================================================
// Coverage Summary Component
// =============================================================================

function CoverageSummary() {
 const hazardCount = sampleHazards.length;
 const hazardsWithReqs = sampleHazards.filter(
 (h) => h.linkedRequirements && h.linkedRequirements.length > 0
 ).length;
 const reqCount = sampleRequirements.length;
 const reqsWithTests = sampleRequirements.filter(
 (r) => r.linkedTests && r.linkedTests.length > 0
 ).length;
 const reqsWithEvidence = sampleRequirements.filter((r) => {
 // Check if requirement has linked evidence through relatedRequirements in evidence
 return sampleEvidence.some(
 (e) => e.relatedRequirements && e.relatedRequirements.includes(r.id)
 );
 }).length;

 const hazardCoverage =
 hazardCount > 0 ? Math.round((hazardsWithReqs / hazardCount) * 100) : 0;
 const testCoverage =
 reqCount > 0 ? Math.round((reqsWithTests / reqCount) * 100) : 0;
 const evidenceCoverage =
 reqCount > 0 ? Math.round((reqsWithEvidence / reqCount) * 100) : 0;
 const gapsFound =
 hazardCount - hazardsWithReqs + (reqCount - reqsWithTests);

 return (
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
 <Card>
 <CardContent className="pt-4">
 <div className="flex items-center justify-between">
 <div>
 <div className="text-sm text-muted-foreground">
 Hazard Coverage
 </div>
 <div className="text-2xl font-bold">{hazardCoverage}%</div>
 </div>
 <AlertTriangle className="w-8 h-8 text-warning-amber opacity-50"/>
 </div>
 <Progress value={hazardCoverage} className="mt-2 h-2"/>
 <p className="text-xs text-muted-foreground mt-1">
 {hazardsWithReqs}/{hazardCount} hazards linked to requirements
 </p>
 </CardContent>
 </Card>

 <Card>
 <CardContent className="pt-4">
 <div className="flex items-center justify-between">
 <div>
 <div className="text-sm text-muted-foreground">
 Test Coverage
 </div>
 <div className="text-2xl font-bold">{testCoverage}%</div>
 </div>
 <CheckCircle className="w-8 h-8 text-tactical-green opacity-50"/>
 </div>
 <Progress value={testCoverage} className="mt-2 h-2"/>
 <p className="text-xs text-muted-foreground mt-1">
 {reqsWithTests}/{reqCount} requirements have tests
 </p>
 </CardContent>
 </Card>

 <Card>
 <CardContent className="pt-4">
 <div className="flex items-center justify-between">
 <div>
 <div className="text-sm text-muted-foreground">
 Evidence Coverage
 </div>
 <div className="text-2xl font-bold">{evidenceCoverage}%</div>
 </div>
 <FileText className="w-8 h-8 text-electric-blue opacity-50"/>
 </div>
 <Progress value={evidenceCoverage} className="mt-2 h-2"/>
 <p className="text-xs text-muted-foreground mt-1">
 {reqsWithEvidence}/{reqCount} requirements have evidence
 </p>
 </CardContent>
 </Card>

 <Card className="bg-critical-red-dim border-critical-red/30">
 <CardContent className="pt-4">
 <div className="flex items-center justify-between">
 <div>
 <div className="text-sm text-critical-red">
 Gaps Found
 </div>
 <div className="text-2xl font-bold text-critical-red">
 {gapsFound}
 </div>
 </div>
 <XCircle className="w-8 h-8 text-critical-red opacity-50"/>
 </div>
 <p className="text-xs text-critical-red mt-2">
 Missing links requiring attention
 </p>
 </CardContent>
 </Card>
 </div>
 );
}

// =============================================================================
// Gap Analysis Component
// =============================================================================

function GapAnalysis() {
 const unlinkedHazards = sampleHazards.filter(
 (h) => !h.linkedRequirements || h.linkedRequirements.length === 0
 );
 const untestedReqs = sampleRequirements.filter(
 (r) => !r.linkedTests || r.linkedTests.length === 0
 );

 return (
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2 text-critical-red">
 <XCircle className="w-5 h-5"/>
 Gap Analysis
 </CardTitle>
 </CardHeader>
 <CardContent>
 <Tabs defaultValue="hazards">
 <TabsList>
 <TabsTrigger value="hazards">
 Unlinked Hazards ({unlinkedHazards.length})
 </TabsTrigger>
 <TabsTrigger value="requirements">
 Untested Requirements ({untestedReqs.length})
 </TabsTrigger>
 </TabsList>

 <TabsContent value="hazards">
 {unlinkedHazards.length === 0 ? (
 <div className="flex items-center justify-center py-8 text-muted-foreground">
 <CheckCircle className="w-5 h-5 mr-2 text-tactical-green"/>
 All hazards are linked to requirements
 </div>
 ) : (
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Hazard ID</TableHead>
 <TableHead>Title</TableHead>
 <TableHead>Severity</TableHead>
 <TableHead>DAL</TableHead>
 <TableHead>Action</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {unlinkedHazards.map((h) => (
 <TableRow
 key={h.id}
 className="bg-critical-red-dim"
 >
 <TableCell className="font-mono">{h.id}</TableCell>
 <TableCell>{h.title}</TableCell>
 <TableCell>
 <Badge variant="destructive">{h.severity}</Badge>
 </TableCell>
 <TableCell>
 <Badge>DAL {h.dal}</Badge>
 </TableCell>
 <TableCell>
 <Button variant="outline"size="sm">
 <Link2 className="w-3 h-3 mr-1"/>
 Link
 </Button>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 )}
 </TabsContent>

 <TabsContent value="requirements">
 {untestedReqs.length === 0 ? (
 <div className="flex items-center justify-center py-8 text-muted-foreground">
 <CheckCircle className="w-5 h-5 mr-2 text-tactical-green"/>
 All requirements have tests
 </div>
 ) : (
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Req ID</TableHead>
 <TableHead>Text</TableHead>
 <TableHead>Type</TableHead>
 <TableHead>DAL</TableHead>
 <TableHead>Action</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {untestedReqs.map((r) => (
 <TableRow
 key={r.id}
 className="bg-warning-amber-dim/20"
 >
 <TableCell className="font-mono">{r.id}</TableCell>
 <TableCell className="max-w-md truncate">
 {r.text}
 </TableCell>
 <TableCell>
 <Badge variant="outline">{r.type}</Badge>
 </TableCell>
 <TableCell>
 <Badge>DAL {r.dal}</Badge>
 </TableCell>
 <TableCell>
 <Button variant="outline"size="sm">
 <Link2 className="w-3 h-3 mr-1"/>
 Link Test
 </Button>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 )}
 </TabsContent>
 </Tabs>
 </CardContent>
 </Card>
 );
}

// =============================================================================
// Traceability Chain Component
// =============================================================================

function TraceabilityChain({ hazardId }: TraceabilityChainProps) {
 const hazard = sampleHazards.find((h) => h.id === hazardId);
 const reqs = sampleRequirements.filter(
 (r) => hazard?.linkedRequirements?.includes(r.id)
 );
 const evidence = sampleEvidence.filter((e) =>
 reqs.some(
 (r) => e.relatedRequirements && e.relatedRequirements.includes(r.id)
 )
 );

 if (!hazard) {
 return (
 <div className="flex items-center justify-center py-8 text-muted-foreground">
 Hazard not found
 </div>
 );
 }

 return (
 <div className="flex items-center gap-2 p-4 bg-muted/20 rounded-sm overflow-x-auto">
 {/* Hazard Node */}
 <div className="flex-shrink-0 p-3 bg-critical-red-dim rounded-sm text-center min-w-[100px]">
 <AlertTriangle className="w-5 h-5 text-critical-red mx-auto"/>
 <p className="text-xs font-mono mt-1">{hazardId}</p>
 <p className="text-xs text-muted-foreground">Hazard</p>
 </div>

 <ArrowRight className="w-5 h-5 text-muted-foreground/70 flex-shrink-0"/>

 {/* Requirements Nodes */}
 <div className="flex gap-2">
 {reqs.length === 0 ? (
 <div className="flex-shrink-0 p-3 bg-muted/30 rounded-sm text-center">
 <XCircle className="w-5 h-5 text-muted-foreground/70 mx-auto"/>
 <p className="text-xs text-muted-foreground mt-1">No linked requirements</p>
 </div>
 ) : (
 reqs.map((r) => (
 <div
 key={r.id}
 className="flex-shrink-0 p-3 bg-electric-blue-dim rounded-sm text-center min-w-[100px]"
 >
 <FileText className="w-5 h-5 text-electric-blue mx-auto"/>
 <p className="text-xs font-mono mt-1">{r.id}</p>
 <p className="text-xs text-muted-foreground">
 Requirement
 </p>
 </div>
 ))
 )}
 </div>

 <ArrowRight className="w-5 h-5 text-muted-foreground/70 flex-shrink-0"/>

 {/* Evidence Nodes */}
 <div className="flex gap-2">
 {evidence.length === 0 ? (
 <div className="flex-shrink-0 p-3 bg-muted/30 rounded-sm text-center">
 <XCircle className="w-5 h-5 text-muted-foreground/70 mx-auto"/>
 <p className="text-xs text-muted-foreground mt-1">No linked evidence</p>
 </div>
 ) : (
 evidence.map((e) => (
 <div
 key={e.id}
 className="flex-shrink-0 p-3 bg-tactical-green-dim rounded-sm text-center min-w-[100px]"
 >
 <CheckCircle className="w-5 h-5 text-tactical-green mx-auto"/>
 <p className="text-xs font-mono mt-1">{e.id}</p>
 <p className="text-xs text-muted-foreground">
 Evidence
 </p>
 </div>
 ))
 )}
 </div>
 </div>
 );
}

// =============================================================================
// Requirements to Tests Matrix
// =============================================================================

function RequirementsTestsMatrix() {
 // Get unique test IDs from all requirements
 const allTestIds = useMemo(() => {
 const testSet = new Set<string>();
 sampleRequirements.forEach((r) => {
 r.linkedTests?.forEach((t) => testSet.add(t));
 });
 return Array.from(testSet).sort();
 }, []);

 const rows = sampleRequirements.slice(0, 20).map((r) => ({
 id: r.id,
 label: r.text.slice(0, 40),
 }));

 const columns = allTestIds.slice(0, 15).map((t) => ({
 id: t,
 label: t,
 }));

 const getCellValue = (reqId: string, testId: string): boolean => {
 const req = sampleRequirements.find((r) => r.id === reqId);
 return req?.linkedTests?.includes(testId) || false;
 };

 return (
 <Card>
 <CardHeader>
 <CardTitle>Requirements x Tests Matrix</CardTitle>
 </CardHeader>
 <CardContent>
 <MatrixView rows={rows} columns={columns} getCellValue={getCellValue} />
 </CardContent>
 </Card>
 );
}

// =============================================================================
// FMEA to Hazards Matrix
// =============================================================================

function FMEAHazardsMatrix() {
 const rows = sampleFMEAItems.slice(0, 15).map((f) => ({
 id: f.id,
 label: f.componentName,
 }));

 const columns = sampleHazards.slice(0, 12).map((h) => ({
 id: h.id,
 label: h.title.slice(0, 30),
 }));

 const getCellValue = (fmeaId: string, hazId: string): boolean => {
 const fmea = sampleFMEAItems.find((f) => f.id === fmeaId);
 return fmea?.linkedHazards?.includes(hazId) || false;
 };

 return (
 <Card>
 <CardHeader>
 <CardTitle>FMEA Items x Hazards Matrix</CardTitle>
 </CardHeader>
 <CardContent>
 <MatrixView rows={rows} columns={columns} getCellValue={getCellValue} />
 </CardContent>
 </Card>
 );
}

// =============================================================================
// Export Report Generator
// =============================================================================

function generateExportReport(): string {
 const lines: string[] = [];
 lines.push('TRACEABILITY MATRIX REPORT');
 lines.push('==========================');
 lines.push(`Generated: ${new Date().toISOString()}`);
 lines.push('');
 lines.push('COVERAGE SUMMARY');
 lines.push('----------------');

 const hazardCount = sampleHazards.length;
 const hazardsWithReqs = sampleHazards.filter(
 (h) => h.linkedRequirements && h.linkedRequirements.length > 0
 ).length;
 const reqCount = sampleRequirements.length;
 const reqsWithTests = sampleRequirements.filter(
 (r) => r.linkedTests && r.linkedTests.length > 0
 ).length;

 lines.push(`Hazard Coverage: ${hazardsWithReqs}/${hazardCount} (${Math.round((hazardsWithReqs / hazardCount) * 100)}%)`);
 lines.push(`Test Coverage: ${reqsWithTests}/${reqCount} (${Math.round((reqsWithTests / reqCount) * 100)}%)`);
 lines.push('');
 lines.push('HAZARD TO REQUIREMENT TRACEABILITY');
 lines.push('-----------------------------------');

 sampleHazards.forEach((h) => {
 lines.push(`${h.id}: ${h.title}`);
 lines.push(` Linked Requirements: ${h.linkedRequirements?.join(', ') || 'NONE'}`);
 lines.push('');
 });

 lines.push('REQUIREMENT TO TEST TRACEABILITY');
 lines.push('--------------------------------');

 sampleRequirements.forEach((r) => {
 lines.push(`${r.id}: ${r.text.slice(0, 60)}...`);
 lines.push(` Linked Tests: ${r.linkedTests?.join(', ') || 'NONE'}`);
 lines.push(` Linked Hazards: ${r.linkedHazards?.join(', ') || 'NONE'}`);
 lines.push('');
 });

 return lines.join('\n');
}

function handleExport() {
 const report = generateExportReport();
 const blob = new Blob([report], { type: 'text/plain' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `traceability-matrix-${new Date().toISOString().split('T')[0]}.txt`;
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 URL.revokeObjectURL(url);
}

// =============================================================================
// Main TraceabilityMatrix Component
// =============================================================================

export function TraceabilityMatrix() {
 const [activeView, setActiveView] = useState<ActiveViewType>('matrix');
 const [selectedHazard, setSelectedHazard] = useState<string | null>(null);
 const [matrixType, setMatrixType] = useState<'hazard-req' | 'req-test' | 'fmea-haz'>('hazard-req');

 const hazardReqRows = useMemo(
 () =>
 sampleHazards.map((h) => ({
 id: h.id,
 label: h.title,
 })),
 []
 );

 const hazardReqColumns = useMemo(
 () =>
 sampleRequirements.slice(0, 15).map((r) => ({
 id: r.id,
 label: r.text.slice(0, 30),
 })),
 []
 );

 const getHazardReqCellValue = (hazId: string, reqId: string): boolean => {
 const hazard = sampleHazards.find((h) => h.id === hazId);
 return hazard?.linkedRequirements?.includes(reqId) || false;
 };

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex justify-between items-center">
 <div>
 <h2 className="text-2xl font-bold">Traceability Matrix</h2>
 <p className="text-muted-foreground">
 Bidirectional traceability for DO-178C/ARP4761A compliance
 </p>
 </div>
 <Button variant="outline"onClick={handleExport}>
 <Download className="w-4 h-4 mr-2"/>
 Export Matrix
 </Button>
 </div>

 {/* Coverage Summary */}
 <CoverageSummary />

 {/* Main Tabs */}
 <Tabs
 value={activeView}
 onValueChange={(v) => setActiveView(v as ActiveViewType)}
 >
 <TabsList>
 <TabsTrigger value="matrix">Matrix View</TabsTrigger>
 <TabsTrigger value="chain">Chain View</TabsTrigger>
 <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
 </TabsList>

 <TabsContent value="matrix">
 {/* Matrix Type Selector */}
 <div className="flex gap-2 mb-4">
 <Button
 variant={matrixType === 'hazard-req' ? 'default' : 'outline'}
 size="sm"
 onClick={() => setMatrixType('hazard-req')}
 >
 Hazards x Requirements
 </Button>
 <Button
 variant={matrixType === 'req-test' ? 'default' : 'outline'}
 size="sm"
 onClick={() => setMatrixType('req-test')}
 >
 Requirements x Tests
 </Button>
 <Button
 variant={matrixType === 'fmea-haz' ? 'default' : 'outline'}
 size="sm"
 onClick={() => setMatrixType('fmea-haz')}
 >
 FMEA x Hazards
 </Button>
 </div>

 {matrixType === 'hazard-req' && (
 <Card>
 <CardHeader>
 <CardTitle>Hazards x Requirements Matrix</CardTitle>
 </CardHeader>
 <CardContent>
 <MatrixView
 rows={hazardReqRows}
 columns={hazardReqColumns}
 getCellValue={getHazardReqCellValue}
 />
 </CardContent>
 </Card>
 )}

 {matrixType === 'req-test' && <RequirementsTestsMatrix />}

 {matrixType === 'fmea-haz' && <FMEAHazardsMatrix />}
 </TabsContent>

 <TabsContent value="chain">
 <Card>
 <CardHeader>
 <CardTitle>Traceability Chain</CardTitle>
 </CardHeader>
 <CardContent>
 <p className="text-sm text-muted-foreground mb-4">
 Select a hazard to view its complete traceability chain
 </p>
 <div className="flex flex-wrap gap-2 mb-4">
 {sampleHazards.slice(0, 6).map((h) => (
 <Button
 key={h.id}
 variant={selectedHazard === h.id ? 'default' : 'outline'}
 size="sm"
 onClick={() => setSelectedHazard(h.id)}
 >
 {h.id}
 </Button>
 ))}
 </div>
 {selectedHazard ? (
 <TraceabilityChain hazardId={selectedHazard} />
 ) : (
 <div className="flex items-center justify-center py-8 text-muted-foreground">
 Select a hazard above to view its traceability chain
 </div>
 )}
 </CardContent>
 </Card>

 {/* Additional Chain Details */}
 {selectedHazard && (
 <Card className="mt-4">
 <CardHeader>
 <CardTitle>Chain Details</CardTitle>
 </CardHeader>
 <CardContent>
 <ChainDetails hazardId={selectedHazard} />
 </CardContent>
 </Card>
 )}
 </TabsContent>

 <TabsContent value="gaps">
 <GapAnalysis />
 </TabsContent>
 </Tabs>
 </div>
 );
}

// =============================================================================
// Chain Details Component
// =============================================================================

function ChainDetails({ hazardId }: { hazardId: string }) {
 const hazard = sampleHazards.find((h) => h.id === hazardId);
 const reqs = sampleRequirements.filter((r) =>
 hazard?.linkedRequirements?.includes(r.id)
 );
 const evidence = sampleEvidence.filter((e) =>
 reqs.some(
 (r) => e.relatedRequirements && e.relatedRequirements.includes(r.id)
 )
 );
 const fmeaItems = sampleFMEAItems.filter((f) =>
 f.linkedHazards?.includes(hazardId)
 );

 if (!hazard) return null;

 return (
 <div className="space-y-4">
 {/* Hazard Details */}
 <div>
 <h4 className="font-semibold mb-2 flex items-center gap-2">
 <AlertTriangle className="w-4 h-4 text-critical-red"/>
 Hazard: {hazard.id}
 </h4>
 <div className="pl-6 text-sm space-y-1">
 <p>
 <span className="text-muted-foreground">Title:</span> {hazard.title}
 </p>
 <p>
 <span className="text-muted-foreground">Severity:</span>{' '}
 <Badge variant="destructive">{hazard.severity}</Badge>
 </p>
 <p>
 <span className="text-muted-foreground">DAL:</span>{' '}
 <Badge>DAL {hazard.dal}</Badge>
 </p>
 <p>
 <span className="text-muted-foreground">Status:</span>{' '}
 <Badge variant="outline">{hazard.status}</Badge>
 </p>
 </div>
 </div>

 {/* Linked Requirements */}
 <div>
 <h4 className="font-semibold mb-2 flex items-center gap-2">
 <FileText className="w-4 h-4 text-electric-blue"/>
 Linked Requirements ({reqs.length})
 </h4>
 {reqs.length > 0 ? (
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>ID</TableHead>
 <TableHead>Text</TableHead>
 <TableHead>Type</TableHead>
 <TableHead>Status</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {reqs.map((r) => (
 <TableRow key={r.id}>
 <TableCell className="font-mono">{r.id}</TableCell>
 <TableCell className="max-w-xs truncate">{r.text}</TableCell>
 <TableCell>
 <Badge variant="outline">{r.type}</Badge>
 </TableCell>
 <TableCell>
 <Badge
 variant={r.status === 'Verified' ? 'default' : 'secondary'}
 >
 {r.status}
 </Badge>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 ) : (
 <p className="text-sm text-muted-foreground pl-6">No linked requirements</p>
 )}
 </div>

 {/* Linked Evidence */}
 <div>
 <h4 className="font-semibold mb-2 flex items-center gap-2">
 <CheckCircle className="w-4 h-4 text-tactical-green"/>
 Linked Evidence ({evidence.length})
 </h4>
 {evidence.length > 0 ? (
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>ID</TableHead>
 <TableHead>Title</TableHead>
 <TableHead>Type</TableHead>
 <TableHead>Status</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {evidence.map((e) => (
 <TableRow key={e.id}>
 <TableCell className="font-mono">{e.id}</TableCell>
 <TableCell>{e.title}</TableCell>
 <TableCell>
 <Badge variant="outline">{e.type}</Badge>
 </TableCell>
 <TableCell>
 <Badge
 variant={e.status === 'Approved' ? 'default' : 'secondary'}
 >
 {e.status}
 </Badge>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 ) : (
 <p className="text-sm text-muted-foreground pl-6">No linked evidence</p>
 )}
 </div>

 {/* Related FMEA Items */}
 <div>
 <h4 className="font-semibold mb-2 flex items-center gap-2">
 <Search className="w-4 h-4 text-purple-500"/>
 Related FMEA Items ({fmeaItems.length})
 </h4>
 {fmeaItems.length > 0 ? (
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>ID</TableHead>
 <TableHead>Component</TableHead>
 <TableHead>Failure Mode</TableHead>
 <TableHead>RPN</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {fmeaItems.map((f) => (
 <TableRow key={f.id}>
 <TableCell className="font-mono">{f.id}</TableCell>
 <TableCell>{f.componentName}</TableCell>
 <TableCell>{f.failureMode}</TableCell>
 <TableCell>
 <Badge
 variant={
 f.rpn > 100
 ? 'destructive'
 : f.rpn > 50
 ? 'secondary'
 : 'outline'
 }
 >
 {f.rpn}
 </Badge>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 ) : (
 <p className="text-sm text-muted-foreground pl-6">No related FMEA items</p>
 )}
 </div>
 </div>
 );
}

export default TraceabilityMatrix;
