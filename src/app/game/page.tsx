"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { InstrumentVisualizer } from "@/components/instrument-visualizer";
import { LaneStage } from "@/components/lane-stage";
import { PauseOverlay } from "@/components/pause-overlay";
import { ScoreHudLite } from "@/components/score-hud-lite";
import { useSelection } from "@/context/selection-context";
import { useActiveNotes } from "@/hooks/use-active-notes";
import { useGameNavigation } from "@/hooks/use-game-navigation";
import { useLaneScoreEngine } from "@/hooks/use-lane-score-engine";
import { useLaneTimeline } from "@/hooks/use-lane-timeline";
import { useMidiAudio } from "@/hooks/use-midi-audio";
import { useMidiTrack } from "@/hooks/use-midi-track";

export default function GamePage() {
  const { navigate } = useGameNavigation();
  const {
    selectedInstrument,
    selectedTrack,
    gameSession,
    setGameSession,
    setSessionResults,
    speed,
    demoMode,
    selectedMIDIInput,
    selectedMIDIOutput,
  } = useSelection();

  const trackUrl = selectedTrack?.url || null;
  const {
    events,
    spans,
    duration,
    isLoading: isTrackLoading,
  } = useMidiTrack(trackUrl);

  const { playNote, stopNote } = useMidiAudio(demoMode, selectedMIDIOutput);
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

  // Keyboard support (Esc to pause) and Browser-back trapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleTogglePause();
      }
    };

    const handleBrowserBack = () => {
      if (!isPaused) handleTogglePause();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("app:browser-back", handleBrowserBack);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("app:browser-back", handleBrowserBack);
    };
  }, [isPaused, handleTogglePause]);

  // Redirect to welcome if no track is selected
  useEffect(() => {
    if (!selectedTrack) {
      navigate("/");
    }
  }, [selectedTrack, navigate]);

  if (!selectedTrack) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background text-foreground overflow-hidden transition-colors duration-500 grid grid-rows-[auto_1fr_auto]">
      {/* Row 1: Status Bar (Fixed height) */}
      <header className="h-20 w-full p-4 sm:p-8 flex justify-between items-center z-20 layout-padding bg-background/50 backdrop-blur-md border-b border-foreground/5">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex flex-col">
            <span className="text-foreground/50 font-bold uppercase tracking-[0.2em] text-[10px] mb-0.5">
              {selectedInstrument?.name || "Instrument"} • {selectedTrack.name}
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
          {!selectedMIDIInput && !demoMode && (
            <div className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest animate-pulse hidden lg:block">
              No Input Device - Connect MIDI or Play Demo
            </div>
          )}

          <button
            type="button"
            onClick={handleTogglePause}
            className="w-12 h-12 bg-foreground/10 hover:bg-foreground/20 rounded-full flex items-center justify-center transition-colors group backdrop-blur-md border border-foreground/10 shadow-lg"
          >
            <div
              className={`flex gap-1 transition-transform duration-300 ${
                isPaused ? "scale-90" : "group-hover:scale-110"
              }`}
            >
              <div className="w-1.5 h-5 bg-foreground rounded-full" />
              <div className="w-1.5 h-5 bg-foreground rounded-full" />
            </div>
          </button>
        </div>
      </header>

      {/* Row 2: Gameplay Lane (Flexible) */}
      <main className="relative w-full h-full overflow-hidden">
        {isTrackLoading ? (
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
            demoMode={demoMode}
            onNoteOn={playNote}
            onNoteOff={stopNote}
          />
        )}
      </main>

      {/* Row 3: Instrument (Fixed height based on content) */}
      <footer className="w-full bg-background/50 backdrop-blur-md border-t border-foreground/5">
        <InstrumentVisualizer
          instrumentId={selectedInstrument?.id || "piano"}
          liveNotes={liveActiveNotes}
          demoNotes={new Set()}
        />
      </footer>

      <PauseOverlay
        isVisible={showOverlay}
        onResume={handleTogglePause}
        onRestart={handleRestart}
        onSettings={() => navigate("/settings?from=/game")}
        onQuit={handleQuit}
      />
    </div>
  );
}
