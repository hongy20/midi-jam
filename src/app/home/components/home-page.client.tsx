"use client";

import { useEffect } from "react";

import { useNavigation } from "@/shared/hooks/use-navigation";

import { useAppReset } from "../hooks/use-app-reset";
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
