import "../src/app/globals.css";

import type { Preview } from "@storybook/nextjs-vite";
import * as React from "react";

import { Theme, ThemeProvider } from "../src/features/theme";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: "todo",
    },
  },

  globalTypes: {
    theme: {
      name: "Retro Theme",
      description: "Global retro theme for components",
      defaultValue: "default",
      toolbar: {
        icon: "paintbrush",
        items: Object.entries(Theme).map(([key, value]) => ({
          value,
          title: key,
        })),
      },
    },
    mode: {
      name: "Mode",
      description: "Light or Dark mode",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "circlehollow" },
          { value: "dark", title: "Dark", icon: "circle" },
        ],
      },
    },
  },

  decorators: [
    (Story, context) => {
      const { theme, mode } = context.globals;
      return React.createElement(ThemeProvider, { theme, mode }, Story());
    },
  ],
};

export default preview;
