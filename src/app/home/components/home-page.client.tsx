"use client";

import { useEffect } from "react";
import { useAppReset } from "@/features/collection/hooks/use-track-sync";
import { useNavigation } from "@/features/navigation/hooks/use-navigation";
import { HomePageView } from "./home-page.view";

interface HomePageClientProps {
  songsCount: number;
}

export function HomePageClient({ songsCount }: HomePageClientProps) {
  const { toGear, toOptions } = useNavigation();
  const { resetAll } = useAppReset();

  useEffect(() => {
    resetAll();
  }, [resetAll]);

  return (
    <HomePageView
      onStart={() => toGear()}
      onOptions={() => toOptions()}
      songsCount={songsCount}
    />
  );
}
