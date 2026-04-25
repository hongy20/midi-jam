import { type MidiNoteGroup } from "@/shared/types/midi";

import { LANE_SCROLL_DURATION_MS } from "./constants";

/**
 * Returns an array of segment indexes that should be visibly mounted in the DOM.
 * We follow an aggressive strategy: a segment is only mounted if it is within
 * the scrolling window [T - scrollDurationMs, T + scrollDurationMs].
 */
export function getVisibleSegmentIndexes(
  currentTimeMs: number,
  segmentGroups: MidiNoteGroup[],
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

/**
 * Computes the CSS `animation-delay` (always negative) that phase-locks a LaneSegment's
 * fall animation to the master playback clock.
 */
export function computeLaneSegmentAnimationDelay(
  mountTimeMs: number,
  groupStartMs: number,
): number {
  return -(mountTimeMs - groupStartMs + LANE_SCROLL_DURATION_MS);
}
