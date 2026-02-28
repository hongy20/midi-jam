# Responsive Landscape Fixes Implementation Plan (No-Scroll Edition)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure all pages (Game, Settings, Tracks, Results) are 100% responsive and fit within the viewport without any vertical or horizontal scrolling in both portrait and landscape modes.

**Architecture:** Utilize CSS media queries to scale down padding, margins, font sizes, and component heights. Use `flex-row` or `grid-cols-2` layouts in landscape to distribute content horizontally when vertical space is limited.

**Tech Stack:** Next.js (App Router), Tailwind CSS, CSS Modules.

---

### Task 1: Game Page Scaling

**Files:**
- Modify: `src/app/game/page.module.css`

**Step 1: Reduce header/footer heights in landscape**

```css
/* src/app/game/page.module.css */
@media (max-height: 500px) and (orientation: landscape) {
  .container {
    --header-height: 3rem;
    --footer-height: 70px; /* More aggressive reduction */
  }
}
```

**Step 2: Commit**
```bash
git add src/app/game/page.module.css
git commit -m "style(game): aggressively scale header and footer in landscape"
```

---

### Task 2: Settings Page Landscape Reflow

**Files:**
- Modify: `src/app/settings/page.tsx`

**Step 1: Shrink header and gaps in landscape**

Update the header and main container to use less vertical space in landscape.

```tsx
// src/app/settings/page.tsx

// Header: reduce margin
// <header className="relative z-10 w-full max-w-3xl flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 gap-4">
// To:
<header className="relative z-10 w-full max-w-4xl flex flex-row items-center justify-between mb-4 landscape:mb-2 gap-4">

// Main: Use grid for landscape to fit 3 items in 2 columns + 1 wide, or all in a grid.
// <main className="relative z-10 w-full max-w-3xl flex flex-col gap-4 sm:gap-6 animate-slide-up pb-20">
// To:
<main className="relative z-10 w-full max-w-5xl grid grid-cols-1 landscape:grid-cols-2 gap-3 sm:gap-6 animate-slide-up">
```

**Step 2: Scale down Setting Cards**

Reduce padding and font sizes specifically for landscape.

```tsx
// src/app/settings/page.tsx
// Find setting card divs and update classes to be more compact in landscape:
// p-6 sm:p-8 -> landscape:p-3 landscape:gap-3
// text-xl sm:text-2xl -> landscape:text-lg
```

**Step 3: Commit**
```bash
git add src/app/settings/page.tsx
git commit -m "style(settings): reflow layout to grid in landscape to avoid scrolling"
```

---

### Task 3: Navigation Layout Optimization

**Files:**
- Modify: `src/components/navigation-layout.tsx`

**Step 1: Remove max-height restriction and optimize spacing**

Ensure the container always fills the screen but scales its contents.

```tsx
// src/components/navigation-layout.tsx

// Change:
// <div className="relative z-10 w-full max-w-4xl flex flex-col h-full max-h-[85vh] animate-slide-up">
// To:
<div className="relative z-10 w-full max-w-5xl flex flex-col h-full animate-slide-up">

// Reduce header/footer margins in landscape
// <header className="flex items-center justify-between mb-8 flex-shrink-0"> -> landscape:mb-2
// <footer className="mt-8 flex justify-end flex-shrink-0"> -> landscape:mt-2
```

**Step 2: Commit**
```bash
git add src/components/navigation-layout.tsx
git commit -m "style(ui): optimize NavigationLayout for fixed viewport height"
```

---

### Task 4: Tracks Page Grid Scaling

**Files:**
- Modify: `src/app/tracks/page.tsx`

**Step 1: Increase grid columns in landscape to reduce height**

```tsx
// src/app/tracks/page.tsx

// Change:
// <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-y-auto no-scrollbar pb-12 w-full">
// To:
<div className="grid grid-cols-1 sm:grid-cols-2 landscape:grid-cols-3 gap-3 sm:gap-4 overflow-y-auto no-scrollbar w-full">
```

**Step 2: Scale down track buttons**

```tsx
// src/app/tracks/page.tsx
// Reduce padding/gap in landscape:
// p-5 sm:p-6 -> landscape:p-3
```

**Step 3: Commit**
```bash
git add src/app/tracks/page.tsx
git commit -m "style(tracks): scale grid and buttons for landscape"
```

---

### Task 5: Results Page Layout Reflow

**Files:**
- Modify: `src/app/results/page.tsx`

**Step 1: Make Results cards more compact in landscape**

```tsx
// src/app/results/page.tsx
// Use grid-cols-4 more aggressively in landscape.
// Reduce font sizes (5xl/7xl -> 3xl/4xl in landscape).
```

**Step 2: Commit**
```bash
git add src/app/results/page.tsx
git commit -m "style(results): compact layout for landscape performance summary"
```

---

### Task 6: Welcome Page Scaling

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Shrink title and spacers in landscape**

```tsx
// src/app/page.tsx

// Root container: adjust grid rows for landscape
// <div className="fixed inset-0 grid grid-rows-[1fr_auto_1fr] ...
// To:
<div className="fixed inset-0 grid grid-rows-[1fr_auto_1fr] landscape:grid-rows-[0.5fr_auto_0.5fr] ...

// Title: reduce size in landscape
// <h1 className="text-6xl sm:text-7xl md:text-9xl ...
// To:
<h1 className="text-6xl sm:text-7xl md:text-9xl landscape:text-5xl ...

// Warnings/Info: reduce margins and padding
// <div className="flex items-center gap-3 text-sm sm:text-base md:text-xl ... mb-12 ...
// To:
<div className="flex items-center gap-3 text-sm sm:text-base md:text-xl landscape:text-xs ... mb-12 landscape:mb-4 ...

// Start button: scale down
// py-5 sm:py-6 ... text-xl sm:text-2xl ...
// To:
py-5 sm:py-6 landscape:py-3 ... text-xl sm:text-2xl landscape:text-lg ...
```

**Step 2: Commit**
```bash
git add src/app/page.tsx
git commit -m "style(home): scale welcome page for landscape"
```
