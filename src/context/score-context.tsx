"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface SessionResults {
  score: number;
  accuracy: number;
  combo: number;
}

export interface ScoreContextType {
  sessionResults: SessionResults | null;
  setSessionResults: (results: SessionResults | null) => void;
  resetScore: () => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [sessionResults, setSessionResults] = useState<SessionResults | null>(
    null,
  );

  const resetScore = useCallback(() => {
    setSessionResults(null);
  }, []);

  const value: ScoreContextType = useMemo(
    () => ({
      sessionResults,
      setSessionResults,
      resetScore,
    }),
    [sessionResults, resetScore],
  );

  return (
    <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>
  );
}

export function useScore() {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error("useScore must be used within a ScoreProvider");
  }
  return context;
}
