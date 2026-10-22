import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionLabel } from "../../../src/components/UI/SectionLabel/SectionLabel";
const meta = {
  title: "UI/SectionLabel",
  component: SectionLabel,
  parameters: {
    componentPath: "src/components/UI/SectionLabel/SectionLabel.tsx",
  },
  args: { definition: { number: "01", label: "A field journal" } },
} satisfies Meta<typeof SectionLabel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
