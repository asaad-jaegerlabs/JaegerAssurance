---
sidebar_position: 3
---

# Fault Tree Analysis

Fault Tree Analysis (FTA) is a top-down, deductive failure analysis method used to determine the causes of system-level failures.

## Overview

Fault trees provide a graphical representation of the logical relationships between system failures and their contributing events.

## Components

### Event Types

**Top Event**
- The undesired outcome being analyzed
- Displayed at the root of the tree
- Example: "System Failure"

**Intermediate Events**
- Events that result from combinations of lower-level events
- Connected through logic gates
- Can have their own sub-trees

**Basic Events**
- Fundamental failure causes
- Cannot be broken down further
- Represent primary failure modes

### Logic Gates

**OR Gate**
- Output occurs if any input occurs
- Represented by a circle symbol
- Probability = 1 - ∏(1 - P_i) for independent events

**AND Gate**
- Output occurs only if all inputs occur
- Represented by a triangle symbol
- Probability = ∏P_i for independent events

## Probability Calculations

Each event in the fault tree has an associated probability:

- Basic events have assigned failure probabilities
- Intermediate and top events have calculated probabilities based on their children and gate type
- Probabilities help prioritize mitigation efforts

## Interactive Features

The fault tree visualization supports:

- **Expand/Collapse**: Click arrows to show or hide sub-trees
- **Hover Details**: View additional information about events
- **Probability Display**: See calculated failure probabilities
- **Color Coding**: Distinguish between event types at a glance

## Best Practices

### Building Fault Trees

1. **Define the Top Event**: Clearly identify the undesired outcome
2. **Identify Immediate Causes**: Determine what directly causes the top event
3. **Select Logic Gates**: Choose appropriate AND/OR gates
4. **Develop Lower Levels**: Continue decomposition to basic events
5. **Assign Probabilities**: Use historical data or expert estimates

### Analysis Tips

- Focus on events that significantly contribute to the top event probability
- Identify common cause failures (events appearing in multiple branches)
- Consider environmental and external factors
- Update probabilities as new data becomes available
- Review and validate with subject matter experts

## Usage

Access the [Dashboard](/dashboard) and select the **Fault Trees** tab to:
- View interactive fault tree diagrams
- Expand and collapse tree branches
- Review probability calculations
- Identify critical failure paths
