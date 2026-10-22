import type { StorybookConfig } from "@storybook/react-vite";
const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  staticDirs: [{ from: "../public/assets", to: "/assets" }],
  core: { disableTelemetry: true },
  viteFinal(config) {
    return {
      ...config,
      base: "./",
      build: { ...config.build, sourcemap: false },
    };
  },
};
export default config;
