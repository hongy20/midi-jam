"use client";

import { ArrowLeft } from "lucide-react";
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
import type { ThemeMode } from "@/context/theme-context";
import type { Theme } from "@/lib/themes";
import { SelectThemeDropdown } from "./select-theme-dropdown";

interface OptionsPageViewProps {
  difficulty: Difficulty;
  onDifficultyChange: (val: Difficulty) => void;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  activeTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  mode: ThemeMode;
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
      <div className="w-full max-w-2xl flex flex-col gap-6 overflow-y-auto no-scrollbar">
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
              activeTheme={activeTheme}
              onThemeChange={onThemeChange}
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

      <footer className="w-full max-w-2xl flex items-center justify-between border-muted py-2">
        <div className="flex items-center">
          <RetroModeSwitcher
            mode={mode}
            onToggle={onModeToggle}
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
