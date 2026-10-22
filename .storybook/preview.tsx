import type { Preview } from "@storybook/react-vite";
import { PreviewFrame } from "../stories/support/PreviewFrame";
import "../src/styles/index.css";
const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Component theme",
      toolbar: {
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => (
      <PreviewFrame theme={context.globals.theme}>
        <Story />
      </PreviewFrame>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    options: {
      storySort: {
        order: [
          "UI",
          [
            "Accordion",
            ["Docs", "Default", "ReferencesAccordion"],
            "Button",
            [
              "Docs",
              "Default",
              "Primary",
              "Text",
              "Small",
              "Large",
              "Disabled",
              "Navigation",
              "External Navigation",
              "IconButton",
            ],
            "Dialog",
            [
              "Docs",
              "Default",
              "Small",
              "Large",
              "ImageDialog",
              "ReaderDialog",
              "ChecklistDialog",
            ],
            "*",
          ],
          "CMS",
          ["Bundles", "Renderers"],
        ],
      },
    },
    controls: { expanded: true },
    a11y: { test: "todo" },
  },
};
export default preview;
