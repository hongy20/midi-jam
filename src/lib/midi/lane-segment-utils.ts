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

export interface SegmentGroup {
  index: number;
  startMs: number;
  durationMs: number;
  spans: NoteSpan[];
}

/**
 * Groups notes into discrete clusters for rendering.
 * A new group is started when the current group's time span exceeds thresholdMs,
 * provided we aren't splitting a chord (notes with identical startTimeMs).
 */
export function buildSegmentGroups(
  spans: NoteSpan[],
  thresholdMs = 10000,
): SegmentGroup[] {
  const groups: SegmentGroup[] = [];
  if (spans.length === 0) return groups;

  let currentStartMs = spans[0].startTimeMs;
  let currentMaxEndMs = spans[0].startTimeMs + spans[0].durationMs;
  let currentGroupSpans: NoteSpan[] = [];
  let lastStartTimeMs = -1;

  for (const span of spans) {
    const spanEndMs = span.startTimeMs + span.durationMs;

    // Boundary check: Does it exceed the threshold? Are we NOT splitting a chord?
    if (
      currentGroupSpans.length > 0 &&
      span.startTimeMs - currentStartMs >= thresholdMs &&
      span.startTimeMs > lastStartTimeMs
    ) {
      groups.push({
        index: groups.length,
        startMs: currentStartMs,
        durationMs: currentMaxEndMs - currentStartMs,
        spans: currentGroupSpans,
      });

      // Reset for the next group
      currentStartMs = span.startTimeMs;
      currentMaxEndMs = spanEndMs;
      currentGroupSpans = [];
    }

    currentGroupSpans.push(span);
    lastStartTimeMs = span.startTimeMs;
    if (spanEndMs > currentMaxEndMs) {
      currentMaxEndMs = spanEndMs;
    }
  }

  // Flush the final group
  if (currentGroupSpans.length > 0) {
    groups.push({
      index: groups.length,
      startMs: currentStartMs,
      durationMs: currentMaxEndMs - currentStartMs,
      spans: currentGroupSpans,
    });
  }

  return groups;
}

/**
 * Returns an array of segment indexes that should be visibly mounted in the DOM.
 */
export function getVisibleSegmentIndexes(
  currentTimeMs: number,
  segmentGroups: SegmentGroup[],
): number[] {
  const visible: number[] = [];

  for (let i = 0; i < segmentGroups.length; i++) {
    const { startMs, durationMs } = segmentGroups[i];
    const endMs = startMs + durationMs;

    // Active if current playback time is anywhere between when the segment first enters the screen (startMs - fallTime)
    // and when the longest note finishes leaving the screen (endMs + fallTime)
    if (
      currentTimeMs >= startMs - LANE_FALL_TIME_MS &&
      currentTimeMs <= endMs + LANE_FALL_TIME_MS
    ) {
      visible.push(i);
    }
  }

  return visible;
}

// filterSpansForSegment was removed. buildSegmentGroups now pre-filters the notes into groups.

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
 * Calculates the exact translateY for a segment based on its group boundaries.
 */
export function computeSegmentTranslateY(
  masterCurrentTimeMs: number,
  groupStartMs: number,
  groupDurationMs: number,
  containerHeightPx: number,
): number {
  const fallTimeMs = LANE_FALL_TIME_MS;
  const segmentHeightPx = containerHeightPx * (groupDurationMs / fallTimeMs);

  // Animation covers travel: -segmentHeightPx to containerHeightPx
  const totalTravelMs = groupDurationMs + fallTimeMs;
  const animTimeMs = masterCurrentTimeMs - groupStartMs + fallTimeMs;

  const progress = animTimeMs / totalTravelMs;

  return -segmentHeightPx + progress * (containerHeightPx + segmentHeightPx);
}
