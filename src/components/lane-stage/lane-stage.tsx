"use client";

import { useMemo, useRef } from "react";
import { getNoteUnits } from "@/lib/device/piano";
import { PIANO_88_KEY_MAX, PIANO_88_KEY_MIN } from "@/lib/midi/constant";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import { BackgroundLane } from "./background-lane";
import { TrackLane } from "./track-lane";

interface LaneStageProps {
  spans: NoteSpan[];
  originalDurationMs: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  inputDevice: WebMidi.MIDIInput;
  rangeStart?: number;
  rangeEnd?: number;
}

export function LaneStage({
  spans,
  originalDurationMs,
  scrollRef,
  inputDevice,
  rangeStart = PIANO_88_KEY_MIN,
  rangeEnd = PIANO_88_KEY_MAX,
}: LaneStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleNotes = useMemo(() => {
    const notes = [];
    for (let n = rangeStart; n <= rangeEnd; n++) {
      notes.push(n);
    }
    return notes;
  }, [rangeStart, rangeEnd]);

  const { startUnit, endUnit } = getNoteUnits(rangeStart, rangeEnd);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-background/5"
      style={
        {
          "--piano-start-unit": startUnit,
          "--piano-end-unit": endUnit,
        } as React.CSSProperties
      }
    >
      <BackgroundLane notes={visibleNotes} inputDevice={inputDevice} />

      <div
        ref={scrollRef}
        id="lane-scroll"
        className="absolute inset-0 overflow-hidden"
      >
        <TrackLane
          spans={spans}
          originalDurationMs={originalDurationMs}
          inputDevice={inputDevice}
        />
      </div>
    </div>
  );
}
