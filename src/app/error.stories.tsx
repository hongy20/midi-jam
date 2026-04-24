import type { Meta, StoryObj } from "@storybook/react";

import GlobalError from "./error";

const meta: Meta<typeof GlobalError> = {
  title: "App/Error",
  component: GlobalError,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof GlobalError>;

export const Default: Story = {
  args: {
    error: new Error("Critical system malfunction detected.") as Error & {
      digest?: string;
    },
  },
};
