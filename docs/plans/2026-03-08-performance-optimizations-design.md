# Design Doc: TrackLane Performance & useDemoPlayback Refactor

## 1. Problem Statement
- **TrackLane Height**: For long songs, the `TrackLane` height can exceed 150,000px, causing performance degradation, layout glitches, and rendering issues in modern browsers.
- **useDemoPlayback Efficiency**: The current `IntersectionObserver` approach requires observing thousands of DOM elements, which is memory-intensive and computationally expensive for long tracks.

## 2. Proposed Solutions

### 2.1 TrackLane Height Capping
- **Capping Logic**: Limit the maximum height of the `TrackLane` container to **16,000px** using the CSS `min()` function.
- **Visual Scaling**: Since note positions and heights are already percentage-based, they will naturally "squash" for longer songs to fit within the 16,000px limit.
- **Impact**: Improves layout performance and prevents GPU texture overflow.

### 2.2 useDemoPlayback Refactor (rAF + Pointer System)
- **Transition**: Move from `IntersectionObserver` to a `requestAnimationFrame` (rAF) loop.
- **Pointer System**: Use a `nextStartIndex` pointer to scan the `spans` array (already sorted by `startTime`).
- **Active Note Tracking**: Maintain an `activeSpans` set to track notes currently sounding.
- **Efficiency**:
    - $O(1)$ complexity for most frames (just checking the next pointer).
    - Handles multiple notes starting/ending at the same timestamp.
    - Zero DOM observation overhead.
- **Synchronization**: Use `getCurrentTimeMs()` from `useLaneTimeline` to ensure perfect sync between visuals and audio.
- **Offsets**: Account for `LEAD_IN_DEFAULT_MS` when mapping timeline time to note timestamps.

## 3. Data Flow & Integration
- `useDemoPlayback` will now accept a `getCurrentTimeMs: () => number` function.
- The hook will internalize the rAF loop, triggering `onNoteOn` and `onNoteOff` callbacks based on the playback time.

## 4. Testing Strategy
- **Unit Tests**: Update `useDemoPlayback.test.ts` to mock the timeline and verify note triggers at specific timestamps.
- **Visual Verification**: Ensure long tracks (e.g., > 10 mins) render correctly within the 16,000px limit and notes are still playable.
- **Performance**: Monitor main thread usage and GPU memory in Chrome DevTools.
