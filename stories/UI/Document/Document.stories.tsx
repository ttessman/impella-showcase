import type { Meta, StoryObj } from "@storybook/react-vite";
import { Document } from "../../../src/components/UI/Document/Document";
import { reader } from "../../support/fixtures";
const meta = {
  title: "UI/Document",
  component: Document,
  parameters: { componentPath: "src/components/UI/Document/Document.tsx" },
  args: { definition: reader },
} satisfies Meta<typeof Document>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
