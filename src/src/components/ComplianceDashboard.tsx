import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Button } from '@/components/ui/button';
import {
 CheckCircle,
 Circle,
 AlertTriangle,
 FileText,
 Shield,
} from 'lucide-react';

// Import standards data
import {
 TABLE_A1_OBJECTIVES,
 TABLE_A2_OBJECTIVES,
 TABLE_A3_OBJECTIVES,
 TABLE_A4_OBJECTIVES,
 TABLE_A5_OBJECTIVES,
 TABLE_A6_OBJECTIVES,
 TABLE_A7_OBJECTIVES,
 TABLE_A8_OBJECTIVES,
 TABLE_A9_OBJECTIVES,
 TABLE_A10_OBJECTIVES,
 TABLE_METADATA,
 type DO178CObjective,
} from '@/data/standards/do178c';
import {
 FHA_REQUIREMENTS,
 PSSA_REQUIREMENTS,
 SSA_REQUIREMENTS,
 CCA_CHECKLIST_ITEMS,
 PROCESS_METADATA,
} from '@/data/standards/arp4761a';
import {
 SYSTEM_SAFETY_TASKS,
 HAZARD_TRACKING_REQUIREMENTS,
 type SystemSafetySubTask,
} from '@/data/standards/milstd882e';

// Types
type DAL = 'A' | 'B' | 'C' | 'D';
type ComplianceStatus = 'satisfied' | 'in-progress' | 'not-started';
type StandardType = 'DO-178C' | 'ARP4761A' | 'MIL-STD-882E';

interface TableData {
 id: string;
 name: string;
 description: string;
 objectives: DO178CObjective[];
}

// Consolidated DO-178C tables data
const do178cTables: TableData[] = [
 {
 id: 'A-1',
 name: 'Table A-1: Software Planning Process',
 description:
 'Objectives for software planning activities including plans, standards, and coordination',
 objectives: TABLE_A1_OBJECTIVES,
 },
 {
 id: 'A-2',
 name: 'Table A-2: Software Development Process',
 description:
 'Objectives for software development including requirements, design, coding, and integration',
 objectives: TABLE_A2_OBJECTIVES,
 },
 {
 id: 'A-3',
 name: 'Table A-3: Verification of Software Requirements Process',
 description:
 'Objectives for verifying high-level requirements accuracy and traceability',
 objectives: TABLE_A3_OBJECTIVES,
 },
 {
 id: 'A-4',
 name: 'Table A-4: Verification of Software Design Process',
 description:
 'Objectives for verifying low-level requirements and software architecture',
 objectives: TABLE_A4_OBJECTIVES,
 },
 {
 id: 'A-5',
 name: 'Table A-5: Verification of Software Coding & Integration Process',
 description:
 'Objectives for verifying source code compliance and integration correctness',
 objectives: TABLE_A5_OBJECTIVES,
 },
 {
 id: 'A-6',
 name: 'Table A-6: Testing of Outputs of Integration Process',
 description:
 'Objectives for testing executable object code against requirements',
 objectives: TABLE_A6_OBJECTIVES,
 },
 {
 id: 'A-7',
 name: 'Table A-7: Verification of Verification Process Results',
 description:
 'Objectives for test coverage including MC/DC, decision, and statement coverage',
 objectives: TABLE_A7_OBJECTIVES,
 },
 {
 id: 'A-8',
 name: 'Table A-8: Software Configuration Management Process',
 description:
 'Objectives for configuration identification, baselines, change control, and release',
 objectives: TABLE_A8_OBJECTIVES,
 },
 {
 id: 'A-9',
 name: 'Table A-9: Software Quality Assurance Process',
 description:
 'Objectives for process compliance, standards adherence, and conformity review',
 objectives: TABLE_A9_OBJECTIVES,
 },
 {
 id: 'A-10',
 name: 'Table A-10: Certification Liaison Process',
 description:
 'Objectives for certification authority communication and compliance substantiation',
 objectives: TABLE_A10_OBJECTIVES,
 },
];

// Mock compliance status data - in a real app this would come from a store/database
const generateMockStatus = (): Record<string, ComplianceStatus> => {
 const statuses: ComplianceStatus[] = [
 'satisfied',
 'in-progress',
 'not-started',
 ];
 const result: Record<string, ComplianceStatus> = {};

 // Generate semi-random but deterministic statuses for demo
 do178cTables.forEach((table) => {
 table.objectives.forEach((obj, idx) => {
 const seed = obj.id.charCodeAt(obj.id.length - 1) + idx;
 if (seed % 3 === 0) result[obj.id] = 'satisfied';
 else if (seed % 3 === 1) result[obj.id] = 'in-progress';
 else result[obj.id] = 'not-started';
 });
 });

 return result;
};

// Helper functions
function getTotalObjectives(standard: StandardType, dal: DAL): number {
 if (standard === 'DO-178C') {
 return do178cTables.reduce((count, table) => {
 return (
 count + table.objectives.filter((obj) => obj.applicability[dal]).length
 );
 }, 0);
 }
 if (standard === 'ARP4761A') {
 return (
 FHA_REQUIREMENTS.length +
 PSSA_REQUIREMENTS.length +
 SSA_REQUIREMENTS.length +
 CCA_CHECKLIST_ITEMS.length
 );
 }
 if (standard === 'MIL-STD-882E') {
 return SYSTEM_SAFETY_TASKS.reduce(
 (count, group) => count + group.tasks.length,
 0
 );
 }
 return 0;
}

function getSatisfiedCount(
 standard: StandardType,
 dal: DAL,
 objectiveStatus: Record<string, ComplianceStatus>
): number {
 if (standard === 'DO-178C') {
 return do178cTables.reduce((count, table) => {
 return (
 count +
 table.objectives.filter(
 (obj) =>
 obj.applicability[dal] && objectiveStatus[obj.id] === 'satisfied'
 ).length
 );
 }, 0);
 }
 // For demo purposes, return approximate values for other standards
 const total = getTotalObjectives(standard, dal);
 return Math.floor(total * 0.35);
}

function getInProgressCount(
 standard: StandardType,
 dal: DAL,
 objectiveStatus: Record<string, ComplianceStatus>
): number {
 if (standard === 'DO-178C') {
 return do178cTables.reduce((count, table) => {
 return (
 count +
 table.objectives.filter(
 (obj) =>
 obj.applicability[dal] && objectiveStatus[obj.id] === 'in-progress'
 ).length
 );
 }, 0);
 }
 const total = getTotalObjectives(standard, dal);
 return Math.floor(total * 0.25);
}

function getNotStartedCount(
 standard: StandardType,
 dal: DAL,
 objectiveStatus: Record<string, ComplianceStatus>
): number {
 if (standard === 'DO-178C') {
 return do178cTables.reduce((count, table) => {
 return (
 count +
 table.objectives.filter(
 (obj) =>
 obj.applicability[dal] && objectiveStatus[obj.id] === 'not-started'
 ).length
 );
 }, 0);
 }
 const total = getTotalObjectives(standard, dal);
 return Math.floor(total * 0.4);
}

function getCompliancePercentage(
 standard: StandardType,
 dal: DAL,
 objectiveStatus: Record<string, ComplianceStatus>
): number {
 const total = getTotalObjectives(standard, dal);
 if (total === 0) return 0;
 const satisfied = getSatisfiedCount(standard, dal, objectiveStatus);
 return Math.round((satisfied / total) * 100);
}

// Sub-components
interface ComplianceSummaryCardProps {
 title: string;
 value: number;
 icon: React.ElementType;
 color: 'blue' | 'green' | 'yellow' | 'red';
}

function ComplianceSummaryCard({
 title,
 value,
 icon: Icon,
 color,
}: ComplianceSummaryCardProps) {
 const colorClasses = {
 blue: 'bg-electric-blue-dim border-electric-blue/30 text-electric-blue',
 green: 'bg-tactical-green-dim border-tactical-green/30 text-tactical-green',
 yellow: 'bg-warning-amber-dim border-warning-amber/30 text-warning-amber',
 red: 'bg-critical-red-dim border-critical-red/30 text-critical-red',
 };

 return (
 <Card className={`border tactical-corners ${colorClasses[color]}`}>
 <CardContent className="pt-4 flex items-center justify-between">
 <div>
 <div className="data-label">{title}</div>
 <div className="data-value-large">{value}</div>
 </div>
 <Icon className="w-8 h-8 opacity-50"/>
 </CardContent>
 </Card>
 );
}

function ApplicabilityIndicator({ applicable }: { applicable: boolean }) {
 return applicable ? (
 <span className="text-tactical-green font-bold">*</span>
 ) : (
 <span className="text-muted-foreground/40">-</span>
 );
}

interface StatusSelectorProps {
 value: ComplianceStatus;
 onChange: (status: ComplianceStatus) => void;
 disabled: boolean;
}

function StatusSelector({ value, onChange, disabled }: StatusSelectorProps) {
 if (disabled) return <span className="text-muted-foreground/70 text-sm">N/A</span>;

 return (
 <Select value={value} onValueChange={(v) => onChange(v as ComplianceStatus)}>
 <SelectTrigger className="w-28 h-8 text-xs">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="satisfied">Satisfied</SelectItem>
 <SelectItem value="in-progress">In Progress</SelectItem>
 <SelectItem value="not-started">Not Started</SelectItem>
 </SelectContent>
 </Select>
 );
}

interface StatusBadgeProps {
 status: ComplianceStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
 const colorClasses = {
 satisfied: 'bg-tactical-green-dim text-tactical-green border-tactical-green/30',
 'in-progress': 'bg-warning-amber-dim text-warning-amber border-warning-amber/30',
 'not-started': 'bg-muted/30 text-foreground border-border/40',
 };

 const labels = {
 satisfied: 'Satisfied',
 'in-progress': 'In Progress',
 'not-started': 'Not Started',
 };

 return (
 <Badge variant="outline"className={colorClasses[status]}>
 {labels[status]}
 </Badge>
 );
}

function EvidenceLink({ objectiveId }: { objectiveId: string }) {
 return (
 <Button variant="ghost"size="sm"className="h-7 text-xs">
 <FileText className="w-3 h-3 mr-1"/>
 Link
 </Button>
 );
}

// DO-178C Compliance View
interface DO178CComplianceProps {
 dal: DAL;
 objectiveStatus: Record<string, ComplianceStatus>;
 setObjectiveStatus: React.Dispatch<
 React.SetStateAction<Record<string, ComplianceStatus>>
 >;
}

function DO178CCompliance({
 dal,
 objectiveStatus,
 setObjectiveStatus,
}: DO178CComplianceProps) {
 return (
 <Tabs defaultValue="A-7"className="space-y-4">
 <TabsList className="flex flex-wrap h-auto gap-1">
 {TABLE_METADATA.map((table) => (
 <TabsTrigger key={table.id} value={table.id} className="text-xs">
 {table.id}
 </TabsTrigger>
 ))}
 </TabsList>

 {do178cTables.map((table) => (
 <TabsContent key={table.id} value={table.id}>
 <Card>
 <CardHeader>
 <CardTitle className="text-lg">{table.name}</CardTitle>
 <p className="text-sm text-muted-foreground">{table.description}</p>
 </CardHeader>
 <CardContent>
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead className="w-20">Objective</TableHead>
 <TableHead>Description</TableHead>
 <TableHead className="w-14 text-center">A</TableHead>
 <TableHead className="w-14 text-center">B</TableHead>
 <TableHead className="w-14 text-center">C</TableHead>
 <TableHead className="w-14 text-center">D</TableHead>
 <TableHead className="w-28">Status</TableHead>
 <TableHead className="w-20">Evidence</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {table.objectives.map((obj) => (
 <TableRow key={obj.id}>
 <TableCell className="font-mono text-xs">
 {obj.id}
 </TableCell>
 <TableCell className="text-sm">{obj.objective}</TableCell>
 <TableCell className="text-center">
 <ApplicabilityIndicator applicable={obj.applicability.A} />
 </TableCell>
 <TableCell className="text-center">
 <ApplicabilityIndicator applicable={obj.applicability.B} />
 </TableCell>
 <TableCell className="text-center">
 <ApplicabilityIndicator applicable={obj.applicability.C} />
 </TableCell>
 <TableCell className="text-center">
 <ApplicabilityIndicator applicable={obj.applicability.D} />
 </TableCell>
 <TableCell>
 <StatusSelector
 value={objectiveStatus[obj.id] || 'not-started'}
 onChange={(status) =>
 setObjectiveStatus((prev) => ({
 ...prev,
 [obj.id]: status,
 }))
 }
 disabled={!obj.applicability[dal]}
 />
 </TableCell>
 <TableCell>
 <EvidenceLink objectiveId={obj.id} />
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </CardContent>
 </Card>
 </TabsContent>
 ))}
 </Tabs>
 );
}

// ARP4761A Compliance View
function ARP4761ACompliance() {
 const [processStatus] = useState<Record<string, ComplianceStatus>>({});

 const sections = [
 {
 id: 'FHA',
 name: 'Functional Hazard Assessment (FHA)',
 requirements: FHA_REQUIREMENTS,
 },
 {
 id: 'PSSA',
 name: 'Preliminary System Safety Assessment (PSSA)',
 requirements: PSSA_REQUIREMENTS,
 },
 {
 id: 'SSA',
 name: 'System Safety Assessment (SSA)',
 requirements: SSA_REQUIREMENTS,
 },
 ];

 return (
 <Card>
 <CardHeader>
 <CardTitle>ARP4761A Safety Assessment Process Objectives</CardTitle>
 <p className="text-sm text-muted-foreground">
 Guidelines and Methods for Conducting the Safety Assessment Process on
 Civil Airborne Systems
 </p>
 </CardHeader>
 <CardContent>
 <Tabs defaultValue="FHA"className="space-y-4">
 <TabsList>
 {PROCESS_METADATA.map((process) => (
 <TabsTrigger key={process.id} value={process.id}>
 {process.name}
 </TabsTrigger>
 ))}
 </TabsList>

 {sections.map((section) => (
 <TabsContent key={section.id} value={section.id}>
 <div className="border rounded-sm p-4">
 <h4 className="font-semibold mb-4">{section.name}</h4>
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead className="w-20">ID</TableHead>
 <TableHead>Requirement</TableHead>
 <TableHead className="w-32">Status</TableHead>
 <TableHead className="w-40">Outputs</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {section.requirements.map((req) => {
 const status =
 processStatus[req.id] ||
 (['satisfied', 'in-progress', 'not-started'][
 req.id.charCodeAt(req.id.length - 1) % 3
 ] as ComplianceStatus);
 return (
 <TableRow key={req.id}>
 <TableCell className="font-mono text-xs">
 {req.id}
 </TableCell>
 <TableCell>
 <div className="font-medium text-sm">
 {req.requirement}
 </div>
 <div className="text-xs text-muted-foreground mt-1">
 {req.description}
 </div>
 </TableCell>
 <TableCell>
 <StatusBadge status={status} />
 </TableCell>
 <TableCell>
 <div className="flex flex-wrap gap-1">
 {req.outputs.slice(0, 2).map((output) => (
 <Badge
 key={output}
 variant="outline"
 className="text-xs"
 >
 {output.length > 20
 ? output.substring(0, 20) + '...'
 : output}
 </Badge>
 ))}
 {req.outputs.length > 2 && (
 <Badge variant="outline"className="text-xs">
 +{req.outputs.length - 2}
 </Badge>
 )}
 </div>
 </TableCell>
 </TableRow>
 );
 })}
 </TableBody>
 </Table>
 </div>
 </TabsContent>
 ))}

 <TabsContent value="CCA">
 <div className="border rounded-sm p-4">
 <h4 className="font-semibold mb-4">
 Common Cause Analysis (CCA) Checklist
 </h4>
 <Tabs defaultValue="ZSA">
 <TabsList>
 <TabsTrigger value="ZSA">Zonal Safety (ZSA)</TabsTrigger>
 <TabsTrigger value="PRA">Particular Risks (PRA)</TabsTrigger>
 <TabsTrigger value="CMA">Common Mode (CMA)</TabsTrigger>
 </TabsList>
 {(['ZSA', 'PRA', 'CMA'] as const).map((category) => (
 <TabsContent key={category} value={category}>
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead className="w-20">ID</TableHead>
 <TableHead>Item</TableHead>
 <TableHead className="w-48">
 Verification Method
 </TableHead>
 <TableHead className="w-24">Complete</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {CCA_CHECKLIST_ITEMS.filter(
 (item) => item.category === category
 ).map((item) => (
 <TableRow key={item.id}>
 <TableCell className="font-mono text-xs">
 {item.id}
 </TableCell>
 <TableCell>
 <div className="font-medium text-sm">
 {item.item}
 </div>
 <div className="text-xs text-muted-foreground mt-1">
 {item.description}
 </div>
 </TableCell>
 <TableCell className="text-xs">
 {item.verificationMethod}
 </TableCell>
 <TableCell>
 <Checkbox
 defaultChecked={item.id.charCodeAt(4) % 2 === 0}
 />
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </TabsContent>
 ))}
 </Tabs>
 </div>
 </TabsContent>
 </Tabs>
 </CardContent>
 </Card>
 );
}

// MIL-STD-882E Compliance View
function MILSTD882ECompliance() {
 const [taskApplicability, setTaskApplicability] = useState<
 Record<string, boolean>
 >({});

 return (
 <Card>
 <CardHeader>
 <CardTitle>MIL-STD-882E System Safety Tasks</CardTitle>
 <p className="text-sm text-muted-foreground">
 DoD Standard Practice for System Safety Program Requirements
 </p>
 </CardHeader>
 <CardContent>
 <Tabs defaultValue="TASK-200">
 <TabsList>
 {SYSTEM_SAFETY_TASKS.map((group) => (
 <TabsTrigger key={group.id} value={group.id}>
 {group.name}
 </TabsTrigger>
 ))}
 </TabsList>

 {SYSTEM_SAFETY_TASKS.map((group) => (
 <TabsContent key={group.id} value={group.id}>
 <div className="mb-4">
 <p className="text-sm text-muted-foreground">{group.description}</p>
 </div>
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead className="w-16">Task</TableHead>
 <TableHead className="w-48">Name</TableHead>
 <TableHead>Description</TableHead>
 <TableHead className="w-24">Applicable</TableHead>
 <TableHead className="w-28">Status</TableHead>
 <TableHead className="w-40">Outputs</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {group.tasks.map((task: SystemSafetySubTask) => {
 const isApplicable =
 taskApplicability[task.id] !== false;
 const status = (['satisfied', 'in-progress', 'not-started'][
 parseInt(task.id) % 3
 ] as ComplianceStatus);

 return (
 <TableRow key={task.id}>
 <TableCell className="font-mono text-xs">
 {task.id}
 </TableCell>
 <TableCell className="font-medium text-sm">
 {task.name}
 </TableCell>
 <TableCell className="text-sm">
 {task.description.length > 100
 ? task.description.substring(0, 100) + '...'
 : task.description}
 </TableCell>
 <TableCell>
 <Checkbox
 checked={isApplicable}
 onCheckedChange={(checked) =>
 setTaskApplicability((prev) => ({
 ...prev,
 [task.id]: checked as boolean,
 }))
 }
 />
 </TableCell>
 <TableCell>
 {isApplicable ? (
 <StatusBadge status={status} />
 ) : (
 <span className="text-muted-foreground/70 text-xs">N/A</span>
 )}
 </TableCell>
 <TableCell>
 <div className="flex flex-wrap gap-1">
 {task.outputs.slice(0, 2).map((output) => (
 <Badge
 key={output}
 variant="outline"
 className="text-xs"
 >
 {output.length > 15
 ? output.substring(0, 15) + '...'
 : output}
 </Badge>
 ))}
 </div>
 </TableCell>
 </TableRow>
 );
 })}
 </TableBody>
 </Table>
 </TabsContent>
 ))}
 </Tabs>

 {/* Hazard Tracking Requirements Section */}
 <div className="mt-6 border-t pt-4">
 <h4 className="font-semibold mb-4">Hazard Tracking Requirements</h4>
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead className="w-20">ID</TableHead>
 <TableHead>Requirement</TableHead>
 <TableHead className="w-40">Deliverables</TableHead>
 <TableHead className="w-24">Status</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {HAZARD_TRACKING_REQUIREMENTS.map((req) => {
 const status = (['satisfied', 'in-progress', 'not-started'][
 req.id.charCodeAt(4) % 3
 ] as ComplianceStatus);

 return (
 <TableRow key={req.id}>
 <TableCell className="font-mono text-xs">{req.id}</TableCell>
 <TableCell>
 <div className="font-medium text-sm">{req.requirement}</div>
 <div className="text-xs text-muted-foreground mt-1">
 {req.description}
 </div>
 </TableCell>
 <TableCell>
 <div className="flex flex-wrap gap-1">
 {req.deliverables.map((d) => (
 <Badge key={d} variant="outline"className="text-xs">
 {d}
 </Badge>
 ))}
 </div>
 </TableCell>
 <TableCell>
 <StatusBadge status={status} />
 </TableCell>
 </TableRow>
 );
 })}
 </TableBody>
 </Table>
 </div>
 </CardContent>
 </Card>
 );
}

// Main Component
export function ComplianceDashboard() {
 const [selectedStandard, setSelectedStandard] =
 useState<StandardType>('DO-178C');
 const [selectedDAL, setSelectedDAL] = useState<DAL>('A');
 const [objectiveStatus, setObjectiveStatus] = useState<
 Record<string, ComplianceStatus>
 >(generateMockStatus);

 const summaryStats = useMemo(
 () => ({
 total: getTotalObjectives(selectedStandard, selectedDAL),
 satisfied: getSatisfiedCount(
 selectedStandard,
 selectedDAL,
 objectiveStatus
 ),
 inProgress: getInProgressCount(
 selectedStandard,
 selectedDAL,
 objectiveStatus
 ),
 notStarted: getNotStartedCount(
 selectedStandard,
 selectedDAL,
 objectiveStatus
 ),
 percentage: getCompliancePercentage(
 selectedStandard,
 selectedDAL,
 objectiveStatus
 ),
 }),
 [selectedStandard, selectedDAL, objectiveStatus]
 );

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex justify-between items-center">
 <div>
 <h2 className="text-2xl font-bold">Compliance Dashboard</h2>
 <p className="text-muted-foreground">
 Track certification objectives and evidence status
 </p>
 </div>
 <div className="flex gap-4">
 <Select
 value={selectedStandard}
 onValueChange={(v) => setSelectedStandard(v as StandardType)}
 >
 <SelectTrigger className="w-52">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="DO-178C">DO-178C (Software)</SelectItem>
 <SelectItem value="ARP4761A">
 ARP4761A (Safety Assessment)
 </SelectItem>
 <SelectItem value="MIL-STD-882E">
 MIL-STD-882E (System Safety)
 </SelectItem>
 </SelectContent>
 </Select>
 {selectedStandard === 'DO-178C' && (
 <Select
 value={selectedDAL}
 onValueChange={(v) => setSelectedDAL(v as DAL)}
 >
 <SelectTrigger className="w-32">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="A">DAL A</SelectItem>
 <SelectItem value="B">DAL B</SelectItem>
 <SelectItem value="C">DAL C</SelectItem>
 <SelectItem value="D">DAL D</SelectItem>
 </SelectContent>
 </Select>
 )}
 </div>
 </div>

 {/* Compliance Summary Cards */}
 <div className="grid grid-cols-4 gap-4">
 <ComplianceSummaryCard
 title="Total Objectives"
 value={summaryStats.total}
 icon={FileText}
 color="blue"
 />
 <ComplianceSummaryCard
 title="Satisfied"
 value={summaryStats.satisfied}
 icon={CheckCircle}
 color="green"
 />
 <ComplianceSummaryCard
 title="In Progress"
 value={summaryStats.inProgress}
 icon={Circle}
 color="yellow"
 />
 <ComplianceSummaryCard
 title="Not Started"
 value={summaryStats.notStarted}
 icon={AlertTriangle}
 color="red"
 />
 </div>

 {/* Overall Progress */}
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <Shield className="w-5 h-5"/>
 Overall Compliance: {selectedStandard}{' '}
 {selectedStandard === 'DO-178C' ? `(DAL ${selectedDAL})` : ''}
 </CardTitle>
 </CardHeader>
 <CardContent>
 <div className="space-y-2">
 <div className="flex justify-between text-sm">
 <span>Progress</span>
 <span>{summaryStats.percentage}%</span>
 </div>
 <Progress value={summaryStats.percentage} className="h-3"/>
 </div>
 </CardContent>
 </Card>

 {/* Standard-Specific Content */}
 {selectedStandard === 'DO-178C' && (
 <DO178CCompliance
 dal={selectedDAL}
 objectiveStatus={objectiveStatus}
 setObjectiveStatus={setObjectiveStatus}
 />
 )}
 {selectedStandard === 'ARP4761A' && <ARP4761ACompliance />}
 {selectedStandard === 'MIL-STD-882E' && <MILSTD882ECompliance />}
 </div>
 );
}

export default ComplianceDashboard;
