import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "../../../src/components/UI/Accordion/Accordion";
const meta = {
  title: "UI/Accordion",
  component: Accordion,
  parameters: { componentPath: "src/components/UI/Accordion/Accordion.tsx" },
  args: {
    label: "How the journal works",
    children: "Describe one unexpected detail.",
    initiallyExpanded: true,
  },
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
