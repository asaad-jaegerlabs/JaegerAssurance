/**
 * Safety Dashboard Context Exports
 *
 * Re-exports all public APIs from the safety context module.
 *
 * @module context
 */

// Provider and main hook
export {
  SafetyProvider,
  useSafety,
  useSafetyStore,
} from './SafetyContext';

// Custom hooks for specific data access
export {
  useFilteredHazards,
  useHazard,
  useFaultTree,
  useGSNNode,
  useRequirement,
  useFMEAItem,
  useEvidence,
  useTraceability,
  useHazardStats,
} from './SafetyContext';

// Type exports for consumers
export type {
  SafetyState,
  SafetyActions,
} from './SafetyContext';
