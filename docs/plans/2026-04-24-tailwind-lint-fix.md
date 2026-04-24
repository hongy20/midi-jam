# Fix Tailwind CSS Lint Warnings Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Resolve all 77 `tailwindcss/no-custom-classname` warnings by updating the ESLint configuration with project-specific theme variables and whitelisted classes.

**Architecture:** Update the `settings.tailwindcss.config` object in `eslint.config.mjs` to include the project's theme mapping. This satisfies the `eslint-plugin-tailwindcss` without requiring code changes across the codebase.

**Tech Stack:** ESLint v9+, `eslint-plugin-tailwindcss`, Tailwind CSS v4.

---

### Task 1: Update ESLint Configuration

**Files:**
- Modify: `eslint.config.mjs:23-28`

**Step 1: Apply theme configuration to settings**

Update the `settings` block in `eslint.config.mjs` to include the full theme mapping and whitelist.

```javascript
  {
    settings: {
      tailwindcss: {
        callees: ["classnames", "clsx", "ctl", "cva", "twMerge"],
        config: {
          theme: {
            extend: {
              colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                card: "var(--card)",
                "card-foreground": "var(--card-foreground)",
                popover: "var(--popover)",
                "popover-foreground": "var(--popover-foreground)",
                primary: "var(--primary)",
                "primary-foreground": "var(--primary-foreground)",
                secondary: "var(--secondary)",
                "secondary-foreground": "var(--secondary-foreground)",
                muted: "var(--muted)",
                "muted-foreground": "var(--muted-foreground)",
                accent: "var(--accent)",
                "accent-foreground": "var(--accent-foreground)",
                destructive: "var(--destructive)",
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                chart: {
                  1: "var(--chart-1)",
                  2: "var(--chart-2)",
                  3: "var(--chart-3)",
                  4: "var(--chart-4)",
                  5: "var(--chart-5)",
                },
                sidebar: {
                  DEFAULT: "var(--sidebar)",
                  foreground: "var(--sidebar-foreground)",
                  primary: "var(--sidebar-primary)",
                  "primary-foreground": "var(--sidebar-primary-foreground)",
                  accent: "var(--sidebar-accent)",
                  "accent-foreground": "var(--sidebar-accent-foreground)",
                  border: "var(--sidebar-border)",
                  ring: "var(--sidebar-ring)",
                },
              },
              fontFamily: {
                sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
                mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular"],
                retro: ["var(--font-retro)", "system-ui"],
              },
            },
          },
        },
        whitelist: ["custom-scrollbar", "btn-jam", "jam-action-group", "retro"],
      },
    },
  },
```

**Step 2: Run lint to verify warnings are gone**

Run: `npx eslint .`
Expected: SUCCESS with 0 problems (or at least 0 `tailwindcss/no-custom-classname` problems).

**Step 3: Commit**

```bash
git add eslint.config.mjs
git commit -m "chore: update eslint tailwind settings to resolve theme warnings"
```
