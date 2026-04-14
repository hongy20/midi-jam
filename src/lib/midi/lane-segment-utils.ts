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

export interface BuildSegmentGroupsOptions {
  spans: NoteSpan[];
  totalDurationMs: number;
  thresholdMs: number;
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
export function buildSegmentGroups({
  spans,
  totalDurationMs,
  thresholdMs,
}: BuildSegmentGroupsOptions): SegmentGroup[] {
  if (spans.length === 0) return [];

  const groups: SegmentGroup[] = [];
  let currentGroupSpans: NoteSpan[] = [];
  let currentStartMs = 0; // First segment starts at 0 (lead-in)
  let currentMaxEndMs = 0;

  spans.forEach((span, index) => {
    const spanEndMs = span.startTimeMs + span.durationMs;
    const isFirstNote = currentGroupSpans.length === 0;

    // Inclusion Criteria:
    // 1. First note in a new segment.
    // 2. Or the segment's visual duration is still under the threshold.
    // 3. Or the note is connected to/overlapping with the current cluster extent.
    // 4. Or starting a new segment now would leave a tiny "tail" at the end of the song.
    const visualDuration = span.startTimeMs - currentStartMs;
    const isUnderThreshold = visualDuration < thresholdMs;
    const isConnected = span.startTimeMs <= currentMaxEndMs + 1.0;
    const isTailTooSmall = totalDurationMs - span.startTimeMs < thresholdMs / 2;

    if (isFirstNote || isUnderThreshold || isConnected || isTailTooSmall) {
      currentGroupSpans.push(span);
      currentMaxEndMs = Math.max(currentMaxEndMs, spanEndMs);
    } else {
      // Finalize current group and split
      const nextNoteStartMs = span.startTimeMs;
      const midpoint = (currentMaxEndMs + nextNoteStartMs) / 2;

      groups.push({
        index: groups.length,
        startMs: currentStartMs,
        durationMs: midpoint - currentStartMs,
        spans: currentGroupSpans,
      });

      // Start new group from the midpoint
      currentStartMs = midpoint;
      currentGroupSpans = [span];
      currentMaxEndMs = spanEndMs;
    }

    // Finalize the last group when we reach the end of the spans
    if (index === spans.length - 1) {
      groups.push({
        index: groups.length,
        startMs: currentStartMs,
        durationMs: totalDurationMs - currentStartMs,
        spans: currentGroupSpans,
      });
    }
  });

  return groups;
}

/**
 * Returns an array of segment indexes that should be visibly mounted in the DOM.
 * We follow an aggressive strategy: a segment is only mounted if it is within
 * the scrolling window [T - scrollDurationMs, T + scrollDurationMs].
 */
export function getVisibleSegmentIndexes(
  currentTimeMs: number,
  segmentGroups: SegmentGroup[],
  scrollDurationMs: number,
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
  // Check the sliding window [currentIndex - 1, currentIndex, currentIndex + 1]
  // against the actual visibility bounds.
  for (let i = currentIndex - 1; i <= currentIndex + 1; i++) {
    if (i >= 0 && i < segmentGroups.length) {
      const group = segmentGroups[i];
      const groupEndMs = group.startMs + group.durationMs;

      // A segment is visible if it hasn't completely scrolled past the bottom
      // AND it is within the pre-mount window above the viewport.
      // The lower bound is exactly on visual entry.
      const isVisible =
        currentTimeMs >= group.startMs - scrollDurationMs &&
        currentTimeMs <= groupEndMs + scrollDurationMs;

      if (isVisible) {
        visible.push(i);
      }
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
