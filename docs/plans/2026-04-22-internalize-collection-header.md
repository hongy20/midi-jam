# Internalize CollectionHeader into CollectionPageView

The goal is to simplify the `collection` feature by moving the `CollectionHeader` component into the `CollectionPageView` file, as it is only used there and is a small UI element.

## Proposed Changes

### collection feature

#### [MODIFY] [collection-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/collection/components/collection-page.view.tsx)
- Move `CollectionHeader` component definition into this file.
- Remove import of `CollectionHeader` from `./collection-header`.

#### [DELETE] [collection-header.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/collection/components/collection-header.tsx)
- Delete this file as it's no longer needed.

## Verification Plan

### Automated Tests
- Run `npm run lint` to ensure no broken imports.
- Run `npm run type-check` to verify types.

### Manual Verification
- Check the Collection page in the browser to ensure the header still looks correct (typography, spacing).
