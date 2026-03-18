import { LANE_FALL_TIME_MS } from "./constant";
import type { NoteSpan } from "./midi-parser";

/**
 * Returns the index of the segment that contains the given time.
 */
export function getCurrentSegmentIndex(
  currentTimeMs: number,
  laneSegmentDurationMs: number,
): number {
  return Math.floor(currentTimeMs / laneSegmentDurationMs);
}

export interface SegmentLifespan {
  startMs: number;
  endMs: number;
  maxEndMs: number;
}

/**
 * Calculates the visual lifecycle times for each segment.
 * A segment needs to stay conceptually mounted until its longest owned note finishes.
 */
export function computeSegmentLifespans(
  spans: NoteSpan[],
  totalDurationMs: number,
  laneSegmentDurationMs: number,
): SegmentLifespan[] {
  const segmentCount = Math.ceil(totalDurationMs / laneSegmentDurationMs);
  const lifespans: SegmentLifespan[] = Array.from(
    { length: segmentCount },
    (_, i) => ({
      startMs: i * laneSegmentDurationMs,
      endMs: (i + 1) * laneSegmentDurationMs,
      maxEndMs: (i + 1) * laneSegmentDurationMs,
    }),
  );

  for (const span of spans) {
    const startTimeMs = span.startTimeMs;
    const endTimeMs = span.startTimeMs + span.durationMs;
    const segmentIndex = Math.floor(startTimeMs / laneSegmentDurationMs);

    if (segmentIndex >= 0 && segmentIndex < segmentCount) {
      if (endTimeMs > lifespans[segmentIndex].maxEndMs) {
        lifespans[segmentIndex].maxEndMs = endTimeMs;
      }
    }
  }

  return lifespans;
}

/**
 * Returns an array of segment indexes that should be visibly mounted in the DOM.
 */
export function getVisibleSegmentIndexes(
  currentTimeMs: number,
  segmentLifespans: SegmentLifespan[],
  laneSegmentDurationMs: number,
): number[] {
  const visible = new Set<number>();
  const currentIndex = getCurrentSegmentIndex(
    currentTimeMs,
    laneSegmentDurationMs,
  );

  const segmentCount = segmentLifespans.length;
  if (segmentCount > 0) {
    visible.add(Math.max(0, currentIndex - 1));
    visible.add(Math.min(Math.max(0, currentIndex), segmentCount - 1));
    visible.add(Math.min(currentIndex + 1, segmentCount - 1));
  }

  // Add any segments whose dynamically calculated longest note hasn't cleared the screen yet
  for (let i = 0; i < segmentLifespans.length; i++) {
    const { startMs, maxEndMs } = segmentLifespans[i];
    // Active if current playback time is anywhere between when the segment first enters the screen (startMs - fallTime)
    // and when the longest note finishes leaving the screen (maxEndMs + fallTime)
    if (
      currentTimeMs >= startMs - LANE_FALL_TIME_MS &&
      currentTimeMs <= maxEndMs + LANE_FALL_TIME_MS
    ) {
      visible.add(i);
    }
  }

  return Array.from(visible).sort((a, b) => a - b);
}

/**
 * Filters a list of spans to only those that fall within a given segment's time window.
 * Spans belong to a segment ONLY if their start time falls within the window.
 */
export function filterSpansForSegment(
  spans: NoteSpan[],
  segmentIndex: number,
  laneSegmentDurationMs: number,
): NoteSpan[] {
  const windowStartMs = segmentIndex * laneSegmentDurationMs;
  const windowEndMs = windowStartMs + laneSegmentDurationMs;

  return spans.filter((span) => {
    // A span is owned by this segment if it starts within this window block
    return span.startTimeMs >= windowStartMs && span.startTimeMs < windowEndMs;
  });
}

/**
 * Calculates the currentTime to set on a specific segment's animation
 * to align it with the master timeline.
 * The animation starts when the segment starts entering the screen (3s before hit).
 */
export function segmentAnimationCurrentTime(
  masterCurrentTimeMs: number,
  segmentIndex: number,
  laneSegmentDurationMs: number,
): number {
  return (
    masterCurrentTimeMs -
    segmentIndex * laneSegmentDurationMs +
    LANE_FALL_TIME_MS
  );
}

/**
 * Calculates the exact translateY for a segment based on the master timeline.
 * Used for imperative positioning to avoid animation drift/jitter.
 */
export function computeSegmentTranslateY(
  masterCurrentTimeMs: number,
  segmentIndex: number,
  containerHeightPx: number,
  laneSegmentDurationMs: number,
): number {
  const fallTimeMs = LANE_FALL_TIME_MS;
  const segmentHeightPx =
    containerHeightPx * (laneSegmentDurationMs / fallTimeMs);

  // Animation covers travel: -segmentHeightPx to containerHeightPx
  // over (laneSegmentDurationMs + fallTimeMs).
  const totalTravelMs = laneSegmentDurationMs + fallTimeMs;
  const animTimeMs =
    masterCurrentTimeMs - segmentIndex * laneSegmentDurationMs + fallTimeMs;

  const progress = animTimeMs / totalTravelMs;

  // Linear interpolation: start + progress * (end - start)
  return -segmentHeightPx + progress * (containerHeightPx + segmentHeightPx);
}
