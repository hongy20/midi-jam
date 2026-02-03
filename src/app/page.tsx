"use client";

import { useCallback, useEffect, useState } from "react";
import { FalldownVisualizer } from "@/components/midi/falldown-visualizer";
import { MidiHeader } from "@/components/midi/midi-header";
import { PianoKeyboard } from "@/components/midi/piano-keyboard";
import { PlaybackControls } from "@/components/midi/playback-controls";
import { useActiveNotes } from "@/hooks/use-active-notes";
import { useMidiAudio } from "@/hooks/use-midi-audio";
import { useMIDIConnection } from "@/hooks/use-midi-connection";
import { useMIDIInputs } from "@/hooks/use-midi-inputs";
import { useMidiPlayer } from "@/hooks/use-midi-player";
import { getMidiFiles } from "@/lib/action/midi";
import {
  getBarLines,
  getMidiEvents,
  getNoteRange,
  getNoteSpans,
  loadMidiFile,
  type MidiEvent,
  type NoteSpan,
} from "@/lib/midi/midi-player";

interface MidiFile {
  name: string;
  url: string;
}

const NOTE_RANGE_BUFFER = 4;

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
  const [noteSpans, setNoteSpans] = useState<NoteSpan[]>([]);
  const [barLines, setBarLines] = useState<number[]>([]);
  const [noteRange, setNoteRange] = useState<{
    min: number;
    max: number;
  } | null>(null);

  // UI State
  const [isMinimized, setIsMinimized] = useState(false);
  const [wasPlayingBeforeExpand, setWasPlayingBeforeExpand] = useState(false);

  const {
    activeNotes: playbackActiveNotes,
    isPlaying,
    currentTime,
    duration,
    speed,
    play,
    pause,
    stop,
    setSpeed,
  } = useMidiPlayer(midiEvents, {
    onNoteOn: playNote,
    onNoteOff: stopNote,
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleToggleMinimize = useCallback(() => {
    if (isMinimized) {
      // Expanding
      if (isPlaying) {
        setWasPlayingBeforeExpand(true);
        pause();
      } else {
        setWasPlayingBeforeExpand(false);
      }
    } else {
      // Collapsing
      if (wasPlayingBeforeExpand) {
        play();
        setWasPlayingBeforeExpand(false);
      }
    }
    setIsMinimized(!isMinimized);
  }, [isMinimized, isPlaying, pause, play, wasPlayingBeforeExpand]);

  // Load file list
  useEffect(() => {
    getMidiFiles().then(setMidiFiles);
  }, []);

  // Handle file selection and parsing
  const handleSelectFile = useCallback(
    async (file: MidiFile) => {
      setSelectedFile(file);
      setIsMinimized(true); // Minimize on selection
      setWasPlayingBeforeExpand(false);
      stop(); // Reset current playback
      try {
        const midi = await loadMidiFile(file.url);
        const events = getMidiEvents(midi);
        setMidiEvents(events);
        setNoteSpans(getNoteSpans(events));
        setBarLines(getBarLines(midi));

        // Calculate range with a small buffer, always including C4 (60)
        const range = getNoteRange(events);
        if (range) {
          setNoteRange({
            min: Math.max(21, Math.min(60, range.min - NOTE_RANGE_BUFFER)),
            max: Math.min(108, Math.max(60, range.max + NOTE_RANGE_BUFFER)),
          });
        } else {
          setNoteRange(null);
        }
      } catch (err) {
        console.error("Failed to load MIDI file:", err);
        setMidiEvents([]);
        setNoteSpans([]);
        setNoteRange(null);
      }
    },
    [stop],
  );

  const handleSelectDevice = (device: WebMidi.MIDIInput | null) => {
    selectDevice(device);
    if (device) {
      setIsMinimized(true);
      setWasPlayingBeforeExpand(false);
      // Reset range for live jamming unless a file is also loaded
      if (!selectedFile) setNoteRange(null);
    }
  };

  // Auto-select if there is only one file available
  useEffect(() => {
    if (midiFiles.length === 1 && !selectedFile) {
      handleSelectFile(midiFiles[0]);
    }
  }, [midiFiles, selectedFile, handleSelectFile]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar Controls */}
      <MidiHeader
        devices={inputs}
        isLoading={isMidiLoading}
        error={midiError}
        selectedDevice={selectedDevice}
        onSelectDevice={handleSelectDevice}
        files={midiFiles}
        selectedFile={selectedFile}
        onSelectFile={handleSelectFile}
        isMinimized={isMinimized}
        onToggleMinimize={handleToggleMinimize}
      />

      <div
        className={`fixed top-4 right-4 z-50 pointer-events-auto transition-all duration-500 flex flex-col items-end gap-2 ${
          !isMinimized
            ? "opacity-0 -translate-y-12 pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
      >
        <PlaybackControls
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
          onStop={stop}
          speed={speed}
          onSpeedChange={setSpeed}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />

        {selectedFile && (
          <div className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-lg rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold text-slate-500 animate-in fade-in slide-in-from-top-2 duration-500">
            <span className="text-blue-600 w-8 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="h-2 w-px bg-gray-200" />
            <span className="w-8">{formatTime(duration)}</span>
          </div>
        )}
      </div>

      <main className="flex-1 flex flex-col pt-24">
        {selectedDevice || selectedFile ? (
          <div className="max-w-7xl mx-auto w-full px-4 animate-in fade-in duration-500 space-y-8">
            {/* 3D Perspective Visualizer Area */}
            <div className="relative [perspective:1200px] [perspective-origin:50%_25%] py-8 md:py-12">
              <div
                key={selectedFile?.url || "jam"}
                className="flex flex-col gap-0 shadow-2xl rounded-[2rem] md:rounded-[3rem] overflow-hidden border-2 md:border-4 border-gray-100 bg-white animate-in zoom-in-95 fade-in duration-1000 ease-out [transform-style:preserve-3d] [transform:rotateX(15deg)] md:[transform:rotateX(25deg)]"
              >
                <FalldownVisualizer
                  spans={noteSpans}
                  barLines={barLines}
                  currentTime={currentTime}
                  speed={speed}
                  height={600}
                  rangeStart={noteRange?.min}
                  rangeEnd={noteRange?.max}
                />
                <PianoKeyboard
                  liveNotes={liveActiveNotes}
                  playbackNotes={playbackActiveNotes}
                  rangeStart={noteRange?.min}
                  rangeEnd={noteRange?.max}
                />
              </div>
            </div>

            <div className="text-center pb-12">
              <p className="text-gray-400 text-sm">
                Use the top bar to change settings
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center p-12 border-4 border-dashed border-gray-200 rounded-[3rem] text-gray-400 max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-300 mb-4">
                Ready to Jam?
              </h2>
              <p className="text-xl font-medium">
                Select a MIDI device or a song from the top menu to get started.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}