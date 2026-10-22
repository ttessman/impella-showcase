import type { Meta, StoryObj } from "@storybook/react-vite";
import { Page } from "../../../src/components/UI/Layout/Page";
const meta = {
  title: "UI/Layout/Page",
  component: Page,
  parameters: { componentPath: "src/components/UI/Layout/Page.tsx" },
  args: {
    skipLink: { href: "#content", label: "Skip to content" },
    slots: {
      header: <h3>Field journal</h3>,
      content: (
        <main id="content">
          <p>An independent page composition.</p>
        </main>
      ),
      footer: <p>Journal footer</p>,
    },
  },
} satisfies Meta<typeof Page>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
