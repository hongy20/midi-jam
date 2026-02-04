import { Midi } from "@tonejs/midi";

/**
 * Fetches and parses a MIDI file from a URL.
 */
export async function loadMidiFile(url: string): Promise<Midi> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch MIDI file: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Midi(arrayBuffer);
}
