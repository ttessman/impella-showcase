import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReadingHeader } from "../../../../src/components/UI/Header/variants/ReadingHeader";
import { sections } from "../../../support/fixtures";
const meta = {
  title: "UI/Header/ReadingHeader",
  component: ReadingHeader,
  parameters: {
    componentPath: "src/components/UI/Header/variants/ReadingHeader.tsx",
  },
  args: {
    identity: "FIELD NOTES",
    sections,
    navigation: {
      overview: { label: "Overview", href: "#overview" },
      primaryAction: { label: "Compose", href: "#composition" },
      sectionsLabel: "Sections",
    },
  },
} satisfies Meta<typeof ReadingHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
