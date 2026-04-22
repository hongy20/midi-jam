"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import type { MidiNote, MidiNoteGroup } from "@/shared/types/midi";

interface GameSession {
  score: number;
  combo: number;
  currentProgress: number;
}

type PlayTrackStatus =
  | { isLoading: true; isReady: false; error: null }
  | { isLoading: false; isReady: false; error: string | null }
  | {
      isLoading: false;
      isReady: true;
      totalDurationMs: number;
      notes: MidiNote[];
      groups: MidiNoteGroup[];
      error: null;
    };

interface PlayContextType {
  // Track State
  playStatus: PlayTrackStatus;
  setPlayStatus: (status: PlayTrackStatus) => void;

  // Session State
  gameSession: GameSession | null;
  setGameSession: (session: GameSession | null) => void;

  // Actions
  resetPlay: () => void;
}

const PlayContext = createContext<PlayContextType | undefined>(undefined);

export function PlayProvider({ children }: { children: ReactNode }) {
  const [playStatus, setPlayStatus] = useState<PlayTrackStatus>({
    isLoading: false,
    isReady: false,
    error: null,
  });

  const [gameSession, setGameSession] = useState<GameSession | null>(null);

  const resetPlay = useCallback(() => {
    setPlayStatus({ isLoading: false, isReady: false, error: null });
    setGameSession(null);
  }, []);

  const value: PlayContextType = useMemo(
    () => ({
      playStatus,
      setPlayStatus,
      gameSession,
      setGameSession,
      resetPlay,
    }),
    [playStatus, gameSession, resetPlay],
  );

  return <PlayContext.Provider value={value}>{children}</PlayContext.Provider>;
}

export function usePlay() {
  const context = useContext(PlayContext);
  if (context === undefined) {
    throw new Error("usePlay must be used within a PlayProvider");
  }
  return context;
}
