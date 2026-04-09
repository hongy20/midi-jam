import {
  withThemeByClassName,
  withThemeByDataAttribute,
} from "@storybook/addon-themes";
import type { Preview } from "@storybook/nextjs-vite";
import { THEME_DEFAULT, THEME_NINTENDO } from "../src/lib/theme/constant";
import "../src/app/globals.css";

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

  decorators: [
    withThemeByDataAttribute({
      themes: {
        Default: THEME_DEFAULT,
        Nintendo: THEME_NINTENDO,
      },
      defaultTheme: "Default",
      attributeName: "data-theme",
    }),
    withThemeByClassName({
      themes: {
        Light: "",
        Dark: "dark",
      },
      defaultTheme: "Light",
    }),
  ],
};

export default preview;
