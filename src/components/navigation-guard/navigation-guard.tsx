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
    switch (pathname as string) {
      case ROUTES.PLAY:
      case ROUTES.PAUSE:
        if (!selectedMIDIInput) {
          setGameSession(null);
          toGear("game");
          return;
        }
        if (!selectedTrack) {
          setGameSession(null);
          toCollection();
          return;
        }
        break;

      case ROUTES.COLLECTION:
        if (!selectedMIDIInput) {
          toGear();
          return;
        }
        break;

      case ROUTES.SCORE:
        if (!sessionResults) {
          toHome();
          return;
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
