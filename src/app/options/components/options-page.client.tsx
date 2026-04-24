"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  type Difficulty,
  difficultyToSpeed,
  speedToDifficulty,
  useOptions,
} from "@/features/options";
import { useTheme } from "@/features/theme";
import { useNavigation } from "@/shared/hooks/use-navigation";

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

  // Mode Toggle Handler
  const onModeToggle = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  // Difficulty Mapping
  const difficulty = useMemo(() => speedToDifficulty(speed), [speed]);

  const onDifficultyChange = useCallback(
    (val: Difficulty) => {
      setSpeed(difficultyToSpeed(val));
    },
    [setSpeed],
  );

  return (
    <OptionsPageView
      activeTheme={theme}
      onThemeChange={setTheme}
      mode={mode}
      onModeToggle={onModeToggle}
      difficulty={difficulty}
      onDifficultyChange={onDifficultyChange}
      demoMode={demoMode}
      setDemoMode={setDemoMode}
      onBack={onBack}
    />
  );
}
