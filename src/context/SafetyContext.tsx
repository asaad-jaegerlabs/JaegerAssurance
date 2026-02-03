/**
 * Safety Dashboard State Management
 *
 * Zustand store with React Context wrapper for managing safety analysis data.
 * Supports hazards, fault trees, GSN nodes, requirements, FMEA items, and evidence
 * with full CRUD operations, undo/redo, filtering, and localStorage persistence.
 *
 * @module context/SafetyContext
 */

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type {
  TrackedHazard,
  FaultTree,
  FaultTreeNode,
  GSNNode,
  GSNNodeType,
  GSNNodeStatus,
  TrackedRequirement,
  TrackedFMEAItem,
  TrackedEvidence,
  FilterState,
  Action,
  ArtifactType,
  SeverityLevel,
  LikelihoodLevel,
  HazardStatus,
  DAL,
  RiskLevel,
  FaultTreeGateType,
  FaultTreeNodeType,
} from '../types/safety';

import {
  generateId,
  calculateRiskScore,
  calculateRPN,
  filterHazards,
  serializeState,
  deserializeState,
} from '../utils/safety';

// =============================================================================
// State Interface
// =============================================================================

/**
 * Core state shape for the safety dashboard
 */
export interface SafetyState {
  // Collections
  hazards: Map<string, TrackedHazard>;
  faultTrees: Map<string, FaultTree>;
  gsnNodes: Map<string, GSNNode>;
  requirements: Map<string, TrackedRequirement>;
  fmeaItems: Map<string, TrackedFMEAItem>;
  evidence: Map<string, TrackedEvidence>;

  // UI State
  selectedHazardId: string | null;
  selectedFaultTreeId: string | null;
  filters: FilterState;

  // Undo/Redo
  undoStack: Action[];
  redoStack: Action[];
}

// =============================================================================
// Actions Interface
// =============================================================================

/**
 * Actions available on the safety store
 */
export interface SafetyActions {
  // Hazards CRUD
  addHazard(
    hazard: Omit<
      TrackedHazard,
      'id' | 'createdAt' | 'updatedAt' | 'changeHistory' | 'version' | 'riskScore' | 'riskLevel'
    >
  ): string;
  updateHazard(id: string, updates: Partial<TrackedHazard>): void;
  deleteHazard(id: string): void;

  // Fault Trees CRUD
  addFaultTree(tree: Omit<FaultTree, 'id' | 'createdAt' | 'updatedAt' | 'version'>): string;
  updateFaultTree(id: string, updates: Partial<FaultTree>): void;
  deleteFaultTree(id: string): void;
  addFaultTreeNode(treeId: string, parentId: string | null, node: Omit<FaultTreeNode, 'id'>): string;
  updateFaultTreeNode(treeId: string, nodeId: string, updates: Partial<FaultTreeNode>): void;
  deleteFaultTreeNode(treeId: string, nodeId: string): void;

  // GSN CRUD
  addGSNNode(node: Omit<GSNNode, 'id' | 'createdAt' | 'updatedAt' | 'version'>): string;
  updateGSNNode(id: string, updates: Partial<GSNNode>): void;
  deleteGSNNode(id: string): void;

  // Requirements CRUD
  addRequirement(req: Omit<TrackedRequirement, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'changeHistory'>): string;
  updateRequirement(id: string, updates: Partial<TrackedRequirement>): void;
  deleteRequirement(id: string): void;

  // FMEA CRUD
  addFMEAItem(item: Omit<TrackedFMEAItem, 'id' | 'rpn' | 'createdAt' | 'updatedAt' | 'version'>): string;
  updateFMEAItem(id: string, updates: Partial<TrackedFMEAItem>): void;
  deleteFMEAItem(id: string): void;

  // Evidence CRUD
  addEvidence(evidence: Omit<TrackedEvidence, 'id' | 'createdAt' | 'updatedAt' | 'version'>): string;
  updateEvidence(id: string, updates: Partial<TrackedEvidence>): void;
  deleteEvidence(id: string): void;

  // Traceability
  linkArtifacts(sourceType: ArtifactType, sourceId: string, targetType: ArtifactType, targetId: string): void;
  unlinkArtifacts(sourceType: ArtifactType, sourceId: string, targetType: ArtifactType, targetId: string): void;

  // Filtering
  setFilters(filters: Partial<FilterState>): void;
  clearFilters(): void;

  // Selection
  selectHazard(id: string | null): void;
  selectFaultTree(id: string | null): void;

  // Undo/Redo
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;

  // Bulk operations
  importData(data: Partial<SafetyState>): void;
  exportData(): SafetyState;
  clearAll(): void;

  // Initialize with sample data
  loadSampleData(): void;
}

// =============================================================================
// Initial State
// =============================================================================

const initialState: SafetyState = {
  hazards: new Map(),
  faultTrees: new Map(),
  gsnNodes: new Map(),
  requirements: new Map(),
  fmeaItems: new Map(),
  evidence: new Map(),
  selectedHazardId: null,
  selectedFaultTreeId: null,
  filters: {},
  undoStack: [],
  redoStack: [],
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Map severity level to risk level based on likelihood
 */
function calculateRiskLevel(severity: SeverityLevel, likelihood: LikelihoodLevel): RiskLevel {
  const riskScore = calculateRiskScore(severity, likelihood);
  return riskScore.level;
}

/**
 * Get numeric risk score from severity and likelihood
 */
function getRiskScoreNumeric(severity: SeverityLevel, likelihood: LikelihoodLevel): number {
  const riskScore = calculateRiskScore(severity, likelihood);
  return riskScore.score;
}

/**
 * Maximum undo/redo stack size
 */
const MAX_UNDO_STACK_SIZE = 50;

// =============================================================================
// Zustand Store
// =============================================================================

/**
 * Create the Zustand store with persistence
 */
export const useSafetyStore = create<SafetyState & SafetyActions>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,

      // =====================================================================
      // Hazards CRUD
      // =====================================================================

      addHazard: (hazard) => {
        const id = generateId('HAZ');
        const now = new Date();
        const riskScore = getRiskScoreNumeric(hazard.severity, hazard.likelihood);
        const riskLevel = calculateRiskLevel(hazard.severity, hazard.likelihood);

        const newHazard: TrackedHazard = {
          ...hazard,
          id,
          version: 1,
          riskScore,
          riskLevel,
          createdAt: now,
          updatedAt: now,
          changeHistory: [],
          linkedRequirements: hazard.linkedRequirements || [],
          linkedFaultTrees: hazard.linkedFaultTrees || [],
          linkedGSNNodes: hazard.linkedGSNNodes || [],
          linkedFMEAItems: hazard.linkedFMEAItems || [],
          linkedEvidence: hazard.linkedEvidence || [],
        };

        set((state) => {
          const newHazards = new Map(state.hazards);
          newHazards.set(id, newHazard);

          const action: Action = {
            type: 'ADD_HAZARD',
            payload: newHazard,
            timestamp: now,
          };

          return {
            hazards: newHazards,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });

        return id;
      },

      updateHazard: (id, updates) => {
        const state = get();
        const existingHazard = state.hazards.get(id);

        if (!existingHazard) {
          throw new Error(`Hazard with id ${id} not found`);
        }

        const now = new Date();

        // Recalculate risk if severity or likelihood changed
        const severity = updates.severity ?? existingHazard.severity;
        const likelihood = updates.likelihood ?? existingHazard.likelihood;
        const riskScore = getRiskScoreNumeric(severity, likelihood);
        const riskLevel = calculateRiskLevel(severity, likelihood);

        // Build change history entries
        const changeHistoryEntries = Object.entries(updates)
          .filter(([key]) => key !== 'changeHistory' && key !== 'version' && key !== 'updatedAt')
          .map(([field, newValue]) => ({
            timestamp: now,
            field,
            oldValue: existingHazard[field as keyof TrackedHazard],
            newValue,
            changedBy: 'user',
          }));

        const updatedHazard: TrackedHazard = {
          ...existingHazard,
          ...updates,
          riskScore,
          riskLevel,
          version: existingHazard.version + 1,
          updatedAt: now,
          changeHistory: [...existingHazard.changeHistory, ...changeHistoryEntries],
        };

        set((state) => {
          const newHazards = new Map(state.hazards);
          newHazards.set(id, updatedHazard);

          const action: Action = {
            type: 'UPDATE_HAZARD',
            payload: { id, updates, previousState: existingHazard },
            timestamp: now,
          };

          return {
            hazards: newHazards,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      deleteHazard: (id) => {
        const state = get();
        const existingHazard = state.hazards.get(id);

        if (!existingHazard) {
          throw new Error(`Hazard with id ${id} not found`);
        }

        set((state) => {
          const newHazards = new Map(state.hazards);
          newHazards.delete(id);

          const action: Action = {
            type: 'DELETE_HAZARD',
            payload: existingHazard,
            timestamp: new Date(),
          };

          return {
            hazards: newHazards,
            selectedHazardId: state.selectedHazardId === id ? null : state.selectedHazardId,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      // =====================================================================
      // Fault Trees CRUD
      // =====================================================================

      addFaultTree: (tree) => {
        const id = generateId('FT');
        const now = new Date();

        const newTree: FaultTree = {
          ...tree,
          id,
          version: 1,
          createdAt: now,
          updatedAt: now,
          nodes: new Map(tree.nodes),
          linkedHazards: tree.linkedHazards || [],
          linkedRequirements: tree.linkedRequirements || [],
        };

        set((state) => {
          const newFaultTrees = new Map(state.faultTrees);
          newFaultTrees.set(id, newTree);

          const action: Action = {
            type: 'ADD_FAULT_TREE',
            payload: newTree,
            timestamp: now,
          };

          return {
            faultTrees: newFaultTrees,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });

        return id;
      },

      updateFaultTree: (id, updates) => {
        const state = get();
        const existingTree = state.faultTrees.get(id);

        if (!existingTree) {
          throw new Error(`Fault tree with id ${id} not found`);
        }

        const now = new Date();

        const updatedTree: FaultTree = {
          ...existingTree,
          ...updates,
          version: existingTree.version + 1,
          updatedAt: now,
        };

        set((state) => {
          const newFaultTrees = new Map(state.faultTrees);
          newFaultTrees.set(id, updatedTree);

          const action: Action = {
            type: 'UPDATE_FAULT_TREE',
            payload: { id, updates, previousState: existingTree },
            timestamp: now,
          };

          return {
            faultTrees: newFaultTrees,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      deleteFaultTree: (id) => {
        const state = get();
        const existingTree = state.faultTrees.get(id);

        if (!existingTree) {
          throw new Error(`Fault tree with id ${id} not found`);
        }

        set((state) => {
          const newFaultTrees = new Map(state.faultTrees);
          newFaultTrees.delete(id);

          const action: Action = {
            type: 'DELETE_FAULT_TREE',
            payload: existingTree,
            timestamp: new Date(),
          };

          return {
            faultTrees: newFaultTrees,
            selectedFaultTreeId: state.selectedFaultTreeId === id ? null : state.selectedFaultTreeId,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      addFaultTreeNode: (treeId, parentId, node) => {
        const state = get();
        const tree = state.faultTrees.get(treeId);

        if (!tree) {
          throw new Error(`Fault tree with id ${treeId} not found`);
        }

        const nodeId = generateId('FTN');
        const now = new Date();

        const newNode: FaultTreeNode = {
          ...node,
          id: nodeId,
          children: node.children || [],
        };

        const newNodes = new Map(tree.nodes);
        newNodes.set(nodeId, newNode);

        // Add to parent's children if parent specified
        if (parentId) {
          const parentNode = newNodes.get(parentId);
          if (parentNode) {
            newNodes.set(parentId, {
              ...parentNode,
              children: [...(parentNode.children || []), nodeId],
            });
          }
        }

        const updatedTree: FaultTree = {
          ...tree,
          nodes: newNodes,
          rootNodeId: parentId === null ? nodeId : tree.rootNodeId,
          version: tree.version + 1,
          updatedAt: now,
        };

        set((state) => {
          const newFaultTrees = new Map(state.faultTrees);
          newFaultTrees.set(treeId, updatedTree);

          const action: Action = {
            type: 'ADD_FAULT_TREE_NODE',
            payload: { treeId, parentId, node: newNode },
            timestamp: now,
          };

          return {
            faultTrees: newFaultTrees,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });

        return nodeId;
      },

      updateFaultTreeNode: (treeId, nodeId, updates) => {
        const state = get();
        const tree = state.faultTrees.get(treeId);

        if (!tree) {
          throw new Error(`Fault tree with id ${treeId} not found`);
        }

        const existingNode = tree.nodes.get(nodeId);
        if (!existingNode) {
          throw new Error(`Node with id ${nodeId} not found in tree ${treeId}`);
        }

        const now = new Date();

        const updatedNode: FaultTreeNode = {
          ...existingNode,
          ...updates,
        };

        const newNodes = new Map(tree.nodes);
        newNodes.set(nodeId, updatedNode);

        const updatedTree: FaultTree = {
          ...tree,
          nodes: newNodes,
          version: tree.version + 1,
          updatedAt: now,
        };

        set((state) => {
          const newFaultTrees = new Map(state.faultTrees);
          newFaultTrees.set(treeId, updatedTree);

          const action: Action = {
            type: 'UPDATE_FAULT_TREE_NODE',
            payload: { treeId, nodeId, updates, previousState: existingNode },
            timestamp: now,
          };

          return {
            faultTrees: newFaultTrees,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      deleteFaultTreeNode: (treeId, nodeId) => {
        const state = get();
        const tree = state.faultTrees.get(treeId);

        if (!tree) {
          throw new Error(`Fault tree with id ${treeId} not found`);
        }

        const existingNode = tree.nodes.get(nodeId);
        if (!existingNode) {
          throw new Error(`Node with id ${nodeId} not found in tree ${treeId}`);
        }

        const now = new Date();
        const newNodes = new Map(tree.nodes);

        // Remove from all parents' children arrays
        for (const [id, node] of newNodes) {
          if (node.children?.includes(nodeId)) {
            newNodes.set(id, {
              ...node,
              children: node.children.filter((childId) => childId !== nodeId),
            });
          }
        }

        // Remove the node itself
        newNodes.delete(nodeId);

        const updatedTree: FaultTree = {
          ...tree,
          nodes: newNodes,
          version: tree.version + 1,
          updatedAt: now,
        };

        set((state) => {
          const newFaultTrees = new Map(state.faultTrees);
          newFaultTrees.set(treeId, updatedTree);

          const action: Action = {
            type: 'DELETE_FAULT_TREE_NODE',
            payload: { treeId, node: existingNode },
            timestamp: now,
          };

          return {
            faultTrees: newFaultTrees,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      // =====================================================================
      // GSN CRUD
      // =====================================================================

      addGSNNode: (node) => {
        const id = generateId('GSN');
        const now = new Date();

        const newNode: GSNNode = {
          ...node,
          id,
          version: 1,
          createdAt: now,
          updatedAt: now,
          supportedBy: node.supportedBy || [],
          inContextOf: node.inContextOf || [],
          linkedHazards: node.linkedHazards || [],
          linkedRequirements: node.linkedRequirements || [],
          linkedEvidence: node.linkedEvidence || [],
        };

        set((state) => {
          const newGSNNodes = new Map(state.gsnNodes);
          newGSNNodes.set(id, newNode);

          const action: Action = {
            type: 'ADD_GSN_NODE',
            payload: newNode,
            timestamp: now,
          };

          return {
            gsnNodes: newGSNNodes,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });

        return id;
      },

      updateGSNNode: (id, updates) => {
        const state = get();
        const existingNode = state.gsnNodes.get(id);

        if (!existingNode) {
          throw new Error(`GSN node with id ${id} not found`);
        }

        const now = new Date();

        const updatedNode: GSNNode = {
          ...existingNode,
          ...updates,
          version: existingNode.version + 1,
          updatedAt: now,
        };

        set((state) => {
          const newGSNNodes = new Map(state.gsnNodes);
          newGSNNodes.set(id, updatedNode);

          const action: Action = {
            type: 'UPDATE_GSN_NODE',
            payload: { id, updates, previousState: existingNode },
            timestamp: now,
          };

          return {
            gsnNodes: newGSNNodes,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      deleteGSNNode: (id) => {
        const state = get();
        const existingNode = state.gsnNodes.get(id);

        if (!existingNode) {
          throw new Error(`GSN node with id ${id} not found`);
        }

        set((state) => {
          const newGSNNodes = new Map(state.gsnNodes);
          newGSNNodes.delete(id);

          // Remove from other nodes' supportedBy and inContextOf arrays
          for (const [nodeId, node] of newGSNNodes) {
            const needsUpdate =
              node.supportedBy.includes(id) || node.inContextOf.includes(id);
            if (needsUpdate) {
              newGSNNodes.set(nodeId, {
                ...node,
                supportedBy: node.supportedBy.filter((refId) => refId !== id),
                inContextOf: node.inContextOf.filter((refId) => refId !== id),
              });
            }
          }

          const action: Action = {
            type: 'DELETE_GSN_NODE',
            payload: existingNode,
            timestamp: new Date(),
          };

          return {
            gsnNodes: newGSNNodes,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      // =====================================================================
      // Requirements CRUD
      // =====================================================================

      addRequirement: (req) => {
        const id = generateId('REQ');
        const now = new Date();

        const newReq: TrackedRequirement = {
          ...req,
          id,
          version: 1,
          createdAt: now,
          updatedAt: now,
          changeHistory: [],
          childIds: req.childIds || [],
          linkedGSNNodes: req.linkedGSNNodes || [],
          linkedEvidence: req.linkedEvidence || [],
        };

        set((state) => {
          const newRequirements = new Map(state.requirements);
          newRequirements.set(id, newReq);

          // Update parent if specified
          if (req.parentId) {
            const parent = newRequirements.get(req.parentId);
            if (parent) {
              newRequirements.set(req.parentId, {
                ...parent,
                childIds: [...parent.childIds, id],
              });
            }
          }

          const action: Action = {
            type: 'ADD_REQUIREMENT',
            payload: newReq,
            timestamp: now,
          };

          return {
            requirements: newRequirements,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });

        return id;
      },

      updateRequirement: (id, updates) => {
        const state = get();
        const existingReq = state.requirements.get(id);

        if (!existingReq) {
          throw new Error(`Requirement with id ${id} not found`);
        }

        const now = new Date();

        const changeHistoryEntries = Object.entries(updates)
          .filter(([key]) => key !== 'changeHistory' && key !== 'version' && key !== 'updatedAt')
          .map(([field, newValue]) => ({
            timestamp: now,
            field,
            oldValue: existingReq[field as keyof TrackedRequirement],
            newValue,
            changedBy: 'user',
          }));

        const updatedReq: TrackedRequirement = {
          ...existingReq,
          ...updates,
          version: existingReq.version + 1,
          updatedAt: now,
          changeHistory: [...existingReq.changeHistory, ...changeHistoryEntries],
        };

        set((state) => {
          const newRequirements = new Map(state.requirements);
          newRequirements.set(id, updatedReq);

          const action: Action = {
            type: 'UPDATE_REQUIREMENT',
            payload: { id, updates, previousState: existingReq },
            timestamp: now,
          };

          return {
            requirements: newRequirements,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      deleteRequirement: (id) => {
        const state = get();
        const existingReq = state.requirements.get(id);

        if (!existingReq) {
          throw new Error(`Requirement with id ${id} not found`);
        }

        set((state) => {
          const newRequirements = new Map(state.requirements);
          newRequirements.delete(id);

          // Remove from parent's childIds
          if (existingReq.parentId) {
            const parent = newRequirements.get(existingReq.parentId);
            if (parent) {
              newRequirements.set(existingReq.parentId, {
                ...parent,
                childIds: parent.childIds.filter((childId) => childId !== id),
              });
            }
          }

          // Update children to remove parent reference
          for (const childId of existingReq.childIds) {
            const child = newRequirements.get(childId);
            if (child) {
              newRequirements.set(childId, {
                ...child,
                parentId: undefined,
              });
            }
          }

          const action: Action = {
            type: 'DELETE_REQUIREMENT',
            payload: existingReq,
            timestamp: new Date(),
          };

          return {
            requirements: newRequirements,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      // =====================================================================
      // FMEA CRUD
      // =====================================================================

      addFMEAItem: (item) => {
        const id = generateId('FMEA');
        const now = new Date();
        const rpn = calculateRPN(item.severity, item.occurrence, item.detection);

        const newItem: TrackedFMEAItem = {
          ...item,
          id,
          rpn,
          version: 1,
          createdAt: now,
          updatedAt: now,
          linkedHazards: item.linkedHazards || [],
          linkedRequirements: item.linkedRequirements || [],
        };

        set((state) => {
          const newFMEAItems = new Map(state.fmeaItems);
          newFMEAItems.set(id, newItem);

          const action: Action = {
            type: 'ADD_FMEA_ITEM',
            payload: newItem,
            timestamp: now,
          };

          return {
            fmeaItems: newFMEAItems,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });

        return id;
      },

      updateFMEAItem: (id, updates) => {
        const state = get();
        const existingItem = state.fmeaItems.get(id);

        if (!existingItem) {
          throw new Error(`FMEA item with id ${id} not found`);
        }

        const now = new Date();

        // Recalculate RPN if severity, occurrence, or detection changed
        const severity = updates.severity ?? existingItem.severity;
        const occurrence = updates.occurrence ?? existingItem.occurrence;
        const detection = updates.detection ?? existingItem.detection;
        const rpn = calculateRPN(severity, occurrence, detection);

        const updatedItem: TrackedFMEAItem = {
          ...existingItem,
          ...updates,
          rpn,
          version: existingItem.version + 1,
          updatedAt: now,
        };

        set((state) => {
          const newFMEAItems = new Map(state.fmeaItems);
          newFMEAItems.set(id, updatedItem);

          const action: Action = {
            type: 'UPDATE_FMEA_ITEM',
            payload: { id, updates, previousState: existingItem },
            timestamp: now,
          };

          return {
            fmeaItems: newFMEAItems,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      deleteFMEAItem: (id) => {
        const state = get();
        const existingItem = state.fmeaItems.get(id);

        if (!existingItem) {
          throw new Error(`FMEA item with id ${id} not found`);
        }

        set((state) => {
          const newFMEAItems = new Map(state.fmeaItems);
          newFMEAItems.delete(id);

          const action: Action = {
            type: 'DELETE_FMEA_ITEM',
            payload: existingItem,
            timestamp: new Date(),
          };

          return {
            fmeaItems: newFMEAItems,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      // =====================================================================
      // Evidence CRUD
      // =====================================================================

      addEvidence: (ev) => {
        const id = generateId('EV');
        const now = new Date();

        const newEvidence: TrackedEvidence = {
          ...ev,
          id,
          version: 1,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => {
          const newEvidenceMap = new Map(state.evidence);
          newEvidenceMap.set(id, newEvidence);

          const action: Action = {
            type: 'ADD_EVIDENCE',
            payload: newEvidence,
            timestamp: now,
          };

          return {
            evidence: newEvidenceMap,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });

        return id;
      },

      updateEvidence: (id, updates) => {
        const state = get();
        const existingEvidence = state.evidence.get(id);

        if (!existingEvidence) {
          throw new Error(`Evidence with id ${id} not found`);
        }

        const now = new Date();

        const updatedEvidence: TrackedEvidence = {
          ...existingEvidence,
          ...updates,
          version: existingEvidence.version + 1,
          updatedAt: now,
        };

        set((state) => {
          const newEvidenceMap = new Map(state.evidence);
          newEvidenceMap.set(id, updatedEvidence);

          const action: Action = {
            type: 'UPDATE_EVIDENCE',
            payload: { id, updates, previousState: existingEvidence },
            timestamp: now,
          };

          return {
            evidence: newEvidenceMap,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      deleteEvidence: (id) => {
        const state = get();
        const existingEvidence = state.evidence.get(id);

        if (!existingEvidence) {
          throw new Error(`Evidence with id ${id} not found`);
        }

        set((state) => {
          const newEvidenceMap = new Map(state.evidence);
          newEvidenceMap.delete(id);

          const action: Action = {
            type: 'DELETE_EVIDENCE',
            payload: existingEvidence,
            timestamp: new Date(),
          };

          return {
            evidence: newEvidenceMap,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      // =====================================================================
      // Traceability
      // =====================================================================

      linkArtifacts: (sourceType, sourceId, targetType, targetId) => {
        set((state) => {
          const newState = { ...state };

          // Helper to get the link array field name
          const getLinkField = (type: ArtifactType): string => {
            switch (type) {
              case 'hazard':
                return 'linkedHazards';
              case 'fault-tree':
                return 'linkedFaultTrees';
              case 'gsn-node':
                return 'linkedGSNNodes';
              case 'requirement':
                return 'linkedRequirements';
              case 'fmea':
                return 'linkedFMEAItems';
              case 'evidence':
                return 'linkedEvidence';
            }
          };

          // Helper to get the collection
          const getCollection = (type: ArtifactType) => {
            switch (type) {
              case 'hazard':
                return newState.hazards;
              case 'fault-tree':
                return newState.faultTrees;
              case 'gsn-node':
                return newState.gsnNodes;
              case 'requirement':
                return newState.requirements;
              case 'fmea':
                return newState.fmeaItems;
              case 'evidence':
                return newState.evidence;
            }
          };

          // Update source to include target
          const sourceCollection = getCollection(sourceType);
          const sourceItem = sourceCollection.get(sourceId);
          if (sourceItem) {
            const linkField = getLinkField(targetType);
            const existingLinks = (sourceItem as Record<string, unknown>)[linkField] as string[] || [];
            if (!existingLinks.includes(targetId)) {
              const newSourceItem = {
                ...sourceItem,
                [linkField]: [...existingLinks, targetId],
              };
              (sourceCollection as Map<string, unknown>).set(sourceId, newSourceItem);
            }
          }

          // Update target to include source (bidirectional)
          const targetCollection = getCollection(targetType);
          const targetItem = targetCollection.get(targetId);
          if (targetItem) {
            const linkField = getLinkField(sourceType);
            const existingLinks = (targetItem as Record<string, unknown>)[linkField] as string[] || [];
            if (!existingLinks.includes(sourceId)) {
              const newTargetItem = {
                ...targetItem,
                [linkField]: [...existingLinks, sourceId],
              };
              (targetCollection as Map<string, unknown>).set(targetId, newTargetItem);
            }
          }

          const action: Action = {
            type: 'LINK_ARTIFACTS',
            payload: { sourceType, sourceId, targetType, targetId },
            timestamp: new Date(),
          };

          return {
            ...newState,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      unlinkArtifacts: (sourceType, sourceId, targetType, targetId) => {
        set((state) => {
          const newState = { ...state };

          const getLinkField = (type: ArtifactType): string => {
            switch (type) {
              case 'hazard':
                return 'linkedHazards';
              case 'fault-tree':
                return 'linkedFaultTrees';
              case 'gsn-node':
                return 'linkedGSNNodes';
              case 'requirement':
                return 'linkedRequirements';
              case 'fmea':
                return 'linkedFMEAItems';
              case 'evidence':
                return 'linkedEvidence';
            }
          };

          const getCollection = (type: ArtifactType) => {
            switch (type) {
              case 'hazard':
                return newState.hazards;
              case 'fault-tree':
                return newState.faultTrees;
              case 'gsn-node':
                return newState.gsnNodes;
              case 'requirement':
                return newState.requirements;
              case 'fmea':
                return newState.fmeaItems;
              case 'evidence':
                return newState.evidence;
            }
          };

          // Remove target from source
          const sourceCollection = getCollection(sourceType);
          const sourceItem = sourceCollection.get(sourceId);
          if (sourceItem) {
            const linkField = getLinkField(targetType);
            const existingLinks = (sourceItem as Record<string, unknown>)[linkField] as string[] || [];
            const newSourceItem = {
              ...sourceItem,
              [linkField]: existingLinks.filter((id) => id !== targetId),
            };
            (sourceCollection as Map<string, unknown>).set(sourceId, newSourceItem);
          }

          // Remove source from target (bidirectional)
          const targetCollection = getCollection(targetType);
          const targetItem = targetCollection.get(targetId);
          if (targetItem) {
            const linkField = getLinkField(sourceType);
            const existingLinks = (targetItem as Record<string, unknown>)[linkField] as string[] || [];
            const newTargetItem = {
              ...targetItem,
              [linkField]: existingLinks.filter((id) => id !== sourceId),
            };
            (targetCollection as Map<string, unknown>).set(targetId, newTargetItem);
          }

          const action: Action = {
            type: 'UNLINK_ARTIFACTS',
            payload: { sourceType, sourceId, targetType, targetId },
            timestamp: new Date(),
          };

          return {
            ...newState,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      // =====================================================================
      // Filtering
      // =====================================================================

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      clearFilters: () => {
        set({ filters: {} });
      },

      // =====================================================================
      // Selection
      // =====================================================================

      selectHazard: (id) => {
        set({ selectedHazardId: id });
      },

      selectFaultTree: (id) => {
        set({ selectedFaultTreeId: id });
      },

      // =====================================================================
      // Undo/Redo
      // =====================================================================

      undo: () => {
        const state = get();
        if (state.undoStack.length === 0) return;

        const lastAction = state.undoStack[state.undoStack.length - 1];

        // Implement undo logic based on action type
        set((state) => {
          const newUndoStack = state.undoStack.slice(0, -1);
          const newRedoStack = [...state.redoStack, lastAction];

          // Reverse the action
          switch (lastAction.type) {
            case 'ADD_HAZARD': {
              const hazard = lastAction.payload as TrackedHazard;
              const newHazards = new Map(state.hazards);
              newHazards.delete(hazard.id);
              return { undoStack: newUndoStack, redoStack: newRedoStack, hazards: newHazards };
            }
            case 'DELETE_HAZARD': {
              const hazard = lastAction.payload as TrackedHazard;
              const newHazards = new Map(state.hazards);
              newHazards.set(hazard.id, hazard);
              return { undoStack: newUndoStack, redoStack: newRedoStack, hazards: newHazards };
            }
            case 'UPDATE_HAZARD': {
              const { id, previousState } = lastAction.payload as {
                id: string;
                previousState: TrackedHazard;
              };
              const newHazards = new Map(state.hazards);
              newHazards.set(id, previousState);
              return { undoStack: newUndoStack, redoStack: newRedoStack, hazards: newHazards };
            }
            // Add similar cases for other action types...
            default:
              return { undoStack: newUndoStack, redoStack: newRedoStack };
          }
        });
      },

      redo: () => {
        const state = get();
        if (state.redoStack.length === 0) return;

        const lastAction = state.redoStack[state.redoStack.length - 1];

        set((state) => {
          const newRedoStack = state.redoStack.slice(0, -1);
          const newUndoStack = [...state.undoStack, lastAction];

          // Re-apply the action
          switch (lastAction.type) {
            case 'ADD_HAZARD': {
              const hazard = lastAction.payload as TrackedHazard;
              const newHazards = new Map(state.hazards);
              newHazards.set(hazard.id, hazard);
              return { undoStack: newUndoStack, redoStack: newRedoStack, hazards: newHazards };
            }
            case 'DELETE_HAZARD': {
              const hazard = lastAction.payload as TrackedHazard;
              const newHazards = new Map(state.hazards);
              newHazards.delete(hazard.id);
              return { undoStack: newUndoStack, redoStack: newRedoStack, hazards: newHazards };
            }
            case 'UPDATE_HAZARD': {
              const { id, updates, previousState } = lastAction.payload as {
                id: string;
                updates: Partial<TrackedHazard>;
                previousState: TrackedHazard;
              };
              const newHazards = new Map(state.hazards);
              const current = newHazards.get(id);
              if (current) {
                newHazards.set(id, { ...current, ...updates });
              }
              return { undoStack: newUndoStack, redoStack: newRedoStack, hazards: newHazards };
            }
            default:
              return { undoStack: newUndoStack, redoStack: newRedoStack };
          }
        });
      },

      canUndo: () => get().undoStack.length > 0,

      canRedo: () => get().redoStack.length > 0,

      // =====================================================================
      // Bulk Operations
      // =====================================================================

      importData: (data) => {
        set((state) => {
          const action: Action = {
            type: 'IMPORT_DATA',
            payload: data,
            timestamp: new Date(),
          };

          return {
            ...state,
            ...data,
            undoStack: [...state.undoStack.slice(-MAX_UNDO_STACK_SIZE + 1), action],
            redoStack: [],
          };
        });
      },

      exportData: () => {
        const state = get();
        return {
          hazards: state.hazards,
          faultTrees: state.faultTrees,
          gsnNodes: state.gsnNodes,
          requirements: state.requirements,
          fmeaItems: state.fmeaItems,
          evidence: state.evidence,
          selectedHazardId: state.selectedHazardId,
          selectedFaultTreeId: state.selectedFaultTreeId,
          filters: state.filters,
          undoStack: state.undoStack,
          redoStack: state.redoStack,
        };
      },

      clearAll: () => {
        set((state) => {
          const action: Action = {
            type: 'CLEAR_ALL',
            payload: state,
            timestamp: new Date(),
          };

          return {
            ...initialState,
            undoStack: [action],
            redoStack: [],
          };
        });
      },

      // =====================================================================
      // Sample Data
      // =====================================================================

      loadSampleData: () => {
        const now = new Date();

        // Sample hazards
        const sampleHazards: TrackedHazard[] = [
          {
            id: 'HAZ-001',
            title: 'Electrical System Failure',
            description: 'Primary electrical system may fail under high load conditions',
            severity: 'Catastrophic',
            likelihood: 'Remote',
            status: 'Mitigated',
            dal: 'A',
            riskScore: 28,
            riskLevel: 'Unacceptable',
            owner: 'Electrical Team',
            version: 1,
            createdAt: now,
            updatedAt: now,
            changeHistory: [],
            linkedRequirements: [],
            linkedFaultTrees: [],
            linkedGSNNodes: [],
            linkedFMEAItems: [],
            linkedEvidence: [],
            mitigations: ['Redundant power supply', 'Automatic failover'],
          },
          {
            id: 'HAZ-002',
            title: 'Software Watchdog Timeout',
            description: 'Critical software process may exceed maximum response time',
            severity: 'Hazardous',
            likelihood: 'Remote',
            status: 'Monitoring',
            dal: 'B',
            riskScore: 24,
            riskLevel: 'Unacceptable',
            owner: 'Software Team',
            version: 1,
            createdAt: now,
            updatedAt: now,
            changeHistory: [],
            linkedRequirements: [],
            linkedFaultTrees: [],
            linkedGSNNodes: [],
            linkedFMEAItems: [],
            linkedEvidence: [],
          },
          {
            id: 'HAZ-003',
            title: 'Mechanical Wear',
            description: 'Moving parts subject to excessive wear during extended operations',
            severity: 'Major',
            likelihood: 'Probable',
            status: 'Open',
            dal: 'C',
            riskScore: 22,
            riskLevel: 'Unacceptable',
            owner: 'Maintenance Team',
            version: 1,
            createdAt: now,
            updatedAt: now,
            changeHistory: [],
            linkedRequirements: [],
            linkedFaultTrees: [],
            linkedGSNNodes: [],
            linkedFMEAItems: [],
            linkedEvidence: [],
          },
          {
            id: 'HAZ-004',
            title: 'Communication Loss',
            description: 'Loss of communication between primary and backup systems',
            severity: 'Hazardous',
            likelihood: 'ExtremelyRemote',
            status: 'Mitigated',
            dal: 'B',
            riskScore: 19,
            riskLevel: 'Undesirable',
            owner: 'Systems Team',
            version: 1,
            createdAt: now,
            updatedAt: now,
            changeHistory: [],
            linkedRequirements: [],
            linkedFaultTrees: [],
            linkedGSNNodes: [],
            linkedFMEAItems: [],
            linkedEvidence: [],
          },
          {
            id: 'HAZ-005',
            title: 'Environmental Exposure',
            description: 'Equipment exposure to extreme temperature conditions',
            severity: 'Major',
            likelihood: 'Remote',
            status: 'Monitoring',
            dal: 'C',
            riskScore: 18,
            riskLevel: 'Undesirable',
            owner: 'Environmental Team',
            version: 1,
            createdAt: now,
            updatedAt: now,
            changeHistory: [],
            linkedRequirements: [],
            linkedFaultTrees: [],
            linkedGSNNodes: [],
            linkedFMEAItems: [],
            linkedEvidence: [],
          },
        ];

        const hazardMap = new Map<string, TrackedHazard>();
        sampleHazards.forEach((h) => hazardMap.set(h.id, h));

        set({
          hazards: hazardMap,
          faultTrees: new Map(),
          gsnNodes: new Map(),
          requirements: new Map(),
          fmeaItems: new Map(),
          evidence: new Map(),
          selectedHazardId: null,
          selectedFaultTreeId: null,
          filters: {},
          undoStack: [],
          redoStack: [],
        });
      },
    }),
    {
      name: 'safety-dashboard-storage',
      storage: createJSONStorage(() => localStorage),
      serialize: (state) => JSON.stringify(serializeState(state.state)),
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          state: deserializeState(parsed),
          version: 0,
        };
      },
      partialize: (state) => ({
        hazards: state.hazards,
        faultTrees: state.faultTrees,
        gsnNodes: state.gsnNodes,
        requirements: state.requirements,
        fmeaItems: state.fmeaItems,
        evidence: state.evidence,
        selectedHazardId: state.selectedHazardId,
        selectedFaultTreeId: state.selectedFaultTreeId,
        filters: state.filters,
        undoStack: state.undoStack,
        redoStack: state.redoStack,
      }),
    }
  )
);

// =============================================================================
// React Context
// =============================================================================

type SafetyStoreType = typeof useSafetyStore;

const SafetyContext = createContext<SafetyStoreType | null>(null);

/**
 * Provider component for the Safety context.
 * Wraps the application to provide access to the safety store.
 */
export const SafetyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SafetyContext.Provider value={useSafetyStore}>
      {children}
    </SafetyContext.Provider>
  );
};

/**
 * Hook to access the safety store.
 * Must be used within a SafetyProvider.
 *
 * @returns The safety store with state and actions
 * @throws Error if used outside SafetyProvider
 */
export const useSafety = (): SafetyState & SafetyActions => {
  const store = useContext(SafetyContext);
  if (!store) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return store();
};

// =============================================================================
// Custom Hooks
// =============================================================================

/**
 * Hook to get filtered hazards based on current filter state.
 *
 * @returns Memoized array of filtered hazards
 */
export const useFilteredHazards = (): TrackedHazard[] => {
  const { hazards, filters } = useSafety();

  return useMemo(() => {
    return filterHazards(Array.from(hazards.values()), filters);
  }, [hazards, filters]);
};

/**
 * Hook to get a specific hazard by ID.
 *
 * @param id - Hazard ID
 * @returns Hazard object or undefined
 */
export const useHazard = (id: string): TrackedHazard | undefined => {
  const { hazards } = useSafety();
  return hazards.get(id);
};

/**
 * Hook to get a specific fault tree by ID.
 *
 * @param id - Fault tree ID
 * @returns Fault tree object or undefined
 */
export const useFaultTree = (id: string): FaultTree | undefined => {
  const { faultTrees } = useSafety();
  return faultTrees.get(id);
};

/**
 * Hook to get a specific GSN node by ID.
 *
 * @param id - GSN node ID
 * @returns GSN node object or undefined
 */
export const useGSNNode = (id: string): GSNNode | undefined => {
  const { gsnNodes } = useSafety();
  return gsnNodes.get(id);
};

/**
 * Hook to get a specific requirement by ID.
 *
 * @param id - Requirement ID
 * @returns Requirement object or undefined
 */
export const useRequirement = (id: string): TrackedRequirement | undefined => {
  const { requirements } = useSafety();
  return requirements.get(id);
};

/**
 * Hook to get a specific FMEA item by ID.
 *
 * @param id - FMEA item ID
 * @returns FMEA item object or undefined
 */
export const useFMEAItem = (id: string): TrackedFMEAItem | undefined => {
  const { fmeaItems } = useSafety();
  return fmeaItems.get(id);
};

/**
 * Hook to get a specific evidence item by ID.
 *
 * @param id - Evidence ID
 * @returns Evidence object or undefined
 */
export const useEvidence = (id: string): TrackedEvidence | undefined => {
  const { evidence } = useSafety();
  return evidence.get(id);
};

/**
 * Hook to get all artifacts linked to a specific artifact.
 *
 * @param type - Type of the source artifact
 * @param id - ID of the source artifact
 * @returns Object containing arrays of linked artifacts by type
 */
export const useTraceability = (
  type: ArtifactType,
  id: string
): {
  linkedHazards: TrackedHazard[];
  linkedFaultTrees: FaultTree[];
  linkedGSNNodes: GSNNode[];
  linkedRequirements: TrackedRequirement[];
  linkedFMEAItems: TrackedFMEAItem[];
  linkedEvidence: TrackedEvidence[];
} => {
  const { hazards, faultTrees, gsnNodes, requirements, fmeaItems, evidence } = useSafety();

  return useMemo(() => {
    // Get the source artifact
    let sourceArtifact: Record<string, unknown> | undefined;

    switch (type) {
      case 'hazard':
        sourceArtifact = hazards.get(id) as unknown as Record<string, unknown>;
        break;
      case 'fault-tree':
        sourceArtifact = faultTrees.get(id) as unknown as Record<string, unknown>;
        break;
      case 'gsn-node':
        sourceArtifact = gsnNodes.get(id) as unknown as Record<string, unknown>;
        break;
      case 'requirement':
        sourceArtifact = requirements.get(id) as unknown as Record<string, unknown>;
        break;
      case 'fmea':
        sourceArtifact = fmeaItems.get(id) as unknown as Record<string, unknown>;
        break;
      case 'evidence':
        sourceArtifact = evidence.get(id) as unknown as Record<string, unknown>;
        break;
    }

    if (!sourceArtifact) {
      return {
        linkedHazards: [],
        linkedFaultTrees: [],
        linkedGSNNodes: [],
        linkedRequirements: [],
        linkedFMEAItems: [],
        linkedEvidence: [],
      };
    }

    const linkedHazardIds = (sourceArtifact.linkedHazards as string[]) || [];
    const linkedFaultTreeIds = (sourceArtifact.linkedFaultTrees as string[]) || [];
    const linkedGSNNodeIds = (sourceArtifact.linkedGSNNodes as string[]) || [];
    const linkedRequirementIds = (sourceArtifact.linkedRequirements as string[]) || [];
    const linkedFMEAItemIds = (sourceArtifact.linkedFMEAItems as string[]) || [];
    const linkedEvidenceIds = (sourceArtifact.linkedEvidence as string[]) || [];

    return {
      linkedHazards: linkedHazardIds
        .map((hid) => hazards.get(hid))
        .filter((h): h is TrackedHazard => h !== undefined),
      linkedFaultTrees: linkedFaultTreeIds
        .map((ftid) => faultTrees.get(ftid))
        .filter((ft): ft is FaultTree => ft !== undefined),
      linkedGSNNodes: linkedGSNNodeIds
        .map((gid) => gsnNodes.get(gid))
        .filter((g): g is GSNNode => g !== undefined),
      linkedRequirements: linkedRequirementIds
        .map((rid) => requirements.get(rid))
        .filter((r): r is TrackedRequirement => r !== undefined),
      linkedFMEAItems: linkedFMEAItemIds
        .map((fid) => fmeaItems.get(fid))
        .filter((f): f is TrackedFMEAItem => f !== undefined),
      linkedEvidence: linkedEvidenceIds
        .map((eid) => evidence.get(eid))
        .filter((e): e is TrackedEvidence => e !== undefined),
    };
  }, [type, id, hazards, faultTrees, gsnNodes, requirements, fmeaItems, evidence]);
};

/**
 * Hook to get hazard statistics.
 *
 * @returns Object with counts by status and severity
 */
export const useHazardStats = (): {
  total: number;
  byStatus: Record<HazardStatus, number>;
  bySeverity: Record<SeverityLevel, number>;
  byRiskLevel: Record<RiskLevel, number>;
} => {
  const { hazards } = useSafety();

  return useMemo(() => {
    const hazardArray = Array.from(hazards.values());

    const byStatus: Record<HazardStatus, number> = {
      Open: 0,
      'Under Review': 0,
      Mitigated: 0,
      Monitoring: 0,
      Closed: 0,
      Transferred: 0,
      Accepted: 0,
    };

    const bySeverity: Record<SeverityLevel, number> = {
      Catastrophic: 0,
      Hazardous: 0,
      Major: 0,
      Minor: 0,
      NoEffect: 0,
    };

    const byRiskLevel: Record<RiskLevel, number> = {
      Unacceptable: 0,
      Undesirable: 0,
      Tolerable: 0,
      Acceptable: 0,
    };

    for (const hazard of hazardArray) {
      if (hazard.status in byStatus) {
        byStatus[hazard.status]++;
      }
      if (hazard.severity in bySeverity) {
        bySeverity[hazard.severity]++;
      }
      if (hazard.riskLevel in byRiskLevel) {
        byRiskLevel[hazard.riskLevel]++;
      }
    }

    return {
      total: hazardArray.length,
      byStatus,
      bySeverity,
      byRiskLevel,
    };
  }, [hazards]);
};
