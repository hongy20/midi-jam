"use client";

import { useEffect } from "react";
import { useNavigation } from "@/hooks/use-navigation";
import { useAppReset } from "@/hooks/use-track-sync";
import { HomePageView } from "./home-page.view";

export function HomePageClient() {
  const { toGear, toOptions } = useNavigation();
  const { resetAll } = useAppReset();

  useEffect(() => {
    resetAll();
  }, [resetAll]);

  return (
    <HomePageView
      onStart={() => toGear()}
      onOptions={() => toOptions()}
    />
  );
}
