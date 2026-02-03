"use client";

import { memo, useCallback, useMemo } from "react";

interface PianoKeyboardProps {
  liveNotes?: Set<number>;
  playbackNotes?: Set<number>;
  rangeStart?: number;
  rangeEnd?: number;
}

/**
 * A responsive visual representation of a piano keyboard.
 * Supports dynamic note ranges for zooming.
 */
export const PianoKeyboard = memo(function PianoKeyboard({
  liveNotes = new Set(),
  playbackNotes = new Set(),
  rangeStart = 21, // Default A0
  rangeEnd = 108, // Default C8
}: PianoKeyboardProps) {
  const isBlackKey = useCallback((note: number) => {
    const n = note % 12;
    return [1, 3, 6, 8, 10].includes(n);
  }, []);

  // Memoize white keys calculation
  const whiteKeys = useMemo(() => {
    const keys: number[] = [];
    for (let note = rangeStart; note <= rangeEnd; note++) {
      if (!isBlackKey(note)) {
        keys.push(note);
      }
    }
    return keys;
  }, [rangeStart, rangeEnd, isBlackKey]);

  // Memoize black keys calculation
  const blackKeys = useMemo(() => {
    const keys: number[] = [];
    for (let note = rangeStart; note <= rangeEnd; note++) {
      if (isBlackKey(note)) {
        keys.push(note);
      }
    }
    return keys;
  }, [rangeStart, rangeEnd, isBlackKey]);

  // Calculate position for black keys relative to white keys
  const getBlackKeyPosition = (note: number) => {
    // Find the white key immediately to the left
    const leftWhiteKeyIndex = whiteKeys.findIndex((w) => w === note - 1);
    if (leftWhiteKeyIndex === -1) return null;

    // Position is (index + 0.7) / totalWhiteKeys
    return `${((leftWhiteKeyIndex + 0.7) / whiteKeys.length) * 100}%`;
  };

  const getWhiteKeyColor = (note: number) => {
    const isLive = liveNotes.has(note);
    const isPlayback = playbackNotes.has(note);

    if (isLive && isPlayback)
      return "bg-indigo-500 shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] translate-y-[2px]";
    if (isLive)
      return "bg-blue-400 shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] translate-y-[2px]";
    if (isPlayback)
      return "bg-purple-400 shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] translate-y-[2px]";
    return "bg-white hover:bg-gray-50";
  };

  const getBlackKeyColor = (note: number) => {
    const isLive = liveNotes.has(note);
    const isPlayback = playbackNotes.has(note);

    if (isLive && isPlayback)
      return "bg-indigo-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] translate-y-[1px]";
    if (isLive)
      return "bg-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] translate-y-[1px]";
    if (isPlayback)
      return "bg-purple-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] translate-y-[1px]";
    return "bg-gray-900";
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className="relative h-40 w-full flex select-none"
        role="img"
        aria-label={`Piano keyboard (${rangeStart} to ${rangeEnd})`}
      >
        {/* Render white keys */}
        <div className="flex w-full h-full border-2 border-gray-200 rounded-b-2xl overflow-hidden shadow-inner bg-gray-100">
          {whiteKeys.map((note) => (
            <button
              type="button"
              key={note}
              aria-label={note === 60 ? "Middle C (C4)" : `Note ${note}`}
              aria-pressed={liveNotes.has(note) || playbackNotes.has(note)}
              tabIndex={-1}
              className={`relative flex-1 border-r border-gray-200 h-full transition-all duration-75 outline-none font-bold text-[10px] text-gray-400 flex items-end justify-center pb-2 select-none will-change-transform ${getWhiteKeyColor(note)}`}
            >
              {note === 60 && (
                <span className="text-gray-200 font-bold">
                  C4
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Render black keys */}
        <div className="absolute inset-0 pointer-events-none">
          {blackKeys.map((note) => {
            const left = getBlackKeyPosition(note);
            if (!left) return null;

            return (
              <button
                type="button"
                key={note}
                aria-label={`Note ${note}`}
                aria-pressed={liveNotes.has(note) || playbackNotes.has(note)}
                tabIndex={-1}
                style={{
                  left,
                  width: `${(1 / whiteKeys.length) * 0.6 * 100}%`,
                  position: "absolute",
                }}
                className={`h-2/3 z-10 rounded-b-md border border-black shadow-md transition-all duration-75 outline-none pointer-events-auto will-change-transform ${getBlackKeyColor(note)}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});
