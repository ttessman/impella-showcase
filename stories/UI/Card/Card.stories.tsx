import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../../../src/components/UI/Card/Card";
const meta = {
  title: "UI/Card",
  component: Card,
  parameters: { componentPath: "src/components/UI/Card/Card.tsx" },
  args: {
    variant: "outlined",
    slots: {
      header: <h3>A field journal</h3>,
      content: (
        <p>Collect a color, sketch a shape, and notice something new.</p>
      ),
      footer: <a href="#notes">Read the notes</a>,
    },
  },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Tinted: Story = { args: { variant: "tinted" } };
export const SourceSummary: Story = { args: { variant: "source-summary" } };
