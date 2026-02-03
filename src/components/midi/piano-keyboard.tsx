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
    return "bg-white hover:bg-gray-50";
  };

  const getBlackKeyColor = (note: number) => {
    return "bg-gray-900";
  };

  const getGlowClass = (note: number) => {
    const isLive = liveNotes.has(note);
    const isPlayback = playbackNotes.has(note);
    const isBlack = isBlackKey(note);

    if (!isLive && !isPlayback) return "opacity-0";

    // Base colors matching FalldownVisualizer
    const blue = "rgba(59,130,246,1)"; // blue-500
    const blueOuter = "rgba(59,130,246,0.6)";
    const purple = "rgba(147,51,234,1)"; // purple-600
    const purpleOuter = "rgba(147,51,234,0.6)";
    const indigo = "rgba(99,102,241,1)"; // indigo-500

    if (isLive && isPlayback) {
      return `opacity-100 shadow-[inset_0_0_25px_${indigo},inset_0_0_10px_rgba(255,255,255,0.8)] bg-indigo-500/40 animate-pulse`;
    }

    if (isBlack) {
      return `opacity-100 shadow-[inset_0_0_20px_${purple},inset_0_0_10px_rgba(255,255,255,0.8)] bg-purple-600/40 animate-pulse`;
    }

    return `opacity-100 shadow-[inset_0_0_20px_${blue},inset_0_0_10px_rgba(255,255,255,0.8)] bg-blue-500/40 animate-pulse`;
  };

  const getBeamClass = (note: number) => {
    const isLive = liveNotes.has(note);
    const isPlayback = playbackNotes.has(note);
    const isBlack = isBlackKey(note);

    if (isLive && isPlayback) return "from-indigo-500/60 via-indigo-500/20 to-transparent";
    if (isBlack) return "from-purple-600/60 via-purple-600/20 to-transparent";
    return "from-blue-500/60 via-blue-500/20 to-transparent";
  };

  const getFlareColor = (note: number) => {
    const isLive = liveNotes.has(note);
    const isPlayback = playbackNotes.has(note);
    const isBlack = isBlackKey(note);

    if (isLive && isPlayback) return "bg-indigo-400";
    if (isBlack) return "bg-purple-600";
    return "bg-blue-500";
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className="relative h-40 w-full flex select-none"
        role="img"
        aria-label={`Piano keyboard (${rangeStart} to ${rangeEnd})`}
      >
        {/* Active Note Beams (Shoot upward) */}
        <div className="absolute inset-0 -top-[800px] pointer-events-none z-0 flex">
          {whiteKeys.map((note) => {
            const isActive = liveNotes.has(note) || playbackNotes.has(note);
            return (
              <div
                key={`beam-${note}`}
                className="relative flex-1 flex flex-col justify-end"
              >
                {/* Flare at the base */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-12 blur-md transition-opacity duration-150 ${isActive ? "opacity-100" : "opacity-0"} ${getFlareColor(note)}`} />
                {/* The beam itself */}
                <div className={`w-full h-full bg-gradient-to-t transition-opacity duration-150 ${getBeamClass(note)} ${isActive ? "opacity-100" : "opacity-0"}`} />
              </div>
            );
          })}
        </div>

        {/* Render white keys */}
        <div className="flex w-full h-full rounded-b-[1.5rem] overflow-hidden shadow-inner bg-gray-100 z-10">
          {whiteKeys.map((note) => (
            <button
              type="button"
              key={note}
              aria-label={note === 60 ? "Middle C (C4)" : `Note ${note}`}
              aria-pressed={liveNotes.has(note) || playbackNotes.has(note)}
              tabIndex={-1}
              className={`relative flex-1 border-r last:border-r-0 border-gray-200 h-full transition-all duration-75 outline-none font-bold text-[10px] text-gray-400 flex items-end justify-center pb-2 select-none overflow-hidden will-change-transform ${getWhiteKeyColor(note)}`}
            >
              {/* Glow Overlay */}
              <div className={`absolute inset-0 transition-opacity duration-75 pointer-events-none z-0 ${getGlowClass(note)}`} />
              
              {note === 60 && (
                <span className="relative z-10 text-gray-200 font-bold">
                  C4
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Render black keys */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {blackKeys.map((note) => {
            const left = getBlackKeyPosition(note);
            if (!left) return null;

            const isActive = liveNotes.has(note) || playbackNotes.has(note);

            return (
              <div key={`black-container-${note}`} className="absolute inset-0 pointer-events-none">
                {/* Black key beam */}
                <div
                  className="absolute -top-[800px] flex flex-col justify-end pointer-events-none"
                  style={{
                    left,
                    width: `${(1 / whiteKeys.length) * 0.6 * 100}%`,
                    height: "800px",
                  }}
                >
                  {/* Flare for black key */}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-12 blur-md transition-opacity duration-150 ${isActive ? "opacity-100" : "opacity-0"} ${getFlareColor(note)}`} />
                  {/* Beam for black key */}
                  <div className={`w-full h-full bg-gradient-to-t transition-opacity duration-150 ${getBeamClass(note)} ${isActive ? "opacity-100" : "opacity-0"}`} />
                </div>
                
                <button
                  type="button"
                  key={note}
                  aria-label={`Note ${note}`}
                  aria-pressed={isActive}
                  tabIndex={-1}
                  style={{
                    left,
                    width: `${(1 / whiteKeys.length) * 0.6 * 100}%`,
                    position: "absolute",
                  }}
                  className={`h-2/3 rounded-b-md border border-black shadow-md transition-all duration-75 outline-none pointer-events-auto overflow-hidden will-change-transform ${getBlackKeyColor(note)}`}
                >
                  <div className={`absolute inset-0 transition-opacity duration-75 pointer-events-none ${getGlowClass(note)}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});