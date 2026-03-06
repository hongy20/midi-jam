"use client";

import { LogOut, Settings } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/button/button";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { useAppContext } from "@/context/app-context";
import { useTheme } from "@/context/theme-context";
import { useNavigation } from "@/hooks/use-navigation";

const BackButton = () => {
  const { goBack, toHome } = useNavigation();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  return (
    <>
      <Button variant="secondary" onClick={() => goBack(from)} size="sm">
        BACK
      </Button>
      <Button
        variant="primary"
        onClick={toHome}
        size="sm"
        icon={LogOut}
        iconPosition="right"
      >
        EXIT
      </Button>
    </>
  );
};

export default function OptionsPage() {
  const { theme, setTheme } = useTheme();
  const { options } = useAppContext();
  const { speed, setSpeed, demoMode, setDemoMode } = options;

  const themeOptions = ["neon", "dark", "light"] as const;
  const speedOptions = [
    { label: "Slow", value: 0.5 },
    { label: "Normal", value: 1.0 },
    { label: "Fast", value: 2.0 },
  ] as const;

  return (
    <PageLayout
      header={
        <PageHeader title="Options" icon={Settings}>
          <Suspense>
            <BackButton />
          </Suspense>
        </PageHeader>
      }
      footer={<PageFooter>Midi Jam v0.1.0 • Experimental Build</PageFooter>}
    >
      <main
        className={`w-full h-full grid grid-cols-1 gap-3 sm:gap-6 overflow-y-auto py-4`}
      >
        {/* Setting Item: Theme */}
        <div className="bg-[var(--ui-card-bg)] backdrop-blur-md border border-[var(--ui-card-border)] p-6 sm:p-8 rounded-[var(--ui-card-radius)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-foreground/10 transition-colors">
          <div className="flex flex-col flex-1">
            <span className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
              Visual Theme
            </span>
            <span className="text-foreground/50 text-xs sm:text-sm font-medium">
              Toggle global application style
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap bg-background/50 p-2 rounded-full border border-foreground/10 self-stretch sm:self-auto justify-center">
            {themeOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTheme(opt)}
                className={`px-4 sm:px-6 py-2 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest transition-all ${
                  theme === opt
                    ? "bg-foreground text-background shadow-md scale-[1.05]"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Setting Item: Speed */}
        <div className="bg-[var(--ui-card-bg)] backdrop-blur-md border border-[var(--ui-card-border)] p-6 sm:p-8 rounded-[var(--ui-card-radius)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-foreground/10 transition-colors">
          <div className="flex flex-col flex-1">
            <span className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
              Playback Speed
            </span>
            <span className="text-foreground/50 text-xs sm:text-sm font-medium">
              Adjust note fall tempo
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap bg-background/50 p-2 rounded-full border border-foreground/10 self-stretch sm:self-auto justify-center">
            {speedOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setSpeed(opt.value)}
                className={`px-4 sm:px-6 py-2 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest transition-all ${
                  speed === opt.value
                    ? "bg-foreground text-background shadow-md scale-[1.05]"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Setting Item: Demo Mode */}
        <div className="bg-[var(--ui-card-bg)] backdrop-blur-md border border-[var(--ui-card-border)] p-6 sm:p-8 rounded-[var(--ui-card-radius)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-foreground/10 transition-colors">
          <div className="flex flex-col flex-1">
            <span className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
              Demo Mode
            </span>
            <span className="text-foreground/50 text-xs sm:text-sm font-medium">
              Auto-play previews without gear
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDemoMode(!demoMode)}
            className={`w-20 sm:w-24 h-10 sm:h-12 rounded-full relative transition-colors duration-300 self-end sm:self-auto ${
              demoMode
                ? "bg-foreground shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                : "bg-foreground/20"
            }`}
          >
            <div
              className={`absolute top-1 bottom-1 w-8 sm:w-10 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-sm ${
                demoMode
                  ? "bg-background left-[calc(100%-0.25rem-2rem)] sm:left-[calc(100%-0.25rem-2.5rem)] scale-110"
                  : "bg-foreground/50 left-1 scale-90"
              }`}
            />
          </button>
        </div>
      </main>
    </PageLayout>
  );
}
