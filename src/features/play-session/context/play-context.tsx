"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

interface GameSession {
  score: number;
  combo: number;
  currentProgress: number;
}

interface PlayContextType {
  // Session State
  gameSession: GameSession | null;
  setGameSession: (session: GameSession | null) => void;

  // Actions
  resetPlay: () => void;
}

const PlayContext = createContext<PlayContextType | undefined>(undefined);

export function PlayProvider({ children }: { children: ReactNode }) {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);

  const resetPlay = useCallback(() => {
    setGameSession(null);
  }, []);

  const value: PlayContextType = useMemo(
    () => ({
      gameSession,
      setGameSession,
      resetPlay,
    }),
    [gameSession, resetPlay],
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
