"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface GameSession {
  isPaused: boolean;
  score: number;
  combo: number;
  currentTimeMs: number;
}

export interface StageContextType {
  gameSession: GameSession | null;
  setGameSession: (session: GameSession | null) => void;
  resetStage: () => void;
}

const StageContext = createContext<StageContextType | undefined>(undefined);

export function StageProvider({ children }: { children: ReactNode }) {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);

  const resetStage = () => {
    setGameSession(null);
  };

  const value: StageContextType = useMemo(
    () => ({
      gameSession,
      setGameSession,
      resetStage,
    }),
    [gameSession],
  );

  return (
    <StageContext.Provider value={value}>{children}</StageContext.Provider>
  );
}

export function useStage() {
  const context = useContext(StageContext);
  if (context === undefined) {
    throw new Error("useStage must be used within a StageProvider");
  }
  return context;
}
