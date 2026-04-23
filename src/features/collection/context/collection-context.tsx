"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

import type { Track } from "@/shared/types/track";

interface CollectionContextType {
  selectedTrack: Track | null;
  setSelectedTrack: (track: Track | null) => void;
  resetCollection: () => void;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const resetCollection = useCallback(() => {
    setSelectedTrack(null);
  }, []);

  const value: CollectionContextType = useMemo(
    () => ({
      selectedTrack,
      setSelectedTrack,
      resetCollection,
    }),
    [selectedTrack, resetCollection],
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
