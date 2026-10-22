import type { Meta, StoryObj } from "@storybook/react-vite";
import { Code } from "../../../src/components/UI/Code/Code";
const meta = {
  title: "UI/Code",
  component: Code,
  parameters: {
    componentPath: "src/components/UI/Code/Code.tsx",
    docs: {
      description: {
        component:
          "Displays literal code as a block or inline snippet. The JavaScript shown is sample text, not a component or executed code.",
      },
    },
  },
  args: { children: 'const journal = { title: "Field notes" };' },
} satisfies Meta<typeof Code>;
export default meta;
type Story = StoryObj<typeof meta>;
export const CodeBlock: Story = { name: "Code block (sample text)" };
export const InlineSnippet: Story = {
  name: "Inline snippet (sample text)",
  args: { inline: true, children: "journal.title" },
};
