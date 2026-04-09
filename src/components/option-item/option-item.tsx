"use client";

import type { HTMLAttributes } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent } from "@/components/ui/8bit/card";
import { Switch } from "@/components/ui/8bit/switch";
import { useOptions } from "@/context/options-context";
import { type ThemeMode, useTheme } from "@/context/theme-context";
import { THEMES, type Theme } from "@/lib/theme/constant";
import { cn } from "@/lib/utils";

export type OptionType = "theme" | "mode" | "speed" | "demo";

interface OptionItemProps extends HTMLAttributes<HTMLDivElement> {
  type: OptionType;
}

type ThemeConfig = {
  type: "theme";
  title: string;
  description: string;
  options: readonly Theme[];
  current: Theme;
  onSelect: (val: Theme) => void;
};

type ModeConfig = {
  type: "mode";
  title: string;
  description: string;
  options: readonly ThemeMode[];
  current: ThemeMode;
  onSelect: (val: ThemeMode) => void;
};

type SpeedConfig = {
  type: "speed";
  title: string;
  description: string;
  options: readonly { label: string; value: number }[];
  current: number;
  onSelect: (val: number) => void;
};

type DemoConfig = {
  type: "demo";
  title: string;
  description: string;
  current: boolean;
  onToggle: () => void;
};

type Config = ThemeConfig | ModeConfig | SpeedConfig | DemoConfig;

export function OptionItem({
  type,
  className = "",
  ...props
}: OptionItemProps) {
  const { theme, setTheme, mode, setMode } = useTheme();
  const { speed, setSpeed, demoMode, setDemoMode } = useOptions();

  const configs: Record<OptionType, Config> = {
    theme: {
      type: "theme",
      title: "VISUAL THEME",
      description: "Switch between different color palettes",
      options: THEMES,
      current: theme,
      onSelect: (val: Theme) => setTheme(val),
    },
    mode: {
      type: "mode",
      title: "APPEARANCE",
      description: "Switch between light and dark modes",
      options: ["light", "dark"] as const,
      current: mode,
      onSelect: (val: ThemeMode) => setMode(val),
    },
    speed: {
      type: "speed",
      title: "TEMPO SCALE",
      description: "Adjust the rate of falling notes",
      options: [
        { label: "SLOW", value: 0.5 },
        { label: "NORM", value: 1.0 },
        { label: "FAST", value: 2.0 },
      ],
      current: speed,
      onSelect: (val: number) => setSpeed(val),
    },
    demo: {
      type: "demo",
      title: "AUTOPILOT",
      description: "Let the system play for you (Preview)",
      current: demoMode,
      onToggle: () => setDemoMode(!demoMode),
    },
  };

  const config = configs[type];

  return (
    <Card
      className={cn(
        "border-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]",
        className,
      )}
      {...props}
    >
      <CardContent className="p-6! flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <span className="retro text-sm! uppercase tracking-tight">
            {config.title}
          </span>
          <span className="retro text-[8px] opacity-40 uppercase tracking-widest">
            {config.description}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {config.type === "demo" ? (
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "retro text-[8px] uppercase",
                  !config.current ? "opacity-100" : "opacity-20",
                )}
              >
                OFF
              </span>
              <Switch checked={config.current} onClick={config.onToggle} />
              <span
                className={cn(
                  "retro text-[8px] uppercase",
                  config.current ? "opacity-100 text-primary" : "opacity-20",
                )}
              >
                ON
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {config.type === "theme" || config.type === "mode"
                ? config.options.map((opt: string) => (
                    <Button
                      key={opt}
                      onClick={() =>
                        (config.onSelect as (val: string) => void)(opt)
                      }
                      variant={config.current === opt ? "default" : "secondary"}
                      size="sm"
                      font="retro"
                      className="px-4 text-[10px]!"
                    >
                      {opt.toUpperCase()}
                    </Button>
                  ))
                : config.options.map((opt) => (
                    <Button
                      key={opt.label}
                      onClick={() => config.onSelect(opt.value)}
                      variant={
                        config.current === opt.value ? "default" : "secondary"
                      }
                      size="sm"
                      font="retro"
                      className="px-4 text-[10px]!"
                    >
                      {opt.label}
                    </Button>
                  ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
