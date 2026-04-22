"use client";

import { useEffect } from "react";
import { useAppReset } from "../hooks/use-app-reset";
import { useNavigation } from "@/features/navigation";
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
    <HomePageView onStart={() => toGear()} onOptions={() => toOptions()} songsCount={songsCount} />
  );
}
