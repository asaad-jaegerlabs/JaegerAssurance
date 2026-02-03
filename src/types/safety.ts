/**
 * Safety Dashboard Type System
 *
 * Comprehensive TypeScript type definitions for aerospace/aviation safety management
 * supporting DO-178C (Software), DO-254 (Hardware), and ARP4761A (Safety Assessment)
 * certification standards.
 *
 * @module safety
 * @version 1.0.0
 */

// =============================================================================
// ENUMS - Industry Standard Safety Classifications
// =============================================================================

/**
 * Severity classification per ARP4761A (Guidelines for conducting safety
 * assessments on civil airborne systems).
 *
 * These categories define the potential consequences of a failure condition
 * on aircraft safety, occupants, and crew.
 */
export enum SeverityLevel {
  /**
   * Failure condition which would prevent continued safe flight and landing.
   * Probability objective: < 1E-9 per flight hour (Extremely Improbable)
   */
  Catastrophic = 'Catastrophic',

  /**
   * Failure condition which would reduce the capability of the aircraft or
   * the ability of the crew to cope with adverse operating conditions to the
   * extent that there would be a large reduction in safety margins or functional
   * capabilities.
   * Probability objective: < 1E-7 per flight hour (Extremely Remote)
   */
  Hazardous = 'Hazardous',

  /**
   * Failure condition which would reduce the capability of the aircraft or
   * the ability of the crew to cope with adverse operating conditions to the
   * extent that there would be a significant reduction in safety margins or
   * functional capabilities.
   * Probability objective: < 1E-5 per flight hour (Remote)
   */
  Major = 'Major',

  /**
   * Failure condition which would not significantly reduce aircraft safety
   * and which would involve crew actions that are well within their capabilities.
   * Probability objective: < 1E-3 per flight hour (Probable)
   */
  Minor = 'Minor',

  /**
   * Failure condition which does not affect the operational capability of
   * the aircraft or increase crew workload.
   * No probability objective required.
   */
  NoEffect = 'NoEffect',
}

/**
 * Likelihood/Probability classification per ARP4761A.
 *
 * Defines the expected frequency of failure condition occurrence during
 * the operational life of the aircraft fleet.
 */
export enum LikelihoodLevel {
  /**
   * Likely to occur one or more times during the operational life of each aircraft.
   * Probability: > 1E-3 per flight hour
   */
  Frequent = 'Frequent',

  /**
   * Likely to occur several times during the total operational life of
   * a number of aircraft of type.
   * Probability: 1E-3 to 1E-5 per flight hour
   */
  Probable = 'Probable',

  /**
   * Unlikely to occur to each aircraft during its total life, but may occur
   * several times when considering the total operational life of a number
   * of aircraft of type.
   * Probability: 1E-5 to 1E-7 per flight hour
   */
  Occasional = 'Occasional',

  /**
   * Unlikely to occur when considering the total operational life of all
   * aircraft of type, but nevertheless has to be considered possible.
   * Probability: 1E-7 to 1E-9 per flight hour
   */
  Remote = 'Remote',

  /**
   * So unlikely that it is not anticipated to occur during the entire
   * operational life of all aircraft of type.
   * Probability: 1E-9 to 1E-11 per flight hour
   */
  ExtremelyRemote = 'ExtremelyRemote',

  /**
   * Failure condition so unlikely that it is virtually inconceivable.
   * Probability: < 1E-9 per flight hour (single failure path requirement)
   */
  ExtremelyImprobable = 'ExtremelyImprobable',
}

/**
 * Design Assurance Level (DAL) per DO-178C/DO-254.
 *
 * Determines the rigor of the development process based on the safety
 * contribution of the software/hardware component.
 */
export enum DAL {
  /**
   * Level A - Catastrophic failure condition contribution.
   * Most rigorous development assurance. Requires:
   * - Formal methods or model-based development
   * - MC/DC code coverage
   * - Full structural coverage analysis
   * - Maximum documentation and verification requirements
   */
  A = 'A',

  /**
   * Level B - Hazardous/Severe-Major failure condition contribution.
   * Requires:
   * - Decision coverage + Modified Condition coverage
   * - High structural coverage
   * - Extensive testing and analysis
   */
  B = 'B',

  /**
   * Level C - Major failure condition contribution.
   * Requires:
   * - Decision coverage
   * - Moderate structural coverage
   * - Comprehensive testing
   */
  C = 'C',

  /**
   * Level D - Minor failure condition contribution.
   * Requires:
   * - Statement coverage
   * - Basic structural coverage
   * - Standard testing practices
   */
  D = 'D',

  /**
   * Level E - No Effect failure condition contribution.
   * No assurance required beyond standard development practices.
   * Documentation for traceability still recommended.
   */
  E = 'E',
}

/**
 * Automotive Safety Integrity Level per ISO 26262.
 *
 * Included for cross-domain reference when interfacing with automotive
 * systems or applying automotive safety standards.
 */
export enum ASIL {
  /**
   * ASIL D - Highest integrity level.
   * Corresponds to potentially life-threatening or fatal injury.
   * Approximate equivalence: DAL A/B
   */
  D = 'D',

  /**
   * ASIL C - High integrity level.
   * Severe or life-threatening injury possibility.
   * Approximate equivalence: DAL B/C
   */
  C = 'C',

  /**
   * ASIL B - Medium integrity level.
   * Serious injury possibility.
   * Approximate equivalence: DAL C/D
   */
  B = 'B',

  /**
   * ASIL A - Lowest safety-related integrity level.
   * Light to moderate injury possibility.
   * Approximate equivalence: DAL D
   */
  A = 'A',

  /**
   * QM - Quality Management.
   * No specific safety requirements beyond standard quality practices.
   * Approximate equivalence: DAL E
   */
  QM = 'QM',
}

/**
 * Hazard lifecycle status.
 *
 * Tracks the progression of a hazard through identification,
 * analysis, mitigation, and closure.
 */
export enum HazardStatus {
  /** Newly identified, awaiting analysis */
  Open = 'Open',

  /** Currently being analyzed for risk and mitigation strategies */
  InAnalysis = 'InAnalysis',

  /** Mitigation measures have been implemented */
  Mitigated = 'Mitigated',

  /** Hazard has been resolved and closed */
  Closed = 'Closed',

  /** Hazard is being monitored for changes or effectiveness of mitigations */
  Monitoring = 'Monitoring',
}

/**
 * Verification activity status.
 *
 * Tracks progress of verification objectives and activities.
 */
export enum VerificationStatus {
  /** Verification activity not yet begun */
  NotStarted = 'NotStarted',

  /** Verification activity underway */
  InProgress = 'InProgress',

  /** Verification successfully completed and passed */
  Complete = 'Complete',

  /** Verification attempted but failed - requires corrective action */
  Failed = 'Failed',
}

/**
 * Logic gate types for Fault Tree Analysis.
 *
 * Defines how child events combine to cause the parent event.
 */
export enum GateType {
  /**
   * AND Gate - All child events must occur for parent event.
   * Output probability = Product of input probabilities
   * P(out) = P(A) * P(B) * ... * P(N)
   */
  AND = 'AND',

  /**
   * OR Gate - Any child event causes parent event.
   * Output probability = 1 - Product of (1 - input probabilities)
   * P(out) = 1 - (1-P(A)) * (1-P(B)) * ... * (1-P(N))
   */
  OR = 'OR',

  /**
   * XOR Gate (Exclusive OR) - Exactly one child event causes parent event.
   * Used for mutually exclusive failure modes.
   */
  XOR = 'XOR',

  /**
   * Voting Gate (M-out-of-N) - At least M of N inputs must occur.
   * Used for redundant systems with voting logic.
   * Example: 2-out-of-3 voting requires 2 failures to cause system failure.
   */
  VOTING = 'VOTING',

  /**
   * Priority AND Gate - All events must occur in a specific sequence.
   * Used when temporal ordering matters.
   */
  PRIORITY_AND = 'PRIORITY_AND',

  /**
   * Inhibit Gate - Conditional AND with enabling condition.
   * Input event causes output only if inhibit condition is present.
   */
  INHIBIT = 'INHIBIT',
}

/**
 * Goal Structured Notation (GSN) node types per GSN Standard v2.
 *
 * Used for building structured safety arguments and safety cases.
 */
export enum GSNNodeType {
  /**
   * Goal - A claim or assertion to be supported.
   * Represented as rectangle in GSN diagrams.
   */
  Goal = 'Goal',

  /**
   * Strategy - Description of how goals are broken down.
   * Represents the inference step in the argument.
   * Represented as parallelogram in GSN diagrams.
   */
  Strategy = 'Strategy',

  /**
   * Solution - Reference to evidence supporting a goal.
   * Links argument to actual verification artifacts.
   * Represented as circle in GSN diagrams.
   */
  Solution = 'Solution',

  /**
   * Context - Contextual information for goals or strategies.
   * Provides scope, assumptions, or background.
   * Represented as rounded rectangle in GSN diagrams.
   */
  Context = 'Context',

  /**
   * Assumption - Statement assumed to be true.
   * Must be validated or justified separately.
   * Represented as oval with 'A' decorator in GSN diagrams.
   */
  Assumption = 'Assumption',

  /**
   * Justification - Rationale for argument approach.
   * Explains why the argument structure is appropriate.
   * Represented as oval with 'J' decorator in GSN diagrams.
   */
  Justification = 'Justification',
}

/**
 * Types of evidence artifacts that support safety arguments.
 *
 * These map to verification objectives in DO-178C/DO-254.
 */
export enum EvidenceType {
  /** Results from test execution (unit, integration, system) */
  TestResult = 'TestResult',

  /** Safety analysis documents (FHA, PSSA, SSA) */
  AnalysisReport = 'AnalysisReport',

  /** Design review, code review, or inspection records */
  ReviewRecord = 'ReviewRecord',

  /** Structural coverage analysis (statement, branch, MC/DC) */
  CodeCoverage = 'CodeCoverage',

  /** Physical inspection or audit records */
  Inspection = 'Inspection',
}

// =============================================================================
// CORE INTERFACES - Primary Domain Models
// =============================================================================

/**
 * Change history record for audit trail.
 *
 * Maintains complete modification history for traceability and
 * configuration management per DO-178C/DO-254 requirements.
 */
export interface ChangeRecord {
  /** ISO 8601 timestamp of the change */
  timestamp: string;

  /** User identifier who made the change */
  user: string;

  /** Name of the field that was modified */
  field: string;

  /** Previous value (serialized as string for consistency) */
  oldValue: string;

  /** New value (serialized as string for consistency) */
  newValue: string;

  /** Rationale or justification for the change */
  reason: string;
}

/**
 * Risk mitigation measure.
 *
 * Represents a control or design measure to reduce hazard risk.
 */
export interface Mitigation {
  /** Unique identifier for the mitigation */
  id: string;

  /** Description of the mitigation measure */
  description: string;

  /**
   * Effectiveness factor (0-1).
   * Represents the probability that the mitigation successfully
   * prevents or reduces the hazard effect.
   * 1.0 = 100% effective (eliminates hazard)
   * 0.0 = 0% effective (no risk reduction)
   */
  effectiveness: number;

  /** Current implementation status */
  implementationStatus: 'Planned' | 'InProgress' | 'Implemented' | 'Verified';

  /**
   * Method used to verify mitigation effectiveness.
   * Should align with DO-178C verification methods.
   */
  verificationMethod: 'Test' | 'Analysis' | 'Inspection' | 'Demonstration';

  /** Responsible person or team */
  owner: string;
}

/**
 * Primary hazard record.
 *
 * Represents an identified hazard per ARP4761A Functional Hazard Assessment.
 * This is the central entity linking to fault trees, GSN arguments,
 * requirements, and FMEA items.
 */
export interface Hazard {
  /** Unique identifier (e.g., HAZ-001) */
  id: string;

  /**
   * Version number for configuration management.
   * Incremented on significant changes per CM procedures.
   */
  version: string;

  /** Brief descriptive title */
  title: string;

  /** Detailed description of the hazard */
  description: string;

  /**
   * System function affected by this hazard.
   * Should map to functional architecture.
   */
  systemFunction: string;

  /**
   * Failure condition as defined in ARP4761A.
   * Describes the effect on aircraft operation.
   */
  failureCondition: string;

  /**
   * Severity classification per ARP4761A.
   * Determines the required probability objective.
   */
  severity: SeverityLevel;

  /**
   * Likelihood/probability classification.
   * Combined with severity for risk assessment.
   */
  likelihood: LikelihoodLevel;

  /**
   * Design Assurance Level derived from severity.
   * Determines development rigor for contributing items.
   */
  dal: DAL;

  /**
   * Optional ASIL for automotive cross-reference.
   * Used when interfacing with ISO 26262 systems.
   */
  asil?: ASIL;

  /**
   * Calculated risk score.
   * Typically derived from severity x likelihood matrix.
   * Higher values indicate higher risk requiring priority attention.
   */
  riskScore: number;

  /** Current status in hazard lifecycle */
  status: HazardStatus;

  /** Responsible engineer or team */
  owner: string;

  /**
   * Applicable flight phase(s).
   * Examples: 'Takeoff', 'Cruise', 'Landing', 'All Phases'
   */
  phase: string;

  /** List of mitigation measures for this hazard */
  mitigations: Mitigation[];

  /** Overall verification status for this hazard */
  verificationStatus: VerificationStatus;

  /**
   * References to evidence artifacts.
   * Should link to actual verification records.
   */
  verificationEvidence: string[];

  /** Linked safety requirement IDs */
  linkedRequirements: string[];

  /** Linked fault tree IDs */
  linkedFaultTrees: string[];

  /** Linked GSN node IDs */
  linkedGSNNodes: string[];

  /** Linked FMEA item IDs */
  linkedFMEAItems: string[];

  /** Creation timestamp (ISO 8601) */
  createdAt: string;

  /** Last modification timestamp (ISO 8601) */
  updatedAt: string;

  /** Complete change history for audit trail */
  changeHistory: ChangeRecord[];
}

// =============================================================================
// FAULT TREE ANALYSIS TYPES
// =============================================================================

/**
 * Failure data for basic events in fault trees.
 *
 * Contains reliability parameters for quantitative analysis
 * per ARP4761A and MIL-HDBK-217 standards.
 */
export interface FailureData {
  /**
   * Failure rate (failures per hour).
   * Typically expressed in scientific notation (e.g., 1E-6).
   */
  failureRate: number;

  /**
   * Exposure time in hours.
   * Flight phase duration or mission time.
   */
  exposureTime: number;

  /**
   * Calculated probability of failure.
   * For constant failure rate: P = 1 - e^(-lambda * t)
   */
  probability: number;

  /**
   * Mean Time To Failure in hours.
   * MTTF = 1 / failure rate for constant failure rate.
   */
  mttf?: number;

  /**
   * Mean Time To Repair in hours.
   * Used for availability calculations.
   */
  mttr?: number;

  /**
   * Source of failure rate data.
   * Examples: 'MIL-HDBK-217F', 'NPRD-2016', 'Field Data', 'Manufacturer'
   */
  source: string;

  /**
   * Confidence level in the failure data (0-1).
   * Higher values indicate more reliable data sources.
   */
  confidence: number;
}

/**
 * Fault tree node representing an event or gate.
 *
 * Supports full fault tree structure per ARP4761A and
 * NUREG-0492 (Fault Tree Handbook).
 */
export interface FaultTreeNode {
  /** Unique identifier within the tree */
  id: string;

  /** Display label for the node */
  label: string;

  /** Detailed description of the event */
  description: string;

  /**
   * Node type per fault tree symbology:
   * - top-event: Root failure condition
   * - intermediate: Event caused by lower events
   * - basic-event: Initiating fault (leaf node with failure data)
   * - undeveloped: Event not further analyzed
   * - transfer: Reference to another tree
   * - house: Normally true/false event (boundary condition)
   */
  type: 'top-event' | 'intermediate' | 'basic-event' | 'undeveloped' | 'transfer' | 'house';

  /**
   * Logic gate connecting child events.
   * Only applicable for intermediate events with children.
   */
  gate?: {
    type: GateType;
    /**
     * For VOTING gates, the minimum number of inputs required.
     * Example: For 2-out-of-3, votingThreshold = 2
     */
    votingThreshold?: number;
  };

  /**
   * Failure data for basic events.
   * Required for quantitative fault tree analysis.
   */
  failureData?: FailureData;

  /**
   * Detection coverage (0-1) for this failure.
   * Used in ASIL decomposition and diagnostic coverage.
   * 1.0 = 100% detection, 0.0 = no detection
   */
  detectionCoverage?: number;

  /**
   * Diagnostic coverage per ISO 26262 (0-1).
   * Percentage of dangerous failures detected by diagnostics.
   */
  diagnosticCoverage?: number;

  /**
   * Common cause failure beta factor (0-1).
   * Represents susceptibility to common cause failures.
   * Per IEC 61508 beta factor model.
   */
  commonCauseFactor?: number;

  /** Linked hazard IDs */
  linkedHazards: string[];

  /** Linked FMEA item IDs */
  linkedFMEA: string[];

  /** Child nodes (for intermediate events) */
  children?: FaultTreeNode[];

  /**
   * Flag indicating this event is part of a minimal cut set.
   * Used for highlighting critical failure paths.
   */
  cutSetMember?: boolean;
}

/**
 * Minimal Cut Set - a smallest combination of basic events
 * that causes the top event.
 *
 * Critical for identifying single points of failure and
 * prioritizing mitigation efforts.
 */
export interface CutSet {
  /** Unique identifier for the cut set */
  id: string;

  /**
   * Order of the cut set (number of basic events).
   * Order 1 = single point of failure (most critical)
   * Order 2 = double failure required
   */
  order: number;

  /** IDs of the basic events in this cut set */
  basicEventIds: string[];

  /**
   * Calculated probability of this cut set.
   * Product of component probabilities for AND gate cut sets.
   */
  probability?: number;
}

/**
 * Importance measures for basic events.
 *
 * Used to prioritize design improvements and identify
 * critical contributors to system risk.
 */
export interface ImportanceMeasure {
  /** Basic event ID */
  basicEventId: string;

  /**
   * Fussell-Vesely importance (0-1).
   * Fraction of system unavailability due to cut sets
   * containing this basic event.
   */
  fussellVesely: number;

  /**
   * Birnbaum importance.
   * Sensitivity of system unavailability to component unavailability.
   * High values indicate influential components.
   */
  birnbaum: number;

  /**
   * Risk Achievement Worth.
   * Factor increase in system risk if component is guaranteed to fail.
   * RAW > 1000 indicates potential single point of failure.
   */
  raw: number;

  /**
   * Risk Reduction Worth.
   * Factor decrease in system risk if component is guaranteed to work.
   * High RRW indicates good candidates for reliability improvement.
   */
  rrw: number;
}

/**
 * Complete Fault Tree structure.
 *
 * Contains the tree structure plus analysis results.
 */
export interface FaultTree {
  /** Unique identifier for the fault tree */
  id: string;

  /** Descriptive name (e.g., "Loss of Engine Thrust") */
  name: string;

  /** Detailed description of the analysis scope */
  description: string;

  /** Root node of the fault tree */
  rootNode: FaultTreeNode;

  /**
   * Type of analysis performed.
   * Qualitative: Structure analysis, cut sets
   * Quantitative: Probability calculations, importance measures
   */
  analysisType: 'Qualitative' | 'Quantitative';

  /** Identified minimal cut sets */
  minimalCutSets?: CutSet[];

  /**
   * Calculated top event probability.
   * Should be compared against probability objective from FHA.
   */
  topEventProbability?: number;

  /** Calculated importance measures for all basic events */
  importanceMeasures?: ImportanceMeasure[];
}

// =============================================================================
// GOAL STRUCTURED NOTATION (GSN) TYPES
// =============================================================================

/**
 * Evidence artifact supporting safety arguments.
 *
 * Links GSN Solutions to actual verification records
 * per DO-178C/DO-254 verification requirements.
 */
export interface Evidence {
  /** Unique identifier */
  id: string;

  /** Type of evidence */
  type: EvidenceType;

  /** Descriptive title */
  title: string;

  /** Description of what the evidence demonstrates */
  description: string;

  /**
   * Location of the evidence artifact.
   * File path, URL, or document management system reference.
   */
  location: string;

  /** Version/revision of the evidence document */
  version: string;

  /** Date the evidence was generated (ISO 8601) */
  date: string;

  /** Current approval status */
  status: 'draft' | 'under-review' | 'approved';

  /** Person who approved the evidence */
  approver?: string;

  /** Date of approval (ISO 8601) */
  approvalDate?: string;

  /** Linked requirement IDs that this evidence verifies */
  linkedRequirements: string[];

  /** GSN node IDs that reference this evidence */
  linkedGSNNodes: string[];
}

/**
 * Compliance mapping to certification standard objectives.
 *
 * Tracks how GSN arguments address specific certification requirements.
 */
export interface ComplianceMapping {
  /**
   * Standard being addressed.
   * Examples: 'DO-178C', 'DO-254', 'ARP4761A', 'ARP4754A'
   */
  standard: string;

  /**
   * Specific objective or requirement reference.
   * Examples: 'Table A-3 Objective 5', 'Section 5.2.1'
   */
  objective: string;

  /** Compliance status */
  status: 'NotAddressed' | 'PartiallyAddressed' | 'FullyAddressed';
}

/**
 * Review status for GSN nodes.
 *
 * Supports multi-stage review process for safety case development.
 */
export interface ReviewStatus {
  /** Current review state */
  status: 'NotReviewed' | 'InReview' | 'Accepted' | 'Rejected' | 'NeedsRevision';

  /** Reviewer name or ID */
  reviewer?: string;

  /** Review date (ISO 8601) */
  date?: string;

  /** Review comments or feedback */
  comments?: string;
}

/**
 * Confidence assessment for GSN nodes.
 *
 * Supports Confidence Argument patterns in GSN.
 */
export interface Confidence {
  /** Confidence level assessment */
  level: 'high' | 'medium' | 'low';

  /** Rationale for the confidence assessment */
  rationale: string;
}

/**
 * Goal Structured Notation node.
 *
 * Represents an element in a structured safety argument
 * per GSN Standard Version 2.
 */
export interface GSNNode {
  /** Unique identifier (e.g., G1, S1, Sn1, C1, A1, J1) */
  id: string;

  /** Node type per GSN standard */
  type: GSNNodeType;

  /** Brief label for display */
  label: string;

  /** Full description of the claim, strategy, or context */
  description: string;

  /** Completion status of this argument element */
  status?: 'complete' | 'in-progress' | 'not-started';

  /** Confidence assessment for this node */
  confidence?: Confidence;

  /** Evidence supporting this node (primarily for Solutions) */
  evidence?: Evidence[];

  /** Mapping to certification standard objectives */
  complianceMapping?: ComplianceMapping[];

  /** Review status information */
  reviewStatus?: ReviewStatus;

  /** Parent node ID in the argument structure */
  parent?: string;

  /** Child node IDs */
  children?: string[];

  /**
   * Flag for "Away" goals per GSN modularity extension.
   * Indicates this goal is developed in a separate module.
   */
  isAway?: boolean;

  /**
   * Reference to external module for Away goals.
   * Module identifier or location.
   */
  awayReference?: string;
}

// =============================================================================
// FMEA (FAILURE MODES AND EFFECTS ANALYSIS) TYPES
// =============================================================================

/**
 * FMEA Item per SAE J1739 / ARP4761A.
 *
 * Documents failure modes, their effects, and associated controls
 * for systematic failure analysis.
 */
export interface FMEAItem {
  /** Unique identifier */
  id: string;

  /** Component/item identifier in the system hierarchy */
  componentId: string;

  /** Component name */
  componentName: string;

  /** Function performed by the component */
  function: string;

  /** Potential failure mode description */
  failureMode: string;

  /** Physical or logical mechanism causing the failure */
  failureMechanism: string;

  /** Effect of failure at the component level */
  localEffect: string;

  /** Effect of failure at the system/aircraft level */
  systemEffect: string;

  /**
   * Severity rating (1-10).
   * 10 = Hazardous without warning
   * 1 = No effect
   */
  severity: number;

  /**
   * Occurrence rating (1-10).
   * 10 = Very high (failure almost inevitable)
   * 1 = Remote (failure unlikely)
   */
  occurrence: number;

  /**
   * Detection rating (1-10).
   * 10 = Cannot detect
   * 1 = Almost certain detection
   */
  detection: number;

  /**
   * Risk Priority Number.
   * RPN = Severity x Occurrence x Detection
   * Range: 1-1000, higher values require priority attention
   */
  rpn: number;

  /** Current design/process controls */
  currentControls: string;

  /** Recommended actions to reduce risk */
  recommendedActions: string;

  /** Responsible person for recommended actions */
  actionOwner: string;

  /** Due date for action completion (ISO 8601) */
  actionDueDate: string;

  /** Current status of recommended actions */
  actionStatus: 'Open' | 'InProgress' | 'Complete' | 'Deferred';

  /** Linked hazard IDs */
  linkedHazards: string[];

  /** Linked fault tree basic event IDs */
  linkedFaultTreeEvents: string[];
}

// =============================================================================
// REQUIREMENTS TYPES
// =============================================================================

/**
 * Safety Requirement per DO-178C/DO-254/ARP4754A.
 *
 * Represents a traceable requirement that contributes to system safety.
 */
export interface Requirement {
  /** Unique identifier (e.g., SYS-SAF-001) */
  id: string;

  /** Requirement text (shall statement) */
  text: string;

  /** Rationale explaining why this requirement exists */
  rationale: string;

  /**
   * Source of the requirement.
   * Examples: 'FHA', 'PSSA', 'Regulation 14 CFR 25.1309'
   */
  source: string;

  /**
   * Requirement type:
   * - Safety: Derived from hazard analysis
   * - Derived: Derived from higher-level requirements
   * - Functional: System/subsystem functional requirements
   */
  type: 'Safety' | 'Derived' | 'Functional';

  /** Design Assurance Level for this requirement */
  dal: DAL;

  /** Implementation/verification status */
  status: 'Draft' | 'Approved' | 'Implemented' | 'Verified' | 'Deleted';

  /**
   * Verification method per DO-178C Table A-7:
   * - Test: Testing (preferred for most requirements)
   * - Analysis: Engineering analysis/calculation
   * - Inspection: Visual or automated inspection
   * - Demonstration: Functional demonstration
   */
  verificationMethod: 'Test' | 'Analysis' | 'Inspection' | 'Demonstration';

  /** Parent requirement ID (for requirement decomposition) */
  parentId?: string;

  /** Child requirement IDs */
  children: string[];

  /** Linked hazard IDs */
  linkedHazards: string[];

  /** Linked test case IDs */
  linkedTests: string[];

  /** Linked evidence IDs */
  linkedEvidence: string[];
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Risk level categories for the risk matrix.
 */
export type RiskLevel = 'Unacceptable' | 'Undesirable' | 'Tolerable' | 'Acceptable';

/**
 * Risk Matrix lookup type.
 *
 * Maps severity x likelihood combinations to risk levels
 * per ARP4761A risk assessment methodology.
 *
 * Example usage:
 * const risk = riskMatrix[SeverityLevel.Major][LikelihoodLevel.Probable];
 */
export type RiskMatrix = {
  [S in SeverityLevel]: {
    [L in LikelihoodLevel]: RiskLevel;
  };
};

/**
 * DAL objectives mapping.
 *
 * Defines which verification objectives apply at each DAL level.
 */
export interface DALRequirements {
  /** DAL level */
  level: DAL;

  /** Whether MC/DC coverage is required */
  mcdcCoverage: boolean;

  /** Whether decision coverage is required */
  decisionCoverage: boolean;

  /** Whether statement coverage is required */
  statementCoverage: boolean;

  /** Whether structural coverage analysis is required */
  structuralCoverageAnalysis: boolean;

  /** Whether independence is required for verification */
  independentVerification: boolean;

  /** Whether formal methods are applicable */
  formalMethodsApplicable: boolean;
}

/**
 * Traceability link between artifacts.
 *
 * Supports bidirectional traceability per DO-178C/DO-254 requirements.
 */
export interface TraceabilityLink {
  /**
   * Source artifact type.
   * Examples: 'Hazard', 'Requirement', 'FaultTree', 'GSNNode', 'FMEA', 'Evidence'
   */
  sourceType: string;

  /** Source artifact ID */
  sourceId: string;

  /**
   * Target artifact type.
   */
  targetType: string;

  /** Target artifact ID */
  targetId: string;

  /**
   * Type of link relationship.
   * Examples: 'derives-from', 'implements', 'verifies', 'mitigates', 'supports'
   */
  linkType: string;
}

// =============================================================================
// SAFETY CONTEXT STATE
// =============================================================================

/**
 * Complete safety management state.
 *
 * Contains all safety-related data collections for the dashboard.
 */
export interface SafetyState {
  /** All identified hazards */
  hazards: Hazard[];

  /** All fault trees */
  faultTrees: FaultTree[];

  /** All GSN nodes (flattened structure) */
  gsnNodes: GSNNode[];

  /** All FMEA items */
  fmeaItems: FMEAItem[];

  /** All requirements */
  requirements: Requirement[];

  /** All evidence artifacts */
  evidence: Evidence[];

  /** All traceability links */
  traceabilityLinks: TraceabilityLink[];

  /** Risk matrix configuration */
  riskMatrix: RiskMatrix;

  /** DAL requirements mapping */
  dalRequirements: DALRequirements[];
}

/**
 * CRUD operations for safety state management.
 *
 * Provides standard operations for all entity types.
 */
export interface SafetyActions {
  // Hazard operations
  /** Add a new hazard to the registry */
  addHazard: (hazard: Hazard) => void;
  /** Update an existing hazard by ID */
  updateHazard: (id: string, updates: Partial<Hazard>) => void;
  /** Delete a hazard by ID */
  deleteHazard: (id: string) => void;
  /** Retrieve a hazard by ID */
  getHazard: (id: string) => Hazard | undefined;

  // Fault Tree operations
  /** Add a new fault tree */
  addFaultTree: (tree: FaultTree) => void;
  /** Update an existing fault tree by ID */
  updateFaultTree: (id: string, updates: Partial<FaultTree>) => void;
  /** Delete a fault tree by ID */
  deleteFaultTree: (id: string) => void;
  /** Retrieve a fault tree by ID */
  getFaultTree: (id: string) => FaultTree | undefined;

  // GSN operations
  /** Add a new GSN node */
  addGSNNode: (node: GSNNode) => void;
  /** Update an existing GSN node by ID */
  updateGSNNode: (id: string, updates: Partial<GSNNode>) => void;
  /** Delete a GSN node by ID */
  deleteGSNNode: (id: string) => void;
  /** Retrieve a GSN node by ID */
  getGSNNode: (id: string) => GSNNode | undefined;

  // FMEA operations
  /** Add a new FMEA item */
  addFMEAItem: (item: FMEAItem) => void;
  /** Update an existing FMEA item by ID */
  updateFMEAItem: (id: string, updates: Partial<FMEAItem>) => void;
  /** Delete an FMEA item by ID */
  deleteFMEAItem: (id: string) => void;
  /** Retrieve an FMEA item by ID */
  getFMEAItem: (id: string) => FMEAItem | undefined;

  // Requirement operations
  /** Add a new requirement */
  addRequirement: (req: Requirement) => void;
  /** Update an existing requirement by ID */
  updateRequirement: (id: string, updates: Partial<Requirement>) => void;
  /** Delete a requirement by ID */
  deleteRequirement: (id: string) => void;
  /** Retrieve a requirement by ID */
  getRequirement: (id: string) => Requirement | undefined;

  // Evidence operations
  /** Add a new evidence artifact */
  addEvidence: (evidence: Evidence) => void;
  /** Update an existing evidence artifact by ID */
  updateEvidence: (id: string, updates: Partial<Evidence>) => void;
  /** Delete an evidence artifact by ID */
  deleteEvidence: (id: string) => void;
  /** Retrieve an evidence artifact by ID */
  getEvidence: (id: string) => Evidence | undefined;

  // Traceability operations
  /** Create a traceability link between artifacts */
  createLink: (link: TraceabilityLink) => void;
  /** Remove a traceability link */
  removeLink: (sourceType: string, sourceId: string, targetType: string, targetId: string) => void;
  /** Get all links for an artifact */
  getLinksForArtifact: (type: string, id: string) => TraceabilityLink[];

  // Bulk operations
  /** Import safety data from external source */
  importData: (data: Partial<SafetyState>) => void;
  /** Export current safety state */
  exportData: () => SafetyState;
  /** Reset state to initial values */
  resetState: () => void;
}

// =============================================================================
// DEFAULT RISK MATRIX CONFIGURATION
// =============================================================================

/**
 * Standard ARP4761A-compliant risk matrix.
 *
 * Maps severity and likelihood combinations to risk acceptability levels.
 */
export const DEFAULT_RISK_MATRIX: RiskMatrix = {
  [SeverityLevel.Catastrophic]: {
    [LikelihoodLevel.Frequent]: 'Unacceptable',
    [LikelihoodLevel.Probable]: 'Unacceptable',
    [LikelihoodLevel.Occasional]: 'Unacceptable',
    [LikelihoodLevel.Remote]: 'Unacceptable',
    [LikelihoodLevel.ExtremelyRemote]: 'Undesirable',
    [LikelihoodLevel.ExtremelyImprobable]: 'Tolerable',
  },
  [SeverityLevel.Hazardous]: {
    [LikelihoodLevel.Frequent]: 'Unacceptable',
    [LikelihoodLevel.Probable]: 'Unacceptable',
    [LikelihoodLevel.Occasional]: 'Unacceptable',
    [LikelihoodLevel.Remote]: 'Undesirable',
    [LikelihoodLevel.ExtremelyRemote]: 'Tolerable',
    [LikelihoodLevel.ExtremelyImprobable]: 'Acceptable',
  },
  [SeverityLevel.Major]: {
    [LikelihoodLevel.Frequent]: 'Unacceptable',
    [LikelihoodLevel.Probable]: 'Unacceptable',
    [LikelihoodLevel.Occasional]: 'Undesirable',
    [LikelihoodLevel.Remote]: 'Tolerable',
    [LikelihoodLevel.ExtremelyRemote]: 'Acceptable',
    [LikelihoodLevel.ExtremelyImprobable]: 'Acceptable',
  },
  [SeverityLevel.Minor]: {
    [LikelihoodLevel.Frequent]: 'Unacceptable',
    [LikelihoodLevel.Probable]: 'Undesirable',
    [LikelihoodLevel.Occasional]: 'Tolerable',
    [LikelihoodLevel.Remote]: 'Acceptable',
    [LikelihoodLevel.ExtremelyRemote]: 'Acceptable',
    [LikelihoodLevel.ExtremelyImprobable]: 'Acceptable',
  },
  [SeverityLevel.NoEffect]: {
    [LikelihoodLevel.Frequent]: 'Acceptable',
    [LikelihoodLevel.Probable]: 'Acceptable',
    [LikelihoodLevel.Occasional]: 'Acceptable',
    [LikelihoodLevel.Remote]: 'Acceptable',
    [LikelihoodLevel.ExtremelyRemote]: 'Acceptable',
    [LikelihoodLevel.ExtremelyImprobable]: 'Acceptable',
  },
};

/**
 * Standard DAL requirements per DO-178C Table A-1 through A-7.
 */
export const DEFAULT_DAL_REQUIREMENTS: DALRequirements[] = [
  {
    level: DAL.A,
    mcdcCoverage: true,
    decisionCoverage: true,
    statementCoverage: true,
    structuralCoverageAnalysis: true,
    independentVerification: true,
    formalMethodsApplicable: true,
  },
  {
    level: DAL.B,
    mcdcCoverage: true,
    decisionCoverage: true,
    statementCoverage: true,
    structuralCoverageAnalysis: true,
    independentVerification: true,
    formalMethodsApplicable: true,
  },
  {
    level: DAL.C,
    mcdcCoverage: false,
    decisionCoverage: true,
    statementCoverage: true,
    structuralCoverageAnalysis: true,
    independentVerification: false,
    formalMethodsApplicable: false,
  },
  {
    level: DAL.D,
    mcdcCoverage: false,
    decisionCoverage: false,
    statementCoverage: true,
    structuralCoverageAnalysis: false,
    independentVerification: false,
    formalMethodsApplicable: false,
  },
  {
    level: DAL.E,
    mcdcCoverage: false,
    decisionCoverage: false,
    statementCoverage: false,
    structuralCoverageAnalysis: false,
    independentVerification: false,
    formalMethodsApplicable: false,
  },
];

// =============================================================================
// HELPER FUNCTIONS FOR TYPE GUARDS
// =============================================================================

/**
 * Type guard to check if a value is a valid SeverityLevel.
 */
export function isSeverityLevel(value: unknown): value is SeverityLevel {
  return Object.values(SeverityLevel).includes(value as SeverityLevel);
}

/**
 * Type guard to check if a value is a valid LikelihoodLevel.
 */
export function isLikelihoodLevel(value: unknown): value is LikelihoodLevel {
  return Object.values(LikelihoodLevel).includes(value as LikelihoodLevel);
}

/**
 * Type guard to check if a value is a valid DAL.
 */
export function isDAL(value: unknown): value is DAL {
  return Object.values(DAL).includes(value as DAL);
}

/**
 * Type guard to check if a value is a valid GateType.
 */
export function isGateType(value: unknown): value is GateType {
  return Object.values(GateType).includes(value as GateType);
}

/**
 * Type guard to check if a value is a valid GSNNodeType.
 */
export function isGSNNodeType(value: unknown): value is GSNNodeType {
  return Object.values(GSNNodeType).includes(value as GSNNodeType);
}

/**
 * Calculate risk score from severity and likelihood.
 *
 * @param severity - Severity level
 * @param likelihood - Likelihood level
 * @returns Numeric risk score (higher = more critical)
 */
export function calculateRiskScore(severity: SeverityLevel, likelihood: LikelihoodLevel): number {
  const severityWeights: Record<SeverityLevel, number> = {
    [SeverityLevel.Catastrophic]: 5,
    [SeverityLevel.Hazardous]: 4,
    [SeverityLevel.Major]: 3,
    [SeverityLevel.Minor]: 2,
    [SeverityLevel.NoEffect]: 1,
  };

  const likelihoodWeights: Record<LikelihoodLevel, number> = {
    [LikelihoodLevel.Frequent]: 6,
    [LikelihoodLevel.Probable]: 5,
    [LikelihoodLevel.Occasional]: 4,
    [LikelihoodLevel.Remote]: 3,
    [LikelihoodLevel.ExtremelyRemote]: 2,
    [LikelihoodLevel.ExtremelyImprobable]: 1,
  };

  return severityWeights[severity] * likelihoodWeights[likelihood];
}

/**
 * Derive DAL from severity level per DO-178C/ARP4754A.
 *
 * @param severity - Severity level from FHA
 * @returns Corresponding DAL
 */
export function deriveDalFromSeverity(severity: SeverityLevel): DAL {
  switch (severity) {
    case SeverityLevel.Catastrophic:
      return DAL.A;
    case SeverityLevel.Hazardous:
      return DAL.B;
    case SeverityLevel.Major:
      return DAL.C;
    case SeverityLevel.Minor:
      return DAL.D;
    case SeverityLevel.NoEffect:
      return DAL.E;
  }
}

/**
 * Calculate FMEA Risk Priority Number.
 *
 * @param severity - Severity rating (1-10)
 * @param occurrence - Occurrence rating (1-10)
 * @param detection - Detection rating (1-10)
 * @returns RPN value (1-1000)
 */
export function calculateRPN(severity: number, occurrence: number, detection: number): number {
  return severity * occurrence * detection;
}
