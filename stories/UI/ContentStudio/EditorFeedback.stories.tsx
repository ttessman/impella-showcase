import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditorFeedback } from "../../../src/components/UI/ContentStudio/EditorFeedback";
const meta = {
  title: "UI/ContentStudio/EditorFeedback",
  component: EditorFeedback,
  parameters: {
    componentPath: "src/components/UI/ContentStudio/EditorFeedback.tsx",
  },
  args: { error: "", message: "JSON is valid.", tone: "success" },
} satisfies Meta<typeof EditorFeedback>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Error: Story = {
  args: { error: "JSON syntax error at line 4, column 2." },
};
export const Neutral: Story = {
  args: { tone: "neutral", message: "Working example loaded." },
};
