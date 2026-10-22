import type { Meta, StoryObj } from "@storybook/react-vite";
import { Figure } from "../../../src/components/UI/Figure/Figure";
import { image } from "../../support/fixtures";
const meta = {
  title: "UI/Figure",
  component: Figure,
  parameters: { componentPath: "src/components/UI/Figure/Figure.tsx" },
  args: {
    variant: "architecture",
    children: (
      <>
        <img {...image} style={{ maxWidth: 400, width: "100%" }} />
        <figcaption>A fictional journal illustration.</figcaption>
      </>
    ),
  },
} satisfies Meta<typeof Figure>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
