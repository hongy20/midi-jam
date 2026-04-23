"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

import type { MidiNote, MidiNoteGroup } from "@/shared/types/midi";
import type { Track } from "@/shared/types/track";

import { getTrackData } from "../../midi-assets/lib/midi-loader";

interface CollectionContextType {
  selectedTrack: Track | null;
  setSelectedTrack: (track: Track | null) => void;
  resetCollection: () => void;
  trackDataPromise: Promise<{
    notes: MidiNote[];
    groups: MidiNoteGroup[];
    totalDurationMs: number;
  }> | null;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const resetCollection = useCallback(() => {
    setSelectedTrack(null);
  }, []);

  const trackDataPromise = useMemo(() => {
    if (!selectedTrack) return null;
    return getTrackData(selectedTrack.url);
  }, [selectedTrack]);

  const value: CollectionContextType = useMemo(
    () => ({
      selectedTrack,
      setSelectedTrack,
      resetCollection,
      trackDataPromise,
    }),
    [selectedTrack, resetCollection, trackDataPromise],
  );

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
}
