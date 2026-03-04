"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMIDIDevices } from "@/hooks/use-midi-devices";
import { useMIDISelection } from "@/hooks/use-midi-selection";
import { loadMidiFile } from "@/lib/midi/midi-loader";
import {
  getMidiEvents,
  getNoteSpans,
  type MidiEvent,
  type NoteSpan,
} from "@/lib/midi/midi-parser";
import { ROUTES } from "@/lib/navigation/routes";

export interface Track {
  id: string;
  name: string;
  url: string;
}

export interface GameSession {
  isPaused: boolean;
  score: number;
  combo: number;
  currentTimeMs: number;
}

export interface SessionResults {
  score: number;
  accuracy: number;
  combo: number;
}

export type TrackLoadStatus =
  | { isLoading: true; isReady: false; error: null }
  | { isLoading: false; isReady: false; error: string | null }
  | {
      isLoading: false;
      isReady: true;
      originalDurationMs: number;
      events: MidiEvent[];
      spans: NoteSpan[];
      error: null;
    };

export interface AppContextType {
  tracks: {
    selected: Track | null;
    set: (track: Track | null) => void;
  };
  instruments: {
    input: WebMidi.MIDIInput | null;
    output: WebMidi.MIDIOutput | null;
    lastInputName: string | null;
    selectInput: (input: WebMidi.MIDIInput | null) => void;
    selectOutput: (output: WebMidi.MIDIOutput | null) => void;
  };
  game: {
    track: TrackLoadStatus;
    session: GameSession | null;
    setSession: (s: GameSession | null) => void;
  };
  results: {
    last: SessionResults | null;
    set: (r: SessionResults | null) => void;
  };
  settings: {
    speed: number;
    demoMode: boolean;
    setSpeed: (speed: number) => void;
    setDemoMode: (enabled: boolean) => void;
  };
  actions: {
    resetAll: () => void;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [sessionResults, setSessionResults] = useState<SessionResults | null>(
    null,
  );
  const [speed, setSpeed] = useState<number>(1.0);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [lastInputName, setLastInputName] = useState<string | null>(null);
  const [trackStatus, setTrackStatus] = useState<TrackLoadStatus>({
    isLoading: false,
    isReady: false,
    error: null,
  });

  // MIDI Devices
  const { inputs, outputs } = useMIDIDevices();
  const { selectedMIDIInput, selectedMIDIOutput, selectMIDIInput } =
    useMIDISelection(inputs, outputs);

  // Update lastInputName whenever a device is selected
  const handleSelectInput = (input: WebMidi.MIDIInput | null) => {
    if (input) setLastInputName(input.name ?? "Unknown Device");
    selectMIDIInput(input);
  };

  const resetAll = () => {
    setSelectedTrack(null);
    setGameSession(null);
    setSessionResults(null);
    setSpeed(1.0);
    setDemoMode(true);
    selectMIDIInput(null);
    setTrackStatus({ isLoading: false, isReady: false, error: null });
  };

  // MIDI Track Loading (only when on /game path and a track is selected)
  useEffect(() => {
    const isGamePath = pathname === ROUTES.GAME || pathname === ROUTES.PAUSE;
    if (!isGamePath || !selectedTrack) {
      if (!selectedTrack) {
        setTrackStatus({ isLoading: false, isReady: false, error: null });
      }
      return;
    }

    // Skip loading if already ready for this track
    if (trackStatus.isReady) return;

    let mounted = true;
    setTrackStatus({ isLoading: true, isReady: false, error: null });

    loadMidiFile(selectedTrack.url)
      .then((midi) => {
        if (!mounted) return;
        const events = getMidiEvents(midi);
        const spans = getNoteSpans(events);

        setTrackStatus({
          isLoading: false,
          isReady: true,
          originalDurationMs: midi.duration * 1000,
          events,
          spans,
          error: null,
        });
      })
      .catch((err) => {
        if (!mounted) return;
        setTrackStatus({
          isLoading: false,
          isReady: false,
          error: err instanceof Error ? err.message : String(err),
        });
      });

    return () => {
      mounted = false;
    };
  }, [pathname, selectedTrack, trackStatus.isReady]);

  const value: AppContextType = {
    tracks: {
      selected: selectedTrack,
      set: setSelectedTrack,
    },
    instruments: {
      input: selectedMIDIInput,
      output: selectedMIDIOutput,
      lastInputName,
      selectInput: handleSelectInput,
      selectOutput: () => {}, // TODO: Implement if needed
    },
    game: {
      track: trackStatus,
      session: gameSession,
      setSession: setGameSession,
    },
    results: {
      last: sessionResults,
      set: setSessionResults,
    },
    settings: {
      speed,
      demoMode,
      setSpeed,
      setDemoMode,
    },
    actions: {
      resetAll,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

// Keep aliases for now to avoid breaking changes in other files
export const useSelection = useAppContext;
export const SelectionProvider = AppProvider;
