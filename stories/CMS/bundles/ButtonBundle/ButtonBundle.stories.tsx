import type { Meta, StoryObj } from "@storybook/react-vite";
import { CmsExample } from "../../../support/CmsExample";
import { nodeOf } from "../../../support/fixtures";
const meta = {
  title: "CMS/Bundles/Button",
  component: CmsExample,
  parameters: {
    componentPath: "src/components/CMS/bundles/ButtonBundle/ButtonBundle.tsx",
    docs: {
      description: {
        component:
          "ButtonBundle: the real CMS renderer with editable, validated JSON and document context. Open Edit example JSON in the canvas, or use the node control.",
      },
    },
  },
  args: { node: nodeOf("button"), renderer: "BundleRender" },
  render: (args) => <CmsExample key={JSON.stringify(args)} {...args} />,
} satisfies Meta<typeof CmsExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const Primary: Story = {
  args: {
    node: {
      ...nodeOf("button"),
      metadata: { ...nodeOf("button").metadata, variant: "primary" },
    },
  },
};
export const Secondary: Story = {
  args: {
    node: {
      ...nodeOf("button"),
      metadata: { ...nodeOf("button").metadata, variant: "secondary" },
    },
  },
};
export const Text: Story = {
  args: {
    node: {
      ...nodeOf("button"),
      metadata: { ...nodeOf("button").metadata, variant: "text" },
    },
  },
};
export const Small: Story = {
  args: {
    node: {
      ...nodeOf("button"),
      metadata: { ...nodeOf("button").metadata, size: "small" },
    },
  },
};
export const Large: Story = {
  args: {
    node: {
      ...nodeOf("button"),
      metadata: { ...nodeOf("button").metadata, size: "large" },
    },
  },
};
