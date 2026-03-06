# Design: Unified Button Abstraction

**Date:** 2026-03-06
**Status:** Approved
**Goal:** Abstract primary and secondary buttons from headers and footers to unify styling and simplify page logic.

## 1. Architecture: Primitives & Variants

We will introduce a single `Button` component in `src/components/button/` that replaces all manual button implementations.

### 1.1 Variants
- **Primary:** Solid background (`--ui-btn-primary-bg`), high contrast text, and distinct shadow. Used for main "Call to Action" (e.g., "START JAM", "PLAY", "CONTINUE").
- **Secondary:** Subtle background (`--ui-btn-secondary-bg`), bordered, and low contrast text. Used for navigation and utility actions (e.g., "Back", "Options", "Main Menu").

### 1.2 Responsive Sizing
- **CSS Variables:** The component will exclusively use the global CSS variables (`--btn-px`, `--btn-py`, `--btn-text`) defined in `variables.css`.
- **Responsive Logic:** Buttons will automatically scale across mobile, desktop, and landscape orientations based on these variables.

## 2. Component API & Iconography

### 2.1 `Button` Props
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  icon?: LucideIcon; // Accepts a Lucide icon component
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}
```

### 2.2 Icon Handling
- **Gap:** Standardized `gap-2` (responsive).
- **Animation:** Built-in "hover slide" animation for arrow/chevron icons (e.g., `group-hover:translate-x-1`).

## 3. Data Flow & Refactored Page Structure

### 3.1 Page Transformation Pattern
Pages will use the `Button` component to replace blocks of Tailwind classes:
- **Events:** Handled via standard `onClick` callbacks.
- **Styling:** Internal appearance is managed by `button.module.css`; external positioning can be adjusted via `className`.

## 4. Testing & Validation
- **Unit Tests:** Ensure `Button` renders with correct variant classes and handles icon positions.
- **Visual Check:** Verify that buttons on `Welcome`, `Gear`, and `Collection` pages are identical in style and responsive behavior.
- **Regression:** Ensure `Play` page pause button maintains its unique styling while utilizing the same underlying logic if possible.
