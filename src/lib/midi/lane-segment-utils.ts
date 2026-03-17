import { LANE_FALL_TIME_MS, LEAD_IN_DEFAULT_MS } from "./constant";
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

/**
 * Returns the [prev, current, next] segment indexes, clamped to the valid range.
 */
export function getVisibleSegmentIndexes(
  currentTimeMs: number,
  totalDurationMs: number,
  laneSegmentDurationMs: number,
): [number, number, number] {
  const segmentCount = Math.ceil(totalDurationMs / laneSegmentDurationMs);
  const currentIndex = getCurrentSegmentIndex(
    currentTimeMs,
    laneSegmentDurationMs,
  );

  const prev = Math.max(0, currentIndex - 1);
  const current = Math.min(Math.max(0, currentIndex), segmentCount - 1);
  const next = Math.min(currentIndex + 1, segmentCount - 1);

  return [prev, current, next];
}

/**
 * Filters a list of spans to only those that fall within a given segment's time window.
 * Spans are included if their start time or end time falls within the window.
 */
export function filterSpansForSegment(
  spans: NoteSpan[],
  segmentIndex: number,
  laneSegmentDurationMs: number,
): NoteSpan[] {
  const windowStartMs = segmentIndex * laneSegmentDurationMs;
  const windowEndMs = windowStartMs + laneSegmentDurationMs;

  return spans.filter((span) => {
    // Note times in spans are in seconds and relative to the song start (post lead-in).
    // We must add LEAD_IN_DEFAULT_MS to get the absolute time in the master timeline.
    const startTimeMs = span.startTime * 1000 + LEAD_IN_DEFAULT_MS;
    const endTimeMs =
      (span.startTime + span.duration) * 1000 + LEAD_IN_DEFAULT_MS;

    // A span is visible in this segment if it overlaps with the window [windowStartMs, windowEndMs]
    return startTimeMs < windowEndMs && endTimeMs > windowStartMs;
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
