"use client";

import { useCallback, useEffect, useState } from "react";
import { CountdownOverlay } from "@/components/countdown-overlay";
import { FalldownVisualizer } from "@/components/falldown-visualizer";
import { MidiControlRoom } from "@/components/midi-control-room";
import { PianoKeyboard } from "@/components/piano-keyboard";
import { PlaybackControls } from "@/components/playback-controls";
import { ScoreHud } from "@/components/score-hud";
import type { MidiFile } from "@/components/sound-track-selector";
import { useActiveNotes } from "@/hooks/use-active-notes";
import { useMidiAudio } from "@/hooks/use-midi-audio";
import { useMIDIDevices } from "@/hooks/use-midi-devices";
import { useMidiPlayer } from "@/hooks/use-midi-player";
import { useMIDISelection } from "@/hooks/use-midi-selection";
import { useScoreEngine } from "@/hooks/use-score-engine";
import { getSoundTracks } from "@/lib/action/sound-track";
import { isBlackKey } from "@/lib/device/piano";
import {
  MIDI_NOTE_C4,
  PIANO_88_KEY_MAX,
  PIANO_88_KEY_MIN,
} from "@/lib/midi/constant";
import { loadMidiFile } from "@/lib/midi/midi-loader";
import {
  getBarLines,
  getMidiEvents,
  getNoteRange,
  getNoteSpans,
  type MidiEvent,
  type NoteSpan,
} from "@/lib/midi/midi-parser";

const NOTE_RANGE_BUFFER = 4;

export default function Home() {
  const { inputs, outputs, isLoading, error } = useMIDIDevices();
  const { selectedMIDIInput, selectedMIDIOutput, selectMIDIInput } =
    useMIDISelection(inputs, outputs);

  const [demoMode, setDemoMode] = useState(false);

  // Audio setup
  const { playNote, stopNote, stopAllNotes, playCountdownBeep } = useMidiAudio(
    demoMode,
    selectedMIDIOutput,
  );

  // Live input tracking
  const liveActiveNotes = useActiveNotes(selectedMIDIInput, {
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
    countdownRemaining,
    isCountdownActive,
    play,
    pause,
    stop,
    setSpeed,
  } = useMidiPlayer(midiEvents, {
    onNoteOn: playNote,
    onNoteOff: stopNote,
    onAllNotesOff: stopAllNotes,
  });

  const { score, combo, lastAccuracy, highScore, bestCombo } = useScoreEngine(
    midiEvents,
    currentTime,
    demoMode
      ? new Set([
          ...Array.from(liveActiveNotes),
          ...Array.from(playbackActiveNotes.keys()),
        ])
      : liveActiveNotes,
    isPlaying,
    selectedFile?.url,
  );

  const formatTime = (seconds: number) => {
    const totalSeconds = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleToggleMinimize = () => {
    if (isMinimized) {
      if (isPlaying) {
        setWasPlayingBeforeExpand(true);
        pause();
      } else {
        setWasPlayingBeforeExpand(false);
      }
    } else {
      if (wasPlayingBeforeExpand) {
        play();
        setWasPlayingBeforeExpand(false);
      }
    }
    setIsMinimized(!isMinimized);
  };

  // Load file list
  useEffect(() => {
    getSoundTracks().then(setMidiFiles);
  }, []);

  // Handle countdown beeps
  useEffect(() => {
    if (isCountdownActive && countdownRemaining > 0) {
      playCountdownBeep(countdownRemaining === 1);
    }
  }, [isCountdownActive, countdownRemaining, playCountdownBeep]);

  // Handle file selection and parsing
  const handleSelectFile = useCallback(
    async (file: MidiFile) => {
      setSelectedFile(file);
      setIsMinimized(true);
      setWasPlayingBeforeExpand(false);
      stop();
      try {
        const midi = await loadMidiFile(file.url);
        const events = getMidiEvents(midi);
        setMidiEvents(events);
        setNoteSpans(getNoteSpans(events));
        setBarLines(getBarLines(midi));

        const range = getNoteRange(events);
        if (range) {
          let min = Math.max(
            PIANO_88_KEY_MIN,
            Math.min(MIDI_NOTE_C4, range.min - NOTE_RANGE_BUFFER),
          );
          let max = Math.min(
            PIANO_88_KEY_MAX,
            Math.max(MIDI_NOTE_C4, range.max + NOTE_RANGE_BUFFER),
          );
          if (isBlackKey(min)) min--;
          if (isBlackKey(max)) max++;
          setNoteRange({ min, max });
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

  const handleSelectMIDIInput = (input: WebMidi.MIDIInput | null) => {
    selectMIDIInput(input);
    if (input) {
      setIsMinimized(true);
      setWasPlayingBeforeExpand(false);
      if (!selectedFile) setNoteRange(null);
    }
  };

  useEffect(() => {
    if (midiFiles.length === 1 && !selectedFile) {
      handleSelectFile(midiFiles[0]);
    }
  }, [midiFiles, selectedFile, handleSelectFile]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">
      {/* Aurora Mesh Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse duration-[8s]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse duration-[12s]" />
      </div>

      {/* Top Bar Controls */}
      <MidiControlRoom
        inputs={inputs}
        isLoading={isLoading}
        error={error}
        selectedMIDIInput={selectedMIDIInput}
        onSelectMIDIInput={handleSelectMIDIInput}
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
          demoMode={demoMode}
          onToggleDemo={() => setDemoMode(!demoMode)}
        />

        {selectedFile && (
          <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold text-slate-400 animate-in fade-in slide-in-from-top-2 duration-500">
            <span className="w-8 text-right">{formatTime(currentTime)}</span>
            <div className="h-2 w-px bg-slate-400/50" />
            <span className="w-8">{formatTime(duration)}</span>
          </div>
        )}
      </div>

      <main className="flex-1 relative w-full min-h-0">
        <CountdownOverlay
          countdownRemaining={countdownRemaining}
          isActive={isCountdownActive}
        />
        {selectedFile && isPlaying && (
          <ScoreHud
            score={score}
            combo={combo}
            lastAccuracy={lastAccuracy}
            highScore={highScore}
            bestCombo={bestCombo}
          />
        )}
        {selectedMIDIInput || selectedFile ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
            {/* 3D Immersive Stage */}
            <div className="relative w-full h-[85vh] perspective-[1500px] perspective-origin-[50%_50%] flex items-center justify-center px-4">
              <div
                key={selectedFile?.url || "jam"}
                className="w-full h-full flex flex-col bg-transparent rounded-3xl overflow-hidden transition-transform duration-1000 ease-out transform-3d transform-[rotateX(25deg)_scale(0.9)]"
              >
                <FalldownVisualizer
                  spans={noteSpans}
                  barLines={barLines}
                  currentTime={currentTime}
                  speed={speed}
                  rangeStart={noteRange?.min}
                  rangeEnd={noteRange?.max}
                />
                <PianoKeyboard
                  liveNotes={liveActiveNotes}
                  playbackNotes={
                    demoMode
                      ? new Set(playbackActiveNotes.keys())
                      : new Set<number>()
                  }
                  rangeStart={noteRange?.min}
                  rangeEnd={noteRange?.max}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center p-12 border-4 border-dashed border-gray-200 rounded-[3rem] text-gray-400 max-w-2xl animate-in zoom-in-95 duration-700">
              <h2 className="text-3xl font-bold text-gray-300 mb-4 uppercase tracking-tighter">
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
