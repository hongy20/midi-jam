import { memo } from "react";
import { isBlackKey } from "@/lib/device/piano";

interface BackgroundGridProps {
  allNotesInRange: number[];
  whiteKeyNotes: number[];
  getHorizontalPosition: (note: number) => {
    leftRatio: number;
    widthRatio: number;
  } | null;
  whiteKeysCount: number;
  containerWidth: number;
}

/**
 * A memoized background component to prevent re-rendering lanes and grid lines
 * on every frame update of the falling notes.
 */
export const BackgroundGrid = memo(
  ({
    allNotesInRange,
    whiteKeyNotes,
    getHorizontalPosition,
    whiteKeysCount,
    containerWidth,
  }: BackgroundGridProps) => (
    <div className="absolute inset-0 w-full mx-auto pointer-events-none">
      {/* Render Background Lanes */}
      {allNotesInRange.map((note) => {
        const pos = getHorizontalPosition(note);
        if (!pos) return null;
        return (
          <div
            key={`lane-${note}`}
            className={`absolute top-0 bottom-0 transition-colors duration-500 ${
              isBlackKey(note) ? "bg-black/10" : "bg-white/2"
            }`}
            style={{
              width: `${pos.widthRatio * containerWidth}px`,
              transform: `translate3d(${pos.leftRatio * containerWidth}px, 0, 0)`,
            }}
          />
        );
      })}

      {/* Render Vertical Key Lines (Background Grid) */}
      {whiteKeyNotes.map((note, i) => (
        <div
          key={`v-line-${note}`}
          className="absolute top-0 bottom-0 w-px bg-white/20 border-r border-white/10"
          style={{
            transform: `translate3d(${(i / whiteKeysCount) * containerWidth}px, 0, 0)`,
          }}
        />
      ))}
      {/* Rightmost edge line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/20 border-r border-white/10"
        style={{ transform: `translate3d(${containerWidth}px, 0, 0)` }}
      />
    </div>
  ),
);

BackgroundGrid.displayName = "BackgroundGrid";
