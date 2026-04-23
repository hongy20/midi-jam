"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";

import { useCollection } from "@/features/collection";
import { getTrackData } from "@/features/midi-assets";
import type { MidiNote, MidiNoteGroup } from "@/shared/types/midi";

interface PlayOrchestratorContextType {
  trackDataPromise: Promise<{
    notes: MidiNote[];
    groups: MidiNoteGroup[];
    totalDurationMs: number;
  }> | null;
}

const PlayOrchestratorContext = createContext<PlayOrchestratorContextType | undefined>(undefined);

/**
 * PlayOrchestrator coordinates data fetching between independent features.
 * It resides in the app layer to comply with feature-based isolation rules.
 */
export function PlayOrchestrator({ children }: { children: ReactNode }) {
  const { selectedTrack } = useCollection();

  const trackDataPromise = useMemo(() => {
    if (!selectedTrack) return null;
    return getTrackData(selectedTrack.url);
  }, [selectedTrack]);

  const value = useMemo(() => ({ trackDataPromise }), [trackDataPromise]);

  return (
    <PlayOrchestratorContext.Provider value={value}>{children}</PlayOrchestratorContext.Provider>
  );
}

export function usePlayOrchestrator() {
  const context = useContext(PlayOrchestratorContext);
  if (context === undefined) {
    throw new Error("usePlayOrchestrator must be used within a PlayOrchestrator");
  }
  return context;
}
