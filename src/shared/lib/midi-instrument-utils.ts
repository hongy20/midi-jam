/**
 * Detects the instrument type (piano or drums) from a MIDI input device.
 * It uses simple keyword matching against the device name and manufacturer.
 */
export function getInstrumentFromInput(input: WebMidi.MIDIInput | null): "piano" | "drums" {
  if (!input) return "piano";

  const name = (input.name || "").toLowerCase();
  const manufacturer = (input.manufacturer || "").toLowerCase();
  const deviceId = (input.id || "").toLowerCase();

  const drumKeywords = ["drum", "perc", "roland", "alesis", "edrum", "samplepad", "pad"];

  const isDrums = drumKeywords.some(
    (kw) => name.includes(kw) || manufacturer.includes(kw) || deviceId.includes(kw),
  );

  return isDrums ? "drums" : "piano";
}
