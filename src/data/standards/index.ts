/**
 * Safety Standards Data
 *
 * This module exports all safety standards data for compliance tracking:
 * - DO-178C: Software Considerations in Airborne Systems and Equipment Certification
 * - ARP4761A: Guidelines and Methods for Conducting the Safety Assessment Process
 * - ARP4754A: Guidelines for Development of Civil Aircraft and Systems
 * - MIL-STD-882E: DoD Standard Practice for System Safety
 * - NAVSEA: Naval Sea Systems Command Safety Requirements
 */

// DO-178C exports
export {
  // Types
  type DAL,
  type DALApplicability,
  type DALIndependence,
  type DO178CObjective,
  type DALDefinition,
  type TableMetadata,
  type ObjectiveCount,
  type CoverageAnalysis,
  // Data
  DAL_DEFINITIONS,
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
  ALL_DO178C_OBJECTIVES,
  TABLE_METADATA,
  OBJECTIVE_COUNTS,
  // Helpers
  getObjectivesByTable,
  getObjectivesForDAL,
  getIndependenceRequiredObjectives as getDO178CIndependenceRequiredObjectives,
  getCoverageAnalysis,
} from './do178c';

// ARP4761A exports
export {
  // Types
  type SeverityCategory as ARP4761ASeverityCategory,
  type SeverityDefinition as ARP4761ASeverityDefinition,
  type AssessmentProcess,
  type FHARequirement,
  type PSSARequirement,
  type SSARequirement,
  type CCAChecklistItem,
  type AnalysisMethod,
  type ProcessMetadata,
  // Data
  SEVERITY_DEFINITIONS,
  FHA_REQUIREMENTS,
  PSSA_REQUIREMENTS,
  SSA_REQUIREMENTS,
  CCA_CHECKLIST_ITEMS,
  ANALYSIS_METHODS,
  PROCESS_METADATA,
  ALL_FHA_REQUIREMENTS,
  ALL_PSSA_REQUIREMENTS,
  ALL_SSA_REQUIREMENTS,
  ALL_CCA_CHECKLIST_ITEMS,
  // Helpers
  getCCAItemsByCategory,
  getAnalysisMethodsByPhase,
} from './arp4761a';

// ARP4754A exports
export {
  // Types
  type IDAL,
  type FailureConditionClassification,
  type IDALDefinition,
  type IDALAssignmentCriterion,
  type ValidationObjective,
  type VerificationObjective,
  type DevelopmentProcessObjective,
  type SafetyAssessmentIntegration,
  type DevelopmentProcess,
  type IDALObjectiveSummary,
  // Data
  IDAL_DEFINITIONS,
  IDAL_ASSIGNMENT_CRITERIA,
  VALIDATION_OBJECTIVES,
  VERIFICATION_OBJECTIVES,
  DEVELOPMENT_PROCESS_OBJECTIVES,
  SAFETY_ASSESSMENT_INTEGRATION,
  DEVELOPMENT_PROCESSES,
  ALL_IDAL_ASSIGNMENT_CRITERIA,
  ALL_VALIDATION_OBJECTIVES,
  ALL_VERIFICATION_OBJECTIVES,
  ALL_DEVELOPMENT_PROCESS_OBJECTIVES,
  ALL_SAFETY_ASSESSMENT_INTEGRATION,
  // Helpers
  getObjectivesForIDAL,
  getIndependenceRequiredObjectives as getARP4754AIndependenceRequiredObjectives,
  getObjectivesByProcess,
  getIDALObjectiveSummary,
} from './arp4754a';

// MIL-STD-882E exports
export {
  // Types
  type SeverityCategory as MILSTD882ESeverityCategory,
  type ProbabilityLevel,
  type RiskLevel,
  type SeverityDefinition as MILSTD882ESeverityDefinition,
  type ProbabilityDefinition,
  type RiskAcceptanceInfo,
  type SystemSafetySubTask,
  type SystemSafetyTaskGroup,
  type HazardTrackingRequirement,
  type HazardControlPrecedence,
  type MIL_STD_882E_Summary,
  type MilStd882eTask,
  type MitigationPrecedenceItem,
  type HazardTrackingConfig,
  type SoftwareCriticalityLevel,
  type SoftwareSafetyConfig,
  // Data - Record format
  MIL_STD_882E_SEVERITY,
  MIL_STD_882E_PROBABILITY,
  MIL_STD_882E_RISK_MATRIX,
  RISK_ACCEPTANCE_AUTHORITY,
  SYSTEM_SAFETY_TASKS,
  HAZARD_TRACKING_REQUIREMENTS,
  HAZARD_CONTROL_PRECEDENCE,
  ALL_SYSTEM_SAFETY_TASKS,
  MIL_STD_882E_SUMMARY,
  // Data - Array format (alternative)
  milstd882eSeverityCategories,
  milstd882eProbabilityLevels,
  milstd882eRiskMatrix,
  milstd882eTasks,
  milstd882eHazardTracking,
  milstd882eSoftwareSafety,
  // Helpers
  getMILSTD882ERisk,
  getRequiredApprovalAuthority,
  getSeverityDefinition,
  getProbabilityDefinition,
  getTasksByGroup,
  getTaskById,
  getHazardAnalysisTasks,
  getRiskColor,
  calculateRAC,
} from './milstd882e';

// NAVSEA exports
export {
  // Types
  type SSCILevel,
  type AutonomyLevel,
  type ComplianceStatus,
  type NAVSEARequirement,
  type SSPRSubTask,
  type SSPRTaskGroup,
  type SSCIDefinition,
  type AutonomyCategoryDefinition,
  type ComplianceEvidence,
  type ComplianceResult,
  type NAVSEASummary,
  // Data - OP5
  NAVSEA_OP5_REQUIREMENTS,
  ALL_NAVSEA_OP5_REQUIREMENTS,
  // Data - UAS Safety
  NAVSEA_UAS_SAFETY_REQUIREMENTS,
  ALL_UAS_SAFETY_REQUIREMENTS,
  // Data - SSPR
  NAVSEA_SSPR_TASKS,
  ALL_SSPR_TASKS,
  // Data - Software Safety Criticality
  SOFTWARE_SAFETY_CRITICALITY,
  // Data - Autonomy
  NAVAL_AUTONOMY_CATEGORIES,
  // Data - Autonomous System Requirements
  AUTONOMOUS_SYSTEM_SAFETY_REQUIREMENTS,
  ALL_AUTONOMOUS_SYSTEM_REQUIREMENTS,
  // Data - Summary
  NAVSEA_SUMMARY,
  // Helpers
  getSoftwareSafetyCriticality,
  getAutonomyCategoryDefinition,
  getNavyComplianceStatus,
  getAllSSPRTasks,
  getSSPRTasksByGroup,
  getSSPRTaskById,
  getSafetyConsiderationsForAutonomy,
  mapSeverityToSSCI,
  getRequirementCategoryColor,
} from './navsea';

// Combined standard information
export interface StandardInfo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  version: string;
  organization: string;
  domain: 'Aviation' | 'Defense' | 'Naval';
}

export const STANDARDS: StandardInfo[] = [
  {
    id: 'DO-178C',
    name: 'DO-178C',
    fullName: 'Software Considerations in Airborne Systems and Equipment Certification',
    description: 'Provides guidance for software development in airborne systems to meet certification requirements.',
    version: 'DO-178C',
    organization: 'RTCA',
    domain: 'Aviation',
  },
  {
    id: 'ARP4761A',
    name: 'ARP4761A',
    fullName: 'Guidelines and Methods for Conducting the Safety Assessment Process on Civil Airborne Systems and Equipment',
    description: 'Describes safety assessment processes including FHA, PSSA, SSA, and CCA.',
    version: 'Revision A',
    organization: 'SAE International',
    domain: 'Aviation',
  },
  {
    id: 'ARP4754A',
    name: 'ARP4754A',
    fullName: 'Guidelines for Development of Civil Aircraft and Systems',
    description: 'Provides guidance for aircraft and systems development processes including validation and verification.',
    version: 'Revision A',
    organization: 'SAE International',
    domain: 'Aviation',
  },
  {
    id: 'MIL-STD-882E',
    name: 'MIL-STD-882E',
    fullName: 'Department of Defense Standard Practice for System Safety',
    description: 'DoD standard practice for system safety including hazard analysis, risk assessment, and safety program management.',
    version: 'Revision E',
    organization: 'Department of Defense',
    domain: 'Defense',
  },
  {
    id: 'NAVSEA-OP5',
    name: 'NAVSEA OP 5',
    fullName: 'Ammunition and Explosives Safety Ashore',
    description: 'Naval Sea Systems Command requirements for ammunition and explosives safety.',
    version: 'Volume 1',
    organization: 'Naval Sea Systems Command',
    domain: 'Naval',
  },
  {
    id: 'NAVSEA-UAS',
    name: 'NAVSEA UAS Safety',
    fullName: 'Naval Technical Publication S9086 - Unmanned Aircraft Systems Safety',
    description: 'Safety requirements for naval unmanned aircraft systems operations.',
    version: 'NSTM Chapter 634',
    organization: 'Naval Sea Systems Command',
    domain: 'Naval',
  },
  {
    id: 'NAVSEA-SSPR',
    name: 'NAVSEA SSPR',
    fullName: 'System Safety Program Requirements',
    description: 'NAVSEA system safety program requirements including software safety and hazard analysis tasks.',
    version: 'Current',
    organization: 'Naval Sea Systems Command',
    domain: 'Naval',
  },
];

// Get standard by ID
export const getStandardById = (id: string): StandardInfo | undefined => {
  return STANDARDS.find((standard) => standard.id === id);
};

// Get standards by domain
export const getStandardsByDomain = (domain: StandardInfo['domain']): StandardInfo[] => {
  return STANDARDS.filter((standard) => standard.domain === domain);
};

// Get aviation standards
export const getAviationStandards = (): StandardInfo[] => {
  return getStandardsByDomain('Aviation');
};

// Get defense standards
export const getDefenseStandards = (): StandardInfo[] => {
  return getStandardsByDomain('Defense');
};

// Get naval standards
export const getNavalStandards = (): StandardInfo[] => {
  return getStandardsByDomain('Naval');
};
