"use client";

import { ArrowLeft } from "lucide-react";
import type { Difficulty } from "@/features/settings/context/options-context";
import { ThemePicker } from "@/features/theme";
import type { Theme } from "@/features/theme";
import { Button } from "@/shared/components/ui/8bit/button";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/8bit/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/8bit/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/8bit/select";
import { Toggle } from "@/shared/components/ui/8bit/toggle";
import { RetroModeSwitcher } from "@/shared/components/ui/retro-mode-switcher";
import type { Mode } from "@/shared/types/mode";

interface OptionsPageViewProps {
  difficulty: Difficulty;
  onDifficultyChange: (val: Difficulty) => void;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  activeTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  mode: Mode;
  onModeToggle: () => void;
  onBack: () => void;
}

export function OptionsPageView({
  difficulty,
  onDifficultyChange,
  demoMode,
  setDemoMode,
  activeTheme,
  onThemeChange,
  mode,
  onModeToggle,
  onBack,
}: OptionsPageViewProps) {
  return (
    <main className="h-dvh w-screen flex flex-col items-center justify-evenly px-4 bg-background overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-center shrink-0">
        <h1 className="retro text-2xl md:text-3xl tracking-tighter uppercase text-center">
          Settings
        </h1>
      </div>

      {/* Content Area */}
      <div className="w-full px-8 min-[400px]:px-12 md:px-16 overflow-visible">
        <Carousel
          className="mx-auto w-full max-w-4xl"
          opts={{ align: "start", loop: false }}
        >
          <CarouselContent>
            <CarouselItem className="pl-4 jam-carousel-item">
              <Card className="border-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] h-full">
                <CardContent className="h-full p-4 md:p-6 flex flex-col justify-between gap-4">
                  <CardTitle font="retro" className="text-lg uppercase">
                    Visual Theme
                  </CardTitle>
                  <p className="retro text-[10px] opacity-60 uppercase text-wrap">
                    Customize the look and feel
                  </p>
                  <div className="w-full">
                    <ThemePicker
                      activeTheme={activeTheme}
                      onThemeChange={onThemeChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>

            <CarouselItem className="pl-4 jam-carousel-item">
              <Card className="border-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] h-full">
                <CardContent className="h-full p-4 md:p-6 flex flex-col justify-between gap-4">
                  <CardTitle font="retro" className="text-lg uppercase">
                    Difficulty
                  </CardTitle>
                  <p className="retro text-[10px] opacity-60 uppercase text-wrap">
                    Adjust the note fall speed
                  </p>
                  <div className="w-full">
                    <Select
                      value={difficulty}
                      onValueChange={(val) =>
                        onDifficultyChange(val as Difficulty)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">EASY (0.5x)</SelectItem>
                        <SelectItem value="normal">NORMAL (1.0x)</SelectItem>
                        <SelectItem value="hard">HARD (2.0x)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>

            <CarouselItem className="pl-4 jam-carousel-item">
              <Card className="border-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] h-full">
                <CardContent className="h-full p-4 md:p-6 flex flex-col justify-between gap-4">
                  <CardTitle font="retro" className="text-lg uppercase">
                    Autopilot
                  </CardTitle>
                  <div className="flex flex-col gap-4 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between">
                    <p className="retro text-[10px] opacity-60 uppercase min-[400px]:mb-0 text-wrap">
                      System plays automatically
                    </p>
                    <Toggle
                      pressed={demoMode}
                      onPressedChange={setDemoMode}
                      variant="outline"
                      size="sm"
                      className="shrink-0 w-full min-[400px]:w-auto"
                    >
                      {demoMode ? "ON" : "OFF"}
                    </Toggle>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <footer className="w-full max-w-2xl flex items-center justify-between border-muted py-2">
        <div className="flex items-center">
          <RetroModeSwitcher mode={mode} onToggle={onModeToggle} />
        </div>

        <Button variant="secondary" onClick={onBack} size="sm" font="retro">
          <ArrowLeft className="size-5 mr-3" />
          BACK
        </Button>
      </footer>
    </main>
  );
}
