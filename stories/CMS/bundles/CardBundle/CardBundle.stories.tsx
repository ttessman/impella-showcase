import type { Meta, StoryObj } from "@storybook/react-vite";
import { CmsExample } from "../../../support/CmsExample";
import { nodeOf } from "../../../support/fixtures";
const meta = {
  title: "CMS/Bundles/Card",
  component: CmsExample,
  parameters: {
    componentPath: "src/components/CMS/bundles/CardBundle/CardBundle.tsx",
    docs: {
      description: {
        component:
          "CardBundle: the real CMS renderer with editable, validated JSON and document context. Open Edit example JSON in the canvas, or use the node control.",
      },
    },
  },
  args: { node: nodeOf("card"), renderer: "BundleRender" },
  render: (args) => <CmsExample key={JSON.stringify(args)} {...args} />,
} satisfies Meta<typeof CmsExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Outlined: Story = {
  args: {
    node: {
      ...nodeOf("card"),
      metadata: { ...nodeOf("card").metadata, variant: "outlined" },
    },
  },
};
export const Tinted: Story = {
  args: {
    node: {
      ...nodeOf("card"),
      metadata: { ...nodeOf("card").metadata, variant: "tinted" },
    },
  },
};
export const SourceSummary: Story = {
  args: {
    node: {
      ...nodeOf("card"),
      metadata: { ...nodeOf("card").metadata, variant: "source-summary" },
    },
  },
};
