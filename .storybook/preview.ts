import type { Preview } from "@storybook/nextjs-vite";
import * as React from "react";
import { useEffect } from "react";
import { ThemeProvider } from "../src/context/theme-context";
import { Theme } from "../src/lib/themes";
import "../src/app/globals.css";
import "../src/app/retro-globals.css";

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
      const html = document.documentElement;

      useEffect(() => {
        // Handle Retro Theme
        html.setAttribute("data-theme", theme);

        // Handle Light/Dark Mode
        if (mode === "dark") {
          html.classList.add("dark");
        } else {
          html.classList.remove("dark");
        }
      }, [theme, mode, html]);

      return React.createElement(ThemeProvider, null, Story());
    },
  ],
};

export default preview;
