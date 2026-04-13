# Refactor PausePage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor `PausePage` to use the `8bitcn` `PauseMenu` block with a clean Logic/View/Story separation.

**Architecture:** A Server Component entry point, a Client Logic container for context consumption and error guarding, and a Pure View component for UI rendering and Storybook isolation.

**Tech Stack:** Next.js 15, React 19, 8bitcn (Shadcn/ui), Tailwind CSS v4, Lucide React, Storybook.

---

## Design Summary

### Components
1. **`src/app/pause/page.tsx` (Server)**: Metadata definition and entry point.
2. **`src/app/pause/components/pause-page.client.tsx` (Client Logic)**: Consumes contexts, implements error guard (throws if missing state), and renders the view.
3. **`src/app/pause/components/pause-page.view.tsx` (Pure View)**: Centered `main` tag rendering the `@8bitcn/pause-menu`.
4. **`src/components/ui/8bit/blocks/pause-menu.tsx` (8bitcn Block)**: Installed via CLI.

### UI Simplification
- Remove the "Currently Playing" card.
- Consolidate actions to component defaults: `CONTINUE`, `RESTART`, `SETTINGS`, `QUIT`.

---

## Implementation Tasks

### Task 1: Install 8bitcn PauseMenu Block

**Files:**
- [NEW] `src/components/ui/8bit/blocks/pause-menu.tsx`

**Step 1: Install the block**
Run: `npx shadcn@latest add @8bitcn/pause-menu`

**Step 2: Commit**
```bash
git add src/components/ui/8bit/blocks/pause-menu.tsx
git commit -m "feat: install 8bitcn pause-menu block"
```

---

### Task 2: Create Pure PausePageView

**Files:**
- [NEW] `src/app/pause/components/pause-page.view.tsx`
- [NEW] `src/app/pause/components/pause-page.view.stories.tsx`

**Step 1: Implement the view**
Write minimal implementation using the `PauseMenu` block inside a centered `main` tag.

**Step 2: Create Storybook**
Create `pause-page.view.stories.tsx` with mock handlers.

**Step 3: Verification**
Run: `npm run build-storybook` (or check in a running storybook instance).

**Step 4: Commit**
```bash
git add src/app/pause/components/pause-page.view*
git commit -m "feat: add PausePageView and Storybook"
```

---

### Task 3: Implement PausePageClient with Logic

**Files:**
- [NEW] `src/app/pause/components/pause-page.client.tsx`

**Step 1: Write the logic container**
Consume hooks and implement error guard.

**Step 2: Verification**
Run: `npm run type-check`

**Step 3: Commit**
```bash
git add src/app/pause/components/pause-page.client.tsx
git commit -m "feat: add PausePageClient with logic and error guard"
```

---

### Task 4: Update PausePage Server Entry

**Files:**
- [MODIFY] `src/app/pause/page.tsx`

**Step 1: Convert to Server Component**
Update metadata and render `PausePageClient`.

**Step 2: Verification**
Run: `npm run build`

**Step 3: Commit**
```bash
git add src/app/pause/page.tsx
git commit -m "feat: update PausePage entry point to server component"
```

---

### Task 5: Final Validation & Cleanup

**Step 1: Run full suite**
Run: `npm run lint && npm run type-check && npm test && npm run build`

**Step 2: Create PR**
Run: `gh pr create --fill`
