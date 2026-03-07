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
    // Level 2 Requirements (Play/Pause): MIDI + Track
    if (([ROUTES.PLAY, ROUTES.PAUSE] as string[]).includes(pathname)) {
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
    }

    // Level 1 Requirements (Collection): MIDI
    if (([ROUTES.COLLECTION] as string[]).includes(pathname)) {
      if (!selectedMIDIInput) {
        toGear();
        return;
      }
    }

    // Level 0 (Score/Home/Gear/Options): No strict requirements
    // Special case: Redirect Score to Home if results are missing
    if (([ROUTES.SCORE] as string[]).includes(pathname)) {
      if (!sessionResults) {
        toHome();
        return;
      }
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
