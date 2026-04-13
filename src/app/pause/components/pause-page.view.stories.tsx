import type { Meta, StoryObj } from "@storybook/react";
import { PausePageView } from "./pause-page.view";

const meta: Meta<typeof PausePageView> = {
  title: "Pages/Pause/PausePageView",
  component: PausePageView,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onContinue: { action: "continued" },
    onRestart: { action: "restarted" },
    onSettings: { action: "settings clicked" },
    onQuit: { action: "quit" },
  },
};

export default meta;
type Story = StoryObj<typeof PausePageView>;

export const Default: Story = {
  args: {},
};
