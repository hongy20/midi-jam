"use client";

import { useSelection } from "@/context/selection-context";
import { useGameNavigation } from "@/hooks/use-game-navigation";
import { PauseOverlay } from "@/components/pause-overlay";
import { useEffect } from "react";

export default function PausePage() {
  const { navigate } = useGameNavigation();
  const {
    gameSession,
    setGameSession,
    setSessionResults,
    selectedTrack,
    selectedMIDIInput,
  } = useSelection();

  // Redirect if no session exists
  useEffect(() => {
    if (!gameSession || !selectedTrack || !selectedMIDIInput) {
      navigate("/");
    }
  }, [gameSession, selectedTrack, selectedMIDIInput, navigate]);

  if (!gameSession) return null;

  const handleResume = () => {
    setGameSession({
      ...gameSession,
      isPaused: false,
    });
    navigate("/game");
  };

  const handleRestart = () => {
    setGameSession({
      ...gameSession,
      isPaused: false,
      score: 0,
      combo: 0,
      currentTimeMs: 0,
    });
    navigate("/game");
  };

  const handleQuit = () => {
    setSessionResults({
      score: gameSession.score,
      accuracy: 0, // Accuracy calculation might need more state if we want it here
      combo: gameSession.combo,
    });
    setGameSession(null);
    navigate("/results");
  };

  const handleSettings = () => {
    navigate("/settings?from=/game/pause");
  };

  return (
    <PauseOverlay
      onResume={handleResume}
      onRestart={handleRestart}
      onSettings={handleSettings}
      onQuit={handleQuit}
    />
  );
}
