# 8bitcn UI Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete visual overhaul of midi-jam to feature a retro/8-bit aesthetic by incorporating `8bitcn.com` (a trusted shadcn/ui registry), Storybook 10.3, and mapping the high-performance play stage to the new semantic theme variables.

**Architecture:** 
1. Initialize shadcn via custom `components.json` tracking `www.8bitcn.com`.
2. Configure Storybook with MCP for isolated component work and GitHub actions for CD.
3. Replace existing css variable structures in `globals.css` with 8bitcn's Default & Nintendo themes.
4. Progressively refactor existing UI sections (Shell -> Main Menu -> Options -> Gear) while preserving the optimized, non-react DOM tree logic for the Play stage.

**Tech Stack:** Next.js 16+, React 19, Tailwind CSS v4, vitest, Storybook 10.3

---

### Task 1: Initialize Shadcn & Theming Environment

**Files:**
- Create: `components.json`
- Modify: `src/app/globals.css`

**Step 1: Write initial configuration**
Initialize shadcn configuration targeting local `src/components` and generic global styles. 

**Step 2: Add 8bitcn Themes to globals.css**
Update `globals.css` to remove old themes and replace them with the 8bitcn themes.

**Step 3: Commit**
```bash
git add components.json src/app/globals.css
git commit -m "chore: initialize 8bitcn shadcn configuration and retro themes"
```

### Task 2: Setup Storybook & MCP Integration

**Files:**
- Create: `.storybook/main.ts`
- Create: `.storybook/preview.ts`
- Create: `.github/workflows/storybook.yml`

**Step 1: Scaffold Storybook**
Run `npx storybook@latest init` configured for React 19 bounds and `next` builder.

**Step 2: Install MCP**
Execute `npx storybook add @storybook/addon-mcp` to expose UI artifacts securely to agents.

**Step 3: Commit**
```bash
git add .storybook/ package.json package-lock.json .github/workflows/
git commit -m "chore: setup storybook 10.3 and mcp addon"
```

### Task 3: Refactor Global Shell & Stage CSS Mapping

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/play/page.tsx`

**Step 1: Implement Component Injection**
Swap `<main>` standard HTML controls for the 8bit Button and Card wrappers where appropriate. In `play/page.tsx`, map inline or module CSS variables like `--piano-key-white` to the newly established 8bitcn colors.

**Step 2: Commit**
```bash
git add src/app/layout.tsx src/app/play/
git commit -m "feat: migrate shell and stage styles to 8bitcn variables"
```

### Tasks 4+: Incremental Page Overhauls
*These will be executed individually, submitted for verification, and squashed per the SOP.*
- **Task 4:** Refactor Main Menu to use 8bitcn `Menu` and `Hero` blocks.
- **Task 5:** Refactor Gear / Setup flow using modular `GearCards`.
- **Task 6:** Refactor Options screen using 8bitcn `RetroModeSwitcher` and `Slider`.
