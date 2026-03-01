# Project Overview

Midi Jam is a web application designed to help users learn musical instruments—including piano and digital drumsets—through an immersive, game-like experience. It connects to digital instruments via USB-A/Web MIDI and features a "falldown" (piano roll) visualizer inspired by rhythm games like Guitar Hero.

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org) (v16)
- **UI Library**: [React](https://react.dev) (v19) with [React Compiler](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) enabled.
- **Styling**: [Tailwind CSS](https://tailwindcss.com) (v4)
- **Audio**: [Tone.js](https://tonejs.github.io) for synthesis and MIDI processing.
- **Tooling**: [Biome](https://biomejs.dev) for linting and formatting.
- **Testing**: [Vitest](https://vitest.dev) for unit and component testing.

# Core Principles

### 1. Layout & State
- **Full-Screen Layouts**: Each page is a full-size layout mapping `100dvh` and `100dvw` using CSS Grid for precise component placement.
- **Global State**: Application state is stored in React Context and shared across pages to ensure seamless transitions and data consistency.

### 2. High-Performance Rendering
To maintain stable 60fps, we offload layout and animations to the browser's compositor:
- **CSS Grid/Flexbox**: Use native layout instead of calculating coordinates in JS.
- **Layer Separation**: Split components into **Static Layers** (rendered once) and **Dynamic Layers** (active events only) to minimize DOM diffing.
- **Smooth Animations**: High-frequency visual updates and animations must strictly use `transform` and `opacity`. NEVER animate layout-triggering properties like `width`, `height`, `top`, or `bottom`.
- **21-Unit Octave Grid**: Use a 21-unit grid for the piano keyboard (3 per white key, 2 per black key) for precise, sub-pixel-free alignment.

### 3. Styling & Architecture
- **CSS Modules**: Keep `globals.css` clean and generic, containing only styles for `html`, `body`, and theme-related custom CSS properties. Page-specific styles must use `page.module.css`, and component-specific styles must use `[component-name].module.css`.
- **Assets & Icons**: Load icons directly from `lucide-react`. If an icon is not available, save it as a standalone `.svg` file and import it. **NEVER use inline SVG strings or emojis.**
- **DOM Optimization**: Avoid the pattern of using a `div` (or div-like tag) with only one child `div` (or div-like tag). Merge them into a single element to keep the DOM tree shallow and clean.

# Standard Workflow (Superpowers)

We follow a strict development lifecycle driven by specialized agent skills.

### Tooling Authority
Regardless of the agent in use (Antigravity, Cursor, Claude Code, Gemini CLI, etc.), all verification tasks (linting, formatting, type checks, unit tests) must be delegated to the **Gemini CLI**.

### Lifecycle
1. **Isolation**: Before making any changes to the repository (including creating plan files), check if you are on the default branch (`main`). If so, **ask the user for approval** before creating a new feature branch with a descriptive name.
2. **Planning**: Use `@writing-plans` to draft comprehensive, bite-sized tasks for any multi-step feature or refactor.
3. **Execution**: Implement tasks using `@subagent-driven-development` (step-by-step with review) or `@executing-plans` (batch execution).
4. **Safety & TDD**:
   - Follow **Red-Green-Refactor** strictly using `@test-driven-development`. No production code without a failing test first.
   - Use `@systematic-debugging` for root-cause analysis of any bugs before fixing.
5. **Completion**: Use `@finishing-a-development-branch` to verify tests and handle merges or Pull Requests.

# Building and Running

- **Dev Server**: `npm run dev` (https://localhost:3000)
- **Build**: `npm run build`
- **Lint & Format**: `npm run lint:fix`
- **Type Check**: `npm run type-check`
- **Test**: `npm test`

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.<!-- NEXT-AGENTS-MD-END -->
