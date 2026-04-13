"use client";

import { ArrowLeft } from "lucide-react";
import { SelectThemeDropdown } from "@/components/select-theme-dropdown";
import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/8bit/select";
import { Toggle } from "@/components/ui/8bit/toggle";
import { RetroModeSwitcher } from "@/components/ui/retro-mode-switcher";
import type { Difficulty } from "@/context/options-context";
import type { Theme } from "@/lib/themes";

interface OptionsPageViewProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  difficulty: Difficulty;
  onDifficultyChange: (val: Difficulty) => void;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  onBack: () => void;
}

export function OptionsPageView({
  theme,
  setTheme,
  isDarkMode,
  setDarkMode,
  difficulty,
  onDifficultyChange,
  demoMode,
  setDemoMode,
  onBack,
}: OptionsPageViewProps) {
  return (
    <main className="h-dvh w-screen flex flex-col items-center justify-start p-4 md:p-8 bg-background overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-center shrink-0 py-4">
        <h1 className="retro text-2xl md:text-3xl tracking-tighter uppercase text-center">
          Settings
        </h1>
      </div>

      {/* Content Area */}
      <div className="w-full max-w-2xl flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-12">
        {/* Visual Theme Section */}
        <Card className="border-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
          <CardHeader className="pb-2">
            <CardTitle font="retro" className="text-lg uppercase">
              Visual Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="retro text-[10px] opacity-60 uppercase mb-2 text-wrap">
              Customize the look and feel
            </p>
            <SelectThemeDropdown
              activeTheme={theme}
              setActiveTheme={setTheme}
            />
          </CardContent>
        </Card>

        {/* Gameplay Section */}
        <Card className="border-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
          <CardHeader className="pb-2">
            <CardTitle font="retro" className="text-lg uppercase">
              Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="retro text-[10px] opacity-60 uppercase mb-2 text-wrap">
              Adjust the note fall speed
            </p>
            <Select
              value={difficulty}
              onValueChange={(val) => onDifficultyChange(val as Difficulty)}
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
          </CardContent>
        </Card>

        {/* Autopilot Section */}
        <Card className="border-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
          <CardHeader className="pb-2">
            <CardTitle font="retro" className="text-lg uppercase">
              Autopilot
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="retro text-[10px] opacity-60 uppercase mb-2 text-wrap">
                System plays automatically
              </p>
              <Toggle
                pressed={demoMode}
                onPressedChange={setDemoMode}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                {demoMode ? "ON" : "OFF"}
              </Toggle>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="w-full max-w-2xl flex items-center justify-between py-6 shrink-0 border-t-8 border-muted mt-auto">
        <div className="flex items-center">
          <RetroModeSwitcher
            isDarkMode={isDarkMode}
            onToggle={() => setDarkMode(!isDarkMode)}
            className="size-7"
          />
        </div>

        <Button variant="secondary" onClick={onBack} size="sm" font="retro">
          <ArrowLeft className="size-5 mr-3" />
          BACK
        </Button>
      </footer>
    </main>
  );
}
