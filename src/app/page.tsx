"use client";

import { DeviceSelector } from "@/components/midi/device-selector";
import { useMIDIConnection } from "@/hooks/use-midi-connection";
import { useMIDIInputs } from "@/hooks/use-midi-inputs";

export default function Home() {
  const { inputs, isLoading, error } = useMIDIInputs();
  const { selectedDevice, selectDevice } = useMIDIConnection();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <main className="max-w-2xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-black text-blue-600 tracking-tight">
            MIDI JAM
          </h1>
          <p className="text-gray-500 font-medium">
            Connect your instrument and let's make some music!
          </p>
        </header>

        <section className="bg-white p-6 rounded-3xl shadow-xl border-2 border-gray-100">
          <DeviceSelector
            devices={inputs}
            isLoading={isLoading}
            error={error}
            selectedDevice={selectedDevice}
            onSelect={selectDevice}
          />
        </section>

        {selectedDevice && (
          <div className="p-4 bg-green-50 border-2 border-green-500 rounded-2xl text-green-700 animate-in fade-in slide-in-from-bottom-4">
            <p className="font-bold flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              Connected to: {selectedDevice.name}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
