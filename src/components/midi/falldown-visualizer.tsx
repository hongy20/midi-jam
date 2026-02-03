"use client";

import { memo, useMemo, useState, useEffect, useRef } from "react";
import type { NoteSpan } from "@/lib/midi/midi-player";

interface FalldownVisualizerProps {
  spans: NoteSpan[];
  barLines?: number[];
  currentTime: number;
  speed: number;
  height?: number; // Optional fallback or fixed height
  rangeStart?: number;
  rangeEnd?: number;
}

/**
 * Visualizes MIDI notes falling from top to bottom.
 * Synchronized with the responsive piano keyboard layout.
 */
export const FalldownVisualizer = memo(function FalldownVisualizer({
  spans,
  barLines = [],
  currentTime,
  speed,
  height: fixedHeight,
  rangeStart = 21,
  rangeEnd = 108,
}: FalldownVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderedHeight, setRenderedHeight] = useState(fixedHeight || 600);

  // Track the actual rendered height for precise note calculations
  useEffect(() => {
    if (fixedHeight) return;
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setRenderedHeight(entry.contentRect.height);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [fixedHeight]);

  const PIXELS_PER_SECOND = 100 * speed; // How fast the notes fall
  
  // Calculate look-ahead based on the current height to ensure notes start at the top
  const LOOK_AHEAD_SECONDS = (renderedHeight / PIXELS_PER_SECOND) + 1; 

  // Efficient filtering: notes/barlines are sorted by time, so we can exit early
  const visibleBarLines = useMemo(() => {
    const visible: number[] = [];
    for (const time of barLines) {
      if (time >= currentTime && time < currentTime + LOOK_AHEAD_SECONDS) {
        visible.push(time);
      } else if (time >= currentTime + LOOK_AHEAD_SECONDS) {
        break; // Early exit
      }
    }
    return visible;
  }, [barLines, currentTime, LOOK_AHEAD_SECONDS]);

  const visibleNotes = useMemo(() => {
    const visible: NoteSpan[] = [];
    for (const span of spans) {
      const endTime = span.startTime + span.duration;
      if (endTime > currentTime && span.startTime < currentTime + LOOK_AHEAD_SECONDS) {
        if (span.note >= rangeStart && span.note <= rangeEnd) {
          visible.push(span);
        }
      } else if (span.startTime >= currentTime + LOOK_AHEAD_SECONDS) {
        break; // Early exit
      }
    }
    return visible;
  }, [spans, currentTime, LOOK_AHEAD_SECONDS, rangeStart, rangeEnd]);

  const { whiteKeysCount, whiteKeyIndices } = useMemo(() => {
    const indices: Record<number, number> = {};
    let count = 0;
    for (let i = rangeStart; i <= rangeEnd; i++) {
      const n = i % 12;
      const isBlack = [1, 3, 6, 8, 10].includes(n);
      if (!isBlack) {
        indices[i] = count++;
      }
    }
    return { whiteKeysCount: count, whiteKeyIndices: indices };
  }, [rangeStart, rangeEnd]);

  const getHorizontalPosition = (note: number) => {
    const n = note % 12;
    const isBlack = [1, 3, 6, 8, 10].includes(n);

    if (!isBlack) {
      const index = whiteKeyIndices[note];
      if (index === undefined) return null;
      return {
        left: `${(index / whiteKeysCount) * 100}%`,
        width: `${(1 / whiteKeysCount) * 100}%`,
      };
    } else {
      const leftWhiteKeyIndex = whiteKeyIndices[note - 1];
      if (leftWhiteKeyIndex === undefined) return null;
      return {
        left: `${((leftWhiteKeyIndex + 0.7) / whiteKeysCount) * 100}%`,
        width: `${(1 / whiteKeysCount) * 0.6 * 100}%`,
      };
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 min-h-0 overflow-hidden bg-slate-950/80 backdrop-blur-sm rounded-t-[1.5rem] border-x-4 border-t-4 border-slate-200/50"
      style={fixedHeight ? { height: `${fixedHeight}px` } : {}}
    >
      <div className="absolute inset-0 w-full mx-auto">
        {/* Render Bar-lines */}
        {visibleBarLines.map((time) => {
          const bottom = (time - currentTime) * PIXELS_PER_SECOND;
          return (
            <div
              key={`bar-${time}`}
              className="absolute left-0 right-0 h-px bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.3)] will-change-transform"
              style={{
                transform: `translate3d(0, ${-bottom}px, 0)`,
                bottom: 0,
              }}
            />
          );
        })}

        {visibleNotes.map((note) => {
          const pos = getHorizontalPosition(note.note);
          if (!pos) return null;
          const { left, width } = pos;
          const bottom = (note.startTime - currentTime) * PIXELS_PER_SECOND;
          const rectHeight = note.duration * PIXELS_PER_SECOND;

          return (
            <div
              key={note.id}
              className={`absolute rounded-full transition-shadow duration-300 will-change-transform ${
                note.isBlack
                  ? "bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] border border-purple-400"
                  : "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-300"
              }`}
              style={{
                left,
                width,
                height: `${rectHeight}px`,
                transform: `translate3d(0, ${-bottom}px, 0)`,
                bottom: 0,
              }}
            />
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-50 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
    </div>
  );
});
