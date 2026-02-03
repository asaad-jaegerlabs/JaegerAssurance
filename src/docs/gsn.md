---
sidebar_position: 5
---

# Goal Structured Notation (GSN)

Goal Structured Notation is a graphical argumentation notation used to explicitly document safety arguments and their supporting evidence.

## Overview

GSN provides a structured approach to creating and presenting safety cases, making the reasoning transparent and auditable.

## Node Types

### Goal
- Represents a claim or assertion about system safety
- Top-level goals represent overall safety objectives
- Sub-goals break down the argument into manageable pieces
- **Symbol**: Shield icon, rounded rectangle
- **Example**: "System is acceptably safe to operate"

### Strategy
- Describes the reasoning approach for decomposing goals
- Links parent goals to child goals or solutions
- Explains the argument structure
- **Symbol**: Target icon, rounded rectangle
- **Example**: "Argument over hazard elimination and mitigation"

### Solution
- Provides evidence supporting a goal
- References specific documentation or test results
- Represents the leaf nodes of the argument
- **Symbol**: Checkmark icon, circle
- **Example**: "Hazard Analysis Report", "Test Results"

### Context
- Clarifies the scope or circumstances of a goal
- Provides background information
- Does not contain claims
- **Symbol**: Document icon, rounded rectangle
- **Example**: "Operational environment", "Regulatory requirements"

### Assumption
- Documents assumptions underlying the argument
- Should be validated when possible
- Represents potential weaknesses
- **Symbol**: Document icon, rounded rectangle
- **Example**: "Operators are trained", "Maintenance performed regularly"

## Status Tracking

Each goal and solution can have a status:

- **Complete**: Evidence provided and verified
- **In Progress**: Work ongoing
- **Not Started**: Planned future work

## Building GSN Trees

### Step-by-Step Process

1. **Define Top Goal**: Start with the high-level safety claim
2. **Add Context**: Clarify scope and assumptions
3. **Choose Strategy**: Decide how to decompose the goal
4. **Create Sub-goals**: Break down into supporting goals
5. **Add Solutions**: Link evidence to leaf goals
6. **Document Assumptions**: Make hidden assumptions explicit

### Example Structure

```
G1: System is acceptably safe
├── C1: Operational context
└── S1: Argument by hazard analysis
    ├── G2: All hazards identified
    │   ├── Sn1: HAZOP report
    │   └── Sn2: FMEA document
    └── G3: All hazards mitigated
        └── ... (further decomposition)
```

## Best Practices

### Argument Construction

- **Be Explicit**: Make all reasoning clear and traceable
- **Be Modular**: Create reusable argument patterns
- **Be Balanced**: Don't over-decompose or under-justify
- **Be Honest**: Document assumptions and limitations

### Evidence Management

- Reference specific documents with version numbers
- Ensure evidence is current and maintained
- Verify evidence actually supports the claim
- Plan for evidence update cycles

### Review Process

- Conduct peer reviews of safety arguments
- Involve independent safety assessors
- Challenge assumptions and reasoning
- Update arguments as system evolves

### Common Pitfalls

- **Circular reasoning**: Goals that reference themselves
- **Missing evidence**: Claims without supporting documentation
- **Unclear strategy**: Decomposition logic not explained
- **Stale evidence**: Outdated or superseded documentation

## Interactive Features

The GSN tree visualization supports:

- **Expand/Collapse**: Show or hide branches
- **Status Indicators**: Visual progress tracking
- **Tooltips**: Detailed descriptions on hover
- **Color Coding**: Distinguish node types instantly

## Usage

Access the [Dashboard](/dashboard) and navigate to the **GSN Tree** tab to:
- View the complete safety argument structure
- Expand specific branches for detail
- Track completion status
- Identify gaps in evidence
- Plan next steps for safety case development
