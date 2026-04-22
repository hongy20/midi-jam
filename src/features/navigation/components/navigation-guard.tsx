"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCollection } from "@/features/collection";
import { useGear } from "@/features/midi-hardware";
import { useScore } from "@/features/score";
import { useNavigation } from "../hooks/use-navigation";
import { ROUTES } from "@/shared/lib/routes";

export function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { toCollection, toHome, toGear } = useNavigation();
  const pathname = usePathname();
  const { selectedTrack } = useCollection();
  const { selectedMIDIInput } = useGear();
  const { sessionResults } = useScore();

  useEffect(() => {
    switch (pathname) {
      case ROUTES.PLAY:
      case ROUTES.PAUSE:
        if (!selectedMIDIInput) {
          toHome();
        } else if (!selectedTrack) {
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
  }, [pathname, selectedTrack, selectedMIDIInput, sessionResults, toCollection, toHome, toGear]);

  return <>{children}</>;
}
