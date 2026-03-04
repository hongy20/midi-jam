"use client";

import { useRef } from "react";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import { BackgroundLane } from "./background-lane";
import { TrackLane } from "./track-lane";

interface LaneStageProps {
  spans: NoteSpan[];
  originalDurationMs: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  inputDevice: WebMidi.MIDIInput;
}

export function LaneStage({
  spans,
  originalDurationMs,
  scrollRef,
  inputDevice,
}: LaneStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-background/5"
    >
      <BackgroundLane inputDevice={inputDevice} />

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
