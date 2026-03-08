# Collection Horizontal Gallery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Collection page into a horizontal gallery with CSS scroll snap and auto-selection using IntersectionObserver.

**Architecture:** Use `IntersectionObserver` with a narrow center "hit box" to detect the active track. Use CSS Modules for `snap-type` and `scroll-snap-align`. Apply scale transitions via CSS classes.

**Tech Stack:** Next.js (App Router), React 19, Tailwind CSS v4, Lucide React, Biome, Vitest.

---

### Task 1: Update `TrackCard` Styles for Gallery

**Files:**
- Modify: `src/components/track-card/track-card.module.css`

**Step 1: Update card styles for horizontal layout**
Update `.card` to have a stable width and add `.selected` class for scaling.

```css
/* src/components/track-card/track-card.module.css */
.card {
  width: 280px; /* Fixed width for gallery items */
  flex-shrink: 0;
  padding: 1.25rem;
  border-radius: 1.5rem;
  border: 2px solid transparent;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
  height: 100%;
  scroll-snap-align: center;
}

@media (min-width: 640px) {
  .card {
    width: 360px;
    padding: 1.5rem;
  }
}

.selected {
  background-color: var(--foreground);
  border-color: var(--foreground);
  transform: scale(1.1);
  box-shadow: var(--ui-btn-primary-shadow);
  z-index: 10;
}
```

**Step 2: Commit**

```bash
git add src/components/track-card/track-card.module.css
git commit -m "feat(collection): update TrackCard styles for gallery"
```

---

### Task 2: Implement Horizontal Gallery in `CollectionPage`

**Files:**
- Modify: `src/app/collection/page.tsx`
- Modify: `src/app/collection/page.module.css`

**Step 1: Add gallery container styles**

```css
/* src/app/collection/page.module.css */
.gallery {
  display: flex;
  align-items: center;
  gap: 2rem;
  overflow-x: auto;
  snap-type: x mandatory;
  scroll-behavior: smooth;
  padding-inline: calc(50% - 140px); /* (50% - cardWidth/2) */
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: 400px; /* Adjust based on card height */
  min-height: 0;
}

@media (min-width: 640px) {
  .gallery {
    padding-inline: calc(50% - 180px);
  }
}

.gallery::-webkit-scrollbar {
  display: none;
}
```

**Step 2: Implement `IntersectionObserver` logic in `page.tsx`**

```tsx
/* src/app/collection/page.tsx additions */
import { useRef, useCallback } from "react";

// Inside CollectionPage component
const scrollContainerRef = useRef<HTMLDivElement>(null);

const observerRef = useRef<IntersectionObserver | null>(null);

const setupObserver = useCallback((node: HTMLDivElement | null) => {
  if (observerRef.current) observerRef.current.disconnect();

  if (node) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const trackId = entry.target.getAttribute("data-track-id");
            const track = tracks.find((t) => t.id === trackId);
            if (track) {
              setSelectedTrack({
                id: track.id,
                name: track.name,
                url: track.url,
              });
            }
          }
        });
      },
      {
        root: node,
        rootMargin: "0px -45% 0px -45%", // Narrow center hit box
        threshold: 0.5,
      }
    );

    observerRef.current = observer;
    // We'll need to observe items after they render
  }
}, [tracks, setSelectedTrack]);
```

**Step 3: Update JSX to use the new gallery structure**

```tsx
/* Update the div in CollectionPage JSX */
<div 
  ref={(node) => {
    scrollContainerRef.current = node;
    setupObserver(node);
  }}
  className={styles.gallery}
>
  {tracks.map((track) => (
    <div
      key={track.id}
      data-track-id={track.id}
      ref={(el) => {
        if (el && observerRef.current) observerRef.current.observe(el);
      }}
      className="shrink-0 h-[80%] flex items-center"
    >
      <TrackCard
        track={track}
        isSelected={selectedTrack?.id === track.id}
        onClick={() => {
          // Manual click should also scroll into view
          setSelectedTrack({
            id: track.id,
            name: track.name,
            url: track.url,
          });
        }}
      />
    </div>
  ))}
</div>
```

**Step 4: Run dev server and verify**
Run: `npm run dev`
Expected: Gallery scrolls horizontally, snaps to center, and auto-selects.

**Step 5: Commit**

```bash
git add src/app/collection/page.tsx src/app/collection/page.module.css
git commit -m "feat(collection): implement horizontal gallery with IntersectionObserver"
```

---

### Task 3: Refine Loading and Empty States

**Files:**
- Modify: `src/app/collection/page.tsx`

**Step 1: Update loading state to match gallery layout**
Use a placeholder or simply center the loading text.

**Step 2: Commit**

```bash
git add src/app/collection/page.tsx
git commit -m "feat(collection): refine loading state for gallery"
```

---

### Task 4: Final Validation

**Step 1: Run Lint, Type-Check, and Tests**
Run: `npm run lint && npm run type-check && npm test`
Expected: All PASS.

**Step 2: Final Commit**
```bash
git commit -m "chore(collection): finalize gallery implementation"
```
