import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid } from "../../../src/components/UI/Layout/Grid";
const meta = {
  title: "UI/Layout/Grid",
  component: Grid,
  parameters: { componentPath: "src/components/UI/Layout/Grid.tsx" },
  args: {
    variant: "two-column",
    children: (
      <>
        <article>
          <h3>Observe</h3>
          <p>Notice a detail.</p>
        </article>
        <article>
          <h3>Reflect</h3>
          <p>Write it down.</p>
        </article>
      </>
    ),
  },
} satisfies Meta<typeof Grid>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
