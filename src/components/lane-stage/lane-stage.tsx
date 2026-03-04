"use client";

import { useMemo, useRef } from "react";
import { getPitchUnits } from "@/lib/device/piano";
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

  const visiblePitches = useMemo(() => {
    const pitches = [];
    for (let p = rangeStart; p <= rangeEnd; p++) {
      pitches.push(p);
    }
    return pitches;
  }, [rangeStart, rangeEnd]);

  const units = getPitchUnits(rangeStart);
  const startUnit = units.start;
  const endUnit = getPitchUnits(rangeEnd).end;

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
      <BackgroundLane pitches={visiblePitches} inputDevice={inputDevice} />

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
