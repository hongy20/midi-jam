"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStage } from "@/app/play/context/stage-context";
import { useActiveNotes } from "@/app/play/hooks/use-active-notes";
import { useLaneTimeline } from "@/app/play/hooks/use-lane-timeline";
import { getNoteUnits, getVisibleMidiRange } from "@/app/play/lib/piano";
import { useNotePlayer, useTrackPlayer } from "@/features/audio-player";
import { useCollection } from "@/features/collection";
import {
  LANE_SCROLL_DURATION_MS,
  PIANO_88_KEY_MAX,
  PIANO_88_KEY_MIN,
  useTrack,
} from "@/features/midi-assets";
import { useGear } from "@/features/midi-hardware";
import { useNavigation } from "@/features/navigation";
import { useScore, useScoreEngine } from "@/features/score";
import { useOptions } from "@/features/settings";
import { useAutoPause } from "@/shared/hooks/use-auto-pause";
import { useFullscreen } from "@/shared/hooks/use-fullscreen";
import { useWakeLock } from "@/shared/hooks/use-wake-lock";

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
  const spans = useMemo(() => (trackStatus.isReady ? trackStatus.spans : []), [trackStatus]);
  const groups = useMemo(() => (trackStatus.isReady ? trackStatus.groups : []), [trackStatus]);
  const totalDurationMs = trackStatus.isReady ? trackStatus.totalDurationMs : 0;
  const isLoading = trackStatus.isLoading;

  // Calculate dynamic piano range for consistent grid alignment
  const visibleMidiRange = useMemo(() => {
    if (spans.length === 0) {
      return { startNote: PIANO_88_KEY_MIN, endNote: PIANO_88_KEY_MAX };
    }
    return getVisibleMidiRange(spans.map((n) => n.note));
  }, [spans]);

  const { startUnit, endUnit } = getNoteUnits(visibleMidiRange.startNote, visibleMidiRange.endNote);

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

  const { getScore, getCombo, getLastHitQuality, processNoteEvent } = useScoreEngine({
    midiInput: selectedMIDIInput,
    spans,
    getCurrentTimeMs,
    initialScore: gameSession?.score ?? 0,
    initialCombo: gameSession?.combo ?? 0,
    initialTimeMs: (gameSession?.currentProgress ?? 0) * totalDurationMs,
  });

  const { playNote, stopNote } = useNotePlayer(selectedMIDIOutput);

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

  useTrackPlayer({
    containerRef: scrollRef,
    enabled: demoMode && !isLoading,
    groups,
    onNoteOn,
    onNoteOff,
  });

  // Update finish callback ref in an effect to avoid render-phase side effects
  useEffect(() => {
    handleFinishRef.current = () => {
      const finalScore = getScore();
      const finalCombo = getCombo();

      setSessionResults({
        score: finalScore,
        combo: finalCombo,
      });
      setGameSession(null);
      toScore();
    };
  }, [setGameSession, setSessionResults, toScore, getScore, getCombo]);

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
  if (isLoading || !trackStatus.isReady || !selectedTrack || !selectedMIDIInput) {
    return null;
  }

  return (
    <PlayPageView
      selectedMIDIInput={selectedMIDIInput}
      selectedTrack={selectedTrack}
      getScore={getScore}
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
