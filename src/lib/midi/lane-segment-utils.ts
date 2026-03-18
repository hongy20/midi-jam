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
 * We follow a sliding window strategy of [prev, current, next] to ensure a smooth
 * mounting buffer, even if the clusters are large or sparse.
 */
export function getVisibleSegmentIndexes(
  currentTimeMs: number,
  segmentGroups: SegmentGroup[],
): number[] {
  if (segmentGroups.length === 0) return [];

  // Find the 'current' group (the one we are in or just passed)
  let currentIndex = 0;
  for (let i = 0; i < segmentGroups.length; i++) {
    if (currentTimeMs >= segmentGroups[i].startMs) {
      currentIndex = i;
    } else {
      break;
    }
  }

  const visible: number[] = [];
  // Return [currentIndex - 1, currentIndex, currentIndex + 1], clamped to bounds
  for (let i = currentIndex - 1; i <= currentIndex + 1; i++) {
    if (i >= 0 && i < segmentGroups.length) {
      visible.push(i);
    }
  }

  return visible;
}

// filterSpansForSegment was removed. buildSegmentGroups now pre-filters the notes into groups.

/**
 * Computes the CSS `animation-delay` (always negative) that phase-locks a LaneSegment's
 * fall animation to the master playback clock at the moment the element is inserted into
 * the DOM.
 *
 * A negative delay tells the browser to start the animation as if it began |delay| ms ago,
 * which is exactly equivalent to the linear-interpolation logic of the old sync-loop.
 *
 * @param mountTimeMs  - Snapshot of getCurrentTimeMs() taken inside useLayoutEffect.
 * @param groupStartMs - The group's startMs (master clock time when the group begins).
 */
export function computeLaneSegmentAnimationDelay(
  mountTimeMs: number,
  groupStartMs: number,
): number {
  return -(mountTimeMs - groupStartMs + LANE_FALL_TIME_MS);
}
