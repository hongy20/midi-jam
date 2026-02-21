"use client";

import { useMemo, useRef } from "react";
import { useDemoPlayback } from "@/hooks/use-demo-playback";
import { getNoteUnitOffset, isBlackKey } from "@/lib/device/piano";
import { PIANO_88_KEY_MAX, PIANO_88_KEY_MIN } from "@/lib/midi/constant";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import { BackgroundLane } from "./background-lane";
import { TrackLane } from "./track-lane";

interface LaneStageProps {
  spans: NoteSpan[];
  totalDurationMs: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  demoMode: boolean;
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
  rangeStart?: number;
  rangeEnd?: number;
}

export function LaneStage({
  spans,
  totalDurationMs,
  scrollRef,
  demoMode,
  onNoteOn = () => {},
  onNoteOff = () => {},
  rangeStart = PIANO_88_KEY_MIN,
  rangeEnd = PIANO_88_KEY_MAX,
}: LaneStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useDemoPlayback({
    containerRef: scrollRef,
    demoMode,
    onNoteOn,
    onNoteOff,
  });

  const visibleNotes = useMemo(() => {
    const notes = [];
    for (let n = rangeStart; n <= rangeEnd; n++) {
      notes.push(n);
    }
    return notes;
  }, [rangeStart, rangeEnd]);

  const startUnit = getNoteUnitOffset(rangeStart);
  const endUnit = getNoteUnitOffset(rangeEnd) + (isBlackKey(rangeEnd) ? 2 : 3);
  const visibleUnits = endUnit - startUnit;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-background/5"
      style={
        {
          "--piano-start-unit": startUnit,
          "--piano-visible-units": visibleUnits,
        } as React.CSSProperties
      }
    >
      <BackgroundLane notes={visibleNotes} />

      <div
        ref={scrollRef}
        id="lane-scroll"
        className="absolute inset-0 overflow-hidden"
      >
        <TrackLane spans={spans} totalDurationMs={totalDurationMs} />
      </div>

      {/* Target Line (Fixed) */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-foreground/40 shadow-[0_0_10px_rgba(255,255,255,0.2)] z-20 pointer-events-none" />
    </div>
  );
}
