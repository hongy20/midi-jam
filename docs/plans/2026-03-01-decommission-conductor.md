# Conductor Decommissioning and Workflow Transition Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Decommission the Conductor extension and consolidate essential project knowledge into `AGENTS.md`. Transition to a streamlined, `superpowers`-driven workflow.

**Architecture:** 
1. Merge critical product vision and rendering principles from `conductor/` into `AGENTS.md`.
2. Delete the `conductor/` directory and its associated setup state.
3. Establish `AGENTS.md` as the single source of truth for project context.

**Tech Stack:** Gemini CLI, Superpowers Agent Skills.

---

### Task 1: Consolidate Knowledge into AGENTS.md

**Files:**
- Modify: `AGENTS.md`

**Step 1: Extract core principles from Conductor**
Identify the most important information:
- Product Vision (USB-A MIDI, 3D perspective, falldown visuals).
- High-Performance Rendering Patterns (Native-first, Layer separation, Composite-only updates, 21-unit grid).
- UX/Style guidelines (Smart defaults, playful prose).

**Step 2: Update AGENTS.md**
Rewrite `AGENTS.md` to include these principles concisely. Remove the link to the external high-performance rendering document and inline its key points.

**Step 3: Define the new Workflow**
Add a section to `AGENTS.md` explicitly defining the `superpowers` workflow:
- **Planning**: Use `@writing-plans` to draft implementation steps.
- **Execution**: Use `@executing-plans` (batch) or `@subagent-driven-development` (step-by-step).
- **Completion**: Use `@finishing-a-development-branch` to merge or create PRs.

**Step 4: Manually verify**
- Ensure `AGENTS.md` is informative but not "huge."
- Confirm all critical rendering rules are preserved.

**Step 5: Commit**
```bash
git add AGENTS.md
git commit -m "docs: consolidate project context into AGENTS.md and define superpower workflow"
```

---

### Task 2: Decommission Conductor

**Files:**
- Delete: `conductor/`

**Step 1: Remove the conductor directory**
Run: `rm -rf conductor/`

**Step 2: Verify workspace**
Run a project-wide search for "conductor" to ensure no broken links or stale references remain in the code or docs.

**Step 3: Commit**
```bash
git add .
git commit -m "chore: remove conductor directory and decommission extension"
```

---

### Task 3: Final Verification

**Step 1: Run full verification**
Run: `npm run lint && npm run type-check && npm test`
Ensure the workspace remains healthy.

**Step 2: Commit cleanup**
If any small fixes were needed, commit them.
```bash
git commit -m "fix: final cleanup after conductor decommissioning"
```
