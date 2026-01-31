"use client";

import { useCallback, useEffect, useState } from "react";
import { DeviceSelector } from "@/components/midi/device-selector";
import { FalldownVisualizer } from "@/components/midi/falldown-visualizer";
import { MidiControlCenter } from "@/components/midi/midi-control-center";
import { PianoKeyboard } from "@/components/midi/piano-keyboard";
import { useActiveNotes } from "@/hooks/use-active-notes";
import { useMidiAudio } from "@/hooks/use-midi-audio";
import { useMIDIConnection } from "@/hooks/use-midi-connection";
import { useMIDIInputs } from "@/hooks/use-midi-inputs";
import { useMidiPlayer } from "@/hooks/use-midi-player";
import { getMidiFiles } from "@/lib/action/midi";
import {
  getMidiEvents,
  loadMidiFile,
  type MidiEvent,
} from "@/lib/midi/midi-player";

interface MidiFile {
  name: string;
  url: string;
}

export default function Home() {
  const {
    inputs,
    isLoading: isMidiLoading,
    error: midiError,
  } = useMIDIInputs();
  const { selectedDevice, selectDevice } = useMIDIConnection(inputs);

  // Audio setup
  const { playNote, stopNote, isMuted, toggleMute } = useMidiAudio();

  // Live input tracking
  const liveActiveNotes = useActiveNotes(selectedDevice, {
    onNoteOn: playNote,
    onNoteOff: stopNote,
  });

  // MIDI File State
  const [midiFiles, setMidiFiles] = useState<MidiFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<MidiFile | null>(null);
  const [midiEvents, setMidiEvents] = useState<MidiEvent[]>([]);

  const {
    activeNotes: playbackActiveNotes,
    isPlaying,
    currentTime,
    speed,
    play,
    pause,
    stop,
    setSpeed,
  } = useMidiPlayer(midiEvents, {
    onNoteOn: playNote,
    onNoteOff: stopNote,
  });

  // Load file list
  useEffect(() => {
    getMidiFiles().then(setMidiFiles);
  }, []);

  // Handle file selection and parsing
  const handleSelectFile = useCallback(
    async (file: MidiFile) => {
      setSelectedFile(file);
      stop(); // Reset current playback
      try {
        const midi = await loadMidiFile(file.url);
        const events = getMidiEvents(midi);
        setMidiEvents(events);
      } catch (err) {
        console.error("Failed to load MIDI file:", err);
        setMidiEvents([]);
      }
    },
    [stop],
  );

  // Auto-select if there is only one file available
  useEffect(() => {
    if (midiFiles.length === 1 && !selectedFile) {
      handleSelectFile(midiFiles[0]);
    }
  }, [midiFiles, selectedFile, handleSelectFile]);

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
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 ml-2">
              1. Setup Your Stage
            </h2>
            <DeviceSelector
              devices={inputs}
              isLoading={isMidiLoading}
              error={midiError}
              selectedDevice={selectedDevice}
              onSelect={selectDevice}
            />
          </div>

          <div className="space-y-8 pt-8 border-t-4 border-gray-50">
            <h2 className="text-2xl font-bold text-gray-800 ml-2">
              2. Choose Your Track
            </h2>
            <MidiControlCenter
              files={midiFiles}
              selectedFile={selectedFile}
              onSelectFile={handleSelectFile}
              isPlaying={isPlaying}
              onPlay={play}
              onPause={pause}
              onStop={stop}
              speed={speed}
              onSpeedChange={setSpeed}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
          </div>

          {(selectedDevice || selectedFile) && (
            <div className="pt-8 border-t-4 border-gray-50 space-y-0 animate-in fade-in zoom-in duration-500">
              <div className="flex items-center justify-between pb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedFile ? selectedFile.name : "Your Keyboard"}
                </h2>
                <div className="flex gap-2">
                  {selectedDevice && (
                    <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      LIVE
                    </div>
                  )}
                  {isPlaying && (
                    <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      PLAYING
                    </div>
                  )}
                </div>
              </div>

              {/* Integrated Visualizer Area */}
              <div className="flex flex-col">
                <FalldownVisualizer
                  events={midiEvents}
                  currentTime={currentTime}
                  speed={speed}
                  height={300}
                />
                <PianoKeyboard
                  liveNotes={liveActiveNotes}
                  playbackNotes={playbackActiveNotes}
                />
              </div>
            </div>
          )}
        </section>

        {!selectedDevice && !selectedFile && !isMidiLoading && (
          <div className="text-center p-12 border-4 border-dashed border-gray-200 rounded-[3rem] text-gray-400">
            <p className="text-xl font-medium">Waiting for some music...</p>
          </div>
        )}
      </main>
    </div>
  );
}
