"use client";

import { use, useCallback, useEffect, useMemo, useRef } from "react";

import { useTrackPlayer } from "@/features/audio-player";
import { useCollection } from "@/features/collection";
import { useGameplay, useScoreEngine, useTimeline } from "@/features/gameplay";
import { getTrackData } from "@/features/midi-assets";
import { useActiveNotes, useGear } from "@/features/midi-hardware";
import { useOptions } from "@/features/options";
import { useAutoPause } from "@/shared/hooks/use-auto-pause";
import { useFullscreen } from "@/shared/hooks/use-fullscreen";
import { useNavigation } from "@/shared/hooks/use-navigation";
import { useWakeLock } from "@/shared/hooks/use-wake-lock";

import { PlayPageView } from "./play-page.view";

/**
 * PlayPageClient encapsulates all game logic, hooks, and state management.
 * It uses standard Next.js error/loading patterns to delegate specialized UI
 * states to root boundaries.
 */
export function PlayPageClient() {
  const { toScore, toPause, toHome, toCollection } = useNavigation();
  const { selectedTrack } = useCollection();
  const { selectedMIDIInput, selectedMIDIOutput } = useGear();
  const { gameState, startGame, pauseGame, finishGame } = useGameplay();

  const trackDataPromise = useMemo(() => {
    if (!selectedTrack) return null;
    return getTrackData(selectedTrack.url, selectedMIDIInput);
  }, [selectedTrack, selectedMIDIInput]);
  const { speed, demoMode } = useOptions();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Navigation Guard: Redirect if essentials are missing
  useEffect(() => {
    if (!selectedMIDIInput) {
      toHome();
    } else if (!selectedTrack) {
      toCollection();
    }
  }, [selectedMIDIInput, selectedTrack, toHome, toCollection]);

  // Initialize session if idle
  useEffect(() => {
    if (gameState.status === "idle") {
      startGame();
    }
  }, [gameState.status, startGame]);

  // Resolve data via Suspense (use hook)
  const trackData = trackDataPromise ? use(trackDataPromise) : null;

  // Extract data with stable references for hook dependencies
  const notes = useMemo(() => trackData?.notes ?? [], [trackData]);
  const groups = useMemo(() => trackData?.groups ?? [], [trackData]);
  const totalDurationMs = trackData?.totalDurationMs ?? 0;

  const scrollRef = useRef<HTMLDivElement>(null);
  const handleFinishRef = useRef<() => void>(() => {});

  const isPlaying = totalDurationMs > 0;

  useWakeLock(isPlaying);

  const onFinishProxy = useCallback(() => {
    handleFinishRef.current();
  }, []);

  const { getCurrentTimeMs, getProgress } = useTimeline({
    totalDurationMs,
    speed,
    initialProgress:
      gameState.status === "playing" || gameState.status === "paused"
        ? gameState.currentProgress
        : 0,
    onFinish: onFinishProxy,
  });

  const { getScore, getCombo, getLastHitQuality, processNoteEvent } = useScoreEngine({
    notes,
    getCurrentTimeMs,
    initialScore:
      gameState.status === "playing" || gameState.status === "paused" ? gameState.score : 0,
    initialCombo:
      gameState.status === "playing" || gameState.status === "paused" ? gameState.combo : 0,
    initialTimeMs:
      (gameState.status === "playing" || gameState.status === "paused"
        ? gameState.currentProgress
        : 0) * totalDurationMs,
  });


  const liveActiveNotes = useActiveNotes(selectedMIDIInput, processNoteEvent);

  const { playbackNotes } = useTrackPlayer({
    containerRef: scrollRef,
    enabled: demoMode && !!trackData && groups.length > 0,
    selectedMIDIOutput,
    processNoteEvent,
  });

  // Update finish callback ref in an effect to avoid render-phase side effects
  useEffect(() => {
    handleFinishRef.current = () => {
      finishGame({
        score: getScore(),
        combo: getCombo(),
      });
      toScore();
    };
  }, [finishGame, toScore, getScore, getCombo]);

  // Handle Pause
  const handlePause = useCallback(() => {
    pauseGame({
      score: getScore(),
      combo: getCombo(),
      currentProgress: getProgress(),
    });
    toPause();
  }, [getScore, getCombo, getProgress, toPause, pauseGame]);

  // Auto-pause when losing focus or switching tabs
  useAutoPause(handlePause);

  // --- Native Next.js Boundaries & Guards ---

  // If missing essentials, we should ideally have redirected or suspended already
  if (!trackData || !selectedTrack || !selectedMIDIInput) {
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
      notes={notes}
      groups={groups}
      scrollRef={scrollRef}
      getCurrentTimeMs={getCurrentTimeMs}
      speed={speed}
    />
  );
}
