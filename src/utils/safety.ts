/**
 * Safety Calculation Utilities
 *
 * Comprehensive utility functions for aerospace/aviation safety analysis
 * per DO-178C and ARP4761A standards. Includes risk assessment, fault tree
 * analysis, cut set analysis, importance measures, FMEA calculations,
 * DAL allocation, and validation functions.
 *
 * @module utils/safety
 */

import type {
  SeverityLevel,
  LikelihoodLevel,
  RiskLevel,
  RiskScore,
  GateType,
  FaultTreeNode,
  CutSet,
  ImportanceMeasure,
  FMEAItem,
  DAL,
  Hazard,
  Requirement,
  Evidence,
  ValidationResult,
  TraceabilityResult,
} from '../types/safety';

// =============================================================================
// Risk Calculation (ARP4761A)
// =============================================================================

/**
 * ARP4761A 5x6 Risk Matrix
 *
 * Maps severity (5 levels) and likelihood (6 levels) to risk scores and levels.
 * Based on ARP4761A Figure 9 - Example Hazard Risk Assessment Matrix.
 *
 * Risk Levels:
 * - Unacceptable: Risk is not acceptable under any circumstances
 * - Undesirable: Risk is undesirable and should only be accepted with mitigation
 * - Tolerable: Risk is tolerable with appropriate controls
 * - Acceptable: Risk is acceptable without additional mitigation
 */
export const RISK_MATRIX: Record<
  SeverityLevel,
  Record<LikelihoodLevel, RiskScore>
> = {
  Catastrophic: {
    Frequent: { score: 30, level: 'Unacceptable' },
    Probable: { score: 29, level: 'Unacceptable' },
    Remote: { score: 28, level: 'Unacceptable' },
    ExtremelyRemote: { score: 27, level: 'Unacceptable' },
    ExtremelyImprobable: { score: 20, level: 'Undesirable' },
    Incredible: { score: 10, level: 'Tolerable' },
  },
  Hazardous: {
    Frequent: { score: 26, level: 'Unacceptable' },
    Probable: { score: 25, level: 'Unacceptable' },
    Remote: { score: 24, level: 'Unacceptable' },
    ExtremelyRemote: { score: 19, level: 'Undesirable' },
    ExtremelyImprobable: { score: 14, level: 'Tolerable' },
    Incredible: { score: 8, level: 'Acceptable' },
  },
  Major: {
    Frequent: { score: 23, level: 'Unacceptable' },
    Probable: { score: 22, level: 'Unacceptable' },
    Remote: { score: 18, level: 'Undesirable' },
    ExtremelyRemote: { score: 13, level: 'Tolerable' },
    ExtremelyImprobable: { score: 7, level: 'Acceptable' },
    Incredible: { score: 4, level: 'Acceptable' },
  },
  Minor: {
    Frequent: { score: 21, level: 'Unacceptable' },
    Probable: { score: 17, level: 'Undesirable' },
    Remote: { score: 12, level: 'Tolerable' },
    ExtremelyRemote: { score: 6, level: 'Acceptable' },
    ExtremelyImprobable: { score: 3, level: 'Acceptable' },
    Incredible: { score: 2, level: 'Acceptable' },
  },
  NoEffect: {
    Frequent: { score: 16, level: 'Tolerable' },
    Probable: { score: 11, level: 'Tolerable' },
    Remote: { score: 5, level: 'Acceptable' },
    ExtremelyRemote: { score: 1, level: 'Acceptable' },
    ExtremelyImprobable: { score: 1, level: 'Acceptable' },
    Incredible: { score: 1, level: 'Acceptable' },
  },
};

/**
 * Calculate risk score from severity and likelihood using ARP4761A risk matrix.
 *
 * @param severity - Severity level of the failure condition
 * @param likelihood - Likelihood/probability level of occurrence
 * @returns Risk score object with numeric score and qualitative level
 *
 * @example
 * ```typescript
 * const risk = calculateRiskScore('Hazardous', 'Remote');
 * // Returns: { score: 24, level: 'Unacceptable' }
 * ```
 */
export function calculateRiskScore(
  severity: SeverityLevel,
  likelihood: LikelihoodLevel
): RiskScore {
  return RISK_MATRIX[severity][likelihood];
}

// =============================================================================
// Fault Tree Probability Calculations
// =============================================================================

/**
 * Calculate binomial coefficient (n choose k).
 * Used for voting gate probability calculations.
 *
 * @param n - Total number of items
 * @param k - Number to choose
 * @returns Binomial coefficient C(n,k)
 */
function binomialCoefficient(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;

  // Use symmetry to minimize iterations
  const effectiveK = Math.min(k, n - k);

  let result = 1;
  for (let i = 0; i < effectiveK; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

/**
 * Calculate gate output probability from child probabilities.
 *
 * Supports the following gate types:
 * - AND: P = P1 * P2 * ... * Pn (all inputs must occur)
 * - OR: P = 1 - (1-P1)(1-P2)...(1-Pn) (any input causes output)
 * - VOTING: k-of-n calculation using binomial distribution
 * - NOT: P = 1 - P1 (inverts single input)
 * - INHIBIT: Treated as AND (input AND enabling condition)
 *
 * @param gateType - Type of logic gate
 * @param childProbabilities - Array of input event probabilities (0-1)
 * @param votingThreshold - k value for k-of-n voting gates
 * @returns Output probability (0-1)
 * @throws Error if invalid gate type or insufficient inputs
 *
 * @example
 * ```typescript
 * // AND gate: both events must occur
 * calculateGateProbability('AND', [0.1, 0.2]); // Returns: 0.02
 *
 * // OR gate: either event causes failure
 * calculateGateProbability('OR', [0.1, 0.2]); // Returns: 0.28
 *
 * // 2-of-3 voting gate
 * calculateGateProbability('VOTING', [0.1, 0.1, 0.1], 2); // Returns: ~0.028
 * ```
 */
export function calculateGateProbability(
  gateType: GateType,
  childProbabilities: number[],
  votingThreshold?: number
): number {
  if (childProbabilities.length === 0) {
    throw new Error('Gate must have at least one input');
  }

  // Validate probabilities are in valid range
  for (const p of childProbabilities) {
    if (p < 0 || p > 1) {
      throw new Error(`Invalid probability: ${p}. Must be between 0 and 1`);
    }
  }

  switch (gateType) {
    case 'AND':
    case 'INHIBIT': {
      // P(AND) = P1 * P2 * ... * Pn
      return childProbabilities.reduce((acc, p) => acc * p, 1);
    }

    case 'OR': {
      // P(OR) = 1 - (1-P1)(1-P2)...(1-Pn)
      const complementProduct = childProbabilities.reduce(
        (acc, p) => acc * (1 - p),
        1
      );
      return 1 - complementProduct;
    }

    case 'VOTING': {
      if (votingThreshold === undefined) {
        throw new Error('Voting gate requires votingThreshold parameter');
      }
      const n = childProbabilities.length;
      const k = votingThreshold;

      if (k < 1 || k > n) {
        throw new Error(
          `Invalid voting threshold: ${k}. Must be between 1 and ${n}`
        );
      }

      // For identical probabilities, use binomial formula
      // For non-identical, we need to enumerate combinations
      const allSame = childProbabilities.every(
        (p) => Math.abs(p - childProbabilities[0]) < 1e-10
      );

      if (allSame) {
        // Binomial: sum from i=k to n of C(n,i) * p^i * (1-p)^(n-i)
        const p = childProbabilities[0];
        let probability = 0;
        for (let i = k; i <= n; i++) {
          probability +=
            binomialCoefficient(n, i) *
            Math.pow(p, i) *
            Math.pow(1 - p, n - i);
        }
        return probability;
      } else {
        // Non-identical probabilities: enumerate all combinations
        return calculateVotingProbabilityNonIdentical(childProbabilities, k);
      }
    }

    case 'NOT': {
      if (childProbabilities.length !== 1) {
        throw new Error('NOT gate must have exactly one input');
      }
      return 1 - childProbabilities[0];
    }

    case 'TRANSFER': {
      // TRANSFER gate just passes through the transferred probability
      if (childProbabilities.length !== 1) {
        throw new Error('TRANSFER gate must have exactly one input');
      }
      return childProbabilities[0];
    }

    default:
      throw new Error(`Unknown gate type: ${gateType}`);
  }
}

/**
 * Calculate voting gate probability for non-identical probabilities.
 * Uses recursive enumeration of all k-of-n combinations.
 */
function calculateVotingProbabilityNonIdentical(
  probabilities: number[],
  k: number
): number {
  const n = probabilities.length;

  // Generate all combinations of size k to n
  let totalProbability = 0;

  // For each combination size from k to n
  for (let size = k; size <= n; size++) {
    // Generate combinations of that size
    const combinations = getCombinations(n, size);

    for (const combo of combinations) {
      // Calculate probability of exactly this combination occurring
      let comboProb = 1;

      for (let i = 0; i < n; i++) {
        if (combo.includes(i)) {
          comboProb *= probabilities[i];
        } else {
          comboProb *= 1 - probabilities[i];
        }
      }

      // Only count if exactly this many occur (for size < n)
      // Actually, we want at least k, so we sum all combinations >= k
      // But we need to avoid double counting
      // Use inclusion-exclusion or direct enumeration
    }
  }

  // Simpler approach: calculate P(at least k failures)
  // Enumerate all 2^n possibilities
  const totalCombos = Math.pow(2, n);
  totalProbability = 0;

  for (let mask = 0; mask < totalCombos; mask++) {
    const failureCount = countBits(mask);
    if (failureCount >= k) {
      let comboProb = 1;
      for (let i = 0; i < n; i++) {
        if ((mask & (1 << i)) !== 0) {
          comboProb *= probabilities[i];
        } else {
          comboProb *= 1 - probabilities[i];
        }
      }
      totalProbability += comboProb;
    }
  }

  return totalProbability;
}

/**
 * Count number of set bits in a number.
 */
function countBits(n: number): number {
  let count = 0;
  while (n > 0) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}

/**
 * Generate all combinations of k elements from n elements.
 * Returns array of index arrays.
 */
function getCombinations(n: number, k: number): number[][] {
  const result: number[][] = [];

  function combine(start: number, current: number[]): void {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < n; i++) {
      current.push(i);
      combine(i + 1, current);
      current.pop();
    }
  }

  combine(0, []);
  return result;
}

/**
 * Convert failure rate to probability using exponential distribution.
 *
 * Uses the formula: P = 1 - e^(-lambda * t)
 * This assumes constant failure rate (exponential distribution).
 *
 * @param lambda - Failure rate (failures per unit time)
 * @param exposureTime - Time duration for probability calculation
 * @returns Probability of failure during exposure time (0-1)
 *
 * @example
 * ```typescript
 * // 10^-6 failures/hour over 1000 hours
 * failureRateToProbability(1e-6, 1000); // Returns: ~0.001 (0.1%)
 * ```
 */
export function failureRateToProbability(
  lambda: number,
  exposureTime: number
): number {
  if (lambda < 0) {
    throw new Error('Failure rate must be non-negative');
  }
  if (exposureTime < 0) {
    throw new Error('Exposure time must be non-negative');
  }
  return 1 - Math.exp(-lambda * exposureTime);
}

/**
 * Calculate all node probabilities in a fault tree (bottom-up traversal).
 *
 * Recursively calculates probabilities from basic events up to the top event.
 * Basic events must have their probability set. Intermediate nodes have their
 * probability calculated based on their gate type and children.
 *
 * @param root - Root node of the fault tree
 * @returns New fault tree with all probabilities calculated
 *
 * @example
 * ```typescript
 * const tree = {
 *   id: 'top',
 *   label: 'System Failure',
 *   type: 'top-event',
 *   gate: 'OR',
 *   children: [
 *     { id: 'a', label: 'Event A', type: 'basic-event', probability: 0.01 },
 *     { id: 'b', label: 'Event B', type: 'basic-event', probability: 0.02 }
 *   ]
 * };
 * const result = calculateTreeProbabilities(tree);
 * // result.probability will be 0.0298 (OR of 0.01 and 0.02)
 * ```
 */
export function calculateTreeProbabilities(
  root: FaultTreeNode
): FaultTreeNode {
  // Deep clone to avoid mutating original
  const clonedRoot = structuredClone(root);
  calculateNodeProbability(clonedRoot);
  return clonedRoot;
}

/**
 * Recursively calculate probability for a node and its children.
 */
function calculateNodeProbability(node: FaultTreeNode): number {
  // Basic events, undeveloped events, and house events should have probability set
  if (
    node.type === 'basic-event' ||
    node.type === 'undeveloped' ||
    node.type === 'house-event'
  ) {
    // If failure rate is provided but not probability, calculate it
    if (
      node.probability === undefined &&
      node.failureRate !== undefined &&
      node.exposureTime !== undefined
    ) {
      node.probability = failureRateToProbability(
        node.failureRate,
        node.exposureTime
      );
    }
    return node.probability ?? 0;
  }

  // For intermediate and top events, calculate from children
  if (!node.children || node.children.length === 0) {
    // No children, return existing probability or 0
    return node.probability ?? 0;
  }

  // Recursively calculate child probabilities
  const childProbabilities = node.children.map((child) =>
    calculateNodeProbability(child)
  );

  // Calculate this node's probability based on gate type
  if (node.gate) {
    node.probability = calculateGateProbability(
      node.gate,
      childProbabilities,
      node.votingThreshold
    );
  } else {
    // No gate specified, assume OR gate for safety (conservative)
    node.probability = calculateGateProbability('OR', childProbabilities);
  }

  return node.probability;
}

// =============================================================================
// Cut Set Analysis (MOCUS Algorithm)
// =============================================================================

/**
 * Identify minimal cut sets using the MOCUS algorithm.
 *
 * MOCUS (Method of Obtaining Cut Sets) systematically identifies all minimal
 * cut sets in a fault tree. A minimal cut set is a smallest combination of
 * basic events that, if they all occur, will cause the top event to occur.
 *
 * The algorithm works top-down:
 * - OR gate: Creates separate cut sets for each child
 * - AND gate: Combines children into the same cut set
 *
 * @param root - Root node of the fault tree
 * @returns Array of minimal cut sets
 *
 * @example
 * ```typescript
 * const cutSets = identifyMinimalCutSets(faultTree);
 * // Returns: [
 * //   { eventIds: ['basic1'], order: 1 },
 * //   { eventIds: ['basic2', 'basic3'], order: 2 }
 * // ]
 * ```
 */
export function identifyMinimalCutSets(root: FaultTreeNode): CutSet[] {
  // Get initial cut sets from MOCUS
  const rawCutSets = mocusExpand(root);

  // Convert to CutSet format and minimize
  const cutSetMap = new Map<string, Set<string>>();

  for (const eventSet of rawCutSets) {
    const key = [...eventSet].sort().join(',');
    if (!cutSetMap.has(key)) {
      cutSetMap.set(key, eventSet);
    }
  }

  // Remove non-minimal cut sets (supersets)
  const cutSetList = [...cutSetMap.values()];
  const minimalCutSets: Set<string>[] = [];

  for (const cutSet of cutSetList) {
    // Check if this cut set is a superset of any existing minimal cut set
    const isSuperset = minimalCutSets.some((minimal) =>
      isProperSubset(minimal, cutSet)
    );

    if (!isSuperset) {
      // Remove any existing cut sets that are supersets of this one
      const toRemove: number[] = [];
      minimalCutSets.forEach((minimal, index) => {
        if (isProperSubset(cutSet, minimal)) {
          toRemove.push(index);
        }
      });

      // Remove in reverse order to maintain indices
      for (let i = toRemove.length - 1; i >= 0; i--) {
        minimalCutSets.splice(toRemove[i], 1);
      }

      minimalCutSets.push(cutSet);
    }
  }

  // Convert to CutSet format
  return minimalCutSets.map((eventSet) => ({
    eventIds: [...eventSet].sort(),
    order: eventSet.size,
  }));
}

/**
 * Check if set A is a proper subset of set B.
 */
function isProperSubset(a: Set<string>, b: Set<string>): boolean {
  if (a.size >= b.size) return false;
  for (const elem of a) {
    if (!b.has(elem)) return false;
  }
  return true;
}

/**
 * MOCUS expansion algorithm.
 * Returns array of event ID sets (each set is a cut set).
 */
function mocusExpand(node: FaultTreeNode): Set<string>[] {
  // Basic event or undeveloped: return single cut set containing this event
  if (
    node.type === 'basic-event' ||
    node.type === 'undeveloped' ||
    node.type === 'house-event'
  ) {
    return [new Set([node.id])];
  }

  // No children: return empty (shouldn't happen in valid tree)
  if (!node.children || node.children.length === 0) {
    return [];
  }

  // Get cut sets from all children
  const childCutSets = node.children.map((child) => mocusExpand(child));

  // Combine based on gate type
  const gateType = node.gate ?? 'OR';

  if (gateType === 'OR') {
    // OR gate: Union of all child cut sets
    // Each child's cut set is a separate path to failure
    return childCutSets.flat();
  } else if (gateType === 'AND' || gateType === 'INHIBIT') {
    // AND gate: Cartesian product of child cut sets
    // All children must occur, so combine each cut set from each child
    return cartesianProduct(childCutSets);
  } else if (gateType === 'NOT') {
    // NOT gate in fault trees is complex - typically converted in preprocessing
    // For simplicity, treat as pass-through
    return childCutSets[0] ?? [];
  } else if (gateType === 'VOTING') {
    // Voting gate: Need k-of-n children to fail
    // Generate all k-combinations and take their AND products
    const k = node.votingThreshold ?? 1;
    const n = node.children.length;
    const combinations = getCombinations(n, k);

    const result: Set<string>[] = [];
    for (const combo of combinations) {
      const selectedChildSets = combo.map((i) => childCutSets[i]);
      const products = cartesianProduct(selectedChildSets);
      result.push(...products);
    }
    return result;
  }

  return [];
}

/**
 * Compute Cartesian product of arrays of cut sets.
 */
function cartesianProduct(arrays: Set<string>[][]): Set<string>[] {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return arrays[0];

  let result = arrays[0].map((set) => new Set(set));

  for (let i = 1; i < arrays.length; i++) {
    const newResult: Set<string>[] = [];
    for (const existing of result) {
      for (const toAdd of arrays[i]) {
        const combined = new Set(existing);
        for (const elem of toAdd) {
          combined.add(elem);
        }
        newResult.push(combined);
      }
    }
    result = newResult;
  }

  return result;
}

/**
 * Check if a cut set represents a single-point failure.
 *
 * A single-point failure (SPF) is a cut set of order 1, meaning a single
 * basic event can cause the top event. SPFs are critical safety concerns
 * and typically require special attention in safety analysis.
 *
 * @param cutSet - Cut set to check
 * @returns True if the cut set is a single-point failure
 */
export function isSinglePointFailure(cutSet: CutSet): boolean {
  return cutSet.order === 1;
}

/**
 * Calculate cut set probability.
 *
 * The probability of a cut set is the product of probabilities of all
 * basic events in the cut set (assuming independence).
 *
 * @param cutSet - Cut set to calculate probability for
 * @param basicEvents - Map of event IDs to their probabilities
 * @returns Probability of the cut set
 *
 * @example
 * ```typescript
 * const cutSet = { eventIds: ['a', 'b'], order: 2 };
 * const events = new Map([['a', 0.01], ['b', 0.02]]);
 * calculateCutSetProbability(cutSet, events); // Returns: 0.0002
 * ```
 */
export function calculateCutSetProbability(
  cutSet: CutSet,
  basicEvents: Map<string, number>
): number {
  let probability = 1;

  for (const eventId of cutSet.eventIds) {
    const eventProb = basicEvents.get(eventId);
    if (eventProb === undefined) {
      throw new Error(`Unknown basic event: ${eventId}`);
    }
    probability *= eventProb;
  }

  return probability;
}

// =============================================================================
// Importance Measures
// =============================================================================

/**
 * Extract basic events from a fault tree.
 */
function extractBasicEvents(node: FaultTreeNode): Map<string, FaultTreeNode> {
  const events = new Map<string, FaultTreeNode>();

  function traverse(n: FaultTreeNode): void {
    if (n.type === 'basic-event' || n.type === 'undeveloped') {
      events.set(n.id, n);
    }
    if (n.children) {
      n.children.forEach(traverse);
    }
  }

  traverse(node);
  return events;
}

/**
 * Calculate top event probability with a specific event set to a given probability.
 */
function calculateWithEventProbability(
  root: FaultTreeNode,
  eventId: string,
  probability: number
): number {
  const clonedRoot = structuredClone(root);

  function setEventProbability(node: FaultTreeNode): void {
    if (node.id === eventId) {
      node.probability = probability;
    }
    if (node.children) {
      node.children.forEach(setEventProbability);
    }
  }

  setEventProbability(clonedRoot);
  const result = calculateTreeProbabilities(clonedRoot);
  return result.probability ?? 0;
}

/**
 * Calculate Fussell-Vesely importance for a basic event.
 *
 * Fussell-Vesely importance measures the fractional contribution of a basic
 * event to the top event probability. It represents the probability that at
 * least one minimal cut set containing the event has occurred, given that
 * the top event has occurred.
 *
 * F-V = Sum(P(MCS containing event)) / P(top event)
 *
 * @param eventId - ID of the basic event
 * @param cutSets - Array of minimal cut sets
 * @param topEventProbability - Probability of the top event
 * @param basicEvents - Map of event IDs to probabilities
 * @returns Fussell-Vesely importance (0-1)
 */
export function calculateFussellVesely(
  eventId: string,
  cutSets: CutSet[],
  topEventProbability: number,
  basicEvents: Map<string, number>
): number {
  if (topEventProbability === 0) return 0;

  // Find all cut sets containing this event
  const containingCutSets = cutSets.filter((cs) =>
    cs.eventIds.includes(eventId)
  );

  if (containingCutSets.length === 0) return 0;

  // Calculate sum of cut set probabilities
  // Note: This is an approximation (rare event approximation)
  // For exact calculation, would need inclusion-exclusion
  let sum = 0;
  for (const cutSet of containingCutSets) {
    sum += calculateCutSetProbability(cutSet, basicEvents);
  }

  return Math.min(sum / topEventProbability, 1);
}

/**
 * Calculate Birnbaum importance for a basic event.
 *
 * Birnbaum importance (also called structural importance) measures the rate
 * of change of the top event probability with respect to a basic event
 * probability. It represents how sensitive the system is to changes in
 * the event's probability.
 *
 * B = P(top | event=1) - P(top | event=0)
 *
 * @param eventId - ID of the basic event
 * @param root - Root of the fault tree
 * @returns Birnbaum importance (0-1)
 */
export function calculateBirnbaum(
  eventId: string,
  root: FaultTreeNode
): number {
  const pTopGivenEvent1 = calculateWithEventProbability(root, eventId, 1);
  const pTopGivenEvent0 = calculateWithEventProbability(root, eventId, 0);

  return pTopGivenEvent1 - pTopGivenEvent0;
}

/**
 * Calculate Risk Achievement Worth (RAW) for a basic event.
 *
 * RAW measures the factor by which the top event probability would increase
 * if the basic event were certain to occur (probability = 1). High RAW
 * indicates events that are critical when they do occur.
 *
 * RAW = P(top | event=1) / P(top)
 *
 * @param eventId - ID of the basic event
 * @param root - Root of the fault tree
 * @param topEventProbability - Current top event probability
 * @returns Risk Achievement Worth (>= 1)
 */
export function calculateRAW(
  eventId: string,
  root: FaultTreeNode,
  topEventProbability: number
): number {
  if (topEventProbability === 0) return Infinity;

  const pTopGivenEvent1 = calculateWithEventProbability(root, eventId, 1);
  return pTopGivenEvent1 / topEventProbability;
}

/**
 * Calculate Risk Reduction Worth (RRW) for a basic event.
 *
 * RRW measures the factor by which the top event probability would decrease
 * if the basic event were impossible (probability = 0). High RRW indicates
 * events that would significantly improve safety if prevented.
 *
 * RRW = P(top) / P(top | event=0)
 *
 * @param eventId - ID of the basic event
 * @param root - Root of the fault tree
 * @param topEventProbability - Current top event probability
 * @returns Risk Reduction Worth (>= 1)
 */
export function calculateRRW(
  eventId: string,
  root: FaultTreeNode,
  topEventProbability: number
): number {
  const pTopGivenEvent0 = calculateWithEventProbability(root, eventId, 0);

  if (pTopGivenEvent0 === 0) return Infinity;
  return topEventProbability / pTopGivenEvent0;
}

/**
 * Calculate all importance measures for all basic events in a fault tree.
 *
 * @param root - Root of the fault tree
 * @returns Array of importance measures for each basic event
 */
export function calculateAllImportanceMeasures(
  root: FaultTreeNode
): ImportanceMeasure[] {
  // First, calculate tree probabilities
  const calculatedTree = calculateTreeProbabilities(root);
  const topEventProbability = calculatedTree.probability ?? 0;

  // Extract basic events
  const basicEvents = extractBasicEvents(calculatedTree);

  // Create probability map
  const probabilityMap = new Map<string, number>();
  for (const [id, node] of basicEvents) {
    probabilityMap.set(id, node.probability ?? 0);
  }

  // Get minimal cut sets
  const cutSets = identifyMinimalCutSets(calculatedTree);

  // Calculate importance measures for each basic event
  const measures: ImportanceMeasure[] = [];

  for (const [eventId, node] of basicEvents) {
    const baseProbability = node.probability ?? 0;

    measures.push({
      eventId,
      eventLabel: node.label,
      baseProbability,
      fussellVesely: calculateFussellVesely(
        eventId,
        cutSets,
        topEventProbability,
        probabilityMap
      ),
      birnbaum: calculateBirnbaum(eventId, root),
      raw: calculateRAW(eventId, root, topEventProbability),
      rrw: calculateRRW(eventId, root, topEventProbability),
    });
  }

  // Sort by Fussell-Vesely importance (most important first)
  return measures.sort((a, b) => b.fussellVesely - a.fussellVesely);
}

// =============================================================================
// FMEA Calculations
// =============================================================================

/**
 * Calculate Risk Priority Number (RPN).
 *
 * RPN = Severity x Occurrence x Detection
 *
 * The RPN is used to prioritize failure modes for corrective action.
 * Higher RPN indicates higher priority for action.
 *
 * @param severity - Severity rating (1-10)
 * @param occurrence - Occurrence rating (1-10)
 * @param detection - Detection rating (1-10)
 * @returns RPN value (1-1000)
 *
 * @example
 * ```typescript
 * calculateRPN(8, 4, 3); // Returns: 96
 * ```
 */
export function calculateRPN(
  severity: number,
  occurrence: number,
  detection: number
): number {
  // Validate inputs
  if (severity < 1 || severity > 10) {
    throw new Error('Severity must be between 1 and 10');
  }
  if (occurrence < 1 || occurrence > 10) {
    throw new Error('Occurrence must be between 1 and 10');
  }
  if (detection < 1 || detection > 10) {
    throw new Error('Detection must be between 1 and 10');
  }

  return severity * occurrence * detection;
}

/**
 * Calculate Action Priority per AIAG-VDA FMEA handbook.
 *
 * The AIAG-VDA method considers S, O, D combinations rather than just RPN.
 * This provides better prioritization by giving more weight to severity.
 *
 * High Priority:
 * - S >= 9 (safety/regulatory severity) regardless of O and D
 * - S >= 5 with O >= 4 and D >= 6
 *
 * Medium Priority:
 * - S >= 5 with O >= 4 or D >= 6
 * - S < 5 with O >= 4 and D >= 6
 *
 * Low Priority:
 * - All other combinations
 *
 * @param severity - Severity rating (1-10)
 * @param occurrence - Occurrence rating (1-10)
 * @param detection - Detection rating (1-10)
 * @returns Action priority level
 */
export function calculateActionPriority(
  severity: number,
  occurrence: number,
  detection: number
): 'High' | 'Medium' | 'Low' {
  // Validate inputs
  if (severity < 1 || severity > 10) {
    throw new Error('Severity must be between 1 and 10');
  }
  if (occurrence < 1 || occurrence > 10) {
    throw new Error('Occurrence must be between 1 and 10');
  }
  if (detection < 1 || detection > 10) {
    throw new Error('Detection must be between 1 and 10');
  }

  // High priority conditions
  if (severity >= 9) {
    return 'High';
  }
  if (severity >= 5 && occurrence >= 4 && detection >= 6) {
    return 'High';
  }

  // Medium priority conditions
  if (severity >= 5 && (occurrence >= 4 || detection >= 6)) {
    return 'Medium';
  }
  if (severity < 5 && occurrence >= 4 && detection >= 6) {
    return 'Medium';
  }

  // Low priority
  return 'Low';
}

/**
 * Sort FMEA items by RPN in descending order (Pareto analysis).
 *
 * This enables focusing on the most critical failure modes first.
 *
 * @param items - Array of FMEA items
 * @returns Sorted array (highest RPN first)
 */
export function sortByRPN(items: FMEAItem[]): FMEAItem[] {
  // Calculate RPN for items that don't have it
  const itemsWithRPN = items.map((item) => ({
    ...item,
    rpn: item.rpn ?? calculateRPN(item.severity, item.occurrence, item.detection),
  }));

  // Sort by RPN descending
  return itemsWithRPN.sort((a, b) => (b.rpn ?? 0) - (a.rpn ?? 0));
}

// =============================================================================
// DAL Allocation (DO-178C)
// =============================================================================

/**
 * DAL probability objectives per DO-178C Table 3-1.
 */
const DAL_PROBABILITY_OBJECTIVES: Record<DAL, string> = {
  A: '<= 10^-9 (Catastrophic)',
  B: '<= 10^-7 (Hazardous)',
  C: '<= 10^-5 (Major)',
  D: '<= 10^-3 (Minor)',
  E: 'No objective (No Effect)',
};

/**
 * Determine Design Assurance Level from severity.
 *
 * Maps failure condition severity to required DAL per DO-178C Table 3-1:
 * - Catastrophic -> DAL A
 * - Hazardous -> DAL B
 * - Major -> DAL C
 * - Minor -> DAL D
 * - No Effect -> DAL E
 *
 * @param severity - Severity level of the failure condition
 * @returns Required Design Assurance Level
 */
export function severityToDAL(severity: SeverityLevel): DAL {
  switch (severity) {
    case 'Catastrophic':
      return 'A';
    case 'Hazardous':
      return 'B';
    case 'Major':
      return 'C';
    case 'Minor':
      return 'D';
    case 'NoEffect':
      return 'E';
  }
}

/**
 * DAL numeric value for comparison (A=5, B=4, C=3, D=2, E=1).
 */
function dalToNumeric(dal: DAL): number {
  const values: Record<DAL, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };
  return values[dal];
}

/**
 * Check if DAL decomposition is valid.
 *
 * DAL decomposition allows a high-integrity function to be implemented
 * by multiple lower-integrity redundant components. The decomposition
 * must ensure the combined probability objective is still met.
 *
 * Valid decomposition rules:
 * - DAL A can decompose to: B+B, C+C+C, or equivalent
 * - DAL B can decompose to: C+C, D+D+D, or equivalent
 * - DAL C can decompose to: D+D
 * - Independent development required for decomposed items
 *
 * @param parentDAL - DAL being decomposed
 * @param childDALs - Array of child DALs after decomposition
 * @returns Whether the decomposition is valid
 */
export function isValidDALDecomposition(
  parentDAL: DAL,
  childDALs: DAL[]
): boolean {
  if (childDALs.length < 2) {
    // Decomposition requires at least 2 children
    return false;
  }

  // Each child must be at most one level lower than parent
  const parentNumeric = dalToNumeric(parentDAL);
  for (const childDAL of childDALs) {
    const childNumeric = dalToNumeric(childDAL);
    if (childNumeric > parentNumeric) {
      // Child cannot have higher DAL than parent
      return false;
    }
    if (parentNumeric - childNumeric > 2) {
      // Child cannot be more than 2 levels lower
      return false;
    }
  }

  // Calculate combined probability contribution
  // Using the rare event approximation, combined probability ~ sum of individual
  // But for decomposition, we need the product (AND relationship)

  // Simplified rule: sum of child numeric values should meet minimum threshold
  // DAL A (5) requires children summing to at least 8 (e.g., B+B = 8, C+C+C = 9)
  // DAL B (4) requires children summing to at least 6 (e.g., C+C = 6, D+D+D = 6)
  // DAL C (3) requires children summing to at least 4 (e.g., D+D = 4)
  // DAL D (2) and E (1) typically don't decompose

  const childSum = childDALs.reduce((sum, dal) => sum + dalToNumeric(dal), 0);

  const requiredSum: Record<DAL, number> = {
    A: 8, // Two DAL B components (4+4=8) or three DAL C (3+3+3=9)
    B: 6, // Two DAL C components (3+3=6) or three DAL D (2+2+2=6)
    C: 4, // Two DAL D components (2+2=4)
    D: 2, // Typically not decomposed
    E: 0, // No requirements
  };

  return childSum >= requiredSum[parentDAL];
}

// =============================================================================
// Validation Functions
// =============================================================================

/**
 * Validate that a hazard has all required fields for certification.
 *
 * Checks completeness and consistency of hazard data per DO-178C and
 * ARP4761A requirements for safety assessment documentation.
 *
 * @param hazard - Hazard record to validate
 * @returns Validation result with list of errors
 */
export function validateHazardForCertification(
  hazard: Hazard
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!hazard.id || hazard.id.trim() === '') {
    errors.push('Hazard ID is required');
  }

  if (!hazard.title || hazard.title.trim() === '') {
    errors.push('Hazard title is required');
  }

  if (!hazard.description || hazard.description.trim() === '') {
    errors.push('Hazard description is required');
  }

  if (!hazard.severity) {
    errors.push('Severity classification is required');
  }

  if (!hazard.likelihood) {
    errors.push('Likelihood classification is required');
  }

  if (!hazard.status) {
    errors.push('Hazard status is required');
  }

  if (!hazard.owner || hazard.owner.trim() === '') {
    errors.push('Hazard owner is required');
  }

  // Conditional requirements
  if (hazard.status === 'Mitigated' && (!hazard.mitigations || hazard.mitigations.length === 0)) {
    errors.push('Mitigated hazards must have documented mitigations');
  }

  if (hazard.status === 'Mitigated' && !hazard.residualRisk) {
    warnings.push('Mitigated hazards should have residual risk documented');
  }

  // Severity-based requirements
  if (hazard.severity === 'Catastrophic' || hazard.severity === 'Hazardous') {
    if (!hazard.verificationMethod) {
      errors.push('High-severity hazards must have verification method specified');
    }

    if (!hazard.relatedRequirements || hazard.relatedRequirements.length === 0) {
      errors.push('High-severity hazards must be traced to requirements');
    }
  }

  // Traceability requirements
  if (hazard.status === 'Closed' && (!hazard.relatedEvidence || hazard.relatedEvidence.length === 0)) {
    errors.push('Closed hazards must have supporting evidence');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate traceability completeness between hazards, requirements, and evidence.
 *
 * Checks bidirectional traceability per DO-178C Section 5.5 and ensures
 * all safety requirements are adequately addressed.
 *
 * @param hazard - Hazard to validate traceability for
 * @param requirements - Available requirements
 * @param evidence - Available evidence
 * @returns Traceability validation result
 */
export function validateTraceability(
  hazard: Hazard,
  requirements: Requirement[],
  evidence: Evidence[]
): TraceabilityResult {
  const gaps: string[] = [];
  let tracedRequirements = 0;
  let tracedEvidence = 0;

  // Check hazard -> requirements traceability
  if (!hazard.relatedRequirements || hazard.relatedRequirements.length === 0) {
    gaps.push(`Hazard ${hazard.id} has no linked requirements`);
  } else {
    // Verify referenced requirements exist
    for (const reqId of hazard.relatedRequirements) {
      const req = requirements.find((r) => r.id === reqId);
      if (!req) {
        gaps.push(`Hazard ${hazard.id} references non-existent requirement ${reqId}`);
      } else {
        tracedRequirements++;

        // Check bidirectional trace
        if (!req.relatedHazards?.includes(hazard.id)) {
          gaps.push(
            `Requirement ${reqId} does not trace back to hazard ${hazard.id}`
          );
        }
      }
    }
  }

  // Check hazard -> evidence traceability
  if (!hazard.relatedEvidence || hazard.relatedEvidence.length === 0) {
    if (hazard.status === 'Mitigated' || hazard.status === 'Closed') {
      gaps.push(`Hazard ${hazard.id} has no linked evidence but is ${hazard.status}`);
    }
  } else {
    // Verify referenced evidence exists
    for (const evId of hazard.relatedEvidence) {
      const ev = evidence.find((e) => e.id === evId);
      if (!ev) {
        gaps.push(`Hazard ${hazard.id} references non-existent evidence ${evId}`);
      } else {
        tracedEvidence++;

        // Check bidirectional trace
        if (!ev.relatedHazards?.includes(hazard.id)) {
          gaps.push(`Evidence ${evId} does not trace back to hazard ${hazard.id}`);
        }
      }
    }
  }

  // Calculate coverage
  const expectedRequirements = hazard.relatedRequirements?.length ?? 0;
  const expectedEvidence = hazard.relatedEvidence?.length ?? 0;
  const total = expectedRequirements + expectedEvidence;
  const traced = tracedRequirements + tracedEvidence;
  const coverage = total > 0 ? (traced / total) * 100 : 0;

  return {
    complete: gaps.length === 0,
    gaps,
    coverage,
  };
}

/**
 * Validate fault tree structure for completeness and correctness.
 *
 * Checks:
 * - No cycles (tree is acyclic)
 * - All leaves are basic events or undeveloped events
 * - All intermediate nodes have gates defined
 * - All basic events have probabilities or failure rates
 * - Voting gates have valid thresholds
 *
 * @param root - Root node of the fault tree
 * @returns Validation result with list of errors
 */
export function validateFaultTree(root: FaultTreeNode): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const visitedIds = new Set<string>();

  function validate(node: FaultTreeNode, path: string[]): void {
    // Check for cycles
    if (path.includes(node.id)) {
      errors.push(`Cycle detected: ${path.join(' -> ')} -> ${node.id}`);
      return;
    }

    // Check for duplicate IDs
    if (visitedIds.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    }
    visitedIds.add(node.id);

    const newPath = [...path, node.id];

    // Check leaf nodes
    if (!node.children || node.children.length === 0) {
      if (node.type !== 'basic-event' && node.type !== 'undeveloped' && node.type !== 'house-event') {
        errors.push(
          `Node ${node.id} is a leaf but has type '${node.type}' (expected basic-event, undeveloped, or house-event)`
        );
      }

      // Check probability for basic events
      if (node.type === 'basic-event' || node.type === 'undeveloped') {
        if (node.probability === undefined && node.failureRate === undefined) {
          errors.push(
            `Basic event ${node.id} has no probability or failure rate defined`
          );
        }
        if (node.failureRate !== undefined && node.exposureTime === undefined) {
          warnings.push(
            `Basic event ${node.id} has failure rate but no exposure time`
          );
        }
      }
    } else {
      // Check intermediate nodes
      if (node.type === 'basic-event' || node.type === 'undeveloped') {
        errors.push(
          `Node ${node.id} has children but is marked as '${node.type}'`
        );
      }

      // Check gate definition
      if (!node.gate) {
        warnings.push(
          `Intermediate node ${node.id} has no gate defined (will default to OR)`
        );
      }

      // Check voting gate threshold
      if (node.gate === 'VOTING') {
        if (node.votingThreshold === undefined) {
          errors.push(`Voting gate ${node.id} has no voting threshold defined`);
        } else if (
          node.votingThreshold < 1 ||
          node.votingThreshold > node.children.length
        ) {
          errors.push(
            `Voting gate ${node.id} has invalid threshold ${node.votingThreshold} for ${node.children.length} children`
          );
        }
      }

      // Check NOT gate has single input
      if (node.gate === 'NOT' && node.children.length !== 1) {
        errors.push(
          `NOT gate ${node.id} must have exactly 1 child, has ${node.children.length}`
        );
      }

      // Check TRANSFER gate
      if (node.gate === 'TRANSFER' && !node.transferRef) {
        warnings.push(`TRANSFER gate ${node.id} has no transfer reference`);
      }

      // Recurse to children
      for (const child of node.children) {
        validate(child, newPath);
      }
    }
  }

  // Start validation from root
  if (root.type !== 'top-event') {
    warnings.push(`Root node should be type 'top-event', is '${root.type}'`);
  }

  validate(root, []);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// =============================================================================
// ID Generation Utilities
// =============================================================================

/**
 * Generate a unique ID with a given prefix.
 * Format: PREFIX-TIMESTAMP-RANDOM (e.g., HAZ-LM3KX8Q-ABCDE)
 *
 * @param prefix - Prefix for the ID (e.g., 'HAZ', 'FT', 'GSN', 'REQ', 'FMEA', 'EV')
 * @returns Unique identifier string
 */
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// =============================================================================
// Filtering Utilities
// =============================================================================

import type {
  TrackedHazard,
  FilterState,
  FaultTree,
  FaultTreeNode as FTNode,
  GSNNode,
  TrackedRequirement,
  TrackedFMEAItem,
  TrackedEvidence,
  Action,
} from '../types/safety';

/**
 * Filter hazards based on filter state criteria.
 *
 * @param hazards - Array of hazards to filter
 * @param filters - Filter criteria
 * @returns Filtered array of hazards
 */
export function filterHazards(
  hazards: TrackedHazard[],
  filters: FilterState
): TrackedHazard[] {
  return hazards.filter((hazard) => {
    // Filter by severity
    if (
      filters.hazardSeverity &&
      filters.hazardSeverity.length > 0 &&
      !filters.hazardSeverity.includes(hazard.severity)
    ) {
      return false;
    }

    // Filter by likelihood
    if (
      filters.hazardLikelihood &&
      filters.hazardLikelihood.length > 0 &&
      !filters.hazardLikelihood.includes(hazard.likelihood)
    ) {
      return false;
    }

    // Filter by status
    if (
      filters.hazardStatus &&
      filters.hazardStatus.length > 0 &&
      !filters.hazardStatus.includes(hazard.status)
    ) {
      return false;
    }

    // Filter by DAL
    if (
      filters.hazardDAL &&
      filters.hazardDAL.length > 0 &&
      !filters.hazardDAL.includes(hazard.dal)
    ) {
      return false;
    }

    // Filter by owner
    if (
      filters.hazardOwner &&
      hazard.owner.toLowerCase() !== filters.hazardOwner.toLowerCase()
    ) {
      return false;
    }

    // Filter by category
    if (
      filters.hazardCategory &&
      hazard.category?.toLowerCase() !== filters.hazardCategory.toLowerCase()
    ) {
      return false;
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchable = [
        hazard.id,
        hazard.title,
        hazard.description,
        hazard.owner,
        hazard.category || '',
        ...(hazard.tags || []),
      ]
        .join(' ')
        .toLowerCase();

      if (!searchable.includes(query)) {
        return false;
      }
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      if (!hazard.tags || !filters.tags.some((tag) => hazard.tags?.includes(tag))) {
        return false;
      }
    }

    // Filter by date range
    if (filters.dateRange) {
      const hazardDate = new Date(hazard.updatedAt);
      if (
        hazardDate < filters.dateRange.start ||
        hazardDate > filters.dateRange.end
      ) {
        return false;
      }
    }

    return true;
  });
}

// =============================================================================
// Serialization Utilities for Zustand Persistence
// =============================================================================

/**
 * State shape for serialization
 */
interface SerializableState {
  hazards: Array<[string, TrackedHazard]>;
  faultTrees: Array<[string, SerializedFaultTree]>;
  gsnNodes: Array<[string, GSNNode]>;
  requirements: Array<[string, TrackedRequirement]>;
  fmeaItems: Array<[string, TrackedFMEAItem]>;
  evidence: Array<[string, TrackedEvidence]>;
  selectedHazardId: string | null;
  selectedFaultTreeId: string | null;
  filters: FilterState;
  undoStack: Action[];
  redoStack: Action[];
}

interface SerializedFaultTree extends Omit<FaultTree, 'nodes'> {
  nodes: Array<[string, FTNode]>;
}

/**
 * Serialize state for localStorage persistence.
 * Converts Maps to arrays for JSON serialization.
 *
 * @param state - Current state with Maps
 * @returns Serializable state object
 */
export function serializeState(state: {
  hazards: Map<string, TrackedHazard>;
  faultTrees: Map<string, FaultTree>;
  gsnNodes: Map<string, GSNNode>;
  requirements: Map<string, TrackedRequirement>;
  fmeaItems: Map<string, TrackedFMEAItem>;
  evidence: Map<string, TrackedEvidence>;
  selectedHazardId: string | null;
  selectedFaultTreeId: string | null;
  filters: FilterState;
  undoStack: Action[];
  redoStack: Action[];
}): SerializableState {
  return {
    hazards: Array.from(state.hazards.entries()),
    faultTrees: Array.from(state.faultTrees.entries()).map(([id, tree]) => [
      id,
      {
        ...tree,
        nodes: Array.from(tree.nodes.entries()),
      },
    ]),
    gsnNodes: Array.from(state.gsnNodes.entries()),
    requirements: Array.from(state.requirements.entries()),
    fmeaItems: Array.from(state.fmeaItems.entries()),
    evidence: Array.from(state.evidence.entries()),
    selectedHazardId: state.selectedHazardId,
    selectedFaultTreeId: state.selectedFaultTreeId,
    filters: state.filters,
    undoStack: state.undoStack,
    redoStack: state.redoStack,
  };
}

/**
 * Deserialize state from localStorage.
 * Converts arrays back to Maps.
 *
 * @param serialized - Serialized state from localStorage
 * @returns State with Maps restored
 */
export function deserializeState(serialized: SerializableState): {
  hazards: Map<string, TrackedHazard>;
  faultTrees: Map<string, FaultTree>;
  gsnNodes: Map<string, GSNNode>;
  requirements: Map<string, TrackedRequirement>;
  fmeaItems: Map<string, TrackedFMEAItem>;
  evidence: Map<string, TrackedEvidence>;
  selectedHazardId: string | null;
  selectedFaultTreeId: string | null;
  filters: FilterState;
  undoStack: Action[];
  redoStack: Action[];
} {
  // Convert dates back from strings
  const parseDate = (dateStr: string | Date): Date => {
    return typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  };

  // Parse hazards with date conversion
  const hazards = new Map<string, TrackedHazard>(
    serialized.hazards.map(([id, hazard]) => [
      id,
      {
        ...hazard,
        createdAt: parseDate(hazard.createdAt),
        updatedAt: parseDate(hazard.updatedAt),
        changeHistory: hazard.changeHistory.map((entry) => ({
          ...entry,
          timestamp: parseDate(entry.timestamp),
        })),
      },
    ])
  );

  // Parse fault trees with nested nodes Map
  const faultTrees = new Map<string, FaultTree>(
    serialized.faultTrees.map(([id, tree]) => [
      id,
      {
        ...tree,
        nodes: new Map<string, FTNode>(tree.nodes),
        createdAt: parseDate(tree.createdAt),
        updatedAt: parseDate(tree.updatedAt),
      },
    ])
  );

  // Parse GSN nodes
  const gsnNodes = new Map<string, GSNNode>(
    serialized.gsnNodes.map(([id, node]) => [
      id,
      {
        ...node,
        createdAt: parseDate(node.createdAt),
        updatedAt: parseDate(node.updatedAt),
      },
    ])
  );

  // Parse requirements
  const requirements = new Map<string, TrackedRequirement>(
    serialized.requirements.map(([id, req]) => [
      id,
      {
        ...req,
        createdAt: parseDate(req.createdAt),
        updatedAt: parseDate(req.updatedAt),
        changeHistory: req.changeHistory.map((entry) => ({
          ...entry,
          timestamp: parseDate(entry.timestamp),
        })),
      },
    ])
  );

  // Parse FMEA items
  const fmeaItems = new Map<string, TrackedFMEAItem>(
    serialized.fmeaItems.map(([id, item]) => [
      id,
      {
        ...item,
        createdAt: parseDate(item.createdAt),
        updatedAt: parseDate(item.updatedAt),
      },
    ])
  );

  // Parse evidence
  const evidence = new Map<string, TrackedEvidence>(
    serialized.evidence.map(([id, ev]) => [
      id,
      {
        ...ev,
        createdAt: parseDate(ev.createdAt),
        updatedAt: parseDate(ev.updatedAt),
        validFrom: ev.validFrom ? parseDate(ev.validFrom) : undefined,
        validUntil: ev.validUntil ? parseDate(ev.validUntil) : undefined,
      },
    ])
  );

  // Parse undo/redo stacks
  const undoStack = serialized.undoStack.map((action) => ({
    ...action,
    timestamp: parseDate(action.timestamp),
  }));

  const redoStack = serialized.redoStack.map((action) => ({
    ...action,
    timestamp: parseDate(action.timestamp),
  }));

  // Parse date range in filters
  const filters: FilterState = {
    ...serialized.filters,
    dateRange: serialized.filters.dateRange
      ? {
          start: parseDate(serialized.filters.dateRange.start),
          end: parseDate(serialized.filters.dateRange.end),
        }
      : undefined,
  };

  return {
    hazards,
    faultTrees,
    gsnNodes,
    requirements,
    fmeaItems,
    evidence,
    selectedHazardId: serialized.selectedHazardId,
    selectedFaultTreeId: serialized.selectedFaultTreeId,
    filters,
    undoStack,
    redoStack,
  };
}
