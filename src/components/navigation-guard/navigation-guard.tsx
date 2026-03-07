"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";
import { ROUTES } from "@/lib/navigation/routes";

export function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { toCollection, toHome, toGear } = useNavigation();
  const pathname = usePathname();
  const {
    collection: { selectedTrack },
    gear: { selectedMIDIInput },
    score: { sessionResults },
    stage: { setGameSession },
  } = useAppContext();

  useEffect(() => {
    const isGame = pathname === ROUTES.PLAY || pathname === ROUTES.PAUSE;

    switch (pathname) {
      case ROUTES.PLAY:
      // biome-ignore lint/suspicious/noFallthroughSwitchClause: Hierarchical waterfall
      case ROUTES.PAUSE:
        if (!selectedTrack) {
          setGameSession(null);
          toCollection();
          return;
        }
      // Intentional fallthrough: Play/Pause also requires Level 1 (MIDI)
      case ROUTES.COLLECTION:
        if (!selectedMIDIInput) {
          if (isGame) {
            setGameSession(null);
          }
          toGear(isGame ? "game" : undefined);
          return;
        }
        break;

      case ROUTES.SCORE:
        if (!sessionResults) {
          toHome();
        }
        break;

      default:
        break;
    }
  }, [
    pathname,
    selectedTrack,
    selectedMIDIInput,
    sessionResults,
    setGameSession,
    toCollection,
    toHome,
    toGear,
  ]);

  return <>{children}</>;
}
