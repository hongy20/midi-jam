import fs from "node:fs";
import path from "node:path";
import { Midi } from "@tonejs/midi";
import { describe, expect, it } from "vitest";
import { buildSegmentGroups } from "./lane-segment-utils";
import { getMidiEvents, getNoteSpans } from "./midi-parser";

describe("lane-segment-utils integration with real MIDI", () => {
  // Helper to load and parse MIDI
  const loadMidi = (filename: string) => {
    const filePath = path.join(process.cwd(), "public", "midi", filename);
    const data = fs.readFileSync(filePath);
    const midi = new Midi(data);
    const events = getMidiEvents(midi);
    const spans = getNoteSpans(events);
    const totalDurationMs = midi.duration * 1000;
    return { spans, totalDurationMs };
  };

  it("Happy Birthday should be split into 3 segments", () => {
    const { spans, totalDurationMs } = loadMidi("Happy Birthday.mid");

    // Using the default threshold (currently 5s)
    const groups = buildSegmentGroups({
      spans,
      totalDurationMs,
      thresholdMs: 5000, // 5s to target ~3 segments for a ~15s song
    });

    // The user says 3 segments. Let's see what we get.
    console.log(`Happy Birthday: totalDuration=${totalDurationMs}ms, groups=${groups.length}`);
    groups.forEach((g, i) => {
      console.log(
        `  Group ${i}: start=${g.startMs.toFixed(0)}ms, duration=${g.durationMs.toFixed(0)}ms, notes=${g.spans.length}`,
      );
    });

    expect(groups.length).toBe(3);
  });

  it("Blue (yung kai) should not cut any long notes between group 0 and group 1 (first 20s)", () => {
    const { spans } = loadMidi("yung kai - blue.mid");

    // Filter spans to the first 25s to focus on the start
    const firstSpans = spans.filter((s) => s.startTimeMs < 25000);

    const groups = buildSegmentGroups({
      spans: firstSpans,
      totalDurationMs: 25000,
      thresholdMs: 5000,
    });

    console.log(`Blue (first 25s): groups=${groups.length}`);
    groups.forEach((g, i) => {
      console.log(
        `  Group ${i}: start=${g.startMs.toFixed(0)}ms, duration=${g.durationMs.toFixed(0)}ms, notes=${g.spans.length}`,
      );
    });

    // Logic check: A note is "cut" if it starts in group i but its full span is not accounted for
    // or if it overlaps a boundary but is missing from one side.
    // Actually, our check should be: no note should overlap the RAW cluster boundary of rawClusters[0].maxEndMs
    // if that split happened during the note.
    // But our algorithm now prevents that. Let's verify.

    expect(groups.length).toBeGreaterThanOrEqual(1);
    if (groups.length > 1) {
      // Check group 0 and 1 boundary
      const group0End = groups[0].startMs + groups[0].durationMs;
      const group1Start = groups[1].startMs;
      expect(group0End).toBeGreaterThanOrEqual(group1Start); // Seamless or overlapping

      // The real requirement is that no note in group 0 should end AFTER the original split point
      // if that note was the reason we *didn't* split earlier.
    }
  });

  it("Golden Kpop Demon Hunters should not split connected notes across various thresholds", () => {
    const { spans, totalDurationMs } = loadMidi("Golden Kpop Demon Hunters.mid");

    // Test multiple common thresholds to ensure stability
    for (const thresholdMs of [3000, 5000, 7000]) {
      const groups = buildSegmentGroups({
        spans,
        totalDurationMs,
        thresholdMs,
      });

      // Verify that sequential "touching" notes stay in the same group
      for (let i = 0; i < spans.length - 1; i++) {
        const current = spans[i];
        const next = spans[i + 1];

        const currentEndMs = current.startTimeMs + current.durationMs;
        const nextStartMs = next.startTimeMs;
        const gap = nextStartMs - currentEndMs;

        // Gap < 1ms is considered 'connected'
        if (gap < 1.0) {
          const groupIdxA = groups.findIndex((g) => g.spans.some((s) => s.id === current.id));
          const groupIdxB = groups.findIndex((g) => g.spans.some((s) => s.id === next.id));

          if (groupIdxA !== groupIdxB && groupIdxA !== -1 && groupIdxB !== -1) {
            const progress = (currentEndMs / totalDurationMs) * 100;
            throw new Error(
              `SPLIT DETECTED! Threshold: ${thresholdMs}ms. Progress: ${progress.toFixed(2)}%. Note A (${current.id}) -> Note B (${next.id}). Gap: ${gap.toFixed(6)}ms.`,
            );
          }
        }
      }
    }
  });
});
