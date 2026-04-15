"use client";

import type { Theme } from "@/lib/themes";
import { ThemeInventoryGrid } from "./theme-inventory-grid";

export interface SelectThemeDropdownProps {
  activeTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function SelectThemeDropdown({
  activeTheme,
  onThemeChange,
}: SelectThemeDropdownProps) {
  return (
    <ThemeInventoryGrid
      activeTheme={activeTheme}
      onThemeChange={onThemeChange}
    />
  );
}
