/**
 * MIL-STD-882E System Safety Standard Practice
 * DoD Standard Practice for System Safety
 *
 * This module contains the complete MIL-STD-882E framework including:
 * - Severity Categories (Table I)
 * - Probability Levels (Table II)
 * - Risk Assessment Matrix (Table III)
 * - Risk Acceptance Authority (Table IV)
 * - System Safety Program Tasks (Section 4.4)
 * - Hazard Tracking Requirements
 */

// =============================================================================
// Types
// =============================================================================

export type SeverityCategory = 1 | 2 | 3 | 4;
export type ProbabilityLevel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type RiskLevel = 'High' | 'Serious' | 'Medium' | 'Low';

export interface SeverityDefinition {
  category: string;
  description: string;
  mishapDefinition: string;
}

export interface ProbabilityDefinition {
  level: string;
  description: string;
  quantitative: string;
  individualItem: string;
  fleet: string;
}

export interface RiskAcceptanceInfo {
  authority: string;
  description: string;
}

export interface SystemSafetySubTask {
  id: string;
  name: string;
  description: string;
  applicability: string[];
  outputs: string[];
}

export interface SystemSafetyTaskGroup {
  id: string;
  name: string;
  description: string;
  tasks: SystemSafetySubTask[];
}

export interface HazardTrackingRequirement {
  id: string;
  requirement: string;
  description: string;
  deliverables: string[];
}

// =============================================================================
// MIL-STD-882E Severity Categories (Table I)
// =============================================================================

export const MIL_STD_882E_SEVERITY: Record<SeverityCategory, SeverityDefinition> = {
  1: {
    category: 'Catastrophic',
    description:
      'Could result in one or more of the following: death, permanent total disability, irreversible significant environmental impact, or monetary loss equal to or exceeding $10M',
    mishapDefinition:
      'Death or permanent total disability; system loss; significant irreversible environmental damage; monetary loss equal to or exceeding $10M',
  },
  2: {
    category: 'Critical',
    description:
      'Could result in one or more of the following: permanent partial disability, injuries or occupational illness that may result in hospitalization of at least three personnel, reversible significant environmental impact, or monetary loss equal to or exceeding $1M but less than $10M',
    mishapDefinition:
      'Permanent partial disability; temporary total disability exceeding 3 months; hospitalization of 3 or more personnel; reversible significant environmental damage; monetary loss of $1M or more but less than $10M',
  },
  3: {
    category: 'Marginal',
    description:
      'Could result in one or more of the following: injury or occupational illness resulting in one or more lost work day(s), reversible moderate environmental impact, or monetary loss equal to or exceeding $100K but less than $1M',
    mishapDefinition:
      'Injury or occupational illness resulting in 1 or more lost work days; reversible moderate environmental damage; monetary loss of $100K or more but less than $1M',
  },
  4: {
    category: 'Negligible',
    description:
      'Could result in one or more of the following: injury or occupational illness not resulting in a lost work day, minimal environmental impact, or monetary loss less than $100K',
    mishapDefinition:
      'Injury or illness not resulting in a lost work day; minimal environmental damage; monetary loss less than $100K',
  },
};

// =============================================================================
// MIL-STD-882E Probability Levels (Table II)
// =============================================================================

export const MIL_STD_882E_PROBABILITY: Record<ProbabilityLevel, ProbabilityDefinition> = {
  A: {
    level: 'Frequent',
    description: 'Likely to occur often in the life of an item',
    quantitative: '> 10^-1',
    individualItem: 'Likely to occur often',
    fleet: 'Continuously experienced',
  },
  B: {
    level: 'Probable',
    description: 'Will occur several times in the life of an item',
    quantitative: '10^-1 to 10^-2',
    individualItem: 'Will occur several times',
    fleet: 'Will occur frequently',
  },
  C: {
    level: 'Occasional',
    description: 'Likely to occur some time in the life of an item',
    quantitative: '10^-2 to 10^-3',
    individualItem: 'Likely to occur sometime',
    fleet: 'Will occur several times',
  },
  D: {
    level: 'Remote',
    description: 'Unlikely but possible to occur in the life of an item',
    quantitative: '10^-3 to 10^-6',
    individualItem: 'Unlikely but possible',
    fleet: 'Unlikely but can reasonably be expected to occur',
  },
  E: {
    level: 'Improbable',
    description: 'So unlikely, it can be assumed occurrence may not be experienced',
    quantitative: '< 10^-6',
    individualItem: 'So unlikely, may be assumed occurrence may not be experienced',
    fleet: 'Unlikely to occur, but possible',
  },
  F: {
    level: 'Eliminated',
    description: 'Incapable of occurrence. This level is used when potential hazards are identified and later eliminated',
    quantitative: '0',
    individualItem: 'Incapable of occurrence',
    fleet: 'Incapable of occurrence',
  },
};

// =============================================================================
// MIL-STD-882E Risk Assessment Matrix (Table III)
// =============================================================================

export const MIL_STD_882E_RISK_MATRIX: Record<ProbabilityLevel, Record<SeverityCategory, RiskLevel | 'Eliminated'>> = {
  A: { 1: 'High', 2: 'High', 3: 'Serious', 4: 'Medium' },
  B: { 1: 'High', 2: 'High', 3: 'Serious', 4: 'Medium' },
  C: { 1: 'High', 2: 'Serious', 3: 'Medium', 4: 'Low' },
  D: { 1: 'Serious', 2: 'Medium', 3: 'Medium', 4: 'Low' },
  E: { 1: 'Medium', 2: 'Medium', 3: 'Low', 4: 'Low' },
  F: { 1: 'Eliminated', 2: 'Eliminated', 3: 'Eliminated', 4: 'Eliminated' },
};

// =============================================================================
// Risk Acceptance Authority (Table IV)
// =============================================================================

export const RISK_ACCEPTANCE_AUTHORITY: Record<RiskLevel, RiskAcceptanceInfo> = {
  High: {
    authority: 'Component Acquisition Executive (CAE)',
    description:
      'The Component Acquisition Executive or equivalent has the authority to accept High risks. These risks require formal review and explicit acceptance documentation.',
  },
  Serious: {
    authority: 'Program Executive Officer (PEO)',
    description:
      'The Program Executive Officer has the authority to accept Serious risks. These risks require documented justification and risk mitigation plans.',
  },
  Medium: {
    authority: 'Program Manager (PM)',
    description:
      'The Program Manager has the authority to accept Medium risks. These risks should be documented and tracked with appropriate mitigation measures.',
  },
  Low: {
    authority: 'As directed by PM',
    description:
      'Low risks may be accepted at the level directed by the Program Manager. Documentation and tracking requirements are at PM discretion.',
  },
};

// =============================================================================
// System Safety Program Tasks (Section 4.4)
// =============================================================================

export const SYSTEM_SAFETY_TASKS: SystemSafetyTaskGroup[] = [
  {
    id: 'TASK-100',
    name: 'System Safety Program',
    description: 'Tasks related to planning and managing the system safety program',
    tasks: [
      {
        id: '101',
        name: 'System Safety Program Plan',
        description:
          'Document the approach, organization, resources, methods, and schedule for the system safety program. The SSPP describes how the contractor will implement MIL-STD-882E requirements.',
        applicability: ['All acquisition phases', 'All system types'],
        outputs: ['System Safety Program Plan (SSPP)'],
      },
      {
        id: '102',
        name: 'Integration of System Safety in SE Process',
        description:
          'Integrate system safety engineering into the overall systems engineering process. Ensure safety is considered throughout the system lifecycle.',
        applicability: ['All acquisition phases', 'All system types'],
        outputs: ['Systems Engineering Management Plan updates', 'Safety integration documentation'],
      },
      {
        id: '103',
        name: 'System Safety Program Audits and Reviews',
        description:
          'Conduct periodic audits and reviews to assess system safety program implementation and identify areas for improvement.',
        applicability: ['All acquisition phases'],
        outputs: ['Audit reports', 'Review findings', 'Corrective action plans'],
      },
      {
        id: '104',
        name: 'System Safety Progress Summary',
        description:
          'Provide periodic summary of system safety program status, including hazard analysis progress, risk status, and verification activities.',
        applicability: ['All acquisition phases'],
        outputs: ['System Safety Progress Reports'],
      },
    ],
  },
  {
    id: 'TASK-200',
    name: 'Hazard Analysis',
    description: 'Tasks related to identifying and analyzing system hazards',
    tasks: [
      {
        id: '201',
        name: 'Preliminary Hazard List (PHL)',
        description:
          'Compile an initial list of potential hazards based on system description, intended use, and historical data from similar systems.',
        applicability: ['Concept', 'Technology Development'],
        outputs: ['Preliminary Hazard List'],
      },
      {
        id: '202',
        name: 'Preliminary Hazard Analysis (PHA)',
        description:
          'Perform initial hazard analysis to identify hazards, assess initial risk, and identify potential hazard controls. Forms basis for system safety requirements.',
        applicability: ['Technology Development', 'Engineering & Manufacturing Development'],
        outputs: ['Preliminary Hazard Analysis Report', 'Hazard Tracking System entries'],
      },
      {
        id: '203',
        name: 'Subsystem Hazard Analysis (SSHA)',
        description:
          'Analyze subsystems to identify hazards arising from design details. Evaluate hazard controls at the subsystem level.',
        applicability: ['Engineering & Manufacturing Development'],
        outputs: ['Subsystem Hazard Analysis Report', 'Hazard Tracking System updates'],
      },
      {
        id: '204',
        name: 'System Hazard Analysis (SHA)',
        description:
          'Analyze integrated system to identify hazards from subsystem interfaces and integrated operation. Evaluate system-level hazard controls.',
        applicability: ['Engineering & Manufacturing Development', 'Production & Deployment'],
        outputs: ['System Hazard Analysis Report', 'Hazard Tracking System updates'],
      },
      {
        id: '205',
        name: 'Operating & Support Hazard Analysis (O&SHA)',
        description:
          'Analyze hazards associated with operating and supporting the system, including maintenance, training, and logistics.',
        applicability: ['Engineering & Manufacturing Development', 'Operations & Support'],
        outputs: ['Operating and Support Hazard Analysis Report'],
      },
      {
        id: '206',
        name: 'Health Hazard Assessment',
        description:
          'Identify and evaluate health hazards including toxic materials, radiation, noise, and ergonomic factors.',
        applicability: ['All acquisition phases'],
        outputs: ['Health Hazard Assessment Report'],
      },
      {
        id: '207',
        name: 'Functional Hazard Analysis (FHA)',
        description:
          'Top-down functional analysis to identify hazards associated with system functions and their failure conditions.',
        applicability: ['Concept', 'Technology Development'],
        outputs: ['Functional Hazard Analysis Report'],
      },
      {
        id: '208',
        name: 'Fault Tree Analysis (FTA)',
        description:
          'Deductive analysis method to identify combinations of events that lead to a hazardous top event. Quantify probability if data available.',
        applicability: ['Engineering & Manufacturing Development'],
        outputs: ['Fault Tree Analysis Report', 'Minimal cut sets'],
      },
      {
        id: '209',
        name: 'Failure Mode and Effects Analysis (FMEA)',
        description:
          'Inductive analysis method to identify failure modes and their effects on system operation and safety.',
        applicability: ['Engineering & Manufacturing Development'],
        outputs: ['FMEA Report', 'Criticality Analysis (if FMECA)'],
      },
      {
        id: '210',
        name: 'Event Tree Analysis (ETA)',
        description:
          'Forward-looking analysis to trace possible outcomes from an initiating event through a series of success/failure conditions.',
        applicability: ['Engineering & Manufacturing Development'],
        outputs: ['Event Tree Analysis Report'],
      },
    ],
  },
  {
    id: 'TASK-300',
    name: 'Risk Assessment',
    description: 'Tasks related to assessing and documenting risk',
    tasks: [
      {
        id: '301',
        name: 'Safety Assessment Report',
        description:
          'Comprehensive assessment of system safety status including hazard analysis results, risk levels, verification status, and recommendations.',
        applicability: ['All acquisition phases'],
        outputs: ['Safety Assessment Report (SAR)'],
      },
      {
        id: '302',
        name: 'Test Safety Assessment',
        description:
          'Assess hazards and risks associated with testing activities. Identify safety precautions and controls for test execution.',
        applicability: ['Engineering & Manufacturing Development'],
        outputs: ['Test Safety Assessment Report', 'Test Hazard Analysis'],
      },
      {
        id: '303',
        name: 'Explosive Ordnance Disposal Assessment',
        description:
          'Assess system for explosive ordnance disposal requirements. Evaluate hazards during disposal operations.',
        applicability: ['Engineering & Manufacturing Development', 'Operations & Support'],
        outputs: ['EOD Assessment Report'],
      },
      {
        id: '304',
        name: 'Environmental Impact Assessment',
        description:
          'Assess potential environmental hazards and impacts from system operation, accidents, and disposal.',
        applicability: ['All acquisition phases'],
        outputs: ['Environmental Impact Assessment Report'],
      },
    ],
  },
  {
    id: 'TASK-400',
    name: 'Supporting Activities',
    description: 'Tasks supporting the system safety program',
    tasks: [
      {
        id: '401',
        name: 'Safety Verification',
        description:
          'Verify that hazard controls are implemented and effective. Ensure safety requirements are met through testing, analysis, and inspection.',
        applicability: ['Engineering & Manufacturing Development', 'Production & Deployment'],
        outputs: ['Safety Verification Reports', 'Compliance matrices'],
      },
      {
        id: '402',
        name: 'Training Safety',
        description:
          'Identify safety hazards in training systems and activities. Ensure training adequately addresses system safety requirements.',
        applicability: ['Engineering & Manufacturing Development', 'Operations & Support'],
        outputs: ['Training Safety Assessment', 'Safety training materials'],
      },
      {
        id: '403',
        name: 'Mishap Data',
        description:
          'Collect, analyze, and apply mishap and incident data to identify trends and improve system safety.',
        applicability: ['Operations & Support'],
        outputs: ['Mishap reports', 'Trend analysis', 'Lessons learned'],
      },
      {
        id: '404',
        name: 'Software Safety',
        description:
          'Identify and mitigate hazards associated with software controlling safety-critical functions.',
        applicability: ['Engineering & Manufacturing Development'],
        outputs: ['Software Hazard Analysis', 'Software Safety Case'],
      },
      {
        id: '405',
        name: 'Human Factors Safety',
        description:
          'Analyze human factors contributions to hazards. Design human-system interfaces to minimize human error.',
        applicability: ['All acquisition phases'],
        outputs: ['Human Factors Analysis', 'Human Error Analysis'],
      },
      {
        id: '406',
        name: 'Hazardous Materials Management',
        description:
          'Identify, control, and minimize use of hazardous materials. Ensure proper handling, storage, and disposal.',
        applicability: ['All acquisition phases'],
        outputs: ['Hazardous Materials List', 'Management procedures'],
      },
    ],
  },
];

// =============================================================================
// Hazard Tracking and Risk Resolution Requirements
// =============================================================================

export const HAZARD_TRACKING_REQUIREMENTS: HazardTrackingRequirement[] = [
  {
    id: 'HTR-1',
    requirement: 'All identified hazards shall be documented in a Hazard Tracking System',
    description:
      'A formal hazard tracking system shall be established to document, track, and manage all identified hazards throughout the system lifecycle.',
    deliverables: ['Hazard Tracking System', 'Hazard Log'],
  },
  {
    id: 'HTR-2',
    requirement: 'Each hazard shall be assigned a unique identifier',
    description:
      'Every hazard shall receive a unique alphanumeric identifier to facilitate tracking, cross-referencing, and reporting.',
    deliverables: ['Hazard identification numbering scheme'],
  },
  {
    id: 'HTR-3',
    requirement: 'Hazard status shall be tracked through resolution',
    description:
      'The status of each hazard shall be tracked from identification through closure, including: Open, In Analysis, Controls Identified, Controls Implemented, Verified, Closed.',
    deliverables: ['Hazard status reports', 'Progress metrics'],
  },
  {
    id: 'HTR-4',
    requirement: 'Risk acceptance shall be documented at appropriate authority level',
    description:
      'Risk acceptance decisions shall be formally documented with signature from the appropriate risk acceptance authority based on the residual risk level.',
    deliverables: ['Risk acceptance documentation', 'Signature records'],
  },
  {
    id: 'HTR-5',
    requirement: 'Hazard closure shall require verification of control implementation',
    description:
      'Before a hazard can be closed, objective evidence shall demonstrate that all identified controls have been implemented and verified effective.',
    deliverables: ['Verification evidence', 'Closure documentation'],
  },
  {
    id: 'HTR-6',
    requirement: 'Hazard analysis shall trace to system requirements',
    description:
      'Hazards and their controls shall be traceable to system safety requirements and design documents.',
    deliverables: ['Traceability matrix', 'Requirements allocation'],
  },
  {
    id: 'HTR-7',
    requirement: 'Residual risk shall be reassessed when changes occur',
    description:
      'When system design, operational environment, or other factors change, affected hazards shall be reassessed for risk impact.',
    deliverables: ['Risk reassessment documentation', 'Change impact analysis'],
  },
];

// =============================================================================
// Hazard Control Precedence (Order of Precedence)
// =============================================================================

export interface HazardControlPrecedence {
  priority: number;
  method: string;
  description: string;
  examples: string[];
}

export const HAZARD_CONTROL_PRECEDENCE: HazardControlPrecedence[] = [
  {
    priority: 1,
    method: 'Eliminate Hazards Through Design Selection',
    description:
      'Design to eliminate hazards. Where total elimination is not possible, reduce the associated risk to an acceptable level through design selection.',
    examples: [
      'Use nonhazardous materials instead of hazardous ones',
      'Use inherently safe design approaches',
      'Remove hazardous energy sources where possible',
    ],
  },
  {
    priority: 2,
    method: 'Reduce Risk Through Design Alteration',
    description:
      'If hazards cannot be eliminated, reduce the risk to an acceptable level through design alteration.',
    examples: [
      'Add redundancy for critical functions',
      'Incorporate fail-safe design features',
      'Limit exposure to hazardous conditions',
      'Reduce magnitude of potential mishap',
    ],
  },
  {
    priority: 3,
    method: 'Incorporate Safety Devices',
    description:
      'If unable to eliminate hazards or adequately reduce risk through design, include safety devices as part of the system.',
    examples: [
      'Interlocks to prevent unsafe operations',
      'Automatic shutoffs',
      'Shields and barriers',
      'Personal protective equipment requirements',
    ],
  },
  {
    priority: 4,
    method: 'Provide Warning Devices',
    description:
      'If safety devices do not adequately reduce risk, provide warning devices to detect the hazardous condition and alert personnel.',
    examples: [
      'Audible and visual alarms',
      'Caution and warning labels',
      'Automated monitoring systems',
    ],
  },
  {
    priority: 5,
    method: 'Develop Procedures and Training',
    description:
      'When other controls are infeasible or do not adequately reduce risk, incorporate procedures and training.',
    examples: [
      'Operating procedures with safety steps',
      'Maintenance safety procedures',
      'Personnel qualification requirements',
      'Emergency procedures',
    ],
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Calculate risk level from severity and probability using MIL-STD-882E matrix
 * @param severity - Severity category (1-4)
 * @param probability - Probability level (A-F)
 * @returns Risk level string
 */
export const getMILSTD882ERisk = (
  severity: SeverityCategory,
  probability: ProbabilityLevel
): RiskLevel | 'Eliminated' => {
  if (probability === 'F') {
    return 'Eliminated';
  }
  return MIL_STD_882E_RISK_MATRIX[probability][severity];
};

/**
 * Get required approval authority for a given risk level
 * @param riskLevel - Risk level (High, Serious, Medium, Low)
 * @returns Risk acceptance authority information
 */
export const getRequiredApprovalAuthority = (riskLevel: RiskLevel): RiskAcceptanceInfo => {
  return RISK_ACCEPTANCE_AUTHORITY[riskLevel];
};

/**
 * Get severity definition by category number
 * @param category - Severity category (1-4)
 * @returns Severity definition
 */
export const getSeverityDefinition = (category: SeverityCategory): SeverityDefinition => {
  return MIL_STD_882E_SEVERITY[category];
};

/**
 * Get probability definition by level
 * @param level - Probability level (A-F)
 * @returns Probability definition
 */
export const getProbabilityDefinition = (level: ProbabilityLevel): ProbabilityDefinition => {
  return MIL_STD_882E_PROBABILITY[level];
};

/**
 * Get all tasks for a specific task group
 * @param groupId - Task group ID (e.g., 'TASK-100', 'TASK-200')
 * @returns Array of subtasks or undefined if group not found
 */
export const getTasksByGroup = (groupId: string): SystemSafetySubTask[] | undefined => {
  const group = SYSTEM_SAFETY_TASKS.find((g) => g.id === groupId);
  return group?.tasks;
};

/**
 * Get a specific task by its ID
 * @param taskId - Task ID (e.g., '201', '302')
 * @returns Task definition or undefined if not found
 */
export const getTaskById = (taskId: string): SystemSafetySubTask | undefined => {
  for (const group of SYSTEM_SAFETY_TASKS) {
    const task = group.tasks.find((t) => t.id === taskId);
    if (task) {
      return task;
    }
  }
  return undefined;
};

/**
 * Get all hazard analysis tasks (TASK-200 group)
 * @returns Array of hazard analysis tasks
 */
export const getHazardAnalysisTasks = (): SystemSafetySubTask[] => {
  return getTasksByGroup('TASK-200') ?? [];
};

/**
 * Calculate risk matrix color for UI display
 * @param riskLevel - Risk level
 * @returns CSS color class or hex color
 */
export const getRiskColor = (riskLevel: RiskLevel | 'Eliminated'): string => {
  const colors: Record<RiskLevel | 'Eliminated', string> = {
    High: '#dc2626', // red-600
    Serious: '#ea580c', // orange-600
    Medium: '#ca8a04', // yellow-600
    Low: '#16a34a', // green-600
    Eliminated: '#6b7280', // gray-500
  };
  return colors[riskLevel];
};

// =============================================================================
// All Tasks Flattened
// =============================================================================

export const ALL_SYSTEM_SAFETY_TASKS: SystemSafetySubTask[] = SYSTEM_SAFETY_TASKS.flatMap(
  (group) => group.tasks
);

// =============================================================================
// Summary Statistics
// =============================================================================

export interface MIL_STD_882E_Summary {
  totalTasks: number;
  taskGroups: number;
  severityCategories: number;
  probabilityLevels: number;
  riskLevels: number;
  hazardTrackingRequirements: number;
  controlPrecedenceLevels: number;
}

export const MIL_STD_882E_SUMMARY: MIL_STD_882E_Summary = {
  totalTasks: ALL_SYSTEM_SAFETY_TASKS.length,
  taskGroups: SYSTEM_SAFETY_TASKS.length,
  severityCategories: Object.keys(MIL_STD_882E_SEVERITY).length,
  probabilityLevels: Object.keys(MIL_STD_882E_PROBABILITY).length,
  riskLevels: Object.keys(RISK_ACCEPTANCE_AUTHORITY).length,
  hazardTrackingRequirements: HAZARD_TRACKING_REQUIREMENTS.length,
  controlPrecedenceLevels: HAZARD_CONTROL_PRECEDENCE.length,
};

// =============================================================================
// Alternative Export Formats (Array-based for easier iteration)
// =============================================================================

/**
 * MIL-STD-882E Severity Categories (Table I) - Array format
 */
export const milstd882eSeverityCategories = [
  {
    category: 1,
    description: 'Catastrophic',
    definition:
      'Death, permanent total disability, irreversible significant environmental impact, or monetary loss equal to or exceeding $10M',
  },
  {
    category: 2,
    description: 'Critical',
    definition:
      'Permanent partial disability, injuries or occupational illness that may result in hospitalization of at least three personnel, reversible significant environmental impact, or monetary loss equal to or exceeding $1M but less than $10M',
  },
  {
    category: 3,
    description: 'Marginal',
    definition:
      'Injury or occupational illness resulting in one or more lost work day(s), reversible moderate environmental impact, or monetary loss equal to or exceeding $100K but less than $1M',
  },
  {
    category: 4,
    description: 'Negligible',
    definition:
      'Injury or occupational illness not resulting in a lost work day, minimal environmental impact, or monetary loss less than $100K',
  },
] as const;

/**
 * MIL-STD-882E Probability Levels (Table II) - Array format
 */
export const milstd882eProbabilityLevels = [
  {
    level: 'A',
    description: 'Frequent',
    definition: 'Likely to occur often in the life of an item',
    fleetProbability: '> 10^-1',
    itemProbability: 'Continuously experienced',
  },
  {
    level: 'B',
    description: 'Probable',
    definition: 'Will occur several times in the life of an item',
    fleetProbability: '> 10^-2',
    itemProbability: 'Will occur frequently',
  },
  {
    level: 'C',
    description: 'Occasional',
    definition: 'Likely to occur sometime in the life of an item',
    fleetProbability: '> 10^-3',
    itemProbability: 'Will occur several times',
  },
  {
    level: 'D',
    description: 'Remote',
    definition: 'Unlikely but possible to occur in the life of an item',
    fleetProbability: '> 10^-6',
    itemProbability: 'Unlikely but can reasonably be expected to occur',
  },
  {
    level: 'E',
    description: 'Improbable',
    definition: 'So unlikely, it can be assumed occurrence may not be experienced',
    fleetProbability: '≤ 10^-6',
    itemProbability: 'Unlikely to occur, but possible',
  },
  {
    level: 'F',
    description: 'Eliminated',
    definition:
      'Incapable of occurrence. This level is used when potential hazards are identified and later eliminated',
    fleetProbability: '0',
    itemProbability: 'Incapable of occurrence',
  },
] as const;

/**
 * MIL-STD-882E Risk Assessment Matrix (Table III) - Matrix format
 */
export const milstd882eRiskMatrix = {
  // severity × probability → RAC (Risk Assessment Code)
  // Columns: Catastrophic (1), Critical (2), Marginal (3), Negligible (4)
  matrix: [
    ['High', 'High', 'Serious', 'Medium'] as const, // Frequent (A)
    ['High', 'High', 'Serious', 'Medium'] as const, // Probable (B)
    ['High', 'Serious', 'Medium', 'Low'] as const, // Occasional (C)
    ['Serious', 'Medium', 'Medium', 'Low'] as const, // Remote (D)
    ['Medium', 'Medium', 'Medium', 'Low'] as const, // Improbable (E)
    ['Eliminated', 'Eliminated', 'Eliminated', 'Eliminated'] as const, // Eliminated (F)
  ],
  riskAcceptance: {
    High: {
      authority: 'Component Acquisition Executive (CAE)',
      description: 'Unacceptable. Program/Project Manager will notify the CAE or designee',
    },
    Serious: {
      authority: 'Program Executive Officer (PEO)',
      description: 'Undesirable. PEO or designee decision required',
    },
    Medium: {
      authority: 'Program Manager',
      description: 'Acceptable with review by the program manager',
    },
    Low: {
      authority: 'As delegated',
      description: 'Acceptable without review',
    },
  },
} as const;

// =============================================================================
// System Safety Tasks (Appendix A) - Flattened format
// =============================================================================

export interface MilStd882eTask {
  id: string;
  name: string;
  description: string;
  applicability?: string;
  deliverables?: string[];
}

/**
 * MIL-STD-882E System Safety Tasks (Appendix A)
 */
export const milstd882eTasks: MilStd882eTask[] = [
  // Program Management Tasks (100 series)
  {
    id: 'T100',
    name: 'Safety Management Planning',
    description: 'Plan and manage an integrated system safety program',
    applicability: 'All programs',
    deliverables: ['System Safety Program Plan (SSPP)'],
  },
  {
    id: 'T101',
    name: 'Integration of System Safety into Programs',
    description: 'Integrate system safety engineering into overall program management',
  },
  {
    id: 'T102',
    name: 'System Safety Program Plan (SSPP)',
    description: 'Develop and maintain SSPP describing how safety will be addressed',
  },

  // Analysis Tasks (200 series)
  {
    id: 'T201',
    name: 'Preliminary Hazard List (PHL)',
    description: 'Develop list of potential hazards from system concept',
  },
  {
    id: 'T202',
    name: 'Preliminary Hazard Analysis (PHA)',
    description: 'Identify hazards, assess initial risk, define risk mitigation measures',
  },
  {
    id: 'T203',
    name: 'Subsystem Hazard Analysis (SSHA)',
    description: 'Identify hazards at subsystem level, determine causes, effects, and risks',
  },
  {
    id: 'T204',
    name: 'System Hazard Analysis (SHA)',
    description: 'Identify hazards at system level from subsystem interfaces',
  },
  {
    id: 'T205',
    name: 'Operating and Support Hazard Analysis (O&SHA)',
    description: 'Identify hazards during operations, maintenance, logistics',
  },
  {
    id: 'T206',
    name: 'Health Hazard Assessment (HHA)',
    description: 'Identify health hazards from system characteristics',
  },
  {
    id: 'T207',
    name: 'Functional Hazard Analysis (FHA)',
    description: 'Examine system functions to identify hazardous malfunctions',
  },
  {
    id: 'T208',
    name: 'Fault Tree Analysis (FTA)',
    description: 'Perform fault tree analysis to identify root causes',
  },
  {
    id: 'T209',
    name: 'Event Tree Analysis (ETA)',
    description: 'Model event sequences leading to mishap scenarios',
  },
  {
    id: 'T210',
    name: 'Failure Modes and Effects Analysis (FMEA)',
    description: 'Identify component failure modes and their effects',
  },
  {
    id: 'T211',
    name: 'Failure Modes, Effects, and Criticality Analysis (FMECA)',
    description: 'FMEA with criticality ranking',
  },
  {
    id: 'T212',
    name: 'Hazard and Operability Study (HAZOP)',
    description: 'Systematic examination of process hazards',
  },
  {
    id: 'T213',
    name: 'Software Hazard Analysis (SwHA)',
    description: 'Identify software-related hazards and controls',
  },
  {
    id: 'T214',
    name: 'Sneak Circuit Analysis (SCA)',
    description: 'Identify latent paths causing unwanted functions',
  },
  {
    id: 'T215',
    name: 'Petri Net Analysis (PNA)',
    description: 'Model concurrent system behavior for hazards',
  },
  {
    id: 'T216',
    name: 'Bent Pin Analysis (BPA)',
    description: 'Analyze connector failure modes',
  },
  {
    id: 'T217',
    name: 'Safety-Critical Function Analysis',
    description: 'Identify and analyze safety-critical functions',
  },

  // Evaluation Tasks (300 series)
  {
    id: 'T301',
    name: 'Safety Assessment Report (SAR)',
    description: 'Document hazard status and risk acceptance',
  },
  {
    id: 'T302',
    name: 'Test and Evaluation Safety',
    description: 'Ensure safety during T&E activities',
  },
  {
    id: 'T303',
    name: 'Safety Verification',
    description: 'Verify implementation of safety requirements',
  },
  {
    id: 'T304',
    name: 'Safety Review Board (SRB)',
    description: 'Conduct reviews of system safety status',
  },
  {
    id: 'T305',
    name: 'Explosive Ordnance Disposal (EOD)',
    description: 'Safety analysis for EOD activities',
  },
];

// =============================================================================
// Hazard Tracking System Requirements
// =============================================================================

export interface MitigationPrecedenceItem {
  order: number;
  method: string;
  description: string;
}

export interface HazardTrackingConfig {
  requiredFields: string[];
  mitigationPrecedence: MitigationPrecedenceItem[];
}

/**
 * MIL-STD-882E Hazard Tracking System Requirements
 */
export const milstd882eHazardTracking: HazardTrackingConfig = {
  requiredFields: [
    'hazardId',
    'hazardDescription',
    'hazardCause',
    'mishapRisk', // severity + probability → RAC
    'riskMitigation', // Design, Safety Device, Warning, Procedure, Training
    'verificationMethod',
    'status', // Open, Monitored, Closed
    'riskAcceptanceAuthority',
    'residualRisk',
  ],
  mitigationPrecedence: [
    {
      order: 1,
      method: 'Design',
      description: 'Eliminate hazards through design selection',
    },
    {
      order: 2,
      method: 'Safety Device',
      description: 'Use safety devices to minimize risk',
    },
    {
      order: 3,
      method: 'Warning Device',
      description: 'Use warning devices to alert personnel',
    },
    {
      order: 4,
      method: 'Procedures and Training',
      description: 'Use procedures and training as last resort',
    },
  ],
};

// =============================================================================
// Software Safety Requirements (Appendix A, Task 213)
// =============================================================================

export interface SoftwareCriticalityLevel {
  level: number;
  description: string;
}

export interface SoftwareSafetyConfig {
  softwareCriticalityIndex: SoftwareCriticalityLevel[];
}

/**
 * MIL-STD-882E Software Safety Requirements (from Appendix A, Task 213)
 */
export const milstd882eSoftwareSafety: SoftwareSafetyConfig = {
  softwareCriticalityIndex: [
    {
      level: 1,
      description:
        'Software exercises autonomous control over potentially hazardous hardware systems, subsystems or components without the possibility of intervention to preclude the occurrence of a hazard',
    },
    {
      level: 2,
      description:
        'Software exercises control over potentially hazardous hardware systems, subsystems, or components allowing time for intervention',
    },
    {
      level: 3,
      description:
        'Software item displays information requiring immediate operator action to mitigate a hazard',
    },
    {
      level: 4,
      description:
        'Software item does not control safety-critical hardware systems, but generates information for making safety-critical decisions',
    },
    {
      level: 5,
      description: 'Software does not have a direct impact on system safety',
    },
  ],
};

// =============================================================================
// RAC Calculation Helper
// =============================================================================

/**
 * Calculate Risk Assessment Code (RAC) from severity and probability
 * @param severity - Severity category (1-4)
 * @param probability - Probability level (A-F)
 * @returns RAC string based on the MIL-STD-882E risk matrix
 */
export function calculateRAC(
  severity: 1 | 2 | 3 | 4,
  probability: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
): string {
  const probabilityIndex: Record<string, number> = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
  };

  const severityIndex = severity - 1; // Convert 1-4 to 0-3
  const probIdx = probabilityIndex[probability];

  return milstd882eRiskMatrix.matrix[probIdx][severityIndex];
}
