import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea } from "../../../src/components/UI/Input/TextArea";
const meta = {
  title: "UI/Input/TextArea",
  component: TextArea,
  parameters: { componentPath: "src/components/UI/Input/TextArea.tsx" },
  args: {
    "aria-label": "Journal notes",
    defaultValue: "A field guide to noticing",
  },
} satisfies Meta<typeof TextArea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { "aria-invalid": true } };
