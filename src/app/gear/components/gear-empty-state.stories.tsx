import type { Meta, StoryObj } from "@storybook/react";
import { GearEmptyState } from "./gear-empty-state";

const meta: Meta<typeof GearEmptyState> = {
  title: "App/Gear/EmptyState",
  component: GearEmptyState,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof GearEmptyState>;

export const Default: Story = {
  args: {
    onBack: () => console.log("Back clicked"),
  },
};
