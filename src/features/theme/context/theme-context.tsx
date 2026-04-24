"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { type Mode } from "@/shared/types/mode";

import { Theme } from "../lib/themes";

const STORAGE_KEY_THEME = "midi-jam-theme";
const STORAGE_KEY_MODE = "midi-jam-mode";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  theme: forcedTheme,
  mode: forcedMode,
}: {
  children: ReactNode;
  theme?: Theme;
  mode?: Mode;
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (forcedTheme) return forcedTheme;
    if (typeof window === "undefined") return "default";
    const saved = localStorage.getItem(STORAGE_KEY_THEME) as Theme;
    return saved && Object.values(Theme).includes(saved) ? saved : "default";
  });

  const [mode, setModeState] = useState<Mode>(() => {
    if (forcedMode) return forcedMode;
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem(STORAGE_KEY_MODE) as Mode;
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Synchronize state with forced props when they change (e.g. Storybook controls)
  const [prevForcedTheme, setPrevForcedTheme] = useState(forcedTheme);
  if (forcedTheme !== prevForcedTheme) {
    setPrevForcedTheme(forcedTheme);
    if (forcedTheme) setThemeState(forcedTheme);
  }

  const [prevForcedMode, setPrevForcedMode] = useState(forcedMode);
  if (forcedMode !== prevForcedMode) {
    setPrevForcedMode(forcedMode);
    if (forcedMode) setModeState(forcedMode);
  }

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY_THEME, newTheme);
  }, []);

  const setMode = useCallback((newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY_MODE, newMode);
  }, []);

  useEffect(() => {
    // Apply theme classes to both body and documentElement
    const targets = [document.body, document.documentElement];
    for (const el of targets) {
      const themeClasses = Array.from(el.classList).filter((className) =>
        className.startsWith("theme-"),
      );
      for (const className of themeClasses) {
        el.classList.remove(className);
      }
      el.classList.add(`theme-${theme}`);
    }
    // Also keep the data-theme for backward compatibility if any CSS uses it
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
