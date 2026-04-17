import { describe, expect, it } from "vitest";
import { LANE_SCROLL_DURATION_MS } from "./constant";
import {
  buildMidiNoteGroups,
  computeLaneSegmentAnimationDelay,
  getVisibleSegmentIndexes,
} from "./lane-segment-utils";
import type { MidiNote } from "@/shared/types/midi";

describe("lane-segment-utils clustering", () => {
  const threshold = 10000; // 10s

  describe("buildMidiNoteGroups", () => {
    it("groups sequential notes and stitches at midpoints", () => {
      const spans: MidiNote[] = [
        { id: "1", note: 60, startTimeMs: 1000, durationMs: 1000, velocity: 1 },
        {
          id: "2",
          note: 62,
          startTimeMs: 12000,
          durationMs: 15000, // Long enough to avoid tail merge with threshold 10k
          velocity: 1,
        },
      ];
      // Gap is from 2000ms to 12000ms. Midpoint is 7000ms.
      const groups = buildMidiNoteGroups({
        spans,
        totalDurationMs: 40000,
        thresholdMs: threshold,
      });

      expect(groups).toHaveLength(2);

      // First group: Starts at 0, ends at midpoint 7000.
      expect(groups[0].startMs).toBe(0);
      expect(groups[0].durationMs).toBe(7000);

      // Second group: Starts at 7000, ends at totalDurationMs (40000).
      expect(groups[1].startMs).toBe(7000);
      expect(groups[1].durationMs).toBe(40000 - 7000);
    });

    it("breaks groups exceeding the threshold", () => {
      const spans: MidiNote[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 1000, velocity: 1 },
        {
          id: "2",
          note: 62,
          startTimeMs: 11000,
          durationMs: 15000, // Long enough to avoid tail merge
          velocity: 1,
        },
      ];
      const groups = buildMidiNoteGroups({
        spans,
        totalDurationMs: 40000,
        thresholdMs: threshold,
      });

      expect(groups).toHaveLength(2);
      expect(groups[0].spans[0].id).toBe("1");
      expect(groups[1].spans[0].id).toBe("2");
      // Seamless stitching
      expect(groups[0].startMs + groups[0].durationMs).toBe(groups[1].startMs);
    });

    it("protects chords from being split across groups", () => {
      const spans: MidiNote[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 1000, velocity: 1 },
        {
          id: "2a",
          note: 64,
          startTimeMs: 15000,
          durationMs: 15000, // Long enough
          velocity: 1,
        },
        {
          id: "2b",
          note: 67,
          startTimeMs: 15000,
          durationMs: 15000,
          velocity: 1,
        },
      ];
      const groups = buildMidiNoteGroups({
        spans,
        totalDurationMs: 40000,
        thresholdMs: threshold,
      });

      expect(groups).toHaveLength(2);
      expect(groups[0].spans).toHaveLength(1);
      expect(groups[1].spans).toHaveLength(2);
    });

    it("allows durationMs to be large for long notes", () => {
      const spans: MidiNote[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 30000, velocity: 1 },
      ];
      const groups = buildMidiNoteGroups({
        spans,
        totalDurationMs: 40000,
        thresholdMs: threshold,
      });

      expect(groups).toHaveLength(1);
      expect(groups[0].durationMs).toBe(40000);
    });

    it("does not split a long note that overlaps a later short note", () => {
      const spans: MidiNote[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 15000, velocity: 1 }, // Ends at 15s
        { id: "2", note: 62, startTimeMs: 500, durationMs: 200, velocity: 1 },
        { id: "3", note: 64, startTimeMs: 11000, durationMs: 500, velocity: 1 }, // 11s - 15s is not a 10s gap
      ];
      const groups = buildMidiNoteGroups({
        spans,
        totalDurationMs: 20000,
        thresholdMs: threshold,
      });

      // Split would have happened if we compared 11s to 0s (startMs).
      // But now we compare 11s to 15s (maxEndMs), gap is negative, no split.
      expect(groups).toHaveLength(1);
    });

    it("does not merge the last segment if it is visually large enough", () => {
      const spans: MidiNote[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 1000, velocity: 1 },
        {
          id: "2",
          note: 62,
          startTimeMs: 15000,
          durationMs: 100,
          velocity: 1,
        },
      ];
      // totalDuration is 20000. thresholdMs is 10000.
      // Note 2 starts at 15000. Remaining time is 5000ms.
      // Since 5000ms >= 10000ms / 2, and the note is far from Note 1,
      // it should form its own visually distinct segment [7500, 20000].
      const groups = buildMidiNoteGroups({
        spans,
        totalDurationMs: 20000,
        thresholdMs: threshold,
      });

      expect(groups).toHaveLength(2);
      expect(groups[1].spans).toHaveLength(1);
      expect(groups[1].startMs).toBe(8000);
      expect(groups[1].durationMs).toBe(20000 - 8000);
    });

    it("groups connected notes that start exactly when previous notes end", () => {
      const spans: MidiNote[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 6000, velocity: 1 }, // Exceeds 5s threshold
        { id: "2", note: 62, startTimeMs: 6000, durationMs: 6000, velocity: 1 }, // Starts exactly at 6000
      ];
      const groups = buildMidiNoteGroups({
        spans,
        totalDurationMs: 20000,
        thresholdMs: 5000,
      });

      // Should be 1 group because they are connected (span.startTimeMs <= currentMaxEndMs)
      expect(groups).toHaveLength(1);
    });

    it("does not split chords even if they exceed the threshold", () => {
      const spans: MidiNote[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 1000, velocity: 1 },
        {
          id: "2a",
          note: 64,
          startTimeMs: 6000,
          durationMs: 1000,
          velocity: 1,
        },
        {
          id: "2b",
          note: 67,
          startTimeMs: 6000,
          durationMs: 1000,
          velocity: 1,
        },
      ];
      const groups = buildMidiNoteGroups({
        spans,
        totalDurationMs: 20000,
        thresholdMs: 5000,
      });

      expect(groups).toHaveLength(2);
      expect(groups[1].spans).toHaveLength(2); // Chord 2a, 2b together
    });

    it("groups connected notes with sub-millisecond gaps (floating point precision)", () => {
      const spans: MidiNote[] = [
        {
          id: "1",
          note: 60,
          startTimeMs: 0,
          durationMs: 5000.00000000001,
          velocity: 1,
        },
        {
          id: "2",
          note: 62,
          startTimeMs: 5000.00000000002,
          durationMs: 1000,
          velocity: 1,
        },
      ];
      const groups = buildMidiNoteGroups({
        spans,
        totalDurationMs: 20000,
        thresholdMs: 4000,
      });

      // Should be 1 group despite the tiny gap
      expect(groups).toHaveLength(1);
    });

    it("applies tail merge logic to avoid tiny segments at the end", () => {
      const spans: MidiNote[] = [
        { id: "1", note: 60, startTimeMs: 0, durationMs: 1000, velocity: 1 },
        { id: "2", note: 62, startTimeMs: 6000, durationMs: 1000, velocity: 1 },
        {
          id: "3",
          note: 64,
          startTimeMs: 12000,
          durationMs: 1000,
          velocity: 1,
        },
      ];
      // totalDuration is 14000.
      // If we attempt to split at Note 3 (12000), the remaining time in the song is 2000ms.
      // 2000ms < 2500ms (thresholdMs / 2), so Note 3 should be merged into the current segment.
      const groups = buildMidiNoteGroups({
        spans,
        totalDurationMs: 14000,
        thresholdMs: 5000,
      });

      expect(groups).toHaveLength(2);
      expect(groups[1].spans).toHaveLength(2); // Notes 2 and 3 merged
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
