# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Safety Dashboard is a comprehensive safety management system for tracking hazards, analyzing fault trees, monitoring safety performance indicators, and building safety cases using Goal Structured Notation (GSN). The original design is available at https://www.figma.com/design/6aHOEGxjwjbn2TsuvZ7EHF/Safety-Dashboard.

## Development Commands

```bash
# Install dependencies
npm i

# Start development server (Vite, runs on port 3000)
npm run dev

# Build for production (outputs to build/)
npm run build
```

The Docusaurus documentation site (in `src/`) has separate commands:
```bash
cd src
npm start     # Start docs dev server
npm run build # Build docs
```

## Architecture

### Dual Application Structure

This project contains two related applications:

1. **Vite React App** (root level) - The main dashboard application
   - Entry: `src/main.tsx` -> `src/App.tsx`
   - Config: `vite.config.ts`
   - Uses `@` alias for `./src`

2. **Docusaurus Site** (`src/` subdirectory) - Documentation and dashboard pages
   - Config: `src/docusaurus.config.js`
   - Pages: `src/src/pages/`
   - Docs: `src/docs/`

### Key Directories

- `src/components/ui/` - Reusable UI components (shadcn/ui style, Radix UI based)
- `src/src/components/` - Safety-specific dashboard components
- `src/src/pages/` - Docusaurus page components (dashboard.tsx, index.tsx)
- `src/docs/` - Markdown documentation

### Dashboard Components

The dashboard (`src/src/pages/dashboard.tsx`) has four tabbed views:

1. **HazardInformation** - Hazard registry with severity, likelihood, status tracking
2. **FaultTree** - Interactive fault tree with AND/OR gates and probability calculations
3. **SafetyPerformanceIndicators** - Charts and KPIs using Recharts
4. **GSNTree** - Goal Structured Notation tree for safety arguments

### Technology Stack

- React 18 with TypeScript
- Vite (with SWC for fast compilation)
- Radix UI primitives for accessible components
- Tailwind CSS with `tailwind-merge` for styling
- Recharts for data visualization
- Lucide React for icons
- class-variance-authority (CVA) for component variants

### Utility Pattern

Use `cn()` from `src/components/ui/utils.ts` for merging Tailwind classes:
```typescript
import { cn } from "@/components/ui/utils";
cn("base-class", conditional && "conditional-class", props.className)
```
