/**
 * DO-178C Software Considerations in Airborne Systems and Equipment Certification
 * Complete Table A-1 through A-10 objectives for compliance tracking
 */

// Design Assurance Levels
export type DAL = 'A' | 'B' | 'C' | 'D' | 'E';

// Applicability map for each DAL
export interface DALApplicability {
  A: boolean;
  B: boolean;
  C: boolean;
  D: boolean;
}

// Independence requirement map for each DAL
export interface DALIndependence {
  A: boolean;
  B: boolean;
  C: boolean;
  D: boolean;
}

// DO-178C Objective structure
export interface DO178CObjective {
  id: string;
  objective: string;
  description: string;
  applicability: DALApplicability;
  independence: DALIndependence;
  outputs: string[];
  table: string;
}

// DAL Definition structure
export interface DALDefinition {
  name: string;
  failureCondition: string;
  description: string;
  failureRate: string;
}

// DO-178C Design Assurance Level definitions
export const DAL_DEFINITIONS: Record<DAL, DALDefinition> = {
  A: {
    name: 'Level A',
    failureCondition: 'Catastrophic',
    description: 'Failure may cause a crash. Prevents continued safe flight and landing.',
    failureRate: '< 1E-9 per flight hour',
  },
  B: {
    name: 'Level B',
    failureCondition: 'Hazardous',
    description: 'Failure has large negative impact on safety or performance. Reduces capability of aircraft or crew ability to cope.',
    failureRate: '< 1E-7 per flight hour',
  },
  C: {
    name: 'Level C',
    failureCondition: 'Major',
    description: 'Failure is significant but less severe than hazardous. Reduces safety margins or functional capabilities.',
    failureRate: '< 1E-5 per flight hour',
  },
  D: {
    name: 'Level D',
    failureCondition: 'Minor',
    description: 'Failure is noticeable but has lesser impact. Slight reduction in safety margins or crew workload increase.',
    failureRate: '< 1E-3 per flight hour',
  },
  E: {
    name: 'Level E',
    failureCondition: 'No Effect',
    description: 'Failure has no impact on aircraft operational capability or pilot workload.',
    failureRate: 'No probability requirement',
  },
};

// DO-178C Table A-1: Software Planning Process
export const TABLE_A1_OBJECTIVES: DO178CObjective[] = [
  {
    id: 'A1-1',
    objective: 'Software development and verification processes are defined',
    description: 'Define processes and standards for software development lifecycle activities including requirements, design, coding, and integration.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Development Plan', 'Software Verification Plan'],
    table: 'A-1',
  },
  {
    id: 'A1-2',
    objective: 'Software life cycle environment is defined',
    description: 'Define the software development environment including tools, methods, and facilities used during development and verification.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Development Plan', 'Software Life Cycle Environment Configuration Index'],
    table: 'A-1',
  },
  {
    id: 'A1-3',
    objective: 'Software development standards are defined',
    description: 'Define standards for software requirements, design, and code including naming conventions, complexity limits, and documentation standards.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Requirements Standards', 'Software Design Standards', 'Software Code Standards'],
    table: 'A-1',
  },
  {
    id: 'A1-4',
    objective: 'Software plans comply with this document',
    description: 'Ensure that the software planning documents address all applicable objectives from DO-178C for the assigned software level.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Development Plan', 'Software Verification Plan', 'Software Configuration Management Plan', 'Software Quality Assurance Plan'],
    table: 'A-1',
  },
  {
    id: 'A1-5',
    objective: 'Software development and verification processes are coordinated with system processes',
    description: 'Coordinate software lifecycle processes with system-level development and safety assessment processes.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Plan for Software Aspects of Certification'],
    table: 'A-1',
  },
  {
    id: 'A1-6',
    objective: 'Software plans are coordinated',
    description: 'Ensure consistency and coordination between all software planning documents.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Development Plan', 'Software Verification Plan', 'Software Configuration Management Plan', 'Software Quality Assurance Plan'],
    table: 'A-1',
  },
  {
    id: 'A1-7',
    objective: 'Transition criteria are defined',
    description: 'Define criteria for transition between software lifecycle processes and for process entry/exit.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Development Plan', 'Software Verification Plan'],
    table: 'A-1',
  },
];

// DO-178C Table A-2: Software Development Process
export const TABLE_A2_OBJECTIVES: DO178CObjective[] = [
  {
    id: 'A2-1',
    objective: 'High-level requirements are developed',
    description: 'Develop high-level requirements (HLR) from system requirements allocated to software, including functional, performance, and interface requirements.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Requirements Data'],
    table: 'A-2',
  },
  {
    id: 'A2-2',
    objective: 'Derived high-level requirements are defined',
    description: 'Identify and document derived high-level requirements that arise from software design decisions but do not directly trace to system requirements.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Requirements Data'],
    table: 'A-2',
  },
  {
    id: 'A2-3',
    objective: 'Software architecture is developed',
    description: 'Develop the software architecture that satisfies the high-level requirements, defining the structure and organization of software components.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Design Description'],
    table: 'A-2',
  },
  {
    id: 'A2-4',
    objective: 'Low-level requirements are developed',
    description: 'Develop low-level requirements (LLR) from high-level requirements and software architecture, providing detail needed for source code implementation.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Design Description'],
    table: 'A-2',
  },
  {
    id: 'A2-5',
    objective: 'Derived low-level requirements are defined',
    description: 'Identify and document derived low-level requirements that arise from detailed design decisions.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Design Description'],
    table: 'A-2',
  },
  {
    id: 'A2-6',
    objective: 'Source code is developed',
    description: 'Develop source code that implements the low-level requirements (or high-level requirements for Level D software).',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Source Code'],
    table: 'A-2',
  },
  {
    id: 'A2-7',
    objective: 'Executable Object Code and Parameter Data Item Files are produced',
    description: 'Compile and link source code to produce executable object code and associated parameter data item files.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Executable Object Code', 'Parameter Data Item File'],
    table: 'A-2',
  },
];

// DO-178C Table A-3: Verification of Outputs of Software Requirements Process
export const TABLE_A3_OBJECTIVES: DO178CObjective[] = [
  {
    id: 'A3-1',
    objective: 'High-level requirements comply with system requirements',
    description: 'Verify that each high-level requirement is traceable to and consistent with the system requirements allocated to software.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-3',
  },
  {
    id: 'A3-2',
    objective: 'High-level requirements are accurate and consistent',
    description: 'Verify that high-level requirements are unambiguous, internally consistent, and accurately describe the intended software behavior.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-3',
  },
  {
    id: 'A3-3',
    objective: 'High-level requirements are compatible with target computer',
    description: 'Verify that high-level requirements are compatible with the capabilities and constraints of the target computer hardware.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-3',
  },
  {
    id: 'A3-4',
    objective: 'High-level requirements are verifiable',
    description: 'Verify that each high-level requirement can be verified through testing, analysis, or review.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-3',
  },
  {
    id: 'A3-5',
    objective: 'High-level requirements conform to standards',
    description: 'Verify that high-level requirements conform to the software requirements standards defined in the Software Development Plan.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-3',
  },
  {
    id: 'A3-6',
    objective: 'High-level requirements are traceable to system requirements',
    description: 'Verify that bidirectional traceability exists between high-level requirements and system requirements.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-3',
  },
  {
    id: 'A3-7',
    objective: 'Algorithms are accurate',
    description: 'Verify that algorithms specified in high-level requirements are mathematically accurate and suitable for the intended application.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-3',
  },
];

// DO-178C Table A-4: Verification of Outputs of Software Design Process
export const TABLE_A4_OBJECTIVES: DO178CObjective[] = [
  {
    id: 'A4-1',
    objective: 'Low-level requirements comply with high-level requirements',
    description: 'Verify that each low-level requirement is traceable to and consistent with the high-level requirements.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-4',
  },
  {
    id: 'A4-2',
    objective: 'Low-level requirements are accurate and consistent',
    description: 'Verify that low-level requirements are unambiguous, internally consistent, and accurately describe the intended software behavior.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-4',
  },
  {
    id: 'A4-3',
    objective: 'Low-level requirements are compatible with target computer',
    description: 'Verify that low-level requirements are compatible with the capabilities and constraints of the target computer.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-4',
  },
  {
    id: 'A4-4',
    objective: 'Low-level requirements are verifiable',
    description: 'Verify that each low-level requirement can be verified through testing, analysis, or review.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-4',
  },
  {
    id: 'A4-5',
    objective: 'Low-level requirements conform to standards',
    description: 'Verify that low-level requirements conform to the software design standards defined in the Software Development Plan.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-4',
  },
  {
    id: 'A4-6',
    objective: 'Low-level requirements are traceable to high-level requirements',
    description: 'Verify that bidirectional traceability exists between low-level requirements and high-level requirements.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-4',
  },
  {
    id: 'A4-7',
    objective: 'Algorithms are accurate',
    description: 'Verify that algorithms specified in low-level requirements are mathematically accurate and suitable for the intended application.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-4',
  },
  {
    id: 'A4-8',
    objective: 'Software architecture is compatible with high-level requirements',
    description: 'Verify that the software architecture satisfies the high-level requirements and is compatible with system architecture.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-4',
  },
  {
    id: 'A4-9',
    objective: 'Software architecture is consistent',
    description: 'Verify that the software architecture components are internally consistent and compatible with each other.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-4',
  },
  {
    id: 'A4-10',
    objective: 'Software architecture is compatible with target computer',
    description: 'Verify that the software architecture is compatible with the target computer capabilities including memory, timing, and I/O.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-4',
  },
  {
    id: 'A4-11',
    objective: 'Software architecture is verifiable',
    description: 'Verify that the software architecture allows verification of the implemented software.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-4',
  },
  {
    id: 'A4-12',
    objective: 'Software architecture conforms to standards',
    description: 'Verify that the software architecture conforms to the software design standards.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-4',
  },
  {
    id: 'A4-13',
    objective: 'Software partitioning integrity is confirmed',
    description: 'Verify that software partitioning mechanisms prevent interference between partitioned components.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-4',
  },
];

// DO-178C Table A-5: Verification of Outputs of Software Coding & Integration Process
export const TABLE_A5_OBJECTIVES: DO178CObjective[] = [
  {
    id: 'A5-1',
    objective: 'Source Code complies with low-level requirements',
    description: 'Verify that the source code correctly implements the low-level requirements (or high-level requirements for Level D).',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-5',
  },
  {
    id: 'A5-2',
    objective: 'Source Code complies with software architecture',
    description: 'Verify that the source code is consistent with the software architecture.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-5',
  },
  {
    id: 'A5-3',
    objective: 'Source Code is verifiable',
    description: 'Verify that the source code structure allows for complete verification through testing and analysis.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-5',
  },
  {
    id: 'A5-4',
    objective: 'Source Code conforms to standards',
    description: 'Verify that the source code conforms to the software code standards defined in the Software Development Plan.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-5',
  },
  {
    id: 'A5-5',
    objective: 'Source Code is traceable to low-level requirements',
    description: 'Verify that bidirectional traceability exists between source code and low-level requirements (or HLR for Level D).',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-5',
  },
  {
    id: 'A5-6',
    objective: 'Source Code is accurate and consistent',
    description: 'Verify that the source code is accurate, internally consistent, and free from defects.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-5',
  },
  {
    id: 'A5-7',
    objective: 'Output of software integration process is complete and correct',
    description: 'Verify that the integrated software is complete and that all components are correctly linked.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-5',
  },
  {
    id: 'A5-8',
    objective: 'Parameter Data Item File is correct and complete',
    description: 'Verify that parameter data item files are correct and complete for the intended application.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-5',
  },
  {
    id: 'A5-9',
    objective: 'Verification of Parameter Data Item File is achieved',
    description: 'Verify that parameter data item files have been verified according to the verification plan.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-5',
  },
];

// DO-178C Table A-6: Testing of Outputs of Integration Process
export const TABLE_A6_OBJECTIVES: DO178CObjective[] = [
  {
    id: 'A6-1',
    objective: 'Executable Object Code complies with high-level requirements',
    description: 'Verify through testing that the executable object code satisfies the high-level requirements.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: true, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-6',
  },
  {
    id: 'A6-2',
    objective: 'Executable Object Code is robust with high-level requirements',
    description: 'Verify through testing that the executable object code behaves correctly under abnormal inputs and conditions.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: true, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-6',
  },
  {
    id: 'A6-3',
    objective: 'Executable Object Code complies with low-level requirements',
    description: 'Verify through testing that the executable object code satisfies the low-level requirements.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: true, B: true, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-6',
  },
  {
    id: 'A6-4',
    objective: 'Executable Object Code is robust with low-level requirements',
    description: 'Verify through testing that the executable object code handles error conditions defined in low-level requirements.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: true, B: true, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-6',
  },
  {
    id: 'A6-5',
    objective: 'Executable Object Code is compatible with target computer',
    description: 'Verify through testing that the executable object code operates correctly on the target computer hardware.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: true, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-6',
  },
];

// DO-178C Table A-7: Verification of Verification Process Results
export const TABLE_A7_OBJECTIVES: DO178CObjective[] = [
  {
    id: 'A7-1',
    objective: 'Test procedures are correct',
    description: 'Verify that test procedures correctly implement the test cases and produce the expected results.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: true, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-7',
  },
  {
    id: 'A7-2',
    objective: 'Test results are correct and discrepancies explained',
    description: 'Verify that test results are correctly recorded and any discrepancies are analyzed and explained.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: true, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-7',
  },
  {
    id: 'A7-3',
    objective: 'Test coverage of high-level requirements is achieved',
    description: 'Verify that testing achieves complete coverage of all high-level requirements.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: true, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-7',
  },
  {
    id: 'A7-4',
    objective: 'Test coverage of low-level requirements is achieved',
    description: 'Verify that testing achieves complete coverage of all low-level requirements.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: true, B: true, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-7',
  },
  {
    id: 'A7-5',
    objective: 'Test coverage of software structure (modified condition/decision) is achieved',
    description: 'Verify that testing achieves MC/DC coverage demonstrating that each condition independently affects the decision.',
    applicability: { A: true, B: false, C: false, D: false },
    independence: { A: true, B: false, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-7',
  },
  {
    id: 'A7-6',
    objective: 'Test coverage of software structure (decision coverage) is achieved',
    description: 'Verify that testing achieves decision coverage demonstrating that each decision has taken all possible outcomes.',
    applicability: { A: true, B: true, C: false, D: false },
    independence: { A: true, B: true, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-7',
  },
  {
    id: 'A7-7',
    objective: 'Test coverage of software structure (statement coverage) is achieved',
    description: 'Verify that testing achieves statement coverage demonstrating that each statement has been executed.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: true, B: true, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-7',
  },
  {
    id: 'A7-8',
    objective: 'Test coverage of software structure (data coupling and control coupling) is achieved',
    description: 'Verify that testing demonstrates data and control coupling between software components.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: true, B: true, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-7',
  },
  {
    id: 'A7-9',
    objective: 'Verification of additional code that cannot be traced to source code is achieved',
    description: 'Verify that any code generated by the compiler or linker that cannot be traced to source code does not cause anomalous behavior.',
    applicability: { A: true, B: true, C: true, D: false },
    independence: { A: true, B: true, C: false, D: false },
    outputs: ['Software Verification Results'],
    table: 'A-7',
  },
];

// DO-178C Table A-8: Software Configuration Management Process
export const TABLE_A8_OBJECTIVES: DO178CObjective[] = [
  {
    id: 'A8-1',
    objective: 'Configuration items are identified',
    description: 'Identify all configuration items that are required to be controlled, including software code, data, tools, and documentation.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Configuration Management Records', 'Software Configuration Index'],
    table: 'A-8',
  },
  {
    id: 'A8-2',
    objective: 'Baselines and traceability are established',
    description: 'Establish configuration baselines and maintain traceability between configuration items.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Configuration Management Records', 'Software Configuration Index'],
    table: 'A-8',
  },
  {
    id: 'A8-3',
    objective: 'Problem reporting, change control, change review, and configuration status accounting are established',
    description: 'Establish processes for problem reporting, change control, change review, and tracking configuration status.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Problem Reports', 'Software Configuration Management Records'],
    table: 'A-8',
  },
  {
    id: 'A8-4',
    objective: 'Archive, retrieval, and release are established',
    description: 'Establish processes for archiving, retrieving, and releasing configuration items.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Configuration Management Records'],
    table: 'A-8',
  },
  {
    id: 'A8-5',
    objective: 'Software load control is established',
    description: 'Establish processes to ensure only authorized software is loaded onto the target computer.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Configuration Management Records'],
    table: 'A-8',
  },
  {
    id: 'A8-6',
    objective: 'Software life cycle environment control is established',
    description: 'Establish control over the software development and verification environment including tools and equipment.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Life Cycle Environment Configuration Index'],
    table: 'A-8',
  },
];

// DO-178C Table A-9: Software Quality Assurance Process
export const TABLE_A9_OBJECTIVES: DO178CObjective[] = [
  {
    id: 'A9-1',
    objective: 'Assurance is obtained that software development and verification processes comply with approved plans',
    description: 'Provide assurance that software processes are conducted in compliance with the approved software plans and standards.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: true, C: true, D: true },
    outputs: ['Software Quality Assurance Records'],
    table: 'A-9',
  },
  {
    id: 'A9-2',
    objective: 'Assurance is obtained that software development and verification processes comply with approved standards',
    description: 'Provide assurance that software products conform to the approved software standards.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: true, C: true, D: true },
    outputs: ['Software Quality Assurance Records'],
    table: 'A-9',
  },
  {
    id: 'A9-3',
    objective: 'Assurance is obtained that transition criteria have been satisfied',
    description: 'Provide assurance that transition criteria between processes have been satisfied before proceeding.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: true, C: true, D: true },
    outputs: ['Software Quality Assurance Records'],
    table: 'A-9',
  },
  {
    id: 'A9-4',
    objective: 'Assurance is obtained that software conformity review is conducted',
    description: 'Provide assurance that a conformity review is conducted to verify that the software product conforms to its definition.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: true, C: true, D: true },
    outputs: ['Software Conformity Review'],
    table: 'A-9',
  },
  {
    id: 'A9-5',
    objective: 'Software Quality Assurance Records are complete',
    description: 'Ensure that software quality assurance records are complete and available for certification.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: true, B: true, C: true, D: true },
    outputs: ['Software Quality Assurance Records'],
    table: 'A-9',
  },
];

// DO-178C Table A-10: Certification Liaison Process
export const TABLE_A10_OBJECTIVES: DO178CObjective[] = [
  {
    id: 'A10-1',
    objective: 'Communication and understanding between the applicant and the certification authority is established',
    description: 'Establish and maintain communication with the certification authority regarding software aspects of certification.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Plan for Software Aspects of Certification'],
    table: 'A-10',
  },
  {
    id: 'A10-2',
    objective: 'The means of compliance is proposed and agreement with the Plan for Software Aspects of Certification is obtained',
    description: 'Propose the means of compliance and obtain certification authority agreement with the Plan for Software Aspects of Certification.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Plan for Software Aspects of Certification'],
    table: 'A-10',
  },
  {
    id: 'A10-3',
    objective: 'Compliance substantiation is provided',
    description: 'Provide evidence of compliance with the certification basis and Plan for Software Aspects of Certification.',
    applicability: { A: true, B: true, C: true, D: true },
    independence: { A: false, B: false, C: false, D: false },
    outputs: ['Software Accomplishment Summary'],
    table: 'A-10',
  },
];

// Combined list for easy iteration
export const ALL_DO178C_OBJECTIVES: DO178CObjective[] = [
  ...TABLE_A1_OBJECTIVES,
  ...TABLE_A2_OBJECTIVES,
  ...TABLE_A3_OBJECTIVES,
  ...TABLE_A4_OBJECTIVES,
  ...TABLE_A5_OBJECTIVES,
  ...TABLE_A6_OBJECTIVES,
  ...TABLE_A7_OBJECTIVES,
  ...TABLE_A8_OBJECTIVES,
  ...TABLE_A9_OBJECTIVES,
  ...TABLE_A10_OBJECTIVES,
];

// Table metadata
export interface TableMetadata {
  id: string;
  title: string;
  description: string;
  objectiveCount: number;
}

export const TABLE_METADATA: TableMetadata[] = [
  { id: 'A-1', title: 'Software Planning Process', description: 'Objectives for software planning activities', objectiveCount: TABLE_A1_OBJECTIVES.length },
  { id: 'A-2', title: 'Software Development Process', description: 'Objectives for software development activities', objectiveCount: TABLE_A2_OBJECTIVES.length },
  { id: 'A-3', title: 'Verification of Outputs of Software Requirements Process', description: 'Objectives for verifying software requirements', objectiveCount: TABLE_A3_OBJECTIVES.length },
  { id: 'A-4', title: 'Verification of Outputs of Software Design Process', description: 'Objectives for verifying software design', objectiveCount: TABLE_A4_OBJECTIVES.length },
  { id: 'A-5', title: 'Verification of Outputs of Software Coding & Integration Process', description: 'Objectives for verifying coding and integration', objectiveCount: TABLE_A5_OBJECTIVES.length },
  { id: 'A-6', title: 'Testing of Outputs of Integration Process', description: 'Objectives for integration testing', objectiveCount: TABLE_A6_OBJECTIVES.length },
  { id: 'A-7', title: 'Verification of Verification Process Results', description: 'Objectives for verifying test coverage and results', objectiveCount: TABLE_A7_OBJECTIVES.length },
  { id: 'A-8', title: 'Software Configuration Management Process', description: 'Objectives for configuration management', objectiveCount: TABLE_A8_OBJECTIVES.length },
  { id: 'A-9', title: 'Software Quality Assurance Process', description: 'Objectives for quality assurance', objectiveCount: TABLE_A9_OBJECTIVES.length },
  { id: 'A-10', title: 'Certification Liaison Process', description: 'Objectives for certification activities', objectiveCount: TABLE_A10_OBJECTIVES.length },
];

// Helper to get objectives by table
export const getObjectivesByTable = (tableId: string): DO178CObjective[] => {
  return ALL_DO178C_OBJECTIVES.filter((obj) => obj.table === tableId);
};

// Helper to get objectives by DAL
export const getObjectivesForDAL = (dal: Exclude<DAL, 'E'>): DO178CObjective[] => {
  return ALL_DO178C_OBJECTIVES.filter((obj) => obj.applicability[dal]);
};

// Helper to get independence-required objectives by DAL
export const getIndependenceRequiredObjectives = (dal: Exclude<DAL, 'E'>): DO178CObjective[] => {
  return ALL_DO178C_OBJECTIVES.filter((obj) => obj.applicability[dal] && obj.independence[dal]);
};

// Objective counts by DAL
export interface ObjectiveCount {
  total: number;
  independence: number;
}

export const OBJECTIVE_COUNTS: Record<Exclude<DAL, 'E'>, ObjectiveCount> = {
  A: {
    total: ALL_DO178C_OBJECTIVES.filter((obj) => obj.applicability.A).length,
    independence: ALL_DO178C_OBJECTIVES.filter((obj) => obj.applicability.A && obj.independence.A).length,
  },
  B: {
    total: ALL_DO178C_OBJECTIVES.filter((obj) => obj.applicability.B).length,
    independence: ALL_DO178C_OBJECTIVES.filter((obj) => obj.applicability.B && obj.independence.B).length,
  },
  C: {
    total: ALL_DO178C_OBJECTIVES.filter((obj) => obj.applicability.C).length,
    independence: ALL_DO178C_OBJECTIVES.filter((obj) => obj.applicability.C && obj.independence.C).length,
  },
  D: {
    total: ALL_DO178C_OBJECTIVES.filter((obj) => obj.applicability.D).length,
    independence: ALL_DO178C_OBJECTIVES.filter((obj) => obj.applicability.D && obj.independence.D).length,
  },
};

// Coverage analysis type
export interface CoverageAnalysis {
  dal: Exclude<DAL, 'E'>;
  totalObjectives: number;
  independenceRequired: number;
  byTable: Record<string, { total: number; independence: number }>;
}

// Helper to get coverage analysis for a DAL
export const getCoverageAnalysis = (dal: Exclude<DAL, 'E'>): CoverageAnalysis => {
  const objectives = getObjectivesForDAL(dal);
  const byTable: Record<string, { total: number; independence: number }> = {};

  TABLE_METADATA.forEach((table) => {
    const tableObjectives = objectives.filter((obj) => obj.table === table.id);
    byTable[table.id] = {
      total: tableObjectives.length,
      independence: tableObjectives.filter((obj) => obj.independence[dal]).length,
    };
  });

  return {
    dal,
    totalObjectives: objectives.length,
    independenceRequired: getIndependenceRequiredObjectives(dal).length,
    byTable,
  };
};
