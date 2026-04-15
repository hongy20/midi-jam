# Unified Button Styling & Responsiveness Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a consistent button experience across all Midi Jam themes and layouts using a mobile-first Tailwind utility class `.btn-jam`, without modifying the underlying 8bitcn/shadcn source code.

**Architecture:** A global Tailwind `@layer components` utility `.btn-jam` defined in `src/styles/base.css`. This utility handles fixed widths, responsive shrinking, and icon visibility (left-aligned) across all viewports.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Lucide Icons.

---

### Task 1: Define `.btn-jam` Utility

**Files:**
- Modify: `src/styles/base.css`

**Step 1: Add the `.btn-jam` rule to `src/styles/base.css`**

```css
/* src/styles/base.css */
@layer components {
  .btn-jam {
    /* 1. Mobile Default (Compact) */
    @apply w-28 px-2 py-1 flex items-center justify-center transition-all;
    
    /* Icons are hidden by default on small mobile */
    & svg {
      @apply hidden;
    }

    /* 2. Tablet / Small Desktop (Medium) */
    @media (min-width: 768px) {
      @apply w-40 px-3 py-1.5;
      
      /* Show icons and add margin for text */
      & svg {
        @apply block mr-2;
      }
    }

    /* 3. Large Desktop (Standard) */
    @media (min-width: 1024px) {
      @apply w-48 px-4 py-2;
    }
  }
}
```

**Step 2: Commit**

```bash
git add src/styles/base.css
git commit -m "feat: add unified .btn-jam Tailwind utility"
```

---

### Task 2: Update Home Page (Hero3)

**Files:**
- Modify: `src/app/home/components/home-page.view.tsx`

**Step 1: Update `actions` array to use `.btn-jam`**

```tsx
/* src/app/home/components/home-page.view.tsx */
  const actions = [
    {
      label: "START GAME",
      onClick: onStart,
      variant: "default" as const,
      className: "btn-jam", // Changed from w-48
    },
    {
      label: "Options",
      onClick: onOptions,
      variant: "secondary" as const,
      className: "btn-jam", // Changed from w-48
    },
  ];
```

**Step 2: Commit**

```bash
git add src/app/home/components/home-page.view.tsx
git commit -m "refactor: use .btn-jam in Home page"
```

---

### Task 3: Update Gear Page

**Files:**
- Modify: `src/app/gear/components/gear-page.view.tsx`

**Step 1: Update buttons in the footer to use `.btn-jam`**

```tsx
/* src/app/gear/components/gear-page.view.tsx */
      <div className="w-full max-w-5xl flex flex-wrap justify-center gap-4 shrink-0">
        <Button onClick={onBack} variant="secondary" className="btn-jam">
          MAIN MENU
        </Button>
        <Button
          onClick={onContinue}
          variant="default"
          className="btn-jam"
          disabled={!selectedMIDIInput}
        >
          CONTINUE
        </Button>
      </div>
```

**Step 2: Commit**

```bash
git add src/app/gear/components/gear-page.view.tsx
git commit -m "refactor: use .btn-jam in Gear page"
```

---

### Task 4: Update Collection Page

**Files:**
- Modify: `src/app/collection/components/collection-page.view.tsx`

**Step 1: Update buttons in the footer to use `.btn-jam` and fix icon positions**

```tsx
/* src/app/collection/components/collection-page.view.tsx */
      <div className="w-full max-w-5xl flex flex-wrap justify-center gap-4 shrink-0">
        <Button onClick={onBack} variant="secondary" className="btn-jam">
          BACK TO GEAR
        </Button>
        <Button
          onClick={onShuffle}
          variant="secondary"
          className="btn-jam [@media(height<350px)]:hidden"
          disabled={tracks.length <= 1}
        >
          <Dices className="size-4" /> {/* Removed mr-2 as .btn-jam handles it */}
          SHUFFLE
        </Button>
        <Button
          onClick={onContinue}
          variant="default"
          className="btn-jam"
          disabled={!selectedTrack}
        >
          <Play className="size-4 fill-current" /> {/* Moved to left */}
          PLAY
        </Button>
      </div>
```

**Step 2: Commit**

```bash
git add src/app/collection/components/collection-page.view.tsx
git commit -m "refactor: use .btn-jam and left-aligned icons in Collection page"
```

---

### Task 5: Update Score Page

**Files:**
- Modify: `src/app/score/components/score-page.view.tsx`

**Step 1: Update buttons in the footer to use `.btn-jam` and fix icon positions**

```tsx
/* src/app/score/components/score-page.view.tsx */
      <footer className="w-full flex flex-wrap items-center justify-center gap-4 shrink-0 px-4 sm:px-0">
        <Button
          variant="secondary"
          onClick={onHome}
          size="sm"
          font="retro"
          className="btn-jam"
        >
          <Home className="size-4" />
          Home
        </Button>
        <Button
          variant="secondary"
          onClick={onSongs}
          size="sm"
          font="retro"
          className="btn-jam"
        >
          <ChevronRight className="size-4" /> {/* Moved to left */}
          Songs
        </Button>
        <Button onClick={onRetry} size="sm" font="retro" className="btn-jam">
          <RotateCcw className="size-4" /> {/* Moved to left */}
          RETRY
        </Button>
      </footer>
```

**Step 2: Commit**

```bash
git add src/app/score/components/score-page.view.tsx
git commit -m "refactor: use .btn-jam and left-aligned icons in Score page"
```

---

### Task 6: Update Pause Menu Block

**Files:**
- Modify: `src/components/ui/8bit/blocks/pause-menu.tsx`

**Step 1: Update buttons in `PauseMenu` to use `.btn-jam`**
Note: Since `PauseMenu` is a block, we'll override its fixed `h-14` and `justify-start` to match our new standard, or keep them if they are essential for the "Menu" look. Actually, the goal is to *unify* them, so we'll use `.btn-jam`.

```tsx
/* src/components/ui/8bit/blocks/pause-menu.tsx */
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={item.variant}
              onClick={item.action}
              className={cn("btn-jam", item.className)} // Replaced h-14 justify-start px-6 gap-4
              font="retro"
            >
              <item.icon className="size-5" />
              <span className="text-xs uppercase tracking-widest">
                {item.label}
              </span>
            </Button>
          ))}
```

**Step 2: Commit**

```bash
git add src/components/ui/8bit/blocks/pause-menu.tsx
git commit -m "refactor: use .btn-jam in Pause Menu block"
```

---

### Task 7: Final Validation & Cleanup

**Step 1: Run full suite**
Run: `npm run lint && npm run type-check && npm test`

**Step 2: Build project**
Run: `npm run build`

**Step 3: Commit any fixes**
```bash
git commit -m "chore: final validation and fixes"
```

**Step 4: Create Pull Request**
Run: `gh pr create --fill`
