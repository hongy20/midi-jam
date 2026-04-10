import type { Meta, StoryObj } from "@storybook/react";
import GearError from "./error";

const meta: Meta<typeof GearError> = {
  title: "App/Gear/Error",
  component: GearError,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof GearError>;

export const Default: Story = {
  args: {
    error: new Error("MIDI Access Denied") as Error & { digest?: string },
    reset: () => console.log("Reset clicked"),
  },
};
