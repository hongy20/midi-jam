"use client";

import { PianoKeyboard } from "@/components/piano-keyboard/PianoKeyboard";

interface VirtualInstrumentProps {
  inputDevice: WebMidi.MIDIInput;
  liveNotes: Set<number>;
  playbackNotes: Set<number>;
}

export function VirtualInstrument({
  liveNotes,
  playbackNotes,
}: VirtualInstrumentProps) {
  return (
    <div className="w-full h-full flex items-end">
      <PianoKeyboard liveNotes={liveNotes} playbackNotes={playbackNotes} />
    </div>
  );
}
