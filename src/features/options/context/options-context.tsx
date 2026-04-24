"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

interface OptionsContextType {
  speed: number;
  demoMode: boolean;
  setSpeed: (speed: number) => void;
  setDemoMode: (enabled: boolean) => void;
  resetOptions: () => void;
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

export function OptionsProvider({ children }: { children: ReactNode }) {
  const [speed, setSpeed] = useState<number>(1.0);
  const [demoMode, setDemoMode] = useState<boolean>(true);

  const resetOptions = useCallback(() => {
    setSpeed(1.0);
    setDemoMode(true);
  }, []);

  const value: OptionsContextType = useMemo(
    () => ({
      speed,
      demoMode,
      setSpeed,
      setDemoMode,
      resetOptions,
    }),
    [speed, demoMode, resetOptions],
  );

  return <OptionsContext.Provider value={value}>{children}</OptionsContext.Provider>;
}

export function useOptions() {
  const context = useContext(OptionsContext);
  if (context === undefined) {
    throw new Error("useOptions must be used within an OptionsProvider");
  }
  return context;
}
