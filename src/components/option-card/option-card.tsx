"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/app-context";
import { useTheme } from "@/context/theme-context";
import { THEMES, type Theme } from "@/lib/theme/constant";
import styles from "./option-card.module.css";

export type OptionType = "theme" | "speed" | "demo";

interface OptionCardProps {
  type: OptionType;
  className?: string;
}

type ThemeConfig = {
  type: "theme";
  title: string;
  description: string;
  options: readonly Theme[];
  current: Theme;
  onSelect: (val: Theme) => void;
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

type Config = ThemeConfig | SpeedConfig | DemoConfig;

export function OptionCard({ type, className = "" }: OptionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const {
    options: { speed, setSpeed, demoMode, setDemoMode },
  } = useAppContext();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const configs: Record<OptionType, Config> = {
    theme: {
      type: "theme",
      title: "Visual Theme",
      description: "Toggle global application style",
      options: THEMES,
      current: theme,
      onSelect: (val: Theme) => {
        setTheme(val);
        setIsOpen(false);
      },
    },
    speed: {
      type: "speed",
      title: "Playback Speed",
      description: "Adjust note fall tempo",
      options: [
        { label: "Slow", value: 0.5 },
        { label: "Normal", value: 1.0 },
        { label: "Fast", value: 2.0 },
      ],
      current: speed,
      onSelect: (val: number) => {
        setSpeed(val);
        setIsOpen(false);
      },
    },
    demo: {
      type: "demo",
      title: "Demo Mode",
      description: "Auto-play previews without gear",
      current: demoMode,
      onToggle: () => setDemoMode(!demoMode),
    },
  };

  const config = configs[type];

  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.info}>
        <span className={styles.title}>{config.title}</span>
        <span className={styles.description}>{config.description}</span>
      </div>

      <div className={styles.controls} ref={dropdownRef}>
        {config.type === "demo" ? (
          <button
            type="button"
            onClick={config.onToggle}
            className={`${styles.toggle} ${
              config.current ? styles.toggleActive : styles.toggleInactive
            }`}
          >
            <div
              className={`${styles.toggleKnob} ${
                config.current ? styles.knobActive : styles.knobInactive
              }`}
            />
          </button>
        ) : (
          <div className={styles.dropdownWrapper}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`${styles.dropdownTrigger} ${isOpen ? styles.triggerActive : ""}`}
            >
              <span className={styles.currentLabel}>
                {config.type === "theme"
                  ? config.current
                  : config.options.find((o) => o.value === config.current)
                      ?.label}
              </span>
              <ChevronDown
                className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
              />
            </button>

            {isOpen && (
              <div className={styles.dropdownMenu}>
                {config.type === "theme"
                  ? config.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => config.onSelect(opt)}
                        className={`${styles.dropdownItem} ${
                          config.current === opt ? styles.itemSelected : ""
                        }`}
                      >
                        {opt}
                      </button>
                    ))
                  : config.options.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => config.onSelect(opt.value)}
                        className={`${styles.dropdownItem} ${
                          config.current === opt.value
                            ? styles.itemSelected
                            : ""
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
