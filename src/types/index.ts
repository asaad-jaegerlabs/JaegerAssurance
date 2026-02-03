/**
 * Safety Dashboard Type System - Index
 *
 * Re-exports all types, interfaces, enums, and utility functions
 * from the safety type system for convenient importing.
 *
 * @module types
 * @example
 * // Import specific types
 * import { Hazard, SeverityLevel, DAL } from '@/types';
 *
 * // Import everything
 * import * as SafetyTypes from '@/types';
 */

// =============================================================================
// ENUMS
// =============================================================================

export {
  SeverityLevel,
  LikelihoodLevel,
  DAL,
  ASIL,
  HazardStatus,
  VerificationStatus,
  GateType,
  GSNNodeType,
  EvidenceType,
} from './safety';

// =============================================================================
// CORE INTERFACES
// =============================================================================

export type {
  // Change tracking
  ChangeRecord,

  // Hazards
  Mitigation,
  Hazard,

  // Fault Tree Analysis
  FailureData,
  FaultTreeNode,
  CutSet,
  ImportanceMeasure,
  FaultTree,

  // GSN (Goal Structured Notation)
  Evidence,
  ComplianceMapping,
  ReviewStatus,
  Confidence,
  GSNNode,

  // FMEA
  FMEAItem,

  // Requirements
  Requirement,

  // Utility Types
  RiskLevel,
  RiskMatrix,
  DALRequirements,
  TraceabilityLink,

  // State Management
  SafetyState,
  SafetyActions,
} from './safety';

// =============================================================================
// CONSTANTS
// =============================================================================

export {
  DEFAULT_RISK_MATRIX,
  DEFAULT_DAL_REQUIREMENTS,
} from './safety';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export {
  // Type guards
  isSeverityLevel,
  isLikelihoodLevel,
  isDAL,
  isGateType,
  isGSNNodeType,

  // Calculation helpers
  calculateRiskScore,
  deriveDalFromSeverity,
  calculateRPN,
} from './safety';
