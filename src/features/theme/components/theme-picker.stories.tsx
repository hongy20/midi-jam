import type { Meta, StoryObj } from "@storybook/react";

import { Theme } from "../lib/themes";
import { ThemePicker } from "./theme-picker";

const meta: Meta<typeof ThemePicker> = {
  title: "Features/Theme/ThemePicker",
  component: ThemePicker,
  parameters: {
    layout: "centered",
  },
  args: {
    activeTheme: Theme.Default,
    onThemeChange: (theme) => console.log("Theme changed:", theme),
  },
};

export default meta;
type Story = StoryObj<typeof ThemePicker>;

/** Trigger button with the default theme selected. */
export const Default: Story = {};

/** Trigger showing the Arcade theme as active. */
export const ArcadeTheme: Story = {
  args: {
    activeTheme: Theme.Arcade,
  },
};

/** Trigger showing the Gameboy theme as active. */
export const GameboyTheme: Story = {
  args: {
    activeTheme: Theme.Gameboy,
  },
};
