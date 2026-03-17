import { describe, expect, it } from "vitest";
import {
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
      expect(getVisibleSegmentIndexes(0, totalMs, segmentDuration)).toEqual([
        0, 0, 1,
      ]);
    });

    it("returns previous, current, and next mid-track", () => {
      const totalMs = 50000; // 5 segments
      expect(getVisibleSegmentIndexes(15000, totalMs, segmentDuration)).toEqual(
        [0, 1, 2],
      );
      expect(getVisibleSegmentIndexes(25000, totalMs, segmentDuration)).toEqual(
        [1, 2, 3],
      );
    });

    it("clumps indexes at the end of a track", () => {
      const totalMs = 25000; // 3 segments (0, 1, 2)
      expect(getVisibleSegmentIndexes(22000, totalMs, segmentDuration)).toEqual(
        [1, 2, 2],
      );
    });
  });

  describe("segmentAnimationCurrentTime", () => {
    it("calculates correct offset including fallTimeMs", () => {
      // (masterTime - segmentIndex * duration) + 3000
      expect(segmentAnimationCurrentTime(15000, 1, segmentDuration)).toBe(
        5000 + 3000,
      );
      expect(segmentAnimationCurrentTime(25000, 2, segmentDuration)).toBe(
        5000 + 3000,
      );
      expect(segmentAnimationCurrentTime(5000, 0, segmentDuration)).toBe(
        5000 + 3000,
      );
    });
  });

  describe("filterSpansForSegment", () => {
    const mockSpans: NoteSpan[] = [
      {
        id: "1",
        note: 60,
        startTime: 0, // 0s + 2s lead-in = 2000ms
        duration: 1, // Ends at 3000ms
        velocity: 0.8,
      },
      {
        id: "2",
        note: 61,
        startTime: 7, // 7s + 2s lead-in = 9000ms
        duration: 2, // Ends at 11000ms
        velocity: 0.8,
      },
      {
        id: "3",
        note: 62,
        startTime: 15, // 15s + 2s lead-in = 17000ms
        duration: 1, // Ends at 18000ms
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
      expect(filtered).toHaveLength(2);
      expect(filtered.map((s) => s.id)).toContain("2");
      expect(filtered.map((s) => s.id)).toContain("3");
    });

    it("returns empty for segment with no notes", () => {
      const filtered = filterSpansForSegment(mockSpans, 5, segmentDuration);
      expect(filtered).toHaveLength(0);
    });
  });
});
