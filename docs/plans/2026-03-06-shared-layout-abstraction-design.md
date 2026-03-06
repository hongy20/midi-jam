# Design: Shared Layout Abstraction

**Date:** 2026-03-06
**Status:** Approved
**Goal:** Abstract React components from pages to reduce size and focus on logic.

## 1. Architecture: Skeleton vs. Frames

We will introduce a **Layout-First Abstraction** to separate the "Viewport Skeleton" from "Page Content."

### 1.1 `PageLayout` (The Skeleton)
- **Role:** Enforces the `100dvw/h` viewport lock and the `3-row grid` structure.
- **Centering Logic:** The `main` slot will use Flexbox (`items-center justify-center`) to ensure content is always centered by default.
- **Grid Structure:** `grid-template-rows: auto 1fr auto`.

### 1.2 `PageHeader` & `PageFooter` (The Frames)
- **Role:** Standardize spacing and alignment for page titles and action buttons.
- **Design:** Simple Flex containers that handle `justify-between` and `gap` logic consistently.

## 2. Component APIs & Styling

### 2.1 `PageLayout`
- **Location:** `src/components/page-layout/`
- **Props:**
  ```tsx
  interface PageLayoutProps {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode; // Flexible middle section (centered)
    className?: string; // Container overrides (e.g. background theme)
  }
  ```
- **Styling:** `page-layout.module.css` (using CSS Modules).

### 2.2 `PageHeader` & `PageFooter`
- **`PageHeader`:** Standardizes `flex justify-between` layout for titles and back buttons.
- **`PageFooter`:** Standardizes `flex items-center justify-end` layout for action buttons.

## 3. Data Flow & Refactored Page Structure

### 3.1 Page Transformation Pattern
Pages will transform from "Layout Managers" into "Logic Orchestrators":
- **State:** Stays at the Page level.
- **Actions:** Handled via callbacks passed to abstracted components.
- **Styling:** Shared structure in `PageLayout.module.css`; unique visuals in page-specific CSS modules.

## 4. Testing & Validation
- **Unit Tests:** Use Vitest to ensure `PageLayout` renders slots correctly and enforces centering.
- **Visual Check:** Verify centering on `Welcome`, `Gear`, and `Collection` pages.
- **Regression:** Ensure `Play` page maintains its dynamic `--start-unit` and `--end-unit` alignment.
