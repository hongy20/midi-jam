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

    viewport: {
      viewports: {
        iphone14: {
          name: "iPhone 14 (Portrait)",
          styles: { width: "390px", height: "844px" },
          type: "mobile",
        },
        iphone14landscape: {
          name: "iPhone 14 (Landscape)",
          styles: { width: "844px", height: "390px" },
          type: "mobile",
        },
        ipadair: {
          name: "iPad Air (Portrait)",
          styles: { width: "820px", height: "1180px" },
          type: "tablet",
        },
        ipadairlandscape: {
          name: "iPad Air (Landscape)",
          styles: { width: "1180px", height: "820px" },
          type: "tablet",
        },
        desktop: {
          name: "Desktop (1440p)",
          styles: { width: "1440px", height: "900px" },
          type: "desktop",
        },
      },
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
