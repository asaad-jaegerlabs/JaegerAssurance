/**
 * Data Module Index
 *
 * Re-exports all sample data for the UAS Safety Dashboard.
 * This provides a centralized import point for safety analysis data.
 *
 * @module data
 */

// =============================================================================
// Sample Data Exports
// =============================================================================

export {
  // Extended Types
  type ExtendedHazard,
  type MitigationRecord,
  type ExtendedFaultTree,
  type ExtendedCutSet,
  type GSNNodeType,
  type ConfidenceLevel,
  type ComplianceMapping,
  type GSNEvidence,
  type GSNNode,
  type ExtendedFMEAItem,
  type ExtendedRequirement,
  type SafetyKPIs,
  type IncidentDataPoint,
  type HazardCategoryData,
  type SafetyMetricCompletion,

  // Hazard Data
  sampleHazards,

  // Fault Tree Data
  sampleFaultTree,

  // GSN Safety Case Data
  sampleGSNNodes,

  // FMEA Data
  sampleFMEAItems,

  // Requirements Data
  sampleRequirements,

  // Evidence Data
  sampleEvidence,

  // KPI Data
  sampleKPIs,

  // Trend and Chart Data
  sampleIncidentData,
  sampleHazardByCategory,
  sampleSafetyMetrics,

  // Reference Data
  riskMatrixData,
  dalRequirements,
  systemArchitecture,
} from './sampleData';

// =============================================================================
// Convenience Re-exports from Types
// =============================================================================

export type {
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
} from '../types/safety';
