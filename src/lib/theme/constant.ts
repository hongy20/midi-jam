export const THEME_NEON = "neon";
export const THEME_DARK = "dark";
export const THEME_LIGHT = "light";

export const THEMES = [THEME_NEON, THEME_DARK, THEME_LIGHT] as const;

export type Theme = (typeof THEMES)[number];
