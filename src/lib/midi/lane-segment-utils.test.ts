import { describe, expect, it } from "vitest";
import {
  computeSegmentLifespans,
  filterSpansForSegment,
  getCurrentSegmentIndex,
  getVisibleSegmentIndexes,
  segmentAnimationCurrentTime,
} from "./lane-segment-utils";
import type { NoteSpan } from "./midi-parser";

describe("lane-segment-utils", () => {
  const segmentDuration = 10000; // 10s

  describe("getCurrentSegmentIndex", () => {
    it("returns correct index for various times", () => {
      expect(getCurrentSegmentIndex(0, segmentDuration)).toBe(0);
      expect(getCurrentSegmentIndex(5000, segmentDuration)).toBe(0);
      expect(getCurrentSegmentIndex(10000, segmentDuration)).toBe(1);
      expect(getCurrentSegmentIndex(25000, segmentDuration)).toBe(2);
    });
  });

  describe("getVisibleSegmentIndexes", () => {
    it("clumps indexes at the start of a track", () => {
      const totalMs = 30000; // 3 segments
      const lifespans = computeSegmentLifespans([], totalMs, segmentDuration);
      // At t=0, segments 0 and 1 are in view. Since they have no notes, their endMs is original.
      // Math.max(0, 0-1) = 0, current = 0, next = 1
      const active = getVisibleSegmentIndexes(0, lifespans, segmentDuration);
      expect(active).toEqual([0, 1]); // Set deduplicates
    });

    it("keeps segments alive if they own long notes", () => {
      const totalMs = 50000; // 5 segments
      const spans: NoteSpan[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 30000, velocity: 1 }, // 30s note in segment 0
      ];
      const lifespans = computeSegmentLifespans(
        spans,
        totalMs,
        segmentDuration,
      );

      // At t=25s, currentIndex = 2. default [1, 2, 3]
      // Segment 0 maxEndMs is 30s. Since 25s <= 30s + LANE_FALL_TIME_MS, segment 0 is kept!
      const active = getVisibleSegmentIndexes(
        25000,
        lifespans,
        segmentDuration,
      );
      expect(active).toEqual([0, 1, 2, 3]);
    });
  });

  describe("segmentAnimationCurrentTime", () => {
    it("calculates correct offset including fallTimeMs", () => {
      // (masterTime - segmentIndex * duration) + 3000
      expect(segmentAnimationCurrentTime(15000, 1, segmentDuration)).toBe(
        5000 + 3000,
      );
    });
  });

  describe("filterSpansForSegment", () => {
    const mockSpans: NoteSpan[] = [
      {
        id: "1",
        note: 60,
        startTimeMs: 2000,
        durationMs: 1000,
        velocity: 0.8,
      },
      {
        id: "2",
        note: 61,
        startTimeMs: 9000,
        durationMs: 2000,
        velocity: 0.8,
      },
      {
        id: "3",
        note: 62,
        startTimeMs: 17000,
        durationMs: 1000,
        velocity: 0.8,
      },
    ];

    it("filters spans for the first segment (0-10s)", () => {
      const filtered = filterSpansForSegment(mockSpans, 0, segmentDuration);
      expect(filtered).toHaveLength(2);
      expect(filtered.map((s) => s.id)).toContain("1");
      expect(filtered.map((s) => s.id)).toContain("2");
    });

    it("filters spans for the second segment (10-20s)", () => {
      const filtered = filterSpansForSegment(mockSpans, 1, segmentDuration);
      // Note "2" starts at 9000ms, so it belongs exclusively to Segment 0!
      // Only Note "3" starts in Segment 1.
      expect(filtered).toHaveLength(1);
      expect(filtered.map((s) => s.id)).toContain("3");
    });

    it("returns empty for segment with no notes", () => {
      const filtered = filterSpansForSegment(mockSpans, 5, segmentDuration);
      expect(filtered).toHaveLength(0);
    });
  });
});
