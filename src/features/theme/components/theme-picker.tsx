"use client";

import { Check } from "lucide-react";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/8bit/dialog";
import { cn } from "@/shared/lib/utils";

import { Theme } from "../lib/themes";

const themes = [
  { name: Theme.Default, color: "#000" },
  { name: Theme.Sega, color: "#0055a4" },
  { name: Theme.Gameboy, color: "#8bac0f" },
  { name: Theme.Atari, color: "#7a4009" },
  { name: Theme.Nintendo, color: "#104cb0" },
  { name: Theme.Arcade, color: "#F07CD4" },
  { name: Theme.NeoGeo, color: "#dc2626" },
  { name: Theme.SoftPop, color: "#4B3F99" },
  { name: Theme.Pacman, color: "#ffcc00" },
  { name: Theme.VHS, color: "#8B5CF6" },
  { name: Theme.RustyByte, color: "#d2691e" },
  { name: Theme.Zelda, color: "oklch(0.75 0.2 90)" },
  { name: Theme.DungeonTorch, color: "#c87533" },
  { name: Theme.SpaceStation, color: "#2196f3" },
  { name: Theme.PixelForest, color: "#4caf50" },
  { name: Theme.IceCavern, color: "#81d4fa" },
  { name: Theme.LavaCore, color: "#e64a19" },
  { name: Theme.GlitchMode, color: "#00ffcc" },
  { name: Theme.DwarvenVault, color: "#c8a600" },
  { name: Theme.DragonHoard, color: "#c62828" },
  { name: Theme.AncientRunes, color: "#009688" },
];

export interface ThemePickerProps {
  activeTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemePicker({ activeTheme, onThemeChange }: ThemePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Capitalize theme names for display
  const formatThemeName = (name: string) => {
    return name
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const handleSelect = (theme: Theme) => {
    onThemeChange(theme);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative border-y-6 border-foreground dark:border-ring bg-input/40 font-retro tracking-tighter uppercase cursor-pointer group hover:bg-input/60 transition-all active:translate-y-1">
          <div className="flex items-center justify-between px-4 h-9 w-full relative z-10">
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-4 w-4 border-2 border-foreground shrink-0"
                style={{
                  backgroundColor: themes.find((t) => t.name === activeTheme)?.color,
                }}
              />
              <span className="truncate text-xs md:text-sm">{formatThemeName(activeTheme)}</span>
            </div>
            <span className="opacity-50 text-[10px] ml-2">▼</span>
          </div>

          <div
            className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring pointer-events-none z-20"
            aria-hidden="true"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[280px] p-2 bg-background border-4 border-foreground [&>button:last-child]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Select Theme</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col max-h-[60dvh] overflow-y-auto custom-scrollbar">
          {themes.map((theme) => {
            const isActive = theme.name === activeTheme;
            return (
              <button
                key={theme.name}
                type="button"
                onClick={() => handleSelect(theme.name as Theme)}
                className={cn(
                  "flex items-center justify-between w-full px-4 h-12 shrink-0 text-left transition-colors",
                  isActive ? "bg-foreground/20" : "hover:bg-foreground/5",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-3 w-3 border border-foreground shrink-0"
                    style={{ backgroundColor: theme.color }}
                  />
                  <span
                    className={cn(
                      "font-retro text-[11px] uppercase tracking-tight",
                      isActive ? "text-foreground font-bold" : "text-foreground/80",
                    )}
                  >
                    {formatThemeName(theme.name)}
                  </span>
                </div>
                {isActive && <Check className="h-3 w-3 text-foreground opacity-60" />}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
