/**
 * ARP4754A Guidelines for Development of Civil Aircraft and Systems
 *
 * This file contains development assurance level assignment criteria,
 * validation and verification objectives, and process requirements.
 */

// Item Development Assurance Level (IDAL)
export type IDAL = 'A' | 'B' | 'C' | 'D' | 'E';

// Failure condition classification
export type FailureConditionClassification =
  | 'Catastrophic'
  | 'Hazardous'
  | 'Major'
  | 'Minor'
  | 'NoSafetyEffect';

// IDAL Definition
export interface IDALDefinition {
  level: IDAL;
  name: string;
  failureCondition: FailureConditionClassification;
  description: string;
  developmentObjective: string;
}

export const IDAL_DEFINITIONS: Record<IDAL, IDALDefinition> = {
  A: {
    level: 'A',
    name: 'Development Assurance Level A',
    failureCondition: 'Catastrophic',
    description: 'Failure may cause or contribute to a catastrophic failure condition for the aircraft.',
    developmentObjective: 'Ensure that errors have been identified and corrected to the extent that no reasonably foreseeable error could cause or contribute to a catastrophic failure condition.',
  },
  B: {
    level: 'B',
    name: 'Development Assurance Level B',
    failureCondition: 'Hazardous',
    description: 'Failure may cause or contribute to a hazardous/severe-major failure condition for the aircraft.',
    developmentObjective: 'Ensure that errors have been identified and corrected to the extent that no reasonably foreseeable error could cause or contribute to a hazardous/severe-major failure condition.',
  },
  C: {
    level: 'C',
    name: 'Development Assurance Level C',
    failureCondition: 'Major',
    description: 'Failure may cause or contribute to a major failure condition for the aircraft.',
    developmentObjective: 'Ensure that errors have been identified and corrected to the extent that no reasonably foreseeable error could cause or contribute to a major failure condition.',
  },
  D: {
    level: 'D',
    name: 'Development Assurance Level D',
    failureCondition: 'Minor',
    description: 'Failure may cause or contribute to a minor failure condition for the aircraft.',
    developmentObjective: 'Ensure that errors have been identified and corrected to the extent that no reasonably foreseeable error could cause or contribute to a minor failure condition.',
  },
  E: {
    level: 'E',
    name: 'Development Assurance Level E',
    failureCondition: 'NoSafetyEffect',
    description: 'Failure has no safety effect on the operation of the aircraft.',
    developmentObjective: 'No specific development assurance objectives.',
  },
};

// IDAL Assignment Criteria
export interface IDALAssignmentCriterion {
  id: string;
  criterion: string;
  description: string;
  considerations: string[];
  evidenceRequired: string[];
}

export const IDAL_ASSIGNMENT_CRITERIA: IDALAssignmentCriterion[] = [
  {
    id: 'IDAL-AC-1',
    criterion: 'Function contribution to failure condition',
    description: 'Assess whether the function can cause or contribute to the failure condition without combination with other failures.',
    considerations: [
      'Single failure path analysis',
      'Function criticality to system operation',
      'Potential for undetected failure',
      'Time exposure to failure condition',
    ],
    evidenceRequired: ['FHA results', 'Fault tree analysis', 'Function-to-failure condition mapping'],
  },
  {
    id: 'IDAL-AC-2',
    criterion: 'Independence of redundant functions',
    description: 'Assess independence between redundant functions to determine if IDAL reduction is justified.',
    considerations: [
      'Common cause analysis results',
      'Software/hardware dissimilarity',
      'Physical separation',
      'Design diversity',
    ],
    evidenceRequired: ['CCA results', 'Independence analysis', 'Dissimilarity assessment'],
  },
  {
    id: 'IDAL-AC-3',
    criterion: 'Development error containment',
    description: 'Assess mechanisms that prevent development errors from causing failure conditions.',
    considerations: [
      'Partitioning effectiveness',
      'Interface protection',
      'Error detection and handling',
      'Monitoring and cross-checking',
    ],
    evidenceRequired: ['Architecture analysis', 'Error containment verification'],
  },
  {
    id: 'IDAL-AC-4',
    criterion: 'Exposure time',
    description: 'Consider the exposure time during which a latent failure could exist undetected.',
    considerations: [
      'Test interval coverage',
      'Maintenance inspection intervals',
      'Continuous monitoring capability',
      'Dispatch requirements',
    ],
    evidenceRequired: ['Maintenance analysis', 'Test coverage analysis'],
  },
  {
    id: 'IDAL-AC-5',
    criterion: 'Combination with other failures',
    description: 'Assess whether the function failure requires combination with other failures to cause the failure condition.',
    considerations: [
      'Probability of combined failures',
      'Independence of combined failures',
      'Number of failures required',
      'Cascading failure potential',
    ],
    evidenceRequired: ['Fault tree analysis', 'Probability calculations'],
  },
];

// Validation Objectives
export interface ValidationObjective {
  id: string;
  objective: string;
  description: string;
  activities: string[];
  applicability: Record<IDAL, boolean>;
  evidenceItems: string[];
}

export const VALIDATION_OBJECTIVES: ValidationObjective[] = [
  {
    id: 'VAL-1',
    objective: 'Requirements capture completeness',
    description: 'Validate that all certification basis requirements are captured in the system requirements.',
    activities: [
      'Review certification basis traceability',
      'Verify all regulatory requirements addressed',
      'Confirm no missing requirements',
      'Validate operational requirements coverage',
    ],
    applicability: { A: true, B: true, C: true, D: true, E: false },
    evidenceItems: ['Requirements traceability matrix', 'Certification basis review'],
  },
  {
    id: 'VAL-2',
    objective: 'Requirements correctness',
    description: 'Validate that requirements correctly represent the intended aircraft and system functions.',
    activities: [
      'Review requirements against operational concept',
      'Validate requirements with stakeholders',
      'Confirm requirements address intended functions',
      'Review derived requirements rationale',
    ],
    applicability: { A: true, B: true, C: true, D: true, E: false },
    evidenceItems: ['Requirements review records', 'Stakeholder validation records'],
  },
  {
    id: 'VAL-3',
    objective: 'System-level validation',
    description: 'Validate that the implemented system performs its intended functions correctly.',
    activities: [
      'Conduct system-level tests',
      'Perform integration testing',
      'Validate in representative environment',
      'Conduct flight testing as required',
    ],
    applicability: { A: true, B: true, C: true, D: true, E: false },
    evidenceItems: ['System test reports', 'Integration test results', 'Flight test data'],
  },
  {
    id: 'VAL-4',
    objective: 'Safety requirements validation',
    description: 'Validate that derived safety requirements are correct and necessary.',
    activities: [
      'Review safety requirements derivation',
      'Validate safety analysis assumptions',
      'Confirm safety requirement necessity',
      'Validate safety requirement sufficiency',
    ],
    applicability: { A: true, B: true, C: true, D: true, E: false },
    evidenceItems: ['Safety requirements review', 'Safety analysis validation'],
  },
  {
    id: 'VAL-5',
    objective: 'Interface requirements validation',
    description: 'Validate that interface requirements correctly define system boundaries and interactions.',
    activities: [
      'Review interface control documents',
      'Validate interface compatibility',
      'Confirm interface completeness',
      'Test interface behavior',
    ],
    applicability: { A: true, B: true, C: true, D: true, E: false },
    evidenceItems: ['ICD review records', 'Interface test results'],
  },
];

// Verification Objectives
export interface VerificationObjective {
  id: string;
  objective: string;
  description: string;
  verificationMethods: string[];
  applicability: Record<IDAL, boolean>;
  evidenceItems: string[];
  independenceRequired: Record<IDAL, boolean>;
}

export const VERIFICATION_OBJECTIVES: VerificationObjective[] = [
  {
    id: 'VER-1',
    objective: 'Requirements traceability',
    description: 'Verify bidirectional traceability between requirements at all levels.',
    verificationMethods: ['Review', 'Analysis'],
    applicability: { A: true, B: true, C: true, D: true, E: false },
    evidenceItems: ['Traceability matrix', 'Review records'],
    independenceRequired: { A: true, B: false, C: false, D: false, E: false },
  },
  {
    id: 'VER-2',
    objective: 'Requirements compliance',
    description: 'Verify that the design and implementation comply with all requirements.',
    verificationMethods: ['Review', 'Analysis', 'Test', 'Inspection'],
    applicability: { A: true, B: true, C: true, D: true, E: false },
    evidenceItems: ['Verification results', 'Compliance matrix'],
    independenceRequired: { A: true, B: false, C: false, D: false, E: false },
  },
  {
    id: 'VER-3',
    objective: 'Design consistency',
    description: 'Verify that the design is internally consistent and consistent with requirements.',
    verificationMethods: ['Review', 'Analysis'],
    applicability: { A: true, B: true, C: true, D: true, E: false },
    evidenceItems: ['Design review records', 'Consistency analysis'],
    independenceRequired: { A: true, B: false, C: false, D: false, E: false },
  },
  {
    id: 'VER-4',
    objective: 'Safety requirements verification',
    description: 'Verify that all safety requirements have been correctly implemented.',
    verificationMethods: ['Review', 'Analysis', 'Test'],
    applicability: { A: true, B: true, C: true, D: true, E: false },
    evidenceItems: ['Safety requirements verification matrix', 'Test results'],
    independenceRequired: { A: true, B: true, C: false, D: false, E: false },
  },
  {
    id: 'VER-5',
    objective: 'Interface verification',
    description: 'Verify that interfaces operate correctly and as specified.',
    verificationMethods: ['Test', 'Analysis', 'Inspection'],
    applicability: { A: true, B: true, C: true, D: true, E: false },
    evidenceItems: ['Interface test results', 'Integration test results'],
    independenceRequired: { A: true, B: false, C: false, D: false, E: false },
  },
  {
    id: 'VER-6',
    objective: 'Environmental qualification',
    description: 'Verify that equipment operates correctly in the intended environment.',
    verificationMethods: ['Test', 'Analysis'],
    applicability: { A: true, B: true, C: true, D: true, E: false },
    evidenceItems: ['Environmental test reports', 'Qualification test results'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  {
    id: 'VER-7',
    objective: 'Performance verification',
    description: 'Verify that performance requirements are met under all conditions.',
    verificationMethods: ['Test', 'Analysis'],
    applicability: { A: true, B: true, C: true, D: true, E: false },
    evidenceItems: ['Performance test results', 'Analysis reports'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  {
    id: 'VER-8',
    objective: 'Reliability verification',
    description: 'Verify that reliability requirements and assumptions are met.',
    verificationMethods: ['Test', 'Analysis', 'Service experience'],
    applicability: { A: true, B: true, C: true, D: true, E: false },
    evidenceItems: ['Reliability analysis', 'Test data', 'Service data'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
];

// Development Process Objectives (from ARP4754A Table 1)
export interface DevelopmentProcessObjective {
  id: string;
  process: string;
  objective: string;
  description: string;
  applicability: Record<IDAL, boolean>;
  outputs: string[];
  independenceRequired: Record<IDAL, boolean>;
}

export const DEVELOPMENT_PROCESS_OBJECTIVES: DevelopmentProcessObjective[] = [
  // Planning Process Objectives
  {
    id: 'DP-1',
    process: 'Planning',
    objective: 'Planning standards and procedures are defined',
    description: 'Define standards and procedures for all development lifecycle processes.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['Development plan', 'Standards', 'Procedures'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  {
    id: 'DP-2',
    process: 'Planning',
    objective: 'Development environment is defined',
    description: 'Define the tools, methods, and environment for development activities.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['Environment description', 'Tool list'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  {
    id: 'DP-3',
    process: 'Planning',
    objective: 'Transition criteria are defined',
    description: 'Define criteria for transition between development phases.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['Transition criteria', 'Phase gate requirements'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  // Requirements Process Objectives
  {
    id: 'DP-4',
    process: 'Requirements',
    objective: 'System requirements are developed',
    description: 'Develop system requirements from higher-level requirements and operational needs.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['System requirements specification'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  {
    id: 'DP-5',
    process: 'Requirements',
    objective: 'Derived requirements are identified',
    description: 'Identify requirements that arise from design decisions and are not directly traceable to higher-level requirements.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['Derived requirements', 'Rationale documentation'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  {
    id: 'DP-6',
    process: 'Requirements',
    objective: 'Safety requirements are defined',
    description: 'Define safety requirements based on safety assessment results.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['Safety requirements', 'DAL assignments'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  // Design Process Objectives
  {
    id: 'DP-7',
    process: 'Design',
    objective: 'System architecture is developed',
    description: 'Develop system architecture that satisfies requirements and safety objectives.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['System architecture description', 'Interface definitions'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  {
    id: 'DP-8',
    process: 'Design',
    objective: 'Detailed design is developed',
    description: 'Develop detailed design implementing the architecture and requirements.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['Detailed design documents', 'Hardware specifications', 'Software specifications'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  {
    id: 'DP-9',
    process: 'Design',
    objective: 'Safety design features are implemented',
    description: 'Implement design features necessary to meet safety requirements.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['Safety design implementation', 'Design justification'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  // Implementation Process Objectives
  {
    id: 'DP-10',
    process: 'Implementation',
    objective: 'Hardware is implemented',
    description: 'Implement hardware according to design specifications.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['Hardware items', 'Manufacturing data'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  {
    id: 'DP-11',
    process: 'Implementation',
    objective: 'Software is implemented',
    description: 'Implement software according to design specifications.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['Software items', 'Executable code'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  {
    id: 'DP-12',
    process: 'Implementation',
    objective: 'System is integrated',
    description: 'Integrate hardware, software, and system elements.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['Integrated system', 'Integration records'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  // Configuration Management Objectives
  {
    id: 'DP-13',
    process: 'Configuration Management',
    objective: 'Configuration items are identified and controlled',
    description: 'Identify and control all configuration items throughout development.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['Configuration index', 'Baseline records'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  {
    id: 'DP-14',
    process: 'Configuration Management',
    objective: 'Change control is established',
    description: 'Establish and maintain change control throughout development.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['Change records', 'Impact assessments'],
    independenceRequired: { A: false, B: false, C: false, D: false, E: false },
  },
  // Quality Assurance Objectives
  {
    id: 'DP-15',
    process: 'Quality Assurance',
    objective: 'Process compliance is assured',
    description: 'Assure that development processes comply with plans and standards.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['QA records', 'Audit reports'],
    independenceRequired: { A: true, B: true, C: true, D: true, E: false },
  },
  {
    id: 'DP-16',
    process: 'Quality Assurance',
    objective: 'Product conformance is verified',
    description: 'Verify that products conform to their specifications.',
    applicability: { A: true, B: true, C: true, D: true, E: false },
    outputs: ['Conformance records', 'Inspection reports'],
    independenceRequired: { A: true, B: true, C: true, D: true, E: false },
  },
];

// Safety Assessment Process Integration
export interface SafetyAssessmentIntegration {
  id: string;
  developmentPhase: string;
  safetyActivity: string;
  description: string;
  inputs: string[];
  outputs: string[];
}

export const SAFETY_ASSESSMENT_INTEGRATION: SafetyAssessmentIntegration[] = [
  {
    id: 'SAI-1',
    developmentPhase: 'Concept',
    safetyActivity: 'Aircraft-Level FHA',
    description: 'Identify aircraft-level functions and failure conditions during concept development.',
    inputs: ['Operational requirements', 'Aircraft concept'],
    outputs: ['Aircraft FHA', 'Safety objectives'],
  },
  {
    id: 'SAI-2',
    developmentPhase: 'Requirements',
    safetyActivity: 'System-Level FHA',
    description: 'Identify system-level functions and failure conditions during requirements development.',
    inputs: ['Aircraft FHA', 'System requirements'],
    outputs: ['System FHA', 'Allocated safety objectives'],
  },
  {
    id: 'SAI-3',
    developmentPhase: 'Design',
    safetyActivity: 'PSSA',
    description: 'Assess preliminary system design and derive safety requirements.',
    inputs: ['System FHA', 'Preliminary design'],
    outputs: ['PSSA', 'Derived safety requirements', 'IDAL assignments'],
  },
  {
    id: 'SAI-4',
    developmentPhase: 'Implementation',
    safetyActivity: 'SSA',
    description: 'Verify safety objective compliance with final implementation.',
    inputs: ['PSSA', 'Final design', 'Verification data'],
    outputs: ['SSA', 'Safety compliance evidence'],
  },
  {
    id: 'SAI-5',
    developmentPhase: 'All Phases',
    safetyActivity: 'CCA',
    description: 'Verify independence assumptions throughout development.',
    inputs: ['Design data', 'Installation data'],
    outputs: ['CCA report', 'Independence verification'],
  },
];

// Combined exports
export const ALL_IDAL_ASSIGNMENT_CRITERIA = IDAL_ASSIGNMENT_CRITERIA;
export const ALL_VALIDATION_OBJECTIVES = VALIDATION_OBJECTIVES;
export const ALL_VERIFICATION_OBJECTIVES = VERIFICATION_OBJECTIVES;
export const ALL_DEVELOPMENT_PROCESS_OBJECTIVES = DEVELOPMENT_PROCESS_OBJECTIVES;
export const ALL_SAFETY_ASSESSMENT_INTEGRATION = SAFETY_ASSESSMENT_INTEGRATION;

// Helper functions
export const getObjectivesForIDAL = (idal: IDAL): {
  validation: ValidationObjective[];
  verification: VerificationObjective[];
  developmentProcess: DevelopmentProcessObjective[];
} => {
  return {
    validation: VALIDATION_OBJECTIVES.filter((obj) => obj.applicability[idal]),
    verification: VERIFICATION_OBJECTIVES.filter((obj) => obj.applicability[idal]),
    developmentProcess: DEVELOPMENT_PROCESS_OBJECTIVES.filter((obj) => obj.applicability[idal]),
  };
};

export const getIndependenceRequiredObjectives = (idal: IDAL): {
  verification: VerificationObjective[];
  developmentProcess: DevelopmentProcessObjective[];
} => {
  return {
    verification: VERIFICATION_OBJECTIVES.filter(
      (obj) => obj.applicability[idal] && obj.independenceRequired[idal]
    ),
    developmentProcess: DEVELOPMENT_PROCESS_OBJECTIVES.filter(
      (obj) => obj.applicability[idal] && obj.independenceRequired[idal]
    ),
  };
};

export const getObjectivesByProcess = (process: string): DevelopmentProcessObjective[] => {
  return DEVELOPMENT_PROCESS_OBJECTIVES.filter((obj) => obj.process === process);
};

// Process categories
export const DEVELOPMENT_PROCESSES = [
  'Planning',
  'Requirements',
  'Design',
  'Implementation',
  'Configuration Management',
  'Quality Assurance',
] as const;

export type DevelopmentProcess = (typeof DEVELOPMENT_PROCESSES)[number];

// Objective counts summary
export interface IDALObjectiveSummary {
  idal: IDAL;
  validationCount: number;
  verificationCount: number;
  developmentProcessCount: number;
  independenceRequiredCount: number;
}

export const getIDALObjectiveSummary = (idal: IDAL): IDALObjectiveSummary => {
  const objectives = getObjectivesForIDAL(idal);
  const independence = getIndependenceRequiredObjectives(idal);

  return {
    idal,
    validationCount: objectives.validation.length,
    verificationCount: objectives.verification.length,
    developmentProcessCount: objectives.developmentProcess.length,
    independenceRequiredCount:
      independence.verification.length + independence.developmentProcess.length,
  };
};
