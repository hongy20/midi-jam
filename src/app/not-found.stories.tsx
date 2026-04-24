import type { Meta, StoryObj } from "@storybook/react";

import NotFound from "./not-found";

const meta: Meta<typeof NotFound> = {
  title: "App/NotFound",
  component: NotFound,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof NotFound>;

export const Default: Story = {};
