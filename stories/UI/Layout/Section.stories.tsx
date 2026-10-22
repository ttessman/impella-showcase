import type { Meta, StoryObj } from "@storybook/react-vite";
import { Section } from "../../../src/components/UI/Layout/Section";
const meta = {
  title: "UI/Layout/Section",
  component: Section,
  parameters: { componentPath: "src/components/UI/Layout/Section.tsx" },
  args: {
    id: "composition",
    variant: "paper",
    label: { number: "01", label: "Composition" },
    slots: {
      header: <h2>Content with room to grow.</h2>,
      content: <p>A nested composition with independent content.</p>,
      footer: <p>Section footer</p>,
    },
  },
} satisfies Meta<typeof Section>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
