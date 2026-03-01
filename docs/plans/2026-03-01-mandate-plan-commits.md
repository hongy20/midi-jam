# Mandate Plan Commits Implementation Plan (Revised)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Mandate that all implementation plans (in `docs/plans/**`) must be committed to the repository and codify this in `AGENTS.md`.

**Architecture:** Update the "Standard Operating Procedure (SOP)" section in `AGENTS.md` to explicitly state that all files under `docs/plans/**` must be committed. Also, ensure all existing plan files are committed.

**Tech Stack:** Markdown

---

### Task 1: Update AGENTS.md with the docs/plans/** Rule

**Files:**
- Modify: `AGENTS.md`

**Step 1: Refine the Planning step in AGENTS.md**

Update the "Planning" step under "Development Lifecycle" to explicitly reference the `docs/plans/**` path.

```markdown
2. **Planning**: Use `@writing-plans` to draft comprehensive, bite-sized tasks for any multi-step feature or refactor. **All plan files (located in `docs/plans/**`) MUST be committed to the repository immediately after creation.**
```

**Step 2: Verify linting**

Run: `npm run lint:fix`
Expected: Checked 84 files in ...ms. No fixes applied.

**Step 3: Commit AGENTS.md update**

```bash
git add AGENTS.md
git commit -m "docs: mandate committing all plan files in docs/plans/**"
```

---

### Task 2: Commit All Plan Files

**Files:**
- Modify: `docs/plans/**`

**Step 1: Identify and stage all plan files**

Ensure all files under `docs/plans/` are staged for commitment.

Run: `git add docs/plans/`

**Step 2: Commit plan files**

```bash
git commit -m "docs: ensure all implementation plans are committed to the repository"
```

---

### Task 3: Validation & Finalization

**Step 1: Final verification**

Run: `npm run lint && npm run type-check && npm test`
Expected: All pass.

**Step 2: Create PR**

Use `@finishing-a-development-branch` to push and create a PR.
Expected: PR created on GitHub.
