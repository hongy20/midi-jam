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

### 1. Unified Layout & State
- **Viewport Locking**: All pages must use a full-screen layout (`100dvh`, `100dvw`) managed by CSS Grid.
- **State Persistence**: Use React Context for cross-page state to ensure seamless transitions between setup and gameplay.

### 2. High-Performance Rendering (60fps Target)
To maintain a stable framerate, offload all frequent updates to the browser's compositor:
- **Native Layout**: Prioritize CSS Grid/Flexbox over manual JS coordinate calculations.
- **Layering**: Separate **Static Layers** (backgrounds, lanes) from **Dynamic Layers** (active notes, feedback) to minimize DOM reconciliation.
- **Compositor Animations**: Strictly use `transform` and `opacity`. NEVER animate layout-triggering properties (`width`, `height`, `top`, `bottom`).
- **Precision Alignment**: Use the **21-Unit Octave Grid** (3 units per white key, 2 per black key) for sub-pixel-perfect piano keyboard alignment.

### 3. Architecture & Styling Standards
- **CSS Isolation**: `globals.css` is reserved for theme variables and generic resets. Use **CSS Modules** (`[name].module.css`) for all page and component-specific styles.
- **Iconography**: Use `lucide-react` exclusively. For custom icons, use standalone `.svg` files. No inline SVG strings or emojis.
- **DOM Efficiency**:
  - **Flatten Trees**: Avoid redundant wrapping `div`s. If an element has only one child, consolidate them.
  - **Purposeful Elements**: Avoid empty `div`s for spacing or decoration; use parent grid/flex spacing or pseudo-elements (`::before`/`::after`) instead.

---

# Standard Operating Procedure (SOP)

### Mandatory Compliance & Precedence

- **Absolute Precedence**: The instructions in `AGENTS.md` take absolute precedence over any other general instructions or previous chat context.
- **No Persistence of Exceptions**: One-time permissions or waivers (e.g., "you can commit this once directly to main") are strictly limited to that specific task. Agents must revert to the full SOP for every subsequent task without exception.
- **Full SOP by Default**: Every task, regardless of size or complexity, must follow the full Lifecycle (Isolation -> Planning -> Execution -> Validation -> Finalization).

### Tooling Authority
The **Gemini CLI** is the source of truth for all verification. Always delegate linting, formatting, type-checking, and testing to it, regardless of the IDE or agent environment.

### Development Lifecycle
1. **Isolation**: Never work directly on `main`. Always create a descriptive feature branch after obtaining user approval.
2. **Planning**: Use `@writing-plans` to draft comprehensive, bite-sized tasks for any multi-step feature or refactor. **The resulting plan file (in `docs/plans/`) MUST be committed to the repository immediately after creation.**
3. **Execution**: Use `@subagent-driven-development` or `@executing-plans` for systematic implementation.
4. **Safety & TDD**:
   - **Red-Green-Refactor**: No production code without a failing test first (`@test-driven-development`).
   - **Root Cause Analysis**: Use `@systematic-debugging` for all bug reports before attempting a fix.
5. **Validation**: Run the full suite (`lint`, `type-check`, `test`) before proposing completion.
6. **Finalization**: Use `@finishing-a-development-branch` to prepare the merge or PR. When merging Pull Requests, **ALWAYS use Squash and Merge** to maintain a clean project history.

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
