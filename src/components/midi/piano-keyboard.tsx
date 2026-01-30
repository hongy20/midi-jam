"use client";

interface PianoKeyboardProps {
  activeNotes: Set<number>;
}

/**
 * A visual representation of a piano keyboard that highlights active notes.
 */
export function PianoKeyboard({ activeNotes }: PianoKeyboardProps) {
  // Define the range of notes to display (C3 to C5)
  const START_NOTE = 48;
  const END_NOTE = 72;

  const keys = [];
  for (let note = START_NOTE; note <= END_NOTE; note++) {
    keys.push(note);
  }

  const isBlackKey = (note: number) => {
    const n = note % 12;
    return [1, 3, 6, 8, 10].includes(n);
  };

  const getBlackKeyLeft = (note: number) => {
    const n = note % 12;
    const offsets: Record<number, string> = {
      1: "14.28%",
      3: "28.57%",
      6: "57.14%",
      8: "71.42%",
      10: "85.71%",
    };
    return offsets[n];
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative h-48 w-full max-w-3xl mx-auto flex select-none"
        role="img"
        aria-label="Piano keyboard"
      >
        {/* Render white keys first */}
        <div className="flex w-full h-full border-2 border-gray-300 rounded-xl overflow-hidden shadow-inner bg-gray-200">
          {keys
            .filter((n) => !isBlackKey(n))
            .map((note) => (
              <button
                type="button"
                key={note}
                aria-label={`Note ${note}`}
                aria-pressed={activeNotes.has(note)}
                tabIndex={-1}
                className={`flex-1 border-r border-gray-300 h-full transition-all duration-75 outline-none ${
                  activeNotes.has(note)
                    ? "bg-blue-400 shadow-[inset_0_4px_6px_rgba(0,0,0,0.3)] translate-y-[2px]"
                    : "bg-white hover:bg-gray-50"
                }`}
              />
            ))}
        </div>

        {/* Render black keys on top */}
        <div className="absolute inset-0 pointer-events-none flex">
          {Array.from({
            length: Math.ceil((END_NOTE - START_NOTE + 1) / 12) + 1,
          }).map((_, octaveIdx) => {
            const octaveStart = START_NOTE + octaveIdx * 12;
            return (
              <div key={octaveStart} className="relative flex-1 h-2/3 flex">
                {keys
                  .filter(
                    (n) =>
                      isBlackKey(n) &&
                      n >= octaveStart &&
                      n < octaveStart + 12 &&
                      n <= END_NOTE,
                  )
                  .map((note) => (
                    <button
                      type="button"
                      key={note}
                      aria-label={`Note ${note}`}
                      aria-pressed={activeNotes.has(note)}
                      tabIndex={-1}
                      style={{
                        left: getBlackKeyLeft(note),
                        width: "10%",
                        position: "absolute",
                      }}
                      className={`h-full z-10 rounded-b-md border border-black shadow-md transition-all duration-75 outline-none pointer-events-auto ${
                        activeNotes.has(note)
                          ? "bg-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] translate-y-[1px]"
                          : "bg-gray-900"
                      }`}
                    />
                  ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-sm font-medium text-gray-500">
        Range: C3 - C5
      </div>
    </div>
  );
}
