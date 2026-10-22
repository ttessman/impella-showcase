import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "../../../src/components/UI/Input/Select";
const meta = {
  title: "UI/Input/Select",
  component: Select,
  parameters: { componentPath: "src/components/UI/Input/Select.tsx" },
  args: {
    "aria-label": "Journal destination",
    defaultValue: "root",
    children: (
      <>
        <option value="root">Page root</option>
        <option value="chapter">Journal section</option>
      </>
    ),
  },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
