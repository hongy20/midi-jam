# Declarative Gear Status Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the Gear page to use declarative `Suspense` and `ErrorBoundary` boundaries instead of explicit `isLoading` and `error` guard clauses, leveraging React 19's `use()` hook.

**Architecture:**

- Modify `useMIDIDevices` hook to expose a stable MIDI access promise.
- Update `GearProvider` to propagate this promise through context.
- Refactor `GearPageClient` to consume the promise via `React.use()`, allowing it to suspend or throw naturally.
- Wrap `GearPageClient` in a `Suspense` boundary in the route segment.

**Tech Stack:** Next.js 15, React 19, Web MIDI API.

---

### Task 1: Update MIDI Hooks & Context

**Files:**

- Modify: `src/hooks/use-midi-devices.ts`
- Modify: `src/context/gear-context.tsx`

**Step 1: Refactor `useMIDIDevices` to expose the promise**

- Replace `isLoading` and `error` states with a stable `accessPromise` initialized via `useState(() => requestMIDIAccess())`.
- Ensure event listeners for device changes are attached after the promise resolves.

**Step 2: Update `GearContextType`**

- Add `accessPromise: Promise<WebMidi.MIDIAccess>` to the interface.
- Remove `isLoading` and `error` from the interface.

**Step 3: Update `GearProvider`**

- Pass the `accessPromise` into the context value.

---

### Task 2: Wrap Gear Page in Boundaries

**Files:**

- Modify: `src/app/gear/page.tsx`

**Step 1: Add Suspense boundary**

- Wrap `<GearPageClient />` in `<Suspense fallback={<Loading />}>`.
- Import `Loading` from `@/app/loading`.

---

### Task 3: Refactor GearPageClient to be Declarative

**Files:**

- Modify: `src/app/gear/components/gear-page.client.tsx`

**Step 1: Use `React.use()`**

- Call `const access = use(accessPromise)` at the start of the component.
- Remove explicit `if (isLoading)` and `if (error)` checks.
- Ensure imports are updated (import `use` from `react`).

---

### Task 4: Verification

**Step 1: Manual Verification**

- Run `npm run dev` and navigate to `/gear`.
- Verify the loading fallback appears while MIDI is initializing.
- Verify that denying MIDI access triggers the `error.tsx` boundary.

**Step 2: Automated Checks**

- Run `npm run lint` and `npm run type-check` to ensure no regressions.
