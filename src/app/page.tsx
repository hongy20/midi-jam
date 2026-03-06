"use client";

import { Play, Settings } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/button/button";
import { PageFooter } from "@/components/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";

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
      header={<PageHeader />}
      footer={
        <PageFooter className="pb-8 landscape:pb-2">
          <p className="text-foreground/40 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-center w-full">
            The ultimate immersive musical experience
          </p>
        </PageFooter>
      }
    >
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-4 landscape:py-2 w-full max-w-4xl mx-auto">
        <div className="mb-8 landscape:mb-4 w-full relative">
          <h1 className="text-6xl sm:text-7xl md:text-9xl landscape:text-5xl font-black mb-4 landscape:mb-2 tracking-tighter uppercase italic bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent select-none drop-shadow-2xl">
            MIDI JAM
          </h1>
          <div className="absolute -inset-4 bg-foreground/20 blur-3xl -z-10 rounded-full px-4" />
        </div>

        {!isSupported && (
          <div className="flex flex-col items-center gap-2 text-red-500 font-bold mb-8 landscape:mb-4">
            <span className="bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
              UNSUPPORTED BROWSER
            </span>
            <p className="text-xs text-red-500/60 max-w-xs">
              This app requires Web MIDI API. Please use Android Chrome or a
              modern Chromium browser.
            </p>
          </div>
        )}

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 landscape:gap-3 w-full max-w-lg mb-8 landscape:mb-2">
          <div className="col-span-1 sm:col-span-2 flex justify-center">
            <Button
              onClick={handleStart}
              disabled={!isSupported}
              icon={Play}
              iconPosition="right"
              size="lg"
            >
              START JAM
            </Button>
          </div>

          <div className="col-span-1 sm:col-span-2 flex justify-center">
            <Button
              variant="secondary"
              onClick={handleOptions}
              icon={Settings}
              size="lg"
            >
              Options
            </Button>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
