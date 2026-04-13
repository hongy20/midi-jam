import type { Meta, StoryObj } from "@storybook/react";
import type { ThemeMode } from "@/context/theme-context";
import type { Theme } from "@/lib/themes";
import { OptionsPageView } from "./options-page.view";

const meta: Meta<typeof OptionsPageView> = {
  title: "App/Options/View",
  component: OptionsPageView,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    difficulty: "normal",
    demoMode: true,
    activeTheme: "default" as Theme,
    mode: "light" as ThemeMode,
    onThemeChange: (theme: Theme) => console.log("Theme set to", theme),
    onModeToggle: () => console.log("Toggle mode"),
    onDifficultyChange: (val: string) => console.log("Difficulty set to", val),
    setDemoMode: (enabled: boolean) => console.log("Demo mode", enabled),
    onBack: () => console.log("Go back"),
  },
};

export default meta;
type Story = StoryObj<typeof OptionsPageView>;

export const Default: Story = {};

export const HardDifficulty: Story = {
  args: {
    difficulty: "hard",
  },
};

export const DemoOff: Story = {
  args: {
    demoMode: false,
  },
};
