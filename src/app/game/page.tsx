"use client";

import { Pause } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LaneStage } from "@/components/lane-stage/lane-stage";
import { PauseOverlay } from "@/components/pause-overlay";
import { ScoreHudLite } from "@/components/score-hud-lite";
import { VirtualInstrument } from "@/components/virtual-instrument";
import { useSelection } from "@/context/selection-context";
import { useActiveNotes } from "@/hooks/use-active-notes";
import { useGameNavigation } from "@/hooks/use-game-navigation";
import { useLaneScoreEngine } from "@/hooks/use-lane-score-engine";
import { useLaneTimeline } from "@/hooks/use-lane-timeline";
import { useMidiTrack } from "@/hooks/use-midi-track";
import styles from "./page.module.css";

export default function GamePage() {
  const { navigate } = useGameNavigation();
  const {
    selectedTrack,
    gameSession,
    setGameSession,
    setSessionResults,
    speed,
    selectedMIDIInput,
  } = useSelection();

  const { events, spans, duration, isLoading } = useMidiTrack();

  const liveActiveNotes = useActiveNotes(selectedMIDIInput);

  const [isPaused, setIsPaused] = useState(gameSession?.isPaused ?? false);
  const [showOverlay, setShowOverlay] = useState(
    gameSession?.isPaused ?? false,
  );
  const [progress, setProgress] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { getCurrentTimeMs, getProgress, resetTimeline } = useLaneTimeline({
    containerRef: scrollRef,
    totalDurationMs: duration,
    speed,
    isPaused,
  });

  const { score, combo, lastHitQuality, resetScore } = useLaneScoreEngine({
    midiInput: selectedMIDIInput,
    modelEvents: events,
    getCurrentTimeMs,
    isPlaying: !isPaused && duration > 0,
  });

  // Sync state to context for persistence during navigation
  useEffect(() => {
    setGameSession({ isPaused });
  }, [isPaused, setGameSession]);

  // Update progress UI
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setProgress(getProgress());
    }, 100);
    return () => clearInterval(interval);
  }, [isPaused, getProgress]);

  // Auto-navigate on completion
  useEffect(() => {
    if (progress >= 0.999 || (duration > 0 && getCurrentTimeMs() >= duration)) {
      setSessionResults({
        score,
        accuracy: Math.floor((score / (events.length * 100)) * 100) || 0,
        combo,
      });

      setGameSession(null); // Clear session on finish
      navigate("/results");
    }
  }, [
    progress,
    duration,
    getCurrentTimeMs,
    navigate,
    setGameSession,
    setSessionResults,
    score,
    combo,
    events.length,
  ]);

  // Handle Pause
  const handleTogglePause = useCallback(() => {
    setIsPaused((prev) => {
      const nextPaused = !prev;
      setShowOverlay(nextPaused);
      return nextPaused;
    });
  }, []);

  // Handle Restart
  const handleRestart = () => {
    resetTimeline();
    resetScore();
    setIsPaused(false);
    setShowOverlay(false);
    setProgress(0);
  };

  const handleQuit = () => {
    setSessionResults({
      score,
      accuracy: Math.floor((score / (events.length * 100)) * 100) || 0,
      combo,
    });
    setGameSession(null);
    navigate("/results");
  };

  // Redirect to welcome if no track is selected
  useEffect(() => {
    if (!selectedTrack || !selectedMIDIInput) {
      navigate("/");
    }
  }, [selectedTrack, selectedMIDIInput, navigate]);

  if (!selectedTrack || !selectedMIDIInput) {
    return null;
  }

  return (
    <div className={styles.container}>
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
              progress={progress}
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
        ) : (
          <LaneStage
            spans={spans}
            totalDurationMs={duration}
            scrollRef={scrollRef}
          />
        )}
      </main>

      {/* Row 3: Instrument (Fixed height based on content) */}
      <footer className="h-[var(--footer-height)] w-full bg-background/50 backdrop-blur-md border-t border-foreground/5">
        <VirtualInstrument
          inputDevice={selectedMIDIInput}
          liveNotes={liveActiveNotes}
          playbackNotes={new Set()}
        />
      </footer>

      {showOverlay && (
        <PauseOverlay
          onResume={handleTogglePause}
          onRestart={handleRestart}
          onSettings={() => navigate("/settings?from=/game")}
          onQuit={handleQuit}
        />
      )}
    </div>
  );
}
