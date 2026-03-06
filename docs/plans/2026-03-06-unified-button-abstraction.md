# Unified Button Abstraction Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a shared `Button` component with standardized sizes and variants. Strictly enforce styling by removing `className` and providing `sm`, `md`, and `lg` variants.

**Architecture:** A single `Button` component with `primary`/`secondary` variants and `sm`/`md`/`lg` sizes. External layout (grid/flex) is handled by page-level containers.

**Tech Stack:** Next.js 15, React 19, Lucide Icons, CSS Modules, Vitest.

---

### Task 1: Update `Button` Component

**Files:**
- Modify: `src/components/button/button.tsx`
- Modify: `src/components/button/button.module.css`
- Modify: `src/components/button/button.test.tsx`

**Step 1: Update the test**

```tsx
/* src/components/button/button.test.tsx */
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";
import { describe, it, expect, vi } from "vitest";
import { Play } from "lucide-react";

describe("Button", () => {
  it("renders with children and handles clicks", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with an icon", () => {
    render(<Button icon={Play}>Play</Button>);
    expect(screen.getByText("Play")).toBeDefined();
    const icon = document.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText("Small")).toBeDefined();
    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText("Large")).toBeDefined();
  });
});
```

**Step 2: Update styling**

```css
/* src/components/button/button.module.css */
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 900;
  text-transform: uppercase;
  border-radius: 9999px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  width: fit-content;
}

.button:active {
  transform: scale(0.95);
}

.button:hover:not(:disabled) {
  transform: scale(1.02);
}

.button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Variants */
.primary {
  background-color: var(--ui-btn-primary-bg);
  color: var(--ui-btn-primary-text);
  box-shadow: var(--ui-btn-primary-shadow);
}

.secondary {
  background-color: var(--ui-btn-secondary-bg);
  border-color: var(--ui-btn-secondary-border);
  color: var(--ui-btn-secondary-text);
}

/* Sizes */
.sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.md {
  padding: var(--btn-py) var(--btn-px);
  font-size: var(--btn-text);
}

.lg {
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
  border-radius: 2rem;
}

@media (orientation: landscape) {
  .lg {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.sm .icon {
  width: 1rem;
  height: 1rem;
}

.button:hover .iconSlideRight {
  transform: translateX(4px);
}

.button:hover .iconSlideLeft {
  transform: translateX(-4px);
}
```

**Step 3: Update implementation**

```tsx
/* src/components/button/button.tsx */
import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./button.module.css";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "right",
  children,
  ...props
}: ButtonProps) {
  const iconName = Icon?.displayName || Icon?.name || "";
  const isArrowRight = iconName.includes("ChevronRight") || iconName.includes("ArrowRight");
  const isArrowLeft = iconName.includes("ArrowLeft") || iconName.includes("ChevronLeft");

  const iconClasses = `
    ${styles.icon} 
    ${isArrowRight ? styles.iconSlideRight : ""} 
    ${isArrowLeft ? styles.iconSlideLeft : ""}
  `;

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} group`}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className={iconClasses} />}
      {children}
      {Icon && iconPosition === "right" && <Icon className={iconClasses} />}
    </button>
  );
}
```

**Step 4: Commit**

```bash
git add src/components/button/
git commit -m "feat: add size prop to Button and remove className for immutability"
```

---

### Task 2: Refactor Welcome Page

**Step 1: Wrap buttons in grid cells for layout and use `size="lg"`.**

**Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "refactor: use standardized Button sizes in Welcome page"
```

---

### Task 3: Refactor Gear Page

**Step 1: Use `size="sm"` for header and `size="md"` for footer.**

**Step 2: Commit**

```bash
git add src/app/gear/page.tsx
git commit -m "refactor: use standardized Button sizes in Gear page"
```

---

### Task 4: Refactor Collection Page

**Step 1: Wrap buttons in flex containers for layout and use appropriate sizes.**

**Step 2: Commit**

```bash
git add src/app/collection/page.tsx
git commit -m "refactor: use standardized Button sizes in Collection page"
```

---

### Task 5: Final Validation

**Step 1: Run full suite**
Run: `npm run lint && npm run type-check && npm test`

**Step 2: Build project**
Run: `npm run build`

**Step 3: Commit any fixes**
```bash
git commit -m "chore: final validation and fixes"
```
