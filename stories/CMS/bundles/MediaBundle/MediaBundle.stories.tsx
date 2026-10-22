import type { Meta, StoryObj } from "@storybook/react-vite";
import { CmsExample } from "../../../support/CmsExample";
import { nodeOf } from "../../../support/fixtures";
const meta = {
  title: "CMS/Bundles/Media",
  component: CmsExample,
  parameters: {
    componentPath: "src/components/CMS/bundles/MediaBundle/MediaBundle.tsx",
    docs: {
      description: {
        component:
          "MediaBundle: the real CMS renderer with editable, validated JSON and document context. Open Edit example JSON in the canvas, or use the node control.",
      },
    },
  },
  args: { node: nodeOf("media"), renderer: "BundleRender" },
  render: (args) => <CmsExample key={JSON.stringify(args)} {...args} />,
} satisfies Meta<typeof CmsExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Inline: Story = {
  args: {
    node: {
      ...nodeOf("media"),
      metadata: { ...nodeOf("media").metadata, variant: "inline" },
    },
  },
};
export const Evidence: Story = {
  args: {
    node: {
      ...nodeOf("media"),
      metadata: { ...nodeOf("media").metadata, variant: "evidence" },
    },
  },
};
export const Gallery: Story = {
  args: {
    node: {
      ...nodeOf("media"),
      metadata: { ...nodeOf("media").metadata, variant: "gallery" },
    },
  },
};
export const Linked: Story = {
  args: {
    node: {
      ...nodeOf("media"),
      metadata: { ...nodeOf("media").metadata, variant: "linked" },
    },
  },
};
export const Hero: Story = {
  args: {
    node: {
      ...nodeOf("media"),
      metadata: { ...nodeOf("media").metadata, variant: "hero" },
    },
  },
};
