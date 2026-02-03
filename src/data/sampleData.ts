/**
 * Sample Data for UAS (Unmanned Aircraft System) Safety Dashboard
 *
 * This file provides comprehensive sample data demonstrating DO-178C/ARP4761A compliant
 * safety analysis for a BVLOS (Beyond Visual Line of Sight) delivery drone.
 *
 * Aircraft: SkyDeliver X1 - Autonomous delivery UAS
 * Operation: BVLOS package delivery in Class G airspace
 * Certification basis: 14 CFR Part 107 waiver + type certification
 *
 * @module data/sampleData
 */

import type {
  Hazard,
  FaultTreeNode,
  CutSet,
  ImportanceMeasure,
  FMEAItem,
  Requirement,
  Evidence,
  SeverityLevel,
  LikelihoodLevel,
  HazardStatus,
  DAL,
  RiskLevel,
} from '../types/safety';

// =============================================================================
// Extended Types for Sample Data
// =============================================================================

/**
 * Extended hazard type with additional ARP4761A FHA fields
 */
export interface ExtendedHazard extends Hazard {
  /** System function affected */
  systemFunction: string;
  /** Failure condition description */
  failureCondition: string;
  /** Design Assurance Level */
  dal: DAL;
  /** Numeric risk score (1-5 scale) */
  riskScore: number;
  /** Flight phase applicability */
  phase: string;
  /** Detailed mitigation records */
  mitigationDetails: MitigationRecord[];
  /** Linked requirement IDs */
  linkedRequirements: string[];
  /** Linked fault tree IDs */
  linkedFaultTrees: string[];
  /** Linked GSN node IDs */
  linkedGSNNodes: string[];
  /** Effects at aircraft level */
  aircraftLevelEffect: string;
  /** Probability per flight hour */
  probabilityPerFlightHour?: number;
}

/**
 * Mitigation record with effectiveness tracking
 */
export interface MitigationRecord {
  id: string;
  description: string;
  effectiveness: number;
  implementationStatus: 'Planned' | 'In Progress' | 'Implemented' | 'Verified';
  verificationMethod: string;
  dateImplemented?: string;
}

/**
 * Extended fault tree with analysis metadata
 */
export interface ExtendedFaultTree {
  id: string;
  name: string;
  description: string;
  analysisType: 'Qualitative' | 'Quantitative';
  rootNode: FaultTreeNode;
  minimalCutSets: ExtendedCutSet[];
  topEventProbability: number;
  importanceMeasures?: ImportanceMeasure[];
  linkedHazards: string[];
  analysisDate: string;
  analyst: string;
  approvalStatus: 'Draft' | 'Under Review' | 'Approved';
}

/**
 * Extended cut set with additional metadata
 */
export interface ExtendedCutSet extends CutSet {
  id: string;
  basicEventIds: string[];
  description?: string;
}

/**
 * GSN node types for Goal Structured Notation
 */
export type GSNNodeType = 'Goal' | 'Strategy' | 'Solution' | 'Context' | 'Assumption' | 'Justification';

/**
 * Confidence level for GSN nodes
 */
export interface ConfidenceLevel {
  level: 'high' | 'medium' | 'low';
  rationale: string;
}

/**
 * Compliance mapping for standards
 */
export interface ComplianceMapping {
  standard: string;
  objective: string;
  status: 'Compliant' | 'Partial' | 'Non-Compliant' | 'Not Applicable';
}

/**
 * Evidence record for GSN solutions
 */
export interface GSNEvidence {
  id: string;
  type: 'AnalysisReport' | 'TestReport' | 'DesignDocument' | 'InspectionRecord' | 'Certification';
  title: string;
  location: string;
  status: 'draft' | 'under-review' | 'approved';
  dateApproved?: string;
}

/**
 * GSN Node structure
 */
export interface GSNNode {
  id: string;
  type: GSNNodeType;
  label: string;
  description: string;
  status?: 'complete' | 'in-progress' | 'not-started';
  confidence?: ConfidenceLevel;
  complianceMapping?: ComplianceMapping[];
  evidence?: GSNEvidence[];
  children?: string[];
  parent?: string;
  linkedHazards?: string[];
  linkedRequirements?: string[];
}

/**
 * Extended FMEA item with cross-references
 */
export interface ExtendedFMEAItem extends Omit<FMEAItem, 'item' | 'effect' | 'cause' | 'controls'> {
  componentId: string;
  componentName: string;
  function: string;
  failureMechanism: string;
  localEffect: string;
  systemEffect: string;
  currentControls: string;
  recommendedActions: string;
  linkedHazards: string[];
  linkedFaultTreeEvents: string[];
}

/**
 * Extended requirement with traceability
 */
export interface ExtendedRequirement extends Requirement {
  rationale: string;
  source: string;
  status: 'Draft' | 'Approved' | 'Verified' | 'Deferred';
  linkedHazards: string[];
  linkedTests: string[];
}

/**
 * KPI metrics structure
 */
export interface SafetyKPIs {
  systemMTBF: number;
  targetFailureRate: number;
  hazardsClosed: number;
  hazardsOpen: number;
  hazardsMonitoring: number;
  hazardsMitigated: number;
  requirementsCovered: number;
  requirementsTotal: number;
  evidenceApproved: number;
  evidencePending: number;
  evidenceTotal: number;
  faultTreesCompleted: number;
  faultTreesTotal: number;
  safetyScore: number;
  complianceScore: number;
}

/**
 * Incident trend data point
 */
export interface IncidentDataPoint {
  month: string;
  incidents: number;
  resolved: number;
  nearMisses: number;
  severity: {
    catastrophic: number;
    hazardous: number;
    major: number;
    minor: number;
  };
}

/**
 * Hazard by category data
 */
export interface HazardCategoryData {
  category: string;
  count: number;
  mitigated: number;
  open: number;
}

/**
 * Safety metrics completion data
 */
export interface SafetyMetricCompletion {
  metric: string;
  completion: number;
  target: number;
}

// =============================================================================
// Sample Hazards (ARP4761A FHA Format)
// =============================================================================

export const sampleHazards: ExtendedHazard[] = [
  {
    id: 'HAZ-001',
    title: 'Loss of Aircraft Control',
    description: 'Complete loss of ability to control aircraft attitude and trajectory due to flight control system failure',
    systemFunction: 'Flight Control',
    failureCondition: 'Loss of all flight control authority',
    severity: 'Catastrophic',
    likelihood: 'ExtremelyImprobable',
    dal: 'A',
    riskScore: 5,
    status: 'Mitigated',
    owner: 'Flight Control Team',
    phase: 'All Phases',
    aircraftLevelEffect: 'Uncontrolled descent leading to ground impact; potential third-party casualties',
    probabilityPerFlightHour: 1e-9,
    mitigationDetails: [
      {
        id: 'MIT-001',
        description: 'Redundant flight control computers (triple modular redundancy)',
        effectiveness: 0.999,
        implementationStatus: 'Verified',
        verificationMethod: 'Hardware-in-the-loop testing per DO-178C',
        dateImplemented: '2024-06-15',
      },
      {
        id: 'MIT-002',
        description: 'Independent backup flight controller with dissimilar software',
        effectiveness: 0.995,
        implementationStatus: 'Verified',
        verificationMethod: 'Integration testing and code coverage analysis',
        dateImplemented: '2024-07-20',
      },
      {
        id: 'MIT-003',
        description: 'Automatic ballistic parachute recovery system',
        effectiveness: 0.98,
        implementationStatus: 'Implemented',
        verificationMethod: 'Flight test verification',
        dateImplemented: '2024-08-01',
      },
    ],
    linkedRequirements: ['REQ-001', 'REQ-002', 'REQ-003', 'REQ-004'],
    linkedFaultTrees: ['FT-001'],
    linkedGSNNodes: ['G2', 'Sn1'],
    initialRisk: { score: 25, level: 'Unacceptable' },
    residualRisk: { score: 5, level: 'Acceptable' },
    relatedRequirements: ['REQ-001', 'REQ-002'],
    dateIdentified: '2024-01-15',
    dateReviewed: '2024-11-01',
    notes: 'Primary concern for BVLOS operations; requires DAL A software assurance',
  },
  {
    id: 'HAZ-002',
    title: 'Controlled Flight Into Terrain (CFIT)',
    description: 'Aircraft impacts terrain or obstacles while under control due to navigation or sensor failures',
    systemFunction: 'Navigation & Obstacle Avoidance',
    failureCondition: 'Loss of terrain awareness or obstacle detection capability',
    severity: 'Catastrophic',
    likelihood: 'ExtremelyImprobable',
    dal: 'A',
    riskScore: 5,
    status: 'Mitigated',
    owner: 'Navigation Team',
    phase: 'Cruise, Approach, Landing',
    aircraftLevelEffect: 'Aircraft destruction; potential third-party casualties',
    probabilityPerFlightHour: 1e-9,
    mitigationDetails: [
      {
        id: 'MIT-004',
        description: 'Dual-redundant LIDAR obstacle detection system',
        effectiveness: 0.997,
        implementationStatus: 'Verified',
        verificationMethod: 'Flight test with simulated obstacles',
        dateImplemented: '2024-05-20',
      },
      {
        id: 'MIT-005',
        description: 'Terrain database with DTED Level 2 data',
        effectiveness: 0.99,
        implementationStatus: 'Implemented',
        verificationMethod: 'Database validation testing',
        dateImplemented: '2024-06-01',
      },
      {
        id: 'MIT-006',
        description: 'Automatic terrain avoidance maneuver capability',
        effectiveness: 0.995,
        implementationStatus: 'Verified',
        verificationMethod: 'Hardware-in-the-loop simulation',
        dateImplemented: '2024-07-15',
      },
    ],
    linkedRequirements: ['REQ-005', 'REQ-006', 'REQ-007'],
    linkedFaultTrees: ['FT-002'],
    linkedGSNNodes: ['G3', 'Sn2'],
    initialRisk: { score: 25, level: 'Unacceptable' },
    residualRisk: { score: 4, level: 'Acceptable' },
    relatedRequirements: ['REQ-005', 'REQ-006'],
    dateIdentified: '2024-01-20',
    dateReviewed: '2024-11-01',
    notes: 'Critical for BVLOS in varied terrain environments',
  },
  {
    id: 'HAZ-003',
    title: 'Mid-Air Collision',
    description: 'Collision with manned aircraft, other UAS, or birds during flight operations',
    systemFunction: 'Detect and Avoid (DAA)',
    failureCondition: 'Failure to detect and avoid traffic',
    severity: 'Catastrophic',
    likelihood: 'ExtremelyImprobable',
    dal: 'A',
    riskScore: 5,
    status: 'Monitoring',
    owner: 'DAA Team',
    phase: 'All Phases',
    aircraftLevelEffect: 'Aircraft destruction; potential fatalities in manned aircraft',
    probabilityPerFlightHour: 1e-9,
    mitigationDetails: [
      {
        id: 'MIT-007',
        description: 'ADS-B In/Out transponder system',
        effectiveness: 0.95,
        implementationStatus: 'Verified',
        verificationMethod: 'FAA TSO-C199 compliance testing',
        dateImplemented: '2024-04-15',
      },
      {
        id: 'MIT-008',
        description: 'Radar-based traffic detection system',
        effectiveness: 0.92,
        implementationStatus: 'Implemented',
        verificationMethod: 'Flight test with cooperative targets',
        dateImplemented: '2024-08-20',
      },
      {
        id: 'MIT-009',
        description: 'Automatic collision avoidance maneuver capability',
        effectiveness: 0.98,
        implementationStatus: 'In Progress',
        verificationMethod: 'Simulation and flight test',
      },
    ],
    linkedRequirements: ['REQ-008', 'REQ-009', 'REQ-010'],
    linkedFaultTrees: ['FT-003'],
    linkedGSNNodes: ['G4', 'Sn3'],
    initialRisk: { score: 25, level: 'Unacceptable' },
    residualRisk: { score: 8, level: 'Tolerable' },
    relatedRequirements: ['REQ-008', 'REQ-009'],
    dateIdentified: '2024-02-01',
    dateReviewed: '2024-10-15',
    notes: 'Awaiting final DAA system certification; monitoring FAA BVLOS rulemaking',
  },
  {
    id: 'HAZ-004',
    title: 'Loss of Command and Control Link',
    description: 'Complete loss of communication between ground control station and aircraft',
    systemFunction: 'Command & Control (C2)',
    failureCondition: 'Total loss of C2 link for extended duration',
    severity: 'Hazardous',
    likelihood: 'Remote',
    dal: 'B',
    riskScore: 4,
    status: 'Mitigated',
    owner: 'Communications Team',
    phase: 'All Phases',
    aircraftLevelEffect: 'Aircraft unable to receive commands; must execute lost-link procedures',
    probabilityPerFlightHour: 1e-6,
    mitigationDetails: [
      {
        id: 'MIT-010',
        description: 'Dual-band redundant C2 links (900MHz + LTE)',
        effectiveness: 0.995,
        implementationStatus: 'Verified',
        verificationMethod: 'Range and interference testing',
        dateImplemented: '2024-03-15',
      },
      {
        id: 'MIT-011',
        description: 'Autonomous lost-link procedures with safe return-to-home',
        effectiveness: 0.99,
        implementationStatus: 'Verified',
        verificationMethod: 'Flight test with simulated link loss',
        dateImplemented: '2024-04-20',
      },
      {
        id: 'MIT-012',
        description: 'Satellite backup communication system',
        effectiveness: 0.97,
        implementationStatus: 'Implemented',
        verificationMethod: 'Integration testing',
        dateImplemented: '2024-09-01',
      },
    ],
    linkedRequirements: ['REQ-011', 'REQ-012', 'REQ-013'],
    linkedFaultTrees: ['FT-004'],
    linkedGSNNodes: ['G5'],
    initialRisk: { score: 16, level: 'Undesirable' },
    residualRisk: { score: 6, level: 'Tolerable' },
    relatedRequirements: ['REQ-011', 'REQ-012'],
    dateIdentified: '2024-02-10',
    dateReviewed: '2024-11-01',
    notes: 'Lost-link procedures validated through extensive flight testing',
  },
  {
    id: 'HAZ-005',
    title: 'Battery Thermal Runaway',
    description: 'Lithium battery thermal runaway leading to fire or explosion',
    systemFunction: 'Power System',
    failureCondition: 'Battery cell thermal runaway propagation',
    severity: 'Catastrophic',
    likelihood: 'ExtremelyImprobable',
    dal: 'A',
    riskScore: 5,
    status: 'Mitigated',
    owner: 'Power Systems Team',
    phase: 'All Phases',
    aircraftLevelEffect: 'Aircraft fire, structural failure, uncontrolled descent',
    probabilityPerFlightHour: 1e-9,
    mitigationDetails: [
      {
        id: 'MIT-013',
        description: 'Battery Management System with cell-level monitoring',
        effectiveness: 0.999,
        implementationStatus: 'Verified',
        verificationMethod: 'Thermal chamber testing per UN38.3',
        dateImplemented: '2024-02-28',
      },
      {
        id: 'MIT-014',
        description: 'Thermal propagation resistant battery pack design',
        effectiveness: 0.995,
        implementationStatus: 'Verified',
        verificationMethod: 'Nail penetration and overcharge testing',
        dateImplemented: '2024-03-15',
      },
      {
        id: 'MIT-015',
        description: 'Emergency battery jettison capability',
        effectiveness: 0.9,
        implementationStatus: 'Implemented',
        verificationMethod: 'Ground test verification',
        dateImplemented: '2024-05-01',
      },
    ],
    linkedRequirements: ['REQ-014', 'REQ-015', 'REQ-016'],
    linkedFaultTrees: ['FT-005'],
    linkedGSNNodes: ['G6', 'Sn4'],
    initialRisk: { score: 25, level: 'Unacceptable' },
    residualRisk: { score: 5, level: 'Acceptable' },
    relatedRequirements: ['REQ-014', 'REQ-015'],
    dateIdentified: '2024-01-25',
    dateReviewed: '2024-10-20',
    notes: 'Battery cells are aerospace-grade with thermal management',
  },
  {
    id: 'HAZ-006',
    title: 'GPS/GNSS Signal Loss or Spoofing',
    description: 'Loss of GPS navigation signal or reception of spoofed/false GPS data',
    systemFunction: 'Navigation',
    failureCondition: 'Loss or corruption of position/velocity information',
    severity: 'Major',
    likelihood: 'Remote',
    dal: 'C',
    riskScore: 3,
    status: 'Mitigated',
    owner: 'Navigation Team',
    phase: 'All Phases',
    aircraftLevelEffect: 'Degraded navigation accuracy; potential route deviation',
    probabilityPerFlightHour: 1e-5,
    mitigationDetails: [
      {
        id: 'MIT-016',
        description: 'Multi-constellation GNSS receiver (GPS, GLONASS, Galileo)',
        effectiveness: 0.98,
        implementationStatus: 'Verified',
        verificationMethod: 'Jamming/spoofing simulation testing',
        dateImplemented: '2024-04-01',
      },
      {
        id: 'MIT-017',
        description: 'Inertial Navigation System (INS) with visual odometry',
        effectiveness: 0.95,
        implementationStatus: 'Verified',
        verificationMethod: 'GPS-denied flight testing',
        dateImplemented: '2024-05-15',
      },
      {
        id: 'MIT-018',
        description: 'GPS spoofing detection algorithms',
        effectiveness: 0.92,
        implementationStatus: 'Implemented',
        verificationMethod: 'Synthetic spoofing tests',
        dateImplemented: '2024-06-20',
      },
    ],
    linkedRequirements: ['REQ-017', 'REQ-018', 'REQ-019'],
    linkedFaultTrees: ['FT-006'],
    linkedGSNNodes: ['G7'],
    initialRisk: { score: 12, level: 'Undesirable' },
    residualRisk: { score: 4, level: 'Acceptable' },
    relatedRequirements: ['REQ-017', 'REQ-018'],
    dateIdentified: '2024-02-15',
    dateReviewed: '2024-10-25',
    notes: 'INS provides 5+ minutes of navigation in GPS-denied environment',
  },
  {
    id: 'HAZ-007',
    title: 'Motor/Propulsion System Failure',
    description: 'Single or multiple motor failures leading to loss of thrust or control authority',
    systemFunction: 'Propulsion',
    failureCondition: 'Loss of one or more propulsion units',
    severity: 'Hazardous',
    likelihood: 'Remote',
    dal: 'B',
    riskScore: 4,
    status: 'Mitigated',
    owner: 'Propulsion Team',
    phase: 'All Phases',
    aircraftLevelEffect: 'Reduced controllability; emergency landing required',
    probabilityPerFlightHour: 1e-6,
    mitigationDetails: [
      {
        id: 'MIT-019',
        description: 'Octocopter configuration with motor-out capability',
        effectiveness: 0.99,
        implementationStatus: 'Verified',
        verificationMethod: 'Flight test with simulated motor failures',
        dateImplemented: '2024-03-01',
      },
      {
        id: 'MIT-020',
        description: 'Motor health monitoring with predictive diagnostics',
        effectiveness: 0.95,
        implementationStatus: 'Implemented',
        verificationMethod: 'Endurance testing',
        dateImplemented: '2024-04-15',
      },
      {
        id: 'MIT-021',
        description: 'Automatic reconfiguration control laws for motor failure',
        effectiveness: 0.98,
        implementationStatus: 'Verified',
        verificationMethod: 'Hardware-in-the-loop testing',
        dateImplemented: '2024-05-20',
      },
    ],
    linkedRequirements: ['REQ-020', 'REQ-021', 'REQ-022'],
    linkedFaultTrees: ['FT-007'],
    linkedGSNNodes: ['G8'],
    initialRisk: { score: 16, level: 'Undesirable' },
    residualRisk: { score: 6, level: 'Tolerable' },
    relatedRequirements: ['REQ-020', 'REQ-021'],
    dateIdentified: '2024-02-20',
    dateReviewed: '2024-10-30',
    notes: 'Aircraft can maintain controlled flight with up to 2 motor failures',
  },
  {
    id: 'HAZ-008',
    title: 'Propeller Separation',
    description: 'In-flight propeller blade separation or complete propeller loss',
    systemFunction: 'Propulsion',
    failureCondition: 'Structural failure of propeller assembly',
    severity: 'Hazardous',
    likelihood: 'ExtremelyRemote',
    dal: 'B',
    riskScore: 4,
    status: 'Mitigated',
    owner: 'Structures Team',
    phase: 'All Phases',
    aircraftLevelEffect: 'Propeller debris hazard; loss of thrust; potential secondary damage',
    probabilityPerFlightHour: 1e-8,
    mitigationDetails: [
      {
        id: 'MIT-022',
        description: 'Carbon fiber propellers with 4x safety factor',
        effectiveness: 0.999,
        implementationStatus: 'Verified',
        verificationMethod: 'Static and fatigue testing',
        dateImplemented: '2024-02-15',
      },
      {
        id: 'MIT-023',
        description: 'Propeller guard/containment ring',
        effectiveness: 0.95,
        implementationStatus: 'Implemented',
        verificationMethod: 'Blade-off containment test',
        dateImplemented: '2024-03-20',
      },
      {
        id: 'MIT-024',
        description: 'Pre-flight propeller inspection protocol',
        effectiveness: 0.9,
        implementationStatus: 'Verified',
        verificationMethod: 'Operational procedure validation',
        dateImplemented: '2024-04-01',
      },
    ],
    linkedRequirements: ['REQ-023', 'REQ-024'],
    linkedFaultTrees: ['FT-008'],
    linkedGSNNodes: ['G9'],
    initialRisk: { score: 12, level: 'Undesirable' },
    residualRisk: { score: 4, level: 'Acceptable' },
    relatedRequirements: ['REQ-023', 'REQ-024'],
    dateIdentified: '2024-03-01',
    dateReviewed: '2024-10-15',
    notes: 'Propeller life limit established at 500 flight hours',
  },
  {
    id: 'HAZ-009',
    title: 'Payload Release Malfunction',
    description: 'Unintended release or failure to release delivery payload',
    systemFunction: 'Payload Delivery',
    failureCondition: 'Payload release mechanism failure',
    severity: 'Major',
    likelihood: 'Remote',
    dal: 'C',
    riskScore: 3,
    status: 'Mitigated',
    owner: 'Payload Systems Team',
    phase: 'Delivery',
    aircraftLevelEffect: 'Payload drop on unintended target; mission failure',
    probabilityPerFlightHour: 1e-5,
    mitigationDetails: [
      {
        id: 'MIT-025',
        description: 'Dual-redundant payload release mechanism',
        effectiveness: 0.995,
        implementationStatus: 'Verified',
        verificationMethod: 'Mechanical reliability testing',
        dateImplemented: '2024-04-10',
      },
      {
        id: 'MIT-026',
        description: 'Payload presence sensors with cross-check',
        effectiveness: 0.99,
        implementationStatus: 'Implemented',
        verificationMethod: 'Integration testing',
        dateImplemented: '2024-05-01',
      },
      {
        id: 'MIT-027',
        description: 'Safe release zone verification before drop',
        effectiveness: 0.95,
        implementationStatus: 'Verified',
        verificationMethod: 'Operational testing',
        dateImplemented: '2024-06-01',
      },
    ],
    linkedRequirements: ['REQ-025', 'REQ-026', 'REQ-027'],
    linkedFaultTrees: ['FT-009'],
    linkedGSNNodes: ['G10'],
    initialRisk: { score: 9, level: 'Tolerable' },
    residualRisk: { score: 3, level: 'Acceptable' },
    relatedRequirements: ['REQ-025', 'REQ-026'],
    dateIdentified: '2024-03-15',
    dateReviewed: '2024-10-20',
    notes: 'Payload weight limit enforced by ground operations',
  },
  {
    id: 'HAZ-010',
    title: 'Geofence Violation',
    description: 'Aircraft breaches operational geofence boundaries',
    systemFunction: 'Flight Management',
    failureCondition: 'Failure to contain aircraft within authorized airspace',
    severity: 'Major',
    likelihood: 'Remote',
    dal: 'C',
    riskScore: 3,
    status: 'Mitigated',
    owner: 'Flight Operations Team',
    phase: 'All Phases',
    aircraftLevelEffect: 'Potential airspace violation; regulatory non-compliance',
    probabilityPerFlightHour: 1e-5,
    mitigationDetails: [
      {
        id: 'MIT-028',
        description: 'Redundant geofence enforcement in flight controller and GCS',
        effectiveness: 0.999,
        implementationStatus: 'Verified',
        verificationMethod: 'Flight test at boundary conditions',
        dateImplemented: '2024-05-15',
      },
      {
        id: 'MIT-029',
        description: 'Automatic return-to-home when approaching boundary',
        effectiveness: 0.98,
        implementationStatus: 'Verified',
        verificationMethod: 'Simulation and flight test',
        dateImplemented: '2024-06-01',
      },
      {
        id: 'MIT-030',
        description: 'Real-time geofence monitoring with alerts',
        effectiveness: 0.95,
        implementationStatus: 'Implemented',
        verificationMethod: 'Operational validation',
        dateImplemented: '2024-06-15',
      },
    ],
    linkedRequirements: ['REQ-028', 'REQ-029', 'REQ-030'],
    linkedFaultTrees: ['FT-010'],
    linkedGSNNodes: ['G11'],
    initialRisk: { score: 9, level: 'Tolerable' },
    residualRisk: { score: 2, level: 'Acceptable' },
    relatedRequirements: ['REQ-028', 'REQ-029'],
    dateIdentified: '2024-04-01',
    dateReviewed: '2024-11-01',
    notes: 'Geofence margins include 100m buffer from actual boundaries',
  },
  {
    id: 'HAZ-011',
    title: 'Icing Conditions',
    description: 'Ice accumulation on aircraft surfaces affecting aerodynamics and sensors',
    systemFunction: 'Environmental Protection',
    failureCondition: 'Ice accretion exceeding safe limits',
    severity: 'Hazardous',
    likelihood: 'Remote',
    dal: 'B',
    riskScore: 4,
    status: 'Open',
    owner: 'Aerodynamics Team',
    phase: 'Cruise',
    aircraftLevelEffect: 'Degraded lift/drag; sensor blockage; potential loss of control',
    probabilityPerFlightHour: 1e-6,
    mitigationDetails: [
      {
        id: 'MIT-031',
        description: 'Ice detection sensors with real-time monitoring',
        effectiveness: 0.9,
        implementationStatus: 'Implemented',
        verificationMethod: 'Icing wind tunnel testing',
        dateImplemented: '2024-08-15',
      },
      {
        id: 'MIT-032',
        description: 'Operational limitation to avoid known icing conditions',
        effectiveness: 0.85,
        implementationStatus: 'Implemented',
        verificationMethod: 'Weather integration testing',
        dateImplemented: '2024-09-01',
      },
    ],
    linkedRequirements: ['REQ-031', 'REQ-032'],
    linkedFaultTrees: ['FT-011'],
    linkedGSNNodes: ['G12'],
    initialRisk: { score: 16, level: 'Undesirable' },
    residualRisk: { score: 10, level: 'Tolerable' },
    relatedRequirements: ['REQ-031', 'REQ-032'],
    dateIdentified: '2024-05-01',
    dateReviewed: '2024-10-25',
    notes: 'Anti-icing system under development for future variant',
  },
  {
    id: 'HAZ-012',
    title: 'Cybersecurity Attack',
    description: 'Malicious cyber attack compromising aircraft systems or data',
    systemFunction: 'System Security',
    failureCondition: 'Unauthorized access or control of aircraft systems',
    severity: 'Hazardous',
    likelihood: 'ExtremelyRemote',
    dal: 'B',
    riskScore: 4,
    status: 'Monitoring',
    owner: 'Cybersecurity Team',
    phase: 'All Phases',
    aircraftLevelEffect: 'Potential loss of control; data breach; operational disruption',
    probabilityPerFlightHour: 1e-7,
    mitigationDetails: [
      {
        id: 'MIT-033',
        description: 'Encrypted C2 link with authentication',
        effectiveness: 0.99,
        implementationStatus: 'Verified',
        verificationMethod: 'Penetration testing',
        dateImplemented: '2024-04-01',
      },
      {
        id: 'MIT-034',
        description: 'Hardware security module for key storage',
        effectiveness: 0.995,
        implementationStatus: 'Verified',
        verificationMethod: 'Security certification',
        dateImplemented: '2024-05-01',
      },
      {
        id: 'MIT-035',
        description: 'Intrusion detection and response system',
        effectiveness: 0.9,
        implementationStatus: 'In Progress',
        verificationMethod: 'Red team assessment',
      },
    ],
    linkedRequirements: ['REQ-033', 'REQ-034', 'REQ-035'],
    linkedFaultTrees: ['FT-012'],
    linkedGSNNodes: ['G13'],
    initialRisk: { score: 12, level: 'Undesirable' },
    residualRisk: { score: 6, level: 'Tolerable' },
    relatedRequirements: ['REQ-033', 'REQ-034'],
    dateIdentified: '2024-03-20',
    dateReviewed: '2024-11-01',
    notes: 'Ongoing monitoring of threat landscape; annual penetration testing',
  },
];

// =============================================================================
// Sample Fault Tree - Loss of Aircraft Control
// =============================================================================

export const sampleFaultTree: ExtendedFaultTree = {
  id: 'FT-001',
  name: 'Loss of Aircraft Control',
  description: 'Fault tree analysis for complete loss of flight control authority in UAS',
  analysisType: 'Quantitative',
  linkedHazards: ['HAZ-001'],
  analysisDate: '2024-09-15',
  analyst: 'Dr. Sarah Chen',
  approvalStatus: 'Approved',
  topEventProbability: 1.2e-9,
  rootNode: {
    id: 'TOP-001',
    label: 'Loss of Aircraft Control',
    type: 'top-event',
    gate: 'OR',
    probability: 1.2e-9,
    children: [
      {
        id: 'INT-001',
        label: 'Flight Computer Failure',
        type: 'intermediate',
        gate: 'AND',
        probability: 1e-10,
        children: [
          {
            id: 'BE-001',
            label: 'Primary FCC Hardware Failure',
            type: 'basic-event',
            probability: 1e-5,
            failureRate: 1e-5,
            exposureTime: 1,
          },
          {
            id: 'BE-002',
            label: 'Backup FCC Hardware Failure',
            type: 'basic-event',
            probability: 1e-5,
            failureRate: 1e-5,
            exposureTime: 1,
          },
        ],
      },
      {
        id: 'INT-002',
        label: 'Control Surface Failure',
        type: 'intermediate',
        gate: 'OR',
        probability: 3e-10,
        children: [
          {
            id: 'INT-003',
            label: 'All Motor Failures',
            type: 'intermediate',
            gate: 'VOTING',
            votingThreshold: 3,
            probability: 1e-10,
            children: [
              {
                id: 'BE-003',
                label: 'Motor 1 Failure',
                type: 'basic-event',
                probability: 1e-4,
                failureRate: 1e-4,
                exposureTime: 1,
              },
              {
                id: 'BE-004',
                label: 'Motor 2 Failure',
                type: 'basic-event',
                probability: 1e-4,
                failureRate: 1e-4,
                exposureTime: 1,
              },
              {
                id: 'BE-005',
                label: 'Motor 3 Failure',
                type: 'basic-event',
                probability: 1e-4,
                failureRate: 1e-4,
                exposureTime: 1,
              },
              {
                id: 'BE-006',
                label: 'Motor 4 Failure',
                type: 'basic-event',
                probability: 1e-4,
                failureRate: 1e-4,
                exposureTime: 1,
              },
              {
                id: 'BE-007',
                label: 'Motor 5 Failure',
                type: 'basic-event',
                probability: 1e-4,
                failureRate: 1e-4,
                exposureTime: 1,
              },
              {
                id: 'BE-008',
                label: 'Motor 6 Failure',
                type: 'basic-event',
                probability: 1e-4,
                failureRate: 1e-4,
                exposureTime: 1,
              },
              {
                id: 'BE-009',
                label: 'Motor 7 Failure',
                type: 'basic-event',
                probability: 1e-4,
                failureRate: 1e-4,
                exposureTime: 1,
              },
              {
                id: 'BE-010',
                label: 'Motor 8 Failure',
                type: 'basic-event',
                probability: 1e-4,
                failureRate: 1e-4,
                exposureTime: 1,
              },
            ],
          },
          {
            id: 'BE-011',
            label: 'ESC Common Mode Failure',
            type: 'basic-event',
            probability: 1e-10,
            failureRate: 1e-10,
            exposureTime: 1,
          },
          {
            id: 'BE-012',
            label: 'Control Signal Bus Failure',
            type: 'basic-event',
            probability: 1e-10,
            failureRate: 1e-10,
            exposureTime: 1,
          },
        ],
      },
      {
        id: 'INT-004',
        label: 'Power System Failure',
        type: 'intermediate',
        gate: 'AND',
        probability: 4e-10,
        children: [
          {
            id: 'INT-005',
            label: 'Primary Battery Failure',
            type: 'intermediate',
            gate: 'OR',
            probability: 2e-5,
            children: [
              {
                id: 'BE-013',
                label: 'Battery Cell Failure',
                type: 'basic-event',
                probability: 1e-5,
                failureRate: 1e-5,
                exposureTime: 1,
              },
              {
                id: 'BE-014',
                label: 'BMS Failure',
                type: 'basic-event',
                probability: 5e-6,
                failureRate: 5e-6,
                exposureTime: 1,
              },
              {
                id: 'BE-015',
                label: 'Battery Connector Failure',
                type: 'basic-event',
                probability: 5e-6,
                failureRate: 5e-6,
                exposureTime: 1,
              },
            ],
          },
          {
            id: 'INT-006',
            label: 'Backup Battery Failure',
            type: 'intermediate',
            gate: 'OR',
            probability: 2e-5,
            children: [
              {
                id: 'BE-016',
                label: 'Backup Battery Cell Failure',
                type: 'basic-event',
                probability: 1e-5,
                failureRate: 1e-5,
                exposureTime: 1,
              },
              {
                id: 'BE-017',
                label: 'Backup BMS Failure',
                type: 'basic-event',
                probability: 5e-6,
                failureRate: 5e-6,
                exposureTime: 1,
              },
              {
                id: 'BE-018',
                label: 'Backup Battery Connector Failure',
                type: 'basic-event',
                probability: 5e-6,
                failureRate: 5e-6,
                exposureTime: 1,
              },
            ],
          },
        ],
      },
      {
        id: 'INT-007',
        label: 'Sensor System Failure',
        type: 'intermediate',
        gate: 'AND',
        probability: 2.5e-10,
        children: [
          {
            id: 'INT-008',
            label: 'All IMU Failures',
            type: 'intermediate',
            gate: 'AND',
            probability: 1e-9,
            children: [
              {
                id: 'BE-019',
                label: 'IMU 1 Failure',
                type: 'basic-event',
                probability: 1e-3,
                failureRate: 1e-3,
                exposureTime: 1,
              },
              {
                id: 'BE-020',
                label: 'IMU 2 Failure',
                type: 'basic-event',
                probability: 1e-3,
                failureRate: 1e-3,
                exposureTime: 1,
              },
              {
                id: 'BE-021',
                label: 'IMU 3 Failure',
                type: 'basic-event',
                probability: 1e-3,
                failureRate: 1e-3,
                exposureTime: 1,
              },
            ],
          },
          {
            id: 'INT-009',
            label: 'Attitude Determination Failure',
            type: 'intermediate',
            gate: 'OR',
            probability: 2.5e-4,
            children: [
              {
                id: 'BE-022',
                label: 'Magnetometer Failure',
                type: 'basic-event',
                probability: 1e-4,
                failureRate: 1e-4,
                exposureTime: 1,
              },
              {
                id: 'BE-023',
                label: 'Barometer Failure',
                type: 'basic-event',
                probability: 5e-5,
                failureRate: 5e-5,
                exposureTime: 1,
              },
              {
                id: 'BE-024',
                label: 'GPS Receiver Failure',
                type: 'basic-event',
                probability: 1e-4,
                failureRate: 1e-4,
                exposureTime: 1,
              },
            ],
          },
        ],
      },
      {
        id: 'INT-010',
        label: 'Software Failure',
        type: 'intermediate',
        gate: 'AND',
        probability: 1e-10,
        children: [
          {
            id: 'BE-025',
            label: 'Primary Software Error',
            type: 'basic-event',
            probability: 1e-5,
            failureRate: 1e-5,
            exposureTime: 1,
          },
          {
            id: 'BE-026',
            label: 'Backup Software Error',
            type: 'basic-event',
            probability: 1e-5,
            failureRate: 1e-5,
            exposureTime: 1,
          },
        ],
      },
    ],
  },
  minimalCutSets: [
    {
      id: 'CS-001',
      order: 2,
      eventIds: ['BE-001', 'BE-002'],
      basicEventIds: ['BE-001', 'BE-002'],
      probability: 1e-10,
      description: 'Primary and backup FCC both fail',
    },
    {
      id: 'CS-002',
      order: 2,
      eventIds: ['BE-025', 'BE-026'],
      basicEventIds: ['BE-025', 'BE-026'],
      probability: 1e-10,
      description: 'Primary and backup software both fail',
    },
    {
      id: 'CS-003',
      order: 3,
      eventIds: ['BE-003', 'BE-004', 'BE-005'],
      basicEventIds: ['BE-003', 'BE-004', 'BE-005'],
      probability: 1e-12,
      description: 'Three adjacent motors fail (worst case)',
    },
    {
      id: 'CS-004',
      order: 2,
      eventIds: ['BE-013', 'BE-016'],
      basicEventIds: ['BE-013', 'BE-016'],
      probability: 1e-10,
      description: 'Primary and backup battery cells both fail',
    },
    {
      id: 'CS-005',
      order: 1,
      eventIds: ['BE-011'],
      basicEventIds: ['BE-011'],
      probability: 1e-10,
      description: 'ESC common mode failure',
    },
    {
      id: 'CS-006',
      order: 1,
      eventIds: ['BE-012'],
      basicEventIds: ['BE-012'],
      probability: 1e-10,
      description: 'Control signal bus failure',
    },
    {
      id: 'CS-007',
      order: 3,
      eventIds: ['BE-019', 'BE-020', 'BE-021'],
      basicEventIds: ['BE-019', 'BE-020', 'BE-021'],
      probability: 1e-9,
      description: 'All three IMUs fail simultaneously',
    },
  ],
  importanceMeasures: [
    {
      eventId: 'BE-001',
      eventLabel: 'Primary FCC Hardware Failure',
      baseProbability: 1e-5,
      fussellVesely: 0.083,
      birnbaum: 1e-5,
      raw: 8.33,
      rrw: 1.09,
    },
    {
      eventId: 'BE-002',
      eventLabel: 'Backup FCC Hardware Failure',
      baseProbability: 1e-5,
      fussellVesely: 0.083,
      birnbaum: 1e-5,
      raw: 8.33,
      rrw: 1.09,
    },
    {
      eventId: 'BE-011',
      eventLabel: 'ESC Common Mode Failure',
      baseProbability: 1e-10,
      fussellVesely: 0.083,
      birnbaum: 1.0,
      raw: 8.33e9,
      rrw: 1.09,
    },
    {
      eventId: 'BE-012',
      eventLabel: 'Control Signal Bus Failure',
      baseProbability: 1e-10,
      fussellVesely: 0.083,
      birnbaum: 1.0,
      raw: 8.33e9,
      rrw: 1.09,
    },
  ],
};

// =============================================================================
// Sample GSN Safety Case
// =============================================================================

export const sampleGSNNodes: GSNNode[] = [
  {
    id: 'G1',
    type: 'Goal',
    label: 'UAS is acceptably safe for BVLOS operations',
    description: 'Top-level safety goal demonstrating the SkyDeliver X1 UAS is safe for beyond visual line of sight delivery operations in Class G airspace',
    status: 'in-progress',
    confidence: {
      level: 'medium',
      rationale: 'Core hazards mitigated; DAA certification pending; ongoing monitoring of residual risks',
    },
    complianceMapping: [
      {
        standard: 'ARP4761A',
        objective: 'Section 5 - Safety Assessment Process',
        status: 'Partial',
      },
      {
        standard: 'DO-178C',
        objective: 'Software Assurance Objectives',
        status: 'Partial',
      },
      {
        standard: '14 CFR Part 107',
        objective: 'Waiver Requirements',
        status: 'Compliant',
      },
    ],
    children: ['C1', 'C2', 'S1'],
  },
  {
    id: 'C1',
    type: 'Context',
    label: 'BVLOS delivery operations in Class G airspace',
    description: 'Operational context: Autonomous package delivery flights up to 10km from launch site, altitudes below 400ft AGL, in uncontrolled airspace with defined operational corridors',
    parent: 'G1',
  },
  {
    id: 'C2',
    type: 'Context',
    label: 'Certification basis: Part 107 waiver with type design approval',
    description: 'Regulatory context: Operating under FAA Part 107.200 waiver with additional airworthiness approvals for BVLOS operations',
    parent: 'G1',
  },
  {
    id: 'S1',
    type: 'Strategy',
    label: 'Argument over identified hazards',
    description: 'Demonstrate safety by systematically addressing all hazards identified through FHA per ARP4761A methodology',
    parent: 'G1',
    children: ['G2', 'G3', 'G4', 'G5'],
  },
  {
    id: 'G2',
    type: 'Goal',
    label: 'All catastrophic hazards mitigated to acceptable risk level',
    description: 'Demonstrate that all Catastrophic severity hazards have been mitigated to achieve probability < 1e-9 per flight hour',
    status: 'in-progress',
    confidence: {
      level: 'medium',
      rationale: 'HAZ-001 and HAZ-002 fully mitigated; HAZ-003 (mid-air collision) mitigation in progress',
    },
    linkedHazards: ['HAZ-001', 'HAZ-002', 'HAZ-003', 'HAZ-005'],
    parent: 'S1',
    children: ['S2', 'A1'],
  },
  {
    id: 'S2',
    type: 'Strategy',
    label: 'Argument by hazard analysis results',
    description: 'Demonstrate mitigation through quantitative fault tree analysis and verification evidence',
    parent: 'G2',
    children: ['G6', 'G7', 'G8', 'G9'],
  },
  {
    id: 'A1',
    type: 'Assumption',
    label: 'Mitigation effectiveness verified through test',
    description: 'Assumes all mitigation measures have been verified through appropriate testing (flight test, simulation, analysis)',
    parent: 'G2',
  },
  {
    id: 'G3',
    type: 'Goal',
    label: 'All hazardous severity hazards mitigated appropriately',
    description: 'Demonstrate hazardous severity hazards have probability < 1e-7 per flight hour',
    status: 'complete',
    confidence: {
      level: 'high',
      rationale: 'All hazardous hazards have verified mitigations with demonstrated effectiveness',
    },
    linkedHazards: ['HAZ-004', 'HAZ-007', 'HAZ-008', 'HAZ-011', 'HAZ-012'],
    parent: 'S1',
    children: ['Sn2', 'Sn3'],
  },
  {
    id: 'G4',
    type: 'Goal',
    label: 'All major severity hazards are tolerable',
    description: 'Demonstrate major severity hazards have probability < 1e-5 per flight hour',
    status: 'complete',
    confidence: {
      level: 'high',
      rationale: 'All major hazards within acceptable risk thresholds',
    },
    linkedHazards: ['HAZ-006', 'HAZ-009', 'HAZ-010'],
    parent: 'S1',
    children: ['Sn4'],
  },
  {
    id: 'G5',
    type: 'Goal',
    label: 'Safety requirements fully traced and verified',
    description: 'Demonstrate complete traceability from hazards to requirements to verification evidence',
    status: 'in-progress',
    confidence: {
      level: 'medium',
      rationale: '90% traceability achieved; remaining gaps being closed',
    },
    parent: 'S1',
    children: ['Sn5', 'Sn6'],
  },
  {
    id: 'G6',
    type: 'Goal',
    label: 'Loss of control hazard mitigated (HAZ-001)',
    description: 'Flight control system meets DAL A requirements with demonstrated probability < 1e-9',
    status: 'complete',
    confidence: {
      level: 'high',
      rationale: 'Fault tree analysis shows top event probability of 1.2e-9, verified through testing',
    },
    linkedHazards: ['HAZ-001'],
    linkedRequirements: ['REQ-001', 'REQ-002', 'REQ-003'],
    parent: 'S2',
    children: ['Sn1'],
  },
  {
    id: 'G7',
    type: 'Goal',
    label: 'CFIT hazard mitigated (HAZ-002)',
    description: 'Terrain/obstacle avoidance system prevents controlled flight into terrain',
    status: 'complete',
    confidence: {
      level: 'high',
      rationale: 'Dual LIDAR system with terrain database verified through flight test',
    },
    linkedHazards: ['HAZ-002'],
    parent: 'S2',
    children: ['Sn7'],
  },
  {
    id: 'G8',
    type: 'Goal',
    label: 'Mid-air collision hazard addressed (HAZ-003)',
    description: 'DAA system provides adequate separation from other aircraft',
    status: 'in-progress',
    confidence: {
      level: 'medium',
      rationale: 'ADS-B and radar operational; automatic avoidance maneuvers under certification',
    },
    linkedHazards: ['HAZ-003'],
    parent: 'S2',
    children: ['Sn8', 'J1'],
  },
  {
    id: 'G9',
    type: 'Goal',
    label: 'Battery thermal runaway prevented (HAZ-005)',
    description: 'Battery system design prevents thermal runaway propagation',
    status: 'complete',
    confidence: {
      level: 'high',
      rationale: 'BMS and thermal design verified through abuse testing per UN38.3',
    },
    linkedHazards: ['HAZ-005'],
    parent: 'S2',
    children: ['Sn9'],
  },
  {
    id: 'G10',
    type: 'Goal',
    label: 'Payload delivery is safe',
    description: 'Payload release mechanism operates safely without unintended releases',
    status: 'complete',
    confidence: {
      level: 'high',
      rationale: 'Redundant release mechanism verified through reliability testing',
    },
    linkedHazards: ['HAZ-009'],
    parent: 'G4',
    children: ['Sn10'],
  },
  {
    id: 'G11',
    type: 'Goal',
    label: 'Aircraft remains within authorized airspace',
    description: 'Geofence system prevents boundary violations',
    status: 'complete',
    confidence: {
      level: 'high',
      rationale: 'Redundant geofence with verified return-to-home behavior',
    },
    linkedHazards: ['HAZ-010'],
    parent: 'G4',
    children: ['Sn11'],
  },
  {
    id: 'G12',
    type: 'Goal',
    label: 'Icing conditions handled safely',
    description: 'Aircraft can detect and avoid or safely operate in icing conditions',
    status: 'in-progress',
    confidence: {
      level: 'low',
      rationale: 'Detection implemented; anti-ice system planned for future variant',
    },
    linkedHazards: ['HAZ-011'],
    parent: 'G3',
  },
  {
    id: 'G13',
    type: 'Goal',
    label: 'Cybersecurity threats mitigated',
    description: 'C2 link and aircraft systems protected against cyber attacks',
    status: 'in-progress',
    confidence: {
      level: 'medium',
      rationale: 'Encryption and authentication verified; IDS implementation ongoing',
    },
    linkedHazards: ['HAZ-012'],
    parent: 'G3',
    children: ['Sn12'],
  },
  {
    id: 'Sn1',
    type: 'Solution',
    label: 'Flight Control FMEA Report',
    description: 'FMEA analysis of flight control system per ARP4761A methodology',
    status: 'complete',
    evidence: [
      {
        id: 'EV-001',
        type: 'AnalysisReport',
        title: 'FCS FMEA v2.1',
        location: '/docs/safety/fmea/FCS_FMEA_v2.1.pdf',
        status: 'approved',
        dateApproved: '2024-08-15',
      },
    ],
    parent: 'G6',
  },
  {
    id: 'Sn2',
    type: 'Solution',
    label: 'C2 Link Loss Analysis',
    description: 'Analysis demonstrating safe lost-link behavior',
    status: 'complete',
    evidence: [
      {
        id: 'EV-002',
        type: 'AnalysisReport',
        title: 'Lost Link Safety Analysis v1.2',
        location: '/docs/safety/analysis/Lost_Link_Analysis_v1.2.pdf',
        status: 'approved',
        dateApproved: '2024-07-20',
      },
      {
        id: 'EV-003',
        type: 'TestReport',
        title: 'Lost Link Flight Test Report',
        location: '/docs/test/C2_Lost_Link_Test_Report.pdf',
        status: 'approved',
        dateApproved: '2024-09-01',
      },
    ],
    parent: 'G3',
  },
  {
    id: 'Sn3',
    type: 'Solution',
    label: 'Propulsion System Fault Tree',
    description: 'Quantitative FTA for propulsion system failures',
    status: 'complete',
    evidence: [
      {
        id: 'EV-004',
        type: 'AnalysisReport',
        title: 'Propulsion FTA Report v1.0',
        location: '/docs/safety/fta/Propulsion_FTA_v1.0.pdf',
        status: 'approved',
        dateApproved: '2024-08-01',
      },
    ],
    parent: 'G3',
  },
  {
    id: 'Sn4',
    type: 'Solution',
    label: 'Navigation System Safety Analysis',
    description: 'Safety analysis for GPS loss and navigation failures',
    status: 'complete',
    evidence: [
      {
        id: 'EV-005',
        type: 'AnalysisReport',
        title: 'Navigation Safety Analysis v1.1',
        location: '/docs/safety/analysis/Nav_Safety_Analysis_v1.1.pdf',
        status: 'approved',
        dateApproved: '2024-06-15',
      },
    ],
    parent: 'G4',
  },
  {
    id: 'Sn5',
    type: 'Solution',
    label: 'Requirements Traceability Matrix',
    description: 'Complete traceability from hazards to requirements to verification',
    status: 'in-progress',
    evidence: [
      {
        id: 'EV-006',
        type: 'DesignDocument',
        title: 'Safety Requirements Traceability Matrix',
        location: '/docs/safety/SRTM_v3.2.xlsx',
        status: 'under-review',
      },
    ],
    parent: 'G5',
  },
  {
    id: 'Sn6',
    type: 'Solution',
    label: 'Verification Summary Report',
    description: 'Summary of all safety requirement verification activities',
    status: 'in-progress',
    evidence: [
      {
        id: 'EV-007',
        type: 'TestReport',
        title: 'Safety Verification Summary Report',
        location: '/docs/test/Safety_Verification_Summary.pdf',
        status: 'draft',
      },
    ],
    parent: 'G5',
  },
  {
    id: 'Sn7',
    type: 'Solution',
    label: 'Terrain Avoidance Test Report',
    description: 'Flight test results for terrain and obstacle avoidance',
    status: 'complete',
    evidence: [
      {
        id: 'EV-008',
        type: 'TestReport',
        title: 'Terrain Avoidance Flight Test Report',
        location: '/docs/test/TAWS_Flight_Test_Report.pdf',
        status: 'approved',
        dateApproved: '2024-09-10',
      },
    ],
    parent: 'G7',
  },
  {
    id: 'Sn8',
    type: 'Solution',
    label: 'DAA System Test Results',
    description: 'Detect and Avoid system performance test results',
    status: 'in-progress',
    evidence: [
      {
        id: 'EV-009',
        type: 'TestReport',
        title: 'DAA Performance Test Report',
        location: '/docs/test/DAA_Performance_Test.pdf',
        status: 'under-review',
      },
    ],
    parent: 'G8',
  },
  {
    id: 'J1',
    type: 'Justification',
    label: 'DAA certification path acceptable',
    description: 'FAA has provided interim approval for DAA system pending final certification',
    parent: 'G8',
  },
  {
    id: 'Sn9',
    type: 'Solution',
    label: 'Battery Safety Test Report',
    description: 'UN38.3 and abuse testing results for battery system',
    status: 'complete',
    evidence: [
      {
        id: 'EV-010',
        type: 'TestReport',
        title: 'Battery Safety Test Report',
        location: '/docs/test/Battery_Safety_Test_UN38.3.pdf',
        status: 'approved',
        dateApproved: '2024-05-20',
      },
    ],
    parent: 'G9',
  },
  {
    id: 'Sn10',
    type: 'Solution',
    label: 'Payload Release Test Report',
    description: 'Reliability testing of payload release mechanism',
    status: 'complete',
    evidence: [
      {
        id: 'EV-011',
        type: 'TestReport',
        title: 'Payload Release Reliability Test Report',
        location: '/docs/test/Payload_Release_Test.pdf',
        status: 'approved',
        dateApproved: '2024-07-01',
      },
    ],
    parent: 'G10',
  },
  {
    id: 'Sn11',
    type: 'Solution',
    label: 'Geofence Verification Report',
    description: 'Verification of geofence system effectiveness',
    status: 'complete',
    evidence: [
      {
        id: 'EV-012',
        type: 'TestReport',
        title: 'Geofence Verification Test Report',
        location: '/docs/test/Geofence_Verification.pdf',
        status: 'approved',
        dateApproved: '2024-08-01',
      },
    ],
    parent: 'G11',
  },
  {
    id: 'Sn12',
    type: 'Solution',
    label: 'Cybersecurity Assessment Report',
    description: 'Penetration testing and security assessment results',
    status: 'in-progress',
    evidence: [
      {
        id: 'EV-013',
        type: 'AnalysisReport',
        title: 'Cybersecurity Assessment Report',
        location: '/docs/security/Cyber_Assessment_v1.0.pdf',
        status: 'under-review',
      },
    ],
    parent: 'G13',
  },
];

// =============================================================================
// Sample FMEA Items
// =============================================================================

export const sampleFMEAItems: ExtendedFMEAItem[] = [
  {
    id: 'FMEA-001',
    componentId: 'FCC-001',
    componentName: 'Primary Flight Control Computer',
    function: 'Process sensor inputs and generate control commands for stable flight',
    failureMode: 'Processor lockup/hang',
    failureMechanism: 'Software infinite loop, deadlock, or hardware transient fault',
    localEffect: 'No control commands output from primary FCC',
    systemEffect: 'Automatic switchover to backup FCC; if both fail, loss of attitude control',
    severity: 10,
    occurrence: 3,
    detection: 2,
    rpn: 60,
    currentControls: 'Watchdog timer (100ms), triple modular redundancy with voting',
    recommendedActions: 'Implement diverse backup software design; add hardware fault injection testing',
    responsible: 'Flight Software Team',
    targetDate: '2024-12-01',
    actionTaken: 'Dissimilar backup software implemented using different algorithms',
    newSeverity: 10,
    newOccurrence: 2,
    newDetection: 2,
    newRpn: 40,
    linkedHazards: ['HAZ-001'],
    linkedFaultTreeEvents: ['BE-001', 'BE-025'],
  },
  {
    id: 'FMEA-002',
    componentId: 'FCC-002',
    componentName: 'Backup Flight Control Computer',
    function: 'Provide redundant flight control in case of primary FCC failure',
    failureMode: 'Processor lockup/hang',
    failureMechanism: 'Software fault or hardware failure coincident with primary',
    localEffect: 'Backup FCC unavailable when needed',
    systemEffect: 'Loss of flight control redundancy; if coincident with primary failure, catastrophic',
    severity: 10,
    occurrence: 3,
    detection: 2,
    rpn: 60,
    currentControls: 'Independent watchdog, continuous self-test, diverse hardware design',
    recommendedActions: 'Ensure no common mode failures between primary and backup',
    responsible: 'Flight Software Team',
    targetDate: '2024-12-01',
    linkedHazards: ['HAZ-001'],
    linkedFaultTreeEvents: ['BE-002', 'BE-026'],
  },
  {
    id: 'FMEA-003',
    componentId: 'IMU-001',
    componentName: 'Inertial Measurement Unit 1',
    function: 'Provide angular rate and acceleration measurements for attitude determination',
    failureMode: 'Erroneous output (drift or bias)',
    failureMechanism: 'Sensor degradation, calibration drift, or EMI interference',
    localEffect: 'Incorrect attitude estimation from IMU 1',
    systemEffect: 'Voting logic detects disagreement; other IMUs provide valid data',
    severity: 7,
    occurrence: 4,
    detection: 3,
    rpn: 84,
    currentControls: 'Triple redundant IMUs with median voting; BITE and reasonableness checks',
    recommendedActions: 'Add IMU health monitoring with predictive failure indication',
    responsible: 'Avionics Team',
    targetDate: '2025-01-15',
    linkedHazards: ['HAZ-001'],
    linkedFaultTreeEvents: ['BE-019'],
  },
  {
    id: 'FMEA-004',
    componentId: 'GPS-001',
    componentName: 'GNSS Receiver',
    function: 'Provide position and velocity for navigation',
    failureMode: 'Loss of satellite lock',
    failureMechanism: 'Signal obstruction, jamming, or receiver hardware failure',
    localEffect: 'No GPS position updates',
    systemEffect: 'INS provides dead reckoning; degraded navigation accuracy over time',
    severity: 6,
    occurrence: 5,
    detection: 1,
    rpn: 30,
    currentControls: 'Multi-constellation receiver; INS integration; visual odometry backup',
    recommendedActions: 'Implement spoofing detection algorithms',
    responsible: 'Navigation Team',
    targetDate: '2024-11-30',
    actionTaken: 'Spoofing detection implemented and tested',
    newSeverity: 6,
    newOccurrence: 4,
    newDetection: 1,
    newRpn: 24,
    linkedHazards: ['HAZ-006'],
    linkedFaultTreeEvents: ['BE-024'],
  },
  {
    id: 'FMEA-005',
    componentId: 'MOT-001',
    componentName: 'Brushless DC Motor (Motor 1)',
    function: 'Provide thrust for lift and control',
    failureMode: 'Motor stops/seizes',
    failureMechanism: 'Bearing failure, winding short, or ESC failure',
    localEffect: 'No thrust from motor 1',
    systemEffect: 'Increased load on remaining motors; control reconfiguration activated',
    severity: 8,
    occurrence: 4,
    detection: 2,
    rpn: 64,
    currentControls: 'Octocopter configuration allows motor-out flight; motor current monitoring',
    recommendedActions: 'Implement bearing wear detection through vibration analysis',
    responsible: 'Propulsion Team',
    targetDate: '2025-02-01',
    linkedHazards: ['HAZ-007'],
    linkedFaultTreeEvents: ['BE-003'],
  },
  {
    id: 'FMEA-006',
    componentId: 'ESC-001',
    componentName: 'Electronic Speed Controller 1',
    function: 'Control motor speed based on flight controller commands',
    failureMode: 'Output stuck high/low',
    failureMechanism: 'MOSFET failure, firmware fault',
    localEffect: 'Motor 1 runs at uncontrolled speed or stops',
    systemEffect: 'Control instability; motor reconfiguration required',
    severity: 8,
    occurrence: 3,
    detection: 2,
    rpn: 48,
    currentControls: 'ESC telemetry monitoring; overcurrent protection; independent ESCs per motor',
    recommendedActions: 'Add ESC redundancy for critical motors',
    responsible: 'Propulsion Team',
    targetDate: '2025-03-01',
    linkedHazards: ['HAZ-007'],
    linkedFaultTreeEvents: ['BE-003', 'BE-011'],
  },
  {
    id: 'FMEA-007',
    componentId: 'BAT-001',
    componentName: 'Primary Battery Pack',
    function: 'Provide electrical power for all aircraft systems',
    failureMode: 'Thermal runaway',
    failureMechanism: 'Internal cell short, overcharge, external damage',
    localEffect: 'Battery fire/explosion; battery unavailable',
    systemEffect: 'Switchover to backup battery; if propagates, catastrophic fire',
    severity: 10,
    occurrence: 2,
    detection: 3,
    rpn: 60,
    currentControls: 'BMS with cell monitoring; thermal runaway propagation resistant design',
    recommendedActions: 'Add fire suppression in battery compartment',
    responsible: 'Power Systems Team',
    targetDate: '2025-01-01',
    linkedHazards: ['HAZ-005'],
    linkedFaultTreeEvents: ['BE-013'],
  },
  {
    id: 'FMEA-008',
    componentId: 'BMS-001',
    componentName: 'Battery Management System',
    function: 'Monitor and protect battery cells; balance charging',
    failureMode: 'Failed to detect overvoltage/undervoltage',
    failureMechanism: 'Voltage sensor failure, firmware bug',
    localEffect: 'Battery operated outside safe limits',
    systemEffect: 'Potential cell damage, reduced capacity, or thermal event',
    severity: 9,
    occurrence: 3,
    detection: 4,
    rpn: 108,
    currentControls: 'Redundant voltage sensing; independent protection circuit',
    recommendedActions: 'Implement diversity in BMS hardware design',
    responsible: 'Power Systems Team',
    targetDate: '2024-12-15',
    linkedHazards: ['HAZ-005'],
    linkedFaultTreeEvents: ['BE-014'],
  },
  {
    id: 'FMEA-009',
    componentId: 'LIDAR-001',
    componentName: 'Primary LIDAR Sensor',
    function: 'Detect obstacles and terrain for collision avoidance',
    failureMode: 'False negative (missed obstacle)',
    failureMechanism: 'Sensor degradation, reflective surface, heavy rain/fog',
    localEffect: 'Obstacle not detected by primary LIDAR',
    systemEffect: 'Backup LIDAR should detect; if both miss, potential collision',
    severity: 10,
    occurrence: 3,
    detection: 4,
    rpn: 120,
    currentControls: 'Dual LIDAR with different wavelengths; fusion with camera data',
    recommendedActions: 'Add radar for all-weather obstacle detection',
    responsible: 'DAA Team',
    targetDate: '2025-03-01',
    linkedHazards: ['HAZ-002'],
    linkedFaultTreeEvents: [],
  },
  {
    id: 'FMEA-010',
    componentId: 'C2-001',
    componentName: 'C2 Radio Transceiver',
    function: 'Maintain command and control link with ground station',
    failureMode: 'Loss of signal',
    failureMechanism: 'RF interference, antenna failure, range exceeded',
    localEffect: 'No commands received from GCS',
    systemEffect: 'Lost-link procedures activated; autonomous return-to-home',
    severity: 6,
    occurrence: 4,
    detection: 1,
    rpn: 24,
    currentControls: 'Dual-band redundancy; LTE backup; link quality monitoring',
    recommendedActions: 'Add satellite communication backup for extended range',
    responsible: 'Communications Team',
    targetDate: '2024-10-30',
    actionTaken: 'Satellite backup link implemented',
    newSeverity: 6,
    newOccurrence: 3,
    newDetection: 1,
    newRpn: 18,
    linkedHazards: ['HAZ-004'],
    linkedFaultTreeEvents: [],
  },
  {
    id: 'FMEA-011',
    componentId: 'ADSB-001',
    componentName: 'ADS-B Transceiver',
    function: 'Broadcast aircraft position and receive traffic information',
    failureMode: 'Failure to detect non-cooperative traffic',
    failureMechanism: 'Target aircraft without ADS-B equipment',
    localEffect: 'Traffic not visible to ADS-B In',
    systemEffect: 'Reliance on radar for non-cooperative detection; potential late avoidance',
    severity: 9,
    occurrence: 5,
    detection: 5,
    rpn: 225,
    currentControls: 'Radar backup for non-cooperative detection',
    recommendedActions: 'Improve radar detection range and bearing accuracy',
    responsible: 'DAA Team',
    targetDate: '2025-02-01',
    linkedHazards: ['HAZ-003'],
    linkedFaultTreeEvents: [],
  },
  {
    id: 'FMEA-012',
    componentId: 'PLD-001',
    componentName: 'Payload Release Mechanism',
    function: 'Securely hold and release delivery payload on command',
    failureMode: 'Inadvertent release',
    failureMechanism: 'Mechanical latch failure, software command error',
    localEffect: 'Payload released at wrong location',
    systemEffect: 'Package dropped on unintended area; potential property damage',
    severity: 7,
    occurrence: 2,
    detection: 3,
    rpn: 42,
    currentControls: 'Dual-redundant latch mechanism; position verification before release',
    recommendedActions: 'Add mechanical safety interlock',
    responsible: 'Payload Systems Team',
    targetDate: '2024-11-15',
    linkedHazards: ['HAZ-009'],
    linkedFaultTreeEvents: [],
  },
];

// =============================================================================
// Sample Requirements
// =============================================================================

export const sampleRequirements: ExtendedRequirement[] = [
  {
    id: 'REQ-001',
    text: 'The flight control system shall continue to provide aircraft control following any single failure',
    rationale: 'Prevent loss of control from single-point failures; required for catastrophic hazard mitigation',
    source: 'HAZ-001',
    type: 'Safety',
    dal: 'A',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-001'],
    linkedTests: ['TC-001', 'TC-002', 'TC-003'],
    relatedHazards: ['HAZ-001'],
  },
  {
    id: 'REQ-002',
    text: 'The probability of total loss of flight control shall be less than 1x10^-9 per flight hour',
    rationale: 'Quantitative safety objective for catastrophic failure condition per ARP4761A',
    source: 'HAZ-001',
    type: 'Safety',
    dal: 'A',
    status: 'Verified',
    verificationMethod: 'Analysis',
    verified: true,
    linkedHazards: ['HAZ-001'],
    linkedTests: ['TC-004'],
    relatedHazards: ['HAZ-001'],
  },
  {
    id: 'REQ-003',
    text: 'The flight control software shall be developed to DAL A per DO-178C',
    rationale: 'Software assurance commensurate with catastrophic failure condition',
    source: 'HAZ-001',
    type: 'Safety',
    dal: 'A',
    status: 'Verified',
    verificationMethod: 'Review',
    verified: true,
    linkedHazards: ['HAZ-001'],
    linkedTests: ['TC-005'],
    relatedHazards: ['HAZ-001'],
  },
  {
    id: 'REQ-004',
    text: 'The backup flight controller shall use dissimilar software design from the primary',
    rationale: 'Prevent common mode software failures affecting both controllers',
    source: 'HAZ-001',
    type: 'Safety',
    dal: 'A',
    status: 'Verified',
    verificationMethod: 'Review',
    verified: true,
    linkedHazards: ['HAZ-001'],
    linkedTests: ['TC-006'],
    relatedHazards: ['HAZ-001'],
  },
  {
    id: 'REQ-005',
    text: 'The aircraft shall maintain minimum 50m clearance from terrain during all flight phases',
    rationale: 'Prevent controlled flight into terrain',
    source: 'HAZ-002',
    type: 'Safety',
    dal: 'A',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-002'],
    linkedTests: ['TC-007', 'TC-008'],
    relatedHazards: ['HAZ-002'],
  },
  {
    id: 'REQ-006',
    text: 'The obstacle detection system shall detect objects 30cm or larger at 100m range',
    rationale: 'Ensure adequate detection for collision avoidance maneuvering',
    source: 'HAZ-002',
    type: 'Safety',
    dal: 'A',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-002'],
    linkedTests: ['TC-009'],
    relatedHazards: ['HAZ-002'],
  },
  {
    id: 'REQ-007',
    text: 'The terrain avoidance system shall initiate avoidance within 500ms of obstacle detection',
    rationale: 'Ensure timely response to terrain/obstacle threats',
    source: 'HAZ-002',
    type: 'Safety',
    dal: 'A',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-002'],
    linkedTests: ['TC-010'],
    relatedHazards: ['HAZ-002'],
  },
  {
    id: 'REQ-008',
    text: 'The DAA system shall detect cooperative traffic equipped with ADS-B at 3nm range',
    rationale: 'Ensure adequate separation from manned aircraft',
    source: 'HAZ-003',
    type: 'Safety',
    dal: 'A',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-003'],
    linkedTests: ['TC-011'],
    relatedHazards: ['HAZ-003'],
  },
  {
    id: 'REQ-009',
    text: 'The DAA system shall detect non-cooperative traffic at 1nm range',
    rationale: 'Ensure detection of aircraft without transponders',
    source: 'HAZ-003',
    type: 'Safety',
    dal: 'A',
    status: 'Approved',
    verificationMethod: 'Test',
    verified: false,
    linkedHazards: ['HAZ-003'],
    linkedTests: ['TC-012'],
    relatedHazards: ['HAZ-003'],
  },
  {
    id: 'REQ-010',
    text: 'The collision avoidance system shall initiate maneuver to achieve 500ft separation',
    rationale: 'Ensure adequate miss distance for collision avoidance',
    source: 'HAZ-003',
    type: 'Safety',
    dal: 'A',
    status: 'Approved',
    verificationMethod: 'Test',
    verified: false,
    linkedHazards: ['HAZ-003'],
    linkedTests: ['TC-013'],
    relatedHazards: ['HAZ-003'],
  },
  {
    id: 'REQ-011',
    text: 'The aircraft shall execute safe lost-link procedures within 10 seconds of link loss detection',
    rationale: 'Ensure predictable behavior during communication failures',
    source: 'HAZ-004',
    type: 'Safety',
    dal: 'B',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-004'],
    linkedTests: ['TC-014', 'TC-015'],
    relatedHazards: ['HAZ-004'],
  },
  {
    id: 'REQ-012',
    text: 'The C2 link shall provide redundancy through at least two independent communication paths',
    rationale: 'Prevent single-point C2 link failure',
    source: 'HAZ-004',
    type: 'Safety',
    dal: 'B',
    status: 'Verified',
    verificationMethod: 'Inspection',
    verified: true,
    linkedHazards: ['HAZ-004'],
    linkedTests: ['TC-016'],
    relatedHazards: ['HAZ-004'],
  },
  {
    id: 'REQ-013',
    text: 'The lost-link return-to-home function shall successfully land the aircraft at designated location',
    rationale: 'Ensure safe recovery during extended communication loss',
    source: 'HAZ-004',
    type: 'Safety',
    dal: 'B',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-004'],
    linkedTests: ['TC-017'],
    relatedHazards: ['HAZ-004'],
  },
  {
    id: 'REQ-014',
    text: 'The BMS shall disconnect the battery within 100ms of detecting cell overvoltage (>4.3V)',
    rationale: 'Prevent overcharge conditions that could lead to thermal runaway',
    source: 'HAZ-005',
    type: 'Safety',
    dal: 'A',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-005'],
    linkedTests: ['TC-018'],
    relatedHazards: ['HAZ-005'],
  },
  {
    id: 'REQ-015',
    text: 'The battery pack shall prevent thermal runaway propagation between cells',
    rationale: 'Contain thermal event to single cell if initiated',
    source: 'HAZ-005',
    type: 'Safety',
    dal: 'A',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-005'],
    linkedTests: ['TC-019'],
    relatedHazards: ['HAZ-005'],
  },
  {
    id: 'REQ-016',
    text: 'The BMS shall monitor cell temperature and disconnect if any cell exceeds 60C',
    rationale: 'Prevent operation in unsafe temperature conditions',
    source: 'HAZ-005',
    type: 'Safety',
    dal: 'A',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-005'],
    linkedTests: ['TC-020'],
    relatedHazards: ['HAZ-005'],
  },
  {
    id: 'REQ-017',
    text: 'The navigation system shall provide position accuracy of 3m CEP during normal GPS conditions',
    rationale: 'Ensure adequate navigation accuracy for BVLOS operations',
    source: 'HAZ-006',
    type: 'Safety',
    dal: 'C',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-006'],
    linkedTests: ['TC-021'],
    relatedHazards: ['HAZ-006'],
  },
  {
    id: 'REQ-018',
    text: 'The INS shall maintain 50m position accuracy for at least 5 minutes in GPS-denied conditions',
    rationale: 'Ensure safe navigation during GPS outages',
    source: 'HAZ-006',
    type: 'Safety',
    dal: 'C',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-006'],
    linkedTests: ['TC-022'],
    relatedHazards: ['HAZ-006'],
  },
  {
    id: 'REQ-019',
    text: 'The navigation system shall detect GPS spoofing within 5 seconds of attack initiation',
    rationale: 'Protect against intentional GPS interference',
    source: 'HAZ-006',
    type: 'Safety',
    dal: 'C',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-006'],
    linkedTests: ['TC-023'],
    relatedHazards: ['HAZ-006'],
  },
  {
    id: 'REQ-020',
    text: 'The aircraft shall maintain controlled flight with up to 2 motor failures',
    rationale: 'Ensure continued safe operation despite motor failures',
    source: 'HAZ-007',
    type: 'Safety',
    dal: 'B',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-007'],
    linkedTests: ['TC-024', 'TC-025'],
    relatedHazards: ['HAZ-007'],
  },
  {
    id: 'REQ-021',
    text: 'The flight controller shall detect motor failure within 50ms and reconfigure control laws',
    rationale: 'Ensure rapid response to propulsion failures',
    source: 'HAZ-007',
    type: 'Safety',
    dal: 'B',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-007'],
    linkedTests: ['TC-026'],
    relatedHazards: ['HAZ-007'],
  },
  {
    id: 'REQ-022',
    text: 'Motors shall be rated for 150% of maximum expected continuous load',
    rationale: 'Ensure adequate margin for motor-out reconfiguration',
    source: 'HAZ-007',
    type: 'Safety',
    dal: 'B',
    status: 'Verified',
    verificationMethod: 'Analysis',
    verified: true,
    linkedHazards: ['HAZ-007'],
    linkedTests: ['TC-027'],
    relatedHazards: ['HAZ-007'],
  },
  {
    id: 'REQ-023',
    text: 'Propellers shall be designed with 4x static safety factor against ultimate load',
    rationale: 'Prevent structural failure during normal operations',
    source: 'HAZ-008',
    type: 'Safety',
    dal: 'B',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-008'],
    linkedTests: ['TC-028'],
    relatedHazards: ['HAZ-008'],
  },
  {
    id: 'REQ-024',
    text: 'Propeller guards shall contain blade fragments in case of failure',
    rationale: 'Prevent secondary damage from propeller debris',
    source: 'HAZ-008',
    type: 'Safety',
    dal: 'B',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-008'],
    linkedTests: ['TC-029'],
    relatedHazards: ['HAZ-008'],
  },
  {
    id: 'REQ-025',
    text: 'The payload release mechanism shall require positive command confirmation before release',
    rationale: 'Prevent inadvertent payload release',
    source: 'HAZ-009',
    type: 'Safety',
    dal: 'C',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-009'],
    linkedTests: ['TC-030'],
    relatedHazards: ['HAZ-009'],
  },
  {
    id: 'REQ-026',
    text: 'The payload release shall only occur when aircraft is within designated release zone',
    rationale: 'Ensure payload delivered to correct location',
    source: 'HAZ-009',
    type: 'Safety',
    dal: 'C',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-009'],
    linkedTests: ['TC-031'],
    relatedHazards: ['HAZ-009'],
  },
  {
    id: 'REQ-027',
    text: 'Payload presence sensors shall confirm payload status with dual-redundant sensing',
    rationale: 'Ensure accurate payload state awareness',
    source: 'HAZ-009',
    type: 'Safety',
    dal: 'C',
    status: 'Verified',
    verificationMethod: 'Inspection',
    verified: true,
    linkedHazards: ['HAZ-009'],
    linkedTests: ['TC-032'],
    relatedHazards: ['HAZ-009'],
  },
  {
    id: 'REQ-028',
    text: 'The geofence shall prevent aircraft from exceeding operational boundaries',
    rationale: 'Ensure aircraft remains in authorized airspace',
    source: 'HAZ-010',
    type: 'Safety',
    dal: 'C',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-010'],
    linkedTests: ['TC-033'],
    relatedHazards: ['HAZ-010'],
  },
  {
    id: 'REQ-029',
    text: 'Geofence enforcement shall be implemented redundantly in FCC and GCS',
    rationale: 'Prevent geofence violation from single point of failure',
    source: 'HAZ-010',
    type: 'Safety',
    dal: 'C',
    status: 'Verified',
    verificationMethod: 'Inspection',
    verified: true,
    linkedHazards: ['HAZ-010'],
    linkedTests: ['TC-034'],
    relatedHazards: ['HAZ-010'],
  },
  {
    id: 'REQ-030',
    text: 'Aircraft shall initiate return-to-home when within 100m of geofence boundary',
    rationale: 'Provide adequate margin for stopping before boundary',
    source: 'HAZ-010',
    type: 'Safety',
    dal: 'C',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-010'],
    linkedTests: ['TC-035'],
    relatedHazards: ['HAZ-010'],
  },
  {
    id: 'REQ-031',
    text: 'The aircraft shall not operate when forecast indicates icing conditions',
    rationale: 'Avoid icing hazard through operational limitation',
    source: 'HAZ-011',
    type: 'Safety',
    dal: 'B',
    status: 'Approved',
    verificationMethod: 'Inspection',
    verified: false,
    linkedHazards: ['HAZ-011'],
    linkedTests: ['TC-036'],
    relatedHazards: ['HAZ-011'],
  },
  {
    id: 'REQ-032',
    text: 'Ice detection sensors shall alert within 30 seconds of ice accumulation onset',
    rationale: 'Provide timely warning for pilot action',
    source: 'HAZ-011',
    type: 'Safety',
    dal: 'B',
    status: 'Approved',
    verificationMethod: 'Test',
    verified: false,
    linkedHazards: ['HAZ-011'],
    linkedTests: ['TC-037'],
    relatedHazards: ['HAZ-011'],
  },
  {
    id: 'REQ-033',
    text: 'All C2 communications shall use AES-256 encryption',
    rationale: 'Protect against eavesdropping and command injection',
    source: 'HAZ-012',
    type: 'Safety',
    dal: 'B',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-012'],
    linkedTests: ['TC-038'],
    relatedHazards: ['HAZ-012'],
  },
  {
    id: 'REQ-034',
    text: 'C2 link authentication shall use certificate-based mutual authentication',
    rationale: 'Prevent unauthorized command sources',
    source: 'HAZ-012',
    type: 'Safety',
    dal: 'B',
    status: 'Verified',
    verificationMethod: 'Test',
    verified: true,
    linkedHazards: ['HAZ-012'],
    linkedTests: ['TC-039'],
    relatedHazards: ['HAZ-012'],
  },
  {
    id: 'REQ-035',
    text: 'Cryptographic keys shall be stored in hardware security module',
    rationale: 'Protect keys from extraction',
    source: 'HAZ-012',
    type: 'Safety',
    dal: 'B',
    status: 'Verified',
    verificationMethod: 'Inspection',
    verified: true,
    linkedHazards: ['HAZ-012'],
    linkedTests: ['TC-040'],
    relatedHazards: ['HAZ-012'],
  },
];

// =============================================================================
// Sample Evidence
// =============================================================================

export const sampleEvidence: Evidence[] = [
  {
    id: 'EV-001',
    title: 'Flight Control System FMEA Report v2.1',
    type: 'Analysis',
    description: 'Comprehensive FMEA analysis of flight control system per ARP4761A',
    relatedRequirements: ['REQ-001', 'REQ-002', 'REQ-003', 'REQ-004'],
    relatedHazards: ['HAZ-001'],
    documentRef: '/docs/safety/fmea/FCS_FMEA_v2.1.pdf',
    date: '2024-08-15',
    status: 'Approved',
  },
  {
    id: 'EV-002',
    title: 'Lost Link Safety Analysis v1.2',
    type: 'Analysis',
    description: 'Analysis of lost-link scenarios and safe behavior',
    relatedRequirements: ['REQ-011', 'REQ-012', 'REQ-013'],
    relatedHazards: ['HAZ-004'],
    documentRef: '/docs/safety/analysis/Lost_Link_Analysis_v1.2.pdf',
    date: '2024-07-20',
    status: 'Approved',
  },
  {
    id: 'EV-003',
    title: 'Lost Link Flight Test Report',
    type: 'Test',
    description: 'Flight test results for lost-link procedures',
    relatedRequirements: ['REQ-011', 'REQ-013'],
    relatedHazards: ['HAZ-004'],
    documentRef: '/docs/test/C2_Lost_Link_Test_Report.pdf',
    date: '2024-09-01',
    status: 'Approved',
  },
  {
    id: 'EV-004',
    title: 'Propulsion FTA Report v1.0',
    type: 'Analysis',
    description: 'Quantitative fault tree analysis for propulsion system',
    relatedRequirements: ['REQ-020', 'REQ-021', 'REQ-022'],
    relatedHazards: ['HAZ-007'],
    documentRef: '/docs/safety/fta/Propulsion_FTA_v1.0.pdf',
    date: '2024-08-01',
    status: 'Approved',
  },
  {
    id: 'EV-005',
    title: 'Navigation Safety Analysis v1.1',
    type: 'Analysis',
    description: 'Safety analysis for GPS loss and navigation degradation',
    relatedRequirements: ['REQ-017', 'REQ-018', 'REQ-019'],
    relatedHazards: ['HAZ-006'],
    documentRef: '/docs/safety/analysis/Nav_Safety_Analysis_v1.1.pdf',
    date: '2024-06-15',
    status: 'Approved',
  },
  {
    id: 'EV-006',
    title: 'Safety Requirements Traceability Matrix v3.2',
    type: 'Analysis',
    description: 'Complete traceability from hazards to requirements to verification',
    relatedRequirements: ['REQ-001', 'REQ-002', 'REQ-003'],
    relatedHazards: ['HAZ-001', 'HAZ-002', 'HAZ-003'],
    documentRef: '/docs/safety/SRTM_v3.2.xlsx',
    date: '2024-10-01',
    status: 'Under Review',
  },
  {
    id: 'EV-007',
    title: 'Safety Verification Summary Report',
    type: 'Test',
    description: 'Summary of all safety requirement verification activities',
    relatedRequirements: [],
    relatedHazards: [],
    documentRef: '/docs/test/Safety_Verification_Summary.pdf',
    date: '2024-10-15',
    status: 'Draft',
  },
  {
    id: 'EV-008',
    title: 'Terrain Avoidance Flight Test Report',
    type: 'Test',
    description: 'Flight test results for terrain and obstacle avoidance system',
    relatedRequirements: ['REQ-005', 'REQ-006', 'REQ-007'],
    relatedHazards: ['HAZ-002'],
    documentRef: '/docs/test/TAWS_Flight_Test_Report.pdf',
    date: '2024-09-10',
    status: 'Approved',
  },
  {
    id: 'EV-009',
    title: 'DAA Performance Test Report',
    type: 'Test',
    description: 'Detect and Avoid system performance test results',
    relatedRequirements: ['REQ-008', 'REQ-009', 'REQ-010'],
    relatedHazards: ['HAZ-003'],
    documentRef: '/docs/test/DAA_Performance_Test.pdf',
    date: '2024-10-20',
    status: 'Under Review',
  },
  {
    id: 'EV-010',
    title: 'Battery Safety Test Report (UN38.3)',
    type: 'Test',
    description: 'UN38.3 compliance testing and thermal abuse test results',
    relatedRequirements: ['REQ-014', 'REQ-015', 'REQ-016'],
    relatedHazards: ['HAZ-005'],
    documentRef: '/docs/test/Battery_Safety_Test_UN38.3.pdf',
    date: '2024-05-20',
    status: 'Approved',
  },
  {
    id: 'EV-011',
    title: 'Payload Release Reliability Test Report',
    type: 'Test',
    description: 'Reliability testing results for payload release mechanism',
    relatedRequirements: ['REQ-025', 'REQ-026', 'REQ-027'],
    relatedHazards: ['HAZ-009'],
    documentRef: '/docs/test/Payload_Release_Test.pdf',
    date: '2024-07-01',
    status: 'Approved',
  },
  {
    id: 'EV-012',
    title: 'Geofence Verification Test Report',
    type: 'Test',
    description: 'Verification testing for geofence system effectiveness',
    relatedRequirements: ['REQ-028', 'REQ-029', 'REQ-030'],
    relatedHazards: ['HAZ-010'],
    documentRef: '/docs/test/Geofence_Verification.pdf',
    date: '2024-08-01',
    status: 'Approved',
  },
  {
    id: 'EV-013',
    title: 'Cybersecurity Assessment Report v1.0',
    type: 'Analysis',
    description: 'Penetration testing and security assessment results',
    relatedRequirements: ['REQ-033', 'REQ-034', 'REQ-035'],
    relatedHazards: ['HAZ-012'],
    documentRef: '/docs/security/Cyber_Assessment_v1.0.pdf',
    date: '2024-09-15',
    status: 'Under Review',
  },
  {
    id: 'EV-014',
    title: 'Motor Failure Flight Test Report',
    type: 'Test',
    description: 'Flight test with simulated motor failures',
    relatedRequirements: ['REQ-020', 'REQ-021'],
    relatedHazards: ['HAZ-007'],
    documentRef: '/docs/test/Motor_Failure_Flight_Test.pdf',
    date: '2024-08-20',
    status: 'Approved',
  },
  {
    id: 'EV-015',
    title: 'Propeller Static Load Test Report',
    type: 'Test',
    description: 'Static and fatigue testing of propeller assemblies',
    relatedRequirements: ['REQ-023', 'REQ-024'],
    relatedHazards: ['HAZ-008'],
    documentRef: '/docs/test/Propeller_Static_Test.pdf',
    date: '2024-04-15',
    status: 'Approved',
  },
  {
    id: 'EV-016',
    title: 'DO-178C Software Accomplishment Summary',
    type: 'Certification',
    description: 'Software accomplishment summary per DO-178C for flight control software',
    relatedRequirements: ['REQ-003'],
    relatedHazards: ['HAZ-001'],
    documentRef: '/docs/certification/SAS_FCS_v1.0.pdf',
    date: '2024-10-01',
    status: 'Under Review',
  },
];

// =============================================================================
// Sample KPIs
// =============================================================================

export const sampleKPIs: SafetyKPIs = {
  systemMTBF: 10000,
  targetFailureRate: 1e-9,
  hazardsClosed: 2,
  hazardsOpen: 2,
  hazardsMonitoring: 2,
  hazardsMitigated: 6,
  requirementsCovered: 32,
  requirementsTotal: 35,
  evidenceApproved: 11,
  evidencePending: 5,
  evidenceTotal: 16,
  faultTreesCompleted: 8,
  faultTreesTotal: 12,
  safetyScore: 87,
  complianceScore: 92,
};

// =============================================================================
// Sample Incident Trends (12 months)
// =============================================================================

export const sampleIncidentData: IncidentDataPoint[] = [
  {
    month: 'Jan',
    incidents: 2,
    resolved: 2,
    nearMisses: 5,
    severity: { catastrophic: 0, hazardous: 0, major: 1, minor: 1 },
  },
  {
    month: 'Feb',
    incidents: 3,
    resolved: 3,
    nearMisses: 4,
    severity: { catastrophic: 0, hazardous: 0, major: 1, minor: 2 },
  },
  {
    month: 'Mar',
    incidents: 1,
    resolved: 2,
    nearMisses: 6,
    severity: { catastrophic: 0, hazardous: 0, major: 0, minor: 1 },
  },
  {
    month: 'Apr',
    incidents: 4,
    resolved: 3,
    nearMisses: 3,
    severity: { catastrophic: 0, hazardous: 1, major: 1, minor: 2 },
  },
  {
    month: 'May',
    incidents: 2,
    resolved: 4,
    nearMisses: 5,
    severity: { catastrophic: 0, hazardous: 0, major: 1, minor: 1 },
  },
  {
    month: 'Jun',
    incidents: 1,
    resolved: 2,
    nearMisses: 4,
    severity: { catastrophic: 0, hazardous: 0, major: 0, minor: 1 },
  },
  {
    month: 'Jul',
    incidents: 3,
    resolved: 2,
    nearMisses: 7,
    severity: { catastrophic: 0, hazardous: 0, major: 2, minor: 1 },
  },
  {
    month: 'Aug',
    incidents: 2,
    resolved: 3,
    nearMisses: 3,
    severity: { catastrophic: 0, hazardous: 0, major: 1, minor: 1 },
  },
  {
    month: 'Sep',
    incidents: 1,
    resolved: 2,
    nearMisses: 4,
    severity: { catastrophic: 0, hazardous: 0, major: 0, minor: 1 },
  },
  {
    month: 'Oct',
    incidents: 2,
    resolved: 2,
    nearMisses: 5,
    severity: { catastrophic: 0, hazardous: 0, major: 1, minor: 1 },
  },
  {
    month: 'Nov',
    incidents: 1,
    resolved: 2,
    nearMisses: 3,
    severity: { catastrophic: 0, hazardous: 0, major: 0, minor: 1 },
  },
  {
    month: 'Dec',
    incidents: 0,
    resolved: 1,
    nearMisses: 2,
    severity: { catastrophic: 0, hazardous: 0, major: 0, minor: 0 },
  },
];

// =============================================================================
// Hazard by Category Data
// =============================================================================

export const sampleHazardByCategory: HazardCategoryData[] = [
  { category: 'Flight Control', count: 1, mitigated: 1, open: 0 },
  { category: 'Navigation', count: 2, mitigated: 2, open: 0 },
  { category: 'Detect & Avoid', count: 1, mitigated: 0, open: 1 },
  { category: 'Communication', count: 1, mitigated: 1, open: 0 },
  { category: 'Power Systems', count: 1, mitigated: 1, open: 0 },
  { category: 'Propulsion', count: 2, mitigated: 2, open: 0 },
  { category: 'Payload', count: 1, mitigated: 1, open: 0 },
  { category: 'Operations', count: 1, mitigated: 1, open: 0 },
  { category: 'Environmental', count: 1, mitigated: 0, open: 1 },
  { category: 'Cybersecurity', count: 1, mitigated: 0, open: 1 },
];

// =============================================================================
// Safety Metrics Completion Data
// =============================================================================

export const sampleSafetyMetrics: SafetyMetricCompletion[] = [
  { metric: 'FHA Completion', completion: 100, target: 100 },
  { metric: 'FMEA Completion', completion: 95, target: 100 },
  { metric: 'FTA Completion', completion: 67, target: 100 },
  { metric: 'Requirements Coverage', completion: 91, target: 100 },
  { metric: 'Verification Complete', completion: 85, target: 100 },
  { metric: 'Evidence Approved', completion: 69, target: 100 },
  { metric: 'DO-178C Objectives', completion: 88, target: 100 },
  { metric: 'ARP4761A Compliance', completion: 92, target: 100 },
];

// =============================================================================
// Risk Matrix Data
// =============================================================================

export const riskMatrixData = {
  severityLevels: ['NoEffect', 'Minor', 'Major', 'Hazardous', 'Catastrophic'] as SeverityLevel[],
  likelihoodLevels: [
    'Frequent',
    'Probable',
    'Remote',
    'ExtremelyRemote',
    'ExtremelyImprobable',
  ] as LikelihoodLevel[],
  riskLevels: {
    Acceptable: { color: '#22c55e', description: 'Risk is acceptable without mitigation' },
    Tolerable: {
      color: '#eab308',
      description: 'Risk is tolerable with appropriate monitoring',
    },
    Undesirable: { color: '#f97316', description: 'Risk reduction measures should be implemented' },
    Unacceptable: { color: '#ef4444', description: 'Risk must be mitigated before operation' },
  } as Record<RiskLevel, { color: string; description: string }>,
  matrix: [
    // Rows: Likelihood (top to bottom: Frequent to ExtremelyImprobable)
    // Columns: Severity (left to right: NoEffect to Catastrophic)
    ['Acceptable', 'Tolerable', 'Undesirable', 'Unacceptable', 'Unacceptable'], // Frequent
    ['Acceptable', 'Tolerable', 'Undesirable', 'Undesirable', 'Unacceptable'], // Probable
    ['Acceptable', 'Acceptable', 'Tolerable', 'Undesirable', 'Undesirable'], // Remote
    ['Acceptable', 'Acceptable', 'Tolerable', 'Tolerable', 'Undesirable'], // ExtremelyRemote
    ['Acceptable', 'Acceptable', 'Acceptable', 'Tolerable', 'Tolerable'], // ExtremelyImprobable
  ] as RiskLevel[][],
};

// =============================================================================
// DAL Requirements per DO-178C
// =============================================================================

export const dalRequirements = {
  A: {
    name: 'Level A',
    failureCondition: 'Catastrophic',
    probability: '<1e-9 per flight hour',
    objectives: 71,
    withIndependence: 30,
    description: 'Software whose anomalous behavior would cause or contribute to a failure of system function resulting in a catastrophic failure condition for the aircraft',
  },
  B: {
    name: 'Level B',
    failureCondition: 'Hazardous',
    probability: '<1e-7 per flight hour',
    objectives: 69,
    withIndependence: 18,
    description: 'Software whose anomalous behavior would cause or contribute to a failure of system function resulting in a hazardous failure condition for the aircraft',
  },
  C: {
    name: 'Level C',
    failureCondition: 'Major',
    probability: '<1e-5 per flight hour',
    objectives: 62,
    withIndependence: 5,
    description: 'Software whose anomalous behavior would cause or contribute to a failure of system function resulting in a major failure condition for the aircraft',
  },
  D: {
    name: 'Level D',
    failureCondition: 'Minor',
    probability: '<1e-3 per flight hour',
    objectives: 26,
    withIndependence: 2,
    description: 'Software whose anomalous behavior would cause or contribute to a failure of system function resulting in a minor failure condition for the aircraft',
  },
  E: {
    name: 'Level E',
    failureCondition: 'No Effect',
    probability: 'No probability requirement',
    objectives: 0,
    withIndependence: 0,
    description: 'Software whose anomalous behavior would cause or contribute to a failure of system function with no effect on aircraft operational capability or pilot workload',
  },
};

// =============================================================================
// System Architecture Summary
// =============================================================================

export const systemArchitecture = {
  aircraft: {
    name: 'SkyDeliver X1',
    type: 'Octocopter VTOL',
    mtow: 25, // kg
    maxPayload: 5, // kg
    maxRange: 20, // km
    maxEndurance: 45, // minutes
    cruiseSpeed: 15, // m/s
    maxAltitude: 120, // m AGL
  },
  flightControl: {
    primary: 'Triple-redundant ARM Cortex-M7 FCCs',
    backup: 'Dissimilar backup FCC with independent software',
    sensors: '3x IMU, 2x Magnetometer, 2x Barometer, 2x GPS',
    actuators: '8x Brushless motors with individual ESCs',
  },
  navigation: {
    gnss: 'Multi-constellation (GPS, GLONASS, Galileo)',
    ins: 'Tactical-grade IMU with visual odometry',
    obstacleDetection: 'Dual LIDAR + stereo camera',
    terrainDatabase: 'DTED Level 2',
  },
  communication: {
    primary: '900MHz spread spectrum (5km range)',
    backup: 'LTE cellular (coverage dependent)',
    satellite: 'Iridium SBD (global coverage)',
    dataLink: 'MAVLink 2.0 with encryption',
  },
  power: {
    primary: '6S LiPo 22000mAh with BMS',
    backup: '6S LiPo 5000mAh emergency battery',
    distribution: 'Dual redundant power buses',
  },
  payload: {
    mechanism: 'Dual-redundant electromagnetic release',
    maxWeight: 5, // kg
    maxDimensions: '30x30x30 cm',
  },
};
