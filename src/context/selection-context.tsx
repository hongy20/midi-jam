"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { useMIDIDevices } from "@/hooks/use-midi-devices";
import { useMIDISelection } from "@/hooks/use-midi-selection";

interface Instrument {
  id: string;
  name: string;
}

interface Track {
  id: string;
  name: string;
}

interface GameSession {
  timeLeft?: number;
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
  // MIDI Device Selection
  selectedMIDIInput: WebMidi.MIDIInput | null;
  selectedMIDIOutput: WebMidi.MIDIOutput | null;
  availableInputs: WebMidi.MIDIInput[];
  availableOutputs: WebMidi.MIDIOutput[];
  isLoadingDevices: boolean;
  midiError: string | null;
  setInstrument: (instrument: Instrument) => void;
  setTrack: (track: Track) => void;
  setGameSession: (session: GameSession | null) => void;
  setSessionResults: (results: SessionResults | null) => void;
  setSpeed: (speed: number) => void;
  setDemoMode: (enabled: boolean) => void;
  selectMIDIInput: (input: WebMidi.MIDIInput | null) => void;
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

  // MIDI Devices
  const { inputs, outputs, isLoading, error } = useMIDIDevices();
  const { selectedMIDIInput, selectedMIDIOutput, selectMIDIInput } =
    useMIDISelection(inputs, outputs);

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
    selectMIDIInput(null);
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
        selectedMIDIInput,
        selectedMIDIOutput,
        availableInputs: inputs,
        availableOutputs: outputs,
        isLoadingDevices: isLoading,
        midiError: error,
        setInstrument,
        setTrack,
        setGameSession,
        setSessionResults,
        setSpeed,
        setDemoMode,
        selectMIDIInput,
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
