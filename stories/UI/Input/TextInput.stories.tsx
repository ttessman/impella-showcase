import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "../../../src/components/UI/Input/TextInput";
const meta = {
  title: "UI/Input/TextInput",
  component: TextInput,
  parameters: { componentPath: "src/components/UI/Input/TextInput.tsx" },
  args: {
    "aria-label": "Journal title",
    defaultValue: "A field guide to noticing",
  },
} satisfies Meta<typeof TextInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { "aria-invalid": true } };
