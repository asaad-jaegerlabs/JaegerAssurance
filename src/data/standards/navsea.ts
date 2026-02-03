/**
 * NAVSEA System Safety Requirements
 * Naval Sea Systems Command Safety Standards for Navy/DoD Systems
 *
 * This module contains NAVSEA-specific safety requirements including:
 * - NAVSEA OP 5 Vol 1 (Ammunition and Explosives Safety)
 * - NAVSEA Technical Publication S9086 (NSTM) - UAS Safety
 * - NAVSEA System Safety Program Requirements (SSPR)
 * - Software Safety Criticality Index (SSCI)
 * - Naval Autonomy Safety Categories
 * - Autonomous System Safety Requirements
 */

import {
  type SeverityCategory,
  type RiskLevel,
  MIL_STD_882E_SEVERITY,
} from './milstd882e';

// =============================================================================
// Types
// =============================================================================

export type SSCILevel = 1 | 2 | 3 | 4;
export type AutonomyLevel = '10' | '6-9' | '4-5' | '1-3';
export type ComplianceStatus = 'Compliant' | 'Partial' | 'Non-Compliant' | 'Not-Assessed';

export interface NAVSEARequirement {
  id: string;
  category: string;
  requirement: string;
  description: string;
  rationale: string;
  verificationMethods: string[];
}

export interface SSPRSubTask {
  id: string;
  name: string;
  description: string;
  deliverables: string[];
  applicability: string[];
}

export interface SSPRTaskGroup {
  id: string;
  name: string;
  description: string;
  tasks: SSPRSubTask[];
}

export interface SSCIDefinition {
  level: string;
  description: string;
  softwareCharacteristics: string[];
  safetyRequirements: string[];
}

export interface AutonomyCategoryDefinition {
  name: string;
  description: string;
  safetyLevel: string;
  humanRole: string;
  safetyConsiderations: string[];
}

export interface ComplianceEvidence {
  requirementId: string;
  status: ComplianceStatus;
  evidence: string;
  gaps?: string[];
  verificationDate?: string;
}

export interface ComplianceResult {
  totalRequirements: number;
  compliant: number;
  partial: number;
  nonCompliant: number;
  notAssessed: number;
  overallStatus: ComplianceStatus;
  gaps: string[];
}

// =============================================================================
// NAVSEA OP 5 Vol 1 (Ammunition and Explosives Safety)
// =============================================================================

export const NAVSEA_OP5_REQUIREMENTS: NAVSEARequirement[] = [
  {
    id: 'OP5-1',
    category: 'Explosives Safety',
    requirement: 'Ordnance systems shall meet insensitive munitions requirements',
    description:
      'All ordnance systems shall be designed and qualified to meet Insensitive Munitions (IM) requirements per MIL-STD-2105.',
    rationale: 'Reduce vulnerability of munitions to unintended initiation from external stimuli.',
    verificationMethods: ['IM testing per MIL-STD-2105', 'Qualification testing', 'Analysis'],
  },
  {
    id: 'OP5-2',
    category: 'Electromagnetic Environment',
    requirement: 'System shall be safe in electromagnetic environment',
    description:
      'Ordnance systems shall be designed to be safe in the intended electromagnetic environment including HERO, HERF, and HERP.',
    rationale: 'Prevent inadvertent initiation of ordnance from electromagnetic radiation.',
    verificationMethods: ['HERO testing', 'EMI/EMC analysis', 'Shipboard compatibility testing'],
  },
  {
    id: 'OP5-3',
    category: 'Electrostatic Discharge',
    requirement: 'ESD protection shall be provided for ordnance circuits',
    description:
      'Electrostatic discharge protection shall be designed into all ordnance circuits to prevent inadvertent initiation.',
    rationale: 'Prevent ordnance initiation from static electricity buildup and discharge.',
    verificationMethods: ['ESD testing per MIL-STD-1512', 'Design review', 'Analysis'],
  },
  {
    id: 'OP5-4',
    category: 'Safe Separation',
    requirement: 'Ordnance shall incorporate safe separation features',
    description:
      'Ordnance systems shall incorporate features to ensure safe separation from the launch platform before arming.',
    rationale: 'Protect the launching platform and personnel from ordnance effects.',
    verificationMethods: ['Safe separation testing', 'Timing analysis', 'Simulation'],
  },
  {
    id: 'OP5-5',
    category: 'Out of Line Safety',
    requirement: 'Explosive components shall be out of line until intended initiation',
    description:
      'Detonators and explosive components shall be physically or functionally out of line with explosive trains until commanded.',
    rationale: 'Prevent unintended detonation propagation through the explosive train.',
    verificationMethods: ['Design analysis', 'X-ray inspection', 'Safety device testing'],
  },
  {
    id: 'OP5-6',
    category: 'Electrical Safety',
    requirement: 'Shorting provisions shall isolate firing circuits',
    description:
      'Electrical firing circuits shall incorporate shorting provisions that isolate the initiator until intended firing.',
    rationale: 'Prevent induced currents from causing inadvertent initiation.',
    verificationMethods: ['Circuit analysis', 'Isolation testing', 'Design review'],
  },
  {
    id: 'OP5-7',
    category: 'Storage Safety',
    requirement: 'Ordnance storage shall meet explosive safety quantity distance requirements',
    description:
      'Ordnance storage facilities and procedures shall comply with ESQD requirements per NAVSEA OP-5.',
    rationale: 'Protect personnel and facilities from effects of potential explosions.',
    verificationMethods: ['ESQD calculation review', 'Facility inspection', 'Certification'],
  },
  {
    id: 'OP5-8',
    category: 'Handling Safety',
    requirement: 'Ordnance handling procedures shall minimize personnel exposure',
    description:
      'Handling procedures shall be designed to minimize personnel exposure during ordnance operations.',
    rationale: 'Protect personnel during necessary ordnance handling operations.',
    verificationMethods: ['Procedure review', 'Training verification', 'Operation observation'],
  },
];

// =============================================================================
// NAVSEA Technical Publication S9086 (NSTM) Chapter 634 - UAS Safety
// =============================================================================

export const NAVSEA_UAS_SAFETY_REQUIREMENTS: NAVSEARequirement[] = [
  {
    id: 'UAS-001',
    category: 'Flight Safety',
    requirement: 'UAS shall have automatic return-to-base capability on link loss',
    description:
      'Upon loss of command and control link, the UAS shall automatically return to a predefined recovery location or execute a safe termination.',
    rationale: 'Ensure predictable behavior when operator control is lost.',
    verificationMethods: ['Link loss testing', 'Autonomous navigation testing', 'Simulation'],
  },
  {
    id: 'UAS-002',
    category: 'Launch/Recovery',
    requirement: 'Launch and recovery procedures shall protect personnel',
    description:
      'Launch and recovery operations shall incorporate safety zones and procedures to protect personnel from propulsion, moving parts, and collision hazards.',
    rationale: 'Protect deck personnel during high-risk launch and recovery operations.',
    verificationMethods: ['Procedure review', 'Safety zone analysis', 'Training verification'],
  },
  {
    id: 'UAS-003',
    category: 'Propulsion',
    requirement: 'Propulsion hazards shall be mitigated during deck operations',
    description:
      'Propulsion-related hazards including jet blast, propeller strike, and rotor wash shall be controlled during deck operations.',
    rationale: 'Protect personnel and equipment from propulsion system hazards.',
    verificationMethods: ['Hazard analysis', 'Standoff distance analysis', 'PPE requirements'],
  },
  {
    id: 'UAS-004',
    category: 'Flight Termination',
    requirement: 'UAS shall have independent flight termination system',
    description:
      'Safety-critical UAS shall incorporate an independent flight termination system capable of terminating flight to prevent flyaway.',
    rationale: 'Provide last-resort capability to prevent uncontrolled UAS flight.',
    verificationMethods: ['FTS functional testing', 'Independence analysis', 'Reliability analysis'],
  },
  {
    id: 'UAS-005',
    category: 'Geofencing',
    requirement: 'UAS shall incorporate geofencing to prevent boundary violations',
    description:
      'UAS shall incorporate geofencing capabilities to prevent operation outside of approved airspace and geographic boundaries.',
    rationale: 'Prevent airspace violations and operations in restricted areas.',
    verificationMethods: ['Geofence testing', 'Navigation accuracy verification', 'Boundary testing'],
  },
  {
    id: 'UAS-006',
    category: 'Collision Avoidance',
    requirement: 'UAS shall have sense and avoid capability appropriate to mission',
    description:
      'UAS operating in shared airspace shall have sense and avoid capability to detect and avoid other aircraft.',
    rationale: 'Prevent mid-air collisions with manned aircraft and other UAS.',
    verificationMethods: ['SAA testing', 'Detection range verification', 'Response time testing'],
  },
  {
    id: 'UAS-007',
    category: 'Fuel/Energy Safety',
    requirement: 'Fuel and battery systems shall have safe handling and storage provisions',
    description:
      'Fuel systems and battery systems shall incorporate safety features for handling, storage, and emergency response.',
    rationale: 'Prevent fire and explosion hazards from energy storage systems.',
    verificationMethods: ['Fuel system testing', 'Battery abuse testing', 'Storage compliance'],
  },
  {
    id: 'UAS-008',
    category: 'Payload Safety',
    requirement: 'Payload integration shall not compromise flight safety',
    description:
      'Payload integration shall be analyzed to ensure no adverse impact on flight safety, including weight, balance, and system interactions.',
    rationale: 'Ensure payloads do not create unsafe flight conditions.',
    verificationMethods: ['Weight and balance analysis', 'Flight envelope analysis', 'Integration testing'],
  },
  {
    id: 'UAS-009',
    category: 'Electromagnetic Compatibility',
    requirement: 'UAS shall be electromagnetically compatible with ship systems',
    description:
      'UAS shall demonstrate electromagnetic compatibility with shipboard systems and not interfere with ship operations.',
    rationale: 'Prevent interference with critical ship systems and communications.',
    verificationMethods: ['EMC testing', 'Shipboard compatibility testing', 'Spectrum analysis'],
  },
  {
    id: 'UAS-010',
    category: 'Cybersecurity',
    requirement: 'UAS command and control shall be protected against cyber threats',
    description:
      'UAS command, control, and communication systems shall incorporate cybersecurity measures to prevent unauthorized access or control.',
    rationale: 'Prevent adversary takeover or interference with UAS operations.',
    verificationMethods: ['Penetration testing', 'Encryption verification', 'Security assessment'],
  },
];

// =============================================================================
// NAVSEA System Safety Program Requirements (SSPR)
// =============================================================================

export const NAVSEA_SSPR_TASKS: SSPRTaskGroup[] = [
  {
    id: 'SSPR-100',
    name: 'Program Management',
    description: 'System safety program planning and management tasks',
    tasks: [
      {
        id: 'SSPR-101',
        name: 'System Safety Program Plan (SSPP)',
        description:
          'Develop and maintain a System Safety Program Plan describing the approach, milestones, and resources for system safety activities.',
        deliverables: ['System Safety Program Plan'],
        applicability: ['All programs'],
      },
      {
        id: 'SSPR-102',
        name: 'System Safety Working Group (SSWG) Participation',
        description:
          'Participate in System Safety Working Group meetings to coordinate safety activities and resolve issues.',
        deliverables: ['SSWG meeting minutes', 'Action item tracking'],
        applicability: ['Programs requiring SSWG'],
      },
      {
        id: 'SSPR-103',
        name: 'System Safety Program Reviews',
        description:
          'Conduct and support system safety program reviews at program milestones.',
        deliverables: ['Review packages', 'Briefing materials', 'Review reports'],
        applicability: ['All programs'],
      },
      {
        id: 'SSPR-104',
        name: 'Safety Assessment Report',
        description:
          'Prepare Safety Assessment Report documenting the safety status of the system.',
        deliverables: ['Safety Assessment Report'],
        applicability: ['All programs'],
      },
    ],
  },
  {
    id: 'SSPR-200',
    name: 'Hazard Analysis',
    description: 'Hazard identification and analysis tasks',
    tasks: [
      {
        id: 'SSPR-201',
        name: 'Preliminary Hazard List (PHL)',
        description:
          'Develop a preliminary list of hazards based on system concept and similar system experience.',
        deliverables: ['Preliminary Hazard List'],
        applicability: ['All programs'],
      },
      {
        id: 'SSPR-202',
        name: 'System Hazard Analysis (SHA)',
        description:
          'Perform comprehensive system-level hazard analysis identifying hazards, causes, effects, and controls.',
        deliverables: ['System Hazard Analysis Report', 'Hazard tracking entries'],
        applicability: ['All programs'],
      },
      {
        id: 'SSPR-203',
        name: 'Subsystem Hazard Analysis (SSHA)',
        description:
          'Analyze subsystem designs to identify hazards and verify adequacy of hazard controls.',
        deliverables: ['Subsystem Hazard Analysis Reports'],
        applicability: ['Programs with defined subsystems'],
      },
      {
        id: 'SSPR-204',
        name: 'Software Hazard Analysis (SoHA)',
        description:
          'Analyze software-controlled functions for potential hazardous conditions and software contribution to system hazards.',
        deliverables: ['Software Hazard Analysis Report', 'Software safety requirements'],
        applicability: ['Programs with safety-critical software'],
      },
      {
        id: 'SSPR-205',
        name: 'Human Factors Hazard Analysis',
        description:
          'Analyze human-system interfaces for potential human error contributions to hazards.',
        deliverables: ['Human Factors Hazard Analysis Report'],
        applicability: ['Programs with significant human interaction'],
      },
      {
        id: 'SSPR-206',
        name: 'Interface Hazard Analysis',
        description:
          'Analyze interfaces between system elements and with external systems for hazards.',
        deliverables: ['Interface Hazard Analysis Report'],
        applicability: ['Programs with complex interfaces'],
      },
    ],
  },
  {
    id: 'SSPR-300',
    name: 'Software Safety',
    description: 'Software-specific safety analysis tasks',
    tasks: [
      {
        id: 'SSPR-301',
        name: 'Software Safety Criticality Analysis',
        description:
          'Determine software safety criticality index based on software contribution to system hazards.',
        deliverables: ['Software Safety Criticality Analysis', 'SSCI assignments'],
        applicability: ['Programs with safety-related software'],
      },
      {
        id: 'SSPR-302',
        name: 'Software Requirements Hazard Analysis',
        description:
          'Analyze software requirements for completeness and correctness of safety-related requirements.',
        deliverables: ['Software Requirements Hazard Analysis Report'],
        applicability: ['Programs with safety-critical software'],
      },
      {
        id: 'SSPR-303',
        name: 'Software Design Hazard Analysis',
        description:
          'Analyze software design for potential hazardous conditions and verify implementation of safety requirements.',
        deliverables: ['Software Design Hazard Analysis Report'],
        applicability: ['Programs with safety-critical software'],
      },
      {
        id: 'SSPR-304',
        name: 'Software Code-Level Hazard Analysis',
        description:
          'Analyze safety-critical code for implementation of safety requirements and potential coding errors.',
        deliverables: ['Code Hazard Analysis Report', 'Code review records'],
        applicability: ['SSCI-1 and SSCI-2 software'],
      },
      {
        id: 'SSPR-305',
        name: 'Software Test Hazard Analysis',
        description:
          'Analyze software test approach to verify adequate coverage of safety requirements.',
        deliverables: ['Software Test Hazard Analysis Report', 'Test coverage analysis'],
        applicability: ['Programs with safety-critical software'],
      },
      {
        id: 'SSPR-306',
        name: 'Software Change Hazard Analysis',
        description:
          'Analyze software changes for safety impact and verify safety requirements remain satisfied.',
        deliverables: ['Software Change Hazard Analysis'],
        applicability: ['Software modifications to fielded systems'],
      },
    ],
  },
  {
    id: 'SSPR-400',
    name: 'Verification and Validation',
    description: 'Safety verification and validation tasks',
    tasks: [
      {
        id: 'SSPR-401',
        name: 'Safety Requirements Verification',
        description:
          'Verify that safety requirements are properly allocated and implemented in the design.',
        deliverables: ['Requirements traceability matrix', 'Verification records'],
        applicability: ['All programs'],
      },
      {
        id: 'SSPR-402',
        name: 'Safety Test Planning',
        description:
          'Plan tests to verify safety requirements and hazard control effectiveness.',
        deliverables: ['Safety test plans', 'Test procedures'],
        applicability: ['Programs requiring safety testing'],
      },
      {
        id: 'SSPR-403',
        name: 'Safety Test Execution',
        description:
          'Execute safety tests and document results including any anomalies.',
        deliverables: ['Test reports', 'Anomaly reports'],
        applicability: ['Programs requiring safety testing'],
      },
      {
        id: 'SSPR-404',
        name: 'Hazard Control Verification',
        description:
          'Verify that hazard controls are implemented and effective.',
        deliverables: ['Verification evidence', 'Closure documentation'],
        applicability: ['All programs'],
      },
    ],
  },
];

// =============================================================================
// Software Safety Criticality Index (SSCI) - Navy-specific
// =============================================================================

export const SOFTWARE_SAFETY_CRITICALITY: Record<SSCILevel, SSCIDefinition> = {
  1: {
    level: 'Catastrophic',
    description:
      'Software exercises autonomous control over safety-critical hardware systems or provides unique safety-critical information, and an error in the software or data can cause or contribute to a catastrophic hazard.',
    softwareCharacteristics: [
      'Autonomous control of safety-critical functions',
      'Sole source of safety-critical information',
      'No independent verification of software outputs',
      'Direct control of potentially catastrophic hazards',
    ],
    safetyRequirements: [
      'Independent software safety V&V',
      'Formal methods for critical algorithms',
      'Code-level hazard analysis required',
      '100% structural test coverage (MC/DC)',
      'Independent safety audit',
    ],
  },
  2: {
    level: 'Critical',
    description:
      'Software exercises control over safety-critical hardware systems or provides safety-critical information with some independent checking, and an error can cause or contribute to a critical hazard.',
    softwareCharacteristics: [
      'Control of safety-critical functions with monitoring',
      'Safety-critical information with some backup',
      'Limited independent verification',
      'Control of potentially critical hazards',
    ],
    safetyRequirements: [
      'Software safety V&V',
      'Design hazard analysis required',
      '100% structural test coverage (decision coverage)',
      'Safety-focused code reviews',
    ],
  },
  3: {
    level: 'Marginal',
    description:
      'Software exercises control over safety-related functions or provides safety-related information, and an error can cause or contribute to a marginal hazard.',
    softwareCharacteristics: [
      'Control of safety-related functions',
      'Safety-related information',
      'Independent verification available',
      'Contribution to marginal hazards',
    ],
    safetyRequirements: [
      'Requirements hazard analysis',
      'Standard testing with safety focus',
      'Statement coverage testing',
    ],
  },
  4: {
    level: 'Negligible',
    description:
      'Software does not control safety-critical or safety-related functions, and an error would not contribute to a mishap beyond negligible severity.',
    softwareCharacteristics: [
      'No safety function control',
      'Non-safety information only',
      'No contribution to significant hazards',
    ],
    safetyRequirements: [
      'Standard development practices',
      'Standard testing',
    ],
  },
};

// =============================================================================
// Naval Autonomy Safety Categories
// =============================================================================

export const NAVAL_AUTONOMY_CATEGORIES: Record<AutonomyLevel, AutonomyCategoryDefinition> = {
  '10': {
    name: 'Remote Control',
    description:
      'Human operator maintains direct real-time control over all system functions. The system executes commands as directed without independent decision-making.',
    safetyLevel: 'Standard',
    humanRole: 'Direct control of all functions',
    safetyConsiderations: [
      'Operator situational awareness',
      'Control latency effects',
      'Operator fatigue',
      'Communication link reliability',
    ],
  },
  '6-9': {
    name: 'Shared Control',
    description:
      'Human operator sets high-level goals and monitors execution. System performs tactical-level planning and execution within defined parameters.',
    safetyLevel: 'Enhanced',
    humanRole: 'Goal setting and supervision with ability to intervene',
    safetyConsiderations: [
      'Automation surprise',
      'Mode awareness',
      'Intervention capability',
      'Boundary condition handling',
      'Handoff procedures',
    ],
  },
  '4-5': {
    name: 'Supervised Autonomy',
    description:
      'System operates semi-autonomously with human monitoring and approval of critical decisions. Human can override or redirect as needed.',
    safetyLevel: 'High',
    humanRole: 'Monitor and approve critical decisions',
    safetyConsiderations: [
      'Trust calibration',
      'Attention management',
      'Decision transparency',
      'Override effectiveness',
      'Autonomous behavior predictability',
      'Fail-safe states',
    ],
  },
  '1-3': {
    name: 'Full Autonomy',
    description:
      'System operates independently without human intervention. Human sets mission parameters but does not control execution.',
    safetyLevel: 'Maximum',
    humanRole: 'Mission definition only',
    safetyConsiderations: [
      'Ethical decision-making',
      'Rules of engagement compliance',
      'Behavior verification and validation',
      'Environmental adaptation',
      'Fail-operational vs fail-safe design',
      'Self-monitoring and health management',
      'Audit trail and explainability',
      'Recovery from anomalous conditions',
    ],
  },
};

// =============================================================================
// SUBSAFE-equivalent Requirements for Autonomous Systems
// =============================================================================

export const AUTONOMOUS_SYSTEM_SAFETY_REQUIREMENTS: NAVSEARequirement[] = [
  {
    id: 'ASS-001',
    category: 'Fail-Safe Design',
    requirement: 'System shall fail to a safe state on critical failure',
    description:
      'The autonomous system shall be designed such that any critical failure results in the system transitioning to a predefined safe state.',
    rationale:
      'Ensure that system failures do not create hazardous conditions or uncontrolled behavior.',
    verificationMethods: ['Failure Mode and Effects Analysis', 'Fault injection testing', 'Safe state verification testing'],
  },
  {
    id: 'ASS-002',
    category: 'Human Override',
    requirement: 'Human operator shall be able to override autonomous functions',
    description:
      'A qualified human operator shall have the capability to override, countermand, or terminate any autonomous function at any time.',
    rationale:
      'Maintain human authority over autonomous operations and provide intervention capability when needed.',
    verificationMethods: ['Override function testing', 'Response time measurement', 'Authority hierarchy verification'],
  },
  {
    id: 'ASS-003',
    category: 'Operational Limits',
    requirement: 'System shall not operate outside defined operational envelope',
    description:
      'The autonomous system shall monitor and enforce operational limits including geographic boundaries, speed limits, altitude limits, and other defined constraints.',
    rationale:
      'Prevent operations that exceed design capabilities or enter restricted areas.',
    verificationMethods: ['Boundary testing', 'Limit monitoring verification', 'Out-of-envelope response testing'],
  },
  {
    id: 'ASS-004',
    category: 'Cybersecurity',
    requirement: 'System shall be protected against cyber attacks that could affect safety',
    description:
      'The autonomous system shall incorporate cybersecurity measures to protect safety-critical functions from unauthorized access, modification, or denial.',
    rationale:
      'Prevent adversary manipulation of safety-critical autonomous functions.',
    verificationMethods: ['Penetration testing', 'Security assessment', 'Encryption verification', 'Access control testing'],
  },
  {
    id: 'ASS-005',
    category: 'Self-Monitoring',
    requirement: 'System shall monitor own health and report anomalies',
    description:
      'The autonomous system shall continuously monitor its own health status, detect anomalies, and report degraded conditions.',
    rationale:
      'Enable early detection of conditions that could lead to unsafe behavior.',
    verificationMethods: ['Built-in test verification', 'Anomaly detection testing', 'Degraded mode testing'],
  },
  {
    id: 'ASS-006',
    category: 'Redundancy',
    requirement: 'Safety-critical functions shall have redundant implementation',
    description:
      'Safety-critical autonomous functions shall be implemented with appropriate redundancy to prevent single point failures.',
    rationale:
      'Maintain safety-critical function availability despite component failures.',
    verificationMethods: ['Redundancy architecture analysis', 'Failure mode testing', 'Independence verification'],
  },
  {
    id: 'ASS-007',
    category: 'Verification',
    requirement: 'Autonomous decision-making shall be verifiable and auditable',
    description:
      'The autonomous system shall provide sufficient logging and explainability to allow verification and audit of autonomous decisions.',
    rationale:
      'Enable post-event analysis and continuous improvement of autonomous behavior.',
    verificationMethods: ['Logging verification', 'Explainability testing', 'Audit trail review'],
  },
  {
    id: 'ASS-008',
    category: 'Rules of Engagement',
    requirement: 'System shall comply with defined rules of engagement',
    description:
      'Autonomous systems capable of lethal actions shall comply with programmed rules of engagement and applicable laws of armed conflict.',
    rationale:
      'Ensure autonomous actions comply with legal and ethical requirements.',
    verificationMethods: ['ROE compliance testing', 'Scenario-based testing', 'Legal review'],
  },
  {
    id: 'ASS-009',
    category: 'Graceful Degradation',
    requirement: 'System shall degrade gracefully when capabilities are reduced',
    description:
      'The autonomous system shall continue safe operation with reduced capability when sensors or other capabilities are degraded.',
    rationale:
      'Maintain safe operation during partial system failures.',
    verificationMethods: ['Degraded mode testing', 'Sensor failure testing', 'Capability reduction analysis'],
  },
  {
    id: 'ASS-010',
    category: 'Environmental Adaptation',
    requirement: 'System shall safely adapt to environmental changes',
    description:
      'The autonomous system shall detect and safely respond to changes in the operational environment including weather, obstacles, and threats.',
    rationale:
      'Ensure safe operation across varying environmental conditions.',
    verificationMethods: ['Environmental testing', 'Adaptation verification', 'Edge case testing'],
  },
  {
    id: 'ASS-011',
    category: 'Cooperative Safety',
    requirement: 'System shall safely operate with other autonomous and manned systems',
    description:
      'The autonomous system shall safely interact with other autonomous systems and manned platforms in shared operational areas.',
    rationale:
      'Prevent conflicts and collisions in multi-platform operations.',
    verificationMethods: ['Multi-platform testing', 'Deconfliction verification', 'Communication protocol testing'],
  },
  {
    id: 'ASS-012',
    category: 'State Awareness',
    requirement: 'System shall maintain awareness of its operational state',
    description:
      'The autonomous system shall maintain awareness of its current operational mode, mission phase, and capability status.',
    rationale:
      'Ensure appropriate behavior for the current operational context.',
    verificationMethods: ['State machine testing', 'Mode transition testing', 'Context awareness verification'],
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get Software Safety Criticality Index based on severity category
 * @param severity - MIL-STD-882E severity category (1-4)
 * @returns SSCI level definition
 */
export const getSoftwareSafetyCriticality = (severity: SeverityCategory): SSCIDefinition => {
  return SOFTWARE_SAFETY_CRITICALITY[severity];
};

/**
 * Get autonomy category definition by level
 * @param level - Autonomy level string
 * @returns Autonomy category definition
 */
export const getAutonomyCategoryDefinition = (level: AutonomyLevel): AutonomyCategoryDefinition => {
  return NAVAL_AUTONOMY_CATEGORIES[level];
};

/**
 * Check Navy compliance status against requirements
 * @param requirements - Array of NAVSEA requirements to check
 * @param evidence - Array of compliance evidence for each requirement
 * @returns Compliance result summary
 */
export const getNavyComplianceStatus = (
  requirements: NAVSEARequirement[],
  evidence: ComplianceEvidence[]
): ComplianceResult => {
  const evidenceMap = new Map(evidence.map((e) => [e.requirementId, e]));

  let compliant = 0;
  let partial = 0;
  let nonCompliant = 0;
  let notAssessed = 0;
  const gaps: string[] = [];

  for (const req of requirements) {
    const reqEvidence = evidenceMap.get(req.id);
    if (!reqEvidence) {
      notAssessed++;
      gaps.push(`${req.id}: Not assessed`);
    } else {
      switch (reqEvidence.status) {
        case 'Compliant':
          compliant++;
          break;
        case 'Partial':
          partial++;
          if (reqEvidence.gaps) {
            gaps.push(...reqEvidence.gaps.map((g) => `${req.id}: ${g}`));
          }
          break;
        case 'Non-Compliant':
          nonCompliant++;
          gaps.push(`${req.id}: ${req.requirement}`);
          break;
        case 'Not-Assessed':
          notAssessed++;
          gaps.push(`${req.id}: Not assessed`);
          break;
      }
    }
  }

  let overallStatus: ComplianceStatus;
  if (nonCompliant > 0) {
    overallStatus = 'Non-Compliant';
  } else if (notAssessed > 0) {
    overallStatus = 'Not-Assessed';
  } else if (partial > 0) {
    overallStatus = 'Partial';
  } else {
    overallStatus = 'Compliant';
  }

  return {
    totalRequirements: requirements.length,
    compliant,
    partial,
    nonCompliant,
    notAssessed,
    overallStatus,
    gaps,
  };
};

/**
 * Get all SSPR tasks flattened into a single array
 * @returns Array of all SSPR subtasks
 */
export const getAllSSPRTasks = (): SSPRSubTask[] => {
  return NAVSEA_SSPR_TASKS.flatMap((group) => group.tasks);
};

/**
 * Get SSPR tasks by group ID
 * @param groupId - Group ID (e.g., 'SSPR-100')
 * @returns Array of tasks in the group or undefined
 */
export const getSSPRTasksByGroup = (groupId: string): SSPRSubTask[] | undefined => {
  const group = NAVSEA_SSPR_TASKS.find((g) => g.id === groupId);
  return group?.tasks;
};

/**
 * Get a specific SSPR task by ID
 * @param taskId - Task ID (e.g., 'SSPR-301')
 * @returns Task definition or undefined
 */
export const getSSPRTaskById = (taskId: string): SSPRSubTask | undefined => {
  for (const group of NAVSEA_SSPR_TASKS) {
    const task = group.tasks.find((t) => t.id === taskId);
    if (task) {
      return task;
    }
  }
  return undefined;
};

/**
 * Get safety considerations for a given autonomy level
 * @param level - Autonomy level
 * @returns Array of safety considerations
 */
export const getSafetyConsiderationsForAutonomy = (level: AutonomyLevel): string[] => {
  return NAVAL_AUTONOMY_CATEGORIES[level].safetyConsiderations;
};

/**
 * Map MIL-STD-882E severity to SSCI level
 * @param severity - Severity category (1-4)
 * @returns SSCI level (1-4)
 */
export const mapSeverityToSSCI = (severity: SeverityCategory): SSCILevel => {
  // Direct mapping - MIL-STD-882E severity 1 maps to SSCI 1, etc.
  return severity;
};

/**
 * Get requirement color for UI display based on category
 * @param category - Requirement category
 * @returns CSS color
 */
export const getRequirementCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Explosives Safety': '#dc2626',
    'Electromagnetic Environment': '#7c3aed',
    'Electrostatic Discharge': '#2563eb',
    'Safe Separation': '#059669',
    'Flight Safety': '#0891b2',
    'Launch/Recovery': '#ca8a04',
    'Propulsion': '#ea580c',
    'Cybersecurity': '#be185d',
    'Fail-Safe Design': '#15803d',
    'Human Override': '#4f46e5',
    'Operational Limits': '#0369a1',
    default: '#6b7280',
  };
  return colors[category] || colors.default;
};

// =============================================================================
// Combined Requirements Arrays
// =============================================================================

export const ALL_NAVSEA_OP5_REQUIREMENTS = NAVSEA_OP5_REQUIREMENTS;
export const ALL_UAS_SAFETY_REQUIREMENTS = NAVSEA_UAS_SAFETY_REQUIREMENTS;
export const ALL_AUTONOMOUS_SYSTEM_REQUIREMENTS = AUTONOMOUS_SYSTEM_SAFETY_REQUIREMENTS;
export const ALL_SSPR_TASKS = getAllSSPRTasks();

// =============================================================================
// Summary Statistics
// =============================================================================

export interface NAVSEASummary {
  op5Requirements: number;
  uasRequirements: number;
  autonomousSystemRequirements: number;
  ssprTaskGroups: number;
  ssprTasks: number;
  ssciLevels: number;
  autonomyCategories: number;
}

export const NAVSEA_SUMMARY: NAVSEASummary = {
  op5Requirements: NAVSEA_OP5_REQUIREMENTS.length,
  uasRequirements: NAVSEA_UAS_SAFETY_REQUIREMENTS.length,
  autonomousSystemRequirements: AUTONOMOUS_SYSTEM_SAFETY_REQUIREMENTS.length,
  ssprTaskGroups: NAVSEA_SSPR_TASKS.length,
  ssprTasks: ALL_SSPR_TASKS.length,
  ssciLevels: Object.keys(SOFTWARE_SAFETY_CRITICALITY).length,
  autonomyCategories: Object.keys(NAVAL_AUTONOMY_CATEGORIES).length,
};
