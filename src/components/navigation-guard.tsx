"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useGameNavigation } from "@/hooks/use-game-navigation";
import { useSelection } from "@/context/selection-context";

export function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { navigate } = useGameNavigation();
  const pathname = usePathname();
  const { selectedInstrument, selectedTrack } = useSelection();

  // 1. Route Guarding
  useEffect(() => {
    // Redirect logic for missing selections
    const isTracksPage = pathname === "/tracks";
    const isGamePage = pathname === "/game";
    const isResultsPage = pathname === "/results";

    if (isTracksPage && !selectedInstrument) {
      navigate("/");
    } else if ((isGamePage || isResultsPage) && (!selectedInstrument || !selectedTrack)) {
      navigate("/");
    }
  }, [pathname, selectedInstrument, selectedTrack, navigate]);

  return <>{children}</>;
}
