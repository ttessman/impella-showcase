import type { Meta, StoryObj } from "@storybook/react-vite";
import { Media } from "../../../src/components/UI/Media/Media";
import { image } from "../../support/fixtures";
const meta = {
  title: "UI/Media",
  component: Media,
  parameters: { componentPath: "src/components/UI/Media/Media.tsx" },
  args: {
    definition: { image, title: "Field notes", variant: "evidence" },
    caption: "A fictional creative project.",
  },
} satisfies Meta<typeof Media>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
