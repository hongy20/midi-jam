# Cleanup Debugging Semi-Transparent Backgrounds

The goal is to remove the semi-transparent background colors used for debugging segment boundaries in the `LaneSegment` component. These colors were added temporarily to visualize how the "falldown" segments are grouped and positioned but are no longer needed for production visual quality.

## User Review Required

> [!IMPORTANT]
> This change strictly removes the `debugColor` logic and `backgroundColor` inline style from `LaneSegment`. It does not affect any other debug logging or tools.

## Proposed Changes

### [Component Name] [Play Stage]

#### [MODIFY] [lane-segment.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/lane-stage/lane-segment.tsx)

- Remove the `debugColor` array and index calculation.
- Remove the `backgroundColor: debugColor` property from the `style` object in the container `div`.

## Open Questions

None.

## Verification Plan

### Automated Tests
- `npm run lint`: Ensure no linting errors are introduced by removing variables.
- `npm run type-check`: Ensure TypeScript is still happy.
- `npm run build`: Verify production build stability.

### Manual Verification
- Launch the `Play` page in `dev` mode and verify that the segments no longer have the colored backgrounds.
