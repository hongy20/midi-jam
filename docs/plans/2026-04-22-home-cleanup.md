# HomePage Suspense Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the Home page to use React 19 `Suspense` and the `use` hook for cleaner data fetching and loading states.

**Architecture:**

- Pass a promise of tracks from the `HomePage` server component to `HomePageClient`.
- Wrap `HomePageClient` in a `Suspense` boundary in `page.tsx`.
- Use the `use` hook in `HomePageClient` to resolve the promise.
- Use `LoadingScreen` as the Suspense fallback.

**Tech Stack:** Next.js (App Router), React 19 (`use`, `Suspense`).

---

### Task 1: Refactor `page.tsx` with Suspense

**Files:**

- Modify: `src/app/home/page.tsx`

**Step 1: Update `HomePage` implementation**

```typescript
// src/app/home/page.tsx
import { Suspense } from "react";
import { getSoundTracks } from "@/features/collection";
import LoadingScreen from "@/shared/components/ui/8bit/blocks/loading-screen";
import { HomePageClient } from "./components/home-page.client";

export default function HomePage() {
  const tracksPromise = getSoundTracks(1000);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <HomePageClient tracksPromise={tracksPromise} />
    </Suspense>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/home/page.tsx
git commit -m "refactor(home): use Suspense and pass tracksPromise to HomePageClient"
```

---

### Task 2: Refactor `HomePageClient` with `use` hook

**Files:**

- Modify: `src/app/home/components/home-page.client.tsx`

**Step 1: Update `HomePageClient` implementation**

```typescript
// src/app/home/components/home-page.client.tsx
"use client";

import { use, useEffect } from "react";
import { useCollection } from "@/features/collection";
import { useGear } from "@/features/midi-hardware";
import { useScore } from "@/features/score";
import { useNavigation } from "@/shared/hooks/use-navigation";
import type { Track } from "@/shared/types/track";
import { HomePageView } from "./home-page.view";

interface HomePageClientProps {
  tracksPromise: Promise<Track[]>;
}

export function HomePageClient({ tracksPromise }: HomePageClientProps) {
  const tracks = use(tracksPromise);
  const songsCount = tracks.length;

  const { toGear, toOptions } = useNavigation();
  const { resetCollection } = useCollection();
  const { selectMIDIInput } = useGear();
  const { resetScore } = useScore();

  useEffect(() => {
    resetCollection();
    resetScore();
    selectMIDIInput(null);
  }, [resetCollection, resetScore, selectMIDIInput]);

  return (
    <HomePageView onStart={() => toGear()} onOptions={() => toOptions()} songsCount={songsCount} />
  );
}
```

**Step 2: Commit**

```bash
git add src/app/home/components/home-page.client.tsx
git commit -m "refactor(home): use React.use hook to resolve tracksPromise"
```

---

### Task 3: Update Tests and Verification

**Files:**

- Modify: `src/app/home/page.test.tsx`

**Step 1: Update tests to pass `tracksPromise`**

```typescript
// src/app/home/page.test.tsx
// Update render(<HomePageClient tracksPromise={Promise.resolve(mockTracks)} />)
```

**Step 2: Run verification**

Run: `npm run lint && npm run type-check && npm test && npm run build`
Expected: PASS

**Step 3: Commit and PR**

```bash
git add src/app/home/page.test.tsx
git commit -m "test(home): update tests for Suspense refactor"
```
