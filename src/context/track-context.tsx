"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { MidiEvent, NoteSpan } from "@/lib/midi/midi-parser";

export type TrackStatus =
  | { isLoading: true; isReady: false; error: null }
  | { isLoading: false; isReady: false; error: string | null }
  | {
      isLoading: false;
      isReady: true;
      totalDurationMs: number;
      events: MidiEvent[];
      spans: NoteSpan[];
      error: null;
    };

export interface TrackContextType {
  trackStatus: TrackStatus;
  setTrackStatus: (status: TrackStatus) => void;
  resetTrack: () => void;
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export function TrackProvider({ children }: { children: ReactNode }) {
  const [trackStatus, setTrackStatus] = useState<TrackStatus>({
    isLoading: false,
    isReady: false,
    error: null,
  });

  const resetTrack = useCallback(() => {
    setTrackStatus({ isLoading: false, isReady: false, error: null });
  }, []);

  const value: TrackContextType = useMemo(
    () => ({
      trackStatus,
      setTrackStatus,
      resetTrack,
    }),
    [trackStatus, resetTrack],
  );

  return (
    <TrackContext.Provider value={value}>{children}</TrackContext.Provider>
  );
}

export function useTrack() {
  const context = useContext(TrackContext);
  if (context === undefined) {
    throw new Error("useTrack must be used within a TrackProvider");
  }
  return context;
}
