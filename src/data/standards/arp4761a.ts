/**
 * ARP4761A Guidelines and Methods for Conducting the Safety Assessment Process
 * on Civil Airborne Systems and Equipment
 *
 * This file contains safety assessment process steps, requirements, and checklist items
 * for FHA, PSSA, SSA, and CCA activities.
 */

// Severity classifications aligned with ARP4761A
export type SeverityCategory = 'Catastrophic' | 'Hazardous' | 'Major' | 'Minor' | 'NoEffect';

export interface SeverityDefinition {
  category: SeverityCategory;
  description: string;
  flightCrewEffect: string;
  passengerEffect: string;
  probabilityObjective: string;
  qualitativeClassification: string;
}

export const SEVERITY_DEFINITIONS: Record<SeverityCategory, SeverityDefinition> = {
  Catastrophic: {
    category: 'Catastrophic',
    description: 'Failure conditions which would prevent continued safe flight and landing',
    flightCrewEffect: 'Crew incapacitation or fatal injury',
    passengerEffect: 'Multiple fatalities',
    probabilityObjective: 'Extremely Improbable (< 1E-9 per flight hour)',
    qualitativeClassification: 'Extremely Improbable',
  },
  Hazardous: {
    category: 'Hazardous',
    description: 'Failure conditions which would reduce the capability of the aircraft or the ability of the crew to cope with adverse operating conditions',
    flightCrewEffect: 'Physical distress or excessive workload impairs ability to perform tasks',
    passengerEffect: 'Serious or fatal injury to a small number of passengers',
    probabilityObjective: 'Extremely Remote (< 1E-7 per flight hour)',
    qualitativeClassification: 'Extremely Remote',
  },
  Major: {
    category: 'Major',
    description: 'Failure conditions which would reduce the capability of the aircraft or the ability of the crew to cope with adverse operating conditions',
    flightCrewEffect: 'Significant increase in crew workload or in conditions impairing crew efficiency',
    passengerEffect: 'Physical discomfort to passengers',
    probabilityObjective: 'Remote (< 1E-5 per flight hour)',
    qualitativeClassification: 'Remote',
  },
  Minor: {
    category: 'Minor',
    description: 'Failure conditions which would not significantly reduce aircraft safety and involve crew actions well within their capabilities',
    flightCrewEffect: 'Slight increase in crew workload',
    passengerEffect: 'Some inconvenience to passengers',
    probabilityObjective: 'Probable (< 1E-3 per flight hour)',
    qualitativeClassification: 'Probable',
  },
  NoEffect: {
    category: 'NoEffect',
    description: 'Failure conditions which do not affect the operational capability of the aircraft or increase crew workload',
    flightCrewEffect: 'No effect',
    passengerEffect: 'No effect',
    probabilityObjective: 'No probability requirement',
    qualitativeClassification: 'No classification required',
  },
};

// Assessment process types
export type AssessmentProcess = 'FHA' | 'PSSA' | 'SSA' | 'CCA';

// FHA (Functional Hazard Assessment) Requirements
export interface FHARequirement {
  id: string;
  requirement: string;
  description: string;
  inputs: string[];
  outputs: string[];
  activities: string[];
}

export const FHA_REQUIREMENTS: FHARequirement[] = [
  {
    id: 'FHA-1',
    requirement: 'Identify aircraft and system functions',
    description: 'Identify all functions to be performed by the system under assessment, including normal, abnormal, and emergency operations.',
    inputs: ['Aircraft-level functional requirements', 'System architecture', 'Operational requirements'],
    outputs: ['Function list', 'Function descriptions'],
    activities: [
      'Review system requirements and architecture',
      'Identify primary and secondary functions',
      'Document function descriptions and boundaries',
      'Identify function interfaces and dependencies',
    ],
  },
  {
    id: 'FHA-2',
    requirement: 'Identify failure conditions',
    description: 'Identify failure conditions resulting from loss, malfunction, or unintended function of each system function.',
    inputs: ['Function list', 'System architecture', 'Interface definitions'],
    outputs: ['Failure condition list', 'Failure condition descriptions'],
    activities: [
      'Apply systematic hazard identification techniques',
      'Consider loss of function scenarios',
      'Consider malfunction scenarios',
      'Consider unintended function scenarios',
      'Document failure condition descriptions',
    ],
  },
  {
    id: 'FHA-3',
    requirement: 'Classify failure condition severity',
    description: 'Classify the severity of each failure condition based on its effect on the aircraft, crew, and passengers.',
    inputs: ['Failure condition list', 'Aircraft operational envelope', 'Crew response capabilities'],
    outputs: ['Failure condition classifications', 'Safety objectives'],
    activities: [
      'Evaluate worst-case effects on aircraft',
      'Evaluate effects on crew workload and capability',
      'Evaluate effects on passengers',
      'Assign severity classification',
      'Document classification rationale',
    ],
  },
  {
    id: 'FHA-4',
    requirement: 'Assign probability objectives',
    description: 'Assign quantitative and qualitative probability objectives to each failure condition based on its severity.',
    inputs: ['Failure condition classifications', 'Regulatory requirements'],
    outputs: ['Probability objectives', 'Safety requirements'],
    activities: [
      'Determine quantitative probability objective',
      'Determine qualitative probability classification',
      'Document probability objectives',
      'Derive safety requirements',
    ],
  },
  {
    id: 'FHA-5',
    requirement: 'Document FHA results',
    description: 'Document the FHA results including all failure conditions, classifications, and derived safety requirements.',
    inputs: ['All FHA outputs'],
    outputs: ['FHA Report', 'Safety requirements document'],
    activities: [
      'Compile FHA worksheet/table',
      'Document assumptions and rationale',
      'Cross-reference to system requirements',
      'Obtain engineering review and approval',
    ],
  },
];

// PSSA (Preliminary System Safety Assessment) Requirements
export interface PSSARequirement {
  id: string;
  requirement: string;
  description: string;
  inputs: string[];
  outputs: string[];
  activities: string[];
  analysisTypes: string[];
}

export const PSSA_REQUIREMENTS: PSSARequirement[] = [
  {
    id: 'PSSA-1',
    requirement: 'Develop preliminary system architecture',
    description: 'Develop and analyze preliminary system architecture to identify safety-significant design features.',
    inputs: ['System requirements', 'FHA results', 'Preliminary architecture concepts'],
    outputs: ['Preliminary architecture description', 'Safety-significant items list'],
    activities: [
      'Review system requirements',
      'Identify candidate architectures',
      'Identify safety-significant design elements',
      'Document preliminary architecture',
    ],
    analysisTypes: ['Architectural analysis', 'Trade study'],
  },
  {
    id: 'PSSA-2',
    requirement: 'Perform preliminary Fault Tree Analysis (FTA)',
    description: 'Construct preliminary fault trees for each identified failure condition to evaluate architecture adequacy.',
    inputs: ['FHA failure conditions', 'Preliminary architecture', 'Component failure data'],
    outputs: ['Preliminary fault trees', 'Cut set analysis'],
    activities: [
      'Construct fault tree for each failure condition',
      'Identify minimal cut sets',
      'Evaluate architecture independence',
      'Assess probability compliance',
    ],
    analysisTypes: ['Fault Tree Analysis (FTA)'],
  },
  {
    id: 'PSSA-3',
    requirement: 'Perform preliminary Failure Modes and Effects Analysis (FMEA)',
    description: 'Conduct preliminary FMEA to identify component failure modes and their system-level effects.',
    inputs: ['System architecture', 'Component specifications', 'FHA failure conditions'],
    outputs: ['Preliminary FMEA', 'Critical items list'],
    activities: [
      'Identify component failure modes',
      'Analyze local and system effects',
      'Identify detection methods',
      'Document compensating provisions',
    ],
    analysisTypes: ['Failure Modes and Effects Analysis (FMEA)'],
  },
  {
    id: 'PSSA-4',
    requirement: 'Perform Common Cause Analysis (CCA)',
    description: 'Conduct preliminary CCA to identify potential common causes that could compromise independence assumptions.',
    inputs: ['System architecture', 'Fault trees', 'Installation drawings'],
    outputs: ['Preliminary CCA report', 'CCA checklist results'],
    activities: [
      'Perform Zonal Safety Analysis',
      'Perform Particular Risks Analysis',
      'Perform Common Mode Analysis',
      'Document common cause vulnerabilities',
    ],
    analysisTypes: ['Zonal Safety Analysis (ZSA)', 'Particular Risks Analysis (PRA)', 'Common Mode Analysis (CMA)'],
  },
  {
    id: 'PSSA-5',
    requirement: 'Derive safety requirements',
    description: 'Derive safety requirements for lower-level systems, hardware, and software based on PSSA results.',
    inputs: ['PSSA analysis results', 'FHA safety objectives'],
    outputs: ['Derived safety requirements', 'Design assurance level assignments'],
    activities: [
      'Derive hardware safety requirements',
      'Derive software safety requirements',
      'Assign design assurance levels',
      'Document requirement allocation',
    ],
    analysisTypes: ['Requirements derivation'],
  },
  {
    id: 'PSSA-6',
    requirement: 'Document PSSA results',
    description: 'Document all PSSA activities, analyses, and results in the PSSA report.',
    inputs: ['All PSSA outputs'],
    outputs: ['PSSA Report'],
    activities: [
      'Compile analysis results',
      'Document assumptions and limitations',
      'Cross-reference to FHA',
      'Obtain engineering review and approval',
    ],
    analysisTypes: ['Documentation'],
  },
];

// SSA (System Safety Assessment) Requirements
export interface SSARequirement {
  id: string;
  requirement: string;
  description: string;
  inputs: string[];
  outputs: string[];
  activities: string[];
  verificationMethods: string[];
}

export const SSA_REQUIREMENTS: SSARequirement[] = [
  {
    id: 'SSA-1',
    requirement: 'Update fault trees with final design data',
    description: 'Update preliminary fault trees with final design details and verified component failure rates.',
    inputs: ['PSSA fault trees', 'Final design data', 'Verified failure rate data'],
    outputs: ['Final fault trees', 'Quantitative analysis results'],
    activities: [
      'Update fault tree structure for final design',
      'Input verified failure rate data',
      'Calculate top event probability',
      'Verify compliance with safety objectives',
    ],
    verificationMethods: ['Analysis', 'Test data', 'Service experience'],
  },
  {
    id: 'SSA-2',
    requirement: 'Complete FMEA with verified data',
    description: 'Complete the FMEA with final design details and verified component failure data.',
    inputs: ['PSSA FMEA', 'Final design data', 'Verified failure data'],
    outputs: ['Final FMEA'],
    activities: [
      'Update FMEA for final design',
      'Verify failure mode coverage',
      'Confirm detection provisions',
      'Document mitigation measures',
    ],
    verificationMethods: ['Analysis', 'Test', 'Inspection'],
  },
  {
    id: 'SSA-3',
    requirement: 'Complete Common Cause Analysis',
    description: 'Complete CCA with final installation details and verify independence assumptions.',
    inputs: ['PSSA CCA', 'Final installation data', 'Wiring diagrams'],
    outputs: ['Final CCA report'],
    activities: [
      'Complete Zonal Safety Analysis',
      'Complete Particular Risks Analysis',
      'Complete Common Mode Analysis',
      'Verify independence claims',
    ],
    verificationMethods: ['Inspection', 'Analysis', 'Test'],
  },
  {
    id: 'SSA-4',
    requirement: 'Verify safety requirement compliance',
    description: 'Verify that all derived safety requirements have been implemented and verified.',
    inputs: ['Derived safety requirements', 'Design verification data', 'Test results'],
    outputs: ['Safety requirement verification matrix'],
    activities: [
      'Trace safety requirements to implementation',
      'Verify requirement satisfaction',
      'Document verification evidence',
      'Close safety requirements',
    ],
    verificationMethods: ['Analysis', 'Test', 'Inspection', 'Demonstration'],
  },
  {
    id: 'SSA-5',
    requirement: 'Verify design assurance level compliance',
    description: 'Verify that hardware and software meet assigned design assurance levels.',
    inputs: ['DAL assignments', 'Development artifacts', 'Verification evidence'],
    outputs: ['DAL compliance evidence'],
    activities: [
      'Review development process compliance',
      'Verify verification coverage',
      'Confirm tool qualification status',
      'Document compliance evidence',
    ],
    verificationMethods: ['Audit', 'Review', 'Analysis'],
  },
  {
    id: 'SSA-6',
    requirement: 'Document SSA results',
    description: 'Document all SSA activities and results demonstrating safety objective compliance.',
    inputs: ['All SSA outputs'],
    outputs: ['SSA Report', 'Safety assessment summary'],
    activities: [
      'Compile all analysis results',
      'Summarize compliance status',
      'Document residual risks',
      'Obtain engineering and certification approval',
    ],
    verificationMethods: ['Review'],
  },
];

// CCA (Common Cause Analysis) Checklist Items
export interface CCAChecklistItem {
  id: string;
  category: 'ZSA' | 'PRA' | 'CMA';
  item: string;
  description: string;
  verificationMethod: string;
  acceptanceCriteria: string;
}

export const CCA_CHECKLIST_ITEMS: CCAChecklistItem[] = [
  // Zonal Safety Analysis (ZSA) items
  {
    id: 'ZSA-1',
    category: 'ZSA',
    item: 'Physical separation of redundant elements',
    description: 'Verify that redundant system elements are physically separated to prevent single failure propagation.',
    verificationMethod: 'Installation inspection and drawing review',
    acceptanceCriteria: 'Redundant elements located in different zones or with adequate physical barriers',
  },
  {
    id: 'ZSA-2',
    category: 'ZSA',
    item: 'Routing of redundant wiring/tubing',
    description: 'Verify that redundant wiring and tubing are routed through different zones or protected paths.',
    verificationMethod: 'Wire routing diagram review and inspection',
    acceptanceCriteria: 'No common routing paths without adequate protection',
  },
  {
    id: 'ZSA-3',
    category: 'ZSA',
    item: 'Equipment installation interference',
    description: 'Verify that equipment installation does not create interference with other systems.',
    verificationMethod: 'Installation review and EMI/EMC analysis',
    acceptanceCriteria: 'No adverse interference identified',
  },
  {
    id: 'ZSA-4',
    category: 'ZSA',
    item: 'Maintenance accessibility',
    description: 'Verify that safety-critical items are accessible for maintenance without creating hazards.',
    verificationMethod: 'Maintenance procedure review and physical inspection',
    acceptanceCriteria: 'Maintenance access does not compromise system safety',
  },
  {
    id: 'ZSA-5',
    category: 'ZSA',
    item: 'Failure propagation paths',
    description: 'Identify potential failure propagation paths between systems in the same zone.',
    verificationMethod: 'Zone analysis and FMEA review',
    acceptanceCriteria: 'No unmitigated failure propagation paths identified',
  },
  // Particular Risks Analysis (PRA) items
  {
    id: 'PRA-1',
    category: 'PRA',
    item: 'Fire and smoke effects',
    description: 'Analyze effects of fire and smoke on system safety and identify mitigation measures.',
    verificationMethod: 'Fire zone analysis and test',
    acceptanceCriteria: 'System can withstand fire effects or adequate protection provided',
  },
  {
    id: 'PRA-2',
    category: 'PRA',
    item: 'Bird strike effects',
    description: 'Analyze effects of bird strike on system safety.',
    verificationMethod: 'Vulnerability analysis',
    acceptanceCriteria: 'Critical functions protected from bird strike effects',
  },
  {
    id: 'PRA-3',
    category: 'PRA',
    item: 'Tire burst effects',
    description: 'Analyze effects of tire burst on systems located near landing gear.',
    verificationMethod: 'Trajectory analysis and inspection',
    acceptanceCriteria: 'Critical systems protected from tire burst debris',
  },
  {
    id: 'PRA-4',
    category: 'PRA',
    item: 'Uncontained engine failure',
    description: 'Analyze effects of uncontained engine failure on system safety.',
    verificationMethod: 'Trajectory analysis and vulnerability assessment',
    acceptanceCriteria: 'Critical functions maintained after uncontained engine failure',
  },
  {
    id: 'PRA-5',
    category: 'PRA',
    item: 'High Intensity Radiated Fields (HIRF)',
    description: 'Analyze effects of HIRF on electronic systems.',
    verificationMethod: 'HIRF analysis and test',
    acceptanceCriteria: 'Systems meet HIRF protection requirements',
  },
  {
    id: 'PRA-6',
    category: 'PRA',
    item: 'Lightning effects',
    description: 'Analyze direct and indirect effects of lightning on system safety.',
    verificationMethod: 'Lightning analysis and test',
    acceptanceCriteria: 'Systems meet lightning protection requirements',
  },
  {
    id: 'PRA-7',
    category: 'PRA',
    item: 'Icing effects',
    description: 'Analyze effects of icing conditions on system operation.',
    verificationMethod: 'Icing analysis and test',
    acceptanceCriteria: 'System operation maintained under icing conditions',
  },
  {
    id: 'PRA-8',
    category: 'PRA',
    item: 'Water and fluid ingress',
    description: 'Analyze effects of water or fluid ingress on system safety.',
    verificationMethod: 'Environmental analysis and test',
    acceptanceCriteria: 'Systems protected from water/fluid ingress effects',
  },
  // Common Mode Analysis (CMA) items
  {
    id: 'CMA-1',
    category: 'CMA',
    item: 'Software common mode failures',
    description: 'Identify potential software common mode failures affecting redundant channels.',
    verificationMethod: 'Software architecture review',
    acceptanceCriteria: 'Dissimilar software or demonstrated independence',
  },
  {
    id: 'CMA-2',
    category: 'CMA',
    item: 'Hardware common mode failures',
    description: 'Identify potential hardware common mode failures in redundant systems.',
    verificationMethod: 'Hardware design review',
    acceptanceCriteria: 'Dissimilar hardware or demonstrated independence',
  },
  {
    id: 'CMA-3',
    category: 'CMA',
    item: 'Common power source effects',
    description: 'Analyze effects of common power source failures on redundant systems.',
    verificationMethod: 'Power architecture review',
    acceptanceCriteria: 'Independent power sources or adequate backup',
  },
  {
    id: 'CMA-4',
    category: 'CMA',
    item: 'Common environmental stress',
    description: 'Identify common environmental conditions that could affect multiple channels.',
    verificationMethod: 'Environmental analysis',
    acceptanceCriteria: 'Channels protected from common environmental stress',
  },
  {
    id: 'CMA-5',
    category: 'CMA',
    item: 'Common production defects',
    description: 'Identify potential production defects that could affect multiple units.',
    verificationMethod: 'Production process review',
    acceptanceCriteria: 'Quality controls prevent systematic production defects',
  },
  {
    id: 'CMA-6',
    category: 'CMA',
    item: 'Common maintenance errors',
    description: 'Identify maintenance actions that could introduce common failures.',
    verificationMethod: 'Maintenance procedure review',
    acceptanceCriteria: 'Procedures prevent simultaneous errors on redundant systems',
  },
  {
    id: 'CMA-7',
    category: 'CMA',
    item: 'Cascading failures',
    description: 'Identify potential cascading failure sequences between systems.',
    verificationMethod: 'Failure propagation analysis',
    acceptanceCriteria: 'Isolation provisions prevent cascading failures',
  },
  {
    id: 'CMA-8',
    category: 'CMA',
    item: 'Design review and requirements traceability',
    description: 'Verify that common requirements do not create common vulnerabilities.',
    verificationMethod: 'Requirements traceability review',
    acceptanceCriteria: 'Common requirements do not compromise independence',
  },
];

// Analysis method definitions
export interface AnalysisMethod {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  applicablePhases: AssessmentProcess[];
  inputs: string[];
  outputs: string[];
}

export const ANALYSIS_METHODS: AnalysisMethod[] = [
  {
    id: 'FTA',
    name: 'Fault Tree Analysis',
    abbreviation: 'FTA',
    description: 'A top-down deductive analysis that identifies combinations of component failures that can cause a system-level failure condition.',
    applicablePhases: ['PSSA', 'SSA'],
    inputs: ['Failure conditions', 'System architecture', 'Component failure data'],
    outputs: ['Fault trees', 'Cut sets', 'Probability calculations'],
  },
  {
    id: 'FMEA',
    name: 'Failure Modes and Effects Analysis',
    abbreviation: 'FMEA',
    description: 'A bottom-up inductive analysis that examines the effects of component failure modes on system operation.',
    applicablePhases: ['PSSA', 'SSA'],
    inputs: ['Component list', 'System architecture', 'Failure mode data'],
    outputs: ['FMEA worksheet', 'Critical items list'],
  },
  {
    id: 'DD',
    name: 'Dependency Diagram',
    abbreviation: 'DD',
    description: 'A graphical representation of the functional dependencies between system elements.',
    applicablePhases: ['PSSA', 'SSA'],
    inputs: ['System architecture', 'Functional requirements'],
    outputs: ['Dependency diagrams', 'Reliability block diagrams'],
  },
  {
    id: 'MA',
    name: 'Markov Analysis',
    abbreviation: 'MA',
    description: 'A state-based analysis technique for systems with complex reconfiguration or repair processes.',
    applicablePhases: ['PSSA', 'SSA'],
    inputs: ['System states', 'Transition rates', 'Failure/repair data'],
    outputs: ['State diagrams', 'Availability calculations'],
  },
  {
    id: 'ZSA',
    name: 'Zonal Safety Analysis',
    abbreviation: 'ZSA',
    description: 'An analysis of aircraft zones to identify hazards from equipment installation and potential failure propagation.',
    applicablePhases: ['PSSA', 'SSA'],
    inputs: ['Installation drawings', 'Zone definitions', 'Equipment locations'],
    outputs: ['Zone analysis report', 'Installation requirements'],
  },
  {
    id: 'PRA',
    name: 'Particular Risks Analysis',
    abbreviation: 'PRA',
    description: 'An analysis of particular risks such as fire, bird strike, and HIRF that could affect multiple systems.',
    applicablePhases: ['PSSA', 'SSA'],
    inputs: ['Risk sources', 'System vulnerabilities', 'Protection measures'],
    outputs: ['Particular risks report', 'Protection requirements'],
  },
  {
    id: 'CMA',
    name: 'Common Mode Analysis',
    abbreviation: 'CMA',
    description: 'An analysis to identify potential common causes that could defeat redundancy or independence assumptions.',
    applicablePhases: ['PSSA', 'SSA'],
    inputs: ['Redundancy architecture', 'Independence claims', 'Design details'],
    outputs: ['Common mode report', 'Independence verification'],
  },
];

// Combined exports for assessment processes
export const ALL_FHA_REQUIREMENTS = FHA_REQUIREMENTS;
export const ALL_PSSA_REQUIREMENTS = PSSA_REQUIREMENTS;
export const ALL_SSA_REQUIREMENTS = SSA_REQUIREMENTS;
export const ALL_CCA_CHECKLIST_ITEMS = CCA_CHECKLIST_ITEMS;

// Helper to get CCA items by category
export const getCCAItemsByCategory = (category: 'ZSA' | 'PRA' | 'CMA'): CCAChecklistItem[] => {
  return CCA_CHECKLIST_ITEMS.filter((item) => item.category === category);
};

// Helper to get analysis methods by phase
export const getAnalysisMethodsByPhase = (phase: AssessmentProcess): AnalysisMethod[] => {
  return ANALYSIS_METHODS.filter((method) => method.applicablePhases.includes(phase));
};

// Assessment process metadata
export interface ProcessMetadata {
  id: AssessmentProcess;
  name: string;
  fullName: string;
  description: string;
  primaryInputs: string[];
  primaryOutputs: string[];
}

export const PROCESS_METADATA: ProcessMetadata[] = [
  {
    id: 'FHA',
    name: 'FHA',
    fullName: 'Functional Hazard Assessment',
    description: 'Identifies aircraft and system-level functions, failure conditions, and their effects to establish safety objectives.',
    primaryInputs: ['System requirements', 'Operational requirements', 'Aircraft functions'],
    primaryOutputs: ['Failure condition list', 'Severity classifications', 'Safety objectives'],
  },
  {
    id: 'PSSA',
    name: 'PSSA',
    fullName: 'Preliminary System Safety Assessment',
    description: 'Examines proposed system architecture to determine how failures can cause FHA failure conditions and derives safety requirements.',
    primaryInputs: ['FHA results', 'Preliminary architecture', 'Component data'],
    primaryOutputs: ['Preliminary analyses', 'Derived safety requirements', 'DAL assignments'],
  },
  {
    id: 'SSA',
    name: 'SSA',
    fullName: 'System Safety Assessment',
    description: 'Verifies that the implemented system meets safety objectives through completed analyses with verified data.',
    primaryInputs: ['PSSA results', 'Final design data', 'Verified failure data'],
    primaryOutputs: ['Final analyses', 'Compliance verification', 'SSA report'],
  },
  {
    id: 'CCA',
    name: 'CCA',
    fullName: 'Common Cause Analysis',
    description: 'Verifies independence of systems and identifies potential common causes that could affect multiple systems.',
    primaryInputs: ['System architecture', 'Installation data', 'Independence claims'],
    primaryOutputs: ['ZSA report', 'PRA report', 'CMA report'],
  },
];
