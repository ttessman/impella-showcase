import type { Meta, StoryObj } from "@storybook/react-vite";
import { CaseStudy } from "../../../src/components/UI/CaseStudy/CaseStudy";
const meta = {
  title: "UI/CaseStudy",
  component: CaseStudy,
  parameters: { componentPath: "src/components/UI/CaseStudy/CaseStudy.tsx" },
  args: {},
} satisfies Meta<typeof CaseStudy>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
