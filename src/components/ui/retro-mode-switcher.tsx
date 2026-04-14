"use client";

import { Button } from "@/components/ui/8bit/button";
import type { ThemeMode } from "@/context/theme-context";
import { cn } from "@/lib/utils";

interface RetroModeSwitcherProps {
  className?: string;
  mode: ThemeMode;
  onToggle: () => void;
}

export function RetroModeSwitcher({
  className,
  mode,
  onToggle,
}: RetroModeSwitcherProps) {
  return (
    <Button
      variant="ghost"
      className="group/toggle h-9 w-9 px-0"
      onClick={onToggle}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 256 256"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="0.25"
        className={cn(
          "!size-7",
          mode === "light" ? "hidden" : "block",
          className,
        )}
        role="img"
        aria-label="sun-dim"
      >
        <title>Switch to Light Mode</title>
        <rect x="120" y="88" width="14" height="14" rx="1"></rect>
        <rect x="104" y="88" width="14" height="14" rx="1"></rect>
        <rect x="88" y="104" width="14" height="14" rx="1"></rect>
        <rect x="88" y="120" width="14" height="14" rx="1"></rect>
        <rect x="88" y="136" width="14" height="14" rx="1"></rect>
        <rect x="136" y="88" width="14" height="14" rx="1"></rect>
        <rect x="120" y="152" width="14" height="14" rx="1"></rect>
        <rect x="104" y="152" width="14" height="14" rx="1"></rect>
        <rect x="136" y="152" width="14" height="14" rx="1"></rect>
        <rect x="152" y="104" width="14" height="14" rx="1"></rect>
        <rect x="168" y="72" width="14" height="14" rx="1"></rect>
        <rect x="168" y="168" width="14" height="14" rx="1"></rect>
        <rect x="72" y="168" width="14" height="14" rx="1"></rect>
        <rect x="72" y="72" width="14" height="14" rx="1"></rect>
        <rect x="120" y="56" width="14" height="14" rx="1"></rect>
        <rect x="56" y="120" width="14" height="14" rx="1"></rect>
        <rect x="120" y="184" width="14" height="14" rx="1"></rect>
        <rect x="184" y="120" width="14" height="14" rx="1"></rect>
        <rect x="40" y="120" width="14" height="14" rx="1"></rect>
        <rect x="120" y="40" width="14" height="14" rx="1"></rect>
        <rect x="120" y="200" width="14" height="14" rx="1"></rect>
        <rect x="184" y="184" width="14" height="14" rx="1"></rect>
        <rect x="56" y="184" width="14" height="14" rx="1"></rect>
        <rect x="184" y="56" width="14" height="14" rx="1"></rect>
        <rect x="56" y="56" width="14" height="14" rx="1"></rect>
        <rect x="200" y="120" width="14" height="14" rx="1"></rect>
        <rect x="152" y="120" width="14" height="14" rx="1"></rect>
        <rect x="152" y="136" width="14" height="14" rx="1"></rect>
      </svg>
      <svg
        width="28"
        height="28"
        viewBox="0 0 256 256"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="0.25"
        className={cn(
          "!size-7",
          mode === "dark" ? "hidden" : "block",
          className,
        )}
        role="img"
        aria-label="moon"
      >
        <title>Switch to Dark Mode</title>
        <rect x="104" y="56" width="14" height="14" rx="1"></rect>
        <rect x="88" y="56" width="14" height="14" rx="1"></rect>
        <rect x="72" y="72" width="14" height="14" rx="1"></rect>
        <rect x="88" y="72" width="14" height="14" rx="1"></rect>
        <rect x="88" y="88" width="14" height="14" rx="1"></rect>
        <rect x="72" y="88" width="14" height="14" rx="1"></rect>
        <rect x="56" y="104" width="14" height="14" rx="1"></rect>
        <rect x="88" y="104" width="14" height="14" rx="1"></rect>
        <rect x="72" y="104" width="14" height="14" rx="1"></rect>
        <rect x="56" y="136" width="14" height="14" rx="1"></rect>
        <rect x="88" y="136" width="14" height="14" rx="1"></rect>
        <rect x="72" y="136" width="14" height="14" rx="1"></rect>
        <rect x="56" y="120" width="14" height="14" rx="1"></rect>
        <rect x="88" y="120" width="14" height="14" rx="1"></rect>
        <rect x="104" y="120" width="14" height="14" rx="1"></rect>
        <rect x="72" y="120" width="14" height="14" rx="1"></rect>
        <rect x="88" y="56" width="14" height="14" rx="1"></rect>
        <rect x="104" y="136" width="14" height="14" rx="1"></rect>
        <rect x="72" y="152" width="14" height="14" rx="1"></rect>
        <rect x="104" y="152" width="14" height="14" rx="1"></rect>
        <rect x="120" y="136" width="14" height="14" rx="1"></rect>
        <rect x="88" y="152" width="14" height="14" rx="1"></rect>
        <rect x="168" y="152" width="14" height="14" rx="1"></rect>
        <rect x="184" y="136" width="14" height="14" rx="1"></rect>
        <rect x="120" y="152" width="14" height="14" rx="1"></rect>
        <rect x="152" y="152" width="14" height="14" rx="1"></rect>
        <rect x="136" y="152" width="14" height="14" rx="1"></rect>
        <rect x="72" y="168" width="14" height="14" rx="1"></rect>
        <rect x="104" y="168" width="14" height="14" rx="1"></rect>
        <rect x="88" y="168" width="14" height="14" rx="1"></rect>
        <rect x="168" y="168" width="14" height="14" rx="1"></rect>
        <rect x="120" y="168" width="14" height="14" rx="1"></rect>
        <rect x="152" y="168" width="14" height="14" rx="1"></rect>
        <rect x="136" y="168" width="14" height="14" rx="1"></rect>
        <rect x="104" y="184" width="14" height="14" rx="1"></rect>
        <rect x="120" y="184" width="14" height="14" rx="1"></rect>
        <rect x="136" y="184" width="14" height="14" rx="1"></rect>
        <rect x="184" y="152" width="14" height="14" rx="1"></rect>
      </svg>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
