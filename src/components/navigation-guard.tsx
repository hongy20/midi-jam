"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";
import { ROUTES } from "@/lib/navigation/routes";

export function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { toTracks, toHome, toInstruments } = useNavigation();
  const pathname = usePathname();
  const { tracks, instruments, results } = useAppContext();

  useEffect(() => {
    const isGame = pathname === ROUTES.GAME;
    const isPause = pathname === ROUTES.PAUSE;
    const isResults = pathname === ROUTES.RESULTS;

    // 1. No track selected? Can't go to game or pause.
    if ((isGame || isPause) && !tracks.selected) {
      toTracks();
      return;
    }

    // 2. MIDI disconnected? Redirect from game/pause to instruments for reconnection.
    if ((isGame || isPause) && !instruments.input) {
      toInstruments("game");
      return;
    }

    // 3. No results? Go home.
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
    toInstruments,
  ]);

  return <>{children}</>;
}
