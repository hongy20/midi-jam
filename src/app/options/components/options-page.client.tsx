"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { type Difficulty, useOptions } from "@/context/options-context";
import { useTheme } from "@/context/theme-context";
import { useNavigation } from "@/hooks/use-navigation";
import { OptionsPageView } from "./options-page.view";

/**
 * OptionsPageClient - Hook Integration Layer
 * Maps context state and navigation to the pure view component.
 */
export function OptionsPageClient() {
  const { theme, setTheme, mode, setMode } = useTheme();
  const { speed, setSpeed, demoMode, setDemoMode } = useOptions();
  const { goBack } = useNavigation();
  const searchParams = useSearchParams();

  // Navigation handlers
  const from = searchParams.get("from") ?? "/";
  const onBack = useCallback(() => goBack(from), [goBack, from]);

  // Difficulty Mapping
  const difficulty = useMemo((): Difficulty => {
    if (speed <= 0.5) return "easy";
    if (speed >= 2.0) return "hard";
    return "normal";
  }, [speed]);

  const onDifficultyChange = useCallback(
    (val: Difficulty) => {
      const speedMap: Record<Difficulty, number> = {
        easy: 0.5,
        normal: 1.0,
        hard: 2.0,
      };
      setSpeed(speedMap[val]);
    },
    [setSpeed],
  );

  return (
    <OptionsPageView
      theme={theme}
      setTheme={setTheme}
      isDarkMode={mode === "dark"}
      setDarkMode={(enabled) => setMode(enabled ? "dark" : "light")}
      difficulty={difficulty}
      onDifficultyChange={onDifficultyChange}
      demoMode={demoMode}
      setDemoMode={setDemoMode}
      onBack={onBack}
    />
  );
}
