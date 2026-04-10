import type { Meta, StoryObj } from "@storybook/react";
import GlobalError from "./error";

const meta: Meta<typeof GlobalError> = {
  title: "App/Global/Error",
  component: GlobalError,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof GlobalError>;

export const Default: Story = {
  args: {
    error: new globalThis.Error(
      "Critical system malfunction detected.",
    ) as globalThis.Error & {
      digest?: string;
    },
  },
};
