"use client";

import { useEffect } from "react";
import { useHome } from "@/context/home-context";
import { useNavigation } from "@/hooks/use-navigation";
import { useAppReset } from "@/hooks/use-track-sync";
import { WelcomePageView } from "./welcome-page.view";

export default function WelcomePage() {
  const { toGear, toOptions } = useNavigation();
  const { isLoading, isSupported } = useHome();
  const { resetAll } = useAppReset();

  useEffect(() => {
    resetAll();
  }, [resetAll]);

  return (
    <WelcomePageView
      isLoading={isLoading}
      isSupported={isSupported}
      onStart={() => toGear()}
      onOptions={() => toOptions()}
    />
  );
}
