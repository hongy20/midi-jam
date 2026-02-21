import { getNoteUnitOffset } from "@/lib/device/piano";
import { getNoteLayout } from "@/lib/gameplay/lane-geometry";
import type { NoteSpan } from "@/lib/midi/midi-parser";

interface TrackLaneProps {
  spans: NoteSpan[];
  laneHeight: number;
  targetY: number;
  maxScroll: number;
}

/**
 * Renders the extremely tall inner lane containing all note blocks for the track.
 */
export function TrackLane({
  spans,
  laneHeight,
  targetY,
  maxScroll,
}: TrackLaneProps) {
  return (
    <div className="relative w-full" style={{ height: `${laneHeight}px` }}>
      {spans.map((span) => {
        const { top, height } = getNoteLayout(
          span.startTime * 1000,
          (span.startTime + span.duration) * 1000,
          targetY,
          maxScroll,
        );

        return (
          <div
            key={span.id}
            data-pitch={span.note}
            data-note-id={span.id}
            className={`absolute rounded-sm border border-foreground/20 shadow-sm transition-opacity duration-300 ${
              span.isBlack ? "bg-foreground/40 z-10" : "bg-foreground/20 z-0"
            }`}
            style={{
              top: `${top}px`,
              height: `${height}px`,
              left: `calc((${getNoteUnitOffset(span.note)} - var(--piano-start-unit)) / var(--piano-visible-units) * 100%)`,
              width: `calc(${span.isBlack ? 2 : 3} / var(--piano-visible-units) * 100%)`,
            }}
          />
        );
      })}
    </div>
  );
}
