import { describe, expect, it, vi } from "vitest";
import { LEAD_IN_DEFAULT_MS, LEAD_OUT_DEFAULT_MS } from "./constant";
import { loadMidiFile } from "./midi-loader";

// Mock @tonejs/midi
interface MockMidi {
  header: {
    ppq: number;
    tempos: { ticks: number; bpm: number }[];
    timeSignatures: { ticks: number; timeSignature: [number, number] }[];
    secondsToTicks: (seconds: number) => number;
    update: () => void;
  };
  tracks: {
    notes: { ticks: number; duration: number; time: number; midi?: number; velocity?: number }[];
    controlChanges: {
      [key: number]: { ticks: number }[];
    };
    pitchBends: { ticks: number }[];
  }[];
  duration: number;
}

vi.mock("@tonejs/midi", () => {
  return {
    Midi: vi.fn().mockImplementation(function (this: MockMidi) {
      this.header = {
        ppq: 480,
        tempos: [{ ticks: 0, bpm: 120 }],
        timeSignatures: [{ ticks: 0, timeSignature: [4, 4] }],
        secondsToTicks: vi.fn().mockReturnValue(1920),
        update: vi.fn(),
      };
      this.tracks = [
        {
          notes: [
            { ticks: 0, duration: 1, time: 0 },
            { ticks: 4800, duration: 1, time: 5 },
          ],
          controlChanges: {
            7: [{ ticks: 1000 }],
          },
          pitchBends: [{ ticks: 1500 }],
        },
      ];
      Object.defineProperty(this, "duration", {
        get: () => 6,
      });
    }),
  };
});

describe("midi-loader loadMidiFile", () => {
  const leadInS = LEAD_IN_DEFAULT_MS / 1000;
  const leadOutS = LEAD_OUT_DEFAULT_MS / 1000;

  it("loads and patches MIDI file", async () => {
    // Mock fetch
    const mockArrayBuffer = new ArrayBuffer(0);
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(mockArrayBuffer),
    });

    const midi = await loadMidiFile("http://example.com/test.mid");

    const shiftTicks = 1920; // 2s @ 120bpm, 480ppq

    expect(midi.header.secondsToTicks).toHaveBeenCalledWith(leadInS);
    expect(midi.tracks[0].notes[0].ticks).toBe(shiftTicks);
    expect(midi.tracks[0].notes[1].ticks).toBe(4800 + shiftTicks);

    // Header shift
    expect(midi.header.tempos).toHaveLength(2);
    expect(midi.header.tempos[0].ticks).toBe(0);
    expect(midi.header.tempos[1].ticks).toBe(shiftTicks);

    expect(midi.header.update).toHaveBeenCalled();

    // Duration extension via dummy note
    // (2 original notes + 1 dummy note)
    expect(midi.tracks[0].notes).toHaveLength(3);
    const dummyNote = midi.tracks[0].notes[2];
    expect(dummyNote.midi).toBe(0);
    expect(dummyNote.velocity).toBe(0);
    expect(dummyNote.time).toBe(6 + leadOutS);
  });

  it("throws error on failed fetch", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      statusText: "Not Found",
    });

    await expect(loadMidiFile("http://example.com/test.mid")).rejects.toThrow(
      "Failed to fetch MIDI file: Not Found",
    );
  });
});
