"use client";

import { PianoKeyboard } from "./piano-keyboard";

interface VirtualInstrumentProps {
  inputDevice: WebMidi.MIDIInput;
  liveNotes: Set<number>;
  playbackNotes: Set<number>;
  rangeStart?: number;
  rangeEnd?: number;
}

export function VirtualInstrument({
  liveNotes,
  playbackNotes,
  rangeStart,
  rangeEnd,
}: VirtualInstrumentProps) {
  return (
    <div className="w-full h-full flex items-end">
      <PianoKeyboard
        liveNotes={liveNotes}
        playbackNotes={playbackNotes}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
      />
    </div>
  );
}
