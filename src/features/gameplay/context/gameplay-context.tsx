"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

interface SessionData {
  score: number;
  combo: number;
  currentProgress: number;
}

interface ResultsData {
  score: number;
  combo: number;
}

type GameplayState =
  | { status: "idle" }
  | ({ status: "playing" } & SessionData)
  | ({ status: "paused" } & SessionData)
  | { status: "finished"; results: ResultsData };

interface GameplayContextType {
  gameState: GameplayState;
  startGame: () => void;
  pauseGame: (data: SessionData) => void;
  finishGame: (results: ResultsData) => void;
  resetGame: () => void;
}

const GameplayContext = createContext<GameplayContextType | undefined>(undefined);

export function GameplayProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameplayState>({ status: "idle" });

  const startGame = useCallback(() => {
    setGameState({
      status: "playing",
      score: 0,
      combo: 0,
      currentProgress: 0,
    });
  }, []);

  const pauseGame = useCallback((data: SessionData) => {
    setGameState({
      status: "paused",
      ...data,
    });
  }, []);

  const finishGame = useCallback((results: ResultsData) => {
    setGameState({
      status: "finished",
      results,
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({ status: "idle" });
  }, []);

  const value: GameplayContextType = useMemo(
    () => ({
      gameState,
      startGame,
      pauseGame,
      finishGame,
      resetGame,
    }),
    [gameState, startGame, pauseGame, finishGame, resetGame],
  );

  return <GameplayContext.Provider value={value}>{children}</GameplayContext.Provider>;
}

export function useGameplay() {
  const context = useContext(GameplayContext);
  if (context === undefined) {
    throw new Error("useGameplay must be used within a GameplayProvider");
  }
  return context;
}
