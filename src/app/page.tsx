"use client";

import { Play, Settings } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/button/button";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageLayout } from "@/components/page-layout/page-layout";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";
import styles from "./page.module.css";

export default function WelcomePage() {
  const { toGear, toOptions } = useNavigation();
  const { actions, isSupported } = useAppContext();
  const { resetAll: clearSelection } = actions;

  useEffect(() => {
    clearSelection();
  }, [clearSelection]);

  const handleStart = () => {
    toGear();
  };

  const handleOptions = () => {
    toOptions();
  };

  return (
    <PageLayout
      footer={
        <PageFooter>The ultimate immersive musical experience</PageFooter>
      }
    >
      <main className="w-full h-full flex flex-col gap-4 items-center justify-center text-center">
        <h1 className="text-6xl sm:text-7xl md:text-9xl w-full mb-4 font-black tracking-tighter uppercase italic bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent select-none drop-shadow-2xl">
          MIDI JAM
        </h1>

        {!isSupported && (
          <>
            <span className="bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
              UNSUPPORTED BROWSER
            </span>
            <p className="text-xs text-red-500/60 max-w-xs">
              This app requires Web MIDI API. Please use Android Chrome or a
              modern Chromium browser.
            </p>
          </>
        )}

        <div className={styles.buttonGroup}>
          <Button
            onClick={handleStart}
            disabled={!isSupported}
            icon={Play}
            iconPosition="right"
            size="md"
          >
            START JAM
          </Button>
          <Button
            variant="secondary"
            onClick={handleOptions}
            icon={Settings}
            size="sm"
          >
            Options
          </Button>
        </div>
      </main>
    </PageLayout>
  );
}
