import { describe, expect, it } from "vitest";
import { LANE_SCROLL_DURATION_MS } from "./constant";
import {
  buildSegmentGroups,
  computeLaneSegmentAnimationDelay,
  getVisibleSegmentIndexes,
} from "./lane-segment-utils";
import type { NoteSpan } from "./midi-parser";

describe("lane-segment-utils clustering", () => {
  const threshold = 10000; // 10s

  describe("buildSegmentGroups", () => {
    it("groups sequential notes and stitches at midpoints", () => {
      const spans: NoteSpan[] = [
        { id: "1", note: 60, startTimeMs: 1000, durationMs: 1000, velocity: 1 },
        {
          id: "2",
          note: 62,
          startTimeMs: 12000,
          durationMs: 1000,
          velocity: 1,
        },
      ];
      // With thresholdMs = 10000, the duration of each raw cluster (1000ms)
      // is less than thresholdMs, so they will be merged by Pass 1.5.
      const groups = buildSegmentGroups({
        spans,
        totalDurationMs: 15000,
        thresholdMs: threshold,
      });

      expect(groups).toHaveLength(1);
      expect(groups[0].spans).toHaveLength(2);
      expect(groups[0].spans.map((s) => s.id)).toEqual(["1", "2"]);
      expect(groups[0].startMs + groups[0].durationMs).toBe(15000); // Stitched to totalDurationMs
    });

    it("breaks groups exceeding the threshold", () => {
      const spans: NoteSpan[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 1000, velocity: 1 },
        {
          id: "2",
          note: 62,
          startTimeMs: 11000,
          durationMs: 1000,
          velocity: 1,
        },
      ];
      // With thresholdMs = 10000, the duration of each raw cluster (1000ms)
      // is less than thresholdMs, so they will be merged by Pass 1.5.
      const groups = buildSegmentGroups({
        spans,
        totalDurationMs: 15000,
        thresholdMs: threshold,
      });

      expect(groups).toHaveLength(1);
      expect(groups[0].spans).toHaveLength(2);
      expect(groups[0].spans.map((s) => s.id)).toEqual(["1", "2"]);
      expect(groups[0].startMs + groups[0].durationMs).toBe(15000); // Stitched to totalDurationMs
    });

    it("protects chords from being split across groups", () => {
      const spans: NoteSpan[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 1000, velocity: 1 },
        {
          id: "2a",
          note: 64,
          startTimeMs: 10000,
          durationMs: 1000,
          velocity: 1,
        },
        {
          id: "2b",
          note: 67,
          startTimeMs: 10000,
          durationMs: 1000,
          velocity: 1,
        },
      ];
      // With thresholdMs = 10000, the duration of each raw cluster (1000ms)
      // is less than thresholdMs, so the first two will be merged, and then
      // the third will be merged with the result, ending in one group.
      const groups = buildSegmentGroups({
        spans,
        totalDurationMs: 15000,
        thresholdMs: threshold,
      });

      expect(groups).toHaveLength(1);
      expect(groups[0].spans).toHaveLength(3);
      expect(groups[0].spans.map((s) => s.id)).toEqual(["1", "2a", "2b"]);
      expect(groups[0].startMs + groups[0].durationMs).toBe(15000); // Stitched to totalDurationMs
    });

    it("allows durationMs to be large for long notes", () => {
      const spans: NoteSpan[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 30000, velocity: 1 },
      ];
      const groups = buildSegmentGroups({
        spans,
        totalDurationMs: 40000,
        thresholdMs: threshold,
      });

      expect(groups).toHaveLength(1);
      expect(groups[0].durationMs).toBe(40000);
    });

    it("does not split a long note that spans over a gap followed by a short note", () => {
      const spans: NoteSpan[] = [
        // Long note from 0ms to 20000ms
        {
          id: "long",
          note: 60,
          startTimeMs: 0,
          durationMs: 20000,
          velocity: 1,
        },
        // Short note at 15000ms, still within the long note's duration
        {
          id: "short",
          note: 62,
          startTimeMs: 15000,
          durationMs: 500,
          velocity: 1,
        },
      ];
      const groups = buildSegmentGroups({
        spans,
        totalDurationMs: 25000,
        thresholdMs: threshold, // 10s threshold
      });

      // Expect only one group because the "short" note is within the "long" note's duration,
      // and the gap between the end of the long note (20000ms) and the start of the short note
      // is negative, so it should not trigger a split.
      expect(groups).toHaveLength(1);
      expect(groups[0].spans).toHaveLength(2);
      expect(groups[0].spans.map((s) => s.id)).toEqual(["long", "short"]);
    });

    it("merges a tiny last segment with the previous one if its duration is below threshold", () => {
      const smallThreshold = 500; // Define a small threshold for this test
      const spans: NoteSpan[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 1000, velocity: 1 },
        { id: "2", note: 62, startTimeMs: 2000, durationMs: 50, velocity: 1 }, // Tiny segment
      ];
      const totalDuration = 3000;
      const groups = buildSegmentGroups({
        spans,
        totalDurationMs: totalDuration,
        thresholdMs: smallThreshold,
      });

      // Expect only one group because the second segment is tiny (50ms < 500ms threshold)
      // and should be merged with the first.
      expect(groups).toHaveLength(1);
      expect(groups[0].spans).toHaveLength(2);
      expect(groups[0].spans.map((s) => s.id)).toEqual(["1", "2"]);
      // The maxEndMs of the merged group should be the max of the original two, but then
      // Pass 2 stitches it to totalDurationMs.
      expect(groups[0].startMs + groups[0].durationMs).toBe(totalDuration);
      expect(groups[0].startMs).toBe(0);
    });
  });

  describe("getVisibleSegmentIndexes", () => {
    const groups = [
      { index: 0, startMs: 0, durationMs: 10000, spans: [] },
      { index: 1, startMs: 10000, durationMs: 10000, spans: [] },
      { index: 2, startMs: 20000, durationMs: 10000, spans: [] },
    ];

    it("identifies active groups based on aggressive scrolling window", () => {
      const sd = 3000;
      // T=0: Only group 0 is visible. Group 1 starts at 10000, visible at 10000-3000=7000.
      const visibleStart = getVisibleSegmentIndexes(0, groups, sd);
      expect(visibleStart).toEqual([0]);

      // T=7000: Group 1 should now be mounting as it's within early-scroll buffer.
      const visibleMount = getVisibleSegmentIndexes(7000, groups, sd);
      expect(visibleMount).toEqual([0, 1]);

      // T=15000: Group 0 is off-screen (10000+3000=13000), Group 2 is not yet on-screen (20000-3000=17000).
      const visibleMid = getVisibleSegmentIndexes(15000, groups, sd);
      expect(visibleMid).toEqual([1]);

      // T=25000: Group 1 is off-screen (20000+3000=23000), Group 2 is active.
      const visibleEnd = getVisibleSegmentIndexes(25000, groups, sd);
      expect(visibleEnd).toEqual([2]);
    });
  });

  describe("computeLaneSegmentAnimationDelay", () => {
    it("calculates the correct negative delay for phase-locking", () => {
      const mountTimeMs = 5000;
      const groupStartMs = 2000;
      const delay = computeLaneSegmentAnimationDelay(mountTimeMs, groupStartMs);
      expect(delay).toBe(-(5000 - 2000 + LANE_SCROLL_DURATION_MS));
    });
  });
});
