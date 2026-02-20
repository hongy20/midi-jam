"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface Instrument {
  id: string;
  name: string;
}

interface Track {
  id: string;
  name: string;
}

interface GameSession {
  timeLeft: number;
  isPaused: boolean;
}

interface SessionResults {
  score: number;
  accuracy: number;
  combo: number;
}

interface SelectionContextType {
  selectedInstrument: Instrument | null;
  selectedTrack: Track | null;
  gameSession: GameSession | null;
  sessionResults: SessionResults | null;
  speed: number;
  demoMode: boolean;
  setInstrument: (instrument: Instrument) => void;
  setTrack: (track: Track) => void;
  setGameSession: (session: GameSession | null) => void;
  setSessionResults: (results: SessionResults | null) => void;
  setSpeed: (speed: number) => void;
  setDemoMode: (enabled: boolean) => void;
  clearSelection: () => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined,
);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [sessionResults, setSessionResults] = useState<SessionResults | null>(
    null,
  );
  const [speed, setSpeed] = useState<number>(1.0);
  const [demoMode, setDemoMode] = useState<boolean>(false);

  const setInstrument = (instrument: Instrument) =>
    setSelectedInstrument(instrument);
  const setTrack = (track: Track) => setSelectedTrack(track);
  const clearSelection = () => {
    setSelectedInstrument(null);
    setSelectedTrack(null);
    setGameSession(null);
    setSessionResults(null);
    setSpeed(1.0);
    setDemoMode(false);
  };

  return (
    <SelectionContext.Provider
      value={{
        selectedInstrument,
        selectedTrack,
        gameSession,
        sessionResults,
        speed,
        demoMode,
        setInstrument,
        setTrack,
        setGameSession,
        setSessionResults,
        setSpeed,
        setDemoMode,
        clearSelection,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}
