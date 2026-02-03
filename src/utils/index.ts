/**
 * Safety Dashboard Utilities
 *
 * Re-exports all utility functions for aerospace/aviation safety analysis.
 *
 * @module utils
 */

// Re-export all safety calculation utilities
export {
  // Risk Calculation
  RISK_MATRIX,
  calculateRiskScore,

  // Fault Tree Probability
  calculateGateProbability,
  failureRateToProbability,
  calculateTreeProbabilities,

  // Cut Set Analysis
  identifyMinimalCutSets,
  isSinglePointFailure,
  calculateCutSetProbability,

  // Importance Measures
  calculateFussellVesely,
  calculateBirnbaum,
  calculateRAW,
  calculateRRW,
  calculateAllImportanceMeasures,

  // FMEA Calculations
  calculateRPN,
  calculateActionPriority,
  sortByRPN,

  // DAL Allocation
  severityToDAL,
  isValidDALDecomposition,

  // Validation Functions
  validateHazardForCertification,
  validateTraceability,
  validateFaultTree,

  // ID Generation
  generateId,

  // Filtering
  filterHazards,

  // Serialization (Zustand persistence)
  serializeState,
  deserializeState,
} from './safety';

// Re-export types for convenience
export type {
  // Core types
  SeverityLevel,
  LikelihoodLevel,
  RiskLevel,
  RiskScore,
  GateType,
  FaultTreeNodeType,
  FaultTreeNode,
  CutSet,
  ImportanceMeasure,
  FMEAItem,
  DAL,
  DALDecomposition,
  HazardStatus,
  Hazard,
  RequirementType,
  Requirement,
  EvidenceType,
  Evidence,
  ValidationResult,
  TraceabilityResult,

  // State management types
  ChangeHistoryEntry,
  TrackedHazard,
  GSNNodeType,
  GSNNodeStatus,
  GSNNode,
  FaultTreeGateType,
  FaultTree,
  TrackedFMEAItem,
  TrackedEvidence,
  TrackedRequirement,
  ArtifactType,
  TraceabilityLink,
  FilterState,
  ActionType,
  Action,
  SafetyDataExport,
} from '../types/safety';
