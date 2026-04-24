import { describe, expect, it } from "vitest";

import { getInstrumentType } from "./instrument";

describe("midi-instrument-utils", () => {
  it("detects piano by default", () => {
    expect(getInstrumentType(null)).toBe("piano");
    expect(getInstrumentType({ name: "Unknown" } as WebMidi.MIDIInput)).toBe("piano");
  });

  it("detects drums from name keywords", () => {
    expect(getInstrumentType({ name: "Roland TD-17" } as WebMidi.MIDIInput)).toBe("drums");
    expect(getInstrumentType({ name: "Electronic Drum Kit" } as WebMidi.MIDIInput)).toBe("drums");
    expect(getInstrumentType({ name: "SamplePad" } as WebMidi.MIDIInput)).toBe("drums");
  });

  it("detects drums from manufacturer keywords", () => {
    expect(
      getInstrumentType({ name: "Midi Device", manufacturer: "Alesis" } as WebMidi.MIDIInput),
    ).toBe("drums");
    expect(
      getInstrumentType({ name: "Midi Device", manufacturer: "Roland" } as WebMidi.MIDIInput),
    ).toBe("drums");
  });

  it("is case-insensitive", () => {
    expect(getInstrumentType({ name: "DRUMS" } as WebMidi.MIDIInput)).toBe("drums");
  });
});
