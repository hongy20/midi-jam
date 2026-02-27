"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSelection } from "@/context/selection-context";
import { useGameNavigation } from "@/hooks/use-game-navigation";

export function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { navigate } = useGameNavigation();
  const pathname = usePathname();
  const { selectedMIDIInput, selectedTrack } = useSelection();

  // 1. Route Guarding
  useEffect(() => {
    // Redirect logic for missing selections
    const isTracksPage = pathname === "/tracks";
    const isGamePage = pathname === "/game";
    const isResultsPage = pathname === "/results";

    if (isTracksPage && !selectedMIDIInput) {
      navigate("/");
    } else if (
      (isGamePage || isResultsPage) &&
      (!selectedMIDIInput || !selectedTrack)
    ) {
      navigate("/");
    }
  }, [pathname, selectedMIDIInput, selectedTrack, navigate]);

  return <>{children}</>;
}
