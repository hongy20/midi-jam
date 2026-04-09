"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface HomeContextType {
  isLoading: boolean;
  isSupported: boolean;
  resetHome: () => void;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const INITIAL_LOADING_TIMEOUT = 1000;

export function HomeProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  // Detect Web MIDI support and finish initial loading on mount
  useEffect(() => {
    setIsSupported(
      typeof navigator !== "undefined" && "requestMIDIAccess" in navigator,
    );

    // Provide a small window to show the loader for smoother experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, INITIAL_LOADING_TIMEOUT);

    return () => clearTimeout(timer);
  }, []);

  const resetHome = useCallback(() => {
    // Basic home state doesn't need much resetting currently,
    // but we keep it for symmetry and future usage.
  }, []);

  const value: HomeContextType = {
    isLoading,
    isSupported,
    resetHome,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export function useHome() {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
}
