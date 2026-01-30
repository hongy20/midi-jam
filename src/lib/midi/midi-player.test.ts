import { Midi } from "@tonejs/midi";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMidiEvents, loadMidiFile } from "./midi-player";

vi.mock("@tonejs/midi");

describe("loadMidiFile", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch and parse a MIDI file", async () => {
    const mockArrayBuffer = new ArrayBuffer(8);
    const mockMidiData = {
      header: { name: "test" },
      tracks: [],
    };

    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(mockArrayBuffer),
    });

    // Mock Midi constructor using a class or function
    vi.mocked(Midi).mockImplementation(function () {
      return mockMidiData as any;
    } as any);

    const result = await loadMidiFile("/midi/test.mid");

    expect(global.fetch).toHaveBeenCalledWith("/midi/test.mid");
    expect(Midi).toHaveBeenCalledWith(mockArrayBuffer);
    expect(result).toEqual(mockMidiData);
  });

  it("should throw an error if fetch fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      statusText: "Not Found",
    });

    await expect(loadMidiFile("/midi/invalid.mid")).rejects.toThrow(
      "Failed to fetch MIDI file: Not Found",
    );
  });
});

describe("getMidiEvents", () => {
  it("should extract sorted note on and note off events", () => {
    const mockMidi = {
      tracks: [
        {
          notes: [
            { time: 1, duration: 0.5, midi: 60, velocity: 0.8 },
            { time: 0, duration: 1, midi: 64, velocity: 0.7 },
          ],
        },
      ],
    };

    const events = getMidiEvents(mockMidi as any);

    expect(events).toEqual([
      { time: 0, type: "noteOn", note: 64, velocity: 0.7 },
      { time: 1, type: "noteOn", note: 60, velocity: 0.8 },
      { time: 1, type: "noteOff", note: 64, velocity: 0 },
      { time: 1.5, type: "noteOff", note: 60, velocity: 0 },
    ]);
  });
});
