# Implementation Plan - Update AGENTS.md Styling Rules

This plan outlines the updates to `AGENTS.md` to reflect the latest project standards for UI component management, styling, and navigation patterns.

## User Review Required

> [!IMPORTANT]
> This update removes the explicit requirement for uppercase labels on primary buttons. Casing will now be handled as part of the unified styling in CSS or left to the developer's discretion.

## Proposed Changes

### [Documentation]

#### [MODIFY] [AGENTS.md](file:///Users/yanhong/Github/hongy20/midi-jam/AGENTS.md)

1.  **Section 0. UI Component Management**:
    - Add a "Purity" rule: Keep components in `src/components/ui/` as "vanilla" as possible. Avoid project-specific customizations in these files to simplify updates from the 8bitcn/shadcn registry.
2.  **Section 3. Architecture & Styling Standards**:
    - Add a "Mobile-First" rule: Codify the mobile-first CSS principle, using `@media` queries for larger viewports.
3.  **Section 4. UI & Navigation Architecture**:
    - Remove Section 4.3 `Navigation Patterns` -> `Button Semantics`.
    - Add a new Section 4.3 `Unified Action Styling`: Reference the use of `.btn-jam` and `.jam-action-group` (defined in `base.css`) for consistent button layouts and responsive behavior.

## Verification Plan

### Manual Verification
- Verify that `AGENTS.md` accurately reflects the new rules and that no outdated rules remain.
- Ensure the wording is clear and concise, following the existing project documentation style.
