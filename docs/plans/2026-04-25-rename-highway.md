# Rename NoteHighway to Highway

Rename the `note-highway` feature to `highway`, update component names from `NoteHighway` to `Highway`, and flatten the component directory structure.

## Proposed Changes

### [Component Name]

#### [DELETE] [note-highway](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/note-highway)
#### [NEW] [highway](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/highway)

Summary of moves and renames:
- `src/features/note-highway` -> `src/features/highway`
- `src/features/highway/components/note-highway/NoteHighway.tsx` -> `src/features/highway/components/Highway.tsx`
- `src/features/highway/components/note-highway/NoteHighwaySegment.tsx` -> `src/features/highway/components/HighwaySegment.tsx`
- `src/features/highway/components/note-highway/note-highway-segment.module.css` -> `src/features/highway/components/highway-segment.module.css`
- `src/features/highway/components/note-highway/note-highway.stories.tsx` -> `src/features/highway/components/highway.stories.tsx`
- `src/features/highway/components/note-highway/note-highway.test.tsx` -> `src/features/highway/components/highway.test.tsx`

#### [MODIFY] [index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/highway/index.ts)
- Update export path and component name.

#### [MODIFY] [Highway.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/highway/components/Highway.tsx)
- Rename component and props.
- Update internal imports.

#### [MODIFY] [HighwaySegment.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/highway/components/HighwaySegment.tsx)
- Rename component and props.
- Update CSS module import.

#### [MODIFY] [highway.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/highway/components/highway.stories.tsx)
- Update component name, title, and imports.

#### [MODIFY] [highway.test.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/highway/components/highway.test.tsx)
- Update component name and imports.

#### [MODIFY] [play-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/play-page.view.tsx)
- Update import path and component usage.

## Verification Plan

### Automated Tests
- `npm run lint`
- `npm run type-check`
- `npm test src/features/highway`
- `npm run build`

### Manual Verification
- Verify Storybook shows the renamed "Highway" component.
- Verify gameplay still works and the highway is rendered correctly.
