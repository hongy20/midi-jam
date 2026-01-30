"use client";

interface PianoKeyboardProps {
  liveNotes?: Set<number>;
  playbackNotes?: Set<number>;
}

/**
 * A visual representation of a piano keyboard that highlights active notes.
 * Renders a full 88-key piano range (A0 to C8).
 */
export function PianoKeyboard({ 
  liveNotes = new Set(), 
  playbackNotes = new Set() 
}: PianoKeyboardProps) {
  // Standard 88-key piano range
  const START_NOTE = 21; // A0
  const END_NOTE = 108; // C8

  const isBlackKey = (note: number) => {
    const n = note % 12;
    return [1, 3, 6, 8, 10].includes(n);
  };

  const whiteKeys: number[] = [];
  for (let note = START_NOTE; note <= END_NOTE; note++) {
    if (!isBlackKey(note)) {
      whiteKeys.push(note);
    }
  }

  // Calculate position for black keys relative to white keys
  // This is more robust than the octave-based approach for arbitrary ranges
  const getBlackKeyPosition = (note: number) => {
    // Find the white key immediately to the left
    const leftWhiteKeyIndex = whiteKeys.findIndex((w) => w === note - 1);
    if (leftWhiteKeyIndex === -1) return null;

    // Position is (index + 0.7) / totalWhiteKeys
    // The 0.7 offset centers the black key between the white keys
    return `${((leftWhiteKeyIndex + 0.7) / whiteKeys.length) * 100}%`;
  };

  const blackKeys: number[] = [];
  for (let note = START_NOTE; note <= END_NOTE; note++) {
    if (isBlackKey(note)) {
      blackKeys.push(note);
    }
  }

  const getWhiteKeyColor = (note: number) => {
    const isLive = liveNotes.has(note);
    const isPlayback = playbackNotes.has(note);
    
    if (isLive && isPlayback) return "bg-indigo-500 shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] translate-y-[2px]";
    if (isLive) return "bg-blue-400 shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] translate-y-[2px]";
    if (isPlayback) return "bg-purple-400 shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] translate-y-[2px]";
    return "bg-white hover:bg-gray-50";
  };

  const getBlackKeyColor = (note: number) => {
    const isLive = liveNotes.has(note);
    const isPlayback = playbackNotes.has(note);
    
    if (isLive && isPlayback) return "bg-indigo-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] translate-y-[1px]";
    if (isLive) return "bg-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] translate-y-[1px]";
    if (isPlayback) return "bg-purple-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] translate-y-[1px]";
    return "bg-gray-900";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div
          className="relative h-48 min-w-[1200px] mx-auto flex select-none"
          role="img"
          aria-label="Piano keyboard (88 keys)"
        >
          {/* Render white keys */}
          <div className="flex w-full h-full border-2 border-gray-300 rounded-xl overflow-hidden shadow-inner bg-gray-200">
            {whiteKeys.map((note) => (
              <button
                type="button"
                key={note}
                aria-label={`Note ${note}`}
                aria-pressed={liveNotes.has(note) || playbackNotes.has(note)}
                tabIndex={-1}
                className={`flex-1 border-r border-gray-300 h-full transition-all duration-75 outline-none ${getWhiteKeyColor(note)}`}
              />
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
                  className={`h-2/3 z-10 rounded-b-md border border-black shadow-md transition-all duration-75 outline-none pointer-events-auto ${getBlackKeyColor(note)}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center text-sm font-medium text-gray-400 flex justify-between px-4">
        <span>A0 (21)</span>
        <span className="text-gray-500">88 Keys</span>
        <span>C8 (108)</span>
      </div>
    </div>
  );
}
