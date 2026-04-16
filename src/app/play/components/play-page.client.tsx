"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCollection } from "@/context/collection-context";
import { useGear } from "@/context/gear-context";
import { useOptions } from "@/context/options-context";
import { useScore } from "@/context/score-context";
import { useStage } from "@/context/stage-context";
import { useTrack } from "@/context/track-context";
import { useActiveNotes } from "@/hooks/use-active-notes";
import { useAutoPause } from "@/hooks/use-auto-pause";
import { useDemoPlayback } from "@/hooks/use-demo-playback";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useLaneScoreEngine } from "@/hooks/use-lane-score-engine";
import { useLaneTimeline } from "@/hooks/use-lane-timeline";
import { useMidiAudio } from "@/hooks/use-midi-audio";
import { useNavigation } from "@/hooks/use-navigation";
import { useWakeLock } from "@/hooks/use-wake-lock";
import { getNoteUnits, getVisibleMidiRange } from "@/lib/device/piano";
import {
  LANE_SCROLL_DURATION_MS,
  PIANO_88_KEY_MAX,
  PIANO_88_KEY_MIN,
} from "@/lib/midi/constant";
import { calculateMaxPossibleScore } from "@/lib/midi/score-utils";
import { PlayPageView } from "./play-page.view";

/**
 * PlayPageClient encapsulates all game logic, hooks, and state management.
 * It uses standard Next.js error/loading patterns to delegate specialized UI
 * states to root boundaries.
 */
export function PlayPageClient() {
  const { toScore, toPause } = useNavigation();
  const { selectedTrack } = useCollection();
  const { selectedMIDIInput, selectedMIDIOutput } = useGear();
  const { trackStatus } = useTrack();
  const { gameSession, setGameSession } = useStage();
  const { speed, demoMode } = useOptions();
  const { setSessionResults } = useScore();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Extract data with fallbacks to ensure hooks are called unconditionally
  const events = trackStatus.isReady ? trackStatus.events : [];
  const groups = trackStatus.isReady ? trackStatus.groups : [];
  const totalDurationMs = trackStatus.isReady ? trackStatus.totalDurationMs : 0;
  const isLoading = trackStatus.isLoading;

  // Calculate dynamic piano range for consistent grid alignment
  const visibleMidiRange = useMemo(() => {
    if (groups.length === 0) {
      return { startNote: PIANO_88_KEY_MIN, endNote: PIANO_88_KEY_MAX };
    }
    const notes = groups.flatMap((g) => g.spans.map((s) => s.note));
    return getVisibleMidiRange(notes);
  }, [groups]);

  const { startUnit, endUnit } = getNoteUnits(
    visibleMidiRange.startNote,
    visibleMidiRange.endNote,
  );

  const totalNotes = useMemo(
    () => events.filter((e) => e.type === "noteOn").length,
    [events],
  );
  const maxPossibleScore = useMemo(
    () => calculateMaxPossibleScore(totalNotes),
    [totalNotes],
  );

  const liveActiveNotes = useActiveNotes(selectedMIDIInput);
  const [playbackNotes, setPlaybackNotes] = useState<Set<number>>(new Set());

  const scrollRef = useRef<HTMLDivElement>(null);
  const handleFinishRef = useRef<() => void>(() => {});

  const isPlaying = totalDurationMs > 0 && !isLoading && trackStatus.isReady;

  useWakeLock(isPlaying);

  const onFinishProxy = useCallback(() => {
    handleFinishRef.current();
  }, []);

  const { getCurrentTimeMs, getProgress } = useLaneTimeline({
    totalDurationMs,
    speed,
    initialProgress: gameSession?.currentProgress ?? 0,
    onFinish: onFinishProxy,
  });

  const {
    getScore,
    getCombo,
    getLastHitQuality,
    processNoteEvent,
    finalizeScore,
  } = useLaneScoreEngine({
    midiInput: selectedMIDIInput,
    modelEvents: events,
    getCurrentTimeMs,
    initialScore: gameSession?.score ?? 0,
    initialCombo: gameSession?.combo ?? 0,
    initialTimeMs: (gameSession?.currentProgress ?? 0) * totalDurationMs,
  });

  const { playNote, stopNote } = useMidiAudio(selectedMIDIOutput);

  const onNoteOn = useCallback(
    (note: number, velocity: number) => {
      setPlaybackNotes((prev) => {
        const next = new Set(prev);
        next.add(note);
        return next;
      });
      playNote(note, velocity);

      // If in demo mode, feed the note to the scoring engine
      if (demoMode) {
        processNoteEvent({ type: "note-on", note, velocity });
      }
    },
    [playNote, demoMode, processNoteEvent],
  );

  const onNoteOff = useCallback(
    (note: number) => {
      setPlaybackNotes((prev) => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
      stopNote(note);

      if (demoMode) {
        processNoteEvent({ type: "note-off", note, velocity: 0 });
      }
    },
    [stopNote, demoMode, processNoteEvent],
  );

  useDemoPlayback({
    containerRef: scrollRef,
    demoMode,
    isLoading,
    groups,
    onNoteOn,
    onNoteOff,
  });

  // Update finish callback ref in an effect to avoid render-phase side effects
  useEffect(() => {
    handleFinishRef.current = () => {
      finalizeScore();
      const finalScore = getScore();
      const finalCombo = getCombo();
      const normalizedScore =
        maxPossibleScore > 0 ? (finalScore / maxPossibleScore) * 100 : 0;

      setSessionResults({
        score: normalizedScore,
        accuracy: normalizedScore,
        combo: finalCombo,
      });
      setGameSession(null);
      toScore();
    };
  }, [
    maxPossibleScore,
    setGameSession,
    setSessionResults,
    toScore,
    getScore,
    getCombo,
    finalizeScore,
  ]);

  // Handle Pause
  const handlePause = useCallback(() => {
    setGameSession({
      score: getScore(),
      combo: getCombo(),
      currentProgress: getProgress(),
    });
    toPause();
  }, [getScore, getCombo, getProgress, toPause, setGameSession]);

  // Auto-pause when losing focus or switching tabs
  useAutoPause(handlePause);

  // --- Native Next.js Boundaries & Guards (Controlled return after all hooks) ---

  if (trackStatus.error) {
    throw new Error(`MIDI TRACK ERROR: ${trackStatus.error}`);
  }

  // If not ready, return null to allow parent Suspense/loading.tsx to handle fallback
  if (
    isLoading ||
    !trackStatus.isReady ||
    !selectedTrack ||
    (!selectedMIDIInput && !demoMode)
  ) {
    return null;
  }

  return (
    <PlayPageView
      selectedMIDIInput={selectedMIDIInput}
      selectedTrack={selectedTrack}
      getScore={getScore}
      maxPossibleScore={maxPossibleScore}
      getCombo={getCombo}
      getLastHitQuality={getLastHitQuality}
      getProgress={getProgress}
      handlePause={handlePause}
      isFullscreen={isFullscreen}
      handleToggleFullscreen={toggleFullscreen}
      liveActiveNotes={liveActiveNotes}
      playbackNotes={playbackNotes}
      groups={groups}
      scrollRef={scrollRef}
      getCurrentTimeMs={getCurrentTimeMs}
      startUnit={startUnit}
      endUnit={endUnit}
      speed={speed}
      laneScrollDurationMs={LANE_SCROLL_DURATION_MS}
    />
  );
}
