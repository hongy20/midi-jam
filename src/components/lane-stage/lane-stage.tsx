"use client";

import { useMemo, useRef } from "react";
import { useSelection } from "@/context/selection-context";
import { useDemoPlayback } from "@/hooks/use-demo-playback";
import { useMidiAudio } from "@/hooks/use-midi-audio";
import { getNoteUnitOffset, isBlackKey } from "@/lib/device/piano";
import { PIANO_88_KEY_MAX, PIANO_88_KEY_MIN } from "@/lib/midi/constant";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import { BackgroundLane } from "./background-lane";
import { TrackLane } from "./track-lane";

interface LaneStageProps {
  spans: NoteSpan[];
  originalDurationMs: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  rangeStart?: number;
  rangeEnd?: number;
}

export function LaneStage({
  spans,
  originalDurationMs,
  scrollRef,
  rangeStart = PIANO_88_KEY_MIN,
  rangeEnd = PIANO_88_KEY_MAX,
}: LaneStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { demoMode, selectedMIDIOutput } = useSelection();

  const { playNote, stopNote } = useMidiAudio(demoMode, selectedMIDIOutput);

  useDemoPlayback({
    containerRef: scrollRef,
    demoMode,
    onNoteOn: playNote,
    onNoteOff: stopNote,
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
        <TrackLane spans={spans} originalDurationMs={originalDurationMs} />
      </div>
    </div>
  );
}
