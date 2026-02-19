"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Custom hook to enforce "History Neutrality" in the game flow.
 * Uses router.replace to avoid building a back-button history stack.
 */
export function useGameNavigation() {
  const router = useRouter();

  const navigate = useCallback(
    (path: string) => {
      // We use replace to ensure the history stack remains at 1
      // This supports our "History Hijacking" strategy.
      router.replace(path);
    },
    [router],
  );

  const goBack = useCallback(
    (fallbackPath = "/") => {
      // In a flat history model, "back" is just navigate to the logical previous step
      navigate(fallbackPath);
    },
    [navigate],
  );

  return {
    navigate,
    goBack,
  };
}
