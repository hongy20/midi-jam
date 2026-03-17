import type { Midi } from "@tonejs/midi";
import { describe, expect, it, vi } from "vitest";
import { LEAD_IN_DEFAULT_MS, LEAD_OUT_DEFAULT_MS } from "./constant";
import { patchMidi } from "./midi-loader";

describe("midi-loader patchMidi", () => {
  const leadInS = LEAD_IN_DEFAULT_MS / 1000;
  const leadOutS = LEAD_OUT_DEFAULT_MS / 1000;

  it("shifts note ticks and calls update", () => {
    // 120 bpm, 480 ppq -> 2s lead-in = 1920 ticks
    const shiftTicks = 1920;

    const mockMidi = {
      header: {
        ppq: 480,
        tempos: [{ ticks: 0, bpm: 120 }],
        timeSignatures: [{ ticks: 0, timeSignature: [4, 4] }],
        secondsToTicks: vi.fn().mockReturnValue(shiftTicks),
        update: vi.fn(),
      },
      tracks: [
        {
          notes: [
            { ticks: 0, duration: 1 },
            { ticks: 4800, duration: 1 },
          ],
          controlChanges: {
            7: [{ ticks: 1000 }],
          },
          pitchBends: [{ ticks: 1500 }],
          addCC: vi.fn(),
        },
      ],
      get duration() {
        return 6;
      },
    } as unknown as Midi;

    patchMidi(mockMidi);

    expect(mockMidi.header.secondsToTicks).toHaveBeenCalledWith(leadInS);
    expect(mockMidi.tracks[0].notes[0].ticks).toBe(shiftTicks);
    expect(mockMidi.tracks[0].notes[1].ticks).toBe(4800 + shiftTicks);

    // CC and PitchBend shift
    const ccList = (
      mockMidi.tracks[0].controlChanges as unknown as Record<
        string,
        { ticks: number }[]
      >
    )["7"];
    expect(ccList[0].ticks).toBe(1000 + shiftTicks);
    expect(mockMidi.tracks[0].pitchBends[0].ticks).toBe(1500 + shiftTicks);

    // Header shift (tempos[0] is original, tempos[1] is shifted)
    // Wait, patchMidi re-inserts firstTempo at tick 0 and shifts the rest.
    // So tempos[0] should be at tick 0, tempos[1] should be shifted firstTempo.
    expect(mockMidi.header.tempos).toHaveLength(2);
    expect(mockMidi.header.tempos[0].ticks).toBe(0);
    expect(mockMidi.header.tempos[1].ticks).toBe(shiftTicks);

    expect(mockMidi.header.timeSignatures).toHaveLength(2);
    expect(mockMidi.header.timeSignatures[0].ticks).toBe(0);
    expect(mockMidi.header.timeSignatures[1].ticks).toBe(shiftTicks);

    expect(mockMidi.header.update).toHaveBeenCalled();
  });

  it("extends duration by LEAD_OUT_DEFAULT_MS using addCC", () => {
    const mockMidi = {
      header: {
        ppq: 480,
        tempos: [{ ticks: 0, bpm: 120 }],
        timeSignatures: [{ ticks: 0, timeSignature: [4, 4] }],
        secondsToTicks: vi.fn().mockReturnValue(1920),
        update: vi.fn(),
      },
      tracks: [
        {
          notes: [{ ticks: 0, duration: 1 }],
          controlChanges: {},
          pitchBends: [],
          addCC: vi.fn(),
        },
      ],
      get duration() {
        return 1 + leadInS;
      },
    } as unknown as Midi;

    patchMidi(mockMidi);

    expect(mockMidi.tracks[0].addCC).toHaveBeenCalledWith(
      expect.objectContaining({
        number: 120,
        time: 1 + leadInS + leadOutS,
      }),
    );
  });
});
