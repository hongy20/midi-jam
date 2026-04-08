"use client";

import { Pause } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LaneStage } from "@/components/lane-stage/lane-stage";
import { PageLayout } from "@/components/page-layout/page-layout";
import { ScoreWidget } from "@/components/score-widget/score-widget";
import { Button } from "@/components/ui/8bit/button";
import { VirtualInstrument } from "@/components/virtual-instrument/virtual-instrument";
import { useCollection } from "@/context/collection-context";
import { useGear } from "@/context/gear-context";
import { useOptions } from "@/context/options-context";
import { useScore } from "@/context/score-context";
import { useStage } from "@/context/stage-context";
import { useTrack } from "@/context/track-context";
import { useActiveNotes } from "@/hooks/use-active-notes";
import { useAutoPause } from "@/hooks/use-auto-pause";
import { useDemoPlayback } from "@/hooks/use-demo-playback";
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
import styles from "./page.module.css";

export default function PlayPage() {
  const { toScore, toPause } = useNavigation();
  const { selectedTrack } = useCollection();
  const { selectedMIDIInput, selectedMIDIOutput } = useGear();
  const { trackStatus } = useTrack();
  const { gameSession, setGameSession } = useStage();
  const { speed, demoMode } = useOptions();
  const { setSessionResults } = useScore();

  // Track Data (only if ready)
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

  const liveActiveNotes = useActiveNotes(selectedMIDIInput);
  const [playbackNotes, setPlaybackNotes] = useState<Set<number>>(new Set());

  const scrollRef = useRef<HTMLDivElement>(null);
  const handleFinishRef = useRef<() => void>(() => {});

  const isPlaying = totalDurationMs > 0 && !isLoading;

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

  const { getScore, getCombo, getLastHitQuality } = useLaneScoreEngine({
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
    },
    [playNote],
  );

  const onNoteOff = useCallback(
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
        accuracy: Math.floor((finalScore / (events.length * 100)) * 100) || 0,
        combo: finalCombo,
      });
      setGameSession(null);
      toScore();
    };
  }, [
    events.length,
    setGameSession,
    setSessionResults,
    toScore,
    getScore,
    getCombo,
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

  // Note: Redirects are handled by NavigationGuard

  if (!selectedTrack || !selectedMIDIInput) {
    return null;
  }

  return (
    <PageLayout
      className={styles.page}
      style={
        {
          "--start-unit": startUnit,
          "--end-unit": endUnit,
          "--lane-scroll-duration-ms": LANE_SCROLL_DURATION_MS,
          "--speed": speed,
        } as React.CSSProperties
      }
      header={
        <header className="w-full p-4 sm:p-6 flex justify-between items-center bg-background/80 backdrop-blur-sm border-b-4 border-foreground dark:border-ring">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex flex-col">
              <span className="text-foreground/60 font-black uppercase tracking-[0.2em] text-[10px] mb-1 retro">
                {selectedMIDIInput.name} • {selectedTrack.name}
              </span>
              <ScoreWidget
                getScore={getScore}
                getCombo={getCombo}
                getLastHitQuality={getLastHitQuality}
                getProgress={getProgress}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={handlePause}
              size="icon"
              font="retro"
            >
              <Pause className="size-4" />
            </Button>
          </div>
        </header>
      }
      footer={
        <footer className="h-(--footer-height) w-full bg-background/50 border-t border-foreground/5">
          <VirtualInstrument
            inputDevice={selectedMIDIInput}
            liveNotes={liveActiveNotes}
            playbackNotes={playbackNotes}
          />
        </footer>
      }
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          <span className="font-bold uppercase tracking-widest text-xs">
            LOADING...
          </span>
        </div>
      ) : trackStatus.error ? (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <span className="text-red-500 font-bold uppercase tracking-widest text-xs">
            DATA CORRUPTED: {trackStatus.error}
          </span>
        </div>
      ) : (
        <LaneStage
          groups={groups}
          scrollRef={scrollRef}
          getCurrentTimeMs={getCurrentTimeMs}
        />
      )}
    </PageLayout>
  );
}
