# Tailwind Refactor for PlayPageView (2026-04-25)

Switching from CSS Modules to Tailwind CSS in `PlayPageView` for consistency with the rest of the project and to leverage Tailwind v4's power.

## Proposed Changes

### [Play] Component

#### [MODIFY] [play-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/play-page.view.tsx)
- Replace CSS module classes with Tailwind equivalents.
- Remove the CSS module import.

#### [DELETE] [play-page.view.module.css](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/play-page.view.module.css)
- Remove the file as it's no longer needed.

## Class Mappings

| CSS Class | Tailwind Classes |
| :--- | :--- |
| `.container` | `w-screen h-dvh grid grid-rows-[5rem_1fr] bg-background text-foreground overflow-hidden` |
| `.header` | `w-full px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-sm border-b-4 border-foreground dark:border-ring` |
| `.songInfo` | `flex flex-col flex-1` |
| `.badge` | `text-foreground/60 font-black uppercase tracking-[0.2em] text-[10px] mb-1 font-retro` |

## Verification Plan

### Automated Tests
- `npm run lint`
- `npm run build`

### Manual Verification
- Visual check of the Play page.
