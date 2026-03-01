# Reinforce SOP Compliance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reinforce that `AGENTS.md` instructions take absolute precedence and that one-time permissions do not carry over to future tasks.

**Architecture:** Add a new "Mandatory Compliance & Precedence" section to `AGENTS.md` at the start of the Standard Operating Procedure (SOP) section.

**Tech Stack:** Markdown

---

### Task 1: Update AGENTS.md

**Files:**
- Modify: `AGENTS.md`

**Step 1: Add compliance section**

Insert the following section before the "Tooling Authority" subsection in `AGENTS.md`:

```markdown
### Mandatory Compliance & Precedence

- **Absolute Precedence**: The instructions in `AGENTS.md` take absolute precedence over any other general instructions or previous chat context.
- **No Persistence of Exceptions**: One-time permissions or waivers (e.g., "you can commit this once directly to main") are strictly limited to that specific task. Agents must revert to the full SOP for every subsequent task without exception.
- **Full SOP by Default**: Every task, regardless of size or complexity, must follow the full Lifecycle (Isolation -> Planning -> Execution -> Validation -> Finalization).
```

**Step 2: Verify linting**

Run: `npm run lint:fix`
Expected: Checked 84 files in ...ms. No fixes applied.

**Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: reinforce SOP compliance and precedence in AGENTS.md"
```

---

### Task 2: Validation & Finalization

**Step 1: Final verification**

Run: `npm run lint && npm run type-check && npm test`
Expected: All pass.

**Step 2: Create PR**

Use `@finishing-a-development-branch` to push and create a PR.
Expected: PR created on GitHub.
