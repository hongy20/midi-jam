# Shared Layout Abstraction Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Abstract React components from pages to reduce size and focus on logic by introducing a shared `PageLayout`, `PageHeader`, and `PageFooter`.

**Architecture:** We use a "Skeleton vs. Frames" approach. `PageLayout` enforces the viewport lock and 3-row grid, while `PageHeader`/`PageFooter` provide consistent spacing for titles and actions. Centering logic is baked into the `PageLayout`'s main slot.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, CSS Modules, Vitest.

---

## Design Specifications

### 1. Architecture: Skeleton vs. Frames

We separate the "Viewport Skeleton" from "Page Content."

#### 1.1 `PageLayout` (The Skeleton)

- **Role:** Enforces the `100dvw/h` viewport lock and the `3-row grid` structure.
- **Centering Logic:** The `main` slot will use Flexbox (`items-center justify-center`) to ensure content is always centered by default.
- **Grid Structure:** `grid-template-rows: auto 1fr auto`.

#### 1.2 `PageHeader` & `PageFooter` (The Frames)

- **Role:** Standardize spacing and alignment for page titles and action buttons.
- **Design:** Simple Flex containers that handle `justify-between` and `gap` logic consistently.

### 2. Component APIs & Styling

#### 2.1 `PageLayout`

- **Location:** `src/components/page-layout/`
- **Props:**
  ```tsx
  interface PageLayoutProps {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode; // Flexible middle section (centered)
    className?: string; // Container overrides (e.g. background theme)
    style?: React.CSSProperties; // Dynamic style overrides
  }
  ```
- **Styling:** `page-layout.module.css` (using CSS Modules).

#### 2.2 `PageHeader` & `PageFooter`

- **`PageHeader`:** Standardizes `flex justify-between` layout for titles and back buttons.
- **`PageFooter`:** Standardizes `flex items-center justify-end` layout for action buttons.

---

## Implementation Tasks

### Task 1: Create `PageLayout` Component

**Files:**

- Create: `src/components/page-layout/page-layout.tsx`
- Create: `src/components/page-layout/page-layout.module.css`
- Create: `src/components/page-layout/page-layout.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { PageLayout } from "./page-layout";
import { describe, it, expect } from "vitest";

describe("PageLayout", () => {
  it("renders header, footer, and children in the correct slots", () => {
    render(
      <PageLayout
        header={<div data-testid="header">Header</div>}
        footer={<div data-testid="footer">Footer</div>}
      >
        <div data-testid="content">Content</div>
      </PageLayout>,
    );
    expect(screen.getByTestId("header")).toBeDefined();
    expect(screen.getByTestId("footer")).toBeDefined();
    expect(screen.getByTestId("content")).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/page-layout/page-layout.test.tsx`
Expected: FAIL (Module not found)

**Step 3: Write minimal implementation**

```css
/* page-layout.module.css */
.container {
  width: 100dvw;
  height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: var(--background);
  color: var(--foreground);
  overflow: hidden;
}

.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
```

```tsx
/* page-layout.tsx */
import type { ReactNode } from "react";
import styles from "./page-layout.module.css";

interface PageLayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function PageLayout({ header, footer, children, className = "", style }: PageLayoutProps) {
  return (
    <div className={`${styles.container} ${className}`} style={style}>
      {header && <header className={styles.header}>{header}</header>}
      <main className={styles.main}>{children}</main>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </div>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test src/components/page-layout/page-layout.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/page-layout/
git commit -m "feat: add PageLayout component with CSS Modules"
```

---

### Task 2: Create `PageHeader` & `PageFooter` Components

**Files:**

- Create: `src/components/page-header.tsx`
- Create: `src/components/page-footer.tsx`

**Step 1: Implement `PageHeader`**

```tsx
import type { ReactNode } from "react";

interface PageHeaderProps {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, children, className = "" }: PageHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between py-[var(--header-py)] px-6 sm:px-8 w-full max-w-5xl mx-auto ${className}`}
    >
      {typeof title === "string" ? (
        <h1 className="text-[var(--h1-size)] font-black text-foreground uppercase tracking-tighter">
          {title}
        </h1>
      ) : (
        title
      )}
      <div className="flex items-center gap-4">{children}</div>
    </div>
  );
}
```

**Step 2: Implement `PageFooter`**

```tsx
import type { ReactNode } from "react";

interface PageFooterProps {
  children: ReactNode;
  className?: string;
}

export function PageFooter({ children, className = "" }: PageFooterProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-end gap-4 py-[var(--footer-py)] px-6 sm:px-8 w-full max-w-5xl mx-auto ${className}`}
    >
      {children}
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/page-header.tsx src/components/page-footer.tsx
git commit -m "feat: add PageHeader and PageFooter primitives"
```

---

### Task 3: Refactor Welcome Page

**Files:**

- Modify: `src/app/page.tsx`

**Step 1: Refactor to use `PageLayout`**
Replace the monolithic JSX with `PageLayout`, `PageHeader`, and `PageFooter`.

**Step 2: Verify visually**
Ensure centering and layout remain identical.

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "refactor: use PageLayout in Welcome page"
```

---

### Task 4: Refactor Gear Page

**Files:**

- Modify: `src/app/gear/page.tsx`

**Step 1: Refactor `GearContent` to use `PageLayout`, `PageHeader`, and `PageFooter`.**

**Step 2: Commit**

```bash
git add src/app/gear/page.tsx
git commit -m "refactor: use PageLayout in Gear page"
```

---

### Task 5: Refactor Collection Page

**Files:**

- Modify: `src/app/collection/page.tsx`

**Step 1: Refactor to use `PageLayout`, `PageHeader`, and `PageFooter`.**

**Step 2: Commit**

```bash
git add src/app/collection/page.tsx
git commit -m "refactor: use PageLayout in Collection page"
```

---

### Task 6: Refactor Play Page

**Files:**

- Modify: `src/app/play/page.tsx`

**Step 1: Refactor to use `PageLayout`.**
Note: Keep the dynamic CSS variables `--start-unit` and `--end-unit` on the `PageLayout` className/style.

**Step 2: Commit**

```bash
git add src/app/play/page.tsx
git commit -m "refactor: use PageLayout in Play page"
```

---

### Task 7: Final Validation

**Step 1: Run full suite**
Run: `npm run lint && npm run type-check && npm test`

**Step 2: Build project**
Run: `npm run build`

**Step 3: Commit any fixes**

```bash
git commit -m "chore: final validation and fixes"
```
