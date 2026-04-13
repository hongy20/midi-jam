"use client";

import { ArrowLeft, Moon, Sun, Wand2 } from "lucide-react";
import { SelectThemeDropdown } from "@/components/select-theme-dropdown";
import DifficultySelect, {
  type Difficulty,
} from "@/components/ui/8bit/blocks/difficulty-select";
import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { Toggle } from "@/components/ui/8bit/toggle";
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
          <CardContent>
            <SelectThemeDropdown
              activeTheme={theme}
              setActiveTheme={setTheme}
            />
          </CardContent>
        </Card>

        {/* Gameplay Section */}
        <DifficultySelect
          value={difficulty}
          onChange={onDifficultyChange}
          title="Difficulty"
          description="Adjust the note fall speed"
          className="border-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]"
          vertical={false}
        />

        {/* System Section */}
        <Card className="border-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
          <CardHeader>
            <CardTitle font="retro" className="text-lg uppercase">
              System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted/20 border-4 border-muted">
              <div className="flex items-center gap-4">
                <Wand2 className="size-6 text-primary" />
                <div className="flex flex-col gap-1">
                  <span className="retro text-xs uppercase">Autopilot</span>
                  <span className="retro text-[10px] opacity-60 uppercase">
                    System plays automatically
                  </span>
                </div>
              </div>
              <Toggle
                pressed={demoMode}
                onPressedChange={setDemoMode}
                variant="outline"
                size="sm"
              >
                {demoMode ? "ON" : "OFF"}
              </Toggle>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Actions */}
      <footer className="w-full max-w-2xl flex items-center justify-between py-6 shrink-0 border-t-8 border-muted mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDarkMode(!isDarkMode)}
          className="px-4 h-12"
          font="retro"
        >
          {isDarkMode ? (
            <Moon className="size-5 mr-3 text-primary" />
          ) : (
            <Sun className="size-5 mr-3 text-primary" />
          )}
          {isDarkMode ? "DARK" : "LIGHT"}
        </Button>

        <Button
          variant="secondary"
          onClick={onBack}
          size="sm"
          font="retro"
          className="px-6 h-12"
        >
          <ArrowLeft className="size-5 mr-3" />
          BACK
        </Button>
      </footer>
    </main>
  );
}

// Helper for conditional classes since we don't have lucide/cn logic here
import { cn } from "@/lib/utils";
