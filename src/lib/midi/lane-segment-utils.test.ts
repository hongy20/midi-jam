import { describe, expect, it } from "vitest";
import { LANE_FALL_TIME_MS } from "./constant";
import {
  buildSegmentGroups,
  computeLaneSegmentAnimationDelay,
  getVisibleSegmentIndexes,
} from "./lane-segment-utils";
import type { NoteSpan } from "./midi-parser";

describe("lane-segment-utils clustering", () => {
  const threshold = 10000; // 10s

  describe("buildSegmentGroups", () => {
    it("groups sequential notes within the threshold", () => {
      const spans: NoteSpan[] = [
        { id: "1", note: 60, startTimeMs: 1000, durationMs: 1000, velocity: 1 },
        { id: "2", note: 62, startTimeMs: 5000, durationMs: 1000, velocity: 1 },
      ];
      const groups = buildSegmentGroups(spans, threshold);

      expect(groups).toHaveLength(1);
      expect(groups[0].spans).toHaveLength(2);
      expect(groups[0].startMs).toBe(1000);
      expect(groups[0].durationMs).toBe(5000 + 1000 - 1000); // end of last note - start of first
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
    });

    it("protects chords from being split across groups", () => {
      const spans: NoteSpan[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 1000, velocity: 1 },
        // This note is exactly at the 10s threshold - should trigger a break BEFORE it
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
      expect(groups[0].spans).toHaveLength(1); // 1
      expect(groups[1].spans).toHaveLength(2); // 2a, 2b stay together
    });

    it("allows durationMs to be much larger than threshold if notes are long", () => {
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
    ];

    it("identifies active groups based on time windows", () => {
      // At t=0, only group 0 is visible (0 is within 0-3000 to 10000+3000)
      const visibleStart = getVisibleSegmentIndexes(0, groups);
      expect(visibleStart).toEqual([0]);

      // At t=8000, both are visible
      // group 0: 8000 is within 0-3000 to 10000+3000
      // group 1: 8000 is within 10000-3000 to 20000+3000
      const visibleMid = getVisibleSegmentIndexes(8000, groups);
      expect(visibleMid).toContain(0);
      expect(visibleMid).toContain(1);
    });

    it("identifies nothing if time is far out", () => {
      const visible = getVisibleSegmentIndexes(50000, groups);
      expect(visible).toHaveLength(0);
    });
  });

  describe("computeLaneSegmentAnimationDelay", () => {
    it("calculates the correct negative delay for phase-locking", () => {
      const mountTimeMs = 5000;
      const groupStartMs = 2000;
      // delay = -(mountTimeMs - groupStartMs + LANE_FALL_TIME_MS)
      // delay = -(5000 - 2000 + 3000) = -6000
      const delay = computeLaneSegmentAnimationDelay(mountTimeMs, groupStartMs);
      expect(delay).toBe(-(5000 - 2000 + LANE_FALL_TIME_MS));
    });

    it("results in a negative delay even if mount happens before group start", () => {
      const mountTimeMs = 1000;
      const groupStartMs = 2000;
      // delay = -(1000 - 2000 + 3000) = -2000
      const delay = computeLaneSegmentAnimationDelay(mountTimeMs, groupStartMs);
      expect(delay).toBe(-(1000 - 2000 + LANE_FALL_TIME_MS));
    });
  });
});
