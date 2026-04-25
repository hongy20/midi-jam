# [Simplify Note Border] Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Simplify the note border CSS to use `currentColor` directly, removing the dependency on the undefined `--note-border-opacity` variable.

**Architecture:** Update the CSS module for HighwaySegment to use a simpler border definition.

**Tech Stack:** CSS Modules, Vanilla CSS.

---

### Task 1: Simplify Note Border CSS

**Files:**
- Modify: `src/features/highway/components/highway-segment.module.css:51-52`

**Step 1: Simplify the border definition**

Modify `src/features/highway/components/highway-segment.module.css`:
```css
  border: 1px solid currentColor;
```

**Step 2: Verify build and lint**

Run: `npm run lint`
Expected: PASS

Run: `npm run build`
Expected: PASS (to ensure no CSS compilation issues)

**Step 3: Commit**

```bash
git add src/features/highway/components/highway-segment.module.css
git commit -m "fix: simplify note border by using currentColor directly"
```
