import { memo, useEffect, useMemo, useRef, useState } from "react";
import { isBlackKey } from "@/lib/device/piano";
import { PIANO_88_KEY_MAX, PIANO_88_KEY_MIN } from "@/lib/midi/constant";
import type { NoteSpan } from "@/lib/midi/midi-parser";

interface FalldownVisualizerProps {
  spans: NoteSpan[];
  barLines: number[];
  currentTime: number;
  speed: number;
  rangeStart?: number;
  rangeEnd?: number;
}

/**
 * A memoized background component to prevent re-rendering lanes and grid lines
 * on every frame update of the falling notes.
 */
const BackgroundGrid = memo(
  ({
    allNotesInRange,
    whiteKeyNotes,
    getHorizontalPosition,
    whiteKeysCount,
    containerWidth,
  }: {
    allNotesInRange: number[];
    whiteKeyNotes: number[];
    getHorizontalPosition: (note: number) => {
      leftRatio: number;
      widthRatio: number;
    } | null;
    whiteKeysCount: number;
    containerWidth: number;
  }) => (
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

/**
 * Individual note component, memoized to avoid re-rendering unless position/size changes.
 */
const NoteItem = memo(
  ({
    note,
    left,
    width,
    pixelsPerSecond,
  }: {
    note: NoteSpan;
    left: number;
    width: number;
    pixelsPerSecond: number;
  }) => {
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

/**
 * Visualizes MIDI notes falling from top to bottom.
 * Optimized using a moving container and transform-only updates for high performance.
 */
export const FalldownVisualizer = ({
  spans,
  barLines,
  currentTime,
  speed,
  rangeStart = PIANO_88_KEY_MIN,
  rangeEnd = PIANO_88_KEY_MAX,
}: FalldownVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const PIXELS_PER_SECOND = 100 * speed;
  const LOOK_AHEAD_SECONDS = dimensions.height / PIXELS_PER_SECOND + 1;

  // Optimized filtering
  const visibleBarLines = useMemo(() => {
    const visible: number[] = [];
    const endTimeLimit = currentTime;
    const startTimeLimit = currentTime + LOOK_AHEAD_SECONDS;

    for (const time of barLines) {
      if (time >= endTimeLimit && time < startTimeLimit) {
        visible.push(time);
      } else if (time >= startTimeLimit) {
        break;
      }
    }
    return visible;
  }, [barLines, currentTime, LOOK_AHEAD_SECONDS]);

  const visibleNotes = useMemo(() => {
    const visible: NoteSpan[] = [];
    const endTimeLimit = currentTime;
    const startTimeLimit = currentTime + LOOK_AHEAD_SECONDS;

    for (const span of spans) {
      const endTime = span.startTime + span.duration;
      if (endTime > endTimeLimit && span.startTime < startTimeLimit) {
        if (span.note >= rangeStart && span.note <= rangeEnd) {
          visible.push(span);
        }
      } else if (span.startTime >= startTimeLimit) {
        break;
      }
    }
    return visible;
  }, [spans, currentTime, LOOK_AHEAD_SECONDS, rangeStart, rangeEnd]);

  const { whiteKeysCount, whiteKeyIndices, whiteKeyNotes, allNotesInRange } =
    useMemo(() => {
      const indices: Record<number, number> = {};
      const notes: number[] = [];
      const all: number[] = [];
      let count = 0;
      for (let i = rangeStart; i <= rangeEnd; i++) {
        all.push(i);
        if (!isBlackKey(i)) {
          indices[i] = count++;
          notes.push(i);
        }
      }
      return {
        whiteKeysCount: count,
        whiteKeyIndices: indices,
        whiteKeyNotes: notes,
        allNotesInRange: all,
      };
    }, [rangeStart, rangeEnd]);

  const getHorizontalPosition = useMemo(() => {
    return (note: number) => {
      if (!isBlackKey(note)) {
        const index = whiteKeyIndices[note];
        if (index === undefined) return null;
        return {
          leftRatio: index / whiteKeysCount,
          widthRatio: 1 / whiteKeysCount,
        };
      }
      const leftWhiteKeyIndex = whiteKeyIndices[note - 1];
      if (leftWhiteKeyIndex === undefined) return null;
      return {
        leftRatio: (leftWhiteKeyIndex + 0.7) / whiteKeysCount,
        widthRatio: (1 / whiteKeysCount) * 0.6,
      };
    };
  }, [whiteKeyIndices, whiteKeysCount]);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 min-h-0 overflow-hidden bg-white/10 backdrop-blur-2xl rounded-t-3xl border-t border-x border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
    >
      <BackgroundGrid
        allNotesInRange={allNotesInRange}
        whiteKeyNotes={whiteKeyNotes}
        getHorizontalPosition={getHorizontalPosition}
        whiteKeysCount={whiteKeysCount}
        containerWidth={dimensions.width}
      />

      {/* 
        The Moving Container: This is the core performance win. 
        Instead of updating every note's position each frame, we move this single container.
        The notes inside have static positions relative to the start of the song.
      */}
      <div
        className="absolute w-full pointer-events-none"
        style={{
          bottom: 0,
          left: 0,
          height: "100%",
          // Move the entire content down based on elapsed time.
          transform: `translate3d(0, ${currentTime * PIXELS_PER_SECOND}px, 0)`,
          willChange: "transform",
        }}
      >
        {/* Render Bar-lines */}
        {visibleBarLines.map((time) => (
          <div
            key={`bar-${time}`}
            className="absolute left-0 right-0 h-px bg-white/60 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
            style={{
              bottom: 0,
              // Position bar line relative to container bottom using pixels
              transform: `translate3d(0, ${-time * PIXELS_PER_SECOND}px, 0)`,
            }}
          />
        ))}

        {/* Render Notes */}
        {visibleNotes.map((note) => {
          const pos = getHorizontalPosition(note.note);
          if (!pos) return null;
          return (
            <NoteItem
              key={note.id}
              note={note}
              left={pos.leftRatio * dimensions.width}
              width={pos.widthRatio * dimensions.width}
              pixelsPerSecond={PIXELS_PER_SECOND}
            />
          );
        })}
      </div>
    </div>
  );
};
