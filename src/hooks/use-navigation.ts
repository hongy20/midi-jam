"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ROUTES } from "@/lib/navigation/routes";

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
    toTracks: useCallback(() => navigate(ROUTES.TRACKS), [navigate]),
    toInstruments: useCallback(() => navigate(ROUTES.INSTRUMENTS), [navigate]),
    toGame: useCallback(() => navigate(ROUTES.GAME), [navigate]),
    toPause: useCallback(() => navigate(ROUTES.PAUSE), [navigate]),
    toResults: useCallback(() => navigate(ROUTES.RESULTS), [navigate]),
    toReconnect: useCallback(() => navigate(ROUTES.RECONNECT), [navigate]),
    toSettings: useCallback(
      (from?: string) =>
        navigate(from ? `${ROUTES.SETTINGS}?from=${from}` : ROUTES.SETTINGS),
      [navigate],
    ),
    goBack: useCallback(
      (fallback: string = ROUTES.HOME) => navigate(fallback),
      [navigate],
    ),
    navigate, // Keep generic navigate for special cases
  };
}

// Keep the old name as alias for now
export const useGameNavigation = useNavigation;
