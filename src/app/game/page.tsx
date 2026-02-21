"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { InstrumentVisualizer } from "@/components/instrument-visualizer";
import { LaneStage } from "@/components/lane-stage";
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

  if (!selectedTrack) {
    return (
      <div className="fixed inset-0 bg-background text-foreground flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
          No Track Selected
        </h1>
        <p className="text-foreground/60 mb-8 max-w-md">
          Please go back and select a track to start jamming.
        </p>
        <button
          type="button"
          onClick={() => navigate("/tracks")}
          className="px-8 py-4 bg-foreground text-background font-bold rounded-full hover:scale-105 transition-transform"
        >
          SELECT TRACK
        </button>
      </div>
    );
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

      {/* Pause Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-2xl flex items-center justify-center animate-in fade-in duration-300 p-4">
          <div className="text-center flex flex-col gap-4 sm:gap-6 w-full max-w-[320px] sm:max-w-sm animate-in zoom-in-95 duration-300">
            <h1 className="text-5xl sm:text-6xl font-black text-foreground italic uppercase tracking-tighter mb-2 sm:mb-4 bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
              Paused
            </h1>

            <button
              type="button"
              onClick={handleTogglePause}
              className="w-full py-3.5 sm:py-4 bg-foreground text-background rounded-full font-black text-lg sm:text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              RESUME
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="w-full py-3.5 sm:py-4 bg-foreground/10 text-foreground border border-foreground/20 rounded-full font-bold text-lg sm:text-xl hover:bg-foreground/20 flex items-center justify-center transition-colors"
            >
              RESTART
            </button>
            <button
              type="button"
              onClick={() => navigate("/settings?from=/game")}
              className="w-full py-3.5 sm:py-4 bg-foreground/10 text-foreground border border-foreground/20 rounded-full font-bold text-lg sm:text-xl hover:bg-foreground/20 transition-colors"
            >
              SETTINGS ⚙️
            </button>
            <button
              type="button"
              onClick={handleQuit}
              className="w-full py-3.5 sm:py-4 text-red-500 rounded-full font-bold text-lg sm:text-xl hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all mt-4"
            >
              QUIT GAME
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
