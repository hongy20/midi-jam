"use client";

import type { HTMLAttributes } from "react";
import { PianoKeyboard } from "./piano-keyboard/PianoKeyboard";

interface VirtualInstrumentProps extends HTMLAttributes<HTMLDivElement> {
  inputDevice: WebMidi.MIDIInput;
  liveNotes: Set<number>;
  playbackNotes: Set<number>;
}

export function VirtualInstrument({
  liveNotes,
  playbackNotes,
  className = "",
  ...props
}: VirtualInstrumentProps) {
  return (
    <div className={`w-full h-full flex items-end ${className}`} {...props}>
      <PianoKeyboard liveNotes={liveNotes} playbackNotes={playbackNotes} />
    </div>
  );
}
