export const THEME_DEFAULT = "default";
export const THEME_NINTENDO = "nintendo";

export const THEMES = [THEME_DEFAULT, THEME_NINTENDO] as const;

export type Theme = (typeof THEMES)[number];
