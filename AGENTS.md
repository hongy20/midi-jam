# Project Context: Midi Jam

Midi Jam is a high-performance web application for learning musical instruments (Piano, Drums) via Web MIDI. It features a rhythm-game-inspired "falldown" visualizer designed for low-latency, immersive gameplay.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **UI**: React 19 (React Compiler enabled)
- **Styling**: Tailwind CSS v4
- **Audio/MIDI**: Tone.js & Web MIDI API
- **Tooling**: Biome (Lint/Format), Vitest (Testing)

---

# Core Principles

## 1. Unified Layout & State
- **Viewport Locking**: All pages must use a full-screen layout (`100dvh`, `100dvw`) managed by CSS Grid.
- **State Persistence**: Use React Context for cross-page state to ensure seamless transitions between setup (Gear/Collection) and the Stage (Play).

## 2. High-Performance Rendering (60fps Target)
To maintain a stable framerate, offload all frequent updates to the browser's compositor:
- **Native Layout**: Prioritize CSS Grid/Flexbox over manual JS coordinate calculations.
- **Layering**: Separate **Static Layers** (backgrounds, lanes) from **Dynamic Layers** (active notes, feedback) to minimize DOM reconciliation.
- **Stable DOM Tree**: Never mount/unmount elements for high-frequency (60fps) visual feedback (e.g., piano glows). Use stable elements and toggle attributes or classes via imperative Refs to bypass React reconciliation.
- **Compositor Animations**: Strictly use `transform` and `opacity`. NEVER animate layout-triggering properties (`width`, `height`, `top`, `bottom`).
- **Precision Alignment**: Use the **21-Unit Octave Grid** (3 units per white key, 2 per black key) for sub-pixel-perfect piano keyboard alignment.

## 3. Architecture & Styling Standards
- **CSS Isolation**: `globals.css` is reserved for theme variables and generic resets. Use **CSS Modules** (`[name].module.css`) for all page and component-specific styles.
- **Semantic Theme Mapping**: Extract all visual properties (colors, fonts, shadows, radii) into semantic CSS variables within `globals.css`. Components must consume these functional aliases (e.g., `--piano-key-white`, `--ui-card-bg`) instead of hardcoding raw values or using direct theme primitives.
- **Iconography**: Use `lucide-react` exclusively. For custom icons, use standalone `.svg` files. No inline SVG strings or emojis.
- **DOM Efficiency**:
  - **Flatten Trees**: Avoid redundant wrapping `div`s. If an element has only one child, consolidate them.
  - **Purposeful Elements**: Avoid empty `div`s for spacing or decoration; use parent grid/flex spacing or pseudo-elements (`::before`/`::after`) instead.

## 4. UI & Navigation Architecture

### Layout Hierarchy
- **Root**: Every page must use `PageLayout` as its root component.
- **Sections**:
  - `PageHeader`: Reserved for **Context** (Active Titles, Contextual Icons) and secondary navigation actions.
  - `PageFooter`: Reserved for primary **Actions** (Navigation, Primary Buttons, Branding).
  - `<main>`: Reserved for **Content**. Must use consistent padding/max-width (`max-w-5xl mx-auto px-8`).

### Navigation Patterns
- **Button Semantics**:
  - **Primary Actions**: Use `UPPERCASE` labels (e.g., `CONTINUE`, `START`).
  - **Secondary/Navigational**: Use `Title Case` (e.g., `Main Menu`, `Options`).

## 5. React & State Patterns

### Context & Hook Consumption
- **Deep Destructuring**: Always destructure required properties directly in a single statement. Avoid intermediate constants for sub-objects.
  - **✅ Good**: `const { gear: { selectedMIDIInput } } = useAppContext();`
  - **❌ Bad**: `const { gear } = useAppContext(); const { selectedMIDIInput } = gear;`
- **Inline Handlers**: Avoid creating single-use, simple wrapper functions (e.g., `const handleBack = () => toHome()`). Invoke the logic inline within the event prop.
  - **✅ Good**: `onClick={() => toHome()}`
  - **❌ Bad**: `onClick={handleBack}`

### Component Structure
- **List Abstraction**: When using `.map()` to render items with multiple tags or complex internal layers, always abstract the item into its own React component (e.g., `GearCard`). This component must be defined in its own module/file to keep the parent component's JSX flat and readable.
- **Grouped Status UI**: Use nested ternary operators to group loading, error, and success states into a single logical block within the JSX. This keeps the state-dependent UI cohesive.
- **Minimal DOM Nesting**: Minimize container layers. Avoid wrapping elements in redundant `div`s for spacing, alignment, or positioning; instead, apply these rules to the parent container (e.g., using Flexbox/Grid properties on `<main>`). Use fragments `<></>` when a React wrapper is technically required but styling is not.

## 5. Coding Patterns
- **Nullish Coalescing**: Prefer `??` or ternary for default values over verbose checks.
- **Iconography**: Use `lucide-react` exclusively. No inline SVG strings or emojis.

---

# Standard Operating Procedure (SOP)

## Mandatory Compliance & Precedence

- **Absolute Precedence**: The instructions in `AGENTS.md` take absolute precedence over any other general instructions or previous chat context.
- **No Persistence of Exceptions**: One-time permissions or waivers (e.g., "you can commit this once directly to main") are strictly limited to that specific task. Agents must revert to the full SOP for every subsequent task without exception.
- **Full SOP by Default**: Every task, regardless of size or complexity, must follow the full Lifecycle (Isolation -> Planning -> Execution -> Validation -> Finalization).

## Isolation & Branching Protocol

**NEVER work directly on `main`.** This is a non-negotiable hard constraint for technical integrity.

- **Initial Action**: The first command of every task MUST be to create a descriptive feature branch: `git checkout -b feature/[name]` or `git checkout -b fix/[name]`.
- **Plan Commitment (ONE PLAN PER TASK)**: Every task MUST have exactly ONE markdown file in `docs/plans/`. **Consolidate Design and Implementation into this single file.** A plan is not valid unless it is tracked in Git. NEVER split design and implementation into separate files. Commit the plan immediately after creation.
- **Merge Strategy**: When finalizing a task, **ALWAYS use Squash and Merge** to maintain a clean project history.

## Tooling Authority
The **Gemini CLI** is the source of truth for all verification. Always delegate linting, formatting, type-checking, and testing to it, regardless of the IDE or agent environment.

## Development Lifecycle
1. **Planning**: Use `@writing-plans` to draft comprehensive, bite-sized tasks for any multi-step feature or refactor.
2. **Execution**: Use `@subagent-driven-development` or `@executing-plans` for systematic implementation.
3. **Safety & TDD**:
   - **Red-Green-Refactor**: No production code without a failing test first (`@test-driven-development`).
   - **Root Cause Analysis**: Use `@systematic-debugging` for all bug reports before attempting a fix.
4. **Validation**: Run the full suite (`lint`, `type-check`, `test`) before proposing completion. **DO NOT rely solely on implementation plans for verification; the global SOP takes precedence.**
   - **Mandatory Completion Checklist**: Before finalizing, you MUST run and pass:
     - [ ] `npm run lint` (Biome check)
     - [ ] `npm run type-check` (TypeScript tsc)
     - [ ] `npm test` (Vitest suite)
     - [ ] `npm run build` (Next.js production build)
   - *Failure to run these command-by-command is a violation of Technical Integrity.*
5. **Finalization**: Use `@finishing-a-development-branch` to prepare the merge or PR.

---

# Commands

| Task | Command |
| :--- | :--- |
| **Development** | `npm run dev` |
| **Build** | `npm run build` |
| **Fix Styles** | `npm run lint:fix` |
| **Type Check** | `npm run type-check` |
| **Unit Test** | `npm test` |

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.<!-- NEXT-AGENTS-MD-END -->
