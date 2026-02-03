"use client";

import { useMemo } from "react";
import type { MidiEvent } from "@/lib/midi/midi-player";

interface FalldownVisualizerProps {
  events: MidiEvent[];
  barLines?: number[];
  currentTime: number;
  speed: number;
  height?: number; // Visual height of the falling area
  rangeStart?: number;
  rangeEnd?: number;
}

/**
 * Visualizes MIDI notes falling from top to bottom.
 * Synchronized with the responsive piano keyboard layout.
 */
export function FalldownVisualizer({
  events,
  barLines = [],
  currentTime,
  speed,
  height = 400,
  rangeStart = 21,
  rangeEnd = 108,
}: FalldownVisualizerProps) {
  const PIXELS_PER_SECOND = 100 * speed; // How fast the notes fall
  const LOOK_AHEAD_SECONDS = 4 / speed; // How many seconds of future notes to show

  // Filter bar-lines to only show those in view
  const visibleBarLines = useMemo(() => {
    return barLines.filter(
      (time) =>
        time >= currentTime && time < currentTime + LOOK_AHEAD_SECONDS,
    );
  }, [barLines, currentTime, LOOK_AHEAD_SECONDS]);

  // Filter events to only show notes that are about to be played or are currently playing
  const visibleNotes = useMemo(() => {
    const notes: {
      id: string;
      note: number;
      startTime: number;
      duration: number;
      isBlack: boolean;
    }[] = [];

    // Group noteOn/noteOff pairs into note spans
    const activeNoteStarts = new Map<number, number>();

    for (const event of events) {
      if (event.type === "noteOn") {
        activeNoteStarts.set(event.note, event.time);
      } else if (event.type === "noteOff") {
        const startTime = activeNoteStarts.get(event.note);
        if (startTime !== undefined) {
          const duration = event.time - startTime;

          // Only include if it's within our time window and within the visible range
          if (
            startTime + duration > currentTime &&
            startTime < currentTime + LOOK_AHEAD_SECONDS &&
            event.note >= rangeStart &&
            event.note <= rangeEnd
          ) {
            const n = event.note % 12;
            const isBlack = [1, 3, 6, 8, 10].includes(n);

            notes.push({
              id: `${event.note}-${event.track}-${startTime}`,
              note: event.note,
              startTime,
              duration,
              isBlack,
            });
          }
          activeNoteStarts.delete(event.note);
        }
      }
    }
    return notes;
  }, [events, currentTime, LOOK_AHEAD_SECONDS, rangeStart, rangeEnd]);

  // Horizontal position logic (must match PianoKeyboard)
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
      return {
        left: `${(index / whiteKeysCount) * 100}%`,
        width: `${(1 / whiteKeysCount) * 100}%`,
      };
    } else {
      // Find the white key to the left
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
      className="relative overflow-hidden bg-gray-900/5 backdrop-blur-sm rounded-t-[3rem] border-x-4 border-t-4 border-gray-100"
      style={{ height: `${height}px` }}
    >
      <div className="absolute inset-0 w-full mx-auto">
        {/* Render Bar-lines */}
        {visibleBarLines.map((time) => {
          const bottom = (time - currentTime) * PIXELS_PER_SECOND;
          return (
            <div
              key={`bar-${time}`}
              className="absolute left-0 right-0 h-px bg-white/20 border-t border-gray-400/10 will-change-transform"
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
          // Distance from the bottom of the container
          // Bottom = (startTime - currentTime) * pixelsPerSecond
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

      {/* Target Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-50 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
    </div>
  );
}
