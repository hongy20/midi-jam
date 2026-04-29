import type { Meta, StoryObj } from "@storybook/react";
import { Piano } from "lucide-react";

import { GearCard } from "./gear-card";

const meta: Meta<typeof GearCard> = {
  title: "Features/MidiHardware/GearCard",
  component: GearCard,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "200px", height: "160px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Yamaha P-125",
    description: "Yamaha Corporation",
    icon: <Piano className="size-8" />,
  },
};

export default meta;
type Story = StoryObj<typeof GearCard>;

export const Default: Story = {};

export const WithBadge: Story = {
  args: {
    badge: "PIANO",
  },
};

export const Selected: Story = {
  args: {
    badge: "PIANO",
    isSelected: true,
  },
};

export const Clickable: Story = {
  args: {
    badge: "PIANO",
    onClick: () => console.log("GearCard clicked"),
  },
};
