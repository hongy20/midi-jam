# Home Native States Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Re-architect the Home page state to leverage Next.js native `loading.tsx` and `error.tsx` files instead of React Context for Web MIDI support detection and initial loading.

**Architecture:** We will replace `HomeProvider` with Next.js specific routing. `loading.tsx` will display the loading view. A Server Component (`page.tsx`) will force an artificial 1s delay to maintain visual polish, then render the client view. The client view will verify `navigator.requestMIDIAccess` and throw an expected `MIDI_UNSUPPORTED` Error if missing. `error.tsx` will catch this and display the unsupported browser card.

**Tech Stack:** Next.js App Router (React Server/Client Components, ErrorBoundary, Suspense).

---

### Task 1: Create `loading.tsx`

**Files:**
- Create: `src/app/home/loading.tsx`
- Modify: `src/app/home/welcome-page.view.tsx:21-46` (remove loading state from view)

**Step 1: Write `loading.tsx` component**
```tsx
import LoadingScreen from "@/components/8bit/loading-screen";
import { INITIAL_LOADING_TIMEOUT } from "@/lib/constants"; // We will move timeout here

const LOADING_TIPS = [
  "Tip: Connect your MIDI keyboard before starting for the best experience.",
  "Tip: Use the Gear menu to configure your MIDI inputs and instruments.",
  "Tip: Lower your buffer size in Options if you experience audio latency.",
  "Did you know? You can play along with any MIDI song in your collection.",
  "Tip: Use the sustain pedal for more expressive piano performances.",
];

export default function HomeLoading() {
  return (
    <main className="flex items-center justify-center">
      <LoadingScreen
        autoProgress
        autoProgressDuration={INITIAL_LOADING_TIMEOUT}
        tips={LOADING_TIPS}
      />
    </main>
  );
}
```

**Step 2: Commit**
```bash
git add src/app/home/loading.tsx
git commit -m "feat: add home loading native route file"
```

### Task 2: Create `error.tsx`

**Files:**
- Create: `src/app/home/error.tsx`
- Modify: `src/app/home/welcome-page.view.tsx` (remove unsupported card from view)

**Step 1: Write `error.tsx` component**
```tsx
"use client";

import { useEffect } from "react";
import Hero3 from "@/components/8bit/hero3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/8bit/card";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  if (error.message === "MIDI_UNSUPPORTED") {
    return (
      <main>
        <Hero3 title="MIDI JAM" actions={[]} stats={[]}>
          <Card className="max-w-md mx-auto border-8 border-destructive shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
            <CardHeader>
              <CardTitle className="retro text-destructive flex items-center justify-center gap-2">
                UNSUPPORTED BROWSER
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6!">
              <p className="retro text-[10px] leading-relaxed text-foreground/70">
                This app requires Web MIDI API. Please use Android Chrome or a modern Chromium browser.
              </p>
            </CardContent>
          </Card>
        </Hero3>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </main>
  );
}
```

**Step 2: Commit**
```bash
git add src/app/home/error.tsx
git commit -m "feat: handle MIDI_UNSUPPORTED in error.tsx"
```

### Task 3: Refactor Home Page and Remove Context

**Files:**
- Create: `src/lib/constants.ts`
- Modify: `src/app/home/page.tsx`
- Modify: `src/app/home/welcome-page.view.tsx`
- Delete: `src/context/home-context.tsx`

**Step 1: Move INITIAL_LOADING_TIMEOUT out of context**
Create `src/lib/constants.ts` (if it doesn't exist, append to it if it does) with:
```ts
export const INITIAL_LOADING_TIMEOUT = 1000;
```

**Step 2: Update Client View (`welcome-page.view.tsx`)**
Refactor to remove `isLoading` and `isSupported` props. Add `useEffect` to do `requestMIDIAccess` check and throw if unsupported.

**Step 3: Update Server Page (`page.tsx`)**
Convert to async Server Component.
```tsx
import { WelcomePageView } from "./welcome-page.view";
import { INITIAL_LOADING_TIMEOUT } from "@/lib/constants";

export default async function WelcomePage() {
  await new Promise(r => setTimeout(r, INITIAL_LOADING_TIMEOUT));
  return <WelcomePageView />;
}
```

**Step 4: Delete Context**
```bash
rm src/context/home-context.tsx
# Note: remove HomeProvider from src/app/layout.tsx providers check
```

**Step 5: Verify & Commit**
```bash
npm run type-check
npm test
git add .
git commit -m "refactor: replace HomeContext with native Next.js routing states"
```
