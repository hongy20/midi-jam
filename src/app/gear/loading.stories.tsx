import type { Meta, StoryObj } from "@storybook/react";
import GearLoading from "./loading";

const meta: Meta<typeof GearLoading> = {
  title: "App/Gear/Loading",
  component: GearLoading,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof GearLoading>;

export const Default: Story = {};
