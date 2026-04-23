import { describe, expect, it } from "vitest";

import { LANE_SCROLL_DURATION_MS } from "./constants";
import { computeLaneSegmentAnimationDelay, getVisibleSegmentIndexes } from "./utils";

describe("visualizer utilities", () => {
  describe("getVisibleSegmentIndexes", () => {
    const groups = [
      { index: 0, startMs: 0, durationMs: 10000, notes: [] },
      { index: 1, startMs: 10000, durationMs: 10000, notes: [] },
      { index: 2, startMs: 20000, durationMs: 10000, notes: [] },
    ];

    it("identifies active groups based on aggressive scrolling window", () => {
      const sd = 3000;
      // T=0: Only group 0 is visible. Group 1 starts at 10000, visible at 10000-3000=7000.
      const visibleStart = getVisibleSegmentIndexes(0, groups, sd);
      expect(visibleStart).toEqual([0]);

      // T=7000: Group 1 should now be mounting as it's exactly at the entry boundary.
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
