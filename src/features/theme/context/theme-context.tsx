"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import type { Mode } from "@/shared/types/mode";
import { Theme } from "../lib/themes";

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
  const [theme, setThemeState] = useState<Theme>(forcedTheme || "default");
  const [mode, setModeState] = useState<Mode>(forcedMode || "light");

  // Synchronize state with props during render to avoid useEffect 'set-state-in-effect' warnings
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

  useEffect(() => {
    // Only load from localStorage if NOT forced
    if (forcedTheme === undefined) {
      const savedTheme = localStorage.getItem("midi-jam-theme") as Theme;
      if (savedTheme && Object.values(Theme).includes(savedTheme)) {
        setThemeState(savedTheme);
      }
    }

    if (forcedMode === undefined) {
      const savedMode = localStorage.getItem("midi-jam-mode") as Mode;
      if (savedMode) {
        setModeState(savedMode);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setModeState("dark");
      }
    }
  }, [forcedTheme, forcedMode]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("midi-jam-theme", newTheme);
  }, []);

  const setMode = useCallback((newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem("midi-jam-mode", newMode);
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

  // Support 'D' key hotkey for toggling theme mode
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.key.toLowerCase() !== "d"
      ) {
        return;
      }

      const target = event.target as HTMLElement;
      const isTyping =
        target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);

      if (isTyping) {
        return;
      }

      setMode(mode === "dark" ? "light" : "dark");
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode, setMode]);

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
