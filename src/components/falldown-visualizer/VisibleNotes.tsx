import { memo } from "react";
import type { NoteSpan } from "@/lib/midi/midi-parser";

interface VisibleNotesProps {
  visibleNotes: NoteSpan[];
  getHorizontalPosition: (note: number) => {
    leftRatio: number;
    widthRatio: number;
  } | null;
  containerWidth: number;
  pixelsPerSecond: number;
}

export const VisibleNotes = memo(
  ({
    visibleNotes,
    getHorizontalPosition,
    containerWidth,
    pixelsPerSecond,
  }: VisibleNotesProps) => {
    return (
      <>
        {visibleNotes.map((note) => {
          const pos = getHorizontalPosition(note.note);
          if (!pos) return null;

          const left = pos.leftRatio * containerWidth;
          const width = pos.widthRatio * containerWidth;
          const bottom = note.startTime * pixelsPerSecond;
          const height = note.duration * pixelsPerSecond;

          return (
            <div
              key={note.id}
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
        })}
      </>
    );
  },
);

VisibleNotes.displayName = "VisibleNotes";
