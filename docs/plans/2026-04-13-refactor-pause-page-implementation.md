# PausePage Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor `PausePage` to use the `8bitcn` `PauseMenu` block with a clean Logic/View/Story separation.

**Architecture:** A Server Component entry point, a Client Logic container for context consumption and error guarding, and a Pure View component for UI rendering and Storybook isolation.

**Tech Stack:** Next.js 15, React 19, 8bitcn (Shadcn/ui), Tailwind CSS v4, Lucide React, Storybook.

---

### Task 1: Install 8bitcn PauseMenu Block

**Files:**
- [NEW] `src/components/ui/8bit/blocks/pause-menu.tsx`

**Step 1: Install the block**
Run: `npx shadcn@latest add @8bitcn/pause-menu`
Expected: File created at `src/components/ui/8bit/blocks/pause-menu.tsx`.

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

```tsx
import { PauseMenu } from "@/components/ui/8bit/blocks/pause-menu";

interface PausePageViewProps {
  onContinue: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onQuit: () => void;
}

export function PausePageView({ onContinue, onRestart, onSettings, onQuit }: PausePageViewProps) {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <PauseMenu 
        title="PAUSED"
        onContinue={onContinue}
        onRestart={onRestart}
        onSettings={onSettings}
        onQuit={onQuit}
      />
    </main>
  );
}
```

**Step 2: Create Storybook**
Create `pause-page.view.stories.tsx` with mock handlers.

**Step 3: Verification**
Run: `npm run build-storybook` (or check in a running storybook instance if possible).

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
Consume hooks and implement error guard as per design.

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
