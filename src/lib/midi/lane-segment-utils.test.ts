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
      // Gap is from 2000ms to 12000ms. Midpoint is 7000ms.
      const groups = buildSegmentGroups(spans, threshold);

      expect(groups).toHaveLength(2);

      // First group: Starts at 0, ends at midpoint 7000.
      expect(groups[0].startMs).toBe(0);
      expect(groups[0].durationMs).toBe(7000);

      // Second group: Starts at 7000, ends at maxEnd (13000).
      // (The dummy note cluster would naturally extend this in a real scenario).
      expect(groups[1].startMs).toBe(7000);
      expect(groups[1].durationMs).toBe(13000 - 7000);
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
      const groups = buildSegmentGroups(spans, threshold);

      expect(groups).toHaveLength(2);
      expect(groups[0].spans[0].id).toBe("1");
      expect(groups[1].spans[0].id).toBe("2");
      // Seamless stitching
      expect(groups[0].startMs + groups[0].durationMs).toBe(groups[1].startMs);
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
      const groups = buildSegmentGroups(spans, threshold);

      expect(groups).toHaveLength(2);
      expect(groups[0].spans).toHaveLength(1);
      expect(groups[1].spans).toHaveLength(2);
    });

    it("allows durationMs to be large for long notes", () => {
      const spans: NoteSpan[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 30000, velocity: 1 },
      ];
      const groups = buildSegmentGroups(spans, threshold);

      expect(groups).toHaveLength(1);
      expect(groups[0].durationMs).toBe(30000);
    });
  });

  describe("getVisibleSegmentIndexes", () => {
    const groups = [
      { index: 0, startMs: 0, durationMs: 10000, spans: [] },
      { index: 1, startMs: 10000, durationMs: 10000, spans: [] },
      { index: 2, startMs: 20000, durationMs: 10000, spans: [] },
    ];

    it("identifies active groups plus buffer based on sliding window", () => {
      const visibleStart = getVisibleSegmentIndexes(0, groups);
      expect(visibleStart).toEqual([0, 1]);

      const visibleMid = getVisibleSegmentIndexes(15000, groups);
      expect(visibleMid).toEqual([0, 1, 2]);

      const visibleEnd = getVisibleSegmentIndexes(25000, groups);
      expect(visibleEnd).toEqual([1, 2]);
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
