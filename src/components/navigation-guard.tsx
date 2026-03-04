"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "@/context/selection-context";
import { useNavigation } from "@/hooks/use-navigation";
import { ROUTES } from "@/lib/navigation/routes";

export function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { toTracks, toHome, toPause, toReconnect } = useNavigation();
  const pathname = usePathname();
  const { tracks, instruments, results } = useAppContext();

  useEffect(() => {
    const isGame = pathname === ROUTES.GAME;
    const isPause = pathname === ROUTES.PAUSE;
    const isReconnect = pathname === ROUTES.RECONNECT;
    const isInstruments = pathname === ROUTES.INSTRUMENTS;
    const isResults = pathname === ROUTES.RESULTS;

    // 1. No track selected? Can't go to game, pause, or instruments.
    if ((isGame || isPause || isInstruments) && !tracks.selected) {
      toTracks();
      return;
    }

    // 2. MIDI disconnected? Redirect from game/pause to reconnect.
    if ((isGame || isPause) && !instruments.input) {
      toReconnect();
      return;
    }

    // 3. MIDI reconnected? Return to pause.
    if (isReconnect && instruments.input) {
      toPause();
      return;
    }

    // 4. No results? Go home.
    if (isResults && !results.last) {
      toHome();
      return;
    }
  }, [
    pathname,
    tracks.selected,
    instruments.input,
    results.last,
    toTracks,
    toHome,
    toPause,
    toReconnect,
  ]);

  return <>{children}</>;
}
