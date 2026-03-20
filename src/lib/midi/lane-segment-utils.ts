import { LANE_SCROLL_DURATION_MS } from "./constant";
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
 *
 * Algorithm:
 * 1. Pass 1: Identify note clusters (Raw Groups) based on thresholdMs.
 * 2. Pass 2: 'Stitch' adjacent segments together at the midpoint of their temporal gaps.
 *    This ensures a seamless, non-overlapping visual experience and provides natural
 *    lead-in/lead-out buffers for animations.
 */
export function buildSegmentGroups(
  spans: NoteSpan[],
  thresholdMs = 10000,
): SegmentGroup[] {
  if (spans.length === 0) return [];

  // Pass 1: Core Discovery (find raw note clusters)
  const rawClusters: {
    minStartMs: number;
    maxEndMs: number;
    spans: NoteSpan[];
  }[] = [];

  let currentStartMs = spans[0].startTimeMs;
  let currentMaxEndMs = spans[0].startTimeMs + spans[0].durationMs;
  let currentGroupSpans: NoteSpan[] = [];
  let lastStartTimeMs = -1;

  for (const span of spans) {
    const spanEndMs = span.startTimeMs + span.durationMs;

    if (
      currentGroupSpans.length > 0 &&
      span.startTimeMs - currentStartMs >= thresholdMs &&
      span.startTimeMs > lastStartTimeMs
    ) {
      rawClusters.push({
        minStartMs: currentStartMs,
        maxEndMs: currentMaxEndMs,
        spans: currentGroupSpans,
      });

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

  if (currentGroupSpans.length > 0) {
    rawClusters.push({
      minStartMs: currentStartMs,
      maxEndMs: currentMaxEndMs,
      spans: currentGroupSpans,
    });
  }

  // Pass 2: Boundary Stitching (Midpoint Buffering)
  const groups: SegmentGroup[] = [];

  for (let i = 0; i < rawClusters.length; i++) {
    const cluster = rawClusters[i];

    // Start bound: midpoint with previous, or 0 for the first group
    const startMs =
      i === 0 ? 0 : (rawClusters[i - 1].maxEndMs + cluster.minStartMs) / 2;

    // End bound: midpoint with next, or current cluster end for the last group.
    // The dummy note added in midi-loader.ts ensures that cluster.maxEndMs
    // already includes the required LEAD_OUT_DEFAULT_MS.
    const endMs =
      i === rawClusters.length - 1
        ? cluster.maxEndMs
        : (cluster.maxEndMs + rawClusters[i + 1].minStartMs) / 2;

    groups.push({
      index: i,
      startMs,
      durationMs: endMs - startMs,
      spans: cluster.spans,
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
  return -(mountTimeMs - groupStartMs + LANE_SCROLL_DURATION_MS);
}
