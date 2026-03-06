"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
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
  collection: {
    selectedTrack: Track | null;
    setSelectedTrack: (track: Track | null) => void;
  };
  gear: {
    selectedMIDIInput: WebMidi.MIDIInput | null;
    selectedMIDIOutput: WebMidi.MIDIOutput | null;
    lastInputName: string | null;
    selectMIDIInput: (input: WebMidi.MIDIInput | null) => void;
    selectMIDIOutput: (output: WebMidi.MIDIOutput | null) => void;
  };
  stage: {
    trackStatus: TrackLoadStatus;
    gameSession: GameSession | null;
    setGameSession: (s: GameSession | null) => void;
  };
  score: {
    sessionResults: SessionResults | null;
    setSessionResults: (r: SessionResults | null) => void;
  };
  options: {
    speed: number;
    demoMode: boolean;
    setSpeed: (speed: number) => void;
    setDemoMode: (enabled: boolean) => void;
  };
  home: {
    isHomeLoading: boolean;
    isSupported: boolean;
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
  const [isHomeLoading, setIsHomeLoading] = useState<boolean>(true);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const lastLoadedTrackId = useRef<string | null>(null);

  // Detect Web MIDI support and finish initial loading on mount
  useEffect(() => {
    setIsSupported("requestMIDIAccess" in navigator);

    // Provide a small window to show the loader for smoother experience
    const timer = setTimeout(() => {
      setIsHomeLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // MIDI Devices
  const { inputs, outputs } = useMIDIDevices();
  const { selectedMIDIInput, selectedMIDIOutput, selectMIDIInput } =
    useMIDISelection(inputs, outputs);

  // Update lastInputName whenever a device is selected
  const handleSelectInput = (input: WebMidi.MIDIInput | null) => {
    if (input) setLastInputName(input.name ?? "Unknown Device");
    selectMIDIInput(input);
  };

  const resetAll = useCallback(() => {
    setSelectedTrack(null);
    setGameSession(null);
    setSessionResults(null);
    setSpeed(1.0);
    setDemoMode(true);
    selectMIDIInput(null);
    setTrackStatus({ isLoading: false, isReady: false, error: null });
    lastLoadedTrackId.current = null;
  }, [selectMIDIInput]);

  // MIDI Track Loading (only when on /game path and a track is selected)
  useEffect(() => {
    const isGamePath = pathname === ROUTES.PLAY || pathname === ROUTES.PAUSE;
    if (!isGamePath || !selectedTrack) {
      if (!selectedTrack) {
        setTrackStatus({ isLoading: false, isReady: false, error: null });
        lastLoadedTrackId.current = null;
      }
      return;
    }

    // Skip loading if already ready for this SPECIFIC track
    if (trackStatus.isReady && lastLoadedTrackId.current === selectedTrack.id) {
      return;
    }

    let mounted = true;
    setTrackStatus({ isLoading: true, isReady: false, error: null });

    loadMidiFile(selectedTrack.url)
      .then((midi) => {
        if (!mounted) return;
        const events = getMidiEvents(midi);
        const spans = getNoteSpans(events);

        lastLoadedTrackId.current = selectedTrack.id;
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
    collection: {
      selectedTrack,
      setSelectedTrack,
    },
    gear: {
      selectedMIDIInput,
      selectedMIDIOutput,
      lastInputName,
      selectMIDIInput: handleSelectInput,
      selectMIDIOutput: () => {}, // TODO: Implement if needed
    },
    stage: {
      trackStatus,
      gameSession,
      setGameSession,
    },
    score: {
      sessionResults,
      setSessionResults,
    },
    options: {
      speed,
      demoMode,
      setSpeed,
      setDemoMode,
    },
    home: {
      isHomeLoading,
      isSupported,
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
