import type { Meta, StoryObj } from "@storybook/react";
import { PausePageView } from "./pause-page.view";

const meta: Meta<typeof PausePageView> = {
  title: "App/Pause/View",
  component: PausePageView,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onContinue: { action: "continued" },
    onRestart: { action: "restarted" },
    onOptions: { action: "options clicked" },
    onQuit: { action: "quit" },
  },
};

export default meta;
type Story = StoryObj<typeof PausePageView>;

export const Default: Story = {
  args: {},
};
