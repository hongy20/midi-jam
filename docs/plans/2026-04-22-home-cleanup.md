# Home Page Cleanup and Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the Home page to reduce unnecessary abstractions by inlining constants and hook logic, then deleting the obsolete files.

**Architecture:** 
- In-line `INITIAL_LOADING_TIMEOUT` and `MIDI_UNSUPPORTED` values into their respective usage locations.
- Move the logic from `useAppReset` directly into `HomePageClient` using standard feature hooks.
- Delete `src/app/home/lib/constants.ts` and `src/app/home/hooks/use-app-reset.ts`.

**Tech Stack:** Next.js (App Router), React, Lucide Icons.

---

### Task 1: Inline Constants and Delete `constants.ts`

**Files:**
- Modify: `src/app/home/page.tsx`
- Modify: `src/app/home/components/home-page.view.tsx`
- Delete: `src/app/home/lib/constants.ts`

**Step 1: Inline `INITIAL_LOADING_TIMEOUT` in `src/app/home/page.tsx`**

```typescript
// src/app/home/page.tsx
// Remove: import { INITIAL_LOADING_TIMEOUT } from "./lib/constants";
// Replace: const tracks = await getSoundTracks(INITIAL_LOADING_TIMEOUT);
// With: const tracks = await getSoundTracks(1000);
```

**Step 2: Inline `MIDI_UNSUPPORTED` in `src/app/home/components/home-page.view.tsx`**

```typescript
// src/app/home/components/home-page.view.tsx
// Remove: import { MIDI_UNSUPPORTED } from "../lib/constants";
// Replace: throw new Error(MIDI_UNSUPPORTED);
// With: throw new Error("This app requires Web MIDI API. Please use Android Chrome or a modern Chromium browser.");
```

**Step 3: Delete `src/app/home/lib/constants.ts`**

Run: `rm src/app/home/lib/constants.ts`

**Step 4: Verify Lint**

Run: `npm run lint`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/home/page.tsx src/app/home/components/home-page.view.tsx
git rm src/app/home/lib/constants.ts
git commit -m "refactor(home): inline constants and delete constants.ts"
```

---

### Task 2: Inline `useAppReset` logic and Delete Hook

**Files:**
- Modify: `src/app/home/components/home-page.client.tsx`
- Delete: `src/app/home/hooks/use-app-reset.ts`

**Step 1: Update `HomePageClient` with reset logic**

```typescript
// src/app/home/components/home-page.client.tsx
import { useCallback, useEffect } from "react";
import { useCollection } from "@/features/collection";
import { useGear } from "@/features/midi-hardware";
import { useScore } from "@/features/score";
import { useNavigation } from "@/shared/hooks/use-navigation";
import { HomePageView } from "./home-page.view";

interface HomePageClientProps {
  songsCount: number;
}

export function HomePageClient({ songsCount }: HomePageClientProps) {
  const { toGear, toOptions } = useNavigation();
  const { resetCollection } = useCollection();
  const { selectMIDIInput } = useGear();
  const { resetScore } = useScore();

  const resetAll = useCallback(() => {
    resetCollection();
    resetScore();
    selectMIDIInput(null);
  }, [resetCollection, resetScore, selectMIDIInput]);

  useEffect(() => {
    resetAll();
  }, [resetAll]);

  return (
    <HomePageView onStart={() => toGear()} onOptions={() => toOptions()} songsCount={songsCount} />
  );
}
```

**Step 2: Delete `src/app/home/hooks/use-app-reset.ts`**

Run: `rm src/app/home/hooks/use-app-reset.ts`

**Step 3: Verify Lint and Type Check**

Run: `npm run lint && npm run type-check`
Expected: PASS

**Step 4: Commit**

```bash
git add src/app/home/components/home-page.client.tsx
git rm src/app/home/hooks/use-app-reset.ts
git commit -m "refactor(home): inline useAppReset logic and delete hook"
```

---

### Task 3: Final Verification and PR

**Step 1: Run full verification suite**

Run: `npm run lint && npm run type-check && npm test && npm run build`
Expected: PASS

**Step 2: Create PR**

Run: `gh pr create --fill`
Expected: PR link
