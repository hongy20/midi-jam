"use client";

import { use, useCallback, useEffect, useMemo, useRef } from "react";

import { useTrackPlayer } from "@/features/audio-player";
import { useCollection } from "@/features/collection";
import { getTrackData } from "@/features/midi-assets";
import { useActiveNotes, useGear } from "@/features/midi-hardware";
import { useOptions } from "@/features/options";
import { getPianoLayoutUnits } from "@/features/piano";
import { useLaneTimeline, usePlay } from "@/features/play-session";
import { useScore, useScoreEngine } from "@/features/score";
import { LANE_SCROLL_DURATION_MS } from "@/features/visualizer";
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
  const { gameSession, setGameSession } = usePlay();

  const trackDataPromise = useMemo(() => {
    if (!selectedTrack) return null;
    return getTrackData(selectedTrack.url);
  }, [selectedTrack]);
  const { speed, demoMode } = useOptions();
  const { setSessionResults } = useScore();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Navigation Guard: Redirect if essentials are missing
  useEffect(() => {
    if (!selectedMIDIInput) {
      toHome();
    } else if (!selectedTrack) {
      toCollection();
    }
  }, [selectedMIDIInput, selectedTrack, toHome, toCollection]);

  // Resolve data via Suspense (use hook)
  const trackData = trackDataPromise ? use(trackDataPromise) : null;

  // Extract data with stable references for hook dependencies
  const notes = useMemo(() => trackData?.notes ?? [], [trackData]);
  const groups = useMemo(() => trackData?.groups ?? [], [trackData]);
  const totalDurationMs = trackData?.totalDurationMs ?? 0;

  // Calculate dynamic piano range for consistent grid alignment
  const { startUnit, endUnit } = useMemo(() => getPianoLayoutUnits(notes), [notes]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const handleFinishRef = useRef<() => void>(() => {});

  const isPlaying = totalDurationMs > 0;

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
    notes,
    getCurrentTimeMs,
    initialScore: gameSession?.score ?? 0,
    initialCombo: gameSession?.combo ?? 0,
    initialTimeMs: (gameSession?.currentProgress ?? 0) * totalDurationMs,
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
