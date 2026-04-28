# Full-Size Standalone Grid Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor each page to be a standalone full-size layout mapping 100dvh and 100dvw using CSS grid. Decommission the `NavigationLayout` wrapper.

**Architecture:** We will set a global baseline in `globals.css` for `html` and `body`. Each page will then implement its own grid structure (`grid-template-rows: auto 1fr auto`) to manage its header, content, and footer areas. Common layout elements like the background glow will be implemented directly or via small, non-wrapping components.

**Tech Stack:** Next.js, React, Tailwind CSS v4, CSS Grid.

---

### Task 1: Global Baseline Setup

**Files:**

- Modify: `src/app/globals.css`

**Step 1: Update globals.css**

```css
html,
body {
  height: 100dvh;
  width: 100dvw;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: fixed;
}
```

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "style: set global 100dvh/100dvw baseline"
```

### Task 2: Refactor InstrumentsPage to Standalone Grid

**Files:**

- Modify: `src/app/gear/page.tsx`

**Step 1: Replace NavigationLayout with standalone grid**

Integrate the header, stepper, and background glow directly into the page. Use `grid-template-rows: auto 1fr auto`.

```tsx
// Example structure in page.tsx
return (
  <div className="bg-background animate-fade-in grid h-dvh w-dvw grid-rows-[auto_1fr_auto] overflow-hidden p-6 transition-colors duration-500 landscape:p-4">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bg-accent-primary/5 absolute top-[20%] right-[10%] h-[60%] w-[60%] rounded-full blur-[120px]" />
    </div>

    <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between py-4 landscape:py-2">
      {/* Stepper + Title logic from NavigationLayout */}
    </header>

    <main className="no-scrollbar relative z-10 -mx-8 mx-auto w-full max-w-5xl overflow-y-auto px-8 py-4">
      {/* Content */}
    </main>

    <footer className="relative z-10 mx-auto flex w-full max-w-5xl justify-end py-4 landscape:py-2">
      {/* Footer Button */}
    </footer>
  </div>
);
```

**Step 2: Commit**

```bash
git add src/app/gear/page.tsx
git commit -m "refactor: InstrumentsPage to standalone full-size grid"
```

### Task 3: Refactor TracksPage to Standalone Grid

**Files:**

- Modify: `src/app/collection/page.tsx`

**Step 1: Replace NavigationLayout with standalone grid**

Replicate the header (with back button), stepper, and background.

**Step 2: Commit**

```bash
git add src/app/collection/page.tsx
git commit -m "refactor: TracksPage to standalone full-size grid"
```

### Task 4: Refactor ResultsPage to Standalone Grid

**Files:**

- Modify: `src/app/score/page.tsx`

**Step 1: Replace NavigationLayout with standalone grid**

Replicate the header and background glow.

**Step 2: Commit**

```bash
git add src/app/score/page.tsx
git commit -m "refactor: ResultsPage to standalone full-size grid"
```

### Task 5: Refine WelcomePage Grid

**Files:**

- Modify: `src/app/page.tsx`

**Step 1: Ensure it uses exact 100dvw/100dvh and standard grid pattern**

**Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "refactor: refine WelcomePage 100dvw/100dvh grid"
```

### Task 6: Refine SettingsPage Grid

**Files:**

- Modify: `src/app/options/page.tsx`

**Step 1: Ensure it uses exact 100dvw/100dvh and standard grid pattern**

**Step 2: Commit**

```bash
git add src/app/options/page.tsx
git commit -m "refactor: refine SettingsPage 100dvw/100dvh grid"
```

### Task 7: Refine GamePage Grid

**Files:**

- Modify: `src/app/play/page.module.css`
- Modify: `src/app/play/page.tsx`

**Step 1: Update page.module.css to use 100dvh/100dvw baseline**

**Step 2: Commit**

```bash
git add src/app/play/page.module.css src/app/play/page.tsx
git commit -m "refactor: refine GamePage grid layout"
```

### Task 8: Decommission NavigationLayout

**Files:**

- Delete: `src/components/navigation-layout.tsx`
- Delete: `src/components/navigation-layout.test.tsx`

**Step 1: Delete the files**

```bash
rm src/components/navigation-layout.tsx src/components/navigation-layout.test.tsx
```

**Step 2: Commit**

```bash
git add .
git commit -m "chore: decommission NavigationLayout"
```

### Task 9: Final Verification

**Step 1: Build and test**

Run: `npm run build && npm test`
Expected: SUCCESS
