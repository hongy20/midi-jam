import { describe, expect, it } from "vitest";

import { getInstrumentFromInput } from "./instrument";

describe("midi-instrument-utils", () => {
  it("detects piano by default", () => {
    expect(getInstrumentFromInput(null)).toBe("piano");
    expect(getInstrumentFromInput({ name: "Unknown" } as WebMidi.MIDIInput)).toBe("piano");
  });

  it("detects drums from name keywords", () => {
    expect(getInstrumentFromInput({ name: "Roland TD-17" } as WebMidi.MIDIInput)).toBe("drums");
    expect(getInstrumentFromInput({ name: "Electronic Drum Kit" } as WebMidi.MIDIInput)).toBe(
      "drums",
    );
    expect(getInstrumentFromInput({ name: "SamplePad" } as WebMidi.MIDIInput)).toBe("drums");
  });

  it("detects drums from manufacturer keywords", () => {
    expect(
      getInstrumentFromInput({ name: "Midi Device", manufacturer: "Alesis" } as WebMidi.MIDIInput),
    ).toBe("drums");
    expect(
      getInstrumentFromInput({ name: "Midi Device", manufacturer: "Roland" } as WebMidi.MIDIInput),
    ).toBe("drums");
  });

  it("is case-insensitive", () => {
    expect(getInstrumentFromInput({ name: "DRUMS" } as WebMidi.MIDIInput)).toBe("drums");
  });
});
