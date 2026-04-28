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

interface ThemePickerProps {
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
        <div className="border-foreground dark:border-ring bg-input/40 font-retro group hover:bg-input/60 relative cursor-pointer border-y-6 tracking-tighter uppercase transition-all active:translate-y-1">
          <div className="relative z-10 flex h-9 w-full items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <span
                className="border-foreground inline-block h-4 w-4 shrink-0 border-2"
                style={{
                  backgroundColor: themes.find((t) => t.name === activeTheme)?.color,
                }}
              />
              <span className="truncate text-xs md:text-sm">{formatThemeName(activeTheme)}</span>
            </div>
            <span className="ml-2 text-[10px] opacity-50">▼</span>
          </div>

          <div
            className="border-foreground dark:border-ring pointer-events-none absolute inset-0 z-20 -mx-1.5 border-x-6"
            aria-hidden="true"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="bg-background border-foreground max-w-70 border-4 p-2 [&>button:last-child]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Select Theme</DialogTitle>
        </DialogHeader>

        <div className="custom-scrollbar flex max-h-[60dvh] flex-col overflow-y-auto">
          {themes.map((theme) => {
            const isActive = theme.name === activeTheme;
            return (
              <button
                key={theme.name}
                type="button"
                onClick={() => handleSelect(theme.name as Theme)}
                className={cn(
                  "flex h-12 w-full shrink-0 items-center justify-between px-4 text-left transition-colors",
                  isActive ? "bg-foreground/20" : "hover:bg-foreground/5",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="border-foreground inline-block h-3 w-3 shrink-0 border"
                    style={{ backgroundColor: theme.color }}
                  />
                  <span
                    className={cn(
                      "font-retro text-[11px] tracking-tight uppercase",
                      isActive ? "text-foreground font-bold" : "text-foreground/80",
                    )}
                  >
                    {formatThemeName(theme.name)}
                  </span>
                </div>
                {isActive && <Check className="text-foreground h-3 w-3 opacity-60" />}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
