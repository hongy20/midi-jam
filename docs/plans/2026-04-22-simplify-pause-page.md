# Simplify Pause Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Simplify `PausePageClient` by removing redundant guards and optimize `PausePageView` styles.

**Architecture:** Remove early return guards that are redundant due to `useEffect` redirection, and use Tailwind v4 height utility.

**Tech Stack:** React 19, Tailwind CSS v4

---

### Task 1: Simplify PausePageClient Logic

**Files:**
- Modify: `src/app/pause/components/pause-page.client.tsx:28-31`

**Step 1: Remove redundant guards**
Remove the following lines:
```tsx
  // If state is missing, return null while redirecting
  if (!selectedTrack || !selectedMIDIInput) {
    return null;
  }
```

**Step 2: Verify logic**
Run: `npm run lint`
Expected: No errors related to unused variables or missing guards.

**Step 3: Commit**
```bash
git add src/app/pause/components/pause-page.client.tsx
git commit -m "refactor: remove redundant state guards in PausePageClient"
```

---

### Task 2: Optimize PausePageView Styles

**Files:**
- Modify: `src/app/pause/components/pause-page.view.tsx:14`

**Step 1: Update height utility**
Change:
```tsx
<main className="w-screen h-[100dvh] flex items-center justify-center p-4 bg-background overflow-hidden select-none">
```
To:
```tsx
<main className="w-screen h-dvh flex items-center justify-center p-4 bg-background overflow-hidden select-none">
```

**Step 2: Run verification**
Run: `npm run lint`
Expected: No warnings for `h-[100dvh]`.

**Step 3: Commit**
```bash
git add src/app/pause/components/pause-page.view.tsx
git commit -m "style: use standard h-dvh utility in PausePageView"
```

---

### Task 4: Final Validation

**Step 1: Run full suite**
Run: `npm run lint && npm run type-check`
Expected: PASS

**Step 2: Commit any final fixes**
```bash
git add .
git commit -m "chore: final cleanup and verification"
```
