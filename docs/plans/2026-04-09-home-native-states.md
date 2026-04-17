# Home Native States & Renaming Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Re-architect the Home page state to leverage Next.js native `loading.tsx` and `error.tsx` files and rename all "Welcome" components to "Home" for consistency.

**Architecture:**

- `page.tsx` (Server Component) handles a 1s delay and renders `HomePageClient`.
- `home-page.client.tsx` (Client Component) handles hooks and renders `HomePageView`.
- `home-page.view.tsx` handles the main rendering and MIDI capability check.
- `loading.tsx` and `error.tsx` provide native Next.js routing states.

**Tech Stack:** Next.js App Router, React Server/Client Components.

---

### Task 1: Rename View Components and Files

**Files:**

- Rename: `src/app/home/welcome-page.view.tsx` -> `src/app/home/home-page.view.tsx`
- Rename: `src/app/home/welcome-page.view.test.tsx` -> `src/app/home/home-page.view.test.tsx`
- Rename: `src/app/home/welcome-page.view.stories.tsx` -> `src/app/home/home-page.view.stories.tsx`

**Step 1: Rename file and component**
Change `WelcomePageView` to `HomePageView`.

### Task 2: Rename Client Container and Files

**Files:**

- Rename: `src/app/home/welcome-page.container.tsx` -> `src/app/home/home-page.client.tsx`

**Step 1: Rename file and component**
Change `WelcomePageContainer` to `HomePageClient`.

### Task 3: Update Page and Tests

**Files:**

- Modify: `src/app/home/page.tsx`
- Modify: `src/app/home/page.test.tsx`

**Step 1: Rename Page component**
Change `WelcomePage` to `HomePage` in `src/app/home/page.tsx`.

---

(Note: Previous tasks from the original plan are effectively merged here)
