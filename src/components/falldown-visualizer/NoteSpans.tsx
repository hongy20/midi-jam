import { memo } from "react";
import type { NoteSpan } from "@/lib/midi/midi-parser";

interface NoteItemProps {
  note: NoteSpan;
  left: number;
  width: number;
  pixelsPerSecond: number;
}

/**
 * Individual note component, memoized to avoid re-rendering unless position/size changes.
 */
const NoteItem = memo(
  ({ note, left, width, pixelsPerSecond }: NoteItemProps) => {
    const bottom = note.startTime * pixelsPerSecond;
    const height = note.duration * pixelsPerSecond;

    return (
      <div
        className={`absolute rounded-md transition-shadow duration-300 will-change-transform ${
          note.isBlack
            ? "bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] border border-purple-400"
            : "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-300"
        }`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate3d(${left}px, ${-bottom}px, 0)`,
          // Transform origin is bottom-left to match our coordinate system.
          transformOrigin: "bottom left",
          bottom: 0,
          left: 0,
        }}
      />
    );
  },
);

NoteItem.displayName = "NoteItem";

interface NoteSpansProps {
  spans: NoteSpan[];
  getHorizontalPosition: (note: number) => {
    leftRatio: number;
    widthRatio: number;
  } | null;
  containerWidth: number;
  pixelsPerSecond: number;
  rangeStart: number;
  rangeEnd: number;
}

export const NoteSpans = memo(
  ({
    spans,
    getHorizontalPosition,
    containerWidth,
    pixelsPerSecond,
    rangeStart,
    rangeEnd,
  }: NoteSpansProps) => {
    return (
      <>
        {spans.map((note) => {
          // Filter by range - this is relatively static compared to time filtering
          if (note.note < rangeStart || note.note > rangeEnd) return null;

          const pos = getHorizontalPosition(note.note);
          if (!pos) return null;

          return (
            <NoteItem
              key={note.id}
              note={note}
              left={pos.leftRatio * containerWidth}
              width={pos.widthRatio * containerWidth}
              pixelsPerSecond={pixelsPerSecond}
            />
          );
        })}
      </>
    );
  },
);

NoteSpans.displayName = "NoteSpans";
