"use client";

import * as React from "react";
import { Button } from "@/components/ui/8bit/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/8bit/dialog";
import { Theme } from "@/lib/themes";
import { cn } from "@/lib/utils";

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

export interface ThemeInventoryGridProps {
  activeTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeInventoryGrid({
  activeTheme,
  onThemeChange,
}: ThemeInventoryGridProps) {
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
        <Button
          variant="outline"
          className="w-full relative justify-between px-3 h-9 font-retro tracking-tighter uppercase overflow-hidden"
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 border border-foreground"
              style={{
                backgroundColor: themes.find((t) => t.name === activeTheme)
                  ?.color,
              }}
            />
            <span className="truncate">{formatThemeName(activeTheme)}</span>
          </div>
          <span className="opacity-50">▼</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] md:max-w-md max-h-[90dvh] flex flex-col p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl md:text-2xl uppercase tracking-tighter text-center">
            Select Theme
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 min-[400px]:grid-cols-3 gap-3 md:gap-4 p-1">
            {themes.map((theme) => {
              const isActive = theme.name === activeTheme;
              return (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => handleSelect(theme.name as Theme)}
                  className={cn(
                    "group relative flex flex-col border-4 transition-all active:translate-y-0.5",
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-foreground/20 hover:border-foreground/50 bg-background",
                  )}
                >
                  {/* Theme Preview Block */}
                  <div
                    className="aspect-square w-full border-b-4 border-inherit"
                    style={{ backgroundColor: theme.color }}
                  />

                  {/* Theme Name */}
                  <div className="p-2 flex items-center justify-center min-h-[3rem]">
                    <span
                      className={cn(
                        "retro text-[8px] md:text-[10px] uppercase text-center leading-tight",
                        isActive ? "text-primary font-bold" : "opacity-80",
                      )}
                    >
                      {formatThemeName(theme.name)}
                    </span>
                  </div>

                  {/* Active Indicator overlay (optional, but adds to arcade feel) */}
                  {isActive && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[8px] px-1 font-retro">
                      SET
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
