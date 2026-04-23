# Play Route Refactoring Brainstorm

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Identify and document candidates in `src/app/play` that should be moved to `src/features` based on feature-based architecture principles.

**Architecture:** Analyze the existing code in `src/app/play`, compare it with the current `src/features` domain boundaries, and propose moves that improve modularity and reusability.

**Tech Stack:** Next.js (App Router), React, TypeScript.

---

### Task 1: Research and Analysis

**Files:**
- Research: `src/app/play/**/*`
- Research: `src/features/**/*`

**Step 1: Scan app/play for domain logic**
Identify components, hooks, and utilities that represent "what" the app does rather than "how" the page is structured.

**Step 2: Evaluate against feature-based principles**
Determine if identified items are truly route-specific or belong to a broader domain (e.g., "Rhythm Engine", "Visualizer").

**Step 3: Propose new/existing feature destinations**
Create a mapping of files to their proposed new locations in `src/features`.

### Task 2: Brainstorming & Feedback

**Step 1: Present findings to the user**
Propose 2-3 approaches for the refactoring.

**Step 2: Refine based on feedback**
Incorporate user input on future reuse plans.

**Step 3: Finalize Design Doc**
Create `docs/plans/2026-04-23-play-refactor-design.md`.
