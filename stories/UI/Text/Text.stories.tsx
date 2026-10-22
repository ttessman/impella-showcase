import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "../../../src/components/UI/Text/Text";
const meta = {
  title: "UI/Text",
  component: Text,
  parameters: {
    componentPath: "src/components/UI/Text/Text.tsx",
    docs: { description: { component: "Displays inline text with optional emphasis or code styling. For editable fields, see Input / TextInput and Input / TextArea." } },
  },
  args: { children: "A fictional field journal", mark: "bold" },
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
