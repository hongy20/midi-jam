"use client";

import { useEffect } from "react";
import { useNavigation } from "@/hooks/use-navigation";
import { useAppReset } from "@/hooks/use-track-sync";
import { WelcomePageView } from "./welcome-page.view";

export function WelcomePageContainer() {
  const { toGear, toOptions } = useNavigation();
  const { resetAll } = useAppReset();

  useEffect(() => {
    resetAll();
  }, [resetAll]);

  return (
    <WelcomePageView
      onStart={() => toGear()}
      onOptions={() => toOptions()}
    />
  );
}
