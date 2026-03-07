"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface Track {
  id: string;
  name: string;
  url: string;
}

export interface CollectionContextType {
  selectedTrack: Track | null;
  setSelectedTrack: (track: Track | null) => void;
  resetCollection: () => void;
}

const CollectionContext = createContext<CollectionContextType | undefined>(
  undefined,
);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const resetCollection = () => {
    setSelectedTrack(null);
  };

  const value: CollectionContextType = useMemo(
    () => ({
      selectedTrack,
      setSelectedTrack,
      resetCollection,
    }),
    [selectedTrack],
  );

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
}
