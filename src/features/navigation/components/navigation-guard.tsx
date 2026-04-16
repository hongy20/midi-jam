"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useStage } from "@/app/play/context/stage-context";
import { useCollection } from "@/features/collection";
import { useGear } from "@/features/midi-hardware";
import { useNavigation } from "@/features/navigation/hooks/use-navigation";
import { ROUTES } from "@/features/navigation/lib/routes";
import { useScore } from "@/features/score";
import { useTrackSync } from "@/features/collection";

export function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { toCollection, toHome, toGear } = useNavigation();
  const pathname = usePathname();
  const { selectedTrack } = useCollection();
  const { selectedMIDIInput } = useGear();
  const { sessionResults } = useScore();
  const { setGameSession } = useStage();

  // Coordinate track assets with collection state
  useTrackSync();

  useEffect(() => {
    switch (pathname) {
      case ROUTES.PLAY:
      case ROUTES.PAUSE:
        if (!selectedMIDIInput) {
          toHome();
        } else if (!selectedTrack) {
          setGameSession(null);
          toCollection();
        }
        break;

      case ROUTES.COLLECTION:
        if (!selectedMIDIInput) {
          toGear();
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
