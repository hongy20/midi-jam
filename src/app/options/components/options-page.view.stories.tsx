import type { Meta, StoryObj } from "@storybook/react";
import type { Theme } from "@/lib/themes";
import { OptionsPageView } from "./options-page.view";

const meta: Meta<typeof OptionsPageView> = {
  title: "Pages/OptionsPageView",
  component: OptionsPageView,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    theme: "default" as Theme,
    isDarkMode: false,
    difficulty: "normal",
    demoMode: true,
    setTheme: (theme: Theme) => console.log("Theme set to", theme),
    setDarkMode: (enabled: boolean) => console.log("Dark mode", enabled),
    onDifficultyChange: (val: string) => console.log("Difficulty set to", val),
    setDemoMode: (enabled: boolean) => console.log("Demo mode", enabled),
    onBack: () => console.log("Go back"),
  },
};

export default meta;
type Story = StoryObj<typeof OptionsPageView>;

export const Default: Story = {};

export const DarkMode: Story = {
  args: {
    isDarkMode: true,
  },
};

export const ZeldaTheme: Story = {
  args: {
    theme: "zelda" as Theme,
  },
};

export const SegaTheme: Story = {
  args: {
    theme: "sega" as Theme,
    isDarkMode: true,
  },
};
