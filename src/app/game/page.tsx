"use client";

import { Pause } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LaneStage } from "@/components/lane-stage/lane-stage";
import { ScoreHudLite } from "@/components/score-hud-lite";
import { VirtualInstrument } from "@/components/virtual-instrument";
import { useAppContext } from "@/context/app-context";
import { useActiveNotes } from "@/hooks/use-active-notes";
import { useDemoPlayback } from "@/hooks/use-demo-playback";
import { useLaneScoreEngine } from "@/hooks/use-lane-score-engine";
import { useLaneTimeline } from "@/hooks/use-lane-timeline";
import { useMidiAudio } from "@/hooks/use-midi-audio";
import { useNavigation } from "@/hooks/use-navigation";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { getNoteUnits, getVisibleMidiRange } from "@/lib/device/piano";
import {
  LEAD_IN_DEFAULT_MS,
  LEAD_OUT_DEFAULT_MS,
  PIANO_88_KEY_MAX,
  PIANO_88_KEY_MIN,
} from "@/lib/midi/constant";
import styles from "./page.module.css";

export default function GamePage() {
  const { toResults, toPause } = useNavigation();
  const { tracks, instruments, game, settings, results } = useAppContext();

  // Extract variables from context for easier access
  const { selected: selectedTrack } = tracks;
  const { input: selectedMIDIInput, output: selectedMIDIOutput } = instruments;
  const {
    track: trackLoadStatus,
    session: gameSession,
    setSession: setGameSession,
  } = game;
  const { speed, demoMode } = settings;
  const { set: setSessionResults } = results;

  // Track Data (only if ready)
  const events = trackLoadStatus.isReady ? trackLoadStatus.events : [];
  const spans = trackLoadStatus.isReady ? trackLoadStatus.spans : [];
  const originalDurationMs = trackLoadStatus.isReady
    ? trackLoadStatus.originalDurationMs
    : 0;
  const isLoading = trackLoadStatus.isLoading;

  // Calculate dynamic piano range for consistent grid alignment
  const visibleMidiRange = useMemo(() => {
    if (!spans || spans.length === 0) {
      return { startNote: PIANO_88_KEY_MIN, endNote: PIANO_88_KEY_MAX };
    }
    const notes = spans.map((s) => s.note);
    return getVisibleMidiRange(notes);
  }, [spans]);

  const { startUnit, endUnit } = getNoteUnits(
    visibleMidiRange.startNote,
    visibleMidiRange.endNote,
  );

  const liveActiveNotes = useActiveNotes(selectedMIDIInput);
  const [playbackNotes, setPlaybackNotes] = useState<Set<number>>(new Set());

  const [isPaused, setIsPaused] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const totalDurationMs =
    originalDurationMs > 0
      ? originalDurationMs + LEAD_IN_DEFAULT_MS + LEAD_OUT_DEFAULT_MS
      : 0;
  const handleFinishRef = useRef<() => void>(() => {});

  const isPlaying = !isPaused && originalDurationMs > 0;

  useWakeLock(isPlaying);

  const onFinishProxy = useCallback(() => {
    handleFinishRef.current();
  }, []);

  const { getCurrentTimeMs, getProgress } = useLaneTimeline({
    containerRef: scrollRef,
    totalDurationMs,
    speed,
    isPaused,
    initialTimeMs: gameSession?.currentTimeMs ?? 0,
    onFinish: onFinishProxy,
  });

  const { score, combo, lastHitQuality } = useLaneScoreEngine({
    midiInput: selectedMIDIInput,
    modelEvents: events,
    getCurrentTimeMs,
    isPlaying,
    initialScore: gameSession?.score ?? 0,
    initialCombo: gameSession?.combo ?? 0,
    initialTimeMs: gameSession?.currentTimeMs ?? 0,
  });

  // Auto-pause and save session if device is disconnected mid-game
  useEffect(() => {
    if (isPlaying && !selectedMIDIInput) {
      setGameSession({
        isPaused: true,
        score,
        combo,
        currentTimeMs: getCurrentTimeMs(),
      });
      // NavigationGuard will handle the redirect to instruments
    }
  }, [
    isPlaying,
    selectedMIDIInput,
    score,
    combo,
    getCurrentTimeMs,
    setGameSession,
  ]);

  const { playNote, stopNote } = useMidiAudio(demoMode, selectedMIDIOutput);

  const handleNoteOn = useCallback(
    (note: number, velocity: number) => {
      setPlaybackNotes((prev) => {
        const next = new Set(prev);
        next.add(note);
        return next;
      });
      playNote(note, velocity);
    },
    [playNote],
  );

  const handleNoteOff = useCallback(
    (note: number) => {
      setPlaybackNotes((prev) => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
      stopNote(note);
    },
    [stopNote],
  );

  useDemoPlayback({
    containerRef: scrollRef,
    demoMode,
    isLoading,
    spans,
    onNoteOn: handleNoteOn,
    onNoteOff: handleNoteOff,
  });

  // Update finish callback ref in an effect to avoid render-phase side effects
  useEffect(() => {
    handleFinishRef.current = () => {
      setSessionResults({
        score,
        accuracy: Math.floor((score / (events.length * 100)) * 100) || 0,
        combo,
      });
      setGameSession(null);
      toResults();
    };
  }, [
    score,
    combo,
    events.length,
    setGameSession,
    setSessionResults,
    toResults,
  ]);

  // Handle Pause
  const handleTogglePause = useCallback(() => {
    setIsPaused(true);
    setGameSession({
      isPaused: true,
      score,
      combo,
      currentTimeMs: getCurrentTimeMs(),
    });
    toPause();
  }, [score, combo, getCurrentTimeMs, toPause, setGameSession]);

  // Note: Redirects are handled by NavigationGuard

  if (!selectedTrack || !selectedMIDIInput) {
    return null;
  }

  return (
    <div
      className={styles.container}
      style={
        {
          "--start-unit": startUnit,
          "--end-unit": endUnit,
        } as React.CSSProperties
      }
    >
      {/* Row 1: Status Bar (Fixed height) */}
      <header className="h-[var(--header-height)] w-full p-4 sm:p-8 flex justify-between items-center layout-padding bg-background/50 backdrop-blur-md border-b border-foreground/5">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex flex-col">
            <span className="text-foreground/50 font-bold uppercase tracking-[0.2em] text-[10px] mb-0.5">
              {selectedMIDIInput.name} • {selectedTrack.name}
            </span>
            <ScoreHudLite
              score={score}
              combo={combo}
              lastHitQuality={lastHitQuality}
              getProgress={getProgress}
              isPaused={isPaused}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          <button
            type="button"
            onClick={handleTogglePause}
            className="w-12 h-12 bg-foreground/10 hover:bg-foreground/20 rounded-full flex items-center justify-center transition-colors group backdrop-blur-md border border-foreground/10 shadow-lg"
          >
            <div className="transition-transform duration-300 group-hover:scale-110">
              <Pause className="w-6 h-6 fill-current" />
            </div>
          </button>
        </div>
      </header>

      {/* Row 2: Gameplay Lane (Flexible) */}
      <main className="relative w-full h-full overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            <span className="font-bold uppercase tracking-widest text-xs">
              Loading Track...
            </span>
          </div>
        ) : trackLoadStatus.error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <span className="text-red-500 font-bold uppercase tracking-widest text-xs">
              Error Loading Track: {trackLoadStatus.error}
            </span>
          </div>
        ) : (
          <LaneStage
            spans={spans}
            originalDurationMs={originalDurationMs}
            scrollRef={scrollRef}
            inputDevice={selectedMIDIInput}
          />
        )}
      </main>

      {/* Row 3: Instrument (Fixed height based on content) */}
      <footer className="h-[var(--footer-height)] w-full bg-background/50 backdrop-blur-md border-t border-foreground/5">
        <VirtualInstrument
          inputDevice={selectedMIDIInput}
          liveNotes={liveActiveNotes}
          playbackNotes={playbackNotes}
        />
      </footer>
    </div>
  );
}
