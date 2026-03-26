"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface GameSession {
  score: number;
  combo: number;
  currentProgress: number;
}

export interface StageContextType {
  gameSession: GameSession | null;
  setGameSession: (session: GameSession | null) => void;
  resetStage: () => void;
}

const StageContext = createContext<StageContextType | undefined>(undefined);

export function StageProvider({ children }: { children: ReactNode }) {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);

  const resetStage = useCallback(() => {
    setGameSession(null);
  }, []);

  const value: StageContextType = useMemo(
    () => ({
      gameSession,
      setGameSession,
      resetStage,
    }),
    [gameSession, resetStage],
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
