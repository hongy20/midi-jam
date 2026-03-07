"use client";

import { LogOut, Settings } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/button/button";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { SettingItem } from "@/components/setting-item/setting-item";
import { useAppContext } from "@/context/app-context";
import { useTheme } from "@/context/theme-context";
import { useNavigation } from "@/hooks/use-navigation";

function BackButton() {
  const { goBack } = useNavigation();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/";

  return (
    <Button variant="secondary" onClick={() => goBack(from)} size="sm">
      Back
    </Button>
  );
}

export default function OptionsPage() {
  const { toHome } = useNavigation();
  const { theme, setTheme } = useTheme();
  const {
    options: { speed, setSpeed, demoMode, setDemoMode },
  } = useAppContext();

  const themeOptions = ["neon", "dark", "light"] as const;
  const speedOptions = [
    { label: "Slow", value: 0.5 },
    { label: "Normal", value: 1.0 },
    { label: "Fast", value: 2.0 },
  ] as const;

  return (
    <PageLayout
      header={
        <PageHeader title="System Settings" icon={Settings}>
          <Suspense fallback={<div className="w-20" />}>
            <BackButton />
          </Suspense>
          <Button
            variant="primary"
            onClick={() => toHome()}
            size="sm"
            icon={LogOut}
            iconPosition="right"
          >
            Exit
          </Button>
        </PageHeader>
      }
      footer={<PageFooter>Midi Jam v0.1.0 • Experimental Build</PageFooter>}
    >
      <main className="w-full h-full flex flex-col gap-6 py-4 px-8 max-w-5xl mx-auto overflow-y-auto">
        <SettingItem
          title="Visual Theme"
          description="Toggle global application style"
        >
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
        </SettingItem>

        <SettingItem
          title="Playback Speed"
          description="Adjust note fall tempo"
        >
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
        </SettingItem>

        <SettingItem
          title="Demo Mode"
          description="Auto-play previews without gear"
        >
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
        </SettingItem>
      </main>
    </PageLayout>
  );
}
