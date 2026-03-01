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

### 1. High-Performance Rendering (Native-First)
To maintain stable 60fps, we offload layout to the browser's native engine:
- **CSS Grid/Flexbox**: Use native layout instead of calculating coordinates in JS.
- **Layer Separation**: Split components into **Static Layers** (rendered once) and **Dynamic Layers** (active events only) to minimize DOM diffing.
- **Composite-Only Updates**: High-frequency visual updates must strictly use `transform` and `opacity`.
- **21-Unit Octave Grid**: Use a 21-unit grid for the piano keyboard (3 per white key, 2 per black key) for precise, sub-pixel-free alignment.

### 2. Immersive UX & Style
- **Playful Tone**: User-facing text and documentation should be playful and encouraging.
- **Dynamic Visuals**: Use an engaging "track" for MIDI playback visualization that responds to real-time input across different instrument types.

# Standard Workflow (Superpowers)

We follow a strict development lifecycle driven by specialized agent skills:

1. **Planning**: Use `@writing-plans` to draft comprehensive, bite-sized tasks for any multi-step feature or refactor.
2. **Execution**: Implement tasks using `@subagent-driven-development` (step-by-step with review) or `@executing-plans` (batch execution).
3. **Safety & TDD**:
   - Follow **Red-Green-Refactor** strictly using `@test-driven-development`. No production code without a failing test first.
   - Use `@systematic-debugging` for root-cause analysis of any bugs before fixing.
4. **Completion**: Use `@finishing-a-development-branch` to verify tests and handle merges or Pull Requests.

# Building and Running

- **Dev Server**: `npm run dev` (https://localhost:3000)
- **Build**: `npm run build`
- **Lint & Format**: `npm run lint:fix`
- **Type Check**: `npm run type-check`
- **Test**: `npm test`

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.<!-- NEXT-AGENTS-MD-END -->
