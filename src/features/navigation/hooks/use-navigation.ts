"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ROUTES } from "@/features/navigation/lib/routes";

/**
 * Custom hook to enforce "History Neutrality" in the game flow.
 * Uses router.replace to avoid building a back-button history stack.
 */
export function useNavigation() {
  const router = useRouter();

  const navigate = useCallback(
    (path: string) => {
      // We use replace to ensure the history stack remains at 1
      // This supports our "History Hijacking" strategy.
      router.replace(path);
    },
    [router],
  );

  return {
    toHome: useCallback(() => navigate(ROUTES.HOME), [navigate]),
    toCollection: useCallback(() => navigate(ROUTES.COLLECTION), [navigate]),
    toGear: useCallback(
      (from?: string) =>
        navigate(from ? `${ROUTES.GEAR}?from=${from}` : ROUTES.GEAR),
      [navigate],
    ),
    toPlay: useCallback(() => navigate(ROUTES.PLAY), [navigate]),
    toPause: useCallback(() => navigate(ROUTES.PAUSE), [navigate]),
    toScore: useCallback(() => navigate(ROUTES.SCORE), [navigate]),
    toOptions: useCallback(
      (from?: string) =>
        navigate(from ? `${ROUTES.OPTIONS}?from=${from}` : ROUTES.OPTIONS),
      [navigate],
    ),
    goBack: useCallback(
      (fallback: string = ROUTES.HOME) => navigate(fallback),
      [navigate],
    ),
    navigate, // Keep generic navigate for special cases
  };
}

