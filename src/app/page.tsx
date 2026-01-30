"use client";

import { DeviceSelector } from "@/components/midi/device-selector";
import { PianoKeyboard } from "@/components/midi/piano-keyboard";
import { useActiveNotes } from "@/hooks/use-active-notes";
import { useMIDIConnection } from "@/hooks/use-midi-connection";
import { useMIDIInputs } from "@/hooks/use-midi-inputs";
import { useMidiPlayer } from "@/hooks/use-midi-player";
import { useMemo } from "react";

export default function Home() {
  const { inputs, isLoading, error } = useMIDIInputs();
  const { selectedDevice, selectDevice } = useMIDIConnection(inputs);
  const liveActiveNotes = useActiveNotes(selectedDevice);
  
  // Placeholder for MIDI file events (Phase 3 will populate this)
  const { activeNotes: playbackActiveNotes } = useMidiPlayer([]);

  const combinedActiveNotes = useMemo(() => {
    const combined = new Set(liveActiveNotes);
    for (const note of playbackActiveNotes) {
      combined.add(note);
    }
    return combined;
  }, [liveActiveNotes, playbackActiveNotes]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <main className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-6xl font-black text-blue-600 tracking-tighter italic transform -rotate-2">
            MIDI JAM
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            Step up to the stage and start jamming!
          </p>
        </header>

        <section className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-gray-100 space-y-8">
          <DeviceSelector
            devices={inputs}
            isLoading={isLoading}
            error={error}
            selectedDevice={selectedDevice}
            onSelect={selectDevice}
          />

          {selectedDevice && (
            <div className="pt-8 border-t-4 border-gray-50 space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Your Keyboard
                </h2>
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  CONNECTED
                </div>
              </div>

              <PianoKeyboard activeNotes={combinedActiveNotes} />
            </div>
          )}
        </section>

        {!selectedDevice && !isLoading && (
          <div className="text-center p-12 border-4 border-dashed border-gray-200 rounded-[3rem] text-gray-400">
            <p className="text-xl font-medium">
              Waiting for your instrument...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
